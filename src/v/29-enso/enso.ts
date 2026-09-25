// PROTOTYPE 26: procedural ensō. A brush circle drawn as filled outlines with varying width and a dry-brush tail.
type Point = [number, number];

const cx = 300, cy = 300, R = 226;
const start = 152 * Math.PI / 180;
const sweep = 338 * Math.PI / 180;
const smooth = (a: number, b: number, t: number) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };

function seeded(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}

const angle = (t: number) => start + sweep * t;
const radius = (t: number) => R * (1 - .085 * smooth(.62, 1, t)) + 5 * Math.sin(t * Math.PI * 3 + .7);
const centre = (t: number): Point => { const a = angle(t), r = radius(t); return [cx + r * Math.cos(a), cy + r * Math.sin(a) * .985]; };
const normal = (t: number): Point => { const a = angle(t); return [Math.cos(a), Math.sin(a)]; };
const tangent = (t: number): Point => { const a = angle(t); return [-Math.sin(a), Math.cos(a)]; };
const width = (t: number) => {
  if (t < .04) return 30 + 28 * Math.sqrt(t / .04);
  if (t < .82) return 58 - 22 * smooth(.04, .3, t) + 9 * smooth(.3, .52, t) - 27 * smooth(.52, .82, t) + 2 * Math.sin(t * 47);
  return 18 - 16 * smooth(.82, 1, t);
};

const fmt = (points: Point[]) => 'M' + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';

function band(from: number, to: number, offset: (t: number) => number, half: (t: number) => number, jitter: number, cap = false) {
  const steps = Math.max(8, Math.round((to - from) * 320));
  const outer: Point[] = [], inner: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = from + (to - from) * i / steps;
    const [x, y] = centre(t), [nx, ny] = normal(t), o = offset(t), h = Math.max(.25, half(t));
    const n1 = jitter * (Math.sin(t * 91 + 1) * .6 + Math.sin(t * 237) * .4);
    const n2 = jitter * (Math.sin(t * 73 + 2) * .6 + Math.sin(t * 181 + 4) * .4);
    outer.push([x + nx * (o + h + n1), y + ny * (o + h + n1)]);
    inner.push([x + nx * (o - h + n2), y + ny * (o - h + n2)]);
  }
  const points = [...outer, ...inner.reverse()];
  if (cap) {
    const [x, y] = centre(from), [nx, ny] = normal(from), [tx, ty] = tangent(from), h = half(from);
    for (let i = 1; i < 12; i++) {
      const a = Math.PI - Math.PI * i / 12;
      points.push([x + nx * h * Math.cos(a) - tx * h * .62 * Math.sin(a), y + ny * h * Math.cos(a) - ty * h * .62 * Math.sin(a)]);
    }
  }
  return fmt(points);
}

function centreline(from: number, to: number) {
  const points: string[] = [];
  for (let i = 0; i <= 80; i++) { const [x, y] = centre(from + (to - from) * i / 80); points.push(`${x.toFixed(1)} ${y.toFixed(1)}`); }
  return 'M' + points.join('L');
}

export function ensoSvg(id: string, label: string) {
  const random = seeded(26);
  const body = (t: number) => width(t) / 2 * (1 - smooth(.7, .9, t));
  const bristles: string[] = [];
  const count = 9;
  for (let k = 0; k < count; k++) {
    const f = -.5 + (k + .5) / count;
    const end = .86 + .14 * random();
    const thickness = .55 + .5 * random();
    const drift = (random() - .5) * 6;
    bristles.push(band(.62, end, t => f * width(t) * .92 + drift * smooth(.8, 1, t), t => width(t) / count * .5 * thickness * (1 - smooth(end - .1, end, t)), .6));
  }
  const first = band(0, .52, () => 0, body, 1.6, true);
  const second = band(.5, .9, () => 0, body, 1.6);
  return `
<svg class="v26-enso" viewBox="0 0 600 600" role="img" aria-labelledby="${id}-t">
  <title id="${id}-t">${label}</title>
  <defs>
    <filter id="${id}-ink" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" result="d"/>
      <feGaussianBlur in="d" stdDeviation="4" result="b"/>
      <feComponentTransfer in="b" result="bleed"><feFuncA type="linear" slope=".2"/></feComponentTransfer>
      <feMerge><feMergeNode in="bleed"/><feMergeNode in="d"/></feMerge>
    </filter>
    <mask id="${id}-m1" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600"><path class="v26-reveal v26-reveal-1" d="${centreline(0, .52)}" pathLength="1"/></mask>
    <mask id="${id}-m2" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600"><path class="v26-reveal v26-reveal-2" d="${centreline(.5, 1)}" pathLength="1"/></mask>
  </defs>
  <g class="v26-ink" filter="url(#${id}-ink)">
    <g mask="url(#${id}-m1)"><path d="${first}"/></g>
    <g mask="url(#${id}-m2)"><path d="${second}"/>${bristles.map(d => `<path d="${d}"/>`).join('')}</g>
  </g>
</svg>`;
}

export function sealSvg(id: string) {
  const letters = 'approved'.split('');
  return `
<svg class="v26-seal-art" viewBox="0 0 84 300" role="img" aria-labelledby="${id}-t">
  <title id="${id}-t">A vermilion seal that reads approved</title>
  <defs>
    <filter id="${id}-f" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="9" result="grain"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 3.2" result="holes"/>
      <feComposite in="SourceGraphic" in2="holes" operator="in" result="inked"/>
      <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3" result="warp"/>
      <feDisplacementMap in="inked" in2="warp" scale="3"/>
    </filter>
    <mask id="${id}-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="84" height="300">
      <rect width="84" height="300" fill="#fff"/>
      <rect x="7" y="7" width="70" height="286" rx="3" fill="none" stroke="#000" stroke-width="2.4"/>
      ${letters.map((letter, i) => `<text x="42" y="${46 + i * 33}" text-anchor="middle" fill="#000">${letter}</text>`).join('')}
    </mask>
  </defs>
  <rect class="v26-seal-ink" width="84" height="300" rx="6" mask="url(#${id}-cut)" filter="url(#${id}-f)"/>
</svg>`;
}
