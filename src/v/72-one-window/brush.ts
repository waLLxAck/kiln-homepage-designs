// PROTOTYPE H12: brush-pen strokes, drawn as filled outlines whose width follows a pen pressure curve (fast attack,
// wobbling body, dry tail). Seeded, so every render wobbles the same way. Only used for the hand-drawn half of the page.
let seed = 3;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const j = (a: number) => (rnd() - .5) * 2 * a;
const f = (n: number) => Math.round(n * 10) / 10;
export const reseed = (value: number) => { seed = value; };
export type Pt = [number, number];
type BrushOptions = { wobble?: number; attack?: number; tail?: number; min?: number };

/** Chaikin smoothing: corners soften the way a brush turns them. */
function smooth(points: Pt[], rounds = 2): Pt[] {
  let p = points;
  for (let r = 0; r < rounds; r++) {
    const out: Pt[] = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i], [bx, by] = p[i + 1];
      out.push([ax * .78 + bx * .22, ay * .78 + by * .22], [ax * .22 + bx * .78, ay * .22 + by * .78]);
    }
    out.push(p[p.length - 1]);
    p = out;
  }
  return p;
}

function resample(p: Pt[], step: number): Pt[] {
  const out: Pt[] = [p[0]];
  let carry = 0;
  for (let i = 1; i < p.length; i++) {
    const [ax, ay] = p[i - 1], [bx, by] = p[i], len = Math.hypot(bx - ax, by - ay);
    let d = step - carry;
    while (d <= len) { const t = d / len; out.push([ax + (bx - ax) * t, ay + (by - ay) * t]); d += step; }
    carry = len - (d - step);
  }
  out.push(p[p.length - 1]);
  return out;
}

/** One brush stroke through `points`, as a closed, filled outline. */
export function brush(points: Pt[], width = 5, o: BrushOptions = {}) {
  const wob = o.wobble ?? 1.2, attack = o.attack ?? .07, tail = o.tail ?? .32, min = o.min ?? .28;
  const p = resample(smooth(points.map(([x, y]) => [x + j(wob), y + j(wob)] as Pt), 2), 2.6);
  const n = p.length;
  if (n < 2) return '';
  const left: Pt[] = [], right: Pt[] = [];
  let drift = 0;
  for (let i = 0; i < n; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
    const t = i / (n - 1);
    drift = drift * .86 + j(.16);
    const press = Math.pow(Math.min(1, t / attack), .5) * (1 - Math.max(0, (t - (1 - tail)) / tail) * (1 - min));
    const w = Math.max(.35, width * (min + (1 - min) * press) * (1 + drift)) / 2;
    left.push([p[i][0] - ty * w, p[i][1] + tx * w]);
    right.push([p[i][0] + ty * w, p[i][1] - tx * w]);
  }
  const [ex, ey] = p[n - 1], [sx, sy] = p[0];
  const [ptx, pty] = [ex - p[n - 2][0], ey - p[n - 2][1]], [stx, sty] = [p[1][0] - sx, p[1][1] - sy];
  return `M${f(left[0][0])},${f(left[0][1])}${left.slice(1).map(q => `L${f(q[0])},${f(q[1])}`).join('')}`
    + `Q${f(ex + ptx * .9)},${f(ey + pty * .9)} ${f(right[n - 1][0])},${f(right[n - 1][1])}`
    + `${right.slice(0, -1).reverse().map(q => `L${f(q[0])},${f(q[1])}`).join('')}`
    + `Q${f(sx - stx * .9)},${f(sy - sty * .9)} ${f(left[0][0])},${f(left[0][1])}Z`;
}

const path = (d: string, cls = 'h12-ink') => `<path class="${cls}" d="${d}"/>`;

/** Quadratic curve sampled into points, with a sideways bend. */
function curve(x1: number, y1: number, x2: number, y2: number, bend: number, steps = 18): Pt[] {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const cx = mx - (y2 - y1) / len * bend, cy = my + (x2 - x1) / len * bend;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps, u = 1 - t;
    return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2] as Pt;
  });
}

/** An open folder the way people doodle one: the U of the body, then the top edge with its tab, then the front lip. */
export function folderInk(w: number, h: number, s: number) {
  reseed(s);
  const wash: Pt[] = [[10, 26], [w * .5, 22 + j(3)], [w - 6, 28], [w - 8, h - 8], [w * .45, h - 4 + j(3)], [12, h - 10]];
  return `<svg class="h12-folder-ink" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    ${path(brush(wash.map(([x, y]) => [x + 5, y + 6] as Pt), 26, { wobble: 4, min: .6, attack: .02, tail: .1 }), 'h12-wash')}
    ${path(brush([[8, 20], [6, h - 6], [w - 7, h - 8], [w - 6, 22]], 4.4, { wobble: 1.6 }))}
    ${path(brush([[4, 17], [7, 5], [w * .33, 4], [w * .39, 18], [w - 3, 19]], 3.8, { wobble: 1.4, tail: .4 }))}
    ${path(brush([[10, 36 + j(2)], [w * .6, 33], [w - 12, 36]], 2.2, { wobble: 1.2, min: .15 }))}
  </svg>`;
}

/** The little dog-eared page every skill file gets. `kind` swaps in a link or an empty folder. */
export function docInk(s: number, kind: 'file' | 'broken' | 'empty' = 'file') {
  reseed(s);
  if (kind === 'empty') return `<svg class="h12-doc" viewBox="0 0 22 20" aria-hidden="true">${path(brush([[2, 6], [2, 18], [20, 18], [20, 7], [10, 7], [8, 3], [2, 3], [2, 7]], 1.5, { wobble: .5, min: .5 }))}</svg>`;
  const page = path(brush([[12, 2], [3, 2.5], [3, 18], [16, 17.6], [16, 7]], 1.6, { wobble: .5, min: .45 }))
    + path(brush([[11.5, 2], [11.8, 7], [16.4, 6.8], [12, 2]], 1.2, { wobble: .4, min: .5 }));
  if (kind === 'broken') return `<svg class="h12-doc" viewBox="0 0 22 20" aria-hidden="true">${page}${path(brush([[0, 16], [21, 3]], 1.8, { wobble: .6 }), 'h12-ink h12-cut')}</svg>`;
  return `<svg class="h12-doc" viewBox="0 0 22 20" aria-hidden="true">${page}</svg>`;
}

/** A brush arrow with a two-flick head. */
export function arrowInk(w: number, h: number, from: Pt, to: Pt, bend: number, s: number, width = 3.2) {
  reseed(s);
  const pts = curve(from[0], from[1], to[0], to[1], bend);
  const [bx, by] = pts[pts.length - 3], dx = to[0] - bx, dy = to[1] - by, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const wing = (sign: number): Pt[] => { const a = sign * .55, rx = ux * Math.cos(a) - uy * Math.sin(a), ry = ux * Math.sin(a) + uy * Math.cos(a); return [[to[0] - rx * 15, to[1] - ry * 15], [to[0] + ux, to[1] + uy]]; };
  return `<svg class="h12-arrow" viewBox="0 0 ${w} ${h}" aria-hidden="true">${path(brush(pts, width, { wobble: .8 }))}${path(brush(wing(1), width * .8, { wobble: .4 }))}${path(brush(wing(-1), width * .8, { wobble: .4 }))}</svg>`;
}

/** A loose loop drawn around something, overshooting where it closes. */
export function loopInk(w: number, h: number, s: number, width = 2.6) {
  reseed(s);
  const cx = w / 2, cy = h / 2, rx = w / 2 - 6, ry = h / 2 - 5, pts: Pt[] = [];
  for (let i = 0; i <= 44; i++) { const a = -2.2 + (i / 40) * Math.PI * 2, k = 1 + .05 * Math.sin(a * 2 + 1) + i * .0012; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return `<svg class="h12-loop" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${path(brush(pts, width, { wobble: .8, tail: .25 }))}</svg>`;
}

/** A quick underline, two passes. */
export function underInk(w: number, s: number) {
  reseed(s);
  return `<svg class="h12-under" viewBox="0 0 ${w} 14" preserveAspectRatio="none" aria-hidden="true">${path(brush([[2, 6], [w * .5, 4], [w - 2, 6]], 3.6, { wobble: .8 }))}${path(brush([[w * .12, 11], [w * .7, 9.5], [w - 10, 11]], 2.2, { wobble: .6 }))}</svg>`;
}

/** The chapter break: a slab of ink laid down in a few wide, overlapping passes with dry, ragged ends. */
export function bandInk(w: number, h: number, s: number) {
  reseed(s);
  const passes = 5, lane = h / passes;
  let out = '';
  for (let i = 0; i < passes; i++) {
    const y = lane * (i + .5) + j(4), x0 = 6 + j(10) + (i % 2) * 8, x1 = w - 8 + j(12) - (i % 3) * 6;
    out += path(brush([[x0, y + j(3)], [w * .35, y + j(5)], [w * .7, y + j(5)], [x1, y + j(3)]], lane * 1.5, { wobble: 3, attack: .03, tail: .12, min: .55 }));
  }
  return `<svg class="h12-band-ink" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${out}</svg>`;
}

/** Rough-edge filter used by every ink drawing on the page. */
export const roughFilter = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <filter id="h12-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>
  <filter id="h12-rough-band" x="-2%" y="-10%" width="104%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05 .9" numOctaves="3" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter>
</defs></svg>`;
