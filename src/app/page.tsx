"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import versesData from "@/data/verses.json";
import media from "@/data/media.json";

type Lang = "fr" | "mg" | "en";

interface ThemeVerse { ref: string; fr: string; mg: string }
interface Theme {
  key: string;
  label: { fr: string; mg: string; en: string };
  verses: ThemeVerse[];
  prompts: { fr: string[]; mg: string[]; en: string[] };
}
interface Video {
  id: string;
  title: string;
  channel: string;
  stream: string;
  lang: string;
  themes: string[];
  why: string;
}

const THEMES = versesData.themes as Theme[];
const VIDEOS = media.videos as Video[];
const STREAMS = media.streams as Record<string, { fr: string; mg: string; en: string }>;
const SEARCHES = media.searches as Record<string, { fr: string; mg: string }>;

const DAY = () => Math.floor(Date.now() / 86400000);

const verseText = (v: ThemeVerse, lang: Lang) => (lang === "mg" ? v.mg : v.fr);

/** Passage du jour : stable sur la journee, sans appel reseau. */
function passageOfDay() {
  const all = THEMES.flatMap((x) => x.verses);
  return all[DAY() % all.length];
}

function themeByKey(key: string | null) {
  return key ? THEMES.find((x) => x.key === key) ?? null : null;
}

function videoFor(key: string | null): Video | null {
  if (!key) return null;
  const pool = VIDEOS.filter((v) => v.themes.includes(key));
  return pool.length ? pool[DAY() % pool.length] : null;
}

const T: Record<Lang, Record<string, string>> = {
  fr: {
    tagline: "Un compagnon qui écoute, une Écriture qui répond.",
    lead: "Dites ce que vous portez, avec vos mots. Inme répond avec un passage exact des Écritures, puis vous propose un message à écouter sur le même sujet.",
    start: "Parler maintenant",
    listen: "Écouter un message",
    verseOfDay: "Le passage du jour",
    chatTitle: "La conversation",
    chatSub: "Dites ce que vous portez.",
    chatHint: "Rien n'est enregistré. Écrivez comme vous parleriez.",
    chatName: "Inme",
    chatStatus: "Gratuit, sans compte, ouvert jour et nuit",
    welcome: "Bienvenue. Dites avec vos mots ce que vous portez aujourd'hui, ou touchez la situation la plus proche ci-dessous.",
    placeholder: "Ce que je porte aujourd'hui.",
    send: "Envoyer",
    thinking: "Inme écoute",
    pickTheme: "Choisissez la situation",
    pickPrompt: "Ou prenez l'une de ces phrases",
    attach: "Le passage qui correspond",
    attachVideo: "À écouter",
    example: "Exemple",
    themesTitle: "Ce que les gens apportent",
    searchMore: "Chercher d'autres messages sur ce thème",
    sermonsTitle: "Les messages",
    sermonsLead: "Des prédications et des louanges publiques, sur les chaînes de leurs Églises. Rien n'est hébergé ici, rien ne se lance sans votre clic.",
    filterAll: "Tout",
    channels: "Les chaînes",
    play: "Lire",
    notice: "Inme accompagne, il ne remplace ni un pasteur, ni un médecin, ni un service d'écoute. En cas de danger immédiat, parlez à une personne de confiance près de vous.",
    sources: "Sources",
    sourcesText: "Textes bibliques : Louis Segond 1910 en français, Baiboly Malagasy 1865 en malgache, via getbible.net, domaine public. Les vidéos appartiennent à leurs chaînes et sont lues sur YouTube.",
    indep: "Indépendance",
    indepText: "Aucune chaîne citée ici n'est affiliée à inme.one, et inme.one n'appartient à aucune Église. Les courants présentés le sont pour leur audience, pas en recommandation.",
    fail: "La réponse n'est pas venue. Réessayez dans un instant.",
  },
  mg: {
    tagline: "Namana mihaino, Soratra Masina mamaly.",
    lead: "Lazao amin'ny teninao izay entinao. Mamaly amin'ny andininy marina Inme, dia manolotra toriteny henoina mikasika izany ihany.",
    start: "Miresaka izao",
    listen: "Mihaino toriteny",
    verseOfDay: "Ny andininy androany",
    chatTitle: "Ny resaka",
    chatSub: "Lazao izay entinao.",
    chatHint: "Tsy misy voatahiry. Soraty toy ny fitenenanao.",
    chatName: "Inme",
    chatStatus: "Maimaim-poana, tsy mila kaonty, misokatra andro aman'alina",
    welcome: "Tongasoa. Lazao amin'ny teninao izay entinao androany, na tsindrio ny toe-javatra manakaiky indrindra eto ambany.",
    placeholder: "Izay entiko androany.",
    send: "Alefa",
    thinking: "Mihaino Inme",
    pickTheme: "Safidio ny toe-javatra",
    pickPrompt: "Na alaivo ny iray amin'ireto fehezanteny ireto",
    attach: "Ny andininy mifanaraka amin'izany",
    attachVideo: "Henoy",
    example: "Ohatra",
    themesTitle: "Izay entin'ny olona",
    searchMore: "Hitady toriteny hafa momba izany",
    sermonsTitle: "Ny toriteny",
    sermonsLead: "Toriteny sy fiderana ampahibemaso, ao amin'ny fantsona an'ny Fiangonany. Tsy misy voatahiry eto, tsy misy mandeha raha tsy ianao no manindry.",
    filterAll: "Izy rehetra",
    channels: "Ny fantsona",
    play: "Henoy",
    notice: "Manotrona Inme, fa tsy misolo mpitandrina, na dokotera, na sampan-drafitra manampy. Raha misy loza mananontanona, mitenena amin'olona akaiky azo itokisana.",
    sources: "Loharano",
    sourcesText: "Soratra Masina : Louis Segond 1910 amin'ny teny frantsay, Baiboly Malagasy 1865 amin'ny teny malagasy, avy amin'ny getbible.net. An'ny fantsona tompony ny horonan-tsary, ao amin'ny YouTube no mandeha.",
    indep: "Tsy miankina",
    indepText: "Tsy misy fantsona voatanisa eto mifandray amin'ny inme.one, ary tsy an'ny Fiangonana iray ny inme.one. Aseho noho ny mpanaraka azy ireo fironana ireo, fa tsy hoe tolo-kevitra.",
    fail: "Tsy tonga ny valiny. Andramo indray afaka kely.",
  },
  en: {
    tagline: "A companion who listens, a Scripture that answers.",
    lead: "Say what you carry, in your own words. Inme replies with an exact passage, then offers a message to listen to on the same subject.",
    start: "Talk now",
    listen: "Listen to a message",
    verseOfDay: "Today's passage",
    chatTitle: "The conversation",
    chatSub: "Say what you carry.",
    chatHint: "Nothing is stored. Write the way you would speak.",
    chatName: "Inme",
    chatStatus: "Free, no account, open day and night",
    welcome: "Welcome. Say in your own words what you carry today, or tap the closest situation below.",
    placeholder: "What I carry today.",
    send: "Send",
    thinking: "Inme is listening",
    pickTheme: "Pick the situation",
    pickPrompt: "Or take one of these sentences",
    attach: "The passage that fits",
    attachVideo: "To listen to",
    example: "Example",
    themesTitle: "What people bring",
    searchMore: "Find more messages on this theme",
    sermonsTitle: "The messages",
    sermonsLead: "Public preaching and worship, on their churches' own channels. Nothing is hosted here, nothing plays until you click.",
    filterAll: "All",
    channels: "The channels",
    play: "Play",
    notice: "Inme accompanies, it replaces neither a pastor, nor a doctor, nor a helpline. If you are in immediate danger, speak to someone you trust nearby.",
    sources: "Sources",
    sourcesText: "Bible texts: Louis Segond 1910 in French, Baiboly Malagasy 1865 in Malagasy, via getbible.net, public domain. Videos belong to their channels and play on YouTube.",
    indep: "Independence",
    indepText: "No channel listed here is affiliated with inme.one, and inme.one belongs to no church. These streams are shown for their audience, not as a recommendation.",
    fail: "The answer did not come. Try again in a moment.",
  },
};

function VideoCard({ v, lang, play }: { v: Video; lang: Lang; play: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="video">
      {open ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
          title={v.title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button className="video-thumb" onClick={() => setOpen(true)} aria-label={`${play} : ${v.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span>{play}</span>
        </button>
      )}
      <div className="video-meta">
        <b>{v.title}</b>
        <span>{v.channel}</span>
        <p>{v.why}</p>
      </div>
    </article>
  );
}

type Msg = { role: "you"; text: string } | { role: "inme"; text: string; theme: string | null; ref: string | null };

export default function Page() {
  const [lang, setLang] = useState<Lang>("fr");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string>(THEMES[0].key);
  const threadRef = useRef<HTMLDivElement>(null);
  const t = T[lang];
  const passage = useMemo(passageOfDay, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

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
      setMsgs((m) => [...m, { role: "inme", text: j.reply, theme: j.theme ?? null, ref: j.ref ?? null }]);
      if (j.theme) setPicked(j.theme);
    } catch {
      setMsgs((m) => [...m, { role: "inme", text: t.fail, theme: null, ref: null }]);
    } finally {
      setBusy(false);
    }
  };

  const themeLabel = (key: string) => themeByKey(key)?.label[lang] ?? key;
  const prompts = themeByKey(picked)?.prompts[lang] ?? [];

  /* Fiche jointe : le verset cite par la reponse d'abord, puis la video. */
  function Attach({ themeKey, citedRef, label }: { themeKey: string; citedRef: string | null; label: string }) {
    const th = themeByKey(themeKey);
    if (!th) return null;
    const cited = th.verses.find((v) => v.ref === citedRef) ?? th.verses[DAY() % th.verses.length];
    const v = videoFor(themeKey);
    const search = SEARCHES[themeKey];
    return (
      <div className="attach">
        <div className="attach-head">
          <span>
            {label}, {themeLabel(themeKey)}
          </span>
        </div>
        <div className="attach-body">
          <blockquote className="verse">
            <p style={{ fontSize: "1.12rem" }}>{verseText(cited, lang)}</p>
            <cite>{cited.ref}</cite>
          </blockquote>
          {v && (
            <div>
              <p className="suggest-label">{t.attachVideo}</p>
              <div className="videos" style={{ gridTemplateColumns: "1fr" }}>
                <VideoCard v={v} lang={lang} play={t.play} />
              </div>
            </div>
          )}
          {search && (
            <a
              className="btn btn-gold btn-sm"
              style={{ alignSelf: "flex-start" }}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lang === "mg" ? search.mg : search.fr)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.searchMore}
            </a>
          )}
        </div>
      </div>
    );
  }

  const [stream, setStream] = useState<string>("all");
  const shownVideos = stream === "all" ? VIDEOS : VIDEOS.filter((v) => v.stream === stream);

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top">
            inme<span>In Me, In You</span>
          </a>
          <div className="nav-links">
            <a href="#conversation">{t.chatTitle}</a>
            <a href="#toriteny">{t.sermonsTitle}</a>
          </div>
          <div className="langs" role="group" aria-label="Langue">
            {(["fr", "mg", "en"] as Lang[]).map((l) => (
              <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main id="top">
        <header className="section wrap rise" style={{ borderTop: "none" }}>
          <div
            className="hero-grid"
            style={{ display: "grid", gap: "clamp(24px, 4vw, 52px)", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", alignItems: "center" }}
          >
            <div>
              <h1>{t.tagline}</h1>
              <p className="lead" style={{ marginTop: 18 }}>
                {t.lead}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
                <a className="btn" href="#conversation">
                  {t.start}
                </a>
                <a className="btn btn-soft" href="#toriteny">
                  {t.listen}
                </a>
              </div>
            </div>
            <div className="panel panel-tint">
              <div className="kicker">
                <b>01</b>
                {t.verseOfDay}
              </div>
              <blockquote className="verse">
                <p>{verseText(passage, lang)}</p>
                <cite>{passage.ref}</cite>
              </blockquote>
            </div>
          </div>
        </header>

        <section className="section section-tint" id="conversation">
          <div className="wrap">
            <div className="narrow" style={{ textAlign: "center", marginBottom: "clamp(26px, 4vh, 40px)" }}>
              <div className="kicker" style={{ justifyContent: "center" }}>
                <b>02</b>
                {t.chatTitle}
              </div>
              <h2>{t.chatSub}</h2>
              <p className="lead" style={{ marginTop: 12, marginInline: "auto" }}>
                {t.chatHint}
              </p>
            </div>

            <div className="chat">
              <div className="chat-head">
                <b>{t.chatName}</b>
                <span className="muted">{t.chatStatus}</span>
              </div>

              <div className="thread" ref={threadRef}>
                {msgs.length === 0 ? (
                  <>
                    <div className="msg msg-inme">{t.welcome}</div>
                    <Attach themeKey={picked} citedRef={null} label={t.example} />
                  </>
                ) : (
                  msgs.map((m, i) =>
                    m.role === "you" ? (
                      <div key={i} className="msg msg-you">
                        {m.text}
                      </div>
                    ) : (
                      <div key={i} style={{ display: "contents" }}>
                        <div className="msg msg-inme">{m.text}</div>
                        {m.theme && <Attach themeKey={m.theme} citedRef={m.ref} label={t.attach} />}
                      </div>
                    )
                  )
                )}
                {busy && (
                  <span className="typing">
                    {t.thinking}
                    <span aria-hidden="true">...</span>
                  </span>
                )}
              </div>

              <div className="suggest">
                <p className="suggest-label">{t.pickTheme}</p>
                <div className="chips">
                  {THEMES.map((x) => (
                    <button key={x.key} className="chip" aria-pressed={picked === x.key} onClick={() => setPicked(x.key)}>
                      {x.label[lang]}
                    </button>
                  ))}
                </div>
                <p className="suggest-label" style={{ marginTop: 18 }}>
                  {t.pickPrompt}
                </p>
                <div className="prompts">
                  {prompts.map((p) => (
                    <button key={p} className="prompt" onClick={() => void send(p)} disabled={busy}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chat-foot">
                <form
                  className="chat-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send();
                  }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    placeholder={t.placeholder}
                    maxLength={1500}
                    rows={2}
                    aria-label={t.placeholder}
                  />
                  <button className="btn send" type="submit" disabled={busy || !input.trim()} aria-label={t.send}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 19V5" />
                      <path d="m5 12 7-7 7 7" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="toriteny">
          <div className="wrap">
            <div className="head">
              <div className="kicker">
                <b>03</b>
                {t.sermonsTitle}
              </div>
              <h2>
                {lang === "mg"
                  ? "Toriteny henoina rehefa mangina ny alina."
                  : lang === "en"
                  ? "Messages to hear when the night is quiet."
                  : "Des messages à écouter quand la nuit est calme."}
              </h2>
              <p className="lead" style={{ marginTop: 12 }}>
                {t.sermonsLead}
              </p>
            </div>

            <div className="chips" style={{ marginBottom: 26 }}>
              <button className="chip" aria-pressed={stream === "all"} onClick={() => setStream("all")}>
                {t.filterAll}
              </button>
              {Object.entries(STREAMS).map(([k, s]) => (
                <button key={k} className="chip" aria-pressed={stream === k} onClick={() => setStream(k)}>
                  {s[lang]}
                </button>
              ))}
            </div>

            <div className="videos">
              {shownVideos.map((v) => (
                <VideoCard key={v.id} v={v} lang={lang} play={t.play} />
              ))}
            </div>

            <div className="kicker" style={{ marginTop: 28 }}>
              {t.channels}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {media.channels.map((c) => (
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
                <h4>{t.indep}</h4>
                <p>{t.indepText}</p>
              </div>
              <div>
                <h4>{t.sources}</h4>
                <p>{t.sourcesText}</p>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: ".74rem" }}>
              {VIDEOS.length}{" "}
              {lang === "mg" ? "horonan-tsary" : lang === "en" ? "videos" : "vidéos"}, {media.checkedAt}.
            </p>
          </div>
        </footer>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
