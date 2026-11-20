/* Cookie banner: shown until the visitor makes a choice; "Cookie settings" in the footer
   opens it again. The choice is kept in localStorage (no optional cookies are set yet,
   so "Accept all" only records consent for when analytics is added). */
Sollisero.component('cookie', () => {
  const { $, $$ } = Sollisero;
  const banner = $('#cookieBanner');
  if (!banner) return;
  const KEY = 'sollisero-cookie-consent';
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked: banner just closes */ } };
  const show = (on) => { banner.hidden = !on; banner.classList.toggle('in', on); };
  if (!read()) show(true);
  $$('[data-cookie]', banner).forEach((b) => b.addEventListener('click', () => { write(b.dataset.cookie); show(false); }));
  $$('[data-cookie-open]').forEach((b) => b.addEventListener('click', () => show(true)));
});
