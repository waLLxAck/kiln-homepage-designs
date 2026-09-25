// PROTOTYPE H02: soft graphite drawings. Seeded wobble from the round-3 kit; pencil grain comes from the #h02-graphite filter.
import { arrow, cross, ellipse, folder, line, reseed, scribble } from '../r3-kit/rough';

const lead = (d: string, extra = '') => `<path d="${d}" class="h02-lead ${extra}"/>`;
const hand = (x: number, y: number, text: string, size = 26, rotate = 0, extra = '') =>
  `<text x="${x}" y="${y}" class="h02-hand-t ${extra}" font-size="${size}" ${rotate ? `transform="rotate(${rotate} ${x} ${y})"` : ''}>${text}</text>`;
const smudge = (cx: number, cy: number, rx: number, ry: number, rotate = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="h02-smudge" transform="rotate(${rotate} ${cx} ${cy})"/>`;

type Box = [x: number, y: number, w: number, h: number, rot: number, path: string, items: string[]];

function box([x, y, w, h, rot, path, items]: Box, size: number, gap: number) {
  // Drawn twice, the second pass lighter, the way a pencil goes back over a line.
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">
    ${lead(folder(x, y, w, h))}${lead(folder(x, y, w, h), 'h02-lead-light')}
    ${lead(scribble(x + 6, y + 3, w * .28, 2, 3), 'h02-lead-hatch')}
    ${hand(x + 4, y - 8, path, size - 3, 0, 'h02-hand-path')}
    ${items.map((text, n) => hand(x + 14, y + size + 16 + n * gap, text, size)).join('')}
  </g>`;
}

/** The mess: duplicated skill folders. `tall` is the phone composition. Returns [viewBox width, height, markup]. */
export function messDrawing(tall: boolean): [number, number, string] {
  reseed(tall ? 61 : 59);
  if (tall) {
    const size = 24, gap = 26;
    const boxes: Box[] = [
      [14, 40, 196, 150, -3, '~/.claude/skills', ['code-review', 'code-review (1)', 'code-review-old', 'research']],
      [196, 224, 170, 124, 3, '~/.agents/skills', ['code-review', 'writing-for-…', 'pr-summary']],
      [16, 250, 150, 74, -2, '.codex/skills', ['code-review-FINAL']],
      [24, 400, 196, 124, 2, 'my-game/.github/skills', ['code-review', 'playtest', 'old-link']],
      [240, 82, 124, 72, 5, '.copilot/skills', ['pr-summary']],
    ];
    return [380, 640, `
      ${smudge(120, 118, 90, 30, -8)}${smudge(270, 470, 80, 24, 6)}
      ${boxes.map(b => box(b, size, gap)).join('')}
      ${lead(cross(44, 506, 7))}${lead(line(48, 502, 120, 500, .6))}
      ${lead(ellipse(80, 433, 58, 15, .08))}${hand(236, 574, 'edited??', 26, -6)}${lead(arrow(248, 556, 146, 442, 24, 11))}
      ${lead(arrow(150, 118, 204, 238, -24, 11))}
      ${hand(40, 616, 'which one is current?', 32, -2, 'h02-hand-big')}
    `];
  }
  const size = 26, gap = 28;
  const boxes: Box[] = [
    [34, 56, 250, 168, -3, '~/.claude/skills', ['code-review', 'code-review (1)', 'code-review-old', 'research']],
    [344, 36, 240, 138, 2, '~/.agents/skills', ['code-review', 'writing-for-agents', 'pr-summary']],
    [634, 90, 150, 86, 5, '.codex/skills', ['code-review-FINAL']],
    [60, 330, 200, 90, 3, '.copilot/skills', ['pr-summary']],
    [340, 272, 270, 142, -2, 'my-game/.github/skills', ['code-review', 'playtest', 'old-link']],
  ];
  return [820, 580, `
    ${smudge(170, 150, 150, 42, -6)}${smudge(520, 380, 130, 30, 4)}${smudge(710, 150, 70, 26, 10)}
    ${boxes.map(b => box(b, size, gap)).join('')}
    ${lead(cross(372, 390, 8))}${lead(line(378, 386, 470, 384, .6))}
    ${lead(ellipse(404, 305, 66, 17, .08))}${hand(626, 318, 'edited by hand?', 27, -5)}${lead(arrow(636, 296, 480, 300, 22, 12))}
    ${lead(arrow(200, 112, 356, 90, -40, 12))}${lead(arrow(470, 90, 660, 150, -46, 12))}${lead(arrow(430, 184, 446, 262, 16, 12))}${lead(arrow(176, 240, 156, 300, 12, 12))}
    ${hand(236, 500, 'which one is current??', 40, -2, 'h02-hand-big')}${lead(line(240, 512, 610, 506, 1))}${lead(line(250, 520, 560, 516, 1), 'h02-lead-light')}
    ${hand(690, 250, '4 copies', 30, -9, 'h02-hand-big')}
  `];
}

/** A pencil border for a saved-idea scrap: torn top edge, a doodled pin. */
export function scrapBorder(seed: number) {
  reseed(seed);
  let torn = 'M4,14';
  for (let x = 4; x <= 296; x += 12) torn += ` L${x},${(x / 12) % 2 ? 8 : 14 + (x % 5)}`;
  return `<svg class="h02-scrap-art" viewBox="0 0 300 220" preserveAspectRatio="none" aria-hidden="true">
    ${lead(torn)}${lead(line(296, 12, 298, 214, 1.2))}${lead(line(298, 214, 3, 212, 1.2))}${lead(line(3, 212, 4, 14, 1.2))}
    ${lead(scribble(210, 190, 70, 2, 5), 'h02-lead-light')}
  </svg>`;
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
