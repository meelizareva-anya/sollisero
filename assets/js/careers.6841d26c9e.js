
Sollisero.onReady(() => {
/* scripts/pages/careers.js */
(() => {
  const { $, $$, RM, onVisible } = Sollisero;

  /* 03 · hover-expanding bento (row 1) */
  const row = $('.bento-row.r1');
  if (row) {
    const cards = $$('.bc', row);
    const act = c => cards.forEach(x => x.classList.toggle('on', x === c));
    cards.forEach(c => {
      c.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) act(c); });
      c.addEventListener('focus', () => act(c));
      c.addEventListener('click', e => { if (!e.target.closest('a')) act(c); });
    });
  }

  /* 05 · time-zone ruler */
  const ruler = $('.ruler');
  if (ruler) {
    const NS = 'http://www.w3.org/2000/svg', mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const ticks = $('#ticks', ruler), pins = $('#pins', ruler);
    const X = tz => 24 + (tz + 5) * (1632 / 13);
    for (let tz = -5; tz <= 8; tz++) {
      ticks.append(mk('line', { x1: X(tz), y1: 56, x2: X(tz), y2: 64, stroke: 'rgba(6,11,34,.2)' }));
      const t = mk('text', { x: X(tz), y: 84, 'text-anchor': 'middle' }); t.textContent = tz === 0 ? '±0' : (tz > 0 ? '+' + tz : '−' + Math.abs(tz)); ticks.append(t);
    }
    [['US', -5], ['UK', 0], ['AM · AE', 4], ['UZ', 5], ['HK', 8]].forEach(([l, tz], i) => {
      const x = X(tz), w = l.length * 7.4 + 24;
      pins.append(mk('rect', { class: 'tag', x: x - w / 2, y: 8, width: w, height: 26, rx: 13 }));
      const t = mk('text', { class: 'tagt', x, y: 25, 'text-anchor': 'middle' }); t.textContent = l; pins.append(t);
      pins.append(mk('line', { x1: x, y1: 34, x2: x, y2: 52, stroke: 'rgba(6,11,34,.2)', 'stroke-dasharray': '2 3' }));
      const r = mk('circle', { class: 'ring', cx: x, cy: 60, r: 6 }); r.style.animationDelay = (i * .5) + 's'; pins.append(r);
      const d = mk('circle', { class: 'dot', cx: x, cy: 60, r: 6 }); d.style.animationDelay = (i * .5) + 's'; pins.append(d);
    });
  }
  /* live office clocks */
  const clocks = $$('.clock[data-tz]');
  const tick = () => clocks.forEach(c => { try { c.textContent = 'now ' + new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: c.dataset.tz }).format(new Date()); } catch (e) { } });
  if (clocks.length) { tick(); setInterval(tick, 30000); }

  /* 06 · timeline draw-in */
  const steps = $('#steps');
  steps && onVisible(steps, v => v && steps.classList.add('in'), { threshold: .3 });
})();

});