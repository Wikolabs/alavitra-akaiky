// Regenere les images de inme.
//
//   logo.svg       -> favicon-16, favicon-32, apple-touch-icon, icon-192, icon-512
//   og-banner.svg  -> og-image.png
//
//   node public/render-assets.mjs
//
// Deux moteurs, et c'est voulu. Les icones ne sont que des aplats : sharp les
// rend parfaitement. L'image de partage porte du texte, et le moteur de sharp
// n'a pas les polices du site : il retombait sur une chasse fixe et mangeait
// les accents. On la rend donc dans un vrai navigateur, qui charge Cormorant
// Garamond et Inter comme le fait le site.
//
// Ni sharp ni playwright ne sont installes ici : ils vivent dans le projet de
// la page vitrine, et on va les chercher la-bas. Le chemin est reglable par la
// variable TOOLING si l'arborescence bouge.

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const PUB = path.dirname(fileURLToPath(import.meta.url));
const TOOLING = process.env.TOOLING || path.resolve(PUB, "..", "..", "..", "wikolabs");

let sharp, chromium;
try {
  const req = createRequire(path.join(TOOLING, "package.json"));
  sharp = req("sharp");
  ({ chromium } = req("playwright"));
} catch {
  console.error(
    `sharp et playwright sont introuvables dans ${TOOLING}.\n` +
      "Indiquez le bon projet : TOOLING=/chemin/vers/le/projet node public/render-assets.mjs"
  );
  process.exit(1);
}

async function icon(out, w, h) {
  const buf = await fs.readFile(path.join(PUB, "logo.svg"));
  await sharp(buf, { density: 400 })
    .resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUB, out));
  console.log(`  ok ${out} ${w}x${h}`);
}

console.log("Icones, depuis logo.svg");
await icon("favicon-16.png", 16, 16);
await icon("favicon-32.png", 32, 32);
await icon("apple-touch-icon.png", 180, 180);
await icon("icon-192.png", 192, 192);
await icon("icon-512.png", 512, 512);

console.log("Image de partage, depuis og-banner.svg, rendue au navigateur");
const svg = await fs.readFile(path.join(PUB, "og-banner.svg"), "utf8");
const html = `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>html,body{margin:0;padding:0;background:#17315C}svg{display:block}</style>
${svg}`;

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await tab.setContent(html, { waitUntil: "networkidle" });
await tab.evaluate(() => document.fonts.ready);
await tab.waitForTimeout(400);
await tab.screenshot({ path: path.join(PUB, "og-image.png") });
await browser.close();
console.log("  ok og-image.png 1200x630");

console.log("termine");
