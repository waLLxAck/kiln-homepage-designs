// The floating bar on every design: back to the index, previous and next, and a jump menu.
// ← and → step through designs unless the design already handled the key; H hides the bar; `?bare` leaves it out.
import './nav.css';
import { designs, roundOf, type Design } from './designs';

const base = import.meta.env.BASE_URL;
const href = (design: Design) => `${base}${design.number}/`;

export function mountNav(current: Design) {
  if (new URLSearchParams(location.search).has('bare')) return;
  const index = designs.indexOf(current);
  const previous = designs[(index - 1 + designs.length) % designs.length];
  const next = designs[(index + 1) % designs.length];
  const groups = [...new Set(designs.map(roundOf))];

  const bar = document.createElement('nav');
  bar.className = 'kd-nav';
  bar.setAttribute('aria-label', 'Design gallery');
  bar.innerHTML = `
    <a class="kd-nav-home" href="${base}" aria-label="All designs"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 1h6v6H1zm8 0h6v6H9zM1 9h6v6H1zm8 0h6v6H9z"/></svg></a>
    <a class="kd-nav-step" href="${href(previous)}" aria-label="Previous: ${previous.number}, ${previous.name}">‹</a>
    <label class="kd-nav-label">
      <span class="kd-nav-title"><b>${current.number}</b> ${current.name}</span>
      <span class="kd-nav-count">${index + 1} of ${designs.length}</span>
      <select aria-label="Jump to a design">${groups.map(round => `<optgroup label="${round.title}">${designs.filter(item => roundOf(item) === round).map(item => `<option value="${item.number}" ${item === current ? 'selected' : ''}>${item.number} · ${item.name}</option>`).join('')}</optgroup>`).join('')}</select>
    </label>
    <a class="kd-nav-step" href="${href(next)}" aria-label="Next: ${next.number}, ${next.name}">›</a>`;
  bar.querySelector('select')!.addEventListener('change', event => {
    location.assign(href(designs.find(item => item.number === (event.target as HTMLSelectElement).value)!));
  });
  document.body.append(bar);

  addEventListener('keydown', event => {
    const target = event.target as HTMLElement;
    if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey || target.closest('input, textarea, select, [contenteditable]')) return;
    if (event.key === 'ArrowLeft') location.assign(href(previous));
    if (event.key === 'ArrowRight') location.assign(href(next));
    if (event.key === 'h' || event.key === 'H') bar.hidden = !bar.hidden;
  });
}
