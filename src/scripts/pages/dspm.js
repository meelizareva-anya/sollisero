/* dspm landing — page behaviour.
   Four isolated IIFEs, in order: motion engine (smooth scroll, scroll-linked scenes,
   word reveals), section content, canvas scenes, and the runtime that mounts a real
   product screen inside each demo window. Site chrome (nav, menu, forms) stays with
   the shared components — this file never touches it. */


/* ==========================================================================
   SOLLISERO · dspm — motion engine
   Vanilla, no dependencies. Smooth scroll + scroll-linked scenes + reveals.
   ========================================================================== */
(function(){
'use strict';

const RM   = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer:fine)').matches && innerWidth > 1024;
const $  = (s,c)=> (c||document).querySelector(s);
const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp =(a,b,t)=>a+(b-a)*t;

/* ---------------------------------------------------------------- 1. SMOOTH SCROLL */
let target = scrollY, cur = scrollY, lastSet = scrollY;
const smoothOn = FINE && !RM;
const docH = ()=> document.documentElement.scrollHeight - innerHeight;

if (smoothOn){
  document.documentElement.style.scrollBehavior = 'auto';
  addEventListener('wheel', e=>{
    if (e.ctrlKey || e.deltaMode === 2) return;
    if (e.target.closest && e.target.closest('[data-native-scroll]')) return;
    e.preventDefault();
    const d = e.deltaMode === 1 ? e.deltaY * 34 : e.deltaY;
    target = clamp(target + d, 0, docH());
  }, {passive:false});
}
addEventListener('scroll', ()=>{
  if (!smoothOn){ target = cur = scrollY; return; }
  if (Math.abs(scrollY - lastSet) > 3) target = cur = scrollY;   // keyboard / scrollbar / find
}, {passive:true});
addEventListener('resize', ()=>{ target = clamp(target,0,docH()); sizeCanvases(); });

function goTo(y){
  y = clamp(y, 0, docH());
  if (smoothOn) target = y;
  else scrollTo({top:y, behavior: RM ? 'auto' : 'smooth'});
}
$$('a[href^="#"], [data-go]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('data-go') || a.getAttribute('href');
    const t = id && id.length>1 && $(id);
    if (!t) return;
    e.preventDefault();
    goTo(t.getBoundingClientRect().top + scrollY - 90);
  });
});

/* ---------------------------------------------------------------- 2. SPLIT TEXT */
function splitEl(el){
  let i = 0;
  (function walk(node){
    Array.from(node.childNodes).forEach(n=>{
      if (n.nodeType === 3){
        if (!n.textContent.trim()){ return; }
        const frag = document.createDocumentFragment();
        const grad = n.parentElement.closest('.grad');
        n.textContent.split(/(\s+)/).forEach(p=>{
          if (!p) return;
          if (/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(' ')); return; }
          const w  = document.createElement('span'); w.className = 'sp-w';
          const it = document.createElement('span'); it.className = 'sp-i' + (grad ? ' grad' : '');
          it.textContent = p;
          it.style.setProperty('--d', (i++ * 40) + 'ms');
          w.appendChild(it); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('sp-w')) walk(n);
    });
  })(el);
}
$$('[data-split]').forEach(splitEl);

/* ---------------------------------------------------------------- 3. REVEAL */
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.classList.contains('sp')){
      const n = e.target.querySelectorAll('.sp-i').length;
      setTimeout(()=> e.target.classList.add('done'), n*40 + 1200);
    }
    if (e.target.hasAttribute('data-count')) countUp(e.target);
    $$('[data-count]', e.target).forEach(countUp);
    $$('[data-fill]', e.target).forEach(el=>{
      const w = parseFloat(el.dataset.fill);
      if (isFinite(w)) requestAnimationFrame(()=> el.style.width = w + '%');
    });
    io.unobserve(e.target);
  });
}, {threshold:.12, rootMargin:'0px 0px -8% 0px'});

function observeAll(){
  $$('[data-rv]:not(.obs), .sp:not(.obs), [data-grid]:not(.obs), [data-rv-rule]:not(.obs), .uc:not(.obs)')
    .forEach(el=>{ el.classList.add('obs'); io.observe(el); });
}
new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
},{threshold:.2}).observe(document.body);
observeAll();
window.__observeAll = observeAll;

/* counters */
function countUp(el){
  if (el.dataset.done) return; el.dataset.done = '1';
  const to = +el.dataset.count, dur = 1500, t0 = performance.now();
  const fmt = n => n.toLocaleString('en-US');
  (function step(t){
    const p = clamp((t - t0)/dur, 0, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(to * e));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------------------------------------------------------------- 4. SCROLL-LINKED */
const scenes = [];
function scene(el, fn, opts){ scenes.push({el, fn, o: opts||{}}); }

function progress(el, pad){
  const r = el.getBoundingClientRect();
  const h = innerHeight;
  return clamp((h - r.top - (pad||0)) / (h + r.height - (pad||0)), 0, 1);
}

/* parallax */
$$('[data-par]').forEach(el=>{
  const amt = parseFloat(el.dataset.par);
  scene(el, p => { el.style.transform = 'translate3d(0,' + ((p - .5) * amt * 100).toFixed(2) + 'px,0)'; });
});

/* hero window tilt — lifts from an angled plane as it enters */
const heroWin = $('#heroWin');
if (heroWin && !RM){
  scene(heroWin, p=>{
    const t = clamp(p * 1.9, 0, 1);
    const e = 1 - Math.pow(1 - t, 3);
    heroWin.style.transform =
      'rotateX(' + (13 * (1 - e)).toFixed(2) + 'deg) translateY(' + (34*(1-e)).toFixed(1) + 'px) scale(' + (0.94 + .06*e).toFixed(3) + ')';
  });
}

/* scroll-linked word fill (reference pattern) */
$$('.fillt').forEach(el=>{
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w=>'<span class="fw">'+w+'</span>').join(' ');
  const fw = $$('.fw', el);
  scene(el, p=>{
    const n = Math.round(clamp((p - .18) / .44, 0, 1) * fw.length);
    fw.forEach((s,i)=> s.classList.toggle('on', i < n));
  });
});

/* footer wordmark */
const wm = $('.wordmark');
if (wm) scene(wm, p=>{ wm.style.transform = 'translateY(' + (22 - p*26).toFixed(1) + '%)'; });

/* ---------------------------------------------------------------- 5. NAV + POINTER */
const heroPointer = $('#heroPointer');
const hero = $('.hero');
if (hero && heroPointer && FINE){
  hero.addEventListener('pointermove', e=>{
    const r = hero.getBoundingClientRect();
    heroPointer.style.left = (e.clientX - r.left) + 'px';
    heroPointer.style.top  = (e.clientY - r.top)  + 'px';
  });
}

/* magnetic buttons */
if (FINE && !RM) $$('.magnet').forEach(b=>{
  b.addEventListener('pointermove', e=>{
    const r = b.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) / r.width;
    const y = (e.clientY - r.top - r.height/2) / r.height;
    b.style.transform = 'translate(' + (x*14).toFixed(1) + 'px,' + (y*9).toFixed(1) + 'px)';
  });
  b.addEventListener('pointerleave', ()=>{ b.style.transform = ''; b.style.transition='transform .6s cubic-bezier(.22,.61,.36,1)';
    setTimeout(()=> b.style.transition = '', 600); });
});

/* section heads: >1 line of subcopy -> top aligned, otherwise centred */
function alignHeads(){
  $$('.sec-head').forEach(h=>{
    const col = h.children[h.children.length-1];
    if (h.children.length < 2){ h.classList.remove('ah-top'); return; }
    const sub = col.matches('p') ? col : col.querySelector('p');
    if (!sub){ h.classList.remove('ah-top'); return; }
    const cs = getComputedStyle(sub);
    let lh = parseFloat(cs.lineHeight);
    if (!isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.4;
    const lines = Math.round(sub.getBoundingClientRect().height / lh);
    h.classList.toggle('ah-top', lines > 1);
  });
}
alignHeads();
addEventListener('resize', alignHeads);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignHeads);

/* product slots: captions in the same visual row get a common height,
   so the screens below them start on one line at every breakpoint */
function alignProdCaps(){
  const slots = $$('.prodgrid .pslot');
  if (!slots.length) return;
  const caps = slots.map(s => s.querySelector('.cap-txt'));
  caps.forEach(c => { if (c) c.style.minHeight = ''; });

  const rows = [];
  slots.forEach((slot, i) => {
    if (!caps[i]) return;
    const top = slot.getBoundingClientRect().top;
    const row = rows.find(r => Math.abs(r.top - top) < 6);
    if (row) row.caps.push(caps[i]);
    else rows.push({top, caps:[caps[i]]});
  });

  rows.forEach(r => {
    if (r.caps.length < 2) return;                       // alone in its row: nothing to match
    const h = Math.max(...r.caps.map(c => c.getBoundingClientRect().height));
    r.caps.forEach(c => c.style.minHeight = h.toFixed(1) + 'px');
  });
}
alignProdCaps();
addEventListener('resize', alignProdCaps);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignProdCaps);

/* card spotlight */
$$('.pcard').forEach(c=>{
  c.addEventListener('pointermove', e=>{
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top)  + 'px');
  });
});

/* ---------------------------------------------------------------- 6. MAIN LOOP */
const canvasJobs = [];
function sizeCanvases(){ canvasJobs.forEach(j=> j.resize && j.resize()); }

function frame(){
  if (smoothOn){
    if (Math.abs(target - cur) > .08){
      cur = lerp(cur, target, .105);
      lastSet = cur;
      scrollTo(0, cur);
    } else { cur = target; }
  } else cur = scrollY;

  for (let i=0;i<scenes.length;i++){
    const s = scenes[i];
    const r = s.el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) continue;
    s.fn(progress(s.el));
  }
  for (let i=0;i<canvasJobs.length;i++) canvasJobs[i].tick && canvasJobs[i].tick();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.__app = { scene, observeAll, canvasJobs, clamp, lerp, $, $$, RM, FINE, progress, countUp };
})();


/* ==========================================================================
   CONTENT + COMPONENT RENDERERS
   ========================================================================== */
(function(){
'use strict';
const {$, $$, observeAll, clamp} = window.__app;
const el = (t,c,h)=>{const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n;};

/* ---------------------------------------------------------------- CAPABILITIES */
const CAPS = [
 {n:'01', t:'Sensitive Data Detection', ic:'<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 21 21"/>', items:[
   ['Traffic and storage analysis','Locate sensitive data in inter-service requests, databases, and connected storage systems.'],
   ['Automated classification','Determine sensitive data types based on its content and structure.'],
   ['Infrastructure mapping','Identify which services and storage systems contain the discovered data.']]},
 {n:'02', t:'Inter-Service Transfer Analysis', ic:'<path d="M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3-3m-3 3 3 3"/>', items:[
   ['Actual data flows','Identify which sensitive data is being transmitted between services.'],
   ['Interaction context','Link discovered data with sources, recipients, and endpoints.'],
   ['Real-time visibility','Account for changes in inter-service interactions without manual diagram updates.']]},
 {n:'03', t:'Security Policy Enforcement', ic:'<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3Z"/><path d="M8.6 12l2.3 2.3 4.5-4.8"/>', items:[
   ['Authorized transfer verification','Compare actual sensitive data flows against predefined rules.'],
   ['Anomaly detection','Identify unauthorized data transfers between services.'],
   ['Incident logging','Log events with the necessary context for further analysis.']]},
 {n:'04', t:'Incident Investigation', ic:'<path d="M4 19V5m0 0 5 4-5 4"/><path d="M11 7h9M11 12h9M11 17h6"/>', items:[
   ['Event details','Identify the types of transferred data, source, and recipient.'],
   ['Route reconstruction','Identify services, endpoints, and exact data transfer routes.'],
   ['External system integration','Send incident data through integrations to your existing security workflows.']]}
];
const capGrid = $('#capGrid');
CAPS.forEach((c,i)=>{
  const a = el('article','cap');
  a.setAttribute('data-rv','up'); a.style.setProperty('--d', (i%2)*120 + 'ms');
  a.innerHTML =
   '<div class="cap-h"><div class="icotile"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="1.4">'+c.ic+'</svg></div>'+
   '<h3>'+c.t+'</h3><span class="num">'+c.n+'</span></div>'+
   c.items.map(it=>'<div class="cap-i"><span class="ck"><svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2"><path d="M2 6l3 3 5-6"/></svg></span><div><b>'+it[0]+'</b><p>'+it[1]+'</p></div></div>').join('');
  capGrid.appendChild(a);
});
/* light up the checks one by one when the card enters */
const capIO = new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting) return;
  $$('.cap-i', e.target).forEach((r,i)=> setTimeout(()=> r.classList.add('lit'), 240 + i*170));
  capIO.unobserve(e.target);
}),{threshold:.25});
$$('.cap').forEach(c=>capIO.observe(c));

/* ---------------------------------------------------------------- ADVANTAGES */
const ADV = [
 {k:'[ Deployment ]', h:'Running in days, not quarters', items:[
   ['01','Data visibility within Kubernetes','Deploy into the cluster and get a live map of where sensitive data lives and moves — no code changes, no manual inventories.'],
   ['02','Monitoring without external infrastructure','Management, classification and storage run inside your own infrastructure, in an isolated environment.'],
   ['03','Real-time visibility without manual updates','New services and routes are accounted for as they emerge, so the picture stays current without diagram upkeep.']]},
 {k:'[ Depth ]', h:'Sees what the diagram cannot', items:[
   ['04','Request content inspection','Analyses the data types being transmitted, not just which services talk — flagging sensitive payloads even inside authorized connections.'],
   ['05','Recognition by content and structure','Templates, regular expressions and structure analysis. Detected values are masked before any further processing.']]},
 {k:'[ Response ]', h:'From detection to a closed incident', items:[
   ['06','Leaks stopped at the route','Actual flows are compared against security rules; transfers on routes policy does not permit are logged as violations.'],
   ['07','Investigations in minutes','Data type, source, recipient, services, endpoints and the exact route are stored together — context without manual correlation.'],
   ['08','Incidents inside existing processes','Violations flow into Jira, Slack, email and webhooks, with Keycloak SSO for single sign-on.']]}
];
const advList = $('#advList');
ADV.forEach(t=>{
  const sec = el('div','adv-theme');
  sec.innerHTML = '<div class="th" data-rv="fade">'+t.k+'</div><h3 data-rv="up">'+t.h+'</h3>';
  t.items.forEach(it=>{
    const d = el('div','adv-item');
    d.dataset.n = it[0]; d.dataset.t = it[1];
    d.innerHTML = '<div class="ti"><span class="n">'+it[0]+'</span><b>'+it[1]+'</b></div><p>'+it[2]+'</p>';
    sec.appendChild(d);
  });
  advList.appendChild(sec);
});
const advItems = $$('.adv-item');
const advN = $('#advN'), advT = $('#advT');
let advActive = -1;
function setAdv(i){
  if (i === advActive || i < 0) return;
  advActive = i;
  advItems.forEach((x,j)=> x.classList.toggle('on', j === i));
  advN.textContent = advItems[i].dataset.n;
  advT.textContent = advItems[i].dataset.t;
  window.__conv && window.__conv.focus(i, advItems.length);
}
advItems.forEach((it,i)=> it.addEventListener('click', ()=> setAdv(i)));
window.__app.scene(advList, ()=>{
  let best = -1, bestD = 1e9;
  const mid = innerHeight * .45;
  advItems.forEach((it,i)=>{
    const r = it.getBoundingClientRect();
    const d = Math.abs(r.top + r.height/2 - mid);
    if (d < bestD){ bestD = d; best = i; }
  });
  setAdv(best);
});

/* ---------------------------------------------------------------- USE CASES */
const UC = [
 {k:'01 // Changes', h:'A new service ships on Friday',
  ex:'A team ships notification-svc late on Friday. It starts talking to two stores nobody added to the diagram, and no ticket is filed.',
  p:'By Monday it is on the map with its data types and routes classified — instead of surfacing at the next quarterly audit.',
  rows:[['notification-svc','new · 4 routes','info'],['checkout-api','updated','ok'],['user-profile','scanning…','warn']]},
 {k:'02 // Inventory', h:'Nobody knows which store holds card data',
  ex:'Compliance asks where card numbers live. The answer is spread across three teams, two wikis and a spreadsheet from last year.',
  p:'Sensitive data is located across databases and object storage and tied to the services that read it — without a manual inventory round.',
  rows:[['PostgreSQL · orders','card · PCI','bad'],['Kafka · events','email · PII','warn'],['S3 · exports','passport','warn']]},
 {k:'03 // Security', h:'An integration starts sending PII to analytics',
  ex:'One release adds a field to an export job. Customer PII quietly starts flowing into a system that was never meant to hold it.',
  p:'The transfer is flagged at the route, with the endpoint and the policy it breaks — not found weeks later in a log review.',
  rows:[['crm-svc → analytics','policy EU-02','bad'],['POST /v1/ingest','blocked route','bad'],['owner: data-platform','assigned','info']]},
 {k:'04 // Audit', h:'The regulator asks where EU customer data went',
  ex:'A regulator wants every transfer of EU customer data for the last quarter, broken down by service, with evidence.',
  p:'A record of actual transfers by service and period is exported from the product — instead of correlating logs across teams.',
  rows:[['Q3 · EU customers','4,132 fields','info'],['12 services','3 stores','ok'],['export · CSV / PDF','ready','ok']]}
];
const ucGrid = $('#ucGrid');
const SOLVER = 'dspm';
UC.forEach((c,i)=>{
  const a = el('article','uc'); a.setAttribute('data-rv','up'); a.style.setProperty('--d', i*110+'ms');
  a.innerHTML =
   '<div class="k">'+c.k+'</div><h3>'+c.h+'</h3>'+
   '<div class="uc-part"><span class="uc-lab"><i></i>Example</span><p>'+c.ex+'</p></div>'+
   '<div class="uc-part solve"><span class="uc-lab"><i></i>How '+SOLVER+' solves it</span><p>'+c.p+'</p></div>';
  ucGrid.appendChild(a);
});

/* ---------------------------------------------------------------- FAQ */
const FAQ = [
 ['Which sensitive data types does dspm detect?','The platform detects sensitive data in inter-service traffic and connected storage systems, including email addresses, phone numbers, and payment card numbers. Data classification is performed using templates, regular expressions, and data structure analysis.'],
 ['Does deployment require any application modifications?','No. Sollisero DSPM is deployed into the Kubernetes cluster and observes traffic at the kernel level with eBPF. Monitored applications need no code changes, sidecars or SDKs, and all components run inside your own infrastructure.'],
 ['What happens when a security policy is violated?','The transfer is checked against your rules in real time. The violation is logged with data type, source, recipient, services, endpoints and the exact route, and is sent to your existing tools — Jira, Slack, email, webhooks or SIEM.'],
 ['Does dspm replace DLP solutions?','It complements them. DLP protects data at the perimeter and on endpoints, while Sollisero DSPM covers what happens inside the cluster: inter-service transfers and connected storage that traditional DLP does not see.']
];
const faqs = $('#faqs');
FAQ.forEach((f,i)=>{
  const d = el('div','fq' + (i===0 ? ' open' : ''));
  d.innerHTML = '<button class="fq-q"><span class="n">0'+(i+1)+'</span>'+f[0]+'<span class="pm"></span></button>'+
                '<div class="fq-a"><p>'+f[1]+'</p></div>';
  faqs.appendChild(d);
});
$$('.fq-q').forEach(q=>{
  q.addEventListener('click', ()=>{
    const fq = q.parentElement, open = fq.classList.contains('open');
    $$('.fq').forEach(f=>{ f.classList.remove('open'); $('.fq-a',f).style.maxHeight = '0px'; });
    if (!open){ fq.classList.add('open'); const a = $('.fq-a',fq); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});
setTimeout(()=>{ const a = $('.fq.open .fq-a'); if(a) a.style.maxHeight = a.scrollHeight + 'px'; }, 120);

/* ---------------------------------------------------------------- CLIENTS MARQUEE */
const LOGOS = ['kardex','metro','alcon','audiomack','mary kay','9gag'];
const marq = $('#marq');
marq.innerHTML = LOGOS.concat(LOGOS,LOGOS).map(l=>'<div class="logo">'+l+'</div>').join('');

observeAll();
})();


/* ==========================================================================
   LIGHT-SECTION DEMOS + CANVAS SCENES + FORM
   ========================================================================== */
(function(){
'use strict';
const {$, $$, clamp, canvasJobs, RM} = window.__app;

/* ---------------------------------------------------------------- CANVAS HELPERS */
function setup(cv){
  const ctx = cv.getContext('2d');
  function resize(){
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return r;
  }
  return {ctx, resize};
}
const visible = cv => { const r = cv.getBoundingClientRect(); return r.bottom > -100 && r.top < innerHeight + 100; };

/* ---- A. flow convergence (advantages) ---- */
(function conv(){
  const cv = $('#convCanvas'); if(!cv) return;
  const {ctx, resize} = setup(cv);
  let W=0,H=0,t=0,focusI=0,focusN=8,strands=[];
  function build(){
    const r = resize(); W = r.width; H = r.height;
    strands = Array.from({length:26},(_,i)=>({
      y: (i+.5)/26, off: Math.random()*6.28, sp: .3+Math.random()*.5, w: .6+Math.random()*1.1
    }));
  }
  build();
  canvasJobs.push({ resize: build, tick(){
    if (!visible(cv)) return;
    t += RM ? 0 : .006;
    ctx.clearRect(0,0,W,H);
    const tx = W*.80, ty = H*.5;
    strands.forEach((s,i)=>{
      const y0 = s.y*H;
      const hot = Math.abs(i/26 - (focusI+.5)/focusN) < .09;
      ctx.beginPath();
      ctx.moveTo(-10, y0);
      ctx.bezierCurveTo(W*.35, y0 + Math.sin(t*s.sp + s.off)*26, W*.55, ty + (y0-ty)*.25, tx, ty);
      ctx.strokeStyle = hot ? 'rgba(127,156,255,.85)' : 'rgba(125,150,255,.17)';
      ctx.lineWidth = hot ? 1.8 : s.w;
      ctx.stroke();
      const pp = ((t*s.sp*.45 + s.off/6.28) % 1);
      const px = -10 + (tx+10)*pp;
      const k = pp;
      const py = (1-k)*(1-k)*y0 + 2*(1-k)*k*(ty + (y0-ty)*.4) + k*k*ty;
      ctx.beginPath(); ctx.arc(px, py, hot ? 2.6 : 1.6, 0, 6.3);
      ctx.fillStyle = hot ? '#a9bcff' : 'rgba(127,156,255,.42)'; ctx.fill();
    });
    const pr = 16 + Math.sin(t*2)*2.6;
    const g = ctx.createRadialGradient(tx,ty,0,tx,ty,pr*3.4);
    g.addColorStop(0,'rgba(61,107,255,.55)'); g.addColorStop(1,'rgba(61,107,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tx,ty,pr*3.4,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(tx,ty,pr,0,6.3);
    ctx.fillStyle='#0a1030'; ctx.fill();
    ctx.strokeStyle='#7f9cff'; ctx.lineWidth=1.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(tx,ty,pr*.42,0,6.3); ctx.fillStyle='#7f9cff'; ctx.fill();
  }});
  window.__conv = { focus(i,n){ focusI=i; focusN=n; } };
})();

/* ---- B. binary data stream (use cases) — digit field as drawn in the design ---- */
(function stream(){
  const cv = $('#streamCanvas'); if(!cv) return;
  const {ctx, resize} = setup(cv);
  const MARKS = [
    {f:.155, label:'New route',             cls:'',    hi:'#3d6bff'},
    {f:.385, label:'Email \u00b7 PII',          cls:'',    hi:'#3d6bff'},
    {f:.615, label:'Card \u00b7 PCI \u00b7 violation', cls:'red', hi:'#ff5a6e'},
    {f:.854, label:'Phone \u00b7 PII',          cls:'',    hi:'#3d6bff'}
  ];
  const CW = 13, CH = 17;
  let W=0,H=0,cols=0,rows=0,grid=[],off=0;
  const marksEl = $('#streamMarks');
  function build(){
    const r = resize(); W=r.width; H=r.height;
    cols = Math.ceil(W/CW)+3; rows = Math.max(1, Math.floor((H-6)/CH));
    grid = Array.from({length:rows},()=>Array.from({length:cols},()=>Math.random()<.5?'0':'1'));
    if (marksEl) marksEl.innerHTML = MARKS.map(m=>'<div class="stream-mark" style="left:'+(m.f*100).toFixed(2)+'%">'+
      '<div class="ln"></div><span class="pl '+m.cls+'">'+m.label+'</span></div>').join('');
  }
  build();
  canvasJobs.push({ resize: build, tick(){
    if (!visible(cv)) return;
    off += RM ? 0 : .32;
    if (off >= CW){ off -= CW; grid.forEach(r=>r.push(r.shift())); }
    ctx.clearRect(0,0,W,H);
    ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const markCols = MARKS.map(m=> Math.round(m.f*W/CW));
    for (let y=0; y<rows; y++){
      for (let x=0; x<cols; x++){
        const px = x*CW - off + CW/2, py = y*CH + CH/2 + 3;
        if (px < -CW || px > W + CW) continue;
        const mi = markCols.indexOf(x);
        if (mi >= 0){
          const last = y === rows-1;
          ctx.fillStyle = last ? MARKS[mi].hi : '#060b22';
          const bw = CW-1, bh = CH-3, bx = px-bw/2, by = py-bh/2;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx,by,bw,bh,3); else ctx.rect(bx,by,bw,bh);
          ctx.fill();
          ctx.fillStyle = '#fff';
        } else {
          ctx.fillStyle = 'rgba(10,16,38,.2)';
        }
        ctx.fillText(grid[y][x], px, py);
      }
    }
  }});
})();

/* ---- C. dot field (CTA) ---- */
(function dots(){
  const cv = $('#dotField'); if(!cv) return;
  const {ctx, resize} = setup(cv);
  let W=0,H=0,t=0,mx=-999,my=-999;
  function build(){ const r = resize(); W=r.width; H=r.height; }
  build();
  addEventListener('pointermove', e=>{
    const r = cv.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  }, {passive:true});
  canvasJobs.push({ resize: build, tick(){
    if (!visible(cv)) return;
    t += RM ? 0 : .012;
    ctx.clearRect(0,0,W,H);
    const g = 38;
    for (let x=0; x<W+g; x+=g){
      for (let y=0; y<H+g; y+=g){
        const cx = x + Math.cos(t*.4 + y*.01)*5;
        const cy = y + Math.sin(t*.35 + x*.012)*5;
        const d  = Math.hypot(cx-mx, cy-my);
        const wave = Math.sin((x*.012) + (y*.012) - t*1.4);
        let r = 1 + wave*1.9;
        if (d < 190) r += (1 - d/190) * 4.2;
        r = Math.max(.4, r);
        const alpha = clamp(.10 + r*.075, 0, .62);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.3);
        ctx.fillStyle = 'rgba(127,156,255,'+alpha.toFixed(3)+')';
        ctx.fill();
      }
    }
  }});
})();

})();


/* ==========================================================================
   DSPM EMBED — mounts a real product screen inside a landing demo window.
   Each embed lives in its own shadow root, so the app styles stay isolated.
   ========================================================================== */
(function(){
'use strict';
function mount(host){
  const id0=host.dataset.screen, theme=host.dataset.theme||'light';
  const compact=host.hasAttribute('data-compact');
  const H=+host.dataset.h||620;
  const root=host.attachShadow({mode:'open'});
  const D=window.__dspm, SCREENS=window.SCREENS, SECTIONS=window.SECTIONS;
  host.setAttribute('data-theme',theme); if(compact) host.setAttribute('data-compact','');
  host.style.height=H+'px';
  root.innerHTML='<style>'+window.DSPM_CSS+'</style><div class="stage"><div class="app">'+
    '<nav class="rail"></nav><aside class="side">'+
      '<div class="wordmark">sollisero<i>/</i><b>dspm</b></div>'+
      '<div class="org"><div class="ini">N</div><div class="nm"><b>Northstar Inc.</b>'+
        '<small>Production · EU-West</small></div></div>'+
      '<div class="sec-k"></div><h2></h2><div class="sub"></div><div class="nav"></div><div class="extra"></div>'+
      '<div class="posture"><div class="t">Posture score</div><div class="v">72<small>/100</small></div>'+
      '<div class="seg"></div><div class="d">+4 since last week</div></div></aside>'+
    '<main class="main"><header class="top">'+
      '<div class="crumbs"><span class="c1"></span>'+D.ico('chev',15)+'<b class="c2"></b></div>'+
      '<label class="search">'+D.ico('search',15)+'<input placeholder="Search assets, events, policies…" readonly>'+
        '<span class="kbd">⌘K</span></label>'+
      '<button class="ticon">'+D.ico('help',18)+'</button>'+
      '<button class="ticon">'+D.ico('bell',18)+'<i class="ndot"></i></button>'+
      '<button class="copilot">'+D.ico('spark',16)+'Copilot</button>'+
    '</header><div class="view"></div></main></div></div>';
  const q=s=>root.querySelector(s), qa=s=>Array.from(root.querySelectorAll(s));
  let cur=id0, pinned=null, scale=1;

  function fit(){
    const w = host.clientWidth;
    scale = Math.min(w/1440, 1);                 // never upscale past 1:1
    const dx = Math.max(0, (w - 1440*scale)/2);  // centre when the slot is wider
    q('.stage').style.transform = 'translateX('+dx.toFixed(1)+'px) scale('+scale+')';
    draw(pinned);
  }
  function build(){
    const sec=SCREENS[cur].sec, s=SECTIONS[sec];
    q('.rail').innerHTML='<div class="logo">.S</div>'+Object.keys(SECTIONS).map(k=>{const x=SECTIONS[k];
      return '<button class="rail-i'+(k===sec?' on':'')+'" data-sec="'+k+'">'+
        (x.badge?'<span class="dot">'+x.badge+'</span>':'')+'<span class="bx">'+D.ico(x.icon,20)+'</span>'+
        '<span>'+x.rail+'</span></button>';}).join('')+
      '<div class="rail-sp"><button class="rail-btn ai">'+D.ico('spark',19)+'</button>'+
      '<button class="rail-btn" data-theme-btn>'+D.ico(host.getAttribute('data-theme')==='dark'?'sun':'moon',18)+'</button>'+
      '<div class="avatar">AM</div></div>';
    q('.sec-k').innerHTML=s.k.replace(/\[([^\]]+)\]/,'<b>[$1]</b>');
    q('.side h2').textContent=s.title; q('.sub').textContent=s.sub;
    q('.nav').innerHTML=s.items.map(i=>'<div class="nav-i'+(i[0]===cur?' on':'')+'" data-nav="'+i[0]+'">'+
      D.ico(i[2],17)+i[1]+(i[3]!=null?'<span class="ct">'+i[3]+'</span>':'')+'</div>').join('');
    q('.extra').innerHTML=s.extra||'';
    q('.c1').textContent=s.crumb; q('.c2').textContent=SCREENS[cur].name;
    q('.seg').innerHTML=Array.from({length:10},(_,i)=>'<i class="'+(i<7?'on':'')+'"></i>').join('');
    const r=host.closest('.win'); const lbl=r&&r.querySelector('[data-route]');
    if(lbl) lbl.textContent=cur==='datamap'?'data-map':cur;
  }
  function render(){
    build();
    const v=q('.view'); v.innerHTML=SCREENS[cur].render(); v.scrollTop=0;
    D.hydrate(root);
    requestAnimationFrame(()=>qa('[data-w]').forEach(e=>e.style.width=e.dataset.w+'%'));
    pinned=null; if(cur==='datamap') wireMap();
  }
  /* --- map links, corrected for the embed scale --- */
  function draw(id){
    const svg=q('.maplink'), cols=q('.mapcols'); if(!svg||!cols) return;
    svg.innerHTML=''; if(!id) return;
    const hb=cols.getBoundingClientRect(), k=scale||1;
    svg.setAttribute('viewBox','0 0 '+(hb.width/k)+' '+(hb.height/k));
    const all=[].concat(window.MAP.ext,window.MAP.svc,window.MAP.db);
    const me=all.find(n=>n[0]===id); if(!me) return;
    const outs=new Set(me[6]); all.forEach(n=>{ if(n[6].includes(id)) outs.add(n[0]); });
    const src=cols.querySelector('[data-node="'+id+'"]'); if(!src) return;
    const a=src.getBoundingClientRect();
    outs.forEach(tid=>{
      const t=cols.querySelector('[data-node="'+tid+'"]'); if(!t||t.classList.contains('hidden')) return;
      const b=t.getBoundingClientRect(), right=b.left>a.left;
      const x1=((right?a.right:a.left)-hb.left)/k, y1=(a.top+a.height/2-hb.top)/k;
      const x2=((right?b.left:b.right)-hb.left)/k, y2=(b.top+b.height/2-hb.top)/k;
      const mx=(x1+x2)/2, bad=+src.dataset.risk>0&&+t.dataset.risk>0;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2);
      p.setAttribute('fill','none'); p.setAttribute('stroke',bad?'var(--err)':'var(--brand)');
      p.setAttribute('stroke-width',bad?'2.2':'1.6'); p.setAttribute('opacity','.9');
      p.style.strokeDasharray=600; p.style.strokeDashoffset=600;
      p.style.transition='stroke-dashoffset .55s cubic-bezier(.22,.61,.36,1)';
      svg.appendChild(p); requestAnimationFrame(()=>p.style.strokeDashoffset=0);
    });
  }
  function wireMap(){
    qa('.nd').forEach(d=>{
      d.addEventListener('pointerenter',()=>{ if(pinned)return; markNode(d.dataset.node); draw(d.dataset.node); });
      d.addEventListener('pointerleave',()=>{ if(pinned)return; markNode(null); draw(null); });
      d.addEventListener('click',()=>{ pinned=pinned===d.dataset.node?null:d.dataset.node; markNode(pinned); draw(pinned); });
    });
    let found=56; const t=setInterval(()=>{
      const s=q('#scanSub'); if(!s) return clearInterval(t);
      found+=Math.ceil(Math.random()*3);
      if(found>=80){ found=80; clearInterval(t); const h=q('#scanTxt');
        if(h) h.textContent='Infrastructure mapped — 80 nodes, 3 sensors reporting'; }
      s.textContent=found+' of ~80 expected nodes found · 3 sensors reporting · last update just now';
    },520);
  }
  function markNode(id){ qa('.nd').forEach(x=>x.classList.toggle('on',!!id&&x.dataset.node===id)); }

  /* --- local interactions --- */
  root.addEventListener('click',e=>{
    const t=e.target;
    const sec=t.closest('[data-sec]'); if(sec){ cur=SECTIONS[sec.dataset.sec].items[0][0]; render(); return; }
    const nav=t.closest('[data-nav]'); if(nav){ cur=nav.dataset.nav; render(); return; }
    const th=t.closest('[data-theme-btn]');
    if(th){ const n=host.getAttribute('data-theme')==='dark'?'light':'dark';
      host.setAttribute('data-theme',n); th.innerHTML=D.ico(n==='dark'?'sun':'moon',18); return; }
    const tab=t.closest('.tab'); if(tab){ Array.from(tab.parentElement.children).forEach(x=>x.classList&&x.classList.remove('on'));
      tab.classList.add('on'); filter(tab.closest('.panel')); return; }
    const chk=t.closest('[data-row-chk]'); if(chk){ chk.classList.toggle('on');
      chk.closest('tr').classList.toggle('sel'); bulk(chk.closest('.panel')); return; }
    const sw=t.closest('[data-pol]'); if(sw){ sw.classList.toggle('on');
      const n=qa('.sw.on').length, h=q('#polHead');
      if(h) h.textContent=n+' of 5 policies are active and checking your perimeter'; return; }
    const task=t.closest('[data-task]'); if(task){ task.classList.toggle('on'); return; }
    const ro=t.closest('[data-risk-only]'); if(ro){ ro.classList.toggle('on');
      const only=ro.classList.contains('on');
      qa('.nd').forEach(d=>d.classList.toggle('hidden',only&&+d.dataset.risk===0)); draw(pinned); return; }
    const s=t.closest('.sel'); if(s) s.classList.toggle('on');
  });
  root.addEventListener('input',e=>{
    const i=e.target.closest('[data-q]'); if(!i) return;
    if(i.dataset.q==='map'){ const v=i.value.toLowerCase();
      qa('.nd').forEach(d=>d.classList.toggle('hidden',!!v&&!d.textContent.toLowerCase().includes(v)));
      draw(pinned); return; }
    filter(i.closest('.panel'));
  });
  function filter(panel){
    if(!panel) return;
    const inp=panel.querySelector('[data-q]'), body=panel.querySelector('[data-rows]'); if(!body) return;
    const v=(inp&&inp.value||'').toLowerCase(), tab=panel.querySelector('.tab.on');
    let n=0;
    Array.from(body.rows).forEach(r=>{
      let ok=!v||(r.dataset.f||r.textContent).toLowerCase().includes(v);
      if(ok&&tab){ const k=(tab.dataset.v||'').toLowerCase(), tx=r.textContent.toLowerCase();
        if(k==='new')ok=tx.includes('new'); else if(k==='inv')ok=tx.includes('investigating');
        else if(k==='res')ok=tx.includes('resolved');
        else if(k==='act')ok=!!r.querySelector('.sw.on'); else if(k==='pau')ok=!r.querySelector('.sw.on'); }
      r.hidden=!ok; if(ok)n++;
    });
    const c=panel.querySelector('[data-count]'); if(c) c.textContent=n+' of '+body.rows.length;
  }
  function bulk(panel){ if(!panel)return; const bar=panel.querySelector('#bulkBar'); if(!bar)return;
    const n=panel.querySelectorAll('tbody tr.sel').length; bar.hidden=n===0;
    const b=bar.querySelector('[data-bulk-n]'); if(b)b.textContent=n; }

  render(); fit();
  if(window.ResizeObserver) new ResizeObserver(fit).observe(host); else addEventListener('resize',fit);
}
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting && !e.target.dataset.mounted){ e.target.dataset.mounted=1; mount(e.target); io.unobserve(e.target); }
}),{rootMargin:'400px'});
document.querySelectorAll('.dspm-host').forEach(h=>io.observe(h));
})();
