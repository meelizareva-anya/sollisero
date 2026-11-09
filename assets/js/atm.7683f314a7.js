/* scripts/pages/atm.data.js */
/* Advantages data (before site.js) */
(function(){
  const win = (url, body) => `<div class="win"><div class="win-bar"><i></i><i></i><i></i><span class="win-url"><i></i>${url}</span></div><div class="win-screen"><div class="ui">${body}</div></div></div>`;
  const lst = rows => `<div class="lst">${rows.map(r=>`<div><div class="m"><b>${r[0]}</b><small>${r[1]}</small></div><span class="pill ${r[3]||''}">${r[2]}</span></div>`).join('')}</div>`;
  const tbl = (head, rows) => `<table class="tbl"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'k':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  Sollisero.data.ADV = [
    {tab:'Hardware compatibility', title:'Support for 60+ device types', text:'Sollisero ATM supports multivendor ATMs and preserves a unified software foundation when the ATM fleet is upgraded and expanded.', chips:['Multivendor','Installed fleet','Compatibility'], k:'Core',
      html: win('atm.sollisero / network', `<div class="ui-h"><b>ATM network</b><small>1,248 devices · 9 vendors</small><span class="pill green dot">1,231 online</span></div>`+tbl(['ATM','Vendor · model','Location','Status'],[['ATM 1000‑1000','NCR · SelfServ 84','Almaty · HQ','<span class="pill green dot">Online</span>'],['ATM 1000‑1017','Diebold Nixdorf · DN 200','Astana · Mall','<span class="pill green dot">Online</span>'],['ATM 1000‑1042','GRG · H68N','Shymkent · Branch 4','<span class="pill amber dot">Service</span>'],['ATM 1000‑1077','Nautilus Hyosung · MX8800','Karaganda','<span class="pill green dot">Online</span>'],['ATM 1000‑1103','OKI · ATM‑Recycler G8','Atyrau · Airport','<span class="pill green dot">Online</span>']]))},
    {tab:'Device onboarding', title:'New hardware without a separate software environment', text:'Integrate new ATM models into the existing infrastructure with no need to develop and support a separate software solution for each vendor.', chips:['New models','Onboarding','Scaling'], k:'Hardware',
      html: win('atm.sollisero / onboarding', `<div class="ui-h"><b>Onboarding queue</b><small>Same software stack on every model</small><span class="pill blue">+ Add model</span></div>`+lst([['GRG · H68NL','XFS profile mapped · 14 devices','Ready','green'],['Hyosung · MX8200','Device test 7 / 9 passed','Testing','amber'],['DN Series 400','Awaiting hardware','Planned','']]))},
    {tab:'Payment applications', title:'In-house services for the ATM channel', text:'Create payment applications and extensions built on a common business logic and use them on supported multivendor devices.', chips:['Applications','Customer scenarios','Extensions'], k:'Applications',
      html: win('atm.sollisero / apps', `<div class="ui-h"><b>Applications</b><small>Deployed to all supported devices</small><span class="pill blue">Publish</span></div>`+lst([['Withdraw · v4.2','1,248 devices · 100%','Active','green'],['Fill Up · v2.0','1,248 devices · 100%','Active','green'],['Utility payments · v1.3','Rolling out · 612 devices','Rollout','amber'],['Currency exchange · v1.0','₽ $ € £ AED','Active','green']]))},
    {tab:'Processing', title:'Support for Multi-Processing Centers', text:'Use Sollisero ATM within multi-processing infrastructures with several processing systems and support diverse transaction routing paths.', chips:['Multi-processing','Transactions','Routing'], k:'Integration',
      html: win('atm.sollisero / processing', `<div class="ui-h"><b>Transaction routing</b><small>Last 60 seconds</small><span class="pill green dot">All hosts up</span></div>`+tbl(['Host','Route','TPS','Latency'],[['Processing A','Domestic cards · default','<span id="tpsA">184</span>','42 ms'],['Processing B','International · Visa / MC','<span id="tpsB">61</span>','58 ms'],['Processing C','Payments · utilities','<span id="tpsC">27</span>','35 ms']]))},
    {tab:'Cash recycling', title:'Support for cash recycling ATMs', text:'Sollisero ATM operates with devices that support the acceptance, storage, and re-dispensing of deposited banknotes.', chips:['Cash recycling','Cash-in','Cash-out'], k:'Hardware',
      html: win('atm.sollisero / cash', `<div class="ui-h"><b>Cash forecast</b><small>ATM 1000‑1000 · recycler</small><span class="pill amber dot">Replenish in 2 days</span></div><div class="cash" id="cash"><div><span>Cassette 1 · 100</span><span class="bar"><i data-w="72"></i></span><span class="num">1,440</span></div><div><span>Cassette 2 · 50</span><span class="bar"><i data-w="38" class="low"></i></span><span class="num">760</span></div><div><span>Cassette 3 · 20</span><span class="bar"><i data-w="14" class="crit"></i></span><span class="num">280</span></div><div><span>Recycler · in</span><span class="bar"><i data-w="55"></i></span><span class="num">1,100</span></div><div><span>Reject bin</span><span class="bar"><i data-w="9"></i></span><span class="num">18</span></div></div>`)},
    {tab:'Support', title:'Full lifecycle support', text:'Sollisero ATM’s support includes software maintenance and incident investigation following the post-deployment phase.', chips:['Maintenance','Incidents','Operations'], k:'Operation',
      html: win('atm.sollisero / incidents', `<div class="ui-h"><b>Incidents</b><small>Open · by priority</small><span class="pill red">2 critical</span></div>`+lst([['Card reader jam','ATM 1000‑1042 · GRG · 12 min','Critical','red'],['Receipt printer out of paper','ATM 1000‑1017 · DN 200 · 48 min','Medium','amber'],['Cassette 3 below threshold','ATM 1000‑1000 · NCR · forecast','Low','blue'],['Software update completed','312 devices · v4.2','Resolved','green']]))},
    {tab:'Integration into the infrastructure', title:'Adaptation to the bank’s infrastructure', text:'Sollisero ATM adapts to the client’s software environment and hardware. Prior to integration, compatibility can be confirmed through regression testing.', chips:['Adaptation','Testing','Integration'], k:'Integration',
      html: win('atm.sollisero / testing', `<div class="ui-h"><b>Regression suite</b><small>Bank environment · pre-deployment</small><span class="pill green dot">96% passed</span></div>`+lst([['XFS device layer','412 / 412 checks','Passed','green'],['Processing protocol · NDC+','118 / 121 checks','3 warnings','amber'],['Customer scenarios','64 / 64 flows','Passed','green'],['Security · EPP & keys','28 / 28 checks','Passed','green']]))},
    {tab:'Lifecycle', title:'Develop the existing fleet continuously', text:'Integrate new hardware components and expand the capabilities of the ATMs already in service with no need to replace the fleet already installed at once.', chips:['Modernization','Existing ATMs','Phased upgrades'], k:'Flexibility',
      html: win('atm.sollisero / fleet', `<div class="ui-h"><b>Fleet modernization</b><small>Installed base · by phase</small><span class="pill blue">Plan</span></div>`+lst([['Phase 1 · NFC readers','420 devices · done','Done','green'],['Phase 2 · recyclers','310 devices · in progress','In progress','amber'],['Phase 3 · new vendor','180 devices · planned Q3','Planned',''],['Software foundation','Unchanged across phases','Kept','blue']]))}
  ];
})();

Sollisero.onReady(() => {
/* scripts/pages/atm.js */
(function(){
  const {$, $$, RM, el, onVisible} = Sollisero;

  /* QR pattern boxes */
  $$('[data-qr]').forEach(q => { let s = 11; const r = () => (s = (s*9301+49297)%233280)/233280; let h = ''; for (let i = 0; i < 81; i++) { const x = i%9, y = (i/9)|0; const fin = (x<3&&y<3)||(x>5&&y<3)||(x<3&&y>5); const on = fin ? !((x===1||x===7)&&(y===1||y===7)) && !(x===1&&y===1) || (x===1&&y===1) || (x===7&&y===1) || (x===1&&y===7) ? (x%3!==1||y%3!==1||true) : true : r()>.5; h += `<i class="${on?'':'o'}"></i>`; } q.innerHTML = h; });

  /* Hero: amount buttons + session timer + tile cycling */
  const amts = $('#amts'), out = $('#amtOut');
  amts && amts.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', amts).forEach(x => x.classList.remove('on')); b.classList.add('on'); out.textContent = b.dataset.v === 'Other' ? '…' : b.dataset.v; });
  const tmo = $('#tmo'); let sec = 45;
  if (tmo && !RM) setInterval(() => { sec = sec <= 0 ? 45 : sec - 1; tmo.textContent = '00:' + String(sec).padStart(2,'0'); }, 1000);
  const tiles = $$('#ktiles b'); let ti = 0;
  if (tiles.length && !RM) setInterval(() => { tiles[ti].classList.remove('on'); ti = (ti+1)%tiles.length; tiles[ti].classList.add('on'); }, 2200);

  /* Network nodes: light status changes (online → service → online) */
  const nodes = $$('[data-net] .anode:not([data-keep])');
  if (nodes.length && !RM) setInterval(() => {
    const n = nodes[Math.floor(Math.random()*nodes.length)]; const s = n.querySelector('small');
    n.classList.add('svc'); s.textContent = 'ATM · service';
    setTimeout(() => { n.classList.remove('svc'); s.textContent = 'ATM · online'; }, 2600);
  }, 3000);

  /* Scenario chips: cycle highlight */
  const sc = $$('#scen span'); let si = 0;
  if (sc.length && !RM) setInterval(() => { sc.forEach(x => x.classList.remove('on')); sc[si].classList.add('on'); si = (si+1)%sc.length; }, 1400);

  /* Vendors: same denomination selected on all three screens at once */
  const dens = $$('#vendors .dn'); let di = 0;
  if (dens.length && !RM) setInterval(() => { di = (di+1)%4; dens.forEach(d => { $$('b', d).forEach((b,i) => b.classList.toggle('on', i===di)); }); }, 2600);

  /* Advantages panel extras: cash bars + TPS counters */
  const adv = $('[data-tabs="ADV"]');
  const tick = () => {
    $$('#cash .bar i').forEach(i => { requestAnimationFrame(() => i.style.width = i.dataset.w + '%'); });
  };
  adv && adv.addEventListener('tabchange', e => { const a = e.detail.a; const k = $('.panel .k', adv); if (k && a.k) k.textContent = `[ ${String(e.detail.i+1).padStart(2,'0')} / 08 ]  ${a.k}`; setTimeout(tick, 50); });
  setTimeout(() => { const k = $('.panel .k', adv); if (k) k.textContent = '[ 01 / 08 ]  Core'; }, 0);
  if (!RM) setInterval(() => { ['tpsA','tpsB','tpsC'].forEach(id => { const n = document.getElementById(id); if (n) n.textContent = Math.max(5, (+n.textContent) + Math.round((Math.random()-.5)*8)); }); }, 1200);

  /* Status pill in the hero row */
  const so = $('#srowOn'); if (so && !RM) setInterval(() => { so.style.opacity = so.style.opacity === '0.55' ? '1' : '0.55'; }, 1500);
})();

});