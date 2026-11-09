(() => {
  const { $, $$, RM, onVisible } = Sollisero;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const type = async (el, text, speed = 18, alive = () => true) => { el.textContent = ''; for (const ch of text) { if (!alive()) return; el.textContent += ch; await wait(speed); } };

  /* ---------- Hero mock: top row Processing → Ready ---------- */
  const heroApp = $('.hero [data-mapp]');
  /* markup rests on "Ready" (= the Figma frame); with motion we replay the processing beat */
  if (heroApp && !RM) { const st = $('[data-top-st]', heroApp); st.textContent = '● Processing'; st.classList.add('p'); setTimeout(() => { st.textContent = '● Ready'; st.classList.remove('p'); $('[data-top]', heroApp).classList.add('sel'); }, 2600); }

  /* ---------- Product demo: meetings list → report (summary generated) ---------- */
  const demo = $('#productDemo');
  if (demo) {
    const app = $('.prod-grid [data-mapp]', demo);
    const list = $('[data-scr="list"]', app), rep = $('[data-scr="report"]', app);
    const top = $('[data-top]', app), topSt = $('[data-top-st]', app);
    const tls = $$('[data-tl]', app), sums = $$('[data-sum] li', app), decs = $$('[data-dec] div', app), tsks = $$('[data-tsk] div', app);
    const gen = $('[data-gen]', app), genT = $('[data-gen-t]', app), pb = $('[data-pb]', app), pt = $('[data-pt]', app);
    const SUM = ['Release moved to the next sprint because of the load test; Orbit informed.', 'Orbit asks for DOCX export before the board pack — owner Anna, by 20 Jun.', 'Q3 forecast confirmed; two deals flagged as at risk, revised forecast to the board.'];
    let run = 0, visible = false;
    const show = (s) => { list.classList.toggle('off', s !== 'list'); rep.classList.toggle('off', s !== 'report'); };
    const resetReport = () => { tls.forEach(t => t.classList.remove('on')); sums.forEach(l => { l.classList.remove('on', 'typing'); l.firstElementChild.textContent = ''; }); decs.concat(tsks).forEach(d => d.classList.remove('on')); gen.classList.remove('done'); genT.textContent = 'Generating report…'; pb.style.width = '0'; pt.textContent = '00:00'; };
    const finishAll = () => { tls.forEach(t => t.classList.add('on')); sums.forEach((l, i) => { l.classList.add('on'); l.firstElementChild.textContent = SUM[i]; }); decs.concat(tsks).forEach(d => d.classList.add('on')); gen.classList.add('done'); genT.textContent = 'Report ready'; pb.style.width = '100%'; pt.textContent = '47:12'; };
    async function cycle() {
      const id = ++run; const alive = () => id === run && visible;
      show('list'); resetReport(); topSt.textContent = '● Processing'; topSt.classList.add('p'); top.classList.remove('sel');
      await wait(2200); if (!alive()) return;
      topSt.textContent = '● Ready'; topSt.classList.remove('p'); top.classList.add('sel');
      await wait(1400); if (!alive()) return;
      show('report');
      await wait(500);
      const times = ['02:14', '19:05', '38:40'];
      for (let i = 0; i < tls.length; i++) { if (!alive()) return; tls[i].classList.add('on'); pt.textContent = times[i]; pb.style.width = [5, 40, 82][i] + '%'; await wait(650); }
      for (let i = 0; i < sums.length; i++) { if (!alive()) return; sums[i].classList.add('on', 'typing'); await type(sums[i].firstElementChild, SUM[i], 14, alive); sums[i].classList.remove('typing'); }
      for (const d of decs) { if (!alive()) return; d.classList.add('on'); await wait(350); }
      for (const t of tsks) { if (!alive()) return; t.classList.add('on'); await wait(350); }
      if (!alive()) return; gen.classList.add('done'); genT.textContent = 'Report ready'; pb.style.width = '100%'; pt.textContent = '47:12';
      await wait(7000); if (!alive()) return; cycle();
    }
    $('[data-back]', app).addEventListener('click', () => { run++; show('list'); });
    top.addEventListener('click', () => { run++; show('report'); finishAll(); });
    $$('[data-rtabs] span', app).forEach(s => s.addEventListener('click', () => { $$('[data-rtabs] span', app).forEach(x => x.classList.remove('on')); s.classList.add('on'); }));

    /* team chat typing + tasks ticking */
    const chatAns = $('[data-chat-ans]', demo), cite = $('[data-cite]', demo), taskRows = $$('[data-tasks] .list > div', demo);
    const CHAT = 'Release moved to the next sprint; DOCX export added as a task for Anna.';
    let side = 0;
    async function sideCycle() { const id = ++side; const alive = () => id === side && visible; chatAns.textContent = ''; cite.classList.remove('on'); taskRows.forEach(r => r.classList.remove('done')); await wait(900); if (!alive()) return; await type(chatAns, CHAT, 16, alive); if (!alive()) return; cite.classList.add('on'); for (const r of taskRows) { await wait(1300); if (!alive()) return; r.classList.add('done'); } await wait(5000); if (alive()) sideCycle(); }

    if (RM) { show('list'); finishAll(); topSt.textContent = '● Ready'; topSt.classList.remove('p'); chatAns.textContent = CHAT; cite.classList.add('on'); }
    else onVisible(demo, v => { visible = v; if (v) { cycle(); sideCycle(); } else { run++; side++; } }, { threshold: .15 });
  }

  /* ---------- Chrome extension mock: speaker rotates, timer runs ---------- */
  const ext = $('[data-ext]');
  if (ext && !RM) {
    const tiles = $$('.tiles div', ext), t = $('[data-ext-t]', ext); let k = 0, sec = 750, iv;
    onVisible(ext, v => { clearInterval(iv); if (v) iv = setInterval(() => { sec++; t.textContent = [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60].map(n => String(n).padStart(2, '0')).join(':'); if (sec % 3 === 0) { tiles.forEach(x => x.classList.remove('talk')); k = (k + 1) % tiles.length; tiles[k].classList.add('talk'); } }, 1000); });
  }
})();
