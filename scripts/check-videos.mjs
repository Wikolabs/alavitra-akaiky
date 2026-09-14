/* Revérifie que chaque message mis en avant vit toujours sur YouTube, et que le
   nom de chaîne enregistré correspond. Sort en code 1 si un lien est mort, pour
   que la CI le signale avant qu'un visiteur ne tombe dessus.

   Usage : node scripts/check-videos.mjs
*/
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("src/data/sermons.json", "utf8"));
let dead = 0;

for (const v of data.featured) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const j = await res.json();
    const same = j.author_name?.toLowerCase().startsWith(v.channel.toLowerCase().slice(0, 12));
    console.log(`${same ? "ok  " : "note"} ${v.id}  ${j.author_name}  ${j.title.slice(0, 60)}`);
  } catch (e) {
    dead++;
    console.error(`MORT ${v.id}  ${v.channel}  ${v.title}  (${e.message})`);
  }
}

for (const c of data.channels) {
  const res = await fetch(`https://www.youtube.com/channel/${c.id}`, { redirect: "follow" });
  if (!res.ok) { dead++; console.error(`MORTE ${c.id}  ${c.name}`); }
  else console.log(`ok   chaîne ${c.name}`);
}

console.log(dead ? `\n${dead} lien(s) à remplacer` : "\ntous les liens vivent");
process.exit(dead ? 1 : 0);
