# Audit — home page (`src/pages/index.html`)

Figma desktop `63:4340` ("Sollisero Home · EN · Deck style · Desktop 1920"), file key
`GqV9zPNuDtmj8DHBy8C6YK`. Geometry read with `get_metadata` and compared against the build
with `tools/measure.py`, which reports element rects relative to a reference element so they
line up with Figma frame coordinates.

Section heights before and after this pass:

| section | Figma | before | after |
|---|---|---|---|
| Hero | 924 | 858 (−66) | 922 (−2) |
| About | 2077 | 1745 (−332) | 2075 (−2) |
| Products | 2884 | 3073 (+189) | 2914 (+30) |
| Engagement models | 1039 | 1016 | 1016 (−23) |
| Industries | 1113 | 1112 | 1112 (−1) |
| Expertise | 1138 | 1138 | 1138 (0) |
| Clients | 657 | 658 | 658 (+1) |
| Security & compliance | 743 | 744 | 744 (+1) |
| CTA | 906 | 907 | 907 (+1) |
| Careers band | 527 | 508 | 508 (−19) |

## About · Global presence — the map was missing (−284 of the −332)

Figma `270:19047` is Header (80) / **World map · Cities of presence** (`347:6658`, 1678 × 410)
/ Countries (145), 24 px apart. The build had an invented 96 px time-zone ruler in the map's
place — an axis with tick marks and country pins that exists nowhere in the design.

Replaced with the design's map:

- The landmass artwork (`347:6659`, 1044 × 406 at 317,2 inside the map frame) is exported
  from Figma as a transparent PNG → `src/static/img/world-map.png`. It is a single flat
  `#E5E9F1` silhouette. **1× only**, for the same reason as the cash-solutions POS terminal:
  `get_screenshot` does not upscale and `figma.com` is blocked from this container, so the
  SVG behind it cannot be fetched.
- The six cities are **live text**, not baked into the image, positioned from the Figma
  coordinates as percentages of the 1678 × 410 frame so the whole block scales with the
  column: Detroit, London, Yerevan, Abu Dhabi, Tashkent, Hong Kong. Pin `#2246BD` (=`--brand`,
  exact match), halo, label chip on white, leader lines `#A2B2DE` drawn in one SVG whose
  endpoints are derived from each leader's bounding box and the label edge it meets.
- Labels shrink below 1100 px and drop below 700 px, where the country list underneath
  carries the same information.

Two spacing defects in the same block: the gap between header / map / countries was 40 where
Figma has 24, and `.presence` sat 16 px below the key figures where Figma has 64.

## Hero — missing bottom padding (−66)

`63:4341` is 924 tall: nav 40…109, Hero·Main 109…644, the product strip 644…860, then 64 px
of air. The build's strip ended flush with the section. Both inner blocks already measured
exactly right (533.5 vs 535, 216 vs 216) — only the 64 was missing. Same defect as the
cash-solutions hero.

## Products — row padding, column ratio and the visual box (+189)

Figma `63:6335`: the row is padded **49**, the copy column is **801**, the visual is a fixed
**797 × 465** window at x=914, and there are **64** between the columns. The copy sets the row
height — the visual is centred against it (verified: in both the ATM and cash-solutions rows
the copy's vertical centre and the visual's coincide). Rows are **24** apart, and the home
page carries **four** products, not seven.

The build had `gap:48`, equal `1fr 1fr` columns, `gap:16` between rows, and no height on the
visual — so each mock, scaled to the full column width, came out 486–575 tall and drove the
row instead of the copy. Fixed: 801fr/797fr, 64 gap, 24 between rows, and `.pvis` pinned to
`aspect-ratio:797/465` with the mock fitted inside it (the scaler's `contain` mode).

Note on the crop: Figma lets the mock bleed past the visual frame (the ATM mock is 652 × 502
in a 797 × 465 window, cropped top and bottom). Clipping ours the same way cut the "60+ device
types supported" callout off, because our mocks are drawn at different proportions than
Figma's, so they overflow much further. `contain` keeps every element visible at the cost of
the bleed.

### Still open

- **The ATM product visual is a different drawing.** Figma shows the kiosk in 3/4 perspective
  with a blue glow behind it; the build draws it flat, front-on. Composition, callouts and the
  overlapping withdraw-cash window all match — the kiosk body itself does not.
- Engagement models (−23) and the careers band (−19) are within what the font substitution
  explains; see the note in `audit-cash-solutions.md` about webfonts not loading in this
  container.

---

## 2026-11-10 — products section reworked outside the repo, ported back

An edited single-file build of the home page was handed back and ported into source. It was
produced from this repo's standalone export, so the day's Figma work is present in it (checked
before porting: `wm-base` / `wm-pin` world map, `aspect-ratio:797/465`, the `801fr` product
column — all with unchanged counts). **Nothing was removed** on either CSS layer; the edit is
additive plus a few retuned rules.

What changed:

- **The products section is now a bento accordion** — one expanded card with its mock and six
  collapsed ones, plus a "not sure which fits?" CTA card (`.bento`, `.brow`, `.bcard`, `.bhit`,
  `.bcopy`, `.btitle`/`.bdesc` with `on-open` / `on-shut` label variants, `.barrow`, `.bvis`).
  46 new page-level selectors. The section is 1246 tall where the Figma frame has 2884; the
  frame describes the four-row layout it replaces, so that delta is the redesign, not a defect.
- **Five product screenshots** arrived embedded as base64 (`.mockshot`, 580 × 456 each). They
  are now files under `src/static/img/mock-*.png` and referenced by path — a 675 KB HTML file
  was mostly those data URIs. They are 1×, so they will be soft on retina.
- Shared: a `.win.light.wd` variant that forces dark chrome back onto a light window; `.ico`
  loses its border; the footer gets a taller bottom clamp and a bigger wordmark.
- Shared `components/hero.js`: the hero dot field is retuned to the design — grid 38, cone
  falloff centred at 69 % / 50 % with radius 0.727 W, flatter alpha.

**The hero bottom padding needed the same care as the other two pages.** The export predates
the shared `.hero{padding-bottom:clamp(48px,4.5vw,80px)}` merged earlier that day, so its page
stylesheet still carried `.hero .wrap{padding-bottom:64px}` — which *stacks* on the shared rule
instead of replacing it and pushed the hero to 1002. Rewritten as `.hero{padding-bottom:64px}`;
re-measured at 922 against the frame's 924.

Verified after porting: the rebuilt page markup and page script reproduce the upload exactly,
and the only app-bundle differences are the earlier dspm / cash-solutions merges the export
could not have known about. `build --check`, the 31-check e2e suite, and no overflow, broken
images or console errors across ten pages at 375 / 768 / 1200 / 1440 / 1920.
