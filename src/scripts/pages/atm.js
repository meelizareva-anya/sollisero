(function(){
  const {$, $$, RM, el, onVisible} = Sollisero;

  /* QR pattern boxes */
  $$('[data-qr]').forEach(q => { let s = 11; const r = () => (s = (s*9301+49297)%233280)/233280; let h = ''; for (let i = 0; i < 81; i++) { const x = i%9, y = (i/9)|0; const fin = (x<3&&y<3)||(x>5&&y<3)||(x<3&&y>5); const on = fin ? !((x===1||x===7)&&(y===1||y===7)) && !(x===1&&y===1) || (x===1&&y===1) || (x===7&&y===1) || (x===1&&y===7) ? (x%3!==1||y%3!==1||true) : true : r()>.5; h += `<i class="${on?'':'o'}"></i>`; } q.innerHTML = h; });

  /* Hero: the customer screen's session countdown */
  const tmo = $('#tmo'); let sec = 42;
  if (tmo && !RM) setInterval(() => { sec = sec <= 0 ? 42 : sec - 1; tmo.textContent = '0:' + String(sec).padStart(2,'0'); }, 1000);

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

})();
