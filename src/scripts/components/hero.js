/* Hero decorations: word-by-word headline reveal, code-stream texture, interactive dot field. */

Sollisero.component('split-headline', () => {
  const { $, RM, el } = Sollisero;
  const h1 = $('[data-split]');
  if (!h1 || RM) return;
  let i = 0;
  const split = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.TEXT_NODE) return split(child);
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const w = el('span', 'w');
        w.textContent = part;
        w.style.animationDelay = `${0.15 + i++ * 0.06}s`;
        frag.append(w);
      });
      child.replaceWith(frag);
    });
  };
  split(h1);
});

Sollisero.component('texture', () => {
  const { $$, el } = Sollisero;
  const DEFAULT = 'GET /health status=ok 200|POST /orders id=84213 201|PUT /users/829 role=ops 204|GET /catalog items=24 200|POST /auth token=•••• 200|GET /ledger acct=•••3301 200|POST /events batch=48 202|GET /metrics p95=84ms 200';
  $$('.texture').forEach((tex) => {
    const lines = (tex.dataset.lines || DEFAULT).split('|');
    const frag = document.createDocumentFragment();
    for (let row = 0; row < 34; row++) {
      const cells = Array.from({ length: 12 }, (_, j) => lines[(row * 3 + j) % lines.length]);
      const text = `${cells.join('      ')}      `;
      const div = el('div');
      div.textContent = text + text; // doubled so the -50% drift loops seamlessly
      frag.append(div);
    }
    tex.append(frag);
  });
});

Sollisero.component('dot-field', () => {
  const { $$, RM, onVisible } = Sollisero;
  $$('canvas.dots').forEach((canvas) => {
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const GRID = 38, HOVER_R = 140;
    let W = 0, H = 0, pts = [], mx = -999, my = -999, running = false;

    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = 10; y < H; y += GRID) for (let x = 10; x < W; x += GRID) pts.push([x, y]);
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      // Cone falloff from the design: centre at 69%/50%, radius 0.727W, max r 7.85.
      const cx = W * 0.69, cy = H * 0.5, RR = W * 0.727, RMAX = 7.85;
      for (const [x, y] of pts) {
        let r = RMAX * (1 - Math.hypot(x - cx, y - cy) / RR);
        r *= 0.92 + 0.08 * (Math.sin(x * 0.012 + y * 0.008 - t * 0.0012) * 0.5 + 0.5);
        const d = Math.hypot(x - mx, y - my);
        const hov = d < HOVER_R ? 1 - d / HOVER_R : 0;
        r += hov * 1.6;
        if (r < 1) continue;
        ctx.globalAlpha = Math.min(0.4, 0.05 + r * 0.0101 + hov * 0.2);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
    };
    const loop = (t) => { if (!running) return; draw(t); requestAnimationFrame(loop); };

    new ResizeObserver(() => { resize(); draw(0); }).observe(canvas);
    host.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mx = my = -999; });
    if (!RM) onVisible(host, (v) => { running = v; if (v) requestAnimationFrame(loop); }, { threshold: 0 });
  });
});
