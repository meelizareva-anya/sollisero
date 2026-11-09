/* Capability cards reveal details on hover/focus; on touch devices a tap toggles them. */
Sollisero.component('capability', () => {
  const { $$ } = Sollisero;
  const touch = matchMedia('(hover: none)').matches;
  $$('.cap').forEach((card) => {
    card.tabIndex = 0;
    card.addEventListener('click', (e) => {
      if (touch && !e.target.closest('a')) card.classList.toggle('open');
    });
  });
  if (touch) $$('.hint-t').forEach((h) => { h.textContent = h.textContent.replace(/Hover(?: over)?/i, 'Tap'); });
});
