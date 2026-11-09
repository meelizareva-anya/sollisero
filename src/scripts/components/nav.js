/* Site navigation: sticky backdrop on scroll + mobile menu. Current page is marked at build time (aria-current). */
Sollisero.component('nav', () => {
  const { $, $$ } = Sollisero;
  const wrap = $('#navWrap');
  if (!wrap) return;
  const burger = $('#burger');

  const onScroll = () => wrap.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    wrap.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', String(open));
    burger?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger?.addEventListener('click', () => setMenu(!wrap.classList.contains('menu-open')));
  // In-page anchors (e.g. "Discuss a project" → #contact) must close the menu.
  $$('#mobileMenu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrap.classList.contains('menu-open')) { setMenu(false); burger?.focus(); }
  });
  // Leaving the mobile breakpoint with the menu open must not leave the page scroll-locked.
  matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
});
