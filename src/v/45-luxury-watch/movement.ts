// PROTOTYPE 42: a procedurally drawn watch movement in five layers (mainplate, going train, barrel, balance, bridges).
// Each layer is its own SVG so the exploded view can separate them in 3D. Line art in champagne gold on black.

const G = '#cdb27b';
const round = (n: number) => Math.round(n * 100) / 100;

/** A toothed wheel outline. */
function gearPath(cx: number, cy: number, r: number, teeth: number, depth = 5, saw = false) {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    const p = (ang: number, rad: number) => `${round(cx + Math.cos(ang) * rad)},${round(cy + Math.sin(ang) * rad)}`;
    if (saw) pts.push(p(a, r - depth), p(a + step * .15, r), p(a + step * .35, r - depth * .2), p(a + step, r - depth));
    else pts.push(p(a, r - depth), p(a + step * .18, r), p(a + step * .5, r), p(a + step * .68, r - depth));
  }
  return `M${pts.join(' L')}Z`;
}

/** Wheel with rim, crossings (spokes) and a jewelled pivot. */
function wheel(cx: number, cy: number, r: number, teeth: number, spokes: number, cls: string, depth = 5, saw = false) {
  const inner = r - depth - 5;
  const hub = Math.max(7, r * .16);
  const arms = Array.from({ length: spokes }, (_, i) => {
    const a = (i / spokes) * Math.PI * 2;
    const x = cx + Math.cos(a) * inner, y = cy + Math.sin(a) * inner;
    return `<line x1="${cx}" y1="${cy}" x2="${round(x)}" y2="${round(y)}"/>`;
  }).join('');
  return `<g class="${cls}">
    <path d="${gearPath(cx, cy, r, teeth, depth, saw)}" class="v42-fill"/>
    <circle cx="${cx}" cy="${cy}" r="${inner}" class="v42-void"/>
    <g class="v42-arms">${arms}</g>
    <circle cx="${cx}" cy="${cy}" r="${hub}" class="v42-fill"/>
    <circle cx="${cx}" cy="${cy}" r="${round(hub * .45)}" class="v42-jewel"/>
  </g>`;
}

const screw = (x: number, y: number, a = 30) => `<g class="v42-screw"><circle cx="${x}" cy="${y}" r="7"/><line x1="${round(x - Math.cos(a * Math.PI / 180) * 6)}" y1="${round(y - Math.sin(a * Math.PI / 180) * 6)}" x2="${round(x + Math.cos(a * Math.PI / 180) * 6)}" y2="${round(y + Math.sin(a * Math.PI / 180) * 6)}"/></g>`;
const jewel = (x: number, y: number) => `<g><circle cx="${x}" cy="${y}" r="8" class="v42-chaton"/><circle cx="${x}" cy="${y}" r="4.2" class="v42-jewel"/></g>`;
const anchor = (x: number, y: number) => `<circle class="v42-anchor" cx="${x}" cy="${y}" r="2.5"/>`;

export type Layer = { key: string; svg: string };

export function movement(id: string): Layer[] {
  const perlage = Array.from({ length: 11 }, (_, row) => Array.from({ length: 11 }, (_, col) => `<circle cx="${col * 56 + (row % 2) * 28}" cy="${row * 56}" r="30"/>`).join('')).join('');
  const minuteTrack = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2, r1 = i % 5 ? 280 : 272;
    return `<line x1="${round(300 + Math.cos(a) * r1)}" y1="${round(300 + Math.sin(a) * r1)}" x2="${round(300 + Math.cos(a) * 288)}" y2="${round(300 + Math.sin(a) * 288)}"/>`;
  }).join('');
  const spiral = (() => {
    let d = '';
    for (let t = 0; t <= 34; t += .25) {
      const r = 6 + t * 1.45, a = t * .62;
      d += `${t === 0 ? 'M' : 'L'}${round(215 + Math.cos(a) * r)},${round(420 + Math.sin(a) * r)} `;
    }
    return d;
  })();
  const timingScrews = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<circle cx="${round(215 + Math.cos(a) * 70)}" cy="${round(420 + Math.sin(a) * 70)}" r="3.4" class="v42-fill"/>`;
  }).join('');
  const stripes = Array.from({ length: 14 }, (_, i) => `<line x1="${-60 + i * 50}" y1="0" x2="${i * 50 + 60}" y2="600"/>`).join('');

  const svg = (key: string, body: string) => ({ key, svg: `<svg class="v42-layer-svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">${body}</svg>` });

  return [
    svg('plate', `
      <defs><clipPath id="${id}-plate"><circle cx="300" cy="300" r="246"/></clipPath>
        <path id="${id}-arc" d="M 300 300 m -226 0 a 226 226 0 0 0 452 0"/></defs>
      <circle cx="300" cy="300" r="258" class="v42-plate"/>
      <g class="v42-track">${minuteTrack}</g>
      <circle cx="300" cy="300" r="246" class="v42-hair"/>
      <g clip-path="url(#${id}-plate)" class="v42-perlage">${perlage}</g>
      <text class="v42-engrave"><textPath href="#${id}-arc" startOffset="50%" text-anchor="middle">Published to your own Kiln repository on GitHub</textPath></text>
      ${[[120, 330], [480, 260], [300, 520], [300, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" class="v42-hair"/><circle cx="${x}" cy="${y}" r="3" class="v42-fillgold"/>`).join('')}
      ${anchor(540, 360)}`),
    svg('train', `
      ${wheel(300, 300, 84, 64, 5, 'v42-rot v42-rot-a', 5)}
      ${wheel(404, 220, 56, 44, 4, 'v42-rot v42-rot-b', 4)}
      ${wheel(438, 338, 46, 36, 4, 'v42-rot v42-rot-c', 4)}
      ${wheel(378, 440, 36, 15, 3, 'v42-rot v42-rot-esc', 7, true)}
      ${anchor(484, 338)}`),
    svg('barrel', `
      ${wheel(200, 222, 102, 84, 1, 'v42-rot v42-rot-barrel', 5)}
      <circle cx="200" cy="222" r="80" class="v42-fill"/>
      <path d="${gearPath(200, 222, 58, 28, 6, true)}" class="v42-fill v42-rot v42-rot-ratchet"/>
      <circle cx="200" cy="222" r="40" class="v42-hair"/>
      <rect x="190" y="212" width="20" height="20" class="v42-fillgold" transform="rotate(20 200 222)"/>
      <path d="M 262 154 q 26 -10 40 8 l -18 12" class="v42-hair v42-click"/>
      <text x="200" y="286" class="v42-engrave v42-center">Revision 2</text>
      ${anchor(302, 222)}`),
    svg('balance', `
      <path d="M 160 470 C 150 390 200 350 250 350 L 350 410 C 370 425 360 450 340 452 L 280 452 C 260 500 180 520 160 470 Z" class="v42-bridge"/>
      <g class="v42-balance">
        <circle cx="215" cy="420" r="70" class="v42-rim"/>
        <circle cx="215" cy="420" r="62" class="v42-hair"/>
        ${timingScrews}
        ${[0, 90, 180, 270].map(a => `<line x1="215" y1="420" x2="${round(215 + Math.cos(a * Math.PI / 180) * 62)}" y2="${round(420 + Math.sin(a * Math.PI / 180) * 62)}" class="v42-arm-line"/>`).join('')}
      </g>
      <path d="${spiral}" class="v42-spring"/>
      <g class="v42-pallet"><path d="M 300 440 L 350 432 M 318 424 l 12 26 M 350 432 l 6 -8 M 350 432 l 6 8" class="v42-hair v42-thick"/></g>
      ${jewel(215, 420)}
      ${anchor(292, 452)}`),
    svg('bridges', `
      <defs><clipPath id="${id}-br"><path d="M 110 150 C 120 90 250 70 310 120 L 470 180 C 510 196 500 250 460 256 L 330 262 C 300 300 250 320 200 310 C 130 300 100 220 110 150 Z"/></clipPath></defs>
      <path d="M 110 150 C 120 90 250 70 310 120 L 470 180 C 510 196 500 250 460 256 L 330 262 C 300 300 250 320 200 310 C 130 300 100 220 110 150 Z" class="v42-bridge"/>
      <g clip-path="url(#${id}-br)" class="v42-stripes">${stripes}</g>
      <path d="M 480 300 C 500 300 505 380 470 392 L 400 400 C 380 400 378 370 396 362 Z" class="v42-bridge"/>
      ${jewel(404, 220)}${jewel(438, 338)}${jewel(300, 300)}${jewel(200, 222)}
      ${screw(150, 140, 20)}${screw(290, 118, 70)}${screw(462, 232, 110)}${screw(250, 292, 150)}${screw(476, 372, 40)}
      ${anchor(496, 218)}`),
  ];
}

export const gold = G;
