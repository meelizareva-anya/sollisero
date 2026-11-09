window.SOLLISERO_CONFIG={"forms":{"endpoint":"/api/leads","timeoutMs":15000}};
/* scripts/core/dom.js */
/**
 * Sollisero runtime core: DOM helpers + component registry.
 *
 * Every script is loaded with `defer`, so all files execute (in order) before DOMContentLoaded.
 *   Sollisero.component(name, init)  — shared components (app bundle), run first at boot
 *   Sollisero.onReady(fn)            — page code (page bundle), runs after all components
 * Page *data* (e.g. tab content) is plain assignment at load time, so it is available to components at boot.
 */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = () => matchMedia('(hover: hover)').matches;

  /** Create an element. `html` is trusted, author-provided markup only — never user input. */
  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  };

  /** Observe visibility; returns the observer so callers can disconnect. */
  const onVisible = (node, fn, opts = { threshold: 0.25 }) => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => fn(e.isIntersecting, e)), opts);
    io.observe(node);
    return io;
  };

  const pad2 = (n) => String(n).padStart(2, '0');

  const components = [];
  const ready = [];

  window.Sollisero = {
    $, $$, RM, el, onVisible, canHover, pad2,
    data: {},
    component(name, init) { components.push({ name, init }); },
    onReady(fn) { ready.push(fn); },
    _queues: { components, ready },
  };

})();

/* scripts/core/boot.js */
/* Boot: run components, then page code. One failing component must not take the page down. */
(() => {
  const { components, ready } = Sollisero._queues;
  const run = (label, fn) => {
    try { fn(); } catch (err) { console.error(`[sollisero] ${label} failed`, err); }
  };
  const boot = () => {
    components.forEach(({ name, init }) => run(`component "${name}"`, init));
    ready.forEach((fn, i) => run(`page script #${i + 1}`, fn));
  };
  // Deferred scripts always execute before DOMContentLoaded; the fallback covers late injection.
  if (document.readyState === 'complete') setTimeout(boot);
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
})();

/* scripts/components/nav.js */
/* Site navigation: sticky backdrop on scroll + mobile menu. Current page is marked at build time (aria-current). */
Sollisero.component('nav', () => {
  const { $, $$ } = Sollisero;
  const wrap = $('#navWrap');
  if (!wrap) return;
  const burger = $('#burger');

  const onScroll = () => wrap.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    wrap.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', String(open));
    burger?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger?.addEventListener('click', () => setMenu(!wrap.classList.contains('menu-open')));
  // In-page anchors (e.g. "Discuss a project" → #contact) must close the menu.
  $$('#mobileMenu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrap.classList.contains('menu-open')) { setMenu(false); burger?.focus(); }
  });
  // Leaving the mobile breakpoint with the menu open must not leave the page scroll-locked.
  matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
});

/* scripts/components/hero.js */
/* Hero decorations: word-by-word headline reveal, code-stream texture, interactive dot field. */

Sollisero.component('split-headline', () => {
  const { $, RM, el } = Sollisero;
  const h1 = $('[data-split]');
  if (!h1 || RM) return;
  let i = 0;
  const split = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.TEXT_NODE) return split(child);
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const w = el('span', 'w');
        w.textContent = part;
        w.style.animationDelay = `${0.15 + i++ * 0.06}s`;
        frag.append(w);
      });
      child.replaceWith(frag);
    });
  };
  split(h1);
});

Sollisero.component('texture', () => {
  const { $$, el } = Sollisero;
  const DEFAULT = 'GET /health status=ok 200|POST /orders id=84213 201|PUT /users/829 role=ops 204|GET /catalog items=24 200|POST /auth token=•••• 200|GET /ledger acct=•••3301 200|POST /events batch=48 202|GET /metrics p95=84ms 200';
  $$('.texture').forEach((tex) => {
    const lines = (tex.dataset.lines || DEFAULT).split('|');
    const frag = document.createDocumentFragment();
    for (let row = 0; row < 34; row++) {
      const cells = Array.from({ length: 12 }, (_, j) => lines[(row * 3 + j) % lines.length]);
      const text = `${cells.join('      ')}      `;
      const div = el('div');
      div.textContent = text + text; // doubled so the -50% drift loops seamlessly
      frag.append(div);
    }
    tex.append(frag);
  });
});

Sollisero.component('dot-field', () => {
  const { $$, RM, onVisible } = Sollisero;
  $$('canvas.dots').forEach((canvas) => {
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const GRID = 22, HOVER_R = 140;
    let W = 0, H = 0, pts = [], mx = -999, my = -999, running = false;

    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = 10; y < H; y += GRID) for (let x = 10; x < W; x += GRID) pts.push([x, y]);
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      for (const [x, y] of pts) {
        let r = 0.6 + 2.6 * (x / W) * (1 - Math.abs(y / H - 0.45) * 1.4);
        r *= 0.65 + 0.55 * (Math.sin(x * 0.012 + y * 0.008 - t * 0.0012) * 0.5 + 0.5);
        const d = Math.hypot(x - mx, y - my);
        if (d < HOVER_R) r += (1 - d / HOVER_R) * 2.2;
        if (r < 0.4) continue;
        ctx.globalAlpha = Math.min(0.9, 0.18 + r * 0.22);
        ctx.fillStyle = d < HOVER_R ? '#ffffff' : '#c2d1f5';
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
    };
    const loop = (t) => { if (!running) return; draw(t); requestAnimationFrame(loop); };

    new ResizeObserver(() => { resize(); draw(0); }).observe(canvas);
    host.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mx = my = -999; });
    if (!RM) onVisible(host, (v) => { running = v; if (v) requestAnimationFrame(loop); }, { threshold: 0 });
  });
});

/* scripts/components/fit-view.js */
/**
 * Fit-to-view scaler for fixed-size UI mockups.
 *   <div class="fit-view" data-w="1100" data-h="580" data-mode="contain|width"><div>…fixed-size mock…</div></div>
 * Exposed as Sollisero.fitAll() for page scripts that inject mocks later.
 */
(() => {
  const fitAll = () => Sollisero.$$('.fit-view').forEach((view) => {
    const inner = view.firstElementChild;
    if (!inner || inner.dataset.fit) return;
    inner.dataset.fit = '1';
    const w = +view.dataset.w || 1100;
    const h = +view.dataset.h || 580;
    const mode = view.dataset.mode || 'contain';
    if (mode === 'contain' && !view.style.aspectRatio && !view.style.height) view.style.aspectRatio = `${w}/${h}`;
    inner.style.width = `${w}px`;
    inner.style.height = `${h}px`;
    new ResizeObserver(() => {
      const W = view.clientWidth;
      const H = view.clientHeight || (W * h) / w;
      const k = mode === 'width' ? W / w : Math.min(W / w, H / h);
      const x = (W - w * k) / 2;
      const y = mode === 'width' ? 0 : (H - h * k) / 2;
      inner.style.transform = `translate(${x}px,${y}px) scale(${k})`;
      if (mode === 'width') view.style.height = `${h * k}px`;
    }).observe(view);
  });
  Sollisero.fitAll = fitAll;
  Sollisero.component('fit-view', fitAll);
})();

/* scripts/components/faq.js */
/* FAQ accordion: [data-faq] > .qa > button[aria-expanded] + .ans. One item open at a time. */
Sollisero.component('faq', () => {
  const { $, $$ } = Sollisero;
  $$('[data-faq]').forEach((list) => {
    const items = $$('.qa', list);
    items.forEach((item, i) => {
      const btn = $('button', item);
      const panel = $('.ans', item);
      if (!btn) return;
      if (panel) {
        panel.id ||= `${list.id || 'faq'}-a${i}`;
        btn.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'region');
      }
      btn.addEventListener('click', () => {
        const open = !item.classList.contains('open');
        items.forEach((x) => { x.classList.remove('open'); $('button', x)?.setAttribute('aria-expanded', 'false'); });
        if (open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  });
});

/* scripts/components/tabs.js */
/**
 * Auto-advancing tabs ("Advantages" pattern).
 *   <div class="adv" data-tabs="KEY"><div class="tabs" role="tablist"></div>
 *     <div class="panel"><span class="big"></span><div class="swap"></div>…</div></div>
 * Content: Sollisero.data[KEY] = [{ tab, title, text, chips?, html? }]
 * `html` is trusted author markup. Emits `tabchange` ({ detail: { i, a } }) on the root.
 */
Sollisero.component('tabs', () => {
  const { $, $$, RM, el, onVisible, canHover, pad2 } = Sollisero;
  const DURATION = 7000;

  $$('[data-tabs]').forEach((root) => {
    const key = root.dataset.tabs;
    const data = root._data || Sollisero.data[key] || [];
    const list = $('.tabs', root);
    const swap = $('.swap', root);
    const big = $('.big', root);
    const panel = $('.panel', root);
    if (!list || !data.length) return;

    const N = data.length;
    let current = -1;
    let timer;
    const uid = `tabs-${key.toLowerCase()}`;
    if (panel) { panel.id ||= `${uid}-panel`; panel.setAttribute('role', 'tabpanel'); }

    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-orientation', 'vertical');
    list.replaceChildren(...data.map((item, i) => {
      const b = el('button', 'tab', `<span class="n">${pad2(i + 1)}</span><span class="t">${item.tab || item.title}</span><span class="a" aria-hidden="true">→</span><span class="prog" aria-hidden="true"></span>`);
      b.type = 'button';
      b.id = `${uid}-${i}`;
      b.setAttribute('role', 'tab');
      if (panel) b.setAttribute('aria-controls', panel.id);
      b.style.setProperty('--dur', `${DURATION}ms`);
      b.addEventListener('click', () => select(i, true));
      b.addEventListener('mouseenter', () => { if (canHover()) select(i, true); });
      b.addEventListener('keydown', (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        const j = e.key === 'Home' ? 0 : e.key === 'End' ? N - 1 : step ? (i + step + N) % N : null;
        if (j == null) return;
        e.preventDefault(); select(j, true); list.children[j].focus();
      });
      return b;
    }));

    const schedule = () => {
      clearTimeout(timer);
      if (!RM) timer = setTimeout(() => { if (!root.classList.contains('paused')) select((current + 1) % N); }, DURATION);
    };

    function select(i, byUser = false) {
      const changed = i !== current;
      current = i;
      const item = data[i];
      [...list.children].forEach((t, j) => {
        t.setAttribute('aria-selected', String(j === i));
        t.tabIndex = j === i ? 0 : -1;
        const prog = $('.prog', t); // restart the progress bar animation
        prog.style.animation = 'none'; void prog.offsetWidth; prog.style.animation = '';
      });
      if (changed) {
        panel?.setAttribute('aria-labelledby', `${uid}-${i}`);
        if (big) big.textContent = pad2(i + 1);
        if (swap) {
          swap.innerHTML = `<span class="k">[ ${pad2(i + 1)} / ${pad2(N)} ]</span><h3>${item.title}</h3><p>${item.text}</p>${item.chips ? `<div class="chips">${item.chips.map((c) => `<span>${c}</span>`).join('')}</div>` : ''}${item.html || ''}`;
          swap.classList.remove('fade-swap'); void swap.offsetWidth; swap.classList.add('fade-swap');
        }
        root.dispatchEvent(new CustomEvent('tabchange', { detail: { i, a: item } }));
      }
      if (byUser) { clearTimeout(timer); root.classList.add('paused'); } else schedule();
    }

    select(0);
    root.classList.remove('paused');
    onVisible(root, (visible) => {
      if (visible && !root.dataset.touched) { root.classList.remove('paused'); schedule(); } else clearTimeout(timer);
    });
    ['pointerdown', 'mouseenter', 'focusin'].forEach((ev) => list.addEventListener(ev, () => { root.dataset.touched = '1'; }));
  });
});

/* scripts/components/capability.js */
/* Capability cards reveal details on hover/focus; on touch devices a tap toggles them. */
Sollisero.component('capability', () => {
  const { $$ } = Sollisero;
  const touch = matchMedia('(hover: none)').matches;
  $$('.cap').forEach((card) => {
    card.tabIndex = 0;
    card.addEventListener('click', (e) => {
      if (touch && !e.target.closest('a')) card.classList.toggle('open');
    });
  });
  if (touch) $$('.hint-t').forEach((h) => { h.textContent = h.textContent.replace(/Hover(?: over)?/i, 'Tap'); });
});

/* scripts/components/form.js */
/**
 * Lead forms → backend. Contract: docs/FORMS_API.md.
 *
 * Markup (every page):  <form class="form" action="/api/leads" method="post" data-form="demo|project" novalidate>
 *   hidden: form, product · honeypot: website · fields: name*, email*, company, message, consent*
 *   success panel: .done (with p + button.again)
 *
 * Without JS the form still posts urlencoded to `action` (the backend redirects back — see the API doc).
 * With JS: client validation → JSON POST with idempotency key, timeout and retry-safe states.
 */
Sollisero.component('form', () => {
  const { $, $$ } = Sollisero;
  const cfg = window.SOLLISERO_CONFIG?.forms || {};
  const ENDPOINT = cfg.endpoint || '/api/leads';
  const TIMEOUT = cfg.timeoutMs || 15000;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const CONTACT = document.querySelector('footer a[href^="mailto:"]')?.getAttribute('href')?.slice(7) || 'sales@sollisero.com';
  const MSG = {
    required: 'Required field',
    email: 'Enter a valid work email',
    consent: 'Please confirm consent to continue',
    network: `We couldn’t send your request. Check your connection and try again, or email <a href="mailto:${CONTACT}">${CONTACT}</a>.`,
    rate: 'Too many requests. Please wait a minute and try again.',
    server: `Something went wrong on our side. Please try again, or email <a href="mailto:${CONTACT}">${CONTACT}</a>.`,
  };

  // Attribution captured once per visit (first landing wins).
  const ATTR_KEY = 'sollisero:attribution';
  const attribution = (() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(ATTR_KEY) || 'null');
      if (saved) return saved;
      const q = new URLSearchParams(location.search);
      const utm = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].filter((k) => q.get(k)).map((k) => [k, q.get(k)]));
      const value = { utm, referrer: document.referrer || null, landingPage: location.pathname };
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(value));
      return value;
    } catch { return { utm: {}, referrer: document.referrer || null, landingPage: location.pathname }; }
  })();

  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  $$('form.form').forEach((form) => {
    const submit = $('[type="submit"]', form);
    const done = $('.done', form);
    const startedAt = Date.now();
    let requestId = uuid(); // stable across retries of the same submission → backend dedupes
    let inFlight = false;

    // Error live region for the whole form (network / server errors).
    const status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'alert');
    status.hidden = true;
    (form.querySelector('.form-foot') || submit?.parentElement || form).before(status);

    const errorSlot = (input) => {
      const holder = input.closest('.field') || input.closest('label')?.parentElement || form;
      let slot = $(':scope > .e', holder);
      if (!slot) {
        slot = document.createElement('span');
        slot.className = 'e';
        (input.closest('label') || input).after(slot);
      }
      slot.id ||= `${input.name}-err-${Math.random().toString(36).slice(2, 7)}`;
      slot.setAttribute('aria-live', 'polite');
      input.setAttribute('aria-describedby', slot.id);
      return slot;
    };
    const setError = (input, msg) => {
      input.closest('.field')?.classList.toggle('err', !!msg);
      errorSlot(input).textContent = msg || '';
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    };
    const validate = (input) => {
      const v = input.type === 'checkbox' ? input.checked : input.value.trim();
      if (input.required && !v) return input.type === 'checkbox' ? MSG.consent : MSG.required;
      if (input.type === 'email' && v && !EMAIL_RE.test(v)) return MSG.email;
      return '';
    };
    const fields = () => $$('input:not([type="hidden"]):not([name="website"]), textarea, select', form);

    fields().forEach((input) => {
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
        if (input.getAttribute('aria-invalid') === 'true') setError(input, validate(input));
      });
      input.addEventListener('blur', () => { if (input.type === 'email' && input.value) setError(input, validate(input)); });
    });

    const setBusy = (busy) => {
      inFlight = busy;
      if (!submit) return;
      submit.disabled = busy;
      submit.setAttribute('aria-busy', String(busy));
    };
    const showStatus = (html) => { status.innerHTML = html; status.hidden = !html; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (inFlight) return;
      showStatus('');

      let firstInvalid = null;
      fields().forEach((input) => {
        const msg = validate(input);
        setError(input, msg);
        if (msg && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = new FormData(form);
      const value = (k) => (data.get(k) || '').toString().trim();
      const payload = {
        requestId,
        form: value('form') || form.dataset.form || 'lead',
        product: value('product') || document.body.dataset.product || null,
        page: location.pathname,
        locale: document.documentElement.lang || 'en',
        name: value('name'),
        email: value('email'),
        company: value('company') || null,
        message: value('message') || null,
        consent: data.get('consent') === 'yes',
        consentText: $('.consent span', form)?.textContent.trim() || null,
        attribution,
        meta: { website: value('website'), elapsedMs: Date.now() - startedAt }, // anti-bot signals
        submittedAt: new Date().toISOString(),
      };

      setBusy(true);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
      try {
        const res = await fetch(form.getAttribute('action') || ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': requestId },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
          credentials: 'same-origin',
        });
        if (res.ok) {
          const first = payload.name.split(/\s+/)[0];
          const p = done && $('p', done);
          if (p) p.textContent = `Thanks, ${first}. We’ll write to ${payload.email} within one business day.`;
          form.classList.add('sent');
          $('.again', form)?.focus();
          form.dispatchEvent(new CustomEvent('lead:sent', { bubbles: true, detail: { form: payload.form, product: payload.product } }));
          return;
        }
        if (res.status === 422 || res.status === 400) {
          const body = await res.json().catch(() => ({}));
          const errs = body.errors || {};
          Object.entries(errs).forEach(([name, msg]) => { const input = form.elements[name]; if (input && input.setAttribute) setError(input, String(msg)); });
          const firstErr = Object.keys(errs).map((n) => form.elements[n]).find((x) => x && x.focus);
          if (firstErr) firstErr.focus(); else showStatus(MSG.server);
          return;
        }
        showStatus(res.status === 429 ? MSG.rate : MSG.server);
      } catch {
        showStatus(MSG.network);
      } finally {
        clearTimeout(timer);
        setBusy(false);
      }
    });

    // Returning from a failed no-JS submission (/?error=1#contact).
    if (new URLSearchParams(location.search).get('error') === '1' && form === $('form.form')) showStatus(MSG.server);

    $('.again', form)?.addEventListener('click', () => {
      form.reset();
      requestId = uuid();
      fields().forEach((i) => setError(i, ''));
      showStatus('');
      form.classList.remove('sent');
      fields()[0]?.focus();
    });
  });
});

/* scripts/components/count-up.js */
/* Count-up numbers: <span data-count="15" data-pre="" data-suf="+">15+</span> (final value in markup = no-JS fallback). */
Sollisero.component('count-up', () => {
  const { $$, RM, onVisible } = Sollisero;
  const DURATION = 1400;
  $$('[data-count]').forEach((node) => {
    const target = parseFloat(node.dataset.count);
    const pre = node.dataset.pre || '';
    const suf = node.dataset.suf || '';
    const decimals = (String(node.dataset.count).split('.')[1] || '').length;
    const render = (v) => { node.textContent = pre + v.toFixed(decimals) + suf; };
    const io = onVisible(node, (visible) => {
      if (!visible) return;
      io.disconnect();
      if (RM) return render(target);
      const t0 = performance.now();
      const frame = (t) => {
        const k = Math.min(1, (t - t0) / DURATION);
        render(target * (1 - (1 - k) ** 3));
        if (k < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  });
});

/* scripts/components/reveal.js */
/* Scroll reveal for .rv elements, staggered among siblings.
   .rv is only hidden under html.js (set by an inline, CSP-hashed snippet in <head>), so content stays visible if JS fails. */
Sollisero.component('reveal', () => {
  const { $$ } = Sollisero;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.children].filter((x) => x.classList.contains('rv'));
    e.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(e.target)) * 0.08}s`;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach((n) => io.observe(n));
});
