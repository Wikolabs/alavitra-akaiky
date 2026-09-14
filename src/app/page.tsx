"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import versesData from "@/data/verses.json";
import sermons from "@/data/sermons.json";

type Lang = "fr" | "mg" | "en";
type Role = "you" | "inme";

interface Msg { role: Role; text: string; ref?: string | null }

interface ThemeVerse { ref: string; fr: string; mg: string }
interface Theme { key: string; label: { fr: string; mg: string }; verses: ThemeVerse[] }

const THEMES = versesData.themes as Theme[];

const T: Record<Lang, Record<string, string>> = {
  fr: {
    tagline: "Un compagnon qui écoute, une Écriture qui répond.",
    lead: "Dites ce que vous portez, avec vos mots. Inme répond avec un passage exact des Écritures, puis vous propose un message à écouter sur le même sujet.",
    start: "Parler maintenant",
    listen: "Écouter un message",
    verseOfDay: "Le passage du jour",
    chatTitle: "La conversation",
    chatHint: "Rien n'est enregistré. Écrivez comme vous parleriez.",
    placeholder: "Ce que je porte aujourd'hui…",
    send: "Envoyer",
    thinking: "Inme écoute",
    themesTitle: "Ce que les gens apportent",
    themesLead: "Choisissez une situation, la conversation commence là. Chacune a ses passages vérifiés et ses messages.",
    forThis: "Pour cette situation",
    versesFor: "Passages",
    sermonsFor: "Messages à écouter",
    searchMore: "Chercher d'autres messages sur ce thème",
    sermonsTitle: "Toriteny, les messages",
    sermonsLead: "Des prédications publiques, sur les chaînes de leurs Églises. Rien n'est hébergé ici, rien ne se lance sans votre clic.",
    channels: "Les chaînes",
    play: "Lire",
    notice: "Inme accompagne, il ne remplace ni un pasteur, ni un médecin, ni un service d'écoute. En cas de danger immédiat, parlez à une personne de confiance près de vous.",
    sources: "Sources",
    sourcesText: "Textes bibliques : Louis Segond 1910 en français, Baiboly Malagasy 1865 en malgache, via getbible.net, domaine public. Les vidéos appartiennent à leurs chaînes et sont lues sur YouTube.",
    fail: "La réponse n'est pas venue. Réessayez dans un instant.",
  },
  mg: {
    tagline: "Namana mihaino, Soratra Masina mamaly.",
    lead: "Lazao amin'ny teninao izay entinao. Mamaly amin'ny andininy marina Inme, dia manolotra toriteny henoina mikasika izany ihany.",
    start: "Miresaka izao",
    listen: "Mihaino toriteny",
    verseOfDay: "Ny andininy androany",
    chatTitle: "Ny resaka",
    chatHint: "Tsy misy voatahiry. Soraty toy ny fitenenanao.",
    placeholder: "Izay entiko androany…",
    send: "Alefa",
    thinking: "Mihaino Inme",
    themesTitle: "Izay entin'ny olona",
    themesLead: "Fidio ny toe-javatra, manomboka eo ny resaka. Samy manana andininy voamarina sy toriteny.",
    forThis: "Ho an'ity toe-javatra ity",
    versesFor: "Andininy",
    sermonsFor: "Toriteny henoina",
    searchMore: "Hitady toriteny hafa momba izany",
    sermonsTitle: "Toriteny",
    sermonsLead: "Toriteny ampahibemaso, ao amin'ny fantsona an'ny Fiangonany. Tsy misy voatahiry eto, tsy misy mandeha raha tsy ianao no manindry.",
    channels: "Ny fantsona",
    play: "Henoy",
    notice: "Manotrona Inme, fa tsy misolo mpitandrina, na dokotera, na sampan-drafitra manampy. Raha misy loza mananontanona, mitenena amin'olona akaiky azo itokisana.",
    sources: "Loharano",
    sourcesText: "Soratra Masina : Louis Segond 1910 amin'ny teny frantsay, Baiboly Malagasy 1865 amin'ny teny malagasy, avy amin'ny getbible.net. An'ny fantsona tompony ny horonan-tsary, ao amin'ny YouTube no mandeha.",
    fail: "Tsy tonga ny valiny. Andramo indray afaka kely.",
  },
  en: {
    tagline: "A companion who listens, a Scripture that answers.",
    lead: "Say what you carry, in your own words. Inme replies with an exact passage, then offers a message to listen to on the same subject.",
    start: "Talk now",
    listen: "Listen to a message",
    verseOfDay: "Today's passage",
    chatTitle: "The conversation",
    chatHint: "Nothing is stored. Write the way you would speak.",
    placeholder: "What I carry today…",
    send: "Send",
    thinking: "Inme is listening",
    themesTitle: "What people bring",
    themesLead: "Pick a situation, the conversation starts there. Each has its verified passages and its messages.",
    forThis: "For this situation",
    versesFor: "Passages",
    sermonsFor: "Messages to listen to",
    searchMore: "Find more messages on this theme",
    sermonsTitle: "Toriteny, the messages",
    sermonsLead: "Public preaching, on their churches' own channels. Nothing is hosted here, nothing plays until you click.",
    channels: "The channels",
    play: "Play",
    notice: "Inme accompanies, it replaces neither a pastor, nor a doctor, nor a helpline. If you are in immediate danger, speak to someone you trust nearby.",
    sources: "Sources",
    sourcesText: "Bible texts: Louis Segond 1910 in French, Baiboly Malagasy 1865 in Malagasy, via getbible.net, public domain. Videos belong to their channels and play on YouTube.",
    fail: "The answer did not come. Try again in a moment.",
  },
};

const OPENERS: Record<Lang, Record<string, string>> = {
  fr: {
    peur: "J'ai peur de ce qui m'attend.",
    deuil: "Je viens de perdre quelqu'un.",
    solitude: "Je me sens seul en ce moment.",
    epuisement: "Je suis épuisé, je n'y arrive plus.",
    argent: "L'argent et le travail me pèsent.",
    famille: "Il y a de la tension à la maison.",
    maladie: "La maladie est entrée chez nous.",
    pardon: "Je n'arrive pas à me pardonner.",
    doute: "Je doute de ma foi.",
    colere: "Je suis en colère et je ne sais qu'en faire.",
    decision: "Je dois prendre une décision difficile.",
    gratitude: "Je voudrais dire merci.",
  },
  mg: {
    peur: "Matahotra izay hiseho aho.",
    deuil: "Vao namoy olon-tiana aho.",
    solitude: "Mahatsiaro ho irery aho izao.",
    epuisement: "Reraka aho, tsy zakako intsony.",
    argent: "Mavesatra amiko ny vola sy ny asa.",
    famille: "Misy disadisa ao an-tokantrano.",
    maladie: "Niditra tao aminay ny aretina.",
    pardon: "Tsy vitako ny mamela ny tenako.",
    doute: "Misalasala amin'ny finoako aho.",
    colere: "Tezitra aho ary tsy hainy atao.",
    decision: "Tsy maintsy manapa-kevitra sarotra aho.",
    gratitude: "Te hisaotra aho.",
  },
  en: {
    peur: "I am afraid of what is coming.",
    deuil: "I have just lost someone.",
    solitude: "I feel alone right now.",
    epuisement: "I am exhausted, I cannot keep going.",
    argent: "Money and work weigh on me.",
    famille: "There is tension at home.",
    maladie: "Illness has come into our house.",
    pardon: "I cannot forgive myself.",
    doute: "I doubt my faith.",
    colere: "I am angry and I do not know what to do with it.",
    decision: "I have a hard decision to make.",
    gratitude: "I would like to say thank you.",
  },
};

const verseText = (v: ThemeVerse, lang: Lang) => (lang === "mg" ? v.mg : v.fr);

/** Passage du jour : stable sur la journée, sans appel réseau. */
function passageOfDay() {
  const all = THEMES.flatMap((t) => t.verses);
  const day = Math.floor(Date.now() / 86400000);
  return all[day % all.length];
}

function VideoCard({ id, channel, title, play }: { id: string; channel: string; title: string; play: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="video">
      {open ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="video-thumb" onClick={() => setOpen(true)} aria-label={`${play} : ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span>{play}</span>
        </button>
      )}
      <div className="video-meta">
        <b>{title}</b>
        <span>{channel}</span>
      </div>
    </article>
  );
}

export default function Page() {
  const [lang, setLang] = useState<Lang>("fr");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const t = T[lang];
  const passage = useMemo(passageOfDay, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const current = THEMES.find((x) => x.key === theme) || null;
  /* Le verset cité par la réponse passe en premier : c'est celui que la personne vient de lire. */
  const cited = current?.verses.find((v) => v.ref === ref) || null;
  const shown = current ? [cited, ...current.verses.filter((v) => v !== cited)].filter(Boolean).slice(0, 2) as ThemeVerse[] : [];
  const search = theme ? (sermons.searches as Record<string, { fr: string; mg: string }>)[theme] : null;

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { role: "you", text }]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "error");
      setMsgs((m) => [...m, { role: "inme", text: j.reply, ref: j.ref }]);
      if (j.theme) setTheme(j.theme);
      setRef(j.ref ?? null);
    } catch {
      setMsgs((m) => [...m, { role: "inme", text: t.fail }]);
    } finally {
      setBusy(false);
    }
  };

  const openTheme = (key: string) => {
    setTheme(key);
    void send(OPENERS[lang][key]);
    document.getElementById("conversation")?.scrollIntoView({ block: "start" });
  };

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top">inme<span>In Me, In You</span></a>
          <div className="nav-links">
            <a href="#conversation">{t.chatTitle}</a>
            <a href="#situations">{t.themesTitle}</a>
            <a href="#toriteny">{t.sermonsTitle}</a>
          </div>
          <div className="langs" role="group" aria-label="Langue">
            {(["fr", "mg", "en"] as Lang[]).map((l) => (
              <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </nav>

      <main id="top">
        <header className="section wrap rise" style={{ borderTop: "none" }}>
          <h1>{t.tagline}</h1>
          <p className="lead" style={{ marginTop: 18 }}>{t.lead}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
            <a className="btn" href="#conversation">{t.start}</a>
            <a className="btn btn-soft" href="#toriteny">{t.listen}</a>
          </div>
          <div className="panel panel-tint" style={{ marginTop: 34 }}>
            <div className="kicker"><b>01</b>{t.verseOfDay}</div>
            <blockquote className="verse">
              <p>{verseText(passage, lang)}</p>
              <cite>{passage.ref}</cite>
            </blockquote>
          </div>
        </header>

        <section className="section" id="conversation">
          <div className="wrap">
            <div className="head">
              <div className="kicker"><b>02</b>{t.chatTitle}</div>
              <h2>{lang === "mg" ? "Lazao izay entinao." : lang === "en" ? "Say what you carry." : "Dites ce que vous portez."}</h2>
              <p className="lead" style={{ marginTop: 12 }}>{t.chatHint}</p>
            </div>

            <div className="grid grid-2" style={{ alignItems: "start" }}>
              <div className="panel chat">
                <div className="thread" ref={threadRef}>
                  {msgs.length === 0 && <p className="muted">{t.themesLead}</p>}
                  {msgs.map((m, i) => (
                    <div key={i} className={`msg ${m.role === "you" ? "msg-you" : "msg-inme"}`}>{m.text}</div>
                  ))}
                  {busy && <div className="typing">{t.thinking}…</div>}
                </div>
                <form className="chat-form" onSubmit={(e) => { e.preventDefault(); void send(); }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
                    placeholder={t.placeholder}
                    maxLength={1500}
                    aria-label={t.placeholder}
                  />
                  <button className="btn" type="submit" disabled={busy || !input.trim()}>{t.send}</button>
                </form>
              </div>

              <aside className="panel panel-tint">
                <div className="kicker"><b>{current ? "03" : "—"}</b>{t.forThis}</div>
                {current ? (
                  <>
                    <h3 style={{ marginBottom: 14 }}>{lang === "mg" ? current.label.mg : current.label.fr}</h3>
                    <div className="kicker" style={{ marginBottom: 8 }}>{t.versesFor}</div>
                    {shown.map((v) => (
                      <blockquote className="verse" key={v.ref} style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: "1.05rem" }}>{verseText(v, lang)}</p>
                        <cite>{v.ref}</cite>
                      </blockquote>
                    ))}
                    <hr className="rule" />
                    <div className="kicker" style={{ marginBottom: 10 }}>{t.sermonsFor}</div>
                    <div className="videos" style={{ gridTemplateColumns: "1fr" }}>
                      {sermons.featured.slice(0, 1).map((v) => (
                        <VideoCard key={v.id} id={v.id} channel={v.channel} title={v.title} play={t.play} />
                      ))}
                    </div>
                    {search && (
                      <p style={{ marginTop: 12 }}>
                        <a
                          className="btn btn-gold btn-sm"
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lang === "mg" ? search.mg : search.fr)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t.searchMore}
                        </a>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="muted">{t.themesLead}</p>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="section section-tint" id="situations">
          <div className="wrap">
            <div className="head">
              <div className="kicker"><b>04</b>{t.themesTitle}</div>
              <h2>{lang === "mg" ? "Roa ambin'ny folo toe-javatra." : lang === "en" ? "Twelve situations." : "Douze situations."}</h2>
            </div>
            <div className="chips">
              {THEMES.map((x) => (
                <button
                  key={x.key}
                  className="chip"
                  aria-pressed={theme === x.key}
                  onClick={() => openTheme(x.key)}
                >
                  {lang === "mg" ? x.label.mg : x.label.fr}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="toriteny">
          <div className="wrap">
            <div className="head">
              <div className="kicker"><b>05</b>{t.sermonsTitle}</div>
              <h2>{lang === "mg" ? "Toriteny henoina rehefa mangina ny alina." : lang === "en" ? "Messages to hear when the night is quiet." : "Des messages à écouter quand la nuit est calme."}</h2>
              <p className="lead" style={{ marginTop: 12 }}>{t.sermonsLead}</p>
            </div>
            <div className="videos">
              {sermons.featured.map((v) => (
                <VideoCard key={v.id} id={v.id} channel={v.channel} title={v.title} play={t.play} />
              ))}
            </div>
            <div className="kicker" style={{ marginTop: 26 }}>{t.channels}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {sermons.channels.map((c) => (
                <a key={c.id} className="btn btn-soft btn-sm" href={`https://www.youtube.com/channel/${c.id}`} target="_blank" rel="noopener noreferrer">
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className="foot">
          <div className="wrap">
            <div className="foot-grid">
              <div>
                <h4>inme.one</h4>
                <p>{t.notice}</p>
              </div>
              <div>
                <h4>{t.sources}</h4>
                <p>{t.sourcesText}</p>
              </div>
            </div>
            <p>© {new Date().getFullYear()} inme.one</p>
          </div>
        </footer>
      </main>
    </>
  );
}
