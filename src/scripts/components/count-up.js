/* Count-up numbers: <span data-count="15" data-pre="" data-suf="+">15+</span> (final value in markup = no-JS fallback). */
Sollisero.component('count-up', () => {
  const { $$, RM, onVisible } = Sollisero;
  const DURATION = 1400;
  $$('[data-count]').forEach((node) => {
    const target = parseFloat(node.dataset.count);
    const pre = node.dataset.pre || '';
    const suf = node.dataset.suf || '';
    const decimals = (String(node.dataset.count).split('.')[1] || '').length;
    const render = (v) => { node.textContent = pre + v.toFixed(decimals) + suf; };
    const io = onVisible(node, (visible) => {
      if (!visible) return;
      io.disconnect();
      if (RM) return render(target);
      const t0 = performance.now();
      const frame = (t) => {
        const k = Math.min(1, (t - t0) / DURATION);
        render(target * (1 - (1 - k) ** 3));
        if (k < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  });
});
