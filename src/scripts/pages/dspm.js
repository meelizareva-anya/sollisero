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
