# FINOKRAFT — Logo Variants

**Brand:** FINOKRAFT · modular furniture
**Direction:** Architectural & premium *look*, accessible/mass-market *positioning* ("democratized design" — IKEA / Article / Tylko register), modularity expressed in the mark.
**Concept hook:** *Fino* (fine) + *Kraft* (craft) → **fine craft, modular system.**

This is decision material — 6 primary directions plus an app-icon and favicon fallback. Pick one and I refine it to production (clean construction, kerning, full color system, application library), then we move to the website.

> View everything: open `design/index.html` in a browser. Source vectors: `design/logo-variants/*.svg`.

## Color tokens

| Token | Hex | Role |
|---|---|---|
| Ink | `#1B1A18` | Primary — warm near-black (architectural, not cold) |
| Walnut | `#A06A3A` | Accent — wood warmth, signals craft + the "joint" module |
| Brass | `#C7A06A` | Secondary accent — premium highlight (used on dark) |
| Paper | `#F4F1EA` | Background — warm off-white |
| White | `#FFFFFF` | Reverse / clear space |

**Single-color black:** all marks collapse to `#1B1A18` on white (walnut/brass → ink). **Reverse:** ink fields → `#F4F1EA`, walnut → brass `#C7A06A`. Every mark is tested to survive both.

---

## 01 — Modular Grid F  ★ Recommended
- **Architecture:** Lockup (letterform-as-symbol + wordmark)
- **Typography:** Geometric/neo-grotesque sans, medium weight, +6 tracking. *Production type: Söhne / Neue Haas Grotesk / GT America.* (Render fallback: Helvetica Neue.)
- **Symbol:** Letterform-derived — the **F** built from 10 stacked square modules; one walnut "joint" module on the middle arm.
- **Color:** Ink wordmark + ink modules, single walnut accent.
- **Application:** Excels everywhere. The F-module **is** the favicon (16px) and app icon — no separate fallback needed. Embroideries cleanly (2 colors, no fine detail).
- **Signals:** Built from parts. Systematic, configurable, modern, made-with-care.
- **Rejects:** Decorative, hand-drawn, mass-produced anonymity.

## 02 — Joinery Seam
- **Architecture:** Lockup (abstract symbol + wordmark)
- **Typography:** Same sans system as 01.
- **Symbol:** Abstract gesture — two modules slotting together via a mortise-and-tenon seam (ink piece + walnut piece, visible kerf).
- **Color:** Ink + walnut, equal weight.
- **Application:** Strong at all sizes; favicon uses the seam square. Joint reads even at 16px.
- **Signals:** Connection, fit, craftsmanship, two-becomes-one.
- **Rejects:** Literal furniture depiction; the cliché chair/sofa icon.

## 03 — Stack
- **Architecture:** Lockup (literal/abstract symbol + wordmark)
- **Typography:** Same sans system as 01.
- **Symbol:** Three stacked rounded units (shelving / flat-pack), middle unit walnut.
- **Color:** Ink + walnut.
- **Application:** Most minimal and the most legible at tiny sizes. Reads as an abstract "E/F" + a shelf stack.
- **Signals:** Approachable, calm, modular shelving, easy.
- **Rejects:** Heavy/luxury seriousness — this is the warmest, most "accessible" of the set.

## 04 — Editorial Serif
- **Architecture:** Wordmark-led (wordmark + single module + descriptor)
- **Typography:** Transitional/old-style serif, regular weight, +3 tracking. *Production type: Canela / Lyon / Freight Display.* (Render fallback: Georgia.) Descriptor in tracked sans.
- **Symbol:** A single walnut module leads the name; "MODULAR FURNITURE" descriptor locked beneath.
- **Color:** Ink wordmark, walnut module, muted descriptor `#6B5B4A`.
- **Application:** Best for letterhead, signage, packaging, web header. **Favicon falls back to the 01 F-module** (serif wordmark can't reduce).
- **Signals:** Design-led, architectural, considered, editorial — the most "premium" register.
- **Rejects:** Cheap, trendy, generic-tech-startup.

## 05 — Stacked Block
- **Architecture:** Logotype / monogram-ish
- **Typography:** Sans, bold (700), two lines `FINO` / `KRAFT`, tight leading — forms a solid type block (a "module" itself). Walnut underline.
- **Color:** Ink + walnut.
- **Application:** Native square — excellent for social profile, app tile, stamp, merch. Pairs with 01/02/03 as the square-context alternate of a horizontal lockup.
- **Signals:** Solid, confident, blocky, architectural.
- **Rejects:** Delicate, ornamental.

## 06 — Configurator Grid
- **Architecture:** Lockup (literal modular symbol + wordmark)
- **Typography:** Same sans system as 01.
- **Symbol:** A 3×3 grid — filled ink modules + one walnut + **open outlined modules** ("configure your own").
- **Color:** Ink + walnut + ink outlines.
- **Application:** Strong on web/large; the open outlines thin out below ~24px, so **favicon falls back to 01's solid F-module.**
- **Signals:** Configurable, build-it-yourself, system, choice — the most *explicit* modularity statement.
- **Rejects:** Fixed/finished product; "one-size" furniture.

---

## Fallback hierarchy (any chosen direction)
- **Primary lockup:** the selected variant (horizontal).
- **Square / social / app icon:** `monogram-fk.svg` (modular F, cream-on-ink, brass accent) or variant **05**.
- **Favicon 16–32px:** `favicon-f.svg` (simplified F module).

## Production specs (top 3: 01, 04, 02)
- **Min sizes:** lockup 24px tall (digital) / 18mm (print); F-module favicon 16px; embroidery patch 1.5in (≤2 colors, no outlines → use solid variants 01/02/03/05, not 06).
- **Clear space:** one module-unit on all sides of the mark.
- **Motion:** modules assemble in sequence (build-in), settle into the wordmark reveal — literal "modular assembly" animation, on-brand.
- **Single-color & reverse:** provided per token table above; all pass the silhouette, single-color, and embroidery tests.

## Recommendation
**01 (Modular Grid F)** as the primary — it's the only direction where the symbol doubles as a flawless 16px favicon and app icon, it's the most distinctive silhouette, and it states the concept (modular + the F) in one move. Pair it with **05 (Stacked Block)** for square contexts. If you want the more upmarket, editorial feel to lead, **04** is the alternate primary, with 01's F-module as its small-size fallback.

## Next step
Tell me which direction to take to production (or a hybrid — e.g. "01's symbol + 04's serif wordmark"). Then I lock construction + kerning, export the full file matrix (SVG/PNG/PDF, color/black/white/reverse), and we start the website.
