"""Visual regression (Playwright; set CHROME=/path/to/chrome to use a system browser): snap <root> pages into <outdir>, or diff two dirs.
usage: vr.py snap ROOT OUTDIR [pages...] | vr.py diff A B
Pages are served over http (python http.server) so the same harness works for file-based and built sites."""
import sys, os, glob, subprocess, time, socket, json
from PIL import Image, ImageChops
WIDTHS=[(1440,900,'d'),(390,844,'m')]
INIT="""
(()=>{let s=42;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
const T=new Date('2026-11-09T12:00:00Z').getTime();const D=Date;
class FD extends D{constructor(...a){super(...(a.length?a:[T]))}static now(){return T}}window.Date=FD;
const _pn=performance.now.bind(performance);performance.now=()=>0;
window.setInterval=()=>0;})();
"""
def free_port():
    s=socket.socket(); s.bind(('',0)); p=s.getsockname()[1]; s.close(); return p
def snap(root,out,pages):
    from playwright.sync_api import sync_playwright
    os.makedirs(out,exist_ok=True)
    port=free_port(); srv=subprocess.Popen([sys.executable,'-m','http.server',str(port),'-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(.6)
    pages=pages or sorted(os.path.basename(p)[:-5] for p in glob.glob(root+'/*.html'))
    errs={}
    try:
      with sync_playwright() as p:
        b=p.chromium.launch(executable_path=os.environ.get("CHROME") or None,args=["--no-sandbox","--font-render-hinting=none","--disable-lcd-text"])
        for name in pages:
            for w,h,t in WIDTHS:
                ctx=b.new_context(viewport={'width':w,'height':h},reduced_motion='reduce',device_scale_factor=1)
                ctx.add_init_script(INIT); pg=ctx.new_page(); e=[]
                pg.on('pageerror',lambda x,e=e:e.append(str(x)[:140]))
                pg.on('console',lambda m,e=e:e.append(m.text[:140]) if m.type=='error' and 'fonts.g' not in m.text and 'net::ERR' not in m.text else None)
                pg.route('**/fonts.googleapis.com/**',lambda r:r.abort()); pg.route('**/fonts.gstatic.com/**',lambda r:r.abort())
                pg.goto(f'http://127.0.0.1:{port}/{name}.html',wait_until='load'); pg.wait_for_timeout(700)
                pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));window.scrollTo(0,0)")
                pg.add_style_tag(content="*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}")
                pg.wait_for_timeout(300)
                pg.screenshot(path=f'{out}/{name}-{t}.png',full_page=True)
                if e: errs[f'{name}-{t}']=e
                ctx.close()
        b.close()
    finally: srv.terminate()
    print(json.dumps(errs,indent=1) if errs else 'no console errors')
def diff(a,b):
    worst=0
    for fa in sorted(glob.glob(a+'/*.png')):
        n=os.path.basename(fa); fb=os.path.join(b,n)
        if not os.path.exists(fb): print(f'{n:28} MISSING'); continue
        A=Image.open(fa).convert('RGB'); B=Image.open(fb).convert('RGB')
        if A.size!=B.size:
            print(f'{n:28} SIZE {A.size} -> {B.size}')
            w=min(A.size[0],B.size[0]); h=min(A.size[1],B.size[1])
            A=A.crop((0,0,w,h)); B=B.crop((0,0,w,h))
        d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0)
        px=sum(d.histogram()[255:]); pct=100*px/(A.size[0]*A.size[1]); worst=max(worst,pct)
        bbox=d.getbbox()
        flag='OK ' if pct<0.05 else 'DIFF'
        print(f'{n:28} {flag} {pct:6.3f}%  bbox={bbox}')
        if pct>=0.05:
            os.makedirs(b+'/_diff',exist_ok=True)
            Image.composite(Image.new('RGB',B.size,(255,0,80)),B,d).save(f'{b}/_diff/{n}')
    print('WORST %.3f%%'%worst)
if __name__=='__main__':
    if sys.argv[1]=='snap': snap(sys.argv[2],sys.argv[3],sys.argv[4:])
    else: diff(sys.argv[2],sys.argv[3])
