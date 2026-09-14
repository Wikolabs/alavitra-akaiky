"""inme.one backend, conseiller spirituel.

Deux garde-fous tiennent tout le reste :
1. le modèle ne rédige jamais le texte d'un verset, il ne donne qu'une référence
   prise dans une liste fermée ; l'interface affiche ensuite le texte exact,
   récupéré une fois pour toutes depuis getbible.net (Louis Segond 1910 et
   Baiboly Malagasy 1865). Un modèle qui écrit lui-même le verset finit par en
   inventer un, ce qui est inacceptable ici.
2. la réponse est nettoyée avant d'être renvoyée : ni tiret cadratin, ni puce,
   ni titre markdown.
"""
import re
from datetime import datetime, timezone
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .llm import chat, is_configured

app = FastAPI(
    title="inme.one Backend",
    description="Compagnon spirituel, réponses ancrées dans les Écritures.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Les douze situations et les seules références que le modèle a le droit de citer.
# Cette table est la copie exacte de celle qui a servi à construire verses.json.
THEME_REFS = {
    "peur": ["Ésaïe 41:10", "Philippiens 4:6-7", "Jean 14:27", "Psaume 56:4"],
    "deuil": ["Psaume 34:19", "Matthieu 5:4", "Apocalypse 21:4", "Psaume 147:3"],
    "solitude": ["Deutéronome 31:6", "Hébreux 13:5", "Psaume 68:7"],
    "epuisement": ["Matthieu 11:28-30", "Ésaïe 40:31", "Psaume 23:1-4"],
    "argent": ["Matthieu 6:31-33", "Philippiens 4:19", "Proverbes 16:3"],
    "famille": ["1 Corinthiens 13:4-7", "Éphésiens 4:32", "Colossiens 3:13"],
    "maladie": ["Psaume 103:2-3", "Jacques 5:14-15", "Ésaïe 53:5"],
    "pardon": ["1 Jean 1:9", "Psaume 103:12", "Romains 8:1"],
    "doute": ["Marc 9:24", "Hébreux 11:1", "Jacques 1:5-6"],
    "colere": ["Éphésiens 4:26", "Proverbes 15:1", "Jacques 1:19"],
    "decision": ["Proverbes 3:5-6", "Psaume 32:8", "Jacques 1:5"],
    "gratitude": ["1 Thessaloniciens 5:16-18", "Psaume 118:24", "Néhémie 8:10"],
}
THEMES = list(THEME_REFS)
ALL_REFS = [r for refs in THEME_REFS.values() for r in refs]

_CATALOGUE = "\n".join(f"- {k} : " + " | ".join(v) for k, v in THEME_REFS.items())

_RULES = f"""
Ce que tu écris :
- Tu accueilles la personne en une phrase, tu reprends ce qu'elle porte avec ses mots, tu offres une lecture spirituelle courte, puis un geste simple pour aujourd'hui : une prière brève, un appel à passer, une chose à poser.
- Deux cents mots au maximum, en texte suivi.
- Pas d'emoji, pas de tiret cadratin, pas de puce, pas de titre, pas d'astérisque.
- Aucun conseil médical, juridique ou financier. Devant une détresse grave, tu invites doucement à parler à une personne de confiance ou à un service d'écoute, sans dramatiser.
- Tu ne promets ni guérison, ni richesse, ni miracle.
- Tu n'appelles jamais la personne par un prénom : tu ne connais pas son nom, et un mot de son message n'en est pas un.
- Tu signes Inme sur la dernière ligne du texte.

Ce que tu n'écris jamais :
- Tu ne recopies JAMAIS le texte d'un verset, même de mémoire, même approximativement. L'application affiche elle-même le texte exact.
- Tu ne cites aucune référence en dehors de la liste ci-dessous.

Tu termines par deux lignes techniques, non destinées à la personne :
THEME: une clé de la liste
REF: une référence de la même ligne que cette clé

Liste fermée, clé puis références autorisées :
{_CATALOGUE}
"""

SYSTEM_FR = f"""Tu es Inme, un compagnon spirituel chrétien. Tu écoutes d'abord, tu réponds ensuite, avec douceur et sans jamais surplomber.
{_RULES}"""

SYSTEM_MG = f"""Ianao no Inme, namana ara-panahy kristiana. Mihaino aloha ianao vao mamaly, amim-pitiavana sy fanajana, tsy mitsara mihitsy. Soraty amin'ny teny malagasy tsotra sy mazava.
{_RULES}"""

SYSTEM_EN = f"""You are Inme, a Christian spiritual companion. You listen first, then answer, gently and never from above. Write in English.
{_RULES}"""

PROMPTS = {"fr": SYSTEM_FR, "mg": SYSTEM_MG, "en": SYSTEM_EN}


class GenerateRequest(BaseModel):
    message: str
    lang: Literal["fr", "mg", "en"] = "fr"


class GenerateResponse(BaseModel):
    reply: str
    theme: Optional[str] = None
    ref: Optional[str] = None
    model: str
    generated_at: str
    static_mode: bool = False


_THEME_LINE = re.compile(r"^\s*THEME\s*:\s*([a-zé]+)\s*$", re.IGNORECASE | re.MULTILINE)
_REF_LINE = re.compile(r"^\s*REF\s*:\s*(.+?)\s*$", re.IGNORECASE | re.MULTILINE)
_BULLET = re.compile(r"^\s*[-*•]\s+", re.MULTILINE)
_HEADING = re.compile(r"^\s*#{1,6}\s*", re.MULTILINE)


def _clean(text: str) -> str:
    """Retire les marques qui trahissent une sortie de modèle."""
    text = text.replace("—", ", ").replace("–", ", ").replace(" · ", ", ")
    text = _BULLET.sub("", text)
    text = _HEADING.sub("", text)
    text = text.replace("**", "").replace("*", "")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract(text: str):
    theme = ref = None
    m = _THEME_LINE.search(text)
    if m and m.group(1).lower() in THEME_REFS:
        theme = m.group(1).lower()
    m = _REF_LINE.search(text)
    if m:
        candidate = m.group(1).strip().strip("«».\"'")
        if candidate in ALL_REFS:
            ref = candidate
    if theme and ref and ref not in THEME_REFS[theme]:
        ref = THEME_REFS[theme][0]
    if theme and not ref:
        ref = THEME_REFS[theme][0]
    body = _REF_LINE.sub("", _THEME_LINE.sub("", text))
    return _clean(body), theme, ref


@app.get("/health")
def health():
    return {"status": "ok", "service": "inme-backend", "llm_configured": is_configured()}


@app.get("/themes")
def themes():
    return {"themes": THEMES, "refs": THEME_REFS}


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    message = (req.message or "").strip()[:1500]
    if not message:
        raise HTTPException(status_code=400, detail="empty_message")

    now_iso = datetime.now(timezone.utc).isoformat()

    if not is_configured():
        reply, theme, ref = _static_reply(req.lang)
        return GenerateResponse(reply=reply, theme=theme, ref=ref, model="static", generated_at=now_iso, static_mode=True)

    try:
        text, model = await chat(
            [
                {"role": "system", "content": PROMPTS.get(req.lang, SYSTEM_FR)},
                {"role": "user", "content": message},
            ],
            max_tokens=700,
        )
    except Exception:
        reply, theme, ref = _static_reply(req.lang)
        return GenerateResponse(reply=reply, theme=theme, ref=ref, model="static", generated_at=now_iso, static_mode=True)

    reply, theme, ref = _extract(text)
    return GenerateResponse(reply=reply, theme=theme, ref=ref, model=model, generated_at=now_iso)


def _static_reply(lang: str):
    """Repli sans modèle. Le texte du verset reste affiché par l'interface."""
    if lang == "en":
        return (
            "I hear you. Whatever weighs on you right now, you are not carrying it alone.\n\n"
            "Scripture meets us where we are, before we have sorted anything out. The invitation is not to be "
            "strong first, only to come as we are.\n\n"
            "Take one slow breath. Say one word, help, or thank you, and let that be enough for today.\n\n"
            "Inme",
            "epuisement",
            "Matthieu 11:28-30",
        )
    if lang == "mg":
        return (
            "Reko ianao. Na inona na inona mavesatra aminao izao, tsy irery ianao mitondra izany.\n\n"
            "Tonga eo amin'izay misy antsika ny Soratra Masina, alohan'ny hahavitantsika mandamina na inona na inona. "
            "Tsy ilaina ny mahery aloha, fa ny manatona fotsiny.\n\n"
            "Miaina lalina indray mandeha. Lazao teny iray, vonjeo, na misaotra, dia ampy ho anio izany.\n\n"
            "Inme",
            "epuisement",
            "Matthieu 11:28-30",
        )
    return (
        "Je t'écoute. Quoi que tu portes en ce moment, tu ne le portes pas seul.\n\n"
        "L'Écriture nous rejoint là où nous sommes, avant même que nous ayons réglé quoi que ce soit. "
        "Elle ne demande pas d'être fort d'abord, seulement de venir tel qu'on est.\n\n"
        "Inspire lentement une fois. Dis un mot, aide, ou merci, et que ce soit assez pour aujourd'hui.\n\n"
        "Inme",
        "epuisement",
        "Matthieu 11:28-30",
    )
