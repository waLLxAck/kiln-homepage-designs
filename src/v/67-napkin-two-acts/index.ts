// PROTOTYPE H01 (round 5): the story told over coffee. Blue ballpoint on a café napkin for the mess, crisp printed Kiln cards taped on.
// Act one: the skills folders doodled on the napkin pop into the taped-on Kiln panel. Act two: "how do I add new skills?", with a phone
// and two printouts on the table you drag into Kiln's capture card; the prompt it pulls out gets dragged into a test, approved, and lands
// as a new row on the act-one panel.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, cross, ellipse, folder, line, reseed } from '../r3-kit/rough';

const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download Kiln for Windows') => `<a class="h01-button" href="${installer}">${windows}<span>${text}</span></a>`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced() ? 0 : ms));

// ---------- ballpoint ----------

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
      const t = k / n, wob = (k % 2 ? .3 : 0) + r() * .3;
      pts.push(`${(from[0] + (to[0] - from[0]) * t + nx * wob).toFixed(2)}% ${(from[1] + (to[1] - from[1]) * t + ny * wob).toFixed(2)}%`);
    }
  };
  edge([0, 0], [100, 0], 70, 0, 1); edge([100, 0], [100, 100], 90, -1, 0); edge([100, 100], [0, 100], 70, 0, -1); edge([0, 100], [0, 0], 90, 1, 0);
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

// ---------- act one: folders and the panel ----------

type Loc = 'claude' | 'agents' | 'codex' | 'copilot' | 'game';
type Cell = 'on' | 'off' | 'edited' | 'found';
type Row = { id: string; note: string; cells: Record<Loc, Cell>; fresh?: boolean };
const locs: { key: Loc; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Agents (Codex, Copilot and others)', short: 'Agents', path: '~/.agents/skills' },
  { key: 'codex', name: 'Codex', short: 'Codex', path: '.codex/skills' },
  { key: 'copilot', name: 'Copilot', short: 'Copilot', path: '.copilot/skills' },
  { key: 'game', name: 'my-game project', short: 'my-game', path: 'my-game/.github/skills' },
];
const off: Record<Loc, Cell> = { claude: 'off', agents: 'off', codex: 'off', copilot: 'off', game: 'off' };
const startRows = (): Row[] => [
  { id: 'code-review', note: 'Approved rev 3', cells: { ...off, claude: 'on', agents: 'on', codex: 'edited', game: 'edited' } },
  { id: 'research', note: 'Approved rev 2', cells: { ...off, claude: 'on', codex: 'on' } },
  { id: 'playtest-brief', note: 'Approved rev 4', cells: { ...off, claude: 'on', game: 'on' } },
  { id: 'writing-for-agents', note: 'Approved rev 1', cells: { ...off, agents: 'on' } },
  { id: 'jira-helper', note: 'Not in your library', cells: { ...off, copilot: 'found' } },
];

/** Folder boxes in the two doodle layouts: [x, y, w, h, rotation] in viewBox units. */
type Box = [number, number, number, number, number];
const folderBoxes: Record<Loc, { wide: Box; tall: Box }> = {
  claude: { wide: [14, 44, 236, 168, -2], tall: [6, 40, 168, 150, -2] },
  agents: { wide: [300, 26, 272, 136, 2.5], tall: [188, 30, 166, 120, 2.5] },
  codex: { wide: [22, 300, 196, 104, -3.5], tall: [10, 262, 154, 90, -3.5] },
  copilot: { wide: [258, 236, 150, 72, 3], tall: [194, 250, 152, 64, 3] },
  game: { wide: [340, 336, 230, 104, 1.5], tall: [64, 432, 232, 88, 1.5] },
};
const VIEW = { wide: [600, 500], tall: [360, 610] } as const;
type SkillFile = { name: string; loc: Loc; to: string; mark?: string };
const files: SkillFile[] = [
  { name: 'code-review', loc: 'claude', to: 'code-review' },
  { name: 'code-review (1)', loc: 'claude', to: 'code-review', mark: 'dupe' },
  { name: 'research', loc: 'claude', to: 'research' },
  { name: 'playtest-brief', loc: 'claude', to: 'playtest-brief' },
  { name: 'code-review', loc: 'agents', to: 'code-review' },
  { name: 'writing-for-agents', loc: 'agents', to: 'writing-for-agents' },
  { name: 'old-link', loc: 'agents', to: 'crumple', mark: 'broken' },
  { name: 'research', loc: 'codex', to: 'research' },
  { name: 'code-review-old', loc: 'codex', to: 'code-review', mark: 'stale' },
  { name: 'jira-helper', loc: 'copilot', to: 'jira-helper', mark: 'forgot' },
  { name: 'code-review-FINAL', loc: 'game', to: 'code-review', mark: 'edited' },
  { name: 'playtest-brief', loc: 'game', to: 'playtest-brief' },
];
const fileIcon = '<svg viewBox="0 0 14 17" aria-hidden="true"><path d="M1.5 1.2 L8.8 1 L12.6 4.8 L12.4 15.8 L1.7 16 Z M8.6 1.3 L8.8 5 L12.4 5" /></svg>';

function foldersSketch(layout: 'wide' | 'tall') {
  const tall = layout === 'tall';
  reseed(tall ? 13 : 11);
  let i = 0;
  const twice = (d: () => string) => pen(d(), i++) + pen(d(), i++, 'h01-pen-faint');
  const boxes = locs.map(({ key, path }) => {
    const [x, y, w, h, rot] = folderBoxes[key][layout];
    const label = key === 'game' ? 'my-game/.github/skills' : path;
    return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${twice(() => folder(x, y, w, h))}${word(x + 4, y - 8, label, i++, tall ? 19 : 23, 0, 'h01-word-path')}</g>`;
  }).join('');
  const notes = tall ? `
    ${pen(ellipse(80, 97, 76, 12, .08), i++)}${word(8, 228, 'dupe!', i++, 24, -6)}${pen(arrow(14, 206, 6, 104, 8, 9), i++)}
    ${word(246, 182, 'dead link', i++, 20, -4)}${pen(arrow(262, 164, 254, 126, 6, 8), i++)}
    ${word(190, 348, 'who wrote this??', i++, 20, -3)}${pen(arrow(240, 330, 236, 296, -6, 8), i++)}
    ${word(184, 400, 'edited by hand', i++, 20, 3)}${pen(arrow(304, 410, 238, 458, 12, 9), i++)}
    ${word(14, 582, 'which one is current??', i++, 28, -2, 'h01-word-big')}${pen(line(14, 590, 270, 586, 1), i++)}` : `
    ${pen(ellipse(106, 106, 88, 15, .08), i++)}${word(112, 254, 'dupe!', i++, 28, -6)}${pen(arrow(128, 234, 142, 126, -14, 11), i++)}
    ${word(452, 198, 'dead link', i++, 24, -5)}${pen(arrow(470, 178, 404, 128, 14, 10), i++)}
    ${word(428, 276, 'who wrote this??', i++, 23, -3)}${pen(arrow(426, 266, 404, 272, -4, 8), i++)}
    ${word(230, 362, 'edited by', i++, 24, -4)}${word(244, 386, 'hand?', i++, 24, -4)}${pen(arrow(296, 392, 346, 370, -10, 10), i++)}
    ${word(12, 478, 'which one is current??', i++, 32, -2, 'h01-word-big')}${pen(line(12, 487, 300, 482, 1), i++)}`;
  const [w, h] = VIEW[layout];
  return `<svg class="h01-sketch h01-sketch-${layout}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${boxes}${notes}</svg>`;
}

function fileChips() {
  const place = (file: SkillFile, layout: 'wide' | 'tall') => {
    const [x, y, , , rot] = folderBoxes[file.loc][layout];
    const n = files.filter(other => other.loc === file.loc).indexOf(file);
    const gap = layout === 'wide' ? 31 : 27, [w, h] = VIEW[layout];
    return `--${layout[0]}x:${((x + 14) / w * 100).toFixed(2)}%;--${layout[0]}y:${((y + 20 + n * gap) / h * 100).toFixed(2)}%;--${layout[0]}r:${rot}deg`;
  };
  return files.map((file, n) => `<span class="h01-file${file.mark ? ` h01-file-${file.mark}` : ''}" data-file="${n}" style="${place(file, 'wide')};${place(file, 'tall')}">${fileIcon}<span>${file.name}</span>${file.mark === 'broken' ? `<svg class="h01-file-x" viewBox="0 0 20 20" aria-hidden="true"><path d="${cross(10, 10, 7)}"/></svg>` : ''}</span>`).join('');
}

function panelNotes() {
  reseed(23);
  const note = (text: string, i: number, bend: number) =>
    `<li><p>${text}</p><svg viewBox="0 0 90 40" aria-hidden="true">${pen(arrow(6, 20 + bend / 3, 84, 20 - bend / 4, bend, 10), i)}</svg></li>`;
  return `<ul class="h01-ink h01-notes" aria-label="Notes scribbled beside the panel">
    ${note('<b>amber</b> = that copy was changed outside Kiln. tap it, compare, then decide.', 1, 8)}
    ${note('<b>dashed</b> = found in a folder, not in your library. hello, jira-helper.', 3, -10)}
    ${note('every skill you leave on puts its description in your agent\'s context on <u>every turn</u>. switch off what you don\'t use.', 5, 12)}
  </ul>`;
}

function panelCard() {
  return `<div class="h01-card h01-panel" data-panel data-state="mess" id="h01-panel">
    ${tape('tl')}${tape('tr')}
    <div class="h01-card-bar"><b>Skills</b><span data-panel-sub>Sample library</span><button type="button" class="h01-ui-button h01-small" data-pop aria-controls="h01-panel">Find my skills</button></div>
    <div class="h01-table-wrap">
      <table>
        <caption class="visually-hidden">Skills and the folders your agents read. Each switch installs or removes that skill in that folder.</caption>
        <thead><tr><th scope="col">Skill</th>${locs.map(loc => `<th scope="col" title="${loc.path}"><span>${loc.short}</span></th>`).join('')}</tr></thead>
        <tbody data-rows></tbody>
      </table>
      <p class="h01-panel-empty" data-empty>Kiln hasn't looked in your folders yet.</p>
    </div>
    <div class="h01-flyout" data-flyout hidden></div>
    <div class="h01-cleanup" data-cleanup data-slot="cleanup"><p data-cleanup-text>Safe cleanup: a dead link (<code>old-link</code>) and a duplicate (<code>code-review (1)</code>).</p><button type="button" class="h01-ui-button h01-quiet h01-small" data-clean>Clean up</button></div>
    <ul class="h01-legend" aria-label="Switch states"><li><i class="h01-dot-on"></i>Installed</li><li><i class="h01-dot-off"></i>Off</li><li><i class="h01-dot-edited"></i>Edited outside Kiln</li><li><i class="h01-dot-found"></i>Found, not in library</li></ul>
    <div class="h01-card-foot"><p data-context></p><p class="h01-status" data-status aria-live="polite" tabindex="-1">A sample. Nothing on this page touches your disk.</p></div>
  </div>`;
}

// ---------- act two: sources and the pipeline ----------

type Source = 'video' | 'post' | 'repo';
type Take = { kind: 'Technique' | 'Insight' | 'Tool'; text: string; from?: string };
type Idea = {
  collection: string; ex: typeof examples[number]; from?: string; takes: Take[]; skill: string;
  steps: string[][]; fix?: { before: string; after: string; lesson: string };
};
const ideas: Record<'video' | 'post', Idea> = {
  video: {
    collection: 'Kid usability', ex: examples[0], from: '04:12', skill: 'kid-usability-check',
    takes: [
      { kind: 'Technique', text: 'Give the agent a persona and one place to stop.', from: '07:30' },
      { kind: 'Insight', text: 'The first obstacle tells you more than a list of ten.', from: '11:05' },
      { kind: 'Tool', text: 'A browser tool, so the agent can click through the app.', from: '13:48' },
    ],
    steps: [
      ['Read src/screens/Start.tsx', 'Searched src/ for "signup", skipped the parent flow', 'Read src/screens/Levels.tsx', 'Found two confusing spots, unsure which comes first'],
      ['Read src/screens/Start.tsx', 'Read src/screens/Levels.tsx', 'Quoted the button text: "Continue to setup"', 'Named that as the first obstacle, with a fix'],
    ],
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', lesson: 'Asking for the on-screen text made it commit to one obstacle.' },
  },
  post: {
    collection: 'Game jam', ex: examples[2], skill: 'playtest-top-ten',
    takes: [
      { kind: 'Technique', text: 'Say "make no changes" so you review before anything moves.' },
      { kind: 'Insight', text: 'Ranking forces the agent to pick what matters most.' },
    ],
    steps: [['Read README.md and src/game/loop.ts', 'Ran npm test -- --listTests', 'Searched src/ for "respawn" and "checkpoint"', 'Ranked ten improvements, changed no files']],
  },
};

function sourcesMarkup() {
  const add = (id: Source, what: string) => `<button type="button" class="h01-ui-button h01-small h01-addbtn" data-add="${id}">Add ${what} to Kiln</button>`;
  return `<div class="h01-table-top" data-sources>
    <div class="h01-source h01-src-video" data-source="video" aria-label="A phone showing a YouTube video: The prompts I actually keep, by Dana Codes, 18 minutes 42, paused at 4:12.">
      <div class="h01-phone" aria-hidden="true"><div class="h01-phone-screen">
        <div class="h01-yt-thumb"><b>use it like a<br>7-year-old</b><i class="h01-yt-play"></i><span class="h01-yt-time">18:42</span><span class="h01-yt-bar"><span></span></span></div>
        <p class="h01-yt-title">The prompts I actually keep (agent workflows, ep. 12)</p>
        <p class="h01-yt-chan"><i></i>Dana Codes</p>
        <p class="h01-yt-next"><i></i><span></span></p><p class="h01-yt-next"><i></i><span></span></p>
      </div></div>
      ${add('video', 'the video')}
    </div>
    <div class="h01-source h01-src-post h01-print" data-source="post" aria-label="A printed post on X by Mika K., @mikaships: before you ship a game jam build, ask your agent to playtest it and rank the ten things that kill the fun.">
      <div aria-hidden="true">
        <p class="h01-x-head"><i class="h01-x-av">MK</i><span><b>Mika K.</b><small>@mikaships</small></span><svg class="h01-x-mark" viewBox="0 0 20 20"><path d="M3 3 17 17M17 3 3 17"/></svg></p>
        <p class="h01-x-text">Game jam tip: before you ship, ask your agent to playtest the build and rank the ten things that kill the fun. Tell it to change nothing. Humbling.</p>
        <p class="h01-x-time">9:14 PM</p>
      </div>
      ${add('post', 'the post')}
    </div>
    <div class="h01-source h01-src-repo h01-print" data-source="repo" aria-label="A printout of the GitHub repository mattpocock/skills: a skills folder, README.md, LICENSE and a Code button.">
      <div aria-hidden="true">
        <p class="h01-gh-head"><svg viewBox="0 0 16 16"><path d="M3 2.5h9.5v11H3zM3 11h9.5M5.5 2.5v8.5"/></svg><span>mattpocock / <b>skills</b></span><em>Code</em></p>
        <ul class="h01-gh-files"><li class="is-dir">skills/</li><li>README.md</li><li>LICENSE</li></ul>
      </div>
      ${add('repo', 'the repo')}
    </div>
  </div>`;
}

function pipelineMarkup() {
  return `<div class="h01-card h01-capture" data-capture>
      ${tape('tr')}
      <div class="h01-card-bar"><b>Capture</b><span><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> from any app</span></div>
      <div class="h01-drop" data-drop-capture>
        <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><path d="M24 8v22M15 21l9 9 9-9M9 34v6h30v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p><b>Drop a link, a post or a screenshot</b></p>
        <p class="h01-fine">Analyze and add turns it into prompts, techniques, insights and tools, linked to where it came from.</p>
      </div>
      <div class="h01-capture-live" data-capture-live aria-live="polite"></div>
    </div>
    <div class="h01-collection" data-collection>
      <p class="h01-placeholder">What Kiln pulls out of a source shows up here.</p>
    </div>
    <div class="h01-card h01-test" data-test>
      ${tape('tl')}
      <div class="h01-card-bar"><b>Test</b><span class="h01-chip">Read-only</span></div>
      <div class="h01-test-setup">
        <label>Repo <select data-repo><option value="~/code/my-game">~/code/my-game (sample)</option><option value="an isolated example project">An isolated example project</option></select></label>
        <fieldset><legend>Agent</legend><label><input type="radio" name="h01-agent" value="Claude Code" checked> Claude Code</label><label><input type="radio" name="h01-agent" value="Codex"> Codex</label></fieldset>
      </div>
      <div class="h01-test-body" data-test-body aria-live="polite" tabindex="-1"></div>
    </div>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln: my agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h01">
    ${defs()}
    <header class="h01-top">
      <a class="h01-brand" href="#main" aria-label="Kiln, home"><span class="h01-brand-mark" aria-hidden="true"></span>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h01-p1">The panel</a><a href="#h01-p2">New skills</a><a href="#h01-get">Download</a></nav>
    </header>
    <main id="main">
      <div class="h01-napkin h01-act1 h01-drawable" data-act1 data-state="mess">
        <div class="h01-paper" style="${napkinClip(5)}">
          <section class="h01-hero" aria-labelledby="h01-title">
            <div class="h01-hero-head">
              <p class="h01-ink h01-kicker" aria-hidden="true">ok, confession:</p>
              <h1 id="h01-title" class="h01-ink">My agents were loading skills I forgot I had.</h1>
              <p class="h01-ink h01-hand-copy">Five folders, three agents, four copies of code-review and one skill nobody remembers writing.</p>
              <p class="h01-printed">Kiln is a Windows app that puts every skill on one panel, and tests new ones on your own repo before they go in.</p>
              <div class="h01-cta">${download()}</div>
              <p class="h01-fine">Kiln 0.17.0. The release is in a private GitHub repository, so you'll need an account with access.</p>
            </div>
            <div class="h01-folders" data-folders role="img" aria-label="A ballpoint doodle of five skills folders: ~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills and my-game/.github/skills, with the skill files inside. code-review shows up in four of them, one copy is a duplicate, one is edited by hand, one link is dead and one skill, jira-helper, nobody remembers writing.">
              <div class="h01-ink">${foldersSketch('wide')}${foldersSketch('tall')}</div>
              <div class="h01-files" data-files aria-hidden="true">${fileChips()}</div>
            </div>
          </section>
          <section class="h01-p1" id="h01-p1" aria-labelledby="h01-p1-title">
            <div class="h01-p1-text">
              <h2 id="h01-p1-title" class="h01-ink">So Kiln pulled them all onto one panel.</h2>
              <p class="h01-printed">One row per skill, one switch per folder. Duplicates merge, and the dead link gets flagged for a safe cleanup.</p>
            </div>
            ${panelNotes()}
            ${panelCard()}
          </section>
          ${coffeeRing('h01-coffee-hero')}
        </div>
      </div>

      <section class="h01-p2" id="h01-p2" aria-labelledby="h01-p2-title">
        <div class="h01-napkin h01-strip h01-drawable">
          <div class="h01-paper" style="${napkinClip(29)}">
            <h2 id="h01-p2-title" class="h01-ink">How do I add new skills to this?</h2>
            <p class="h01-ink h01-hand-copy">I used to find a great prompt in a video, save it, and never try it. Now it goes into Kiln, runs on my repo, and only lands on the panel if it works.</p>
            <ol class="h01-ink h01-steps"><li>drag one into Kiln</li><li>drag the prompt into the test</li><li>keep it if it passes</li></ol>
          </div>
        </div>
        <div class="h01-pipe" data-pipe>
          ${sourcesMarkup()}
          ${pipelineMarkup()}
        </div>
      </section>

      <section class="h01-close" id="h01-get" aria-labelledby="h01-get-title">
        <ul class="h01-facts" aria-label="The fine print">
          <li><b>No API key.</b> It uses the Codex or Claude Code you're signed into. Your plan's usage limits still apply.</li>
          <li><b>Tests are read-only.</b> The agent reads your repo; nothing in your code changes.</li>
          <li><b>Approval pins a revision</b> and publishes it to your own Kiln repository on GitHub.</li>
          <li><b>Windows app plus a CLI.</b> MIT licensed. Your agents can read the library too.</li>
        </ul>
        <div class="h01-card h01-get-card">
          ${tape('tl')}${tape('tr')}
          <h2 id="h01-get-title">Put it on your machine and flip the first switch.</h2>
          ${download()}
          <p>Kiln 0.17.0 for Windows, for Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned.</p>
        </div>
      </section>
    </main>
  </div>`;
  bindDrawing(root);
  const panel = bindPanel(root);
  bindPipeline(root, panel);
}

function bindDrawing(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('.h01-drawable');
  if (navigator.webdriver || !('IntersectionObserver' in window)) { targets.forEach(target => target.classList.add('is-drawn')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  targets.forEach(target => observer.observe(target));
}

// ---------- behaviour: the panel and the pop-in ----------

type Panel = { add(name: string, rev: number): HTMLElement; ensureTidy(): void };

function bindPanel(root: HTMLElement): Panel {
  const act = root.querySelector<HTMLElement>('[data-act1]')!;
  const card = root.querySelector<HTMLElement>('[data-panel]')!;
  const body = card.querySelector<HTMLElement>('[data-rows]')!;
  const status = card.querySelector<HTMLElement>('[data-status]')!;
  const context = card.querySelector<HTMLElement>('[data-context]')!;
  const flyout = card.querySelector<HTMLElement>('[data-flyout]')!;
  const cleanup = card.querySelector<HTMLElement>('[data-cleanup]')!;
  const popButton = card.querySelector<HTMLButtonElement>('[data-pop]')!;
  const chips = [...root.querySelectorAll<HTMLElement>('[data-file]')];
  let rows = startRows(), added: Row[] = [], cleaned = false, busy = false, touched = false;
  const long: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };
  const all = () => [...rows, ...added];

  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const draw = () => {
    const tidy = card.dataset.state === 'tidy';
    body.innerHTML = all().map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}" data-row-id="${row.id}"><th scope="row" data-slot="${row.id}" class="${tidy ? 'is-in' : ''}"><b>${row.id}${added.includes(row) ? '<em class="h01-new">new</em>' : ''}</b><small>${row.note}</small></th>${locs.map(loc => {
      const state = row.cells[loc.key];
      return `<td data-slot="${row.id}:${loc.key}" class="${tidy ? 'is-in' : ''}"><button type="button" class="h01-switch h01-switch-${state}" data-row="${r}" data-col="${loc.key}" aria-label="${row.id} in ${loc.path}: ${long[state]}" aria-pressed="${state === 'on' || state === 'edited'}"><i></i></button>${row.id === 'code-review' && loc.key === 'claude' && !cleaned ? '<em class="h01-merge" title="Two copies merged">2</em>' : ''}</td>`;
    }).join('')}</tr>`).join('');
    const count = (key: Loc) => all().filter(row => row.cells[key] === 'on' || row.cells[key] === 'edited').length;
    context.textContent = `In every new session: ${count('claude')} skill descriptions for Claude Code, ${count('agents')} in ~/.agents, ${count('codex')} for Codex, ${count('copilot')} for Copilot, ${count('game')} in my-game.`;
    card.querySelector<HTMLElement>('[data-panel-sub]')!.textContent = `Sample library, ${all().length} skills`;
  };
  const setState = (state: 'mess' | 'popping' | 'tidy' | 'unpopping') => {
    card.dataset.state = state; act.dataset.state = state;
    popButton.textContent = state === 'tidy' || state === 'popping' ? 'Put them back' : 'Find my skills';
    popButton.disabled = state === 'popping' || state === 'unpopping';
    body.inert = state !== 'tidy';
  };
  const reset = () => { rows = startRows(); cleaned = false; flyout.hidden = true; cleanup.hidden = false; card.querySelector('[data-cleanup-text]')!.innerHTML = 'Safe cleanup: a dead link (<code>old-link</code>) and a duplicate (<code>code-review (1)</code>).'; card.querySelector<HTMLElement>('[data-clean]')!.hidden = false; };
  const instant = (tidy: boolean) => {
    chips.forEach(chip => chip.classList.toggle('is-gone', tidy));
    setState(tidy ? 'tidy' : 'mess');
    draw();
  };
  const slotFor = (file: SkillFile) => file.to === 'crumple' ? cleanup : card.querySelector<HTMLElement>(`[data-slot="${file.to}:${file.loc}"]`)!;
  const land = (el: HTMLElement) => { el.classList.remove('is-landed'); void el.offsetWidth; el.classList.add('is-in', 'is-landed'); };

  // FLIP: first = the ink file on the napkin, last = its cell on the panel. The chip itself travels (lifted off the paper, arcing over),
  // shrinks to the cell and fades as the crisp switch pops in underneath. Duplicates aim at the same cell; the dead link crumples.
  const flight = (chip: HTMLElement, file: SkillFile) => {
    const from = chip.getBoundingClientRect(), to = (file.to === 'crumple' ? cleanup : slotFor(file).querySelector('button') ?? slotFor(file)).getBoundingClientRect();
    const rot = parseFloat(getComputedStyle(chip).getPropertyValue(innerWidth <= 720 ? '--tr' : '--wr')) || 0;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const lift = Math.min(90, 30 + Math.abs(dx) * .12);
    if (file.to === 'crumple') {
      const tx = to.left + 40 - (from.left + from.width / 2);
      return { frames: [
        { transform: `translate(0px, 0px) rotate(${rot}deg) scale(1)`, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
        { transform: `translate(0px, -6px) rotate(${rot - 12}deg) scale(.8, .6)`, opacity: 1, offset: .22, clipPath: 'inset(10% 12% 12% 10% round 30%)' },
        { transform: `translate(0px, -4px) rotate(${rot + 90}deg) scale(.32)`, opacity: 1, offset: .42, clipPath: 'inset(0% 30% 0% 30% round 50%)' },
        { transform: `translate(${tx}px, ${dy}px) rotate(${rot + 420}deg) scale(.26)`, opacity: .2, clipPath: 'inset(0% 30% 0% 30% round 50%)' },
      ], duration: 1200, easing: 'cubic-bezier(.45,.05,.55,1)' };
    }
    const scale = Math.max(.45, Math.min(.9, to.height / from.height));
    return { frames: [
      { transform: `translate(0px, 0px) rotate(${rot}deg) scale(1)`, opacity: 1 },
      { transform: `translate(0px, -12px) rotate(${rot * .5 - 3}deg) scale(1.14)`, opacity: 1, offset: .16 },
      { transform: `translate(${dx * .5}px, ${dy * .5 - lift}px) rotate(3deg) scale(1.05)`, opacity: 1, offset: .52 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${scale})`, opacity: .9, offset: .88 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${scale * .8})`, opacity: 0 },
    ], duration: 900, easing: 'cubic-bezier(.5,0,.25,1)' };
  };

  async function pop() {
    if (busy) return;
    touched = true;
    if (reduced()) { instant(true); say('Every skill is on the panel. Flip a switch.'); return; }
    busy = true;
    setState('popping'); draw();
    const landedRows = new Set<string>();
    const runs = chips.map((chip, n) => {
      const file = files[Number(chip.dataset.file)];
      const { frames, duration, easing } = flight(chip, file);
      chip.classList.add('is-flying');
      const animation = chip.animate(frames, { duration, easing, delay: 120 + n * 95, fill: 'both' });
      return animation.finished.then(() => {
        chip.classList.remove('is-flying'); chip.classList.add('is-gone'); animation.cancel();
        if (file.to === 'crumple') { land(cleanup); return; }
        if (!landedRows.has(file.to)) { landedRows.add(file.to); land(body.querySelector<HTMLElement>(`[data-slot="${file.to}"]`)!); }
        land(slotFor(file));
      });
    });
    await Promise.all(runs);
    body.querySelectorAll<HTMLElement>('[data-slot]').forEach(slot => slot.classList.add('is-in'));
    setState('tidy'); busy = false;
    say('12 files in 5 folders became 5 rows. Flip a switch, or tap an amber one.');
  }
  async function unpop() {
    if (busy) return;
    touched = true;
    reset();
    if (reduced()) { instant(false); say('Back on the napkin.'); return; }
    busy = true;
    setState('unpopping'); draw();
    cleanup.classList.remove('is-in', 'is-landed');
    body.querySelectorAll<HTMLElement>('[data-slot]').forEach(slot => slot.classList.add('is-in'));
    const order = [...chips].reverse();
    const runs = order.map((chip, n) => {
      const file = files[Number(chip.dataset.file)];
      const { frames, duration, easing } = flight(chip, file);
      chip.classList.remove('is-gone'); chip.classList.add('is-flying');
      const animation = chip.animate(frames, { duration: duration * .7, easing, delay: n * 45, fill: 'both', direction: 'reverse' });
      setTimeout(() => { if (file.to !== 'crumple') slotFor(file)?.classList.remove('is-in'); }, n * 45 + 60);
      return animation.finished.then(() => { chip.classList.remove('is-flying'); animation.cancel(); });
    });
    await Promise.all(runs);
    setState('mess'); busy = false; draw();
    say('Back on the napkin. Press Find my skills to run it again.');
  }
  popButton.addEventListener('click', () => (card.dataset.state === 'tidy' ? unpop() : pop()));

  // switches and the compare / import flyout
  let returnTo: HTMLElement | null = null;
  const closeFlyout = () => { if (flyout.hidden) return; flyout.hidden = true; returnTo?.focus(); returnTo = null; };
  const refocus = (r: number, key: Loc) => body.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${key}"]`);
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h01-switch');
    if (!button || card.dataset.state !== 'tidy') return;
    const r = Number(button.dataset.row), row = all()[r], loc = locs.find(item => item.key === button.dataset.col)!, state = row.cells[loc.key];
    flyout.dataset.row = String(r); flyout.dataset.col = loc.key;
    if (state === 'edited') {
      const stale = loc.key === 'codex';
      flyout.innerHTML = `<p><b><code>${loc.path}/${stale ? 'code-review-old' : 'code-review-FINAL'}</code></b> ${stale ? 'is an older copy. It' : 'was edited by hand and'} differs from approved rev 3 in SKILL.md.</p>
        <div class="h01-diff"><p class="h01-del">- Review standards and the specification separately.</p><p class="h01-add">+ ${stale ? 'Review the code.' : 'Review the specification only. Skip style.'}</p></div>
        <div class="h01-actions-row"><button type="button" class="h01-ui-button h01-small" data-fly="replace">Replace with rev 3</button><button type="button" class="h01-ui-button h01-quiet h01-small" data-fly="draft">Keep it as draft rev 4</button><button type="button" class="h01-ui-button h01-ghost h01-small" data-fly="close">Cancel</button></div>`;
    } else if (state === 'found') {
      flyout.innerHTML = `<p><b><code>${loc.path}/${row.id}</code></b> isn't in your library. Nobody remembers writing it, but Copilot loads it anyway.</p>
        <div class="h01-actions-row"><button type="button" class="h01-ui-button h01-small" data-fly="import">Import as draft</button><button type="button" class="h01-ui-button h01-quiet h01-small" data-fly="backup">Move to a private backup</button><button type="button" class="h01-ui-button h01-ghost h01-small" data-fly="close">Cancel</button></div>`;
    } else {
      row.cells[loc.key] = state === 'on' ? 'off' : 'on';
      row.fresh = false;
      say(state === 'on' ? `Removed ${row.id} from ${loc.path}. It stays in your library, history and all.` : `Installed the approved ${row.id} into ${loc.path}. Receipt saved.`);
      draw(); refocus(r, loc.key)?.focus();
      return;
    }
    flyout.hidden = false; returnTo = button;
    flyout.querySelector<HTMLButtonElement>('button')?.focus();
  });
  flyout.addEventListener('click', event => {
    const action = (event.target as Element).closest<HTMLElement>('[data-fly]')?.dataset.fly;
    if (!action) return;
    const r = Number(flyout.dataset.row), row = all()[r], key = flyout.dataset.col as Loc, path = locs.find(item => item.key === key)!.path;
    if (action === 'replace') { row.cells[key] = 'on'; say(`Moved the old copy in ${path} to a private backup and installed rev 3.`); }
    if (action === 'draft') { row.cells[key] = 'on'; row.note = 'Approved rev 3, draft rev 4'; say('Saved the edit as draft rev 4. Rev 3 stays approved until you approve the draft.'); }
    if (action === 'import') { row.cells[key] = 'off'; row.note = 'Draft, imported'; say(`Imported ${row.id} as a draft. Switched off until you approve it.`); }
    if (action === 'backup') { row.cells[key] = 'off'; row.note = 'Moved to a private backup'; say(`Moved ${row.id} to a private backup. Copilot won't load it any more.`); }
    if (action !== 'close') { draw(); returnTo = refocus(r, key); }
    closeFlyout();
  });
  flyout.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closeFlyout(); } });
  card.querySelector('[data-clean]')!.addEventListener('click', event => {
    cleaned = true; draw();
    card.querySelector('[data-cleanup-text]')!.textContent = 'Cleaned up: the dead link is gone and the duplicate is in a private backup.';
    (event.currentTarget as HTMLElement).hidden = true;
    say('Removed the dead link old-link and moved code-review (1) to a private backup.');
    status.focus();
  });

  setState('mess'); draw();
  // Real visitors see the pop: when the panel scrolls into view, give the napkin a beat, then pop. Screenshots get the end state.
  if (navigator.webdriver || reduced()) instant(true);
  else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      document.fonts.ready.then(() => setTimeout(() => { if (!touched) pop(); }, 1400));
    }, { rootMargin: innerWidth <= 720 ? '0px 0px -18% 0px' : '0px 0px -40% 0px' });
    observer.observe(card);
  }

  return {
    ensureTidy() { if (card.dataset.state === 'mess') instant(true); },
    add(name: string, rev: number) {
      if (card.dataset.state !== 'tidy') instant(true);
      all().forEach(row => { row.fresh = false; });
      const existing = added.find(row => row.id === name);
      if (existing) { existing.fresh = true; existing.note = `Approved rev ${rev}, just now`; }
      else added.push({ id: name, note: `Approved rev ${rev}, just now`, cells: { ...off }, fresh: true });
      draw();
      say(`Approved ${name} rev ${rev}. It isn't installed anywhere yet: flip the folders it should go into.`);
      const tr = body.querySelector<HTMLElement>(`[data-row-id="${name}"]`)!;
      tr.querySelectorAll<HTMLElement>('[data-slot]').forEach(land);
      return tr;
    },
  };
}

// ---------- behaviour: act two ----------

type DragOptions = { zone: () => HTMLElement; onDrop: (el: HTMLElement) => void; enabled: () => boolean };
/** Pointer drag (mouse, pen and touch) with edge auto-scroll. Buttons inside the draggable keep working as the tap/keyboard fallback. */
function draggable(el: HTMLElement, options: DragOptions) {
  el.addEventListener('pointerdown', event => {
    if ((event.target as Element).closest('button, a, select, input') || !options.enabled() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    const startX = event.clientX, startY = event.clientY, startScroll = scrollY;
    let moved = false, x = startX, y = startY, frame = 0;
    el.setPointerCapture(event.pointerId);
    const over = () => { const r = options.zone().getBoundingClientRect(); return x > r.left - 12 && x < r.right + 12 && y > r.top - 12 && y < r.bottom + 12; };
    const place = () => {
      el.style.transform = `translate(${x - startX}px, ${y - startY + scrollY - startScroll}px) rotate(${(x - startX) / 60}deg) scale(1.04)`;
      options.zone().classList.toggle('is-over', over());
    };
    const tick = () => {
      const edge = 70, speed = y < edge ? -(edge - y) / 3 : y > innerHeight - edge ? (y - innerHeight + edge) / 3 : 0;
      if (speed) { scrollBy(0, speed); place(); }
      frame = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!moved && Math.hypot(x - startX, y - startY) < 6) return;
      if (!moved) { moved = true; el.classList.add('is-dragging'); frame = requestAnimationFrame(tick); }
      place();
    };
    const up = (e: PointerEvent) => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      cancelAnimationFrame(frame);
      el.classList.remove('is-dragging');
      if (!moved) return;
      const hit = e.type === 'pointerup' && over();
      options.zone().classList.remove('is-over');
      if (hit) { options.onDrop(el); return; }
      const current = el.style.transform;
      el.style.transform = '';
      if (!reduced()) el.animate([{ transform: current }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,1.5,.4,1)' });
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
}

/** The satisfying drop: whatever was dragged (or tapped) shrinks into the zone, which gives a little bounce. */
async function swallow(el: HTMLElement, zone: HTMLElement) {
  if (!reduced()) {
    const from = el.getBoundingClientRect(), to = zone.getBoundingClientRect();
    const current = el.style.transform || 'none';
    const offset = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(current);
    const ox = offset ? Number(offset[1]) : 0, oy = offset ? Number(offset[2]) : 0;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2) + ox, dy = to.top + to.height / 2 - (from.top + from.height / 2) + oy;
    el.classList.add('is-flying');
    await el.animate([{ transform: current, opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(.22)`, opacity: .15 }], { duration: 520, easing: 'cubic-bezier(.55,0,.3,1)', fill: 'forwards' }).finished;
    el.getAnimations().forEach(animation => animation.cancel());
    el.classList.remove('is-flying');
    zone.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.035)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.2,1.6,.4,1)' });
  }
  el.style.transform = '';
}

function bindPipeline(root: HTMLElement, panel: Panel) {
  const capture = root.querySelector<HTMLElement>('[data-capture]')!;
  const captureZone = root.querySelector<HTMLElement>('[data-drop-capture]')!;
  const captureLive = root.querySelector<HTMLElement>('[data-capture-live]')!;
  const collection = root.querySelector<HTMLElement>('[data-collection]')!;
  const test = root.querySelector<HTMLElement>('[data-test]')!;
  const testBody = root.querySelector<HTMLElement>('[data-test-body]')!;
  const repo = root.querySelector<HTMLSelectElement>('[data-repo]')!;
  const sources = [...root.querySelectorAll<HTMLElement>('[data-source]')];
  let busy = false, token = 0, current: 'video' | 'post' | null = null;

  const idleTest = (text = 'Drag the prompt here') => {
    testBody.innerHTML = `<div class="h01-drop h01-drop-test" data-drop-test><p><b>${text}</b></p><p class="h01-fine">It runs the exact revision through your signed-in agent, read-only. On this page it replays a sample run.</p></div>`;
  };
  const testZone = () => testBody.querySelector<HTMLElement>('[data-drop-test]') ?? testBody;

  // 1. capture
  async function captureSource(id: Source) {
    if (busy) return;
    busy = true; token++;
    const el = sources.find(source => source.dataset.source === id)!;
    await swallow(el, captureZone);
    sources.forEach(source => source.classList.toggle('is-captured', source === el));
    capture.dataset.state = 'analyzing';
    const label = { video: 'the video', post: 'the post', repo: 'mattpocock/skills' }[id];
    captureLive.innerHTML = `<p class="h01-analyzing"><span class="h01-ring" aria-hidden="true"></span>${id === 'video' ? 'Distilling the video from its captions…' : id === 'repo' ? 'Importing the repository as drafts…' : 'Analyze and add: reading the post…'}</p>`;
    collection.innerHTML = '';
    current = null; idleTest();
    await wait(1100);
    capture.dataset.state = 'done';
    captureLive.innerHTML = `<p class="h01-captured">Added ${label} to your library${id === 'repo' ? ' as drafts' : ''}. <button type="button" class="h01-linkish" data-again>Capture something else</button></p>`;
    captureLive.querySelector('[data-again]')!.addEventListener('click', () => { sources.forEach(source => source.classList.remove('is-captured')); capture.dataset.state = ''; captureLive.innerHTML = ''; sources[0].querySelector<HTMLButtonElement>('[data-add]')?.focus(); });
    if (id === 'repo') {
      collection.innerHTML = `<article class="h01-card h01-import"><p class="h01-kind">Collection <b>mattpocock/skills</b></p>
        <h3>The repository's skills came in as drafts.</h3><p>Everything in its <code>skills/</code> folder is now a draft in your library, linked to the repo. Nothing is installed until you approve it, and the originals stay on GitHub.</p>
        <p class="h01-fine">To see a test on this page, add the video or the post.</p></article>`;
      busy = false; return;
    }
    current = id;
    showCollection(ideas[id], id);
    busy = false;
  }

  // 2. the collection: one star prompt, smaller supporting cards
  function showCollection(idea: Idea, id: 'video' | 'post', revision = 1) {
    const prompt = revision > 1 && idea.fix ? idea.ex.prompt.replace(idea.fix.before, `<mark>${idea.fix.after}</mark>`) : idea.ex.prompt;
    collection.innerHTML = `<p class="h01-coll-name">Collection <b>${idea.collection}</b>, linked to ${id === 'video' ? 'the video' : 'the post'}</p>
      <article class="h01-card h01-prompt" data-prompt tabindex="-1" aria-labelledby="h01-prompt-title">
        <span class="h01-grip" aria-hidden="true"></span>
        <p class="h01-kind">Prompt <span>rev ${revision}</span>${idea.from ? `<span class="h01-stamp">from ${idea.from}</span>` : ''}</p>
        <h3 id="h01-prompt-title">${idea.ex.title}</h3>
        <p class="h01-prompt-text">${prompt}</p>
        <div class="h01-prompt-foot"><button type="button" class="h01-ui-button h01-small" data-send>Test it on my repo</button><span class="h01-fine">or drag this card into the test</span></div>
      </article>
      <ul class="h01-takes">${idea.takes.map(take => `<li class="h01-card h01-take h01-take-${take.kind.toLowerCase()}"><p class="h01-kind">${take.kind}${take.from ? `<span class="h01-stamp">from ${take.from}</span>` : ''}</p><p>${take.text}</p></li>`).join('')}</ul>`;
    const card = collection.querySelector<HTMLElement>('[data-prompt]')!;
    const send = () => startTest(card, idea, revision);
    card.querySelector('[data-send]')!.addEventListener('click', send);
    draggable(card, { zone: testZone, enabled: () => !busy && !test.dataset.running, onDrop: send });
    if (!reduced()) collection.querySelectorAll<HTMLElement>('.h01-card').forEach((el, n) => el.animate([{ opacity: 0, transform: 'translateY(14px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: n * 110, easing: 'cubic-bezier(.2,1.2,.4,1)', fill: 'backwards' }));
  }

  // 3. the test run, verdict, one edit, approve
  async function startTest(card: HTMLElement, idea: Idea, revision: number) {
    if (busy || test.dataset.running) return;
    await swallow(card, testZone());
    card.classList.add('is-sent');
    play(idea, revision);
  }
  async function play(idea: Idea, revision: number) {
    const mine = ++token;
    test.dataset.running = 'yes';
    const agent = root.querySelector<HTMLInputElement>('input[name="h01-agent"]:checked')!.value;
    const steps = idea.steps[Math.min(revision, idea.steps.length) - 1];
    testBody.innerHTML = `<p class="h01-run-head"><b>${idea.ex.title}</b><span>rev ${revision}</span></p>
      <p class="h01-running" data-running><span class="h01-ring" aria-hidden="true"></span><span data-elapsed>Starting ${agent} in ${repo.value}…</span></p>
      <ol class="h01-log" data-log></ol><p class="h01-fine" data-meta></p><div data-outcome></div>`;
    if (document.activeElement === document.body || collection.contains(document.activeElement)) testBody.focus({ preventScroll: true });
    if (innerWidth <= 900) test.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    const log = testBody.querySelector<HTMLElement>('[data-log]')!, meta = testBody.querySelector<HTMLElement>('[data-meta]')!, elapsed = testBody.querySelector<HTMLElement>('[data-elapsed]')!;
    for (const [index, text] of steps.entries()) {
      await wait(560);
      if (mine !== token) return;
      log.insertAdjacentHTML('beforeend', `<li>${text}</li>`);
      const seconds = (index + 1) * 37 + revision * 3;
      elapsed.textContent = `Running, ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      meta.textContent = `Sample: ${agent}, medium effort. ${(6.2 * (index + 1)).toFixed(1)}k tokens in, ${(3.4 * index).toFixed(1)}k cached, ${(0.4 * (index + 1)).toFixed(1)}k out.`;
    }
    await wait(380);
    if (mine !== token) return;
    const total = steps.length * 37 + revision * 3;
    testBody.querySelector('[data-running]')!.innerHTML = `<span class="h01-tick" aria-hidden="true"></span>Finished in ${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}. Nothing in your code changed.`;
    delete test.dataset.running;
    const outcome = testBody.querySelector<HTMLElement>('[data-outcome]')!;
    if (idea.fix && revision === 1) {
      outcome.innerHTML = `<p class="h01-verdict-line"><span class="h01-verdict h01-verdict-uncertain">Uncertain</span>The agent's assessment: it found two confusing spots and couldn't say which a kid would hit first.</p>
        <p class="h01-fine">Change one line and run it again on the same repo:</p>
        <div class="h01-diff"><p class="h01-del">- ${idea.fix.before}</p><p class="h01-add">+ ${idea.fix.after}</p></div>
        <div class="h01-actions-row"><button type="button" class="h01-ui-button" data-rerun>Make that edit and run rev 2</button></div>`;
      outcome.querySelector('[data-rerun]')!.addEventListener('click', () => {
        if (current) showCollection(idea, current, 2);
        collection.querySelector('[data-prompt]')?.classList.add('is-sent');
        play(idea, 2);
      });
      outcome.querySelector<HTMLButtonElement>('[data-rerun]')!.focus({ preventScroll: true });
      return;
    }
    outcome.innerHTML = `<p class="h01-verdict-line"><span class="h01-verdict h01-verdict-pass">Pass</span>The agent's assessment.${idea.fix ? ` ${idea.fix.lesson}` : ''} Whether you keep it is your call.</p>
      <div class="h01-actions-row"><button type="button" class="h01-ui-button h01-approve" data-approve>Approve rev ${revision} as ${idea.skill}</button><button type="button" class="h01-ui-button h01-ghost" data-skip>Not for me</button></div>`;
    outcome.querySelector<HTMLButtonElement>('[data-approve]')!.focus({ preventScroll: true });
    outcome.querySelector('[data-skip]')!.addEventListener('click', () => { idleTest('Drag a prompt here'); collection.querySelector('[data-prompt]')?.classList.remove('is-sent'); });
    outcome.querySelector('[data-approve]')!.addEventListener('click', async () => {
      outcome.innerHTML = `<p class="h01-verdict-line"><span class="h01-verdict h01-verdict-pass">Approved</span>Pinned rev ${revision} and published it to your Kiln repo on GitHub. Landing it on your panel…</p>`;
      await wait(650);
      const row = panel.add(idea.skill, revision);
      row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
      row.querySelector<HTMLButtonElement>('.h01-switch')?.focus({ preventScroll: true });
      outcome.innerHTML = `<p class="h01-verdict-line"><span class="h01-verdict h01-verdict-pass">Approved</span><b>${idea.skill}</b> rev ${revision} is a new row on your panel. Pick where it installs.</p>
        <div class="h01-actions-row"><a class="h01-ui-button" href="#h01-panel" data-see>Show me the row</a><button type="button" class="h01-ui-button h01-ghost" data-restart>Try another source</button></div>`;
      outcome.querySelector('[data-see]')!.addEventListener('click', event => { event.preventDefault(); row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); row.querySelector<HTMLButtonElement>('.h01-switch')?.focus({ preventScroll: true }); });
      outcome.querySelector('[data-restart]')!.addEventListener('click', () => {
        sources.forEach(source => source.classList.remove('is-captured')); capture.dataset.state = ''; captureLive.innerHTML = '';
        collection.innerHTML = '<p class="h01-placeholder">What Kiln pulls out of a source shows up here.</p>'; current = null; idleTest();
        sources[0].querySelector<HTMLButtonElement>('[data-add]')?.focus();
      });
    });
  }

  sources.forEach(source => {
    const id = source.dataset.source as Source;
    source.querySelector('[data-add]')!.addEventListener('click', () => captureSource(id));
    draggable(source, { zone: () => captureZone, enabled: () => !busy, onDrop: () => captureSource(id) });
  });
  idleTest();
}
