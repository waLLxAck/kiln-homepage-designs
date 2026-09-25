// PROTOTYPE H09: crayon drawing helpers. Seeded wobble so the "child" draws the same picture every time.
// Lines overshoot their corners, text wobbles glyph by glyph, and fills are back-and-forth scribbles, like a real crayon.

let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
export const reseed = (value: number) => { seed = value; };
const j = (a: number) => (rnd() - .5) * 2 * a;
const f = (n: number) => Math.round(n * 10) / 10;
export type Pt = [number, number];

export const crayons = {
  red: '#e0352b', blue: '#2458d3', green: '#219a46', orange: '#f07a16', yellow: '#f4b400', purple: '#7d4bc8', brown: '#8a4b25', graphite: '#2c2b30',
} as const;
export type Crayon = keyof typeof crayons;

/** Paper tooth + wax: wobble the geometry a little, then knock holes where the crayon skipped over the grain. */
export const filters = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <filter id="h09-wax" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2400" height="2400" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="wobbled"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.95 0.55" numOctaves="3" seed="8" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -.8" result="tooth"/>
    <feComposite in="wobbled" in2="tooth" operator="in"/>
  </filter>
  <filter id="h09-wax-soft" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2400" height="2400" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="1.1 0.6" numOctaves="2" seed="5" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -.8" result="tooth"/>
    <feComposite in="SourceGraphic" in2="tooth" operator="in"/>
  </filter>
</defs></svg>`;

/** A child's straight line: it wobbles along the way and overshoots both ends. */
export function wline(x1: number, y1: number, x2: number, y2: number, amp = 2.4, over = 6) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  const a = over * (.3 + rnd()), b = over * (.3 + rnd());
  const sx = x1 - ux * a, sy = y1 - uy * a, ex = x2 + ux * b, ey = y2 + uy * b;
  const n = Math.max(2, Math.round(len / 26));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, px = -uy, py = ux, off = i === 0 || i === n ? j(amp * .4) : j(amp);
    pts.push([sx + (ex - sx) * t + px * off, sy + (ey - sy) * t + py * off]);
  }
  return smooth(pts);
}
export function smooth(pts: Pt[]) {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${f(pts[i][0])},${f(pts[i][1])} ${f(mx)},${f(my)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${f(last[0])},${f(last[1])}`;
}
/** Outline a polygon edge by edge (corners overshoot), optionally going round twice. */
export function outline(pts: Pt[], amp = 2.4, twice = false) {
  const edges = (k: number) => pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return wline(p[0] + j(k), p[1] + j(k), q[0] + j(k), q[1] + j(k), amp); }).join(' ');
  return twice ? `${edges(0)} ${edges(2.4)}` : edges(0);
}
export function folderPts(w: number, h: number): Pt[] {
  return [[0, 12], [0, h], [w, h], [w, 12], [w * .46, 12], [w * .38, 0], [4, 0]];
}
/** Wobbly closed loop (sun, heads, rings), going a little past the start the way a crayon does. */
export function loop(cx: number, cy: number, rx: number, ry: number, k = .07, turns = 1.12) {
  const n = 40, phase = rnd() * 6, pts: Pt[] = [];
  for (let i = 0; i <= n * turns; i++) {
    const a = -1.7 + (i / n) * Math.PI * 2, w = 1 + k * Math.sin(a * 3 + phase) + j(k * .5);
    pts.push([cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w]);
  }
  return smooth(pts);
}
/** Back-and-forth colouring that covers a w x h box at an angle; clip it to the shape it's filling. */
export function zigzag(x: number, y: number, w: number, h: number, gap = 7, angle = -18) {
  const cx = x + w / 2, cy = y + h / 2, r = Math.hypot(w, h) / 2 + 6;
  const rad = angle * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
  const rot = (px: number, py: number): Pt => [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c];
  const pts: Pt[] = [];
  for (let i = 0, px = cx - r; px <= cx + r; i++, px += gap) {
    const top = rot(px + j(2), cy - r + j(5)), bottom = rot(px + gap / 2 + j(2), cy + r + j(5));
    pts.push(i % 2 ? bottom : top, i % 2 ? top : bottom);
  }
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])},${f(p[1])}`).join(' ');
}
/** A strip of colouring for a highlighter swash: vertical back-and-forth strokes moving left to right. */
export function swash(w: number, h: number, gap = 9) {
  const pts: Pt[] = [];
  for (let x = 4, i = 0; x < w; x += gap, i++) pts.push([x + j(2), i % 2 ? h - 6 + j(4) : 6 + j(4)]);
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])},${f(p[1])}`).join(' ');
}
/** Handwriting where every letter leans its own way and sits at its own height. */
export function kid(x: number, y: number, text: string, size = 20, color: Crayon = 'graphite', rotate = 0, anchor = 'start', cls = '') {
  const glyphs = [...text];
  const rot = glyphs.map(() => f(j(9))).join(' ');
  let prev = 0;
  const dy = glyphs.map(() => { const next = j(size * .09); const d = f(next - prev); prev = next; return d; }).join(' ');
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${crayons[color]}" stroke="${crayons[color]}" stroke-width="${f(size * .03)}" text-anchor="${anchor}" rotate="${rot}" dy="${dy}" class="h09-kidtext ${cls}" ${rotate ? `transform="rotate(${rotate} ${x} ${y})"` : ''}>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
}
export const path = (d: string, color: Crayon, width = 4.5, extra = '') => `<path d="${d}" fill="none" stroke="${crayons[color]}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export const inflate = (pts: Pt[], by: number, w: number, h: number): Pt[] => pts.map(([x, y]) => [x + (x < w / 2 ? -by : by), y + (y < h / 2 ? -by : by)]);
export const polyAttr = (pts: Pt[]) => pts.map(p => `${f(p[0])},${f(p[1])}`).join(' ');
