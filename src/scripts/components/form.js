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
