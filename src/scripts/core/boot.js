/* Boot: run components, then page code. One failing component must not take the page down. */
(() => {
  const { components, ready } = Sollisero._queues;
  const run = (label, fn) => {
    try { fn(); } catch (err) { console.error(`[sollisero] ${label} failed`, err); }
  };
  const boot = () => {
    components.forEach(({ name, init }) => run(`component "${name}"`, init));
    ready.forEach((fn, i) => run(`page script #${i + 1}`, fn));
  };
  // Deferred scripts always execute before DOMContentLoaded; the fallback covers late injection.
  if (document.readyState === 'complete') setTimeout(boot);
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
})();
