// PROTOTYPE H05 — pointer-event dragging (mouse, pen and touch) with a keyboard/tap fallback that flies the same ghost.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

type DragOptions = {
  host: HTMLElement;
  zones: () => HTMLElement[];
  enabled?: () => boolean;
  onDrop: (zone: HTMLElement) => void;
};

function makeGhost(el: HTMLElement, host: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const ghost = el.cloneNode(true) as HTMLElement;
  ghost.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  ghost.querySelectorAll('button, a').forEach(node => node.setAttribute('tabindex', '-1'));
  ghost.classList.add('h5-ghost');
  ghost.setAttribute('aria-hidden', 'true');
  Object.assign(ghost.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${el.offsetWidth}px`, margin: '0', zIndex: '1000', pointerEvents: 'none' });
  host.appendChild(ghost);
  return { ghost, rect };
}

const centreShift = (rect: DOMRect, zone: HTMLElement) => {
  const z = zone.getBoundingClientRect();
  return { x: z.left + z.width / 2 - (rect.left + rect.width / 2), y: z.top + Math.min(z.height / 2, 110) - (rect.top + rect.height / 2) };
};

/** Fly a copy of `el` into `zone` (the keyboard and tap path), then call `done`. */
export async function flyInto(el: HTMLElement, zone: HTMLElement, host: HTMLElement, done: () => void) {
  if (reduced()) { done(); return; }
  const { ghost, rect } = makeGhost(el, host);
  const to = centreShift(rect, zone);
  zone.classList.add('is-over');
  await ghost.animate([
    { transform: 'translate(0,0) rotate(0deg) scale(1)' },
    { transform: `translate(${to.x * .45}px, ${to.y * .45 - 60}px) rotate(-4deg) scale(1.04)`, offset: .45 },
    { transform: `translate(${to.x}px, ${to.y}px) rotate(2deg) scale(.32)`, opacity: .15 },
  ], { duration: 720, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'forwards' }).finished;
  ghost.remove();
  zone.classList.remove('is-over');
  done();
}

export function draggable(el: HTMLElement, options: DragOptions) {
  let start: { x: number; y: number; id: number } | null = null;
  let drag: { ghost: HTMLElement; rect: DOMRect } | null = null;
  let over: HTMLElement | null = null, pointer = { x: 0, y: 0 }, frame = 0;

  const hit = () => {
    const zone = options.zones().find(candidate => { const r = candidate.getBoundingClientRect(); return pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom; }) ?? null;
    if (zone !== over) { over?.classList.remove('is-over'); zone?.classList.add('is-over'); over = zone; }
  };
  const move = () => {
    if (!drag || !start) return;
    drag.ghost.style.transform = `translate(${pointer.x - start.x}px, ${pointer.y - start.y}px) rotate(-3deg) scale(1.03)`;
    hit();
  };
  // Edge scrolling, so a phone visitor can carry a card to a drop zone below the fold.
  const tick = () => {
    if (!drag) return;
    const edge = 70, speed = pointer.y > innerHeight - edge ? 12 : pointer.y < edge ? -12 : 0;
    if (speed) { scrollBy(0, speed); hit(); }
    frame = requestAnimationFrame(tick);
  };
  const lift = () => {
    drag = makeGhost(el, options.host);
    el.classList.add('is-lifted');
    options.host.classList.add('is-dragging');
    options.zones().forEach(zone => zone.classList.add('is-armed'));
    frame = requestAnimationFrame(tick);
  };
  const settle = async (dropped: boolean) => {
    cancelAnimationFrame(frame);
    const current = drag!, zone = over;
    drag = null; start = null; over = null;
    options.zones().forEach(item => item.classList.remove('is-armed'));
    options.host.classList.remove('is-dragging');
    const from = current.ghost.style.transform;
    if (dropped && zone) {
      const to = centreShift(current.rect, zone);
      await current.ghost.animate([{ transform: from }, { transform: `translate(${to.x}px, ${to.y}px) rotate(0deg) scale(.3)`, opacity: .1 }], { duration: reduced() ? 0 : 280, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }).finished;
      current.ghost.remove(); zone.classList.remove('is-over'); el.classList.remove('is-lifted');
      options.onDrop(zone);
    } else {
      zone?.classList.remove('is-over');
      await current.ghost.animate([{ transform: from }, { transform: 'translate(0,0) rotate(0deg) scale(1)' }], { duration: reduced() ? 0 : 320, easing: 'cubic-bezier(.2,1.2,.4,1)', fill: 'forwards' }).finished;
      current.ghost.remove(); el.classList.remove('is-lifted');
    }
  };

  el.addEventListener('pointerdown', event => {
    if (event.button !== 0 || (event.target as Element).closest('button, a, select, input')) return;
    if (options.enabled && !options.enabled()) return;
    start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    pointer = { x: event.clientX, y: event.clientY };
    el.setPointerCapture(event.pointerId);
  });
  el.addEventListener('pointermove', event => {
    if (!start || event.pointerId !== start.id) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!drag) { if (Math.hypot(pointer.x - start.x, pointer.y - start.y) < 6) return; lift(); }
    move();
  });
  el.addEventListener('pointerup', event => {
    if (!start || event.pointerId !== start.id) return;
    if (drag) settle(true); else start = null;
  });
  el.addEventListener('pointercancel', () => { if (drag) settle(false); else start = null; });
  el.addEventListener('lostpointercapture', () => { if (drag) settle(!!over); });
  addEventListener('keydown', event => { if (drag && event.key === 'Escape') { over?.classList.remove('is-over'); over = null; settle(false); } });
}
