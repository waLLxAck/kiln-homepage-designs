// PROTOTYPE variant 40 — line-art helpers for the flat-pack manual. Everything is drawn in one stroke weight, black on white.

type Pose = 'stand' | 'point' | 'hold' | 'think' | 'scratch' | 'happy';

/** The friendly outlined assembler. (x, y) is the point between the feet. */
export function person(x: number, y: number, s = 1, pose: Pose = 'stand', flip = false) {
  const arms: Record<Pose, string> = {
    stand: 'M-15 -74c-6 10-9 20-10 30M15 -74c6 10 9 20 10 30',
    point: 'M-15 -74c-6 10-9 20-10 30M15 -74c10 -6 22 -14 32 -24',
    hold: 'M-15 -74c4 8 14 14 26 16M15 -74c6 6 12 12 22 14',
    think: 'M-15 -74c-6 10-9 20-10 30M15 -74c8 8 8 16 -2 22',
    scratch: 'M-15 -74c-6 10-9 20-10 30M15 -74c10 -6 12 -18 4 -30',
    happy: 'M-15 -74c-10 -8 -16 -18 -20 -28M15 -74c10 -8 16 -18 20 -28',
  };
  const mouth = pose === 'scratch' ? 'M-5 -91q5 -3 10 0' : 'M-5 -93q5 5 10 0';
  return `<g class="v40-person" transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <path d="M-9 -30 -11 -2h-9M9 -30 11 -2h9" fill="none"/>
    <path d="${arms[pose]}" fill="none"/>
    <path d="M-15 -78c-6 16-8 34-6 50h42c2-16 0-34-6-50-8-6-22-6-30 0z"/>
    <circle cx="0" cy="-100" r="15"/>
    <circle cx="-5" cy="-102" r="1.4" class="v40-ink"/><circle cx="5" cy="-102" r="1.4" class="v40-ink"/>
    <path d="${mouth}" fill="none"/>
  </g>`;
}

export const sheet = (x: number, y: number, w: number, h: number, lines = 3, label = '') => `
  <g transform="translate(${x} ${y})">
    <path d="M0 0h${w - 16}l16 16v${h - 16}H0z"/><path d="M${w - 16} 0v16h16" fill="none"/>
    ${Array.from({ length: lines }, (_, i) => `<path d="M12 ${28 + i * 14}h${w - 24 - (i % 2) * 18}" fill="none"/>`).join('')}
    ${label ? `<text class="v40-t" x="12" y="${h - 12}">${label}</text>` : ''}
  </g>`;

export const folder = (x: number, y: number, w: number, h: number, label = '') => `
  <g transform="translate(${x} ${y})">
    <path d="M0 10V0h${w * .36}l10 10h${w * .64 - 10}v${h - 10}H0z"/>
    <path d="M0 18h${w}" fill="none"/>
    ${label ? `<text class="v40-t v40-t-sm" x="${w / 2}" y="${h + 18}" text-anchor="middle">${label}</text>` : ''}
  </g>`;

export const branch = (x: number, y: number) => `
  <g transform="translate(${x} ${y})" fill="none"><circle cx="0" cy="0" r="5"/><circle cx="0" cy="34" r="5"/><circle cx="22" cy="10" r="5"/><path d="M0 5v24M22 15c0 10-22 8-22 16"/></g>`;

export const monitor = (x: number, y: number, w: number, h: number, inner = '') => `
  <g transform="translate(${x} ${y})">
    <rect width="${w}" height="${h}" rx="8"/><rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="3"/>
    <path d="M${w / 2 - 12} ${h}l-6 22h36l-6-22M${w / 2 - 34} ${h + 22}h68"/>
    ${inner}
  </g>`;

export const check = (x: number, y: number, r = 16) => `<g transform="translate(${x} ${y})"><circle r="${r}"/><path d="M${-r * .45} 0l${r * .3} ${r * .32} ${r * .55}-${r * .62}" fill="none" class="v40-thick"/></g>`;
export const cross = (x: number, y: number, r = 16) => `<g transform="translate(${x} ${y})"><circle r="${r}"/><path d="M${-r * .38} ${-r * .38}l${r * .76} ${r * .76}M${r * .38} ${-r * .38}l${-r * .76} ${r * .76}" fill="none" class="v40-thick"/></g>`;

export const arrow = (d: string, i = 0) => `<g class="v40-arrow" style="--i:${i}"><path d="${d}" pathLength="1" fill="none"/></g>`;
export const head = (x: number, y: number, angle: number, i = 0) => `<path class="v40-head" style="--i:${i}" d="M-10 -7 0 0-10 7" fill="none" transform="translate(${x} ${y}) rotate(${angle})"/>`;

export const part = (inner: string, dx: number, dy: number, i = 1) => `<g class="v40-part" style="--dx:${dx}px;--dy:${dy}px;--i:${i}">${inner}</g>`;

export const callout = (x: number, y: number, text: string, r = 22) => `<g class="v40-callout" transform="translate(${x} ${y})"><circle r="${r}"/><text class="v40-t v40-t-big" y="7" text-anchor="middle">${text}</text></g>`;

export const stamp = (x: number, y: number) => `
  <g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="-58" rx="16" ry="12"/><path d="M-7 -48v22h14v-22"/><rect x="-30" y="-26" width="60" height="16" rx="3"/><path d="M-30 -10h60v8h-60z"/>
  </g>`;

export const eye = (x: number, y: number) => `<g transform="translate(${x} ${y})"><path d="M-30 0c16-22 44-22 60 0-16 22-44 22-60 0z"/><circle r="9" class="v40-ink"/></g>`;
export const lock = (x: number, y: number) => `<g transform="translate(${x} ${y})"><path d="M-9 -4v-8a9 9 0 0 1 18 0v8" fill="none"/><rect x="-14" y="-4" width="28" height="22" rx="3"/><circle cx="0" cy="7" r="2.5" class="v40-ink"/></g>`;
export const pencil = (x: number, y: number, angle = -35) => `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 0h70l12 7-12 7H0z"/><path d="M58 0v14M70 0l12 7-12 7" fill="none"/><path d="M78 5l4 2-4 2z" class="v40-ink"/></g>`;
export const magnifier = (x: number, y: number, r = 30) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="none"/><path d="M${r * .72} ${r * .72}l${r * .8} ${r * .8}" class="v40-thick" fill="none"/></g>`;
export const hammer = (x: number, y: number) => `<g transform="translate(${x} ${y}) rotate(-30)"><rect x="-6" y="0" width="12" height="80" rx="3"/><path d="M-26 -18h44l8 8v12h-52z"/></g>`;
export const bookmarkCard = (x: number, y: number, w = 78, h = 96) => `
  <g transform="translate(${x} ${y})">
    <rect width="${w}" height="${h}" rx="8"/><circle cx="16" cy="18" r="7"/><path d="M28 14h26M28 22h16M12 40h${w - 24}M12 52h${w - 30}M12 64h${w - 24}M12 76h${w - 40}" fill="none"/>
    <path d="M${w - 22} 0v28l8-6 8 6V0" />
  </g>`;
export const key = (x: number, y: number) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="0" r="16"/><circle cx="0" cy="0" r="5"/><path d="M16 0h44v12M50 0v9" fill="none"/></g>`;
export const allen = (x: number, y: number) => `<g transform="translate(${x} ${y})"><path d="M0 0h60v12H12v48H0z"/></g>`;
