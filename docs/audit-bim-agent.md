# Audit — bim-agent (Figma desktop 165:13109)

## hero (165:13110)
- Figma: glowing icosahedron "crystal" — translucent teal facets, white glowing edges, a bright white core glow bleeding through the body, plus a wide teal halo. Two thin orbit rings (outer solid, inner dashed) with three small orbs (white top, blue left, blue/teal right). Below it: white waveform bars + mono caption "…WORKING WITH THE DRAWING…". Hero stats row 01/02/03 underneath.
- Build: same structure (icosahedron SVG + 2 rings + 3 orbs + waveform + caption + stats) but the gem reads as a flat opaque faceted solid — no core glow, dark facets, weak halo.
- Verdict: FIXED — added a bright core glow (radial gradient over the gem body) and lifted the facet gradients so the crystal reads as luminous like Figma. Structure/labels/caption already matched.

## problem (165:13191)
- Figma: two bordered white tables ("AT DEPARTMENT LEVEL" / "AT COMPANY LEVEL", each with "WHAT CHANGES" column, 2 rows, teal → arrow) + a [SOLUTION] card with teal headline, rule, note and "Request a demo" button.
- Build: identical structure and copy verbatim. Only difference at 1440 is the demo button wrapping under the note (flex-wrap) — at 1920 it sits on the same row as in Figma.
- Verdict: MATCH

## platform (165:13254) — scenario-editor mockup (165:14212)
- Figma: browser bar; dark left rail with **labelled** items (S logo, Scenarios [active], Runs [badge 2], Reports, Admin); a **breadcrumb row spanning the full width** (Scenarios / Model QA / Comprehensive BIM model check + search field "Search scenarios, runs…" with ⌘K + globe + bell with red dot + "✦ Assistant"); a title row also full width (‹ back, title + "#18 · Draft v8 · based on v7 · saved 14:32", tabs Canvas/Input form/Versions 8/Runs 128, undo/redo, "✎ Validate", "▷ Test run", "↑ Publish v8" in blue); canvas with status chips, a blue "+" plus an 8-icon tool palette, 6 nodes, edge labels "no issues" (teal) / "issues found" (amber), dark "Revit command R" hint pill; inspector *below* the two header rows with tabs Settings/Data mapping/Last run, a pinned-version note and a Timeout field.
- Build: sidebar icons with no labels/badge; **no breadcrumb row at all** (no search, ⌘K, globe, bell, Assistant); title row had only tabs + Publish (no undo/redo, Validate, Test run); inspector was a **full-height third column** instead of sitting under the header rows; no edge labels; inspector had no tabs, no pinned note, no Timeout; tool palette 6 plain squares, no "+" button. Wrong text: "#202 · v4" (Figma v9), "cmd.tag_balloons" (Figma cmd.tag_byIssue), "issues_count > 0" (Figma issues.count > 0). Node coordinates did not match Figma's layout. "Revit command" used the shared `.pill blue` component (light blue) where Figma has a dark tooltip pill.
- Verdict: FIXED — rebuilt the mock: labelled sidebar + Runs badge, full-width breadcrumb row with search/⌘K/icons/Assistant, full-width title row with undo/redo + Validate + Test run + blue Publish v8, inspector moved into a `.work` grid under the header rows, added inspector tabs + pinned note + Timeout, added both edge labels, added the blue "+" and 8-slot tool palette, corrected all three wrong strings, repositioned all six nodes to Figma's coordinates, replaced `.pill blue` with a page-private dark `.hintpill`, and made inspector field labels sentence-case grey as in Figma.
- Note: the sidebar items were first written as `.nav`, which collided with the site nav component (`.nav{padding-top:40px}`) and stretched the rail — renamed to `.sv`. Same class of bug as the ATM `.card` one.

## differ (165:13366)
- Figma: bordered white comparison table, header SOLUTION / WHAT IT DOES / WHAT THE DEPARTMENT GETS; rows bim-agent (teal fill, white text), BIMLOGIQ Argus, Autodesk Assistant, Nonica, ModPlus; mono source note "Based on vendors' public materials as of September 2026".
- Build: same five rows in the same order, same three column headers, same named tools, same teal highlight row, same source note, copy verbatim.
- Verdict: MATCH

## case (165:13746)
- Figma: three bordered metric cards (Hours of manual work → minutes / 5 days / 1 year 3 months → weeks) on the left; dark "ESTIMATED CALCULATION" panel on the right with Runs per month 500, Manual work per run 48 min, Engineer's hourly rate ₽2,830, rule, "≈ 400 h freed up per month", "≈ ₽1.1M monetary equivalent", and the calculation note.
- Build: identical structure, captions and numbers. The build additionally renders range sliders inside the three fields because the calculator is live; Figma (static) shows value only.
- Verdict: MATCH — sliders left in place deliberately (interactive enhancement of a static frame; resting values are Figma's).

## scenarios (165:13932)
- Figma: 3x2 grid of six scenario cards + teal "WHO IT'S FOR" panel on the right. Icons: (1) tag box above a dimension line with end ticks, (2) square split into four with a centre node, (3) dense dimensioning grid/hash, (4) riser run with a terminal node dot, (5) sofa, (6) plain isometric cube.
- Build: card copy, order and the WHO IT'S FOR panel all matched, but **five of the six icons drew something else** — a dashed beam, a ladder/table, a four-pane window, a house with services, a floor-plan square, and a cube with an orange clash marker.
- Verdict: FIXED — redrew all six icons to Figma's forms (same 48px line style, `currentColor`).

## demo (165:13814)
- Figma: left is the plain agenda list (5 rows, no play buttons, no pre-selected row, no lead paragraph). Right is **two stacked window mockups of the Runs console**:
  1. `app.bim-agent / runs / 317` — completed run: product sidebar (sollisero|bim-agent, "Northstar Design / Structural 2025"), a Runs list pane with counts (All runs 1,286 · In progress 3 · Failed 2 · Scheduled 5 · Started by me 12) and SAVED FILTERS (Failed this week, Tower B · structure), then the run detail: "[ RUN #317 ]", "Comprehensive BIM model check", "Completed · Finished 14:35:47 in 0.96 s · Maria Kim · Tower_B_STR/v4 v7", actions Summary / Debug / ↑ Export / ⟳ Run again, a green-check card "Model is ready for the next review stage" with Rooms / Attributes sub-lines, metric tiles "Elements checked 18,406", "Issues 0", "Duration 0.96 s", "Manual time saved ≈ 48 min", and "Nested scenarios" with two Done cards (Room check #319 · scenario #201 v7; Attribute check #326 · scenario #202 v9).
  2. `app.bim-agent / runs / live` — running: "[ RUN #318 ]", "Running · Started 14:35:46 by Maria Kim · Tower_B_STR.rvt · scenario v7", Summary / Debug / ■ Stop run, "Step 3 of 5 · Attribute check", Elapsed 0:48 / Remaining ≈ 0:48 / Progress 55%, a staged progress bar (Input, Room check, Attribute check, Condition, Report), a "Steps" pane and a "Working on the model now" pane (Checking element marks 324 / 410) with a timestamped log.
- Build: a single window containing a chat transcript plus a teal **isometric 3D slab viewer** (Level 03 · RC slab plan, tags K-01…K-08/W-01, elements/processed/issue legend) — a different mockup entirely. The agenda also adds ▶ play buttons, a highlighted first row and a lead "Pick an agenda item — the mock on the right plays the matching step of a live run", none of which are in Figma.
- Verdict: NEEDS-DECISION — this is not a detail miss, it is a different demo concept, and it is wired to real behaviour (`src/scripts/pages/bim-agent.js` builds the isometric model and plays a run per agenda item). Matching Figma means deleting that interactive feature and its lead copy. Left intact pending a call; happy to build the two console windows on request.
