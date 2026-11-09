/**
 * Sollisero runtime core: DOM helpers + component registry.
 *
 * Every script is loaded with `defer`, so all files execute (in order) before DOMContentLoaded.
 *   Sollisero.component(name, init)  — shared components (app bundle), run first at boot
 *   Sollisero.onReady(fn)            — page code (page bundle), runs after all components
 * Page *data* (e.g. tab content) is plain assignment at load time, so it is available to components at boot.
 */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = () => matchMedia('(hover: hover)').matches;

  /** Create an element. `html` is trusted, author-provided markup only — never user input. */
  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  };

  /** Observe visibility; returns the observer so callers can disconnect. */
  const onVisible = (node, fn, opts = { threshold: 0.25 }) => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => fn(e.isIntersecting, e)), opts);
    io.observe(node);
    return io;
  };

  const pad2 = (n) => String(n).padStart(2, '0');

  const components = [];
  const ready = [];

  window.Sollisero = {
    $, $$, RM, el, onVisible, canHover, pad2,
    data: {},
    component(name, init) { components.push({ name, init }); },
    onReady(fn) { ready.push(fn); },
    _queues: { components, ready },
  };

})();
