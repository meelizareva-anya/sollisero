/**
 * Auto-advancing tabs ("Advantages" pattern).
 *   <div class="adv" data-tabs="KEY"><div class="tabs" role="tablist"></div>
 *     <div class="panel"><span class="big"></span><div class="swap"></div>…</div></div>
 * Content: Sollisero.data[KEY] = [{ tab, title, text, chips?, html? }]
 * `html` is trusted author markup. Emits `tabchange` ({ detail: { i, a } }) on the root.
 */
Sollisero.component('tabs', () => {
  const { $, $$, RM, el, onVisible, canHover, pad2 } = Sollisero;
  const DURATION = 7000;

  $$('[data-tabs]').forEach((root) => {
    const key = root.dataset.tabs;
    const data = root._data || Sollisero.data[key] || [];
    const list = $('.tabs', root);
    const swap = $('.swap', root);
    const big = $('.big', root);
    const panel = $('.panel', root);
    if (!list || !data.length) return;

    const N = data.length;
    let current = -1;
    let timer;
    const uid = `tabs-${key.toLowerCase()}`;
    if (panel) { panel.id ||= `${uid}-panel`; panel.setAttribute('role', 'tabpanel'); }

    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-orientation', 'vertical');
    list.replaceChildren(...data.map((item, i) => {
      const b = el('button', 'tab', `<span class="n">${pad2(i + 1)}</span><span class="t">${item.tab || item.title}</span><span class="a" aria-hidden="true">→</span><span class="prog" aria-hidden="true"></span>`);
      b.type = 'button';
      b.id = `${uid}-${i}`;
      b.setAttribute('role', 'tab');
      if (panel) b.setAttribute('aria-controls', panel.id);
      b.style.setProperty('--dur', `${DURATION}ms`);
      b.addEventListener('click', () => select(i, true));
      b.addEventListener('mouseenter', () => { if (canHover()) select(i, true); });
      b.addEventListener('keydown', (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        const j = e.key === 'Home' ? 0 : e.key === 'End' ? N - 1 : step ? (i + step + N) % N : null;
        if (j == null) return;
        e.preventDefault(); select(j, true); list.children[j].focus();
      });
      return b;
    }));

    const schedule = () => {
      clearTimeout(timer);
      if (!RM) timer = setTimeout(() => { if (!root.classList.contains('paused')) select((current + 1) % N); }, DURATION);
    };

    function select(i, byUser = false) {
      const changed = i !== current;
      current = i;
      const item = data[i];
      [...list.children].forEach((t, j) => {
        t.setAttribute('aria-selected', String(j === i));
        t.tabIndex = j === i ? 0 : -1;
        const prog = $('.prog', t); // restart the progress bar animation
        prog.style.animation = 'none'; void prog.offsetWidth; prog.style.animation = '';
      });
      if (changed) {
        panel?.setAttribute('aria-labelledby', `${uid}-${i}`);
        if (big) big.textContent = pad2(i + 1);
        if (swap) {
          swap.innerHTML = `<span class="k">[ ${pad2(i + 1)} / ${pad2(N)} ]</span><h3>${item.title}</h3><p>${item.text}</p>${item.chips ? `<div class="chips">${item.chips.map((c) => `<span>${c}</span>`).join('')}</div>` : ''}${item.html || ''}`;
          swap.classList.remove('fade-swap'); void swap.offsetWidth; swap.classList.add('fade-swap');
        }
        root.dispatchEvent(new CustomEvent('tabchange', { detail: { i, a: item } }));
      }
      if (byUser) { clearTimeout(timer); root.classList.add('paused'); } else schedule();
    }

    select(0);
    root.classList.remove('paused');
    onVisible(root, (visible) => {
      if (visible && !root.dataset.touched) { root.classList.remove('paused'); schedule(); } else clearTimeout(timer);
    });
    ['pointerdown', 'mouseenter', 'focusin'].forEach((ev) => list.addEventListener(ev, () => { root.dataset.touched = '1'; }));
  });
});
