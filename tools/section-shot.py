"""Screenshot sections of a built page.
usage: section-shot.py PAGE OUTDIR [width] [sectionId ...]
  no ids  -> every <section> that has an id, plus a full-page shot
Writes OUTDIR/<page>-<id>.png and prints the list.
"""
import sys, os, subprocess, time, socket
from playwright.sync_api import sync_playwright

page, out = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
ids = sys.argv[4:]
os.makedirs(out, exist_ok=True)
s = socket.socket(); s.bind(('', 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '-d', 'dist'],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(.6)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        ctx = b.new_context(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
        pg = ctx.new_page()
        pg.route('**/fonts.g*/**', lambda r: r.abort())
        pg.goto(f'http://127.0.0.1:{port}/{page}.html', wait_until='load')
        pg.wait_for_timeout(1200)
        pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))")
        pg.add_style_tag(content="*,*::before,*::after{transition:none!important;animation:none!important}.wordmark,.h1 .w,.rv{opacity:1!important;transform:none!important}"
                                 ".nav-wrap{position:absolute!important}")
        pg.wait_for_timeout(500)
        if not ids:
            ids = pg.evaluate("[...document.querySelectorAll('main section[id], main > section')].map(s=>s.id).filter(Boolean)")
        for sid in ids:
            el = pg.query_selector(f'#{sid}')
            if not el:
                print(f'  !! #{sid} not found'); continue
            el.scroll_into_view_if_needed(); pg.wait_for_timeout(250)
            path = f'{out}/{page}-{sid}.png'
            el.screenshot(path=path)
            print(f'  {path}')
        b.close()
finally:
    srv.terminate()
