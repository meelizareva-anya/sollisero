/* scripts/pages/dspm.data.js */
/* Advantages data (must be defined before site.js) */
(function(){
  const mock = (url, label, rows) => `<div class="win"><div class="win-bar"><i></i><i></i><i></i><span class="win-url"><i></i>${url}</span></div><div class="win-screen"><div class="ui"><div class="lst">${rows.map(r=>`<div><div class="m"><b>${r[0]}</b><small>${r[1]}</small></div><span class="pill ${r[3]||''}">${r[2]}</span></div>`).join('')}</div><span class="cap-lbl">${label}</span></div></div></div>`;
  Sollisero.data.ADV = [
    {tab:'Data visibility within Kubernetes', title:'Full visibility in days, not months', text:'Deploy into the cluster and get a live map of where sensitive data lives and moves — no code changes in applications and no manual data inventories.', chips:['Traffic','Storage','Routes'], html: mock('dspm.sollisero / flow-map','Data map · live',[['checkout-api → PostgreSQL','card · PCI · 6 connections','2 risks','red'],['user-profile → Kafka','email · phone · PII','Allowed','blue'],['crm-sync → partner-sftp','email · PII · new route','Review','amber']])},
    {tab:'Request content inspection', title:'Request content inspection', text:'dspm analyzes not only the interactions between services, but also the types of data being transmitted — detecting sensitive information even within authorized connections if its transmission is not permitted by policy.', chips:['Microservices','Request content','Endpoints'], html: mock('dspm.sollisero / requests','Request inspector · payload',[['POST /analytics/ingest','{ "card": "5536 •••• 0217" } · 2.1 KB','PCI','red'],['GET /crm/contacts?page=4','email=i•••@bank.ru · 14 KB','PII','blue'],['PUT /users/829','phone=+7 ••• •• 42 · 0.6 KB','PII','blue']])},
    {tab:'Data recognition by content and structure', title:'Data recognition based on content and structure', text:'The platform detects sensitive data using templates, regular expressions and data structure analysis. Detected values are masked before further processing, while classification results are linked to infrastructure components.', chips:['Recognition','Masking','Data types'], html: mock('dspm.sollisero / classification','Classification · masked values',[['4276 •••• •••• 5521','Luhn-valid · card number','PCI','blue'],['DE•• •••• •••• 3301','IBAN structure','PCI','blue'],['a•••@mail.com','RFC 5322 pattern · email','PII','']])},
    {tab:'Leaks stopped at the route', title:'Leaks stopped at the route, not after the fact', text:'dspm compares actual sensitive data flows against predefined security rules, detects transfers along routes not permitted by policies, logs the violations, and stores the data for further analysis.', chips:['Policies','Anomalies','Violations'], html: mock('dspm.sollisero / violations','Violations feed',[['Card data over plaintext HTTP','checkout-api → analytics · just now','Critical','red'],['PII leaving EU regions','reports-worker → s3-us · 4 min ago','High','amber'],['Secret in application logs','auth-svc · 22 min ago','High','amber']])},
    {tab:'Minutes-long investigations', title:'Investigations in minutes instead of days', text:'When a violation is detected, the platform stores data type, source, recipient, involved services, endpoints and the exact transfer route — the security team gets the actual event context without manual correlation.', chips:['Source','Recipient','Route'], html: mock('dspm.sollisero / incident-chain','Interaction chain',[['01 · checkout-api','source · POST /pay · card=5536 •••• 0217','Origin','blue'],['02 · api-gateway','hop · 09:41:02 · 200','Transit',''],['03 · analytics','recipient · PUSH /analytics · plaintext','Violation','red']])},
    {tab:'Real-time visibility without manual updates', title:'Real-time visibility without manual diagram updates', text:'dspm continuously analyzes actual interactions within Kubernetes. New services and routes are accounted for as they emerge, keeping the data flow picture up to date without manual diagram updates.', chips:['New services','Changes','Automation'], html: mock('dspm.sollisero / live-map','Live topology · changes',[['notification-svc','new service · discovered 2 min ago','New','green'],['crm-sync → partner-sftp','new route · email · PII','Review','amber'],['billing-events → Kafka','route confirmed · policy ok','Allowed','blue']])},
    {tab:'Monitoring without external infrastructure', title:'Data monitoring without external infrastructure', text:'Management, classification and storage components are deployed within the customer’s infrastructure. The platform works in an isolated environment and requires no changes to monitored applications.', chips:['On-premises','Isolation','Zero changes'], html: mock('dspm.sollisero / deployment','Deployment · cluster nodes',[['dspm-sensor · node-01…12','eBPF · DaemonSet · 12 / 12 ready','Online','green'],['dspm-classifier','isolated namespace · 3 replicas','Online','green'],['dspm-store','PostgreSQL · encrypted volume','Online','green']])},
    {tab:'Integrating incidents into security processes', title:'Integrating incidents into existing security processes', text:'Detected violations flow into existing security tools and workflows. Supports Jira, Slack, email and webhooks, with Keycloak SSO for single sign-on.', chips:['Jira','Webhooks','Notifications'], html: mock('dspm.sollisero / integrations','Integrations · destinations',[['Jira · SEC project','Critical and High → issue','Connected','green'],['Slack · #sec-alerts','All violations · realtime','Connected','green'],['Webhook · SIEM','JSON · signed','Connected','green']])}
  ];
})();

Sollisero.onReady(() => {
/* scripts/pages/dspm.js */
(function(){
  const {$, $$, RM, el, onVisible} = Sollisero;

  /* ---- Hero: priority events list + rotating violation row ---- */
  const events = [
    ['Card numbers sent over plaintext HTTP','checkout-api → analytics · payments','Critical','red'],
    ['Public bucket exposes customer PII','s3 / customer-exports · 7 days','High','amber'],
    ['Secret detected in application logs','auth-svc · api-key','High','amber'],
    ['Unusual export volume','reports-worker · 1.2 GB','Medium','blue'],
    ['PII leaving EU regions','reports-worker → s3-us','High','amber']
  ];
  const list = $('#heroEvents');
  const row = e => el('div', '', `<span class="sev ${e[2]==='Critical'?'c':e[2]==='High'?'h':'m'}"><i></i><i></i><i></i></span><div class="m"><b>${e[0]}</b><small>${e[1]}</small></div><span class="pill ${e[3]}">${e[2]}</span>`);
  if (list) {
    events.slice(0,4).forEach(e => list.append(row(e)));
    let k = 4;
    if (!RM) setInterval(() => { const r = row(events[k++ % events.length]); r.style.animation = 'vin .5s cubic-bezier(.2,.8,.2,1)'; list.prepend(r); list.lastElementChild.remove(); }, 4200);
  }
  const viol = [
    ['PUSH /analytics','card=5536 •••• 0217','PCI'],
    ['POST /crm/export','email=i•••@bank.ru','PII'],
    ['GET /reports/raw','phone=+7 ••• •• 42','PII'],
    ['PUT /s3/customer-exports','iban=DE•• •••• 3301','PCI']
  ];
  const vrow = $('#vrow'); let vi = 0;
  if (vrow && !RM) setInterval(() => { vi = (vi+1) % viol.length; const v = viol[vi]; vrow.innerHTML = `<div class="line"><b>${v[0]}</b><span class="v">${v[1]}</span><b>${v[2]}</b><span class="tag-red">Violation</span></div>`; }, 3600);

  /* ---- Capabilities: policy toggles are clickable ---- */
  $$('.tgl').forEach(t => t.addEventListener('click', e => { e.stopPropagation(); t.classList.toggle('on'); }));

  /* ---- Advantages: convergence illustration ---- */
  const conv = $('#conv');
  if (conv) {
    const W = 1340, H = 460, hx = 1030, hy = 415, cols = 26, rows = 7, gx = W/(cols-1), gy = 42;
    let dots = '', lines = '', pk = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dots += `<circle class="dot" cx="${(c*gx).toFixed(1)}" cy="${(r*gy+8).toFixed(1)}" r="1.4"/>`;
    for (let c = 0; c < cols; c++) { const x = c*gx, y = 8; lines += `<line class="ln" x1="${x.toFixed(1)}" y1="${y}" x2="${hx}" y2="${hy}"/>`; if (!RM && c % 2 === 0) pk += `<circle class="pk" r="2.2"><animateMotion dur="${(3+ (c%5)*.7).toFixed(1)}s" begin="${(c*.23).toFixed(2)}s" repeatCount="indefinite" path="M${x.toFixed(1)} ${y} L${hx} ${hy}"/></circle>`; }
    conv.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMax meet">${dots}${lines}${pk}<line x1="${hx}" y1="${hy}" x2="${hx}" y2="${H}" stroke="#5579eb" stroke-width="1.5"/></svg><span class="hub" style="left:${hx/W*100}%;top:${hy/H*100}%"><i></i>dspm</span>`;
  }

  /* ---- Use cases: binary data stream ---- */
  const rowsEl = $('#stream .rows');
  if (rowsEl) {
    let seed = 7; const rnd = () => (seed = (seed*9301+49297) % 233280) / 233280;
    for (let r = 0; r < 7; r++) { let s = ''; for (let i = 0; i < 240; i++) s += rnd() > .5 ? '1' : '0'; const d = el('div'); d.textContent = s + s; rowsEl.append(d); }
  }

  /* ---- Pause panel autoplay while hovering the mock ---- */
  $$('.kpi.warn b').forEach(b => { if (RM) return; let n = +b.textContent; setInterval(() => { n = n === 7 ? 8 : 7; b.textContent = n; }, 6000); });
})();

});