# Audit — home page `#products` showcases (Figma section 63:6325) + hero product cards

Side-of-row check: Figma puts the visual **right** for ATM and cash solutions, **left** for dspm and retail banking. The build's `.pshow` / `.pshow.flip` alternation already produces exactly that — correct on all four.

## hero product-link cards (63:6258, component 63:5642 / hover 63:5649)
- Figma: four translucent blue cards — CORE BANKING / Sollisero ATM / "ATM network management platform"; DATA SECURITY / dspm / "Sensitive data monitoring platform"; POS + MERCHANT PORTAL / cash solutions / "Sales, inventory and price tags in one place"; MOBILE BANK / retail banking / "Transfers, spend analytics, chatbot support". Each has a ↗ in the top-right. Hover state (63:5649): card turns solid white, eyebrow goes brand blue, title near-black, description grey, arrow dark.
- Build: same four cards, same eyebrows, titles, descriptions and arrow. `.plink:hover` already turns the card white with a brand-blue eyebrow, ink title, muted description and dark arrow.
- Verdict: MATCH (both resting and hover)

## 63:6335 — Sollisero ATM (visual right)
- Figma: ATM kiosk with the sollisero customer screen (Withdraw / Fill Up / Pay / Exchange / Transfer / Extra tiles + QR login block), camera, card slot, blue glow slab behind; callouts "60+ DEVICE TYPES SUPPORTED" (top right) and "CUSTOMER UI · SAME ON ANY VENDOR" (mid left); a dark "Withdraw cash" panel overlapping bottom-left with CARD *9867 · VISA, STEP 3 / 4, AVAILABLE $ 2 450.00 · ATS *7890, six amount tiles ($100/$200/$500 selected/$1000/$2000/Other), BILLS 100·50·20 + RECEIPT toggle, Cancel / Withdraw $ 500, footer ATM 1000-1000 · ONLINE, SESSION TIMEOUT 00:45. Copy side: 3 rule-separated feature rows and the 1997 / 50+ / 2,5+ mln KPI trio.
- Build: all of the above present with the same strings and numbers; both callouts and the overlay panel in the same positions. The only difference is that Figma draws the kiosk in perspective (angled body with a visible side face) where the build draws a front elevation.
- Verdict: MATCH — the 3D angle is pixel-level rendering of a raster the brief says to judge on structure/content/colour, which all agree.

## 63:6426 — dspm (visual left)
- Figma: dark `dspm.sollisero / flows` window; icon rail (Overview active, **Inventory carries a red badge**, Protection, Manage); workspace rail with "Data map" showing a **count 56** and a "PINNED **+**" group header; four metric tiles each with a **› chevron** and a **coloured meter bar under the number** — Data sources 33 with a green **+5** chip, Sensitive fields 4,132, Need attention 7 (red), Sensors online 1 / 3 (amber); Priority events and "What we found" panels below.
- Build: window, rails, tiles, events and composition panels all present with the right copy, but the tiles had **no chevron, no meter bar and no "+5" chip**, "Data map" had no count, "PINNED" had no +, and Inventory had no badge.
- Verdict: FIXED — added the tile chevrons, the coloured meters (accent / red / amber), the "+5" delta chip, the Data map count 56, the PINNED "+" and the Inventory red badge.

## 63:6465 — cash solutions (visual right)
- Figma: `cash.sollisero / analytics` merchant portal (sidebar Analytics / Catalog / Receipts / Stores / Employees / Registers / Settings) plus a white Android POS terminal overlapping the window's lower-left; callouts "MERCHANT PORTAL · SALES & STOCK" and "POS APP ON ANDROID DEVICES".
- Build had **invented numbers and screen copy**:
  - KPI deltas were +8% / +4% / −4% / "3 receipts today"; Figma: **−10% / +4% / −8% / "2 receipts today"**.
  - Payment-methods donut was Card $6,990 56% / QR pay $3,250 26% / Cash $2,240 18%; Figma: **Card $4,990 40% / QR pay $3,750 30% / Cash $3,740 30%**.
  - "Units sold today" was 726; Figma: **128**.
  - Revenue-by-hour chart had no y-axis money labels and no peak tooltip; Figma has **$1,200 / $600** on the axis and an **"18:00 · $1,310"** bubble with a guide line at the marked peak.
  - The POS screen showed an invented "Fresh Market · Till 2 / Sales today $1,286.40" plus a receipts list; Figma shows **Fred Bones / Cashier · Main Street Store / ● Shift #124 open / Revenue $1,294.50 · Receipts 37 · Average $34.72 / since 8:42 AM / "New sale — Or just scan the item" / Refund · previous receipt + Receipts · this shift 37 / Product catalog · Reports · Settings**.
  - The POS device sat over the portal **sidebar**, hiding Stores / Employees / Registers / Settings; in Figma it sits lower and clears the whole nav.
- Verdict: FIXED — all KPI deltas, donut split, legend values and "units sold" corrected to Figma; added the chart's y-axis labels and the peak tooltip; rewrote the POS home screen to Figma's content; moved the POS down (fit-view height 560 → 620) so all seven nav items read, and gave the POS screen room for its full content.
- Note: the chart's x-axis labels are now 07:00 / 15:00 / 22:00, taken from the same dashboard on `cash-solutions.html` (verified there as 07:00–22:00); Figma's home frame has the left of that axis hidden behind the POS device.

## 63:6546 — retail banking (visual left)
- Figma: **only** a `bank.sollisero / app` browser window — blue top nav (sollisero · Home active · Payments · Transactions · Products · More · bell · Profile ›), an accounts column (Total balance $13,598.12; Checking Account ·· 1234 $10,827.64 with two linked **payment-card chips** ·3420 (Visa, blue) and ·5120 (Mastercard, white); New Account ·· 5678 $2,770.48; Cashback this month $42.16 + Redeem; Loans $7,147.39 owed; Credit Card **·· 9012** $5,163.83, Limit $10,000 / $4,836.17 available, a ·· 7890 card chip, Payment $271.21 due Mar 20 + Pay; Cash Loan) and a right column (search "e.g., ATMs"; Transfers and Payments with a leading **+** action then Transfer to sister / Rent payment / Utility payment / Apartment payment, three tiles Between my accounts / By card number / Scan QR code; Recent Transactions with All·Expenses·Income, September, −$709.57, donut "Spent $709.57" and Groceries $394.15 56% / Nonprofits $149.26 21% / Services & m… $112.53 16% / Entertainment $39.06 6%). Callout "MOBILE BANK FOR INDIVIDUALS" centred above the window.
- Build: the window content matched closely, but it **also drew a phone mockup beside the window that Figma does not have**, the two account chips read "+$420 / −$120" instead of the linked card numbers, the credit card was labelled *7890 instead of *9012, and the transfers row had no leading "+" action.
- Verdict: FIXED — removed the phone and let the window fill the visual area (fit-view 860×520 → 800×510, window 700×470 → 800×480); chips are now ·3420 (card) and ·5120 (card); credit card is *9012 with a ·7890 linked-card chip; added the "+" action. `aria-label` updated to drop the phone.
