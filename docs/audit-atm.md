# Audit · Sollisero ATM (Figma 53:1901)

## #hero — kiosk scene (Figma `53:1927`: kiosk `104:817` + withdraw card `82:211` + 2 callouts)
- Figma: a 3/4 ATM kiosk whose screen is fully drawn — "sollisero" + ONLINE, a blue badge, a promo card
  (big circle + mini-kiosk graphic + "Withdraw money / without commission"), a 3×2 grid of blue tiles
  (Withdraw, Fill Up, Pay, Exchange, Transfer, Extra), and "Login using your smartphone / SCAN THE QR-CODE"
  with a QR block. Below the screen: card reader (lit), receipt printer, NFC ring, and a wide cash-dispenser
  slot with a bright light bar; the body fades to the background. A dark "Withdraw cash" card floats over the
  kiosk's lower left, and two white callouts sit top-right and mid-left.
- Build had: an unrecognisable dark slab (aggressive 3D transforms made the screen illegible), no card
  reader / printer / NFC / dispenser, a stray browser window mock that is **not in Figma** (the desktop rule
  hid only its contents, not its chrome), and the withdraw card overflowed the hero and covered the status row.
  The card number chip also rendered on a white panel — `<span class="card">` collided with the shared
  `.card` component.
- Verdict: **FIXED** — kiosk rebuilt at its native size inside `.fit-view` (857×800 scene, 1:1 at 1920),
  with the full screen UI, fascia hardware and dispenser; mild `rotateY(-9deg)` keeps the depth of the
  Figma 3/4 view while the screen stays readable. Colliding class renamed `.card` → `.cno`. Selected amount
  tile now matches Figma (lighter border, not a solid white fill). Stray window is hidden above 640px and
  reused as the deliberate mobile fallback below it, where the scene would scale below legibility.
- Checked at 1920/1440/1024/768/390: no clipping, no overlap with the status row, no horizontal overflow.

## Cross-page finding — shared class collisions
Scanned every page for markup reusing a shared component class name for a different purpose.
Only one real case existed (`.card` on this page); everything else flagged was legitimate use or
intentional theming of a shared component.

## #capabilities (Figma `53:2299`)
- Structure, copy and all four card mocks match Figma (vendor nodes, flow lines, captions, the
  "CUSTOMER SCENARIOS" chip strip, the highlighted "New ATM model" and "New components" nodes).
- Difference found: the wide summary boxes inside the cards ("Unified software components",
  "Common business logic", "Existing ATM fleet", "Software foundation") were filled with the product
  blue; Figma draws them dark with a border (sampled #111921) and uses blue **only** for the
  highlighted nodes. Verdict: **FIXED** (`.cap .net .hub`).

## #use-cases (Figma `53:2358`)
- Content matches Figma: 3 situation headers, 4 mock cards (vendors / hardware / services / architecture)
  with their captions, and the "One software foundation" row with NCR, Diebold Nixdorf and GRG.
- Two layout defects found, both invisible at 1920 and both **FIXED**:
  - the 4-column grid used `1fr`, so min-content kept the 4th card ~359px wide and it was clipped off the
    right edge from 1600px down → `minmax(0,1fr)`, and the grid now drops to 2 columns below 1500px where
    four mocks no longer fit;
  - `.case .win` had a fixed `height:300px`, so once rows wrapped the mock content was cut off mid-row →
    `height:auto;min-height:300px`.
- Verified 1920/1600/1440/1024/390: grid inside the wrap, no clipped mocks, no horizontal overflow.

## #advantages (Figma `53:2344`) — MATCH
The annotated ATM elevation is present and correct: topper "sollisero / ATM", customer screen
("Good afternoon, Fred" + tiles + amounts), blue fascia with keypad, NFC, dispenser and safe, the
"MULTIVENDOR ATM · ONE SOFTWARE STACK" badge, and all eight leader-line callouts with Figma's wording
(TOPPER · BRAND PANEL, SCREEN · CUSTOMER UI, NFC · CONTACTLESS, CASH DISPENSER, SAFE · CASH CASSETTES,
QR LOGIN, CARD READER · EMV, ENCRYPTING PIN PAD). Tabs 01–08 and the panel match. No changes.

## #problem (Figma `53:1962`) — MATCH
