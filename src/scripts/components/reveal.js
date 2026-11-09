/* Scroll reveal for .rv elements, staggered among siblings.
   .rv is only hidden under html.js (set by an inline, CSP-hashed snippet in <head>), so content stays visible if JS fails. */
Sollisero.component('reveal', () => {
  const { $$ } = Sollisero;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.children].filter((x) => x.classList.contains('rv'));
    e.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(e.target)) * 0.08}s`;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach((n) => io.observe(n));
});
