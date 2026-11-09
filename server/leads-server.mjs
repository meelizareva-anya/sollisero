#!/usr/bin/env node
/**
 * Reference implementation of the Sollisero forms API (docs/FORMS_API.md). Zero dependencies, Node ≥ 18.
 *
 *   PORT=8787 LEADS_FILE=./data/leads.jsonl LEAD_WEBHOOK_URL=https://… node server/leads-server.mjs
 *
 * Intended to sit behind nginx (`location /api/ { proxy_pass http://127.0.0.1:8787; }`).
 * Your backend team can replace it with any stack — the contract is what matters.
 *
 * - Accepts JSON (JS-enabled forms) and application/x-www-form-urlencoded (no-JS fallback → 303 redirect).
 * - Validates, deduplicates by requestId (Idempotency-Key), rate-limits per IP, filters bots (honeypot, fill time).
 * - Appends each lead to a JSONL file and optionally forwards it to a webhook (CRM, Slack, n8n, Zapier…).
 */
import http from 'node:http';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const PORT = +(process.env.PORT || 8787);
const LEADS_FILE = resolve(process.env.LEADS_FILE || './data/leads.jsonl');
const WEBHOOK = process.env.LEAD_WEBHOOK_URL || '';
const MAX_BODY = 32 * 1024;
const RATE = { windowMs: 10 * 60 * 1000, max: +(process.env.RATE_MAX || 10) };
const MIN_FILL_MS = 2500; // humans don't fill a form in under ~2.5 s
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORMS = new Set(['demo', 'project', 'lead']);
const PRODUCTS = new Set(['', 'atm', 'dspm', 'cash', 'retail', 'work-it', 'meetly', 'bim']);

const seen = new Map(); // requestId → { status, body } (idempotency, 24 h)
const hits = new Map(); // ip → timestamps
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of seen) if (now - v.at > 864e5) seen.delete(k);
  for (const [k, v] of hits) { const r = v.filter((t) => now - t < RATE.windowMs); r.length ? hits.set(k, r) : hits.delete(k); }
}, 60_000).unref();

const log = (level, msg, extra = {}) => console[level === 'error' ? 'error' : 'log'](JSON.stringify({ t: new Date().toISOString(), level, msg, ...extra }));
const clip = (v, n) => (v == null ? null : String(v).trim().slice(0, n) || null);

function readBody(req) {
  return new Promise((ok, fail) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > MAX_BODY) { fail(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')));
    req.on('error', fail);
  });
}

function normalise(raw, isForm) {
  // urlencoded posts (no JS) carry flat fields; JSON posts carry the full payload
  const consent = isForm ? raw.consent === 'yes' : raw.consent === true;
  return {
    requestId: clip(raw.requestId, 64),
    form: clip(raw.form, 20) || 'lead',
    product: clip(raw.product, 20) || '',
    page: clip(raw.page, 200),
    locale: clip(raw.locale, 10) || 'en',
    name: clip(raw.name, 120),
    email: clip(raw.email, 200)?.toLowerCase() || null,
    company: clip(raw.company, 200),
    message: clip(raw.message, 4000),
    consent,
    consentText: clip(raw.consentText, 400),
    attribution: isForm ? {} : (raw.attribution && typeof raw.attribution === 'object' ? raw.attribution : {}),
    bot: { website: clip(isForm ? raw.website : raw.meta?.website, 200), elapsedMs: isForm ? null : Number(raw.meta?.elapsedMs) || 0 },
    submittedAt: clip(raw.submittedAt, 40),
  };
}

function validate(l) {
  const errors = {};
  if (!l.name) errors.name = 'Required field';
  if (!l.email) errors.email = 'Required field';
  else if (!EMAIL_RE.test(l.email)) errors.email = 'Enter a valid work email';
  if (!l.consent) errors.consent = 'Please confirm consent to continue';
  if (!FORMS.has(l.form)) errors.form = 'Unknown form';
  if (!PRODUCTS.has(l.product)) errors.product = 'Unknown product';
  return errors;
}

async function store(lead) {
  await mkdir(dirname(LEADS_FILE), { recursive: true });
  await appendFile(LEADS_FILE, `${JSON.stringify(lead)}\n`);
  if (!WEBHOOK) return;
  try {
    const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead), signal: AbortSignal.timeout(8000) });
    if (!res.ok) log('error', 'webhook non-2xx', { status: res.status, id: lead.id });
  } catch (e) { log('error', 'webhook failed', { error: e.message, id: lead.id }); } // lead is already on disk
}

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
};
// No-JS fallback: success → /thanks.html, failure → back to the form with ?error=1 (JS shows the message if available).
const redirectBack = (req, res, ok) => {
  if (ok) return res.writeHead(303, { location: '/thanks.html' }).end();
  let ref;
  try { ref = new URL(req.headers.referer); } catch { ref = new URL('/', 'http://x'); }
  ref.searchParams.set('error', '1');
  ref.hash = 'contact';
  res.writeHead(303, { location: ref.pathname + ref.search + ref.hash }).end();
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/health') return send(res, 200, { ok: true });
  if (url.pathname !== '/api/leads') return send(res, 404, { error: 'not_found' });
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' }, { allow: 'POST' });

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const ctype = (req.headers['content-type'] || '').split(';')[0].trim();
  const isForm = ctype === 'application/x-www-form-urlencoded';
  if (!isForm && ctype !== 'application/json') return send(res, 415, { error: 'unsupported_media_type' });

  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  if (recent.length >= RATE.max) { log('warn', 'rate limited', { ip }); return isForm ? redirectBack(req, res, false) : send(res, 429, { error: 'rate_limited' }, { 'retry-after': '60' }); }
  hits.set(ip, [...recent, now]);

  let raw;
  try {
    const text = await readBody(req);
    raw = isForm ? Object.fromEntries(new URLSearchParams(text)) : JSON.parse(text || '{}');
  } catch (e) { return send(res, e.status || 400, { error: e.status === 413 ? 'payload_too_large' : 'invalid_body' }); }

  const lead = normalise(raw, isForm);
  const idem = req.headers['idempotency-key'] || lead.requestId;
  if (idem && seen.has(idem)) { const prev = seen.get(idem); return send(res, prev.status, prev.body); }

  const errors = validate(lead);
  if (Object.keys(errors).length) return isForm ? redirectBack(req, res, false) : send(res, 422, { error: 'validation_failed', errors });

  const isBot = !!lead.bot.website || (!isForm && lead.bot.elapsedMs > 0 && lead.bot.elapsedMs < MIN_FILL_MS);
  const id = `ld_${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const record = { id, receivedAt: new Date(now).toISOString(), ip, userAgent: clip(req.headers['user-agent'], 300), spam: isBot, ...lead };
  delete record.bot;

  try {
    // Bots get the same 201 so they learn nothing; they are stored flagged and never forwarded.
    if (isBot) { await mkdir(dirname(LEADS_FILE), { recursive: true }); await appendFile(LEADS_FILE, `${JSON.stringify(record)}\n`); log('warn', 'spam filtered', { id, ip }); }
    else { await store(record); log('info', 'lead stored', { id, form: record.form, product: record.product }); }
  } catch (e) {
    log('error', 'store failed', { error: e.message });
    return isForm ? redirectBack(req, res, false) : send(res, 500, { error: 'storage_failed' });
  }
  const body = { ok: true, id };
  if (idem) seen.set(idem, { status: 201, body, at: now });
  return isForm ? redirectBack(req, res, true) : send(res, 201, body);
}).listen(PORT, '127.0.0.1', () => log('info', `leads API on http://127.0.0.1:${PORT}`, { file: LEADS_FILE, webhook: !!WEBHOOK }));
