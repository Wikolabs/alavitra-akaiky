// Retablit les accents francais dans les phrases toutes faites de
// src/data/verses.json. Elles avaient ete saisies sans accents, ce qui se lit
// mal dans une fenetre de conversation en francais. Le malgache et l'anglais
// ne sont pas touches.

import { readFile, writeFile } from "node:fs/promises";

const path = "src/data/verses.json";
const data = JSON.parse(await readFile(path, "utf8"));

const FR = {
  peur: [
    "J'ai peur de ce qui m'attend et je n'arrive plus à dormir.",
    "Une échéance approche et l'angoisse me serre la poitrine.",
    "J'ai peur pour quelqu'un que j'aime et je ne peux rien faire.",
  ],
  deuil: [
    "J'ai perdu quelqu'un et je ne sais pas comment continuer.",
    "Tout le monde a repris sa vie, moi je suis resté au jour de l'enterrement.",
    "Je n'arrive plus à prier depuis ce décès.",
  ],
  solitude: [
    "Je me sens seul même au milieu des autres.",
    "Je viens de déménager et je ne connais personne ici.",
    "Personne ne m'a appelé depuis des semaines.",
  ],
  epuisement: [
    "Je suis à bout, je n'ai plus de force pour rien.",
    "Je travaille sans arrêt et rien n'avance.",
    "Je me lève déjà fatigué et la journée n'a pas commencé.",
  ],
  argent: [
    "Je n'arrive plus à couvrir la fin du mois.",
    "J'ai perdu mon travail et je n'ose pas le dire chez moi.",
    "Une dette me suit et j'ai honte d'en parler.",
  ],
  famille: [
    "Ma famille se déchire et je suis au milieu.",
    "Mon enfant ne me parle plus.",
    "Je n'arrive plus à pardonner à un proche.",
  ],
  maladie: [
    "Je suis malade depuis longtemps et l'espérance s'use.",
    "Quelqu'un que j'aime est à l'hôpital et j'ai peur.",
    "Les résultats arrivent bientôt et je n'ose pas y penser.",
  ],
  pardon: [
    "J'ai fait du mal à quelqu'un et je ne sais pas comment revenir.",
    "On m'a blessé et je n'arrive pas à lâcher.",
    "Je me sens coupable de quelque chose de vieux.",
  ],
  doute: [
    "Je ne sais plus si Dieu m'entend.",
    "Je crois et je doute en même temps, c'est fatigant.",
    "J'ai arrêté de prier sans décider de le faire.",
  ],
  colere: [
    "Je suis en colère et j'ai peur de ce que je pourrais dire.",
    "Une injustice me ronge depuis des mois.",
    "Je m'emporte sur mes proches sans le vouloir.",
  ],
  decision: [
    "Je dois choisir et j'ai peur de me tromper.",
    "On m'offre quelque chose de bien mais je ne le sens pas.",
    "Je remets la même décision depuis des mois.",
  ],
  gratitude: [
    "Quelque chose de bon m'est arrivé et je veux rendre grâce.",
    "Je veux apprendre à voir ce qui va bien.",
    "Je sors d'une période dure et je respire enfin.",
  ],
};

const missing = [];
for (const theme of data.themes) {
  const fr = FR[theme.key];
  if (!fr) {
    missing.push(theme.key);
    continue;
  }
  theme.prompts.fr = fr;
}

await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(
  `${data.themes.length} situations relues, ${missing.length ? "manquantes : " + missing.join(", ") : "aucune manquante"}`
);
