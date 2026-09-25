// PROTOTYPE round 4, H04: the three drawn panels of the hero strip, plus the small reader in panel four. Ink, halftone, one spot yellow.
import { box, brush, burstLines, ink, oval, reseed, strokes } from './ink';

const svg = (w: number, h: number, label: string, body: string, align = 'xMidYMid') =>
  `<svg class="h04-art" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${align} slice" role="img" aria-label="${label}">${body}</svg>`;
const fill = (d: string, cls: string) => `<path d="${d}" class="${cls}"/>`;

/** Shared defs: halftone dot patterns. Rendered once, hidden. */
export const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <pattern id="h04-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.25" fill="#141414" fill-opacity=".32"/></pattern>
  <pattern id="h04-dots-y" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><circle cx="4" cy="4" r="2.3" fill="#ffd21f"/></pattern>
</defs></svg>`;

function face(cx: number, cy: number, rx: number, ry: number) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="h04-paper"/>${oval(cx, cy, rx, ry, 4.4)}`;
}

export function panelOne() {
  reseed(12);
  const label = (y: number, text: string) => `<text x="156" y="${y}" class="h04-hand" font-size="11.5">${text}</text>`;
  const folderIcon = (x: number, y: number) => ink(brush([[x, y + 4], [x, y + 16], [x + 22, y + 16], [x + 22, y + 4], [x + 10, y + 4], [x + 8, y], [x + 1, y]], 2.2, true), 'h04-even');
  return svg(300, 340, 'Panel one: a developer in a black hoodie stares, sweating, at a monitor showing three folders called code-review, code-review (1) and code-review-FINAL.', `
    <rect width="300" height="340" class="h04-paper"/>
    <rect width="300" height="262" fill="url(#h04-dots)"/>
    <path d="M0,265 L300,260 L300,340 L0,340Z" class="h04-white"/>
    ${strokes([[[0, 266], [90, 263], [200, 264], [300, 260]]], 5)}
    ${strokes([[[200, 304], [236, 290]], [[218, 316], [262, 298]], [[240, 328], [282, 310]]], 2.2)}
    <rect x="122" y="104" width="156" height="118" class="h04-white"/>${box(122, 104, 156, 118, 5)}
    ${strokes([[[200, 224], [199, 252]], [[172, 256], [230, 254]]], 6)}
    ${folderIcon(132, 120)}${label(133, 'code-review')}${folderIcon(132, 152)}${label(165, 'code-review (1)')}${folderIcon(132, 184)}${label(197, 'code-review-FINAL')}
    ${fill('M0,340 L3,270 C8,242 28,228 48,220 L84,217 C104,223 116,238 122,258 L146,262 L148,276 L114,280 L108,340Z', 'h04-black')}
    ${strokes([[[50, 238], [56, 266]], [[76, 236], [72, 262]]], 2.2).replace(/h04-ink/g, 'h04-ink h04-ink-white')}
    ${face(66, 176, 36, 40)}
    ${fill('M26,180 C14,132 52,116 76,126 L82,110 L90,130 C100,126 110,138 106,154 C94,140 70,140 52,150 C42,156 34,168 26,180Z', 'h04-black')}
    ${strokes([[[54, 170], [45, 179], [52, 192]]], 3)}
    ${oval(95, 176, 10, 10, 3)}${strokes([[[85, 172], [58, 168]]], 2.4)}
    <circle cx="97" cy="177" r="2.6" class="h04-black"/>
    ${strokes([[[85, 156], [103, 162]], [[104, 182], [111, 192], [102, 195]], [[84, 208], [90, 204], [96, 209], [101, 205]]], 3)}
    ${fill('M114,128 C121,140 123,149 114,151 C105,149 107,140 114,128Z', 'h04-white')}${ink(brush([[114, 128], [122, 142], [114, 151], [106, 142]], 2.2, true), 'h04-even')}
    ${strokes([[[24, 146], [10, 138]], [[28, 128], [18, 114]]], 3.2)}
  `);
}

export function panelTwo() {
  reseed(27);
  const sheet = (x: number, y: number, r: number, word: string, size: number) => `<g transform="rotate(${r} ${x + 55} ${y + 70})">
    <rect x="${x}" y="${y}" width="110" height="140" class="h04-white"/>${box(x, y, 110, 140, 3.6)}
    ${strokes([[[x + 12, y + 50], [x + 92, y + 49]], [[x + 12, y + 66], [x + 86, y + 67]], [[x + 12, y + 82], [x + 70, y + 81]]], 1.6)}
    ${fill(`M${x + 80},${y - 6} L${x + 96},${y - 6} L${x + 96},${y + 28} L${x + 88},${y + 20} L${x + 80},${y + 28}Z`, 'h04-black')}
    <text x="${x + 12}" y="${y + 34}" class="h04-hand" font-size="${size}">${word}</text></g>`;
  return svg(300, 340, 'Panel two: the same developer, smiling, bookmarks a prompt on a phone in front of a tall pile of saved pages all labelled later.', `
    <rect width="300" height="340" class="h04-paper"/>
    <rect x="150" width="150" height="340" fill="url(#h04-dots)"/>
    ${sheet(160, 96, 9, 'later', 16)}${sheet(150, 124, -7, 'later', 16)}${sheet(162, 156, 4, 'LATER!!', 19)}
    <text x="206" y="326" class="h04-hand h04-spot-text" font-size="30" transform="rotate(-8 206 326)">×49</text>
    ${fill('M0,340 L6,252 C14,228 38,212 62,207 L132,207 C150,212 160,224 166,238 L174,286 L150,300 L140,262 L136,340Z', 'h04-black')}
    ${face(98, 158, 40, 42)}
    ${fill('M56,160 C50,112 92,100 118,110 C136,116 146,136 140,158 C130,138 112,132 96,136 L90,124 L84,138 C72,140 62,148 56,160Z', 'h04-black')}
    ${oval(83, 160, 11, 11, 3)}${oval(115, 160, 11, 11, 3)}${strokes([[[94, 158], [104, 158]]], 2.4)}
    ${strokes([[[78, 161], [83, 157], [88, 161]], [[110, 161], [115, 157], [120, 161]], [[82, 184], [98, 195], [114, 184]]], 3)}
    <g transform="rotate(-14 150 236)"><rect x="132" y="204" width="36" height="60" rx="5" class="h04-white"/>${box(132, 204, 36, 60, 3.4)}
      ${fill('M142,218 L158,218 L158,244 L150,237 L142,244Z', 'h04-yellow')}${ink(brush([[142, 218], [158, 218], [158, 244], [150, 237], [142, 244]], 2.2, true), 'h04-even')}</g>
    <ellipse cx="160" cy="272" rx="14" ry="12" class="h04-white"/>${oval(160, 272, 14, 12, 3)}
    ${fill('M182,188 L187,200 L199,204 L187,208 L182,220 L177,208 L165,204 L177,200Z', 'h04-yellow')}${ink(brush([[182, 188], [187, 200], [199, 204], [187, 208], [182, 220], [177, 208], [165, 204], [177, 200]], 2, true), 'h04-even')}
  `);
}

export function panelThree() {
  reseed(41);
  return svg(300, 340, 'Panel three: a close-up of a mouse cursor clicking the Kiln app icon, with speed lines bursting out around it.', `
    <rect width="300" height="340" class="h04-paper"/>
    <rect width="300" height="340" fill="url(#h04-dots-y)" opacity=".75"/>
    <g class="h04-lines">${burstLines(150, 168, 70, 260, 30, 5)}</g>
    <circle cx="150" cy="168" r="70" class="h04-paper"/>
    <rect x="106" y="124" width="88" height="88" rx="16" class="h04-yellow"/>${box(106, 124, 88, 88, 5)}
    ${fill('M122,204 L122,168 C122,140 178,140 178,168 L178,204Z', 'h04-black')}
    ${fill('M137,204 L137,176 C137,160 163,160 163,176 L163,204Z', 'h04-yellow')}
    ${fill('M150,200 C140,196 142,186 148,178 C149,186 154,186 152,178 C160,186 160,198 150,200Z', 'h04-white')}
    <path d="M186,186 L186,232 L197,221 L206,241 L214,237 L205,217 L221,217 Z" class="h04-white h04-cursor"/>
    ${strokes([[[176, 178], [168, 168]], [[187, 174], [188, 160]], [[198, 180], [207, 171]]], 3.4)}
  `);
}

export function panelFour() {
  reseed(55);
  return svg(400, 340, 'Panel four: the developer, small in the corner, looks up with an open mouth as a crisp Kiln window bursts out of the panel.', `
    <rect width="400" height="340" class="h04-paper"/>
    <rect width="400" height="340" fill="url(#h04-dots)"/>
    <g class="h04-lines">${burstLines(270, 110, 40, 300, 26, 4)}</g>
    ${fill('M0,340 L6,322 C14,306 32,298 50,296 L100,296 C118,300 128,312 132,340Z', 'h04-black')}
    ${face(72, 262, 32, 34)}
    ${fill('M40,262 C34,222 70,212 92,220 C106,226 112,240 106,256 C98,242 84,238 72,240 L68,230 L62,242 C54,244 46,252 40,262Z', 'h04-black')}
    ${oval(60, 262, 9, 9, 2.8)}${oval(86, 262, 9, 9, 2.8)}${strokes([[[69, 261], [77, 261]]], 2.2)}
    <circle cx="61" cy="258" r="2.4" class="h04-black"/><circle cx="87" cy="258" r="2.4" class="h04-black"/>
    <ellipse cx="74" cy="284" rx="5" ry="7" class="h04-black"/>
    ${strokes([[[52, 246], [64, 243]], [[82, 243], [94, 246]]], 2.6)}
  `, 'xMinYMax');
}
