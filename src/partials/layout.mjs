// Shared page chrome. Pure functions: (ctx) => HTML string.
// ctx = { page, config, products, groups, assets: { css: [], js: [] } }

/** The only inline script on the site; its sha256 is pinned in the CSP by the build. */
export const JS_FLAG = "document.documentElement.classList.add('js')";

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const href = (slug) => `${slug}.html`;

export function head({ page, config, assets }) {
  const url = `${config.siteUrl}/${page.slug === 'index' ? '' : href(page.slug)}`;
  return `<!doctype html>
<html lang="${config.lang}">
<head>
<meta charset="utf-8">
${page.base ? `<base href="${config.basePath}">\n` : ''}<script>${JS_FLAG}</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(config.siteName)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#060b22">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${config.fonts}" rel="stylesheet">
${assets.css.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
${assets.js.map((h) => `<script defer src="${h}"></script>`).join('\n')}
</head>`;
}

export function header({ page, products, groups }) {
  // Site-wide navigation, identical on every page: logo · Products (menu) · About ·
  // Careers · Contacts · "Discuss a project".
  const isCurrent = (slug) => page.slug === slug;
  const byGroup = products.reduce((acc, p) => ((acc[p.group] ??= []).push(p), acc), {});
  const inProducts = products.some((p) => isCurrent(p.slug));

  const menuGroup = (g) => `<div class="nav-col">
            <h3>${esc(g.label)}</h3>
            ${(byGroup[g.id] ?? [])
              .map(
                (p) => `<a href="${href(p.slug)}"${isCurrent(p.slug) ? ' aria-current="page"' : ''}><b>${esc(p.name)}</b><small>${esc(p.tagline)}</small></a>`,
              )
              .join('\n            ')}
          </div>`;

  const bar = `<div class="nav-item has-menu" data-navmenu>
          <button class="nav-link nav-toggle${inProducts ? ' active' : ''}" type="button" id="navProductsBtn"
            aria-expanded="false" aria-controls="navProducts"${inProducts ? ' aria-current="true"' : ''}>Products<i class="caret" aria-hidden="true"></i></button>
          <div class="nav-menu" id="navProducts" role="group" aria-labelledby="navProductsBtn">
            <div class="nav-menu-inner">
            ${groups.map(menuGroup).join('\n            ')}
            <a class="nav-promo" href="index.html#products">
              <span class="nav-promo-l">All products</span>
              <b>${products.length} ready-to-deploy products for banking, security and AI</b>
              <span class="nav-promo-go">Compare all products<i aria-hidden="true">→</i></span>
            </a>
          </div>
            <div class="nav-menu-foot">
              <span>Not sure which product fits your task?</span>
              <a href="#contact">Discuss a project<i aria-hidden="true">→</i></a>
            </div>
          </div>
        </div>
        <a class="nav-link" href="index.html#about">About</a>
        <a class="nav-link${isCurrent('careers') ? ' active' : ''}" href="careers.html"${isCurrent('careers') ? ' aria-current="page"' : ''}>Careers</a>
        <a class="nav-link" href="#contact">Contacts</a>`;

  const mobileItem = (p) =>
    // the mobile overlay uses the short tagline; the desktop menu uses the full one
    `<a class="mm" href="${href(p.slug)}"${isCurrent(p.slug) ? ' aria-current="page"' : ''}><div><b>${esc(p.name)}</b><small>${esc(p.short || p.tagline)}</small></div><span aria-hidden="true">↗</span></a>`;

  return `<header class="nav-wrap" id="navWrap">
  <div class="wrap">
    <nav class="nav" aria-label="Main">
      <a href="index.html" class="logo" aria-label="Sollisero — home">sollisero</a>
      <div class="nav-links">
        ${bar}
      </div>
      <a href="#contact" class="nav-cta">Discuss a project</a>
      <button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><i></i><i></i></button>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <span class="mm-label">[ Products ]</span>
      ${products.map(mobileItem).join('\n      ')}
      <span class="mm-label">[ Company ]</span>
      <a class="mm" href="careers.html"${isCurrent('careers') ? ' aria-current="page"' : ''}><div><b>Careers</b><small>Open positions</small></div><span aria-hidden="true">↗</span></a>
      <a href="#contact" class="btn btn-primary">Discuss a project<span class="arr">↗</span></a>
    </div>
  </div>
</header>`;
}

export function others({ page, products }) {
  if (!page.others?.length) return '';
  const cards = page.others
    .map((slug) => {
      const p = products.find((x) => x.slug === slug);
      if (!p) throw new Error(`[${page.slug}] unknown product in "others": ${slug}`);
      return `<a class="prod-card" href="${href(p.slug)}"><span><b>${esc(p.name)}</b><small>${esc(p.tagline)}</small></span><i>↗</i></a>`;
    })
    .join('\n    ');
  return `<section class="s-dark" id="other-products" aria-label="Other products">
  <div class="wrap others">
    <span class="mono">Other products</span>
    ${cards}
  </div>
</section>`;
}

/**
 * Product footer: brand + three link columns + a legal note instead of the legal links.
 * Opted into from front matter (`footer`); the legal links move into one of the columns,
 * so a link with no `href` is resolved by label against config.legal.
 */
function productFooter({ page, config }) {
  const { brand, tagline, columns = [], legalNote } = page.footer;
  const resolve = (l) => l.href ?? config.legal.find((x) => x.label === l.label)?.href ?? '#';
  const col = (c) => `<div><h4>${esc(c.label)}</h4><ul>${c.links
    .map((l) => `<li><a href="${resolve(l)}">${esc(l.label)}</a></li>`)
    .join('')}</ul></div>`;
  return `<footer class="foot-product">
  <div class="wrap">
    <div class="foot">
      <div><span class="logo">${esc(brand)}</span><p>${esc(tagline)}</p></div>
      ${columns.map(col).join('\n      ')}
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} Sollisero</span><div><span>${esc(legalNote)}</span></div></div>
  </div>
</footer>`;
}

export function footer({ page, products, config }) {
  if (page.footer) return productFooter({ page, config });
  return `<footer>
  <div class="wordmark" aria-hidden="true">${esc(page.wordmark || 'sollisero')}</div>
  <div class="wrap">
    <div class="foot">
      <div><a href="index.html" class="logo">sollisero</a><p>An international technology group that designs and builds digital products.</p></div>
      <div><h4>Products</h4><ul>
        ${products.map((p) => `<li><a href="${href(p.slug)}">${esc(p.name)}</a></li>`).join('')}</ul></div>
      <div><h4>Company</h4><ul><li><a href="index.html#about">About</a></li><li><a href="index.html#engagement">Services</a></li><li><a href="index.html#industries">Industries</a></li><li><a href="careers.html">Careers</a></li></ul></div>
      <div><h4>Contacts</h4><ul><li><a href="mailto:${config.contactEmail}">${config.contactEmail}</a></li></ul></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} Sollisero${page.legalSuffix ? ` // ${esc(page.legalSuffix)}` : ''}</span><div>${config.legal.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('')}</div></div>
  </div>
</footer>`;
}

export function document(ctx, main) {
  const { page } = ctx;
  const attrs = [`data-page="${page.slug}"`, page.product ? `data-product="${page.product}"` : ''].filter(Boolean).join(' ');
  return `${head(ctx)}
<body ${attrs}>
<a class="skip-link" href="#top">Skip to content</a>
${header(ctx)}

${main}

${others(ctx)}

${footer(ctx)}
</body>
</html>
`;
}
