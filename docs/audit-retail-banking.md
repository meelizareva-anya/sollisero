# Audit — retail banking (`src/pages/retail-banking.html`)

Figma desktop `61:3566`, mobile `61:4867`. File key `GqV9zPNuDtmj8DHBy8C6YK`.

## #hero (Figma `61:3567`)

- **How many phones does Figma show in the hero? None.** The hero mockup frame `61:3592`
  contains exactly one child, `61:3593` "Mockup · bank.sollisero / app" (857 × 500) wrapping a
  single raster, `145:15198` "UI · Desktop home" — a **desktop web-bank window**. The build's
  `.fit-view` is already `data-w="857" data-h="500"`, matching Figma exactly.
- Figma's web-bank UI (read from `61:3601` at full resolution): blue top bar with the
  **sollisero** wordmark and Home (active) / Payments / Transactions / Products / More, bell +
  Profile. Left column: Total balance $13,598.12; Accounts $13,598.12 → "Checking Account ··
  1234 / $10,827.64", "New Account ·· 5678 / $2,770.48", "Cashback this month / $42.16" +
  Redeem; Loans $7,147.39 owed → "Credit Card ·· 9012 / $5,163.83", a progress bar, "Limit
  $10,000 / $4,856.17 available", "● Payment $271.21 due Mar 20" + Pay, then "Cash Loan".
  Right column: search "e.g., ATMs"; Transfers and Payments → Transfer to sister / Rent
  payment / Utility payment / Apartment payment, then Between my accounts / By card number /
  Scan QR code; Recent Transactions with All | **Expenses** | Income segmented pills, a
  "September ⌄" + "−$709.57" header, a donut reading "Spent $709.57" and a 2×2 category grid:
  Groceries $394.15 56% · Nonprofits $149.26 21% · Services & m… $112.53 16% ·
  Entertainment $39.06 6%.
- Verdict: **FIXED** — six defects:
  1. **Wrong brand inside the mockup.** The web-bank top bar read **"finative"**. Changed to
     "sollisero". This and the items in (5) look like leftovers from a purchased UI template.
  2. **An extra phone covered the mockup.** The build overlaid a large tilted phone
     (`#heroPhone`) on the window. Figma's hero has no phone, and the overlay hid the entire
     left column — Total balance, Accounts and the whole Loans block — which Figma shows.
     Removed the `.ph-wrap` from the hero. The `.ph` component itself is untouched and still
     used by `#advantages`; the hero-phone branch in `retail-banking.js` is already guarded by
     `if (hp && !RM)` so it no-ops. **See "needs a decision" — this is the one change I'd most
     want confirmed.**
  3. **Wrong Loans figures**: "$7,041.89 owed" → "$7,147.39 owed"; Credit Card "$5,163.80 /
     14.21%" → "$5,163.83"; invented "Cash Loan $1,878.09 / 4.9%" row replaced by Figma's
     plain "Cash Loan" row. Added the missing progress bar, the "Limit $10,000 / $4,856.17
     available" line and the "Payment $271.21 due Mar 20" + Pay row — none were in the build.
  4. **Accounts rows** showed invented "−$420" / "+$100" change pills and omitted the masked
     account numbers. Now "Checking Account ·· 1234" / "New Account ·· 5678" with the name
     above the amount, as Figma. Cashback "$42.18" → "$42.16".
  5. **Spend-analytics legend was wrong and carried template brands.** Was Groceries $394.13 /
     Services $112.65 / **Monzo** $86.07 / Entertainment $74.28 with no percentages, plus a
     transaction list of **Tesco / Uber / Salary / Waterstones** that Figma does not have at
     all. Replaced with Figma's 2×2 category grid and exact values; the donut segments now use
     Figma's 56/21/16/6 split and read "Spent $709.57".
  6. **Transfer tile labels**: "Transfer to client" → "Transfer to sister", "Bank payment" →
     "Rent payment". Added the "September ⌄ / −$709.57" header and turned
     "All · Expenses · Income" into Figma's segmented pills with Expenses active.
- Left alone: Figma's four transfer tiles carry distinct coloured glyphs; the build uses plain
  outlined circles. Cosmetic, and the icons are raster in Figma.

## #problem (Figma `61:3682`)
- Figma: three node pairs on a dotted field — Card limits → OUTSIDE THE APP → Branch visit;
  Transfers → TOO MANY STEPS → Separate flows; Questions → SUPPORT LOAD (red) → Call center
  (red), plus the "disconnected journey / customer task" legend, three numbered challenges and
  the [ SOLUTION ] block.
- Build: identical nodes, chips, red accent on the third row, legend, cards and solution block.
- Verdict: **MATCH**.

## #capabilities (Figma `61:4011`, cards component `61:5343`)
- Figma: four cards — Cards (3 phones), Transfers and payments (desktop web app), Analytics
  and history (3 phones), Support and settings (2 phones).
- Verdict: **FIXED** in card 02, MATCH in 01 and 03, NEEDS-DECISION in 04.
  - Card 02 was missing the **entire Loans block** that Figma shows (Loans $7,147.39 owed →
    Credit Card ·· 9012 $5,163.83, progress bar, "Limit $10,000 / $4,856.17 available",
    "Payment $271.21 due Mar 20" + Pay). Added.
  - Card 02 account rows carried the same invented "−$420 / +$100" pills as the hero and
    omitted the masked numbers; "$42.18" → "$42.16". Fixed.
  - Card 02 quick-action tiles read "Transfer to client / Bank payment"; Figma has
    "Send to family / Rent payment". Fixed.
  - Card 02 Pay bills: added Figma's "3 bills due this week · $163.55" sub-line, changed
    "Auto-pay on the 1st" → "Auto-pay on for 2 bills", and corrected each bill to Figma's
    provider + amount + status (Electricity · City Power · acc. 4471 · $86.00 · Due tomorrow;
    Internet & phone · NetLine · Plus plan · $45.00 · Auto-pay · Nov 11; Water · Metro Water ·
    acc. 0982 · $32.15 · Due Nov 12). The build had $86.60/Nov 10, $45.00/Nov 12, $29.40/Nov 15
    with no providers.
  - Card 02 top bar read **"finative"** → "sollisero" (see the brand note below).
- **NEEDS-DECISION — card 04 "Support and settings".** Figma's raster shows a *home* screen and
  a *transaction history* screen, i.e. the same two assets used by cards 01/03. The build shows
  a support-chat screen and a security/notifications settings screen, which actually match the
  card's own title and the page copy. I did **not** change this: Figma looks like a placeholder
  here and matching it literally would make the section worse.

## #use-cases (Figma `61:4042`)
- Figma: four window mockups — `bank.sollisero / cards` (M_card + M_limits), `/ transfers`
  (D_pay), `/ analytics` (M_exp + M_hist), `/ support` (M_home + M_expl) — with the three
  "situation" headers above and `01 // Cards` … `04 // Support` captions below.
- Build: same four windows, same screen pairs, same situations and captions.
- Verdict: **MATCH** (the shared phone-screen templates it renders were fixed — see below).

## Shared phone-screen templates (`src/scripts/pages/retail-banking.js`)
These feed `#advantages`, `#capabilities` and `#use-cases`, so one fix lands in all three.
- **FIXED** — card screen: "finative · Gold" → "sollisero · Debit" (Figma's card type is
  DEBIT, verified at full resolution on `146:15198`); added the "Available" line Figma shows.
- **FIXED** — card screen action row: Figma draws four dark filled circles with white glyphs
  (+ / ↗ / card / ···) under Add money · Transfer · Wallet · More. The build rendered four
  empty white circles. Added glyphs and the dark fill via a `.acts.dk` modifier so the
  illustration phone and the home screen keep their own styling.
- **FIXED** — spend-analytics screen legend read "Groceries $394.13 / **Monzo** $86.07 /
  Services $112.65 / Entertainment $74.28". Figma (`146:15201`) has Groceries $394.15 /
  Nonpro… $149.26 / Services… $112.53 / Entertai… $39.06. "Monzo" is a bank, not a spend
  category — a template leftover. Corrected all four.
- **FIXED** — home screen Accounts rows carried the invented "−$420 / +$100" pills and
  "$42.18"; now masked account numbers and "$42.16", as Figma.
- **Checked and left alone**: the merchant names Tesco, Uber, Waterstones, Lidl, Greggs, Boots
  and Salary are genuinely in the Figma rasters (clearly legible in `61:4042` card 04 and
  `61:4011` card 03), so they are *not* build inventions. Individual row amounts differ
  slightly between Figma's own screens, so I did not chase them.

## The "finative" brand question — please confirm
Figma's **hero** raster is branded **sollisero** and every window URL in the file is
`bank.sollisero/...`, but the smaller card rasters (`D_pay`, `M_card`) still show **finative**,
a leftover from the source UI template. The build had "finative" in three places (hero top bar,
capabilities card 02 top bar, use-cases card 02 top bar) plus "finative · Gold" on the card.
I normalised all of them to **sollisero**, because shipping another company's brand inside
Sollisero's own product mockups is a defect, the design's own hero confirms the intent, and
`README.md`'s pre-launch checklist calls for replacing design placeholders. This is the one
place where I deliberately did **not** copy Figma verbatim — easy to revert if you disagree.

## Also left alone
- Panel eyebrow renders `[ 01 / 06 ] Cards` where Figma has `[ 01 / 06 ]  CARDS`. That eyebrow
  belongs to the shared `.adv` tabs component used on several pages — out of scope here.
- `#advantages` connector lines are dashed in the build, solid-with-dots in Figma; the eight
  labelled chips, the schematic phone and the "RETAIL BANKING · APP" pill all match.
