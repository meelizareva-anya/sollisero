# Forms API — contract for the backend

All lead forms on the site (home "Start a project" + the "Request a demo" form on each product page) send to **one endpoint** with **one schema**. A working reference implementation lives in `server/leads-server.mjs` (Node, no dependencies); you can run it as-is or reimplement the contract in your stack.

Endpoint is configured in `site.config.json → forms.endpoint` (default `/api/leads`, same origin — no CORS needed).

## 1. JSON request (JavaScript enabled — normal case)

```
POST /api/leads
Content-Type: application/json
Accept: application/json
Idempotency-Key: 3f1c…            (same value as body.requestId)
```

```jsonc
{
  "requestId": "3f1c9a2e-…",          // UUID; stable across retries of the same submission
  "form": "demo",                      // "demo" (product pages) | "project" (home page)
  "product": "dspm",                   // atm | dspm | cash | retail | work-it | meetly | bim | null (home)
  "page": "/dspm.html",
  "locale": "en",
  "name": "Anna Petrova",              // required, ≤120
  "email": "anna@bank.com",            // required, valid email, ≤200
  "company": "Bank",                   // optional, ≤200
  "message": "Need a demo for 300 ATMs", // optional, ≤4000 (label differs per page; field name is always "message")
  "consent": true,                     // required, must be true (personal-data processing consent)
  "consentText": "I agree to the processing of my personal data in accordance with the Privacy Policy.",
  "attribution": {                     // first landing of the session
    "utm": { "utm_source": "linkedin", "utm_campaign": "q4" },
    "referrer": "https://www.google.com/",
    "landingPage": "/dspm.html"
  },
  "meta": { "website": "", "elapsedMs": 18342 }, // anti-bot signals (see §4)
  "submittedAt": "2026-11-09T12:00:00.000Z"
}
```

### Responses the frontend understands

| Status | Body | What the user sees |
|---|---|---|
| `201` (any 2xx) | `{ "ok": true, "id": "ld_…" }` | Success panel: "Thanks, Anna. We'll write to anna@bank.com within one business day." |
| `422` (or `400`) | `{ "error": "validation_failed", "errors": { "email": "This domain is not accepted" } }` | Message under the named field, focus moves there. Field keys = form field names. |
| `429` | anything (`Retry-After` optional) | "Too many requests. Please wait a minute and try again." |
| `5xx` / other | anything | "Something went wrong on our side… or email sales@…" |
| network error / no answer within `forms.timeoutMs` (15 s) | — | "We couldn't send your request… or email sales@…" |

On any failure the form keeps the user's input and the button is re-enabled; a retry reuses the same `requestId`.

## 2. Idempotency

Treat `Idempotency-Key` / `requestId` as unique for ≥24 h. A repeated request must return the **original** response and must not create a second lead (users double-click, mobile networks retry).

## 3. No-JavaScript fallback (urlencoded)

Every form also has `action="/api/leads" method="post"`, so it works with JS disabled or if the bundle fails to load:

```
POST /api/leads
Content-Type: application/x-www-form-urlencoded

form=demo&product=dspm&website=&name=Anna+Petrova&email=anna%40bank.com&company=Bank&message=…&consent=yes
```

Respond with **`303 See Other`**:
- success → `Location: /thanks.html` (static page shipped in `dist/`; also a clean URL for analytics goals);
- failure → back to the referring page with `?error=1#contact` (if JS is available there, an error banner is shown).

## 4. Spam protection (layered)

1. **Honeypot** — hidden field `website` (`meta.website` in JSON). Humans never fill it.
2. **Fill time** — `meta.elapsedMs` < 2500 ms ⇒ bot.
3. **Rate limit** — per IP (reference: 10 / 10 min in the app + `limit_req` in nginx).

For bot submissions return the normal `201` (don't teach bots), store them flagged `spam: true` and do not forward them to the CRM.

## 5. Where leads go (reference server)

- Appended to `LEADS_FILE` (JSON Lines) — durable, greppable, never lost if the CRM is down.
- Forwarded to `LEAD_WEBHOOK_URL` if set (CRM / Slack / n8n / Zapier…), 8 s timeout, failure logged, lead already stored.

Stored record = request fields + `id`, `receivedAt`, `ip`, `userAgent`, `spam`.

## 6. Privacy notes

- `consent` and the exact `consentText` the user agreed to are stored with the lead — keep them for audit.
- The consent checkbox is never pre-ticked (was pre-ticked on bim-agent before the refactor — fixed).
- Set the real Privacy Policy URL in `site.config.json → legal`; the build injects it into every consent label.

## 7. Testing

`python3 tools/e2e.py` runs the whole matrix (validation, success, idempotency, UTM, honeypot, 422/429/500/network, no-JS) against `tools/preview.mjs` + the reference server.
