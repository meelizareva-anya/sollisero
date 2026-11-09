# Audit · dspm (Figma 1:1250)

## #hero — mockup "Security overview" (Figma `1:8714`, 857×520)
- Figma: full product dashboard — icon rail (.S, Overview/Inventory/Protection/Manage) + side panel
  (sollisero/dspm, "Northstar Inc. · Production · EU-West" org switcher, "[01] WORKSPACE", Workspace /
  Northstar · production, nav Overview + "Data map 56", "PINNED +" with Payments perimeter / EU customer
  data); top bar (Workspace › Overview, search + ⌘K, help, bell, Copilot); header "[01] DATA SECURITY",
  "Security overview" + Live monitoring, "Last 7 days" / "Explore data"; "FIRST STEPS · 1 OF 3 DONE" +
  "From the first resource to a clear risk" + "Show me how ×" above the 3 steps; 4 KPI tiles; TWO bottom
  panels — "Priority events" and "What we found" (composition bar, PII 81% / PCI 11% / Secrets 8%,
  SQL databases 14 sources).
- Build had: no rail, no side panel, no top bar, no section header buttons, no wizard header, a single
  merged event list, no "What we found" panel; invented KPI captions ("Postgres · S3 · Kafka",
  "4,132 rows · 41 stores", "Sensors online 12/12 · No signal from 0 sensors").
- Verdict: **FIXED** — mock rebuilt 1:1 at its native 857×442 inside `.fit-view` (so it is pixel-for-pixel
  at a 1920 viewport and scales below). All copy taken verbatim from Figma. KPI tiles corrected:
  "33 +3" inline badge and no bar, "4,132" + blue bar + "in 12 data stores and 2 services", "7" white with
  red "Critical 2 · High 5" and no bar, "1 / 3" + amber bar + amber "No signal from 2 sensors".
  CSS lives in `src/styles/pages/dspm.css` under `.dash*`; obsolete `.kpi/.step` rules removed.

## Navigation (applies to every product page) — NEEDS DECISION
Figma omits the **current** product from the nav: on the dspm page the links are Sollisero ATM, cash
solutions, retail banking, digital employees, meeting notes, bim-agent, Careers (no dspm); on the ATM page
there is no Sollisero ATM. The build shows all 8 links everywhere and underlines the current one.
Left as-is for now — see the note in the final report.

## #product (Figma `1:1407`) — three mocks: Security overview / Data inventory / Compliance reports
- Figma's big "Security overview" mock carries the same product chrome as the hero: a dark icon rail
  (.S, Overview, Inventory, Protection with a red "22" badge, Manage), a light side panel (sollisero/dspm,
  the Northstar org card, "[ 01 ] WORKSPACE", Workspace / Northstar · production, Overview, "Data map 56"
  active, "PINNED +" with Payments perimeter / EU customer data), and a top bar
  (Workspace › Data map, search + ⌘K, help, bell, Copilot). The page header carries "Resource groups" and a
  blue "Share view" button; the scanning banner has a SCANNING label, a two-line message
  ("…56 of ~80 expected nodes found · 3 sensors reporting · last update 4 min ago") and a "Sensor status"
  button; the filter row has a "Node, data or cluster" search field, Group/Region/Data selects, a
  "High risk only" checkbox and a Service/Store/Risk legend; the column headers read
  "External · entry points", "Services · by namespace", "Data stores · by engine".
- Build had: a plain text sidebar, no top bar, no header buttons, no Sensor-status button, a single-line
  scanning string, chip-style filters without the search field or legend, and bare column counts.
- Verdict: **FIXED** — rail, side panel, top bar, header actions, banner layout, full filter row and the
  column captions rebuilt from Figma (`.dm-*` in `src/styles/pages/dspm.css`).
- Note: the first attempt put the column captions on the *capabilities* mock, which has an identically
  shaped column block earlier in the file; corrected to the product mock.
- Not changed: mocks 02 (Data inventory) and 03 (Compliance reports) are thumbnails in which Figma also
  shows a miniature rail and top bar. Their content matches; only the chrome is missing. Low impact at
  their rendered size — left for a follow-up if you want full parity.

## Checked, no change needed
`#capabilities` — four cards, their window mocks and function lists match Figma.
Page verified at 1920/1440/1024/390: no horizontal overflow, no console errors.
