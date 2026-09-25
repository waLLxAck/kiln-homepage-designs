// PROTOTYPE H09: the three crayon drawings. The toy box (hero, clickable), the start screen (test verdict), the tidy box (download).
import { crayons, folderPts, inflate, kid, loop, outline, path, polyAttr, reseed, wline, zigzag, type Crayon, type Pt } from './crayon';
import { pile, type PileItem } from './data';

type Spot = { x: number; y: number; r: number };
type Layout = { id: string; w: number; h: number; fw: number; fh: number; spots: Record<string, Spot>; extras: () => string; front: () => string };

function folderGroup(layout: Layout, item: PileItem) {
  const { x, y, r } = layout.spots[item.key], { fw: w, fh: h } = layout;
  const pts = folderPts(w, h), clip = `h09-clip-${layout.id}-${item.key}`, color = crayons[item.color];
  const mark = item.kind === 'broken' ? path(wline(w * .66, h * .22, w * .76, h * .5, 3, 2) + ' ' + wline(w * .76, h * .5, w * .7, h * .66, 3, 2) + ' ' + wline(w * .7, h * .66, w * .84, h * .94, 3, 2), 'red', 4)
    : item.kind === 'edited' ? path(`M${w * .66},${h * .3} l8,-10 l5,9 l8,-11 l6,9`, 'graphite', 2.6) : '';
  return `<g class="h09-folder" data-key="${item.key}" data-color="${item.color}" transform="translate(${x} ${y}) rotate(${r} ${w / 2} ${h / 2})" role="button" tabindex="0" aria-pressed="false"
      aria-label="${item.name} in ${item.where}. Colour it in to see what Kiln says about it." style="--c:${color}">
    <polygon class="h09-hit" points="${polyAttr(inflate(pts, 8, w, h))}"/>
    <clipPath id="${clip}"><polygon points="${polyAttr(inflate(pts, 3, w, h))}"/></clipPath>
    <g filter="url(#h09-wax)">
      <g clip-path="url(#${clip})"><path class="h09-zig" d="${zigzag(-4, -4, w + 8, h + 8, 7, -24 + r)}" stroke="${color}" pathLength="1"/></g>
      ${path(outline(pts, 3.4, true), item.color, 4.2)}
      ${kid(12, h * .7, item.name, layout.id === 'tall' ? 20 : 19)}
      ${mark}
    </g>
    <path class="h09-ring" d="${loop(w / 2, h / 2 + 4, w * .66, h * .78, .05, 1.05)}"/>
  </g>`;
}

function sun(cx: number, cy: number, r: number) {
  const rays = Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2 + .3; return wline(cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8), cx + Math.cos(a) * (r + 24), cy + Math.sin(a) * (r + 24), 1.5, 2); }).join(' ');
  return `<clipPath id="h09-sun-${cx}"><circle cx="${cx}" cy="${cy}" r="${r + 2}"/></clipPath>
    <g clip-path="url(#h09-sun-${cx})">${path(zigzag(cx - r, cy - r, r * 2, r * 2, 6, 30), 'yellow', 7)}</g>
    ${path(loop(cx, cy, r, r, .06), 'orange', 4)}${path(rays, 'orange', 4)}
    ${path(`M${cx - 10},${cy - 5} l1,3 M${cx + 9},${cy - 6} l1,3`, 'graphite', 3.5)}${path(`M${cx - 12},${cy + 7} Q${cx},${cy + 18} ${cx + 13},${cy + 6}`, 'graphite', 3)}`;
}

function toyBox(x: number, y: number, w: number, h: number) {
  const front: Pt[] = [[x, y], [x + w, y], [x + w - 16, y + h], [x + 16, y + h]];
  const rim: Pt[] = [[x + 8, y], [x + w - 8, y], [x + w - 28, y - 22], [x + 28, y - 22]];
  const sx = x + w / 2, sy = y + h / 2 + 4, star: Pt[] = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 13 : 30; return [sx + Math.cos(a) * rr, sy + Math.sin(a) * rr]; });
  return `<clipPath id="h09-box-${x}"><polygon points="${polyAttr(front)}"/></clipPath><clipPath id="h09-star-${x}"><polygon points="${polyAttr(star)}"/></clipPath><clipPath id="h09-rim-${x}"><polygon points="${polyAttr(rim)}"/></clipPath>
    <g clip-path="url(#h09-rim-${x})">${path(zigzag(x, y - 24, w, 26, 6, 80), 'brown', 6, 'opacity=".85"')}</g>
    ${path(outline(rim, 2), 'brown', 4)}
    <g clip-path="url(#h09-box-${x})">${path(zigzag(x - 4, y - 4, w + 8, h + 8, 8, -12), 'red', 8, 'opacity=".78"')}</g>
    <g clip-path="url(#h09-star-${x})">${path(zigzag(sx - 32, sy - 32, 64, 64, 5, 20), 'yellow', 6)}</g>
    ${path(outline(front, 2.8, true), 'brown', 4.5)}${path(outline(star, 1.6), 'orange', 3.5)}
    ${kid(x + 26, y + h - 18, 'TOYS', 22, 'yellow', -3)}`;
}

function legend(x: number, y: number, size = 17) {
  const row = (n: number, color: Crayon, text: string) => `<clipPath id="h09-key-${x}-${n}"><rect x="${x}" y="${y + 24 + n * 30}" width="26" height="16"/></clipPath><g clip-path="url(#h09-key-${x}-${n})">${path(zigzag(x, y + 24 + n * 30, 26, 16, 5, 70), color, 5)}</g>${kid(x + 36, y + 38 + n * 30, text, size)}`;
  return `${kid(x, y + 8, 'key:', size + 2, 'graphite')}${row(0, 'blue', 'claude')}${row(1, 'green', 'codex + co')}${row(2, 'orange', 'my game')}`;
}

const wide: Layout = {
  id: 'wide', w: 660, h: 540, fw: 140, fh: 86,
  spots: { 'cr-claude': { x: 34, y: 116, r: -12 }, dup: { x: 196, y: 84, r: 8 }, 'research-claude': { x: 170, y: 262, r: -6 }, 'cr-agents': { x: 366, y: 96, r: -7 }, stray: { x: 494, y: 176, r: 13 }, broken: { x: 334, y: 250, r: 5 }, 'playtest-game': { x: 488, y: 404, r: -15 } },
  extras: () => `${kid(30, 60, 'MY SKILS', 40, 'purple', -4)}${kid(128, 38, 'l', 26, 'red', 0)}${path('M123,56 l6,-12 l6,12', 'red', 3)}
    ${sun(598, 58, 30)}
    ${kid(28, 98, 'somebody changed it!', 20, 'red', -10)}${kid(322, 72, 'twins?!', 23, 'red', 6)}
    ${kid(512, 304, 'whose is this?', 20, 'red', 10)}${kid(356, 364, 'broken!', 22, 'red', -4)}`,
  front: () => `${toyBox(150, 352, 320, 150)}${legend(14, 390)}${path(wline(0, 526, 660, 522, 3, 0), 'green', 6)}`,
};
const tall: Layout = {
  id: 'tall', w: 400, h: 770, fw: 150, fh: 88,
  spots: { 'cr-claude': { x: 22, y: 106, r: -9 }, dup: { x: 214, y: 92, r: 8 }, 'research-claude': { x: 30, y: 250, r: -4 }, 'cr-agents': { x: 222, y: 238, r: -6 }, stray: { x: 26, y: 392, r: 8 }, broken: { x: 222, y: 386, r: -6 }, 'playtest-game': { x: 232, y: 536, r: -12 } },
  extras: () => `${kid(22, 56, 'MY SKILS', 38, 'purple', -4)}${kid(114, 36, 'l', 24, 'red', 0)}${path('M110,52 l6,-11 l6,11', 'red', 3)}
    ${sun(352, 50, 26)}
    ${kid(254, 214, 'twins?!', 20, 'red', 6)}${kid(26, 228, 'somebody changed it!', 17, 'red', -4)}
    ${kid(40, 512, 'whose is this?', 18, 'red', 6)}${kid(262, 508, 'broken!', 20, 'red', -4)}`,
  front: () => `${toyBox(22, 612, 196, 110)}${legend(248, 628)}${path(wline(0, 758, 400, 754, 3, 0), 'green', 6)}`,
};

function drawing(layout: Layout, cls: string) {
  reseed(layout.id === 'wide' ? 21 : 44);
  return `<svg class="h09-toybox ${cls}" viewBox="0 0 ${layout.w} ${layout.h}" role="group" aria-label="A crayon drawing of your skills folders as a messy toy box. Seven folders spill out of it; each one is a button.">
    <g filter="url(#h09-wax)" class="h09-static">${layout.extras()}</g>
    ${pile.map(item => folderGroup(layout, item)).join('')}
    <g filter="url(#h09-wax)" class="h09-static">${layout.front()}</g>
  </svg>`;
}
export const toyBoxWide = () => drawing(wide, 'h09-wide');
export const toyBoxTall = () => drawing(tall, 'h09-tall');

/** What the agent found, drawn the way the child would see it: a big button that isn't "play". */
export function startScreen() {
  reseed(71);
  const btn = (x: number, y: number, w: number, h: number, text: string, color: Crayon, size: number, id: string) => {
    const pts: Pt[] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    return `<clipPath id="h09-btn-${id}"><polygon points="${polyAttr(pts)}"/></clipPath><g clip-path="url(#h09-btn-${id})">${path(zigzag(x, y, w, h, 7, -20), color, 7, `opacity="${color === 'graphite' ? .12 : .45}"`)}</g>
      ${path(outline(pts, 2), color, 4)}${kid(x + w / 2, y + h / 2 + size * .35, text, size, 'graphite', 0, 'middle')}`;
  };
  const tablet: Pt[] = [[40, 30], [300, 22], [306, 332], [36, 338]];
  return `<svg class="h09-screen-art" viewBox="0 0 440 360" role="img" aria-label="Crayon drawing of the sample game's start screen: a huge Profiles button, a small grey Continue button and a small Settings button, with a puzzled child beside it.">
    <g filter="url(#h09-wax)">
      ${path(outline(tablet, 3, true), 'graphite', 5)}${kid(170, 70, 'my-game', 24, 'purple', -2, 'middle')}
      ${btn(76, 100, 190, 88, 'PROFILES', 'blue', 30, 'a')}
      ${btn(90, 214, 108, 40, 'continue', 'graphite', 18, 'b')}
      ${btn(90, 270, 108, 40, 'settings', 'graphite', 18, 'c')}
      ${path(loop(372, 176, 20, 22, .06), 'graphite', 4)}${path(`M372,198 L370,262 M370,222 L346,244 M370,222 L398,204 M370,262 L352,302 M370,262 L390,302`, 'graphite', 4)}
      ${path('M364,172 l1,3 M378,172 l1,3 M364,186 q8,-5 16,0', 'graphite', 3)}
      ${kid(386, 136, '?', 44, 'red', 12)}
    </g>
    <g filter="url(#h09-wax)" class="h09-found">
      <path class="h09-found-ring" d="${loop(171, 144, 124, 64, .06, 1.15)}" pathLength="1" fill="none" stroke="${crayons.red}" stroke-width="6" stroke-linecap="round"/>
      <g class="h09-found-text">${kid(322, 40, 'this one!', 26, 'red', 8)}${path(wline(340, 54, 300, 92, 2, 0) + ' M292,78 L300,93 L312,84', 'red', 4)}</g>
    </g>
  </svg>`;
}

/** The sign-off: the same toy box, lid shut, with a gold star. */
export function tidyBox() {
  reseed(90);
  const body: Pt[] = [[30, 90], [230, 90], [220, 190], [40, 190]], lid: Pt[] = [[20, 64], [240, 64], [236, 92], [24, 92]];
  const sx = 212, sy = 42, star: Pt[] = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 11 : 26; return [sx + Math.cos(a) * rr, sy + Math.sin(a) * rr]; });
  return `<svg class="h09-tidy" viewBox="0 0 270 210" role="img" aria-label="Crayon drawing of the toy box with its lid shut, smiling, with a gold star.">
    <g filter="url(#h09-wax)">
      <clipPath id="h09-tb"><polygon points="${polyAttr(body)}"/></clipPath><clipPath id="h09-tl"><polygon points="${polyAttr(lid)}"/></clipPath><clipPath id="h09-ts"><polygon points="${polyAttr(star)}"/></clipPath>
      <g clip-path="url(#h09-tb)">${path(zigzag(30, 90, 200, 100, 8, -14), 'red', 8, 'opacity=".78"')}</g>
      <g clip-path="url(#h09-tl)">${path(zigzag(20, 64, 220, 28, 6, 70), 'brown', 6, 'opacity=".85"')}</g>
      <g clip-path="url(#h09-ts)">${path(zigzag(sx - 28, sy - 28, 56, 56, 5, 20), 'yellow', 6)}</g>
      ${path(outline(body, 2.4, true), 'brown', 4.5)}${path(outline(lid, 2), 'brown', 4)}${path(outline(star, 1.4), 'orange', 3.5)}
      ${path('M100,128 l1,4 M158,128 l1,4', 'graphite', 4)}${path('M96,150 Q130,176 164,148', 'graphite', 4)}
    </g>
  </svg>`;
}
