// PROTOTYPE H10: the desk, top-down, in loose ink and watercolour wash.
// Washes are SVG filters (turbulence, displacement, grain) baked once into canvases, so the scroll camera only moves bitmaps.
// Ink stays vector and unfiltered: a crisp line over a wider, faint bleed.

export const W = 2800, H = 1900;
/** The laptop screen in scene units, 16:10. The Kiln UI is mapped onto this rectangle. */
export const S = { x: 1000, y: 620, w: 800, h: 500 };
export const region = { x: 260, y: 60, w: 2240, h: 1800 };
export const regionTight = { x: 560, y: 180, w: 1680, h: 1560 };

let seed = 5;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const j = (a: number) => (rnd() - .5) * 2 * a;
const f = (n: number) => Math.round(n * 10) / 10;
export const reseed = (value: number) => { seed = value; };

export const washColors = { ochre: '#d3a24e', rose: '#c97a6b', sage: '#86a47e', indigo: '#4d6a8c', cream: '#efe6cf', paper: '#f7f5ee', manila: '#d9bd84', grey: '#8f9792' };

// ---------- ink ----------

function wob(x1: number, y1: number, x2: number, y2: number, amp = 2.2) {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 60));
  const len = Math.hypot(x2 - x1, y2 - y1) || 1, px = -(y2 - y1) / len, py = (x2 - x1) / len;
  let d = `M${f(x1 + j(amp * .5))},${f(y1 + j(amp * .5))}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n, off = i === n ? j(amp * .4) : j(amp);
    d += ` L${f(x1 + (x2 - x1) * t + px * off)},${f(y1 + (y2 - y1) * t + py * off)}`;
  }
  return d;
}
/** A loose ink rectangle: corners slightly missed, edges drawn one by one, sometimes overshooting. */
export function inkRect(x: number, y: number, w: number, h: number, amp = 2.4) {
  const o = () => 4 + rnd() * 10;
  return [wob(x - o(), y, x + w + o() * .6, y + j(2), amp), wob(x + w, y - o() * .5, x + w + j(2), y + h + o() * .6, amp),
    wob(x + w + o() * .5, y + h, x - o() * .4, y + h + j(2), amp), wob(x, y + h + o() * .3, x + j(2), y - o() * .6, amp)].join(' ');
}
export function inkCircle(cx: number, cy: number, r: number, turns = 1.06) {
  const n = 48, start = rnd() * 6;
  let d = '';
  for (let i = 0; i <= n * turns; i++) {
    const a = start + i / n * Math.PI * 2, rr = r * (1 + j(.012) + i / n * .02);
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)} `;
  }
  return d;
}
const inkPath = (d: string, width = 3) => `<path d="${d}" stroke-width="${f(width * 3.2)}" class="h10-bleed"/><path d="${d}" stroke-width="${width}" class="h10-ink"/>`;

/** The static ink layer of the desk (vector, no filters). */
export function inkLayer() {
  reseed(17);
  const keys: string[] = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 13; c++) { const x = f(1050 + c * 55 + j(1.5)), y = f(1207 + r * 54 + j(1.5)); keys.push(`M${x + 6},${y} h28 q6,0 6,6 v26 q0,6 -6,6 h-28 q-6,0 -6,-6 v-26 q0,-6 6,-6`); }
  const leaves = [[-60, -80, -30], [70, -60, 30], [90, 50, 110], [-80, 60, 200], [0, -110, -80], [10, 100, 160]]
      .map(([dx, dy]) => { const x = 420 + dx, y = 300 + dy; return `M${420},${300} Q${f(x + j(20))},${f(y + j(20))} ${f(420 + dx * 1.7)},${f(300 + dy * 1.7)}`; }).join(' ');
  return `<svg class="h10-inklayer" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
    ${inkPath(inkRect(962, 584, 876, 572, 2), 3.2)}${inkPath(inkRect(1000, 620, 800, 500, 1.4), 2.2)}
    ${inkPath(inkRect(962, 1156, 876, 500, 2), 3.2)}${inkPath(wob(1060, 1160, 1740, 1160, 1), 2)}
    <g opacity=".45">${inkPath(keys.join(' '), 1.3)}</g>${inkPath(inkRect(1250, 1504, 300, 120, 1.4), 2)}
    ${inkPath(inkCircle(2330, 1560, 118), 3)}${inkPath(inkCircle(2330, 1560, 88, 1.02), 1.8)}${inkPath(`M2446,1530 C2520,1520 2530,1610 2448,1600`, 3)}
    ${inkPath(`M1908,1150 L1946,1144 L1986,1560 L1966,1610 L1948,1566 Z M1952,1566 L1982,1562`, 2.4)}
    ${inkPath(inkCircle(420, 300, 118), 3)}${inkPath(leaves, 2.2)}
    ${inkPath(inkRect(1960, 720, 360, 470, 2), 2.8)}${inkPath(wob(2280, 720, 2282, 1190, 1.5), 2)}
  </svg>`;
}

// ---------- washes ----------

const washFilter = (id: string, warp = 22, blur = 1.4, s = 3) => `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="${s}" result="warp"/>
  <feDisplacementMap in="SourceGraphic" in2="warp" scale="${warp}" xChannelSelector="R" yChannelSelector="G" result="shape"/>
  <feGaussianBlur in="shape" stdDeviation="${blur}" result="soft"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="${s + 7}" result="grain"/>
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .9 0 0 0 .5" result="granulation"/>
  <feComposite in="soft" in2="granulation" operator="in"/>
</filter>`;
/** A wash: a pale body with a darker, pooled rim, the way watercolour dries. */
const wash = (shape: string, color: string, body = .32, rim = .38, rimWidth = 7, filter = 'w') =>
  `<g filter="url(#${filter})">${shape.replace('/>', ` fill="${color}" fill-opacity="${body}" stroke="${color}" stroke-opacity="${rim}" stroke-width="${rimWidth}"/>`)}</g>`;

export function deskWashSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>${washFilter('w')}${washFilter('w2', 46, 3, 11)}</defs>
    ${wash('<rect x="740" y="400" width="1320" height="1420" rx="40"/>', '#8fae96', .16, .18, 10, 'w2')}
    ${wash('<rect x="962" y="584" width="876" height="572" rx="26"/>', washColors.grey, .42, .5)}
    ${wash('<rect x="1000" y="620" width="800" height="500" rx="6"/>', '#2d3a36', .62, .3, 3)}
    ${wash('<rect x="962" y="1156" width="876" height="500" rx="30"/>', washColors.grey, .3, .42)}
    ${wash('<rect x="1040" y="1198" width="720" height="276" rx="10"/>', '#5b6661', .16, .1, 4)}
    ${wash('<circle cx="2330" cy="1560" r="118"/>', '#e9e3d3', .75, .35)}
    ${wash('<circle cx="2330" cy="1560" r="86"/>', '#6d4427', .62, .5, 6)}
    ${wash('<circle cx="2090" cy="1742" r="100"/>', '#8a5a33', 0, .3, 14, 'w2')}
    ${wash('<path d="M1908,1150 L1946,1144 L1986,1560 L1966,1610 L1948,1566 Z"/>', washColors.ochre, .6, .5, 4)}
    ${wash('<circle cx="420" cy="300" r="118"/>', '#b8694f', .42, .5)}
    ${[[-60, -80], [70, -60], [90, 50], [-80, 60], [0, -110], [10, 100]].map(([dx, dy]) => wash(`<ellipse cx="${420 + dx * 1.2}" cy="${300 + dy * 1.2}" rx="70" ry="34" transform="rotate(${Math.atan2(dy, dx) * 57.3} ${420 + dx * 1.2} ${300 + dy * 1.2})"/>`, washColors.sage, .5, .55, 5)).join('')}
    ${wash('<rect x="1960" y="720" width="360" height="470" rx="8"/>', washColors.indigo, .45, .5)}
  </svg>`;
}

export function paperWashSvg(w: number, h: number, color: string, kind: Paper['shape']) {
  const shape = kind === 'torn' ? `<path d="M6,10 L${w - 8},4 L${w - 4},${h - 16} ${Array.from({ length: 9 }, (_, i) => `L${f(w - 4 - (i + 1) * (w - 10) / 9)},${f(h - 6 - (i % 2) * 14)}`).join(' ')} Z"/>`
    : kind === 'folder' ? `<path d="M4,34 L4,${h - 4} L${w - 4},${h - 4} L${w - 4},34 L${w * .46},34 L${w * .4},6 L10,6 Z"/>`
    : `<rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="3"/>`;
  const strong = color === washColors.paper || color === washColors.cream;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${washFilter('p', 10, 1, Math.round(w) % 13)}</defs>
    ${wash(shape, color, strong ? .96 : .7, strong ? .16 : .55, 5, 'p')}</svg>`;
}

/** Rasterise an SVG string into a canvas once. Returns the canvas (sized in CSS by the caller). */
export function bake(svg: string, width: number, height: number, scale = 1): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    image.onload = () => { canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url); resolve(canvas); };
    image.onerror = () => { URL.revokeObjectURL(url); resolve(canvas); };
    image.src = url;
  });
}

// ---------- loose papers ----------

export type Paper = { key: string; x: number; y: number; w: number; h: number; r: number; color: string; shape: 'sheet' | 'sticky' | 'folder' | 'torn' | 'card'; html: string; label: string };
export const papers: Paper[] = [
  { key: 'cr-claude', x: 720, y: 440, w: 240, h: 240, r: -8, color: washColors.ochre, shape: 'sticky', label: 'a sticky note: code-review, final, edited?',
    html: '<p class="h10-hand h10-big">code-review</p><p class="h10-hand">FINAL <s>v3</s></p><p class="h10-hand h10-small">edited by hand??</p>' },
  { key: 'dup', x: 560, y: 940, w: 300, h: 390, r: 5, color: washColors.paper, shape: 'sheet', label: 'a printout of ~/.claude/skills with a second code-review circled',
    html: '<p class="h10-type">~/.claude/skills/</p><p class="h10-type">code-review/</p><p class="h10-type h10-circled">code-review (1)/</p><p class="h10-type">research/</p><p class="h10-hand h10-small h10-aside">two of them?</p>' },
  { key: 'research-claude', x: 780, y: 1440, w: 340, h: 210, r: -4, color: washColors.cream, shape: 'card', label: 'an index card: research, v2 or v3',
    html: '<p class="h10-hand h10-big">research</p><p class="h10-hand">v2? v3? the good one</p>' },
  { key: 'cr-agents', x: 2150, y: 430, w: 400, h: 290, r: 7, color: washColors.manila, shape: 'folder', label: 'a manila folder labelled ~/.agents/skills',
    html: '<p class="h10-type h10-tab">~/.agents/skills</p><p class="h10-hand h10-big">code-review</p><p class="h10-hand h10-small">(for Codex, Copilot…)</p>' },
  { key: 'stray', x: 2270, y: 1070, w: 300, h: 210, r: -10, color: washColors.paper, shape: 'torn', label: 'a torn note: pr-summary, who wrote this',
    html: '<p class="h10-hand h10-big">pr-summary</p><p class="h10-hand">who wrote this?</p>' },
  { key: 'broken', x: 2110, y: 1470, w: 220, h: 220, r: 12, color: washColors.rose, shape: 'sticky', label: 'a pink sticky note: old-link, gone',
    html: '<p class="h10-hand h10-big">old-link →</p><p class="h10-hand">(folder gone)</p>' },
  { key: 'playtest-game', x: 1170, y: 250, w: 300, h: 350, r: -3, color: washColors.paper, shape: 'sheet', label: 'a sheet: my-game, .github/skills, playtest-brief',
    html: '<p class="h10-type">my-game/</p><p class="h10-type">.github/skills/</p><p class="h10-hand h10-big">playtest-brief</p><p class="h10-hand h10-small">only for this one</p>' },
];
export const idea: Paper = { key: 'idea', x: 1620, y: 260, w: 250, h: 250, r: 6, color: '#a8c29c', shape: 'sticky', label: 'a green sticky note: try the prompt that traces a wrong decision back to its instruction',
  html: '<p class="h10-hand h10-big">try this!</p><p class="h10-hand">why did it do X? trace it back to the instruction</p>' };
