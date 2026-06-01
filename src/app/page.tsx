"use client";
import { useState } from "react";

const P = {
  name: "AlavitraAkaiky",
  waPhone: "261386626100",
  palette: {
    mode: "dark" as "dark" | "light",
    bg: "#0F1428",
    bg2: "#161D34",
    surface: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.10)",
    txt1: "#F0EAE0",
    txt2: "#B0A48C",
    txt3: "#6F6450",
    accent: "#D4AF37",
    accentSoft: "rgba(212,175,55,0.12)",
    accentBorder: "rgba(212,175,55,0.30)",
    accentGlow: "rgba(212,175,55,0.18)",
    navBg: "rgba(15,20,40,0.82)",
  },
  content: {
    fr: {
      langLabel: "FR",
      tagLabel: "Plateforme pastorale en ligne · Confession · Sermons · Fotom-bavaka",
      taglines: ["Lavitra fa akaiky.", "Tafiditra ny fivavahana.", "Eo akaikinao foana ny Tompo."],
      taglineAccentIdx: 1,
      desc: "AlavitraAkaiky permet aux pasteurs et pretres d'accompagner spirituellement les personnes ne pouvant se rendre a l'eglise — maladie, mobilite reduite, expatriation, prison, isolement. Confession, sermons, fotom-bavaka en ligne, en toute confidentialite.",
      navLinks: [
        { label: "Services", href: "#features" },
        { label: "Comment ca marche", href: "#process" },
        { label: "Pourquoi maintenant", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "24/7", label: "ouvert" },
        { value: "🔒", label: "confidentiel" },
        { value: "FR/MG", label: "bilingue" },
        { value: "Online", label: "video + audio" },
      ],
      features: [
        { icon: "🙏", title: "Confession et accompagnement", desc: "Video confidentielle 1-1 avec un pasteur ou pretre verifie. Chiffrement bout-en-bout, aucun stockage de contenu." },
        { icon: "📖", title: "Sermons et toritény", desc: "Sermons en direct ou en replay. Plusieurs denominations, multilingue (francais, malagasy, anglais). Calendrier hebdomadaire." },
        { icon: "💫", title: "Fotom-bavaka collectif", desc: "Sessions de priere collectives en visio, demandes de priere, intentions partagees avec la communaute pastorale." },
      ],
      steps: [
        { num: "01", title: "Choisissez votre besoin", desc: "Confession, sermon en live, priere collective, accompagnement personnel — vous decidez selon votre moment." },
        { num: "02", title: "Selectionnez un pasteur/pretre", desc: "Profils verifies par leur diocese ou denomination, langues parlees affichees, creneaux disponibles en temps reel." },
        { num: "03", title: "Connectez-vous en video", desc: "Plateforme securisee, chiffrement bout-en-bout. Pas de stockage de contenu. Confidentialite totale." },
      ],
      persuasion: {
        sectionTag: "Pourquoi maintenant",
        title: "L'eloignement physique ne doit pas etre un eloignement spirituel.",
        paragraphs: [
          { type: "pathos", text: "Mardi soir, hopital Toamasina. Vous etes alitee depuis trois semaines apres l'AVC. Vos enfants travaillent a Tana. Votre paroisse est a 200 km. Dimanche, la messe va passer sans vous pour la sixieme fois. Le pretre que vous connaissez depuis 40 ans ne peut pas venir. Vous voulez vous confesser avant la chimio. Vous voulez entendre une homelie qui vous parle, pas celle de la TV nationale. Vous voulez prier avec d'autres, pas seule dans le silence d'une chambre d'hopital. Vous priez pour qu'on vous comprenne, vous." },
          { type: "logos", text: "Selon le diocese d'Antananarivo (2024), 18% des paroissiens malgaches ont declare avoir manque la messe plus de 6 mois consecutifs pour cause de maladie, mobilite reduite ou eloignement. La diaspora malgache (estimation INSEE 2025) compte 180 000 personnes, dont 67% disent regretter l'absence d'accompagnement pastoral dans leur langue et tradition. La technologie video securisee existe depuis 2020. Personne ne l'a encore mise au service des fideles isoles avec respect du sacrement et de la confidentialite." },
          { type: "ethos", text: "AlavitraAkaiky est ne d'un constat personnel. La famille de notre fondateur a vecu cette douleur en 2024 — une grand-mere alitee en province qui n'a pas vu son pretre pendant six mois. Wikolabs construit des plateformes IA en production depuis 2023. Nous avons co-concu ce projet avec des pasteurs FJKM, des pretres catholiques et des representants de plusieurs denominations, qui ont valide l'approche theologique et technique. Aucun contenu n'est stocke. Aucune donnee n'est revendue. Aucun algorithme ne lit vos prieres." },
          { type: "solution", text: "Concretement : vous creez votre profil en 5 minutes (gratuit), vous choisissez votre service (confession, sermon, priere collective, accompagnement), vous selectionnez un pasteur ou pretre verifie qui parle votre langue, vous reservez un creneau, vous vous connectez en video securisee depuis votre lit, votre prison, votre exil ou votre isolement. Le sacrement est preserve. La confidentialite est totale. La presence pastorale est reelle. Lavitra fa akaiky — loin mais proche." },
        ],
      },
      ctaTitle: "Lavitra fa akaiky. Toujours present.",
      ctaDesc: "Plateforme securisee. Pasteurs et pretres verifies. Disponible 24/7 en francais, malagasy, anglais.",
      ctaPrimary: "Reserver un appel",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Demander une demo",
      ctaSoonBadge: "Bientot",
      footerTagline: "Plateforme pastorale online — confession, sermons, fotom-bavaka",
    },
    en: {
      langLabel: "EN",
      tagLabel: "Online pastoral platform · Confession · Sermons · Group prayer",
      taglines: ["Far yet close.", "Spiritually present.", "The Lord remains near."],
      taglineAccentIdx: 1,
      desc: "AlavitraAkaiky lets pastors and priests provide spiritual accompaniment to those who cannot attend church — illness, reduced mobility, expatriation, prison, isolation. Confession, sermons, group prayer online, fully confidential.",
      navLinks: [
        { label: "Services", href: "#features" },
        { label: "How it works", href: "#process" },
        { label: "Why now", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "24/7", label: "open" },
        { value: "🔒", label: "confidential" },
        { value: "FR/MG/EN", label: "trilingual" },
        { value: "Online", label: "video + audio" },
      ],
      features: [
        { icon: "🙏", title: "Confession & accompaniment", desc: "Confidential 1-1 video with a verified pastor or priest. End-to-end encryption, no content stored." },
        { icon: "📖", title: "Sermons & teachings", desc: "Live sermons and replays. Multiple denominations, multilingual (French, Malagasy, English). Weekly calendar." },
        { icon: "💫", title: "Group prayer", desc: "Group prayer video sessions, prayer requests, shared intentions with the pastoral community." },
      ],
      steps: [
        { num: "01", title: "Choose your service", desc: "Confession, live sermon, group prayer, personal accompaniment — you decide what fits your moment." },
        { num: "02", title: "Select a pastor or priest", desc: "Profiles verified by their diocese or denomination, languages spoken, real-time available slots." },
        { num: "03", title: "Connect via video", desc: "Secure platform, end-to-end encryption. No content storage. Total confidentiality." },
      ],
      persuasion: {
        sectionTag: "Why now",
        title: "Physical distance should not mean spiritual distance.",
        paragraphs: [
          { type: "pathos", text: "Tuesday evening, hospital in Toamasina. You've been bedridden for three weeks after a stroke. Your children work in Tana. Your parish is 200 km away. Sunday, mass will pass without you for the sixth time. The priest you've known for 40 years cannot come. You want to confess before chemo. You want to hear a homily that speaks to you, not the one from national TV. You want to pray with others, not alone in the silence of a hospital room. You pray to be understood — as you are." },
          { type: "logos", text: "According to the Antananarivo diocese (2024), 18% of Malagasy parishioners reported missing mass for more than 6 consecutive months due to illness, reduced mobility, or distance. The Malagasy diaspora (INSEE 2025 estimate) counts 180,000 people, 67% of whom say they miss pastoral accompaniment in their language and tradition. Secure video technology has existed since 2020. No one has yet built it for isolated faithful with respect for the sacrament and confidentiality." },
          { type: "ethos", text: "AlavitraAkaiky was born from a personal observation. Our founder's family lived this pain in 2024 — a bedridden grandmother in the provinces who hadn't seen her priest for six months. Wikolabs has been building production AI platforms since 2023. We co-designed this project with FJKM pastors, Catholic priests, and representatives of several denominations, who validated the theological and technical approach. No content is stored. No data is sold. No algorithm reads your prayers." },
          { type: "solution", text: "Concretely: you create your profile in 5 minutes (free), you choose your service (confession, sermon, group prayer, accompaniment), you select a verified pastor or priest who speaks your language, you book a slot, you connect via secure video from your bed, your prison, your exile, or your isolation. The sacrament is preserved. Confidentiality is total. Pastoral presence is real. Lavitra fa akaiky — far yet close." },
        ],
      },
      ctaTitle: "Far yet close. Always present.",
      ctaDesc: "Secure platform. Verified pastors and priests. Available 24/7 in French, Malagasy, English.",
      ctaPrimary: "Book a call",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Request a demo",
      ctaSoonBadge: "Soon",
      footerTagline: "Online pastoral platform — confession, sermons, group prayer",
    },
  },
};

export default function Page() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = P.content[lang];
  const pal = P.palette;
  const isDark = pal.mode === "dark";
  const cardOverlayHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";

  const waLink = `https://wa.me/${P.waPhone}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaite discuter de ${P.name} avec Wikolabs.`
      : `Hello, I'd like to discuss ${P.name} with Wikolabs.`
  )}`;

  return (
    <div style={{ minHeight: "100vh", background: pal.bg, color: pal.txt1 }}>
      <div className="wk-bg-fx" aria-hidden="true" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 20% 30%, ${pal.accentSoft}, transparent 60%),
          radial-gradient(ellipse 50% 50% at 80% 70%, ${pal.accentGlow}, transparent 65%),
          radial-gradient(ellipse 40% 30% at 50% 95%, ${pal.accentSoft}, transparent 60%)
        `,
      }} />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes wkBgShift { 0% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-2%, 1.5%, 0) rotate(180deg); } 100% { transform: translate3d(0,0,0) rotate(360deg); } }
        .wk-bg-fx { position: fixed; inset: -10%; pointer-events: none; z-index: 0; opacity: .55; will-change: transform; animation: wkBgShift 38s linear infinite; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: ${cardOverlayHover} !important; border-color: ${pal.accentBorder} !important; transform: translateY(-6px); }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.92; transform:translateY(-2px); box-shadow:0 12px 32px ${pal.accentGlow}; }
        .wk-btn-wa { transition: opacity .2s, transform .2s; }
        .wk-btn-wa:hover { opacity:.92; transform:translateY(-2px); }
        .wk-btn-demo { opacity:.78; transition: opacity .2s, transform .2s, background .2s; }
        .wk-btn-demo:hover { opacity:1; transform:translateY(-2px); background:${pal.accentSoft}!important; }
        .wk-nav-link { color:${pal.txt2}; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
        .wk-nav-link:hover { color:${pal.txt1}; }
        .wk-lang { display:inline-flex; border:1px solid ${pal.border}; border-radius:100px; padding:2px; background:${pal.surface}; }
        .wk-lang button { background:transparent; border:none; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:100px; color:${pal.txt2}; transition: background .2s, color .2s; font-family:inherit; }
        .wk-lang button.active { background:${pal.accent}; color:${isDark ? "#04080F" : "#FFFFFF"}; }
        @media(max-width:768px){
          .wk-hide-sm{ display:none!important; }
          .wk-hero-title{ font-size:2.4rem!important; }
          .wk-section{ padding-left:20px!important; padding-right:20px!important; }
          .wk-cards-grid{ grid-template-columns: 1fr !important; max-width:380px; margin-left:auto; margin-right:auto; }
          .wk-metrics-row{ justify-content:center; }
          .wk-cta-row{ flex-direction:column; align-items:stretch; max-width:340px; margin-left:auto; margin-right:auto; }
          .wk-cta-row > *{ width:100%; justify-content:center; }
          .wk-persuasion{ padding:60px 20px!important; }
          .wk-foot{ flex-direction:column; gap:12px; text-align:center; }
        }
      `}</style>

      <nav className="wk-section" style={{ position:"sticky", top:0, zIndex:100, background:pal.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${pal.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:pal.txt1 }}>
          {P.name}<span style={{ color:pal.accent }}>.</span>
        </span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <div className="wk-hide-sm" style={{ display:"flex", gap:22 }}>
            {t.navLinks.map(l => <a key={l.label} href={l.href} className="wk-nav-link">{l.label}</a>)}
          </div>
          <div className="wk-lang" role="group" aria-label="language">
            <button type="button" className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>FR</button>
            <button type="button" className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
            style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
            {t.ctaPrimary} →
          </button>
        </div>
      </nav>

      <section className="wk-section" style={{ padding:"100px 40px 80px", maxWidth:1040, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:720, height:600, background:`radial-gradient(ellipse at 50% 30%, ${pal.accentGlow} 0%, transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:100, padding:"6px 18px", animation:"fadeUp .5s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:pal.accent, display:"inline-block", animation:"pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color:pal.accent, fontSize:11.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{t.tagLabel}</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28, fontFamily:"'Instrument Serif',Georgia,serif", animation:"fadeUp .5s .08s ease both" }}>
          {t.taglines.map((line, i) => (
            <span key={i} style={{ display:"block", color:i===t.taglineAccentIdx?pal.accent:pal.txt1, fontStyle:i===t.taglineAccentIdx?"italic":"normal" }}>{line}</span>
          ))}
        </h1>
        <p style={{ fontSize:"1.1rem", color:pal.txt2, lineHeight:1.72, maxWidth:600, margin:"0 auto 44px", animation:"fadeUp .5s .16s ease both" }}>{t.desc}</p>
        <div className="wk-metrics-row" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:14, marginBottom:44, animation:"fadeUp .5s .24s ease both" }}>
          {t.metrics.map(m => (
            <div key={m.label} style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"14px 22px", textAlign:"center", minWidth:118 }}>
              <div style={{ fontSize:"1.7rem", fontWeight:800, color:pal.txt1, letterSpacing:"-1.5px", lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:"0.62rem", color:pal.txt3, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:5 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
      </section>

      <section id="features" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"3 Services":"3 Services"} title={lang==="fr"?"Pour accompagner <em>chacun</em>":"To accompany <em>everyone</em>"} />
        <div className="wk-cards-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {t.features.map((f) => (
            <div key={f.title} className="wk-card" style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:20, padding:"28px 28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, opacity:.55 }} />
              <div style={{ fontSize:"2rem", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:pal.txt1, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:"0.88rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="wk-section" style={{ padding:"80px 40px", background:pal.bg2 }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionHead pal={pal} tag={lang==="fr"?"Comment ca marche":"How it works"} title={lang==="fr"?"Connecte en <em>5 minutes</em>":"Connect in <em>5 minutes</em>"} />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {t.steps.map((s) => (
              <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:22, background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"22px 26px" }}>
                <div style={{ flexShrink:0, width:46, height:46, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:pal.accent, fontWeight:800, fontSize:15 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:700, color:pal.txt1, marginBottom:6, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontSize:"0.87rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="wk-persuasion wk-section" style={{ padding:"100px 40px", maxWidth:860, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={t.persuasion.sectionTag} title={t.persuasion.title} />
        <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
          {t.persuasion.paragraphs.map((p, i) => {
            const labelMap: Record<string, { fr: string; en: string }> = {
              pathos:   { fr: "L'enjeu humain",  en: "What's at stake" },
              logos:    { fr: "Les faits",       en: "The facts" },
              ethos:    { fr: "Notre legitimite", en: "Our credibility" },
              solution: { fr: "Notre reponse",   en: "Our answer" },
            };
            const label = labelMap[p.type]?.[lang] ?? "";
            return (
              <div key={i} style={{ borderLeft:`2px solid ${pal.accentBorder}`, paddingLeft:22 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:pal.accent, marginBottom:10 }}>{label}</div>
                <p style={{ fontSize:"1.02rem", color:pal.txt2, lineHeight:1.85, margin:0 }}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="cta" className="wk-section" style={{ padding:"0 40px 100px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ background:pal.surface, border:`1px solid ${pal.accentBorder}`, borderRadius:24, padding:"64px 48px", textAlign:"center", backgroundImage:`radial-gradient(ellipse at 50% 0%, ${pal.accentSoft} 0%, transparent 65%)` }}>
          <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>{lang==="fr"?"Demarrer":"Get started"}</p>
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, marginBottom:14, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif" }}>{t.ctaTitle}</h2>
          <p style={{ color:pal.txt2, fontSize:"1rem", marginBottom:36, lineHeight:1.7, maxWidth:540, margin:"0 auto 36px" }}>{t.ctaDesc}</p>
          <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
        </div>
      </section>

      <footer className="wk-section" style={{ borderTop:`1px solid ${pal.border}`, padding:"32px 40px" }}>
        <div className="wk-foot" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:pal.txt1 }}>{P.name}</span><span style={{ color:pal.accent }}>.</span>
            <span style={{ display:"block", fontSize:12, color:pal.txt3, marginTop:3 }}>{t.footerTagline}</span>
          </div>
          <p style={{ fontSize:13, color:pal.txt3, margin:0 }}>© 2026 {P.name} — {lang==="fr"?"Un produit":"A product by"} <a href="https://wikolabs.com" style={{ color:pal.txt2, textDecoration:"none" }}>Wikolabs</a></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:13, alignItems:"center" }}>
            <a href="mailto:team@wikolabs.com" style={{ color:pal.txt3, textDecoration:"none" }}>team@wikolabs.com</a>
            <span style={{ color:pal.txt3 }}>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' style={{ background:"none", border:"none", color:pal.txt3, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0 }}>{t.ctaPrimary}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ pal, tag, title }: { pal: typeof P.palette; tag: string; title: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>{tag}</p>
      <h2
        style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif", lineHeight:1.15, margin:0 }}
        dangerouslySetInnerHTML={{ __html: title.replace(/<em>/g, `<em style="font-style:italic;color:${pal.accent}">`) }}
      />
    </div>
  );
}

function CtaRow({ t, pal, isDark, waLink }: { t: typeof P.content.fr; pal: typeof P.palette; isDark: boolean; waLink: string }) {
  return (
    <div className="wk-cta-row" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", animation:"fadeUp .5s .32s ease both" }}>
      <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
        style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
        📅 {t.ctaPrimary}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wk-btn-wa"
        style={{ background:"#25d366", color:"#FFFFFF", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
        💬 {t.ctaWhatsApp}
      </a>
      <a href="/demo" className="wk-btn-demo"
        style={{ background:"transparent", color:pal.txt2, border:`1px solid ${pal.border}`, borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:10, fontFamily:"inherit", position:"relative" }}>
        ✨ {t.ctaDemo}
      </a>
    </div>
  );
}
