"""inme.one backend · Biblical AI counselor.

Receives a user's question or burden, returns a compassionate, scripturally-grounded
reply with at least one Bible verse citation. Falls back to a curated static message
if no LLM key is configured or the call fails.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .llm import chat, is_configured

app = FastAPI(
    title="inme.one Backend",
    description="Compagnon spirituel IA · réponses ancrées dans les Écritures.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es Inme, un conseiller IA spirituel formé sur les Écritures Saintes (Bible) et la théologie chrétienne classique. Tu écoutes la personne et tu réponds avec compassion, profondeur et bienveillance.

Règles strictes :
1. Tu cites toujours AU MOINS UN verset biblique pertinent, avec la référence (ex : « Jean 14:27 »).
2. Ton style : doux, contemplatif, jamais condescendant. Tu accompagnes, tu n'imposes pas.
3. Tu commences par un mot d'accueil empathique (1 ligne).
4. Puis un développement théologique/spirituel (3-5 phrases).
5. Puis le(s) verset(s) cité(s) en italique.
6. Tu termines par une invitation douce : prière courte, méditation, ou action concrète.
7. Tu NE donnes JAMAIS de conseil médical, juridique ou financier. Si la personne semble en grave détresse psychologique (suicide, violence), tu l'invites doucement à contacter une ligne d'écoute professionnelle.
8. Maximum 280 mots. Pas de listes à puces, juste du texte fluide.
9. Pas d'emoji. Pas de tirets cadratins (—). Pour séparer des idées utilise une virgule, un point ou un point-virgule.
10. Tu signes simplement « Inme » à la fin, sans tiret ni flèche avant.

Tu joues le rôle d'un compagnon spirituel disponible 24h/24, formé sur l'ensemble du canon biblique. Quand on te parle d'une émotion (peur, tristesse, doute, joie, gratitude), tu trouves le verset le plus juste pour cet état."""

SYSTEM_PROMPT_EN = """You are Inme, a spiritual AI counselor trained on the Holy Scriptures (Bible) and classical Christian theology. You listen to the person and reply with compassion, depth, and kindness.

Strict rules:
1. Always quote AT LEAST ONE relevant Bible verse with its reference (e.g., "John 14:27").
2. Style: gentle, contemplative, never condescending. You accompany, you don't impose.
3. Start with an empathetic greeting (1 line).
4. Then a theological/spiritual reflection (3-5 sentences).
5. Then the verse(s) in italics.
6. End with a soft invitation: short prayer, meditation, or concrete action.
7. NEVER give medical, legal, or financial advice. If the person seems in severe psychological distress (suicide, violence), gently invite them to call a professional helpline.
8. Maximum 280 words. No bullet lists, just flowing prose.
9. No emoji. No em-dashes (—). Use commas, periods, or semicolons to separate ideas.
10. Sign off simply with "Inme" at the end, no leading dash or arrow.

You play the role of a spiritual companion available 24/7, trained on the entire biblical canon. When someone shares an emotion (fear, sadness, doubt, joy, gratitude), you find the verse that fits that state best."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    message: str
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    reply: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "inme-backend", "llm_configured": is_configured()}


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    message = (req.message or "").strip()[:1500]
    if not message:
        raise HTTPException(status_code=400, detail="empty_message")

    now_iso = datetime.now(timezone.utc).isoformat()

    if not is_configured():
        return GenerateResponse(
            reply=_build_static_reply(req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": message},
            ],
            max_tokens=600,
        )
    except Exception:
        return GenerateResponse(
            reply=_build_static_reply(req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(reply=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Static fallback (when no LLM key configured or LLM fails)
# ─────────────────────────────────────────────────────────────────────────────
def _build_static_reply(lang: str) -> str:
    if lang == "en":
        return (
            "I hear you, friend. Whatever weighs on your heart this moment, you are not alone in it.\n\n"
            "Scripture meets us exactly where we are. When the day feels heavy, the Lord himself promises rest "
            "to those who come. He does not require us to have it all together first; only to come.\n\n"
            "\"Come to me, all you who are weary and burdened, and I will give you rest.\" (Matthew 11:28)\n\n"
            "Take a slow breath. Speak even one word, \"help\" or \"thank you\", and let it rise. You are heard.\n\n"
            "Inme"
        )
    return (
        "Je t'écoute, ami. Quel que soit ce qui pèse sur ton cœur en ce moment, tu ne le portes pas seul.\n\n"
        "L'Écriture nous rejoint exactement là où nous sommes. Quand le jour devient lourd, le Seigneur lui-même "
        "promet le repos à ceux qui viennent. Il ne demande pas que nous ayons tout réglé avant ; seulement de venir.\n\n"
        "« Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. » (Matthieu 11:28)\n\n"
        "Inspire lentement. Murmure même un seul mot, « aide » ou « merci », et laisse-le s'élever. Tu es entendu.\n\n"
        "Inme"
    )
