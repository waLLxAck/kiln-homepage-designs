// PROTOTYPE H14 — pointer-event dragging (mouse, pen and touch) with H03's feel: the item lifts off the page as a ghost that
// tilts with the pointer, the drop zone arms and lights up, the page auto-scrolls near the screen edge, and a drop is swallowed
// by the zone with a little gulp. The keyboard/tap fallback ("Add to Kiln") flies the same ghost along an arc.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

type DragOptions = {
  host: HTMLElement;
  zones: () => HTMLElement[];
  enabled?: () => boolean;
  onDrop: (zone: HTMLElement) => void;
};

const rotOf = (el: HTMLElement) => Number(el.dataset.r) || 0;

function makeGhost(el: HTMLElement, host: HTMLElement) {
  const rect = el.getBoundingClientRect(), W = el.offsetWidth, H = el.offsetHeight;
  const ghost = el.cloneNode(true) as HTMLElement;
  ghost.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  ghost.querySelectorAll('button, a').forEach(node => node.setAttribute('tabindex', '-1'));
  ghost.classList.remove('is-lifted', 'is-testing');
  ghost.classList.add('h14-ghost');
  ghost.setAttribute('aria-hidden', 'true');
  // Start from the element's own centre, so its rotation doesn't shift the ghost.
  Object.assign(ghost.style, { left: `${rect.left + rect.width / 2 - W / 2}px`, top: `${rect.top + rect.height / 2 - H / 2}px`, width: `${W}px`, height: `${H}px`, transform: `translate(0px, 0px) rotate(${rotOf(el)}deg)` });
  host.appendChild(ghost);
  return ghost;
}

const inside = (zone: HTMLElement, x: number, y: number) => { const r = zone.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };

/** Swallow `existing` (a ghost that was dragged), or a fresh ghost of `el` lifted along an arc, into `zone`; then gulp. */
export async function flyInto(el: HTMLElement, zone: HTMLElement, host: HTMLElement, existing?: HTMLElement) {
  zone.classList.remove('is-gulp');
  if (reduced()) { existing?.remove(); return; }
  const ghost = existing ?? makeGhost(el, host);
  const now = ghost.getBoundingClientRect(), z = zone.getBoundingClientRect();
  const current = ghost.style.transform || 'none';
  const offset = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(current);
  const ox = offset ? Number(offset[1]) : 0, oy = offset ? Number(offset[2]) : 0;
  const tx = ox + z.left + z.width / 2 - (now.left + now.width / 2), ty = oy + Math.min(z.top + 110, z.top + z.height / 2) - (now.top + now.height / 2);
  if (!existing) el.classList.add('is-lifted');
  zone.classList.add('is-over');
  const frames = existing
    ? [{ transform: current }, { transform: `translate(${tx}px, ${ty}px) rotate(0deg) scale(.22)`, opacity: .35 }]
    : [
      { transform: current },
      { transform: `translate(${tx * .12}px, ${ty * .12 - 26}px) rotate(${rotOf(el) - 5}deg) scale(1.06)`, offset: .22 },
      { transform: `translate(${tx * .6}px, ${ty * .6 - 50}px) rotate(-3deg) scale(.8)`, offset: .62 },
      { transform: `translate(${tx}px, ${ty}px) rotate(0deg) scale(.22)`, opacity: .35 },
    ];
  ghost.classList.add('is-dragging');
  await ghost.animate(frames, { duration: existing ? 480 : 820, easing: existing ? 'cubic-bezier(.55,0,.25,1)' : 'cubic-bezier(.45,.05,.3,1)', fill: 'forwards' }).finished;
  ghost.remove();
  el.classList.remove('is-lifted');
  zone.classList.remove('is-over');
  void zone.offsetWidth; zone.classList.add('is-gulp');
}

export function draggable(el: HTMLElement, options: DragOptions) {
  el.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if ((event.target as Element).closest('button, a, select, input')) return;
    if (options.enabled && !options.enabled()) return;
    const startX = event.clientX, startY = event.clientY, rot = rotOf(el);
    let x = startX, y = startY, ghost: HTMLElement | null = null, frame = 0, over: HTMLElement | null = null;
    el.setPointerCapture(event.pointerId);
    const place = () => {
      if (!ghost) return;
      const dx = x - startX, dy = y - startY;
      ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot + Math.max(-7, Math.min(7, dx / 40))}deg) scale(1.04)`;
      const zone = options.zones().find(candidate => inside(candidate, x, y)) ?? null;
      if (zone !== over) { over?.classList.remove('is-over'); zone?.classList.add('is-over'); over = zone; }
    };
    // Edge scrolling, faster the closer you get, so a phone visitor can carry something to a zone below the fold.
    const autoScroll = () => {
      if (!ghost) return;
      const edge = Math.min(90, innerHeight * .12);
      const speed = y > innerHeight - edge ? (y - (innerHeight - edge)) / edge * 16 : y < edge ? -(edge - y) / edge * 16 : 0;
      if (speed) { scrollBy(0, speed); place(); }
      frame = requestAnimationFrame(autoScroll);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!ghost) {
        if (Math.hypot(x - startX, y - startY) < 6) return;
        ghost = makeGhost(el, options.host);
        void ghost.offsetWidth; ghost.classList.add('is-dragging');
        el.classList.add('is-lifted');
        options.host.classList.add('is-dragging');
        options.zones().forEach(zone => zone.classList.add('is-armed'));
        frame = requestAnimationFrame(autoScroll);
      }
      place();
    };
    const end = (e: Event) => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', end); el.removeEventListener('pointercancel', end); removeEventListener('keydown', escape);
      cancelAnimationFrame(frame);
      options.zones().forEach(zone => zone.classList.remove('is-armed'));
      options.host.classList.remove('is-dragging');
      if (!ghost) return;
      const g = ghost, zone = e.type === 'pointerup' ? over : null;
      ghost = null; over?.classList.remove('is-over'); over = null;
      if (zone) { flyInto(el, zone, options.host, g).then(() => { el.classList.remove('is-lifted'); options.onDrop(zone); }); return; }
      g.animate([{ transform: g.style.transform }, { transform: `translate(0px, 0px) rotate(${rot}deg) scale(1)` }], { duration: reduced() ? 0 : 380, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'forwards' })
        .finished.then(() => { g.remove(); el.classList.remove('is-lifted'); });
    };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && ghost) { e.preventDefault(); end(new Event('cancel')); } };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    addEventListener('keydown', escape);
  });
}
