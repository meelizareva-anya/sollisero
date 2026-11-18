/* dspm landing — data for the embedded product UI.
   Loads before dspm.js: defines window.DSPM_CSS (the product stylesheet, injected into
   each embed's shadow root) and window.__dspm (icons, helpers and the screen registry).
   Mirrors the product prototype one to one; edit there first, then re-export. */

/* ===== dspm screen styles, lifted from the product prototype ===== */
window.DSPM_CSS = String.raw`
/* ===================== TOKENS (from Figma variables) ===================== */
:host{
  --page:#f5f7fb; --card:#ffffff; --card-2:#fafbfe;
  --bd:#e6eaf3; --bd-strong:#cdd4e6;
  --tx:#1c2647; --tx2:#67718c; --tx3:#a1a9be; --on-dark:#ffffff;
  --brand:#4a6bdf; --brand-600:#3a58c4; --brand-50:#f1f4fc; --brand-200:#cdd7f5;
  --err:#d2554f; --err-50:#fcf0ef;
  --warn:#b54708; --warn-50:#fdf3e8;
  --ok:#2a8a6b; --ok-50:#e8f6f0;
  --navy-900:#121a36; --navy-700:#2a3560; --sky-300:#b4c5f7;
  --track:#edf0f7;
  --rail:#121a36; --rail-tx:#8e9ab9; --rail-tx-on:#ffffff;
  --shadow:0 1px 2px rgba(18,26,54,.05);
  --shadow-lg:0 18px 40px -22px rgba(18,26,54,.35);
  --r-s:8px; --r:10px; --r-m:12px; --r-l:16px;
}
:host([data-theme="dark"]){
  --page:#060a1c; --card:#0c1230; --card-2:#0a1029;
  --bd:#1c2550; --bd-strong:#2a3566;
  --tx:#e9edf9; --tx2:#a4aecb; --tx3:#828eb2;
  --brand:#4f7bff; --brand-600:#9db4ff; --brand-50:#141c42; --brand-200:#2a3a7a;
  --err:#ff6b6e; --err-50:#361420;
  --warn:#f5a524; --warn-50:#2e1f0a;
  --ok:#3dd68c; --ok-50:#0d2a24;
  --navy-900:#03061a; --navy-700:#1a2450; --sky-300:#9db4ff;
  --track:#1c2550;
  --rail:#03061a; --rail-tx:#6a769e;
  --shadow:0 1px 2px rgba(0,0,0,.4);
  --shadow-lg:0 18px 40px -22px rgba(0,0,0,.8);
}
*,*::before,*::after{box-sizing:border-box}

.app{margin:0;background:var(--page);color:var(--tx);
  font-family:'Onest',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased;
  transition:background .35s ease,color .35s ease}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
input,select,textarea{font:inherit;color:inherit}
svg{display:block}
.mono{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
::selection{background:var(--brand);color:#fff}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-thumb{background:var(--bd-strong);border-radius:9px}
::-webkit-scrollbar-track{background:transparent}

/* ===================== APP SHELL ===================== */
.app{display:flex;height:100vh;overflow:hidden}

/* rail */
.rail{width:72px;flex:none;background:var(--rail);display:flex;flex-direction:column;
  align-items:center;padding:14px 0 18px;gap:4px;position:relative;z-index:5}
.logo{width:40px;height:40px;border-radius:12px;background:linear-gradient(145deg,#2d3c73,#182250);
  display:grid;place-items:center;color:#fff;font-weight:600;font-size:17px;margin-bottom:22px;
  border:1px solid rgba(255,255,255,.1)}
.rail-i{width:56px;padding:9px 0 7px;border-radius:12px;display:flex;flex-direction:column;align-items:center;gap:6px;
  color:var(--rail-tx);position:relative;transition:color .2s}
.rail-i .bx{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;transition:background .22s,color .22s}
.rail-i span{font-size:10px;letter-spacing:.01em}
.rail-i:hover{color:#cfd7ee}
.rail-i:hover .bx{background:rgba(255,255,255,.07)}
.rail-i.on{color:#fff}
.rail-i.on .bx{background:var(--brand);color:#fff}
.rail-i .dot{position:absolute;top:2px;right:7px;min-width:18px;height:16px;padding:0 4px;border-radius:9px;
  background:var(--err);color:#fff;font-size:9.5px;display:grid;place-items:center;font-weight:600}
.rail-sp{margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:12px}
.rail-btn{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;color:var(--rail-tx);
  background:rgba(255,255,255,.05);transition:background .22s,color .22s}
.rail-btn:hover{background:rgba(255,255,255,.12);color:#fff}
.rail-btn.ai{background:var(--navy-700);color:#aebbe8}
.rail-btn.ai:hover{background:var(--brand);color:#fff}
.avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:600;
  background:#243063;color:#dfe5f8;border:1px solid rgba(255,255,255,.14)}

/* sidebar */
.side{width:224px;flex:none;background:var(--card);border-right:1px solid var(--bd);
  display:flex;flex-direction:column;padding:18px 16px 16px;overflow:hidden;transition:background .35s,border-color .35s}
.wordmark{font-size:19px;font-weight:600;letter-spacing:-.02em;margin-bottom:18px;white-space:nowrap}
.wordmark i{font-style:normal;color:var(--tx3);font-weight:400}
.wordmark b{font-weight:500;color:var(--brand)}
.org{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-m);
  border:1px solid var(--bd);margin-bottom:22px;cursor:pointer;transition:border-color .2s,background .2s}
.org:hover{border-color:var(--bd-strong);background:var(--card-2)}
.org .ini{width:28px;height:28px;border-radius:8px;background:var(--brand);color:#fff;display:grid;place-items:center;
  font-size:12px;font-weight:600;flex:none}
.org .nm{min-width:0;flex:1}
.org .nm b{display:block;font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.org .nm small{display:block;font-size:10.5px;color:var(--tx3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sec-k{display:none}
.sec-k b{color:var(--brand);font-weight:400}
.side h2{margin:0;font-size:21px;font-weight:500;letter-spacing:-.02em}
.side .sub{font-size:11.5px;color:var(--tx3);margin:3px 0 18px}
.nav{display:flex;flex-direction:column;gap:2px}
.nav-i{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r);font-size:13.5px;
  color:var(--tx2);transition:background .2s,color .2s;cursor:pointer}
.nav-i svg{opacity:.8;flex:none}
.nav-i:hover{background:var(--brand-50);color:var(--tx)}
.nav-i.on{background:var(--brand-50);color:var(--brand);font-weight:500}
.nav-i.on svg{opacity:1}
.nav-i .ct{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--tx3)}
.nav-i.on .ct{color:var(--brand)}
.side-h{display:flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.11em;
  color:var(--tx3);text-transform:uppercase;margin:26px 0 10px}
.side-h button{margin-left:auto;color:var(--tx3);display:grid;place-items:center}
.side-h button:hover{color:var(--brand)}
.pin{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:var(--r);font-size:13px;color:var(--tx2);cursor:pointer}
.pin:hover{background:var(--brand-50);color:var(--tx)}
.pin i{width:8px;height:8px;border-radius:2px;flex:none}
.posture{margin-top:auto;border:1px solid var(--bd);border-radius:var(--r-l);padding:14px}
.posture .t{display:flex;align-items:center;font-size:12px;color:var(--tx2)}
.posture .t svg{margin-left:auto;color:var(--brand)}
.posture .v{font-size:26px;font-weight:500;letter-spacing:-.02em;margin-top:6px}
.posture .v small{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx3);font-weight:400}
.posture .seg{display:flex;gap:3px;margin:10px 0 8px}
.posture .seg i{height:5px;flex:1;border-radius:2px;background:var(--track)}
.posture .seg i.on{background:var(--brand)}
.posture .d{font-size:11.5px;color:var(--ok)}

/* main */
.main{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}
.top{height:64px;flex:none;display:flex;align-items:center;gap:14px;padding:0 24px;
  border-bottom:1px solid var(--bd);background:var(--card);transition:background .35s,border-color .35s}
.crumbs{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--tx2)}
.crumbs b{color:var(--tx);font-weight:500}
.crumbs svg{opacity:.5}
.search{margin-left:auto;display:flex;align-items:center;gap:9px;width:300px;padding:8px 11px;
  border-radius:var(--r);border:1px solid var(--bd);background:var(--card-2);transition:border-color .2s,box-shadow .2s}
.search:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-50)}
.search input{flex:1;min-width:0;background:none;border:0;outline:none;font-size:13px}
.search input::placeholder{color:var(--tx3)}
.kbd{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--tx3);border:1px solid var(--bd);
  border-radius:5px;padding:2px 5px}
.ticon{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:var(--tx2);
  position:relative;transition:background .2s,color .2s}
.ticon:hover{background:var(--brand-50);color:var(--brand)}
.ticon .ndot{position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--err);
  border:1.5px solid var(--card)}
.copilot{display:flex;align-items:center;gap:8px;padding:8px 15px;border-radius:999px;border:1px solid var(--bd);
  font-size:13px;font-weight:500;transition:all .22s}
.copilot:hover{border-color:var(--brand);color:var(--brand);background:var(--brand-50)}
.view{flex:1;overflow-y:auto;overflow-x:hidden;padding:30px 32px 40px}
.view.plain{padding:0}


/* ===================== PAGE HEAD ===================== */
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;color:var(--brand);
  text-transform:uppercase;margin-bottom:10px}
.phead{display:flex;align-items:flex-start;gap:24px;margin-bottom:26px}
.phead h1{margin:0;font-size:34px;font-weight:500;letter-spacing:-.025em;display:flex;align-items:center;gap:12px}
.phead p{margin:7px 0 0;font-size:14px;color:var(--tx2)}
.phead .acts{margin-left:auto;display:flex;gap:10px;flex:none;padding-top:4px}
.live{display:inline-flex;align-items:center;gap:7px;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:400;
  background:var(--ok-50);color:var(--ok)}
.live i{width:6px;height:6px;border-radius:50%;background:currentColor;animation:bl 2s infinite}
.live.bad{background:var(--err-50);color:var(--err)}
.live.warn{background:var(--warn-50);color:var(--warn)}
@keyframes bl{0%,100%{opacity:1}50%{opacity:.3}}

/* ===================== BUTTONS ===================== */
.btn{display:inline-flex;align-items:center;gap:9px;height:40px;padding:0 16px;border-radius:var(--r);
  font-size:13.5px;font-weight:500;border:1px solid var(--bd);background:var(--card);
  transition:all .2s;white-space:nowrap}
.btn:hover{border-color:var(--bd-strong);background:var(--card-2)}
.btn.pri{background:var(--brand);border-color:var(--brand);color:#fff}
.btn.pri:hover{background:var(--brand-600);border-color:var(--brand-600)}
:host([data-theme="dark"]) .btn.pri:hover{color:#06102e}
.btn.sm{height:34px;padding:0 12px;font-size:12.5px}
.btn.gh{border-color:transparent;background:transparent;color:var(--brand)}
.btn.gh:hover{background:var(--brand-50)}
.lnk{color:var(--brand);font-size:13px;display:inline-flex;align-items:center;gap:6px;transition:gap .2s}
.lnk:hover{gap:10px}

/* ===================== KPI TILES ===================== */
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:22px}
.kpi{background:var(--card);border:1px solid var(--bd);border-radius:var(--r-l);padding:18px 20px 20px;
  cursor:pointer;transition:border-color .22s,box-shadow .22s,transform .22s}
.kpi:hover{border-color:var(--bd-strong);box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.kpi.alert{border-color:var(--err)}
.kpi-h{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--tx);margin-bottom:14px}
.kpi-h .ic{width:30px;height:30px;border-radius:9px;background:var(--brand-50);color:var(--brand);
  display:grid;place-items:center;flex:none}
.kpi.alert .kpi-h .ic{background:var(--err-50);color:var(--err)}
.kpi.ok .kpi-h .ic{background:var(--ok-50);color:var(--ok)}
.kpi-h svg.ch{margin-left:auto;color:var(--tx3)}
.kpi-v{font-size:32px;font-weight:500;letter-spacing:-.03em;line-height:1;display:flex;align-items:baseline;gap:9px}
.kpi-v .u{font-size:14px;color:var(--tx3);font-weight:400}
.kpi-v .de{font-size:11.5px;font-weight:500;padding:3px 7px;border-radius:7px;background:var(--ok-50);color:var(--ok)}
.kpi-v .de.up{background:var(--ok-50);color:var(--ok)}
.kpi-f{font-size:12px;color:var(--tx3);margin-top:12px}
.kpi.alert .kpi-f{color:var(--err)}
.kpi .track{height:4px;border-radius:3px;background:var(--track);margin-top:14px;overflow:hidden}
.kpi .track i{display:block;height:100%;border-radius:3px;background:var(--brand);width:0;
  transition:width 1.1s cubic-bezier(.22,.61,.36,1)}
.kpi.alert .track i{background:var(--err)}
.kpi.warn .track i{background:var(--warn)}
.spark{height:28px;margin-top:6px}

/* ===================== STRIPS ===================== */
.strip{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:var(--r-l);margin-bottom:22px;
  background:var(--brand-50);border:1px solid transparent}
.strip .av{width:34px;height:34px;border-radius:10px;background:var(--brand);color:#fff;display:grid;place-items:center;flex:none}
.strip .tx{min-width:0;flex:1}
.strip .k{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--brand);margin-right:8px}
.strip b{font-weight:500;font-size:14.5px}
.strip small{display:block;font-size:12.5px;color:var(--tx2);margin-top:3px}
.strip .ac{display:flex;align-items:center;gap:10px;flex:none}
.strip.warn{background:var(--warn-50);border-color:rgba(181,71,8,.25)}
.strip.warn .av{background:var(--warn)}
.strip.warn .k{color:var(--warn)}
.strip.steps{flex-direction:column;align-items:stretch;gap:14px}
.steps-h{display:flex;align-items:center;gap:12px}
.steps-h .k{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3)}
.steps-h b{font-size:17px;font-weight:500}
.steps-h .r{margin-left:auto;display:flex;align-items:center;gap:14px}
.steps-g{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.step{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--r-m);background:var(--card);
  border:1px solid var(--bd);cursor:pointer;transition:all .2s}
.step:hover{border-color:var(--brand);transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.step .n{width:26px;height:26px;border-radius:50%;border:1px solid var(--bd-strong);display:grid;place-items:center;
  font-size:11.5px;color:var(--tx2);flex:none}
.step.done .n{background:var(--ok);border-color:var(--ok);color:#fff}
.step .tx b{display:block;font-size:13px;font-weight:500}
.step .tx small{display:block;font-size:11.5px;color:var(--tx3)}
.step svg.go{margin-left:auto;color:var(--tx3);flex:none}

/* ===================== PANEL / TABS / FILTERS ===================== */
.panel{background:var(--card);border:1px solid var(--bd);border-radius:var(--r-l);overflow:hidden}
.tabs{display:flex;gap:26px;padding:0 20px;border-bottom:1px solid var(--bd)}
.tab{position:relative;padding:17px 0;font-size:13.5px;color:var(--tx2);display:flex;align-items:center;gap:8px;
  transition:color .2s;white-space:nowrap}
.tab .n{font-size:11px;padding:1px 7px;border-radius:7px;background:var(--track);color:var(--tx2)}
.tab:hover{color:var(--tx)}
.tab.on{color:var(--tx);font-weight:500}
.tab.on .n{background:var(--brand-50);color:var(--brand)}
.tab.on::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--brand);border-radius:2px}
.tabs .right{margin-left:auto;display:flex;align-items:center}
.fbar{display:flex;align-items:center;gap:12px;padding:16px 20px;flex-wrap:wrap}
.fs{display:flex;align-items:center;gap:9px;width:280px;padding:9px 12px;border-radius:var(--r);
  border:1px solid var(--bd);background:var(--card-2);transition:border-color .2s,box-shadow .2s}
.fs:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-50)}
.fs input{flex:1;min-width:0;background:none;border:0;outline:none;font-size:13px}
.fs input::placeholder{color:var(--tx3)}
.sel{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:var(--r);
  border:1px solid var(--bd);font-size:13px;color:var(--tx2);transition:all .2s;white-space:nowrap}
.sel b{color:var(--tx);font-weight:500}
.sel:hover{border-color:var(--bd-strong)}
.sel.on{border-color:var(--brand);color:var(--brand);background:var(--brand-50)}
.sel.on b{color:var(--brand)}
.fcount{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx3)}
.chk{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--tx2);cursor:pointer}
.box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--bd-strong);display:grid;place-items:center;
  color:#fff;transition:all .2s;flex:none}
.box svg{opacity:0;transition:opacity .15s}
.chk.on .box,.box.on{background:var(--brand);border-color:var(--brand)}
.chk.on .box svg,.box.on svg{opacity:1}
.legend-mini{margin-left:auto;display:flex;gap:16px;font-size:12px;color:var(--tx2)}
.legend-mini i{width:8px;height:8px;border-radius:2px;display:inline-block;margin-right:6px}

/* ===================== TABLE ===================== */
.tb{width:100%;border-collapse:collapse}
.tb th{text-align:left;font-size:12.5px;font-weight:400;color:var(--tx2);padding:12px 20px;
  border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--card-2);white-space:nowrap}
.tb th.r,.tb td.r{text-align:right}
.tb td{padding:13px 20px;border-bottom:1px solid var(--bd);font-size:13.5px;vertical-align:middle}
.tb tr:last-child td{border-bottom:0}
.tb tbody tr{transition:background .16s;cursor:pointer}
.tb tbody tr:hover{background:var(--brand-50)}
.tb tbody tr.sel{background:var(--brand-50)}
.cell{display:flex;align-items:center;gap:12px;min-width:0}
.ico-sq{width:32px;height:32px;border-radius:9px;background:var(--brand-50);color:var(--brand);
  display:grid;place-items:center;flex:none}
.ico-sq.red{background:var(--err-50);color:var(--err)}
.ico-sq.amber{background:var(--warn-50);color:var(--warn)}
.ico-sq.green{background:var(--ok-50);color:var(--ok)}
.t1{font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t1.mono{font-weight:400;font-size:13px}
.t2{font-size:11.5px;color:var(--tx3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t2.mono{font-size:11px}
.muted{color:var(--tx3)}
.warnx{color:var(--err)}
.foot{display:flex;align-items:center;padding:14px 20px;border-top:1px solid var(--bd);font-size:12.5px;color:var(--tx2)}
.foot .pg{margin-left:auto;display:flex;gap:8px}
.pgb{width:34px;height:34px;border-radius:var(--r-s);border:1px solid var(--bd);display:grid;place-items:center;
  color:var(--tx2);transition:all .2s}
.pgb:hover{border-color:var(--brand);color:var(--brand)}
.empty{padding:46px;text-align:center;color:var(--tx3);font-size:13px}

/* chips / badges */
.chip{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:7px;font-size:11.5px;
  background:var(--card-2);border:1px solid var(--bd);white-space:nowrap}
.chip i{width:7px;height:7px;border-radius:2px;flex:none}
.chip.more{color:var(--tx3)}
.tag{display:inline-flex;padding:3px 9px;border-radius:7px;font-size:11px;font-family:'JetBrains Mono',monospace;
  background:var(--card-2);border:1px solid var(--bd);color:var(--tx2);white-space:nowrap}
.pill{display:inline-flex;align-items:center;gap:7px;padding:4px 10px;border-radius:7px;font-size:12px;white-space:nowrap}
.pill i{width:7px;height:7px;border-radius:2px;background:currentColor;flex:none}
.pill.red{background:var(--err-50);color:var(--err)}
.pill.amber{background:var(--warn-50);color:var(--warn)}
.pill.green{background:var(--ok-50);color:var(--ok)}
.pill.blue{background:var(--brand-50);color:var(--brand)}
.pill.grey{background:var(--track);color:var(--tx2)}
.sev{display:flex;align-items:center;gap:9px;white-space:nowrap}
.sev .bars{display:flex;gap:2px}
.sev .bars i{width:7px;height:14px;border-radius:2px;background:var(--track)}
.sev .n{font-family:'JetBrains Mono',monospace;font-size:12.5px;min-width:22px;text-align:right}
.sev .l{font-size:12.5px;color:var(--tx2)}
.sev.critical .bars i:nth-child(-n+4){background:var(--err)}
.sev.high .bars i:nth-child(-n+3){background:#d9622a}
.sev.medium .bars i:nth-child(-n+2){background:var(--brand)}
.sev.low .bars i:nth-child(-n+1){background:var(--ok)}
.ava{width:26px;height:26px;border-radius:50%;background:var(--brand-50);color:var(--brand);display:grid;
  place-items:center;font-size:10px;font-weight:600;flex:none}
.sw{width:38px;height:22px;border-radius:999px;background:var(--bd-strong);position:relative;flex:none;
  transition:background .25s;cursor:pointer}
.sw i{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;
  transition:transform .28s cubic-bezier(.22,.61,.36,1);box-shadow:0 1px 3px rgba(0,0,0,.3)}
.sw.on{background:var(--brand)}
.sw.on i{transform:translateX(16px)}
.bulk{position:sticky;bottom:0;display:flex;align-items:center;gap:10px;margin:0 20px 16px;padding:8px 10px;
  border-radius:var(--r-m);background:var(--navy-900);color:#fff;width:max-content;box-shadow:var(--shadow-lg)}
.bulk .c{font-size:12.5px;padding:0 8px}
.bulk button{padding:7px 12px;border-radius:var(--r-s);background:rgba(255,255,255,.1);font-size:12.5px;transition:background .2s}
.bulk button:hover{background:var(--brand)}


/* ===================== OVERVIEW ===================== */
.cols{display:grid;grid-template-columns:1fr 420px;gap:20px;align-items:start}
.pn-h{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;border-bottom:1px solid var(--bd)}
.pn-h b{font-size:16px;font-weight:500;display:block}
.pn-h small{font-size:12.5px;color:var(--tx2)}
.pn-h .r{margin-left:auto}
.ev{display:flex;align-items:center;gap:13px;padding:13px 20px;border-bottom:1px solid var(--bd);
  cursor:pointer;transition:background .16s}
.ev:hover{background:var(--brand-50)}
.ev .tx{min-width:0;flex:1}
.ev .tx b{display:block;font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ev .tx small{display:block;font-size:11.5px;color:var(--tx3);font-family:'JetBrains Mono',monospace}
.ev .tm{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx3);min-width:46px;text-align:right}
.comp{padding:20px}
.comp .big{font-size:30px;font-weight:500;letter-spacing:-.03em}
.comp .big span{font-size:14px;color:var(--tx2);font-weight:400;margin-left:8px}
.stack{display:flex;height:9px;border-radius:5px;overflow:hidden;margin:16px 0 12px;gap:2px}
.stack i{display:block;height:100%;border-radius:3px;transition:flex-grow 1s cubic-bezier(.22,.61,.36,1)}
.lg{display:flex;gap:18px;font-size:12px;color:var(--tx2);flex-wrap:wrap}
.lg i{width:8px;height:8px;border-radius:2px;display:inline-block;margin-right:6px}
.src{display:flex;align-items:center;gap:13px;padding:14px 0;border-top:1px solid var(--bd)}
.src .tx{flex:1;min-width:0}
.src .tx b{display:block;font-size:13.5px;font-weight:500}
.src .tx small{display:block;font-size:11.5px;color:var(--tx3)}
.src .n{text-align:right}
.src .n b{display:block;font-size:17px;font-weight:500}
.src .n small{font-size:10.5px;color:var(--tx3)}

/* ===================== DATA MAP ===================== */
.mapbar{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--bd);flex-wrap:wrap}
.mapcols{display:grid;grid-template-columns:1fr 1.85fr 1fr;gap:16px;padding:16px;position:relative}
.mc{border-radius:var(--r-m);background:var(--card-2);border:1px solid var(--bd);padding:14px;min-height:560px}
.mc.svc{background:var(--brand-50);border-color:var(--brand-200)}
.mc.store{background:var(--ok-50);border-color:rgba(42,138,107,.25)}
.mc-h{display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:13.5px;font-weight:500}
.mc-h .n{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx3);font-weight:400}
.mc-h .r{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--tx3);font-weight:400}
.mc-in{display:grid;gap:10px}
.mc.svc .mc-in{grid-template-columns:1fr 1fr}
.nd{background:var(--card);border:1px solid var(--bd);border-radius:var(--r-m);padding:11px 13px;cursor:pointer;
  transition:all .2s;position:relative}
.nd:hover{border-color:var(--brand);transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.nd.on{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-50)}
.nd.risk{border-color:var(--err)}
.nd.risk.on{box-shadow:0 0 0 3px var(--err-50)}
.nd .n1{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500}
.nd .n1 .c{color:var(--tx3);font-weight:400;font-size:11.5px}
.nd .n1 .rk{margin-left:auto;font-size:10.5px;padding:2px 7px;border-radius:6px;background:var(--err-50);color:var(--err);
  font-family:'JetBrains Mono',monospace}
.nd .n2{font-size:11.5px;color:var(--tx3);margin-top:5px}
.nd .dots{display:flex;gap:3px;margin-top:9px;flex-wrap:wrap}
.nd .dots i{width:8px;height:8px;border-radius:2px;background:var(--brand)}
.nd .dots i.r{background:var(--err)}
.nd .dots i.g{background:var(--ok)}
.nd.hidden{display:none}
.maplink{position:absolute;inset:0;pointer-events:none;z-index:3;overflow:visible}
.maphint{display:flex;align-items:center;padding:14px 20px;border-top:1px solid var(--bd);font-size:13px;color:var(--tx2)}
.maphint .keys{margin-left:auto;display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--tx3)}
.maphint .keys b{font-family:'JetBrains Mono',monospace;font-size:10.5px;border:1px solid var(--bd);
  border-radius:5px;padding:2px 7px;font-weight:400}

/* ===================== CATEGORY CARDS (data types) ===================== */
.cats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:22px}
.cat{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--bd);
  border-radius:var(--r-l);padding:18px 20px;cursor:pointer;transition:all .22s}
.cat:hover{border-color:var(--brand);transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.cat .tx{flex:1;min-width:0}
.cat .tx b{display:block;font-size:16px;font-weight:500}
.cat .tx small{display:block;font-size:12px;color:var(--tx3);margin:3px 0 9px}
.cat .track{height:4px;border-radius:3px;background:var(--track);overflow:hidden}
.cat .track i{display:block;height:100%;border-radius:3px;width:0;transition:width 1.1s cubic-bezier(.22,.61,.36,1)}

/* ===================== GROUP CARDS ===================== */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.gc{background:var(--card);border:1px solid var(--bd);border-radius:var(--r-l);padding:20px;
  display:flex;flex-direction:column;transition:all .22s}
.gc:hover{border-color:var(--bd-strong);box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.gc-h{display:flex;align-items:center;margin-bottom:16px}
.gc-h .ico-sq{width:34px;height:34px}
.gc-h .n{margin-left:auto;font-size:11.5px;color:var(--tx2);background:var(--card-2);border:1px solid var(--bd);
  border-radius:7px;padding:3px 9px}
.gc h3{margin:0 0 8px;font-size:19px;font-weight:500;letter-spacing:-.02em}
.gc p{margin:0 0 16px;font-size:13px;color:var(--tx2);line-height:1.5}
.gc .own{display:flex;align-items:center;gap:11px;padding:10px 0;border-top:1px solid var(--bd)}
.gc .own .tx b{display:block;font-size:13px;font-weight:500}
.gc .own .tx small{display:block;font-size:11.5px;color:var(--tx3)}
.gc .own .sev{margin-left:auto}
.gc .tags{display:flex;gap:8px;flex-wrap:wrap;padding-bottom:14px}
.gc .ft{margin-top:auto;display:flex;align-items:center;padding-top:14px;border-top:1px solid var(--bd)}
.gc .ft svg.cfg{margin-left:auto;color:var(--tx3)}
.gc.dashed{border-style:dashed;align-items:center;justify-content:center;text-align:center;cursor:pointer}
.gc.dashed .pl{width:36px;height:36px;border-radius:50%;background:var(--brand-50);color:var(--brand);
  display:grid;place-items:center;margin-bottom:12px}
.gc.note{background:var(--brand-50);border-color:transparent}
.gc.note .k{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;
  color:var(--tx3);margin-bottom:12px}

/* ===================== ATTACK PATHS ===================== */
.ap{display:grid;grid-template-columns:1fr 320px;gap:20px;margin-bottom:20px;align-items:start}
.chain{display:flex;align-items:center;gap:7px;margin:18px 0;overflow-x:auto;padding-bottom:4px}
.hop{min-width:92px;flex:none;border:1px solid var(--bd);border-radius:var(--r-m);padding:11px;background:var(--card-2);
  cursor:pointer;transition:all .2s}
.hop:hover{border-color:var(--brand);transform:translateY(-2px)}
.hop.first{background:var(--brand-50);border-color:var(--brand-200)}
.hop.target{background:var(--err-50);border-color:var(--err)}
.hop .hh{display:flex;align-items:center;margin-bottom:8px;color:var(--brand)}
.hop .hh .n{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--tx3)}
.hop.target .hh{color:var(--err)}
.hop .nm{font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.25;word-break:break-all}
.hop .rl{font-size:11px;color:var(--tx3);margin-top:7px}
.chain .arw{color:var(--tx3);flex:none}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
.fact{background:var(--card-2);border:1px solid var(--bd);border-radius:var(--r-m);padding:11px 13px}
.fact .k{font-size:11.5px;color:var(--tx3)}
.fact .v{font-family:'JetBrains Mono',monospace;font-size:12.5px;margin-top:4px}
.rem{background:var(--brand-50);border:1px solid var(--brand-200);border-radius:var(--r-l);padding:20px}
.rem .k{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--tx3)}
.rem h3{margin:10px 0 10px;font-size:19px;font-weight:500;letter-spacing:-.02em}
.rem p{margin:0 0 16px;font-size:13px;color:var(--tx2);line-height:1.5}
.task{display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:var(--r);background:var(--card);
  border:1px solid var(--bd);margin-bottom:9px;font-size:13px;cursor:pointer;transition:all .2s}
.task:hover{border-color:var(--brand)}
.task .rb{width:18px;height:18px;border-radius:50%;border:1.5px solid var(--bd-strong);display:grid;place-items:center;
  flex:none;transition:all .2s}
.task.on .rb{background:var(--brand);border-color:var(--brand);color:#fff}
.task.on span{color:var(--tx3);text-decoration:line-through}
.task .rb svg{opacity:0}
.task.on .rb svg{opacity:1}

/* ===================== COVERAGE / REPORTS / INTEGRATIONS ===================== */
.cov{padding:20px}
.cov-r{display:flex;align-items:center;gap:16px;margin-bottom:14px;font-size:13.5px}
.cov-r .lb{width:140px;flex:none}
.cov-r .tr{flex:1;height:8px;border-radius:4px;background:var(--track);overflow:hidden}
.cov-r .tr i{display:block;height:100%;border-radius:4px;width:0;transition:width 1.1s cubic-bezier(.22,.61,.36,1)}
.cov-r .vl{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--tx2);width:72px;text-align:right}
.rep{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--bd);border-radius:var(--r-l);
  padding:20px;transition:all .22s;cursor:pointer}
.rep:hover{border-color:var(--brand);transform:translateY(-3px);box-shadow:var(--shadow-lg)}
.rep .k{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;
  color:var(--tx3);margin:16px 0 10px}
.rep h3{margin:0 0 9px;font-size:17px;font-weight:500}
.rep p{margin:0 0 16px;font-size:13px;color:var(--tx2);line-height:1.5;flex:1}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.intg{background:var(--card);border:1px solid var(--bd);border-radius:var(--r-l);padding:20px;transition:all .22s}
.intg:hover{border-color:var(--bd-strong);box-shadow:var(--shadow-lg)}
.intg.conn{border-color:var(--ok)}
.intg-h{display:flex;align-items:center;margin-bottom:16px}
.intg-h .lg{width:40px;height:40px;border-radius:var(--r-m);background:var(--brand);color:#fff;display:grid;
  place-items:center;font-weight:600;font-size:15px}
.intg-h .st{margin-left:auto}
.intg h3{margin:0 0 8px;font-size:17px;font-weight:500}
.intg p{margin:0 0 16px;font-size:13px;color:var(--tx2);min-height:38px}
.intg .meta{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx3);padding-top:14px;
  border-top:1px solid var(--bd);margin-bottom:14px}

/* ===================== SIGN IN ===================== */
.signin{display:grid;grid-template-columns:1fr 1fr;height:100vh}
.si-l{background:var(--navy-900);color:#fff;padding:48px 56px;display:flex;flex-direction:column;position:relative;overflow:hidden}
:host([data-theme="light"]) .si-l{background:#121a36}
.si-l .wm{font-size:24px;font-weight:600;letter-spacing:-.02em}
.si-l .wm i{font-style:normal;color:rgba(255,255,255,.45);font-weight:300}
.si-l .mid{margin-top:auto;margin-bottom:auto}
.si-l .k{font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.14em;color:#8e9ab9;margin-bottom:22px}
.si-l h1{margin:0;font-size:46px;font-weight:500;letter-spacing:-.03em;line-height:1.14}
.si-l h1 em{font-style:normal;color:var(--sky-300);display:block;margin-top:10px}
.si-l p{margin:22px 0 32px;font-size:15px;color:#aeb8d4;max-width:500px;line-height:1.55}
.si-demo{border:1px solid rgba(255,255,255,.12);border-radius:var(--r-l);padding:18px;max-width:530px;
  background:rgba(255,255,255,.03)}
.si-demo .rowx{display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:12.5px;color:#c7d0e8}
.si-demo .vio{margin-left:auto;background:var(--err);color:#fff;padding:3px 9px;border-radius:6px;font-size:10.5px}
.si-flow{display:flex;align-items:flex-start;margin-top:22px;position:relative}
.si-flow .nodez{display:flex;flex-direction:column;align-items:center;gap:9px;width:116px;z-index:2}
.si-flow .nodez .bx{width:44px;height:44px;border-radius:var(--r-m);background:rgba(255,255,255,.07);display:grid;
  place-items:center;color:#aeb8d4}
.si-flow .nodez.mid .bx{background:var(--brand);color:#fff}
.si-flow .nodez span{font-family:'JetBrains Mono',monospace;font-size:11px;color:#8e9ab9;text-align:center}
.si-flow .ln{flex:1;height:1px;background:rgba(255,255,255,.18);margin-top:22px}
.si-l .ft{display:flex;gap:28px;font-size:12.5px;color:#7b86a8;font-family:'JetBrains Mono',monospace}
.si-l .ft .r{margin-left:auto;display:flex;gap:24px}
.si-r{background:var(--card);display:flex;flex-direction:column;padding:40px 56px}
.si-r .hd{display:flex;align-items:center;gap:14px;font-size:13px;color:var(--tx2)}
.si-r .hd .r{margin-left:auto;display:flex;align-items:center;gap:12px}
.si-form{margin:auto;width:100%;max-width:400px}
.si-form h2{margin:0 0 8px;font-size:30px;font-weight:500;letter-spacing:-.025em}
.si-form .sb{font-size:14px;color:var(--tx2);margin-bottom:28px}
.fld{margin-bottom:18px}
.fld label{display:block;font-size:13px;font-weight:500;margin-bottom:8px}
.inp{display:flex;align-items:center;gap:10px;height:48px;padding:0 15px;border-radius:var(--r);
  border:1px solid var(--bd);background:var(--card-2);transition:all .2s}
.inp:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-50)}
.inp input{flex:1;min-width:0;background:none;border:0;outline:none;font-size:14px}
.inp input::placeholder{color:var(--tx3)}
.inp .show{font-size:13px;color:var(--brand)}
.si-row{display:flex;align-items:center;margin-bottom:22px}
.si-row .r{margin-left:auto;font-size:13px;color:var(--brand)}
.btn-full{width:100%;height:50px;justify-content:center;font-size:14.5px}
.orx{display:flex;align-items:center;gap:14px;margin:22px 0;color:var(--tx3);font-size:12.5px}
.orx::before,.orx::after{content:'';flex:1;height:1px;background:var(--bd)}
.si-r .fx{text-align:center;font-size:12.5px;color:var(--tx3);display:flex;align-items:center;justify-content:center;gap:8px}

/* ===================== OVERLAYS ===================== */
.scrim{position:fixed;inset:0;background:rgba(6,10,28,.5);backdrop-filter:blur(3px);z-index:60;opacity:0;
  pointer-events:none;transition:opacity .25s}
.scrim.on{opacity:1;pointer-events:auto}
.pal{position:fixed;left:50%;top:14vh;transform:translate(-50%,-14px);width:min(620px,92vw);z-index:61;
  background:var(--card);border:1px solid var(--bd-strong);border-radius:var(--r-l);box-shadow:var(--shadow-lg);
  opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;overflow:hidden}
.pal.on{opacity:1;pointer-events:auto;transform:translate(-50%,0)}
.pal-in{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--bd)}
.pal-in input{flex:1;background:none;border:0;outline:none;font-size:15px}
.pal-l{max-height:340px;overflow-y:auto;padding:8px}
.pal-i{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:var(--r);cursor:pointer;font-size:13.5px}
.pal-i:hover,.pal-i.cur{background:var(--brand-50);color:var(--brand)}
.pal-i .s{margin-left:auto;font-size:11.5px;color:var(--tx3)}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(420px,94vw);background:var(--card);border-left:1px solid var(--bd);
  z-index:61;transform:translateX(100%);transition:transform .35s cubic-bezier(.22,.61,.36,1);display:flex;flex-direction:column}
.drawer.on{transform:none}
.dr-h{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--bd)}
.dr-h b{font-size:16px;font-weight:500}
.dr-h .x{margin-left:auto;color:var(--tx3)}
.dr-b{flex:1;overflow-y:auto;padding:20px}
.msg{padding:14px 16px;border-radius:var(--r-m);background:var(--brand-50);font-size:13.5px;line-height:1.55;margin-bottom:14px}
.msg.me{background:var(--card-2);border:1px solid var(--bd)}
.toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,16px);background:var(--navy-900);color:#fff;
  padding:12px 20px;border-radius:var(--r-m);font-size:13.5px;z-index:70;opacity:0;pointer-events:none;
  transition:all .3s cubic-bezier(.22,.61,.36,1);box-shadow:var(--shadow-lg)}
.toast.on{opacity:1;transform:translate(-50%,0)}

@media (max-width:1280px){
  .cols{grid-template-columns:1fr}
  .grid4,.cats,.grid3{grid-template-columns:1fr 1fr}
  .kpis{grid-template-columns:1fr 1fr}
  .ap{grid-template-columns:1fr}
}
@media (max-width:980px){
  .side{display:none}
  .mapcols{grid-template-columns:1fr}
  .signin{grid-template-columns:1fr}
  .si-l{display:none}
}

:host{display:block;overflow:hidden;position:relative;background:var(--page)}
.stage{width:1440px;height:1024px;transform-origin:0 0;position:absolute;left:0;top:0}
.app{height:1024px;width:1440px}
.view{padding:26px 28px 40px}
:host([data-compact]) .rail,:host([data-compact]) .side{display:none}
.nav-i,.rail-i,.tab,.nd,.kpi,.sw,.task,.step{user-select:none}
/* no nested scrolling inside an embedded screen — the window simply crops */
.main{overflow:hidden}
.view{overflow:hidden !important}
::-webkit-scrollbar{width:0;height:0;display:none}
*{scrollbar-width:none;-ms-overflow-style:none}
`;


/* ==========================================================================
   sollisero / dspm — interactive product prototype
   Screens rebuilt from Figma "DSPM · v3 · All screens" (light + dark).
   ========================================================================== */
(function(){
'use strict';
const $=(s,c)=>(c||document).querySelector(s), $$=(s,c)=>Array.from((c||document).querySelectorAll(s));

/* ---------------------------------------------------------- ICONS */
const P={
 grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 db:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
 shield:'<path d="M12 3l7.5 2.8v5.6c0 4.2-3 7.3-7.5 8.4-4.5-1.1-7.5-4.2-7.5-8.4V5.8L12 3Z"/><path d="M9 12l2.2 2.2L15.4 9.6"/>',
 target:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19"/>',
 map:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="12" r="2.4"/><circle cx="7" cy="18" r="2.4"/><path d="M8.2 7.2 15.8 11M15.9 13.4 8.9 16.6"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
 bell:'<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17.2h.01"/>',
 spark:'<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z"/><path d="M18.5 3.5v3M20 5h-3"/>',
 moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
 chev:'<path d="M9 5l7 7-7 7"/>', chevd:'<path d="M5 9l7 7 7-7"/>', chevl:'<path d="M15 5l-7 7 7 7"/>',
 updown:'<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>',
 download:'<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',
 sliders:'<path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2"/><circle cx="10" cy="16" r="2"/>',
 box:'<path d="M12 3 20 7.2v9.6L12 21l-8-4.2V7.2L12 3Z"/><path d="M4 7.3 12 11.6l8-4.3M12 11.6V21"/>',
 tag:'<path d="M3 11.5V5a2 2 0 0 1 2-2h6.5L21 12.5 12.5 21 3 11.5Z"/><circle cx="7.6" cy="7.6" r="1.4"/>',
 lock:'<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
 warn:'<path d="M12 3.5 21 20H3L12 3.5Z"/><path d="M12 10v4M12 16.8h.01"/>',
 users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.3a3.2 3.2 0 0 1 0 5.4M17.5 14.9c2 .7 3.5 2.5 3.5 5.1"/>',
 plug:'<path d="M9 3v6M15 3v6"/><path d="M6 9h12v2.5a6 6 0 0 1-12 0V9Z"/><path d="M12 17.5V21"/>',
 file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/>',
 sensor:'<circle cx="12" cy="12" r="2.2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 15.5a5 5 0 0 0 0-7"/><path d="M5.8 5.8a9 9 0 0 0 0 12.4M18.2 18.2a9 9 0 0 0 0-12.4"/>',
 layers:'<path d="M12 3 21 8l-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.4l-1.7 1.7"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.6l1.7-1.7"/>',
 check:'<path d="M4 12.5 9 17.5 20 6.5"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 arrow:'<path d="M5 12h13M13 6.5 18.5 12 13 17.5"/>',
 eye:'<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
 key:'<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3.5M15.5 12v2.5"/>',
 at:'<circle cx="12" cy="12" r="3.6"/><path d="M15.6 12v1.8a2.7 2.7 0 0 0 5.4 0V12a9 9 0 1 0-3.6 7.2"/>',
 cloud:'<path d="M6.5 18.5a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 17.8 9a4.8 4.8 0 0 1 .2 9.5H6.5Z"/>',
 dots:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
 refresh:'<path d="M20 11.5A8 8 0 1 0 18 17"/><path d="M20 5v6h-6"/>',
 flow:'<path d="M4 7h5l3 5h8"/><path d="M4 17h5l2-3"/><circle cx="20" cy="12" r="1.6"/><circle cx="4" cy="7" r="1.6"/><circle cx="4" cy="17" r="1.6"/>',
 bolt:'<path d="M13 2.5 5 13h6l-1 8.5L19 11h-6l1-8.5Z"/>'
};
function ico(n,s){ s=s||18; return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+(P[n]||'')+'</svg>'; }
function hydrate(root){ $$('[data-ico]',root||document).forEach(e=>{ if(e.dataset.done)return; e.dataset.done=1;
  e.innerHTML=ico(e.dataset.ico, +(e.dataset.size||18)); }); }
window.__ico=ico;

/* ---------------------------------------------------------- SHARED BITS */
const esc = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const sevClass = n => n>=85?'critical':n>=60?'high':n>=30?'medium':'low';
const sevName  = n => n>=85?'Critical':n>=60?'High':n>=30?'Medium':'Low';
function sev(n,label){ const c=sevClass(n);
  return '<span class="sev '+c+'"><span class="bars"><i></i><i></i><i></i><i></i></span>'+
    '<span class="n">'+n+'</span><span class="l">'+(label===false?'':sevName(n))+'</span></span>'; }
const DOT={pii:'var(--brand)',pci:'var(--warn)',secret:'var(--err)',other:'var(--tx3)'};
function chips(list,extra){
  let h = list.map(c=>'<span class="chip"><i style="background:'+(DOT[c[1]]||DOT.other)+'"></i>'+esc(c[0])+'</span>').join(' ');
  if(extra) h += ' <span class="chip more">+'+extra+'</span>';
  return h;
}
const pill=(t,c)=>'<span class="pill '+c+'"><i></i>'+esc(t)+'</span>';
function kpi(o){
  return '<div class="kpi '+(o.cls||'')+'" data-kpi="'+esc(o.t)+'">'+
   '<div class="kpi-h"><span class="ic">'+ico(o.icon,16)+'</span>'+esc(o.t)+'<span class="ch">'+ico('chev',16)+'</span></div>'+
   '<div class="kpi-v">'+o.v+(o.unit?'<span class="u">'+o.unit+'</span>':'')+(o.delta?'<span class="de up">'+o.delta+'</span>':'')+'</div>'+
   (o.bar!=null?'<div class="track"><i data-w="'+o.bar+'"></i></div>':'')+
   (o.spark?'<svg class="spark" viewBox="0 0 120 28" preserveAspectRatio="none"><polyline points="'+o.spark+'" fill="none" stroke="var(--brand)" stroke-width="1.6"/></svg>':'')+
   '<div class="kpi-f">'+o.f+'</div></div>';
}
function tabsBar(tabs,active,key,right){
  return '<div class="tabs">'+tabs.map(t=>'<button class="tab'+(t[0]===active?' on':'')+'" data-tab="'+key+'" data-v="'+t[0]+'">'+
    esc(t[1])+(t[2]!=null?'<span class="n">'+t[2]+'</span>':'')+'</button>').join('')+
    (right?'<div class="right">'+right+'</div>':'')+'</div>';
}
function fbar(o){
  return '<div class="fbar">'+
    '<label class="fs"><span style="color:var(--tx3)">'+ico('search',15)+'</span>'+
      '<input data-q="'+(o.key||'q')+'" placeholder="'+esc(o.ph||'Search')+'"></label>'+
    (o.sels||[]).map(s=>'<button class="sel" data-sel="'+esc(s[0])+'">'+ico('sliders',15)+esc(s[0])+' <b>'+esc(s[1])+'</b>'+ico('chevd',14)+'</button>').join('')+
    (o.after||'')+
    '<span class="fcount" data-count>'+esc(o.count||'')+'</span></div>';
}
const foot=(txt,pg)=>'<div class="foot">'+esc(txt)+(pg!==false?'<span class="pg"><button class="pgb">'+ico('chevl',15)+'</button><button class="pgb">'+ico('chev',15)+'</button></span>':'')+'</div>';
function head(o){
  return '<div class="phead"><div>'+
   '<h1>'+esc(o.t)+(o.live?'<span class="live '+(o.liveCls||'')+'"><i></i>'+esc(o.live)+'</span>':'')+'</h1>'+
   '<p>'+esc(o.p)+'</p></div><div class="acts">'+(o.acts||'')+'</div></div>';
}
const btn=(t,i,cls)=>'<button class="btn '+(cls||'')+'">'+(i?ico(i,16):'')+esc(t)+'</button>';

window.__dspm={$,$$,ico,hydrate,esc,sev,chips,pill,kpi,tabsBar,fbar,foot,head,btn,sevClass,sevName};
})();


/* ======================= NAV MODEL + SCREENS 01–04 ======================= */
(function(){
const D=window.__dspm, {ico,esc,sev,chips,pill,kpi,tabsBar,fbar,foot,head,btn}=D;
window.SCREENS={}; 

window.SECTIONS={
 overview:{rail:'Overview',icon:'grid',k:'[ 01 ]  WORKSPACE',title:'Workspace',sub:'Northstar · production',
   crumb:'Workspace',
   items:[['overview','Overview','grid'],['datamap','Data map','map',56]],
   extra:'<div class="side-h">Pinned<button>'+ico('plus',15)+'</button></div>'+
     '<div class="pin"><i style="background:var(--brand)"></i>Payments perimeter</div>'+
     '<div class="pin"><i style="background:var(--warn)"></i>EU customer data</div>'},
 inventory:{rail:'Inventory',icon:'db',k:'[ 02 ]  DATA',title:'Inventory',sub:'1,189 assets across 5 views',
   crumb:'Inventory',
   items:[['services','Services','box',18],['api','API endpoints','link',778],['stores','Data stores','db',15],
          ['types','Data types','tag',28],['groups','Resource groups','layers',3]],
   extra:'<div class="side-h">Saved views<button>'+ico('plus',15)+'</button></div>'+
     '<div class="pin"><i style="background:var(--err)"></i>External · no TLS</div>'+
     '<div class="pin"><i style="background:var(--warn)"></i>PCI in transit</div>'+
     '<div class="pin"><i style="background:var(--brand)"></i>Owned by Payments</div>'},
 protection:{rail:'Protection',icon:'shield',badge:32,k:'[ 03 ]  PROTECTION',title:'Protection',
   sub:'32 open events · 4 policies',crumb:'Protection',
   items:[['events','Events','warn',32],['policies','Policies','shield',4],['attack','Attack paths','flow',374],
          ['llm','LLM gateway','spark',11]],
   extra:'<div class="side-h">Saved views<button>'+ico('plus',15)+'</button></div>'+
     '<div class="pin"><i style="background:var(--err)"></i>Critical · unassigned</div>'+
     '<div class="pin"><i style="background:var(--warn)"></i>PCI violations</div>'+
     '<div class="pin"><i style="background:var(--brand)"></i>My queue</div>'},
 manage:{rail:'Manage',icon:'target',k:'[ 04 ]  MANAGEMENT',title:'Management',sub:'Sensors, access and reporting',
   crumb:'Management',
   items:[['sensors','Sensors','sensor',3],['integrations','Integrations','plug',4],['reports','Reports','file',4],
          ['team','Team','users',5]]}
};

/* ---------------------------------------------------------- 01 · OVERVIEW */
const EVENTS=[
 ['Card numbers sent over plaintext HTTP','checkout-api → payments_ledger',94,'12 min','#2811','checkout-api','New','Unassigned','Nov 6 · 09:41'],
 ['Public bucket exposes customer PII','s3://exports-eu · 2,140 objects',94,'1 h','#2810','s3://exports-eu','Investigating','Maya Chen','Nov 6 · 08:12'],
 ['Secret detected in application logs','auth-service · cloud access key',72,'3 h','#2809','auth-service','Investigating','Liam Ortiz','Nov 5 · 22:30'],
 ['Unusual export volume','reporting-worker · 4.2 GB in 10 min',72,'5 h','#2808','reporting-worker','New','Unassigned','Nov 5 · 18:04'],
 ['New data type detected in storage','customers_db · Passport number',72,'1 d','#2807','customers_db','New','Unassigned','Oct 27 · 11:20'],
 ['New data type detected in storage','audit_log · API key',48,'2 d','#2806','audit_log','New','Sara Kim','Oct 27 · 10:58'],
 ['Access from a new region','payments_ledger · 3 sessions',48,'2 d','#2805','payments_ledger','Resolved','Alex Morgan','Oct 26 · 16:40'],
 ['Stale service account with read access','analytics_wh · 90 days idle',15,'3 d','#2804','analytics_wh','Resolved','Alex Morgan','Oct 26 · 09:15']
];
window.EVENTS=EVENTS;

SCREENS.overview={sec:'overview',name:'Overview',render(){
 return head({k:'[ 01 ]  Data security',t:'Security overview',live:'Live monitoring',
   p:'Sensitive data, priority events and the state of your infrastructure.',
   acts:btn('Last 7 days','file')+btn('Explore data','filter','pri')})+

 '<div class="strip steps"><div class="steps-h"><span class="k">First steps · 1 of 3 done</span>'+
   '<b>From the first resource to a clear risk</b>'+
   '<span class="r"><a class="lnk">'+ico('arrow',15)+'Show me how</a><button class="ticon" data-dismiss>'+ico('x',16)+'</button></span></div>'+
   '<div class="steps-g">'+
   '<div class="step done"><span class="n">'+ico('check',14)+'</span><div class="tx"><b>Explore sensitive data</b><small>Open the customer-exports card</small></div>'+ico('arrow',15)+'</div>'+
   '<div class="step" data-go="datamap"><span class="n">2</span><div class="tx"><b>Trace links on the map</b><small>Select a resource, explore neighbours</small></div>'+ico('arrow',15)+'</div>'+
   '<div class="step" data-go="events"><span class="n">3</span><div class="tx"><b>Review the first event</b><small>See the cause and affected data</small></div>'+ico('arrow',15)+'</div>'+
   '</div></div>'+

 '<div class="kpis">'+
  kpi({t:'Data sources',icon:'db',v:'33',delta:'+3',f:'15 data stores · 18 services'})+
  kpi({t:'Sensitive fields',icon:'tag',v:'4,132',bar:72,f:'in 12 data stores and 2 services'})+
  kpi({t:'Need attention',icon:'warn',v:'7',bar:44,cls:'alert',f:'Critical 2 · High 5'})+
  kpi({t:'Sensors online',icon:'sensor',v:'1',unit:'/ 3',bar:33,cls:'warn',f:'<span style="color:var(--warn)">No signal from 2 sensors</span>'})+
 '</div>'+

 '<div class="cols"><div class="panel">'+
   '<div class="pn-h"><div><b>Priority events</b><small>Start with what affects security most.</small></div>'+
     '<a class="lnk r" data-go="events">All events '+ico('arrow',14)+'</a></div>'+
   EVENTS.slice(0,5).map(e=>'<div class="ev" data-go="events"><span class="ico-sq '+(e[2]>=85?'red':'')+'">'+ico('warn',16)+'</span>'+
     '<div class="tx"><b>'+esc(e[0])+'</b><small>'+esc(e[1])+'</small></div>'+sev(e[2])+'<span class="tm">'+esc(e[3])+'</span></div>').join('')+
   '<div class="foot">Ranked by severity<span class="pg" style="font-family:\'JetBrains Mono\',monospace;font-size:11.5px;color:var(--tx3)">Updated just now</span></div>'+
 '</div>'+

 '<div class="panel comp"><div style="display:flex;align-items:flex-start"><div><b style="font-size:16px;font-weight:500">What we found</b>'+
   '<div style="font-size:12.5px;color:var(--tx2)">Composition of sensitive data</div></div>'+
   '<span style="margin-left:auto;color:var(--tx3)">'+ico('tag',18)+'</span></div>'+
   '<div class="big" style="margin-top:18px">4,132<span>sensitive fields</span></div>'+
   '<div class="stack"><i style="flex:81;background:var(--brand)"></i><i style="flex:11;background:var(--warn)"></i><i style="flex:8;background:var(--err)"></i></div>'+
   '<div class="lg"><span><i style="background:var(--brand)"></i>PII 81%</span><span><i style="background:var(--warn)"></i>PCI 11%</span><span><i style="background:var(--err)"></i>Secrets 8%</span></div>'+
   [['SQL databases','PostgreSQL · MySQL',14,'db'],['Object storage','S3 · GCS',3,'cloud'],
    ['Documents & streams','Kafka',1,'sensor'],['SaaS apps','Not connected',0,'layers']]
    .map(s=>'<div class="src"><span class="ico-sq">'+ico(s[3],16)+'</span><div class="tx"><b>'+s[0]+'</b><small>'+s[1]+'</small></div>'+
      '<div class="n"><b'+(s[2]===0?' class="muted"':'')+'>'+s[2]+'</b><small>sources</small></div></div>').join('')+
 '</div></div>';
}};

/* ---------------------------------------------------------- 02 · DATA MAP */
const MAP={
 ext:[['internet','internet',1,'Public ingress · 4 connections',0,[],['checkout-api','auth-service']],
      ['payment-provider','payment-provider',1,'Partner API · 2 connections',0,['pci'],['payments-core']],
      ['partner-sftp','partner-sftp',1,'File drop · 1 connection',1,['pii'],['crm-sync']]],
 svc:[['checkout-api','checkout-api',11,'payments · 4 connections',2,['pci'],['postgresql','payments-core']],
      ['payments-core','payments-core',8,'payments · 3 connections',0,['pci'],['postgresql','kafka']],
      ['user-profile','user-profile',5,'identity · 3 connections',0,['pii'],['postgresql','kafka']],
      ['crm-sync','crm-sync',5,'crm · 2 connections',1,['pii','pci'],['postgresql','kafka']],
      ['reporting-worker','reporting-worker',3,'analytics · 2 connections',1,['pii'],['postgresql']],
      ['billing-events','billing-events',2,'payments · 3 connections',0,['pci'],['kafka']],
      ['auth-service','auth-service',2,'identity · 5 connections',0,['pii'],['postgresql']],
      ['notification-svc','notification-svc',1,'platform · 1 connection',0,['pii'],['kafka']],
      ['search-indexer','search-indexer',1,'platform · 0 connections',0,[],[]]],
 db:[['postgresql','PostgreSQL',14,'6 clusters · 9 at risk',9,['pci','pii'],[]],
     ['kafka','Kafka',1,'events-bus · 0 connections',0,['pii'],[]]]
};
window.MAP=MAP;
function node(n,col){
  const dots=Array.from({length:Math.min(n[2],14)},(_,i)=>'<i class="'+(i<n[4]?'r':col==='db'?'g':'')+'"></i>').join('');
  return '<div class="nd'+(n[4]?' risk':'')+'" data-node="'+n[0]+'" data-tags="'+n[5].join(' ')+'" data-risk="'+n[4]+'">'+
   '<div class="n1">'+esc(n[1])+'<span class="c">'+n[2]+'</span>'+
   (n[4]?'<span class="rk">■ '+n[4]+' risk'+(n[4]>1?'s':'')+'</span>':'')+'</div>'+
   '<div class="n2">'+esc(n[3])+'</div>'+(n[2]?'<div class="dots">'+dots+'</div>':'')+'</div>';
}
SCREENS.datamap={sec:'overview',name:'Data map',render(){
 return head({k:'[ 01 ]  Topology',t:'Data map',p:'From the entry point to the data store — follow the path of sensitive data.',
   acts:btn('Resource groups','layers')+btn('Share view','arrow','pri')})+
 '<div class="strip"><span class="av">'+ico('sensor',17)+'</span><div class="tx">'+
   '<span class="k">Scanning</span><b id="scanTxt">Discovering your infrastructure — the first full map takes up to 7 days</b>'+
   '<small id="scanSub">56 of ~80 expected nodes found · 3 sensors reporting · last update 4 min ago</small></div>'+
   '<div class="ac">'+btn('Sensor status','arrow')+'</div></div>'+
 '<div class="panel">'+
  '<div class="mapbar">'+
   '<label class="fs"><span style="color:var(--tx3)">'+ico('search',15)+'</span><input data-q="map" placeholder="Node, data or cluster"></label>'+
   '<button class="sel" data-sel="Group">Group <b>Namespace</b>'+ico('chevd',14)+'</button>'+
   '<button class="sel" data-sel="Region">Region <b>All</b>'+ico('chevd',14)+'</button>'+
   '<button class="sel" data-sel="Data">Data <b>Any</b>'+ico('chevd',14)+'</button>'+
   '<label class="chk" data-risk-only><span class="box">'+ico('check',12)+'</span>High risk only</label>'+
   '<span class="legend-mini"><span><i style="background:var(--brand)"></i>Service</span>'+
     '<span><i style="background:var(--ok)"></i>Store</span><span><i style="background:var(--err)"></i>Risk</span></span>'+
  '</div>'+
  '<div class="mapcols" id="mapCols"><svg class="maplink" id="mapLink"></svg>'+
   '<div class="mc"><div class="mc-h">External<span class="n">3</span><span class="r">entry points</span></div>'+
     '<div class="mc-in">'+MAP.ext.map(n=>node(n,'ext')).join('')+'</div></div>'+
   '<div class="mc svc"><div class="mc-h">Services<span class="n">38</span><span class="r">by namespace</span></div>'+
     '<div class="mc-in">'+MAP.svc.map(n=>node(n,'svc')).join('')+'</div></div>'+
   '<div class="mc store"><div class="mc-h">Data stores<span class="n">15</span><span class="r">by engine</span></div>'+
     '<div class="mc-in">'+MAP.db.map(n=>node(n,'db')).join('')+'</div></div>'+
  '</div>'+
  '<div class="maphint"><span id="mapHint">Select a node to see its data and connections</span>'+
   '<span class="keys"><b>Tab</b> groups <b>← →</b> nodes <b>↵</b> open</span></div>'+
 '</div>';
}};

/* ---------------------------------------------------------- 03 · SERVICES */
const SERVICES=[
 ['checkout-api','payments · 4 pods','Payments',[['Card number','pci'],['Email','pii']],2,388,88],
 ['user-profile','identity · 3 pods','Identity',[['Full name','pii'],['Email','pii']],3,214,71],
 ['payments-core','payments · 6 pods','Payments',[['IBAN','pci']],1,96,68],
 ['crm-sync','crm · 2 pods','Unassigned',[['Address','pii']],2,41,64],
 ['auth-service','identity · 3 pods','Identity',[['Access token','secret']],0,22,42],
 ['reporting-worker','analytics · 1 pod','Data',[['Card number','pci']],0,8,40],
 ['search-indexer','platform · 1 pod','Platform',[],0,0,8]
];
SCREENS.services={sec:'inventory',name:'Services',render(){
 return head({k:'[ 02 ]  Inventory',t:'Services',p:'Applications, the data they handle and their links to infrastructure.',
   acts:btn('Export','download')+btn('Open on map','filter','pri')})+
 '<div class="kpis">'+
  kpi({t:'Services discovered',icon:'box',v:'18',delta:'+2',f:'17 internal · 1 external'})+
  kpi({t:'With sensitive data',icon:'tag',v:'7',bar:39,f:'Personal, payment and secrets'})+
  kpi({t:'High access risk',icon:'warn',v:'4',cls:'alert',f:'Score above 60'})+
  kpi({t:'Observation',icon:'sensor',v:'7',unit:'days',f:'Last update Oct 28 · 04:59'})+
 '</div>'+
 '<div class="panel">'+tabsBar([['internal','Internal',17],['external','External',1]],'internal','svcTab')+
  fbar({ph:'Find a service or team',sels:[['Data type','Any'],['Team','Any']],count:'17 of 17'})+
  '<table class="tb"><thead><tr><th>Service</th><th>Team</th><th>Data</th><th class="r">Endpoints</th><th>Access risk</th><th></th></tr></thead>'+
  '<tbody data-rows="services">'+SERVICES.map(s=>'<tr data-f="'+esc(s[0]+' '+s[2]).toLowerCase()+'">'+
    '<td><div class="cell"><span class="ico-sq">'+ico('box',16)+'</span><div style="min-width:0"><div class="t1 mono">'+esc(s[0])+'</div><div class="t2">'+esc(s[1])+'</div></div></div></td>'+
    '<td'+(s[2]==='Unassigned'?' class="warnx"':'')+'>'+esc(s[2])+'</td>'+
    '<td>'+(s[3].length?chips(s[3],s[4]||null):'<span class="muted">None found</span>')+'</td>'+
    '<td class="r mono">'+s[5]+'</td><td>'+sev(s[6])+'</td>'+
    '<td class="r"><a class="lnk">Open '+ico('arrow',14)+'</a></td></tr>').join('')+'</tbody></table>'+
  foot('Showing 1–7 of 17')+'</div>';
}};

/* ---------------------------------------------------------- 04 · API ENDPOINTS */
const EPS=[
 ['POST','/api/v2/payments/authorize','HTTP/2 · external','checkout-api','Not enforced','bad',[['Card number','pci']],3,96,'48.2k'],
 ['GET','/internal/export/transactions','gRPC · internal','reporting-worker','Not enforced','bad',[['IBAN','pci']],4,91,'1.1k'],
 ['PUT','/api/v2/customers/{id}/address','HTTP/1.1 · external','crm-sync','Not enforced','bad',[['Address','pii']],2,78,'6.4k'],
 ['GET','/api/v2/users/{id}/profile','HTTP/1.1 · external','user-profile','TLS 1.2','amber',[['Full name','pii']],3,72,'31.7k'],
 ['POST','/api/v1/auth/token','HTTP/2 · external','auth-service','TLS 1.3','ok',[['Access token','secret']],1,66,'22.9k'],
 ['POST','/api/v1/webhooks/payments','HTTPS · webhook','billing-events','TLS 1.3','ok',[['Signing secret','secret']],0,44,'820']
];
SCREENS.api={sec:'inventory',name:'API endpoints',render(){
 return head({k:'[ 02 ]  Inventory',t:'API endpoints',live:'Live monitoring',
   p:'Data in transit between services — protocols, encryption and payload content.',
   acts:btn('Export','download')+btn('Create policy','plus','pri')})+
 '<div class="kpis">'+
  kpi({t:'Endpoints',icon:'link',v:'778',delta:'↗ +24',f:'vs last week',spark:'0,22 14,19 28,20 42,15 56,16 70,11 84,12 98,6 112,4 120,3'})+
  kpi({t:'Requests · 24h',icon:'flow',v:'1.24M',delta:'↗ +8.1%',f:'across 41 services',spark:'0,20 16,21 32,14 48,17 64,9 80,12 96,7 112,9 120,6'})+
  kpi({t:'With sensitive data',icon:'tag',v:'380',bar:49,f:'49% · PII, PCI, Secrets'})+
  kpi({t:'Without TLS',icon:'lock',v:'214',bar:28,cls:'alert',f:'<a class="lnk">Needs review '+ico('arrow',13)+'</a>'})+
 '</div>'+
 '<div class="strip"><span class="av">'+ico('spark',17)+'</span><div class="tx">'+
   '<span class="k">Copilot insight</span><b>3 payment endpoints send card numbers over plaintext HTTP</b>'+
   '<small>checkout-api, reporting-worker and crm-sync · first seen 12 min ago · PCI DSS 4.0 req. 4.2</small></div>'+
   '<div class="ac"><button class="btn gh" data-dismiss>'+ico('x',15)+'Dismiss</button>'+btn('Review endpoints','arrow')+'</div></div>'+
 '<div class="panel">'+
  tabsBar([['all','All endpoints',778],['ext','External',112],['int','Internal',666],['iss','With issues',214]],'all','epTab',
    '<button class="sel" style="border:0">Last 24 hours'+ico('chevd',14)+'</button>')+
  fbar({ph:'Search path, service, data type',sels:[['Protocol','Any'],['Data type','Any']],
    after:'<button class="sel on">Risk ≥ High '+ico('x',13)+'</button>',count:'214 results'})+
  '<table class="tb"><thead><tr><th style="width:44px"><span class="box" data-all>'+ico('check',12)+'</span></th>'+
   '<th>Endpoint</th><th>Service</th><th>Encryption</th><th>Sensitive data</th><th>Risk</th><th class="r">Req · 24h</th><th></th></tr></thead>'+
  '<tbody data-rows="api">'+EPS.map((e,i)=>'<tr data-f="'+esc(e[1]+' '+e[3]).toLowerCase()+'"'+(i<2?' class="sel"':'')+'>'+
    '<td><span class="box'+(i<2?' on':'')+'" data-row-chk>'+ico('check',12)+'</span></td>'+
    '<td><div class="cell"><span class="tag" style="min-width:46px;justify-content:center">'+e[0]+'</span>'+
      '<div style="min-width:0"><div class="t1 mono" style="max-width:230px">'+esc(e[1])+'</div><div class="t2">'+esc(e[2])+'</div></div></div></td>'+
    '<td class="mono" style="color:var(--brand);font-size:12.5px">'+esc(e[3])+'</td>'+
    '<td>'+pill(e[4],e[5]==='bad'?'red':e[5]==='amber'?'amber':'green')+'</td>'+
    '<td>'+chips(e[6],e[7])+'</td><td>'+sev(e[8])+'</td><td class="r mono">'+e[9]+'</td>'+
    '<td class="r" style="color:var(--tx3)">'+ico('chev',16)+'</td></tr>').join('')+'</tbody></table>'+
  '<div class="bulk" id="bulkBar"><span class="c"><b data-bulk-n>2</b> selected</span>'+
    '<button data-act="Enforce TLS">Enforce TLS</button><button data-act="Assign owner">Assign owner</button>'+
    '<button data-act="Create ticket">Create ticket</button></div>'+
  foot('1–6 of 214')+'</div>';
}};
})();


/* ======================= SCREENS 05–09 ======================= */
(function(){
const D=window.__dspm, {ico,esc,sev,chips,pill,kpi,tabsBar,fbar,foot,head,btn}=D;
const SCREENS=window.SCREENS;

/* ---------------------------------------------------------- 05 · DATA STORES */
const STORES=[
 ['customers_db','PostgreSQL 15 · eu-west-1','High','red',[['Email','pii'],['Phone','pii']],5,85,110],
 ['payments_ledger','PostgreSQL 15 · eu-west-1','High','red',[['Card number','pci'],['IBAN','pci']],2,82,78],
 ['orders_prod','PostgreSQL 14 · eu-west-1','High','red',[['Address','pii'],['Email','pii']],3,73,116],
 ['audit_log','PostgreSQL 15 · eu-central-1','High','red',[['Username','pii'],['API key','secret']],1,72,93],
 ['crm_contacts','PostgreSQL 14 · us-east-1','Medium','amber',[['Full name','pii']],2,66,104],
 ['analytics_wh','PostgreSQL 15 · eu-west-1','Medium','amber',[['Birth date','pii']],1,48,212],
 ['events-bus','Kafka 3.6 · eu-west-1','Low','green',[['Email','pii']],0,18,25]
];
SCREENS.stores={sec:'inventory',name:'Data stores',render(){
 return head({k:'[ 02 ]  Data catalog',t:'Data stores',p:'Sensitive data, access and scan results in one place.',
   acts:btn('Export','download')+btn('Connect store','plus','pri')})+
 '<div class="kpis">'+
  kpi({t:'Data stores',icon:'db',v:'15',f:'14 SQL · 1 Kafka'})+
  kpi({t:'With sensitive data',icon:'tag',v:'12',bar:80,f:'80% of connected stores'})+
  kpi({t:'High access risk',icon:'lock',v:'9',cls:'alert',f:'<a class="lnk">Review access paths</a>'})+
  kpi({t:'Last full scan',icon:'refresh',v:'7',unit:'days',f:'Next scan in 2 h'})+
 '</div>'+
 '<div class="panel">'+
  tabsBar([['all','All',15],['sql','SQL',14],['doc','Document',0],['kafka','Kafka',1],['s3','S3',0]],'all','stTab')+
  fbar({ph:'Name, type or instance',sels:[['Sensitivity','Any']],count:'15 of 15'})+
  '<table class="tb"><thead><tr><th>Data store</th><th>Sensitivity</th><th>Data types</th><th>Access risk</th>'+
   '<th class="r">Objects</th><th>Checked</th><th></th></tr></thead><tbody data-rows="stores">'+
  STORES.map(s=>'<tr data-f="'+esc(s[0]+' '+s[1]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ico-sq">'+ico('db',16)+'</span><div style="min-width:0">'+
     '<div class="t1 mono">'+esc(s[0])+'</div><div class="t2">'+esc(s[1])+'</div></div></div></td>'+
   '<td>'+pill(s[2],s[3])+'</td><td>'+chips(s[4],s[5])+'</td><td>'+sev(s[6])+'</td>'+
   '<td class="r mono">'+s[7]+'</td><td class="muted">7 days ago</td>'+
   '<td class="r" style="color:var(--tx3)">'+ico('chev',16)+'</td></tr>').join('')+'</tbody></table>'+
  foot('Showing 1–7 of 15')+'</div>';
}};

/* ---------------------------------------------------------- 06 · DATA TYPES */
const TYPES=[
 ['Birth date','Built-in detector','PII','Low','green',1,0],
 ['Driver license','Built-in detector','PII','High','red',0,0],
 ['Email','Built-in detector','PII','Medium','amber',7,2],
 ['IBAN','Built-in detector','PCI','High','red',3,1],
 ['Card number','Built-in · Luhn check','PCI','High','red',4,3],
 ['API key','Custom · regex','SECRET','High','red',2,4],
 ['IP address','Built-in detector','PII','Medium','amber',4,3],
 ['Gender','Built-in detector','PII','Low','green',0,0]
];
SCREENS.types={sec:'inventory',name:'Data types',render(){
 return head({k:'[ 02 ]  Classification',t:'Data types',p:'A single dictionary of sensitive data and how it spreads across your infrastructure.',
   acts:btn('Import rules','download')+btn('Add data type','plus','pri')})+
 '<div class="cats">'+
  [['Personal data','PII · 15 types · 3,346 fields',81,'users','var(--brand)'],
   ['Payment data','PCI · 6 types · 455 fields',31,'lock','var(--warn)'],
   ['Secrets','7 types · 331 fields',22,'key','var(--err)']]
   .map(c=>'<div class="cat"><span class="ico-sq" style="width:36px;height:36px">'+ico(c[3],17)+'</span>'+
     '<div class="tx"><b>'+c[0]+'</b><small>'+c[1]+'</small>'+
     '<div class="track"><i data-w="'+c[2]+'" style="background:'+c[4]+'"></i></div></div>'+
     '<span style="color:var(--tx3)">'+ico('chev',17)+'</span></div>').join('')+
 '</div>'+
 '<div class="panel">'+
  fbar({ph:'Find a data type',sels:[['Category','All'],['Sensitivity','Any']],count:'28 of 28'})+
  '<table class="tb"><thead><tr><th>Data type</th><th>Category</th><th>Sensitivity</th>'+
   '<th class="r">Stores</th><th class="r">Services</th><th></th></tr></thead><tbody data-rows="types">'+
  TYPES.map(t=>'<tr data-f="'+esc(t[0]+' '+t[2]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ico-sq">'+ico('tag',15)+'</span><div><div class="t1">'+esc(t[0])+'</div>'+
     '<div class="t2">'+esc(t[1])+'</div></div></div></td>'+
   '<td><span class="tag">'+t[2]+'</span></td><td>'+pill(t[3],t[4])+'</td>'+
   '<td class="r mono'+(t[5]?'':' muted')+'">'+t[5]+'</td><td class="r mono'+(t[6]?'':' muted')+'">'+t[6]+'</td>'+
   '<td class="r"><a class="lnk">Resources '+ico('arrow',14)+'</a></td></tr>').join('')+'</tbody></table>'+
  foot('Showing 1–8 of 28')+'</div>';
}};

/* ---------------------------------------------------------- 07 · RESOURCE GROUPS */
SCREENS.groups={sec:'inventory',name:'Resource groups',render(){
 const G=[
  ['Payments perimeter','Checkout, ledger and billing — everything in PCI scope.',12,'PT','Payments team',91,[['Card number','pci'],['IBAN','pci']],'red'],
  ['Customer data','CRM, profiles and support tooling that hold customer PII.',8,'CR','CRM team',70,[['Email','pii'],['Address','pii']],'amber'],
  ['Platform & infra','Shared clusters, queues and observability.',6,'PL','Platform team',45,[['API key','secret']],'blue'],
  ['Demo · by namespace','Sample group created from the dim-dev namespace.',4,'?','Not set',12,[],'grey']
 ];
 return head({k:'[ 02 ]  Business context',t:'Resource groups',p:'Bring related systems together into clear areas of responsibility.',
   acts:btn('Create group','plus','pri')})+
 '<div class="strip"><span class="av">'+ico('spark',17)+'</span><div class="tx">'+
  '<span class="k">Suggestion</span><b>Copilot found 2 more natural groups: “Identity” and “Analytics”</b>'+
  '<small>Based on namespaces, shared data stores and traffic between 9 services</small></div>'+
  '<div class="ac"><button class="btn gh" data-dismiss>'+ico('x',15)+'Dismiss</button>'+btn('Review suggestions','arrow')+'</div></div>'+
 '<div class="grid3">'+G.map(g=>'<div class="gc"><div class="gc-h"><span class="ico-sq '+(g[8]==='red'?'red':g[8]==='amber'?'amber':'')+'">'+
    ico('layers',16)+'</span><span class="n">'+g[2]+' resources</span></div>'+
   '<h3>'+esc(g[0])+'</h3><p>'+esc(g[1])+'</p>'+
   '<div class="own"><span class="ava">'+g[3]+'</span><div class="tx"><b'+(g[4]==='Not set'?' class="warnx"':'')+'>'+esc(g[4])+'</b>'+
     '<small>Owning team</small></div>'+D.sev(g[5])+'</div>'+
   (g[7].length?'<div class="tags">'+chips(g[7])+'</div>':'<div class="tags"><span class="t2">No sensitive data yet</span></div>')+
   '<div class="ft"><a class="lnk">Open group '+ico('arrow',14)+'</a><span class="cfg">'+ico('sliders',17)+'</span></div></div>').join('')+
  '<div class="gc dashed"><span class="pl">'+ico('plus',18)+'</span><h3 style="font-size:17px">Create a group</h3>'+
   '<p style="margin:0;font-size:12.5px">Pick resources manually or by namespace</p></div>'+
  '<div class="gc note"><div class="k">Why groups</div>'+
   '<p style="color:var(--tx)">Groups add an owner and business context to every event, so alerts go to the team that can fix them.</p>'+
   '<a class="lnk">Read the guide '+ico('arrow',14)+'</a></div>'+
 '</div>';
}};

/* ---------------------------------------------------------- 08 · EVENTS */
SCREENS.events={sec:'protection',name:'Events',render(){
 const E=window.EVENTS;
 const st=s=>s==='New'?pill('New','grey'):s==='Investigating'?pill('Investigating','amber'):pill('Resolved','green');
 const ini=n=>n==='Unassigned'?'<span class="warnx">Unassigned</span>'
   :'<div class="cell"><span class="ava">'+n.split(' ').map(x=>x[0]).join('')+'</span>'+esc(n)+'</div>';
 return head({k:'[ 03 ]  Data protection',t:'Events',live:'4 critical',liveCls:'bad',
   p:'Priority, context and owner — everything you need to investigate.',
   acts:btn('Events report','file')+btn('Start triage','arrow','pri')})+
 '<div class="kpis">'+
  kpi({t:'Open events',icon:'warn',v:'32',delta:'+5 today',f:'Need a decision'})+
  kpi({t:'Critical',icon:'warn',v:'4',cls:'alert',f:'2 unassigned'})+
  kpi({t:'In progress',icon:'users',v:'6',f:'Assigned to analysts'})+
  kpi({t:'Resolved',icon:'shield',v:'18',cls:'ok',f:'This period · median 3.2 h'})+
 '</div>'+
 '<div class="panel">'+
  tabsBar([['all','All',32],['new','New',22],['inv','Investigating',6],['res','Resolved',18]],'all','evTab')+
  fbar({ph:'Search an event, resource or owner',sels:[['Severity','Any'],['Owner','Anyone']],count:'32 of 32'})+
  '<table class="tb"><thead><tr><th style="width:44px"></th><th>Event</th><th>Severity</th><th>Status</th>'+
   '<th>Owner</th><th>Detected</th><th></th></tr></thead><tbody data-rows="events">'+
  E.map(e=>'<tr data-f="'+esc(e[0]+' '+e[5]+' '+e[7]).toLowerCase()+'">'+
   '<td><span class="box" data-row-chk>'+ico('check',12)+'</span></td>'+
   '<td><div class="cell"><span class="ico-sq '+(e[2]>=85?'red':'')+'">'+ico('warn',16)+'</span>'+
     '<div style="min-width:0"><div class="t1">'+esc(e[0])+'</div>'+
     '<div class="t2 mono">'+e[4]+' &nbsp; '+esc(e[5])+'</div></div></div></td>'+
   '<td>'+sev(e[2])+'</td><td>'+st(e[6])+'</td><td>'+ini(e[7])+'</td>'+
   '<td class="muted mono" style="font-size:12px">'+esc(e[8])+'</td>'+
   '<td class="r" style="color:var(--tx3)">'+ico('chev',16)+'</td></tr>').join('')+'</tbody></table>'+
  '<div class="bulk" id="bulkBar" hidden><span class="c"><b data-bulk-n>0</b> selected</span>'+
    '<button data-act="Assign to me">Assign to me</button><button data-act="Resolve">Resolve</button>'+
    '<button data-act="Create ticket">Create ticket</button></div>'+
  foot('Showing 1–8 of 32')+'</div>';
}};

/* ---------------------------------------------------------- 09 · POLICIES */
const POLS=[
 ['Card data over plaintext HTTP','All resources · by Alex Morgan','Transfer',[['PCI','pci']],'Critical','red',14,1],
 ['PII leaving EU regions','Customer data group','Transfer',[['PII','pii']],'High','amber',6,1],
 ['IBAN autogenerated policy','All resources · autogenerated','Transfer',[['PCI','pci']],null,null,'—',0],
 ['SSN autogenerated policy','All resources · autogenerated','At rest',[['PII','pii']],null,null,'—',0],
 ['Driver license autogenerated policy','All resources · autogenerated','At rest',[['PII','pii']],null,null,'—',0]
];
SCREENS.policies={sec:'protection',name:'Policies',render(){
 return head({k:'[ 03 ]  Protection rules',t:'Policies',p:'Conditions that detect risks to data at rest, in transit and in access.',
   acts:btn('Templates','file')+btn('Create policy','plus','pri')})+
 '<div class="strip"><span class="av">'+ico('shield',17)+'</span><div class="tx">'+
  '<span class="k">Coverage</span><b id="polHead">2 of 5 policies are active and checking your perimeter</b>'+
  '<small>Turn on the autogenerated policies to cover IBAN, SSN and driver license data</small></div>'+
  '<div class="ac">'+btn('Enable all','arrow','')+'</div></div>'+
 '<div class="panel">'+
  tabsBar([['all','All',5],['act','Active',2],['pau','Paused',3]],'all','poTab')+
  fbar({ph:'Find a policy',sels:[['Type','All'],['Data','Any']],count:'5 of 5'})+
  '<table class="tb"><thead><tr><th>Policy</th><th>Type</th><th>Data</th><th>Severity</th>'+
   '<th class="r">Triggered</th><th>Monitoring</th><th></th></tr></thead><tbody data-rows="policies">'+
  POLS.map((p,i)=>'<tr data-f="'+esc(p[0]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ico-sq">'+ico('shield',16)+'</span><div><div class="t1">'+esc(p[0])+'</div>'+
     '<div class="t2">'+esc(p[1])+'</div></div></div></td>'+
   '<td><span class="tag">'+p[2]+'</span></td><td>'+chips(p[3])+'</td>'+
   '<td>'+(p[4]?pill(p[4],p[5]):'<span class="muted">By event type</span>')+'</td>'+
   '<td class="r mono'+(p[6]==='—'?' muted':'')+'">'+p[6]+'</td>'+
   '<td><span class="sw'+(p[7]?' on':'')+'" data-pol="'+i+'"><i></i></span></td>'+
   '<td class="r"><a class="lnk">Configure '+ico('arrow',14)+'</a></td></tr>').join('')+'</tbody></table></div>'+
 '<div style="display:flex;align-items:flex-end;margin:30px 0 16px"><div><h2 style="margin:0;font-size:22px;font-weight:500;letter-spacing:-.02em">Start from a template</h2>'+
  '<div style="font-size:13px;color:var(--tx2);margin-top:4px">Ready-made rules mapped to common frameworks</div></div>'+
  '<a class="lnk" style="margin-left:auto">All 12 templates '+ico('arrow',14)+'</a></div>'+
 '<div class="grid3">'+
  [['Cross-border transfer of PII','Detect personal data sent outside approved regions.','GDPR · Art. 44','users'],
   ['Encryption of card data in transit','Flag PAN sent without TLS 1.2+ between services.','PCI DSS 4.0 · 4.2','lock'],
   ['Secrets in logs and payloads','Catch API keys, tokens and passwords leaving services.','SOC 2 · CC6.1','shield']]
  .map(t=>'<div class="gc"><div class="gc-h"><span class="ico-sq">'+ico(t[3],16)+'</span>'+
    '<span class="n mono" style="font-size:10.5px">'+t[2]+'</span></div>'+
    '<h3 style="font-size:17px">'+esc(t[0])+'</h3><p>'+esc(t[1])+'</p>'+
    '<a class="lnk" style="margin-top:auto">Use template '+ico('arrow',14)+'</a></div>').join('')+
 '</div>';
}};
})();


/* ======================= SCREENS 10–15 ======================= */
(function(){
const D=window.__dspm, {ico,esc,sev,chips,pill,kpi,tabsBar,fbar,foot,head,btn}=D;
const SCREENS=window.SCREENS;

/* ---------------------------------------------------------- 10 · ATTACK PATHS */
SCREENS.attack={sec:'protection',name:'Attack paths',render(){
 const HOPS=[['01','api-proxy:6480','Entry point','first'],['02','k8s-api-proxy','Access',''],['03','upstreams','Access',''],
   ['04','kube1','Access',''],['05','api-access','Token',''],['06','upmeter-agent','Access',''],['07','agent store','Target','target']];
 return head({k:'[ 03 ]  Exposure analysis',t:'Attack paths',p:'How access and connections can lead to sensitive data.',
   acts:btn('Cluster f4d42f27','layers')+btn('Run analysis','sensor','pri')})+
 '<div class="tabs" style="border:0;padding:0;margin-bottom:18px">'+
   '<button class="tab on">Overview</button><button class="tab">Paths<span class="n">374</span></button>'+
   '<button class="tab">Graph</button></div>'+
 '<div class="kpis">'+
  kpi({t:'Paths found',icon:'flow',v:'374',f:'In the current cluster'})+
  kpi({t:'Critical',icon:'warn',v:'287',cls:'alert',f:'+71 more with high severity'})+
  kpi({t:'Target data stores',icon:'db',v:'3',f:'Reachable from an entry point'})+
  kpi({t:'Last checked',icon:'sensor',v:'02:01',unit:'AM',f:'Oct 28 · successful run'})+
 '</div>'+
 '<div class="ap"><div class="panel" style="padding:22px">'+
   '<div style="display:flex;align-items:center"><b style="font-size:17px;font-weight:500">Where to start</b>'+
     '<span style="margin-left:auto">'+pill('First priority','red')+'</span></div>'+
   '<h3 style="margin:16px 0 8px;font-size:21px;font-weight:500;letter-spacing:-.02em">Token theft: kube-system API proxy → upmeter-agent</h3>'+
   '<div class="mono" style="font-size:12px;color:var(--tx3)">7 steps · entry kube-system::kubernetes-api-proxy:6480 → upmeter-agent::upmeter-agent</div>'+
   '<div class="chain">'+HOPS.map((h,i)=>'<div class="hop '+h[3]+'" data-hop="'+i+'"><div class="hh">'+ico(h[3]==='target'?'db':'box',15)+
     '<span class="n">'+h[0]+'</span></div><div class="nm">'+esc(h[1])+'</div><div class="rl">'+h[2]+'</div></div>'+
     (i<HOPS.length-1?'<span class="arw">'+ico('chev',15)+'</span>':'')).join('')+'</div>'+
   '<div class="facts">'+
     '<div class="fact"><div class="k">Exposed credential</div><div class="v">service-account/default</div></div>'+
     '<div class="fact"><div class="k">Privilege</div><div class="v">cluster-admin</div></div>'+
     '<div class="fact"><div class="k">Suggested fix</div><div class="v">Rotate token · restrict RBAC</div></div></div>'+
   '<div style="display:flex;align-items:center"><a class="lnk">Investigate the path '+ico('arrow',14)+'</a>'+
     '<span class="mono" style="margin-left:auto;font-size:11.5px;color:var(--tx3)">Path 1 of 374</span></div>'+
 '</div>'+
 '<div class="rem"><div class="k">Remediation priority</div><h3>Break the chain at step 05</h3>'+
   '<p>A target store is proven when the path cluster and a sensor share a key and the sensor sees the flow to storage.</p>'+
   '<div class="task on" data-task><span class="rb">'+ico('check',12)+'</span><span>Rotate the default service-account token</span></div>'+
   '<div class="task" data-task><span class="rb">'+ico('check',12)+'</span><span>Restrict RBAC for upmeter-agent</span></div>'+
   '<div class="task" data-task><span class="rb">'+ico('check',12)+'</span><span>Add a network policy for kube-system</span></div>'+
   '<button class="btn pri" style="width:100%;justify-content:center;margin-top:14px" data-act="Ticket created">'+ico('plus',16)+'Create ticket</button>'+
 '</div></div>'+
 '<div class="panel"><table class="tb"><thead><tr><th>Path</th><th class="r">Steps</th><th>Severity</th><th>Target</th><th>Found</th><th></th></tr></thead><tbody>'+
  [['Token theft → upmeter-agent','kube-system · 7 hops',7,94,'agent store'],
   ['Public ingress → payments_ledger','checkout-api · 4 hops',4,91,'payments_ledger'],
   ['Partner SFTP → customers_db','crm-sync · 5 hops',5,76,'customers_db']]
  .map(p=>'<tr><td><div class="cell"><span class="ico-sq">'+ico('flow',16)+'</span><div><div class="t1">'+esc(p[0])+'</div>'+
    '<div class="t2 mono">'+esc(p[1])+'</div></div></div></td><td class="r mono">'+p[2]+'</td><td>'+sev(p[3])+'</td>'+
    '<td class="mono" style="color:var(--brand);font-size:12.5px">'+esc(p[4])+'</td><td class="muted">Oct 28</td>'+
    '<td class="r" style="color:var(--tx3)">'+ico('chev',16)+'</td></tr>').join('')+'</tbody></table></div>';
}};

/* ---------------------------------------------------------- 11 · LLM GATEWAY */
const ROUTES=[
 ['anthropic-block','/r/anthropic-block','A','Anthropic','block','red',412,9],
 ['anthropic-mask','/r/anthropic-mask','A','Anthropic','mask','amber',288,0],
 ['openai-block','/r/openai-block/v1','O','OpenAI','block','red',164,6],
 ['openai-mask','/r/openai-mask/v1','O','OpenAI','mask','amber',97,0],
 ['mistral-mask','/r/mistral-mask/v1','M','Mistral','mask','amber',58,0],
 ['internal-llm','/r/internal/llama','S','Self-hosted','monitor','grey',30,2],
 ['sandbox-echo','/r/sandbox-echo','E','Echo','monitor','grey',0,0]
];
SCREENS.llm={sec:'protection',name:'LLM gateway',render(){
 return head({k:'[ 03 ]  AI application protection',t:'LLM gateway',live:'Gateway healthy',
   p:'Control sensitive data on its way to language models.',
   acts:btn('Docs','file')+btn('Add route','plus','pri')})+
 '<div class="kpis">'+
  kpi({t:'Requests · 24h',icon:'flow',v:'1,049',delta:'+12%',f:'Across 11 routes'})+
  kpi({t:'Masked',icon:'shield',v:'312',bar:30,f:'30% of requests had sensitive data'})+
  kpi({t:'Blocked',icon:'warn',v:'17',cls:'alert',f:'Stopped by policy'})+
  kpi({t:'Gateway latency',icon:'bolt',v:'38',unit:'ms',f:'Median overhead · p95 92 ms'})+
 '</div>'+
 '<div class="panel">'+
  tabsBar([['r','Routes',11],['p','Policies',4],['e','Events'],['l','Logs'],['i','Instances',1]],'r','llmTab')+
  fbar({ph:'Search routes',sels:[['Provider','All'],['Protection','Any']],count:'11 of 11'})+
  '<table class="tb"><thead><tr><th>Route</th><th>Provider</th><th>Protection</th><th class="r">Requests</th>'+
   '<th class="r">Blocked</th><th></th></tr></thead><tbody data-rows="llm">'+
  ROUTES.map(r=>'<tr data-f="'+esc(r[0]+' '+r[3]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ico-sq">'+ico('spark',15)+'</span><div><div class="t1 mono">'+esc(r[0])+'</div>'+
     '<div class="t2 mono">'+esc(r[1])+'</div></div></div></td>'+
   '<td><div class="cell"><span class="ava">'+r[2]+'</span>'+esc(r[3])+'</div></td>'+
   '<td><span class="tag" style="color:var(--'+(r[5]==='red'?'err':r[5]==='amber'?'warn':'tx2')+')">'+r[4]+'</span></td>'+
   '<td class="r mono'+(r[6]?'':' muted')+'">'+r[6]+'</td>'+
   '<td class="r mono'+(r[7]?' warnx':' muted')+'">'+r[7]+'</td>'+
   '<td class="r"><a class="lnk">Configure '+ico('arrow',14)+'</a></td></tr>').join('')+'</tbody></table>'+
  foot('Showing 1–7 of 11')+'</div>';
}};

/* ---------------------------------------------------------- 12 · SENSORS */
SCREENS.sensors={sec:'manage',name:'Sensors',render(){
 const S=[['dim-dev','eu-west-1 · k8s cluster','Data in motion','No signal','red','No data','1.0.5 · master','7 days ago'],
          ['dar-dev','eu-west-1 · storage','Data at rest','No signal','red','14 databases, 25 topics','dev','7 days ago'],
          ['llmgate-stand','eu-west-1 · gateway','LLM','Online','green','1K requests','067efcb57','2 min ago']];
 return head({k:'[ 04 ]  Infrastructure',t:'Sensors',p:'Source coverage, connection state and observation results.',
   acts:btn('Install guide','file')+btn('Connect a sensor','plus','pri')})+
 '<div class="kpis">'+
  kpi({t:'Online',icon:'sensor',v:'1',unit:'/ 3',bar:33,cls:'warn',f:'<span style="color:var(--warn)">No signal from 2 sensors</span>'})+
  kpi({t:'Sources',icon:'db',v:'33',f:'15 data stores · 18 services'})+
  kpi({t:'Last scan',icon:'file',v:'04:21',unit:'AM',f:'Oct 28, 2026'})+
  kpi({t:'Connection errors',icon:'shield',v:'0',cls:'ok',f:'In the last 24 hours'})+
 '</div>'+
 '<div class="strip warn"><span class="av">'+ico('sensor',17)+'</span><div class="tx">'+
  '<span class="k">Attention</span><b>2 sensors stopped reporting 7 days ago</b>'+
  '<small>dim-dev and dar-dev · traffic and storage in eu-west-1 are not being observed</small></div>'+
  '<div class="ac">'+btn('Troubleshoot','arrow')+'</div></div>'+
 '<div class="panel">'+
  tabsBar([['all','All',3],['m','Data in motion',1],['r','Data at rest',1],['l','LLM',1]],'all','seTab')+
  fbar({ph:'Find a sensor or location',count:'3 of 3'})+
  '<table class="tb"><thead><tr><th>Sensor</th><th>Type</th><th>Status</th><th>Observes</th><th>Version</th>'+
   '<th>Last signal</th><th></th></tr></thead><tbody data-rows="sensors">'+
  S.map(s=>'<tr data-f="'+esc(s[0]+' '+s[1]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ico-sq '+(s[4]==='green'?'green':'')+'">'+ico('sensor',16)+'</span>'+
     '<div><div class="t1 mono">'+esc(s[0])+'</div><div class="t2">'+esc(s[1])+'</div></div></div></td>'+
   '<td><span class="tag">'+esc(s[2])+'</span></td><td>'+pill(s[3],s[4])+'</td>'+
   '<td'+(s[5]==='No data'?' class="muted"':'')+'>'+esc(s[5])+'</td>'+
   '<td class="mono" style="font-size:12px">'+esc(s[6])+'</td><td class="muted">'+esc(s[7])+'</td>'+
   '<td class="r"><a class="lnk">Details '+ico('arrow',14)+'</a></td></tr>').join('')+'</tbody></table></div>'+
 '<div class="panel" style="margin-top:20px"><div class="pn-h"><div><b>Coverage</b><small>What your sensors can currently see</small></div>'+
   '<a class="lnk r">12 services unmonitored '+ico('arrow',14)+'</a></div><div class="cov">'+
   [['Services',47,'18 of 38','var(--warn)'],['Data stores',100,'15 of 15','var(--ok)'],
    ['LLM routes',100,'11 of 11','var(--ok)'],['External connections',33,'1 of 3','var(--err)']]
   .map(c=>'<div class="cov-r"><span class="lb">'+c[0]+'</span><span class="tr"><i data-w="'+c[1]+'" style="background:'+c[3]+'"></i></span>'+
     '<span class="vl">'+c[2]+'</span></div>').join('')+'</div></div>';
}};

/* ---------------------------------------------------------- 13 · INTEGRATIONS */
SCREENS.integrations={sec:'manage',name:'Integrations',render(){
 const I=[['S','Slack',"Security events in your team's channel.",0],
          ['J','Jira','Risk remediation tasks and status tracking.',0],
          ['W','Webhook','Event delivery to external systems over HTTPS.',0],
          ['API','External API','Programmatic access to inventory and events.',1,'Token “test” · read inventory · used 2 h ago'],
          ['@','Email digest','Daily or weekly summary for stakeholders.',0]];
 return head({k:'[ 04 ]  Workflows',t:'Integrations',p:'Events, findings and risk metrics — in your team’s tools.',
   acts:btn('API docs','file')+btn('Add receiver','plus','pri')})+
 '<div class="tabs" style="border:0;padding:0;margin-bottom:22px">'+
   '<button class="tab on">Notifications & API<span class="n">5</span></button>'+
   '<button class="tab">Profile catalog<span class="n">11</span></button>'+
   '<button class="tab">SIEM / Monitoring<span class="n">0</span></button></div>'+
 '<div class="grid3">'+I.map(i=>'<div class="intg'+(i[3]?' conn':'')+'" data-intg="'+esc(i[1])+'">'+
   '<div class="intg-h"><span class="lg" style="font-size:'+(i[0].length>1?'12px':'15px')+'">'+i[0]+'</span>'+
     '<span class="st">'+(i[3]?pill('Connected','green'):pill('Not connected','grey'))+'</span></div>'+
   '<h3>'+esc(i[1])+'</h3><p>'+esc(i[2])+'</p>'+
   '<div class="meta">'+(i[3]?esc(i[4]):'Awaiting setup')+'</div>'+
   (i[3]?'<button class="btn">'+ico('sliders',16)+'Configure</button>'
        :'<button class="btn pri" data-connect>'+ico('plus',16)+'Connect</button>')+
   '</div>').join('')+
  '<div class="gc dashed"><span class="pl">'+ico('plus',18)+'</span><h3 style="font-size:17px">Request an integration</h3>'+
   '<p style="margin:0;font-size:12.5px">Tell us which tool your team uses</p></div></div>';
}};

/* ---------------------------------------------------------- 14 · REPORTS */
SCREENS.reports={sec:'manage',name:'Reports',render(){
 const R=[['Executive summary · Q3 2026','A1B2C3D4 · scheduled','Executive summary','PDF','Generating','amber','Nov 6, 2026 · 09:30',0],
          ['Access review · 2026-09-29','F2645E22 · Alex Morgan','Access review','PDF','Ready','green','Sep 29, 2026 · 11:06',1],
          ['Access review · 2026-09-29','95422FF4 · Alex Morgan','Access review','PDF','Ready','green','Sep 29, 2026 · 11:05',1],
          ['Access review · 2026-09-02','3447E36B · Maya Chen','Access review','PDF','Ready','green','Sep 2, 2026 · 13:01',1],
          ['Policy violations · Jul 1 – Jul 31','9CCF13A8 · scheduled','Policy violations','CSV','Ready','green','Aug 16, 2026 · 12:53',1]];
 return head({k:'[ 04 ]  Communication & audit',t:'Reports',p:'From a quick check to an executive overview.',
   acts:btn('Schedule','file')+btn('New report','plus','pri')})+
 '<div class="grid4" style="margin-bottom:26px">'+
  [['CISO · Management','Executive summary','Data protection posture, top risks and priorities.','grid'],
   ['Security team','Policy violations','Open events, affected resources and owners.','shield'],
   ['DevOps · Infra','Sensor coverage','Sources, sensor availability and scan results.','sensor'],
   ['Analysts · Audit','Access review','Permissions on sensitive data and detected risks.','lock']]
  .map(r=>'<div class="rep" data-act="Report queued"><span class="ico-sq">'+ico(r[3],16)+'</span>'+
    '<div class="k">'+r[0]+'</div><h3>'+esc(r[1])+'</h3><p>'+esc(r[2])+'</p>'+
    '<a class="lnk">Generate '+ico('arrow',14)+'</a></div>').join('')+'</div>'+
 '<div style="display:flex;align-items:flex-end;margin-bottom:16px"><div><h2 style="margin:0;font-size:22px;font-weight:500;letter-spacing:-.02em">Report history</h2>'+
  '<div style="font-size:13px;color:var(--tx2);margin-top:4px">Generated and scheduled reports</div></div>'+
  '<span class="n" style="margin-left:auto;font-size:11.5px;color:var(--tx2);background:var(--card);border:1px solid var(--bd);border-radius:7px;padding:4px 10px">5 reports</span></div>'+
 '<div class="panel">'+fbar({ph:'Find a report',sels:[['Template','All'],['Format','Any']],count:'5 of 5'})+
  '<table class="tb"><thead><tr><th>Title</th><th>Template</th><th>Format</th><th>Status</th><th>Created</th><th></th></tr></thead>'+
  '<tbody data-rows="reports">'+R.map(r=>'<tr data-f="'+esc(r[0]+' '+r[2]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ico-sq">'+ico('file',16)+'</span><div><div class="t1">'+esc(r[0])+'</div>'+
     '<div class="t2 mono">'+esc(r[1])+'</div></div></div></td><td>'+esc(r[2])+'</td>'+
   '<td><span class="tag">'+r[3]+'</span></td><td>'+pill(r[4],r[5])+'</td>'+
   '<td class="muted mono" style="font-size:12px">'+esc(r[6])+'</td>'+
   '<td class="r">'+(r[7]?'<a class="lnk">View '+ico('arrow',14)+'</a>':'<span class="muted">—</span>')+'</td></tr>').join('')+
  '</tbody></table>'+foot('Showing 1–5 of 5')+'</div>';
}};

/* ---------------------------------------------------------- 15 · TEAM */
SCREENS.team={sec:'manage',name:'Team',render(){
 const M=[['AM','Alex Morgan','alex.morgan@northstar.io','Admin','Active','green','On',1,'Now'],
          ['MC','Maya Chen','maya.chen@northstar.io','Analyst','Active','green','On',1,'2 h ago'],
          ['LO','Liam Ortiz','liam.ortiz@northstar.io','Analyst','Active','green','Off',0,'1 d ago'],
          ['SK','Sara Kim','sara.kim@northstar.io','Viewer','Invited','red','Off',0,'—'],
          ['DN','Daniel Novak','daniel.novak@northstar.io','Admin','Suspended','grey','On',1,'34 d ago']];
 return head({k:'[ 04 ]  Workspace',t:'Team',p:'Members, roles and single sign-on for Northstar.',
   acts:btn('Sign-in settings','lock')+btn('Invite member','plus','pri')})+
 '<div class="tabs" style="border:0;padding:0;margin-bottom:12px">'+
   '<button class="tab on">Members<span class="n">5</span></button><button class="tab">Roles<span class="n">3</span></button>'+
   '<button class="tab">Sign-in settings</button><button class="tab">Audit log</button></div>'+
 '<div class="panel">'+fbar({ph:'Find a member by name or email',sels:[['Role','All'],['Status','Any']],count:'5 of 5'})+
  '<table class="tb"><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>2FA</th><th>Last active</th><th></th></tr></thead>'+
  '<tbody data-rows="team">'+M.map(m=>'<tr data-f="'+esc(m[1]+' '+m[2]+' '+m[3]).toLowerCase()+'">'+
   '<td><div class="cell"><span class="ava" style="width:32px;height:32px;font-size:11px">'+m[0]+'</span>'+
     '<div><div class="t1">'+esc(m[1])+'</div><div class="t2">'+esc(m[2])+'</div></div></div></td>'+
   '<td><span class="tag">'+m[3]+'</span></td><td>'+pill(m[4],m[5])+'</td>'+
   '<td><span class="tag" style="color:var(--'+(m[7]?'ok':'warn')+')">'+m[6]+'</span></td>'+
   '<td class="muted">'+esc(m[8])+'</td><td class="r"><a class="lnk">Edit '+ico('arrow',14)+'</a></td></tr>').join('')+
  '</tbody></table></div>'+
 '<div style="display:flex;align-items:flex-end;margin:30px 0 16px"><div><h2 style="margin:0;font-size:22px;font-weight:500;letter-spacing:-.02em">Roles</h2>'+
  '<div style="font-size:13px;color:var(--tx2);margin-top:4px">What each role can do in the workspace</div></div>'+
  '<a class="lnk" style="margin-left:auto">Manage roles '+ico('arrow',14)+'</a></div>'+
 '<div class="grid3">'+
  [['Admin','Members, integrations and all settings.','2 members','shield'],
   ['Analyst','Explore data and work with events.','2 members','search'],
   ['Viewer','View inventory, events and reports.','1 member','file']]
  .map(r=>'<div class="gc"><div class="gc-h"><span class="ico-sq">'+ico(r[3],16)+'</span><span class="n">'+r[2]+'</span></div>'+
    '<h3 style="font-size:17px">'+esc(r[0])+'</h3><p>'+esc(r[1])+'</p>'+
    '<a class="lnk" style="margin-top:auto">Edit permissions '+ico('arrow',14)+'</a></div>').join('')+
 '</div>';
}};
})();
