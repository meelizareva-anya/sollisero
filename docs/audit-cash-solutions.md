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
