// PROTOTYPE H02: soft graphite drawings. Seeded wobble from the round-3 kit; pencil grain comes from the #h02-graphite filter.
// Two drawings only: the provider folders (problem 1) and the pencil tracing around the taped-on sources (problem 2).
import { arrow, cross, ellipse, folder, line, rect, reseed, scribble } from '../r3-kit/rough';

export const lead = (d: string, extra = '') => `<path d="${d}" class="h02-lead ${extra}"/>`;
export const hand = (x: number, y: number, text: string, size = 26, rotate = 0, extra = '') =>
  `<text x="${x}" y="${y}" class="h02-hand-t ${extra}" font-size="${size}" ${rotate ? `transform="rotate(${rotate} ${x} ${y})"` : ''}>${text}</text>`;
const smudge = (cx: number, cy: number, rx: number, ry: number, rotate = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="h02-smudge" transform="rotate(${rotate} ${cx} ${cy})"/>`;

// ---------- the folders ----------

export type Kind = 'ok' | 'dup' | 'edited' | 'stale' | 'broken' | 'empty' | 'found';
/** One skill folder drawn inside a provider folder. `to` is the panel cell it flies to (`row:column`) or `cleanup`. */
export type Skill = { name: string; to: string; kind: Kind; note?: string };
export const folders: { path: string; files: Skill[] }[] = [
  { path: '~/.claude/skills', files: [
    { name: 'code-review', to: 'code-review:claude', kind: 'edited', note: 'edited by hand?' },
    { name: 'code-review (1)', to: 'code-review:claude', kind: 'dup' },
    { name: 'research', to: 'research:claude', kind: 'ok' },
    { name: 'writing-for-agents', to: 'writing-for-agents:claude', kind: 'ok' },
  ] },
  { path: '~/.agents/skills', files: [
    { name: 'code-review', to: 'code-review:agents', kind: 'ok' },
    { name: 'pr-summary', to: 'pr-summary:agents', kind: 'found', note: 'who put this here?' },
    { name: 'old-link', to: 'cleanup', kind: 'broken', note: 'links to nothing' },
  ] },
  { path: '~/.codex/skills', files: [{ name: '(empty)', to: 'cleanup', kind: 'empty' }] },
  { path: '~/.copilot/skills', files: [{ name: 'research', to: 'research:copilot', kind: 'stale', note: 'older?' }] },
  { path: 'my-game/.github/skills', files: [
    { name: 'code-review', to: 'code-review:project', kind: 'ok' },
    { name: 'playtest-brief', to: 'playtest-brief:project', kind: 'ok' },
  ] },
];

type Place = [x: number, y: number, w: number, h: number, rot: number];
type Composition = { w: number; h: number; size: number; gap: number; places: Place[]; seed: number; extra: () => string; noteBelow?: boolean };
const compositions: Record<'wide' | 'tall', Composition> = {
  wide: {
    w: 940, h: 520, size: 23, gap: 31, seed: 59,
    places: [[34, 54, 300, 180, -2.5], [384, 38, 270, 150, 2], [700, 70, 200, 96, 4], [60, 318, 250, 104, 2.5], [382, 262, 290, 124, -2]],
    extra: () => `
      ${hand(706, 262, 'which one', 42, -4, 'h02-hand-big')}${hand(716, 306, 'is current??', 42, -4, 'h02-hand-big')}
      ${lead(line(716, 322, 900, 308, 1))}${lead(line(724, 330, 872, 318, 1), 'h02-lead-light')}
      ${lead(arrow(704, 290, 592, 302, 18, 12))}
      ${hand(250, 486, 'the same code-review, four times', 28, -1.5)}${lead(line(254, 496, 590, 490, 1), 'h02-lead-light')}`,
  },
  tall: {
    w: 360, h: 640, size: 19, gap: 25, seed: 61, noteBelow: true,
    places: [[14, 40, 206, 146, -2.5], [120, 226, 226, 128, 2.5], [236, 60, 110, 76, 4], [14, 240, 94, 96, -3], [22, 410, 246, 104, -2]],
    extra: () => `
      ${hand(26, 590, 'which one is current??', 30, -3, 'h02-hand-big')}${lead(line(30, 602, 290, 588, 1))}
      ${lead(arrow(288, 560, 212, 468, -20, 10))}`,
  },
};

export type Chip = { skill: Skill; x: number; y: number; rot: number; size: number };

/** Lays the folder drawing into a w × h box. Returns the SVG art (in its own units, with a fitting transform) and the skill chips in box pixels. */
export function mess(w: number, h: number): { art: string; transform: string; chips: Chip[] } {
  const comp = compositions[w / h < .9 ? 'tall' : 'wide'];
  reseed(comp.seed);
  const scale = Math.min((w - 24) / comp.w, (h - 24) / comp.h), ox = (w - comp.w * scale) / 2, oy = (h - comp.h * scale) / 2;
  const chips: Chip[] = [];
  const width = (text: string, size: number) => text.length * size * .43;
  let art = comp === compositions.wide
    ? `${smudge(180, 150, 150, 42, -6)}${smudge(520, 330, 130, 30, 4)}${smudge(800, 120, 70, 26, 10)}`
    : `${smudge(110, 110, 90, 30, -8)}${smudge(200, 460, 90, 24, 6)}`;
  folders.forEach((group, g) => {
    const [x, y, fw, fh, rot] = comp.places[g], cx = x + fw / 2, cy = y + fh / 2, rad = rot * Math.PI / 180;
    const turn = (px: number, py: number) => [cx + (px - cx) * Math.cos(rad) - (py - cy) * Math.sin(rad), cy + (px - cx) * Math.sin(rad) + (py - cy) * Math.cos(rad)];
    let inner = `${lead(folder(x, y, fw, fh))}${lead(folder(x, y, fw, fh), 'h02-lead-light')}${lead(scribble(x + 6, y + 3, fw * .26, 2, 3), 'h02-lead-hatch')}
      ${hand(x + 4, y - 8, group.path, comp.size - 4, 0, 'h02-hand-path')}`;
    group.files.forEach((skill, n) => {
      const empty = skill.kind === 'empty';
      const fx = empty ? x + fw / 2 - width(skill.name, comp.size) / 2 : x + 16, fy = empty ? y + fh / 2 + 6 : y + comp.size + 20 + n * comp.gap;
      const [tx, ty] = turn(fx, fy - comp.size * .32);
      chips.push({ skill, x: ox + tx * scale, y: oy + ty * scale, rot, size: comp.size * scale });
      const end = fx + width(skill.name, comp.size) + 24;
      if (skill.kind === 'edited') inner += lead(ellipse(fx + width(skill.name, comp.size) / 2 + 8, fy - comp.size * .3, width(skill.name, comp.size) / 2 + 20, comp.size * .62, .07));
      if (skill.kind === 'broken') inner += `${lead(cross(end - 6, fy - comp.size * .3, comp.size * .28))}`;
      if (skill.kind === 'dup') inner += lead(line(fx - 2, fy + 4, fx + width(skill.name, comp.size) + 10, fy + 2, .8), 'h02-lead-light');
      if (skill.note) {
        const below = comp.noteBelow && end + width(skill.note, comp.size - 3) > x + fw + 30;
        inner += below ? hand(fx + 8, fy + comp.size * .9, skill.note, comp.size - 3, 0, 'h02-hand-note') : hand(end + (skill.kind === 'broken' ? 8 : 0), fy, skill.note, comp.size - 2, -3, 'h02-hand-note');
      }
    });
    if (group.files[0].kind === 'empty') inner += lead(scribble(x + fw * .2, y + fh - 20, fw * .5, 1, 4), 'h02-lead-light');
    art += `<g transform="rotate(${rot} ${cx} ${cy})">${inner}</g>`;
  });
  art += comp.extra();
  return { art, transform: `translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${scale.toFixed(4)})`, chips };
}

// ---------- the sources: a pencil line traced around each taped-on printout ----------

export function trace(seed: number, note = '') {
  reseed(seed);
  return `<svg class="h02-trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    ${lead(rect(1.5, 2, 97, 96), 'h02-lead-trace')}${lead(rect(2.5, 1.2, 96, 97.4), 'h02-lead-trace h02-lead-light')}
    ${note ? lead(scribble(70, 97, 24, 1, 2), 'h02-lead-trace h02-lead-light') : ''}
  </svg>`;
}

/** The small pencil arrow from the sources to Kiln's capture area, with its note. */
export function dragArrow(tall: boolean) {
  reseed(tall ? 93 : 91);
  return tall
    ? `<svg class="h02-drag-arrow h02-drag-tall" viewBox="0 0 220 70" aria-hidden="true">${lead(arrow(20, 12, 70, 60, -14, 11))}${hand(84, 44, 'drag one in', 26, -3, 'h02-hand-big')}</svg>`
    : `<svg class="h02-drag-arrow h02-drag-wide" viewBox="0 0 170 120" aria-hidden="true">${hand(6, 36, 'drag one in', 28, -6, 'h02-hand-big')}${lead(arrow(40, 56, 150, 100, 18, 12))}</svg>`;
}

export function numeral(n: number, seed: number) {
  reseed(seed);
  return `<svg class="h02-num" viewBox="0 0 64 64" aria-hidden="true">${lead(ellipse(32, 33, 25, 24, .06, 1.12))}<text x="32" y="45" text-anchor="middle" class="h02-hand-t h02-hand-big" font-size="36">${n}</text></svg>`;
}

export function graphiteDefs() {
  return `<svg class="h02-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <filter id="h02-graphite" x="-3%" y="-3%" width="106%" height="106%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="1" seed="5" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2 0 0 0 1.7" result="gm"/>
      <feComposite in="d" in2="gm" operator="in"/>
    </filter>
    <filter id="h02-smudge-f" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
  </svg>`;
}
