#!/usr/bin/env node
/**
 * Production preview: serves dist/ with the SAME security headers nginx will send (CSP included)
 * and proxies /api/* to the leads API. Use it to catch CSP / path / caching problems before deploying.
 *   node tools/preview.mjs [--port 4173] [--api http://127.0.0.1:8787]
 */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const PORT = +arg('--port', 4173);
const API = arg('--api', 'http://127.0.0.1:8787');
const headers = JSON.parse(await readFile(join(ROOT, 'deploy/headers.json'), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    const chunks = []; for await (const c of req) chunks.push(c);
    try {
      const up = await fetch(API + url.pathname + url.search, { method: req.method, headers: { ...req.headers, 'x-forwarded-for': req.socket.remoteAddress }, body: chunks.length ? Buffer.concat(chunks) : undefined, redirect: 'manual' });
      res.writeHead(up.status, Object.fromEntries(up.headers));
      return res.end(Buffer.from(await up.arrayBuffer()));
    } catch { res.writeHead(502, { 'content-type': 'application/json' }); return res.end('{"error":"bad_gateway"}'); }
  }
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith('/')) path += 'index.html';
  let file = resolve(DIST, `.${path}`);
  if (!file.startsWith(DIST)) return res.writeHead(403).end();
  if (!existsSync(file) && existsSync(`${file}.html`)) file += '.html';
  let status = 200;
  try { if (!(await stat(file)).isFile()) throw 0; } catch { file = join(DIST, '404.html'); status = 404; }
  const cache = path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.writeHead(status, { ...headers, 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': cache });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`[preview] http://localhost:${PORT}  (api → ${API})`));
