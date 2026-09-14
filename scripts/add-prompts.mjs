// Ajoute a chaque situation un libelle anglais et trois phrases toutes faites
// dans les trois langues. Elles s'affichent dans la fenetre de conversation :
// on clique, la question part. Personne n'a a trouver ses mots pour commencer.

import { readFile, writeFile } from "node:fs/promises";

const path = "src/data/verses.json";
const data = JSON.parse(await readFile(path, "utf8"));

const EXTRA = {
  peur: {
    en: "Fear and anxiety",
    fr: [
      "J'ai peur de ce qui m'attend et je n'arrive plus a dormir.",
      "Une echeance approche et l'angoisse me serre la poitrine.",
      "J'ai peur pour quelqu'un que j'aime et je ne peux rien faire.",
    ],
    mg: [
      "Matahotra izay hitranga aho ka tsy afaka matory intsony.",
      "Manakaiky ny fe-potoana ary manery ny tratrako ny tebiteby.",
      "Matahotra ho an'ny olon-tiako aho nefa tsy misy azoko atao.",
    ],
    en_prompts: [
      "I am afraid of what is coming and I cannot sleep.",
      "A deadline is near and the anxiety grips my chest.",
      "I am afraid for someone I love and I can do nothing.",
    ],
  },
  deuil: {
    en: "Grief and loss",
    fr: [
      "J'ai perdu quelqu'un et je ne sais pas comment continuer.",
      "Tout le monde a repris sa vie, moi je suis reste au jour de l'enterrement.",
      "Je n'arrive plus a prier depuis ce deces.",
    ],
    mg: [
      "Namoy olon-tiana aho ka tsy hitako izay hanohizana.",
      "Efa niverina tamin'ny fiainany ny rehetra, izaho mbola ao amin'ny andro nandevenana.",
      "Tsy afaka mivavaka intsony aho hatramin'io fahafatesana io.",
    ],
    en_prompts: [
      "I lost someone and I do not know how to keep going.",
      "Everyone moved on, I am still at the day of the burial.",
      "I have not been able to pray since that death.",
    ],
  },
  solitude: {
    en: "Loneliness",
    fr: [
      "Je me sens seul meme au milieu des autres.",
      "Je viens de demenager et je ne connais personne ici.",
      "Personne ne m'a appele depuis des semaines.",
    ],
    mg: [
      "Manirery aho na dia eo afovoan'ny olona aza.",
      "Vao nifindra monina aho ary tsy misy fantatro eto.",
      "Tsy nisy niantso ahy nandritra ny herinandro maromaro.",
    ],
    en_prompts: [
      "I feel alone even in the middle of other people.",
      "I just moved and I know nobody here.",
      "Nobody has called me in weeks.",
    ],
  },
  epuisement: {
    en: "Exhaustion",
    fr: [
      "Je suis a bout, je n'ai plus de force pour rien.",
      "Je travaille sans arret et rien n'avance.",
      "Je me leve deja fatigue et la journee n'a pas commence.",
    ],
    mg: [
      "Reraka tanteraka aho, tsy manan-kery intsony na ho amin'inona.",
      "Miasa tsy an-kijanona aho nefa tsy misy mandroso.",
      "Efa vizaka aho vao mifoha, nefa mbola tsy nanomboka ny andro.",
    ],
    en_prompts: [
      "I am spent, I have no strength left for anything.",
      "I work without stopping and nothing moves forward.",
      "I wake already tired and the day has not started.",
    ],
  },
  argent: {
    en: "Money and work",
    fr: [
      "Je n'arrive plus a couvrir la fin du mois.",
      "J'ai perdu mon travail et je n'ose pas le dire chez moi.",
      "Une dette me suit et j'ai honte d'en parler.",
    ],
    mg: [
      "Tsy vitako intsony ny mandrakotra ny faran'ny volana.",
      "Very asa aho ary tsy sahy milaza izany any an-trano.",
      "Misy trosa manaraka ahy ary menatra aho hiresaka izany.",
    ],
    en_prompts: [
      "I can no longer make it to the end of the month.",
      "I lost my job and I dare not say it at home.",
      "A debt follows me and I am ashamed to speak of it.",
    ],
  },
  famille: {
    en: "Family",
    fr: [
      "Ma famille se dechire et je suis au milieu.",
      "Mon enfant ne me parle plus.",
      "Je n'arrive plus a pardonner a un proche.",
    ],
    mg: [
      "Mifamotsitra ny fianakaviako ary izaho no eo afovoany.",
      "Tsy miresaka amiko intsony ny zanako.",
      "Tsy vitako intsony ny mamela heloka olona akaiky.",
    ],
    en_prompts: [
      "My family is tearing apart and I am in the middle.",
      "My child does not speak to me any more.",
      "I cannot forgive someone close to me.",
    ],
  },
  maladie: {
    en: "Illness",
    fr: [
      "Je suis malade depuis longtemps et l'esperance s'use.",
      "Quelqu'un que j'aime est a l'hopital et j'ai peur.",
      "Les resultats arrivent bientot et je n'ose pas y penser.",
    ],
    mg: [
      "Efa ela aho no marary ary mihalany ny fanantenana.",
      "Ao amin'ny hopitaly ny olon-tiako ary matahotra aho.",
      "Ho avy tsy ho ela ny valiny ary tsy sahy misaina izany aho.",
    ],
    en_prompts: [
      "I have been ill a long time and my hope is wearing thin.",
      "Someone I love is in hospital and I am afraid.",
      "Results are coming soon and I dare not think about it.",
    ],
  },
  pardon: {
    en: "Forgiveness",
    fr: [
      "J'ai fait du mal a quelqu'un et je ne sais pas comment revenir.",
      "On m'a blesse et je n'arrive pas a lacher.",
      "Je me sens coupable de quelque chose de vieux.",
    ],
    mg: [
      "Nanisy ratsy olona aho ka tsy hitako izay hiverenana.",
      "Nisy nandratra ahy ary tsy vitako ny mamela izany.",
      "Manan-tsiny aho noho ny zavatra efa ela.",
    ],
    en_prompts: [
      "I hurt someone and I do not know how to go back.",
      "I was hurt and I cannot let it go.",
      "I feel guilty about something old.",
    ],
  },
  doute: {
    en: "Doubt",
    fr: [
      "Je ne sais plus si Dieu m'entend.",
      "Je crois et je doute en meme temps, c'est fatigant.",
      "J'ai arrete de prier sans decider de le faire.",
    ],
    mg: [
      "Tsy fantatro intsony raha mihaino ahy Andriamanitra.",
      "Mino sady misalasala aho miaraka, mahareraka izany.",
      "Nitsahatra nivavaka aho nefa tsy nanapa-kevitra hanao izany.",
    ],
    en_prompts: [
      "I no longer know whether God hears me.",
      "I believe and I doubt at the same time, and it is tiring.",
      "I stopped praying without ever deciding to.",
    ],
  },
  colere: {
    en: "Anger",
    fr: [
      "Je suis en colere et j'ai peur de ce que je pourrais dire.",
      "Une injustice me ronge depuis des mois.",
      "Je m'emporte sur mes proches sans le vouloir.",
    ],
    mg: [
      "Tezitra aho ary matahotra izay mety holazaiko.",
      "Misy tsy rariny mandany ahy hatramin'ny volana maro.",
      "Misafoaka amin'ny akaiky ahy aho nefa tsy tiako izany.",
    ],
    en_prompts: [
      "I am angry and afraid of what I might say.",
      "An injustice has been eating at me for months.",
      "I snap at the people close to me without meaning to.",
    ],
  },
  decision: {
    en: "Decision",
    fr: [
      "Je dois choisir et j'ai peur de me tromper.",
      "On m'offre quelque chose de bien mais je ne le sens pas.",
      "Je remets la meme decision depuis des mois.",
    ],
    mg: [
      "Tsy maintsy misafidy aho nefa matahotra ny hanao diso.",
      "Misy tolotra tsara natao tamiko nefa tsy mahazo aina aho.",
      "Efa volana maro no anemorako io fanapahan-kevitra io.",
    ],
    en_prompts: [
      "I have to choose and I am afraid of getting it wrong.",
      "I have a good offer but it does not sit right with me.",
      "I keep putting off the same decision, month after month.",
    ],
  },
  gratitude: {
    en: "Gratitude",
    fr: [
      "Quelque chose de bon m'est arrive et je veux rendre grace.",
      "Je veux apprendre a voir ce qui va bien.",
      "Je sors d'une periode dure et je respire enfin.",
    ],
    mg: [
      "Nisy soa nitranga tamiko ary te hisaotra aho.",
      "Te hianatra mahita izay mandeha tsara aho.",
      "Vao avy tamin'ny fotoan-tsarotra aho ary miaina ihany.",
    ],
    en_prompts: [
      "Something good happened and I want to give thanks.",
      "I want to learn to see what is going right.",
      "I am out of a hard stretch and I can breathe again.",
    ],
  },
};

let n = 0;
for (const theme of data.themes) {
  const extra = EXTRA[theme.key];
  if (!extra) throw new Error(`situation sans phrases : ${theme.key}`);
  theme.label.en = extra.en;
  theme.prompts = { fr: extra.fr, mg: extra.mg, en: extra.en_prompts };
  n += extra.fr.length + extra.mg.length + extra.en_prompts.length;
}

await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`${n} phrases ecrites sur ${data.themes.length} situations`);
