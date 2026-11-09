#!/usr/bin/env node
/**
 * Sollisero static site build — zero dependencies (Node ≥ 18).
 *
 *   node build.mjs            build to dist/
 *   node build.mjs --dev      build + serve on http://localhost:5173 + rebuild on change
 *   node build.mjs --check    build and fail on broken internal links / missing anchors
 *
 * Pipeline
 *   src/pages/*.html          front matter (JSON between --- lines) + <main> markup
 *   src/partials/layout.mjs   head / header / other-products / footer (data-driven)
 *   src/data/products.json    single source of truth for product names, taglines, menu groups
 *   src/styles/               app.css = ordered layer files; pages/<slug>.css = page-only styles
 *   src/scripts/              app.js = core + components; pages/<slug>(.data).js = page-only code
 *   src/static/               copied as-is (favicon, robots.txt, …)
 * Output assets are content-hashed (cache them forever); HTML is not (no-cache).
 */
import { readFile, writeFile, mkdir, rm, readdir, cp, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync, watch } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import http from 'node:http';

const cspHash = (code) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`;

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const args = new Set(process.argv.slice(2));

/* ---------- ordered bundles (order = cascade / execution order) ---------- */
const APP_CSS = [
  'styles/tokens.css',
  'styles/themes.css',
  'styles/base.css',
  'styles/layout.css',
  'styles/components/button.css',
  'styles/components/nav.css',
  'styles/components/hero.css',
  'styles/components/card.css',
  'styles/components/window.css',
  'styles/components/capability.css',
  'styles/components/tabs.css',
  'styles/components/faq.css',
  'styles/components/logos.css',
  'styles/components/form.css',
  'styles/components/others.css',
  'styles/components/footer.css',
  'styles/utilities.css',
  'styles/responsive.css',
];
const APP_JS = [
  'scripts/core/dom.js',
  'scripts/core/boot.js',
  'scripts/components/nav.js',
  'scripts/components/hero.js',
  'scripts/components/fit-view.js',
  'scripts/components/faq.js',
  'scripts/components/tabs.js',
  'scripts/components/capability.js',
  'scripts/components/form.js',
  'scripts/components/count-up.js',
  'scripts/components/reveal.js',
];

/* ---------- helpers ---------- */
const read = (p) => readFile(join(SRC, p), 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const log = (...a) => console.log('[build]', ...a);

function minifyCss(css) {
  // Conservative: drop comments and collapse whitespace; never touch ':' (selectors vs. pseudo-classes).
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

async function emit(dir, base, ext, content) {
  const name = `${base}.${hash(content)}.${ext}`;
  await mkdir(join(DIST, dir), { recursive: true });
  await writeFile(join(DIST, dir, name), content);
  return `${dir}/${name}`;
}

async function concat(files, { optional = false } = {}) {
  const parts = [];
  for (const f of files) {
    if (!existsSync(join(SRC, f))) {
      if (optional) continue;
      throw new Error(`missing source file: src/${f}`);
    }
    parts.push(`/* ${f} */\n${await read(f)}`);
  }
  return parts.join('\n');
}

function parsePage(slug, raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`[${slug}] missing front matter`);
  const fm = JSON.parse(m[1]);
  for (const k of ['title', 'description']) if (!fm[k]) throw new Error(`[${slug}] front matter needs "${k}"`);
  return { slug, ...fm, main: m[2].trim() };
}

/* ---------- build ---------- */
export async function build() {
  const t0 = performance.now();
  const config = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8'));
  // Deploy-time overrides (e.g. a GitHub Pages project site lives under /<repo>/).
  if (process.env.SITE_BASE) config.basePath = process.env.SITE_BASE;
  if (process.env.SITE_URL) config.siteUrl = process.env.SITE_URL.replace(/\/$/, '');
  const { products, groups } = JSON.parse(await read('data/products.json'));
  // fresh import each build so --dev picks up partial edits
  const layout = (layoutModule = await import(`${pathToFileURL(join(SRC, 'partials/layout.mjs')).href}?t=${Date.now()}`));

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  if (existsSync(join(SRC, 'static'))) await cp(join(SRC, 'static'), DIST, { recursive: true });

  // shared bundles
  const appCss = await emit('assets/css', 'app', 'css', minifyCss(await concat(APP_CSS)));
  const runtimeConfig = `window.SOLLISERO_CONFIG=${JSON.stringify({ forms: config.forms })};\n`;
  const appJs = await emit('assets/js', 'app', 'js', runtimeConfig + (await concat(APP_JS)));

  const pageFiles = (await readdir(join(SRC, 'pages'))).filter((f) => f.endsWith('.html')).sort();
  const built = [];
  for (const file of pageFiles) {
    const slug = file.replace(/\.html$/, '');
    const page = parsePage(slug, await read(`pages/${file}`));
    // Build-time placeholders in page markup (config-driven URLs).
    const privacy = config.legal.find((l) => /privacy/i.test(l.label))?.href || '#';
    page.main = page.main.replaceAll('%FORMS_ENDPOINT%', config.forms.endpoint).replaceAll('%PRIVACY_URL%', privacy);
    if (/%[A-Z_]+%/.test(page.main)) throw new Error(`[${slug}] unresolved placeholder ${page.main.match(/%[A-Z_]+%/)[0]}`);
    const css = [appCss];
    const js = [appJs];

    const pageCss = await concat([`styles/pages/${page.styles || slug}.css`], { optional: true });
    if (pageCss.trim()) css.push(await emit('assets/css', page.styles || slug, 'css', minifyCss(pageCss)));

    // page data runs immediately (before DOMContentLoaded); page code runs after app boot.
    const data = await concat([`scripts/pages/${slug}.data.js`], { optional: true });
    const code = await concat([`scripts/pages/${slug}.js`], { optional: true });
    if (data || code) {
      const body = `${data}\n${code ? `Sollisero.onReady(() => {\n${code}\n});` : ''}`;
      js.push(await emit('assets/js', slug, 'js', body));
    }

    const ctx = { page, config, products, groups, assets: { css, js } };
    await writeFile(join(DIST, `${slug}.html`), layout.document(ctx, page.main));
    built.push(page);
  }

  // sitemap (404 and noindex pages excluded)
  const indexable = built.filter((p) => !p.noindex);
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
      .map((p) => `  <url><loc>${config.siteUrl}/${p.slug === 'index' ? '' : `${p.slug}.html`}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);

  // Security headers: one definition → deploy/headers.json (preview server) + deploy/nginx.conf (production).
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${cspHash(layout.JS_FLAG)}`,
    "style-src 'self' https://fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'", // inline style attributes carry data (mock coordinates, series colours)
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
  const headers = {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'X-Frame-Options': 'DENY',
  };
  await mkdir(join(ROOT, 'deploy'), { recursive: true });
  await writeFile(join(ROOT, 'deploy/headers.json'), `${JSON.stringify(headers, null, 2)}\n`);
  const tpl = join(ROOT, 'deploy/nginx.conf.template');
  if (existsSync(tpl)) await writeFile(join(ROOT, 'deploy/nginx.conf'), (await readFile(tpl, 'utf8')).replaceAll('%CSP%', csp));

  log(`${built.length} pages → dist/ in ${Math.round(performance.now() - t0)} ms`);
  return built;
}

/* ---------- link check ---------- */
let layoutModule;
async function check() {
  const files = (await readdir(DIST)).filter((f) => f.endsWith('.html'));
  const ids = {};
  const html = {};
  for (const f of files) {
    html[f] = await readFile(join(DIST, f), 'utf8');
    ids[f] = new Set([...html[f].matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  }
  const problems = [];
  for (const f of files) {
    for (const [, ref] of html[f].matchAll(/(?:href|src)="([^"]+)"/g)) {
      // Root-absolute refs (the 404 page's <base href>) are resolved by the server, not by dist/.
      if (/^(https?:|mailto:|tel:|data:|\/)/.test(ref) || ref === '#') continue;
      const [path, anchor] = ref.split('#');
      const target = path || f;
      if (!existsSync(join(DIST, target))) problems.push(`${f}: missing file ${ref}`);
      else if (anchor && target.endsWith('.html') && !ids[target]?.has(anchor)) problems.push(`${f}: missing anchor ${ref}`);
    }
    for (const [, code] of html[f].matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g))
      if (code !== layoutModule.JS_FLAG) problems.push(`${f}: inline <script> not pinned in CSP (breaks CSP)`);
    if (/\bon[a-z]+="/.test(html[f])) problems.push(`${f}: inline event handler (breaks CSP)`);
  }
  if (problems.length) {
    console.error(problems.map((p) => `  ✗ ${p}`).join('\n'));
    process.exitCode = 1;
  } else log('links, anchors and CSP checks passed');
}

/* ---------- dev server ---------- */
function serve(port = 5173) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png' };
  http
    .createServer(async (req, res) => {
      const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (req.method === 'POST' && url === '/api/leads') {
        // dev stub for the forms API — see docs/FORMS_API.md
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          log('lead (dev stub):', body);
          res.writeHead(201, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: true, id: `dev-${Date.now()}` }));
        });
        return;
      }
      let file = resolve(DIST, `.${url.endsWith('/') ? `${url}index.html` : url}`);
      if (!file.startsWith(DIST)) return res.writeHead(403).end();
      try {
        if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
        res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
        res.end(await readFile(file));
      } catch {
        res.writeHead(404, { 'content-type': 'text/html' }).end(existsSync(join(DIST, '404.html')) ? await readFile(join(DIST, '404.html')) : 'Not found');
      }
    })
    .listen(port, () => log(`dev server http://localhost:${port}`));
}

/* ---------- cli ---------- */
await build();
if (args.has('--check')) await check();
if (args.has('--dev')) {
  serve();
  let t;
  watch(SRC, { recursive: true }, () => {
    clearTimeout(t);
    t = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  });
}
