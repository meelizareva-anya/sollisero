(() => {
  const { $, $$, RM, el, onVisible } = Sollisero;

  /* ---- Engagement models: moving highlight ---- */
  const models = $('#models');
  if (models) {
    const cards = $$('.model', models), tl = $('.tl', models);
    const dots = cards.map(() => { const d = el('i'); tl.append(d); return d; });
    const place = () => { const r = models.getBoundingClientRect(); cards.forEach((c, i) => { const cr = c.getBoundingClientRect(); dots[i].style.top = (cr.top - r.top + 40) + 'px'; }); };
    const set = i => { cards.forEach((c, j) => { c.classList.toggle('on', j === i); c.setAttribute('aria-pressed', j === i); }); dots.forEach((d, j) => d.classList.toggle('on', j === i)); };
    let cur = 3; set(cur); place();
    cards.forEach((c, i) => { c.addEventListener('mouseenter', () => set(i)); c.addEventListener('focus', () => set(i)); c.addEventListener('click', () => { cur = i; set(i); }); });
    models.addEventListener('mouseleave', () => set(cur));
    new ResizeObserver(place).observe(models);
  }

  /* ---- Industries: client-base matrix ---- */
  const matrix = $('#matrix'), shares = $('#shares');
  if (matrix && shares) {
    const data = [[35, '#5579eb'], [11, '#9db4ff'], [10, '#c2d1f5'], [8, '#2246bd'], [8, '#7f9cf5'], [3, '#ffffff'], [25, 'rgba(85,96,127,.45)']];
    const cells = []; let idx = 0;
    data.forEach(([n, c], gi) => { for (let j = 0; j < n; j++) { const i = el('i'); i.dataset.g = gi; i.style.background = c; i.style.transitionDelay = (RM ? 0 : idx * 12) + 'ms'; matrix.append(i); cells.push(i); idx++; } });
    onVisible(matrix, v => { if (v) { matrix.classList.add('in'); shares.classList.add('in'); } }, { threshold: .3 });
    const hi = g => cells.forEach(i => i.classList.toggle('hi', g != null && +i.dataset.g === g));
    $$('[data-i]', shares).forEach(r => { r.addEventListener('mouseenter', () => hi(+r.dataset.i)); r.addEventListener('mouseleave', () => hi(null)); });
    cells.forEach(i => { i.addEventListener('mouseenter', () => { hi(+i.dataset.g); $$('[data-i]', shares).forEach(r => r.style.background = +r.dataset.i === +i.dataset.g ? 'rgba(255,255,255,.05)' : ''); }); });
    matrix.addEventListener('mouseleave', () => { hi(null); $$('[data-i]', shares).forEach(r => r.style.background = ''); });
  }

  /* ---- Expertise: highlight swap ---- */
  const exp = $('#exp');
  if (exp) {
    const cards = $$('.xcard', exp); let cur = 0;
    const set = i => cards.forEach((c, j) => c.classList.toggle('on', j === i));
    cards.forEach((c, i) => { c.tabIndex = 0; c.addEventListener('mouseenter', () => set(i)); c.addEventListener('focus', () => set(i)); c.addEventListener('click', () => { cur = i; set(i); }); });
    exp.addEventListener('mouseleave', () => set(cur));
  }
})();
