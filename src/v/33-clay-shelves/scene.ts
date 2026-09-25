// PROTOTYPE 30: the scroll-driven clay scene. A tumbled pile of skill folders lifts, sorts and settles onto collection shelves.
export type Folder = { name: string; shelf: number; slot: number; tone: 'lilac' | 'peach' | 'mint' | 'grey'; role: 'item' | 'dupe' | 'trash'; into?: string; badge?: string; drift?: boolean };

export const shelves = ['Agent workflows', 'Game design', 'Skills to refine'];

export const folders: Folder[] = [
  { name: 'instruction-trace', shelf: 0, slot: 0, tone: 'lilac', role: 'item' },
  { name: 'repo-briefing', shelf: 0, slot: 1, tone: 'lilac', role: 'item' },
  { name: 'project-memory', shelf: 0, slot: 2, tone: 'lilac', role: 'item' },
  { name: 'playtest', shelf: 1, slot: 0, tone: 'peach', role: 'item', badge: '1 copy differs' },
  { name: 'risk-first-plan', shelf: 1, slot: 1, tone: 'peach', role: 'item' },
  { name: 'seven-year-old', shelf: 1, slot: 2, tone: 'peach', role: 'item' },
  { name: 'code-review', shelf: 2, slot: 0, tone: 'mint', role: 'item', badge: 'Edited outside Kiln', drift: true },
  { name: 'research', shelf: 2, slot: 1, tone: 'mint', role: 'item', badge: 'Identical copy found' },
  { name: 'writing-for-agents', shelf: 2, slot: 2, tone: 'mint', role: 'item' },
  { name: 'code-review (copy)', shelf: 2, slot: 0, tone: 'mint', role: 'dupe', into: 'code-review' },
  { name: 'playtest-v2-FINAL', shelf: 1, slot: 0, tone: 'peach', role: 'dupe', into: 'playtest' },
  { name: 'research-old', shelf: 2, slot: 1, tone: 'mint', role: 'dupe', into: 'research' },
  { name: 'empty-folder', shelf: -1, slot: 0, tone: 'grey', role: 'trash' },
  { name: 'broken-link', shelf: -1, slot: 1, tone: 'grey', role: 'trash' },
];

// A deterministic tumble for each folder, in units of folder size.
const pile = [
  [-.9, .9, 40, -18, 12, -24], [.3, 1.05, 10, 14, -20, 16], [1.2, .85, 30, -8, 24, 38], [-.2, .55, 60, 22, 8, -8],
  [.9, .45, 80, -12, -14, -30], [-1.1, .35, 50, 16, 20, 22], [.1, .1, 110, -20, -8, 12], [-.7, -.05, 90, 10, 18, -34],
  [1.05, -.1, 120, 18, -22, 26], [-.35, -.35, 140, -10, 14, -16], [.55, -.45, 150, 12, 10, 40], [-1, -.6, 130, -16, -18, 30],
  [.2, -.85, 170, 8, 22, -22], [-.4, -1.1, 190, -14, -10, 18],
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const seg = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export type Layout = { width: number; height: number; fw: number; fh: number };

export function layout(area: HTMLElement): Layout {
  const width = area.clientWidth, height = area.clientHeight;
  const fw = Math.min(width * .27, 168, height * .3, (height - 180) / 3.2 / .7);
  return { width, height, fw, fh: fw * .7 };
}

export const shelfY = (l: Layout, shelf: number) => (shelf - 1) * Math.max(l.fh + 46, Math.min(l.height * .3, l.fh * 2.05, l.height / 2 - l.fh * .55 - 34)) + l.fh * .55;

function target(l: Layout, folder: Folder) {
  if (folder.role === 'trash') return { x: (folder.slot ? 1 : -1) * l.width * .66, y: -l.height * .18, z: 120 };
  return { x: (folder.slot - 1) * l.fw * 1.1, y: shelfY(l, folder.shelf) - l.fh / 2 - 4, z: folder.role === 'dupe' ? 14 : 0 };
}

/** Applies scene progress p (0 to 1) to every folder element, shelf and caption. */
export function paint(root: HTMLElement, l: Layout, p: number) {
  const lift = ease(seg(p, .1, .3));
  const settle = ease(seg(p, .6, .74));
  root.style.setProperty('--shelves', String(ease(seg(p, .2, .36))));
  root.style.setProperty('--settle', String(settle));
  root.style.setProperty('--drift', String(ease(seg(p, .8, .88))));
  root.querySelectorAll<HTMLElement>('.v30-folder').forEach((el, i) => {
    const folder = folders[i];
    const [px, py, depth, rx, ry, rz] = pile[i];
    const heap = { x: px * l.fw * 1.02, y: py * l.fh * 1.25 + l.fh * .35, z: depth * 1.2, rx, ry, rz };
    const up = { x: heap.x * 1.2, y: heap.y * 1.05 - l.fh * 1.1, z: heap.z + 90, rx: rx * .35, ry: ry * .35, rz: rz * .3 };
    const t = target(l, folder);
    const sort = ease(seg(p, .3 + i * .014, .52 + i * .014));
    const x = mix(mix(heap.x, up.x, lift), t.x, sort);
    const y = mix(mix(heap.y, up.y, lift), t.y, sort) - Math.sin(sort * Math.PI) * l.fh * .5;
    const z = mix(mix(heap.z, up.z, lift), t.z, sort);
    const rX = mix(mix(heap.rx, up.rx, lift), 0, sort);
    const rY = mix(mix(heap.ry, up.ry, lift), 0, sort);
    const rZ = mix(mix(heap.rz, up.rz, lift), 0, sort);
    let scale = 1, opacity = 1;
    if (folder.role !== 'item') { scale = mix(1, .35, settle); opacity = 1 - seg(p, .66, .74); }
    if (folder.role === 'trash') { scale = mix(1, .5, sort); opacity = 1 - seg(p, .36 + i * .014, .5 + i * .014); }
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rX.toFixed(1)}deg) rotateY(${rY.toFixed(1)}deg) rotateZ(${rZ.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    el.style.opacity = opacity.toFixed(3);
    el.style.zIndex = String(folder.role === 'dupe' ? 3 : 2);
  });
  const step = p < .14 ? 0 : p < .34 ? 1 : p < .58 ? 2 : p < .78 ? 3 : 4;
  root.querySelectorAll<HTMLElement>('.v30-caption').forEach((caption, i) => caption.classList.toggle('is-on', i === step));
  root.querySelectorAll<HTMLElement>('.v30-pips span').forEach((pip, i) => pip.classList.toggle('is-on', i <= step));
}
