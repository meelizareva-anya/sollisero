/**
 * Fit-to-view scaler for fixed-size UI mockups.
 *   <div class="fit-view" data-w="1100" data-h="580" data-mode="contain|width"><div>…fixed-size mock…</div></div>
 * Exposed as Sollisero.fitAll() for page scripts that inject mocks later.
 */
(() => {
  const fitAll = () => Sollisero.$$('.fit-view').forEach((view) => {
    const inner = view.firstElementChild;
    if (!inner || inner.dataset.fit) return;
    inner.dataset.fit = '1';
    const w = +view.dataset.w || 1100;
    const h = +view.dataset.h || 580;
    const mode = view.dataset.mode || 'contain';
    if (mode === 'contain' && !view.style.aspectRatio && !view.style.height) view.style.aspectRatio = `${w}/${h}`;
    inner.style.width = `${w}px`;
    inner.style.height = `${h}px`;
    new ResizeObserver(() => {
      const W = view.clientWidth;
      const H = view.clientHeight || (W * h) / w;
      const k = mode === 'width' ? W / w : Math.min(W / w, H / h);
      const x = (W - w * k) / 2;
      const y = mode === 'width' ? 0 : (H - h * k) / 2;
      inner.style.transform = `translate(${x}px,${y}px) scale(${k})`;
      if (mode === 'width') view.style.height = `${h * k}px`;
    }).observe(view);
  });
  Sollisero.fitAll = fitAll;
  Sollisero.component('fit-view', fitAll);
})();
