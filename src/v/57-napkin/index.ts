// PROTOTYPE H01: the pitch sketched in blue ballpoint on a café napkin, with crisp Kiln UI cards taped on top.
// Story: library first (every copy, then the panel of switches), then one saved idea tested and approved onto that panel.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, cross, ellipse, folder, line, reseed, scribble } from '../r3-kit/rough';

const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download Kiln for Windows') => `<a class="h01-button" href="${installer}">${windows}<span>${text}</span></a>`;

// ---------- ballpoint ----------

/** A ballpoint line; `twice` goes over it again with a second, slightly different wobble, the way people doodle. */
const pen = (d: string, i = 0, extra = '') => `<path d="${d}" class="h01-pen ${extra}" style="--i:${i}" pathLength="1"/>`;
const word = (x: number, y: number, text: string, i = 0, size = 27, rotate = 0, extra = '') =>
  `<text x="${x}" y="${y}" class="h01-word ${extra}" style="--i:${i}" font-size="${size}" ${rotate ? `transform="rotate(${rotate} ${x} ${y})"` : ''}>${text}</text>`;
const tape = (where: string) => `<i class="h01-tape h01-tape-${where}" aria-hidden="true"></i>`;

function napkinClip(seed: number) {
  // A crimped paper edge: small irregular steps all the way round.
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const pts: string[] = [];
  const edge = (from: [number, number], to: [number, number], n: number, nx: number, ny: number) => {
    for (let k = 0; k < n; k++) {
      const t = k / n, wob = (k % 2 ? .35 : 0) + r() * .35;
      pts.push(`${(from[0] + (to[0] - from[0]) * t + nx * wob).toFixed(2)}% ${(from[1] + (to[1] - from[1]) * t + ny * wob).toFixed(2)}%`);
    }
  };
  edge([0, 0], [100, 0], 60, 0, 1); edge([100, 0], [100, 100], 60, -1, 0); edge([100, 100], [0, 100], 60, 0, -1); edge([0, 100], [0, 0], 60, 1, 0);
  return `clip-path:polygon(${pts.join(',')})`;
}

function coffeeRing(extra = '') {
  return `<svg class="h01-coffee ${extra}" viewBox="0 0 240 240" aria-hidden="true">
    <circle cx="120" cy="120" r="92" fill="url(#h01-stain)" filter="url(#h01-coffee-f)"/>
    <path d="M40,150 A88,88 0 0 1 150,34" fill="none" stroke="#7b4c22" stroke-opacity=".22" stroke-width="3" filter="url(#h01-coffee-f)" transform="translate(22 30)"/>
    <circle cx="214" cy="196" r="7" fill="#8a5a2b" fill-opacity=".18" filter="url(#h01-coffee-f)"/>
    <circle cx="228" cy="176" r="3.5" fill="#8a5a2b" fill-opacity=".16"/>
  </svg>`;
}

function defs() {
  return `<svg class="h01-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <filter id="h01-ink" x="-4%" y="-8%" width="108%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="9" result="grain"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.5 0 0 0 1.62" result="skip"/>
      <feComposite in="d" in2="skip" operator="in" result="line"/>
      <feGaussianBlur in="d" stdDeviation=".75" result="b"/>
      <feComponentTransfer in="b" result="bleed"><feFuncA type="linear" slope=".42"/></feComponentTransfer>
      <feMerge><feMergeNode in="bleed"/><feMergeNode in="line"/></feMerge>
    </filter>
    <filter id="h01-coffee-f" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="h01-stain">
      <stop offset=".78" stop-color="#9a6a3a" stop-opacity=".05"/>
      <stop offset=".9" stop-color="#8a5a2b" stop-opacity=".16"/>
      <stop offset=".965" stop-color="#6e4219" stop-opacity=".42"/>
      <stop offset="1" stop-color="#6e4219" stop-opacity="0"/>
    </radialGradient>
  </svg>`;
}

// ---------- sketches ----------

type Box = [x: number, y: number, w: number, h: number, rot: number, path: string, items: string[]];
function foldersSketch(tall = false) {
  reseed(tall ? 13 : 11);
  let i = 0;
  const size = tall ? 22 : 26, gap = tall ? 24 : 27;
  const twice = (d: () => string) => pen(d(), i++) + pen(d(), i++, 'h01-pen-faint');
  const box = ([x, y, w, h, rot, path, items]: Box) =>
    `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${twice(() => folder(x, y, w, h))}${word(x + 4, y - 7, path, i++, size - 2, 0, 'h01-word-path')}${items.map((text, n) => word(x + 13, y + (tall ? 36 : 42) + n * gap, text, i++, size)).join('')}</g>`;
  const boxes: Box[] = tall ? [
    [6, 34, 164, 128, -2, '~/.claude/skills', ['code-review', 'code-review (1)', 'research', 'playtest ??']],
    [188, 24, 166, 128, 2.5, '~/.agents/skills', ['code-review', 'writing-for-agents', 'pr-summary', '    old-link']],
    [10, 232, 152, 80, -3.5, '.codex/skills', ['code-review-old', 'research']],
    [198, 226, 150, 58, 3, '.copilot/skills', ['pr-summary (2)']],
    [84, 372, 196, 82, 1.5, 'my-game/.github/skills', ['code-review-FINAL', 'playtest']],
  ] : [
    [18, 44, 232, 146, -2, '~/.claude/skills', ['code-review', 'code-review (1)', 'research', 'playtest ??']],
    [318, 22, 262, 146, 2.5, '~/.agents/skills', ['code-review', 'writing-for-agents', 'pr-summary', '    old-link']],
    [30, 262, 186, 96, -4, '.codex/skills', ['code-review-old', 'research']],
    [250, 244, 150, 70, 3, '.copilot/skills', ['pr-summary (2)']],
    [430, 262, 196, 96, 1.5, 'my-game/.github/skills', ['code-review-FINAL', 'playtest']],
  ];
  const notes = tall ? `
    ${pen(cross(207, 136, 6), i++)}
    ${pen(ellipse(248, 54, 52, 13, .07), i++)}
    ${word(236, 196, 'edited by hand?', i++, 22, -5)}${pen(arrow(300, 180, 270, 84, -16, 10), i++)}
    ${pen(ellipse(66, 87, 62, 12, .08), i++)}${word(10, 204, 'dupe!', i++, 24, -6)}${pen(arrow(36, 184, 30, 100, 10, 9), i++)}
    ${pen(arrow(26, 480, 30, 300, -18, 10), i++)}${pen(arrow(250, 482, 222, 436, 8, 10), i++)}
    ${word(40, 505, 'which one is current??', i++, 30, -2, 'h01-word-big')}
    ${pen(line(40, 514, 318, 508, 1), i++)}
    ${word(292, 420, '4×', i++, 36, -8, 'h01-word-big')}` : `
    ${pen(cross(345, 150, 8), i++)}
    ${pen(ellipse(392, 57, 70, 15, .07), i++)}
    ${word(462, 214, 'edited by hand?', i++, 25, -5)}${pen(arrow(566, 190, 466, 60, 80, 12), i++)}
    ${pen(ellipse(90, 106, 76, 14, .08), i++)}${word(170, 232, 'dupe!', i++, 28, -6)}${pen(arrow(186, 212, 170, 124, 14, 11), i++)}
    ${pen(arrow(212, 424, 196, 320, 12, 12), i++)}${pen(arrow(390, 426, 498, 338, -18, 12), i++)}
    ${word(200, 450, 'which one is current??', i++, 34, -2, 'h01-word-big')}
    ${pen(line(200, 460, 470, 455, 1), i++)}
    ${word(8, 440, '4× code-review', i++, 28, -5, 'h01-word-big')}`;
  return `<svg class="h01-sketch ${tall ? 'h01-sketch-tall' : 'h01-sketch-wide'}" viewBox="${tall ? '0 0 360 530' : '0 0 640 470'}" ${tall ? 'aria-hidden="true"' : `role="img" aria-label="A ballpoint sketch of five skill folders: ~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills and my-game/.github/skills. Code-review appears in four of them under different names, one copy is circled as edited by hand, a duplicate is circled, a link is crossed out as broken, and a note asks which one is current."`}>
    ${boxes.map(box).join('')}${notes}
  </svg>`;
}

function panelNotes() {
  reseed(23);
  const note = (id: string, text: string, d: string, i: number, view = '0 0 90 50') =>
    `<li class="h01-note h01-note-${id}"><svg viewBox="${view}" aria-hidden="true">${pen(d, i)}</svg><p>${text}</p></li>`;
  return `<ul class="h01-notes" aria-label="Notes scribbled beside the panel">
    ${note('switch', '<b>one switch per place.</b> flip it and Kiln installs the version you approved, or takes that copy away.', arrow(84, 30, 10, 20, 10, 11), 1)}
    ${note('amber', '<b>amber</b> = somebody edited that copy by hand. tap it and compare before you replace it.', arrow(84, 18, 8, 32, -12, 11), 3)}
    ${note('found', 'the dashed bit: stuff it found that isn\'t in your library yet. duplicates too.', arrow(80, 12, 10, 40, 14, 11), 5)}
    ${note('tokens', 'every installed skill\'s description sits in your agent\'s context on <u>every turn</u>. switch off what you don\'t use.', scribble(8, 16, 62, 2, 10), 7)}
  </ul>`;
}

function pileSketch(tall = false) {
  reseed(tall ? 41 : 37);
  let i = 0;
  const rows: [string, string][] = tall
    ? [['x post: "insane!!"', '||||  ||'], ['58 min talk', '|||'], ['someone\'s CLAUDE.md', '||||'], ['"try this later!!"', '||||  ||||']]
    : [['x post: "this prompt is insane"', '||||  ||'], ['58 min agent workflows talk', '|||'], ['screenshot of someone\'s CLAUDE.md', '||||'], ['"try this later!!"', '||||  ||||  ||']];
  const size = tall ? 27 : 26, tallyX = tall ? 258 : 400, w = tall ? 360 : 520;
  return `<svg class="h01-sketch h01-pile ${tall ? 'h01-sketch-tall' : 'h01-sketch-wide'}" viewBox="0 0 ${w} 300" ${tall ? 'aria-hidden="true"' : 'role="img" aria-label="A ballpoint list titled saved to try later, with tally marks next to X posts, talk videos, screenshots and notes saying try this later, and a count: tried, zero."'}>
    ${word(10, 38, 'saved to try later:', i++, 34, -1.5, 'h01-word-big')}${pen(line(12, 48, 290, 44, 1), i++)}
    ${rows.map(([text, tally], n) => `${pen(line(12, 82 + n * 40, 20, 82 + n * 40, .6), i++)}${word(30, 88 + n * 40, text, i++, size)}${word(tallyX, 88 + n * 40, tally, i++, size, 0, 'h01-word-tally')}`).join('')}
    ${word(30, 270, 'tried:', i++, 36, -2, 'h01-word-big')}
    <g class="h01-tried-zero">${word(116, 270, '0', i++, 42, -2, 'h01-word-big')}</g>
    <g class="h01-tried-one">${pen(line(110, 262, 140, 240, .6), 0)}${word(148, 262, '1 !', 4, 44, -6, 'h01-word-big')}</g>
  </svg>`;
}

// ---------- crisp cards ----------

function copiesCard() {
  const row = (path: string, state: string, cls: string) => `<li><code>${path}</code><span class="h01-chip h01-chip-${cls}">${state}</span></li>`;
  return `<figure class="h01-card h01-copies" aria-labelledby="h01-copies-cap">
    ${tape('tl')}${tape('br')}
    <div class="h01-card-bar"><b>code-review</b><span>approved rev 3</span></div>
    <p class="h01-copies-lede">5 copies on this machine</p>
    <ul>
      ${row('~/.agents/skills', 'Installed, rev 3', 'on')}
      ${row('my-game/.github/skills', 'Identical copy', 'same')}
      ${row('~/.claude/skills', 'Edited outside Kiln', 'edited')}
      ${row('~/.claude/skills/code-review (1)', 'Duplicate', 'found')}
      ${row('.codex/skills/code-review-old', 'Differs', 'found')}
    </ul>
    <figcaption id="h01-copies-cap">Sample library. Compare any copy file by file, replace it with rev 3, or remove it.</figcaption>
  </figure>`;
}

type Cell = 'on' | 'off' | 'edited';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; fresh?: boolean };
const columns: { key: Column; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Codex, Copilot', short: 'Codex', path: '~/.agents/skills' },
  { key: 'project', name: 'my-game', short: 'my-game', path: '.github/skills' },
];

function panelCard() {
  return `<div class="h01-card h01-panel" id="h01-panel-card">
    ${tape('tl')}${tape('tr')}
    <div class="h01-card-bar"><b>Skills</b><span>Sample library, 3 locations</span></div>
    <div class="h01-table-wrap"><table>
      <caption class="visually-hidden">Skills and where they are installed. Each switch installs or removes that skill in that location.</caption>
      <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h01-long">${column.name}</span><span class="h01-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
      <tbody data-rows></tbody>
    </table></div>
    <div class="h01-compare" data-compare hidden>
      <p><b>~/.claude/skills/code-review</b> differs from approved rev 3 in SKILL.md, line 12.</p>
      <div class="h01-diff"><p class="h01-del">- Review standards and the specification separately.</p><p class="h01-add">+ Review the specification only.</p></div>
      <div class="h01-actions-row"><button type="button" class="h01-ui-button" data-replace>Replace with rev 3</button><button type="button" class="h01-ui-button h01-quiet" data-keep>Keep the edit as draft rev 4</button></div>
    </div>
    <div class="h01-found"><h3>Found outside your library</h3><ul data-found></ul></div>
    <div class="h01-card-foot"><p data-context></p><p class="h01-status" data-status aria-live="polite">Flip a switch. Nothing here touches your disk; it's a sample.</p></div>
  </div>`;
}

const idea = { ...examples[0], skill: 'kid-usability-check' };

function tryCard() {
  return `<article class="h01-card h01-try" aria-labelledby="h01-try-name" data-try>
    ${tape('tl')}${tape('tr')}
    <div class="h01-card-bar"><b>Saved idea</b><span data-try-rev>rev 1</span></div>
    <div class="h01-try-body">
      <p class="h01-try-src">${idea.source}, saved at 11:48 pm</p>
      <h3 id="h01-try-name">${idea.title}</h3>
      <p class="h01-try-prompt" data-prompt>${idea.prompt}</p>
      <dl class="h01-try-meta"><div><dt>Repo</dt><dd><code>~/code/my-game</code>, read-only</dd></div><div><dt>Agent</dt><dd>Claude Code, your subscription</dd></div></dl>
      <div class="h01-run" data-run aria-live="polite"></div>
    </div>
    <div class="h01-try-foot"><button type="button" class="h01-ui-button h01-go" data-go>Test it on my repo</button><span class="h01-try-hint" data-hint>Replays a sample run. Nothing runs from this page.</span></div>
  </article>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln: your skills are in five folders. Put them on one panel.';
  root.innerHTML = `<div class="h01">
    ${defs()}
    <header class="h01-top">
      <a class="h01-brand" href="#main" aria-label="Kiln, home"><span class="h01-brand-mark" aria-hidden="true"></span>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h01-panel">The panel</a><a href="#h01-try">Try one</a><a href="#h01-get">Download</a></nav>
    </header>
    <main id="main">
      <section class="h01-hero" aria-labelledby="h01-title">
        <div class="h01-napkin h01-napkin-hero h01-drawable">
          <div class="h01-paper" style="${napkinClip(5)}">
            <p class="h01-ink h01-kicker" aria-hidden="true">ok, so here's the thing&hellip;</p>
            <h1 id="h01-title" class="h01-ink">Your skills are in five folders. They should be on one panel.</h1>
            ${foldersSketch()}${foldersSketch(true)}
            ${coffeeRing('h01-coffee-hero')}
          </div>
        </div>
        <div class="h01-hero-side">
          ${copiesCard()}
          <div class="h01-hero-copy">
            <p>Here's what I mean. Claude Code reads <code>~/.claude/skills</code>. Codex and Copilot share <code>~/.agents/skills</code>. Every repo has its own <code>.github/skills</code>. You copied code-review into four of them, tweaked one by hand, and now nobody knows which one is current.</p>
            <p>Kiln is a Windows app that finds every copy and gives each skill one switch per place.</p>
            <div class="h01-cta">${download()}<a class="h01-link" href="#h01-panel">Show me the panel</a></div>
          </div>
        </div>
      </section>

      <section class="h01-sec h01-sec-panel" id="h01-panel" aria-labelledby="h01-panel-title">
        <div class="h01-table-copy">
          <p>Kiln scans every skills folder your agents read, on this machine and in the projects you enrol. Installed skills you already have come in as drafts; the originals stay where they are. Then it's one row per skill and one switch per location.</p>
        </div>
        <div class="h01-napkin h01-napkin-panel h01-drawable">
          <div class="h01-paper" style="${napkinClip(17)}">
            <h2 id="h01-panel-title" class="h01-ink">Flip the napkin over. This is the panel.</h2>
            <div class="h01-panel-layout">${panelCard()}<div class="h01-ink h01-notes-wrap">${panelNotes()}</div></div>
          </div>
        </div>
      </section>

      <section class="h01-sec h01-sec-try" id="h01-try" aria-labelledby="h01-try-title">
        <div class="h01-table-copy h01-table-copy-cols">
          <p>Pick a local repo, press test, and Kiln runs that exact prompt revision through the Codex or Claude Code you're already signed into. You watch the commands, searches and token counts as they happen. It's read-only, so nothing in your code changes.</p>
          <p>The agent says pass, fail or uncertain. That's its call; keeping it is yours. Change a line, run it again on the same repo, and you see exactly what the edit did. That's how you actually get better at prompting.</p>
        </div>
        <div class="h01-try-stage">
          <div class="h01-napkin h01-napkin-try h01-drawable">
            <div class="h01-paper" style="${napkinClip(29)}">
              <h2 id="h01-try-title" class="h01-ink">And that thing you saved at midnight? Try one. Now.</h2>
              <div class="h01-ink h01-pile-wrap">${pileSketch()}${pileSketch(true)}</div>
            </div>
          </div>
          ${tryCard()}
        </div>
      </section>

      <section class="h01-sec h01-facts" aria-labelledby="h01-facts-title">
        <h2 id="h01-facts-title">The stuff you'd ask me next</h2>
        <dl>
          <div><dt>Do I need an API key?</dt><dd>No. It uses the Codex or Claude Code you're already signed into, on your ChatGPT or Claude plan. No extra API bill; your plan's usage limits still apply. Editing, approving and installing never call a model.</dd></div>
          <div><dt>What if I edit an approved skill?</dt><dd>You get a new draft. The approved revision stays exactly as it was and stays installed. Approval commits that snapshot to your own Kiln repository on GitHub.</dd></div>
          <div><dt>And on my other machine?</dt><dd>Open the same repo and press "Install everything marked for this machine". Or run <code>kiln skills sync</code>.</dd></div>
          <div><dt>Where do the ideas come from?</dt><dd>Anywhere. Ctrl+Shift+Space opens capture from any app. Paste a post, drop a screenshot, or give it a YouTube link and it distills the talk into prompts with timestamped sources.</dd></div>
          <div><dt>What about CLAUDE.md and friends?</dt><dd>AGENTS.md, config.toml, hooks, MCP and settings files sit in the same app. Edits go to the real file, with syntax checks and 30 private backups. Kiln never runs your hooks.</dd></div>
          <div><dt>Can my agents use it?</dt><dd>Yes. The <code>kiln</code> CLI scripts collections, experiments, approvals and installs with JSON output, so your agents can read the library too.</dd></div>
        </dl>
      </section>

      <section class="h01-sec h01-get" id="h01-get" aria-labelledby="h01-get-title">
        <div class="h01-card h01-get-card">
          ${tape('tl')}${tape('tr')}
          <h2 id="h01-get-title">Put it on your machine and flip the first switch.</h2>
          ${download()}
          <p>Kiln 0.17.0 for Windows. Works with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned, and it's MIT licensed.</p>
        </div>
      </section>
    </main>
  </div>`;
  bindDrawing(root);
  const panel = bindPanel(root);
  bindTry(root, panel);
}

function bindDrawing(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('.h01-drawable');
  if (navigator.webdriver || !('IntersectionObserver' in window)) { targets.forEach(target => target.classList.add('is-drawn')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); observer.unobserve(entry.target); }
  }), { threshold: .2 });
  targets.forEach(target => observer.observe(target));
}

function bindPanel(root: HTMLElement) {
  const rows: Row[] = [
    { name: 'code-review', note: 'approved rev 3', cells: { claude: 'edited', agents: 'on', project: 'on' } },
    { name: 'research', note: 'approved rev 2', cells: { claude: 'on', agents: 'on', project: 'off' } },
    { name: 'writing-for-agents', note: 'approved rev 1', cells: { claude: 'on', agents: 'off', project: 'off' } },
    { name: 'playtest-brief', note: 'approved rev 4', cells: { claude: 'off', agents: 'off', project: 'on' } },
  ];
  const found = [
    { name: 'code-review (1)', where: '~/.claude/skills', kind: 'duplicate' as const, text: 'Same name, older content.' },
    { name: 'pr-summary', where: '~/.agents/skills', kind: 'stray' as const, text: 'Not in your library yet.' },
  ];
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foundList = root.querySelector<HTMLElement>('[data-found]')!;
  const label: Record<Cell, string> = { on: 'On', off: 'Off', edited: 'Edited' };
  const long: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln' };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const draw = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="h01-switch h01-switch-${state}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${long[state]}" aria-pressed="${state !== 'off'}"><i aria-hidden="true"></i><span aria-hidden="true">${label[state]}</span></button></td>`;
    }).join('')}</tr>`).join('');
    foundList.innerHTML = found.map((item, f) => `<li><div><b>${item.name}</b><small><code>${item.where}</code> ${item.text}</small></div><button type="button" class="h01-ui-button h01-quiet" data-found="${f}">${item.kind === 'duplicate' ? 'Remove duplicate' : 'Import as draft'}</button></li>`).join('') || '<li class="h01-empty">Nothing left outside your library.</li>';
    const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
    context.textContent = `Loaded into every new session: ${count('claude')} skills in Claude Code, ${count('agents')} in Codex.`;
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h01-switch');
    if (!button) return;
    const r = Number(button.dataset.row), row = rows[r], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('That copy was changed outside Kiln. Compare it before anything happens.'); compare.querySelector<HTMLButtonElement>('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    const rev = row.note.match(/rev \d+/)?.[0] ?? 'the approved revision';
    say(state === 'on' ? `Removed ${column.path}/${row.name}. The skill and its history stay in your library.` : `Installed ${rev} of ${row.name} into ${column.path}. Receipt saved.`);
    draw();
    body.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; draw();
    say('Moved the hand-edited copy to a private backup and installed rev 3.');
    body.querySelector<HTMLButtonElement>('[data-row="0"][data-col="claude"]')?.focus();
  });
  compare.querySelector('[data-keep]')!.addEventListener('click', () => {
    rows[0].note = 'approved rev 3, draft rev 4'; compare.hidden = true; draw();
    say('Saved the edit as draft rev 4. Rev 3 stays approved until you approve the new one.');
    body.querySelector<HTMLButtonElement>('[data-row="0"][data-col="claude"]')?.focus();
  });
  foundList.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-found]');
    if (!button) return;
    const [item] = found.splice(Number(button.dataset.found), 1);
    if (item.kind === 'duplicate') say(`Moved ${item.name} to a private backup. One code-review left in ~/.claude/skills.`);
    else { rows.forEach(row => { row.fresh = false; }); rows.push({ name: item.name, note: 'draft, imported', cells: { claude: 'off', agents: 'off', project: 'off' }, fresh: true }); say(`Imported ${item.name} as a draft. The original folder stays where it was.`); }
    draw();
    foundList.querySelector<HTMLButtonElement>('button')?.focus();
  });
  draw();
  return {
    add(name: string) {
      rows.forEach(row => { row.fresh = false; });
      const existing = rows.find(row => row.name === name);
      if (existing) { existing.fresh = true; existing.cells.claude = 'on'; existing.cells.agents = 'on'; draw(); say(`${name} is already approved and installed.`); return; }
      rows.push({ name, note: 'approved rev 2, just now', cells: { claude: 'on', agents: 'on', project: 'off' }, fresh: true });
      draw();
      say(`Approved ${name} rev 2 and installed it for Claude Code and Codex.`);
    },
  };
}

function bindTry(root: HTMLElement, panel: { add(name: string): void }) {
  const card = root.querySelector<HTMLElement>('[data-try]')!;
  const go = card.querySelector<HTMLButtonElement>('[data-go]')!;
  const run = card.querySelector<HTMLElement>('[data-run]')!;
  const hint = card.querySelector<HTMLElement>('[data-hint]')!;
  const rev = card.querySelector<HTMLElement>('[data-try-rev]')!;
  const prompt = card.querySelector<HTMLElement>('[data-prompt]')!;
  const piles = root.querySelectorAll<SVGElement>('.h01-pile');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
  const before = 'Describe that first obstacle and suggest a fix.';
  const after = 'Describe the first obstacle, quote the text on screen, and suggest a fix.';
  let stage: 'idle' | 'running' | 'uncertain' | 'pass' | 'done' = 'idle';

  const setButton = (text: string, disabled = false) => { go.textContent = text; go.disabled = disabled; };
  async function play(revision: number) {
    stage = 'running';
    card.dataset.stage = 'running';
    const steps = revision === 1
      ? ['Read src/screens/Start.tsx', 'Searched src/ for "signup", skipped the parent flow', 'Read src/screens/Levels.tsx', 'Found two confusing spots, unsure which comes first']
      : ['Read src/screens/Start.tsx', 'Read src/screens/Levels.tsx', 'Quoted the button text: "Continue to setup"', 'Named that as the first obstacle, with a fix'];
    run.innerHTML = `<ol class="h01-log" data-log></ol><p class="h01-run-meta" data-meta>Starting Claude Code in ~/code/my-game…</p><div data-outcome></div>`;
    const log = run.querySelector('[data-log]')!, meta = run.querySelector('[data-meta]')!;
    setButton('Running on my-game…', true);
    for (const [index, text] of steps.entries()) {
      await wait(620);
      log.insertAdjacentHTML('beforeend', `<li>${text}</li>`);
      const seconds = (index + 1) * 41;
      meta.textContent = `Sample: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} elapsed, ${(5.8 * (index + 1)).toFixed(1)}k tokens in, ${(3.1 * (index + 1)).toFixed(1)}k cached, ${(0.4 * (index + 1)).toFixed(1)}k out`;
    }
    await wait(400);
    const outcome = run.querySelector<HTMLElement>('[data-outcome]')!;
    if (revision === 1) {
      stage = 'uncertain'; card.dataset.stage = 'uncertain';
      outcome.innerHTML = `<p><span class="h01-verdict h01-verdict-uncertain">Uncertain</span> The agent found two obstacles and couldn't say which a kid would hit first.</p>
        <p class="h01-run-meta">Suggested edit for rev 2:</p>
        <div class="h01-diff"><p class="h01-del">- ${before}</p><p class="h01-add">+ ${after}</p></div>`;
      setButton('Run rev 2 with that line');
      hint.textContent = 'Same repo, one line changed.';
    } else {
      stage = 'pass'; card.dataset.stage = 'pass';
      outcome.innerHTML = `<p><span class="h01-verdict h01-verdict-pass">Pass</span> The agent's call. Asking for the on-screen text made it commit to one obstacle. Keeping it is up to you.</p>`;
      setButton(`Approve as ${idea.skill} and install`);
      hint.textContent = 'Installs into Claude Code and Codex.';
    }
    go.focus();
  }

  go.addEventListener('click', () => {
    if (stage === 'idle') { play(1); return; }
    if (stage === 'uncertain') {
      rev.textContent = 'rev 2';
      prompt.innerHTML = idea.prompt.replace(before, `<mark>${after}</mark>`);
      play(2); return;
    }
    if (stage === 'pass') {
      stage = 'done'; card.dataset.stage = 'done';
      panel.add(idea.skill);
      piles.forEach(pile => pile.classList.add('is-tried'));
      run.querySelector('[data-outcome]')!.insertAdjacentHTML('beforeend', `<p class="h01-landed"><b>${idea.skill}</b> is on your panel now, switched on for Claude Code and Codex. <a href="#h01-panel-card">See it on the panel</a></p>`);
      setButton('Start over with the saved idea');
      hint.textContent = 'Resets this sample.';
      return;
    }
    if (stage === 'done') {
      stage = 'idle'; card.dataset.stage = 'idle';
      run.innerHTML = ''; rev.textContent = 'rev 1'; prompt.textContent = idea.prompt;
      setButton('Test it on my repo'); hint.textContent = 'Replays a sample run. Nothing runs from this page.';
    }
  });
}
