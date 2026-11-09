# Audit — cash solutions (`src/pages/cash-solutions.html`)

Figma desktop `60:2776`, mobile `60:4077`. File key `GqV9zPNuDtmj8DHBy8C6YK`.

## #hardware (Figma `60:3239`, illustration `144:12547`)

- Figma: two device drawings side by side. **Front view** (`151:15780`) — POS terminal, dark
  printer lid over purple body, receipt paper exiting the top, a converging scan-beam funnel
  onto the scanner window, NFC zone bar, payment screen, side keys, magstripe groove + swipe
  arrow on the right, chip slot with card and insert arrow at the bottom. **Inside view**
  (`151:15898`) — paper roll "58 mm · Ø40", print head, NFC coils, rear camera + 2D scanner,
  main board (CPU / RAM / eMMC / 4G / Wi-Fi BT GPS), tamper-mesh dashed box enclosing a white
  **SECURE** chip, Speaker · Mic, battery "5150 mAh · 3.7 V" with SIM/SAM/SAM/SD slots,
  magstripe head, 2×4 chip-reader contacts, USB-C. 19 callouts + caption line below.
- Build: all 19 callouts, both devices and every spec line were already present and correct
  (verified each callout string against `get_metadata` — all verbatim matches).
- Verdict: **FIXED** — four defects:
  1. **Secure processor chip rendered as a blank white box.** `<div class="sec">SECURE</div>`
     collided with the global section rule `.sec{padding-block:var(--sec)}` in `layout.css`;
     the page rule never set `padding`, so the box inherited full section padding and pushed
     its dark-ink "SECURE" label far outside, invisible against the navy background.
     Renamed the class to `.secp` in the page HTML and CSS.
  2. **Scan beam had parallel sides.** Figma draws three vectors — a 54 px top line and two
     beams converging to an 18 px gap at the scanner window (`151:15885-7`). The build used
     `border-left`/`border-right` on a plain box, i.e. a straight 54 px channel. Rebuilt as a
     top line plus two rotated 1 px edges (±19.8°, the exact Figma taper).
  3. **Caption clipped.** `// Typical configuration of this device class…` sat inside `.sch`
     at `bottom:-10px`, but `.fit-view` is `overflow:hidden` with `aspect-ratio:1760/770`, so
     it was cut off. Moved it out of the `.fit-view` to a sibling of the scaled diagram.
  4. **Magstripe groove** was dark (`#1f2030`) with an accent border; Figma fills it with the
     accent purple. Swapped fill and border.

### Left alone in #hardware
- Figma's phone screen ends in a small grey gesture-bar pill (`201:12751`); the build's screen
  stops after the "Accept $20.00" button. Cosmetic detail, not a structural part, and the
  `.pos .scr` block is shared with the hero and mobile fallback — skipped.
- Tab panel eyebrow reads `[ 01 / 06 ]  PAYMENTS` in Figma, `[ 01 / 06 ] Payments` in the
  build. That eyebrow is the shared `.adv` tabs component used on several pages — out of scope.

## #use-cases (Figma `60:3252`)

- Figma: four cards in one row — a POS phone on a tinted panel, then three browser windows
  (`cash.sollisero / inventory`, `/ returns`, `/ reports`), each caption below; then the
  `[ Interfaces ]` stage with five phones ("Start a sale" → "Finish the sale") on arcs.
- Verdict: **FIXED** — five defects. (The 2×2 grid at 1440 is a deliberate responsive step;
  at 1920 the build is 4-up like Figma. Verified.)
  1. **Card 01 phone overflowed its card.** `.pos-in` scales to ~338 px inside a 300 px
     `.win`, and `.uc .win-screen` had no `overflow`, so the phone spilled onto the page.
     Figma clips it at the card edge. Added `overflow:hidden`.
  2. **Returns table had invented numbers and a missing row.** Against Figma `60:3351`:
     #37 items 2→3, #36 items 4→12, #34 row was `1:41 PM / Main Street / 3 / Card` but Figma
     has `1:31 PM / Corner Store / 5 / Cash`, #33 items 5→9 and Cash→Card, #32 items 2→1 and
     Card→QR pay, and the 8th row `Nov 6, 12:30 PM · #31 · Main Street · Fred Bones · 4 · Cash`
     was absent. All corrected.
  3. **Inventory catalog was missing most of its structure.** Figma (`201:11355`) has a
     "Categories" header with a + button and per-category counts, a toolbar (Search name or
     SKU / All stores), a table header row (Item / Category / VAT / Price), row checkboxes and
     a `SKU · store` sub-line under each item name. The build had a bare name/category/VAT
     table and a plain category list. Rebuilt with all of those.
  4. **Wrong catalog numbers**: "748 items · 4 stores" → "198 items · 4 stores" (and the count
     is a sub-line under "Catalog", not inline); "Exotic fruit · 24" category was missing;
     Banana Nut Cake category "Bakery" → "Bread & bakery". SKUs/prices taken from Figma.
  5. **Reports card layout was wrong.** Figma puts "Top-selling items" in its own full-width
     panel *below* the revenue chart and the payment-methods donut; the build nested it inside
     the left panel. Moved it to a `grid-column:1/-1` panel. Also added the chart's y-axis
     ($0/$400/$900/$1,200) and x-axis (07:00…22:00) labels, the dashed 18:00 marker line, the
     peak dot and the `18:00 / $1,310` tooltip — all in Figma, none in the build.

### Checked and already correct
- All five stage phone screens match Figma verbatim (`201:12211/12291/12372/12468/12512`):
  shift pill, the three KPIs, Settings row, "24 in stock"/"11 in stock", the steppers,
  `Subtotal · 7 items` / `Discount −$1.00` / `$17.85`, `Txn 10234`. I had misread several of
  these from the downscaled PNG; Figma metadata confirmed the build was right, including
  `$3.99/kg × 1.254 kg`.

## #hero (Figma `60:2777`)
- Figma: `cash.sollisero / analytics` portal window behind a photo-real white POS terminal
  render, plus the pills "MERCHANT PORTAL · SALES & STOCK" and "POS APP ON ANDROID DEVICES".
- Build: same portal window — sidebar (sollisero, Analytics/Catalog/Receipts/Stores/Employees/
  Registers/Settings), "Analytics / Today, Nov 6, 2026 · All stores", Export report, the
  All stores + Today/Yesterday/Week/Month/Quarter + date filter row, the four KPI tiles
  ($12,480 −10% / $34.60 +4% / 361 −8% / $186, 2 receipts today), Revenue by hour, Payment
  methods donut ($12,480 Total; Card $4,990 40% / QR pay $3,750 30% / Cash $3,740 30%) and the
  "Units sold today" strip. Both pills present. Phone shows the "Start a sale" screen, as Figma.
- Verdict: **MATCH**. The one difference is that Figma's foreground device is a white 3D
  product render while the build draws the flat blue CSS POS used elsewhere on the page. Per
  the brief, un-downloadable rasters are meant to be rebuilt in HTML/CSS and judged on
  structure/content/colour, so I left it — see "needs a decision" at the end.

## #capabilities (Figma `60:3221`)
- Figma: four cards (Checkout at the counter / Merchant portal / Analytics and reporting /
  Inventory and stock), each a window mockup with three labelled nodes feeding a highlighted
  bar, card 01 also feeding four nodes below, plus a `//` caption.
- Build: identical structure, labels, sub-labels, connector lines and captions.
- Verdict: **MATCH**. Only nits: card 01's header icon is a monitor in the build vs a
  register/printer glyph in Figma, and the build's window has more empty space below the
  diagram. Neither is a structural or content difference; left alone.

## #analytics (Figma `213:7929`)
- Figma: `cash.sollisero / analytics / stores` window — sidebar, Analytics header + Export
  report, filter row, four KPI tiles, then "Revenue by store" (Main Street $4,830 / Corner
  Store $3,120 / Foods 24/7 $2,210 / Doner 42 $1,480 / Market Square $840) and "Revenue by
  category" (Dairy $2,940 / Drinks $2,610 / Bread & bakery $2,080 / Fruit $1,860 / Ready meals
  $1,320) bar panels.
- Build: every tile, bar, label and figure matches Figma exactly.
- Verdict: **MATCH**, with two additions the build makes that Figma does not have —
  see NEEDS-DECISION below.
- NEEDS-DECISION: the build adds (a) an amber "⚠ Product ranking shifted · check Drinks"
  banner floating over the KPI row and (b) a "MB · Maria Bell · Sweet Life LLC" account chip
  at the foot of the sidebar. Neither is in Figma. (a) illustrates the adjacent "Attention
  prompts" paragraph, so it looks deliberate rather than accidental, but it overlaps the
  Refunds tile. I did not delete either — removing content that supports the body copy is a
  design call, not an obvious defect.
- Minor, outside mockup scope: Figma puts the lead paragraph at the top right beside the H2;
  the build stacks it under the H2 on the left. Section chrome, not an illustration — left alone.

## #problem (Figma `60:2892`)
- Figma: Cash register → MANUAL RECONCILIATION → Sales; POS terminal → SEPARATE HISTORY →
  Transactions; Stock count → TAKES SEVERAL DAYS (red) → Price tags (red), on a dotted field,
  with the "disconnected process / point of sale" legend, three challenge cards and the
  [ SOLUTION ] block.
- Build: identical. Verdict: **MATCH**.

## #industries (Figma `213:6303`)
- Six cards (Stores, Delivery services, Pharmacies, Restaurants and cafés, Beauty salons,
  Transport) with their bullet lists, plus the dark "One store or a whole chain" band with
  Stock transfers / Shared catalog / Shared customer base. Verdict: **MATCH**.

## #integrations (Figma `217:12403`)
- Six cards with status pills, plus the dark band (English, USD, EUR and AED / Set up at your
  request / Custom development). Verdict: **MATCH**.
- One uncertainty I did not act on: the "Loyalty programs" status pill is amber
  ("IN DEVELOPMENT") in the build and looks purple like the others in Figma, but at the
  resolution Figma renders that pill I could not read it reliably, and amber is a sensible
  semantic. Flagging rather than guessing.

## #getting-started (Figma `217:12527`)
- Five step cards (Discuss your business → Go live) in a single row plus the 24/7 block.
  Verdict: **MATCH** — the build is 5-up at 1920 like Figma (it reflows to 3+2 at 1440, a
  responsive step).

## #why (Figma `213:6916`, tabs component `60:4935`)
- Figma: three cards (Quick start / Easy to use / We know payments — the last one dark), then
  four cards (Support 24/7 / Languages / Support channels / Warranty and replacement), then
  the stats 15+ / 800+ / 150+.
- Build: same cards and copy, 3-up then 4-up at 1920.
- Verdict: **FIXED** — the three stat counters were written as
  `<b data-count="15" data-suf="+">0</b>`, i.e. their resting/no-JS value was **0**, so Figma's
  15+ / 800+ / 150+ only ever appeared after the count-up animation ran. The `count-up`
  component's own contract says "final value in markup = no-JS fallback". Put the real values
  in the markup; the animation still overwrites them on scroll.
  (`src/pages/careers.html` has the same `>0<` pattern on four counters — out of my scope,
  worth fixing by whoever owns that page.)

---

## #hero (Figma `60:2777`, 1920 × 1229) — pixel-level pass

Measured with `tools/measure.py PAGE WIDTH REF_SELECTOR sel…`, which reports element rects
relative to a reference element so they compare directly against Figma frame coordinates.

Figma geometry: nav 40…109 · Hero·Main 109…961 (852 tall) · Stats 961…1165 (204) · 64 bottom
pad. Copy (900 × 549) and Mockup (857 × 660) are centred inside the 852 block, which is what
produces Figma's 151.5 / 96 top offsets — so `min-height:852px` + `align-items:center`
reproduces both offsets without hard-coding either.

Fixed:

1. **Hero was 193 px short** (1036 vs 1229). `.hero-grid` used `padding:96px 0 64px` with a
   560-tall visual column; now `min-height:852px`, `.hero-vis{height:660px}`, and the 64 px
   bottom pad moved onto `.hero .stats`. Copy block was 47–50 px high throughout; stats 132 px.
2. **Hero illustration was the wrong object.** The build drew a flat blue CSS phone
   (`.pos-wrap > .pos.sm`); Figma has a white isometric POS terminal, `201:12665`, 586.3 × 370.2
   at −60,335 in the mock frame. Exported the node with `get_screenshot contentsOnly:true`,
   cropped to its alpha bbox (576 × 360) → `src/static/img/pos-terminal.png`, placed at
   −6.3% / 51.67% / 67% of `.hero-vis` (= 929, 546, 574.3 at 1920, matching the Figma artwork
   bbox to within a pixel). **The export is 1×** — `get_screenshot` never upscales past the
   node's natural size, and `figma.com` is blocked from this container's egress proxy so the
   SVG/2× asset URLs from `download_assets` cannot be fetched. Allowing `www.figma.com` would
   let this be a crisp vector instead.
3. **Mock frame was 37 px narrow and 100 px short** — now 857 × 660 at x 983.
4. **Portal window was 562 tall, Figma 500** (chrome 58 + screen 440). The `data-h` on the
   `.fit-view` and the inline `.win-screen` height were both stale.
5. **Window chrome was the light variant**; Figma's is dark indigo `#2F296F` over a white
   screen. Scoped to `.hero-vis .portal.win.light`.
6. **The whole portal UI was off-metric.** Figma authors it as `Cash/UI/Portal · Analytics`
   (`137:12635`) at **758 × 551.13**, clipped by the 440-tall screen — so the sidebar profile
   chip (y 509) and all but the first row of the top-selling list fall outside the window *by
   design*. The build had `.pt{height:100%}`, which squeezed 551 px of layout into 440 and
   inflated every row (sidebar nav pitch 30.8 vs 27.37, KPI card 85 vs 73.58, sidebar 150 vs
   130.54). Rewrote the `.pt*` block against the Figma numbers and set `.pt{height:551.13px}`
   so the clip is the design's clip. **Do not restore `height:100%`.**
   - An earlier audit recorded "Maria Bell chip is not in Figma" — it *is* (`193:8391`), it is
     simply below the clip line. Keep it.
7. **Payment-methods card had the wrong layout and palette.** Figma stacks donut over a
   full-width legend (Donut wrap y 31.95, Legend y 135.12); the build put them side by side,
   which wrapped "QR pay". Segment colours: Card `#2450D6` ✓, QR pay `#1A9E8F` (was `#12A150`),
   Cash `#C2410C` (was `#F5A524`).
8. **Revenue-by-hour area fill rendered as solid blue.** `.in .spark .area{opacity:1}` — a CSS
   `opacity` declaration overrides the SVG `opacity=".12"` presentation attribute. Now
   `opacity:.12`. This was a real production bug, not a screenshot artefact.
9. **Top-selling list had 4 rows, Figma 8**, with bar lengths as explicit px (400.06 … 184.24)
   so each count sits just past its own bar, as in the design.
10. **Stats columns**: Figma's first column is narrower (564.67 / 597.67 / 597.67 with 33 px
    inner pad) so the icons land at 80 / 677.67 / 1275.33, not on equal thirds.
11. Callouts: merchant-portal pill `right:30px;top:4px`; POS-app pill `left:-70px;top:330px`.

Result: mean absolute pixel difference across the full 1920 × 1229 hero **16.3 → 11.1**, with
no block above 25. The residual is concentrated in the headline and the background texture and
is **not** closable here: the brand webfonts do not load in this container (`Manrope` measures
identically to `serif`; `document.fonts` is empty), so glyph shapes and text wrapping differ
from Figma's render. Allowing `fonts.googleapis.com` / `fonts.gstatic.com` would make a literal
text diff meaningful.

## #problem (Figma illustration `60:2900`, 780 × 520)

Structure, copy, chips and legend already matched. Fixed: every dashed connector in Figma is
the brand violet `#493FD6` (`--vivid`), including the row whose chip is red; the build drew
rows 1–2 in `--accent` (`#5579EB`, the default blue — the `cash` theme never sets `--accent`)
and row 3 in red. `.diagram .route`, `.dnode i` and the legend swatches now use `--vivid`.

## Section heights vs Figma (1920)

| section | Figma | build | Δ |
|---|---|---|---|
| Hero | 1229 | 1232 | +3 |
| Problem | 1477 | 1525 | +48 |
| Capabilities | 1712 | 1715 | +3 |
| Hardware | 1822 | 1825 | +3 |
| Use cases | 1604 | 1652 | +48 |
| Industries | 1209 | 1233 | +24 |
| Analytics | 1314 | 1297 | −17 |
| Integrations | 1037 | 1066 | +29 |
| Getting started | 842 | 810 | −32 |
| Why | 1036 | 1028 | −8 |
| FAQ | 1651 | 1489 | **−162** |
| CTA | 906 | 907 | +1 |

FAQ is the one section still materially off and is the obvious next target; the ±48 on Problem
and Use cases is within what the font substitution alone can explain, FAQ's −162 is not.

---

## Product theme — the root cause behind "the illustrations don't match"

Reading the Figma "Product theme" variables off node `60:3221` with `get_variable_defs`:

```
theme/heroA  #4a3fd6   theme/heroB    #2c2399   theme/accent #5b50e8
theme/deep   #15113f   theme/surface2 #1a1550   theme/surface #221c66
theme/tintText #c4bffb
```

`body[data-product="cash"]` was setting **only** `--vivid`, `--vivid-deep` and `--hero-bg`.
Everything else — `--accent`, `--pale`, `--ink`, `--surface-dark`, `--surface-dark-2`,
`--screen` — fell through to the generic Sollisero blue in `tokens.css`. That is why the
drawings read as "not the design": the geometry was mostly right, the palette was a different
product's. Measured before the fix: section background `#060B22` vs Figma `#15113F`, card
surface `#0C1433` vs `#1A1550`, capability bars `#082DAB` vs `#3B31B7`, dimmed headline
`#C2D1F5` vs `#C4BFFB`.

The theme now carries the full set, matching the pattern the `meetly` and `bim` themes already
used. Verified after: section background and gradient sample **exactly** equal to Figma's
render; hero mean pixel difference fell 11.1 → **8.3**.

Three more defects surfaced while checking the palette:

- **`--hero-a` was never defined anywhere in the stylesheets**, so `.callout i` resolved to an
  invalid value and every hero callout rendered with an invisible dot. Figma's `theme/heroA`
  is `--vivid`.
- `.flow .plat` (the highlighted capability bars) was painted from `--brand`/`--brand-deep`,
  the corporate blue, not the product indigo.
- `.stage svg.arcs` and four other page rules hard-coded `rgba(85,121,235,…)`, the *default*
  accent, so they ignored the theme entirely. Figma draws those arcs in `theme/accent`
  `#5B50E8`. Replaced with `color-mix(in srgb, var(--accent) N%, transparent)`.
- The second payment-methods donut (`#use-cases` card 04) still carried the old green/amber
  segments; unified with the hero on Figma's `#2450D6 / #1A9E8F / #C2410C`.

Sections re-verified against their Figma nodes after the change: `#capabilities` (`60:3221`),
`#hardware` (`60:3239`), `#use-cases` (`60:3252`), `#problem`, `#hero`.

### Still open on this page

1. **`#use-cases` card 01 — the checkout mock is a different screen.** Figma (card `01 //
   CHECKOUT`) shows "Sale #58" with a scan-icon search field and item rows carrying quantity
   steppers (− 2 +) and an "Edit weight" button, with the device drawn larger and cropped by
   the card. The build shows a simpler row list with a `$17.85` total and a smaller device.
2. **`#use-cases` card 04 and the `#analytics` window render their inner UI larger than Figma**
   — the same class of defect fixed in the hero portal (component authored at one scale, built
   at another). The hero fix only covers `.pt` inside `.hero-vis`.
3. **FAQ is 162 px shorter than Figma** — the one section whose delta font substitution cannot
   explain.

---

## Closing the three open items

### FAQ — was −162 px, now +1

11 items in both; nothing was missing. Figma `FAQ/Item` (`60:3435` …) is **105 tall on a 113
pitch** (8 px gap), first item open at 179. The shared component rendered 97 with no gap, so
each of the ten collapsed items lost 16 px. Corrected in the page stylesheet (header padding
28 → 32, answer bottom padding 28 → 23, 8 px gap on the list) rather than in
`components/faq.css`, because the other seven product pages were not checked against their own
frames — the same correction very likely applies there and is worth a follow-up.

### use cases, card 01 — the device was at the wrong scale

Figma `201:11261` draws the POS device **190 × 443.33** at (112, 22) inside a 414 × 298 screen,
i.e. the shared `.pos` (260 × 607) at **0.7308**, centred, and clipped by the card. The build
used `scale(.52)`. The screen content was never wrong — "Sale #38", the scan search field, the
quantity steppers and "Edit weight" were all already there and all match the Figma strings;
they were simply rendered too small to read. One `scale()` value fixed it: measured after,
193 / 443.9 / 190 × 443.6 against Figma's 193 / 443.9 / 190 × 443.33.

### use cases card 04 and #analytics — inner UI rendered at the wrong scale

Both mocks embed the **same** portal component the hero uses, at a different size, and the
build had reimplemented each by hand instead:

- **Card 04** (`60:3397`): screen 414 × 238, instance at (−109.119, −152.84) sized 633.6 ×
  460.68 = **758 × 551.13 at 0.835884**. The x offset is exactly the 130.54 sidebar width, so
  the crop starts where the sidebar ends and lands on Row 2 — which is why the design shows the
  revenue chart, the donut and the top of the top-selling list and nothing else. Replaced the
  bespoke `.mini-portal` with the real `.pt`, positioned and scaled to those numbers.
- **#analytics** (`213:7961`): mock 1100 × 545, chrome 58, screen 1098 × 485, instance 1098 ×
  798.34 = the same component at **1.448549**. The build stretched `.pt` to 1098 px wide while
  leaving its internals at 758-space metrics, so the sidebar stayed 130.5 where Figma has
  189.1. Now scaled; `.pt-kpis` measures 847.9 against Figma's 847.9.
- That window also wears a dark chrome in Figma (`#221C66`, as the hero's is `#2F296F`), not
  the light one.
- Removed a `.attn` toast ("Product ranking shifted · check Drinks") that exists nowhere in
  `213:7961` and sat on top of the Refunds KPI.

### What the remaining ±48 on Problem and Use cases is

Not a layout defect. In `#problem` every structural block lands within 1.4 px of Figma
(`prob` 223.2/520 vs 222/520, `chal` 807.2/138.2 vs 806/138, `solution` top 1009.4 vs 1008).
The entire delta is inside the solution card: its headline sits in a container measuring
**exactly 1246 px**, the same as Figma's text frame, at the same 36 px — but the substituted
font is wider and wraps to **three** lines (140 px) where Manrope takes **two** (94 px). 140 −
94 = 46 ≈ the +48 on the section. It will close by itself once the webfonts can load; nothing
to change in the markup.

### Section heights after this pass

Hero +3 · Problem +48 · Capabilities +3 · Hardware +3 · Use cases +48 · Industries +24 ·
Analytics −14 · Integrations +29 · Getting started −32 · Why −8 · FAQ **+1** · CTA +1.
