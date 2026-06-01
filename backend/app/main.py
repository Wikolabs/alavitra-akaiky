"""PulseScope demo backend — production-ready POC.

In production: this service would also schedule scrapes, enrich with vector
search over historical signals, and push briefs to Slack via OAuth.
For the demo: it only invokes the LLM and returns the brief.
"""
from datetime import datetime, timezone
from typing import List, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="PulseScope Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
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
SYSTEM_PROMPT_FR = """Tu es PulseScope, un agent IA de veille marche pour dirigeants B2B. Tu produis un briefing executif quotidien sur les concurrents d'un utilisateur, dans le style des messages Slack de comite strategique : structure, factuel, actionnable.

Format de sortie exact en MARKDOWN :
**🎯 Faits du jour**
- [3-4 puces, chaque puce mentionne un concurrent et une nouvelle observable (levee, lancement, recrutement strategique, partenariat...)]

**🧠 Insights cles**
- [2-3 puces interpretant les faits, lien de cause a effet, signaux faibles]

**⚡ Actions recommandees**
- [2-3 puces concretes, verbe d'action, equipe destinataire entre crochets]

Tu DOIS inventer des faits realistes pour la demo (pas de "je n'ai pas access internet"). Tu joues le role d'un analyste senior qui a fait son scan ce matin. Reste sobre, evite l'enthousiasme commercial. Maximum 350 mots."""

SYSTEM_PROMPT_EN = """You are PulseScope, an AI market intelligence agent for B2B executives. You produce a daily executive briefing on the user's competitors, in the style of strategy committee Slack messages: structured, factual, actionable.

Exact MARKDOWN output format:
**🎯 Today's facts**
- [3-4 bullets, each mentions a competitor and an observable news (raise, launch, strategic hire, partnership...)]

**🧠 Key insights**
- [2-3 bullets interpreting the facts, causality, weak signals]

**⚡ Recommended actions**
- [2-3 concrete bullets, action verb, target team in brackets]

You MUST invent realistic facts for the demo (no "I have no internet access"). You're playing a senior analyst who ran the scan this morning. Stay sober, avoid commercial enthusiasm. Maximum 350 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    competitors: List[str] = Field(..., min_length=1, max_length=5)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "pulsescope-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    competitors = [c.strip() for c in req.competitors if c.strip()][:5]
    if not competitors:
        raise HTTPException(status_code=400, detail="empty_competitors")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        f"Concurrents a surveiller aujourd'hui : {', '.join(competitors)}. Genere le briefing executif du jour."
        if req.lang == "fr"
        else f"Today's competitors to monitor: {', '.join(competitors)}. Generate today's executive briefing."
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(competitors, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception as e:
        # Graceful fallback to static brief if LLM all fails
        return GenerateResponse(
            brief=_build_mock_brief(competitors, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(competitors: List[str], lang: str) -> str:
    c1 = competitors[0] if len(competitors) > 0 else "ConcurrentA"
    c2 = competitors[1] if len(competitors) > 1 else "ConcurrentB"
    c3 = competitors[2] if len(competitors) > 2 else "ConcurrentC"

    if lang == "en":
        return (
            f"**🎯 Today's facts**\n"
            f"- {c1} announced a $14M Series A led by a Tier-1 European fund. Roadmap shifts to enterprise mid-market.\n"
            f"- {c2} launched a public API yesterday. 3 new integrations live (Slack, Notion, Linear).\n"
            f"- {c3} hired a former VP Sales from a leading competitor. Strong sales push expected H2.\n\n"
            f"**🧠 Key insights**\n"
            f"- The combined {c1} raise + {c2} API launch signals the segment moving from product-led to platform-led.\n"
            f"- {c3}'s hire pattern matches their last 2 enterprise pushes — territory expansion in DACH likely.\n\n"
            f"**⚡ Recommended actions**\n"
            f"- Accelerate own enterprise tier release — feature parity check vs {c1} this week [Product]\n"
            f"- Audit API surface and write competitive doc vs {c2} [Engineering]\n"
            f"- Brief sales on {c3} talk track — anticipate procurement comparisons [Sales]"
        )
    return (
        f"**🎯 Faits du jour**\n"
        f"- {c1} a leve 12M EUR en Serie A menee par un fonds europeen Tier-1. Roadmap recentree sur l'entreprise mid-market.\n"
        f"- {c2} a lance une API publique hier. 3 nouvelles integrations live (Slack, Notion, Linear).\n"
        f"- {c3} recrute un ex-VP Sales d'un concurrent majeur. Forte poussee commerciale attendue H2.\n\n"
        f"**🧠 Insights cles**\n"
        f"- La combinaison levee de {c1} + lancement API {c2} indique que le segment passe d'un modele product-led a platform-led.\n"
        f"- Le pattern de recrutement de {c3} colle a leur 2 derniers pushes enterprise — extension DACH probable.\n\n"
        f"**⚡ Actions recommandees**\n"
        f"- Accelerer la sortie du tier enterprise — verif parite features vs {c1} cette semaine [Produit]\n"
        f"- Auditer la surface API et rediger un comparatif vs {c2} [Engineering]\n"
        f"- Briefer sales sur {c3} — anticiper les comparaisons en achat [Commercial]"
    )
