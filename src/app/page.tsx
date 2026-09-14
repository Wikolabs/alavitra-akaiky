"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import versesData from "@/data/verses.json";
import media from "@/data/media.json";
import contacts from "@/data/contacts.json";
import Logo from "./Logo";
import Sidebar from "./Sidebar";
import VideoCard from "./VideoCard";
import { useConversations, type Turn } from "./useConversations";

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
interface Contact {
  name: string;
  kind: string;
  city: string;
  url: string;
  phone: string;
  inChat?: boolean;
  note: { fr: string; mg: string; en: string };
}

const THEMES = versesData.themes as Theme[];
const VIDEOS = media.videos as Video[];
const STREAMS = media.streams as Record<string, { fr: string; mg: string; en: string }>;
const SEARCHES = media.searches as Record<string, { fr: string; mg: string }>;
const PLACES = contacts.places as Contact[];
const IN_CHAT = PLACES.filter((p) => p.inChat);
const HELP = contacts.help as Contact[];
const CONTACTS = [...PLACES, ...HELP];

const DAY = () => Math.floor(Date.now() / 86400000);
const verseText = (v: ThemeVerse, lang: Lang) => (lang === "mg" ? v.mg : v.fr);

function passageOfDay() {
  const all = THEMES.flatMap((x) => x.verses);
  return all[DAY() % all.length];
}

const themeByKey = (key: string | null) => (key ? THEMES.find((x) => x.key === key) ?? null : null);

/** Deux messages par situation, pris dans des courants differents quand c'est possible. */
function videosFor(key: string | null): Video[] {
  if (!key) return [];
  const pool = VIDEOS.filter((v) => v.themes.includes(key));
  if (pool.length <= 2) return pool;
  const start = DAY() % pool.length;
  const first = pool[start];
  const other = pool.find((v, i) => i !== start && v.stream !== first.stream) ?? pool[(start + 1) % pool.length];
  return [first, other];
}

/** Le domaine seul : une adresse complete deborde de l'ecran sur telephone. */
function domainOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
}

const T: Record<Lang, Record<string, string>> = {
  fr: {
    tagline: "Un compagnon qui écoute, une Écriture qui répond.",
    lead: "Dites ce que vous portez, avec vos mots. Inme répond avec un passage exact des Écritures, vous propose un message à écouter, et vous indique où trouver quelqu'un à qui parler.",
    verseOfDay: "Le passage du jour",
    newChat: "Nouvelle conversation",
    history: "Vos conversations",
    sideEmpty: "Vos conversations resteront ici, sur cet appareil seulement. Rien n'est envoyé nulle part.",
    del: "Supprimer",
    close: "Fermer",
    menu: "Conversations",
    welcome: "Bienvenue. Dites avec vos mots ce que vous portez aujourd'hui, ou touchez la situation la plus proche.",
    placeholder: "Ce que je porte aujourd'hui.",
    send: "Envoyer",
    thinking: "Inme écoute",
    pickTheme: "Choisissez la situation",
    pickPrompt: "Ou prenez l'une de ces phrases",
    attach: "Le passage qui correspond",
    attachVideo: "À écouter",
    attachTalk: "Parler à quelqu'un",
    example: "Exemple",
    searchMore: "Chercher d'autres messages sur ce thème",
    sermonsTitle: "Les messages",
    sermonsLead: "Des prédications, des messes et des louanges publiques, sur les chaînes de leurs Églises. Rien n'est hébergé ici, rien ne se lance sans votre clic.",
    filterAll: "Tout",
    channels: "Les chaînes",
    play: "Lire",
    talkTitle: "Où parler à quelqu'un",
    talkLead: "Des lieux qui publient eux-mêmes leurs coordonnées. Inme ne prend aucun rendez-vous à votre place et ne transmet rien.",
    notice: "Inme accompagne, il ne remplace ni un pasteur, ni un prêtre, ni un médecin, ni un service d'écoute. En cas de danger immédiat, parlez à une personne de confiance près de vous.",
    sources: "Sources",
    sourcesText: "Textes bibliques : Louis Segond 1910 en français, Baiboly Malagasy 1865 en malgache, via getbible.net, domaine public. Les vidéos appartiennent à leurs chaînes et sont lues sur YouTube.",
    indep: "Indépendance",
    indepText: "Aucune chaîne citée ici n'est affiliée à inme.one, et inme.one n'appartient à aucune Église. Catholiques, protestantes, évangéliques : les courants sont présentés côte à côte, pas en recommandation.",
    fail: "La réponse n'est pas venue. Réessayez dans un instant.",
  },
  mg: {
    tagline: "Namana mihaino, Soratra Masina mamaly.",
    lead: "Lazao amin'ny teninao izay entinao. Mamaly amin'ny andininy marina Inme, manolotra toriteny henoina, ary manondro izay toerana ahitana olona hiresahana.",
    verseOfDay: "Ny andininy androany",
    newChat: "Resaka vaovao",
    history: "Ny resakao",
    sideEmpty: "Mijanona eto ny resakao, amin'ity fitaovana ity ihany. Tsy misy alefa na aiza na aiza.",
    del: "Fafao",
    close: "Hidio",
    menu: "Resaka",
    welcome: "Tongasoa. Lazao amin'ny teninao izay entinao androany, na tsindrio ny toe-javatra manakaiky indrindra.",
    placeholder: "Izay entiko androany.",
    send: "Alefa",
    thinking: "Mihaino Inme",
    pickTheme: "Safidio ny toe-javatra",
    pickPrompt: "Na alaivo ny iray amin'ireto fehezanteny ireto",
    attach: "Ny andininy mifanaraka amin'izany",
    attachVideo: "Henoy",
    attachTalk: "Misy olona hiresahana",
    example: "Ohatra",
    searchMore: "Hitady toriteny hafa momba izany",
    sermonsTitle: "Ny toriteny",
    sermonsLead: "Toriteny, lamesa ary fiderana ampahibemaso, ao amin'ny fantsona an'ny Fiangonany. Tsy misy voatahiry eto, tsy misy mandeha raha tsy ianao no manindry.",
    filterAll: "Izy rehetra",
    channels: "Ny fantsona",
    play: "Henoy",
    talkTitle: "Aiza no misy olona hiresahana",
    talkLead: "Toerana mamoaka ny antsipirihany momba azy ireo ihany. Tsy manao fotoana ho anao i Inme, ary tsy mampita na inona na inona.",
    notice: "Manotrona Inme, fa tsy misolo mpitandrina, na pretra, na dokotera, na sampan-drafitra manampy. Raha misy loza mananontanona, mitenena amin'olona akaiky azo itokisana.",
    sources: "Loharano",
    sourcesText: "Soratra Masina : Louis Segond 1910 amin'ny teny frantsay, Baiboly Malagasy 1865 amin'ny teny malagasy, avy amin'ny getbible.net. An'ny fantsona tompony ny horonan-tsary, ao amin'ny YouTube no mandeha.",
    indep: "Tsy miankina",
    indepText: "Tsy misy fantsona voatanisa eto mifandray amin'ny inme.one, ary tsy an'ny Fiangonana iray ny inme.one. Katolika, protestanta, evanjelika : aseho miaraka ireo fironana, fa tsy hoe tolo-kevitra.",
    fail: "Tsy tonga ny valiny. Andramo indray afaka kely.",
  },
  en: {
    tagline: "A companion who listens, a Scripture that answers.",
    lead: "Say what you carry, in your own words. Inme replies with an exact passage, offers a message to listen to, and points to places where you can find someone to talk to.",
    verseOfDay: "Today's passage",
    newChat: "New conversation",
    history: "Your conversations",
    sideEmpty: "Your conversations stay here, on this device only. Nothing is sent anywhere.",
    del: "Delete",
    close: "Close",
    menu: "Conversations",
    welcome: "Welcome. Say in your own words what you carry today, or tap the closest situation.",
    placeholder: "What I carry today.",
    send: "Send",
    thinking: "Inme is listening",
    pickTheme: "Pick the situation",
    pickPrompt: "Or take one of these sentences",
    attach: "The passage that fits",
    attachVideo: "To listen to",
    attachTalk: "Someone to talk to",
    example: "Example",
    searchMore: "Find more messages on this theme",
    sermonsTitle: "The messages",
    sermonsLead: "Public preaching, Masses and worship, on their churches' own channels. Nothing is hosted here, nothing plays until you click.",
    filterAll: "All",
    channels: "The channels",
    play: "Play",
    talkTitle: "Where to find someone to talk to",
    talkLead: "Places that publish their own contact details. Inme books nothing for you and passes nothing on.",
    notice: "Inme accompanies, it replaces neither a pastor, a priest, a doctor, nor a helpline. If you are in immediate danger, speak to someone you trust nearby.",
    sources: "Sources",
    sourcesText: "Bible texts: Louis Segond 1910 in French, Baiboly Malagasy 1865 in Malagasy, via getbible.net, public domain. Videos belong to their channels and play on YouTube.",
    indep: "Independence",
    indepText: "No channel listed here is affiliated with inme.one, and inme.one belongs to no church. Catholic, Protestant, evangelical: the streams sit side by side, not as a recommendation.",
    fail: "The answer did not come. Try again in a moment.",
  },
};

export default function Page() {
  const [lang, setLang] = useState<Lang>("fr");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string>(THEMES[0].key);
  const [drawer, setDrawer] = useState(false);
  const [stream, setStream] = useState<string>("all");
  const threadRef = useRef<HTMLDivElement>(null);
  const t = T[lang];
  const passage = useMemo(passageOfDay, []);

  const convo = useConversations("inme.conversations.v1");
  const turns = convo.turns;

  useEffect(() => {
    if (turns.length === 0) return;
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, busy]);

  async function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || busy) return;

    /* Le modele recoit les derniers tours : sans cela il resalue a chaque
       message et perd ce qui vient d'etre dit. */
    const history = turns.map((x) => ({ role: x.role === "you" ? "user" : "assistant", content: x.text }));

    convo.append({ role: "you", text });
    setInput("");
    setBusy(true);
    setDrawer(false);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang, history }),
      });
      const j = await r.json();
      if (!r.ok || !j.reply) throw new Error(j.error || "error");
      convo.append({ role: "bot", text: j.reply, theme: j.theme ?? null, ref: j.ref ?? null });
      if (j.theme) setPicked(j.theme);
    } catch {
      convo.append({ role: "bot", text: t.fail, theme: null, ref: null });
    } finally {
      setBusy(false);
    }
  }

  const themeLabel = (key: string) => themeByKey(key)?.label[lang] ?? key;
  const prompts = themeByKey(picked)?.prompts[lang] ?? [];
  const shownVideos = stream === "all" ? VIDEOS : VIDEOS.filter((v) => v.stream === stream);

  function Attach({ themeKey, citedRef, label }: { themeKey: string; citedRef: string | null; label: string }) {
    const th = themeByKey(themeKey);
    if (!th) return null;
    const cited = th.verses.find((v) => v.ref === citedRef) ?? th.verses[DAY() % th.verses.length];
    const vids = videosFor(themeKey);
    const search = SEARCHES[themeKey];
    /* Un lieu ou l'on peut se presenter, et un service d'ecoute. Ils tournent
       d'un jour a l'autre pour ne pas toujours envoyer au meme endroit. */
    const places = [IN_CHAT[DAY() % IN_CHAT.length], HELP[DAY() % HELP.length]].filter(Boolean);

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

          {vids.length > 0 && (
            <div>
              <p className="suggest-label">{t.attachVideo}</p>
              <div className="videos" style={{ gridTemplateColumns: "1fr" }}>
                {vids.map((v) => (
                  <VideoCard key={v.id} v={v} play={t.play} />
                ))}
              </div>
            </div>
          )}

          {places.length > 0 && (
            <>
              <hr className="attach-sep" />
              <div>
                <p className="suggest-label">{t.attachTalk}</p>
                <div className="talk">
                  {places.map((c) => (
                    <div className="talk-item" key={c.url}>
                      <b>{c.name}</b>
                      <span>
                        {c.kind}, {c.city}
                        {c.phone ? `, ${c.phone}` : ""}
                      </span>
                      <span style={{ fontSize: ".88rem", color: "var(--ink-2)" }}>{c.note[lang]}</span>
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {domainOf(c.url)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
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

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn btn-soft btn-sm side-toggle"
              onClick={() => setDrawer((v) => !v)}
              aria-label={t.menu}
              aria-expanded={drawer}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a className="brand" href="#top" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Logo size={32} />
              inme<span>In Me, In You</span>
            </a>
          </span>
          <div className="nav-links">
            <a href="#toriteny">{t.sermonsTitle}</a>
            <a href="#parler">{t.talkTitle}</a>
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

      <div className="app" id="top">
        <Sidebar
          list={convo.list}
          currentId={convo.currentId}
          open={drawer}
          onClose={() => setDrawer(false)}
          onNew={() => {
            convo.start();
            setDrawer(false);
          }}
          onOpen={(id) => {
            convo.open(id);
            setDrawer(false);
          }}
          onRemove={convo.remove}
          labels={{ newChat: t.newChat, history: t.history, empty: t.sideEmpty, del: t.del, close: t.close }}
          links={[
            { href: "#toriteny", label: t.sermonsTitle },
            { href: "#parler", label: t.talkTitle },
            { href: "#sources", label: t.sources },
          ]}
        />

        <div className="pane">
          <div className="thread" ref={threadRef}>
            <div className="thread-in">
              {turns.length === 0 ? (
                <>
                  <div className="intro">
                    <h1>{t.tagline}</h1>
                    <p className="lead">{t.lead}</p>
                    <div className="intro-card">
                      <Logo size={54} />
                      <blockquote className="verse" style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "1.14rem" }}>{verseText(passage, lang)}</p>
                        <cite>
                          {t.verseOfDay}, {passage.ref}
                        </cite>
                      </blockquote>
                    </div>
                  </div>
                  <div className="msg msg-ai">{t.welcome}</div>
                  <Attach themeKey={picked} citedRef={null} label={t.example} />
                </>
              ) : (
                turns.map((m: Turn, i: number) =>
                  m.role === "you" ? (
                    <div key={i} className="msg msg-you">
                      {m.text}
                    </div>
                  ) : (
                    <div key={i} style={{ display: "contents" }}>
                      <div className="msg msg-ai">{m.text}</div>
                      {m.theme && <Attach themeKey={m.theme} citedRef={m.ref ?? null} label={t.attach} />}
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
          </div>

          <div className="suggest">
            <div className="suggest-in">
              <p className="suggest-label">{t.pickTheme}</p>
              <div className="chips">
                {THEMES.map((x) => (
                  <button key={x.key} className="chip" aria-pressed={picked === x.key} onClick={() => setPicked(x.key)}>
                    {x.label[lang]}
                  </button>
                ))}
              </div>
              <p className="suggest-label" style={{ marginTop: 16 }}>
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

      <main>
        <section className="section" id="toriteny">
          <div className="wrap">
            <div className="head">
              <div className="kicker">
                <b>{VIDEOS.length}</b>
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
                <VideoCard key={v.id} v={v} play={t.play} />
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

        {CONTACTS.length > 0 && (
          <section className="section section-tint" id="parler">
            <div className="wrap">
              <div className="head">
                <div className="kicker">
                  <b>{CONTACTS.length}</b>
                  {t.talkTitle}
                </div>
                <h2>{t.talkTitle}</h2>
                <p className="lead" style={{ marginTop: 12 }}>
                  {t.talkLead}
                </p>
              </div>
              <div className="grid grid-2">
                {CONTACTS.map((c) => (
                  <div className="panel" key={c.url}>
                    <h3 style={{ marginBottom: 8 }}>{c.name}</h3>
                    <p className="muted" style={{ marginBottom: 10 }}>
                      {c.kind}, {c.city}
                      {c.phone ? `, ${c.phone}` : ""}
                    </p>
                    <p style={{ fontSize: ".93rem", marginBottom: 14 }}>{c.note[lang]}</p>
                    <a className="btn btn-sm" href={c.url} target="_blank" rel="noreferrer noopener" style={{ maxWidth: "100%" }}>
                      {domainOf(c.url)}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="foot" id="sources">
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
              {VIDEOS.length} {lang === "mg" ? "horonan-tsary" : lang === "en" ? "videos" : "vidéos"}, {media.checkedAt}.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
