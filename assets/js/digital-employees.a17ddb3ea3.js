
Sollisero.onReady(() => {
/* scripts/pages/digital-employees.js */
(() => {
  const { $, $$, RM, onVisible } = Sollisero;

  /* Role cards: tap to open on touch devices, Escape closes */
  $$('.role').forEach(card => {
    card.addEventListener('click', e => { if (e.target.closest('a')) return; if (matchMedia('(hover:none)').matches) { const o = card.classList.contains('open'); $$('.role.open').forEach(c => c.classList.remove('open')); card.classList.toggle('open', !o); } });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('open'); } if (e.key === 'Escape') card.classList.remove('open'); });
  });

  /* In practice: animated agent run (request → steps → result) */
  const demo = $('#practiceDemo');
  if (demo) {
    const rows = $$('tbody tr, tr', $('[data-r-rows]', demo)).filter(r => r.querySelector('td'));
    const steps = $$('li', $('[data-r-steps]', demo));
    const stories = $$('.story [data-step]', demo);
    const bar = $('[data-r-bar]', demo), status = $('[data-r-status]', demo), clock = $('[data-r-clock]', demo), rtime = $('[data-r-time]', demo);
    const N = steps.length; let t, running = false, i = 0;
    const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    const reset = () => { rows.forEach(r => r.classList.remove('on')); steps.forEach(s => s.classList.remove('on', 'cur')); stories.forEach(s => s.classList.remove('lit')); bar.style.width = '0'; status.textContent = '● Processing'; status.className = 'w'; clock.textContent = '00:00'; rtime.textContent = '00:00'; };
    const tick = () => {
      if (i >= N) { status.textContent = '● Awaiting engineer decision'; status.className = 'ok'; stories[3].classList.add('lit'); t = setTimeout(() => { i = 0; reset(); tick(); }, 5000); return; }
      steps.forEach((s, j) => { s.classList.toggle('on', j <= i); s.classList.toggle('cur', j === i); });
      bar.style.width = ((i + 1) / N * 100) + '%';
      const sec = [5, 20, 71, 112, 137, 134][i]; clock.textContent = fmt(sec); rtime.textContent = fmt(sec);
      stories.forEach(s => s.classList.remove('lit'));
      const sidx = i === 0 ? 0 : i === 1 ? 1 : i < 5 ? 2 : 3; stories[sidx] && stories[sidx].classList.add('lit');
      if (i === 2) rows.slice(0, 3).forEach((r, k) => setTimeout(() => r.classList.add('on'), k * 300));
      if (i === 3) rows.slice(3).forEach((r, k) => setTimeout(() => r.classList.add('on'), k * 300));
      i++; t = setTimeout(tick, i === 1 ? 900 : 1500);
    };
    if (RM) { rows.forEach(r => r.classList.add('on')); steps.forEach(s => s.classList.add('on')); bar.style.width = '100%'; status.textContent = '● Awaiting engineer decision'; status.className = 'ok'; clock.textContent = rtime.textContent = '02:14'; }
    else onVisible(demo, v => { if (v && !running) { running = true; i = 0; reset(); tick(); } else if (!v && running) { running = false; clearTimeout(t); } }, { threshold: .2 });
  }

  /* Admin mock: gently cycle the selected role card */
  const grid = $('[data-adm-grid]');
  if (grid && !RM) { const cards = $$('.rc', grid); let k = 0; onVisible(grid, v => { clearInterval(grid._t); if (v) grid._t = setInterval(() => { cards.forEach(c => c.classList.remove('sel')); cards[k % cards.length].classList.add('sel'); k++; }, 1800); }); }
})();

});