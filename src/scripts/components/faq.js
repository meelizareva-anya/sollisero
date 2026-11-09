/* FAQ accordion: [data-faq] > .qa > button[aria-expanded] + .ans. One item open at a time. */
Sollisero.component('faq', () => {
  const { $, $$ } = Sollisero;
  $$('[data-faq]').forEach((list) => {
    const items = $$('.qa', list);
    items.forEach((item, i) => {
      const btn = $('button', item);
      const panel = $('.ans', item);
      if (!btn) return;
      if (panel) {
        panel.id ||= `${list.id || 'faq'}-a${i}`;
        btn.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'region');
      }
      btn.addEventListener('click', () => {
        const open = !item.classList.contains('open');
        items.forEach((x) => { x.classList.remove('open'); $('button', x)?.setAttribute('aria-expanded', 'false'); });
        if (open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  });
});
