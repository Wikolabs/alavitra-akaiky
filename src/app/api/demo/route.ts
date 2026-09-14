import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";
import versesData from "@/data/verses.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
const LANGS = ["fr", "mg", "en"] as const;
type Lang = (typeof LANGS)[number];

const EMPTY: Record<Lang, string> = {
  fr: "Ecrivez ce que vous portez, meme en une ligne.",
  mg: "Soraty izay entinao, na dia andalana iray aza.",
  en: "Write what you carry, even in one line.",
};

/* La liste fermee est construite depuis verses.json, la meme source que celle
   qui fournit le texte exact affiche a l'ecran. Le modele ne peut donc nommer
   qu'une reference que l'application sait rendre mot pour mot. */
type ThemeRow = { key: string; verses: { ref: string }[] };
const THEME_REFS: Record<string, string[]> = Object.fromEntries(
  (versesData.themes as ThemeRow[]).map((t) => [t.key, t.verses.map((v) => v.ref)])
);
const ALL_REFS = Object.values(THEME_REFS).flat();

const CATALOGUE = Object.entries(THEME_REFS)
  .map(([k, refs]) => `- ${k} : ${refs.join(" | ")}`)
  .join("\n");

const RULES = `
Ce que tu ecris :
- Tu accueilles la personne en une phrase, tu reprends ce qu'elle porte avec ses mots, tu offres une lecture spirituelle courte, puis un geste simple pour aujourd'hui : une priere breve, un appel a passer, une chose a poser.
- Deux cents mots au maximum, en texte suivi.
- Pas d'emoji, pas de tiret cadratin, pas de puce, pas de titre, pas d'asterisque.
- Aucun conseil medical, juridique ou financier. Devant une detresse grave, tu invites doucement a parler a une personne de confiance ou a un service d'ecoute, sans dramatiser.
- Tu ne promets ni guerison, ni richesse, ni miracle.
- Tu signes Inme sur la derniere ligne du texte.

Ce que tu n'ecris jamais :
- Tu ne recopies JAMAIS le texte d'un verset, meme de memoire, meme approximativement. L'application affiche elle-meme le texte exact.
- Tu ne cites aucune reference en dehors de la liste ci-dessous.

Tu termines par deux lignes techniques, non destinees a la personne :
THEME: une cle de la liste
REF: une reference de la meme ligne que cette cle

Liste fermee, cle puis references autorisees :
${CATALOGUE}
`;

const PROMPTS: Record<Lang, string> = {
  fr: `Tu es Inme, un compagnon spirituel chretien. Tu ecoutes d'abord, tu reponds ensuite, avec douceur et sans jamais surplomber.\n${RULES}`,
  mg: `Ianao no Inme, namana ara-panahy kristiana. Mihaino aloha ianao vao mamaly, amim-pitiavana sy fanajana, tsy mitsara mihitsy. Soraty amin'ny teny malagasy tsotra sy mazava.\n${RULES}`,
  en: `You are Inme, a Christian spiritual companion. You listen first, then answer, gently and never from above. Write in English.\n${RULES}`,
};

const THEME_LINE = /^\s*THEME\s*:\s*([a-zé]+)\s*$/im;
const REF_LINE = /^\s*REF\s*:\s*(.+?)\s*$/im;
const BULLET = /^\s*[-*•]\s+/gm;
const HEADING = /^\s*#{1,6}\s*/gm;

function clean(text: string): string {
  return text
    .replace(/—/g, ", ")
    .replace(/–/g, ", ")
    .replace(/ · /g, ", ")
    .replace(/‑/g, "-")
    .replace(/ /g, " ")
    .replace(BULLET, "")
    .replace(HEADING, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extract(text: string) {
  const tm = text.match(THEME_LINE);
  let theme = tm && tm[1].toLowerCase() in THEME_REFS ? tm[1].toLowerCase() : null;
  const rm = text.match(REF_LINE);
  let ref: string | null = null;
  if (rm) {
    const candidate = rm[1].trim().replace(/^[«"']+|[»"'.]+$/g, "");
    if (ALL_REFS.includes(candidate)) ref = candidate;
  }
  if (theme && ref && !THEME_REFS[theme].includes(ref)) ref = THEME_REFS[theme][0];
  if (theme && !ref) ref = THEME_REFS[theme][0];
  if (!theme && ref) theme = Object.keys(THEME_REFS).find((k) => THEME_REFS[k].includes(ref!)) ?? null;
  const body = text.replace(REF_LINE, "").replace(THEME_LINE, "");
  return { reply: clean(body), theme, ref };
}

export async function POST(req: Request) {
  let body: { message?: string; lang?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const message = (body.message || "").trim().slice(0, 1500);
  const lang: Lang = (LANGS as readonly string[]).includes(body.lang || "") ? (body.lang as Lang) : "fr";

  if (!message) return NextResponse.json({ error: EMPTY[lang] }, { status: 400 });

  // 1. Le backend FastAPI, qui porte la version de reference du prompt.
  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang }),
      cache: "no-store",
    });
    if (r.ok) {
      const j = await r.json();
      return NextResponse.json({
        reply: j.reply,
        theme: j.theme ?? null,
        ref: j.ref ?? null,
        model: j.model,
        generatedAt: j.generated_at,
        staticMode: Boolean(j.static_mode),
      });
    }
  } catch {
    // le conteneur backend ne repond pas, on continue
  }

  // 2. Repli direct sur le fournisseur, pour que la conversation tienne meme
  //    quand le conteneur backend est arrete ou en cours de redeploiement.
  if (!isConfigured()) {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }

  try {
    const { text, model } = await chat(
      [
        { role: "system", content: PROMPTS[lang] },
        { role: "user", content: message },
      ],
      700
    );
    const { reply, theme, ref } = extract(text);
    return NextResponse.json({
      reply,
      theme,
      ref,
      model,
      generatedAt: new Date().toISOString(),
      staticMode: false,
    });
  } catch {
    return NextResponse.json({ error: "no_llm_available" }, { status: 502 });
  }
}
