
Sollisero.onReady(() => {
/* scripts/pages/bim-agent.js */
(() => {
  const { $, $$, RM, el, onVisible } = Sollisero;

  /* ---- 05 · effect calculator ---- */
  const runs = $('#c-runs'), mins = $('#c-min'), rate = $('#c-rate');
  if (runs) {
    const fmt = n => n.toLocaleString('en-US');
    const upd = () => {
      const r = +runs.value, m = +mins.value, h = +rate.value;
      $('#o-runs').textContent = fmt(r); $('#o-min').textContent = m + ' min'; $('#o-rate').textContent = '₽' + fmt(h);
      const hours = r * m / 60, money = hours * h;
      $('#r-h').textContent = '≈ ' + fmt(Math.round(hours)) + ' h';
      $('#r-m').textContent = '≈ ₽' + (money >= 1e6 ? (money / 1e6).toFixed(1) + 'M' : money >= 1e3 ? Math.round(money / 1e3) + 'K' : Math.round(money));
    };
    [runs, mins, rate].forEach(i => i.addEventListener('input', upd)); upd();
  }

  /* ---- 07 · interactive run mock: command panel + isometric model ---- */
  const viewer = $('#viewer'), log = $('#log');
  if (viewer && log) {
    const svg = $('svg', viewer), NS = 'http://www.w3.org/2000/svg';
    const mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.append(e); return e; };
    // isometric helpers (2:1)
    const ox = 209, oy = 150, s = 28;
    const iso = (x, y, z) => [ox + (x - y) * s, oy + (x + y) * s * .5 - z * s];
    const poly = (pts, a, p) => mk('polygon', Object.assign({ points: pts.map(q => q.join(',')).join(' ') }, a), p);
    const box = (x, y, z, w, d, h, cls, fill) => {
      const g = mk('g', { class: 'el ' + (cls || '') }); g.dataset.fill = fill;
      const A = iso(x, y, z + h), B = iso(x + w, y, z + h), C = iso(x + w, y + d, z + h), D = iso(x, y + d, z + h), E = iso(x + w, y, z), F = iso(x + w, y + d, z), G = iso(x, y + d, z);
      poly([A, B, C, D], { fill, class: 'f top' }, g); poly([D, C, F, G], { fill, class: 'f left', opacity: .72 }, g); poly([C, B, E, F], { fill, class: 'f right', opacity: .5 }, g);
      poly([A, B, C, D], { fill: 'none', stroke: 'rgba(255,255,255,.35)', 'stroke-width': .8 }, g);
      return g;
    };
    // ground grid
    const grid = mk('g', { opacity: .35 });
    for (let i = 0; i <= 8; i++) { const a = iso(i, 0, 0), b = iso(i, 8, 0), c = iso(0, i, 0), d = iso(8, i, 0); mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#6c8a93', 'stroke-width': .6 }, grid); mk('line', { x1: c[0], y1: c[1], x2: d[0], y2: d[1], stroke: '#6c8a93', 'stroke-width': .6 }, grid); }
    // slab
    box(0, 0, 0, 8, 8, .25, 'slab', '#2a4c54');
    // columns + walls + beams
    const base = '#6c8a93', els = [];
    [[1, 1], [4, 1], [7, 1], [1, 4], [4, 4], [7, 4], [1, 7], [7, 7]].forEach(([x, y]) => els.push(box(x - .3, y - .3, .25, .6, .6, 2.6, 'col', base)));
    els.push(box(.7, 6.2, .25, 6.6, .4, 2.6, 'wall', '#5d7f88'));
    els.push(box(0.7, 0.7, 2.85, 6.6, .3, .3, 'beam', base)); els.push(box(0.7, 3.7, 2.85, 6.6, .3, .3, 'beam', base)); els.push(box(0.7, .7, 2.85, .3, 6.3, .3, 'beam', base)); els.push(box(3.7, .7, 2.85, .3, 6.3, .3, 'beam', base)); els.push(box(6.7, .7, 2.85, .3, 6.3, .3, 'beam', base));
    // tag labels layer
    const tags = mk('g');
    const tag = (x, y, z, txt, warn) => { const [px, py] = iso(x, y, z); const g = mk('g', { class: 'tagl' }, tags); mk('line', { x1: px, y1: py, x2: px + 18, y2: py - 22, stroke: warn ? '#f5a524' : '#2ec4b6', 'stroke-width': 1 }, g); mk('rect', { x: px + 18, y: py - 36, width: 46, height: 16, rx: 3, fill: warn ? '#f5a524' : '#2ec4b6' }, g); const t = mk('text', { x: px + 41, y: py - 25, 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'JetBrains Mono, monospace', fill: '#06262d', 'font-weight': 600 }, g); t.textContent = txt; return g; };
    const tagList = [[1, 1, 2.85, 'K-01'], [4, 1, 2.85, 'K-02'], [7, 1, 2.85, 'K-03'], [1, 4, 2.85, 'K-04'], [4, 4, 2.85, 'K-05', true], [7, 4, 2.85, 'K-06'], [1, 7, 2.85, 'K-07'], [7, 7, 2.85, 'K-08'], [4, 6.4, 2.85, 'W-01']].map(a => tag(...a));
    // dimension lines layer
    const dims = mk('g', { class: 'tagl' });
    const dim = (p1, p2, txt) => { const a = iso(...p1), b = iso(...p2); mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#9fe3dc', 'stroke-width': 1 }, dims); [a, b].forEach(q => mk('circle', { cx: q[0], cy: q[1], r: 2, fill: '#9fe3dc' }, dims)); const t = mk('text', { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 - 5, 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'JetBrains Mono, monospace', fill: '#9fe3dc' }, dims); t.textContent = txt; };
    dim([1, 8.8, 0], [4, 8.8, 0], '6 000'); dim([4, 8.8, 0], [7, 8.8, 0], '6 000'); dim([8.8, 1, 0], [8.8, 4, 0], '6 000'); dim([8.8, 4, 0], [8.8, 7, 0], '6 000');

    const setFill = (g, c) => $$('.f', g).forEach(f => f.setAttribute('fill', c));
    const reset = () => { els.forEach(g => setFill(g, g.dataset.fill)); tagList.forEach(t => t.classList.remove('show')); dims.classList.remove('show'); $('#pbar').style.width = '0'; };
    const say = (cls, html) => { const m = el('div', 'msg ' + cls, html); log.append(m); while (log.children.length > 7) log.firstChild.remove(); return m; };
    const sleep = ms => new Promise(r => setTimeout(r, RM ? 0 : ms));
    let token = 0;
    const scripts = [
      // 0 · before / after
      async t => { say('u', 'Show the slab plan before the run'); await sleep(600); say('a', 'Level 03: 8 columns, 1 wall, 5 beams. No tags, no dimension lines.'); await sleep(900); say('u', 'Run “Reinforcement tags and dimension lines”'); await sleep(600); const st = say('s run', '<i></i>running · step 1/3 · reading model'); for (let i = 0; i < els.length; i++) { if (t !== token) return; await sleep(140); setFill(els[i], '#2ec4b6'); $('#pbar').style.width = (i + 1) / els.length * 60 + '%'; } st.className = 'msg s ok'; st.innerHTML = '<i></i>14 elements read · 0.8 s'; const s2 = say('s run', '<i></i>step 2/3 · placing tags'); for (let i = 0; i < tagList.length; i++) { if (t !== token) return; await sleep(170); tagList[i].classList.add('show'); $('#pbar').style.width = 60 + (i + 1) / tagList.length * 30 + '%'; } s2.className = 'msg s ok'; s2.innerHTML = '<i></i>9 tags placed'; await sleep(300); dims.classList.add('show'); $('#pbar').style.width = '100%'; say('s ok', '<i></i>step 3/3 · 4 dimension lines · done in 2.6 s'); await sleep(500); say('a', 'After: 9 tags, 4 dimension chains. 1 issue — K-05 has no reinforcement mark. Report → runs/317.'); },
      // 1 · catalogue run
      async t => { say('u', 'Open catalogue → Structural → “Reinforcement tags”'); await sleep(700); say('a', 'Scenario v12 · published by BIM manager · 128 runs this month. Inputs: active model, Level 03.'); await sleep(900); say('u', 'Run'); const st = say('s run', '<i></i>running on Level 03'); for (let i = 0; i < els.length; i++) { if (t !== token) return; await sleep(110); setFill(els[i], '#2ec4b6'); $('#pbar').style.width = (i + 1) / els.length * 70 + '%'; } tagList.forEach(x => x.classList.add('show')); dims.classList.add('show'); $('#pbar').style.width = '100%'; st.className = 'msg s ok'; st.innerHTML = '<i></i>done · 2.4 s · report ready'; await sleep(400); say('a', 'Result is in the model. The engineer checks the plan and adjusts formatting if needed.'); },
      // 2 · logic & control
      async t => { say('u', 'Explain the scenario logic'); await sleep(700); say('a', 'FOR each column → IF reinforcement mark is set → place tag; ELSE → flag issue and continue.'); for (let i = 0; i < 8; i++) { if (t !== token) return; await sleep(260); const warn = i === 4; setFill(els[i], warn ? '#f5a524' : '#2ec4b6'); tagList[i].classList.add('show'); $('#pbar').style.width = (i + 1) / 8 * 100 + '%'; if (warn) say('s run', '<i></i>K-05 · condition false → issue logged, loop continues'); } await sleep(300); say('s ok', '<i></i>loop finished · 8 iterations · 1 issue'); await sleep(400); say('a', 'Execution control: every step is logged, a failed step can stop the run or be skipped by rule.'); },
      // 3 · publish & update
      async t => { say('u', 'Publish v13 for the whole department'); await sleep(700); say('a', 'v13: dimension chains added to grid lines. Pinned users keep v12; “Always latest” users get v13 on next run.'); await sleep(900); say('s run', '<i></i>publishing · notifying 350 engineers'); els.forEach(g => setFill(g, '#2ec4b6')); tagList.forEach(x => x.classList.add('show')); await sleep(900); if (t !== token) return; dims.classList.add('show'); $('#pbar').style.width = '100%'; say('s ok', '<i></i>published · 3 departments · changelog attached'); await sleep(400); say('a', 'Statistics for v13 start from zero: successful runs, failed runs, problem steps.'); },
      // 4 · what to automate first
      async t => { say('u', 'Which of our processes should go first?'); await sleep(800); say('a', 'Start with tasks on a finished model that repeat on every project and need the model to be analysed — not just a script.'); await sleep(900); say('a', 'In the case study: structural working documentation first, then building services, then architecture.'); for (let i = 0; i < els.length; i++) { if (t !== token) return; await sleep(90); setFill(els[i], i < 8 ? '#2ec4b6' : '#9fe3dc'); $('#pbar').style.width = (i + 1) / els.length * 100 + '%'; } await sleep(300); say('s ok', '<i></i>effect calculation → see case study method'); }
    ];
    const items = $$('#agenda li');
    const cmdlines = ['Run “Reinforcement tags and dimension lines”', 'Catalogue → Structural → Run', 'Explain scenario logic', 'Publish v13 to department', 'Which process first?'];
    let cur = -1;
    async function play(i) { const t = ++token; cur = i; items.forEach((li, j) => li.classList.toggle('on', j === i)); $('#cmdline').textContent = cmdlines[i]; $('#runNo').textContent = '#' + (317 + i); log.innerHTML = ''; reset(); await sleep(200); if (t !== token) return; await scripts[i](t); }
    items.forEach((li, i) => { li.addEventListener('click', () => play(i)); li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(i); } }); });
    $('#runBtn').addEventListener('click', () => play(cur < 0 ? 0 : cur));
    let auto; onVisible($('#demo'), v => { if (v && cur < 0) play(0); if (v && !RM) { clearInterval(auto); auto = setInterval(() => { if (!$('#agenda').matches(':hover') && !$('#demoWin').matches(':hover')) play((cur + 1) % scripts.length); }, 14000); } else clearInterval(auto); }, { threshold: .3 });
  }

  /* hero crystal: slight parallax on pointer */
  const cw = $('.crystal-wrap');
  if (cw && !RM) { const g = $('.gem', cw); cw.closest('.hero').addEventListener('pointermove', e => { const r = cw.getBoundingClientRect(); const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height; g.style.translate = `${dx * 14}px ${dy * 14}px`; }); }
})();

/* The effect calculator is a <form> for semantics only — it must never submit. */
document.getElementById('calc')?.addEventListener('submit', (e) => e.preventDefault());

});