// PROTOTYPE round 4, H04: brush-pen ink. Each stroke is a filled outline whose width swells and tapers like a brush pen.
type P = [number, number];
let seed = 3;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
export const reseed = (value: number) => { seed = value; };
const f = (n: number) => Math.round(n * 10) / 10;
const pt = (p: P) => `${f(p[0])},${f(p[1])}`;

function spline(points: P[], steps: number, closed: boolean): P[] {
  const src = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]];
  const out: P[] = [];
  for (let i = 1; i < src.length - 2; i++) {
    const [p0, p1, p2, p3] = [src[i - 1], src[i], src[i + 1], src[i + 2]];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const c = (k: 0 | 1) => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      out.push([c(0), c(1)]);
    }
  }
  out.push(closed ? out[0] : points[points.length - 1]);
  return out;
}

/** A brush-pen stroke through `points` (Catmull-Rom), as a filled path. Open strokes taper at both ends. */
export function brush(points: P[], width = 4, closed = false) {
  const jittered = points.map(([x, y]) => [x + (rnd() - .5) * .8, y + (rnd() - .5) * .8] as P);
  const steps = points.length === 2 ? 14 : 9;
  const pts = spline(jittered, steps, closed);
  const n = pts.length, phase = rnd() * 6, left: P[] = [], right: P[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
    const t = i / (n - 1), end = closed ? 1 : Math.min(1, t / .2, (1 - t) / .2);
    const w = width * (.22 + .78 * Math.pow(Math.max(0, end), .55)) * (1 + .22 * Math.sin(i * .3 + phase)) / 2;
    left.push([p[0] - dy * w, p[1] + dx * w]);
    right.push([p[0] + dy * w, p[1] - dx * w]);
  });
  if (closed) return `M${left.map(pt).join('L')}Z M${right.reverse().map(pt).join('L')}Z`;
  return `M${left.map(pt).join('L')}L${right.reverse().map(pt).join('L')}Z`;
}
export const ink = (d: string, cls = '') => `<path d="${d}" class="h04-ink ${cls}" />`;
/** Several strokes at once. */
export const strokes = (list: P[][], width = 4) => list.map(points => ink(brush(points, width))).join('');
/** Wobbly closed ellipse outline, as brush ink. */
export function oval(cx: number, cy: number, rx: number, ry: number, width = 4) {
  const points: P[] = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; points.push([cx + Math.cos(a) * rx * (1 + (rnd() - .5) * .05), cy + Math.sin(a) * ry * (1 + (rnd() - .5) * .05)]); }
  return ink(brush(points, width, true), 'h04-even');
}
/** A ruled box inked with four separate strokes that overshoot the corners a little. */
export function box(x: number, y: number, w: number, h: number, width = 4) {
  const o = 3;
  return strokes([[[x - o, y], [x + w + o, y]], [[x + w, y - o], [x + w, y + h + o]], [[x + w + o, y + h], [x - o, y + h]], [[x, y + h + o], [x, y - o]]], width);
}
/** Radiating speed lines around a centre. */
export function burstLines(cx: number, cy: number, inner: number, outer: number, count: number, width = 3) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rnd() * .12, r1 = inner + rnd() * inner * .5, r2 = outer * (.75 + rnd() * .25);
    out += ink(brush([[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], width * (.6 + rnd() * .8)));
  }
  return out;
}
/** Spiky sound-effect burst outline points (for the verdict). */
export function starburst(cx: number, cy: number, r: number, spikes = 13) {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * (.62 + rnd() * .08) : r * (.92 + rnd() * .14);
    pts.push(`${f(cx + Math.cos(a) * rr * 1.18)},${f(cy + Math.sin(a) * rr * .86)}`);
  }
  return pts.join(' ');
}
