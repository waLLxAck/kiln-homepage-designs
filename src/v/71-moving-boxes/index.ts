// PROTOTYPE round 5, H11: moving boxes. Your skill folders are kraft boxes scrawled on in marker; their flaps fall open and the
// skill files inside fly (FLIP) into a crisp, warm Kiln panel. Act two: new ideas arrive as parcels you drag into Kiln's capture
// area, the prompt you get out of one is dragged into Test, and once approved it moves in as a new row on the same panel.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, line, poly, reseed } from '../r3-kit/rough';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const robot = navigator.webdriver;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const windowsMark = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const logo = (size = 18) => `<svg class="h11-logo" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1f1c18"/><path d="M8 25V16a8 8 0 0 1 16 0v9z" fill="#f6efe3"/><path d="M13 25v-5.5a3 3 0 0 1 6 0V25z" fill="#e8892b"/></svg>`;
const icon = (d: string, size = 16) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icons = {
  capture: 'M10 3.5v9M6 8.5l4 4 4-4M3.5 14v2.5h13V14',
  library: 'M4 3.5v13M8 3.5v13M11.5 4.2l3.8 12',
  tests: 'M8 3h4M8.8 3v5L4.5 15.2a1.3 1.3 0 0 0 1.1 1.8h8.8a1.3 1.3 0 0 0 1.1-1.8L11.2 8V3M6.5 12h7',
  skills: 'M3 6.5h8M3 13.5h5M14 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16 6.5h1M14 13.5h3',
  read: 'M5 2.8h6.5L15 6.3v10.9H5zM11.5 2.8v3.5H15M7.5 10h5M7.5 13h3.5',
  search: 'M8.5 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 12l4.5 4.5',
  run: 'M3.5 5.5l4 4-4 4M9.5 14.5h7',
  think: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4',
  star: 'M10 2.8l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5L2.8 8l5-.6z',
  link: 'M8.5 11.5l3-3M7 9.5 5.3 11.2a2.5 2.5 0 0 0 3.5 3.5L10.5 13M13 10.5l1.7-1.7a2.5 2.5 0 0 0-3.5-3.5L9.5 7M4 4l12 12',
  folder: 'M3 5.5h5l1.5 1.5H17v8.5H3z',
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  grip: 'M7 5h.01M13 5h.01M7 10h.01M13 10h.01M7 15h.01M13 15h.01',
};
const titlebar = (title: string) => `<div class="h11-titlebar">${logo(15)}<span>${title}</span><i class="h11-winctl" aria-hidden="true"><b></b><b></b><b></b></i></div>`;

// ---------- the panel data (shared by both acts) ----------

type Cell = 'on' | 'off' | 'edited' | 'found';
type Col = 'claude' | 'agents' | 'codex' | 'copilot' | 'game';
type Row = { id: string; note: string; cells: Record<Col, Cell>; copies: number; fresh?: boolean; imported?: boolean };
const cols: { key: Col; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Shared', short: 'Shared', path: '~/.agents/skills' },
  { key: 'codex', name: 'Codex', short: 'Codex', path: '.codex/skills' },
  { key: 'copilot', name: 'Copilot', short: 'Copilot', path: '.copilot/skills' },
  { key: 'game', name: 'my-game', short: 'my-game', path: '.github/skills' },
];
const cells = (on: Partial<Record<Col, Cell>>): Record<Col, Cell> => ({ claude: 'off', agents: 'off', codex: 'off', copilot: 'off', game: 'off', ...on });
const rows: Row[] = [
  { id: 'code-review', note: 'Approved rev 3', copies: 4, cells: cells({ claude: 'edited', agents: 'on', game: 'on' }) },
  { id: 'research', note: 'Approved rev 2', copies: 2, cells: cells({ claude: 'on', codex: 'on' }) },
  { id: 'writing-for-agents', note: 'Approved rev 1', copies: 1, cells: cells({ claude: 'on' }) },
  { id: 'playtest-brief', note: 'Approved rev 4', copies: 1, cells: cells({ game: 'on' }) },
  { id: 'pr-summary', note: 'Found outside your library', copies: 1, cells: cells({ agents: 'found' }) },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };

// ---------- the boxes (drawing 1) ----------

type FileDef = { name: string; x: number; r: number; lift?: number; row?: string; col?: Col; slot?: string; kind?: 'broken' | 'edited' | 'forgot' | 'stale'; note?: string; noteRight?: boolean };
type Scrawl = [text: string, x: number, y: number, r: number, size: number, cls?: string];
type BoxDef = { id: string; path: string; W: number; H: number; tilt: number; closed?: boolean; files: FileDef[]; label: [x: number, y: number, r: number, size: number]; scrawls: Scrawl[]; up?: boolean };
const boxes: BoxDef[] = [
  { id: 'claude', path: '~/.claude/skills', W: 250, H: 165, tilt: -1.4, label: [8, 40, -3, 19],
    scrawls: [['FRAGILE', 58, 70, -6, 17, 'h11-stamp'], ['claude', 10, 76, 2, 15]],
    files: [
      { name: 'code-review', x: 3, r: -7, lift: 2, row: 'code-review', col: 'claude', kind: 'edited', note: 'edited by me?' },
      { name: 'code-review (1)', x: 26, r: 4, lift: 8, row: 'code-review', slot: 'clean-stale', kind: 'stale' },
      { name: 'research', x: 49, r: -3, lift: 0, row: 'research', col: 'claude' },
      { name: 'writing-for-agents', x: 71, r: 6, lift: 5, row: 'writing-for-agents', col: 'claude' },
    ] },
  { id: 'agents', path: '~/.agents/skills', W: 225, H: 150, tilt: 1.2, label: [8, 42, -2, 18],
    scrawls: [['shared w/ codex + copilot??', 9, 74, -2, 13]],
    files: [
      { name: 'code-review', x: 4, r: -4, lift: 4, row: 'code-review', col: 'agents' },
      { name: 'pr-summary', x: 36, r: 5, lift: 10, row: 'pr-summary', col: 'agents', kind: 'forgot', note: 'what is this' },
      { name: 'old-link', x: 66, r: -6, lift: 1, slot: 'clean-link', kind: 'broken', note: '→ nowhere', noteRight: true },
    ] },
  { id: 'copilot', path: '.copilot/skills', W: 140, H: 96, tilt: 4, closed: true, label: [10, 44, -4, 15],
    scrawls: [['empty?', 50, 78, 5, 14]], files: [] },
  { id: 'codex', path: '.codex/skills', W: 175, H: 125, tilt: -.6, label: [10, 44, 2, 19],
    scrawls: [['misc??', 52, 76, -5, 17]],
    files: [{ name: 'research', x: 22, r: 3, lift: 3, row: 'research', col: 'codex', note: 'again?' }] },
  { id: 'game', path: 'my-game/.github/skills', W: 215, H: 145, tilt: .8, label: [7, 42, -1.5, 16], up: true,
    scrawls: [['THIS SIDE UP', 36, 82, 0, 12]],
    files: [
      { name: 'code-review', x: 8, r: -5, lift: 6, row: 'code-review', col: 'game' },
      { name: 'playtest-brief', x: 50, r: 4, lift: 0, row: 'playtest-brief', col: 'game' },
    ] },
];

function boxMarkup(box: BoxDef, n: number) {
  const { W, H } = box;
  reseed(31 + n * 17);
  const outline = poly([[2, 3], [W - 3, 1], [W - 2, H - 2], [3, H - 3]], true, 1.6);
  const lip = line(5, 12, W - 6, 10, 1.1);
  const tape = `M${W * .43},0 L${W * .57},0 L${W * .575},${H * .33} L${W * .55},${H * .3} L${W * .525},${H * .35} L${W * .5},${H * .3} L${W * .475},${H * .34} L${W * .45},${H * .3} L${W * .43},${H * .33} Z`;
  const scuffs = `${line(W * .08, H * .86, W * .3, H * .88, .8)} ${line(W * .7, H * .8, W * .9, H * .79, .8)}`;
  const up = box.up ? `${arrow(W * .14, H * .92, W * .14, H * .62, 0, 9)} ${arrow(W * .26, H * .92, W * .26, H * .62, 0, 9)}` : '';
  const flap = (side: 'l' | 'r') => { const d = poly([[1, 2], [99, 3], [98, 14], [2, 13]], true, 1.2); return `<svg class="h11-flap h11-flap-${side}" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M1,2 L99,3 L98,14 L2,13 Z" class="h11-kraft-l"/><path d="${d}" class="h11-ink" vector-effect="non-scaling-stroke"/></svg>`; };
  const files = box.files.map((file, f) => `<div class="h11-file${file.kind ? ` h11-file-${file.kind}` : ''}" data-file="${box.id}-${f}" style="--x:${file.x}%;--r:${file.r}deg;--lift:${file.lift ?? 0}">
    ${file.note ? `<em${file.noteRight ? ' class="is-right"' : ''}>${file.note}</em>` : ''}<b>${file.name}</b><i></i><i></i><i></i></div>`).join('');
  const [lx, ly, lr, ls] = box.label;
  return `<div class="h11-box h11-box-${box.id}${box.closed ? ' is-closed' : ''}" data-box="${box.id}" style="--bw:${W};--bh:${H};--tilt:${box.tilt}deg">
    <div class="h11-box-in">
      <div class="h11-files">${files}</div>
      ${flap('l')}${flap('r')}
      <svg class="h11-face" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <path d="M2,3 L${W - 3},1 L${W - 2},${H - 2} L3,${H - 3} Z" class="h11-kraft"/>
        <path d="${tape}" class="h11-tape"/>
        <path d="${scuffs}" class="h11-scuff"/>
        <path d="${outline} ${lip} ${up}" class="h11-ink"/>
      </svg>
      <p class="h11-path" style="--lx:${lx}%;--ly:${ly}%;--lr:${lr}deg;--ls:${ls}">${box.path}</p>
      ${box.scrawls.map(([text, x, y, r, size, cls]) => `<p class="h11-scrawl ${cls ?? ''}" style="--lx:${x}%;--ly:${y}%;--lr:${r}deg;--ls:${size}">${text}</p>`).join('')}
    </div>
  </div>`;
}

function floor() {
  reseed(5);
  return `<div class="h11-floor" data-floor role="img" aria-label="Five cardboard moving boxes scrawled on in marker: ~/.claude/skills marked fragile, ~/.agents/skills, a taped-shut .copilot/skills marked empty, .codex/skills marked misc, and my-game/.github/skills. Skill files stick out of the open ones: code-review in three boxes plus a code-review (1), research twice, writing-for-agents, pr-summary with a note saying what is this, playtest-brief, and old-link, a broken link to nowhere.">
    <div class="h11-boxes">${boxes.map(boxMarkup).join('')}</div>
    <svg class="h11-floorline" viewBox="0 0 1200 12" preserveAspectRatio="none" aria-hidden="true"><path d="${line(0, 6, 1200, 5, 2.4)}" class="h11-ink" vector-effect="non-scaling-stroke"/></svg>
  </div>`;
}

// ---------- the panel (crisp) ----------

const toggle = (row: Row, col: typeof cols[number], where: string) => {
  const state = row.cells[col.key];
  return `<button type="button" class="h11-sw h11-sw-${state}" data-row="${row.id}" data-col="${col.key}" data-where="${where}" role="switch" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.id} in ${col.name} (${col.path}): ${stateText[state]}"><i></i></button>`;
};
function rowMarkup(row: Row, where: string, landed: boolean) {
  const caption = row.copies > 1 ? `${row.note} · ${row.copies} copies, one row` : row.note;
  return `<tr data-row="${row.id}" class="${landed || row.fresh ? 'is-in' : ''}${row.fresh ? ' is-fresh' : ''}">
    <th scope="row"><b data-aim>${row.id}</b><small data-caption>${caption}</small></th>
    ${cols.map(col => `<td data-cell="${col.key}">${toggle(row, col, where)}</td>`).join('')}</tr>`;
}
function tableMarkup(where: string) {
  return `<div class="h11-table-wrap"><table class="h11-table">
    <thead><tr><th scope="col" class="h11-th-skill">Skill</th>${cols.map(col => `<th scope="col"><span class="h11-long">${col.name}</span><span class="h11-short">${col.short}</span><code>${col.path}</code></th>`).join('')}</tr></thead>
    <tbody data-rows="${where}"></tbody></table></div>
    <ul class="h11-legend" aria-label="What the switches mean">
      <li><i class="h11-mini h11-mini-on"></i>Installed</li><li><i class="h11-mini h11-mini-off"></i>Off</li>
      <li><i class="h11-mini h11-mini-edited"></i>Edited outside Kiln</li><li><i class="h11-mini h11-mini-found"></i>Found outside your library</li>
    </ul>`;
}

function panelWindow() {
  return `<div class="h11-win h11-panel" data-panel-win role="region" aria-label="Kiln skills panel, sample library">
    ${titlebar('Kiln')}
    <div class="h11-panel-body">
      <div class="h11-panel-head"><div><h3>Skills</h3><p>Sample library. One row per skill, one switch per place your agents look.</p></div><span class="h11-searchbox">${icon(icons.search, 14)}Search skills</span></div>
      <div class="h11-table-zone">${tableMarkup('top')}
        <div class="h11-empty" data-empty><p>Five folders, not unpacked yet.</p><button type="button" class="h11-btn h11-btn-ink" data-unpack-inner>Unpack the boxes</button></div>
      </div>
      <div class="h11-clean" data-clean>
        <p class="h11-clean-title">Safe to clean up</p>
        <ul>
          <li data-slot="clean-link">${icon(icons.link, 14)}<span><code>~/.agents/skills/old-link</code> broken link</span></li>
          <li data-slot="clean-empty">${icon(icons.folder, 14)}<span><code>.copilot/skills</code> empty folder</span></li>
          <li data-slot="clean-stale">${icon(icons.read, 14)}<span><code>~/.claude/skills/code-review (1)</code> older copy, differs from rev 3</span></li>
        </ul>
        <button type="button" class="h11-btn h11-btn-sm" data-clean-go>Clean up 3 items</button>
      </div>
      <div class="h11-flyout" data-flyout="top" hidden></div>
      <p class="h11-status" data-status="top" aria-live="polite"></p>
      <p class="h11-context" data-context="top"></p>
    </div>
  </div>`;
}

// ---------- the sources (drawing 2: parcels with crisp printed labels) ----------

type SourceId = 'yt' | 'x' | 'gh';
type Step = [kind: 'read' | 'search' | 'run' | 'think', text: string];
type Source = {
  id: SourceId; name: string; add: string; note: string; tape: string; chip: string; chipMeta: string; analyzing: string; found: string; collection: string;
  star: { kind: string; title: string; body: string; from?: string; testable: boolean };
  cards: { kind: 'Technique' | 'Insight' | 'Tool' | 'Source note' | 'Resource'; title: string; from?: string }[];
  test?: { skill: string; steps: Step[]; fix?: { before: string; after: string; last: Step; uncertain: string }; pass: string; tokens: [number, number, number] };
};
const sources: Source[] = [
  { id: 'yt', name: 'YouTube video', add: 'Add the video to Kiln', note: 'watch later!!', tape: 'l', chip: 'Shipping with agents: the fresh-eyes trick', chipMeta: 'Dev Dinner · 18:47 · sample video',
    analyzing: 'Reading the captions of an 18-minute video', found: 'Found a prompt, a technique, an insight and a tool. Each one links to its minute in the video.', collection: 'Fresh eyes',
    star: { kind: 'Prompt', title: examples[0].title, body: examples[0].prompt, from: '04:12', testable: true },
    cards: [{ kind: 'Technique', title: 'Give the agent a persona with limits', from: '06:30' }, { kind: 'Insight', title: 'People who know an app stop seeing its friction', from: '02:05' }, { kind: 'Tool', title: 'A browser the agent can click through', from: '11:48' }],
    test: { skill: 'fresh-eyes-check', tokens: [36.4, 20.1, 1.8],
      steps: [['read', 'Read README.md and package.json'], ['run', 'Ran git ls-files src/screens'], ['read', 'Opened src/screens/Start.tsx and Levels.tsx'], ['think', 'Found two confusing spots, not sure which comes first']],
      fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', last: ['think', 'First obstacle: the play button is an icon with no label. Quoted it, suggested a fix.'], uncertain: 'It found two confusing spots and could not say which one a seven-year-old would hit first.' },
      pass: 'It named one obstacle and quoted the screen.' } },
  { id: 'x', name: 'Post on X', add: 'Add the post to Kiln', note: 'try this one day', tape: 'r', chip: 'Post by Tessa Ko (@tessakodes)', chipMeta: 'Fictional post · sample',
    analyzing: 'Reading the post', found: 'Found a prompt, a technique, an insight and a tool, linked to the post.', collection: 'Agent workflows',
    star: { kind: 'Prompt', title: examples[1].title, body: examples[1].prompt, testable: true },
    cards: [{ kind: 'Technique', title: 'Fix the instruction, not the output' }, { kind: 'Insight', title: 'One stale line in AGENTS.md repeats the same mistake' }, { kind: 'Tool', title: 'AGENTS.md and CLAUDE.md, side by side' }],
    test: { skill: 'instruction-trace', tokens: [28.9, 16.2, 1.3],
      steps: [['read', 'Read AGENTS.md and CLAUDE.md'], ['search', 'Searched the repo for "run every test"'], ['run', 'Ran git log -3 -- AGENTS.md'], ['think', 'Traced it to one outdated line, proposed a one-line change']],
      pass: 'It traced the decision to one outdated line and proposed the smallest change.' } },
  { id: 'gh', name: 'GitHub repository', add: 'Add the repo to Kiln', note: 'import??', tape: 'l', chip: 'mattpocock/skills', chipMeta: 'GitHub repository · skills/, README.md, LICENSE',
    analyzing: 'Importing the skills in skills/ as drafts', found: 'Imported every skill in skills/ as a draft, linked to the repository. Nothing is installed.', collection: 'mattpocock/skills',
    star: { kind: 'Skills repository', title: 'mattpocock/skills, imported as drafts', body: 'Each folder in skills/ is now a draft in this collection, linked back to the repository. The repo stays as it is, and nothing installs until you test a draft and approve it.', testable: false },
    cards: [{ kind: 'Source note', title: 'README.md, kept with the collection' }, { kind: 'Resource', title: 'LICENSE, kept with the drafts' }] },
];

function sourceRender(source: Source) {
  if (source.id === 'yt') return `<div class="h11-yt">
      <div class="h11-yt-thumb"><span class="h11-yt-words">fresh<br>eyes</span><span class="h11-yt-play" aria-hidden="true"><i></i></span><span class="h11-yt-time">18:47</span><span class="h11-yt-bar"><i></i></span></div>
      <div class="h11-yt-meta"><span class="h11-avatar h11-av-yt">DD</span><div><b>Shipping with agents: the fresh-eyes trick</b><small>Dev Dinner · sample video</small></div></div>
    </div>`;
  if (source.id === 'x') return `<div class="h11-x">
      <div class="h11-x-head"><span class="h11-avatar h11-av-x">TK</span><div><b>Tessa Ko</b><small>@tessakodes · 2h</small></div><span class="h11-x-mark" aria-hidden="true"></span></div>
      <p>When your agent does the thing you didn't mean, don't just correct it. Ask it to trace the decision back to the instruction that caused it. Then fix the instruction.</p>
      <div class="h11-x-actions" aria-hidden="true">${icon('M4 5h12v8H9l-4 3v-3H4z', 13)}${icon('M5 8l3-3 3 3M8 5v8h6M15 12l-3 3-3-3', 13)}${icon('M10 16s-6-3.6-6-8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4.4-6 8-6 8z', 13)}</div>
    </div>`;
  return `<div class="h11-gh">
      <div class="h11-gh-head">${icon('M5 3.5h10v13H6.5A1.5 1.5 0 0 1 5 15zM5 14.5A1.5 1.5 0 0 1 6.5 13H15', 14)}<b><span>mattpocock</span> / skills</b><span class="h11-gh-pill">Public</span></div>
      <div class="h11-gh-bar"><span class="h11-gh-branch">main</span><span class="h11-gh-code">Code <i aria-hidden="true">▾</i></span></div>
      <ul class="h11-gh-files"><li>${icon(icons.folder, 13)}skills</li><li>${icon(icons.read, 13)}README.md</li><li>${icon(icons.read, 13)}LICENSE</li></ul>
    </div>`;
}

function parcelMarkup(source: Source, n: number) {
  reseed(71 + n * 13);
  const edge = poly([[3, 4], [297, 2], [298, 196], [2, 198]], true, 2);
  return `<div class="h11-parcel h11-parcel-${source.id}" role="listitem" data-parcel="${source.id}">
    <div class="h11-parcel-art" data-drag-parcel="${source.id}" aria-hidden="true">
      <svg class="h11-parcel-paper" viewBox="0 0 300 200" preserveAspectRatio="none"><path d="M3,4 L297,2 L298,196 L2,198 Z" class="h11-kraft"/><path d="${edge}" class="h11-ink" vector-effect="non-scaling-stroke"/><path d="M0,70 L300,64 M0,76 L300,70" class="h11-twine" vector-effect="non-scaling-stroke"/></svg>
      <div class="h11-label">${sourceRender(source)}<i class="h11-tape-bit h11-tape-a"></i><i class="h11-tape-bit h11-tape-b"></i></div>
      <p class="h11-parcel-note">${source.note}</p>
    </div>
    <button type="button" class="h11-btn h11-btn-sm h11-add" data-add="${source.id}"><span>${source.add}</span></button>
  </div>`;
}

function studioWindow() {
  return `<div class="h11-win h11-studio" data-studio role="region" aria-label="Kiln capture and test, sample">
    ${titlebar('Kiln')}
    <div class="h11-studio-body">
      <nav class="h11-rail" aria-label="Kiln views (sample)">
        <button type="button" class="is-on" data-view-btn="capture" aria-pressed="true">${icon(icons.capture, 18)}<span>Capture</span></button>
        <span>${icon(icons.library, 18)}<span>Library</span></span>
        <span>${icon(icons.tests, 18)}<span>Tests</span></span>
        <button type="button" data-view-btn="skills" aria-pressed="false">${icon(icons.skills, 18)}<span>Skills</span></button>
      </nav>
      <div class="h11-views">
        <div class="h11-view" data-view="capture">
          <div class="h11-capture" data-capture>
            <div class="h11-capture-idle">
              <span class="h11-capture-icon">${icon(icons.capture, 22)}</span>
              <div><p class="h11-capture-title">Drop a video, a post, a repo or a screenshot</p>
              <p class="h11-capture-sub">Kiln analyzes it and adds what it finds to a collection. From anywhere else, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>.</p></div>
              <div class="h11-capture-actions"><span class="h11-fakebtn">Save only</span><span class="h11-fakebtn h11-fakebtn-ink" data-analyze>Analyze and add</span></div>
            </div>
            <div class="h11-capture-busy" data-capture-busy hidden></div>
          </div>
          <div class="h11-work">
            <div class="h11-collection" data-collection><p class="h11-placeholder">The collection shows up here: one prompt, and the techniques, insights and tools around it.</p></div>
            <div class="h11-test" data-test>
              <div class="h11-test-head"><h4>Test</h4><span class="h11-badge h11-badge-ro">Read-only</span></div>
              <div class="h11-test-pick">
                <label><span>Project (sample)</span><select data-repo><option value="~/code/my-game">~/code/my-game</option><option value="~/code/shop-api">~/code/shop-api</option></select></label>
                <label><span>Agent</span><select data-agent><option>Claude Code</option><option>Codex</option></select></label>
              </div>
              <div class="h11-run" data-run aria-live="polite"></div>
            </div>
          </div>
        </div>
        <div class="h11-view h11-view-skills" data-view="skills" hidden>
          <div class="h11-skills-head"><div><h4 data-skills-title>Skills</h4><p data-skills-sub>The same panel as up top, sample library.</p></div><div class="h11-skills-actions"><a class="h11-btn h11-btn-sm" href="#h11-unpack" data-see-top>See it on the panel above</a><button type="button" class="h11-btn h11-btn-sm h11-btn-ink" data-again>Capture another</button></div></div>
          ${tableMarkup('studio')}
          <div class="h11-flyout" data-flyout="studio" hidden></div>
          <p class="h11-status" data-status="studio" aria-live="polite"></p>
          <p class="h11-context" data-context="studio"></p>
        </div>
      </div>
    </div>
  </div>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h11" data-root>
    <a class="skip" href="#h11-main">Skip to content</a>
    <header class="h11-top"><a class="h11-brand" href="#h11-main">${logo(24)}<span>Kiln</span></a>
      <nav aria-label="Main navigation"><a href="#h11-unpack">Unpack</a><a href="#h11-new">New skills</a><a href="#h11-get" class="h11-top-get">Download</a></nav></header>
    <main id="h11-main">
      <section class="h11-hero" aria-labelledby="h11-title">
        <h1 id="h11-title">My agents were loading skills I forgot I had.</h1>
        <div class="h11-hero-row">
          <p>They were packed into five folders I never opened again. Some were in there twice, one I'd edited by hand, one was a link to nowhere. Kiln unpacks all of it into one panel, and tests every new prompt on my own repo before it moves in.</p>
          <div class="h11-hero-cta"><a class="h11-btn h11-btn-ink h11-btn-big" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <p class="h11-fine">Free, MIT licensed. The release is in a private GitHub repository, so you need an account with access.</p></div>
        </div>
        ${floor()}
      </section>
      <section class="h11-unpack" id="h11-unpack" aria-labelledby="h11-unpack-title">
        <h2 id="h11-unpack-title">Unpacked: one row per skill, one switch per folder.</h2>
        <div class="h11-unpack-copy">
          <p>Copies of the same skill merge into one row. The broken link and the empty folder are flagged for safe cleanup, and the copy I edited by hand shows up amber.</p>
          <p class="h11-token">Every switched-on skill puts its description into that agent's context on every turn, used or not. Switching off what you don't use keeps it lean.</p>
          <button type="button" class="h11-btn" data-unpack>Unpack the boxes</button>
        </div>
        ${panelWindow()}
        <p class="visually-hidden" data-unpack-live aria-live="polite"></p>
      </section>
      <section class="h11-new" id="h11-new" aria-labelledby="h11-new-title">
        <div class="h11-new-head">
          <h2 id="h11-new-title">So how do new skills get in?</h2>
          <p>Mine used to arrive as a video, a post or a repo, get saved for later, and never get opened. Now I drag them into Kiln. It pulls out the prompt, I test it on my repo, and the ones that work move in as skills.</p>
        </div>
        <div class="h11-new-grid">
          <div class="h11-parcels-wrap">
            <p class="h11-hint"><b>1</b> Drag a parcel into Kiln, or use its button.</p>
            <div class="h11-parcels" role="list" aria-label="Saved sources">${sources.map(parcelMarkup).join('')}</div>
          </div>
          ${studioWindow()}
        </div>
      </section>
      <section class="h11-get" id="h11-get" aria-labelledby="h11-get-title">
        <h2 id="h11-get-title">Unpack once. Test what arrives next.</h2>
        <ul class="h11-facts">
          <li><b>Your subscription, no API key.</b> Tests run through the Codex or Claude Code you're signed into. Its usage limits still apply.</li>
          <li><b>Tests are read-only.</b> Nothing in your code changes. The agent's verdict and yours are kept apart.</li>
          <li><b>Approval pins a revision.</b> That exact snapshot is published to your own Kiln repository on GitHub.</li>
          <li><b>Windows app, plus a CLI.</b> Works with Codex, Claude Code and Copilot. MIT licensed.</li>
        </ul>
        <div class="h11-get-cta"><a class="h11-btn h11-btn-ink h11-btn-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
        <p class="h11-fine">The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned, so Windows may ask before it runs.</p></div>
      </section>
    </main>
    <div class="h11-fly" data-fly aria-hidden="true"></div>
  </div>`;
  const panels = bindPanels(root);
  const unpack = bindUnpack(root, panels);
  bindStudio(root, panels, unpack);
}

// ---------- behaviour: panels ----------

type Panels = { draw(): void; landed: Set<string>; add(row: Row): void; row(where: string, id: string): HTMLElement | null; say(where: string, text: string): void };
function bindPanels(root: HTMLElement): Panels {
  const landed = new Set<string>();
  const bodies = () => [...root.querySelectorAll<HTMLElement>('[data-rows]')];
  const say = (where: string, text: string) => { const el = root.querySelector<HTMLElement>(`[data-status="${where}"]`)!; el.textContent = text; el.classList.remove('is-new'); void el.offsetWidth; el.classList.add('is-new'); };
  const context = () => {
    const on = rows.reduce((sum, row) => sum + cols.filter(col => row.cells[col.key] === 'on' || row.cells[col.key] === 'edited').length, 0);
    root.querySelectorAll<HTMLElement>('[data-context]').forEach(el => { el.textContent = `${on} installed copies are loaded into new sessions right now. Each description rides along on every turn. Kiln shows what is installed where; it doesn't meter tokens per skill.`; });
  };
  const draw = () => {
    bodies().forEach(body => { const where = body.dataset.rows!; body.innerHTML = rows.map(row => rowMarkup(row, where, where === 'studio' || landed.has(row.id))).join(''); });
    context();
  };
  const flyoutFor = (where: string) => root.querySelector<HTMLElement>(`[data-flyout="${where}"]`)!;
  let returnTo: HTMLElement | null = null;
  const closeFlyout = (where: string) => { const fly = flyoutFor(where); if (fly.hidden) return; fly.hidden = true; returnTo?.focus(); returnTo = null; };
  const focusSwitch = (where: string, id: string, col: string) => root.querySelector<HTMLElement>(`[data-rows="${where}"] [data-row="${id}"][data-col="${col}"]`)?.focus();
  root.addEventListener('click', event => {
    const target = event.target as Element;
    const sw = target.closest<HTMLButtonElement>('.h11-sw');
    if (sw) {
      const where = sw.dataset.where!, row = rows.find(item => item.id === sw.dataset.row)!, col = cols.find(item => item.key === sw.dataset.col)!, state = row.cells[col.key];
      if (state === 'edited' || state === 'found') {
        const fly = flyoutFor(where);
        fly.dataset.row = row.id; fly.dataset.col = col.key;
        fly.innerHTML = state === 'edited'
          ? `<p><b>${col.path}/${row.id}</b> was edited outside Kiln. Compared with approved rev 3:</p><div class="h11-diff"><p class="h11-del">- Review standards and the specification separately.</p><p class="h11-add">+ Review the specification only. Skip style.</p></div>
             <div class="h11-actions"><button type="button" class="h11-btn h11-btn-sm h11-btn-ink" data-fly="replace">Replace with rev 3</button><button type="button" class="h11-btn h11-btn-sm" data-fly="draft">Keep my edit as draft rev 4</button><button type="button" class="h11-btn h11-btn-sm h11-btn-quiet" data-fly="close">Cancel</button></div>`
          : `<p><b>${row.id}</b> is in <code>${col.path}</code> but not in your library.${row.imported ? ' It is a draft now; approve it to manage this copy.' : ''}</p>
             <div class="h11-actions">${row.imported ? '' : '<button type="button" class="h11-btn h11-btn-sm h11-btn-ink" data-fly="import">Import as a draft</button>'}<button type="button" class="h11-btn h11-btn-sm h11-btn-quiet" data-fly="close">${row.imported ? 'OK' : 'Not now'}</button></div>`;
        fly.hidden = false; returnTo = sw;
        fly.querySelector<HTMLElement>('button')?.focus();
        return;
      }
      row.cells[col.key] = state === 'on' ? 'off' : 'on';
      draw();
      say(where, state === 'on' ? `Removed ${row.id} from ${col.path}. It stays in your library, history and all.` : `Installed the approved ${row.id} into ${col.path}. Receipt saved.`);
      focusSwitch(where, row.id, col.key);
      return;
    }
    const action = target.closest<HTMLElement>('[data-fly]');
    if (action) {
      const fly = action.closest<HTMLElement>('[data-flyout]')!, where = fly.dataset.flyout!, row = rows.find(item => item.id === fly.dataset.row)!, key = fly.dataset.col as Col;
      const kind = action.dataset.fly;
      if (kind === 'replace') { row.cells[key] = 'on'; say(where, 'Moved the hand-edited copy to a private backup and installed rev 3.'); }
      if (kind === 'draft') { row.cells[key] = 'on'; row.note = 'Approved rev 3, draft rev 4'; say(where, 'Saved your edit as draft rev 4. Rev 3 stays installed until you approve it.'); }
      if (kind === 'import') { row.imported = true; row.note = 'Draft, imported'; say(where, `Imported ${row.id} as a draft. The folder in ${cols.find(col => col.key === key)!.path} hasn't moved.`); }
      if (kind !== 'close') { draw(); fly.hidden = true; focusSwitch(where, row.id, key); returnTo = null; return; }
      closeFlyout(where);
    }
  });
  root.addEventListener('keydown', event => {
    const fly = (event.target as Element).closest<HTMLElement>('[data-flyout]');
    if (fly && event.key === 'Escape') { event.preventDefault(); closeFlyout(fly.dataset.flyout!); }
  });
  draw();
  return {
    draw, landed, say,
    row: (where, id) => root.querySelector<HTMLElement>(`[data-rows="${where}"] [data-row="${id}"]`),
    add(row) { if (!rows.some(item => item.id === row.id)) rows.push(row); draw(); },
  };
}

// ---------- behaviour: unpacking (FLIP from box to panel) ----------

type Unpack = { finishNow(): void };
function bindUnpack(root: HTMLElement, panels: Panels): Unpack {
  const floorEl = root.querySelector<HTMLElement>('[data-floor]')!;
  const win = root.querySelector<HTMLElement>('[data-panel-win]')!;
  const zone = win.querySelector<HTMLElement>('.h11-table-zone')!;
  const empty = win.querySelector<HTMLElement>('[data-empty]')!;
  const clean = win.querySelector<HTMLElement>('[data-clean]')!;
  const cleanGo = clean.querySelector<HTMLButtonElement>('[data-clean-go]')!;
  const button = root.querySelector<HTMLButtonElement>('[data-unpack]')!;
  const live = root.querySelector<HTMLElement>('[data-unpack-live]')!;
  const layer = root.querySelector<HTMLElement>('[data-fly]')!;
  const boxEls = [...floorEl.querySelectorAll<HTMLElement>('[data-box]')];
  type Flight = { el: HTMLElement; def: FileDef; box: BoxDef };
  const flights: Flight[] = boxes.flatMap((box, b) => box.files.map((def, f) => ({ el: boxEls[b].querySelector<HTMLElement>(`[data-file="${box.id}-${f}"]`)!, def, box })));
  let state: 'packed' | 'moving' | 'unpacked' = 'packed', touched = false, cleaned = false;

  const setState = (next: typeof state) => {
    state = next;
    button.textContent = next === 'packed' ? 'Unpack the boxes' : 'Pack it all back up';
    button.disabled = next === 'moving';
    win.querySelector<HTMLElement>('.h11-panel-body')!.inert = next !== 'unpacked';
    empty.hidden = next !== 'packed';
    win.classList.toggle('is-packed', next === 'packed');
  };
  const slotEl = (slot: string) => clean.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
  const aimFor = (def: FileDef): HTMLElement => {
    if (def.row && def.col) return panels.row('top', def.row)!.querySelector<HTMLElement>(`[data-col="${def.col}"]`)!;
    if (def.row) return panels.row('top', def.row)!.querySelector<HTMLElement>('[data-aim]')!;
    return slotEl(def.slot!);
  };
  const hit = (el: HTMLElement) => { el.classList.remove('is-hit'); void el.offsetWidth; el.classList.add('is-hit'); };
  const land = (def: FileDef) => {
    if (def.row) {
      panels.landed.add(def.row);
      const tr = panels.row('top', def.row)!;
      const already = tr.classList.contains('is-in');
      tr.classList.add('is-in');
      hit(already ? tr.querySelector<HTMLElement>('[data-aim]')! : tr);
      if (def.col) hit(tr.querySelector<HTMLElement>(`[data-col="${def.col}"]`)!);
    }
    if (def.slot && !cleaned) { clean.classList.add('is-in'); slotEl(def.slot).classList.add('is-in'); hit(slotEl(def.slot)); }
  };
  const showAll = (on: boolean) => {
    if (on) rows.forEach(row => panels.landed.add(row.id)); else panels.landed.clear();
    panels.draw();
    clean.classList.toggle('is-in', on && !cleaned);
    clean.querySelectorAll('[data-slot]').forEach(slot => slot.classList.toggle('is-in', on));
  };
  const instant = (open: boolean) => {
    floorEl.classList.toggle('is-open', open);
    boxEls.forEach(box => box.classList.toggle('is-flat', open && box.dataset.box === 'copilot'));
    flights.forEach(flight => flight.el.classList.toggle('is-out', open));
    showAll(open);
    setState(open ? 'unpacked' : 'packed');
  };

  // First: the file where it sits in its box. Last: its switch, row name or cleanup line in the panel. A clone travels between
  // the two on an absolutely positioned layer (so page scroll carries it along), and the target lights up when it lands.
  const keyframes = (flight: Flight) => {
    const base = root.getBoundingClientRect();
    const from = flight.el.getBoundingClientRect(), to = aimFor(flight.def).getBoundingClientRect();
    const w = flight.el.offsetWidth, h = flight.el.offsetHeight;
    const x0 = from.left + from.width / 2 - base.left - w / 2, y0 = from.top + from.height / 2 - base.top - h / 2;
    const x1 = to.left + to.width / 2 - base.left - w / 2, y1 = to.top + to.height / 2 - base.top - h / 2;
    const r = flight.def.r + flight.box.tilt, end = Math.max(Math.min(to.width / w, to.height / h), .18);
    return { w, h, frames: [
      { transform: `translate(${x0}px, ${y0}px) rotate(${r}deg) scale(1)`, opacity: 1 },
      { transform: `translate(${x0}px, ${y0 - h * .75}px) rotate(${-r * .6}deg) scale(1.1)`, opacity: 1, offset: .3 },
      { transform: `translate(${x1}px, ${y1}px) rotate(0deg) scale(${Math.max(end * 1.6, .34)})`, opacity: 1, offset: .82 },
      { transform: `translate(${x1}px, ${y1}px) rotate(0deg) scale(${end})`, opacity: 0 },
    ] };
  };
  const clone = (flight: Flight, w: number, h: number) => {
    const ghost = flight.el.cloneNode(true) as HTMLElement;
    ghost.classList.add('h11-file-flying'); ghost.classList.remove('is-out');
    ghost.style.width = `${w}px`; ghost.style.height = `${h}px`;
    layer.append(ghost);
    return ghost;
  };
  const flattenGhost = async (box: HTMLElement) => {
    const base = root.getBoundingClientRect(), from = box.getBoundingClientRect(), to = slotEl('clean-empty').getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'h11-flat-ghost';
    layer.append(ghost);
    const x0 = from.left - base.left + from.width * .1, y0 = from.bottom - base.top - 14, x1 = to.left - base.left, y1 = to.top - base.top + to.height / 2 - 7;
    await ghost.animate([{ transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 0 }, { transform: `translate(${x0}px, ${y0 - 30}px)`, opacity: 1, offset: .25 }, { transform: `translate(${x1}px, ${y1}px) scale(.4)`, opacity: .2 }], { duration: 900, easing: 'cubic-bezier(.55,0,.25,1)' }).finished;
    ghost.remove();
    land({ name: '', x: 0, r: 0, slot: 'clean-empty' });
  };

  async function open() {
    if (state !== 'packed') return;
    touched = true;
    if (reduced()) { instant(true); live.textContent = 'Unpacked into the Kiln panel.'; return; }
    setState('moving');
    empty.hidden = true;
    const jobs: Promise<void>[] = [];
    boxEls.forEach((boxEl, b) => {
      const box = boxes[b];
      jobs.push((async () => {
        await wait(b * 330);
        boxEl.classList.add('is-opening');
        await wait(360);
        if (box.id === 'copilot') { await wait(260); boxEl.classList.add('is-flat'); await wait(380); await flattenGhost(boxEl); return; }
        await Promise.all(flights.filter(flight => flight.box === box).map(async (flight, f) => {
          await wait(f * 130);
          const { w, h, frames } = keyframes(flight);
          const ghost = clone(flight, w, h);
          flight.el.classList.add('is-out');
          await ghost.animate(frames, { duration: 980, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' }).finished;
          ghost.remove();
          land(flight.def);
        }));
      })());
    });
    await Promise.all(jobs);
    floorEl.classList.add('is-open');
    boxEls.forEach(box => box.classList.remove('is-opening'));
    showAll(true);
    setState('unpacked');
    live.textContent = 'Unpacked: eleven files from five boxes became five rows, with a broken link, an empty folder and an old copy flagged for cleanup.';
  }
  async function close() {
    if (state !== 'unpacked') return;
    touched = true;
    if (reduced()) { instant(false); live.textContent = 'Packed back into the boxes.'; return; }
    setState('moving');
    const ordered = [...flights].reverse();
    await Promise.all(ordered.map(async (flight, f) => {
      await wait(f * 60);
      const { w, h, frames } = keyframes(flight);
      const ghost = clone(flight, w, h);
      if (flight.def.row) panels.row('top', flight.def.row)?.classList.remove('is-in');
      if (flight.def.slot) slotEl(flight.def.slot).classList.remove('is-in');
      await ghost.animate(frames, { duration: 700, easing: 'cubic-bezier(.5,0,.25,1)', direction: 'reverse', fill: 'forwards' }).finished;
      flight.el.classList.remove('is-out');
      ghost.remove();
    }));
    floorEl.classList.remove('is-open');
    boxEls.forEach(box => box.classList.remove('is-flat', 'is-opening'));
    cleaned = false; cleanGo.hidden = false; clean.classList.remove('is-done');
    clean.querySelector('.h11-clean-title')!.textContent = 'Safe to clean up';
    showAll(false);
    setState('packed');
    live.textContent = 'Packed back into the boxes.';
  }
  // Pressed from below the panel (likely on a phone)? Bring the boxes back into view first so the flight can be seen.
  const inView = async () => {
    const top = floorEl.getBoundingClientRect().top;
    if (top >= -40 || reduced()) return;
    scrollBy({ top: top - 12, behavior: 'smooth' });
    await wait(520);
  };
  button.addEventListener('click', async () => { if (state === 'moving') return; await inView(); if (state === 'unpacked') close(); else open(); });
  win.querySelector('[data-unpack-inner]')!.addEventListener('click', async () => { await inView(); open(); });
  cleanGo.addEventListener('click', () => {
    cleaned = true; cleanGo.hidden = true;
    clean.classList.add('is-done');
    clean.querySelector('.h11-clean-title')!.textContent = 'Cleaned up';
    const code = rows.find(row => row.id === 'code-review')!;
    code.copies = 3;
    panels.draw();
    panels.say('top', 'Removed the broken link and the empty folder. Moved code-review (1) to a private backup.');
  });

  setState('packed');
  if (robot || reduced()) instant(true);
  else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      document.fonts.ready.then(() => setTimeout(() => { if (!touched) open(); }, 450));
    }, { rootMargin: '0px 0px -32% 0px' });
    observer.observe(zone);
  }
  return { finishNow: () => { if (state === 'packed') instant(true); } };
}

// ---------- behaviour: drag helper (pointer events, works for mouse and touch) ----------

type DragOptions = { handle: HTMLElement; visual: () => HTMLElement; zone: () => HTMLElement | null; onDrop: () => void; onTap?: () => void; canStart?: () => boolean; touchOnly?: string };
function draggable(options: DragOptions) {
  const { handle } = options;
  handle.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target as Element;
    if (target.closest('button, a, select, input')) return;
    if (options.touchOnly && event.pointerType !== 'mouse' && !target.closest(options.touchOnly)) return;
    if (options.canStart && !options.canStart()) return;
    const sx = event.clientX, sy = event.clientY;
    let ghost: HTMLElement | null = null, start: DOMRect | null = null, lastY = sy, scrolling = 0;
    handle.setPointerCapture(event.pointerId);
    const inZone = (x: number, y: number) => { const zone = options.zone(); if (!zone) return false; const r = zone.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };
    const edgeScroll = () => {
      if (!ghost) return;
      const speed = lastY > innerHeight - 70 ? 10 : lastY < 70 ? -10 : 0;
      if (speed) scrollBy(0, speed);
      scrolling = requestAnimationFrame(edgeScroll);
    };
    const move = (e: PointerEvent) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      lastY = e.clientY;
      if (!ghost) {
        if (Math.hypot(dx, dy) < 6) return;
        const visual = options.visual();
        start = visual.getBoundingClientRect();
        ghost = visual.cloneNode(true) as HTMLElement;
        ghost.classList.add('h11-ghost');
        Object.assign(ghost.style, { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px` });
        document.body.append(ghost);
        visual.classList.add('is-lifted');
        scrolling = requestAnimationFrame(edgeScroll);
      }
      ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-6, Math.min(6, dx / 40))}deg) scale(1.03)`;
      options.zone()?.classList.toggle('is-over', inZone(e.clientX, e.clientY));
    };
    const up = async (e: PointerEvent) => {
      handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', up);
      cancelAnimationFrame(scrolling);
      const zone = options.zone();
      zone?.classList.remove('is-over');
      if (!ghost || !start) { if (e.type === 'pointerup') options.onTap?.(); return; }
      const visual = options.visual(), current = ghost.style.transform, dx = e.clientX - sx, dy = e.clientY - sy;
      if (e.type === 'pointerup' && zone && inZone(e.clientX, e.clientY)) {
        const r = zone.getBoundingClientRect(), tx = r.left + r.width / 2 - (start.left + start.width / 2), ty = r.top + Math.min(r.height / 2, 60) - (start.top + start.height / 2);
        await ghost.animate([{ transform: current, opacity: 1 }, { transform: `translate(${tx}px, ${ty}px) scale(.28)`, opacity: 0 }], { duration: reduced() ? 0 : 320, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }).finished;
        ghost.remove(); visual.classList.remove('is-lifted');
        zone.classList.remove('is-thump'); void zone.offsetWidth; zone.classList.add('is-thump');
        options.onDrop();
        return;
      }
      await ghost.animate([{ transform: current }, { transform: 'none' }], { duration: reduced() ? 0 : 380, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'forwards' }).finished;
      ghost.remove(); visual.classList.remove('is-lifted');
      void dx; void dy;
    };
    handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  });
}

// ---------- behaviour: capture → collection → test → approve ----------

function bindStudio(root: HTMLElement, panels: Panels, unpack: Unpack) {
  const studio = root.querySelector<HTMLElement>('[data-studio]')!;
  const capture = studio.querySelector<HTMLElement>('[data-capture]')!;
  const busyEl = studio.querySelector<HTMLElement>('[data-capture-busy]')!;
  const idleEl = studio.querySelector<HTMLElement>('.h11-capture-idle')!;
  const collection = studio.querySelector<HTMLElement>('[data-collection]')!;
  const test = studio.querySelector<HTMLElement>('[data-test]')!;
  const run = studio.querySelector<HTMLElement>('[data-run]')!;
  const repoSelect = studio.querySelector<HTMLSelectElement>('[data-repo]')!;
  const agentSelect = studio.querySelector<HTMLSelectElement>('[data-agent]')!;
  const viewButtons = [...studio.querySelectorAll<HTMLButtonElement>('[data-view-btn]')];
  let current: Source | null = null, revision = 1, token = 0, phase: 'empty' | 'analyzing' | 'ready' | 'running' | 'verdict' | 'approved' = 'empty';

  const setView = (view: 'capture' | 'skills') => {
    studio.querySelectorAll<HTMLElement>('[data-view]').forEach(el => { el.hidden = el.dataset.view !== view; });
    viewButtons.forEach(btn => { const on = btn.dataset.viewBtn === view; btn.classList.toggle('is-on', on); btn.setAttribute('aria-pressed', String(on)); });
  };
  viewButtons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.viewBtn as 'capture' | 'skills')));

  const promptText = () => {
    const star = current!.star, fix = current!.test?.fix;
    return revision > 1 && fix ? star.body.replace(fix.before, `<mark>${fix.after}</mark>`) : star.body;
  };
  const idleRun = () => {
    const ready = phase === 'ready' && current?.star.testable;
    run.innerHTML = `<div class="h11-dropzone${ready ? ' is-ready' : ''}" data-test-zone>
      ${icon(icons.tests, 22)}
      <p><b>${ready ? 'Drag the prompt here' : current && !current.star.testable ? 'Drafts from a repo are tested one at a time' : 'Nothing to test yet'}</b></p>
      <p class="h11-muted">${ready ? `It runs on ${repoSelect.value} through ${agentSelect.value}, read-only. On this page it replays a sample run.` : current && !current.star.testable ? 'Open a draft in the app to test it. Here, the video and the post come with a sample run.' : 'Capture a source first.'}</p>
      ${ready ? '<button type="button" class="h11-btn h11-btn-sm h11-btn-ink" data-test-go>Test this prompt</button>' : ''}</div>`;
    run.querySelector('[data-test-go]')?.addEventListener('click', () => startTest());
  };
  const drawCollection = () => {
    if (!current) return;
    const s = current.star;
    collection.innerHTML = `<div class="h11-coll-head"><h4>${current.collection}</h4><span>Collection, linked to the source</span></div>
      <article class="h11-star${s.testable ? ' is-draggable' : ''}" data-star aria-label="${s.kind}: ${s.title}">
        <header>${s.testable ? `<span class="h11-grip" data-grip aria-hidden="true">${icon(icons.grip, 16)}</span>` : ''}<span class="h11-kind h11-kind-prompt">${icon(icons.star, 13)}${s.kind}</span>${s.testable ? '<span class="h11-rev" data-rev>rev ' + revision + '</span>' : ''}</header>
        <h5>${s.title}</h5>
        <p data-prompt>${s.testable ? promptText() : s.body}</p>
        <footer>${s.from ? `<a class="h11-stamp-link" href="#h11-new" data-noop>${icon('M6 4.5v11l9-5.5z', 12)}from ${s.from}</a>` : `<span class="h11-muted">${current.chip}</span>`}
          ${s.testable ? '<button type="button" class="h11-btn h11-btn-sm" data-star-test>Test this prompt</button>' : ''}</footer>
      </article>
      <ul class="h11-cards">${current.cards.map((card, n) => `<li style="--n:${n}"><span class="h11-kind">${card.kind}</span><b>${card.title}</b>${card.from ? `<small>from ${card.from}</small>` : ''}</li>`).join('')}</ul>`;
    collection.querySelector('[data-noop]')?.addEventListener('click', event => event.preventDefault());
    collection.querySelector('[data-star-test]')?.addEventListener('click', () => startTest());
    const star = collection.querySelector<HTMLElement>('[data-star]')!;
    if (s.testable) draggable({ handle: star, visual: () => star, zone: () => run.querySelector<HTMLElement>('[data-test-zone]'), onDrop: () => startTest(), canStart: () => phase === 'ready', touchOnly: '[data-grip]' });
  };

  async function captureSource(id: SourceId) {
    const source = sources.find(item => item.id === id)!;
    const mine = ++token;
    current = source; revision = 1; phase = 'analyzing';
    setView('capture');
    root.querySelectorAll<HTMLElement>('[data-parcel]').forEach(parcel => parcel.classList.toggle('is-in', parcel.dataset.parcel === id));
    idleEl.hidden = true; busyEl.hidden = false;
    capture.classList.add('is-busy');
    busyEl.innerHTML = `<div class="h11-chip h11-chip-${id}"><span class="h11-chip-icon" aria-hidden="true"></span><div><b>${source.chip}</b><small>${source.chipMeta}</small></div></div>
      <p class="h11-analyze" data-analyze-line><span class="h11-spin" aria-hidden="true"></span>Analyze and add: ${source.analyzing}…</p><span class="h11-progress"><i></i></span>`;
    collection.innerHTML = '<p class="h11-placeholder">Analyzing…</p>';
    idleRun();
    if (innerWidth < 900) studio.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    await wait(1500);
    if (mine !== token) return;
    capture.classList.remove('is-busy');
    busyEl.querySelector('[data-analyze-line]')!.innerHTML = `<span class="h11-ok" aria-hidden="true">${icon(icons.check, 14)}</span>${source.found}`;
    busyEl.querySelector('.h11-progress')?.remove();
    phase = 'ready';
    drawCollection();
    collection.classList.remove('is-new'); void collection.offsetWidth; collection.classList.add('is-new');
    idleRun();
  }

  async function startTest() {
    if (!current?.test || (phase !== 'ready' && phase !== 'verdict')) return;
    const source = current, spec = source.test!, mine = ++token, repo = repoSelect.value, agent = agentSelect.value;
    phase = 'running';
    const star = collection.querySelector<HTMLElement>('[data-star]');
    star?.classList.add('is-testing');
    const rev = collection.querySelector('[data-rev]'); if (rev) rev.textContent = `rev ${revision}`;
    const steps = revision > 1 && spec.fix ? [...spec.steps.slice(0, -1), spec.fix.last] : spec.steps;
    run.innerHTML = `<div class="h11-running">
      <div class="h11-run-top"><b>${source.star.title}</b><span class="h11-rev">rev ${revision}</span></div>
      <p class="h11-run-meta"><span class="h11-spin" aria-hidden="true" data-spin></span><span data-elapsed>Running on ${repo}, 0 s</span></p>
      <ol class="h11-log" data-log></ol>
      <p class="h11-tokens" data-tokens>${agent} · default model · medium effort</p>
      <div data-outcome></div></div>`;
    if (innerWidth < 900) test.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    const log = run.querySelector<HTMLElement>('[data-log]')!, elapsed = run.querySelector<HTMLElement>('[data-elapsed]')!, tokens = run.querySelector<HTMLElement>('[data-tokens]')!;
    const [tin, tcached, tout] = spec.tokens;
    for (const [index, [kind, text]] of steps.entries()) {
      await wait(640);
      if (mine !== token) return;
      log.insertAdjacentHTML('beforeend', `<li class="h11-step-${kind}">${icon(icons[kind], 15)}<span>${text}</span></li>`);
      const seconds = 27 * (index + 1) + (revision > 1 ? 5 : 0), part = (index + 1) / steps.length;
      elapsed.textContent = `Running on ${repo}, ${Math.floor(seconds / 60)} min ${seconds % 60} s`;
      tokens.textContent = `${agent} · default model · medium effort · ${(tin * part).toFixed(1)}k in · ${(tcached * part).toFixed(1)}k cached · ${(tout * part).toFixed(1)}k out (sample)`;
    }
    await wait(380);
    if (mine !== token) return;
    run.querySelector('[data-spin]')?.remove();
    const total = 27 * steps.length + (revision > 1 ? 5 : 0);
    elapsed.innerHTML = `<span class="h11-ok" aria-hidden="true">${icon(icons.check, 14)}</span>Finished in ${Math.floor(total / 60)} min ${total % 60} s. Nothing in ${repo} changed.`;
    star?.classList.remove('is-testing');
    phase = 'verdict';
    const outcome = run.querySelector<HTMLElement>('[data-outcome]')!;
    if (revision === 1 && spec.fix) {
      outcome.innerHTML = `<div class="h11-verdict h11-verdict-unsure"><b>Uncertain</b><span>The agent's own assessment. ${spec.fix.uncertain}</span></div>
        <p class="h11-muted">Change one line, then run it again on the same repo:</p>
        <div class="h11-diff"><p class="h11-del">- ${spec.fix.before}</p><p class="h11-add">+ ${spec.fix.after}</p></div>
        <div class="h11-actions"><button type="button" class="h11-btn h11-btn-sm h11-btn-ink" data-rerun>Save as rev 2 and run it</button></div>`;
      const rerun = outcome.querySelector<HTMLButtonElement>('[data-rerun]')!;
      rerun.addEventListener('click', () => { revision = 2; const p = collection.querySelector('[data-prompt]'); if (p) p.innerHTML = promptText(); startTest(); });
      rerun.focus({ preventScroll: true });
      return;
    }
    outcome.innerHTML = `<div class="h11-verdict h11-verdict-pass"><b>Pass</b><span>The agent's assessment. ${spec.pass}</span></div>
      <p class="h11-muted">Keeping it is your call. Nothing becomes a skill until you approve it.</p>
      <div class="h11-actions"><button type="button" class="h11-btn h11-btn-sm h11-btn-ink" data-approve>Approve rev ${revision} as a skill</button><button type="button" class="h11-btn h11-btn-sm h11-btn-quiet" data-notyet>Not yet</button></div>`;
    outcome.querySelector<HTMLButtonElement>('[data-approve]')!.focus({ preventScroll: true });
    outcome.querySelector('[data-notyet]')!.addEventListener('click', () => { phase = 'ready'; idleRun(); panels.say('studio', ''); });
    outcome.querySelector('[data-approve]')!.addEventListener('click', () => approve(source, spec.skill));
  }

  async function approve(source: Source, skill: string) {
    const mine = ++token;
    phase = 'approved';
    const outcome = run.querySelector<HTMLElement>('[data-outcome]')!;
    outcome.innerHTML = `<div class="h11-verdict h11-verdict-pass"><b>Approved</b><span>${skill}, rev ${revision}. That exact revision is pinned and published to <code>you/my-kiln</code> on GitHub.</span></div>`;
    await wait(900);
    if (mine !== token) return;
    unpack.finishNow();
    panels.add({ id: skill, note: `Approved rev ${revision}, just now`, copies: 1, fresh: true, cells: cells({ claude: 'on' }) });
    setView('skills');
    studio.querySelector('[data-skills-title]')!.textContent = `${skill} moved in`;
    studio.querySelector('[data-skills-sub]')!.textContent = 'Same panel as up top. Installed for Claude Code; choose where else it loads.';
    panels.say('studio', `Installed the approved ${skill} into ~/.claude/skills. Receipt saved.`);
    const row = panels.row('studio', skill);
    row?.classList.add('is-hit');
    if (innerWidth < 900) studio.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    row?.querySelector<HTMLElement>('[data-col="agents"]')?.focus({ preventScroll: true });
  }

  studio.querySelector('[data-again]')!.addEventListener('click', () => {
    token++; current = null; phase = 'empty';
    setView('capture');
    idleEl.hidden = false; busyEl.hidden = true;
    collection.innerHTML = '<p class="h11-placeholder">The collection shows up here: one prompt, and the techniques, insights and tools around it.</p>';
    root.querySelectorAll<HTMLElement>('[data-parcel]').forEach(parcel => parcel.classList.remove('is-in'));
    idleRun();
    root.querySelector<HTMLElement>('[data-add]')?.focus();
  });
  studio.querySelector('[data-see-top]')!.addEventListener('click', event => {
    event.preventDefault();
    const fresh = rows.filter(row => row.fresh).pop();
    const target = fresh ? panels.row('top', fresh.id) : null;
    (target ?? root.querySelector<HTMLElement>('[data-panel-win]'))!.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    if (target) { target.classList.remove('is-hit'); void target.offsetWidth; target.classList.add('is-hit'); target.querySelector<HTMLElement>('.h11-sw')?.focus({ preventScroll: true }); }
  });
  [repoSelect, agentSelect].forEach(select => select.addEventListener('change', () => { if (phase === 'ready' || phase === 'empty') idleRun(); }));

  root.querySelectorAll<HTMLElement>('[data-parcel]').forEach(parcel => {
    const id = parcel.dataset.parcel as SourceId, art = parcel.querySelector<HTMLElement>('[data-drag-parcel]')!;
    parcel.querySelector('[data-add]')!.addEventListener('click', () => {
      capture.classList.remove('is-thump'); void capture.offsetWidth; capture.classList.add('is-thump');
      captureSource(id);
    });
    draggable({ handle: art, visual: () => art, zone: () => capture, onDrop: () => captureSource(id), onTap: () => captureSource(id) });
  });
  idleRun();
}
