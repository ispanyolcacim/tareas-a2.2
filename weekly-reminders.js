/* Hide a reminder in a shared header when the student leaves the cover. */
(() => {
  'use strict';
  const note = document.querySelector('.weekly-reminder[data-cover]');
  if (!note) return;
  const cover = document.getElementById(note.dataset.cover);
  if (!cover || cover.contains(note)) return;
  const ancestors = [];
  for (let node = cover; node && node !== document.body; node = node.parentElement) ancestors.push(node);
  const sync = () => {
    note.hidden = ancestors.some(node => node.hidden || getComputedStyle(node).display === 'none');
  };
  const observer = new MutationObserver(sync);
  ancestors.forEach(node => observer.observe(node, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] }));
  sync();
})();
