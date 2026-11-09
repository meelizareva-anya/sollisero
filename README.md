# Sollisero — marketing site

Static site built from `src/` by a zero-dependency Node script. Output in `dist/` is plain HTML/CSS/JS that any web server can host. Lead forms post to one backend endpoint (see [docs/FORMS_API.md](docs/FORMS_API.md)).

```bash
node build.mjs --dev        # build + http://localhost:5173, rebuilds on change (forms hit a dev stub)
node build.mjs --check      # production build; fails on broken links/anchors, unresolved placeholders, CSP violations
node tools/preview.mjs      # serve dist/ with the exact production headers (CSP) + proxy /api → :8787
node server/leads-server.mjs  # reference forms API (JSONL storage + optional webhook)
```
Requirements: Node ≥ 18. Tests additionally need Python 3 + Playwright (`pip install playwright && playwright install chromium`).

## Structure

```
site.config.json            site URL, contact email, forms endpoint/timeout, legal links, fonts
src/
  data/products.json        ← single source of truth: product names, taglines, menu groups
  partials/layout.mjs       head / nav / "Other products" / footer — rendered from data, identical on every page
  pages/<slug>.html         front matter (JSON) + <main> markup
  styles/                   app.css bundle, in cascade order (see build.mjs → APP_CSS):
    tokens.css              design tokens (semantic names: --brand, --accent, --surface-dark…)
    themes.css              product palettes: body[data-product="…"] overrides brand tokens
    base.css · layout.css   reset, typography, section shells
    components/*.css        nav, button, hero, card, window (UI mocks), capability, tabs, faq, logos, form, others, footer
    utilities.css           reveal + a short list of u-* utilities
    responsive.css          shared breakpoints
    pages/<slug>.css        page-only styles (own bundle, loaded only on that page)
  scripts/
    core/dom.js · boot.js   Sollisero runtime: helpers + component registry + boot order
    components/*.js         nav, hero (headline/texture/dots), fit-view, faq, tabs, capability, form, count-up, reveal
    pages/<slug>.data.js    page content for components (e.g. tab panels) — plain data, loads before boot
    pages/<slug>.js         page-only behaviour (runs after all components via Sollisero.onReady)
  static/                   copied to dist/ as-is (favicon…)
server/leads-server.mjs     reference forms API
deploy/                     nginx.conf (generated from template), headers.json, systemd unit, deploy.sh
tools/                      preview server, e2e tests, visual-regression tool
```

### Front matter
```json
{ "title": "…", "description": "…", "product": "dspm", "wordmark": "sollisero",
  "others": ["atm", "cash-solutions"], "noindex": false, "styles": "system", "base": "/" }
```
`product` switches the theme; `others` renders the "Other products" strip from `products.json`; `noindex` hides a page from search and the sitemap; `styles` reuses another page stylesheet; `base` is only for 404.

## Conventions

**Tokens & themes.** Components use semantic tokens only (`var(--brand)`, never a product hex). A product palette is one block in `themes.css`. Tokens that reference other tokens (`--hero-bg`, `--cta-bg`) are declared on `body`, because a `var()` inside a custom property resolves where it is declared — on `:root` it would ignore the product theme.

**Where CSS goes.** Used on 2+ pages → `components/`. One page → `pages/<slug>.css` (it's a separate bundle, so page rules can't leak into other pages). Avoid overriding component internals from page CSS; prefer a modifier class (`.adv--compact`) or a component custom property (`.form{--consent-w:326px}`).

**Class names.** Page markup must not reuse a class name that the shared bundle defines bare (`.card`, `.sec`, `.win`, `.pill`, `.panel`, `.field`…) for a *different* purpose — the shared rule still applies and paints your element. Two such bugs existed: `<span class="card">` inside the ATM withdraw mock picked up the white card surface, and `<div class="sec">` inside the cash-solutions device diagram picked up full section padding. Prefix page-private names instead (`.cno`, `.secp`, `.dash-*`, `.dm-*`). To audit: grep page markup for the bare names listed in `src/styles/components/*.css`.

**Inline styles.** Allowed only for *data*: coordinates of elements inside UI mockups, chart/legend series colours, CSS custom properties (`style="--v:.72"`). Presentational one-offs use `u-*` utilities (they carry `!important` to keep inline-style precedence) or a named class.

**JavaScript.** All scripts are `defer`. Components register with `Sollisero.component(name, init)`; page code uses `Sollisero.onReady(fn)`; page data assigns `Sollisero.data.KEY` at load. Each init is isolated — one failing component logs an error and the rest of the page keeps working. No inline scripts except the CSP-hashed `html.js` flag.

**Progressive enhancement.** Without JS every section is visible (`.rv` hides only under `html.js`) and forms post as `x-www-form-urlencoded` → `/thanks.html`.

**Accessibility.** Skip link, `aria-current` on the active nav item, `aria-expanded`/`aria-controls` on toggles, roving tabindex + arrow keys in tabs, FAQ regions, form errors linked by `aria-describedby`, focus moves to the first invalid field, `prefers-reduced-motion` honoured everywhere.

## Adding things

- **Product**: add to `src/data/products.json` (nav, mobile menu, footer and "Other products" update everywhere), add a theme block in `themes.css`, create `src/pages/<slug>.html` (+ optional css/js), add the product id to `PRODUCTS` in `server/leads-server.mjs`.
- **Page**: `src/pages/<slug>.html` with front matter. It's picked up automatically and added to `sitemap.xml`.
- **Component**: CSS in `styles/components/`, JS in `scripts/components/`, then list both in `APP_CSS` / `APP_JS` in `build.mjs` (order = cascade/execution order).

## Deploy

1. `node build.mjs --check` — must pass.
2. Upload `dist/` atomically: `SSH=user@host ./deploy/deploy.sh` (new release dir → symlink switch; rollback = point the symlink back).
3. nginx: `deploy/nginx.conf` (HTTPS redirect, security headers incl. CSP, gzip, `immutable` caching for hashed assets, `no-cache` for HTML, `/dspm` → `/dspm.html`, `/api/` proxy with rate limit, 404 page). Add `limit_req_zone $binary_remote_addr zone=leads:10m rate=10r/m;` in the `http {}` block.
4. Forms API: run `server/leads-server.mjs` with `deploy/leads-api.service`, or point `forms.endpoint` at your own backend implementing [docs/FORMS_API.md](docs/FORMS_API.md).

### GitHub Pages (preview hosting)
`.github/workflows/pages.yml` builds and publishes `dist/` on every push to `main`. It needs one
manual step first: **Settings → Pages → Source: "GitHub Actions"**. Until then the workflow fails at
`configure-pages`; it goes green on the next push.

A project site is served from `/<repo>/`, so the workflow passes `SITE_BASE` and `SITE_URL` to the
build — those drive the 404 page's `<base href>` and the canonical/sitemap URLs. All other links are
relative, so they work under any prefix. Pages is static: the lead forms will 404 on `/api/leads`
there, which is expected — point `forms.endpoint` at a real backend for anything but a visual preview.

Asset file names contain a content hash, so browsers never see stale CSS/JS after a deploy, and HTML is always revalidated.

### Before launch — checklist
- [ ] `site.config.json`: real `siteUrl` (canonical/OG/sitemap), `legal` links (Privacy / Terms / Cookies are `#` now), `contactEmail`.
- [ ] Forms endpoint reachable from the site origin; leads arriving in storage/CRM (`LEAD_WEBHOOK_URL`).
- [ ] TLS certificate paths in `deploy/nginx.conf`.
- [ ] Replace placeholders that come from the design: client logos (text), Careers photos.
- [ ] meeting notes FAQ "Which languages are supported?" — marked "to confirm" in the copy doc.
- [ ] Fonts load from Google Fonts (allowed in CSP). To self-host, put woff2 files in `src/static/fonts/`, swap the `<link>` for `@font-face` in `base.css` and drop the Google hosts from the CSP in `build.mjs`.

## Testing

- `python3 tools/e2e.py` — needs `tools/preview.mjs` on :4173 and the leads server on :8787 (`RATE_MAX=1000` for repeated runs). Checks every page for CSP/console errors and missing assets, plus the full forms matrix and the no-JS path.
- Visual regression: `npm run test:visual:baseline` once, then `npm run test:visual` after changes — pixel diff per page at 1440 and 390 px (deterministic: reduced motion, seeded random, frozen clock).
