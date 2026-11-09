# Audit — digital employees (`src/pages/digital-employees.html`)

Figma: desktop `137:11946`, mobile `147:15140`, interactive components `149:15140`.
File key `GqV9zPNuDtmj8DHBy8C6YK`.

## Triage (full-frame Figma 1920x14560 vs built 1920x14580)

Page heights match within 20 px; section order, counts and backgrounds all line up.
Candidates flagged for a deep pass:

- `#use-cases` — the three window mockups read **light** in Figma, **dark navy** in the build.
- `#platform` — layer chips look like solid dark pills in Figma, ghost/outlined in the build.
- `#rules` — step markers look like round icon badges in Figma, square numbers in the build.
- `#impact` — counters render `0 h` in a static screenshot; confirm resting state.
- `#hero`, `#employees`, `#practice` — large mockups, need a close read.

Sections that already match at triage level: `#problem`, `#how`, `#included`, `#faq`, `#contact`.

---
## #use-cases (Figma `137:13357`)

- **Figma**: three full light-theme app windows (dark browser bar, light screen), each with a
  global top bar (brand, breadcrumb, search `Search tasks, processes, documents ⌘K`, `● Pilot · running`,
  avatar `OS`), a left sidebar (workspace chip `Northwind Inc. / Pilot workspace · EU`, OPERATE:
  Overview / Processing log (4) / Quality analytics, CONFIGURE: Processes / Digital employees /
  Connections / Knowledge & policies / Test on examples) and a main pane.
  1. *Proposal Manager* — kicker `DIGITAL EMPLOYEE · SALES`, `● Working`, Pause / Edit process,
     tab row (Overview·Processes·Access rights·Performance·Activity), 3 KPIs
     (186 +9% / 06:42 vs 41 min manual / 89% +3 pp), **Recent tasks** table
     (TASK·REQUEST·CUSTOMER·TIME·RESULT, 6 rows #4821…#4809) and a **right rail** with
     *Access rights* (ERP Read only, CRM Create draft, Price list v12 Read only, Email No sending)
     and *Limits* (15% / 12% / ≤ €50,000 + "Anything above a limit goes to a person").
  2. *Processing log* — segmented filter (All 214 / Awaiting decision 4 / Exceptions 7 / Completed 201),
     a filter row (search + Digital employee / Process / Channel / Date), and an 8-row table
     TASK·REQUEST·DIGITAL EMPLOYEE·CHANNEL·STARTED·DURATION·STATUS, first two rows tinted amber.
  3. *Test on examples* — `+ Add example` / `▷ Run all 12`, a "Comparing V2 · DRAFT with V1 · LIVE"
     strip, 4 KPIs (11/12, 1 improved, 0 regressions, 02:08), a 7-row **Examples** table
     (#·CASE·EXPECTED·V1·V2·RESULT) and a **right detail panel** for example 02 Valve set VK-40
     (expected findings with TS §2.4 / TS §7.1, V1 · LIVE 1 of 2 vs V2 · DRAFT 2 of 2, "What changed in V2").
- **Build**: three *dark navy* `.mini` cards — no sidebar, no top bar, no right rail, no tabs,
  no filter rows. Content was largely invented: window 1 had a 4-row table of requests
  #2318–#2315 (Orbit Trading / Helio Foods …) that does not exist in Figma; window 2 was a
  6-entry timeline instead of the log table; window 3 was a 3-row contract/spec/act comparison
  instead of the examples run.
- **Verdict: FIXED.** Replaced all three with a new light `.scn` mock shell
  (`src/styles/pages/digital-employees.css`, replaces the old `.mini` block) carrying the sidebar,
  top bar, main pane and right rails, and rebuilt every table/label/number verbatim from Figma.
  Kept the dark browser bar as in Figma.
- **Deliberate deviation**: Figma's in-mock brand lockup reads `krit / WORK-IT`; the build uses
  `sollisero / digital employees` to match the rebrand already applied across the site
  (hero, practice and rules mockups all use it). Not reverted.

## #hero (Figma `137:11947`)

- **Figma**: the 768x460 dashboard shows, inside the frame, a 4-card KPI row, the
  *Needs your decision* pane (4 rows) beside *Digital employees today* (3 roles + pilot note),
  **and a third row** — *Hours saved* ("Specialist time freed by digital employees" with a
  `14 days / 30 days / Quarter` segmented control) beside *Why tasks went to people*
  ("9 exceptions"; "Value outside policy limits — 38%" with an amber bar), clipped by the frame edge.
- **Build**: the third row was missing entirely, and the dashboard was laid out ~1.4x too large for
  its frame — `.app` needed 585 px of content in a 412 px screen, so the bottom of both panes
  (rows 3–4, the pilot note) was cut off.
- **Verdict: FIXED.** Added the *Hours saved* / *Why tasks went to people* row, pinned the browser
  bar to Figma's 40 px, and gave `.hero .app` a `--k:.71` layout-then-scale rule so the whole board
  fits the frame at Figma's density. All KPI figures, row titles and sub-captions already matched
  Figma verbatim and were left alone.

## #employees (Figma `137:12091`)

- **Figma**: 4x2 bento of 8 role cards (01–08) — Customer Manager, First-Line Support,
  Proposal Manager, Booking Administrator, Internal Assistant, Document Controller,
  Task Coordinator, Quality Analyst — each with a one-line caption and 2 system chips,
  plus the footer rules `// START WITH ONE — ADD OTHERS ON THE SAME PLATFORM` /
  `8 ROLES · 1 PLATFORM · YOUR SYSTEMS`.
- **Build**: identical — same card count, order, numbering, role names, captions and chip sets.
- **Verdict: MATCH.** Nothing changed.

## #practice (Figma `137:13479`)

- **Figma**: the agent-run window has a **full-width top bar** (brand lockup, `Processing log / Task 0917`,
  search, `● Pilot · running`, avatar) above the sidebar; the findings table header reads
  `# · PARAMETER · IN PROPOSAL · REQUIRED · SOURCE · STATUS`; processing steps are joined by a
  vertical timeline rail; and **Context is a separate card** below the Processing steps card.
- **Build** had, and these are now fixed:
  - no top bar at all (brand lockup sat in the sidebar instead) — **FIXED**, added `.run .rtop`
    and moved the body into `.run .rbody`, matching Figma's layout.
  - row 04 *Control interface* source `Datasheet p.3` → Figma says **`TS §6.2`** — **FIXED**.
  - row 05 *Power supply* source `TS §4.1` → Figma says **`Datasheet p.3`** — **FIXED**.
  - row 04 status pill was green; Figma's `● Check` is blue — **FIXED** (`.run .st.c`).
  - column header `Requires` → Figma says **`Required`** — **FIXED**.
  - step 2 timestamp `15:42:39` → Figma says **`15:42:20`** — **FIXED** in the markup and in the
    matching `sec` array in `src/scripts/pages/digital-employees.js`.
  - Context was nested inside the Processing steps card — **FIXED**, now its own `.pane` in a `.rcol`.
  - steps had no connecting rail — **FIXED** (`.run .steps li::before`).
- Everything else (story column 01–04, ask box, file chips, rows 01–03 and 06, the clipped
  footer rules) already matched verbatim.
- **Deliberate deviation**: Figma's file row reads "WORK-IT compared 3 documents"; the build now
  reads "digital employees compared 3 documents" (rebranded product name) rather than the old
  role label "Document Controller" it had before.
- **Left alone**: the build's thin progress bar above the step list has no counterpart in Figma,
  but it carries the run animation and reads as part of it at rest.

## #platform (Figma `140:12540`)

- **Figma**: three stacked layers (01 People and channels / 02 Digital employees platform, vivid blue /
  03 Corporate systems) with `↕` connectors, each carrying its chip row, beside a
  "HOW CONTROL WORKS" card with four green-tick items.
- **Build**: same three layers, same chip sets (5 / 6 / 6 chips), same connectors, same four control items
  with identical text. The solid dark pills seen in the Figma export are the same ink chips the build renders.
- **Verdict: MATCH.** Nothing changed.

## #impact (Figma `140:12632`)

- **Figma**: five cells — CUSTOMER REQUESTS `120 h` (12 min × 600 / month), SUPPORT TICKETS `60 h`
  (8 min × 450 / month), COMMERCIAL PROPOSALS `58 h` (35 min × 100 / month), DOCUMENT CHECKS `39 h`
  (25 min × 94 / month), TOTAL ESTIMATED POTENTIAL `≈277 h` (per month · four scenarios) — joined by
  `+ + + =`; then the three detail boxes and the footnote.
- **Build**: every figure, unit, sub-caption and operator already matched verbatim.
- **One real defect, FIXED**: the counters' markup fallback was `0 h` / `≈0 h`. The `count-up`
  component documents "final value in markup = no-JS fallback", so with JS off — or before the
  section is scrolled into view — the section read `0 h`, not Figma's resting values. Markup now
  carries `120 h / 60 h / 58 h / 39 h / ≈277 h`; the animation is unchanged.
- **Note for the user**: the same `0`-fallback pattern exists on other pages (`index`, and others),
  outside this audit's scope — worth a separate sweep.

## #rules (Figma `140:12700`)

- **Figma**: light admin console — browser bar `admin.digital-employees / digital-employees`, top bar,
  sidebar with *Digital employees* active, header + `Compare roles` / `+ Add digital employee`,
  filter row `All 8 / Working 3 / Pilot 1 / Available 4` with the note "All actions follow process
  rules and access rights", and a 4x2 grid of the eight role cards with Tasks today / Accepted
  figures (64·92%, 112·94%, 38·89%, 6·96%, then four `—`). Right: three numbered round steps.
- **Build**: card order, statuses, every figure, all three step texts and the round blue number
  badges already matched.
- **Verdict: FIXED (minor).** The active filter pill was a dark ink chip; Figma uses the light-blue
  active treatment — changed `.adm .filters span.on` to match.

## #included (Figma `141:12564`)

- **Figma**: four cards 01–04 (digital employees AI platform / Corporate system connections /
  Business process templates / Rollout and support) with their chip rows, plus the vivid
  `ONE FOUNDATION` statement band.
- **Build**: identical text, chip sets and layout.
- **Verdict: MATCH.** Nothing changed.

## #problem, #how, #faq, #contact

Checked at triage against the full-frame render: layout, block counts, bar percentages
(40 / 35 / 25%), the five pipeline steps and the example strip all line up. **MATCH**, nothing changed.
