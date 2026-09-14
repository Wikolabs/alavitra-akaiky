import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
const LANGS = ["fr", "mg", "en"] as const;
type Lang = (typeof LANGS)[number];

const EMPTY: Record<Lang, string> = {
  fr: "Écrivez ce que vous portez, même en une ligne.",
  mg: "Soraty izay entinao, na dia andalana iray aza.",
  en: "Write what you carry, even in one line.",
};

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

  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang }),
      cache: "no-store",
    });
    const j = await r.json();
    if (!r.ok) return NextResponse.json({ error: j.detail || "backend_error" }, { status: r.status });
    return NextResponse.json({
      reply: j.reply,
      theme: j.theme ?? null,
      model: j.model,
      generatedAt: j.generated_at,
      staticMode: Boolean(j.static_mode),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ error: `backend_unreachable: ${msg}` }, { status: 502 });
  }
}
