// PROTOTYPE 43: tiny hand-drawn stroke generator. Seeded, so every render wobbles the same way.
let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const j = (a: number) => (rnd() - .5) * 2 * a;
const f = (n: number) => Math.round(n * 10) / 10;
export const reseed = (s: number) => { seed = s; };

export type Ink = 'k' | 'b' | 'r' | 'g';
/** A stroke that draws itself when its section is revealed. */
export const s = (d: string, ink: Ink = 'k', cls = '') => `<path d="${d}" class="v43-s v43-${ink}${cls ? ` ${cls}` : ''}" pathLength="1"/>`;

export function line(x1: number, y1: number, x2: number, y2: number, w = 1.5) {
  const mx = (x1 + x2) / 2 + j(w * 1.6), my = (y1 + y2) / 2 + j(w * 1.6);
  return `M${f(x1 + j(w))},${f(y1 + j(w))} Q${f(mx)},${f(my)} ${f(x2 + j(w))},${f(y2 + j(w))}`;
}
export function rect(x: number, y: number, w: number, h: number, k = 2) {
  return [line(x - k, y, x + w + k * .6, y, k * .6), line(x + w, y - k * .6, x + w, y + h + k, k * .6), line(x + w + k * .6, y + h, x - k, y + h, k * .6), line(x, y + h + k * .6, x, y - k, k * .6)].join(' ');
}
export function ellipse(cx: number, cy: number, rx: number, ry: number, k = .035, turns = 1.08, start = -1.8) {
  const n = 64, ph = rnd() * 6;
  let d = '';
  for (let i = 0; i <= n * turns; i++) {
    const a = start + (i / n) * Math.PI * 2;
    const wob = 1 + k * Math.sin(a * 2 + ph) + (i / n) * k;
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rx * wob)},${f(cy + Math.sin(a) * ry * wob)} `;
  }
  return d;
}
/** Curved arrow from (x1,y1) to (x2,y2); bend pushes the control point sideways. */
export function arrow(x1: number, y1: number, x2: number, y2: number, bend = 0, head = 14) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const cx = mx - (y2 - y1) / len * bend, cy = my + (x2 - x1) / len * bend;
  const tx = x2 - cx, ty = y2 - cy, tl = Math.hypot(tx, ty) || 1;
  const ux = tx / tl, uy = ty / tl;
  const wing = (sign: number) => { const a = sign * .5; const rx = ux * Math.cos(a) - uy * Math.sin(a), ry = ux * Math.sin(a) + uy * Math.cos(a); return `M${f(x2 - rx * head + j(1))},${f(y2 - ry * head + j(1))} L${f(x2)},${f(y2)}`; };
  return `M${f(x1)},${f(y1)} Q${f(cx + j(3))},${f(cy + j(3))} ${f(x2)},${f(y2)} ${wing(1)} ${wing(-1)}`;
}
export function stick(x: number, y: number, k = 1, wave = false) {
  const h = (n: number) => n * k;
  return [ellipse(x, y, h(16), h(18), .05, 1.05), line(x, y + h(18), x + h(2), y + h(70), 1),
    wave ? line(x + h(1), y + h(34), x + h(34), y + h(6), 1) : line(x + h(1), y + h(34), x + h(30), y + h(52), 1),
    line(x + h(1), y + h(34), x - h(28), y + h(54), 1), line(x + h(2), y + h(70), x - h(20), y + h(108), 1), line(x + h(2), y + h(70), x + h(22), y + h(108), 1)].join(' ');
}
export function bubble(x: number, y: number, w: number, h: number, tailX: number, tailY: number, at = .3) {
  return `${ellipse(x + w / 2, y + h / 2, w / 2, h / 2, .03, 1.02, 1.2)} ${line(x + w * at, y + h * .93, tailX, tailY, 1)} ${line(tailX, tailY, x + w * (at + .15), y + h * .99, 1)}`;
}
export function check(x: number, y: number, k = 1) { return `M${f(x)},${f(y + 10 * k)} L${f(x + 8 * k)},${f(y + 19 * k)} L${f(x + 24 * k)},${f(y - 4 * k)}`; }
export function cross(x: number, y: number, r = 10) { return `${line(x - r, y - r, x + r, y + r, 1)} ${line(x + r, y - r, x - r, y + r, 1)}`; }
export function scribble(x: number, y: number, w: number, rows = 3, gap = 9) {
  let d = `M${f(x)},${f(y)}`;
  for (let i = 0; i < rows; i++) d += ` L${f(x + w + j(3))},${f(y + i * gap + j(2))} L${f(x + j(3))},${f(y + (i + .5) * gap + j(2))}`;
  return d;
}
