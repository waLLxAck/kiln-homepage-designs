// PROTOTYPE H07: a ballpoint bullet-journal page. The try-later list is handwritten; Kiln appears only as crisp stickers stuck onto it.
// Signature: tick a line, the tick is drawn in ink, the test sticker runs it, and the line is struck through with "tried <day>, pass".
import './style.css';
import { examples, installer } from '../../content';
import { arrow, ellipse, line, poly, reseed } from '../r3-kit/rough';

type Ink = 'k' | 'b';
const ink = (d: string, color: Ink = 'k', extra = '', cls = '') => `<path d="${d}" class="h7-ink h7-ink-${color}${cls ? ` ${cls}` : ''}" ${extra}/>`;
const windows = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const today = new Date().toLocaleDateString('en-GB', { weekday: 'short' });
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));

// ---------- the list ----------

type Step = { tag: 'read' | 'search' | 'think' | 'run' | 'found'; text: string };
type Item = {
  title: string; source: string; moved: number; prompt?: string; skill?: string; steps?: Step[]; verdict?: 'pass' | 'uncertain';
  fix?: { before: string; after: string; last: string; lesson: string }; bridge?: boolean;
};
const items: Item[] = [
  { title: examples[0].title, source: 'from a YouTube talk, 41 min in', moved: 6, prompt: examples[0].prompt, skill: 'kid-usability-check', verdict: 'uncertain',
    steps: [{ tag: 'read', text: 'src/screens/Start.tsx' }, { tag: 'think', text: 'Skipping the parent signup and starting as a child' }, { tag: 'search', text: 'src/ for "level", "next", "play"' }, { tag: 'read', text: 'src/screens/Levels.tsx' }, { tag: 'found', text: 'Two obstacles, and no way to tell which comes first' }],
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', last: 'The first screen says "Continue" with nothing to continue', lesson: 'Asking for the on-screen text made it pick one obstacle.' } },
  { title: examples[1].title, source: 'from an X post, "this prompt is insane"', moved: 3, prompt: examples[1].prompt, skill: 'instruction-trace', verdict: 'pass',
    steps: [{ tag: 'read', text: 'AGENTS.md and CLAUDE.md' }, { tag: 'run', text: 'git log -5 --oneline' }, { tag: 'think', text: 'Matching the last commit to the instruction it followed' }, { tag: 'found', text: 'An outdated line: "run every test before each commit"' }, { tag: 'found', text: 'Proposed a one-line change to AGENTS.md' }] },
  { title: examples[2].title, source: 'from screenshot_0412.png', moved: 8, prompt: examples[2].prompt, skill: 'playtest-ten', verdict: 'pass',
    steps: [{ tag: 'read', text: 'src/game/loop.ts' }, { tag: 'read', text: 'levels/*.json (12 files)' }, { tag: 'think', text: 'Walking through the first five minutes of play' }, { tag: 'found', text: 'Ranked ten improvements, each with a reason' }] },
  { title: 'Sort out my skills folders', source: 'since spring. they multiply.', moved: 11, bridge: true },
];

function box() {
  const tick = `${line(9, 21, 17, 31, 1)} ${line(17, 31, 36, 4, 1.2)}`;
  return `<svg viewBox="0 0 40 40" aria-hidden="true">${ink(poly([[5, 7], [33, 6], [34, 34], [6, 33]], true, 1.1))}${ink(tick, 'b', 'pathLength="1"', 'h7-tick')}</svg>`;
}
const tallyArrow = () => `<svg class="h7-arr" viewBox="0 0 34 16" aria-hidden="true">${ink(arrow(3, 9, 29, 7, (Math.random() - .5) * 4, 7))}</svg>`;

function listItem(item: Item, index: number) {
  reseed(40 + index * 7);
  const label = item.bridge ? `Tick “${item.title}”: open the index page` : `Tick “${item.title}” and test it on my repo`;
  return `<li class="h7-item" data-item="${index}">
    <button type="button" class="h7-box" aria-pressed="false" aria-label="${label}">${box()}</button>
    <div class="h7-item-body">
      <p class="h7-item-title"><span class="h7-title-text">${item.title}</span></p>
      <p class="h7-src">${item.source}</p>
      <p class="h7-tally"><span class="h7-arrows" aria-hidden="true">${Array.from({ length: item.moved }, (_, n) => tallyArrow().replace('class="h7-arr"', `class="h7-arr" style="--n:${n}"`)).join('')}</span><span class="h7-count">moved to next week <b data-count>×${item.moved}</b></span></p>
      <p class="h7-tried" data-tried hidden></p>
    </div>
  </li>`;
}

// ---------- doodles (one margin, drawn once) ----------

function marginDoodles(which: 'hero' | 'key' | 'index' | 'end') {
  reseed({ hero: 3, key: 9, index: 15, end: 21 }[which]);
  const spiral = (cx: number, cy: number) => { let d = ''; for (let i = 0; i < 90; i++) { const a = i / 9, r = 2 + i * .32; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)} `; } return d; };
  const star = (cx: number, cy: number, r: number) => poly(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as [number, number]; }), true, .8);
  const art = {
    hero: `${ink(spiral(40, 40), 'b')}${ink(star(26, 132, 14))}${ink(star(58, 170, 8), 'b')}
      <text x="12" y="250" class="h7-doodle-text" transform="rotate(-8 12 250)">zzz</text>${ink(ellipse(40, 330, 26, 26, .05))}${ink(`${line(40, 330, 40, 314, .5)} ${line(40, 330, 52, 336, .5)}`)}
      <text x="4" y="392" class="h7-doodle-text h7-doodle-small">next wk?</text>`,
    key: `${ink(poly([[14, 30], [44, 18], [70, 30], [40, 44]], true, .8))}${ink(poly([[14, 30], [14, 66], [40, 80], [40, 44]], false, .8))}${ink(poly([[70, 30], [70, 66], [40, 80]], false, .8))}
      ${ink(`${line(20, 140, 60, 118, .8)} ${line(22, 150, 64, 128, .8)} ${line(24, 160, 68, 138, .8)}`, 'b')}`,
    index: `${ink(ellipse(42, 40, 30, 30, .04, 1.08), 'b')}${ink(ellipse(44, 42, 25, 25, .06, .9), 'b')}
      ${ink(poly([[40, 120], [24, 158], [42, 156], [30, 196], [62, 146], [44, 148], [58, 120]], true, .8))}`,
    end: `${ink(ellipse(40, 40, 16, 16, .05))}${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return ink(line(40 + Math.cos(a) * 22, 40 + Math.sin(a) * 22, 40 + Math.cos(a) * 32, 40 + Math.sin(a) * 32, .5)); }).join('')}
      <text x="22" y="128" class="h7-doodle-text">!!</text>`,
  }[which];
  return `<svg class="h7-doodle h7-doodle-${which}" preserveAspectRatio="xMidYMin slice" viewBox="0 0 80 ${which === 'hero' ? 400 : 200}" aria-hidden="true">${art}</svg>`;
}

function pointer() {
  reseed(12);
  return `<svg class="h7-pointer" viewBox="0 0 170 120" aria-hidden="true"><text x="6" y="112" transform="rotate(-4 6 112)">it runs here</text>${ink(arrow(40, 84, 160, 30, -26, 12), 'b', 'pathLength="1"')}</svg>`;
}

// ---------- stickers ----------

const tape = (variant: 'a' | 'b', place: string) => `<span class="h7-tape h7-tape-${variant} ${place}" aria-hidden="true"></span>`;

function idleTest() {
  return `<div class="h7-ui-bar"><span class="h7-logo" aria-hidden="true"></span><b>Kiln</b><span class="h7-tab">Test</span><span class="h7-pill">Read-only</span></div>
    <div class="h7-test-idle">
      <p class="h7-idle-big">Nothing running yet.</p>
      <p>Tick a line on your list. Kiln runs that exact prompt on a repo you choose and shows every step as it happens.</p>
      <dl class="h7-fields"><div><dt>Repository</dt><dd><code>~/code/my-game</code></dd></div><div><dt>Agent</dt><dd>Claude Code, signed in</dd></div><div><dt>Cost</dt><dd>Your subscription, no API key</dd></div></dl>
    </div>
    <p class="h7-ui-foot">A replay of a sample run. Nothing runs from this page.</p>`;
}

function panelSticker() {
  return `<div class="h7-ui h7-panel">
    <div class="h7-ui-bar"><span class="h7-logo" aria-hidden="true"></span><b>Kiln</b><span class="h7-tab">Skills</span><span class="h7-bar-note">Sample library</span></div>
    <div class="h7-table-scroll"><table>
      <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h7-col-long">${column.name}</span><span class="h7-col-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
      <tbody data-rows></tbody>
    </table></div>
    <div class="h7-compare" data-compare hidden>
      <p><code>~/.claude/skills/code-review</code> differs from approved rev 3.</p>
      <div class="h7-diff"><p class="h7-del">− Review standards and the specification separately.</p><p class="h7-add">+ Review the specification only.</p></div>
      <div class="h7-ui-actions"><button type="button" class="h7-ui-button" data-compare-replace>Replace with approved rev 3</button><button type="button" class="h7-ui-button h7-quiet" data-compare-keep>Keep the edit as a draft</button></div>
    </div>
    <div class="h7-found"><h3>Found outside your library</h3><ul data-found></ul></div>
    <div class="h7-panel-foot"><p data-context></p><p class="h7-status" data-status aria-live="polite">Flip a switch to see what Kiln does.</p></div>
  </div>`;
}

function distillSticker() {
  return `<div class="h7-ui h7-distill" aria-label="Sample: a YouTube link distilled into entries with timestamped sources" role="img">
    <div class="h7-ui-bar"><span class="h7-logo" aria-hidden="true"></span><b>Kiln</b><span class="h7-tab">Capture</span></div>
    <div class="h7-distill-body">
      <p class="h7-url">youtube.com/watch?v=agent-workflows</p>
      <p class="h7-distill-done">Distilled into “Agent workflows”, 5 entries</p>
      <ul><li><span>Prompt</span>Find the instruction that went wrong<time>12:04</time></li><li><span>Technique</span>Keep project memory specific<time>23:51</time></li><li><span>Insight</span>Small skills trigger better<time>41:10</time></li></ul>
      <p class="h7-ui-foot">Sample. Transcript stays attached.</p>
    </div>
  </div>`;
}

// ---------- page ----------

type Cell = 'on' | 'off' | 'edited';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; fresh?: boolean; tested?: string };
const columns: { key: Column; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Codex and others', short: 'Codex+', path: '~/.agents/skills' },
  { key: 'project', name: 'my-game', short: 'my-game', path: '.github/skills' },
];
const rows: Row[] = [
  { name: 'code-review', note: 'approved rev 3', cells: { claude: 'edited', agents: 'on', project: 'on' } },
  { name: 'research', note: 'approved rev 2', cells: { claude: 'on', agents: 'on', project: 'off' } },
  { name: 'writing-for-agents', note: 'approved rev 1', cells: { claude: 'on', agents: 'off', project: 'off' } },
  { name: 'playtest-brief', note: 'approved rev 4', cells: { claude: 'off', agents: 'off', project: 'on' } },
];
const found = [
  { name: 'code-review (1)', where: '~/.claude/skills', kind: 'duplicate' as const, text: 'A second copy of code-review.' },
  { name: 'pr-summary', where: '~/.agents/skills', kind: 'stray' as const, text: 'Not in your library yet.' },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — My try-later list keeps moving to next week';
  const key = [
    ['<span class="h7-key-box"></span>', 'saved', 'Paste a post from X, drop a screenshot or a file, or press <kbd>Ctrl+Shift+Space</kbd> from anywhere. “Save only” keeps it without calling a model.'],
    ['<span class="h7-key-box h7-key-ticked"></span>', 'tried', 'Kiln ran the exact revision on my repo through the Codex or Claude Code I’m already signed into. Read-only, so nothing in my code changed.'],
    ['<span class="h7-key-word">pass?</span>', 'the agent’s opinion', 'Pass, fail or uncertain is the agent’s assessment. Whether I keep it is my call, and Kiln records it separately. Anything that needed edits or missing tools comes back uncertain, not faked.'],
    ['<span class="h7-key-word h7-key-struck">done</span>', 'decided', 'Kept as a skill, or let go. Either way it’s off the list.'],
    [tallyArrow(), 'moved to next week', 'The one I’m trying to do less.'],
  ];
  const notes = [
    ['Approval pins the exact revision.', 'Edit a skill and you get a new draft; the approved one stays installed. Approvals publish to your own Kiln GitHub repository.'],
    ['Change a line, run it again.', 'Compare revisions and diffs on the same repo and see what changed the result. That’s how the prompting gets better.'],
    ['Watch the whole run.', 'Messages, reasoning summaries, commands, model, effort, time and tokens in, cached and out. Up to two runs at once; cancel or retry.'],
    ['My other machine.', 'Open the Kiln repo there and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.'],
    ['Config files too.', 'CLAUDE.md, AGENTS.md, Codex and Claude settings, hooks and MCP config, edited in place with 30 private backups. Kiln never runs hooks.'],
    ['There’s a CLI.', 'Script collections, experiments, approvals and installs with JSON results. My agents can read the library through it.'],
  ];
  root.innerHTML = `<div class="h7">
    <a class="skip" href="#h7-main">Skip to the page</a>
    <div class="h7-paper">
      <header class="h7-top">
        <a class="h7-brand" href="#h7-main">Kiln</a>
        <nav aria-label="Main navigation"><a href="#h7-hero">tick one</a><a href="#h7-index">index</a><a href="#h7-get">download</a></nav>
      </header>
      <main id="h7-main">
        <section class="h7-hero" id="h7-hero" aria-labelledby="h7-title">
          ${marginDoodles('hero')}
          <span class="h7-page-no" aria-hidden="true">1</span>
          <div class="h7-hero-head">
            <h1 id="h7-title">My try-later list keeps moving to next week.</h1>
            <div class="h7-lede">
              <p>You saved it from a post, a talk, a screenshot. You meant to try it. Kiln is where you finally do: tick a saved prompt and it runs on your own repo, read-only, and tells you whether it worked.</p>
              <div class="h7-actions"><a class="h7-button" href="${installer}">${windows}<span>Download for Windows</span></a><a class="h7-link" href="#h7-index">See where passes go</a></div>
            </div>
          </div>
          <div class="h7-hero-body">
            <div class="h7-list">
              <h2 class="h7-list-title">try later</h2>
              <ul class="h7-items" data-items>${items.map(listItem).join('')}</ul>
              <p class="h7-list-foot">Go on, tick one.</p>
            </div>
            <div class="h7-stuck h7-stuck-test">${tape('a', 'h7-tape-top')}${pointer()}<div class="h7-ui h7-test" data-test aria-live="polite">${idleTest()}</div></div>
          </div>
        </section>

        <section class="h7-key" aria-labelledby="h7-key-title">
          ${marginDoodles('key')}
          <div class="h7-key-copy">
            <h2 id="h7-key-title">Key</h2>
            <p class="h7-under">how to read this page</p>
            <dl class="h7-key-list">${key.map(([mark, term, text]) => `<div><dt><span class="h7-key-mark">${mark}</span>${term}</dt><dd>${text}</dd></div>`).join('')}</dl>
          </div>
          <div class="h7-key-side">
            <p class="h7-hand-note">the 58-minute talk I “watched”:</p>
            <div class="h7-stuck h7-stuck-distill">${tape('b', 'h7-tape-corner')}${distillSticker()}</div>
            <p class="h7-printed">Paste a YouTube link and press <b>Distill video</b>. The captions become prompts, techniques and insights, each linked to its timestamp.</p>
            <p class="h7-printed">No API key and no extra API bill. Your plan’s usage limits still apply.</p>
          </div>
        </section>

        <section class="h7-index" id="h7-index" aria-labelledby="h7-index-title">
          ${marginDoodles('index')}
          <span class="h7-page-no" aria-hidden="true">2</span>
          <div class="h7-index-head">
            <div>
              <h2 id="h7-index-title">Index</h2>
              <ol class="h7-toc">
                <li><a href="#h7-hero"><span>try later</span><i></i><span>1</span></a></li>
                <li><a href="#h7-index-panel"><span>every skill, every folder</span><i></i><span>2</span></a></li>
                <li><a href="#h7-index-panel"><span>tested and kept</span><i></i><span>2</span></a></li>
              </ol>
            </div>
            <p class="h7-printed h7-index-lede">The other line that never got ticked: the skills folders. Kiln finds every folder your agents read, on this machine and in your projects, and puts each skill on one panel with a switch per location. Flip one to install the approved version there or remove that copy. The skill stays in your library either way.</p>
          </div>
          <div class="h7-index-body" id="h7-index-panel">
            <div class="h7-stuck h7-stuck-panel">${tape('a', 'h7-tape-left')}${tape('b', 'h7-tape-right')}${panelSticker()}</div>
            <aside class="h7-margin-notes" aria-label="Notes">
              <p><b class="h7-green">green</b> = installed from the version I approved</p>
              <p><b class="h7-amber">amber</b> = someone edited this copy by hand. probably me, at 1 am. compare before replacing.</p>
              <p>code-review (1)?? I don’t remember making that one.</p>
              <p>every installed skill’s description rides along in every session, used or not. switch off the ones I don’t use.</p>
              <p class="h7-landing">anything I tick and keep lands on this panel.</p>
            </aside>
          </div>
        </section>

        <section class="h7-notes" aria-labelledby="h7-notes-title">
          <h2 id="h7-notes-title">Notes</h2>
          <ul>${notes.map(([title, text]) => `<li><b>${title}</b> ${text}</li>`).join('')}</ul>
        </section>

        <section class="h7-get" id="h7-get" aria-labelledby="h7-get-title">
          ${marginDoodles('end')}
          <h2 id="h7-get-title">One more line for the list.<br>Don’t move this one.</h2>
          <div class="h7-get-row">
            <span class="h7-get-box" aria-hidden="true">${(() => { reseed(77); return box(); })()}</span>
            <a class="h7-button h7-button-big" href="${installer}" data-get>${windows}<span>Download Kiln for Windows</span></a>
          </div>
          <p class="h7-fine">Kiln 0.17.0 for Windows, with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so sign in with an account that has access. Unsigned build. MIT licensed. Setup creates your library’s GitHub repository with the official <code>gh</code> CLI.</p>
        </section>
      </main>
    </div>
  </div>`;
  const panel = bindPanel(root);
  bindList(root, panel);
  bindReveal(root);
  root.querySelector('[data-get]')!.addEventListener('click', () => root.querySelector('.h7-get-box')!.classList.add('is-ticked'));
}

function bindReveal(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('.h7-hero, .h7-doodle, .h7-stuck');
  if (!('IntersectionObserver' in window)) { targets.forEach(target => target.classList.add('is-in')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
  }), { threshold: .15 });
  targets.forEach(target => observer.observe(target));
}

function bindList(root: HTMLElement, panel: { add(name: string, tested: string, rev: number): void }) {
  const list = root.querySelector<HTMLElement>('[data-items]')!;
  const test = root.querySelector<HTMLElement>('[data-test]')!;
  const done = new Set<number>();
  let busy = false;
  const itemEl = (index: number) => list.querySelector<HTMLElement>(`[data-item="${index}"]`)!;

  // The tally keeps growing while you read. Only for lines nobody has ticked.
  const grow = () => {
    const open = items.map((_, index) => index).filter(index => !done.has(index) && items[index].moved < 12 && itemEl(index).dataset.state !== 'running');
    if (!open.length) return;
    const index = open[Math.floor(Math.random() * open.length)], el = itemEl(index), item = items[index];
    item.moved++;
    el.querySelector('.h7-arrows')!.insertAdjacentHTML('beforeend', tallyArrow().replace('class="h7-arr"', 'class="h7-arr h7-arr-new"'));
    el.querySelector('[data-count]')!.textContent = `×${item.moved}`;
    el.classList.remove('is-bumped'); void el.offsetWidth; el.classList.add('is-bumped');
  };
  if (!reduced) window.setTimeout(() => { grow(); window.setInterval(grow, 9000); }, 5200);

  const write = (index: number, text: string, strike: boolean) => {
    const el = itemEl(index), note = el.querySelector<HTMLElement>('[data-tried]')!;
    note.hidden = false; note.innerHTML = text;
    note.classList.remove('is-writing'); void note.offsetWidth; note.classList.add('is-writing');
    if (strike) { el.classList.add('is-struck'); done.add(index); }
  };

  list.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h7-box');
    if (!button) return;
    const el = button.closest<HTMLElement>('.h7-item')!, index = Number(el.dataset.item), item = items[index];
    if (el.classList.contains('is-ticked')) return;
    if (busy && !item.bridge) { test.querySelector<HTMLElement>('.h7-busy')?.classList.add('is-shaking'); window.setTimeout(() => test.querySelector('.h7-busy')?.classList.remove('is-shaking'), 500); return; }
    el.classList.add('is-ticked'); button.setAttribute('aria-pressed', 'true'); button.disabled = true;
    if (item.bridge) {
      window.setTimeout(() => write(index, 'Kiln found them all. see index, p. 2', true), reduced ? 0 : 420);
      window.setTimeout(() => root.querySelector('#h7-index')!.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), reduced ? 0 : 1500);
      return;
    }
    play(index, 1);
  });

  async function play(index: number, revision: number) {
    const item = items[index], el = itemEl(index), steps = item.steps!;
    busy = true; el.dataset.state = 'running';
    const verdict = revision > 1 ? 'pass' : item.verdict!;
    test.classList.remove('is-slapped'); void test.offsetWidth; test.classList.add('is-slapped');
    test.innerHTML = `<div class="h7-ui-bar"><span class="h7-logo" aria-hidden="true"></span><b>Kiln</b><span class="h7-tab">Test</span><span class="h7-pill">Read-only</span></div>
      <div class="h7-run">
        <p class="h7-run-title">${item.title}<span>rev ${revision}</span></p>
        <dl class="h7-run-meta"><div><dt>Repo</dt><dd><code>~/code/my-game</code></dd></div><div><dt>Agent</dt><dd>Claude Code</dd></div><div><dt>Effort</dt><dd>medium</dd></div><div><dt>Elapsed</dt><dd data-elapsed>0:00</dd></div></dl>
        <p class="h7-busy" data-busy><i></i>Running on your repo</p>
        <ol class="h7-steps" data-steps></ol>
        <p class="h7-tokens" data-tokens>0 in, 0 cached, 0 out</p>
        <div class="h7-outcome" data-outcome></div>
      </div>`;
    if (matchMedia('(max-width: 900px)').matches) test.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    const stepList = test.querySelector('[data-steps]')!, tokens = test.querySelector('[data-tokens]')!, elapsed = test.querySelector('[data-elapsed]')!;
    for (const [n, step] of steps.entries()) {
      await wait(620);
      const text = revision > 1 && n === steps.length - 1 && item.fix ? item.fix.last : step.text;
      stepList.insertAdjacentHTML('beforeend', `<li><span class="h7-tag h7-tag-${step.tag}">${step.tag}</span>${text}</li>`);
      const s = 21 * (n + 1) + n * 7;
      elapsed.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      tokens.textContent = `${(7.4 * (n + 1)).toFixed(1)}k in, ${(4.1 * n).toFixed(1)}k cached, ${(0.5 * (n + 1)).toFixed(1)}k out (sample)`;
    }
    await wait(420);
    test.querySelector('[data-busy]')!.remove();
    const outcome = test.querySelector<HTMLElement>('[data-outcome]')!;
    if (verdict === 'uncertain' && item.fix) {
      write(index, `tried ${today}: uncertain. hmm.`, false);
      outcome.innerHTML = `<p><span class="h7-verdict h7-verdict-uncertain">Uncertain</span> The agent’s assessment. It found two obstacles and couldn’t tell which comes first.</p>
        <p class="h7-outcome-hint">Change one line and run it again on the same repo:</p>
        <div class="h7-diff"><p class="h7-del">− ${item.fix.before}</p><p class="h7-add">+ ${item.fix.after}</p></div>
        <div class="h7-ui-actions"><button type="button" class="h7-ui-button" data-rerun>Run rev 2</button></div>`;
      busy = false; el.dataset.state = '';
      outcome.querySelector<HTMLButtonElement>('[data-rerun]')!.addEventListener('click', () => { if (!busy) play(index, 2); });
      return;
    }
    const tried = revision > 1 ? `tried ${today}: uncertain. rev 2: <b>pass</b>` : `tried ${today}, <b>pass</b>`;
    write(index, tried, true);
    busy = false; el.dataset.state = '';
    const lesson = revision > 1 && item.fix ? `<p class="h7-lesson">${item.fix.lesson}</p>` : '';
    outcome.innerHTML = `<p><span class="h7-verdict h7-verdict-pass">Pass</span> The agent’s assessment. Keeping it is your call.</p>${lesson}
      <div class="h7-ui-actions"><button type="button" class="h7-ui-button" data-keep>Approve as skill: ${item.skill}</button><button type="button" class="h7-ui-button h7-quiet" data-skip>Not for me</button></div>`;
    outcome.querySelector<HTMLButtonElement>('[data-keep]')!.focus({ preventScroll: true });
    outcome.querySelector('[data-keep]')!.addEventListener('click', () => {
      panel.add(item.skill!, `tested ${today}, pass`, revision);
      write(index, `${tried}. kept → index, p. 2`, true);
      outcome.innerHTML = `<p><span class="h7-verdict h7-verdict-pass">Approved</span> <b>${item.skill}</b> rev ${revision} is installed for Claude Code and Codex. <a href="#h7-index-panel">See it on the panel</a></p>`;
    });
    outcome.querySelector('[data-skip]')!.addEventListener('click', () => {
      write(index, `${tried}. not for me, and that’s fine`, true);
      test.innerHTML = idleTest();
    });
  }
}

function bindPanel(root: HTMLElement) {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foundList = root.querySelector<HTMLElement>('[data-found]')!;
  const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln' };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const draw = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"><th scope="row"><b>${row.name}</b><small>${row.note}</small>${row.tested ? `<span class="h7-tested">${row.tested}</span>` : ''}</th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="h7-switch h7-switch-${state}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${stateText[state]}" aria-pressed="${state !== 'off'}"><i></i></button></td>`;
    }).join('')}</tr>`).join('');
    foundList.innerHTML = found.map((item, f) => `<li><div><b>${item.name}</b><small><code>${item.where}</code> ${item.text}</small></div><button type="button" class="h7-ui-button h7-quiet" data-found="${f}">${item.kind === 'duplicate' ? 'Remove duplicate' : 'Import as draft'}</button></li>`).join('') || '<li class="h7-empty">Nothing left outside your library.</li>';
    const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
    context.textContent = `Loaded into every new session: ${count('claude')} skills in Claude Code, ${count('agents')} in Codex.`;
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h7-switch');
    if (!button) return;
    const row = rows[Number(button.dataset.row)], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('That copy was changed outside Kiln. Compare it first.'); compare.querySelector('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed ${column.path}/${row.name}. The skill and its history stay in your library.` : `Installed ${row.note.replace('approved ', '').split(',')[0]} of ${row.name} into ${column.path}. Install receipt saved.`);
    draw();
    body.querySelector<HTMLButtonElement>(`[data-row="${button.dataset.row}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-compare-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; draw();
    say('Moved the hand-edited copy to a private backup and installed approved rev 3.');
  });
  compare.querySelector('[data-compare-keep]')!.addEventListener('click', () => {
    rows[0].note = 'approved rev 3, draft rev 4'; compare.hidden = true; draw();
    say('Saved the edit as draft rev 4. Rev 3 stays approved and installed until you approve the draft.');
  });
  foundList.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-found]');
    if (!button) return;
    const [item] = found.splice(Number(button.dataset.found), 1);
    rows.forEach(row => { row.fresh = false; });
    if (item.kind === 'duplicate') say(`Moved ${item.name} to a private backup. One code-review left in ~/.claude/skills.`);
    else { rows.push({ name: item.name, note: 'draft, imported', cells: { claude: 'off', agents: 'off', project: 'off' }, fresh: true }); say(`Imported ${item.name} as a draft. The original folder stays where it was.`); }
    draw();
  });
  draw();
  return {
    add(name: string, tested: string, rev: number) {
      rows.forEach(row => { row.fresh = false; });
      rows.push({ name, note: `approved rev ${rev}, just now`, tested, cells: { claude: 'on', agents: 'on', project: 'off' }, fresh: true });
      draw();
      say(`Approved ${name} and installed it for Claude Code and Codex.`);
    },
  };
}
