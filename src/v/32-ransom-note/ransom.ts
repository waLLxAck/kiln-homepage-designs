// PROTOTYPE 29: ransom-note lettering. Each letter gets its own font, case, paper scrap, cut edge and tilt, from a seeded random.
type Face = { family: string; weight?: number; style?: 'italic'; scale?: number; stretch?: number; upper?: boolean };

const faces: Face[] = [
  { family: 'P Abril Fatface', scale: 1.02 },
  { family: 'P Bowlby One', scale: .86, upper: true },
  { family: 'P Bungee', scale: .84, upper: true },
  { family: 'P Rubik Mono One', scale: .8, upper: true },
  { family: 'P Shrikhand', scale: .92 },
  { family: 'P Playfair Display', weight: 900, style: 'italic', scale: 1.05 },
  { family: 'P Bodoni Moda', weight: 800, scale: 1.05 },
  { family: 'P Special Elite', scale: 1.02 },
  { family: 'P Permanent Marker', scale: .95 },
  { family: 'P Climate Crisis', scale: .78, upper: true },
  { family: 'P Bebas Neue', scale: 1.22, upper: true },
  { family: 'P Grenze Gotisch', weight: 800, scale: 1.08 },
  { family: 'P UnifrakturMaguntia', scale: 1.08 },
  { family: 'P Courier Prime', weight: 700, scale: 1.08 },
  { family: 'P Old Standard TT', weight: 700, scale: 1.05 },
  { family: 'P Big Shoulders Display', weight: 900, scale: 1.12, upper: true },
  { family: 'P DM Serif Display', scale: 1.02 },
  { family: 'P Gloock', scale: 1 },
  { family: 'P Righteous', scale: .98 },
  { family: 'P Syne', weight: 800, scale: .95 },
  { family: 'P Archivo', weight: 900, stretch: 62, scale: 1.12, upper: true },
  { family: 'P Six Caps', scale: 1.5, upper: true },
  { family: 'P Fraunces', weight: 900, scale: 1 },
  { family: 'P Space Grotesk', weight: 700, scale: 1 },
  { family: 'P Chakra Petch', weight: 700, scale: 1 },
];

const papers = ['white', 'news', 'ink', 'dots', 'lined', 'grey', 'white', 'news', 'ink'];

function random(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

const cut = (rnd: () => number) => {
  const j = () => (rnd() * 9).toFixed(1);
  return `polygon(${j()}% ${j()}%, ${50 + (rnd() - .5) * 20}% ${(rnd() * 5).toFixed(1)}%, ${100 - Number(j())}% ${j()}%, ${100 - (rnd() * 5)}% ${50 + (rnd() - .5) * 20}%, ${100 - Number(j())}% ${100 - Number(j())}%, ${50 + (rnd() - .5) * 20}% ${100 - rnd() * 5}%, ${j()}% ${100 - Number(j())}%, ${(rnd() * 5).toFixed(1)}% ${50 + (rnd() - .5) * 20}%)`;
};

/** Returns ransom-note HTML for `text`. The visible letters are hidden from assistive tech; the plain text is exposed once. */
export function ransom(text: string, seed: number) {
  const rnd = random(seed * 7919 + text.length * 31);
  let index = 0;
  const words = text.split(' ').map(word => {
    const letters = [...word].map(char => {
      const face = faces[Math.floor(rnd() * faces.length)];
      const paper = papers[Math.floor(rnd() * papers.length)];
      const upper = face.upper || rnd() > .45;
      const glyph = /[a-z]/i.test(char) ? (upper ? char.toUpperCase() : char.toLowerCase()) : char;
      const style = [
        `font-family:'${face.family}'`,
        face.weight ? `font-weight:${face.weight}` : '',
        face.style ? `font-style:${face.style}` : '',
        face.stretch ? `font-stretch:${face.stretch}%` : '',
        `--k:${((face.scale ?? 1) * (.86 + rnd() * .3)).toFixed(2)}`,
        `--r:${((rnd() - .5) * 13).toFixed(1)}deg`,
        `--y:${((rnd() - .5) * .14).toFixed(2)}em`,
        `--jx:${((rnd() - .5) * 1.4).toFixed(2)}em`,
        `--jy:${((rnd() - .5) * 1.2).toFixed(2)}em`,
        `--d:${Math.round(index * 55 + rnd() * 260)}ms`,
        `clip-path:${cut(rnd)}`,
      ].filter(Boolean).join(';');
      index++;
      return `<span class="v29-l is-${paper}" style="${style}">${glyph}</span>`;
    }).join('');
    return `<span class="v29-word">${letters}</span>`;
  }).join(' ');
  return `<span class="visually-hidden">${text}</span><span class="v29-ransom" aria-hidden="true">${words}</span>`;
}
