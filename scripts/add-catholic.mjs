// Ajoute le versant catholique a src/data/media.json : messes et homelies en
// malgache, enseignement en francais, chapelets et chants de priere. Les titres
// et les chaines viennent d'oEmbed, jamais d'une reecriture.

import { readFile, writeFile } from "node:fs/promises";

const path = "src/data/media.json";
const data = JSON.parse(await readFile(path, "utf8"));

Object.assign(data.streams, {
  katolika: { fr: "Catholique malgache", mg: "Katolika malagasy", en: "Malagasy Catholic" },
  catholique: { fr: "Catholique francophone", mg: "Katolika frantsay", en: "French-speaking Catholic" },
  priere: { fr: "Prière et chapelet", mg: "Vavaka sy raozery", en: "Prayer and rosary" },
});

const ADD = [
  {
    id: "yTfv9rHKYHk",
    title: "Katolika Malagasy Grenoble - Lamesa Fankalazana ny Paka 2020",
    channel: "Serasera Katolika Malagasy Grenoble",
    stream: "katolika",
    lang: "mg",
    themes: ["gratitude", "solitude"],
    why: "Une messe de Pâques entière en malgache, célébrée par la communauté malgache de Grenoble.",
  },
  {
    id: "dx-O3N2fV3M",
    title: "Madagasikara - Lamesa Alahady 15 novambra 2015 fankalazana fiainana Voatokana",
    channel: "ARSIDIOSEZY ANTSIRANANA",
    stream: "katolika",
    lang: "mg",
    themes: ["gratitude", "decision"],
    why: "Une messe dominicale de l'archidiocèse d'Antsiranana, chants et liturgie compris.",
  },
  {
    id: "M2yUadQnsvc",
    title: "DIOSEZY FARAFANGANA/TORITENY  Mgr Clément Herizo Rakotoasimbola",
    channel: "Ravelomanantsoa Ravelomanantsoa",
    stream: "katolika",
    lang: "mg",
    themes: ["argent", "epuisement"],
    why: "Une homélie d'évêque enracinée dans la vie quotidienne à Madagascar.",
  },
  {
    id: "M_QlXwkBXFE",
    title: "Toriteny Mgr Pascal Andriatsoavina - Alahady 3 mey 2020",
    channel: "Heriniaina Eugene",
    stream: "katolika",
    lang: "mg",
    themes: ["doute", "decision"],
    why: "Une prédication dominicale d'une voix catholique connue à Antananarivo.",
  },
  {
    id: "mJ_QkzSWZL4",
    title: "Mgr Jean Pascal  Andriantsoavina   Ny BAIBOLY Katolika",
    channel: "TANIKO Madagascar",
    stream: "katolika",
    lang: "mg",
    themes: ["doute"],
    why: "Un enseignement clair sur la Bible catholique et ce qui la distingue.",
  },
  {
    id: "pQspWTPDZ7g",
    title: "Lamesa Alahady faha 24 mandavantaona   Laretiretin'ny Pretran'Ambositra",
    channel: "Tsiky Marcel R | Bible • Foi • Formation",
    stream: "katolika",
    lang: "mg",
    themes: ["famille", "gratitude"],
    why: "Une messe dominicale avec la méditation des prêtres d'Ambositra.",
  },
  {
    id: "gAbsKpOf7oY",
    title: "L'homélie du cardinal Bustillo lors de l'ordination épiscopale de Mgr Eric Bidot, évêque de #Tulle",
    channel: "KTO TV",
    stream: "catholique",
    lang: "fr",
    themes: ["decision"],
    why: "Une homélie sur la vocation et le service, prononcée lors d'une ordination.",
  },
  {
    id: "tkRO_VTyhgo",
    title: "L'Ordre de Saint Augustin - La spiritualité de Léon XIV",
    channel: "KTO TV",
    stream: "catholique",
    lang: "fr",
    themes: ["doute"],
    why: "Une entrée dans la spiritualité augustinienne, pour qui cherche à comprendre.",
  },
  {
    id: "2wpxLjw9FQs",
    title: "Messe du 13 septembre 2026 - Le Jour du Seigneur – Célébration complète",
    channel: "Le Jour du Seigneur",
    stream: "catholique",
    lang: "fr",
    themes: ["solitude", "gratitude"],
    why: "La célébration dominicale complète, pour suivre la messe quand on ne peut pas s'y rendre.",
  },
  {
    id: "Fjwlxl92Whg",
    title: "La véritable humilité c'est ...",
    channel: "Frère Paul-Adrien",
    stream: "catholique",
    lang: "fr",
    themes: ["colere", "pardon"],
    why: "Un format court sur l'humilité vécue au quotidien.",
  },
  {
    id: "NQZH7xI9Tg0",
    title: "Andao hiaraka hanao Raozery!!! (Mistery Mahafaly - Alatsinainy sy Sabotsy)",
    channel: "Vavaka Katolika",
    stream: "priere",
    lang: "mg",
    themes: ["peur", "maladie"],
    why: "Le chapelet des mystères joyeux récité en malgache, à prier en suivant la voix.",
  },
  {
    id: "YTgJtT3ktQU",
    title: "vavaka maraina katolika",
    channel: "Vavaka Katolika",
    stream: "priere",
    lang: "mg",
    themes: ["epuisement", "peur"],
    why: "Une prière du matin en malgache, courte, pour commencer la journée.",
  },
  {
    id: "q8lSAhZIm8Q",
    title: "Prier le chapelet de la divine miséricorde",
    channel: "AleteiaFR",
    stream: "priere",
    lang: "fr",
    themes: ["pardon", "maladie"],
    why: "Le chapelet de la divine miséricorde guidé pas à pas.",
  },
  {
    id: "r22uqhWdgOM",
    title: "Ô toi, l'au-delà de tout",
    channel: "Taizé - Topic",
    stream: "priere",
    lang: "fr",
    themes: ["deuil", "solitude"],
    why: "Un chant de Taizé méditatif, pour un temps de silence.",
  },
];

const known = new Set(data.videos.map((v) => v.id));
let added = 0;
for (const v of ADD) {
  if (known.has(v.id)) continue;
  data.videos.push(v);
  added += 1;
}

await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");

const byStream = {};
for (const v of data.videos) byStream[v.stream] = (byStream[v.stream] || 0) + 1;
console.log(`${added} ajoutées, ${data.videos.length} au total`);
console.log(byStream);
