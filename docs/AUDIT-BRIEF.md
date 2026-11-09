# Brief: visual audit of product illustrations & mockups against Figma

Your job: compare every **illustration, UI mockup and device drawing** on your assigned product pages with the Figma design, then **fix the discrepancies** in `src/`.

## Setup

- Project root: `/home/claude/refactor`. Read `README.md` first — it describes the architecture and conventions you must follow.
- Figma file key: `GqV9zPNuDtmj8DHBy8C6YK`. Call `mcp__Figma__create_session` once with that key, then pass the returned `sessionId` to every Figma call.
- Load Figma tools in ONE call:
  `ToolSearch` → `select:mcp__Figma__create_session,mcp__Figma__get_screenshot,mcp__Figma__get_design_context,mcp__Figma__get_metadata`
- For `get_design_context` pass `skillNames: "resource:figma-design-to-code"`, `clientFrameworks: "unknown"`, `clientLanguages: "html,css,javascript"`.

## How to compare

1. **Figma side**: `mcp__Figma__get_screenshot` with `enableBase64Response: true` and `maxDimension` 1600–2400 for a section frame. The image comes back inline — look at it. For a close read of a small mockup, screenshot that child node alone at high `maxDimension`. Use `get_metadata` on a section to find child node ids, and `get_design_context` when you need exact text, colours or numbers.
2. **Built side**: `CHROME=/usr/bin/google-chrome python3 tools/section-shot.py <page> /tmp/audit-<page> 1440 <sectionId> [...]`
   (no ids → all sections). Then open the PNG with the `Read` tool.
3. Put them side by side mentally and list every difference.

## What counts as a discrepancy (report and fix)

- **Missing structural parts** of a mockup: a sidebar, a top bar, a second panel, a column, a legend, a toolbar, a chart.
- **Wrong or invented copy/numbers** inside mockups: labels, row titles, metric values, units, sub-captions. The Figma text is the source of truth — copy it verbatim.
- **Wrong layout**: panels side by side in Figma but stacked in the build, wrong column count, wrong order of blocks.
- **Wrong visual language**: colours not from the product theme, a flat rectangle where Figma has a device with a screen, missing status/severity indicators, missing icons.
- **Missing illustration** entirely (a section that has a diagram in Figma but only text in the build).

## What is NOT a discrepancy (do not "fix")

- Raster images in Figma that cannot be downloaded (the egress proxy blocks figma.com from the shell) — these are **meant** to be rebuilt in HTML/CSS/SVG. Judge them on fidelity of structure, content and colour, not pixel identity.
- Anti-aliasing, font rendering (webfonts don't load offline), 1–2 px offsets.
- Deliberate responsive adaptations below 1440 px.
- Animation: Figma is static. Keep existing animations; just make sure the **resting state** matches.

## Rules for fixes

- Edit `src/` only — never `dist/`. Page markup `src/pages/<slug>.html`, page CSS `src/styles/pages/<slug>.css`, page JS `src/scripts/pages/<slug>.js` (+ `.data.js` for tab content).
- Follow the conventions in `README.md`: semantic tokens (`var(--brand)`, `var(--accent)`…) not product hex; no inline `style=` except data (coordinates inside mockups, series colours, custom properties); `u-*` utilities or a named class otherwise; no inline `<script>`/`<style>` in page HTML; JS registers via `Sollisero.onReady`.
- Mockups that have a fixed design size use `.fit-view[data-w][data-h]` so they scale. Reuse existing mock classes (`.win`, `.win-bar`, `.win-url`, `.win-screen`, `.ui`, `.tbl`, `.lst`, `.kv`, `.pill`) where they fit.
- Keep it accessible: decorative mockups `aria-hidden="true"` or given a short `aria-label`; don't introduce focusable clutter.
- **Scope discipline**: fix the mockups/illustrations. Do not redesign sections that already match, do not touch the nav/footer/forms, do not change copy outside mockups.

## Verify before finishing

```bash
node build.mjs --check            # must print "links, anchors and CSP checks passed"
CHROME=/usr/bin/google-chrome python3 tools/section-shot.py <page> /tmp/verify 1440
CHROME=/usr/bin/google-chrome python3 tools/section-shot.py <page> /tmp/verify-m 390
```
Open the new PNGs with `Read` and confirm the fix landed and nothing else broke. Also check there is no horizontal overflow and no console errors:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    for w in (1920,1440,1024,390):
        pg=b.new_page(viewport={"width":w,"height":900}); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e)[:120]))
        pg.on("console",lambda m:errs.append(m.text[:120]) if m.type=="error" and "fonts.g" not in m.text else None)
        pg.route("**/fonts.g*/**",lambda r:r.abort())
        pg.goto("file:///home/claude/refactor/dist/<page>.html"); pg.wait_for_timeout(900)
        print(w, pg.evaluate("document.documentElement.scrollWidth"), errs[:2]); pg.close()
    b.close()
```

## Report back (keep it tight)

A table-like list per page:
`<section> — <what Figma has> → <what the build had> → <FIXED / NOT FIXED + why>`
End with: anything you deliberately left alone, and anything you think needs a design decision from the user.

---

## Budget discipline (added after a rate-limit interruption)

This audit is token-expensive. Work in this order and keep tool output small:

1. **Triage first.** One `get_screenshot` of the whole desktop frame at `maxDimension: 2000` and one `section-shot.py <page> /tmp/audit-<page> 1440` (all sections). Compare at that level and write down which sections clearly differ. Only those get a deep pass.
2. **Deep pass**: per differing section, screenshot the Figma node at 1400–2000 and the built section, and read both. For text, labels and numbers prefer `get_design_context` (cheap, exact) over squinting at a high-res image.
3. Don't re-screenshot a section you've already read unless you changed it.

## Save findings as you go — IMPORTANT

Keep a running file `docs/audit-<page>.md` and append to it **as soon as you finish each section**, before moving on:

```
## <section id>
- Figma: <what it shows>
- Build: <what it showed>
- Verdict: MATCH | FIXED: <what you changed> | NEEDS-DECISION: <why>
```

If you are interrupted, this file is what survives. Write it incrementally, never "at the end".
