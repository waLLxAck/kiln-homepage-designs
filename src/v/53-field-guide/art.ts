// PROTOTYPE variant 50 — watercolour-style SVG plates, drawn procedurally. Shapes get a wobble filter and translucent washes.

export const defs = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <filter id="v50-wc" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="0.7"/>
    </filter>
    <filter id="v50-ink" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="v50-bloom" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".7" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#23291f" stop-opacity=".18"/></radialGradient>
  </defs>
</svg>`;

const wash = (d: string, cls: string, extra = '') => `<path d="${d}" class="v50-w ${cls}" ${extra}/>`;
const line = (d: string, extra = '') => `<path d="${d}" class="v50-l" ${extra}/>`;

const beetle = (x: number, y: number, r: number, ghost = false) => `
  <g transform="translate(${x} ${y}) rotate(${r})" ${ghost ? 'class="v50-ghost"' : ''}>
    <g filter="url(#v50-wc)">
      ${wash('M0 -18 C 34 -18 38 22 0 56 C -38 22 -34 -18 0 -18z', 'v50-green')}
      ${wash('M0 -18 C 20 -16 26 10 0 50 C 14 10 10 -12 0 -18z', 'v50-moss', 'opacity=".6"')}
      <ellipse cx="0" cy="-28" rx="23" ry="12" class="v50-w v50-dark"/>
      <ellipse cx="0" cy="-45" rx="13" ry="10" class="v50-w v50-dark"/>
      ${wash('M-26 -10 h14 l4 6 h-18z', 'v50-ochre')}
    </g>
    <g filter="url(#v50-ink)">
      ${line('M0 -18 C 34 -18 38 22 0 56 C -38 22 -34 -18 0 -18z')}
      ${line('M0 -16 V54')}
      ${line('M-20 -8 q-22 -8 -34 -26 M20 -8 q22 -8 34 -26 M-24 8 q-26 0 -40 -2 M24 8 q26 0 40 -2 M-20 26 q-18 12 -28 32 M20 26 q18 12 28 32')}
      ${line('M-5 -53 q-8 -20 -26 -28 M5 -53 q8 -20 26 -28')}
    </g>
  </g>`;

const moth = `
  <g filter="url(#v50-wc)">
    ${wash('M-6 -10 C -60 -80 -150 -60 -140 -10 C -132 20 -60 20 -6 4z', 'v50-ochre')}
    ${wash('M-6 6 C -60 20 -110 60 -80 92 C -56 110 -20 60 -6 20z', 'v50-ochre', 'opacity=".75"')}
    ${wash('M6 -10 C 60 -80 150 -60 140 -10 C 132 20 60 20 6 4z', 'v50-ochre')}
    ${wash('M6 6 C 60 20 110 60 80 92 C 56 110 20 60 6 20z', 'v50-ochre', 'opacity=".75"')}
    <circle cx="-86" cy="-26" r="17" class="v50-w v50-dark" opacity=".65"/>
    <circle cx="-86" cy="-26" r="7" class="v50-w v50-paperfill"/>
    <circle cx="-58" cy="62" r="10" class="v50-w v50-dark" opacity=".55"/>
    <path d="M40 -44 l30 14 l-10 22 l-28 -12z" class="v50-w v50-rust" opacity=".8"/>
    <path d="M70 -2 l34 -6 l4 18 l-32 8z" class="v50-w v50-green" opacity=".8"/>
    <circle cx="64" cy="66" r="12" class="v50-w v50-rust" opacity=".6"/>
    <ellipse cx="0" cy="4" rx="9" ry="46" class="v50-w v50-dark"/>
  </g>
  <g filter="url(#v50-ink)">
    ${line('M-6 -10 C -60 -80 -150 -60 -140 -10 C -132 20 -60 20 -6 4 M-6 6 C -60 20 -110 60 -80 92 C -56 110 -20 60 -6 20')}
    ${line('M6 -10 C 60 -80 150 -60 140 -10 C 132 20 60 20 6 4 M6 6 C 60 20 110 60 80 92 C 56 110 20 60 6 20')}
    ${line('M-3 -40 q-14 -30 -40 -40 M3 -40 q14 -30 40 -40')}
    ${line('M-20 -20 q-40 -10 -80 10 M20 -20 q40 -30 90 -20', 'opacity=".5"')}
  </g>`;

const snail = `
  <g filter="url(#v50-wc)">
    ${wash('M-120 58 Q-60 40 20 46 Q80 50 104 40 Q120 30 124 12 Q112 20 96 22 Q40 30 -40 36 Q-100 40 -120 58z', 'v50-moss')}
    <circle cx="-10" cy="-4" r="52" class="v50-w v50-ochre"/>
    <circle cx="-4" cy="-8" r="34" class="v50-w v50-ochre" opacity=".7"/>
    <circle cx="2" cy="-12" r="17" class="v50-w v50-rust" opacity=".5"/>
    ${wash('M18 40 L18 108 L32 96 L46 108 L46 40z', 'v50-rust')}
  </g>
  <g filter="url(#v50-ink)">
    ${line('M-120 58 Q-60 40 20 46 Q80 50 104 40 Q120 30 124 12 Q112 20 96 22 Q40 30 -40 36')}
    ${line('M-62 -4 A52 52 0 1 1 20 38 M-38 -8 A34 34 0 1 1 26 10 M-15 -12 A17 17 0 1 1 10 2')}
    ${line('M112 20 q4 -30 -6 -46 M122 16 q12 -26 8 -44')}
    <circle cx="106" cy="-26" r="3" class="v50-dotfill"/><circle cx="130" cy="-28" r="3" class="v50-dotfill"/>
    ${line('M18 40 L18 108 L32 96 L46 108 L46 40')}
  </g>`;

const mushrooms = `
  <g filter="url(#v50-wc)">
    ${wash('M-150 40 L120 18 L150 96 L-130 118z', 'v50-paperdark')}
    ${wash('M120 18 L150 96 L128 70z', 'v50-dark', 'opacity=".25"')}
    ${wash('M-60 60 Q-64 10 -58 -20 L-44 -20 Q-40 20 -40 60z', 'v50-paperfill')}
    ${wash('M-110 -18 Q-52 -92 6 -18z', 'v50-rust')}
    ${wash('M8 58 Q4 20 10 0 L22 0 Q26 30 24 58z', 'v50-paperfill')}
    ${wash('M-26 4 Q16 -50 58 4z', 'v50-ochre')}
    ${wash('M66 50 Q64 30 68 18 L76 18 Q78 34 78 50z', 'v50-paperfill')}
    ${wash('M52 20 Q72 -8 92 20z', 'v50-rust', 'opacity=".7"')}
  </g>
  <g filter="url(#v50-ink)">
    ${line('M-150 40 L120 18 L150 96 L-130 118z')}
    ${line('M-120 70 L100 52 M-116 86 L60 72 M-112 100 L20 90', 'opacity=".45"')}
    ${line('M-110 -18 Q-52 -92 6 -18z M-60 60 Q-64 10 -58 -20 M-44 -20 Q-40 20 -40 60')}
    ${line('M-26 4 Q16 -50 58 4z M8 58 Q4 20 10 0 M22 0 Q26 30 24 58')}
    ${line('M52 20 Q72 -8 92 20z')}
    <circle cx="-70" cy="-44" r="5" class="v50-w v50-paperfill"/><circle cx="-36" cy="-52" r="4" class="v50-w v50-paperfill"/><circle cx="20" cy="-18" r="4" class="v50-w v50-paperfill"/>
  </g>`;

const lizard = `
  <g filter="url(#v50-wc)">
    ${wash('M-150 -6 Q-140 -26 -118 -24 Q-90 -30 -40 -18 Q10 -10 30 -2 Q12 10 -40 12 Q-90 16 -118 10 Q-142 12 -150 -6z', 'v50-green')}
    ${wash('M72 6 Q110 0 150 -18 Q156 -14 150 -10 Q116 12 72 18z', 'v50-green', 'opacity=".8"')}
    ${wash('M-110 -8 Q-70 -14 -30 -6', 'v50-dark', 'opacity=".25"')}
  </g>
  <g filter="url(#v50-ink)">
    ${line('M-150 -6 Q-140 -26 -118 -24 Q-90 -30 -40 -18 Q10 -10 30 -2 Q12 10 -40 12 Q-90 16 -118 10 Q-142 12 -150 -6z')}
    ${line('M72 6 Q110 0 150 -18 Q156 -14 150 -10 Q116 12 72 18z')}
    ${line('M-100 -20 l-10 -26 l-12 -4 M-100 -20 l-4 -28 M-100 10 l-12 26 l-12 4 M-40 -16 l6 -28 l10 -6 M-40 10 l8 28 l12 4')}
    <circle cx="-134" cy="-10" r="2.6" class="v50-dotfill"/>
    ${line('M30 -2 Q40 2 48 4', 'stroke-dasharray="3 5"')}
    ${line('M60 6 l6 -6 M58 16 l8 6 M64 2 l4 10', 'opacity=".7"')}
  </g>`;

const hedgehog = `
  <g filter="url(#v50-wc)">
    ${wash('M-140 70 L-140 -40 L-80 -40 L-66 -56 L120 -56 L140 -40 L140 70z', 'v50-ochre', 'opacity=".55"')}
    ${wash('M-80 64 Q-86 -20 0 -34 Q76 -40 96 30 Q100 50 90 64z', 'v50-dark', 'opacity=".75"')}
    ${wash('M84 22 Q112 22 124 44 Q110 60 86 58z', 'v50-paperfill')}
  </g>
  <g filter="url(#v50-ink)">
    ${line('M-140 70 L-140 -40 L-80 -40 L-66 -56 L120 -56 L140 -40 L140 70')}
    ${line('M-160 70 H160')}
    ${Array.from({ length: 26 }, (_, i) => { const a = Math.PI * (0.95 + i * 0.043); const cx = 6, cy = 40; const r1 = 80, r2 = 102; return `M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1 * 0.9).toFixed(1)} L${(cx + Math.cos(a) * r2).toFixed(1)} ${(cy + Math.sin(a) * r2 * 0.9).toFixed(1)}`; }).map(d => line(d)).join('')}
    ${line('M84 22 Q112 22 124 44 Q110 60 86 58')}
    <circle cx="124" cy="44" r="4" class="v50-dotfill"/><circle cx="104" cy="34" r="2.6" class="v50-dotfill"/>
    ${line('M-40 64 v8 M20 64 v8 M60 62 v10')}
  </g>`;

const habitat = `
  <g filter="url(#v50-wc)">
    <ellipse cx="0" cy="96" rx="190" ry="20" class="v50-w v50-moss" opacity=".6"/>
    ${wash('M-150 90 L-150 -20 L-90 -20 L-74 -40 L130 -40 L150 -20 L150 90z', 'v50-ochre', 'opacity=".6"')}
    ${wash('M-150 90 L-130 10 L170 10 L150 90z', 'v50-ochre')}
    ${wash('M-170 92 q20 -70 30 -120 q6 60 -10 120z M-178 92 q-4 -50 -30 -90 q30 30 38 90z', 'v50-green')}
    ${wash('M160 92 q10 -60 34 -96 q-6 50 -20 96z', 'v50-green', 'opacity=".8"')}
  </g>
  <g filter="url(#v50-ink)">
    ${line('M-150 90 L-150 -20 L-90 -20 L-74 -40 L130 -40 L150 -20 L150 10 M-150 90 L-130 10 L170 10 L150 90 Z')}
  </g>
  <text x="10" y="60" text-anchor="middle" class="v50-art-label">~/.claude/skills</text>`;

export const art: Record<string, string> = {
  duplicate: `${beetle(-60, -6, -12)}${beetle(64, 6, 14, true)}`,
  drifted: moth,
  bookmark: snail,
  stale: mushrooms,
  broken: lizard,
  stray: hedgehog,
  habitat: `${habitat}<g transform="translate(-40 -2) scale(.42)">${beetle(0, 0, -20)}</g><g transform="translate(40 -6) scale(.42)">${beetle(0, 0, 18, true)}</g><g transform="translate(118 -62) scale(.28)">${moth}</g>`,
};
