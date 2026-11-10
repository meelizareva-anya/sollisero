/* Site navigation: sticky backdrop on scroll, Products dropdown, mobile menu.
   The current page is marked at build time (aria-current). */
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
  // Products dropdown. CSS already opens it on hover and on focus-within, so this only
  // adds what CSS cannot do: click to pin it open (touch, and pointer users who prefer it),
  // Escape, and clicking away. aria-expanded is kept truthful for screen readers.
  const item = $('[data-navmenu]');
  const toggle = $('#navProductsBtn');
  if (item && toggle) {
    const setOpen = (open) => {
      item.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!item.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (item.classList.contains('open') && !item.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && item.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    // Following a product link leaves the panel pinned open behind the navigation.
    $$('#navProducts a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    // Hover closes the pinned state again, otherwise the panel stays stuck open.
    item.addEventListener('mouseleave', () => setOpen(false));
  }

  // Leaving the mobile breakpoint with the menu open must not leave the page scroll-locked.
  matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
});
