(() => {
  const {$, $$, RM, onVisible} = Sollisero;
  /* panel label "[ 01 / 06 ]  Payments" */
  const hw = $('[data-tabs="HW"]');
  const relabel = () => { const k = $('.swap .k', hw); if (!k) return; const n = k.textContent.match(/\d+/g); const a = Sollisero.data.HW[+n[0]-1]; k.textContent = `[ ${n[0]} / ${n[1]} ]  ${a.k}`; };
  if (hw) { relabel(); hw.addEventListener('tabchange', relabel); }

  /* formatted count-ups inside mocks */
  const fmt = (v, dec) => v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
  $$('[data-n]').forEach(n => { const t = parseFloat(n.dataset.n), pre = n.dataset.pre || '', dec = +(n.dataset.dec || 0); onVisible(n, v => { if (!v || n.dataset.done) return; n.dataset.done = 1; if (RM) { n.textContent = pre + fmt(t, dec); return; } const t0 = performance.now(), D = 1300; const f = ts => { const k = Math.min(1, (ts - t0) / D), e = 1 - Math.pow(1 - k, 3); n.textContent = pre + fmt(t * e, dec); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); });

  /* bars / sparklines / donuts: add .in when the mock is visible */
  $$('.portal, .uc .win, .mini-portal').forEach(m => onVisible(m, v => { if (!v) return; m.classList.add('in'); $$('.seg', m).forEach(c => { const L = 2 * Math.PI * 30, s = +c.dataset.seg / 100 * L, o = +(c.dataset.off || 0) / 100 * L; c.style.strokeDasharray = `${s} ${L - s}`; c.style.strokeDashoffset = -o; }); }, {threshold: .3}));

  /* QR waiting timer */
  $$('[data-timer]').forEach(t => { let s = 42; setInterval(() => { s = (s + 1) % 60; t.textContent = `0:${String(s).padStart(2, '0')}`; }, 1000); });
})();
