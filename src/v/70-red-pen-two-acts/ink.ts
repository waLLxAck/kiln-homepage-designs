// PROTOTYPE H05 — the red pen. Margin notes that sit next to what they point at (desktop) or between the blocks (phone),
// plus marks (circles, loops, boxes, underlines) and arrows drawn in one SVG over the sheet. Everything draws on once it's in view.
import { arrow, ellipse, line, reseed } from '../r3-kit/rough';

export type Mark = 'circle' | 'loop' | 'box' | 'underline' | 'none';
type Side = 'right' | 'above' | 'below';
export type InkNote = {
  id: string; when: string; until?: string; target: string; mark: Mark; side: Side;
  /** For above/below: measure the vertical position from this element instead of the target. */
  ref?: string; dx?: number; dy?: number; w?: number; noArrow?: boolean; bend?: number;
  /** Phone only: keep the note's space from the start (still invisible), so the layout doesn't jump when it arrives. */
  reserve?: boolean;
};
export type InkMark = { id: string; when: string; target: string; mark: Mark; pad?: number } | { id: string; when: string; from: string; to: string; mark: 'link' };

type Rect = { x: number; y: number; w: number; h: number };
const pad = (r: Rect, p: number): Rect => ({ x: r.x - p, y: r.y - p, w: r.w + p * 2, h: r.h + p * 2 });
const path = (d: string, i = 0) => `<path d="${d}" class="h5-s" pathLength="1" style="--i:${i}"/>`;

export function markPath(mark: Mark, r: Rect, seed = 1) {
  reseed(seed);
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  if (mark === 'circle') return ellipse(cx, cy, r.w / 2 + Math.min(14, 6 + r.w * .05), r.h / 2 + 6, .05, 1.08);
  if (mark === 'loop') {
    const a = r.w / 2 + 10, b = r.h / 2 + 9, n = 96, phase = seed % 6;
    let d = '';
    for (let i = 0; i <= n * 1.07; i++) {
      const t = -1.9 + (i / n) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), wob = 1 + .01 * Math.sin(t * 3 + phase) + (i / n) * .02;
      d += `${i ? 'L' : 'M'}${(cx + Math.sign(c) * Math.pow(Math.abs(c), .35) * a * wob).toFixed(1)},${(cy + Math.sign(s) * Math.pow(Math.abs(s), .35) * b * wob).toFixed(1)} `;
    }
    return d;
  }
  if (mark === 'box') { const b = pad(r, 5); return `${line(b.x, b.y, b.x + b.w, b.y, 1.4)} ${line(b.x + b.w, b.y, b.x + b.w, b.y + b.h, 1.4)} ${line(b.x + b.w, b.y + b.h, b.x, b.y + b.h, 1.4)} ${line(b.x, b.y + b.h, b.x + 4, b.y - 3, 1.4)}`; }
  if (mark === 'underline') return `${line(r.x - 2, r.y + r.h + 3, r.x + r.w + 4, r.y + r.h + 1, 1.1)} ${line(r.x + 8, r.y + r.h + 8, r.x + r.w - 6, r.y + r.h + 7, 1.1)}`;
  return '';
}

function arrowPath(from: Rect, to: Rect, bendSign: number) {
  const fc = { x: from.x + from.w / 2, y: from.y + from.h / 2 }, tc = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  let sx: number, sy: number;
  if (tc.x > from.x + from.w + 10) { sx = from.x + from.w + 6; sy = Math.min(Math.max(tc.y, from.y + 10), from.y + from.h - 4); }
  else if (tc.x < from.x - 10) { sx = from.x - 8; sy = Math.min(Math.max(tc.y, from.y + 10), from.y + from.h - 4); }
  else if (tc.y > fc.y) { sx = Math.min(Math.max(tc.x, from.x + 12), from.x + from.w - 12); sy = from.y + from.h + 4; }
  else { sx = Math.min(Math.max(tc.x, from.x + 12), from.x + from.w - 12); sy = from.y - 6; }
  const ex = Math.min(Math.max(sx, to.x), to.x + to.w), ey = Math.min(Math.max(sy, to.y), to.y + to.h);
  const dist = Math.hypot(ex - sx, ey - sy);
  if (dist < 18) return '';
  return arrow(sx, sy, ex, ey, bendSign * Math.min(26, dist * .16), Math.min(12, 6 + dist * .05));
}

export function createInk(sheet: HTMLElement, notes: InkNote[], marks: InkMark[], isDesk: () => boolean) {
  const svg = sheet.querySelector<SVGSVGElement>(':scope > [data-ink]')!;
  const auto = navigator.webdriver, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const states = new Set<string>(), on = new Set<string>(), pending = new Set<string>(), seen = new Set<string>();
  let nextAt = 0;
  const quiet = new Set(notes.filter(note => note.noArrow).map(note => note.id));
  const noteEl = (id: string) => sheet.querySelector<HTMLElement>(`[data-note="${id}"]`);
  const rel = (el: Element): Rect => { const r = el.getBoundingClientRect(), s = sheet.getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }; };
  const live = (note: InkNote) => states.has(note.when) && !(note.until && states.has(note.until));
  const visible = (el: Element | null): el is HTMLElement => !!el && (el as HTMLElement).offsetParent !== null && el.getBoundingClientRect().width > 0;

  function place() {
    const desk = isDesk();
    const margin = sheet.querySelector('[data-margin]');
    const rightX = margin ? rel(margin).x : 0;
    const column: { el: HTMLElement; y: number }[] = [];
    for (const note of notes) {
      const el = noteEl(note.id);
      if (!el) continue;
      el.hidden = !(live(note) || (!desk && note.reserve && !note.until));
      if (el.hidden || !desk) { el.style.left = el.style.top = el.style.width = ''; continue; }
      const target = sheet.querySelector(note.target);
      if (!visible(target)) { el.hidden = true; continue; }
      el.style.width = `${note.w ?? 170}px`;
      const t = rel(target), h = el.offsetHeight, dx = note.dx ?? 0, dy = note.dy ?? 0;
      if (note.side === 'right') { column.push({ el, y: t.y + t.h / 2 - h / 2 + dy }); el.style.left = `${rightX + dx}px`; continue; }
      const ref = note.ref ? sheet.querySelector(note.ref) : target, r = ref ? rel(ref) : t;
      el.style.left = `${t.x + dx}px`;
      el.style.top = `${note.side === 'above' ? r.y - h - 14 + dy : r.y + r.h + 14 + dy}px`;
    }
    // Margin comments: keep each one level with its target, pushing down only to avoid overlaps.
    column.sort((a, b) => a.y - b.y);
    let floor = -Infinity;
    for (const item of column) { const y = Math.max(item.y, floor); item.el.style.top = `${y}px`; floor = y + item.el.offsetHeight + 12; }
  }

  function draw() {
    const w = sheet.offsetWidth, h = sheet.offsetHeight, desk = isDesk();
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h));
    let out = '';
    notes.forEach((note, n) => {
      const el = noteEl(note.id), target = sheet.querySelector(note.target);
      if (!el || el.hidden || !live(note) || !visible(target)) return;
      const t = rel(target), p = rel(el);
      const m = markPath(note.mark, note.mark === 'circle' ? pad(t, 1) : note.mark === 'loop' ? t : pad(t, 3), 101 + n * 17);
      const markBox = note.mark === 'circle' || note.mark === 'loop' ? pad(t, 12) : pad(t, 5);
      // Phone: only the note nearest its target draws an arrow, so no arrow runs through another note.
      const sib = (dir: 'previousElementSibling' | 'nextElementSibling') => { let n = el[dir]; while (n && ((n as HTMLElement).hidden || quiet.has((n as HTMLElement).dataset.note ?? ''))) n = n[dir]; return !!n; };
      const blocked = !desk && (p.y > t.y ? sib('previousElementSibling') : sib('nextElementSibling'));
      const near = desk || (!blocked && Math.abs((p.y + p.h / 2) - (t.y + t.h / 2)) < 240);
      reseed(301 + n * 13);
      const a = note.noArrow || !near ? '' : arrowPath(p, markBox, note.bend ?? (n % 2 ? 1 : -1));
      out += `<g class="h5-mark${on.has(note.id) ? ' is-on' : ''}" data-mark="${note.id}">${m ? path(m, 0) : ''}${a ? path(a, 1) : ''}</g>`;
    });
    marks.forEach((mark, n) => {
      if (!states.has(mark.when)) return;
      let d = '';
      if (mark.mark === 'link') {
        const from = sheet.querySelector(mark.from), to = sheet.querySelector(mark.to);
        if (!desk || !visible(from) || !visible(to)) return;
        const f = rel(from), t = rel(to);
        reseed(71 + n);
        d = arrow(f.x + f.w + 10, f.y + f.h * .42, t.x - 12, f.y + f.h * .42 + 18, -22, 13);
      } else {
        const target = sheet.querySelector(mark.target);
        if (!visible(target)) return;
        d = markPath(mark.mark, pad(rel(target), mark.pad ?? 0), 51 + n * 23);
      }
      out += `<g class="h5-mark${on.has(mark.id) ? ' is-on' : ''}" data-mark="${mark.id}">${path(d)}</g>`;
    });
    svg.innerHTML = out;
  }

  function turnOn(id: string) {
    if (on.has(id) || pending.has(id)) return;
    pending.add(id);
    const apply = () => {
      pending.delete(id); on.add(id);
      sheet.querySelector(`[data-mark="${id}"]`)?.classList.add('is-on');
      noteEl(id)?.classList.add('is-on');
      sheet.querySelectorAll(`[data-hl="${id}"]`).forEach(el => el.classList.add('is-on'));
    };
    if (auto || reduced) { apply(); return; }
    // Stagger so the pen visibly moves from one note to the next.
    const now = performance.now(), at = Math.max(now, nextAt);
    nextAt = at + 420;
    setTimeout(() => { requestAnimationFrame(() => requestAnimationFrame(apply)); }, at - now);
  }

  // Watch what each note points at (the notes themselves are clipped until they write on, so they never "intersect").
  const waiting = new Map<Element, string[]>();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const ids = waiting.get(entry.target) ?? [];
    waiting.delete(entry.target); observer!.unobserve(entry.target);
    ids.forEach(turnOn);
  }), { threshold: .5, rootMargin: '0px 0px -10% 0px' }) : undefined;

  function arm() {
    const all: { id: string; el: Element | null }[] = [
      ...notes.filter(live).map(note => ({ id: note.id, el: sheet.querySelector(note.target) })),
      ...marks.filter(mark => states.has(mark.when)).map(mark => ({ id: mark.id, el: sheet.querySelector('target' in mark ? mark.target : mark.to) })),
    ];
    for (const { id, el: found } of all) {
      if (seen.has(id) || !found) continue;
      // Panel rows are repainted on every change, so watch the stable panel rather than a cell inside it.
      const el = found.closest('[data-panel]') ?? found;
      seen.add(id);
      if (auto || reduced || !observer) { turnOn(id); continue; }
      const list = waiting.get(el);
      if (list) list.push(id); else { waiting.set(el, [id]); observer.observe(el); }
    }
  }

  const refresh = () => { place(); draw(); };
  new ResizeObserver(refresh).observe(sheet);
  return {
    refresh,
    reach(state: string) { states.add(state); refresh(); arm(); },
    has: (state: string) => states.has(state),
  };
}
export type Ink = ReturnType<typeof createInk>;
