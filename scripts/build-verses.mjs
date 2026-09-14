/* Construit src/data/verses.json : le texte exact de chaque verset, en français
   (Louis Segond 1910) et en malgache (Baiboly Malagasy 1865), récupéré depuis
   l'API publique getbible.net. Les deux traductions sont dans le domaine public.

   Usage : node scripts/build-verses.mjs
   Le fichier produit est versionné : l'application ne dépend d'aucune API au runtime.
*/
import { writeFileSync, mkdirSync } from "node:fs";

const API = "https://api.getbible.net/v2";

/* Numéros de livre de l'API (canon protestant, 1 à 66). */
const BOOKS = {
  "Genèse": 1, "Exode": 2, "Lévitique": 3, "Nombres": 4, "Deutéronome": 5,
  "Josué": 6, "Juges": 7, "Ruth": 8, "1 Samuel": 9, "2 Samuel": 10,
  "1 Rois": 11, "2 Rois": 12, "1 Chroniques": 13, "2 Chroniques": 14, "Esdras": 15,
  "Néhémie": 16, "Esther": 17, "Job": 18, "Psaume": 19, "Proverbes": 20,
  "Ecclésiaste": 21, "Cantique": 22, "Ésaïe": 23, "Jérémie": 24, "Lamentations": 25,
  "Ézéchiel": 26, "Daniel": 27, "Osée": 28, "Joël": 29, "Amos": 30,
  "Abdias": 31, "Jonas": 32, "Michée": 33, "Nahum": 34, "Habakuk": 35,
  "Sophonie": 36, "Aggée": 37, "Zacharie": 38, "Malachie": 39,
  "Matthieu": 40, "Marc": 41, "Luc": 42, "Jean": 43, "Actes": 44,
  "Romains": 45, "1 Corinthiens": 46, "2 Corinthiens": 47, "Galates": 48, "Éphésiens": 49,
  "Philippiens": 50, "Colossiens": 51, "1 Thessaloniciens": 52, "2 Thessaloniciens": 53,
  "1 Timothée": 54, "2 Timothée": 55, "Tite": 56, "Philémon": 57, "Hébreux": 58,
  "Jacques": 59, "1 Pierre": 60, "2 Pierre": 61, "1 Jean": 62, "2 Jean": 63,
  "3 Jean": 64, "Jude": 65, "Apocalypse": 66,
};

/* Douze situations que les gens apportent réellement, et les passages qui y répondent.
   Chaque thème porte son libellé dans les deux langues : il sert aussi de clé de
   recommandation pour les messages vidéo. */
export const THEMES = [
  { key: "peur", fr: "Peur et angoisse", mg: "Tahotra sy tebiteby", refs: ["Ésaïe 41:10", "Philippiens 4:6-7", "Jean 14:27", "Psaume 56:4"] },
  { key: "deuil", fr: "Deuil et tristesse", mg: "Fisaonana sy alahelo", refs: ["Psaume 34:19", "Matthieu 5:4", "Apocalypse 21:4", "Psaume 147:3"] },
  { key: "solitude", fr: "Solitude", mg: "Fahirano sy fanirery", refs: ["Deutéronome 31:6", "Hébreux 13:5", "Psaume 68:7"] },
  { key: "epuisement", fr: "Épuisement", mg: "Fahareraham-po", refs: ["Matthieu 11:28-30", "Ésaïe 40:31", "Psaume 23:1-4"] },
  { key: "argent", fr: "Travail et argent", mg: "Asa sy vola", refs: ["Matthieu 6:31-33", "Philippiens 4:19", "Proverbes 16:3"] },
  { key: "famille", fr: "Famille et couple", mg: "Fianakaviana sy tokantrano", refs: ["1 Corinthiens 13:4-7", "Éphésiens 4:32", "Colossiens 3:13"] },
  { key: "maladie", fr: "Maladie", mg: "Aretina", refs: ["Psaume 103:2-3", "Jacques 5:14-15", "Ésaïe 53:5"] },
  { key: "pardon", fr: "Faute et pardon", mg: "Fahotana sy famelan-keloka", refs: ["1 Jean 1:9", "Psaume 103:12", "Romains 8:1"] },
  { key: "doute", fr: "Doute et foi", mg: "Fisalasalana sy finoana", refs: ["Marc 9:24", "Hébreux 11:1", "Jacques 1:5-6"] },
  { key: "colere", fr: "Colère et conflit", mg: "Fahatezerana sy ady", refs: ["Éphésiens 4:26", "Proverbes 15:1", "Jacques 1:19"] },
  { key: "decision", fr: "Décision et direction", mg: "Fanapahan-kevitra", refs: ["Proverbes 3:5-6", "Psaume 32:8", "Jacques 1:5"] },
  { key: "gratitude", fr: "Gratitude et joie", mg: "Fisaorana sy fifaliana", refs: ["1 Thessaloniciens 5:16-18", "Psaume 118:24", "Néhémie 8:10"] },
];

const parseRef = (ref) => {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) throw new Error(`référence illisible : ${ref}`);
  const [, book, chapter, from, to] = m;
  if (!BOOKS[book]) throw new Error(`livre inconnu : ${book}`);
  return { book, num: BOOKS[book], chapter: Number(chapter), from: Number(from), to: Number(to || from) };
};

const cache = new Map();
const chapterOf = async (translation, num, chapter) => {
  const key = `${translation}/${num}/${chapter}`;
  if (!cache.has(key)) {
    const res = await fetch(`${API}/${key}.json`);
    if (!res.ok) throw new Error(`${key} : ${res.status}`);
    cache.set(key, await res.json());
  }
  return cache.get(key);
};

const textOf = async (translation, ref) => {
  const { num, chapter, from, to } = parseRef(ref);
  const data = await chapterOf(translation, num, chapter);
  const verses = (data.verses || []).filter((v) => v.verse >= from && v.verse <= to);
  if (!verses.length) throw new Error(`versets absents : ${translation} ${ref}`);
  return verses.map((v) => v.text.replace(/\s+/g, " ").trim()).join(" ");
};

const run = async () => {
  const out = [];
  for (const theme of THEMES) {
    const verses = [];
    for (const ref of theme.refs) {
      const fr = await textOf("ls1910", ref);
      const mg = await textOf("mg1865", ref);
      verses.push({ ref, fr, mg });
      process.stdout.write(".");
    }
    out.push({ key: theme.key, label: { fr: theme.fr, mg: theme.mg }, verses });
  }
  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/verses.json", JSON.stringify({
    source: "getbible.net v2, Louis Segond 1910 (fr) et Baiboly Malagasy 1865 (mg), domaine public",
    builtAt: new Date().toISOString().slice(0, 10),
    themes: out,
  }, null, 1) + "\n");
  console.log(`\n${out.length} thèmes, ${out.reduce((n, t) => n + t.verses.length, 0)} passages écrits dans src/data/verses.json`);
};

run().catch((e) => { console.error(e.message); process.exit(1); });
