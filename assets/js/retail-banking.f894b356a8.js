/* scripts/pages/retail-banking.data.js */
/* Advantages tabs (copy from Figma, 6 panels) */
Sollisero.data.ADV = [
  {tab:'Card control', k:'Cards', title:'Full control over cards', text:'Balance, spending limits, freeze, PIN change, issuance and replacement — all available to customers in the app.', chips:['Balance','Limits','Freeze'], html:'<div class="ph-side"><div class="ph" data-screen="card"></div></div>'},
  {tab:'Instant transfers', k:'Payments', title:'Instant transfers in a modern app', text:'Customers send money by phone number, card number and between their own accounts, with templates for repeat transfers.', chips:['Instant','By phone or card number','Other banks'], html:'<div class="ph-side"><div class="ph" data-screen="transfer"></div></div>'},
  {tab:'Scheduled payments', k:'Payments', title:'Bills paid in a couple of taps', text:'Utilities, mobile top-ups, taxes and fines — paid from saved templates or by scanning a QR code.', chips:['Schedule','Payments','Transfers'], html:'<div class="ph-side"><div class="ph" data-screen="bills"></div></div>'},
  {tab:'Spend analytics', k:'Insights', title:'A clear view of spending', text:'Spending by category, analysis of incoming funds and period dashboards help customers see where their money goes.', chips:['Analytics','History','Dashboards and statements'], html:'<div class="ph-side"><div class="ph" data-screen="exp"></div></div>'},
  {tab:'Chatbot support', k:'Support', title:'Support right in the app', text:'In-app chat with the bank and an AI assistant give customers help without leaving the mobile bank.', chips:['Chatbot','Support','App'], html:'<div class="ph-side"><div class="ph" data-screen="chat"></div></div>'},
  {tab:'Personalization', k:'Settings', title:'A bank the customer sets up', text:'Login, password and PIN changes, sign-in method, push notifications and the offices & ATMs map — all configured in the app.', chips:['Settings','Push notifications','Dashboards and statements'], html:'<div class="ph-side"><div class="ph" data-screen="settings"></div></div>'}
];

Sollisero.onReady(() => {
/* scripts/pages/retail-banking.js */
(() => {
  const {$, $$, RM, onVisible} = Sollisero;

  /* ---- phone screen templates ---- */
  const sb = '<div class="sb"><span>9:41</span><span>▮▮▮ ▲ ▮</span></div>';
  const tx = [
    ['T','Tesco','Groceries · Today','−$0.90',''],['U','Uber','Taxi · Today','−$0.15',''],['S','Salary','Income · Yesterday','+$113.30','up'],['W','Waterstones','Books · Yesterday','−$0.42',''],['L','Lidl','Groceries · 8 September','−$6.87',''],['G','Greggs','Cafés & restaurants','−$0.91',''],['B','Boots','Healthcare','−$16.29',''],['E','Enterprise','Transport','+$113.30','up']
  ];
  const li = (a, i) => `<div class="li"><i>${a[0]}</i><div><b>${a[1]}</b><small>${a[2]}</small></div><em class="${a[4]}">${a[3]}</em></div>`;
  const S = {
    home: () => `${sb}<div class="scr dark">
      <div class="hd"><span class="av"></span><div>Good afternoon<br>Alex<small>Checking · Main</small></div><span class="ic"></span></div>
      <div class="bal"><small>Total balance</small><b data-bal>$13,598.12</b><em>▲ $1,487.93 · 14 days</em><span class="pill">All accounts ▾</span></div>
      <div class="search">⌕ e.g., ATMs</div>
      <div class="sec"><div class="t">Transfers<small>All ›</small></div><div class="acts"><div><i></i>Templates</div><div><i class="p"></i>By phone number</div><div><i></i>By card number</div><div><i></i>Scan QR code</div></div></div>
      <div class="sec" data-txlist><div class="t">Accounts<small>$13,598.12 ›</small></div>
        <div class="li"><i class="sq">$</i><div><small>Checking Account ·· 1234</small><b>$10,827.64</b></div><em class="chev">›</em></div>
        <div class="li"><i class="sq">$</i><div><small>New Account ·· 5678</small><b>$2,770.48</b></div><em class="chev">›</em></div>
        <div class="li"><i class="sq" style="background:#e6f6ed;color:#12a150">%</i><div><small>Cashback this month</small><b>$42.16</b></div><em style="color:#2450d6">Redeem</em></div>
      </div></div>`,
    card: () => `${sb}<div class="scr dark">
      <div class="hd"><span>‹</span><div>Card Details</div><span class="ic"></span></div>
      <div class="card"><small>sollisero · Debit</small><span class="chip"></span><div><b>$6,900<small style="text-transform:none;font-size:10px">.78</small></b><small style="text-transform:none;display:block;font-size:7.5px">Available</small></div><div class="row"><span>•••• 3420</span><span style="font-weight:800;font-style:italic">VISA</span></div></div>
      <div class="acts dk"><div><i>+</i>Add money</div><div><i>↗</i>Transfer</div><div><i>▤</i>Wallet</div><div><i>•••</i>More</div></div>
      <div class="sec"><div class="t">Card Actions</div>
        <div class="li"><i class="sq">❄</i><div><b>Freeze</b></div><span class="chev">›</span></div><div class="li"><i class="sq">⊘</i><div><b>Block</b></div><span class="chev">›</span></div><div class="li"><i class="sq">≡</i><div><b>Set Limit</b></div><span class="chev">›</span></div><div class="li"><i class="sq">•••</i><div><b>Change PIN</b></div><span class="chev">›</span></div><div class="li"><i class="sq">↻</i><div><b>Replace card</b></div><span class="chev">›</span></div>
      </div></div>`,
    limits: () => `${sb}<div class="scr dark">
      <div class="hd"><span>‹</span><div>Daily limits</div><span class="ic"></span></div>
      <div class="card" style="min-height:84px"><small>Total daily spending</small><div><b>$10,000<small style="text-transform:none;font-size:10px">.00</small></b><small style="text-transform:none">left of $12,000</small></div><div class="row"><span style="font-size:7.5px">Today's spending: $2,000.00</span><span class="pill" style="background:#fff;color:#2450d6;font-weight:700">Edit</span></div></div>
      <div class="sec"><div class="t">Limits by type<small>Per day</small></div>
        <div class="lim"><div class="row"><b>ATM cash withdrawal</b><span>$500 left</span></div><div class="tr"><i style="width:100%"></i></div><div class="row"><small>$500.00 left</small><small>of $500</small></div></div>
        <div class="lim"><div class="row"><b>Online purchases</b><span>$2,000 left</span></div><div class="tr"><i style="width:40%"></i></div><div class="row"><small>$2,000 left</small><small>of $5,000</small></div></div>
        <div class="lim"><div class="row"><b>International ATM withdrawal</b><span>$500 left</span></div><div class="tr"><i style="width:70%"></i></div><div class="row"><small>$350 left</small><small>of $500</small></div></div>
      </div><div class="btn-p">Save limits</div></div>`,
    hist: () => `${sb}<div class="scr">
      <div class="hd"><div>Transaction History</div><span class="ic" style="background:#eaf0fe"></span></div>
      <div class="tabs2"><span class="on">All</span><span>Expenses</span><span>Income</span></div>
      <div class="sec"><div class="t"><span style="color:#d92d20">−$7,900</span><span style="color:#12a150">+$9,000</span></div><div class="bars"><i style="height:40%"></i><i class="g" style="height:70%"></i><i style="height:30%"></i><i class="g" style="height:55%"></i><i style="height:80%"></i><i class="g" style="height:45%"></i><i style="height:60%"></i><i class="g" style="height:90%"></i><i style="height:35%"></i><i class="g" style="height:65%"></i><i style="height:50%"></i><i class="g" style="height:75%"></i></div></div>
      <div class="tabs2"><span>Transaction Type ▾</span><span>Date Range ▾</span><span>Amount ▾</span></div>
      <div class="sec"><div class="t">Today</div>${tx.slice(0,2).map(li).join('')}<div class="t" style="margin-top:4px">Yesterday</div>${tx.slice(2,4).map(li).join('')}</div></div>`,
    exp: () => `${sb}<div class="scr">
      <div class="hd"><div>Transaction History</div><span class="ic" style="background:#eaf0fe"></span></div>
      <div class="tabs2"><span>All</span><span class="on">Expenses</span><span>Income</span></div>
      <div class="sec"><div class="t"><span>● September</span><small>− $941.60</small></div>
        <div class="don"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30" stroke="#eef1f5" stroke-dasharray="1000 0"/><circle class="seg" cx="40" cy="40" r="30" stroke="#2450d6" data-seg="42"/><circle class="seg" cx="40" cy="40" r="30" stroke="#3ecf8e" data-seg="28" data-off="42"/><circle class="seg" cx="40" cy="40" r="30" stroke="#8b5cf6" data-seg="18" data-off="70"/><circle class="seg" cx="40" cy="40" r="30" stroke="#f5a524" data-seg="12" data-off="88"/></svg><div class="c">Spent<b>$941.60</b></div></div>
        <div class="lg"><span><i style="background:#2450d6"></i>Groceries $394.15</span><span><i style="background:#3ecf8e"></i>Nonprofits $149.26</span><span><i style="background:#8b5cf6"></i>Services $112.53</span><span><i style="background:#f5a524"></i>Entertainment $39.06</span></div></div>
      <div class="sec"><div class="t">Recent</div>${tx.slice(0,2).map(li).join('')}</div></div>`,
    list: () => `${sb}<div class="scr">
      <div class="hd"><div>Transaction History</div><span class="ic" style="background:#eaf0fe"></span></div>
      <div class="tabs2"><span class="on">All</span><span>Expenses</span><span>Income</span></div>
      <div class="tabs2"><span>Type ▾</span><span>Amount ▾</span><span>Card or account ▾</span></div>
      <div class="sec"><div class="t">Today</div>${tx.slice(0,2).map(li).join('')}<div class="t" style="margin-top:4px">Yesterday</div>${tx.slice(4,7).map(li).join('')}<div class="t" style="margin-top:4px">8 September</div>${tx.slice(7).map(li).join('')}</div></div>`,
    chat: () => `${sb}<div class="scr dark">
      <div class="hd"><span>‹</span><div>Support chat<small>Bank assistant · online</small></div><span class="ic"></span></div>
      <div style="display:flex;flex-direction:column;gap:7px;flex:1">
        <div class="msg bot">Hi Alex! How can I help you today?<small>14:02</small></div>
        <div class="msg me">I'm abroad and my card was declined at an ATM.<small>14:03</small></div>
        <div class="msg bot">Your international ATM limit is $500 per day. You have $350 left. Would you like to raise it for today?<small>14:03</small></div>
        <div class="msg me">Yes, please — $800.<small>14:04</small></div>
        <div class="msg bot">Done. Your limit is $800 until midnight. Anything else?<small>14:04</small></div>
        <div class="typing"><i></i><i></i><i></i></div>
      </div>
      <div class="search">Type a message…<span style="margin-left:auto;color:#2450d6;font-weight:700">➤</span></div></div>`,
    settings: () => `${sb}<div class="scr dark">
      <div class="hd"><span class="av"></span><div>Alex Morgan<small>+1 ••• ••• 4578</small></div><span class="ic"></span></div>
      <div class="sec"><div class="t">Security</div><div class="tog"><span>Face ID login</span><i class="on"></i></div><div class="tog"><span>OTP by phone</span><i class="on"></i></div><div class="li"><i class="sq">•••</i><div><b>Change password</b></div><span class="chev">›</span></div><div class="li"><i class="sq">#</i><div><b>Change login</b></div><span class="chev">›</span></div></div>
      <div class="sec"><div class="t">Notifications</div><div class="tog"><span>Card transactions</span><i class="on"></i></div><div class="tog"><span>Incoming transfers</span><i class="on"></i></div><div class="tog"><span>Offers and news</span><i></i></div></div>
      <div class="sec"><div class="t">Offices &amp; ATMs<small>Map ›</small></div><div class="map"></div></div></div>`,
    transfer: () => `${sb}<div class="scr dark">
      <div class="hd"><span>‹</span><div>Transfer<small>By phone number</small></div><span class="ic"></span></div>
      <div class="sec"><div class="t">To</div><div class="li"><i>M</i><div><b>Maria Bell</b><small>+1 ••• ••• 2201 · other bank</small></div><em style="color:#12a150">✓</em></div></div>
      <div class="sec"><div class="t">Amount</div><div class="bal" style="color:#151925"><b>$250.00</b><em style="opacity:.6">From Checking Account · $10,827.64</em></div><div class="tabs2"><span class="on">$50</span><span>$100</span><span>$250</span><span>$500</span></div></div>
      <div class="sec"><div class="t">Templates<small>All ›</small></div><div class="acts"><div><i></i>Rent</div><div><i></i>Mom</div><div><i></i>Gym</div><div><i class="p"></i>New</div></div></div>
      <div class="btn-p">Send $250.00 · instant</div></div>`,
    bills: () => `${sb}<div class="scr dark">
      <div class="hd"><span>‹</span><div>Bills<small>Scheduled payments</small></div><span class="ic"></span></div>
      <div class="card" style="min-height:70px"><small>Next payment · Nov 10</small><div><b>$86.60</b><small style="text-transform:none">Electricity · auto-pay on</small></div></div>
      <div class="sec"><div class="t">Scheduled<small>Edit</small></div>
        <div class="li"><i class="sq">⚡</i><div><b>Electricity</b><small>Monthly · Nov 10</small></div><em>$86.60</em></div>
        <div class="li"><i class="sq">◎</i><div><b>Internet &amp; phone</b><small>Monthly · Nov 12</small></div><em>$45.00</em></div>
        <div class="li"><i class="sq">≈</i><div><b>Water</b><small>Monthly · Nov 15</small></div><em>$29.40</em></div>
        <div class="li"><i class="sq">▤</i><div><b>Mobile top-up</b><small>Weekly · Fri</small></div><em>$10.00</em></div>
        <div class="li"><i class="sq">§</i><div><b>Tax · property</b><small>Once · Dec 1</small></div><em>$312.00</em></div>
      </div>
      <div class="acts"><div><i class="p"></i>Scan QR</div><div><i></i>Templates</div><div><i></i>Fines</div><div><i></i>Taxes</div></div></div>`
  };
  const renderPhones = root => $$('.ph[data-screen]', root).forEach(p => { if (p.dataset.done) return; p.dataset.done = 1; const f = S[p.dataset.screen]; if (f) p.innerHTML = f(); });
  renderPhones(document);
  const animate = m => { m.classList.add('in'); $$('.seg', m).forEach(c => { const L = 2 * Math.PI * 30, s = +c.dataset.seg / 100 * L, o = +(c.dataset.off || 0) / 100 * L; c.style.strokeDasharray = `${s} ${L - s}`; c.style.strokeDashoffset = -o; }); };
  const adv = $('[data-tabs="ADV"]');
  const relabel = () => { const k = $('.swap .k', adv); if (!k) return; const n = k.textContent.match(/\d+/g); k.textContent = `[ ${n[0]} / ${n[1]} ]  ${Sollisero.data.ADV[+n[0]-1].k}`; renderPhones(adv); animate(adv); };
  if (adv) { relabel(); adv.addEventListener('tabchange', relabel); }

  /* ---- animations when visible ---- */
  const fmt = (v, dec) => v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
  $$('[data-n]').forEach(n => { const t = parseFloat(n.dataset.n), pre = n.dataset.pre || '', dec = +(n.dataset.dec || 0); onVisible(n, v => { if (!v || n.dataset.done) return; n.dataset.done = 1; if (RM) { n.textContent = pre + fmt(t, dec); return; } const t0 = performance.now(), D = 1300; const f = ts => { const k = Math.min(1, (ts - t0) / D), e = 1 - Math.pow(1 - k, 3); n.textContent = pre + fmt(t * e, dec); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); });
  $$('.win, .ph-wrap').forEach(m => onVisible(m, v => { if (v) animate(m); }, {threshold: .3}));

  /* ---- hero phone: live transactions ---- */
  const hp = $('#heroPhone');
  if (hp && !RM) {
    const list = $('[data-txlist]', hp), bal = $('[data-bal]', hp);
    if (list && bal) {
      const feed = [['T','Tesco','Groceries · just now','−$0.90',''],['U','Uber','Taxi · just now','−$0.15',''],['S','Salary','Income · just now','+$113.30','up'],['W','Waterstones','Books · just now','−$0.42','']];
      let i = 0, b = 13598.12; $('.t', list).innerHTML = 'Recent<small>All ›</small>';
      const add = () => { const a = feed[i++ % feed.length]; const d = document.createElement('div'); d.innerHTML = li(a); const el = d.firstElementChild; el.classList.add('tx-new'); list.insertBefore(el, list.children[1]); while (list.children.length > 4) list.lastElementChild.remove(); b += parseFloat(a[3].replace(/[^0-9.-]/g, '').replace('−', '-')) * (a[3].startsWith('−') ? -1 : 1); bal.textContent = '$' + fmt(b, 2); };
      let t; onVisible(hp, v => { clearInterval(t); if (v) t = setInterval(add, 3200); }, {threshold: .2});
    }
  }
})();

});