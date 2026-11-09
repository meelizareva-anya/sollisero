/* scripts/pages/cash-solutions.data.js */
/* Hardware tabs data (section 04). Tab 01 copy is from Figma; the other panels reuse the
   schematic callout specs shown in the same section. */
Sollisero.data.HW = [
  {tab:'Card acceptance', title:'Chip, tap and swipe', text:'Three card readers in one body: insert at the bottom edge, tap at the top of the screen or swipe along the side.', chips:['EMV','NFC','Magstripe'],
   html:'<div class="spec"><div><small>Chip</small><b>ISO 7816 · 1.8 / 3 / 5 V</b></div><div><small>Contactless</small><b>ISO 14443 A/B · 13.56 MHz</b></div><div><small>Magstripe</small><b>Tracks 1/2/3 · two-way</b></div><div><small>PIN entry</small><b>PIN on glass</b></div></div><span class="locator" aria-hidden="true"><i style="left:8px;top:36px;width:84px;height:150px"></i><i class="hl" style="left:8px;top:10px;width:84px;height:44px"></i><i class="hl" style="left:14px;top:209px;width:72px;height:30px"></i><i class="hl" style="left:99px;top:86px;width:6px;height:135px"></i></span>', k:'Payments'},
  {tab:'Thermal printer', title:'Receipts printed on the spot', text:'A thermal printer sits under the top lid: the paper roll loads from the top and the receipt comes out above the screen. Receipts can also be sent digitally.', chips:['58 mm','80 mm/s','203 dpi'],
   html:'<div class="spec"><div><small>Paper roll</small><b>58 mm · Ø40 · lid opens from the top</b></div><div><small>Print head</small><b>Thermal line · 8 dots/mm</b></div><div><small>Speed</small><b>80 mm/s · 203 dpi</b></div><div><small>Receipt</small><b>Printed or sent</b></div></div><span class="locator" aria-hidden="true"><i style="left:8px;top:36px;width:84px;height:150px"></i><i class="hl" style="left:0;top:0;width:100px;height:22px;border-radius:12px 12px 3px 3px"></i></span>', k:'Printer'},
  {tab:'Scanner and cameras', title:'Barcodes and QR from the top edge', text:'A 2D scan engine on the top side reads 1D/2D barcodes and QR codes; the rear camera with autofocus covers everything else.', chips:['1D/2D','QR','8 MP autofocus'],
   html:'<div class="spec"><div><small>2D barcode scanner</small><b>Top side · 1D/2D · QR</b></div><div><small>Rear camera + scanner</small><b>8 MP autofocus · 2D scan engine</b></div><div><small>Front</small><b>Camera above the screen</b></div><div><small>Use</small><b>Scan items · scan QR to pay</b></div></div><span class="locator" aria-hidden="true"><i style="left:8px;top:36px;width:84px;height:150px"></i><i class="hl" style="left:66px;top:4px;width:28px;height:10px"></i><i class="hl" style="left:14px;top:40px;width:18px;height:18px;border-radius:50%"></i></span>', k:'Scanning'},
  {tab:'Processor and security', title:'A secure processor next to the main board', text:'Keys, PIN and card data live in a separate secure processor under a tamper mesh, next to a quad-core main board.', chips:['Secure processor','Tamper mesh','PIN on glass'],
   html:'<div class="spec"><div><small>Main board</small><b>Quad-core 1.4 GHz · 2 GB + 16 GB</b></div><div><small>Secure processor</small><b>Keys, PIN, card data · tamper mesh</b></div><div><small>Touchscreen</small><b>5.5" HD IPS · PIN on glass</b></div><div><small>Storage</small><b>eMMC · microSD up to 128 GB</b></div></div><span class="locator" aria-hidden="true"><i style="left:8px;top:36px;width:84px;height:150px"></i><i class="hl" style="left:14px;top:70px;width:72px;height:60px"></i><i class="hl" style="left:52px;top:102px;width:30px;height:20px"></i></span>', k:'Security'},
  {tab:'Connectivity', title:'Online in the store and on the road', text:'4G modem with SIM and SAM slots, plus Wi-Fi, Bluetooth and GPS, keep the terminal connected wherever the sale happens.', chips:['4G','Wi-Fi','Bluetooth','GPS'],
   html:'<div class="spec"><div><small>Mobile</small><b>4G modem · SIM</b></div><div><small>Radio</small><b>Wi-Fi · BT · GPS</b></div><div><small>SIM + SAM + microSD</small><b>Under the battery · up to 128 GB</b></div><div><small>Offline</small><b>Offline mode available</b></div></div><span class="locator" aria-hidden="true"><i style="left:8px;top:36px;width:84px;height:150px"></i><i class="hl" style="left:66px;top:70px;width:20px;height:34px"></i><i class="hl" style="left:14px;top:150px;width:72px;height:14px"></i></span>', k:'Network'},
  {tab:'Battery and ports', title:'A full business day on one charge', text:'A 5150 mAh battery covers a full business day; USB-C handles charging and OTG, and side keys control power and volume.', chips:['5150 mAh','USB-C','OTG'],
   html:'<div class="spec"><div><small>Battery</small><b>5150 mAh · 3.7 V · full business day</b></div><div><small>USB-C</small><b>Charging and OTG</b></div><div><small>Side keys</small><b>Power · volume ±</b></div><div><small>Speaker + mic</small><b>Buzzer, speaker, microphone</b></div></div><span class="locator" aria-hidden="true"><i style="left:8px;top:36px;width:84px;height:150px"></i><i class="hl" style="left:8px;top:140px;width:84px;height:60px"></i><i class="hl" style="left:10px;top:226px;width:14px;height:4px"></i></span>', k:'Power'}
];

Sollisero.onReady(() => {
/* scripts/pages/cash-solutions.js */
(() => {
  const {$, $$, RM, onVisible} = Sollisero;
  /* panel label "[ 01 / 06 ]  Payments" */
  const hw = $('[data-tabs="HW"]');
  const relabel = () => { const k = $('.swap .k', hw); if (!k) return; const n = k.textContent.match(/\d+/g); const a = Sollisero.data.HW[+n[0]-1]; k.textContent = `[ ${n[0]} / ${n[1]} ]  ${a.k}`; };
  if (hw) { relabel(); hw.addEventListener('tabchange', relabel); }

  /* formatted count-ups inside mocks */
  const fmt = (v, dec) => v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
  $$('[data-n]').forEach(n => { const t = parseFloat(n.dataset.n), pre = n.dataset.pre || '', dec = +(n.dataset.dec || 0); onVisible(n, v => { if (!v || n.dataset.done) return; n.dataset.done = 1; if (RM) { n.textContent = pre + fmt(t, dec); return; } const t0 = performance.now(), D = 1300; const f = ts => { const k = Math.min(1, (ts - t0) / D), e = 1 - Math.pow(1 - k, 3); n.textContent = pre + fmt(t * e, dec); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); });

  /* bars / sparklines / donuts: add .in when the mock is visible */
  $$('.portal, .uc .win, .mini-portal').forEach(m => onVisible(m, v => { if (!v) return; m.classList.add('in'); $$('.seg', m).forEach(c => { const L = 2 * Math.PI * 30, s = +c.dataset.seg / 100 * L, o = +(c.dataset.off || 0) / 100 * L; c.style.strokeDasharray = `${s} ${L - s}`; c.style.strokeDashoffset = -o; }); }, {threshold: .3}));

  /* QR waiting timer */
  $$('[data-timer]').forEach(t => { let s = 42; setInterval(() => { s = (s + 1) % 60; t.textContent = `0:${String(s).padStart(2, '0')}`; }, 1000); });
})();

});