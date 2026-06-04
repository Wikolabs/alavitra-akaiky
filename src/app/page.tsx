"use client";

import { useState, useEffect, useRef } from "react";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  bgWarm: "#FFFBF0",
  bgCool: "#F0F8FF",
  skyLight: "#DBEAFE",
  skyBlue: "#93C5FD",
  royal: "#2563EB",
  deep: "#1E3A8A",
  gold: "#D4A574",
  goldBright: "#F59E0B",
  goldSoft: "rgba(245,158,11,0.10)",
  goldGlow: "rgba(245,158,11,0.22)",
  text: "#0F172A",
  textMuted: "#475569",
  textSoft: "#64748B",
  border: "rgba(30,58,138,0.10)",
};

const SERIF = `"Cormorant Garamond", Georgia, serif`;
const DISPLAY = `"Cinzel", "Cormorant Garamond", Georgia, serif`;

// ─── Bible verses (FR) — curated for emotional resonance ───────────────────────
const VERSES = [
  {
    ref: "Jérémie 29:11",
    text:
      "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.",
  },
  {
    ref: "Psaume 23:1, 4",
    text:
      "L'Éternel est mon berger : je ne manquerai de rien. Quand je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi.",
  },
  {
    ref: "Matthieu 11:28",
    text:
      "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.",
  },
  {
    ref: "Ésaïe 41:10",
    text:
      "Ne crains rien, car je suis avec toi ; ne promène pas des regards inquiets, car je suis ton Dieu ; je te fortifie, je viens à ton secours.",
  },
  {
    ref: "Philippiens 4:13",
    text: "Je puis tout par celui qui me fortifie.",
  },
  {
    ref: "Romains 8:28",
    text:
      "Nous savons que toutes choses concourent au bien de ceux qui aiment Dieu.",
  },
  {
    ref: "Apocalypse 21:4",
    text:
      "Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur.",
  },
  {
    ref: "Psaume 46:11",
    text: "Arrêtez, et sachez que je suis Dieu.",
  },
];

const MISSIONS = [
  { title: "Réveil", sub: "Revival", desc: "Ranimez la flamme intérieure. Que votre âme s'éveille à la promesse vivante.", icon: "flame" as const },
  { title: "Révélation", sub: "Revelation", desc: "Recevez les vérités cachées. La Parole illumine chaque pas de votre marche.", icon: "eye" as const },
  { title: "Foi", sub: "Faith", desc: "Affermissez votre confiance. La foi est l'assurance de ce qu'on espère.", icon: "heart" as const },
  { title: "Prière", sub: "Prayer", desc: "Élevez vos demandes. Toute chose, rendue grâce, trouve son chemin vers le Trône.", icon: "hands" as const },
];

const PASTORS = [
  { name: "Pasteur Daniel Solanà", title: "Sermons sur la Paix Intérieure", desc: "Voix douce et profonde, méditations sur le repos en Christ et l'abandon des fardeaux.", color: C.royal },
  { name: "Pasteure Marie-Esther", title: "Ministère pour les Mères", desc: "Enseignements pour les femmes et les jeunes mamans — courage, douceur, persévérance.", color: C.goldBright },
  { name: "Pasteur Joseph Bénédict", title: "Études Bibliques Approfondies", desc: "Exégèse rigoureuse des Écritures, livre par livre, pour ceux qui cherchent à grandir.", color: C.deep },
  { name: "Pasteur Samuel Eden", title: "Prière et Guérison", desc: "Sessions de prière collective et témoignages de restauration physique et spirituelle.", color: "#0E7490" },
  { name: "Pasteure Hannah Lumière", title: "Femmes en Christ", desc: "Identité, vocation et appel — pour les femmes qui veulent vivre pleinement leur foi.", color: "#9333EA" },
  { name: "Pasteur Élisée Mbongo", title: "Évangélisation Francophone", desc: "Messages percutants pour partager l'Évangile en français, en Afrique et en diaspora.", color: "#DC2626" },
];

function MissionIcon({ name, color }: { name: "flame" | "eye" | "heart" | "hands"; color: string }) {
  const s = 44;
  if (name === "flame") return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>);
  if (name === "eye") return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
  if (name === "heart") return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
  return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 11V6a2 2 0 0 1 4 0v5" /><path d="M14 11V6a2 2 0 0 1 4 0v5" /><path d="M6 11v3a4 4 0 0 0 8 0" /><path d="M18 11v3a4 4 0 0 1-4 4" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>);
}

function Dove({ size = 64, color = C.gold }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 8 C 38 8 42 12 42 18 C 42 22 40 25 36 27 C 44 28 52 32 56 40 C 56 44 52 48 46 48 C 42 48 40 46 38 44 C 36 48 32 50 28 50 C 18 50 10 44 8 36 C 12 38 18 36 22 32 C 18 30 14 26 14 20 C 14 14 18 8 32 8 Z" fill={color} opacity="0.85" />
      <circle cx="40" cy="18" r="1.5" fill="#fff" />
    </svg>
  );
}

function Cross({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M10 2h4v6h6v4h-6v10h-4V12H4V8h6V2z" /></svg>);
}

function PastorAvatar({ color, initial }: { color: string; initial: string }) {
  return (
    <div style={{ width: 84, height: 84, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, ${color}40 0%, ${color}20 50%, ${color}10 100%)`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: color, position: "relative", flexShrink: 0 }}>
      <span style={{ position: "relative", zIndex: 1 }}>{initial}</span>
      <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: `radial-gradient(circle, transparent 60%, ${color}15 100%)`, pointerEvents: "none" }} />
    </div>
  );
}

interface ChatMsg { role: "user" | "assistant"; content: string; }

function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Bienvenue, ami. Je suis ici pour t'écouter et t'accompagner à la lumière des Écritures. Qu'est-ce qui pèse sur ton cœur aujourd'hui ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang: "fr" }),
      });
      const j = await r.json();
      const reply = j.reply || j.brief || "Je suis ici. Reformule ta question si tu le souhaites.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "La connexion vacille un instant. Reprends ta respiration et réessaie." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(8px)", zIndex: 80, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.35s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 100vw)", background: "linear-gradient(180deg, #FFFFFF 0%, #F0F8FF 100%)", zIndex: 81, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(30,58,138,0.18)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(135deg, ${C.bgCool} 0%, #FFFFFF 100%)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Dove size={36} color={C.goldBright} />
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, letterSpacing: 1, color: C.deep }}>inme</div>
              <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: "italic", color: C.textMuted }}>Conseiller biblique</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 24, padding: 4, lineHeight: 1 }}>×</button>
        </div>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "84%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? C.royal : "rgba(255,255,255,0.92)", border: m.role === "assistant" ? `1px solid ${C.border}` : "none", color: m.role === "user" ? "#fff" : C.text, fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap", fontFamily: m.role === "assistant" ? SERIF : "inherit", boxShadow: m.role === "assistant" ? "0 4px 14px rgba(30,58,138,0.06)" : "0 4px 14px rgba(37,99,235,0.18)" }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", gap: 4, padding: "10px 16px" }}>
              {[0, 1, 2].map((i) => (<span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldBright, animation: `pulseDot 1.2s ease-in-out ${i * 0.18}s infinite` }} />))}
            </div>
          )}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ padding: 16, borderTop: `1px solid ${C.border}`, background: "#fff" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Partagez ce qui pèse sur votre cœur…" rows={2} style={{ flex: 1, resize: "none", border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", fontFamily: SERIF, fontSize: 14, lineHeight: 1.5, outline: "none", color: C.text, background: C.bgCool }} />
            <button type="submit" disabled={loading || !input.trim()} style={{ background: input.trim() ? C.goldBright : C.border, color: "#fff", border: "none", borderRadius: 12, padding: "10px 16px", fontWeight: 600, fontSize: 14, cursor: input.trim() ? "pointer" : "not-allowed", transition: "background 0.2s", flexShrink: 0 }}>↑</button>
          </div>
          <div style={{ fontSize: 10, color: C.textSoft, marginTop: 8, textAlign: "center", fontStyle: "italic" }}>inme accompagne, n'impose pas. En cas de détresse grave, contactez les services d'aide.</div>
        </form>
      </div>
    </>
  );
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [verseIdx, setVerseIdx] = useState(0);
  useEffect(() => { const id = setInterval(() => setVerseIdx((i) => (i + 1) % VERSES.length), 7000); return () => clearInterval(id); }, []);

  return (
    <main style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 50% -10%, ${C.bgCool} 0%, #FFFFFF 35%, ${C.bgWarm} 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${(i * 53) % 100}%`, top: `${100 + ((i * 17) % 30)}%`, width: 5 + (i % 3), height: 5 + (i % 3), borderRadius: "50%", background: i % 3 === 0 ? C.goldBright : i % 3 === 1 ? C.gold : C.skyBlue, opacity: 0.5, animation: `ascend ${22 + (i * 1.4)}s linear ${-(i * 1.7)}s infinite`, boxShadow: `0 0 14px ${i % 3 === 2 ? C.skyBlue : C.goldGlow}` }} />
        ))}
      </div>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Dove size={28} color={C.goldBright} />
            <span style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, letterSpacing: 2, color: C.deep }}>inme</span>
            <span style={{ fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: C.textMuted }}>.one</span>
          </a>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <a href="#mission" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Mission</a>
            <a href="#church" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Église</a>
            <a href="#verses" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Écritures</a>
            <button onClick={() => setChatOpen(true)} style={{ background: C.deep, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}><Cross size={11} />Commencer</button>
          </div>
        </div>
      </nav>

      <section style={{ position: "relative", padding: "100px 24px 80px", zIndex: 1, textAlign: "center" }}>
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: "min(680px, 100%)", height: 720, background: `radial-gradient(ellipse at 50% 0%, ${C.goldGlow} 0%, transparent 60%), radial-gradient(ellipse at 50% 0%, rgba(147,197,253,0.30) 0%, transparent 75%)`, pointerEvents: "none", opacity: 0.9, animation: "lightPulse 5.5s ease-in-out infinite" }} />
        <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", zIndex: 2 }}>
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 20, animation: "floatDove 6s ease-in-out infinite" }}><Dove size={72} color={C.goldBright} /></div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.goldSoft, border: `1px solid ${C.goldGlow}`, padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.goldBright, marginBottom: 24, fontFamily: DISPLAY }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.goldBright, animation: "pulseDot 1.6s ease-in-out infinite" }} />In Me · In You
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.6rem, 6.5vw, 5rem)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.5px", margin: "0 0 18px", color: C.deep }}>
            Trouvez la Paix.<br />
            <em style={{ fontFamily: SERIF, fontStyle: "italic", background: `linear-gradient(90deg, ${C.goldBright} 0%, ${C.royal} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 600 }}>Recevez la Lumière.</em>
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: "1.3rem", lineHeight: 1.55, color: C.textMuted, maxWidth: 640, margin: "0 auto 36px", fontStyle: "italic" }}>
            Un conseiller biblique IA et une église en ligne — disponibles 24h/24, partout. Dialoguez avec un compagnon formé sur les Écritures Saintes, écoutez les messages de la communauté, et recevez la grâce qui ne dort jamais.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <button onClick={() => setChatOpen(true)} style={{ background: `linear-gradient(135deg, ${C.goldBright} 0%, ${C.gold} 100%)`, color: "#fff", border: "none", padding: "16px 32px", borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: `0 12px 40px ${C.goldGlow}, 0 0 0 1px ${C.gold}`, transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "inherit", letterSpacing: 0.3 }}>
              <Cross size={13} /> Commencer un dialogue
            </button>
            <a href="#church" style={{ background: "#fff", color: C.deep, border: `1.5px solid ${C.border}`, padding: "15px 30px", borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>Écouter l'église en ligne →</a>
          </div>
          <div style={{ marginTop: 60, padding: "28px 32px", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 20, boxShadow: `0 20px 60px rgba(30,58,138,0.06)`, maxWidth: 640, margin: "60px auto 0", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: C.goldBright, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 100, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: DISPLAY }}>Verset du moment</div>
            <p key={verseIdx} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.25rem", lineHeight: 1.65, color: C.text, margin: 0, animation: "verseFade 0.8s ease-out" }}>« {VERSES[verseIdx].text} »</p>
            <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, letterSpacing: 2, color: C.goldBright, marginTop: 14, textTransform: "uppercase" }}>{VERSES[verseIdx].ref}</div>
          </div>
        </div>
      </section>

      <section id="mission" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.goldBright, textTransform: "uppercase", marginBottom: 12 }}>Notre Mission</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.2vw, 3.2rem)", fontWeight: 500, color: C.deep, margin: "0 0 14px", lineHeight: 1.15 }}>Quatre piliers, <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldBright }}>une seule Lumière</em>.</h2>
            <p style={{ fontFamily: SERIF, fontSize: "1.15rem", color: C.textMuted, maxWidth: 540, margin: "0 auto", fontStyle: "italic" }}>Ce sur quoi nous accompagnons celles et ceux qui cherchent.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 }}>
            {MISSIONS.map((m, i) => (
              <div key={m.title} style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 18, padding: "32px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)", position: "relative", overflow: "hidden", animation: `riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both` }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = C.goldGlow; e.currentTarget.style.boxShadow = `0 24px 60px rgba(245,158,11,0.12), 0 0 0 1px ${C.goldGlow}`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.goldBright}, ${C.royal})`, opacity: 0.7 }} />
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `radial-gradient(circle, ${C.goldSoft} 0%, transparent 70%)`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MissionIcon name={m.icon} color={C.goldBright} />
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textSoft, textTransform: "uppercase", marginBottom: 6 }}>{m.sub}</div>
                <h3 style={{ fontFamily: DISPLAY, fontSize: "1.65rem", fontWeight: 600, color: C.deep, margin: "0 0 12px" }}>{m.title}</h3>
                <p style={{ fontFamily: SERIF, fontSize: "0.98rem", lineHeight: 1.65, color: C.textMuted, margin: 0, fontStyle: "italic" }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="verses" style={{ padding: "80px 24px", position: "relative", zIndex: 1, background: `linear-gradient(180deg, transparent 0%, ${C.bgCool} 50%, transparent 100%)` }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.goldBright, textTransform: "uppercase", marginBottom: 12 }}>Les Écritures</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.2vw, 3.2rem)", fontWeight: 500, color: C.deep, margin: "0 0 14px", lineHeight: 1.15 }}>La Parole qui <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldBright }}>console</em>, qui guide, qui relève.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {VERSES.slice(0, 6).map((v, i) => (
              <div key={v.ref} style={{ display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "center", gap: 32, padding: "32px 36px", background: "rgba(255,255,255,0.82)", backdropFilter: "blur(10px)", border: `1px solid ${C.border}`, borderRadius: 20, boxShadow: "0 12px 40px rgba(30,58,138,0.05)", animation: `floatGentle ${6 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}>
                <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", background: `radial-gradient(circle, ${i % 2 === 0 ? C.goldSoft : "rgba(147,197,253,0.20)"} 0%, transparent 70%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: i % 2 === 0 ? C.goldBright : C.royal }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.18rem", lineHeight: 1.6, color: C.text, margin: "0 0 10px" }}>« {v.text} »</p>
                  <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: i % 2 === 0 ? C.goldBright : C.royal, textTransform: "uppercase" }}>— {v.ref}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="church" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.goldBright, textTransform: "uppercase", marginBottom: 12 }}>Notre Église en Ligne</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.2vw, 3.2rem)", fontWeight: 500, color: C.deep, margin: "0 0 14px", lineHeight: 1.15 }}>Une communauté de <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldBright }}>messagers</em>.</h2>
            <p style={{ fontFamily: SERIF, fontSize: "1.15rem", color: C.textMuted, maxWidth: 580, margin: "0 auto", fontStyle: "italic" }}>Pasteurs et enseignants partagent la Parole en ligne. Choisissez la voix qui vous parle aujourd'hui.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}>
            {PASTORS.map((p, i) => (
              <div key={p.name} style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", border: `1px solid ${C.border}`, borderRadius: 18, padding: 24, cursor: "pointer", transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)", display: "flex", flexDirection: "column", gap: 16, animation: `riseIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both` }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = p.color + "40"; e.currentTarget.style.boxShadow = `0 20px 50px ${p.color}18`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <PastorAvatar color={p.color} initial={p.name.split(" ")[1]?.[0] || p.name[0]} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: "1.05rem", fontWeight: 600, color: C.deep, marginBottom: 4, lineHeight: 1.2 }}>{p.name}</div>
                    <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: "italic", color: p.color, fontWeight: 600 }}>{p.title}</div>
                  </div>
                </div>
                <p style={{ fontFamily: SERIF, fontSize: "0.95rem", lineHeight: 1.6, color: C.textMuted, margin: 0, flex: 1 }}>{p.desc}</p>
                <button style={{ background: "transparent", color: p.color, border: `1.5px solid ${p.color}40`, padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }} onMouseEnter={(e) => { e.currentTarget.style.background = p.color; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.color; }}>▶ Écouter le message</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "60px 40px", background: `linear-gradient(135deg, ${C.deep} 0%, ${C.royal} 100%)`, borderRadius: 28, textAlign: "center", position: "relative", overflow: "hidden", boxShadow: `0 40px 100px rgba(30,58,138,0.25)` }}>
          <div style={{ position: "absolute", top: "-50%", left: "50%", width: "60%", height: "200%", background: `radial-gradient(ellipse at 50% 0%, ${C.goldGlow} 0%, transparent 65%)`, transform: "translateX(-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Dove size={56} color={C.goldBright} />
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 500, color: "#fff", margin: "16px 0 14px", lineHeight: 1.2 }}>Le moment juste,<br /><em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldBright, fontWeight: 600 }}>c'est maintenant.</em></h2>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.15rem", color: "rgba(255,255,255,0.86)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.6 }}>Que ce soit l'aube ou minuit, votre conseiller spirituel est là. Posez votre fardeau, recevez la lumière.</p>
            <button onClick={() => setChatOpen(true)} style={{ background: "#fff", color: C.deep, border: "none", padding: "16px 36px", borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 10, letterSpacing: 0.3, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}><Cross size={14} color={C.deep} /> Commencer le dialogue</button>
          </div>
        </div>
      </section>

      <footer style={{ padding: "50px 24px 30px", borderTop: `1px solid ${C.border}`, background: "rgba(248,250,252,0.6)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Dove size={26} color={C.goldBright} />
            <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, letterSpacing: 1.5, color: C.deep }}>inme<span style={{ color: C.goldBright }}>.</span>one</span>
          </div>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "0.95rem", color: C.textMuted, maxWidth: 480, margin: "0 auto 18px" }}>« Voici, je me tiens à la porte, et je frappe. Si quelqu'un entend ma voix et ouvre la porte, j'entrerai. »<br /><span style={{ color: C.goldBright, fontFamily: DISPLAY, fontSize: 11, fontStyle: "normal", letterSpacing: 2, fontWeight: 600 }}>Apocalypse 3:20</span></p>
          <p style={{ fontSize: 12, color: C.textSoft, margin: 0 }}>© {new Date().getFullYear()} inme.one — In Me, In You. Un compagnon spirituel disponible 24h/24.</p>
        </div>
      </footer>

      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} aria-label="Ouvrir le conseiller biblique" style={{ position: "fixed", bottom: 30, right: 30, width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${C.goldBright} 0%, ${C.gold} 100%)`, border: "none", cursor: "pointer", boxShadow: `0 16px 40px ${C.goldGlow}, 0 0 0 6px rgba(245,158,11,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, animation: "haloRing 2.6s ease-in-out infinite" }}>
          <Cross size={22} color="#fff" />
        </button>
      )}

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />

      <style>{`
        @keyframes ascend {
          0%   { transform: translateY(0)     scale(0.7); opacity: 0; }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.5; }
          100% { transform: translateY(-130vh) scale(1.1); opacity: 0; }
        }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.6); } }
        @keyframes floatDove { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes lightPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes verseFade { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes riseIn { 0% { opacity: 0; transform: translateY(28px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes floatGentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes haloRing { 0%, 100% { box-shadow: 0 16px 40px ${C.goldGlow}, 0 0 0 0 rgba(245,158,11,0.30); } 50% { box-shadow: 0 16px 40px ${C.goldGlow}, 0 0 0 14px rgba(245,158,11,0); } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
      `}</style>
    </main>
  );
}
