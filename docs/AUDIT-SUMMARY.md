# Figma audit of product illustrations & mockups — summary

Every illustration, device drawing and UI mockup on the seven product pages plus the home-page
showcases was compared against its Figma frame and fixed in `src/`. Per-page detail:
`audit-<page>.md` in this folder.

## Scoreboard

| page | sections compared | fixed | matched |
|---|---|---|---|
| dspm | hero, problem, capabilities, product | hero dashboard, product mock chrome | problem, capabilities |
| Sollisero ATM | hero, problem, capabilities, advantages, use-cases | kiosk scene, summary-box fills, use-cases grid | problem, advantages |
| cash solutions | 10 sections | hardware diagram, use-cases mocks, why-counters | hero, problem, capabilities, industries, analytics, integrations, getting-started |
| retail banking | hero, problem, capabilities, advantages, use-cases | hero window, capabilities card 02, phone templates | problem, use-cases, advantages schematic |
| digital employees | 10 sections | hero board, use-case windows, practice mock, impact, rules | problem, employees, how, platform, included |
| meeting notes | 8 sections | hero, product mock, record tiles, features | platforms, how, scenarios, security |
| bim-agent | 7 sections | hero crystal, scenario editor, 6 scenario icons | problem, differ, case |
| home · showcases | 4 product visuals + hero cards | dspm tiles, cash solutions data + POS screen, retail window | ATM, hero cards |

## Recurring classes of defect

1. **Missing mock chrome.** Figma draws complete products — icon rail, side panel, top bar, action
   buttons, a second panel. The build showed only the content area. Hit dspm (hero + product),
   digital employees (practice), bim-agent (platform).
2. **Invented data.** Numbers, captions and row contents that look plausible but are not Figma's.
   Worst on the home cash-solutions showcase (KPI deltas, donut split, units sold) and retail
   banking (loan figures, cashback, transaction categories).
3. **Third-party template leftovers.** `finative` branded the retail web-bank top bar and phone
   cards; `Monzo` appeared in a transaction list. Normalised to Sollisero.
4. **Shared class-name collisions.** Page markup reused a class the shared bundle paints:
   `.card` (ATM withdraw mock → white card surface), `.sec` (POS secure chip → section padding),
   `.nav` (bim-agent editor rail → site-nav padding). Convention now documented in `README.md`.
5. **Progressive-enhancement gaps.** `data-count` elements shipped `0` as their markup text, so
   without JS — or before scroll — the figures read zero. Swept site-wide; all now carry the final value.
6. **Containment bugs.** Mocks clipped by `.fit-view{overflow:hidden}` or by fixed heights, and a
   4-column grid using `1fr` whose min-content pushed the last card off-screen below 1600px.

## Open decisions (nothing was changed on these)

- **Nav: Figma omits the current product.** On the dspm page the nav lists the other six products +
  Careers; same on ATM and retail banking. The build shows all seven and underlines the current one.
  Keeping the build's behaviour preserves the "you are here" signal; switching is a one-line change
  in `src/partials/layout.mjs`.
- **bim-agent `#demo`.** Figma shows two stacked Runs-console windows (a completed run `/runs/317`
  and a live run `/runs/live`). The build has a different concept: an interactive agenda that plays a
  run against an isometric model viewer. Matching Figma means deleting a working feature.
- **retail banking `#capabilities` card 04 "Support and settings".** Figma reuses the home and
  transaction-history screens here, which contradict the card's own title; the build's support-chat
  and settings screens match the copy. Left as the build has it.
- **meeting notes `#product`.** The animation opens a report titled "Sales sync — Oct 6, 2026" from a
  row Figma names "Recording — Oct 6, 2026, 1:42 PM". The report screen has no Figma counterpart.
- **Brand lockups inside mocks.** Figma still shows `krit / WORK-IT` and `finative`; the build uses the
  current Sollisero naming throughout.

## Verification

`node build.mjs --check` passes; 10 pages × 5 widths (1920/1440/1024/768/390) with no horizontal
overflow and no console errors; the 31-check end-to-end suite (CSP, forms, no-JS) passes; visual
regression captured before and after the audit (`tools/visual-regression.py`).

---

## 2026-11-10 — dspm and cash solutions reworked outside the repo

Two edited single-file builds of `dspm` and `cash-solutions` were handed back and ported into
source. They were produced from the standalone exports of this repo, so all of the Figma work
of 2026-11-09 is present in them (verified by probing for `.pos-iso`, `.uc-portal`, `#anPortal`,
`.pt{height:551.13px}`, the `#15113f` theme and the `.835884` / `1.448549` crop scales — all
intact before porting).

**The two files carried divergent copies of the shared bundle**, because each was edited
independently from the same export. Both sets of shared changes were merged:

- `components/window.css` — chrome colours moved from literals to theme tokens
  (`var(--ink)`, `var(--surface-dark-2)`, `var(--pale)`), so a themed page gets its own window
  chrome. Identical output for the default theme; cash, meetly and bim now tint.
- `components/tabs.css` — `.panel` gradient built from `--vivid` via `color-mix`.
- `components/hero.css` — `.hero` gains `padding-bottom:clamp(48px,4.5vw,80px)`.
  **Both pages whose hero geometry is pinned to Figma override it**: index sets 64, cash
  solutions sets 0 because its 64 already comes from `.hero .stats`. Without those overrides
  the heroes grow by 80 and stop matching their frames — index was re-measured at 922 (Figma
  924) and cash solutions at 1231.6 (Figma 1229) after the merge.
- `components/fit-view.js` — new `data-fluid-below="N"`: under N px the mock stops being a
  fixed scaled canvas and reflows as ordinary responsive markup.
- `partials/layout.mjs` — optional `legalSuffix` in front matter; only dspm sets it
  (`© 2026 Sollisero // dspm`). The cash solutions file left the line untouched, so this is
  per-page rather than site-wide.

Page-level: `src/pages/{dspm,cash-solutions}.html`, `src/styles/pages/{dspm,cash-solutions}.css`
and `src/scripts/pages/dspm{,.data}.js` were replaced from the uploads. The rebuilt page markup
and CSS were diffed back against the uploads to confirm they reproduce them (dspm page CSS
differs only by the comments the minifier strips; cash solutions matches exactly).

The cash solutions page stylesheet came back minified with no comments, so the ten Figma
explanations were re-attached to the rules they document — all ten anchors survived the rework.

The 32-symbol SVG sprite that cash solutions now uses sat in `<body>` ahead of `<main>` in the
export; since a page's source is only its `<main>`, it was moved inside, otherwise every
`<use href="#i-…">` dangles (the build's anchor check catches this).

Verified after porting: `build --check`, the 31-check e2e suite, and no overflow or console
errors across ten pages at 375 / 768 / 1440 / 1920.
