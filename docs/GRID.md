# Grid, breakpoints and wide screens

One grid for every width. Source of truth in Figma: `02.kit` → Kit · Foundations →
**Foundations · Grid & adaptive · v2**, with templates in **Templates · horizontal grid** and a
2560 example on `1. main site` → **Home · Desktop 2560 · wide screens**.

## The rule

- **1920 is the master layout.**
- **Below 1920** every layout value scales with the screen (`value × 100vw / 1920`) until it
  reaches its 390 value.
- **Above 1920** nothing scales. Content stops at 1760 (12 × 132 + 11 × 16), the side margins
  grow, and section backgrounds run to the screen edges.

## Breakpoints

| Range | Screen | Columns | Gutter | Margin (`--pad`) | Nav |
|---|---|---|---|---|---|
| S · mobile | ≤ 639 | 4 | 16 | 16 | mobile bar |
| M · tablet | 640–1279 | 8 | 16 | width ÷ 24 | mobile bar |
| L · laptop | 1280–1919 | 12 | 16 | width ÷ 24 | nav pill |
| XL · desktop | ≥ 1920 | 12 × 132 | 16 | 80, then (width − 1760) ÷ 2 | nav pill |

The breakpoints are `@media (max-width:639px)` and `@media (max-width:1279px)`; nothing changes at 1920
except that `.wrap` stops growing.

Component breakpoints (1500, 1200, 1100, 900, 820, 760, 700) are points where one component stops
fitting. They stay inside a range and will move to the page breakpoints as pages are re-laid on
the grid (see "Column patterns" in Figma). Don't add new ones without a comment saying why.

## Tokens (`src/styles/tokens.css`)

| CSS | Value | 1920 | 1440 | 768 | 390 | Figma variable |
|---|---|---|---|---|---|---|
| `--cols` | 12 · 8 at ≤ 1279 · 4 at ≤ 639 | 12 | 12 | 8 | 4 | `layout/columns` |
| `--gutter` | `16px` | 16 | 16 | 16 | 16 | `layout/gutter` |
| `--pad` | `clamp(16px, 4.1667vw, 80px)` | 80 | 60 | 32 | 16 | `layout/margin` |
| `--max` | `1760px` | 1760 | — | — | — | `layout/container` |
| `--stage` | `1920px` (`.l-stage` is `min(100%, 1920px)`) | 1920 | 1440 | 768 | 390 | — |
| `--sec` | `clamp(64px, 6.25vw, 120px)` | 120 | 90 | 64 | 64 | `layout/section-pad-y` |
| `--sec-gap` | `clamp(32px, 3.3334vw, 64px)` | 64 | 48 | 32 | 32 | `layout/section-gap` |
| `--sec-cta` | `clamp(64px, 5vw, 96px)` | 96 | 72 | 64 | 64 | `layout/cta-pad-y` |
| `--sec-strip` | `clamp(48px, 3.3334vw, 64px)` | 64 | 48 | 48 | 48 | `layout/strip-pad-y` |
| `--r-panel` | `clamp(24px, 2.9167vw, 56px)` | 56 | 42 | 24 | 24 | `radius/panel` |

## Vertical rhythm (the horizontal grid)

- Sections touch: no margins between them. Each section's padding is the rhythm:
  `.sec` uses `--sec`, `.cta` uses `--sec-cta`, strips and the footer top use `--sec-strip`.
- Inside a section, the gap between the header and the content, and between stacked blocks, is
  `--sec-gap`. The first block in `.sec > .wrap` never adds a top margin.
- Cards in a row and rows of cards are `--gutter` apart, so they land on the columns.
- Every vertical distance is a multiple of 8 (4 inside components).

## Markup

```html
<section class="sec s-dark">              <!-- background: edge to edge -->
  <div class="l-stage">…decor…</div>      <!-- optional: 1920 wide, centred -->
  <div class="wrap">                      <!-- content ≤ 1760, margins --pad -->
    <div class="l-grid">                  <!-- 12 / 8 / 4 columns, gap 16 -->
      <div style="--span:6;--span-m:4">…</div>
      <div style="--span:6;--span-m:4">…</div>
    </div>
  </div>
</section>
```

`.l-grid` children span `--span` columns of 12; on tablet `--span-m` of 8 and on mobile `--span-s`
of 4. Without them a child takes the full row on tablet and mobile.

## Wide screens (> 1920)

- Backgrounds and deck panels belong to the `<section>`, so they always reach the screen edges. Never put a
  background on `.wrap`.
- Decor is positioned against the central 1920 stage, not the screen edge. Use `.l-stage`, or
  offset with `calc(50% - …)`:
  - the CTA dot field: `right:max(-80px, calc(50% - 1040px))`;
  - the footer wordmark: `left:max(-36px, calc(50% - 996px))`.
- Glows are capped in px (`min(49.5vw, 950px)`) so they stop growing at 1920.
- Line textures tile to the edges, anchored to the centre (`calc(50% - 900px)` for a 120 px tile).
- Check new pages at 2560: only backgrounds may touch the screen edge.
