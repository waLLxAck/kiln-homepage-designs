// PROTOTYPE round 4, H05 — Red-pen review. The crisp Kiln screen is the page; a developer's red pen and highlighter
// mark it up as you scroll (library, then the skills panel, then a test run). The old folders show up last, as a margin scribble.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, cross, ellipse, folder, line, reseed } from '../r3-kit/rough';

// ---------- small helpers ----------

const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const icon = (d: string) => `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icons = {
  library: 'M4 3.5v13M8 3.5v13M11.5 4.2l3.8 12',
  skills: 'M3 6.5h8M3 13.5h5M14 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16 6.5h1M14 13.5h3',
  tests: 'M8 3h4M8.8 3v5L4.5 15.2a1.3 1.3 0 0 0 1.1 1.8h8.8a1.3 1.3 0 0 0 1.1-1.8L11.2 8V3M6.5 12h7',
  config: 'M5 2.8h6.5L15 6.3v10.9H5zM11.5 2.8v3.5H15M7.5 10h5M7.5 13h3.5',
  git: 'M6 3.5v13M6 6.5a3 3 0 0 0 3 3h2a3 3 0 0 1 3 3v1M14 16.5a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2ZM6 3.5',
};
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---------- the product: sample data ----------

type Cell = 'on' | 'off' | 'edited';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; fresh?: boolean };
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
  { name: 'code-review (1)', where: '~/.claude/skills', kind: 'duplicate' as const, text: 'second copy of code-review' },
  { name: 'pr-summary', where: '~/.agents/skills', kind: 'stray' as const, text: 'not in the library yet' },
];
type Kind = 'Prompt' | 'Skill' | 'Agent' | 'Note';
const items: { kind: Kind; title: string; meta: string; selected?: boolean; star?: boolean }[] = [
  { kind: 'Prompt', title: examples[0].title, meta: '<span data-t="source" class="h5-hl" data-hl="a4">YouTube talk, 12:41</span> · <span data-lib-state>passed rev 1</span>', selected: true },
  { kind: 'Skill', title: 'code-review', meta: 'approved rev 3 · 3 copies', star: true },
  { kind: 'Prompt', title: examples[1].title, meta: 'agent workflow video, 31:05 · untested' },
  { kind: 'Agent', title: 'release-notes', meta: 'Claude Code agent · draft' },
  { kind: 'Skill', title: 'research', meta: 'approved rev 2' },
  { kind: 'Prompt', title: examples[2].title, meta: 'saved prompt · untested', star: true },
  { kind: 'Note', title: 'Someone\'s CLAUDE.md', meta: 'screenshot · source note' },
  { kind: 'Skill', title: 'writing-for-agents', meta: 'approved rev 1' },
];
const runLines = [
  ['read', 'Read README.md and package.json'],
  ['read', 'Opened src/screens/Start.tsx'],
  ['search', 'Searched src/ for "signup", skipped the parent flow'],
  ['read', 'Walked Levels, Shop and Settings'],
  ['think', 'First obstacle: the play button is an icon with no label'],
];

// ---------- the red pen: annotation data ----------

type Mark = 'circle' | 'loop' | 'box' | 'underline' | 'bracket' | 'none';
type Pane = 'lib' | 'panel' | 'run';
type Note = { id: string; step: 1 | 2 | 3 | 4; pane: Pane; side: 'before' | 'after'; target: string; mark: Mark; at: [number, number, number, number]; text: string; big?: boolean; hl?: boolean; noArrow?: boolean };
// `at` = left, top, width, rotation on the 1360 × 840 desktop sheet. The window sits at 160,120 and is 1040 × 600.
const notes: Note[] = [
  { id: 'a1', step: 1, pane: 'lib', side: 'before', target: '[data-t="import"]', mark: 'circle', at: [18, 150, 134, -3], text: 'imported my old skill folders as drafts. originals stayed put.' },
  { id: 'a2', step: 1, pane: 'lib', side: 'before', target: '[data-t="chips"]', mark: 'underline', at: [16, 282, 136, 2], text: 'filter by kind, status, provider, where it’s installed…' },
  { id: 'a3', step: 1, pane: 'lib', side: 'after', target: '[data-t="list"]', mark: 'bracket', at: [14, 396, 132, -2], text: 'every prompt, skill, agent and note I’d saved. one list. <b>searchable.</b>' },
  { id: 'a4', step: 1, pane: 'lib', side: 'after', target: '[data-t="source"]', mark: 'none', hl: true, at: [18, 556, 130, 3], text: 'and it keeps the minute of the video it came from' },
  { id: 'b1', step: 2, pane: 'panel', side: 'before', target: '[data-t="grid"]', mark: 'loop', at: [712, 38, 420, -2.5], big: true, text: '<b>THIS</b> is the bit I wanted.' },
  { id: 'b2', step: 2, pane: 'panel', side: 'before', target: '[data-t="amber"]', mark: 'circle', at: [470, 20, 214, -2], text: 'amber = someone hand-edited it. Kiln shows me the diff first.' },
  { id: 'b3', step: 2, pane: 'panel', side: 'after', target: '[data-t="context"]', mark: 'none', hl: true, at: [626, 734, 262, 1.5], text: 'switch off = gone from context. every skill here rides along on every turn, used or not.' },
  { id: 'b4', step: 2, pane: 'panel', side: 'after', target: '[data-t="found"]', mark: 'bracket', at: [300, 734, 196, -2], text: 'strays it found on my disk. import or bin, one click.' },
  { id: 'c1', step: 3, pane: 'run', side: 'before', target: '[data-t="ro"]', mark: 'circle', at: [1216, 150, 136, 3], text: 'read-only. it can’t change a line of my code.' },
  { id: 'c2', step: 3, pane: 'run', side: 'before', target: '[data-t="elapsed"]', mark: 'circle', at: [1218, 268, 136, -3], text: 'this took 3 min on my repo <small>(sample run)</small>' },
  { id: 'c3', step: 3, pane: 'run', side: 'before', target: '[data-t="tokens"]', mark: 'underline', at: [1218, 384, 136, 2], text: 'tokens in / cached / out, every run. on my Claude sub, no API key.' },
  { id: 'c4', step: 3, pane: 'run', side: 'after', target: '[data-t="verdict"]', mark: 'box', at: [1218, 532, 136, -2], text: 'pass is the agent’s call. keeping it is mine. <small>(can’t tell? it says uncertain, no fake pass)</small>' },
  { id: 'd1', step: 4, pane: 'run', side: 'after', target: '[data-t="run-btn"]', mark: 'none', at: [980, 736, 250, -2], text: 'your turn: hit <b>Run</b>, then <b>Approve</b>. watch the panel.' },
  { id: 'd2', step: 4, pane: 'panel', side: 'before', target: '[data-t="try"]', mark: 'none', noArrow: true, at: [800, 93, 320, -1.5], text: 'p.s. the switches are real. flip one.' },
];
const stepNames = ['The library', 'The skills panel', 'A test run', 'Your turn'];

// ---------- markup ----------

function titlebar() {
  return `<div class="h5-titlebar">
    <span class="h5-app"><i class="h5-logo"></i>Kiln</span>
    <span class="h5-search-all">Search everything<kbd>Ctrl+Shift+Space</kbd></span>
    <span class="h5-git">my-kiln · main · <b>synced</b></span>
    <span class="h5-winctl" aria-hidden="true"><i>&#x2013;</i><i>&#x25A1;</i><i>&#x2715;</i></span>
  </div>`;
}

function libraryPane() {
  const kinds = ['All', 'Prompts', 'Skills', 'Agents'];
  return `<section class="h5-pane h5-lib" aria-label="Library, sample">
    <header class="h5-pane-head"><b>Library</b><span>sample</span><button type="button" class="h5-mini-btn" data-t="import">Import…</button></header>
    <div class="h5-lib-tools">
      <label class="h5-field"><span class="visually-hidden">Search the sample library</span><input type="search" placeholder="Search prompts, skills, notes" data-lib-search></label>
      <div class="h5-chips" data-t="chips" role="group" aria-label="Filter by kind">${kinds.map((kind, i) => `<button type="button" class="h5-chip${i ? '' : ' is-on'}" data-kind="${kind}" aria-pressed="${!i}">${kind}</button>`).join('')}</div>
      <div class="h5-lib-filters"><span>Status: any</span><span>Installed in: any</span><span>Tag</span></div>
    </div>
    <p class="h5-lib-collections"><span>Agent workflows</span><span>Game design</span><span>Skills to refine</span></p>
    <ul class="h5-list" data-t="list" data-list></ul>
  </section>`;
}

function listItems(filter = 'All', query = '') {
  const shown = items.filter(item => (filter === 'All' || `${item.kind}s` === filter) && item.title.toLowerCase().includes(query.toLowerCase()));
  return shown.map(item => `<li class="${item.selected ? 'is-selected' : ''}"><i class="h5-kind h5-kind-${item.kind.toLowerCase()}">${item.kind}</i><div><b>${item.title}</b><small>${item.meta}</small></div>${item.star ? '<span class="h5-star" aria-label="Favorite">&#x2605;</span>' : ''}</li>`).join('')
    || '<li class="h5-list-empty">Nothing matches in this sample.</li>';
}

function panelPane() {
  return `<section class="h5-pane h5-panel" aria-label="Skills panel, sample">
    <header class="h5-pane-head"><b>Skills</b><span>one switch per skill per folder</span><span class="h5-tabs"><i class="is-on">Installed</i><i>Receipts</i></span></header>
    <div class="h5-grid" data-t="grid">
      <table><thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h5-long">${column.name}</span><span class="h5-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead><tbody data-rows></tbody></table>
    </div>
    <div class="h5-compare" data-compare hidden>
      <p><b>~/.claude/skills/code-review</b> differs from approved rev 3</p>
      <div class="h5-diff"><p class="h5-del">- Review standards and the specification separately.</p><p class="h5-add">+ Review the specification only.</p></div>
      <div class="h5-row-actions"><button type="button" class="h5-btn" data-replace>Replace with rev 3</button><button type="button" class="h5-btn h5-btn-quiet" data-keep>Keep edit as draft</button></div>
    </div>
    <div class="h5-found" data-t="found"><h3>Found outside your library</h3><ul data-found></ul></div>
    <footer class="h5-panel-foot"><p data-t="context"><span class="h5-hl" data-hl="b3" data-context></span></p><p class="h5-status" data-status aria-live="polite">Flip a switch to see what Kiln does.</p></footer>
  </section>`;
}

function runPane() {
  return `<section class="h5-pane h5-run" aria-label="Test run, sample">
    <header class="h5-pane-head"><b>Test run</b><span>rev 1</span><span class="h5-live" data-live>done</span></header>
    <dl class="h5-run-ctx">
      <div><dt>Project</dt><dd>~/code/my-game <i class="h5-badge" data-t="ro">read-only</i></dd></div>
      <div><dt>Agent</dt><dd>Claude Code, your subscription</dd></div>
      <div><dt>Model</dt><dd>default · effort medium</dd></div>
    </dl>
    <div class="h5-meter"><span data-t="elapsed"><b data-elapsed>2:58</b> elapsed</span><span data-t="tokens" data-tokens>41.2k in · 28.0k cached · 2.1k out</span></div>
    <p class="h5-prompt"><b>${examples[0].title}</b>${examples[0].prompt}</p>
    <ol class="h5-log" data-log></ol>
    <div class="h5-verdict" data-t="verdict" data-verdict></div>
    <div class="h5-run-actions"><button type="button" class="h5-btn h5-btn-quiet" data-t="run-btn" data-run>Run again</button><button type="button" class="h5-btn" data-approve>Approve and install</button></div>
    <div class="h5-landed" data-landed hidden><p>It’s on the panel now, switched on for Claude Code and my-game.</p><button type="button" class="h5-btn h5-btn-quiet" data-show-panel>Show me</button></div>
  </section>`;
}

const noteHtml = (note: Note) => `<p class="h5-note${note.big ? ' h5-note-big' : ''}" data-note="${note.id}" style="--x:${note.at[0]}px;--y:${note.at[1]}px;--w:${note.at[2]}px;--r:${note.at[3]}deg">${note.text}</p>`;
const notesFor = (pane: Pane, side: 'before' | 'after') => `<div class="h5-notes h5-notes-${side}">${notes.filter(note => note.pane === pane && note.side === side).map(noteHtml).join('')}</div>`;

function reviewSection() {
  return `<section class="h5-review" id="h5-review" aria-label="The Kiln screen, marked up">
    <div class="h5-track" data-track>
      <div class="h5-sticky" data-sticky>
        <div class="h5-stage-box" data-box>
          <div class="h5-stage" data-stage>
            <i class="h5-crop h5-crop-tl"></i><i class="h5-crop h5-crop-tr"></i><i class="h5-crop h5-crop-bl"></i><i class="h5-crop h5-crop-br"></i>
            <div class="h5-window">
              ${titlebar()}
              <div class="h5-body">
                <nav class="h5-rail" aria-label="Sample app sections">${Object.entries(icons).map(([name, d], i) => `<span class="${i < 3 ? 'is-lit' : ''}" title="${name}">${icon(d)}</span>`).join('')}</nav>
                ${notesFor('lib', 'before')}${libraryPane()}${notesFor('lib', 'after')}
                ${notesFor('panel', 'before')}${panelPane()}${notesFor('panel', 'after')}
                ${notesFor('run', 'before')}${runPane()}${notesFor('run', 'after')}
              </div>
            </div>
            <ol class="h5-legend" aria-label="Review notes">${stepNames.map((name, i) => `<li><button type="button" data-step="${i + 1}"><span>${i + 1}</span>${name}</button></li>`).join('')}</ol>
            <svg class="h5-ink" data-ink aria-hidden="true"></svg>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function beforeSketch() {
  reseed(23);
  let i = 0;
  const s = (d: string, ink: 'p' | 'r' = 'p') => `<path d="${d}" class="h5-s h5-${ink}" pathLength="1" style="--i:${i++}"/>`;
  const t = (x: number, y: number, text: string, ink: 'p' | 'r' = 'p', size = 19, rot = 0) => `<text x="${x}" y="${y}" class="h5-t h5-${ink}t" font-size="${size}" style="--i:${i++}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''}>${text}</text>`;
  return `<svg class="h5-before-art" viewBox="0 0 340 560" role="img" aria-label="A pencil scribble of the old setup: three skill folders with code-review, code-review (1), code-review-old and code-review-FINAL, a dead link crossed out, a note saying watch later times fifty, and a red question: which one is Claude reading?">
    ${s(folder(14, 30, 250, 128))}${t(22, 22, '~/.claude/skills', 'p', 18)}
    ${t(34, 70, 'code-review')}${t(34, 96, 'code-review (1)')}${t(34, 122, 'research')}${t(34, 148, 'playtest ??')}
    ${s(folder(40, 196, 270, 110))}${t(48, 188, '~/.agents/skills', 'p', 18)}
    ${t(60, 236, 'code-review')}${t(60, 262, 'writing-for-agents')}${t(84, 290, 'old-link', 'r')}${s(cross(70, 284, 7), 'r')}
    ${s(folder(10, 342, 262, 94))}${t(18, 334, 'my-game/.github/skills', 'p', 18)}
    ${t(30, 382, 'code-review-old')}${t(30, 410, 'code-review-FINAL')}
    ${s(ellipse(94, 70, 76, 17, .06), 'r')}${s(ellipse(114, 236, 72, 16, .06), 'r')}${s(ellipse(104, 382, 88, 17, .06), 'r')}
    ${t(196, 478, 'which one is', 'r', 21, -4)}${t(196, 503, 'Claude reading??', 'r', 21, -4)}
    ${s(arrow(236, 452, 196, 400, -14, 11), 'r')}
    ${s(`M 20 468 L 166 462 L 170 530 L 24 536 Z`)}${t(34, 494, 'watch later', 'p', 19, -2)}${t(34, 520, 'bookmarks ×50', 'p', 19, -2)}
  </svg>`;
}

function beforeSection() {
  return `<section class="h5-before h5-drawable" id="h5-before" aria-labelledby="h5-before-title">
    <figure class="h5-margin">${beforeSketch()}<figcaption>my setup, before. drawn from memory.</figcaption></figure>
    <div class="h5-before-copy">
      <h2 id="h5-before-title">What it replaced</h2>
      <p>My skills lived in five places: <code>~/.claude/skills</code> for Claude Code, <code>~/.agents/skills</code> for Codex and Copilot, a <code>.github/skills</code> in every project, plus prompts in chats, notes and bookmarks. I had four versions of code-review and couldn’t tell you which one Claude was reading.</p>
      <p>Every one of those skills puts its description into the agent’s context on every turn, whether it fires or not. I was paying attention and tokens for skills I’d forgotten about.</p>
      <p>Now the good prompts get tested the day I save them, and the ones that pass go on the panel. Everything else I can see, and switch off.</p>
    </div>
  </section>`;
}

function questionsSection() {
  const qa = [
    ['Do I need an API key?', 'No. Kiln drives the Codex or Claude Code you’re already signed into, on your ChatGPT or Claude plan. Your plan’s usage limits still apply. Editing, approving and installing never call a model.'],
    ['Will a test change my code?', '<mark class="h5-hl" data-hl="q">No. Experiments are read-only.</mark> You pick a local project or an isolated example, and Kiln runs the exact revision. Up to two runs at once; cancel or retry any time.'],
    ['What does approving do?', 'It pins that exact revision and publishes it to your own Kiln GitHub repository. Editing makes a new draft; installs always use the approved one.'],
    ['What about my other machine?', 'Open your Kiln repo there and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.'],
    ['How do things get into the library?', 'Ctrl+Shift+Space from anywhere. Paste a post, a link, a screenshot or a file. A YouTube link becomes prompts and techniques with timestamped sources.'],
    ['And my config files?', 'CLAUDE.md, AGENTS.md, Codex config.toml, Claude settings, MCP config and hooks, edited where they live, with 30 private backups. Kiln never runs your hooks.'],
  ];
  return `<section class="h5-questions" aria-labelledby="h5-q-title">
    <h2 id="h5-q-title">What you’d ask me next</h2>
    <dl>${qa.map(([q, a]) => `<div><dt>${q}</dt><dd>${a}</dd></div>`).join('')}</dl>
  </section>`;
}

function getSection() {
  return `<section class="h5-get" id="h5-get" aria-labelledby="h5-get-title">
    <h2 id="h5-get-title">Point it at your own skill folders.</h2>
    <p>Import what you have, see every copy, switch off what you don’t use. Then test the next prompt you save on your own repo.</p>
    <a class="h5-download" href="${installer}">${windows}<span>Download Kiln 0.17.0 for Windows</span></a>
    <p class="h5-fine">Works with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so you’ll need to sign in with an account that has access. The build is unsigned. MIT licensed, with a CLI that returns JSON.</p>
  </section>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h5">
    <header class="h5-top"><a class="h5-brand" href="#main"><i class="h5-logo"></i>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h5-review">The screen</a><a href="#h5-get" class="h5-top-get">Download</a></nav></header>
    <main id="main">
      <section class="h5-hero" aria-labelledby="h5-title">
        <h1 id="h5-title">My agents were loading skills I forgot I had. So I built this.</h1>
        <div class="h5-hero-side">
          <p>Kiln is a Windows app for Codex, Claude Code and Copilot. It puts every skill your agents can see on one screen, with a switch per folder, and it tests a prompt on your own repo before you keep it. Here’s the screen. I marked up the bits that matter.</p>
          <div class="h5-hero-actions"><a class="h5-download" href="${installer}">${windows}<span>Download for Windows</span></a><a class="h5-link" href="#h5-review">Read the notes</a></div>
          <a class="h5-scrawl" href="#h5-before">(what it replaced is at the bottom. it wasn’t pretty.)</a>
        </div>
      </section>
      ${reviewSection()}
      ${beforeSection()}
      ${questionsSection()}
      ${getSection()}
    </main>
  </div>`;
  const panel = bindPanel(root);
  const review = bindReview(root);
  bindLibrary(root);
  bindRun(root, panel, review);
  bindDrawables(root);
}

// ---------- red pen engine ----------

type Rect = { x: number; y: number; w: number; h: number };

function bindReview(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const sticky = root.querySelector<HTMLElement>('[data-sticky]')!;
  const box = root.querySelector<HTMLElement>('[data-box]')!;
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const ink = root.querySelector<SVGSVGElement>('[data-ink]')!;
  const legend = root.querySelectorAll<HTMLButtonElement>('.h5-legend button');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const auto = navigator.webdriver;
  const on = new Set<string>();
  let desk = false, first = true, k = 1, stepPx = 500, top = 20, maxStep = 0, observer: IntersectionObserver | undefined;
  let landed: { from: string; to: string } | undefined;

  const rel = (el: Element): Rect => {
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  };
  const pad = (r: Rect, p: number): Rect => ({ x: r.x - p, y: r.y - p, w: r.w + p * 2, h: r.h + p * 2 });
  const path = (d: string, ink = 'r', i = 0, cls = '') => `<path d="${d}" class="h5-s h5-${ink} ${cls}" pathLength="1" style="--i:${i}"/>`;

  function markPath(mark: Mark, r: Rect) {
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    if (mark === 'circle') return ellipse(cx, cy, r.w / 2 + Math.min(18, 8 + r.w * .05), r.h / 2 + 9, .05, 1.08);
    if (mark === 'loop') {
      const a = r.w / 2 + 12, b = r.h / 2 + 7, n = 90, phase = Math.random() * 6;
      let d = '';
      for (let i = 0; i <= n * 1.07; i++) {
        const t = -1.9 + (i / n) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), wob = 1 + .012 * Math.sin(t * 3 + phase) + (i / n) * .018;
        d += `${i ? 'L' : 'M'}${(cx + Math.sign(c) * Math.pow(Math.abs(c), .4) * a * wob).toFixed(1)},${(cy + Math.sign(s) * Math.pow(Math.abs(s), .4) * b * wob).toFixed(1)} `;
      }
      return d;
    }
    if (mark === 'box') { const b = pad(r, 5); return `${line(b.x, b.y, b.x + b.w, b.y, 1.5)} ${line(b.x + b.w, b.y, b.x + b.w, b.y + b.h, 1.5)} ${line(b.x + b.w, b.y + b.h, b.x, b.y + b.h, 1.5)} ${line(b.x, b.y + b.h, b.x + 4, b.y - 3, 1.5)}`; }
    if (mark === 'underline') return `${line(r.x - 2, r.y + r.h + 4, r.x + r.w + 4, r.y + r.h + 2, 1.2)} ${line(r.x + 8, r.y + r.h + 9, r.x + r.w - 6, r.y + r.h + 8, 1.2)}`;
    if (mark === 'bracket') { const x = r.x - 7; return `M${x + 7},${r.y + 2} Q${x},${r.y + 2} ${x},${r.y + 14} L${x - 1},${cy - 8} Q${x - 1},${cy} ${x - 8},${cy} Q${x - 1},${cy} ${x},${cy + 8} L${x + 1},${r.y + r.h - 14} Q${x + 1},${r.y + r.h - 2} ${x + 8},${r.y + r.h - 2}`; }
    return '';
  }
  function arrowPath(from: Rect, to: Rect, bendSign = 1) {
    const fc = { x: from.x + from.w / 2, y: from.y + from.h / 2 }, tc = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
    let sx: number, sy: number;
    if (tc.x > from.x + from.w + 10) { sx = from.x + from.w + 6; sy = Math.min(Math.max(tc.y, from.y + 8), from.y + from.h - 4); }
    else if (tc.x < from.x - 10) { sx = from.x - 6; sy = Math.min(Math.max(tc.y, from.y + 8), from.y + from.h - 4); }
    else if (tc.y > fc.y) { sx = Math.min(Math.max(tc.x, from.x + 10), from.x + from.w - 10); sy = from.y + from.h + 4; }
    else { sx = Math.min(Math.max(tc.x, from.x + 10), from.x + from.w - 10); sy = from.y - 6; }
    const ex = Math.min(Math.max(sx, to.x), to.x + to.w), ey = Math.min(Math.max(sy, to.y), to.y + to.h);
    const dist = Math.hypot(ex - sx, ey - sy);
    if (dist < 16) return '';
    return arrow(sx, sy, ex, ey, bendSign * Math.min(28, dist * .18), Math.min(13, 6 + dist * .05));
  }

  function draw() {
    const w = stage.offsetWidth, h = stage.offsetHeight;
    ink.setAttribute('viewBox', `0 0 ${w} ${h}`);
    ink.setAttribute('width', String(w)); ink.setAttribute('height', String(h));
    let out = '';
    notes.forEach((note, n) => {
      const target = stage.querySelector(note.target), noteEl = stage.querySelector(`[data-note="${note.id}"]`);
      if (!target || !noteEl) return;
      reseed(101 + n * 17);
      const t = rel(target), p = rel(noteEl);
      const markRect = note.mark === 'circle' || note.mark === 'loop' ? pad(t, 12) : note.mark === 'bracket' ? { ...t, x: t.x - 14, w: 14 } : pad(t, 4);
      const m = markPath(note.mark, t);
      const a = note.noArrow ? '' : arrowPath(p, markRect, n % 2 ? 1 : -1);
      const extra = note.big ? path(line(p.x + 4, p.y + p.h + 2, p.x + p.w * .5, p.y + p.h - 1, 1), 'r', 2) : '';
      out += `<g class="h5-mark${on.has(note.id) ? ' is-on' : ''}" data-mark="${note.id}">${m ? path(m, 'r', 0) : ''}${a ? path(a, 'r', 1) : ''}${extra}</g>`;
    });
    if (landed) {
      const from = stage.querySelector(landed.from), to = stage.querySelector(landed.to);
      if (from && to) {
        reseed(77);
        const f = rel(from), t = rel(to);
        const toRect = pad(t, 3);
        const a = desk ? arrow(f.x + 8, f.y - 4, toRect.x + toRect.w - 10, toRect.y + toRect.h / 2 + 8, 60, 14) : '';
        out += `<g class="h5-mark is-on h5-landed-mark">${path(ellipse(t.x + t.w * .42, t.y + t.h / 2, t.w * .46, t.h / 2 + 6, .05, 1.06), 'r', 0)}${a ? path(a, 'r', 1) : ''}</g>`;
      }
    }
    ink.innerHTML = out;
  }

  function turnOn(id: string) {
    if (on.has(id)) return;
    on.add(id);
    const apply = () => {
      stage.querySelector(`[data-mark="${id}"]`)?.classList.add('is-on');
      stage.querySelector(`[data-note="${id}"]`)?.classList.add('is-on');
      root.querySelectorAll(`[data-hl="${id}"]`).forEach(el => el.classList.add('is-on'));
    };
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }
  function setStep(step: number) {
    if (step > maxStep) {
      maxStep = step;
      const group = notes.filter(note => note.step <= step && !on.has(note.id));
      group.forEach((note, i) => setTimeout(() => turnOn(note.id), reduced || auto ? 0 : i * 380));
    }
    legend.forEach(button => button.classList.toggle('is-current', Number(button.dataset.step) === Math.max(1, step)));
  }

  function layout() {
    const avail = root.querySelector<HTMLElement>('.h5-review')!.clientWidth;
    const wantDesk = innerWidth >= 1100 && avail / 1360 >= .78;
    if (wantDesk !== desk || first) { first = false; desk = wantDesk; root.querySelector('.h5')!.classList.toggle('h5-desk', desk); root.querySelector('.h5')!.classList.toggle('h5-stack', !desk); bindStackObserver(); }
    if (desk) {
      k = Math.min(1, avail / 1360, (innerHeight - 24) / 840);
      stage.style.transform = `scale(${k})`;
      box.style.width = `${1360 * k}px`; box.style.height = `${840 * k}px`;
      top = Math.max(12, (innerHeight - 840 * k) / 2);
      sticky.style.top = `${top}px`;
      stepPx = Math.round(innerHeight * .55);
      track.style.height = auto ? '' : `${840 * k + stepPx * 3}px`;
    } else {
      k = 1; stage.style.transform = ''; box.style.width = ''; box.style.height = ''; sticky.style.top = ''; track.style.height = '';
    }
    draw();
    onScroll();
  }
  function onScroll() {
    if (!desk || auto) return;
    const r = track.getBoundingClientRect();
    if (r.top > innerHeight * .6) return;
    const y = top - r.top;
    setStep(1 + Math.max(0, Math.min(3, Math.floor((y + stepPx * .25) / stepPx))));
  }
  function bindStackObserver() {
    observer?.disconnect();
    if (desk || auto) return;
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = (entry.target as HTMLElement).dataset.note!;
      turnOn(id); observer!.unobserve(entry.target);
    }), { threshold: 1, rootMargin: '0px 0px -12% 0px' });
    stage.querySelectorAll('[data-note]').forEach(el => { if (!on.has((el as HTMLElement).dataset.note!)) observer!.observe(el); });
  }

  legend.forEach(button => button.addEventListener('click', () => {
    const step = Number(button.dataset.step);
    setStep(step);
    const y = scrollY + track.getBoundingClientRect().top - top + (step - 1) * stepPx + 4;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }));

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', layout);
  new ResizeObserver(() => draw()).observe(stage);
  document.fonts?.ready.then(layout);
  layout();
  if (auto) setStep(4);

  return {
    redraw: draw,
    isDesk: () => desk,
    land(from: string, to: string) { landed = { from, to }; draw(); },
    step4() { setStep(4); },
  };
}
type Review = ReturnType<typeof bindReview>;

// ---------- the product: interactions ----------

function bindLibrary(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-list]')!;
  const search = root.querySelector<HTMLInputElement>('[data-lib-search]')!;
  let filter = 'All';
  const paint = () => { list.innerHTML = listItems(filter, search.value); };
  root.querySelector('[data-t="chips"]')!.addEventListener('click', event => {
    const chip = (event.target as Element).closest<HTMLButtonElement>('[data-kind]');
    if (!chip) return;
    filter = chip.dataset.kind!;
    root.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach(button => { button.classList.toggle('is-on', button === chip); button.setAttribute('aria-pressed', String(button === chip)); });
    paint();
  });
  search.addEventListener('input', paint);
  paint();
}

function bindPanel(root: HTMLElement) {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foundList = root.querySelector<HTMLElement>('[data-found]')!;
  const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln' };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  let afterRender = () => {};
  const paint = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"${row.fresh ? ' data-t="fresh"' : ''}><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => {
      const state = row.cells[column.key];
      const t = r === 0 && column.key === 'claude' ? ' data-t="amber"' : r === 1 && column.key === 'project' ? ' data-t="try"' : '';
      return `<td><button type="button" class="h5-switch h5-switch-${state}"${t} data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${stateText[state]}" aria-pressed="${state !== 'off'}"><i></i></button></td>`;
    }).join('')}</tr>`).join('');
    foundList.innerHTML = found.map((item, f) => `<li><div><b>${item.name}</b><small>${item.where}, ${item.text}</small></div><button type="button" class="h5-btn h5-btn-quiet" data-found="${f}">${item.kind === 'duplicate' ? 'Remove' : 'Import as draft'}</button></li>`).join('') || '<li class="h5-empty">Nothing left outside your library.</li>';
    const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
    context.textContent = `In every new session: ${count('claude')} skills in Claude Code, ${count('agents')} in Codex`;
    afterRender();
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h5-switch');
    if (!button) return;
    const row = rows[Number(button.dataset.row)], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('That copy changed outside Kiln. Compare it first.'); compare.querySelector('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed ${row.name} from ${column.path}. It stays in your library.` : `Installed ${row.note.replace('approved ', '')} of ${row.name} into ${column.path}. Receipt saved.`);
    paint();
    body.querySelector<HTMLButtonElement>(`[data-row="${button.dataset.row}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; paint();
    say('Moved the hand-edited copy to a private backup and installed rev 3.');
  });
  compare.querySelector('[data-keep]')!.addEventListener('click', () => {
    rows[0].note = 'rev 3 approved, rev 4 draft'; compare.hidden = true; paint();
    say('Saved the edit as draft rev 4. Rev 3 stays approved until you approve rev 4.');
  });
  foundList.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-found]');
    if (!button) return;
    const [item] = found.splice(Number(button.dataset.found), 1);
    if (item.kind === 'duplicate') say(`Moved ${item.name} to a private backup.`);
    else { rows.push({ name: item.name, note: 'draft, imported', cells: { claude: 'off', agents: 'off', project: 'off' } }); say(`Imported ${item.name} as a draft. The original stays where it was.`); }
    paint();
  });
  paint();
  return {
    onPaint(fn: () => void) { afterRender = fn; },
    add(name: string) {
      rows.forEach(row => { row.fresh = false; });
      rows.push({ name, note: 'approved rev 1, just now', cells: { claude: 'on', agents: 'off', project: 'on' }, fresh: true });
      paint();
      say(`Approved ${name} and installed it for Claude Code and my-game.`);
    },
  };
}

function bindRun(root: HTMLElement, panel: ReturnType<typeof bindPanel>, review: Review) {
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const verdict = root.querySelector<HTMLElement>('[data-verdict]')!;
  const elapsed = root.querySelector<HTMLElement>('[data-elapsed]')!;
  const tokens = root.querySelector<HTMLElement>('[data-tokens]')!;
  const live = root.querySelector<HTMLElement>('[data-live]')!;
  const runButton = root.querySelector<HTMLButtonElement>('[data-run]')!;
  const approve = root.querySelector<HTMLButtonElement>('[data-approve]')!;
  const landedBox = root.querySelector<HTMLElement>('[data-landed]')!;
  const libState = () => root.querySelector<HTMLElement>('[data-lib-state]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glyph: Record<string, string> = { read: '&#x25A4;', search: '&#x2315;', think: '&#x25C7;' };
  const line = ([kind, text]: string[]) => `<li><i>${glyph[kind]}</i>${text}</li>`;
  const pass = '<p><span class="h5-pill h5-pill-pass">Pass</span><span>the agent’s assessment</span></p><p class="h5-out">Named one obstacle and one fix: label the play button. Made no changes.</p>';
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  let installed = false, running = false;
  log.innerHTML = runLines.map(line).join('');
  verdict.innerHTML = pass;
  panel.onPaint(() => review.redraw());

  runButton.addEventListener('click', async () => {
    if (running) return;
    running = true; review.step4();
    runButton.disabled = true; approve.disabled = true;
    live.textContent = 'running'; live.classList.add('is-running');
    log.innerHTML = ''; verdict.innerHTML = '<p class="h5-wait">Running on ~/code/my-game…</p>';
    const total = 178, steps = runLines.length, tick = reduced ? 0 : 640;
    for (let i = 0; i < steps; i++) {
      await wait(tick);
      log.insertAdjacentHTML('beforeend', line(runLines[i]));
      const s = total * (i + 1) / steps;
      elapsed.textContent = fmt(s);
      tokens.textContent = `${(41.2 * (i + 1) / steps).toFixed(1)}k in · ${(28 * (i + 1) / steps).toFixed(1)}k cached · ${(2.1 * (i + 1) / steps).toFixed(1)}k out`;
    }
    await wait(reduced ? 0 : 500);
    verdict.innerHTML = `${pass}<p class="h5-replay">Replayed about 40 times faster than the sample run.</p>`;
    live.textContent = 'done'; live.classList.remove('is-running');
    runButton.disabled = false; approve.disabled = installed; running = false;
    if (!installed) approve.focus();
  });
  approve.addEventListener('click', () => {
    if (installed) return;
    installed = true; review.step4();
    panel.add('fresh-eyes');
    approve.disabled = true; approve.textContent = 'Installed as fresh-eyes';
    const state = libState(); if (state) state.textContent = 'approved rev 1 · skill';
    review.land('[data-approve]', '[data-t="fresh"] th');
    if (!review.isDesk()) landedBox.hidden = false;
  });
  root.querySelector('[data-show-panel]')!.addEventListener('click', () => {
    root.querySelector('[data-t="fresh"]')?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
  });
}

function bindDrawables(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('.h5-drawable, [data-hl="q"]');
  if (navigator.webdriver || !('IntersectionObserver' in window)) { targets.forEach(target => target.classList.add('is-drawn', 'is-on')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-drawn', 'is-on'); observer.unobserve(entry.target); }
  }), { threshold: .35 });
  targets.forEach(target => observer.observe(target));
}
