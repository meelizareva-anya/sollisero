(() => {
  const { $, $$, RM, el, onVisible } = Sollisero;

  /* ---- Engagement models: moving highlight ---- */
  const models = $('#models');
  if (models) {
    const cards = $$('.model', models);
    const set = i => cards.forEach((c, j) => { c.classList.toggle('on', j === i); c.setAttribute('aria-pressed', j === i); });
    let cur = 3; set(cur);
    cards.forEach((c, i) => { c.addEventListener('mouseenter', () => set(i)); c.addEventListener('focus', () => set(i)); c.addEventListener('click', () => { cur = i; set(i); }); });
    models.addEventListener('mouseleave', () => set(cur));
  }

  /* ---- Expertise: highlight swap ---- */
  const exp = $('#exp');
  if (exp) {
    const cards = $$('.xcard', exp); let cur = 0;
    const set = i => cards.forEach((c, j) => c.classList.toggle('on', j === i));
    cards.forEach((c, i) => { c.tabIndex = 0; c.addEventListener('mouseenter', () => set(i)); c.addEventListener('focus', () => set(i)); c.addEventListener('click', () => { cur = i; set(i); }); });
    exp.addEventListener('mouseleave', () => set(cur));
  }
/* ---- Products: interactive bento (one product expanded at a time) ---- */
  const bento = $('#bento');
  if (bento) {
    const rows = $$('.brow', bento);
    const cards = $$('.bcard[data-p]', bento);
    const setOpen = (card) => {
      cards.forEach((c) => {
        const on = c === card;
        c.classList.toggle('open', on);
        $('.bhit', c)?.setAttribute('aria-expanded', String(on));
      });
      rows.forEach((r) => r.classList.toggle('active', r.contains(card)));
      Sollisero.fitAll();
    };
    cards.forEach((c, i) => {
      const hit = $('.bhit', c);
      if (!hit) return;
      hit.addEventListener('click', () => setOpen(c));
      hit.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) setOpen(c); });
      hit.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = cards[(i + step + cards.length) % cards.length];
        setOpen(next);
        $('.bhit', next)?.focus();
      });
    });
    setOpen(cards[0]);
  }
})();
