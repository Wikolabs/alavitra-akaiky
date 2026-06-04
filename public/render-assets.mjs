// One-shot asset generator — uses Sharp from landing-page/node_modules.
// Renders:
//   logo.svg (64x64)   → favicon-32.png, favicon-16.png, apple-touch-icon.png (180x180), favicon.ico
//   og-banner.svg      → og-image.png (1200x630)
//
// Usage:  node public/render-assets.mjs

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

async function svgToPng(svgPath, outPath, w, h) {
  const buf = await fs.readFile(svgPath);
  await sharp(buf, { density: 300 })
    .resize(w, h, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${path.basename(outPath)} ${w}x${h}`);
}

async function svgToPngOpaque(svgPath, outPath, w, h) {
  const buf = await fs.readFile(svgPath);
  await sharp(buf, { density: 300 })
    .resize(w, h, { fit: "cover" })
    .flatten({ background: "#FFFFFF" })
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${path.basename(outPath)} ${w}x${h} opaque`);
}

const logo = path.join(HERE, "logo.svg");
const banner = path.join(HERE, "og-banner.svg");

console.log("▶ Rendering favicons from logo.svg");
await svgToPng(logo, path.join(HERE, "favicon-32.png"), 32, 32);
await svgToPng(logo, path.join(HERE, "favicon-16.png"), 16, 16);
await svgToPng(logo, path.join(HERE, "apple-touch-icon.png"), 180, 180);
await svgToPng(logo, path.join(HERE, "icon-192.png"), 192, 192);
await svgToPng(logo, path.join(HERE, "icon-512.png"), 512, 512);

console.log("▶ Rendering OG image from og-banner.svg");
await svgToPngOpaque(banner, path.join(HERE, "og-image.png"), 1200, 630);

console.log("\n✅ All assets rendered into public/");
