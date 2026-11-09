"""Measure element geometry in a built page, relative to a reference element.

usage: measure.py PAGE WIDTH REF_SELECTOR  sel1 [sel2 ...]
  prints TSV: selector  x  y  w  h  font-size/line-height

Coordinates are relative to REF_SELECTOR's border box, so they can be compared
directly with Figma frame-relative coordinates.
"""
import sys, os, subprocess, time, socket, json
from playwright.sync_api import sync_playwright

page, width, ref = sys.argv[1], int(sys.argv[2]), sys.argv[3]
sels = sys.argv[4:]
s = socket.socket(); s.bind(('', 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '-d', 'dist'],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(.6)
JS = """([ref, sels]) => {
  const r0 = document.querySelector(ref);
  const b0 = r0 ? r0.getBoundingClientRect() : {left:0, top:0};
  const out = [];
  for (const sel of sels) {
    const els = [...document.querySelectorAll(sel)];
    if (!els.length) { out.push({sel, missing: true}); continue; }
    els.forEach((e, i) => {
      const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
      out.push({ sel: els.length > 1 ? sel + '[' + i + ']' : sel,
        x: +(b.left - b0.left).toFixed(1), y: +(b.top - b0.top).toFixed(1),
        w: +b.width.toFixed(1), h: +b.height.toFixed(1),
        fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight,
        color: cs.color, bg: cs.backgroundColor });
    });
  }
  return out;
}"""
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        ctx = b.new_context(viewport={'width': width, 'height': 1200}, reduced_motion='reduce')
        pg = ctx.new_page()
        pg.route('**/fonts.g*/**', lambda r: r.abort())
        pg.goto(f'http://127.0.0.1:{port}/{page}.html', wait_until='load')
        pg.wait_for_timeout(1200)
        pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))")
        pg.add_style_tag(content="*,*::before,*::after{transition:none!important;animation:none!important}.wordmark,.h1 .w,.rv{opacity:1!important;transform:none!important}")
        pg.wait_for_timeout(400)
        rows = pg.evaluate(JS, [ref, sels])
        for r in rows:
            if r.get('missing'):
                print(f"{r['sel']}\tMISSING"); continue
            print(f"{r['sel']}\t{r['x']}\t{r['y']}\t{r['w']}\t{r['h']}\t{r['fs']}/{r['lh']}\t{r['fw']}")
        b.close()
finally:
    srv.terminate()
