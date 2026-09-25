// PROTOTYPE round 4, H03: your skills as a wall of felt-tip sticky notes. "Tidy this up" flies them (FLIP) into a crisp
// Windows 11 Kiln panel; duplicates merge into one row and the broken link crumples. Later, saved ideas are notes you drag into Test.
import './style.css';
import { examples, installer } from '../../content';
import { cross, ellipse, folder, reseed, scribble } from '../r3-kit/rough';

type Tint = 'y' | 'p' | 'b' | 'g' | 'o' | 'l';
type Place = [x: number, y: number, rotate: number];
type WallNote = { text: string; sub?: string; tint: Tint; to: string; doodle?: 'folder' | 'broken' | 'under' | 'ring'; red?: boolean; desk: Place; phone: Place };

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const windowsMark = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const appIcon = (size = 16) => `<svg class="h03-appicon" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="8" fill="#005fb8"/><path d="M8 25V15a8 8 0 0 1 16 0v10z" fill="#fff"/><path d="M12.5 25v-7a3.5 3.5 0 0 1 7 0v7z" fill="#ffb454"/></svg>`;
const chrome = (title: string) => `<div class="h03-titlebar">${appIcon()}<span>${title}</span><i aria-hidden="true" class="h03-controls"><b class="h03-min"></b><b class="h03-max"></b><b class="h03-close"></b></i></div>`;

// ---------- the wall ----------

const wall: WallNote[] = [
  { text: '~/.claude/skills', tint: 'b', to: 'col-claude', doodle: 'folder', desk: [3, 4, -4], phone: [2, 1, -4] },
  { text: 'code-review', tint: 'y', to: 'row-code-review', desk: [21, 9, 3], phone: [35, 3, 3] },
  { text: 'code-review (1)', tint: 'y', to: 'row-code-review', desk: [39, 2, -2], phone: [67, 1, -3] },
  { text: '~/.agents/skills', tint: 'b', to: 'col-agents', doodle: 'folder', desk: [60, 6, 5], phone: [4, 19, 4] },
  { text: 'research', sub: '(the good one)', tint: 'g', to: 'row-research', desk: [80, 11, -3], phone: [36, 21, -2] },
  { text: 'code-review-FINAL', sub: 'final final', tint: 'p', to: 'row-code-review', doodle: 'under', desk: [6, 36, 6], phone: [66, 20, 5] },
  { text: 'old-link', sub: 'broken link?', tint: 'o', to: 'crumple', doodle: 'broken', desk: [28, 35, -6], phone: [3, 38, -5] },
  { text: 'writing-for-agents', tint: 'l', to: 'row-writing-for-agents', desk: [49, 31, 2], phone: [35, 40, 3] },
  { text: 'who edited this??', sub: 'code-review, in .claude', tint: 'p', to: 'cell-code-review-claude', red: true, doodle: 'ring', desk: [72, 39, -5], phone: [67, 38, -4] },
  { text: 'my-game/ .github/skills', tint: 'b', to: 'col-project', doodle: 'folder', desk: [3, 67, -2], phone: [2, 57, -3] },
  { text: 'playtest ??', tint: 'y', to: 'row-playtest-brief', desk: [25, 64, 4], phone: [35, 59, 4] },
  { text: 'pr-summary', sub: 'where did this come from?', tint: 'g', to: 'row-pr-summary', desk: [49, 66, -3], phone: [67, 57, -2] },
  { text: 'which ones does Claude load?', tint: 'o', to: 'context', desk: [74, 69, 3], phone: [20, 76, 2] },
];

function doodle(kind: WallNote['doodle']) {
  reseed(kind === 'folder' ? 11 : kind === 'broken' ? 23 : 5);
  if (kind === 'folder') return `<svg class="h03-doodle h03-doodle-folder" viewBox="0 0 60 44" aria-hidden="true"><path d="${folder(4, 4, 50, 34)}"/></svg>`;
  if (kind === 'broken') return `<svg class="h03-doodle h03-doodle-cross" viewBox="0 0 40 40" aria-hidden="true"><path d="${cross(20, 20, 13)}"/></svg>`;
  if (kind === 'under') return `<svg class="h03-doodle h03-doodle-under" viewBox="0 0 120 20" aria-hidden="true"><path d="${scribble(4, 5, 110, 2, 6)}"/></svg>`;
  if (kind === 'ring') return `<svg class="h03-doodle h03-doodle-ring" viewBox="0 0 140 70" aria-hidden="true"><path d="${ellipse(70, 35, 64, 30, .06, 1.08)}"/></svg>`;
  return '';
}

function wallNotes() {
  return wall.map((note, n) => `<div class="h03-note h03-t-${note.tint}${note.red ? ' h03-red' : ''}${note.doodle ? ` h03-has-${note.doodle}` : ''}" data-note="${n}" data-to="${note.to}"
    style="--x:${note.desk[0]}%;--y:${note.desk[1]}%;--r:${note.desk[2]}deg;--mx:${note.phone[0]}%;--my:${note.phone[1]}%;--mr:${note.phone[2]}deg">
    ${doodle(note.doodle)}<p>${note.text}</p>${note.sub ? `<small>${note.sub}</small>` : ''}</div>`).join('');
}

// ---------- the panel (crisp) ----------

type Cell = 'on' | 'off' | 'edited' | 'found';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; imported?: boolean };
const columns: { key: Column; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Codex and others', short: 'Codex+', path: '~/.agents/skills' },
  { key: 'project', name: 'my-game', short: 'my-game', path: '.github/skills' },
];
const rows: Row[] = [
  { name: 'code-review', note: 'Approved rev 3. 3 folders, 1 skill', cells: { claude: 'edited', agents: 'on', project: 'on' } },
  { name: 'research', note: 'Approved rev 2', cells: { claude: 'on', agents: 'on', project: 'off' } },
  { name: 'writing-for-agents', note: 'Approved rev 1', cells: { claude: 'on', agents: 'off', project: 'off' } },
  { name: 'playtest-brief', note: 'Approved rev 4', cells: { claude: 'off', agents: 'off', project: 'on' } },
  { name: 'pr-summary', note: 'Found outside your library', cells: { claude: 'off', agents: 'found', project: 'off' } },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };
const toggle = (row: Row, r: number, column: typeof columns[number]) => {
  const state = row.cells[column.key];
  return `<button type="button" class="h03-toggle h03-toggle-${state}" data-row="${r}" data-col="${column.key}" role="switch" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.name} in ${column.name}: ${stateText[state]}"><i></i></button>`;
};
const rowMarkup = (row: Row, r: number) => `<tr data-slot="row-${row.name}"><th scope="row"><b data-aim>${row.name}</b><small data-caption>${row.note}</small></th>${columns.map(column =>
  `<td ${row.name === 'code-review' && column.key === 'claude' ? 'data-slot="cell-code-review-claude"' : ''}>${toggle(row, r, column)}</td>`).join('')}</tr>`;

function heroPanel() {
  return `<div class="h03-win h03-panel" data-win aria-label="Kiln skills panel, sample library" role="region">
    ${chrome('Kiln')}
    <div class="h03-layer">
      <div class="h03-panel-head"><div><h2 class="h03-win-title">Skills</h2><p class="h03-caption">Sample library. One switch per skill, per place your agents look.</p></div></div>
      <div class="h03-infobar" data-slot="cleaned" role="status"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill="#0f7b0f"/><path d="m4.6 8.2 2.3 2.2 4.5-4.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Cleaned up 1 broken link in <code>~/.agents/skills</code></span></div>
      <div class="h03-table-wrap"><table class="h03-table">
        <thead><tr><th scope="col" class="h03-th-skill">Skill</th>${columns.map(column => `<th scope="col" data-slot="col-${column.key}"><span data-aim><span class="h03-long">${column.name}</span><span class="h03-short">${column.short}</span></span><code>${column.path}</code></th>`).join('')}</tr></thead>
        <tbody data-rows>${rows.map(rowMarkup).join('')}</tbody>
      </table></div>
      <ul class="h03-legend" aria-label="What the switches mean">
        <li><i class="h03-mini h03-mini-on"></i>Installed from the approved version</li>
        <li><i class="h03-mini h03-mini-edited"></i>Edited outside Kiln</li>
        <li><i class="h03-mini h03-mini-found"></i>Found outside your library</li>
      </ul>
      <div class="h03-panel-foot">
        <p class="h03-status" data-status aria-live="polite">Merged 3 code-review folders into one row.</p>
        <button type="button" class="h03-btn h03-btn-sm" data-dupes>Remove the 2 duplicates</button>
        <p class="h03-context" data-slot="context"><span data-aim data-context></span></p>
      </div>
      <div class="h03-flyout" data-flyout hidden role="dialog" aria-modal="false" aria-labelledby="h03-flyout-title"></div>
    </div>
  </div>`;
}

function hero() {
  return `<section class="h03-hero" id="h03-hero" aria-labelledby="h03-title">
    <div class="h03-hero-copy">
      <h1 id="h03-title">Your agent skills are all over the place. Let's tidy up.</h1>
      <p>Folders in <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and every project's <code>.github/skills</code>. Three copies of code-review, a broken link, and one copy nobody remembers editing. Kiln finds them all and gives each skill one row, with a switch for every place your agents look.</p>
      <div class="h03-actions">
        <button type="button" class="h03-btn h03-btn-big" data-tidy aria-controls="h03-stage">Tidy this up</button>
        <a class="h03-btn h03-btn-big h03-btn-accent" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      </div>
      <p class="h03-fine">Free, MIT licensed. The download needs a GitHub account with access to the private release repository.</p>
    </div>
    <div class="h03-stage" id="h03-stage" data-stage data-state="mess">
      <div class="h03-cork" aria-hidden="true"></div>
      <div class="h03-notes" data-notes role="img" aria-label="A cork board covered in sticky notes: three skill folders, code-review three times over, research, writing-for-agents, a broken link, playtest, pr-summary, and notes asking who edited this and which ones Claude loads."></div>
      ${heroPanel()}
      <p class="visually-hidden" data-stage-live aria-live="polite"></p>
    </div>
  </section>`;
}

// ---------- every copy (skill detail) ----------

type Copy = { path: string; state: 'installed' | 'edited' | 'identical' | 'differs' | 'linked'; label: string; managed: boolean };
const copies: Copy[] = [
  { path: '~/.agents/skills/code-review', state: 'installed', label: 'Installed, rev 3', managed: true },
  { path: '~/.claude/skills/code-review', state: 'edited', label: 'Edited outside Kiln', managed: true },
  { path: 'my-game/.github/skills/code-review', state: 'installed', label: 'Installed, rev 3', managed: true },
  { path: '~/.claude/skills/code-review (1)', state: 'differs', label: 'Differs from rev 3', managed: false },
  { path: 'site/.github/skills/code-review', state: 'identical', label: 'Identical copy found', managed: false },
  { path: '~/.codex/skills/code-review', state: 'linked', label: 'Linked', managed: false },
];

const navIcon = (d: string) => `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
const icons = {
  library: 'M4 3.5h3v13H4zM8.5 3.5h3v13h-3zM13 4.2l2.8-.7 2.6 12.3-2.8.7z',
  skills: 'M10 2.5 12.2 7l4.8.6-3.5 3.3.9 4.8L10 13.4l-4.4 2.3.9-4.8L3 7.6 7.8 7z',
  test: 'M7.5 2.5h5M8.5 2.5v5L4 15.5a1.4 1.4 0 0 0 1.2 2h9.6a1.4 1.4 0 0 0 1.2-2L11.5 7.5v-5M6 12.5h8',
  config: 'M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10 2v2.2M10 15.8V18M2 10h2.2M15.8 10H18M4.3 4.3l1.6 1.6M14.1 14.1l1.6 1.6M4.3 15.7l1.6-1.6M14.1 5.9l1.6-1.6',
};

function copiesSection() {
  return `<section class="h03-section h03-copies" id="h03-copies" aria-labelledby="h03-copies-title">
    <div class="h03-copy">
      <h2 id="h03-copies-title">Open a skill. See every copy of it.</h2>
      <p>Kiln checks each place your agents read skills from, on this machine and in the projects you add. It tells you which copies match the version you approved, which ones differ, and which one somebody changed by hand. Clear out the ones you don't need in one go.</p>
      <ul class="h03-points">
        <li><b>Your originals stay put.</b> Importing an installed skill, or a whole skills repo, makes drafts. Nothing moves.</li>
        <li><b>Approval pins an exact revision.</b> Editing makes a new draft; installs always use the approved one. Approvals publish to your own Kiln repo on GitHub.</li>
        <li><b>New laptop, same skills.</b> Open that repo and press "Install everything marked for this machine".</li>
      </ul>
    </div>
    <div class="h03-win h03-detail" role="region" aria-label="Kiln skill details for code-review, sample">
      ${chrome('Kiln')}
      <div class="h03-detail-body">
        <nav class="h03-rail" aria-label="Kiln sections (illustration)">
          <span>${navIcon(icons.library)}<em>Library</em></span><span class="is-on">${navIcon(icons.skills)}<em>Skills</em></span><span>${navIcon(icons.test)}<em>Tests</em></span><span>${navIcon(icons.config)}<em>Config</em></span>
        </nav>
        <div class="h03-list" aria-hidden="true">
          <div class="h03-search">Search library</div>
          <p class="is-on"><b>code-review</b><small>Skill, approved</small></p><p><b>research</b><small>Skill, approved</small></p><p><b>writing-for-agents</b><small>Skill, approved</small></p><p><b>playtest-brief</b><small>Skill, draft</small></p><p><b>Try it as a seven-year-old</b><small>Prompt</small></p>
        </div>
        <div class="h03-pane">
          <p class="h03-crumb">Skills <span aria-hidden="true">›</span> code-review</p>
          <h3 class="h03-pane-title">code-review</h3>
          <p class="h03-caption"><span class="h03-badge h03-badge-ok">Approved rev 3</span> Published to <code>you/my-kiln</code> on GitHub</p>
          <div class="h03-pivot" role="tablist" aria-label="code-review">
            <button type="button" role="tab" id="h03-tab-copies" aria-selected="true" aria-controls="h03-pane-copies" data-tab="copies">Copies</button>
            <button type="button" role="tab" id="h03-tab-history" aria-selected="false" aria-controls="h03-pane-history" data-tab="history" tabindex="-1">History</button>
          </div>
          <div id="h03-pane-copies" role="tabpanel" aria-labelledby="h03-tab-copies" data-panel="copies">
            <ul class="h03-copylist" data-copies></ul>
            <div class="h03-compare" data-compare hidden>
              <p><b>~/.claude/skills/code-review</b> compared with rev 3, <code>SKILL.md</code></p>
              <div class="h03-diff"><p class="h03-del">- Review standards and the specification separately.</p><p class="h03-add">+ Review the specification only. Skip style.</p></div>
            </div>
            <div class="h03-copyfoot" data-copyfoot></div>
          </div>
          <div id="h03-pane-history" role="tabpanel" aria-labelledby="h03-tab-history" data-panel="history" hidden>
            <ol class="h03-history">
              <li><span class="h03-badge">Draft rev 4</span><p>Added guidance for generated files. Not installed anywhere until you approve it.</p>
                <div class="h03-diff"><p class="h03-add">+ Skip generated files unless the diff only touches them.</p></div></li>
              <li><span class="h03-badge h03-badge-ok">Approved rev 3</span><p>Tested on my-game: pass. This is the version every install uses.</p></li>
              <li><span class="h03-badge">Rev 2</span><p>Reviews standards and the specification separately.</p></li>
              <li><span class="h03-badge">Rev 1</span><p>Imported from <code>~/.claude/skills</code> as a draft.</p></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------- test: drag a saved note into Test ----------

type Idea = { source: string; title: string; prompt: string; tint: Tint; verdict: 'pass' | 'uncertain'; skill: string; steps: [kind: 'read' | 'search' | 'think' | 'run', text: string][]; fix?: { before: string; after: string; step: string; lesson: string } };
const ideas: Idea[] = [
  { source: 'from a YouTube talk', title: examples[0].title, prompt: examples[0].prompt, tint: 'y', verdict: 'uncertain', skill: 'kid-usability-check',
    steps: [['read', 'Read src/screens/Start.tsx'], ['search', 'Searched src/ for "signup" and skipped the parent flow'], ['read', 'Read src/screens/Levels.tsx'], ['think', 'Found two confusing spots, not sure which comes first']],
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', step: 'Named the first obstacle and quoted the button: "Continue?"', lesson: 'Asking for the on-screen text made it commit to one obstacle instead of hedging.' } },
  { source: 'an X post, sample', title: 'Review your own diff first', prompt: 'Before you tell me you are done, review your own diff as a strict reviewer. List problems by severity and explain the serious ones. Make no changes.', tint: 'p', verdict: 'pass', skill: 'self-review',
    steps: [['run', 'Ran git diff main'], ['read', 'Read the three changed files'], ['think', 'Listed 1 serious and 3 minor problems, with reasons']] },
  { source: 'from an agent workflow video', title: examples[1].title, prompt: examples[1].prompt, tint: 'b', verdict: 'pass', skill: 'instruction-trace',
    steps: [['read', 'Read AGENTS.md and CLAUDE.md'], ['search', 'Searched for "run every test"'], ['think', 'Found the outdated line and proposed a one-line change']] },
  { source: 'a saved prompt', title: examples[2].title, prompt: examples[2].prompt, tint: 'g', verdict: 'pass', skill: 'playtest-ten',
    steps: [['read', 'Read the game loop and level data'], ['think', 'Traced the first five minutes of play'], ['think', 'Ranked ten improvements, with a reason for each']] },
];

function testSection() {
  return `<section class="h03-section h03-test" id="h03-test" aria-labelledby="h03-test-title">
    <div class="h03-test-head">
      <h2 id="h03-test-title">That prompt you saved last week? Drag it into Test.</h2>
      <p>Kiln runs it on your own repo, through the Codex or Claude Code you're already signed into. It's read-only, so your code doesn't change. You watch each step, and you get a verdict in a few minutes. If it's good, keep it as a skill.</p>
    </div>
    <div class="h03-test-grid">
      <div class="h03-ideas-wrap">
        <div class="h03-ideas" data-ideas role="list" aria-label="Saved ideas"></div>
        <p class="h03-hint">Drag a note into Test, or tap it. Sample ideas; three are real prompts from a Kiln library, shortened.</p>
      </div>
      <div class="h03-win h03-tester" role="region" aria-label="Kiln Test window, sample run">
        ${chrome('Kiln: Test')}
        <div class="h03-layer">
          <div class="h03-cmdbar"><span class="h03-combo"><small>Project</small>~/code/my-game</span><span class="h03-combo"><small>Agent</small>Claude Code</span><span class="h03-badge">Read-only</span></div>
          <div class="h03-run" data-run aria-live="polite"></div>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------- details and download ----------

const detailIcon = (d: string) => `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function detailsSection() {
  const facts: [string, string, string][] = [
    ['M4 7h16v10H4zM4 10h16M8 14h3', 'Uses the plan you already have', 'Kiln runs tests through your signed-in Codex or Claude Code. No API key and no extra API bill; your plan\'s usage limits still apply.'],
    ['M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6zM9 12l2 2 4-4', 'Tests never touch your code', 'Experiments are read-only. The agent says pass, fail or uncertain, and your own call is kept separately. Jobs that need edits come back uncertain.'],
    ['M4 5h16v14H4zM8 9h8M8 13h5', 'Every run shows its cost', 'Model, reasoning effort, elapsed time and input, cached and output tokens, saved with the revision you ran.'],
    ['M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5', 'Config files in the same place', 'CLAUDE.md, AGENTS.md, config.toml, settings, hooks and MCP config, edited where they live, with 30 private backups.'],
    ['M4 12h11M11 6l6 6-6 6M20 4v16', 'Capture in a keystroke', 'Ctrl+Shift+Space from anywhere. Paste a post, drop a screenshot, or give it a YouTube link and get prompts with timestamped sources.'],
    ['M4 17l5-5 4 4 7-8M15 8h5v5', 'Scriptable, too', 'A CLI for collections, experiments, approvals and installs, with JSON output. Your agents can read your library through it.'],
  ];
  return `<section class="h03-section h03-details" aria-labelledby="h03-details-title">
    <h2 id="h03-details-title">Good to know</h2>
    <ul class="h03-settings">${facts.map(([icon, title, text]) => `<li>${detailIcon(icon)}<div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ul>
  </section>
  <section class="h03-section h03-get" id="h03-get" aria-labelledby="h03-get-title">
    <div class="h03-get-note h03-t-y" aria-hidden="true"><p>take the notes down</p><small>and try one saved idea tonight</small></div>
    <div class="h03-get-copy">
      <h2 id="h03-get-title">One list for every skill. One click to test a new one.</h2>
      <a class="h03-btn h03-btn-big h03-btn-accent" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p class="h03-fine">Kiln 0.17.0 for Windows, with Codex, Claude Code and Copilot. The release lives in a private GitHub repository, so sign in with an account that has access. The build is unsigned, so Windows may ask before it runs. MIT licensed.</p>
    </div>
  </section>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = "Kiln — Your agent skills are all over the place. Let's tidy up.";
  root.innerHTML = `<div class="h03">
    <a class="skip" href="#h03-main">Skip to content</a>
    <header class="h03-top"><a class="h03-brand" href="#h03-main">${appIcon(26)}<span>Kiln</span></a>
      <nav aria-label="Main navigation"><a href="#h03-copies">Every copy</a><a href="#h03-test">Test an idea</a><a href="#h03-get">Download</a></nav></header>
    <main id="h03-main">${hero()}${copiesSection()}${testSection()}${detailsSection()}</main>
  </div>`;
  const panel = bindPanel(root);
  const stage = bindStage(root, panel);
  bindCopies(root);
  bindTest(root, panel, stage);
}

// ---------- behaviour: the stage (FLIP tidy) ----------

type Stage = { tidyNow(): void };
function bindStage(root: HTMLElement, panel: Panel): Stage {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const layer = stage.querySelector<HTMLElement>('[data-notes]')!;
  const win = stage.querySelector<HTMLElement>('[data-win]')!;
  const button = root.querySelector<HTMLButtonElement>('[data-tidy]')!;
  const live = stage.querySelector<HTMLElement>('[data-stage-live]')!;
  layer.innerHTML = wallNotes();
  const notes = [...layer.querySelectorAll<HTMLElement>('.h03-note')];
  const slots = [...win.querySelectorAll<HTMLElement>('[data-slot]')];
  let busy = false, touched = false;
  const setState = (state: 'mess' | 'tidying' | 'tidy' | 'messing') => {
    stage.dataset.state = state;
    win.inert = state === 'mess';
    button.textContent = state === 'tidy' || state === 'tidying' ? 'Put the notes back' : 'Tidy this up';
    button.disabled = state === 'tidying' || state === 'messing';
  };
  const slotFor = (note: HTMLElement) => win.querySelector<HTMLElement>(`[data-slot="${note.dataset.to}"]`);
  const aimFor = (slot: HTMLElement) => slot.querySelector<HTMLElement>('[data-aim]') ?? slot;
  const tintOf = (note: HTMLElement) => getComputedStyle(note).getPropertyValue('--paper').trim();
  const land = (slot: HTMLElement, tint: string) => {
    slot.style.setProperty('--land', tint);
    slot.classList.remove('is-landed'); void slot.offsetWidth;
    slot.classList.add('is-in', 'is-landed');
  };
  const instant = (tidy: boolean) => {
    notes.forEach(note => note.classList.toggle('is-gone', tidy));
    slots.forEach(slot => slot.classList.toggle('is-in', tidy));
    setState(tidy ? 'tidy' : 'mess');
  };
  // FLIP: First is the note on the wall, Last is its row, header or cell in the panel. We Invert by measuring both boxes and Play the
  // transform between them on the note itself, so the note visibly becomes the row; the row fades in as the note lands.
  const flight = (note: HTMLElement) => {
    const box = stage.getBoundingClientRect(), W = note.offsetWidth, H = note.offsetHeight;
    const cx = note.offsetLeft + W / 2, cy = note.offsetTop + H / 2;
    const rotate = parseFloat(getComputedStyle(note).getPropertyValue(innerWidth < 700 ? '--mr' : '--r')) || 0;
    if (note.dataset.to === 'crumple') {
      const rect = 'polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)';
      const crushed = 'polygon(10% 14%, 46% 6%, 90% 12%, 82% 48%, 94% 88%, 50% 80%, 8% 92%, 18% 52%)';
      const ball = 'polygon(26% 22%, 50% 34%, 76% 18%, 68% 50%, 82% 80%, 50% 68%, 20% 82%, 32% 50%)';
      return { keyframes: [
        { transform: `rotate(${rotate}deg) scale(1)`, clipPath: rect, filter: 'brightness(1)', opacity: 1 },
        { transform: `rotate(${rotate + 14}deg) scale(.7)`, clipPath: crushed, filter: 'brightness(.93)', offset: .3 },
        { transform: `rotate(${rotate + 70}deg) scale(.34)`, clipPath: ball, filter: 'brightness(.85)', opacity: 1, offset: .55 },
        { transform: `translate(${W * .3}px, ${box.height - cy + 40}px) rotate(${rotate + 240}deg) scale(.26)`, clipPath: ball, filter: 'brightness(.85)', opacity: 0 },
      ], duration: 1150, easing: 'cubic-bezier(.45,.05,.6,1)' };
    }
    const slot = slotFor(note)!, aim = aimFor(slot).getBoundingClientRect();
    const dx = aim.left - box.left + aim.width / 2 - cx, dy = aim.top - box.top + aim.height / 2 - cy;
    const sx = aim.width / W, sy = aim.height / H, mid = Math.max(sy * 2.4, .24);
    return { keyframes: [
      { transform: `translate(0px, 0px) rotate(${rotate}deg) scale(1)`, opacity: 1 },
      { transform: `translate(0px, -8px) rotate(${rotate * .4}deg) scale(1.07)`, opacity: 1, offset: .16 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${mid})`, opacity: 1, offset: .78 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${sx}, ${sy})`, opacity: 0 },
    ], duration: 820, easing: 'cubic-bezier(.55,0,.2,1)' };
  };
  async function tidy() {
    if (busy) return;
    touched = true;
    if (reduced()) { instant(true); live.textContent = 'Tidied into the Kiln panel.'; return; }
    busy = true;
    slots.forEach(slot => slot.classList.remove('is-in'));
    setState('tidying');
    const runs = notes.map((note, n) => {
      const { keyframes, duration, easing } = flight(note);
      const delay = 180 + n * 85;
      const animation = note.animate(keyframes, { duration, delay, easing, fill: 'both' });
      const slot = note.dataset.to === 'crumple' ? win.querySelector<HTMLElement>('[data-slot="cleaned"]') : slotFor(note);
      const tint = tintOf(note);
      return animation.finished.then(() => { note.classList.add('is-gone'); animation.cancel(); if (slot) land(slot, tint); });
    });
    await Promise.all(runs);
    slots.forEach(slot => slot.classList.add('is-in'));
    setState('tidy'); busy = false;
    live.textContent = 'Tidied: 13 notes became 5 rows and 3 columns in the Kiln panel.';
  }
  async function mess() {
    if (busy) return;
    touched = true;
    panel.closeFlyout();
    if (reduced()) { instant(false); live.textContent = 'The notes are back on the wall.'; return; }
    busy = true;
    setState('messing');
    const order = [...notes].reverse();
    const runs = order.map((note, n) => {
      const { keyframes, duration, easing } = flight(note);
      const slot = note.dataset.to === 'crumple' ? win.querySelector<HTMLElement>('[data-slot="cleaned"]') : slotFor(note);
      const animation = note.animate(keyframes, { duration: duration * .8, delay: n * 55, easing, fill: 'both', direction: 'reverse' });
      note.classList.remove('is-gone');
      setTimeout(() => slot?.classList.remove('is-in'), n * 55);
      return animation.finished.then(() => animation.cancel());
    });
    await Promise.all(runs);
    setState('mess'); busy = false;
    live.textContent = 'The notes are back on the wall.';
  }
  button.addEventListener('click', () => (stage.dataset.state === 'tidy' ? mess() : tidy()));
  setState('mess');
  if (reduced()) instant(true);
  else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      document.fonts.ready.then(() => setTimeout(() => { if (!touched) tidy(); }, 900));
    }, { threshold: .45 });
    observer.observe(stage);
  }
  return { tidyNow: () => { if (stage.dataset.state === 'mess') instant(true); } };
}

// ---------- behaviour: the panel ----------

type Panel = { add(name: string): HTMLElement; closeFlyout(): void };
function bindPanel(root: HTMLElement): Panel {
  const win = root.querySelector<HTMLElement>('[data-win]')!;
  const body = win.querySelector<HTMLElement>('[data-rows]')!;
  const status = win.querySelector<HTMLElement>('[data-status]')!;
  const context = win.querySelector<HTMLElement>('[data-context]')!;
  const flyout = win.querySelector<HTMLElement>('[data-flyout]')!;
  const dupes = win.querySelector<HTMLButtonElement>('[data-dupes]')!;
  let returnTo: HTMLElement | null = null;
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const count = (key: Column) => rows.filter(row => row.cells[key] === 'on' || row.cells[key] === 'edited').length;
  const updateContext = () => { context.textContent = `Loaded into every new session: ${count('claude')} skill descriptions in Claude Code, ${count('agents')} in Codex. Switch off what you don't use.`; };
  const refresh = (r: number) => {
    const row = rows[r], tr = body.children[r] as HTMLElement;
    columns.forEach((column, c) => { (tr.children[c + 1] as HTMLElement).innerHTML = toggle(row, r, column); });
    tr.querySelector('[data-caption]')!.textContent = row.note;
    updateContext();
  };
  const closeFlyout = () => { if (flyout.hidden) return; flyout.hidden = true; returnTo?.focus(); returnTo = null; };
  const openFlyout = (html: string, from: HTMLElement) => {
    flyout.innerHTML = html; flyout.hidden = false; returnTo = from;
    flyout.querySelector<HTMLElement>('button')?.focus();
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h03-toggle');
    if (!button) return;
    const r = Number(button.dataset.row), row = rows[r], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') {
      say('This copy was changed outside Kiln. Compare it first.');
      openFlyout(`<h3 id="h03-flyout-title">${column.path}/${row.name} differs from rev 3</h3>
        <div class="h03-diff"><p class="h03-del">- Review standards and the specification separately.</p><p class="h03-add">+ Review the specification only. Skip style.</p></div>
        <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-fly="replace">Replace with rev 3</button><button type="button" class="h03-btn" data-fly="draft">Keep it as draft rev 4</button><button type="button" class="h03-btn h03-btn-subtle" data-fly="close">Cancel</button></div>`, button);
      flyout.dataset.row = String(r); flyout.dataset.col = column.key;
      return;
    }
    if (state === 'found') {
      if (row.imported) { say(`${row.name} is a draft in your library. Approve it to manage this copy.`); return; }
      openFlyout(`<h3 id="h03-flyout-title">${row.name} isn't in your library</h3><p>Import it as a draft. The folder in <code>${column.path}</code> stays exactly where it is.</p>
        <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-fly="import">Import as draft</button><button type="button" class="h03-btn h03-btn-subtle" data-fly="close">Not now</button></div>`, button);
      flyout.dataset.row = String(r); flyout.dataset.col = column.key;
      return;
    }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed ${row.name} from ${column.path}. It stays in your library, history and all.` : `Installed the approved ${row.name} into ${column.path}. Receipt saved.`);
    refresh(r);
    body.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${column.key}"]`)?.focus();
  });
  flyout.addEventListener('click', event => {
    const action = (event.target as Element).closest<HTMLElement>('[data-fly]')?.dataset.fly;
    if (!action) return;
    const r = Number(flyout.dataset.row), row = rows[r], key = flyout.dataset.col as Column;
    if (action === 'replace') { row.cells[key] = 'on'; say('Moved the hand-edited copy to a private backup and installed rev 3.'); }
    if (action === 'draft') { row.cells[key] = 'on'; row.note = 'Approved rev 3, draft rev 4'; say('Saved the edit as draft rev 4. Rev 3 stays installed until you approve the draft.'); }
    if (action === 'import') { row.imported = true; row.note = 'Draft, imported'; say(`Imported ${row.name} as a draft. The original folder hasn't moved.`); }
    if (action !== 'close') { refresh(r); returnTo = body.querySelector<HTMLElement>(`[data-row="${r}"][data-col="${key}"]`); }
    closeFlyout();
  });
  flyout.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closeFlyout(); } });
  dupes.addEventListener('click', () => {
    rows[0].note = rows[0].note.replace('3 folders, 1 skill', 'duplicates removed');
    refresh(0);
    say('Moved code-review (1) and code-review-FINAL to private backups. One code-review left.');
    dupes.hidden = true; status.focus();
  });
  status.tabIndex = -1;
  updateContext();
  return {
    closeFlyout,
    add(name: string) {
      if (rows.some(row => row.name === name)) return body.querySelector<HTMLElement>(`[data-slot="row-${name}"]`)!;
      rows.push({ name, note: 'Approved rev 1, just now', cells: { claude: 'on', agents: 'on', project: 'off' } });
      body.insertAdjacentHTML('beforeend', rowMarkup(rows[rows.length - 1], rows.length - 1));
      const tr = body.lastElementChild as HTMLElement;
      tr.style.setProperty('--land', '#fdf28b');
      tr.classList.add('is-in', 'is-landed');
      updateContext();
      say(`Approved ${name} and switched it on for Claude Code and Codex.`);
      return tr;
    },
  };
}

// ---------- behaviour: every copy ----------

function bindCopies(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-copies]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foot = root.querySelector<HTMLElement>('[data-copyfoot]')!;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  let live = [...copies], confirming = false;
  const draw = () => {
    list.innerHTML = live.length ? live.map((copy, c) => `<li class="h03-copyrow h03-state-${copy.state}"><i aria-hidden="true"></i><div><b><code>${copy.path}</code></b><small>${copy.label}${copy.managed ? '' : ', not installed by Kiln'}</small></div>${copy.state === 'edited' || copy.state === 'differs' ? `<button type="button" class="h03-btn h03-btn-sm" data-compare-copy="${c}" aria-expanded="${!compare.hidden}">Compare</button>` : ''}</li>`).join('')
      : `<li class="h03-empty">No local copies. code-review is still in your library, with every revision.</li>`;
    const managed = live.filter(copy => copy.state === 'installed').length, other = live.length - managed;
    foot.innerHTML = !live.length ? `<button type="button" class="h03-btn h03-btn-sm" data-restore>Install rev 3 again</button><span>Sample: puts the copies back.</span>`
      : confirming ? `<span>Delete ${managed} copies Kiln installed and move the ${other} others, including the edited one, to private backups?</span><button type="button" class="h03-btn h03-btn-sm h03-btn-accent" data-remove-yes>Remove ${live.length} copies</button><button type="button" class="h03-btn h03-btn-sm h03-btn-subtle" data-remove-no>Cancel</button>`
      : `<button type="button" class="h03-btn h03-btn-sm" data-remove>Remove local copies</button><span>${live.length} copies on this machine and in 2 projects</span>`;
  };
  list.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-compare-copy]');
    if (!button) return;
    compare.hidden = !compare.hidden;
    const copy = live[Number(button.dataset.compareCopy)];
    compare.querySelector('b')!.textContent = copy.path;
    draw();
    list.querySelector<HTMLButtonElement>(`[data-compare-copy="${button.dataset.compareCopy}"]`)?.focus();
  });
  foot.addEventListener('click', event => {
    const target = (event.target as Element).closest<HTMLElement>('button');
    if (!target) return;
    if (target.matches('[data-remove]')) confirming = true;
    if (target.matches('[data-remove-no]')) confirming = false;
    if (target.matches('[data-remove-yes]')) { confirming = false; live = []; compare.hidden = true; }
    if (target.matches('[data-restore]')) live = [...copies];
    draw();
    foot.querySelector<HTMLButtonElement>('button')?.focus();
  });
  const select = (tab: HTMLButtonElement) => {
    tabs.forEach(item => { const on = item === tab; item.setAttribute('aria-selected', String(on)); item.tabIndex = on ? 0 : -1; root.querySelector<HTMLElement>(`[data-panel="${item.dataset.tab}"]`)!.hidden = !on; });
    tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      select(tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]);
    });
  });
  draw();
}

// ---------- behaviour: drag a saved note into Test ----------

const stepIcon: Record<Idea['steps'][number][0], string> = {
  read: 'M4 3.5h8l3 3v10H4zM12 3.5v3h3', search: 'M8.5 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 12l4.5 4.5',
  think: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4', run: 'M3.5 5.5l4 4-4 4M9.5 14.5h7',
};

function bindTest(root: HTMLElement, panel: Panel, stage: Stage) {
  const board = root.querySelector<HTMLElement>('[data-ideas]')!;
  const run = root.querySelector<HTMLElement>('[data-run]')!;
  let busy = false, token = 0;
  const used = new Set<number>();
  const idle = () => {
    run.innerHTML = `<div class="h03-drop" data-drop><svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M24 8v22M15 21l9 9 9-9M9 34v6h30v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <p><b>Drop a saved idea here</b></p><p class="h03-caption">It runs on ~/code/my-game without changing a file. On this page it replays a sample run.</p></div>`;
  };
  const drawBoard = () => {
    board.innerHTML = ideas.map((idea, n) => used.has(n) ? `<div class="h03-idea-ghost" role="listitem" aria-label="${idea.title}, tested"><span>tested</span></div>`
      : `<div class="h03-idea h03-t-${idea.tint}" role="listitem"><div class="h03-idea-note" data-idea="${n}" tabindex="0" role="button" aria-label="Test “${idea.title}” (${idea.source})" style="--r:${[-3, 2.5, -1.5, 3.5][n]}deg">
        <small>${idea.source}</small><p>${idea.title}</p></div></div>`).join('');
    if (used.size === ideas.length) board.insertAdjacentHTML('beforeend', `<p class="h03-pile-done">That's the pile. <button type="button" class="h03-btn h03-btn-sm" data-again>Put them back</button></p>`);
    board.querySelector('[data-again]')?.addEventListener('click', () => { used.clear(); drawBoard(); idle(); board.querySelector<HTMLElement>('[data-idea]')?.focus(); });
  };
  const dropZone = () => run.querySelector<HTMLElement>('[data-drop]') ?? run;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced() ? 0 : ms));

  const send = async (note: HTMLElement) => {
    if (busy) return;
    busy = true;
    const n = Number(note.dataset.idea), zone = dropZone().getBoundingClientRect(), from = note.getBoundingClientRect();
    dropZone().classList.remove('is-over');
    if (!reduced()) {
      const current = note.style.transform || `rotate(${note.style.getPropertyValue('--r')})`;
      const dx = zone.left + zone.width / 2 - (from.left + from.width / 2), dy = zone.top + 60 - (from.top + from.height / 2);
      const offset = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(note.style.transform);
      const ox = offset ? Number(offset[1]) : 0, oy = offset ? Number(offset[2]) : 0;
      note.classList.add('is-flying');
      await note.animate([{ transform: current }, { transform: `translate(${ox + dx}px, ${oy + dy}px) rotate(0deg) scale(.3)`, opacity: .2 }], { duration: 560, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'forwards' }).finished;
    }
    used.add(n); drawBoard();
    play(n);
  };

  async function play(n: number, revision = 1) {
    const idea = ideas[n], mine = ++token, verdict = revision > 1 ? 'pass' : idea.verdict;
    busy = true;
    run.innerHTML = `<div class="h03-run-head"><h3>${idea.title}</h3><span class="h03-badge">rev ${revision}</span></div>
      <p class="h03-prompt">${revision > 1 && idea.fix ? idea.prompt.replace(idea.fix.before, `<mark>${idea.fix.after}</mark>`) : idea.prompt}</p>
      <p class="h03-running" data-running><span class="h03-ring" aria-hidden="true"></span><span data-elapsed>Running, 0 s</span></p>
      <ol class="h03-steps" data-steps></ol>
      <p class="h03-meta" data-meta>Claude Code, your default model, medium effort</p>
      <div data-outcome></div>`;
    if (revision === 1 && innerWidth < 900) run.closest('.h03-tester')?.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    const steps = run.querySelector<HTMLElement>('[data-steps]')!, elapsed = run.querySelector<HTMLElement>('[data-elapsed]')!, meta = run.querySelector<HTMLElement>('[data-meta]')!;
    const list = revision > 1 && idea.fix ? [...idea.steps.slice(0, -1), ['think', idea.fix.step] as Idea['steps'][number]] : idea.steps;
    for (const [index, [kind, text]] of list.entries()) {
      await wait(620);
      if (mine !== token) return;
      steps.insertAdjacentHTML('beforeend', `<li>${navIcon(stepIcon[kind])}<span>${text}</span></li>`);
      const seconds = 38 * (index + 1) + (revision > 1 ? 4 : 0);
      elapsed.textContent = `Running, ${Math.floor(seconds / 60)} min ${seconds % 60} s`;
      meta.textContent = `Claude Code, your default model, medium effort. Tokens: ${(7.1 * (index + 1)).toFixed(1)}k in, ${(4.2 * index).toFixed(1)}k cached, ${(0.5 * (index + 1)).toFixed(1)}k out (sample)`;
    }
    await wait(420);
    if (mine !== token) return;
    run.querySelector('[data-running]')!.innerHTML = `<span class="h03-done" aria-hidden="true"></span>Finished in ${Math.floor((38 * list.length) / 60)} min ${(38 * list.length) % 60} s. Nothing in the repo changed.`;
    const outcome = run.querySelector<HTMLElement>('[data-outcome]')!;
    busy = false;
    if (verdict === 'uncertain' && idea.fix) {
      outcome.innerHTML = `<div class="h03-verdict h03-verdict-uncertain"><b>Uncertain</b><span>The agent's own assessment: it found two confusing spots and couldn't say which comes first.</span></div>
        <p class="h03-caption">Change one line and run it again on the same repo:</p>
        <div class="h03-diff"><p class="h03-del">- ${idea.fix.before}</p><p class="h03-add">+ ${idea.fix.after}</p></div>
        <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-rerun>Run rev 2</button></div>`;
      const rerun = outcome.querySelector<HTMLButtonElement>('[data-rerun]')!;
      rerun.addEventListener('click', () => play(n, 2));
      rerun.focus({ preventScroll: true });
      return;
    }
    outcome.innerHTML = `<div class="h03-verdict h03-verdict-pass"><b>Pass</b><span>The agent's assessment. Whether you keep it is up to you.</span></div>
      ${revision > 1 && idea.fix ? `<p class="h03-lesson">${idea.fix.lesson}</p>` : ''}
      <div class="h03-flyout-actions"><button type="button" class="h03-btn h03-btn-accent" data-keep>Approve and install as ${idea.skill}</button><button type="button" class="h03-btn h03-btn-subtle" data-skip>Not for me</button></div>`;
    outcome.querySelector('[data-keep]')!.addEventListener('click', () => {
      stage.tidyNow();
      const row = panel.add(idea.skill);
      outcome.innerHTML = `<div class="h03-verdict h03-verdict-pass"><b>Installed</b><span>${idea.skill} is on your panel now, switched on for Claude Code and Codex.</span></div>
        <div class="h03-flyout-actions"><a class="h03-btn" href="#h03-hero" data-see>See it on the panel</a><button type="button" class="h03-btn h03-btn-subtle" data-next>Test another</button></div>`;
      outcome.querySelector('[data-see]')!.addEventListener('click', event => { event.preventDefault(); row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); row.classList.remove('is-landed'); void row.offsetWidth; row.classList.add('is-landed'); });
      outcome.querySelector('[data-next]')!.addEventListener('click', idle);
    });
    outcome.querySelector('[data-skip]')!.addEventListener('click', idle);
  }

  // pointer drag with a click fallback; Enter or Space on a focused note sends it too
  board.addEventListener('pointerdown', event => {
    const note = (event.target as Element).closest<HTMLElement>('[data-idea]');
    if (!note || busy || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const startX = event.clientX, startY = event.clientY;
    let moved = false;
    note.setPointerCapture(event.pointerId);
    const over = (x: number, y: number) => { const r = dropZone().getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; };
    const move = (e: PointerEvent) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      note.classList.add('is-dragging');
      note.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 40}deg) scale(1.04)`;
      dropZone().classList.toggle('is-over', over(e.clientX, e.clientY));
    };
    const up = (e: PointerEvent) => {
      note.removeEventListener('pointermove', move); note.removeEventListener('pointerup', up); note.removeEventListener('pointercancel', up);
      note.classList.remove('is-dragging');
      if (!moved || (e.type === 'pointerup' && over(e.clientX, e.clientY))) { send(note); return; }
      dropZone().classList.remove('is-over');
      note.animate([{ transform: note.style.transform }, { transform: `rotate(${note.style.getPropertyValue('--r')})` }], { duration: reduced() ? 0 : 420, easing: 'cubic-bezier(.2,1.5,.4,1)' });
      note.style.transform = '';
    };
    note.addEventListener('pointermove', move); note.addEventListener('pointerup', up); note.addEventListener('pointercancel', up);
  });
  board.addEventListener('keydown', event => {
    const note = (event.target as Element).closest<HTMLElement>('[data-idea]');
    if (note && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); send(note); }
  });
  drawBoard();
  idle();
}
