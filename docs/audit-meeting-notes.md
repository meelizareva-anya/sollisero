# Audit — meeting notes (`src/pages/meeting-notes.html`)

Figma: desktop `101:655`, mobile `108:4484`. File key `GqV9zPNuDtmj8DHBy8C6YK`.
Theme: charcoal + lime. **Rule kept throughout: lime only ever carries dark text.**

## Triage (full-frame Figma 1920x10072 vs built 1920x10989)

Section order, backgrounds and block counts line up. Candidates for a deep pass:

- `#product` — the big workspace mockup; Figma's centre pane looks like a **meetings list**,
  the build shows a single meeting's transcript/summary. Needs a full read.
- `#record` — browser-extension mockup; tile treatment differs.
- `#hero`, `#how`, `#features`, `#security` — mockups to read closely.

Matching at triage level: `#platforms` (9 chips, same labels), `#scenarios`, `#faq`, `#contact`.

---
## #product (Figma `137:12203`) — the big one

Figma shows three labelled mockups: **01 All meetings** (large), **02 Team chat**, **03 Tasks**.

- **01 All meetings** — sidebar (Add meeting, MEETINGS: Meetings/Search meetings/Report templates/
  Document templates, WORKSPACE: Integrations/Members/Plan & minutes/Organization), header
  "Meetings" + "Everything you discussed. Everything you agreed on." + `+ New meeting`,
  filter pills `All meetings / Ready / Processing / Failed`, a labelled filter row
  (Find a meeting · Date · Author · Source · Reset), then date groups **October 6 / October 2 /
  September 30** with four rows, each `duration + length bar + ● Ready + →`:
  | row | title | meta | dur |
  |---|---|---|---|
  | 1 | Recording — Oct 6, 2026, 1:42 PM | 1:42 PM · Recorder · olga@example.com | 9 min |
  | 2 | Recording — Oct 6, 2026, 1:30 PM | 1:30 PM · Recorder · olga@example.com | 10 min |
  | 3 | Product sync — Q4 roadmap | 3:04 PM · Zoom · olga@example.com | 28 min |
  | 4 | Recording — Oct 2, 2026, 2:07 PM | 2:07 PM · Recorder · olga@example.com | 53 min |
  Row icons are rounded square tiles, tinted **lime / blue / violet / blue**.
- **02 Team chat** and **03 Tasks** — build already matched verbatim (header, AI Copilot button,
  lime question bubble with dark text, cited answer with `14 Jun · Sales sync ▶ 00:02:14`,
  `Open 38 / Mine 9 / Confirmed 120`, the three task rows with owners and dates, empty checkboxes).

- **Build** had, and these are now fixed:
  - **The whole mockup rested on the wrong screen.** With reduced motion the demo jumped straight to
    the report view, so the frame labelled "01 All meetings" showed a transcript/summary instead of
    the meetings list. **FIXED** — the reduced-motion branch in
    `src/scripts/pages/meeting-notes.js` now calls `show('list')`. The report view still populates
    and is still reachable, and the full animation is untouched.
  - Row 1 was invented: **"Sales sync — Oct 6, 2026, 1:42 PM", 47 min, ● Processing**.
    Figma has **"Recording — Oct 6, 2026, 1:42 PM", 9 min, ● Ready**. **FIXED.**
  - Row icons were all the same lime circle. **FIXED** — rounded square tiles with the
    lime / blue / violet / blue tints from Figma (`.ic`, `.ic.b`, `.ic.v`, plus dark-mode variants).
  - The length bar was a plain solid lime block of fixed width. Figma has a grey track with a lime
    fill proportional to the meeting length. **FIXED** (`--v` of 10% / 13% / 50% / 95%).
- **Note / seam left for the user**: the animation still opens a report titled "Sales sync —
  Oct 6, 2026" from row 1, which Figma now names "Recording — Oct 6, 2026, 1:42 PM". The report
  screen has no Figma counterpart at all, and "Sales sync" is a real meeting in Figma's data
  (it is cited in Team chat and Tasks), so I left the report title alone — but if you want the
  animation to read tightly, that title is the thing to align.

## #hero (Figma `101:656`)

- **Figma**: the same meetings list in dark mode, browser bar `app.meeting-notes.ai / meeting`,
  badge `● REPORT READY · 2 MIN AFTER UPLOAD`, row 1 showing **● Ready**.
- **Build**: row titles, times and durations already matched. Row 1 rested on **● Processing**
  (so with JS off it never became Ready), and the icon tints were flat.
- **Verdict: FIXED.** Markup now rests on `● Ready` (the Figma frame) and the JS sets
  `● Processing` itself before replaying the 2.6 s processing beat — so the animation is unchanged
  while the no-JS and reduced-motion states match Figma. Icon tints and length bars aligned too.

## #record (Figma `104:695`)

- **Figma**: browser bar `meet.google.com / abc-defg-hij`, four **landscape** participant tiles
  (Anna / Client / Ivan / You) with **no tile highlighted**, and a white bar
  "meeting notes · Chrome extension" / "Tab audio + microphone · 00:12:30" + red `● Recording`.
- **Build**: all copy matched, but the first tile carried a lime ring at rest (Figma has none), and
  the tiles were a fixed 150 px tall, so below 1920 they turned portrait.
- **Verdict: FIXED.** Removed the pre-lit `talk` class (the speaker-rotation animation still adds it)
  and gave the tiles `aspect-ratio:4/3` so they stay landscape at every width.

## #features (Figma `104:731`)

- **Figma**: six cards 01–06 with their mini-mocks. Card 02's template rows (NEEDS / AGREEMENTS /
  NEXT STEPS) each show a **uniform full-width pale-lime placeholder line**.
- **Build**: everything matched except card 02, where the lines were saturated-lime **progress bars**
  at 70% / 45% / 30%, reading as data rather than placeholder text.
- **Verdict: FIXED.** `.minimock .track` is now the pale-lime full-width line Figma shows.

## #how (`104:670`), #platforms (`101:766`), #scenarios (`104:779`), #security (`105:673`)

- **#how** — three step cards; the `zoom.us / j / 8213` + Record mock, the three speaker rows with
  waveforms at 00:41:02 / 00:41:12 / 00:41:40, and the report mock with DONE / Agreements 3 /
  Tasks 5 / Next steps 2 / Export PDF·DOCX·MD·JSON all match. **MATCH.**
- **#platforms** — the same nine chips in the same order. **MATCH.**
- **#scenarios** — four cards; all twelve label/value rows and all four `TEMPLATE · …` chips match
  verbatim. **MATCH.**
- **#security** — sidebar groups, the six settings rows (Data region / Speech recognition /
  Model training on your data / Recording label in calls / Retention / SSO), the LOCKED and
  ON REQUEST badges and every toggle state match. **MATCH.**

## Theme rule

Checked the rendered page: **no opaque lime fill carries light text** anywhere
(scripted contrast pass over every element). The lime pills (`● Ready`, chips, the chat bubble,
the Security nav item) all use the dark ink foreground.
