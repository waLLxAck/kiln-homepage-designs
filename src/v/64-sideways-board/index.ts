// PROTOTYPE H08: one long horizontal whiteboard. A sticky stage turns vertical scroll into sideways travel (swipeable snap panes on phones).
// Thick chisel-tip marker for the mess and the big words; Kiln is a crisp black-and-white panel. Signature: an approved skill rides a drawn loop back to the panel.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, cross, ellipse, folder, line, reseed } from '../r3-kit/rough';

type Ink = 'k' | 'b' | 'r' | 'g';
/** A chisel-tip stroke: the same path twice, offset diagonally, so width changes with direction like a real marker. */
const chisel = (d: string, ink: Ink = 'k', i = 0, extra = '') =>
  `<g class="h8-m h8-${ink}" style="--i:${i}" ${extra}><path d="${d}" pathLength="1"/><path d="${d}" pathLength="1" transform="translate(2.6 -2.6)"/></g>`;
const word = (x: number, y: number, text: string, ink: Ink = 'k', size = 24, rotate = 0, i = 0, anchor = 'start') =>
  `<text x="${x}" y="${y}" class="h8-w h8-${ink}t" style="--i:${i}" font-size="${size}" text-anchor="${anchor}" ${rotate ? `transform="rotate(${rotate} ${x} ${y})"` : ''}>${text}</text>`;
const windows = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ---------- drawings ----------

function messArt() {
  reseed(11);
  let i = 0;
  const item = (x: number, y: number, text: string, ink: Ink = 'k') => word(x, y, text, ink, 21, 0, i++);
  return `<svg class="h8-art h8-mess-art" viewBox="0 0 760 470" role="img" aria-label="Three hand-drawn skill folders: ~/.claude/skills with code-review and code-review (1), ~/.agents/skills with another code-review and a broken link, and my-game/.github/skills with code-review-old and code-review-FINAL. Red marker asks which one.">
    ${chisel(folder(24, 64, 300, 176), 'k', i++)}${word(28, 48, '~/.claude/skills', 'b', 24, -2, i++)}
    ${item(52, 118, 'code-review')}${item(52, 156, 'code-review (1)')}${item(52, 194, 'research')}
    ${chisel(folder(410, 26, 320, 178), 'k', i++)}${word(414, 12, '~/.agents/skills', 'b', 24, 1, i++)}
    ${item(440, 82, 'code-review')}${item(440, 120, 'pr-summary')}${item(474, 158, 'old-link', 'r')}${chisel(cross(452, 150, 10), 'r', i++)}
    ${chisel(folder(70, 300, 340, 150), 'k', i++)}${word(74, 286, 'my-game/.github/skills', 'b', 24, -1, i++)}
    ${item(98, 356, 'code-review-old')}${item(98, 396, 'code-review-FINAL')}
    ${chisel(ellipse(134, 148, 104, 26, .06), 'r', i++)}
    ${word(476, 318, 'WHICH ONE?!', 'r', 46, -6, i++)}
    ${chisel(arrow(470, 290, 262, 170, 40, 22), 'r', i++)}
    ${chisel(arrow(560, 262, 530, 96, -30, 20), 'r', i++)}
    ${word(470, 380, 'edited by hand?', 'r', 26, -4, i++)}
  </svg>`;
}

function bigArrow() {
  reseed(5);
  return `<svg class="h8-art h8-arrow-art" viewBox="0 0 820 360" aria-hidden="true">${chisel(arrow(24, 320, 790, 110, -120, 86), 'b', 0, 'data-scrub')}</svg>`;
}

/** Half-erased marker left on the board by whoever used it last. Travels with the board. */
function ghost(seed: number, place: string) {
  reseed(seed);
  const faint = (d: string) => `<path d="${d}" class="h8-ghost"/>`;
  return `<svg class="h8-ghosts ${place}" viewBox="0 0 400 260" aria-hidden="true">${faint(ellipse(170, 110, 140, 60, .12))}${faint(line(40, 230, 380, 210, 8))}</svg>`;
}

// ---------- Kiln panel (monochrome) ----------

type Cell = 'on' | 'off' | 'edited';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; fresh?: boolean; tested?: boolean };
const columns: { key: Column; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Codex + others', short: 'Codex+', path: '~/.agents/skills' },
  { key: 'project', name: 'my-game', short: 'my-game', path: '.github/skills' },
];
const rows: Row[] = [
  { name: 'code-review', note: 'approved rev 3', cells: { claude: 'edited', agents: 'on', project: 'on' } },
  { name: 'research', note: 'approved rev 2', cells: { claude: 'on', agents: 'on', project: 'off' } },
  { name: 'writing-for-agents', note: 'approved rev 1', cells: { claude: 'on', agents: 'off', project: 'off' } },
  { name: 'playtest-brief', note: 'approved rev 4', cells: { claude: 'off', agents: 'off', project: 'on' } },
];
const found = [
  { name: 'code-review (1)', where: '~/.claude/skills', kind: 'duplicate' as const, text: 'Duplicate of code-review.' },
  { name: 'pr-summary', where: '~/.agents/skills', kind: 'stray' as const, text: 'Not in your library.' },
];

function panelWindow() {
  return `<div class="h8-ui h8-panel" data-panel>
    <div class="h8-ui-bar"><b>Kiln</b><span>Skills</span><em>sample library</em></div>
    <div class="h8-table-scroll"><table>
      <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h8-col-long">${column.name}</span><span class="h8-col-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
      <tbody data-rows></tbody>
    </table></div>
    <div class="h8-compare" data-compare hidden>
      <p><code>~/.claude/skills/code-review</code> differs from approved rev 3</p>
      <div class="h8-diff"><p>− Review standards and the specification separately.</p><p>+ Review the specification only.</p></div>
      <div class="h8-ui-actions"><button type="button" class="h8-ui-button" data-compare-replace>Replace with rev 3</button><button type="button" class="h8-ui-button h8-quiet" data-compare-keep>Keep edit as draft</button></div>
    </div>
    <div class="h8-found"><h3>Found outside your library</h3><ul data-found></ul></div>
    <div class="h8-ui-foot"><p data-context></p><p class="h8-status" data-status aria-live="polite">Flip a switch.</p></div>
  </div>`;
}

const idea = { source: 'Sample X post, saved 3 weeks ago', title: examples[1].title, prompt: examples[1].prompt, skill: 'instruction-trace',
  steps: ['Read AGENTS.md and CLAUDE.md', 'Ran git log -5 --oneline', 'Matched the last commit to the instruction it followed', 'Found an outdated line: "run every test before each commit"', 'Proposed a one-line change. Edited nothing'] };

function runWindow() {
  return `<div class="h8-ui h8-run" data-run aria-live="polite">
    <div class="h8-ui-bar"><b>Kiln</b><span>Test</span><em>read-only</em></div>
    <div class="h8-run-body" data-run-body>${runIdle()}</div>
  </div>`;
}
function runIdle() {
  return `<div class="h8-run-idle"><p class="h8-run-name">${idea.title}</p>
    <dl class="h8-run-meta"><div><dt>Repo</dt><dd><code>~/code/my-game</code></dd></div><div><dt>Agent</dt><dd>Claude Code</dd></div><div><dt>Cost</dt><dd>your subscription</dd></div></dl>
    <button type="button" class="h8-ui-button h8-ui-big" data-start>Run on my repo</button>
    <p class="h8-fine-ui">A replay of a sample run. Nothing runs from this page.</p></div>`;
}

// ---------- page ----------

const stops = [['mess', 'Mess'], ['arrow', 'One panel'], ['panel', 'Panel'], ['idea', 'Saved idea'], ['test', 'Test'], ['loop', 'Loop'], ['get', 'Get Kiln']] as const;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Skills everywhere. One panel.';
  root.innerHTML = `<div class="h8">
    <a class="skip" href="#h8-get" data-jump="6">Skip to download</a>
    <main class="h8-rail" data-rail>
      <div class="h8-stage" data-stage>
        <header class="h8-top">
          <a class="h8-brand" href="#h8-mess" data-jump="0">Kiln</a>
          <nav aria-label="Main navigation"><a href="#h8-panel" data-jump="2">Panel</a><a href="#h8-test" data-jump="4">Test</a><a href="#h8-get" data-jump="6" class="h8-top-get">Download</a></nav>
        </header>
        <div class="h8-board" data-board>
          <div class="h8-track" data-track>
            <section class="h8-pane h8-pane-mess" id="h8-mess" aria-labelledby="h8-title">
              <div class="h8-mess-copy">
                <h1 id="h8-title">Skills<br>everywhere.</h1>
                <p class="h8-terse">Every agent reads its own folder. Copies pile up. Some get edited by hand. Kiln puts all of them on one panel.</p>
                <p class="h8-hint" aria-hidden="true"><span class="h8-hint-wide">scroll</span><span class="h8-hint-narrow">swipe</span> →</p>
              </div>
              <div class="h8-drawable">${messArt()}</div>${ghost(3, 'h8-ghost-a')}
            </section>
            <section class="h8-pane h8-pane-arrow" aria-label="Kiln">
              <p class="h8-big h8-bt">One panel.</p>
              ${bigArrow()}${ghost(8, 'h8-ghost-b')}
            </section>
            <section class="h8-pane h8-pane-panel" id="h8-panel" aria-labelledby="h8-panel-title">
              <div class="h8-panel-copy">
                <h2 id="h8-panel-title">One switch per copy.</h2>
                <p class="h8-terse">Kiln finds every skill folder on this machine and in your projects. Flip a switch to install the approved version there, or remove that copy. Your library keeps it.</p>
                <ul class="h8-legend">
                  <li><i class="h8-sw h8-sw-on" aria-hidden="true"></i><span>Installed</span></li>
                  <li><i class="h8-sw h8-sw-edited" aria-hidden="true"></i><span>Edited by hand</span></li>
                  <li><i class="h8-sw" aria-hidden="true"></i><span>Off. Not loaded.</span></li>
                </ul>
                <p class="h8-scrawl h8-gt">Off = out of every session's context.</p>
                <p class="h8-scrawl h8-landed-note" data-landed-note hidden>New: tested, approved, on. <button type="button" class="h8-textlink" data-onward>Keep going</button></p>
              </div>
              ${panelWindow()}
            </section>
            <section class="h8-pane h8-pane-idea" id="h8-idea" aria-labelledby="h8-idea-title">
              <h2 id="h8-idea-title">Saved.<br>Never tried.</h2>
              <div class="h8-pinned">
                <span class="h8-magnet" aria-hidden="true"></span>
                <article class="h8-sheet">
                  <p class="h8-sheet-src">${idea.source}</p>
                  <h3>${idea.title}</h3>
                  <p>${idea.prompt}</p>
                </article>
                <span class="h8-scrawl h8-rt h8-scrawl-tag" aria-hidden="true">"later"</span>
              </div>
              <button type="button" class="h8-ui-button h8-ui-big h8-try" data-try>Test it on my repo</button>${ghost(14, 'h8-ghost-c')}
            </section>
            <section class="h8-pane h8-pane-test" id="h8-test" aria-labelledby="h8-test-title">
              <div class="h8-test-copy">
                <h2 id="h8-test-title">Test it.<br>Now.</h2>
                <ul class="h8-shouts"><li class="h8-kt">Your repo.</li><li class="h8-bt">Read-only.</li><li class="h8-gt">No API key.</li></ul>
                <p class="h8-terse">Runs through the Codex or Claude Code you're signed into. Your plan's limits apply. Watch every step, then get a verdict.</p>
              </div>
              ${runWindow()}
            </section>
            <section class="h8-pane h8-pane-loop" id="h8-loop" aria-labelledby="h8-loop-title">
              <h2 id="h8-loop-title">Back on<br>the panel.</h2>
              <p class="h8-terse" data-loop-copy>Approve a pass and it rides this line back to the panel, installed where you switch it on.</p>
              <ul class="h8-facts">
                <li><b>Pinned.</b> Approval locks the exact revision. Edits become drafts.</li>
                <li><b>Yours.</b> Published to your own Kiln GitHub repo.</li>
                <li><b>Portable.</b> Another machine: <code>kiln skills sync</code>.</li>
              </ul>
            </section>
            <section class="h8-pane h8-pane-get" id="h8-get" aria-labelledby="h8-get-title">
              <h2 id="h8-get-title" class="h8-get-title">Get Kiln.</h2>
              <a class="h8-download" href="${installer}">${windows}<span>Download for Windows</span></a>
              <p class="h8-terse">Kiln 0.17.0. The release is hosted in a private GitHub repository: sign in with an account that has access.</p>
              ${ghost(21, 'h8-ghost-d')}<ul class="h8-small-facts">
                <li><kbd>Ctrl+Shift+Space</kbd> captures from anywhere.</li>
                <li>A YouTube link becomes prompts with timestamped sources.</li>
                <li>CLAUDE.md, AGENTS.md, hooks and MCP config, with 30 backups.</li>
                <li>Codex, Claude Code, Copilot. CLI included. MIT. Unsigned build.</li>
              </ul>
            </section>
            <svg class="h8-loop" data-loop aria-hidden="true"><g class="h8-m h8-g h8-loop-line" data-loop-line><path pathLength="1"/><path pathLength="1" transform="translate(2.6 -2.6)"/></g></svg>
          </div>
        </div>
        <nav class="h8-progress" aria-label="Board position">
          <div class="h8-progress-rail"><svg class="h8-progress-ink" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2,7 L998,5" pathLength="1" data-progress/></svg></div>
          <ol>${stops.map(([key, text], index) => `<li><button type="button" data-jump="${index}" data-stop="${key}">${text}</button></li>`).join('')}</ol>
        </nav>
      </div>
    </main>
  </div>`;
  const board = bindBoard(root);
  const panel = bindPanel(root);
  bindTest(root, board, panel);
}

// ---------- travel ----------

type Board = { jump(index: number, ms?: number): Promise<void>; toX(x: number): void; x(): number; max(): number; width(): number; track: HTMLElement; panes: HTMLElement[] };

function bindBoard(root: HTMLElement): Board {
  const rail = root.querySelector<HTMLElement>('[data-rail]')!;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const panes = [...root.querySelectorAll<HTMLElement>('.h8-pane')];
  const boardEl = root.querySelector<HTMLElement>('[data-board]')!;
  const progress = root.querySelector<SVGPathElement>('[data-progress]')!;
  const stopButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-stop]')];
  const scrub = root.querySelector<SVGGElement>('[data-scrub]')!;
  const narrow = matchMedia('(max-width: 760px), (max-height: 540px)');
  let mode: 'rail' | 'snap' = narrow.matches ? 'snap' : 'rail';
  let max = 0;

  const visible = () => mode === 'rail' ? boardEl.clientWidth : track.clientWidth;
  const x = () => mode === 'rail' ? Math.min(max, Math.max(0, scrollY - rail.offsetTop)) : track.scrollLeft;
  const layout = () => {
    mode = narrow.matches ? 'snap' : 'rail';
    root.querySelector('.h8')!.classList.toggle('is-snap', mode === 'snap');
    if (mode === 'rail') { max = Math.max(0, track.scrollWidth - boardEl.clientWidth); rail.style.height = `${max + innerHeight}px`; }
    else { track.style.transform = ''; rail.style.height = ''; max = Math.max(0, track.scrollWidth - track.clientWidth); }
    stopButtons.forEach((button, index) => { (button.parentElement as HTMLElement).style.left = `${max ? target(index) / max * 100 : 0}%`; });
    update();
  };
  const update = () => {
    const now = x(), width = visible();
    if (mode === 'rail') track.style.transform = `translate3d(${-now}px,0,0)`;
    const p = max ? now / max : 0;
    progress.style.strokeDashoffset = String(1 - p);
    let current = 0;
    panes.forEach((pane, index) => {
      const left = pane.offsetLeft - now, seen = (width - left) / (width * .55);
      if (seen > .45) pane.classList.add('is-on');
      if (left < width * .5) current = index;
      if (pane.classList.contains('h8-pane-arrow')) scrub.style.setProperty('--draw', String(reduced ? 0 : 1 - Math.min(1, Math.max(0, seen))));
    });
    stopButtons.forEach((button, index) => button.toggleAttribute('aria-current', index === current));
  };
  const target = (index: number) => {
    const pane = panes[index], width = visible();
    return Math.min(max, Math.max(0, pane.offsetLeft - Math.max(0, (width - pane.offsetWidth) / 2)));
  };
  const toX = (value: number) => {
    if (mode === 'rail') scrollTo(0, rail.offsetTop + value); else track.scrollLeft = value;
    update();
  };
  const jump = (index: number, ms = 900) => new Promise<void>(resolve => {
    const from = x(), to = target(index);
    if (reduced || ms === 0 || Math.abs(to - from) < 2) { toX(to); resolve(); return; }
    track.classList.add('is-gliding');
    const start = performance.now();
    const step = (time: number) => {
      const t = Math.min(1, (time - start) / ms);
      toX(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(step); else { track.classList.remove('is-gliding'); resolve(); }
    };
    requestAnimationFrame(step);
  });

  addEventListener('scroll', () => { if (mode === 'rail') update(); }, { passive: true });
  track.addEventListener('scroll', () => { if (mode === 'snap') update(); }, { passive: true });
  addEventListener('resize', layout);
  narrow.addEventListener('change', layout);
  root.querySelectorAll<HTMLElement>('[data-jump]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const index = Number(link.dataset.jump);
    jump(index).then(() => panes[index].querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true }));
  }));
  panes.forEach(pane => pane.querySelector('h1, h2')?.setAttribute('tabindex', '-1'));
  // Keyboard users: bring the focused pane into view instead of letting the browser scroll the clipped board.
  track.addEventListener('focusin', event => {
    const pane = (event.target as Element).closest<HTMLElement>('.h8-pane');
    if (!pane || track.classList.contains('is-gliding')) return;
    const now = x(), width = visible(), left = pane.offsetLeft - now;
    if (left < 0 || left + Math.min(pane.offsetWidth, width) > width) toX(target(panes.indexOf(pane)));
  });
  layout();
  requestAnimationFrame(layout);
  document.fonts?.ready.then(layout);
  return { jump, toX, x, max: () => max, width: visible, track, panes };
}

// ---------- panel ----------

type Panel = { add(name: string): HTMLElement };

function bindPanel(root: HTMLElement): Panel {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foundList = root.querySelector<HTMLElement>('[data-found]')!;
  const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln' };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const draw = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}" data-row-name="${row.name}"><th scope="row"><b>${row.name}</b><small>${row.note}</small>${row.tested ? '<span class="h8-tested">tested, pass</span>' : ''}</th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="h8-switch h8-switch-${state}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${stateText[state]}" aria-pressed="${state !== 'off'}"><i></i></button></td>`;
    }).join('')}</tr>`).join('');
    foundList.innerHTML = found.map((item, f) => `<li><div><b>${item.name}</b><small><code>${item.where}</code> ${item.text}</small></div><button type="button" class="h8-ui-button h8-quiet" data-found="${f}">${item.kind === 'duplicate' ? 'Remove duplicate' : 'Import as draft'}</button></li>`).join('') || '<li class="h8-empty">Nothing left outside your library.</li>';
    const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
    context.textContent = `Loaded into every new session: ${count('claude')} in Claude Code, ${count('agents')} in Codex.`;
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h8-switch');
    if (!button) return;
    const row = rows[Number(button.dataset.row)], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('Changed outside Kiln. Compare first.'); compare.querySelector('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed from ${column.path}. Still in your library.` : `Installed ${row.note.replace('approved ', '').split(',')[0]} into ${column.path}. Receipt saved.`);
    draw();
    body.querySelector<HTMLButtonElement>(`[data-row="${button.dataset.row}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-compare-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; draw();
    say('Hand edit moved to a private backup. Rev 3 installed.');
  });
  compare.querySelector('[data-compare-keep]')!.addEventListener('click', () => {
    rows[0].note = 'approved rev 3, draft rev 4'; compare.hidden = true; draw();
    say('Saved as draft rev 4. Rev 3 stays approved.');
  });
  foundList.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-found]');
    if (!button) return;
    const [item] = found.splice(Number(button.dataset.found), 1);
    rows.forEach(row => { row.fresh = false; });
    if (item.kind === 'duplicate') say(`${item.name} moved to a private backup.`);
    else { rows.push({ name: item.name, note: 'draft, imported', cells: { claude: 'off', agents: 'off', project: 'off' }, fresh: true }); say(`Imported ${item.name} as a draft. Original left in place.`); }
    draw();
  });
  draw();
  return {
    add(name: string) {
      rows.forEach(row => { row.fresh = false; });
      if (!rows.some(row => row.name === name)) rows.push({ name, note: 'approved rev 1, just now', tested: true, cells: { claude: 'on', agents: 'on', project: 'off' }, fresh: true });
      draw();
      say(`Approved ${name}. Installed for Claude Code and Codex.`);
      return body.querySelector<HTMLElement>(`[data-row-name="${name}"]`)!;
    },
  };
}

// ---------- test and loop ----------

function bindTest(root: HTMLElement, board: Board, panel: Panel) {
  const reveal = (element: Element, block: ScrollLogicalPosition = 'nearest') => { if (root.querySelector('.h8.is-snap')) element.scrollIntoView({ block, inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); };
  const run = root.querySelector<HTMLElement>('[data-run-body]')!;
  const loop = root.querySelector<SVGSVGElement>('[data-loop]')!;
  const loopLine = root.querySelector<SVGGElement>('[data-loop-line]')!;
  const loopCopy = root.querySelector<HTMLElement>('[data-loop-copy]')!;
  let busy = false, landed = false;

  root.querySelector('[data-try]')!.addEventListener('click', async () => { await board.jump(4); start(); });
  const bindStart = () => run.querySelector('[data-start]')?.addEventListener('click', start);
  bindStart();

  async function start() {
    if (busy) return;
    busy = true;
    run.innerHTML = `<p class="h8-run-name">${idea.title}<span>rev 1</span></p>
      <dl class="h8-run-meta"><div><dt>Repo</dt><dd><code>~/code/my-game</code></dd></div><div><dt>Agent</dt><dd>Claude Code</dd></div><div><dt>Effort</dt><dd>medium</dd></div><div><dt>Elapsed</dt><dd data-elapsed>0:00</dd></div></dl>
      <ol class="h8-steps" data-steps></ol>
      <p class="h8-tokens" data-tokens>0 in / 0 cached / 0 out</p>
      <div class="h8-verdict-slot" data-verdict></div>`;
    const steps = run.querySelector('[data-steps]')!, tokens = run.querySelector('[data-tokens]')!, elapsed = run.querySelector('[data-elapsed]')!;
    for (const [n, text] of idea.steps.entries()) {
      await wait(560);
      steps.insertAdjacentHTML('beforeend', `<li>${text}</li>`);
      reveal(steps.lastElementChild!);
      const s = 19 * (n + 1) + 6 * n;
      elapsed.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      tokens.textContent = `${(6.8 * (n + 1)).toFixed(1)}k in / ${(3.9 * n).toFixed(1)}k cached / ${(0.4 * (n + 1)).toFixed(1)}k out (sample)`;
    }
    await wait(380);
    const verdict = run.querySelector<HTMLElement>('[data-verdict]')!;
    verdict.innerHTML = `<div class="h8-verdict"><b>PASS</b><p>The agent's call. Keeping it is yours.</p></div>
      <div class="h8-ui-actions"><button type="button" class="h8-ui-button" data-approve>Approve as skill</button><button type="button" class="h8-ui-button h8-quiet" data-skip>Not for me</button></div>
      <p class="h8-fine-ui">Not quite? Edit a line and run it again. Every revision is kept.</p>`;
    busy = false;
    reveal(verdict);
    const approve = verdict.querySelector<HTMLButtonElement>('[data-approve]')!;
    await wait(reduced ? 0 : 350);
    approve.focus({ preventScroll: true });
    approve.addEventListener('click', () => ride(approve));
    verdict.querySelector('[data-skip]')!.addEventListener('click', () => { run.innerHTML = runIdle(); bindStart(); });
  }

  function trackPoint(element: Element, fx: number, fy: number) {
    const box = element.getBoundingClientRect(), origin = board.track.getBoundingClientRect();
    return [box.left - origin.left + board.track.scrollLeft + box.width * fx, box.top - origin.top + box.height * fy] as [number, number];
  }
  function catmull(points: [number, number][]) {
    let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] ?? p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function loopPath(from: Element, row: HTMLElement) {
    const trackHeight = board.track.offsetHeight, loopPane = root.querySelector('.h8-pane-loop')!;
    loop.setAttribute('viewBox', `0 0 ${board.track.scrollWidth} ${trackHeight}`);
    loop.style.width = `${board.track.scrollWidth}px`;
    const a = [trackPoint(from.closest('.h8-run')!, 1, 0)[0], trackPoint(from, 1, .5)[1]] as [number, number], pane = trackPoint(loopPane, .5, .5), end = trackPoint(row, 1, .5);
    const top = Math.max(24, trackHeight * .07), low = Math.min(trackHeight - 40, a[1] + trackHeight * .18);
    const points: [number, number][] = [[a[0] + 14, a[1]], [a[0] + 120, low], [pane[0] + 40, low + 10], [pane[0] + 170, pane[1]], [pane[0] + 60, top + 60], [pane[0] - 140, top],
      [(pane[0] + end[0]) / 2, top + 10], [end[0] + 120, end[1] - 60], [end[0] + 16, end[1]]];
    const d = catmull(points);
    const tail = [end[0] + 16, end[1]], head = 20;
    const wing = (angle: number) => `M${(tail[0] + Math.cos(angle) * head).toFixed(1)},${(tail[1] + Math.sin(angle) * head).toFixed(1)} L${tail[0].toFixed(1)},${tail[1].toFixed(1)}`;
    return { d, wings: `${wing(-.55)} ${wing(.75)}` };
  }

  async function ride(from: HTMLButtonElement) {
    if (landed) return;
    landed = true;
    from.disabled = true;
    const row = panel.add(idea.skill);
    row.classList.remove('is-fresh');
    const { d, wings } = loopPath(from, row);
    const [first, second] = [...loopLine.querySelectorAll('path')];
    first.setAttribute('d', d); second.setAttribute('d', d);
    loopLine.insertAdjacentHTML('beforeend', `<path d="${wings}" pathLength="1" class="h8-loop-wings"/>`);
    const length = first.getTotalLength(), duration = reduced ? 0 : 2600, start = performance.now();
    board.track.classList.add('is-gliding');
    await new Promise<void>(resolve => {
      const frame = (time: number) => {
        const t = duration ? Math.min(1, (time - start) / duration) : 1, e = ease(t);
        loopLine.style.setProperty('--draw', String(1 - e));
        const point = first.getPointAtLength(length * e);
        board.toX(Math.min(board.max(), Math.max(0, point.x - board.width() * .55)));
        if (t < 1) requestAnimationFrame(frame); else resolve();
      };
      requestAnimationFrame(frame);
    });
    board.track.classList.remove('is-gliding');
    loopLine.classList.add('is-landed');
    row.classList.add('is-fresh');
    reveal(row, 'center');
    row.querySelector<HTMLButtonElement>('.h8-switch')?.focus({ preventScroll: true });
    loopCopy.textContent = `${idea.skill} rode the line back. It's on the panel, switched on for Claude Code and Codex.`;
    run.querySelector('[data-verdict] .h8-ui-actions')!.innerHTML = `<p class="h8-landed">Approved. It's on the panel.</p>`;
    const note = root.querySelector<HTMLElement>('[data-landed-note]')!;
    note.hidden = false;
    note.querySelector('[data-onward]')!.addEventListener('click', () => board.jump(6, 1600));
  }
}
