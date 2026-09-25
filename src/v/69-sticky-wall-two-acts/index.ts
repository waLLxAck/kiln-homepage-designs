// PROTOTYPE round 5, H03 — Sticky wall. Two acts on a cork board. Act 1: five provider folders pinned to the cork, felt-tip
// skill notes tucked inside; "Tidy this up" flies (FLIP) every note into a crisp Windows 11 Kiln panel, duplicates merge into
// one row, junk crumples into a cleanup bar, then one switch per skill per location. Act 2: printouts of a video, a post and a
// repo you drag into Kiln's capture area; the prompt it pulls out gets dragged into Test, runs, passes, is approved and lands
// as a new row on the same panel.
import './style.css';
import { examples, installer } from '../../content';
import { cross, ellipse, folder as folderPath, reseed, scribble } from '../r3-kit/rough';

type Tint = 'y' | 'p' | 'b' | 'g' | 'o' | 'l' | 'w';
type Col = 'claude' | 'agents' | 'codex' | 'copilot' | 'project';
type Cell = 'on' | 'off' | 'edited' | 'found';
type Row = { name: string; note: string; cells: Record<Col, Cell>; imported?: boolean; fresh?: boolean };

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const windowsMark = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const appIcon = (size = 16) => `<svg class="h03-appicon" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="8" fill="#005fb8"/><path d="M8 25V15a8 8 0 0 1 16 0v10z" fill="#fff"/><path d="M12.5 25v-7a3.5 3.5 0 0 1 7 0v7z" fill="#ffb454"/></svg>`;
const chrome = (title: string) => `<div class="h03-titlebar">${appIcon()}<span>${title}</span><i aria-hidden="true" class="h03-controls"><b class="h03-min"></b><b class="h03-max"></b><b class="h03-close"></b></i></div>`;
const svgIcon = (d: string, size = 18) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

// ---------- the library (shared by both acts) ----------

const locations: { key: Col; name: string; short: string; path: string; tab: string; who: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills', tab: '~/.claude/skills', who: 'Claude Code' },
  { key: 'agents', name: 'Shared', short: 'Shared', path: '~/.agents/skills', tab: '~/.agents/skills', who: 'Codex, Copilot and others' },
  { key: 'codex', name: 'Codex', short: 'Codex', path: '.codex/skills', tab: '.codex/skills', who: 'Codex' },
  { key: 'copilot', name: 'Copilot', short: 'Copilot', path: '.copilot/skills', tab: '.copilot/skills', who: 'Copilot' },
  { key: 'project', name: 'my-game', short: 'my-game', path: '.github/skills', tab: 'my-game/.github/skills', who: 'the my-game project' },
];
const cells = (set: Partial<Record<Col, Cell>>): Record<Col, Cell> => ({ claude: 'off', agents: 'off', codex: 'off', copilot: 'off', project: 'off', ...set });
const rows: Row[] = [
  { name: 'code-review', note: '3 folders, 1 skill. Approved rev 3', cells: cells({ claude: 'edited', agents: 'on', project: 'on' }) },
  { name: 'research', note: 'Approved rev 2', cells: cells({ claude: 'on', agents: 'on' }) },
  { name: 'writing-for-agents', note: 'Approved rev 1', cells: cells({ claude: 'on', copilot: 'on' }) },
  { name: 'playtest-brief', note: 'Approved rev 4', cells: cells({ codex: 'on', project: 'on' }) },
  { name: 'pr-summary', note: 'Found outside your library', cells: cells({ agents: 'found' }) },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };

// ---------- act 1: the wall ----------

type Doodle = 'broken' | 'under' | 'ring' | 'empty';
type WallNote = { text: string; sub?: string; tint: Tint; to: string; doodle?: Doodle; red?: boolean; r: number };
type WallFolder = { key: Col; r: number; notes: WallNote[] };
const wall: WallFolder[] = [
  { key: 'claude', r: -1.4, notes: [
    { text: 'code-review', sub: 'who edited this??', tint: 'y', to: 'cell:code-review:claude', doodle: 'ring', red: true, r: -4 },
    { text: 'research', tint: 'g', to: 'cell:research:claude', r: 3 },
    { text: 'writing-for-agents', tint: 'l', to: 'cell:writing-for-agents:claude', r: -2 },
    { text: 'code-review (1)', sub: 'older one?', tint: 'y', to: 'row:code-review', r: 5 },
  ] },
  { key: 'agents', r: 1.2, notes: [
    { text: 'code-review', tint: 'y', to: 'cell:code-review:agents', r: 2 },
    { text: 'research', sub: 'the good one?', tint: 'g', to: 'cell:research:agents', r: -3 },
    { text: 'old-link', sub: 'broken link', tint: 'b', to: 'junk', doodle: 'broken', r: 4 },
    { text: 'pr-summary', sub: 'where’s this from?', tint: 'p', to: 'cell:pr-summary:agents', r: -2 },
  ] },
  { key: 'codex', r: -2.2, notes: [
    { text: 'code-review-FINAL', sub: 'final final', tint: 'y', to: 'row:code-review', doodle: 'under', r: -3 },
    { text: 'playtest ??', tint: 'o', to: 'cell:playtest-brief:codex', r: 4 },
  ] },
  { key: 'copilot', r: 1.8, notes: [
    { text: 'writing-for-agents', tint: 'l', to: 'cell:writing-for-agents:copilot', r: 3 },
    { text: 'old-prompts/', sub: 'empty folder', tint: 'b', to: 'junk', doodle: 'empty', r: -4 },
  ] },
  { key: 'project', r: -.8, notes: [
    { text: 'code-review', tint: 'y', to: 'cell:code-review:project', r: -3 },
    { text: 'playtest-brief', tint: 'o', to: 'cell:playtest-brief:project', r: 2 },
  ] },
];
const loose: WallNote = { text: 'which ones does Claude even load?', tint: 'w', to: 'context', red: true, r: 3 };
const targets = new Set(wall.flatMap(folder => folder.notes.map(note => note.to)));

function doodle(kind?: Doodle) {
  if (!kind) return '';
  reseed(kind === 'broken' ? 23 : kind === 'ring' ? 5 : kind === 'empty' ? 11 : 9);
  if (kind === 'broken') return `<svg class="h03-doodle h03-doodle-cross" viewBox="0 0 40 40" aria-hidden="true"><path d="${cross(20, 20, 13)}"/></svg>`;
  if (kind === 'under') return `<svg class="h03-doodle h03-doodle-under" viewBox="0 0 120 20" aria-hidden="true"><path d="${scribble(4, 5, 110, 2, 6)}"/></svg>`;
  if (kind === 'ring') return `<svg class="h03-doodle h03-doodle-ring" viewBox="0 0 140 70" aria-hidden="true"><path d="${ellipse(70, 30, 62, 24, .06, 1.08)}"/></svg>`;
  return `<svg class="h03-doodle h03-doodle-empty" viewBox="0 0 60 44" aria-hidden="true"><path d="${folderPath(4, 4, 50, 34)}"/></svg>`;
}

const noteHtml = (note: WallNote, id: string, base: number, extra = '') => `<div class="h03-note h03-t-${note.tint}${note.red ? ' h03-red' : ''}${note.doodle ? ` h03-has-${note.doodle}` : ''}${extra}" data-flyer="${id}" data-to="${note.to}" data-r="${base + note.r}" style="--r:${note.r}deg">
  ${doodle(note.doodle)}<p>${note.text}</p>${note.sub ? `<small>${note.sub}</small>` : ''}</div>`;

function folderHtml(folder: WallFolder) {
  const loc = locations.find(item => item.key === folder.key)!;
  return `<div class="h03-folder" style="--fr:${folder.r}deg">
    <i class="h03-pin" aria-hidden="true"></i>
    <span class="h03-tab" data-flyer="tab-${folder.key}" data-to="col:${folder.key}" data-r="${folder.r}" style="--r:0deg">${loc.tab}</span>
    <div class="h03-folder-in">${folder.notes.map((note, n) => noteHtml(note, `${folder.key}-${n}`, folder.r)).join('')}</div>
    <p class="h03-folder-who">${loc.who}</p>
  </div>`;
}

// ---------- the panel (crisp) ----------

const toggle = (row: Row, col: Col) => {
  const loc = locations.find(item => item.key === col)!, state = row.cells[col];
  return `<button type="button" class="h03-toggle h03-toggle-${state}" data-name="${row.name}" data-col="${col}" role="switch" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.name} in ${loc.path}: ${stateText[state]}"><i></i></button>`;
};
const rowHtml = (row: Row, main: boolean) => `<tr data-row="${row.name}"${row.fresh ? ' class="is-fresh"' : ''}>
  <th scope="row"${main ? ` data-slot="row:${row.name}"` : ''}><b data-aim>${row.name}</b><small data-caption>${row.note}</small></th>
  ${locations.map(loc => { const slot = `cell:${row.name}:${loc.key}`; return `<td${main && targets.has(slot) ? ` data-slot="${slot}"` : ''}>${toggle(row, loc.key)}</td>`; }).join('')}</tr>`;
const paperBall = '<svg class="h03-ball" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 8.5 7 4l4.5 1L16 4.5l.5 5-2 2.5 1.5 3.5-4.5 1-3.5-1.5L4 16l.5-4z" fill="#e9eef3" stroke="#6b7785" stroke-width="1.1" stroke-linejoin="round"/><path d="m7 4 1.5 5 3-4M8.5 9 4.5 12M8.5 9l3.5 3.5 2.5-.5M12 12.5 11 16.5" fill="none" stroke="#6b7785" stroke-width=".9"/></svg>';

function panelHtml(view: 'main' | 'land') {
  const main = view === 'main';
  return `<div class="h03-win h03-panel" data-view="${view}" role="region" aria-label="${main ? 'Kiln skills panel, sample library' : 'The same Kiln skills panel, with your new skill'}">
    ${chrome('Kiln')}
    <div class="h03-layer">
      <div class="h03-panel-head"><h3 class="h03-win-title">Skills</h3><p class="h03-caption">${main ? 'Sample library. One row per skill, one switch per place your agents load skills from.' : 'The same panel as up top. The skill you just approved is the last row.'}</p></div>
      ${main ? `<div class="h03-infobar" data-slot="junk" data-junk role="status"><span data-aim>${paperBall}</span><span data-junk-text>Found a broken link in <code>~/.agents/skills</code> and an empty folder in <code>.copilot/skills</code>.</span><button type="button" class="h03-btn h03-btn-sm" data-clean>Clean up safely</button></div>` : ''}
      <div class="h03-table-wrap"><table class="h03-table">
        <thead><tr><th scope="col" class="h03-th-skill">Skill</th>${locations.map(loc => `<th scope="col"${main ? ` data-slot="col:${loc.key}"` : ''}><span data-aim><span class="h03-long">${loc.name}</span><span class="h03-short">${loc.short}</span><code>${loc.path}</code></span></th>`).join('')}</tr></thead>
        <tbody data-rows>${rows.map(row => rowHtml(row, main)).join('')}</tbody>
      </table></div>
      <ul class="h03-legend" aria-label="What the switches mean">
        <li><i class="h03-mini h03-mini-on"></i>Installed</li><li><i class="h03-mini h03-mini-off"></i>Off</li>
        <li><i class="h03-mini h03-mini-edited"></i>Edited outside Kiln</li><li><i class="h03-mini h03-mini-found"></i>Found outside your library</li>
      </ul>
      <div class="h03-panel-foot">
        <p class="h03-status" data-status aria-live="polite" tabindex="-1">${main ? 'Merged 3 code-review folders into one row.' : 'Approved. Flip a switch to install it.'}</p>
        ${main ? '<button type="button" class="h03-btn h03-btn-sm" data-dupes>Remove the 2 duplicates</button>' : ''}
        <p class="h03-context"${main ? ' data-slot="context"' : ''}><span data-aim data-context></span></p>
      </div>
      <div class="h03-flyout" data-flyout hidden role="dialog" aria-modal="false" aria-labelledby="h03-flyout-${view}"></div>
    </div>
  </div>`;
}

// ---------- act 2: sources, capture, test ----------

type SourceKey = 'video' | 'post' | 'repo';
type Extra = { kind: 'Technique' | 'Insight' | 'Tool'; text: string; from?: string };
type Step = [kind: 'read' | 'search' | 'think' | 'run', text: string];
type Capture = { collection: string; origin: string; analyzing: string[]; title: string; prompt: string; from: string; extras: Extra[]; skill: string; verdict: 'pass' | 'uncertain'; steps: Step[];
  fix?: { before: string; after: string; step: string; lesson: string } };
const captures: Record<'video' | 'post', Capture> = {
  video: {
    collection: 'I let a seven-year-old test my app', origin: 'YouTube, Dana Builds Things, 18:42. Transcript attached.',
    analyzing: ['Reading the captions, 18:42', 'Pulling out prompts, techniques, insights and tools'],
    title: examples[0].title, prompt: examples[0].prompt, from: '04:12', skill: 'kid-usability-check', verdict: 'uncertain',
    extras: [
      { kind: 'Technique', text: 'Pick a tester who can’t read your docs', from: '06:30' },
      { kind: 'Insight', text: 'You stop seeing the rough edges of an app you use every day', from: '02:05' },
      { kind: 'Tool', text: 'A screen recorder, to replay where they got stuck', from: '11:48' },
    ],
    steps: [['read', 'Read src/screens/Start.tsx'], ['search', 'Searched src/ for "signup", skipped the parent flow'], ['read', 'Opened src/screens/Levels.tsx'], ['think', 'Found two confusing spots, can’t tell which comes first']],
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', step: 'Named the first obstacle and quoted the button: "Continue?"', lesson: 'Asking for the on-screen text made it commit to one obstacle instead of hedging.' },
  },
  post: {
    collection: 'Post by @ninaships', origin: 'Post on X, saved with its link.',
    analyzing: ['Reading the post', 'Pulling out prompts, techniques, insights and tools'],
    title: examples[1].title, prompt: examples[1].prompt, from: 'the post', skill: 'instruction-trace', verdict: 'pass',
    extras: [
      { kind: 'Technique', text: 'Ask why it happened before you ask for a fix' },
      { kind: 'Insight', text: 'Stale guidance outlives the code it described' },
      { kind: 'Tool', text: 'git log on AGENTS.md, to date the stale line' },
    ],
    steps: [['read', 'Read AGENTS.md and CLAUDE.md'], ['search', 'Searched for "run every test"'], ['think', 'Traced it to an outdated line and proposed a one-line change']],
  },
};

const xMark = '<svg class="h03-x-mark" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M3 3l14 14M17 3 3 17" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg>';
const ghIcon = { repo: 'M5 3.5h9.5v11H6.2A1.2 1.2 0 0 0 5 15.7zM5 15.7a1.2 1.2 0 0 0 1.2 1.2h8.3M7.5 17v1.5l1-.7 1 .7V17', dir: 'M2.5 5.5h5l1.5 1.5h8.5v8.5h-15z', file: 'M5 2.5h6.5l3.5 3.5v11.5H5zM11.5 2.5V6h3.5' };

function sourcesHtml() {
  return `<div class="h03-sources" data-sources>
    <div class="h03-cork h03-cork-strip" aria-hidden="true"></div>
    <article class="h03-print h03-print-yt" data-source="video" style="--r:-2.2deg" aria-label="Printout of a YouTube video: I let a seven-year-old test my app, by Dana Builds Things, 18 minutes 42 seconds">
      <i class="h03-tape" aria-hidden="true"></i>
      <div class="h03-yt-thumb" aria-hidden="true"><span class="h03-yt-words">I let a<br>7-year-old<br>test my app</span><span class="h03-yt-face"></span><span class="h03-yt-play"></span><span class="h03-yt-time">18:42</span><span class="h03-yt-bar"><i></i></span></div>
      <div class="h03-yt-meta"><span class="h03-avatar h03-avatar-yt" aria-hidden="true">DB</span><div><b>I let a seven-year-old test my app. It went badly.</b><small>Dana Builds Things</small></div></div>
      <div class="h03-print-foot"><span class="h03-used" aria-hidden="true">in Kiln</span><button type="button" class="h03-btn h03-btn-sm" data-add="video">Add to Kiln</button></div>
    </article>
    <article class="h03-print h03-print-x" data-source="post" style="--r:1.8deg" aria-label="Printout of a post on X by Nina Park">
      <i class="h03-pushpin" aria-hidden="true"></i>
      <header><span class="h03-avatar h03-avatar-x" aria-hidden="true">NP</span><div><b>Nina Park</b><small>@ninaships</small></div>${xMark}</header>
      <p>When the agent does exactly what you didn’t mean, don’t just fix it. Ask it which instruction made it do that. Usually it’s a stale line in AGENTS.md.</p>
      <div class="h03-x-actions" aria-hidden="true">${['M4 5h12v8H9l-4 3v-3H4z', 'M5 8l2.5-2.5L10 8M7.5 5.5V13h6M15 12l-2.5 2.5L10 12M12.5 14.5V7h-6', 'M10 16s-6-3.6-6-8a3.3 3.3 0 0 1 6-1.8A3.3 3.3 0 0 1 16 8c0 4.4-6 8-6 8z', 'M10 3v10M6 7l4-4 4 4M4 13v4h12v-4'].map(d => svgIcon(d, 16)).join('')}</div>
      <div class="h03-print-foot"><span class="h03-used" aria-hidden="true">in Kiln</span><button type="button" class="h03-btn h03-btn-sm" data-add="post">Add to Kiln</button></div>
    </article>
    <article class="h03-print h03-print-gh" data-source="repo" style="--r:-1.2deg" aria-label="Printout of the GitHub repository mattpocock/skills">
      <i class="h03-tape" aria-hidden="true"></i>
      <header>${svgIcon(ghIcon.repo, 16)}<span><b>mattpocock</b> / <b>skills</b></span><span class="h03-gh-public">Public</span></header>
      <div class="h03-gh-bar"><span class="h03-gh-branch">main</span><span class="h03-gh-code">Code</span></div>
      <ul class="h03-gh-files"><li>${svgIcon(ghIcon.dir, 15)}skills</li><li>${svgIcon(ghIcon.file, 15)}README.md</li><li>${svgIcon(ghIcon.file, 15)}LICENSE</li></ul>
      <div class="h03-print-foot"><span class="h03-used" aria-hidden="true">in Kiln</span><button type="button" class="h03-btn h03-btn-sm" data-add="repo">Add to Kiln</button></div>
    </article>
  </div>`;
}

const steps3 = ['Add a source', 'Test the prompt', 'Approve it'];
function pipeHtml() {
  return `<div class="h03-win h03-pipe" role="region" aria-label="Kiln capture and test, sample">
    ${chrome('Kiln')}
    <ol class="h03-stepper" data-stepper aria-label="Progress">${steps3.map((step, n) => `<li${n ? '' : ' class="is-on" aria-current="step"'}><span>${n + 1}</span>${step}</li>`).join('')}</ol>
    <div class="h03-pipe-body">
      <section class="h03-pane" aria-labelledby="h03-cap-title">
        <header class="h03-pane-head"><h3 id="h03-cap-title">Capture</h3><span class="h03-kbd" title="Capture from anywhere"><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>Space</kbd></span></header>
        <div class="h03-zone" data-zone="capture" aria-live="polite"></div>
      </section>
      <section class="h03-pane h03-pane-test" aria-labelledby="h03-test-title">
        <header class="h03-pane-head"><h3 id="h03-test-title">Test</h3>
          <label class="h03-select"><span>Project</span><select data-repo><option value="my-game">~/code/my-game</option><option value="example">An isolated example</option></select></label>
          <span class="h03-badge">Read-only</span></header>
        <div class="h03-zone" data-zone="test" aria-live="polite"></div>
      </section>
    </div>
  </div>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had.';
  root.innerHTML = `<div class="h03">
    <a class="skip" href="#h03-main">Skip to content</a>
    <header class="h03-top"><a class="h03-brand" href="#h03-main">${appIcon(26)}<span>Kiln</span></a>
      <nav aria-label="Main navigation"><a href="#h03-folders">The folders</a><a href="#h03-new">New skills</a><a href="#h03-get">Download</a></nav></header>
    <main id="h03-main">
      <section class="h03-hero" aria-labelledby="h03-title">
        <h1 id="h03-title">My agents were loading skills I forgot I had.</h1>
        <div class="h03-hero-side">
          <p>Kiln is a Windows app for Codex, Claude Code and Copilot. It puts every skill your agents can see on one panel, and it tests the prompts you save on your own repo before they become skills.</p>
          <div class="h03-actions">
            <a class="h03-btn h03-btn-big h03-btn-accent" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
            <a class="h03-btn h03-btn-big h03-btn-subtle" href="#h03-folders" data-watch>Watch them tidy up</a>
          </div>
          <p class="h03-fine">Free and MIT licensed. The release is in a private GitHub repository, so sign in with an account that has access.</p>
        </div>
      </section>

      <section class="h03-act h03-act1" id="h03-folders" aria-labelledby="h03-p1-title">
        <div class="h03-act-head">
          <h2 id="h03-p1-title">They were in five folders. Some of them twice.</h2>
          <div><p>Claude Code, Codex and Copilot each load skills from their own folders, and every project brings one more. Kiln reads all of them, leaves the files where they are, and gives each skill one row with a switch per location.</p>
          <button type="button" class="h03-btn h03-btn-big" data-tidy aria-controls="h03-stage">Tidy this up</button></div>
        </div>
        <div class="h03-stage" id="h03-stage" data-stage data-state="mess">
          <div class="h03-cork" aria-hidden="true"></div>
          <div class="h03-folders" role="img" aria-label="A cork board with five skill folders pinned to it: ~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills and my-game/.github/skills. code-review is in four of them, twice in one; research and writing-for-agents are in two each; there is a broken link, an empty folder, a pr-summary nobody remembers, and a note asking which ones Claude even loads.">
            ${wall.map(folderHtml).join('')}
            <div class="h03-loose">${noteHtml(loose, 'loose', 0, ' h03-note-loose')}</div>
          </div>
          ${panelHtml('main')}
          <div class="h03-flight" data-flight aria-hidden="true"></div>
          <p class="visually-hidden" data-stage-live aria-live="polite"></p>
        </div>
      </section>

      <section class="h03-act h03-act2" id="h03-new" aria-labelledby="h03-p2-title">
        <div class="h03-act-head">
          <h2 id="h03-p2-title">And how do I add new skills to this?</h2>
          <p>I’d find a great prompt in a video, save it for later, and never try it. Now it goes into Kiln, gets tested on my repo that afternoon, and only the ones that work become skills. Drag a printout into Kiln to try it.</p>
        </div>
        ${sourcesHtml()}
        ${pipeHtml()}
        <div class="h03-landing" data-landing hidden>${panelHtml('land')}<p class="h03-landing-note"><a href="#h03-stage" data-see-top>See it on the panel up top</a></p></div>
      </section>

      <section class="h03-get" id="h03-get" aria-labelledby="h03-get-title">
        <div class="h03-get-note h03-t-y" aria-hidden="true"><p>take the notes down</p><small>and test one saved prompt tonight</small></div>
        <div class="h03-get-copy">
          <h2 id="h03-get-title">Point it at your own folders.</h2>
          <ul class="h03-facts">
            <li><b>No API key.</b> Runs through the Codex or Claude Code you’re signed into. Your plan’s usage limits still apply.</li>
            <li><b>Tests are read-only.</b> Nothing in your code changes. The agent’s verdict is kept apart from yours.</li>
            <li><b>Approvals are yours.</b> Each approved revision is published to your own Kiln repository on GitHub.</li>
            <li><b>Windows app and CLI.</b> MIT licensed. The CLI returns JSON, so your agents can read your library too.</li>
          </ul>
          <a class="h03-btn h03-btn-big h03-btn-accent" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
          <p class="h03-fine">Works with Codex, Claude Code and Copilot. The release lives in a private GitHub repository, so sign in with an account that has access. The build is unsigned, so Windows may ask before it runs.</p>
        </div>
      </section>
    </main>
  </div>`;
  const panel = bindPanels(root);
  const stage = bindStage(root, panel);
  bindAct2(root, panel, stage);
}

// ---------- behaviour: the panels (main and landing share one library) ----------

type Panels = { add(row: Row): void; closeFlyouts(): void; resetJunk(): void };
function bindPanels(root: HTMLElement): Panels {
  const wins = [...root.querySelectorAll<HTMLElement>('[data-view]')];
  const count = () => rows.reduce((sum, row) => sum + Object.values(row.cells).filter(cell => cell === 'on' || cell === 'edited').length, 0);
  const updateContext = () => wins.forEach(win => {
    win.querySelector<HTMLElement>('[data-context]')!.textContent = `Every switched-on skill puts its description in that agent’s context on every turn, used or not. On right now: ${count()} copies. Switch off what you don’t use. (Kiln doesn’t measure tokens per skill.)`;
  });
  const say = (win: HTMLElement, text: string) => { const status = win.querySelector<HTMLElement>('[data-status]')!; status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const sync = (row: Row) => wins.forEach(win => {
    const body = win.querySelector<HTMLElement>('[data-rows]')!, main = win.dataset.view === 'main';
    let tr = body.querySelector<HTMLElement>(`[data-row="${row.name}"]`);
    if (!tr) {
      body.insertAdjacentHTML('beforeend', rowHtml(row, main));
      tr = body.lastElementChild as HTMLElement;
      tr.classList.add('is-in'); tr.querySelectorAll('[data-slot]').forEach(slot => slot.classList.add('is-in'));
      return;
    }
    locations.forEach((loc, c) => { (tr!.children[c + 1] as HTMLElement).innerHTML = toggle(row, loc.key); });
    tr.querySelector('[data-caption]')!.textContent = row.note;
  });
  const refresh = (row: Row) => { sync(row); updateContext(); };

  wins.forEach(win => {
    const body = win.querySelector<HTMLElement>('[data-rows]')!, flyout = win.querySelector<HTMLElement>('[data-flyout]')!;
    const view = win.dataset.view!;
    let returnTo: HTMLElement | null = null;
    const focusCell = (name: string, col: string) => body.querySelector<HTMLElement>(`[data-name="${name}"][data-col="${col}"]`)?.focus();
    const open = (html: string, from: HTMLElement, name: string, col: Col) => { flyout.innerHTML = html; flyout.hidden = false; flyout.dataset.name = name; flyout.dataset.col = col; returnTo = from; flyout.querySelector<HTMLElement>('button')?.focus(); };
    const close = () => { if (flyout.hidden) return; flyout.hidden = true; returnTo?.focus(); returnTo = null; };
    (win as HTMLElement & { closeFlyout?: () => void }).closeFlyout = close;
    body.addEventListener('click', event => {
      const button = (event.target as Element).closest<HTMLButtonElement>('.h03-toggle');
      if (!button) return;
      const row = rows.find(item => item.name === button.dataset.name)!, col = button.dataset.col as Col, loc = locations.find(item => item.key === col)!, state = row.cells[col];
      if (state === 'edited') {
        say(win, 'This copy was changed outside Kiln. Compare it first.');
        open(`<h3 id="h03-flyout-${view}">${loc.path}/${row.name} differs from approved rev 3</h3>
          <div class="h03-diff"><p class="h03-del">- Review standards and the specification separately.</p><p class="h03-add">+ Review the specification only. Skip style.</p></div>
          <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-fly="replace">Replace with rev 3</button><button type="button" class="h03-btn" data-fly="draft">Keep it as draft rev 4</button><button type="button" class="h03-btn h03-btn-subtle" data-fly="close">Cancel</button></div>`, button, row.name, col);
        return;
      }
      if (state === 'found') {
        if (row.imported) { say(win, `${row.name} is a draft in your library now. Approve it to manage this copy.`); return; }
        open(`<h3 id="h03-flyout-${view}">${row.name} isn’t in your library</h3><p>Import it as a draft. The folder in <code>${loc.path}</code> stays exactly where it is.</p>
          <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-fly="import">Import as draft</button><button type="button" class="h03-btn h03-btn-subtle" data-fly="close">Not now</button></div>`, button, row.name, col);
        return;
      }
      row.cells[col] = state === 'on' ? 'off' : 'on';
      say(win, state === 'on' ? `Removed ${row.name} from ${loc.path}. It stays in your library, history and all.`
        : `Installed the approved ${row.name} into ${loc.path}. A new ${loc.key === 'project' ? 'session in my-game' : `${loc.who} session`} picks it up.`);
      row.fresh && win.querySelector(`[data-row="${row.name}"]`)?.classList.remove('is-pulse');
      refresh(row); focusCell(row.name, col);
    });
    flyout.addEventListener('click', event => {
      const action = (event.target as Element).closest<HTMLElement>('[data-fly]')?.dataset.fly;
      if (!action) return;
      const row = rows.find(item => item.name === flyout.dataset.name)!, col = flyout.dataset.col as Col;
      if (action === 'replace') { row.cells[col] = 'on'; say(win, 'Moved the hand-edited copy to a private backup and installed rev 3.'); }
      if (action === 'draft') { row.cells[col] = 'on'; row.note = 'Approved rev 3, draft rev 4'; say(win, 'Saved the edit as draft rev 4. Rev 3 stays installed until you approve the draft.'); }
      if (action === 'import') { row.imported = true; row.note = 'Draft, imported'; say(win, `Imported ${row.name} as a draft. The original folder hasn’t moved.`); }
      if (action !== 'close') { refresh(row); returnTo = body.querySelector<HTMLElement>(`[data-name="${row.name}"][data-col="${col}"]`); }
      close();
    });
    flyout.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); close(); } });
  });

  const main = wins.find(win => win.dataset.view === 'main')!;
  const dupes = main.querySelector<HTMLButtonElement>('[data-dupes]')!;
  dupes.addEventListener('click', () => {
    const row = rows[0];
    row.note = row.note.replace('3 folders, 1 skill', 'Duplicates removed');
    refresh(row);
    say(main, 'Moved code-review (1) and code-review-FINAL to private backups. One code-review left.');
    dupes.hidden = true; main.querySelector<HTMLElement>('[data-status]')!.focus();
  });
  const junk = main.querySelector<HTMLElement>('[data-junk]')!, clean = junk.querySelector<HTMLButtonElement>('[data-clean]')!;
  clean.addEventListener('click', () => {
    junk.classList.add('is-clean');
    junk.querySelector('[data-junk-text]')!.textContent = 'Cleaned up the broken link and the empty folder. Nothing else was touched.';
    clean.hidden = true;
    root.querySelectorAll<HTMLElement>('.h03-folders [data-to="junk"]').forEach(note => note.classList.add('is-gone'));
    say(main, 'Cleaned up 1 broken link and 1 empty folder.');
  });
  updateContext();
  return {
    add(row) { rows.push(row); refresh(row); },
    closeFlyouts: () => wins.forEach(win => (win as HTMLElement & { closeFlyout?: () => void }).closeFlyout?.()),
    resetJunk() {
      junk.classList.remove('is-clean'); clean.hidden = false;
      junk.querySelector('[data-junk-text]')!.innerHTML = 'Found a broken link in <code>~/.agents/skills</code> and an empty folder in <code>.copilot/skills</code>.';
      root.querySelectorAll<HTMLElement>('.h03-folders [data-to="junk"]').forEach(note => note.classList.remove('is-gone'));
    },
  };
}

// ---------- behaviour: the stage (FLIP tidy) ----------

type Stage = { tidyNow(): void };
function bindStage(root: HTMLElement, panels: Panels): Stage {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const win = stage.querySelector<HTMLElement>('[data-view="main"]')!;
  const flight = stage.querySelector<HTMLElement>('[data-flight]')!;
  const button = root.querySelector<HTMLButtonElement>('[data-tidy]')!;
  const live = stage.querySelector<HTMLElement>('[data-stage-live]')!;
  // Tabs first (folders become columns), then the notes folder by folder, then the loose question.
  const flyers = [...stage.querySelectorAll<HTMLElement>('.h03-folders .h03-tab'), ...stage.querySelectorAll<HTMLElement>('.h03-folders .h03-note')];
  const slots = () => [...win.querySelectorAll<HTMLElement>('[data-slot]')];
  let busy = false, touched = false;
  const setState = (state: 'mess' | 'tidying' | 'tidy' | 'messing') => {
    stage.dataset.state = state;
    win.inert = state === 'mess';
    button.textContent = state === 'tidy' || state === 'tidying' ? 'Put the notes back' : 'Tidy this up';
    button.disabled = state === 'tidying' || state === 'messing';
  };
  const slotFor = (el: HTMLElement) => win.querySelector<HTMLElement>(`[data-slot="${el.dataset.to}"]`)!;
  const aimFor = (slot: HTMLElement) => slot.querySelector<HTMLElement>('[data-aim]') ?? slot;
  const land = (slot: HTMLElement, tint: string) => {
    slot.style.setProperty('--land', tint || '#fdf28b');
    const tr = slot.closest('tbody tr');
    if (tr) { tr.classList.add('is-in'); tr.querySelector('th')?.classList.add('is-in'); }
    slot.classList.remove('is-landed'); void slot.offsetWidth;
    slot.classList.add('is-in', 'is-landed');
  };
  const instant = (tidy: boolean) => {
    flight.replaceChildren();
    flyers.forEach(el => el.classList.toggle('is-read', tidy));
    slots().forEach(slot => { slot.classList.toggle('is-in', tidy); slot.closest('tr')?.classList.toggle('is-in', tidy); });
    setState(tidy ? 'tidy' : 'mess');
  };
  // FLIP: First is the note in its folder, Last is its row, column header or cell in the panel. A clone is lifted into a
  // flight layer (so it can pass over the window), inverted with the measured delta and played; the original stays behind
  // faded, because the file really does stay in its folder. Junk crumples into a paper ball and lands in the cleanup bar.
  const plan = (el: HTMLElement) => {
    const box = stage.getBoundingClientRect(), rect = el.getBoundingClientRect(), W = el.offsetWidth, H = el.offsetHeight;
    const cx = rect.left + rect.width / 2 - box.left, cy = rect.top + rect.height / 2 - box.top, rotate = Number(el.dataset.r) || 0;
    const aim = aimFor(slotFor(el)).getBoundingClientRect();
    const dx = aim.left - box.left + aim.width / 2 - cx, dy = aim.top - box.top + aim.height / 2 - cy;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.removeAttribute('data-flyer'); clone.classList.remove('is-read'); clone.classList.add('is-clone');
    Object.assign(clone.style, { left: `${cx - W / 2}px`, top: `${cy - H / 2}px`, width: `${W}px`, height: `${H}px` });
    clone.style.setProperty('--r', `${rotate}deg`);
    if (el.dataset.to === 'junk') {
      const flat = 'polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)';
      const crushed = 'polygon(10% 14%, 46% 6%, 90% 12%, 82% 48%, 94% 88%, 50% 80%, 8% 92%, 18% 52%)';
      const ball = 'polygon(26% 22%, 50% 34%, 76% 18%, 68% 50%, 82% 80%, 50% 68%, 20% 82%, 32% 50%)';
      const end = Math.max(.1, aim.width / W * 1.6);
      return { clone, keyframes: [
        { transform: `translate(0px, 0px) rotate(${rotate}deg) scale(1)`, clipPath: flat, filter: 'brightness(1)' },
        { transform: `translate(0px, -6px) rotate(${rotate + 14}deg) scale(.72)`, clipPath: crushed, filter: 'brightness(.93)', offset: .22 },
        { transform: `translate(0px, 0px) rotate(${rotate + 70}deg) scale(.38)`, clipPath: ball, filter: 'brightness(.86)', offset: .45 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate + 320}deg) scale(${end})`, clipPath: ball, filter: 'brightness(.86)', opacity: 1, offset: .92 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate + 340}deg) scale(${end})`, clipPath: ball, opacity: 0 },
      ], duration: 1250, easing: 'cubic-bezier(.45,.05,.4,1)' };
    }
    const sx = aim.width / W, sy = aim.height / H, mid = Math.min(Math.max(sy * 2.2, .32), .9);
    return { clone, keyframes: [
      { transform: `translate(0px, 0px) rotate(${rotate}deg) scale(1)`, opacity: 1 },
      { transform: `translate(0px, -12px) rotate(${rotate * .4}deg) scale(1.09)`, opacity: 1, offset: .15 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${mid})`, opacity: 1, offset: .78 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${sx}, ${sy})`, opacity: 0 },
    ], duration: 860, easing: 'cubic-bezier(.55,0,.2,1)' };
  };
  const tintOf = (el: HTMLElement) => getComputedStyle(el).getPropertyValue('--paper').trim();
  async function tidy() {
    if (busy) return;
    touched = true;
    if (reduced()) { instant(true); live.textContent = 'Tidied into the Kiln panel.'; return; }
    busy = true;
    slots().forEach(slot => { slot.classList.remove('is-in'); slot.closest('tr')?.classList.remove('is-in'); });
    setState('tidying');
    await wait(560);
    const runs = flyers.map((el, n) => {
      const { clone, keyframes, duration, easing } = plan(el), slot = slotFor(el), tint = tintOf(el);
      flight.append(clone);
      const delay = n * 70;
      const animation = clone.animate(keyframes, { duration, delay, easing, fill: 'both' });
      setTimeout(() => el.classList.add('is-read'), delay);
      return animation.finished.then(() => { clone.remove(); land(slot, tint); });
    });
    await Promise.all(runs);
    slots().forEach(slot => { slot.classList.add('is-in'); slot.closest('tr')?.classList.add('is-in'); });
    setState('tidy'); busy = false;
    live.textContent = 'Tidied: five folders became five columns, fourteen notes became five rows, and the junk went to the cleanup bar.';
  }
  async function mess() {
    if (busy) return;
    touched = true;
    panels.closeFlyouts();
    panels.resetJunk();
    if (reduced()) { instant(false); live.textContent = 'The notes are back in their folders.'; return; }
    busy = true;
    setState('messing');
    const order = [...flyers].reverse();
    const runs = order.map((el, n) => {
      const { clone, keyframes, duration, easing } = plan(el), slot = slotFor(el);
      flight.append(clone);
      const animation = clone.animate(keyframes, { duration: duration * .75, delay: n * 40, easing, fill: 'both', direction: 'reverse' });
      setTimeout(() => { slot.classList.remove('is-in'); }, n * 40);
      return animation.finished.then(() => { el.classList.remove('is-read'); clone.remove(); });
    });
    await Promise.all(runs);
    instant(false); busy = false;
    live.textContent = 'The notes are back in their folders.';
  }
  button.addEventListener('click', () => (stage.dataset.state === 'tidy' ? mess() : tidy()));
  root.querySelector('[data-watch]')!.addEventListener('click', event => {
    event.preventDefault();
    touched = true;
    stage.closest('section')!.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { if (stage.dataset.state === 'mess') tidy(); }, reduced() ? 0 : 750);
  });
  setState('mess');
  if (reduced()) instant(true);
  else if ('IntersectionObserver' in window) {
    // Give the visitor a moment with the mess before it tidies itself.
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      document.fonts.ready.then(() => setTimeout(() => { if (!touched) tidy(); }, 1100));
    }, { threshold: .78 });
    observer.observe(stage);
  }
  return { tidyNow: () => { if (stage.dataset.state === 'mess') { touched = true; instant(true); } } };
}

// ---------- behaviour: drag helper (pointer events, mouse and touch) ----------

type DragOpts = { el: HTMLElement; zone: () => HTMLElement | null; onDrop: () => void; onTap?: () => void; container: HTMLElement };
function hits(zone: HTMLElement | null, x: number, y: number) {
  if (!zone) return false;
  const r = zone.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}
/** Flies a copy of `from` into the middle of `to`, the same flight a real drop ends with. */
async function flyInto(from: HTMLElement, to: HTMLElement, container: HTMLElement, ghost?: HTMLElement) {
  to.classList.remove('is-gulp');
  if (reduced()) { ghost?.remove(); to.classList.add('is-gulp'); return; }
  if (!ghost) ghost = makeGhost(from, container);
  const now = ghost.getBoundingClientRect(), zone = to.getBoundingClientRect();
  const current = ghost.style.transform || 'none';
  const offset = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(current);
  const ox = offset ? Number(offset[1]) : 0, oy = offset ? Number(offset[2]) : 0;
  const tx = ox + zone.left + zone.width / 2 - (now.left + now.width / 2), ty = oy + Math.min(zone.top + 90, zone.top + zone.height / 2) - (now.top + now.height / 2);
  await ghost.animate([{ transform: current }, { transform: `translate(${tx}px, ${ty}px) rotate(0deg) scale(.22)`, opacity: .35 }], { duration: 480, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'forwards' }).finished;
  ghost.remove();
  void to.offsetWidth; to.classList.add('is-gulp');
}
function makeGhost(el: HTMLElement, container: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const ghost = el.cloneNode(true) as HTMLElement;
  ghost.querySelectorAll('button, [tabindex]').forEach(node => node.setAttribute('tabindex', '-1'));
  ghost.removeAttribute('id'); ghost.setAttribute('aria-hidden', 'true');
  ghost.classList.add('h03-ghost');
  Object.assign(ghost.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${el.offsetWidth}px`, height: `${el.offsetHeight}px` });
  // Start from the element's own centre so the rotated bounding box doesn't shift it.
  ghost.style.left = `${rect.left + rect.width / 2 - el.offsetWidth / 2}px`;
  ghost.style.top = `${rect.top + rect.height / 2 - el.offsetHeight / 2}px`;
  ghost.style.transform = `translate(0px, 0px) rotate(${getComputedStyle(el).getPropertyValue('--r') || '0deg'})`;
  container.append(ghost);
  return ghost;
}
function draggable({ el, zone, onDrop, onTap, container }: DragOpts) {
  el.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if ((event.target as Element).closest('button, a, select, input')) return;
    if (el.classList.contains('is-locked')) return;
    const startX = event.clientX, startY = event.clientY;
    let x = startX, y = startY, ghost: HTMLElement | null = null, frame = 0, over = false;
    el.setPointerCapture(event.pointerId);
    const place = () => {
      if (!ghost) return;
      const dx = x - startX, dy = y - startY;
      ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-7, Math.min(7, dx / 40))}deg) scale(1.04)`;
      const target = zone(), now = hits(target, x, y);
      if (now !== over) { over = now; target?.classList.toggle('is-over', now); }
    };
    const autoScroll = () => {
      if (!ghost) return;
      const edge = Math.min(90, innerHeight * .12);
      const speed = y > innerHeight - edge ? (y - (innerHeight - edge)) / edge * 16 : y < edge ? -(edge - y) / edge * 16 : 0;
      if (speed) { scrollBy(0, speed); place(); }
      frame = requestAnimationFrame(autoScroll);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!ghost) {
        if (Math.hypot(x - startX, y - startY) < 6) return;
        ghost = makeGhost(el, container);
        ghost.classList.add('is-dragging');
        el.classList.add('is-lifted');
        zone()?.classList.add('is-ready');
        frame = requestAnimationFrame(autoScroll);
      }
      place();
    };
    const up = (e: PointerEvent) => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      cancelAnimationFrame(frame);
      const target = zone();
      target?.classList.remove('is-over', 'is-ready');
      if (!ghost) { if (e.type === 'pointerup') onTap?.(); return; }
      const g = ghost; ghost = null;
      g.classList.remove('is-dragging');
      if (e.type === 'pointerup' && target && hits(target, e.clientX, e.clientY)) {
        flyInto(el, target, container, g).then(() => { el.classList.remove('is-lifted'); onDrop(); });
        return;
      }
      g.animate([{ transform: g.style.transform }, { transform: `translate(0px, 0px) rotate(${getComputedStyle(el).getPropertyValue('--r') || '0deg'})` }], { duration: reduced() ? 0 : 380, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'forwards' })
        .finished.then(() => { g.remove(); el.classList.remove('is-lifted'); });
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
}

// ---------- behaviour: act 2 ----------

const stepIcon: Record<Step[0], string> = {
  read: 'M4 3.5h8l3 3v10H4zM12 3.5v3h3', search: 'M8.5 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 12l4.5 4.5',
  think: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4', run: 'M3.5 5.5l4 4-4 4M9.5 14.5h7',
};
const kindIcon: Record<Extra['kind'], string> = {
  Technique: 'M4 15.5 12.5 7M11 4.5l4.5 4.5M3.5 16.5l1-3 2 2z', Insight: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4', Tool: 'M12.5 3.5a3.5 3.5 0 0 0-3.3 4.7L3.8 13.6a1.4 1.4 0 0 0 2 2l5.4-5.4a3.5 3.5 0 0 0 4.6-4.4l-2 2-2-.5-.5-2z',
};
const star = '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M10 2.5 12.2 7l4.8.6-3.5 3.3.9 4.8L10 13.4l-4.4 2.3.9-4.8L3 7.6 7.8 7z" fill="currentColor"/></svg>';
const playIcon = '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M3 2v8l7-4z" fill="currentColor"/></svg>';

function bindAct2(root: HTMLElement, panels: Panels, stage: Stage) {
  const container = root.querySelector<HTMLElement>('.h03')!;
  const capture = root.querySelector<HTMLElement>('[data-zone="capture"]')!;
  const test = root.querySelector<HTMLElement>('[data-zone="test"]')!;
  const stepper = root.querySelector<HTMLElement>('[data-stepper]')!;
  const repo = root.querySelector<HTMLSelectElement>('[data-repo]')!;
  const landing = root.querySelector<HTMLElement>('[data-landing]')!;
  let mode: 'analyze' | 'save' = 'analyze', current: 'video' | 'post' | null = null, token = 0, capToken = 0, running = false;
  const repoName = () => (repo.value === 'my-game' ? '~/code/my-game' : 'an isolated example');
  const setStep = (n: number) => [...stepper.children].forEach((li, i) => {
    li.classList.toggle('is-on', i === n); li.classList.toggle('is-done', i < n);
    if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });

  // capture
  const captureIdle = () => {
    capture.innerHTML = `<div class="h03-drop" data-drop>
      <svg viewBox="0 0 48 48" width="38" height="38" aria-hidden="true"><path d="M24 8v22M15 21l9 9 9-9M9 34v6h30v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <p><b>Drop a video, post, repo or screenshot</b></p>
      <div class="h03-seg" role="group" aria-label="What Kiln does with it"><button type="button" aria-pressed="${mode === 'analyze'}" data-mode="analyze">Analyze and add</button><button type="button" aria-pressed="${mode === 'save'}" data-mode="save">Save only</button></div>
      <p class="h03-caption">${mode === 'analyze' ? 'Kiln turns it into prompts, techniques, insights and tools, in a collection linked to the source.' : 'Kiln keeps the source as it is and calls no model. Analyze it later.'}</p>
    </div>`;
  };
  capture.addEventListener('click', event => {
    const target = event.target as Element;
    const modeButton = target.closest<HTMLElement>('[data-mode]');
    if (modeButton) { mode = modeButton.dataset.mode as typeof mode; captureIdle(); capture.querySelector<HTMLElement>(`[data-mode="${mode}"]`)?.focus(); return; }
    const analyze = target.closest<HTMLElement>('[data-analyze]');
    if (analyze) { analyzeSource(analyze.dataset.analyze as 'video' | 'post'); return; }
    if (target.closest('[data-test-it]')) { const card = capture.querySelector<HTMLElement>('[data-prompt]'); if (card) sendPrompt(card); }
    const next = target.closest<HTMLElement>('[data-next-source]');
    if (next) root.querySelector<HTMLElement>(`[data-add="${next.dataset.nextSource}"]`)?.focus();
  });

  const printouts = [...root.querySelectorAll<HTMLElement>('[data-source]')];
  const addSource = async (key: SourceKey, from: HTMLElement, dropped: boolean) => {
    if (running) return;
    if (!dropped) await flyInto(from, capture, container);
    from.classList.add('is-used');
    if (innerWidth < 900) capture.closest('.h03-pane')!.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    capToken++;
    if (key === 'repo') { current = null; showRepo(); resetTest(); return; }
    if (mode === 'save') { current = null; showSaved(key); resetTest(); return; }
    analyzeSource(key);
  };
  printouts.forEach(print => {
    const key = print.dataset.source as SourceKey;
    draggable({ el: print, container, zone: () => (running ? null : capture), onDrop: () => addSource(key, print, true), onTap: () => addSource(key, print, false) });
    print.querySelector('[data-add]')!.addEventListener('click', () => addSource(key, print, false));
  });

  const showRepo = () => {
    setStep(0);
    capture.innerHTML = `<div class="h03-coll h03-coll-repo">
      <p class="h03-coll-head"><b>Imported mattpocock/skills as drafts</b><span class="h03-caption">GitHub repository. The repo is untouched.</span></p>
      <ul class="h03-importlist"><li>${svgIcon(ghIcon.dir, 16)}<div><b>skills/</b><small>Each skill folder is now a draft in a collection named after the repo.</small></div></li>
        <li>${svgIcon('M4 10.5 8 14.5 16 5.5', 16)}<div><b>Nothing installed</b><small>A draft reaches your agents only after you approve it.</small></div></li></ul>
      <p class="h03-caption">Review them in your library when you have a minute. For a prompt to try right now, add the video or the post.</p>
      <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-sm" data-next-source="video">Go to the video</button></div>
    </div>`;
  };
  const showSaved = (key: SourceKey) => {
    setStep(0);
    const name = key === 'video' ? 'I let a seven-year-old test my app' : 'Post by @ninaships';
    capture.innerHTML = `<div class="h03-coll">
      <p class="h03-coll-head"><b>Saved: ${name}</b><span class="h03-caption">Source note. No model was called.</span></p>
      <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent h03-btn-sm" data-analyze="${key}">Analyze and add</button></div>
    </div>`;
  };
  async function analyzeSource(key: 'video' | 'post') {
    const cap = captures[key], mine = ++capToken;
    current = null; resetTest(); setStep(0);
    capture.innerHTML = `<div class="h03-analyzing"><p class="h03-running"><span class="h03-ring" aria-hidden="true"></span><span>Analyzing with Claude Code</span></p><ol class="h03-steps" data-an></ol></div>`;
    const list = capture.querySelector<HTMLElement>('[data-an]')!;
    for (const line of cap.analyzing) { await wait(520); if (mine !== capToken) return; list.insertAdjacentHTML('beforeend', `<li>${svgIcon(stepIcon.read, 16)}<span>${line}</span></li>`); }
    await wait(480); if (mine !== capToken) return;
    current = key;
    capture.innerHTML = `<div class="h03-coll">
      <p class="h03-coll-head"><b>New collection: ${cap.collection}</b><span class="h03-caption">${cap.origin}</span></p>
      <article class="h03-promptcard" data-prompt aria-label="Prompt: ${cap.title}. Drag it into Test, or use the Test button.">
        <header><span class="h03-kind h03-kind-prompt">${star}Prompt</span><span class="h03-ts">${key === 'video' ? playIcon : ''}from ${cap.from}</span><span class="h03-grip" aria-hidden="true"></span></header>
        <h4>${cap.title}</h4>
        <p>${cap.prompt}</p>
        <footer><button type="button" class="h03-btn h03-btn-sm h03-btn-accent" data-test-it>Test it</button><span class="h03-caption">or drag it into Test</span></footer>
      </article>
      <ul class="h03-extras">${cap.extras.map(extra => `<li class="h03-extra"><span class="h03-kind">${svgIcon(kindIcon[extra.kind], 14)}${extra.kind}</span><p>${extra.text}</p>${extra.from ? `<span class="h03-ts">${playIcon}${extra.from}</span>` : ''}</li>`).join('')}</ul>
    </div>`;
    const card = capture.querySelector<HTMLElement>('[data-prompt]')!;
    draggable({ el: card, container, zone: () => (running ? null : test), onDrop: () => startTest(), onTap: undefined });
    resetTest();
    setStep(1);
  }

  // test
  const resetTest = () => {
    token++; running = false;
    test.classList.toggle('is-waiting', !current);
    test.innerHTML = current
      ? `<div class="h03-drop h03-drop-test" data-drop><svg viewBox="0 0 48 48" width="38" height="38" aria-hidden="true"><path d="M18 6h12M20 6v12L9 36a3 3 0 0 0 2.6 4.5h24.8A3 3 0 0 0 39 36L28 18V6M14 29h20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p><b>Drop the prompt here</b></p><p class="h03-caption">It runs on ${repoName()} through Claude Code. Read-only: nothing in your code changes. On this page it replays a sample run.</p></div>`
      : `<div class="h03-drop h03-drop-wait"><p><b>Nothing to test yet</b></p><p class="h03-caption">Add a video or a post. The prompt Kiln pulls out of it shows up in Capture, ready to drag here.</p></div>`;
  };
  repo.addEventListener('change', () => { if (!running && test.querySelector('[data-drop]')) resetTest(); });
  const sendPrompt = async (card: HTMLElement) => {
    if (running || !current) return;
    await flyInto(card, test, container);
    startTest();
  };
  const startTest = () => {
    if (!current) return;
    if (innerWidth < 900) test.closest('.h03-pane')!.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    play(current, 1);
  };

  async function play(key: 'video' | 'post', revision: number) {
    const cap = captures[key], mine = ++token, verdict = revision > 1 ? 'pass' : cap.verdict;
    running = true;
    capture.querySelector('[data-prompt]')?.classList.add('is-locked');
    const prompt = revision > 1 && cap.fix ? cap.prompt.replace(cap.fix.before, `<mark>${cap.fix.after}</mark>`) : cap.prompt;
    test.innerHTML = `<div class="h03-run">
      <div class="h03-run-head"><h4 data-run-title>${cap.title}</h4><span class="h03-badge">rev ${revision}</span></div>
      <p class="h03-prompt">${prompt}</p>
      <p class="h03-running" data-running><span class="h03-ring" aria-hidden="true"></span><span data-elapsed>Running on ${repoName()}, 0 s</span></p>
      <ol class="h03-steps" data-steps></ol>
      <p class="h03-meta" data-meta>Claude Code, your default model, medium effort</p>
      <div data-outcome></div></div>`;
    const stepsEl = test.querySelector<HTMLElement>('[data-steps]')!, elapsed = test.querySelector<HTMLElement>('[data-elapsed]')!, meta = test.querySelector<HTMLElement>('[data-meta]')!;
    const list: Step[] = revision > 1 && cap.fix ? [...cap.steps.slice(0, -1), ['think', cap.fix.step]] : cap.steps;
    for (const [index, [kind, text]] of list.entries()) {
      await wait(640);
      if (mine !== token) return;
      stepsEl.insertAdjacentHTML('beforeend', `<li>${svgIcon(stepIcon[kind], 16)}<span>${text}</span></li>`);
      const seconds = 38 * (index + 1) + (revision > 1 ? 4 : 0);
      elapsed.textContent = `Running on ${repoName()}, ${Math.floor(seconds / 60)} min ${seconds % 60} s`;
      meta.textContent = `Claude Code, default model, medium effort. Sample tokens: ${(7.1 * (index + 1)).toFixed(1)}k in, ${(4.2 * index).toFixed(1)}k cached, ${(.5 * (index + 1)).toFixed(1)}k out`;
    }
    await wait(420);
    if (mine !== token) return;
    const total = 38 * list.length + (revision > 1 ? 4 : 0);
    test.querySelector('[data-running]')!.innerHTML = `<span class="h03-done" aria-hidden="true"></span>Finished in ${Math.floor(total / 60)} min ${total % 60} s. Nothing in the repo changed.`;
    const outcome = test.querySelector<HTMLElement>('[data-outcome]')!;
    running = false;
    if (verdict === 'uncertain' && cap.fix) {
      outcome.innerHTML = `<div class="h03-verdict h03-verdict-uncertain"><b>Uncertain</b><span>The agent’s own assessment: it found two confusing spots and couldn’t say which a child hits first.</span></div>
        <p class="h03-caption">Change one line and run it again on the same repo:</p>
        <div class="h03-diff"><p class="h03-del">- ${cap.fix.before}</p><p class="h03-add">+ ${cap.fix.after}</p></div>
        <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-rerun>Edit that line and run rev 2</button></div>`;
      const rerun = outcome.querySelector<HTMLButtonElement>('[data-rerun]')!;
      rerun.addEventListener('click', () => play(key, 2));
      rerun.focus({ preventScroll: true });
      return;
    }
    setStep(2);
    const done = rows.some(row => row.name === cap.skill);
    outcome.innerHTML = `<div class="h03-verdict h03-verdict-pass"><b>Pass</b><span>That’s the agent’s assessment. Whether you keep it is your call.</span></div>
      ${revision > 1 && cap.fix ? `<p class="h03-lesson">${cap.fix.lesson}</p>` : ''}
      <div class="h03-flyout-actions">${done ? `<span class="h03-caption">${cap.skill} is already on your panel.</span>` : `<button type="button" class="h03-btn h03-btn-accent" data-approve>Approve rev ${revision} as a skill</button><button type="button" class="h03-btn h03-btn-subtle" data-skip>Not yet</button>`}</div>`;
    outcome.querySelector<HTMLButtonElement>('[data-approve]')?.focus({ preventScroll: true });
    outcome.querySelector('[data-skip]')?.addEventListener('click', () => { capture.querySelector('[data-prompt]')?.classList.remove('is-locked'); resetTest(); setStep(1); });
    outcome.querySelector('[data-approve]')?.addEventListener('click', () => approve(key, revision, outcome));
  }

  async function approve(key: 'video' | 'post', revision: number, outcome: HTMLElement) {
    const cap = captures[key];
    const title = test.querySelector<HTMLElement>('[data-run-title]')!;
    stage.tidyNow();
    panels.add({ name: cap.skill, note: `Approved rev ${revision}, tested on ${repo.value === 'my-game' ? 'my-game' : 'an example'}`, cells: cells({}), fresh: true });
    setStep(3);
    outcome.innerHTML = `<div class="h03-verdict h03-verdict-pass"><b>Approved</b><span>Rev ${revision} is pinned and published to <code>you/my-kiln</code> (sample). Edits from here make a new draft. It’s on your panel now: choose where it’s installed.</span></div>`;
    const firstReveal = landing.hidden;
    landing.hidden = false;
    const row = landing.querySelector<HTMLElement>(`[data-row="${cap.skill}"]`)!;
    if (firstReveal && !reduced()) landing.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.9,.3,1)' });
    row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    await wait(520);
    // FLIP the run's title into the new row: the prompt becomes the skill.
    if (!reduced()) {
      const from = title.getBoundingClientRect(), to = row.querySelector<HTMLElement>('th b')!.getBoundingClientRect();
      const chip = document.createElement('div');
      chip.className = 'h03-note h03-t-y h03-chip-fly'; chip.setAttribute('aria-hidden', 'true');
      chip.innerHTML = `<p>${cap.skill}</p>`;
      container.append(chip);
      const W = chip.offsetWidth, H = chip.offsetHeight;
      const fx = from.left + from.width / 2 - W / 2, fy = from.top + from.height / 2 - H / 2;
      Object.assign(chip.style, { left: `${fx}px`, top: `${fy}px` });
      const dx = to.left + to.width / 2 - W / 2 - fx, dy = to.top + to.height / 2 - H / 2 - fy;
      await chip.animate([
        { transform: 'translate(0px, 0px) rotate(-4deg) scale(.6)', opacity: 0 },
        { transform: 'translate(0px, -14px) rotate(-3deg) scale(1.05)', opacity: 1, offset: .18 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(.7)`, opacity: 1, offset: .82 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${to.width / W}, ${to.height / H})`, opacity: 0 },
      ], { duration: 900, easing: 'cubic-bezier(.55,0,.2,1)', fill: 'forwards' }).finished;
      chip.remove();
    }
    root.querySelectorAll<HTMLElement>(`[data-row="${cap.skill}"]`).forEach(tr => { tr.style.setProperty('--land', '#fdf28b'); tr.classList.add('is-landed', 'is-pulse'); });
    const status = landing.querySelector<HTMLElement>('[data-status]')!;
    status.textContent = `Approved ${cap.skill}. It isn’t installed anywhere yet: flip a switch for Claude Code, Codex, Copilot or this project.`;
    row.querySelector<HTMLElement>('.h03-toggle')?.focus({ preventScroll: true });
  }

  root.querySelector('[data-see-top]')!.addEventListener('click', event => {
    event.preventDefault();
    const tr = root.querySelector<HTMLElement>('[data-view="main"] tr.is-fresh:last-child') ?? root.querySelector<HTMLElement>('[data-view="main"]');
    tr?.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    if (tr) { tr.classList.remove('is-landed'); void tr.offsetWidth; tr.classList.add('is-landed'); }
  });

  captureIdle();
  resetTest();
}
