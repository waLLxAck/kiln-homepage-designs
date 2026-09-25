// PROTOTYPE H02, problem 1: the pencil folders sit on top of the dark panel. "Rub out the mess" runs an eraser across them;
// as it passes each skill, the skill pops out of its folder and flies (FLIP) into its switch on the panel. Copies of one skill
// merge into one row, the broken link and the empty folder drop into the safe-cleanup strip. Re-triggerable; no scroll-jacking.
import { mess, type Chip } from './art';
import type { Panel } from './panel';

const PAD = 26;
const docIcon = '<svg viewBox="0 0 14 18" aria-hidden="true"><path d="M1.5 1.5h7l4 4v11h-11z M8.5 1.5v4h4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

export function bindStage(root: HTMLElement, panel: Panel, still: boolean, reduced: boolean) {
  const board = root.querySelector<HTMLElement>('[data-board]')!;
  const layer = root.querySelector<HTMLElement>('[data-mess]')!;
  const overlay = root.querySelector<SVGSVGElement>('[data-overlay]')!;
  const chipLayer = root.querySelector<HTMLElement>('[data-chips]')!;
  const eraser = root.querySelector<HTMLElement>('[data-eraser]')!;
  const crumbs = root.querySelector<HTMLElement>('[data-crumbs]')!;
  const button = root.querySelector<HTMLButtonElement>('[data-erase]')!;
  const live = root.querySelector<HTMLElement>('[data-stage-live]')!;
  const panelEl = root.querySelector<HTMLElement>('#h02-panel')!;
  type State = 'mess' | 'erasing' | 'clean' | 'restoring';
  let state: State = 'mess', touched = false, path: SVGPathElement | null = null, length = 1;
  let chips: (Chip & { el: HTMLElement; at: number })[] = [];

  const setState = (next: State) => {
    state = next;
    board.dataset.state = next;
    board.classList.toggle('is-clean', next === 'clean');
    panelEl.inert = next !== 'clean';
    button.textContent = next === 'clean' || next === 'erasing' ? 'Draw the mess again' : 'Rub out the mess';
    button.disabled = next === 'erasing' || next === 'restoring';
  };

  const build = () => {
    const w = layer.offsetWidth, h = layer.offsetHeight;
    if (!w || !h) return;
    const drawn = mess(w, h);
    const brush = w < 520 ? 96 : 140, rowGap = brush * .62, passes = Math.ceil((h + 10) / rowGap);
    let d = `M-30,${(brush * .3).toFixed(1)}`;
    for (let r = 0; r < passes; r++) {
      const y = brush * .3 + r * rowGap, right = r % 2 === 0, segments = Math.max(4, Math.round(w / 120));
      // Rub back and forth a little inside every pass, the way an eraser actually moves.
      for (let s = 1; s <= segments; s++) {
        const x = right ? -30 + (w + 60) * s / segments : w + 30 - (w + 60) * s / segments;
        d += ` L${x.toFixed(1)},${(y + (s % 2 ? rowGap * .22 : -rowGap * .1)).toFixed(1)}`;
      }
      if (r < passes - 1) d += ` L${right ? w + 30 : -30},${(y + rowGap).toFixed(1)}`;
    }
    overlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
    overlay.setAttribute('width', String(w)); overlay.setAttribute('height', String(h));
    overlay.innerHTML = `<defs>
        <pattern id="h02-grid" patternUnits="userSpaceOnUse" width="80" height="80">
          <path d="M0 .5H80M0 16.5H80M0 32.5H80M0 48.5H80M0 64.5H80M.5 0V80M16.5 0V80M32.5 0V80M48.5 0V80M64.5 0V80" stroke="#b8c8d6" stroke-opacity=".42" stroke-width="1" fill="none"/>
          <path d="M0 .5H80M.5 0V80" stroke="#9db2c5" stroke-opacity=".62" stroke-width="1" fill="none"/>
        </pattern>
        <filter id="h02-soft" filterUnits="userSpaceOnUse" x="-60" y="-60" width="${w + 120}" height="${h + 120}"><feGaussianBlur stdDeviation="${w < 520 ? 5 : 7}"/></filter>
        <mask id="h02-erase" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
          <rect width="${w}" height="${h}" fill="#fff"/>
          <path data-rub d="${d}" fill="none" stroke="#000" stroke-width="${brush}" stroke-linecap="round" stroke-linejoin="round" filter="url(#h02-soft)"/>
        </mask>
      </defs>
      <g ${still ? '' : 'mask="url(#h02-erase)"'}>
        ${still ? '' : `<rect width="${w}" height="${h}" fill="#f2f5f7"/><rect width="${w}" height="${h}" fill="url(#h02-grid)"/>`}
        <g class="h02-art" transform="${drawn.transform}">${drawn.art}</g>
      </g>`;
    path = overlay.querySelector<SVGPathElement>('[data-rub]');
    length = path!.getTotalLength();
    path!.style.strokeDasharray = `${length} ${length + 10}`;
    path!.style.strokeDashoffset = String(state === 'clean' ? 0 : length);
    // Where along the rub does the eraser pass over each skill? That's when it pops.
    const samples: [number, number, number][] = [];
    for (let at = 0; at <= length; at += 18) { const p = path!.getPointAtLength(at); samples.push([at, p.x, p.y]); }
    chipLayer.innerHTML = '';
    chips = drawn.chips.map(chip => {
      const el = document.createElement('span');
      el.className = `h02-chip h02-chip-${chip.skill.kind}`;
      el.innerHTML = `${docIcon}<span>${chip.skill.name}</span>`;
      el.style.cssText = `left:${(chip.x - chip.size * .95).toFixed(1)}px;top:${(chip.y - chip.size * .62).toFixed(1)}px;font-size:${chip.size.toFixed(1)}px;--r:${chip.rot}deg`;
      chipLayer.appendChild(el);
      const cx = chip.x + chip.skill.name.length * chip.size * .2, cy = chip.y;
      let best = 0, dist = Infinity;
      for (const [at, x, y] of samples) { const dd = Math.hypot(x - cx, (y - cy) * 1.6); if (dd < dist) { dist = dd; best = at; } }
      return { ...chip, el, at: best };
    });
    if (state === 'clean' && !still) chips.forEach(chip => chip.el.classList.add('is-gone'));
    align();
  };

  const align = () => {
    // Keep the overlay's graph paper in register with the page's.
    const pattern = overlay.querySelector('#h02-grid');
    if (!pattern) return;
    const rect = overlay.getBoundingClientRect(), x = rect.left + scrollX, y = rect.top + scrollY;
    pattern.setAttribute('x', String(-(((x % 80) + 80) % 80)));
    pattern.setAttribute('y', String(-(((y % 80) + 80) % 80)));
  };

  const target = (chip: Chip) => {
    const cell = board.querySelector<HTMLElement>(`[data-cell="${chip.skill.to}"]`)!;
    return { cell, aim: (cell.querySelector<HTMLElement>('.h02-switch') ?? cell).getBoundingClientRect() };
  };
  const flight = (chip: Chip & { el: HTMLElement }) => {
    const { aim } = target(chip), box = chip.el.getBoundingClientRect();
    const dx = aim.left + aim.width / 2 - (box.left + box.width / 2), dy = aim.top + aim.height / 2 - (box.top + box.height / 2);
    const r = chip.rot;
    if (chip.skill.to === 'cleanup') return [
      { transform: `rotate(${r}deg) scale(1)`, opacity: 1 },
      { transform: `translate(0px, -6px) rotate(${r + 30}deg) scale(.7)`, opacity: 1, offset: .25 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${r + 260}deg) scale(.3)`, opacity: .9, offset: .85 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${r + 300}deg) scale(.1)`, opacity: 0 },
    ];
    return [
      { transform: `rotate(${r}deg) scale(1)`, opacity: 1 },
      { transform: `translate(0px, -12px) rotate(${r * .4 - 4}deg) scale(1.12)`, opacity: 1, offset: .18 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(.62)`, opacity: 1, offset: .8 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(.3)`, opacity: 0 },
    ];
  };
  const land = (chip: Chip) => {
    const { cell } = target(chip);
    const merged = cell.classList.contains('is-in');
    cell.classList.remove('is-landed', 'is-merged'); void cell.offsetWidth;
    cell.classList.add('is-in', merged ? 'is-merged' : 'is-landed');
  };
  const pop = (chip: Chip & { el: HTMLElement }) => {
    const animation = chip.el.animate(flight(chip), { duration: 760, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'both' });
    animation.finished.then(() => { chip.el.classList.add('is-gone'); animation.cancel(); land(chip); }).catch(() => {});
    return animation.finished.catch(() => {});
  };

  const spawn = (x: number, y: number, dir: number) => {
    if (crumbs.childElementCount > 70) return;
    const bit = document.createElement('i');
    bit.style.cssText = `left:${x - PAD}px;top:${y - PAD}px;--dx:${(-dir * (10 + Math.random() * 40)).toFixed(0)}px;--dy:${(8 + Math.random() * 46).toFixed(0)}px;--rot:${(Math.random() * 360).toFixed(0)}deg;--w:${(4 + Math.random() * 8).toFixed(1)}px;background:${Math.random() < .45 ? '#8d9199' : '#e9ded6'}`;
    crumbs.appendChild(bit);
    setTimeout(() => bit.remove(), 1500);
  };

  const finish = () => {
    if (!still) chips.forEach(chip => chip.el.classList.add('is-gone'));
    board.querySelectorAll('[data-cell]').forEach(cell => cell.classList.add('is-in'));
    if (path) path.style.strokeDashoffset = '0';
    eraser.style.transform = '';
    setState('clean');
    panel.say('Found 9 skill folders and a broken link in 5 places. That is 5 skills.');
    live.textContent = 'Erased. The folders are now one Kiln panel: 5 skills, one switch per location.';
  };

  async function erase() {
    if (state !== 'mess') return;
    touched = true;
    if (reduced || still) { finish(); return; }
    build();
    setState('erasing');
    const duration = Math.min(4200, Math.max(2600, length / 1.7));
    const flights: Promise<unknown>[] = [];
    const queue = [...chips].sort((a, b) => a.at - b.at);
    let start = 0, last = { x: 0, y: 0 };
    board.classList.add('is-rubbing');
    await new Promise<void>(resolve => {
      const tick = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / duration), p = t < .5 ? 2 * t * t * .5 + t * .5 : t; // soft start, then steady
        const at = length * Math.min(p, .999), pt = path!.getPointAtLength(at);
        path!.style.strokeDashoffset = String(length * (1 - p));
        const dir = pt.x >= last.x ? 1 : -1, moved = Math.hypot(pt.x - last.x, pt.y - last.y);
        eraser.style.transform = `translate(${(pt.x - PAD).toFixed(1)}px, ${(pt.y - PAD).toFixed(1)}px) rotate(${(-22 + dir * 7 + Math.sin(p * 90) * 3).toFixed(1)}deg)`;
        if (last.x && moved > 3) for (let n = 0; n < Math.min(4, moved / 16); n++) spawn(pt.x + (Math.random() - .5) * 40, pt.y + (Math.random() - .3) * 30, dir);
        last = { x: pt.x, y: pt.y };
        while (queue.length && queue[0].at <= at + 60) flights.push(pop(queue.shift()!));
        if (t < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
    queue.splice(0).forEach(chip => flights.push(pop(chip)));
    board.classList.remove('is-rubbing');
    await Promise.all(flights);
    finish();
  }

  async function restore() {
    if (state !== 'clean') return;
    touched = true;
    const cells = [...board.querySelectorAll<HTMLElement>('[data-cell]')];
    if (reduced || still) { cells.forEach(cell => cell.classList.remove('is-in', 'is-landed', 'is-merged')); chips.forEach(chip => chip.el.classList.remove('is-gone')); if (path) path.style.strokeDashoffset = String(length); setState('mess'); live.textContent = 'The pencil folders are back.'; return; }
    setState('restoring');
    board.classList.add('is-redrawing');
    if (path) path.style.strokeDashoffset = String(length);
    const runs = [...chips].reverse().map((chip, n) => {
      const keyframes = flight(chip);
      chip.el.classList.remove('is-gone');
      const animation = chip.el.animate(keyframes, { duration: 560, delay: n * 45, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both', direction: 'reverse' });
      setTimeout(() => target(chip).cell.classList.remove('is-in', 'is-landed', 'is-merged'), n * 45 + 60);
      return animation.finished.then(() => animation.cancel()).catch(() => {});
    });
    await Promise.all(runs);
    cells.forEach(cell => cell.classList.remove('is-in', 'is-landed', 'is-merged'));
    board.classList.remove('is-redrawing');
    setState('mess');
    live.textContent = 'The pencil folders are back.';
  }

  button.addEventListener('click', () => (state === 'clean' ? restore() : erase()));
  setState('mess');
  if (still) board.classList.add('is-still');
  const ready = () => { build(); if (still || reduced) finish(); };
  document.fonts?.ready.then(ready);
  ready();
  let timer = 0;
  addEventListener('resize', () => { clearTimeout(timer); timer = window.setTimeout(() => { if (state === 'mess' || state === 'clean') build(); }, 140); });
  if (!still && !reduced && 'IntersectionObserver' in window) {
    // Real visitors: it rubs itself out once the whole board is on screen, unless they've already pressed the button.
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.intersectionRatio > .92)) return;
      observer.disconnect();
      setTimeout(() => { if (!touched) erase(); }, 650);
    }, { threshold: [.92, 1] });
    observer.observe(board);
  }
  return { erase, cleanNow: () => { if (state === 'mess') { touched = true; finish(); } } };
}
