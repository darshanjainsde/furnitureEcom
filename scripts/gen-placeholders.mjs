// Generates on-brand gradient placeholder images for seeded categories/products.
// These are replaced by real photos via the Business portal.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "seed");
mkdirSync(OUT, { recursive: true });

const GREEN = "#2E5E34";
const DEEP = "#1E3D22";
const WALNUT = "#A86A3D";
const CREAM = "#F4ECDD";

// label, two gradient stops, simple furniture glyph path (drawn in a 0..100 box, stroke)
const items = [
  ["Living Room", GREEN, DEEP, "M14,62 h72 v10 h-72 z M18,40 h64 a8,8 0 0 1 8,8 v14 h-80 v-14 a8,8 0 0 1 8,-8 z M22,62 v8 M78,62 v8"],
  ["Bedroom", WALNUT, "#6E3F1F", "M12,68 h76 M12,68 v-10 a6,6 0 0 1 6,-6 h28 v16 M52,68 v-16 h30 a6,6 0 0 1 6,6 v10 M20,52 v-8 h60 v8"],
  ["Kitchen & Dining", GREEN, WALNUT, "M22,30 h56 v40 h-56 z M22,44 h56 M34,30 v14 M50,30 v14 M66,30 v14 M34,52 h12 v12 h-12 z"],
  ["Modular Wardrobe", DEEP, GREEN, "M26,22 h48 v56 h-48 z M50,22 v56 M44,48 v8 M56,48 v8"],
  ["TV & Storage", "#3A3A34", GREEN, "M20,28 h60 v30 h-60 z M24,32 h52 v22 h-52 z M30,66 h40 v8 h-40 z"],
  ["Office & Study", WALNUT, GREEN, "M18,46 h64 v6 h-64 z M24,52 v22 M76,52 v22 M30,46 v-14 h40 v14 M44,60 a8,8 0 1 0 12,0"],
  ["Full Home Interiors", GREEN, CREAM, "M20,54 l30,-26 l30,26 M28,54 v22 h44 v-22 M44,76 v-14 h12 v14"],
  ["Pooja & Custom", WALNUT, CREAM, "M50,20 v8 M34,40 h32 l-4,34 h-24 z M40,40 a10,10 0 0 1 20,0"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (let i = 0; i < items.length; i++) {
  const [label, c1, c2, glyph] = items[i];
  const light = c2 === CREAM;
  const ink = light ? "#2B2A26" : "#F8F4EC";
  const safe = esc(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${safe}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g transform="translate(400 250) scale(4.2) translate(-50 -50)" fill="none" stroke="${ink}" stroke-opacity="0.55" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
    <path d="${glyph}"/>
  </g>
  <text x="400" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="56" fill="${ink}">${safe}</text>
  <text x="400" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="6" fill="${ink}" fill-opacity="0.8">FINOKRAFT</text>
</svg>`;
  const file = join(OUT, `${i + 1}-${label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}.svg`);
  writeFileSync(file, svg);
  console.log("wrote", file);
}
console.log("done");
