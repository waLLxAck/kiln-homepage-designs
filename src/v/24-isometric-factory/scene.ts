// PROTOTYPE variant 21: the isometric factory drawn procedurally. World units: x runs along the belt, y across it, z up.
const C = 0.866;
export const project = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * 0.5 - z];
const pt = (x: number, y: number, z: number) => project(x, y, z).map(n => n.toFixed(1)).join(',');
const poly = (points: [number, number, number][], fill: string, cls = '') => `<polygon${cls ? ` class="${cls}"` : ''} points="${points.map(p => pt(...p)).join(' ')}" fill="${fill}"/>`;

type Shade = [string, string, string];
export const yellow: Shade = ['#ffe68a', '#ffd04a', '#f2b322'];
export const tomato: Shade = ['#ff8f73', '#ff6347', '#e2482d'];
export const sky: Shade = ['#e4f4ff', '#b7e1fb', '#86c8ef'];
export const mint: Shade = ['#c8f5e1', '#95e4c6', '#62cda5'];
export const white: Shade = ['#ffffff', '#eef3fa', '#d5deec'];
export const navy: Shade = ['#56668f', '#3b4a72', '#2a365c'];

export function box(x: number, y: number, z: number, w: number, d: number, h: number, c: Shade, cls = '') {
  return `<g${cls ? ` class="${cls}"` : ''}>${poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c[0])}${poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], c[1])}${poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], c[2])}</g>`;
}

// A flat face on the +x side (x fixed) or +y side (y fixed), for windows, doors and tunnel mouths.
const faceX = (x: number, y: number, z: number, d: number, h: number, fill: string, cls = '') => poly([[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]], fill, cls);
const faceY = (x: number, y: number, z: number, w: number, h: number, fill: string, cls = '') => poly([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], fill, cls);

function sign(x: number, y: number, z: number, n: number, label: string) {
  const [sx, sy] = project(x, y, z);
  const width = label.length * 10.4 + 52;
  return `<g class="v21-sign" transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})">
    <line x1="0" y1="0" x2="0" y2="-26"/>
    <rect x="${-width / 2}" y="-62" width="${width}" height="38" rx="19"/>
    <circle cx="${-width / 2 + 19}" cy="-43" r="12"/>
    <text class="v21-sign-n" x="${-width / 2 + 19}" y="-38">${n}</text>
    <text x="${-width / 2 + 38}" y="-37">${label}</text>
  </g>`;
}

export const BELT = { start: 0, end: 940, y: 0, d: 70, h: 36 };
export const HOPPER = { x: 40, w: 90 };
export const PRESS = { x: 250, w: 100 };
export const TEST = { x: 450, w: 120 };
export const STAMP = { x: 690 };
export const CHUTE = { x: 840, w: 100 };
export const FOLDERS = [
  { y: -150, label: 'Claude Code', path: '~/.claude/skills' },
  { y: -20, label: 'Codex', path: '~/.agents/skills' },
  { y: 110, label: 'Copilot', path: '.github/skills' },
];
export const MANIFOLD_X = 1060;

function belt() {
  const { start, end, y, d, h } = BELT;
  const stripes = Array.from({ length: Math.ceil((end - start) / 30) + 2 }, (_, i) => {
    const x = start - 30 + i * 30;
    return `<line x1="${project(x, y + 4, h)[0].toFixed(1)}" y1="${project(x, y + 4, h)[1].toFixed(1)}" x2="${project(x, y + d - 4, h)[0].toFixed(1)}" y2="${project(x, y + d - 4, h)[1].toFixed(1)}"/>`;
  }).join('');
  const rollers = Array.from({ length: 16 }, (_, i) => {
    const [cx, cy] = project(start + 30 + i * 58, y + d, h / 2);
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="7" ry="9" transform="rotate(-30 ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
  }).join('');
  return `<g class="v21-belt">
    ${box(start, y, 0, end - start, d, h, ['#5d6c93', '#3b4a72', '#2a365c'])}
    <clipPath id="v21-belt-clip"><polygon points="${pt(start, y, h)} ${pt(end, y, h)} ${pt(end, y + d, h)} ${pt(start, y + d, h)}"/></clipPath>
    <g clip-path="url(#v21-belt-clip)"><g class="v21-stripes">${stripes}</g></g>
    <g class="v21-rollers">${rollers}</g>
    ${poly([[start, y + d, h], [end, y + d, h], [end, y + d, h - 5], [start, y + d, h - 5]], '#ffd04a')}
  </g>`;
}

function hopper() {
  const { x, w } = HOPPER;
  const y = -10, d = 90;
  return `<g class="v21-m" data-m="0">
    ${box(x, y, 0, w, d, 120, yellow)}
    ${faceX(x + w, 5, BELT.h, 60, 44, '#1b2a4a')}
    ${poly([[x - 26, y - 26, 190], [x + w + 26, y - 26, 190], [x + w + 26, y + d + 26, 190], [x - 26, y + d + 26, 190]], '#1b2a4a')}
    ${poly([[x, y + d, 120], [x + w, y + d, 120], [x + w + 26, y + d + 26, 190], [x - 26, y + d + 26, 190]], yellow[1])}
    ${poly([[x + w, y, 120], [x + w, y + d, 120], [x + w + 26, y + d + 26, 190], [x + w + 26, y - 26, 190]], yellow[2])}
    ${poly([[x - 26, y + d + 26, 190], [x + w + 26, y + d + 26, 190], [x + w + 26, y + d + 26, 198], [x - 26, y + d + 26, 198]], '#fff3c4')}
    ${poly([[x + w + 26, y - 26, 190], [x + w + 26, y + d + 26, 190], [x + w + 26, y + d + 26, 198], [x + w + 26, y - 26, 198]], '#ffe68a')}
    ${faceY(x + 18, y + d, 34, 54, 30, '#fff7d6')}
    <text class="v21-face-text" transform="matrix(${C} 0.5 0 1 ${project(x + 24, y + d, 46).map(n => n.toFixed(1)).join(' ')})">Ctrl+N</text>
    ${sign(x + w / 2, y + d, 222, 1, 'Capture hopper')}
  </g>`;
}

function press() {
  const { x, w } = PRESS;
  const y = -20, d = 110;
  return `<g class="v21-m" data-m="1">
    ${box(x, y, 0, w, d, 120, tomato)}
    ${faceX(x + w, 5, BELT.h, 60, 44, '#1b2a4a')}
    ${box(x + 20, y + 16, 120, 12, 12, 90, white)}
    ${box(x + w - 32, y + d - 28, 120, 12, 12, 90, white)}
    <g class="v21-press-head">${box(x + 8, y + 8, 150, w - 16, d - 16, 26, white)}</g>
    ${box(x + 4, y + 4, 206, w - 8, d - 8, 18, navy)}
    ${faceY(x + 14, y + d, 30, 72, 54, '#ffd9cf')}
    <g class="v21-face-lines">${[0, 1, 2].map(i => `<line x1="${project(x + 24, y + d, 70 - i * 13)[0].toFixed(1)}" y1="${project(x + 24, y + d, 70 - i * 13)[1].toFixed(1)}" x2="${project(x + 76 - i * 12, y + d, 70 - i * 13)[0].toFixed(1)}" y2="${project(x + 76 - i * 12, y + d, 70 - i * 13)[1].toFixed(1)}"/>`).join('')}</g>
    ${sign(x + w / 2, y + d / 2, 262, 2, 'Prompt press')}
  </g>`;
}

function repoAndPipe() {
  const px = TEST.x + 50, rx = 440, ry = -470, rw = 120, rd = 100;
  const [a, b] = [project(px, -40, 72), project(px, ry + rd, 72)];
  const line = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  const [tx, ty] = project(px, -290, 72);
  return `<g class="v21-m v21-repo-group" data-m="2">
    ${box(rx, ry, 0, rw, rd, 100, white)}
    ${poly([[rx, ry, 100], [rx + rw, ry, 100], [rx + rw, ry + 50, 140], [rx, ry + 50, 140]], navy[0])}
    ${poly([[rx, ry + 50, 140], [rx + rw, ry + 50, 140], [rx + rw, ry + rd, 100], [rx, ry + rd, 100]], navy[1])}
    ${poly([[rx + rw, ry, 100], [rx + rw, ry + 50, 140], [rx + rw, ry + rd, 100]], navy[2])}
    ${faceY(rx + 12, ry + rd, 0, 30, 56, '#86c8ef')}
    ${faceX(rx + rw, ry + 20, 40, 60, 34, '#1b2a4a')}
    <text class="v21-face-text v21-face-dark" transform="matrix(${C} -0.5 0 1 ${project(rx + rw, ry + 70, 50).map(n => n.toFixed(1)).join(' ')})">main</text>
    <path class="v21-pipe-outer" d="${line}"/>
    <path class="v21-pipe-inner" d="${line}"/>
    <path class="v21-pipe-flow" d="M${b[0].toFixed(1)} ${b[1].toFixed(1)} L${a[0].toFixed(1)} ${a[1].toFixed(1)}"/>
    <g class="v21-tag" transform="translate(${(tx + 18).toFixed(1)} ${(ty + 6).toFixed(1)})"><rect x="0" y="-15" width="112" height="30" rx="7"/><circle cx="15" cy="0" r="5"/><text x="28" y="5">read-only</text></g>
    <g class="v21-label" transform="translate(${project(rx + rw / 2, ry, 160).map(n => n.toFixed(1)).join(' ')})"><text x="0" y="0" text-anchor="middle">your repo</text></g>
  </g>`;
}

function chamber() {
  const { x, w } = TEST;
  const y = -30, d = 130;
  const [wx, wy] = project(x + w / 2, y + d, 92);
  return `<g class="v21-m" data-m="2">
    ${box(x, y, 0, w, d, 150, sky)}
    ${faceX(x + w, 5, BELT.h, 60, 44, '#1b2a4a')}
    ${box(x + 30, y + 30, 150, 60, 60, 16, white)}
    <line class="v21-antenna" x1="${project(x + 60, y + 60, 166)[0].toFixed(1)}" y1="${project(x + 60, y + 60, 166)[1].toFixed(1)}" x2="${project(x + 60, y + 60, 214)[0].toFixed(1)}" y2="${project(x + 60, y + 60, 214)[1].toFixed(1)}"/>
    <circle class="v21-lamp" cx="${project(x + 60, y + 60, 220)[0].toFixed(1)}" cy="${project(x + 60, y + 60, 220)[1].toFixed(1)}" r="8"/>
    <g transform="translate(${wx.toFixed(1)} ${wy.toFixed(1)}) matrix(${C} 0.5 0 1 0 0)">
      <circle class="v21-port" r="34"/>
      <g class="v21-port-lines"><line x1="-20" y1="-12" x2="16" y2="-12"/><line x1="-20" y1="0" x2="6" y2="0"/><line x1="-20" y1="12" x2="20" y2="12"/></g>
      <circle class="v21-port-rim" r="34"/>
    </g>
    ${sign(x + w / 2, y + d / 2, 222, 3, 'Test chamber')}
  </g>`;
}

function stamp() {
  const x = STAMP.x - 10;
  return `<g class="v21-m" data-m="3">
    ${box(x, -34, 0, 20, 20, 190, navy)}
    <g class="v21-stamp-head">
      ${box(x + 4, 22, 70, 12, 12, 104, white)}
      ${box(x - 14, 10, 44, 48, 50, 30, tomato)}
    </g>
    ${box(x, 88, 0, 20, 20, 190, navy)}
    ${box(x - 4, -38, 190, 28, 150, 20, yellow)}
    ${sign(STAMP.x + 30, 37, 246, 4, 'Approval stamp')}
  </g>`;
}

function chute() {
  const { x, w } = CHUTE;
  const y = -20, d = 110;
  const pipes = FOLDERS.map(f => {
    const yc = f.y + 45;
    const pts2 = [project(x + w, 35, 118), project(MANIFOLD_X, 35, 118), project(MANIFOLD_X, yc, 118), project(MANIFOLD_X, yc, 96)];
    return `M${pts2.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L')}`;
  }).join(' ');
  return `<g class="v21-m" data-m="4">
    <path class="v21-pipe-outer" d="${pipes}"/>
    <path class="v21-pipe-inner v21-pipe-yellow" d="${pipes}"/>
    ${box(x, y, 0, w, d, 150, yellow)}
    ${poly([[x - 12, y - 12, 150], [x + w + 12, y - 12, 150], [x + w + 12, y + d + 12, 150], [x - 12, y + d + 12, 150]], '#1b2a4a')}
    ${poly([[x - 12, y + d + 12, 150], [x + w + 12, y + d + 12, 150], [x + w + 12, y + d + 12, 164], [x - 12, y + d + 12, 164]], yellow[1])}
    ${poly([[x + w + 12, y - 12, 150], [x + w + 12, y + d + 12, 150], [x + w + 12, y + d + 12, 164], [x + w + 12, y - 12, 164]], yellow[2])}
    ${faceY(x + 16, y + d, 30, 68, 70, '#fff7d6')}
    <g class="v21-face-arrows">${[0, 1].map(i => `<path d="M${project(x + 34, y + d, 82 - i * 26).map(n => n.toFixed(1)).join(' ')} L${project(x + 50, y + d, 68 - i * 26).map(n => n.toFixed(1)).join(' ')} L${project(x + 66, y + d, 82 - i * 26).map(n => n.toFixed(1)).join(' ')}"/>`).join('')}</g>
    ${sign(x + w, y + d, 230, 5, 'Install chute')}
  </g>`;
}

function folders() {
  return FOLDERS.map((f, i) => {
    const x = MANIFOLD_X - 45, y = f.y;
        return `<g class="v21-folder" data-folder="${i}">
      ${box(x, y, 0, 90, 90, 56, ['#fff1b8', '#ffd766', '#efb92f'])}
      ${poly([[x + 8, y + 8, 56], [x + 82, y + 8, 56], [x + 82, y + 82, 56], [x + 8, y + 82, 56]], '#c98f12')}
      ${box(x, y, 56, 6, 44, 18, ['#fff1b8', '#ffd766', '#efb92f'])}
    </g>`;
  }).join('') + FOLDERS.map(f => {
    const [lx, ly] = project(MANIFOLD_X + 45, f.y + 45, 20);
    const w = Math.max(f.label.length * 10.5, f.path.length * 8.6) + 24;
    return `<g class="v21-folder-label" transform="translate(${(lx + 26).toFixed(1)} ${(ly - 10).toFixed(1)})"><rect x="0" y="-22" width="${w.toFixed(0)}" height="52" rx="10"/><text x="12" y="0">${f.label}</text><text class="v21-path" x="12" y="20">${f.path}</text></g>`;
  }).join('');
}

function warehouse() {
  const x0 = -110, y0 = -450, w = 330, d = 176;
  const colors: Shade[] = [tomato, sky, mint, yellow, white];
  const shelves = [0, 1, 2].map(row => {
    const y = y0 + 26 + row * 48;
    const crates = Array.from({ length: 5 }, (_, i) => {
      const c = colors[(row * 2 + i + (i % 3 === 0 ? 1 : 0)) % colors.length];
      return box(x0 + 42 + i * 52, y + 4, 44, 38, 26, 26 - (i % 2) * 8, c);
    }).join('');
    return `${box(x0 + 30, y, 0, w - 70, 34, 44, ['#f7efe0', '#e3d4ba', '#cdb993'])}${crates}`;
  }).join('');
  return `<g class="v21-m" data-m="5">
    ${box(x0, y0, 0, w, d, 8, ['#fbf6ec', '#e3d4ba', '#cdb993'])}
    ${box(x0, y0, 8, 10, d, 64, ['#fbf6ec', '#e3d4ba', '#cdb993'])}
    ${box(x0, y0, 8, w, 10, 64, ['#fbf6ec', '#e3d4ba', '#cdb993'])}
    ${shelves}
    ${box(x0 + w - 10, y0, 8, 10, d, 22, ['#fbf6ec', '#e3d4ba', '#cdb993'])}
    ${box(x0, y0 + d - 10, 8, w, 10, 22, ['#fbf6ec', '#e3d4ba', '#cdb993'])}
    ${sign(x0 + 20, y0 + d, 150, 6, 'Warehouse: your library')}
  </g>`;
}

function spriteCard(inner: string, fill = '#fff') {
  return `<rect x="-22" y="-38" width="44" height="34" rx="5" fill="${fill}"/>${inner}`;
}

export const itemKinds = ['post', 'video', 'shot'] as const;
export function sprite(kind: typeof itemKinds[number]) {
  const raw = kind === 'post'
    ? spriteCard('<circle cx="-12" cy="-28" r="5" fill="#1b2a4a"/><line x1="-4" y1="-30" x2="14" y2="-30"/><line x1="-14" y1="-19" x2="14" y2="-19"/><line x1="-14" y1="-12" x2="6" y2="-12"/>')
    : kind === 'video'
      ? spriteCard('<path d="M-6 -30 L9 -21 L-6 -12 Z" fill="#fff" stroke="none"/>', '#ff6347')
      : spriteCard('<path d="M-16 -9 L-5 -22 L3 -14 L8 -19 L16 -9 Z" fill="#fff" stroke="none"/><circle cx="10" cy="-29" r="4" fill="#ffd04a" stroke="none"/>', '#86c8ef');
  const prompt = spriteCard('<rect x="-22" y="-38" width="8" height="34" rx="3" fill="#ffd04a"/><line x1="-8" y1="-29" x2="14" y2="-29"/><line x1="-8" y1="-21" x2="10" y2="-21"/><line x1="-8" y1="-13" x2="14" y2="-13"/>');
  const verdict = '<circle class="v21-v" cx="18" cy="-38" r="9" fill="#62cda5"/><path d="M13.5 -38 L17 -34.5 L23 -41" fill="none" stroke="#1b2a4a" stroke-width="2.4"/>';
  const stamped = '<g class="v21-stampmark"><circle cx="0" cy="-21" r="12" fill="none" stroke="#e2482d" stroke-width="3"/><path d="M-5 -21 L-1 -17 L6 -26" fill="none" stroke="#e2482d" stroke-width="3"/></g>';
  const skill = '<path d="M-20 -32 L-6 -32 L-2 -27 L20 -27 L20 -4 L-20 -4 Z" fill="#ffd04a"/><text class="v21-sk" x="0" y="-11">SKILL</text>';
  return `<g class="v21-s0">${raw}</g><g class="v21-s1">${prompt}</g><g class="v21-s2">${prompt}${verdict}</g><g class="v21-s3">${prompt}${stamped}</g><g class="v21-s4">${skill}</g>`;
}

export function scene() {
  const floor = box(-140, -520, -24, 1290, 720, 24, mint, 'v21-floor');
  const [bx, by] = project(-140, -520, 0);
  return `
  <defs>
    <pattern id="v21-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="matrix(${C} 0.5 ${-C} 0.5 ${bx} ${by})"><path d="M40 0 H0 V40" fill="none" stroke="#7fd9b6" stroke-width="1.6"/></pattern>
  </defs>
  <g class="v21-clouds" aria-hidden="true">
    <path class="v21-cloud" d="M-160 -250 a30 30 0 0 1 56 -12 a38 38 0 0 1 70 10 a24 24 0 0 1 8 46 h-130 a24 24 0 0 1 -4 -44z"/>
    <path class="v21-cloud v21-cloud-b" d="M1180 -280 a26 26 0 0 1 48 -10 a34 34 0 0 1 62 8 a22 22 0 0 1 6 40 h-114 a22 22 0 0 1 -2 -38z"/>
  </g>
  ${floor}
  <polygon points="${pt(-140, -520, 0)} ${pt(1150, -520, 0)} ${pt(1150, 200, 0)} ${pt(-140, 200, 0)}" fill="url(#v21-grid)"/>
  ${warehouse()}
  ${repoAndPipe()}
  ${belt()}
  <g class="v21-items"></g>
  ${hopper()}
  ${press()}
  ${chamber()}
  ${stamp()}
  ${chute()}
  <g class="v21-m" data-m="4">${folders()}</g>
  <g class="v21-drops"></g>`;
}
