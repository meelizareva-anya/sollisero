"""End-to-end checks against tools/preview.mjs (prod headers) + server/leads-server.mjs."""
import os
import json, time, sys
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE','http://localhost:4173'); LEADS=os.environ.get('LEADS_FILE','/tmp/leads/leads.jsonl')
PAGES=['index','careers','atm','dspm','cash-solutions','retail-banking','digital-employees','meeting-notes','bim-agent','process-mining','thanks','nope/deep/link']
fails=[]
def check(cond,msg):
    print(('  ✓ ' if cond else '  ✗ ')+msg)
    if not cond: fails.append(msg)
def leads():
    try: return [json.loads(l) for l in open(LEADS)]
    except FileNotFoundError: return []
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get("CHROME") or None,args=["--no-sandbox"])
    print('CSP / console / broken assets on every page')
    for name in PAGES:
        ctx=b.new_context(viewport={'width':1440,'height':900}); pg=ctx.new_page(); errs=[]; bad=[]
        pg.on('console',lambda m,n=name:errs.append(m.text[:160]) if m.type in('error','warning') and 'ERR_FAILED' not in m.text and not (n.startswith('nope') and '404' in m.text) else None)
        pg.on('pageerror',lambda e:errs.append('JS '+str(e)[:160]))
        pg.on('response',lambda r:bad.append(f'{r.status} {r.url}') if r.status>=400 and 'fonts.g' not in r.url and not r.url.endswith(('/nope/deep/link',)) else None)
        pg.route('**/fonts.g*/**',lambda r:r.abort())
        pg.goto(f'{BASE}/{name}'); pg.wait_for_timeout(900)
        styled=pg.evaluate("getComputedStyle(document.querySelector('.nav')).display==='flex'")
        check(not errs and not bad and styled, f'{name}: errors={errs[:2]} bad={bad[:2]} styled={styled}')
        ctx.close()

    print('Form: client validation')
    pg=b.new_page(); pg.route('**/fonts.g*/**',lambda r:r.abort()); pg.goto(f'{BASE}/index.html#contact'); pg.wait_for_timeout(500)
    n0=len(leads()); f=pg.locator('form.form')
    f.locator('[type=submit]').click(); pg.wait_for_timeout(300)
    inval=pg.evaluate("[...document.querySelectorAll('form.form [aria-invalid=true]')].map(e=>e.name)")
    check(set(inval)=={'name','email','consent'}, f'empty submit flags name/email/consent → {inval}')
    check(pg.evaluate("document.activeElement.name")=='name','focus moves to first invalid field')
    f.locator('[name=email]').fill('not-an-email'); f.locator('[name=email]').blur(); pg.wait_for_timeout(100)
    check('valid' in f.locator('[name=email]').evaluate("e=>document.getElementById(e.getAttribute('aria-describedby')).textContent"),'email format message')
    check(len(leads())==n0,'nothing sent while invalid')

    print('Form: success path (index)')
    f.locator('[name=name]').fill('Anna Petrova'); f.locator('[name=email]').fill('anna@bank.com')
    f.locator('[name=company]').fill('Bank'); f.locator('[name=message]').fill('Need a team'); f.locator('[name=consent]').check()
    pg.wait_for_timeout(2600)
    with pg.expect_request('**/api/leads') as rq: f.locator('[type=submit]').click()
    pg.wait_for_selector('form.form.sent',timeout=5000)
    body=rq.value.post_data_json
    check(rq.value.headers.get('idempotency-key')==body['requestId'],'Idempotency-Key header = requestId')
    check('Anna' in f.locator('.done p').inner_text(),'personalised success message')
    L=leads()[-1]
    check(L['form']=='project' and L['product'] is None or L['product']=='' ,'form=project, no product on home')
    check(L['name']=='Anna Petrova' and L['email']=='anna@bank.com' and L['message']=='Need a team' and L['consent'] is True and L['spam'] is False,'lead stored with all fields, not spam')
    check(L['page']=='/index.html' and 'consentText' in L and L['consentText'],'page + consent text recorded')

    print('Form: idempotent retry')
    n1=len(leads())
    r=pg.request.post(f'{BASE}/api/leads',data=json.dumps(body),headers={'content-type':'application/json','idempotency-key':body['requestId']})
    check(r.status==201 and len(leads())==n1,'same requestId → 201, no duplicate')

    print('Form: product page + UTM attribution (dspm)')
    pg2=b.new_page(); pg2.route('**/fonts.g*/**',lambda r:r.abort()); pg2.goto(f'{BASE}/dspm.html?utm_source=linkedin&utm_campaign=q4'); pg2.wait_for_timeout(400)
    f2=pg2.locator('form.form'); f2.locator('[name=name]').fill('Ivan'); f2.locator('[name=email]').fill('ivan@corp.io'); f2.locator('[name=consent]').check(); pg2.wait_for_timeout(2600)
    f2.locator('[type=submit]').click(); pg2.wait_for_selector('form.form.sent',timeout=5000)
    L=leads()[-1]
    check(L['product']=='dspm' and L['form']=='demo','product=dspm form=demo')
    check(L['attribution'].get('utm',{}).get('utm_source')=='linkedin','utm captured')

    print('Form: bot signals')
    pg3=b.new_page(); pg3.route('**/fonts.g*/**',lambda r:r.abort()); pg3.goto(f'{BASE}/atm.html'); pg3.wait_for_timeout(300)
    f3=pg3.locator('form.form'); f3.locator('[name=name]').fill('Bot'); f3.locator('[name=email]').fill('bot@x.io'); f3.locator('[name=consent]').check()
    f3.locator('[name=website]').evaluate("e=>e.value='http://spam'")
    f3.locator('[type=submit]').click(); pg3.wait_for_selector('form.form.sent',timeout=5000)
    check(leads()[-1]['spam'] is True,'honeypot → stored as spam, bot still sees success')

    print('Form: failure states')
    for status,expect in [(500,'Something went wrong'),(429,'Too many requests'),('abort','connection')]:
        pg4=b.new_page(); pg4.route('**/fonts.g*/**',lambda r:r.abort()); pg4.goto(f'{BASE}/retail-banking.html'); pg4.wait_for_timeout(300)
        pg4.route('**/api/leads',(lambda r:r.abort()) if status=='abort' else (lambda r,req,s=status:r.fulfill(status=s,body='{}',content_type='application/json')))
        f4=pg4.locator('form.form'); f4.locator('[name=name]').fill('Olga'); f4.locator('[name=email]').fill('olga@bank.com'); f4.locator('[name=consent]').check()
        f4.locator('[type=submit]').click(); pg4.wait_for_timeout(800)
        st=pg4.locator('.form-status'); btn=f4.locator('[type=submit]')
        check(st.is_visible() and expect in st.inner_text() and not btn.is_disabled() and 'sent' not in f4.get_attribute('class'), f'{status}: message shown, button re-enabled, data kept ({f4.locator("[name=name]").input_value()})')
    pg5=b.new_page(); pg5.route('**/fonts.g*/**',lambda r:r.abort()); pg5.goto(f'{BASE}/cash-solutions.html'); pg5.wait_for_timeout(300)
    pg5.route('**/api/leads',lambda r:r.fulfill(status=422,content_type='application/json',body=json.dumps({'error':'validation_failed','errors':{'email':'This domain is not accepted'}})))
    f5=pg5.locator('form.form'); f5.locator('[name=name]').fill('X'); f5.locator('[name=email]').fill('x@mailinator.com'); f5.locator('[name=consent]').check(); f5.locator('[type=submit]').click(); pg5.wait_for_timeout(600)
    check(f5.locator('[name=email]').get_attribute('aria-invalid')=='true' and pg5.evaluate("document.activeElement.name")=='email','422 → server field error shown on the field')

    print('Form: no-JS fallback')
    ctx=b.new_context(java_script_enabled=False,reduced_motion='reduce'); pg6=ctx.new_page(); pg6.route('**/fonts.g*/**',lambda r:r.abort())
    pg6.goto(f'{BASE}/meeting-notes.html'); n2=len(leads())
    f6=pg6.locator('form.form'); f6.locator('[name=name]').fill('Lena'); f6.locator('[name=email]').fill('lena@co.ae'); f6.locator('[name=consent]').check()
    f6.locator('[type=submit]').click(); pg6.wait_for_load_state(); pg6.wait_for_timeout(500)
    check(pg6.url.endswith('/thanks.html') and len(leads())==n2+1 and leads()[-1]['product']=='meetly','urlencoded POST → stored → 303 /thanks.html')
    check(pg6.locator('.rv').count()==0 or pg6.evaluate("getComputedStyle(document.querySelector('.rv')||document.body).opacity")=='1','content visible without JS')
    pg7=ctx.new_page(); pg7.goto(f'{BASE}/dspm.html'); op=pg7.evaluate("getComputedStyle(document.querySelector('.rv')).opacity")
    check(op=='1','no-JS: .rv sections are visible (progressive enhancement)')
    b.close()
print('\nFAILED:' if fails else '\nALL PASSED', *fails, sep='\n  ')
sys.exit(1 if fails else 0)
