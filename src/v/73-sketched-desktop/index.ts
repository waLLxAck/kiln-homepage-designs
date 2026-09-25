// PROTOTYPE round 5, H13 — Sketched desktop. The visitor's computer as a wobbly pencil wireframe: Explorer windows open on
// every skills folder, later a browser full of tabs. Kiln is the one crisp, dark Windows 11 window. Act 1: the skill folders
// pop out of Explorer into Kiln's panel and the windows close. Act 2: drag a tab into Capture, the prompt into Test, approve.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, line, poly, reseed } from '../r3-kit/rough';

const NS = 'http://www.w3.org/2000/svg';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const windowsMark = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const kilnIcon = (size = 16) => `<svg class="h13-kicon" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="8" fill="#15334a"/><path d="M8 25V15a8 8 0 0 1 16 0v10z" fill="#60cdff"/><path d="M12.5 25v-7a3.5 3.5 0 0 1 7 0v7z" fill="#ffa24a"/></svg>`;
const chrome = (title: string) => `<div class="h13-ktitle">${kilnIcon()}<span>${title}</span><i class="h13-kctl" aria-hidden="true"><b class="h13-kmin"></b><b class="h13-kmax"></b><b class="h13-kclose"></b></i></div>`;
const icon = (d: string, size = 18) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icons = {
  library: 'M4 3.5v13M8 3.5v13M11.5 4.2l3.8 12',
  capture: 'M10 4v12M4 10h12',
  tests: 'M8 3h4M8.8 3v5L4.5 15.2a1.3 1.3 0 0 0 1.1 1.8h8.8a1.3 1.3 0 0 0 1.1-1.8L11.2 8V3M6.5 12h7',
  skills: 'M3 6.5h8M3 13.5h5M14 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16 6.5h1M14 13.5h3',
  read: 'M5 3h7l3 3v11H5zM12 3v3h3', search: 'M8.5 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 12l4.5 4.5',
  run: 'M3.5 5.5l4 4-4 4M9.5 14.5h7', think: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4',
  drop: 'M10 3v9M6 8.5l4 4 4-4M4 14v3h12v-3',
};

// ---------- pencil: every sketched box is re-drawn in pixels when it resizes ----------

let penSeed = 1;
const penRnd = () => { penSeed = (penSeed * 48271) % 2147483647; return penSeed / 2147483647; };
function stroke(x1: number, y1: number, x2: number, y2: number, over = 4) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  const a = penRnd() * over, b = penRnd() * over;
  return line(x1 - ux * a, y1 - uy * a, x2 + ux * b, y2 + uy * b, Math.min(1.7, .5 + len / 260));
}
const box = (x: number, y: number, w: number, h: number, over = 4) =>
  [stroke(x, y, x + w, y, over), stroke(x + w, y, x + w, y + h, over), stroke(x + w, y + h, x, y + h, over), stroke(x, y + h, x, y, over)].join(' ');
function within(el: HTMLElement, host: HTMLElement) {
  let x = 0, y = 0, node: HTMLElement | null = el;
  while (node && node !== host) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
  return { x, y };
}
function drawPencil(host: HTMLElement) {
  const W = host.offsetWidth, H = host.offsetHeight;
  if (!W || !H) return;
  let svg = host.querySelector<SVGSVGElement>(':scope > svg.h13-pencil');
  if (!svg) { svg = document.createElementNS(NS, 'svg'); svg.classList.add('h13-pencil'); svg.setAttribute('aria-hidden', 'true'); host.append(svg); }
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H));
  const seed = Number(host.dataset.seed ?? 7);
  reseed(seed); penSeed = seed * 31 + 7;
  let a = host.dataset.sketch === 'none' ? '' : box(1.5, 1.5, W - 3, H - 3, 6);
  let b = host.dataset.sketch === 'none' ? '' : box(1.5, 1.5, W - 3, H - 3, 3);
  host.querySelectorAll<HTMLElement>('[data-pen]').forEach(el => {
    if (el.closest('[data-sketch]') !== host || !el.offsetWidth) return;
    const { x, y } = within(el, host), w = el.offsetWidth, h = el.offsetHeight;
    const kind = el.dataset.pen;
    if (kind === 'box') { a += ' ' + box(x, y, w, h, 3); if (el.dataset.twice !== undefined) b += ' ' + box(x, y, w, h, 2); }
    if (kind === 'b') a += ' ' + stroke(x, y + h, x + w, y + h, 5);
    if (kind === 'r') a += ' ' + stroke(x + w, y, x + w, y + h, 3);
    if (kind === 't') a += ' ' + stroke(x, y, x + w, y, 5);
    if (kind === 'tab') { a += ' ' + poly([[x, y + h], [x + 5, y + 3], [x + w - 5, y + 3], [x + w, y + h]], false, 1); }
    if (kind === 'lines') { const n = Math.max(1, Math.floor(h / 16)); for (let i = 0; i < n; i++) b += ' ' + stroke(x + 2, y + 8 + i * 16, x + w * (.5 + penRnd() * .45), y + 8 + i * 16, 1); }
  });
  svg.innerHTML = `<path class="h13-pen-a" pathLength="1" d="${a}"/><path class="h13-pen-b" pathLength="1" d="${b}"/>`;
}
function bindPencils(root: HTMLElement) {
  const hosts = [...root.querySelectorAll<HTMLElement>('[data-sketch]')];
  const observer = new ResizeObserver(entries => entries.forEach(entry => drawPencil(entry.target as HTMLElement)));
  hosts.forEach(host => { drawPencil(host); observer.observe(host); });
  document.fonts?.ready.then(() => hosts.forEach(drawPencil));
}

let icoSeed = 40;
const jitterPoly = (points: [number, number][], close = true) => { reseed(icoSeed++); return poly(points, close, .55); };
const folderIco = (kind?: 'broken' | 'empty') => `<svg class="h13-ico${kind ? ` h13-ico-${kind}` : ''}" viewBox="0 0 24 18" aria-hidden="true"><path d="${jitterPoly([[2, 4], [2, 16], [22, 16], [22, 6], [11, 6], [9, 2.5], [3, 2.5]])}"/>${
  kind === 'broken' ? `<path class="h13-ico-red" d="${line(9, 8, 16, 14, .4)} ${line(16, 8, 9, 14, .4)}"/>` : ''}</svg>`;
const fileIco = () => `<svg class="h13-ico" viewBox="0 0 24 18" aria-hidden="true"><path d="${jitterPoly([[6, 1.5], [15, 1.5], [19, 5.5], [19, 17], [6, 17]])} ${line(15, 1.5, 15, 5.5, .3)} ${line(15, 5.5, 19, 5.5, .3)}"/></svg>`;

// ---------- the library the panel shows (sample) ----------

type Col = 'claude' | 'agents' | 'codex' | 'copilot' | 'game';
type Cell = 'on' | 'off' | 'edited' | 'found';
type Row = { name: string; note: string; cells: Record<Col, Cell>; fresh?: boolean; imported?: boolean };
const cols: { key: Col; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Agents, shared', short: 'Agents', path: '~/.agents/skills' },
  { key: 'codex', name: 'Codex', short: 'Codex', path: '~/.codex/skills' },
  { key: 'copilot', name: 'Copilot', short: 'Copilot', path: '~/.copilot/skills' },
  { key: 'game', name: 'my-game', short: 'my-game', path: '.github/skills' },
];
const none: Record<Col, Cell> = { claude: 'off', agents: 'off', codex: 'off', copilot: 'off', game: 'off' };
const rows: Row[] = [
  { name: 'code-review', note: 'Approved rev 3. Found in 3 folders', cells: { ...none, claude: 'edited', agents: 'on', game: 'on' } },
  { name: 'research', note: 'Approved rev 2. Same copy in 2 folders', cells: { ...none, claude: 'on', agents: 'on' } },
  { name: 'writing-for-agents', note: 'Approved rev 1', cells: { ...none, claude: 'on' } },
  { name: 'playtest-brief', note: 'Approved rev 4', cells: { ...none, codex: 'on', game: 'on' } },
  { name: 'commit-message', note: 'Approved rev 1', cells: { ...none, codex: 'on' } },
  { name: 'pr-summary', note: 'Found outside your library', cells: { ...none, copilot: 'found' } },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };
const toggle = (row: Row, column: typeof cols[number]) => {
  const state = row.cells[column.key];
  return `<button type="button" class="h13-toggle h13-toggle-${state}" data-skill="${row.name}" data-col="${column.key}" role="switch" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.name} in ${column.name} (${column.path}): ${stateText[state]}"><i></i></button>`;
};
const rowMarkup = (row: Row) => `<tr data-row="${row.name}"${row.fresh ? ' class="is-fresh"' : ''}><th scope="row" data-head="${row.name}"><b>${row.name}</b><small>${row.note}</small></th>${cols.map(column =>
  `<td data-cell="${row.name}:${column.key}">${toggle(row, column)}</td>`).join('')}</tr>`;
const tableMarkup = () => `<table class="h13-table"><thead><tr><th scope="col" class="h13-th-skill">Skill</th>${cols.map(column =>
  `<th scope="col"><span class="h13-long">${column.name}</span><span class="h13-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead><tbody>${rows.map(rowMarkup).join('')}</tbody></table>`;
const legend = `<ul class="h13-legend" aria-label="What the switches mean"><li><i class="h13-mini h13-mini-on"></i>Installed, approved version</li><li><i class="h13-mini h13-mini-edited"></i>Edited outside Kiln</li><li><i class="h13-mini h13-mini-found"></i>Found outside your library</li></ul>`;

// ---------- act 1: the sketched desktop ----------

type SkillFile = { name: string; when: string; to: string; kind?: 'broken' | 'empty'; flag?: boolean };
type Explorer = { key: Col; title: string; crumbs: string; files: SkillFile[]; desk: [x: number, y: number, w: number]; phone: [x: number, y: number, w: number]; z: number };
const explorers: Explorer[] = [
  { key: 'claude', title: '.claude', crumbs: 'you › .claude › skills', z: 1, desk: [2, 3, 45], phone: [1, 1, 86], files: [
    { name: 'code-review', when: 'edited by hand?', to: 'code-review:claude', flag: true },
    { name: 'code-review (1)', when: 'which one is real', to: 'code-review:claude', flag: true },
    { name: 'research', when: '3 weeks ago', to: 'research:claude' },
    { name: 'writing-for-agents', when: '2 months ago', to: 'writing-for-agents:claude' }] },
  { key: 'agents', title: '.agents', crumbs: 'you › .agents › skills', z: 2, desk: [52, 7, 44], phone: [12, 23, 86], files: [
    { name: 'code-review', when: '3 weeks ago', to: 'code-review:agents' },
    { name: 'research', when: 'same one again?', to: 'research:agents', flag: true },
    { name: 'old-link', when: 'broken link', to: 'clean', kind: 'broken', flag: true }] },
  { key: 'copilot', title: '.copilot', crumbs: 'you › .copilot › skills', z: 3, desk: [4, 44, 38], phone: [3, 44, 78], files: [
    { name: 'pr-summary', when: 'forgot this existed', to: 'pr-summary:copilot', flag: true }] },
  { key: 'codex', title: '.codex', crumbs: 'you › .codex › skills', z: 4, desk: [57, 40, 40], phone: [15, 57, 84], files: [
    { name: 'playtest-brief', when: 'last month', to: 'playtest-brief:codex' },
    { name: 'commit-message', when: 'last year', to: 'commit-message:codex' }] },
  { key: 'game', title: 'my-game', crumbs: 'code › my-game › .github › skills', z: 5, desk: [29, 63, 42], phone: [2, 75, 88], files: [
    { name: 'code-review', when: '5 weeks ago', to: 'code-review:game' },
    { name: 'playtest-brief', when: 'last month', to: 'playtest-brief:game' },
    { name: 'new-skill', when: 'empty folder', to: 'clean', kind: 'empty', flag: true }] },
];

function explorerMarkup(win: Explorer, n: number) {
  return `<div class="h13-exp" data-exp="${win.key}" data-sketch data-seed="${11 + n * 7}" style="--x:${win.desk[0]}%;--y:${win.desk[1]}%;--w:${win.desk[2]}%;--mx:${win.phone[0]}%;--my:${win.phone[1]}%;--mw:${win.phone[2]}%;--z:${win.z + 1}">
    <div class="h13-exp-title" data-pen="b">${folderIco()}<span>${win.title}</span><i aria-hidden="true">–&ensp;▢&ensp;×</i></div>
    <div class="h13-exp-bar"><span class="h13-exp-nav">←&thinsp;→&thinsp;↑</span><span class="h13-exp-path" data-pen="box">${win.crumbs}</span></div>
    <div class="h13-exp-body">
      <div class="h13-exp-side" data-pen="r"><span data-pen="lines"></span></div>
      <div class="h13-exp-main">
        <p class="h13-exp-head" data-pen="b"><span>Name</span><span>Date modified</span></p>
        <ul class="h13-exp-files">${win.files.map(file => `<li data-file data-to="${file.to}"${file.kind ? ` data-kind="${file.kind}"` : ''}>
          <span class="h13-fitem">${folderIco(file.kind)}<span>${file.name}</span></span><em class="${file.flag ? 'h13-flag' : ''}">${file.when}</em></li>`).join('')}</ul>
        <p class="h13-exp-status">${win.files.length} item${win.files.length > 1 ? 's' : ''}</p>
      </div>
    </div>
  </div>`;
}

function stageMarkup() {
  return `<div class="h13-stage" id="h13-stage" data-stage data-state="mess">
    <div class="h13-screen" data-sketch data-seed="3">
      <div class="h13-desk" data-desk>
        <p class="visually-hidden">A pencil sketch of a Windows desktop with five File Explorer windows open, one per skills folder: ~/.claude/skills, ~/.agents/skills, ~/.copilot/skills, ~/.codex/skills and my-game/.github/skills. Code-review appears in three of them, twice in .claude, research twice, a broken link called old-link, an empty folder, and a pr-summary skill nobody remembers.</p>
        <div aria-hidden="true" class="h13-exps">${explorers.map(explorerMarkup).join('')}</div>
        <div class="h13-kiln h13-kiln-stage" data-kiln1 role="region" aria-label="Kiln skills panel, sample library">
          ${chrome('Kiln')}
          <div class="h13-kbody">
            <div class="h13-khead"><div><h3>Skills</h3><p>Sample library. One row per skill, one switch per folder your agents read.</p></div></div>
            <div class="h13-infobar" data-cleanbar role="status"><span class="h13-info-i" aria-hidden="true">i</span><span data-clean-text>Found a broken link in <code>~/.agents/skills</code> and an empty folder in <code>my-game</code>.</span><button type="button" class="h13-btn h13-btn-sm" data-clean>Clean up safely</button></div>
            <div class="h13-table-wrap" data-panel-mount></div>
            ${legend}
            <div class="h13-kfoot"><p class="h13-status" data-status aria-live="polite"></p><p class="h13-context" data-context></p></div>
            <div class="h13-flyout" data-flyout hidden role="dialog" aria-modal="false" aria-labelledby="h13-fly1"></div>
          </div>
        </div>
        <div class="h13-flight" data-flight aria-hidden="true"></div>
        <p class="h13-tidy-note" aria-hidden="true"><span>the only tidy thing<br>on this screen</span><svg viewBox="0 0 120 60" data-note-arrow></svg></p>
      </div>
      <div class="h13-taskbar" data-pen="t">
        <span class="h13-tb-start" data-pen="box" aria-hidden="true"></span>
        <span class="h13-tb-search" data-pen="box" aria-hidden="true">search</span>
        <span class="h13-tb-app" aria-hidden="true">${folderIco()}</span>
        <span class="h13-tb-app h13-tb-circle" data-pen="box" aria-hidden="true"></span>
        <button type="button" class="h13-tb-kiln" data-open-kiln aria-label="Open Kiln and pull the skills in">${kilnIcon(22)}</button>
        <span class="h13-tb-clock" aria-hidden="true">10:42 pm</span>
      </div>
    </div>
    <p class="h13-caption-hand" aria-hidden="true">my desktop, give or take</p>
  </div>`;
}

// ---------- act 2: sources in a sketched browser ----------

type SourceKey = 'yt' | 'x' | 'gh';
type Step = [kind: 'read' | 'search' | 'run' | 'think', text: string];
type Extra = { kind: 'Technique' | 'Insight' | 'Tool' | 'Source' | 'Note'; text: string; from?: string };
type Run = { title: string; text: string; from?: string; verdict: 'pass' | 'uncertain'; steps: Step[]; skill: string; fix?: { before: string; after: string; step: string; lesson: string } };
type Source = { key: SourceKey; tab: string; url: string; label: string; collection: string; reading: string[]; extras: Extra[]; prompt?: Run };
const sources: Source[] = [
  { key: 'yt', tab: 'The seven-year-old test', url: 'youtube.com/watch?v=sample', label: 'YouTube video', collection: 'The seven-year-old test',
    reading: ['Reading the captions, 18:47', 'Pulling out prompts, techniques and tools', 'Linking each one to its timestamp'],
    extras: [
      { kind: 'Technique', text: 'Give the agent a persona with limits, then ask for the first obstacle only', from: '06:30' },
      { kind: 'Insight', text: 'You stop seeing what confuses a newcomer. The agent hasn’t seen it yet', from: '02:05' },
      { kind: 'Tool', text: 'A browser automation tool, so the agent can click through the app', from: '11:48' }],
    prompt: { title: examples[0].title, text: examples[0].prompt, from: '04:12', verdict: 'uncertain', skill: 'fresh-eyes',
      steps: [['read', 'Read README.md and package.json'], ['search', 'rg "signup" src/, skipped the parent flow'], ['read', 'Opened src/screens/Start.tsx and Levels.tsx'], ['think', 'Found two confusing spots, not sure which comes first']],
      fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', step: 'First obstacle: the start button is an icon with no label', lesson: 'Asking for the words on screen made it commit to one obstacle instead of hedging.' } } },
  { key: 'x', tab: 'Dana on X', url: 'x.com/dana_ships/status/sample', label: 'post on X', collection: 'Fix the instruction, not the output',
    reading: ['Reading the post and its thread', 'Pulling out prompts, techniques and tools'],
    extras: [
      { kind: 'Technique', text: 'Fix the instruction that caused it, not the output' },
      { kind: 'Insight', text: 'Stale lines in AGENTS.md cause the same mistake every session' },
      { kind: 'Tool', text: 'AGENTS.md and CLAUDE.md, the files it points at' }],
    prompt: { title: examples[1].title, text: examples[1].prompt, verdict: 'pass', skill: 'instruction-trace',
      steps: [['read', 'Read AGENTS.md and CLAUDE.md'], ['search', 'rg "run every test" across the repo'], ['run', 'git log -3 -- AGENTS.md'], ['think', 'Found the outdated line, proposed a one-line change']] } },
  { key: 'gh', tab: 'mattpocock/skills', url: 'github.com/mattpocock/skills', label: 'GitHub repository', collection: 'mattpocock/skills',
    reading: ['Reading the repository', 'Looking for skill folders'],
    extras: [
      { kind: 'Source', text: 'github.com/mattpocock/skills, linked to every draft' },
      { kind: 'Note', text: 'README.md kept as a source note' }] },
];
const favicon = (key: SourceKey) => `<i class="h13-fav h13-fav-${key}" aria-hidden="true">${key === 'x' ? 'X' : ''}</i>`;

function pageMarkup(source: Source) {
  if (source.key === 'yt') return `<div class="h13-src h13-yt" data-grab="yt">
      <div class="h13-yt-frame"><span class="h13-yt-thumb">the 7-year-old test</span><span class="h13-yt-play" aria-hidden="true"></span><span class="h13-yt-time">18:47</span><span class="h13-yt-bar"><i data-yt-progress></i></span></div>
      <p class="h13-yt-title">I let a seven-year-old test my app. Then I made it a prompt.</p>
      <p class="h13-yt-ch"><i aria-hidden="true">PK</i><b>Prompt Kitchen</b><span>fictional channel</span></p>
    </div>`;
  if (source.key === 'x') return `<div class="h13-src h13-xp" data-grab="x">
      <header><i aria-hidden="true">DO</i><p><b>Dana Okafor</b><span>@dana_ships</span></p><span class="h13-xp-logo" aria-hidden="true">X</span></header>
      <p class="h13-xp-text">When your agent does exactly what you didn’t mean, don’t fix the output. Ask it to trace the decision back to the instruction behind it, then fix that line.</p>
      <p class="h13-xp-meta">10:24 PM. Fictional post</p>
    </div>`;
  return `<div class="h13-src h13-gh" data-grab="gh">
      <header><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.06 1.06A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8Z"/></svg><span>mattpocock</span><span>/</span><b>skills</b></header>
      <div class="h13-gh-bar"><span class="h13-gh-branch">main</span><span class="h13-gh-code">Code</span></div>
      <ul class="h13-gh-files"><li><i class="h13-gh-dir" aria-hidden="true"></i>skills/</li><li><i class="h13-gh-file" aria-hidden="true"></i>README.md</li><li><i class="h13-gh-file" aria-hidden="true"></i>LICENSE</li></ul>
    </div>`;
}

function browserMarkup() {
  return `<div class="h13-browser-wrap">
    <div class="h13-browser" data-sketch data-seed="91">
      <div class="h13-tabs" role="tablist" aria-label="Browser tabs (sketch)">${sources.map((source, n) => `<button type="button" role="tab" class="h13-tab" id="h13-tab-${source.key}" data-tab="${source.key}" data-pen="tab" aria-selected="${n === 0}" aria-controls="h13-page" tabindex="${n === 0 ? 0 : -1}" aria-label="${source.tab}, ${source.label}. Drag into Kiln, or press Enter to open">${favicon(source.key)}<span>${source.tab}</span></button>`).join('')}<span class="h13-tab-plus" aria-hidden="true">+</span></div>
      <div class="h13-bbar" data-pen="b"><span class="h13-bnav" aria-hidden="true">←&thinsp;→&thinsp;⟳</span><span class="h13-url" data-pen="box" data-url>${sources[0].url}</span></div>
      <div class="h13-page" id="h13-page" role="tabpanel" aria-labelledby="h13-tab-yt" data-page>${pageMarkup(sources[0])}</div>
    </div>
    <div class="h13-browser-foot">
      <button type="button" class="h13-btn" data-add-tab>Add this tab to Kiln</button>
      <p class="h13-hand-hint" aria-hidden="true">drag a tab, or the page itself, into Kiln</p>
    </div>
  </div>`;
}

function kiln2Markup() {
  const rail = [['library', 'Library'], ['capture', 'Capture'], ['tests', 'Tests'], ['skills', 'Skills']];
  return `<div class="h13-kiln h13-kiln-2" data-kiln2 data-view="capture" role="region" aria-label="Kiln, capture and test (sample)">
    ${chrome('Kiln')}
    <div class="h13-k2">
      <nav class="h13-rail" aria-label="Kiln sections (illustration)">${rail.map(([key, name]) => `<span data-rail="${key}">${icon(icons[key as keyof typeof icons])}<em>${name}</em></span>`).join('')}</nav>
      <div class="h13-k2-view" data-view-capture>
        <section class="h13-pane h13-cap" data-cap aria-labelledby="h13-cap-title">
          <header class="h13-pane-head"><h3 id="h13-cap-title">Capture</h3><kbd>Ctrl+Shift+Space</kbd></header>
          <div data-cap-body></div>
        </section>
        <section class="h13-pane h13-test" data-test aria-labelledby="h13-test-title">
          <header class="h13-pane-head"><h3 id="h13-test-title">Test</h3><span class="h13-badge">Read-only</span></header>
          <div class="h13-test-ctl">
            <label><span>Repository</span><select data-repo><option value="spelling-game">~/code/spelling-game (sample)</option><option value="my-game">~/code/my-game (sample)</option></select></label>
            <p><span>Agent</span><b>Claude Code, your subscription</b></p>
          </div>
          <div data-test-body aria-live="polite"></div>
        </section>
      </div>
      <div class="h13-k2-view h13-k2-skills" data-view-skills hidden>
        <div class="h13-khead"><div><h3>Skills</h3><p data-landed-note>Sample library.</p></div><button type="button" class="h13-btn h13-btn-sm" data-another>Add another source</button></div>
        <div class="h13-table-wrap" data-panel-mount></div>
        ${legend}
        <div class="h13-kfoot"><p class="h13-status" data-status aria-live="polite"></p><p class="h13-context" data-context></p></div>
        <p class="h13-k2-back"><a href="#h13-stage" data-see-first>See it on the first panel too</a></p>
        <div class="h13-flyout" data-flyout hidden role="dialog" aria-modal="false" aria-labelledby="h13-fly2"></div>
      </div>
    </div>
  </div>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h13">
    <a class="skip" href="#h13-main">Skip to content</a>
    <header class="h13-top"><a class="h13-brand" href="#h13-main">${kilnIcon(24)}<span>Kiln</span></a>
      <nav aria-label="Main navigation"><a href="#h13-p1">The folders</a><a href="#h13-p2">New skills</a><a href="#h13-get" class="h13-top-get">Download</a></nav></header>
    <main id="h13-main">
      <div class="h13-act1">
        <section class="h13-hero" aria-labelledby="h13-title">
          <h1 id="h13-title">My agents were loading skills I forgot I had.</h1>
          <p class="h13-lede">Five folders, three agents, two copies of code-review and a broken link. Kiln is the Windows app that finally put them all on one panel.</p>
          <div class="h13-actions"><a class="h13-btn h13-btn-big h13-btn-accent" href="${installer}">${windowsMark}<span>Download for Windows</span></a><a class="h13-link" href="#h13-p1">Watch it tidy up</a></div>
          <p class="h13-fine">Free and MIT licensed. The download needs a GitHub account with access to the private release repository.</p>
        </section>
        <div class="h13-stagecol">${stageMarkup()}</div>
        <section class="h13-p1" id="h13-p1" aria-labelledby="h13-p1-title">
          <h2 id="h13-p1-title">So I pointed Kiln at every folder.</h2>
          <p>Each skill gets one row, each folder one switch. Duplicates merge, the broken link waits for a safe cleanup, and your original files stay where they are.</p>
          <p class="h13-p1-token">Every switched-on skill puts its description in your agent’s context on every turn, used or not. Flip off what you don’t use.</p>
          <div class="h13-actions"><button type="button" class="h13-btn h13-btn-big" data-pull aria-controls="h13-stage">Pull them into Kiln</button></div>
        </section>
      </div>

      <section class="h13-p2" id="h13-p2" aria-labelledby="h13-p2-title">
        <div class="h13-p2-rule" data-sketch="none" data-seed="57" aria-hidden="true"><span data-pen="b"></span><em>meanwhile, 37 tabs later</em></div>
        <div class="h13-p2-head">
          <h2 id="h13-p2-title">And the good ones? Still in a browser tab I never closed.</h2>
          <p>A video at 1 a.m., a post, a repo someone linked. Now I drag the tab into Kiln. It pulls out the prompt, I test it on my own repo without changing a file, and if it holds up it becomes a skill on the same panel.</p>
        </div>
        <div class="h13-p2-grid">${browserMarkup()}${kiln2Markup()}</div>
      </section>

      <section class="h13-get" id="h13-get" aria-labelledby="h13-get-title">
        <div class="h13-get-copy">
          <h2 id="h13-get-title">Find out what your agents are loading.</h2>
          <p>Import the folders you already have and see every copy. Then test the next prompt you save, the day you save it.</p>
          <a class="h13-btn h13-btn-big h13-btn-accent" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
          <p class="h13-fine">The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned, so Windows may ask before it runs.</p>
        </div>
        <ul class="h13-facts">
          <li><b>No API key.</b> Kiln uses the Codex or Claude Code you’re signed into, on your ChatGPT or Claude plan. Its usage limits still apply.</li>
          <li><b>Tests are read-only.</b> The agent reads your repo; nothing in your code changes. Its verdict is kept apart from yours.</li>
          <li><b>Approval pins a revision.</b> It publishes that exact snapshot to your own Kiln repository on GitHub. Edits become new drafts.</li>
          <li><b>Windows app and CLI.</b> Script collections, tests and installs with JSON output. MIT licensed.</li>
        </ul>
      </section>
    </main>
  </div>`;
  const panel = bindPanel(root);
  reseed(5);
  root.querySelector('[data-note-arrow]')!.innerHTML = `<path d="${arrow(96, 6, -14, 52, -18, 11)}"/>`;
  if (!navigator.webdriver && !reduced()) {
    const page = root.querySelector<HTMLElement>('.h13')!;
    page.classList.add('h13-drawing');
    setTimeout(() => page.classList.remove('h13-drawing'), 2600);
  }
  bindPencils(root);
  const stage = bindStage(root, panel);
  bindAct2(root, panel, stage);
}

// ---------- behaviour: panels (two mounts, one library) ----------

type Panel = { paint(): void; add(name: string): void; flash(name: string, scope: HTMLElement): void };
function bindPanel(root: HTMLElement): Panel {
  const mounts = [...root.querySelectorAll<HTMLElement>('[data-panel-mount]')];
  const count = () => rows.reduce((sum, row) => sum + cols.filter(column => row.cells[column.key] === 'on' || row.cells[column.key] === 'edited').length, 0);
  const paint = () => {
    mounts.forEach(mount => { mount.innerHTML = tableMarkup(); });
    root.querySelectorAll<HTMLElement>('[data-context]').forEach(el => { el.textContent = `${count()} copies switched on. Each description rides along in context on every turn. Kiln shows what’s loaded, not a token count per skill.`; });
  };
  const winOf = (el: Element) => el.closest<HTMLElement>('.h13-kiln')!;
  const say = (scope: Element, text: string) => {
    const status = winOf(scope).querySelector<HTMLElement>('[data-status]')!;
    status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new');
  };
  const focusCell = (scope: HTMLElement, skill: string, col: string) => scope.querySelector<HTMLButtonElement>(`[data-skill="${skill}"][data-col="${col}"]`)?.focus();
  let returnTo: { scope: HTMLElement; skill: string; col: string } | null = null;
  const closeFlyout = (flyout: HTMLElement) => {
    if (flyout.hidden) return;
    flyout.hidden = true;
    if (returnTo) focusCell(returnTo.scope, returnTo.skill, returnTo.col);
    returnTo = null;
  };
  const openFlyout = (win: HTMLElement, html: string, skill: string, col: string) => {
    const flyout = win.querySelector<HTMLElement>('[data-flyout]')!;
    flyout.innerHTML = html; flyout.hidden = false; flyout.dataset.skill = skill; flyout.dataset.col = col;
    returnTo = { scope: win, skill, col };
    flyout.querySelector<HTMLElement>('button')?.focus();
  };
  root.querySelectorAll<HTMLElement>('.h13-kiln').forEach(win => {
    const flyout = win.querySelector<HTMLElement>('[data-flyout]');
    if (!flyout) return;
    const titleId = flyout.getAttribute('aria-labelledby');
    win.addEventListener('click', event => {
      const button = (event.target as Element).closest<HTMLButtonElement>('.h13-toggle');
      if (!button) return;
      const row = rows.find(item => item.name === button.dataset.skill)!, column = cols.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
      if (state === 'edited') {
        say(button, 'This copy was changed outside Kiln. Compare it first.');
        openFlyout(win, `<h4 id="${titleId}"><code>${column.path}/${row.name}</code> differs from approved rev 3</h4>
          <div class="h13-diff"><p class="h13-del">- Review standards and the specification separately.</p><p class="h13-add">+ Review the specification only. Skip style.</p></div>
          <div class="h13-row-actions"><button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-fly="replace">Replace with rev 3</button><button type="button" class="h13-btn h13-btn-sm" data-fly="draft">Keep it as draft rev 4</button><button type="button" class="h13-btn h13-btn-sm h13-btn-subtle" data-fly="close">Cancel</button></div>`, row.name, column.key);
        return;
      }
      if (state === 'found') {
        if (row.imported) { say(button, `${row.name} is a draft now. Approve it to manage this copy.`); return; }
        openFlyout(win, `<h4 id="${titleId}">${row.name} isn’t in your library</h4><p>Import it as a draft. The folder in <code>${column.path}</code> stays exactly where it is.</p>
          <div class="h13-row-actions"><button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-fly="import">Import as draft</button><button type="button" class="h13-btn h13-btn-sm h13-btn-subtle" data-fly="close">Not now</button></div>`, row.name, column.key);
        return;
      }
      row.cells[column.key] = state === 'on' ? 'off' : 'on';
      paint();
      say(win, state === 'on' ? `Removed ${row.name} from ${column.path}. It stays in your library, history and all.` : `Installed the approved ${row.name} into ${column.path}. Receipt saved.`);
      focusCell(win, row.name, column.key);
    });
    flyout.addEventListener('click', event => {
      const action = (event.target as Element).closest<HTMLElement>('[data-fly]')?.dataset.fly;
      if (!action) return;
      const row = rows.find(item => item.name === flyout.dataset.skill)!, key = flyout.dataset.col as Col;
      if (action === 'replace') { row.cells[key] = 'on'; say(win, 'Moved the hand-edited copy to a private backup and installed rev 3.'); }
      if (action === 'draft') { row.cells[key] = 'on'; row.note = 'Approved rev 3, draft rev 4 from your edit'; say(win, 'Saved the edit as draft rev 4. Rev 3 stays installed until you approve it.'); }
      if (action === 'import') { row.imported = true; row.note = 'Draft, imported. Original untouched'; say(win, `Imported ${row.name} as a draft. The original folder hasn’t moved.`); }
      if (action !== 'close') paint();
      closeFlyout(flyout);
    });
    flyout.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closeFlyout(flyout); } });
  });
  paint();
  return {
    paint,
    add(name: string) {
      rows.forEach(row => { row.fresh = false; });
      if (!rows.some(row => row.name === name)) rows.push({ name, note: 'Approved just now, pinned revision', cells: { ...none, claude: 'on' }, fresh: true });
      paint();
    },
    flash(name: string, scope: HTMLElement) {
      const row = scope.querySelector<HTMLElement>(`[data-row="${name}"]`);
      if (!row) return;
      row.classList.remove('is-landed'); void row.offsetWidth; row.classList.add('is-landed');
    },
  };
}

// ---------- behaviour: act 1, the pop-in ----------

type Stage = { ensureTidy(): void; show(name: string): void };
function bindStage(root: HTMLElement, panel: Panel): Stage {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const desk = stage.querySelector<HTMLElement>('[data-desk]')!;
  const kiln = stage.querySelector<HTMLElement>('[data-kiln1]')!;
  const layer = stage.querySelector<HTMLElement>('[data-flight]')!;
  const pull = root.querySelector<HTMLButtonElement>('[data-pull]')!;
  const taskIcon = stage.querySelector<HTMLButtonElement>('[data-open-kiln]')!;
  const cleanbar = kiln.querySelector<HTMLElement>('[data-cleanbar]')!;
  const status = kiln.querySelector<HTMLElement>('[data-status]')!;
  const wins = [...stage.querySelectorAll<HTMLElement>('[data-exp]')];
  const order = wins; // left to right once they're heaped: .claude, .agents, .copilot, .codex, my-game
  let state: 'mess' | 'busy' | 'tidy' = 'mess', touched = false;

  const setState = (next: typeof state) => {
    state = next;
    stage.dataset.state = next;
    kiln.inert = next !== 'tidy';
    pull.textContent = next === 'mess' ? 'Pull them into Kiln' : 'Put the folders back';
    pull.disabled = next === 'busy';
    taskIcon.disabled = next === 'busy';
    taskIcon.setAttribute('aria-label', next === 'mess' ? 'Open Kiln and pull the skills in' : 'Minimise Kiln and put the folders back');
  };
  const cells = () => [...kiln.querySelectorAll<HTMLElement>('[data-cell], [data-head]')];
  const reset = () => {
    cells().forEach(cell => cell.classList.remove('is-in', 'is-landed', 'is-merged'));
    cleanbar.classList.remove('is-in');
    wins.forEach(win => { win.getAnimations().forEach(animation => animation.cancel()); win.classList.remove('is-closed'); win.querySelectorAll('[data-file]').forEach(file => file.classList.remove('is-out')); });
  };
  const finish = () => {
    setState('tidy');
    status.textContent = '11 skill folders in 5 places became 6 skills. The duplicate code-review (1) merged into its row.';
  };
  const instant = () => { wins.forEach(win => win.classList.add('is-closed')); kiln.classList.add('is-open'); cleanbar.classList.add('is-in'); finish(); };
  const land = (target: HTMLElement) => {
    const merged = target.classList.contains('is-in');
    target.classList.remove('is-landed', 'is-merged'); void target.offsetWidth;
    target.classList.add('is-in', merged ? 'is-merged' : 'is-landed');
    const head = target.dataset.cell ? kiln.querySelector<HTMLElement>(`[data-head="${target.dataset.cell.split(':')[0]}"]`) : null;
    if (head && !head.classList.contains('is-in')) head.classList.add('is-in', 'is-landed');
  };

  // The Explorer windows get shoved into a heap below Kiln, so every file's flight and landing stays in view.
  const heap = () => {
    const d = desk.getBoundingClientRect(), k = kiln.getBoundingClientRect();
    const top = k.bottom - d.top + 14, height = Math.max(80, d.height - top - 6);
    const perRow = d.width < 600 ? 3 : 5, rowCount = Math.ceil(order.length / perRow), slot = d.width / perRow;
    const maxW = Math.max(...order.map(win => win.offsetWidth)), maxH = Math.max(...order.map(win => win.offsetHeight));
    const scale = Math.min(.62, (height / rowCount) / maxH * 1.1, (slot * 1.08) / maxW);
    return Promise.all(order.map((win, i) => {
      const col = i % perRow, row = Math.floor(i / perRow);
      const x = Math.max(6, Math.min(d.width - win.offsetWidth * scale - 10, col * slot + (slot - win.offsetWidth * scale) / 2 + (i % 2 ? 5 : -5)));
      const y = top + row * (height / rowCount) + (i % 2 ? 9 : 0);
      return win.animate([{ transform: 'none' }, { transform: `translate(${x - win.offsetLeft}px, ${y - win.offsetTop}px) rotate(${[-3, 2, -1.5, 3, -2][i]}deg) scale(${scale})` }],
        { duration: 560, delay: i * 45, easing: 'cubic-bezier(.3,1.25,.45,1)', fill: 'forwards' }).finished;
    }));
  };

  const flyFile = (file: HTMLElement) => {
    const box = desk.getBoundingClientRect(), item = file.querySelector<HTMLElement>('.h13-fitem')!, from = item.getBoundingClientRect();
    const to = file.dataset.to!;
    const clone = document.createElement('div');
    clone.className = `h13-flyer${to === 'clean' ? ' h13-flyer-junk' : ''}`;
    clone.innerHTML = `<span class="h13-flyer-sketch">${item.innerHTML}</span><span class="h13-flyer-crisp">${to === 'clean' ? '' : kilnIcon(12)}${item.textContent!.trim()}</span>`;
    clone.style.left = `${from.left - box.left}px`; clone.style.top = `${from.top - box.top}px`;
    layer.append(clone);
    file.classList.add('is-out');
    // transform-origin is the top-left corner, so `at` puts the clone's centre on (x, y) at scale k
    const W = clone.offsetWidth, H = clone.offsetHeight, s0 = Math.min(1, from.width / Math.max(1, W - 12));
    const at = (x: number, y: number, k: number, extra = '') => `translate(${x - from.left - (W * k) / 2}px, ${y - from.top - (H * k) / 2}px) ${extra} scale(${k})`;
    const fx = from.left + (W * s0) / 2, fy = from.top + (H * s0) / 2;
    const crisp = clone.querySelector<HTMLElement>('.h13-flyer-crisp')!, sketch = clone.querySelector<HTMLElement>('.h13-flyer-sketch')!;
    if (to === 'clean') {
      const bar = cleanbar.getBoundingClientRect(), bx = bar.left + 40, by = bar.top + bar.height / 2;
      const rect = 'polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)';
      const crushed = 'polygon(8% 18%, 48% 4%, 92% 16%, 80% 50%, 94% 86%, 52% 78%, 6% 92%, 20% 50%)';
      const ball = 'polygon(30% 20%, 50% 36%, 72% 16%, 64% 50%, 80% 82%, 50% 66%, 22% 84%, 36% 50%)';
      const run = clone.animate([
        { transform: at(fx, fy, s0, 'rotate(0deg)'), clipPath: rect },
        { transform: at(fx, fy - 14, 1, 'rotate(8deg)'), clipPath: crushed, offset: .25 },
        { transform: at(fx, fy - 18, .7, 'rotate(40deg)'), clipPath: ball, offset: .45 },
        { transform: at(bx, by, .4, 'rotate(200deg)'), clipPath: ball, opacity: .9, offset: .92 },
        { transform: at(bx, by, .15, 'rotate(220deg)'), clipPath: ball, opacity: 0 },
      ], { duration: 1000, easing: 'cubic-bezier(.45,.05,.55,1)', fill: 'both' });
      return run.finished.then(() => { clone.remove(); cleanbar.classList.remove('is-in'); void cleanbar.offsetWidth; cleanbar.classList.add('is-in'); });
    }
    const target = kiln.querySelector<HTMLElement>(`[data-cell="${to}"]`)!, aim = target.getBoundingClientRect();
    const tx = aim.left + aim.width / 2, ty = aim.top + aim.height / 2;
    const timing = { duration: 760, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'both' as const };
    const run = clone.animate([
      { transform: at(fx, fy, s0, 'rotate(0deg)') },
      { transform: at(fx, fy - 16, 1.05, 'rotate(-3deg)'), offset: .2 },
      { transform: at((fx + tx) / 2, (fy + ty) / 2 - 30, .95, 'rotate(2deg)'), offset: .55 },
      { transform: at(tx, ty, .6, 'rotate(0deg)'), opacity: 1, offset: .9 },
      { transform: at(tx, ty, .35, 'rotate(0deg)'), opacity: 0 },
    ], timing);
    sketch.animate([{ opacity: 1 }, { opacity: 1, offset: .3 }, { opacity: 0, offset: .55 }, { opacity: 0 }], timing);
    crisp.animate([{ opacity: 0 }, { opacity: 0, offset: .3 }, { opacity: 1, offset: .55 }, { opacity: 1 }], timing);
    return run.finished.then(() => { clone.remove(); land(target); });
  };

  async function tidy() {
    if (state !== 'mess') return;
    touched = true;
    if (reduced()) { instant(); return; }
    setState('busy');
    reset();
    kiln.classList.add('is-open');
    const icon = taskIcon.getBoundingClientRect(), win = kiln.getBoundingClientRect();
    await kiln.animate([
      { opacity: 0, transform: `translate(${icon.left + icon.width / 2 - (win.left + win.width / 2)}px, ${icon.top - (win.top + win.height / 2)}px) scale(.06)` },
      { opacity: 1, transform: 'none' },
    ], { duration: 460, easing: 'cubic-bezier(.2,.9,.3,1)' }).finished;
    await heap();
    await wait(120);
    for (const winEl of order) {
      const files = [...winEl.querySelectorAll<HTMLElement>('[data-file]')];
      const flights = files.map((file, n) => wait(n * 120).then(() => flyFile(file)));
      await Promise.all(flights);
      await winEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' }).finished;
      winEl.classList.add('is-closed');
    }
    finish();
  }
  async function untidy() {
    if (state !== 'tidy') return;
    touched = true;
    stage.querySelectorAll<HTMLElement>('[data-flyout]').forEach(flyout => { flyout.hidden = true; });
    if (reduced()) { reset(); kiln.classList.remove('is-open'); setState('mess'); return; }
    setState('busy');
    const icon = taskIcon.getBoundingClientRect(), win = kiln.getBoundingClientRect();
    await kiln.animate([
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: `translate(${icon.left + icon.width / 2 - (win.left + win.width / 2)}px, ${icon.top - (win.top + win.height / 2)}px) scale(.06)` },
    ], { duration: 360, easing: 'cubic-bezier(.5,0,.8,.4)' }).finished;
    kiln.classList.remove('is-open');
    reset();
    [...order].reverse().forEach((winEl, n) => winEl.animate([{ opacity: 0, transform: 'scale(.94) translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 240, delay: n * 90, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'backwards' }));
    await wait(560);
    setState('mess');
  }
  const flip = () => (state === 'mess' ? tidy() : untidy());
  pull.addEventListener('click', flip);
  taskIcon.addEventListener('click', flip);
  cleanbar.querySelector('[data-clean]')!.addEventListener('click', event => {
    cleanbar.querySelector('[data-clean-text]')!.textContent = 'Removed the broken link and the empty folder. No skills were touched.';
    (event.currentTarget as HTMLElement).remove();
    status.textContent = 'Cleaned up 2 leftovers.';
  });
  setState('mess');

  // play once when the visitor scrolls to the problem-1 copy (desktop) or past the stage (phone)
  const heading = root.querySelector<HTMLElement>('#h13-p1-title')!;
  const check = () => {
    if (touched || state !== 'mess') return;
    const stacked = !matchMedia('(min-width: 1000px)').matches;
    if (heading.getBoundingClientRect().top < innerHeight * .8 || (stacked && stage.getBoundingClientRect().top < innerHeight * .1)) { removeEventListener('scroll', check); document.fonts.ready.then(() => setTimeout(() => { if (!touched) tidy(); }, 250)); }
  };
  addEventListener('scroll', check, { passive: true });

  return {
    ensureTidy() { if (state === 'mess') { touched = true; removeEventListener('scroll', check); reset(); instant(); } },
    show(name: string) {
      const target = matchMedia('(min-width: 1000px)').matches ? root.querySelector<HTMLElement>('#h13-p1')! : stage;
      target.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
      setTimeout(() => panel.flash(name, kiln), reduced() ? 0 : 600);
    },
  };
}

// ---------- behaviour: act 2, drag a tab into Capture, the prompt into Test ----------

type DragSpec = { handle: HTMLElement; ghostFrom: () => HTMLElement; target: () => HTMLElement | null; drop: (ghost: HTMLElement) => void; tap?: () => void };
function draggable(spec: DragSpec) {
  const { handle } = spec;
  let suppressClick = false;
  handle.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; } }, true);
  handle.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if ((event.target as Element).closest('button:not([data-tab]), a, select')) return;
    const startX = event.clientX, startY = event.clientY;
    let ghost: HTMLElement | null = null, ox = 0, oy = 0, lastY = startY, raf = 0;
    const over = (x: number, y: number) => { const target = spec.target(); if (!target) return false; const r = target.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; };
    const scroller = () => {
      const edge = 70;
      if (lastY > innerHeight - edge) scrollBy(0, 14); else if (lastY < edge) scrollBy(0, -14);
      raf = requestAnimationFrame(scroller);
    };
    const move = (e: PointerEvent) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!ghost && Math.hypot(dx, dy) < 7) return;
      if (!ghost) {
        const from = spec.ghostFrom(), r = from.getBoundingClientRect();
        ghost = from.cloneNode(true) as HTMLElement;
        ghost.removeAttribute('id');
        ghost.classList.add('h13-ghost');
        Object.assign(ghost.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
        ox = startX - r.left; oy = startY - r.top;
        document.body.append(ghost);
        handle.classList.add('is-dragging');
        document.documentElement.classList.add('h13-dragging');
        raf = requestAnimationFrame(scroller);
      }
      lastY = e.clientY;
      ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-6, Math.min(6, dx / 50))}deg) scale(.92)`;
      spec.target()?.classList.toggle('is-over', over(e.clientX, e.clientY));
    };
    const up = (e: PointerEvent) => {
      handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', up);
      cancelAnimationFrame(raf);
      handle.classList.remove('is-dragging');
      document.documentElement.classList.remove('h13-dragging');
      const target = spec.target();
      target?.classList.remove('is-over');
      if (!ghost) { spec.tap?.(); return; }
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const g = ghost;
      if (e.type === 'pointerup' && over(e.clientX, e.clientY)) { spec.drop(g); return; }
      g.animate([{ transform: g.style.transform }, { transform: 'translate(0, 0) scale(1)' }], { duration: reduced() ? 0 : 320, easing: 'cubic-bezier(.2,1.3,.4,1)' }).finished.then(() => g.remove());
      void ox; void oy;
    };
    handle.setPointerCapture(event.pointerId);
    handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  });
}
/** Sends an element (or its ghost) into a drop target with a satisfying swallow. */
async function swallow(from: HTMLElement, target: HTMLElement, existing?: HTMLElement) {
  const t = target.getBoundingClientRect();
  let ghost = existing;
  if (!ghost) {
    const r = from.getBoundingClientRect();
    ghost = from.cloneNode(true) as HTMLElement;
    ghost.removeAttribute('id');
    ghost.classList.add('h13-ghost');
    Object.assign(ghost.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, transform: 'none' });
    document.body.append(ghost);
  }
  const g = ghost, r = g.getBoundingClientRect();
  const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + Math.min(t.height / 2, 90) - (r.top + r.height / 2);
  const current = g.style.transform || 'none';
  const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(current);
  const bx = m ? Number(m[1]) : 0, by = m ? Number(m[2]) : 0;
  if (!reduced()) await g.animate([{ transform: current, opacity: 1 }, { transform: `translate(${bx + dx}px, ${by + dy}px) scale(.18)`, opacity: .15 }], { duration: 420, easing: 'cubic-bezier(.55,0,.3,1)', fill: 'forwards' }).finished;
  g.remove();
  target.classList.remove('is-gulp'); void target.offsetWidth; target.classList.add('is-gulp');
}

function bindAct2(root: HTMLElement, panel: Panel, stage: Stage) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const page = root.querySelector<HTMLElement>('[data-page]')!;
  const url = root.querySelector<HTMLElement>('[data-url]')!;
  const browser = root.querySelector<HTMLElement>('.h13-browser')!;
  const addTab = root.querySelector<HTMLButtonElement>('[data-add-tab]')!;
  const kiln = root.querySelector<HTMLElement>('[data-kiln2]')!;
  const cap = kiln.querySelector<HTMLElement>('[data-cap]')!, capBody = kiln.querySelector<HTMLElement>('[data-cap-body]')!;
  const test = kiln.querySelector<HTMLElement>('[data-test]')!, testBody = kiln.querySelector<HTMLElement>('[data-test-body]')!;
  const repo = kiln.querySelector<HTMLSelectElement>('[data-repo]')!;
  const captureView = kiln.querySelector<HTMLElement>('[data-view-capture]')!, skillsView = kiln.querySelector<HTMLElement>('[data-view-skills]')!;
  let active: SourceKey = 'yt', current: Source | null = null, busy = false, token = 0;
  const added = new Set<SourceKey>();

  const rail = (view: 'capture' | 'skills') => {
    kiln.dataset.view = view;
    kiln.querySelectorAll<HTMLElement>('[data-rail]').forEach(item => item.classList.toggle('is-on', item.dataset.rail === view));
    captureView.hidden = view !== 'capture'; skillsView.hidden = view !== 'skills';
  };
  const select = (key: SourceKey, focus = false) => {
    active = key;
    const source = sources.find(item => item.key === key)!;
    tabs.forEach(tab => { const on = tab.dataset.tab === key; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; if (on && focus) tab.focus(); });
    page.setAttribute('aria-labelledby', `h13-tab-${key}`);
    page.innerHTML = pageMarkup(source);
    url.textContent = source.url;
    browser.dataset.active = key;
    drawPencil(browser);
    bindPageDrag();
  };

  // ----- capture pane -----
  const capIdle = () => {
    capBody.innerHTML = `<div class="h13-drop" data-capdrop>${icon(icons.drop, 30)}<p><b>Drop a tab, a link or a screenshot</b></p><p class="h13-drop-sub">Kiln analyzes it into prompts, techniques, insights and tools, in a collection linked to the source.</p><button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-analyze>Analyze and add the open tab</button></div>`;
    capBody.querySelector('[data-analyze]')!.addEventListener('click', () => sendActive());
  };
  const testIdle = () => {
    testBody.innerHTML = `<div class="h13-drop h13-drop-test${current?.prompt ? '' : ' is-waiting'}" data-testdrop>${icon(icons.tests, 28)}<p><b>${current?.prompt ? 'Drag the prompt here' : 'The prompt lands here'}</b></p><p class="h13-drop-sub">${current?.prompt ? 'It runs on the repository above through Claude Code. Nothing in your code changes.' : current ? 'Drafts from a repo are tested the same way, one at a time. For a run here, try the video or the post.' : 'Capture a source first.'}</p></div>`;
  };

  const analyze = async (source: Source) => {
    busy = true; current = source; token++;
    added.add(source.key);
    tabs.forEach(tab => tab.classList.toggle('is-added', added.has(tab.dataset.tab as SourceKey)));
    rail('capture');
    capBody.innerHTML = `<div class="h13-analyzing"><p class="h13-chip">${favicon(source.key)}<span>${source.tab}</span><small>${source.label}</small></p><ol class="h13-reading" data-reading></ol><span class="h13-progress"><i></i></span></div>`;
    testIdle();
    const list = capBody.querySelector<HTMLElement>('[data-reading]')!;
    for (const text of source.reading) { list.insertAdjacentHTML('beforeend', `<li>${text}</li>`); await wait(420); }
    await wait(260);
    busy = false;
    collection(source);
  };
  const collection = (source: Source) => {
    const star = source.prompt
      ? `<article class="h13-prompt" data-prompt><header><span class="h13-kind h13-kind-prompt">Prompt</span><span class="h13-grip" aria-hidden="true"></span><span class="h13-rev">rev 1</span></header>
          <h4>${source.prompt.title}</h4><p>${source.prompt.text}</p>
          <footer>${source.prompt.from ? `<a href="#h13-page" class="h13-ts" data-ts>▶ from ${source.prompt.from}</a>` : `<span class="h13-ts">from the post</span>`}<button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-test-it>Test this prompt</button></footer></article>`
      : `<article class="h13-prompt h13-prompt-repo"><header><span class="h13-kind h13-kind-skill">Skills repository</span></header>
          <h4>mattpocock/skills</h4><p>Import every skill in <code>skills/</code> as a draft. The repository stays as it is, and nothing is installed until you approve a draft.</p>
          <footer><span class="h13-ts">from github.com</span><button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-import>Import as drafts</button></footer></article>`;
    capBody.innerHTML = `<p class="h13-col-head">New collection <b>${source.collection}</b>, linked to the ${source.label}</p>${star}
      <ul class="h13-extras">${source.extras.map(extra => `<li><span class="h13-kind h13-kind-${extra.kind.toLowerCase()}">${extra.kind}</span><p>${extra.text}</p>${extra.from ? `<a href="#h13-page" class="h13-ts" data-ts>▶ ${extra.from}</a>` : ''}</li>`).join('')}</ul>`;
    capBody.querySelectorAll<HTMLElement>('.h13-prompt, .h13-extras li').forEach((el, n) => el.animate(
      [{ opacity: 0, transform: n ? 'translateY(10px) scale(.96)' : 'scale(.9)' }, { opacity: 1, transform: 'none' }],
      { duration: reduced() ? 0 : n ? 320 : 460, delay: reduced() ? 0 : n ? 220 + n * 110 : 0, easing: 'cubic-bezier(.2,1.2,.4,1)', fill: 'backwards' }));
    capBody.querySelectorAll<HTMLAnchorElement>('[data-ts]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      select('yt');
      const time = /(\d+):(\d+)/.exec(link.textContent ?? '');
      const bar = page.querySelector<HTMLElement>('[data-yt-progress]');
      if (bar && time) bar.style.width = `${((Number(time[1]) * 60 + Number(time[2])) / (18 * 60 + 47)) * 100}%`;
    }));
    const importBtn = capBody.querySelector<HTMLButtonElement>('[data-import]');
    importBtn?.addEventListener('click', () => {
      importBtn.closest('footer')!.innerHTML = `<span class="h13-done-note">Imported as drafts into <b>mattpocock/skills</b>. Review one, test it, approve it, and it lands on your panel.</span>`;
    });
    const prompt = capBody.querySelector<HTMLElement>('[data-prompt]');
    testIdle();
    if (!prompt || !source.prompt) return;
    const send = (ghost?: HTMLElement) => { if (busy) { ghost?.remove(); return; } busy = true; swallow(prompt, test, ghost).then(() => { prompt.classList.add('is-sent'); runTest(source, 1); }); };
    prompt.querySelector('[data-test-it]')!.addEventListener('click', () => send());
    draggable({ handle: prompt, ghostFrom: () => prompt, target: () => test, drop: ghost => send(ghost) });
  };

  // ----- test pane -----
  const runTest = async (source: Source, revision: 1 | 2) => {
    const run = source.prompt!, mine = ++token, verdict = revision > 1 ? 'pass' : run.verdict;
    busy = true;
    repo.disabled = true;
    const repoName = repo.value;
    const text = revision > 1 && run.fix ? run.text.replace(run.fix.before, `<mark>${run.fix.after}</mark>`) : run.text;
    testBody.innerHTML = `<div class="h13-run">
      <p class="h13-run-title"><b>${run.title}</b><span class="h13-rev">rev ${revision}</span></p>
      <p class="h13-run-prompt${revision > 1 ? '' : ' is-clamped'}">${text}</p>
      <p class="h13-running" data-running><span class="h13-ring" aria-hidden="true"></span><span data-elapsed>Running on ${repoName}, 0:00</span></p>
      <ol class="h13-steps" data-steps></ol>
      <p class="h13-meta" data-meta>Claude Code, default model, medium effort</p>
      <div data-outcome></div></div>`;
    if (innerWidth < 1000) test.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    const steps = testBody.querySelector<HTMLElement>('[data-steps]')!, elapsed = testBody.querySelector<HTMLElement>('[data-elapsed]')!, meta = testBody.querySelector<HTMLElement>('[data-meta]')!;
    const list: Step[] = revision > 1 && run.fix ? [...run.steps.slice(0, -1), ['think', run.fix.step]] : run.steps;
    const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    for (const [index, [kind, line]] of list.entries()) {
      await wait(560);
      if (mine !== token) return;
      steps.insertAdjacentHTML('beforeend', `<li>${icon(icons[kind], 16)}<span>${line}</span></li>`);
      const seconds = 36 * (index + 1) + (revision > 1 ? 5 : 0);
      elapsed.textContent = `Running on ${repoName}, ${clock(seconds)}`;
      meta.textContent = `Claude Code, default model, medium effort. ${(6.8 * (index + 1)).toFixed(1)}k in, ${(4.1 * index).toFixed(1)}k cached, ${(0.5 * (index + 1)).toFixed(1)}k out (sample)`;
    }
    await wait(380);
    if (mine !== token) return;
    busy = false; repo.disabled = false;
    testBody.querySelector('[data-running]')!.innerHTML = `<span class="h13-okdot" aria-hidden="true"></span>Finished in ${clock(36 * list.length + (revision > 1 ? 5 : 0))} (sample run). Nothing in ${repoName} changed.`;
    const outcome = testBody.querySelector<HTMLElement>('[data-outcome]')!;
    const reveal = () => requestAnimationFrame(() => { const r = outcome.getBoundingClientRect(); if (r.bottom > innerHeight) scrollBy({ top: r.bottom - innerHeight + 24, behavior: reduced() ? 'auto' : 'smooth' }); });
    if (verdict === 'uncertain' && run.fix) {
      outcome.innerHTML = `<div class="h13-verdict h13-verdict-uncertain"><b>Uncertain</b><span>The agent’s own assessment: two confusing spots, and it couldn’t say which one a child hits first.</span></div>
        <p class="h13-fixlabel">Edit one line and run it again on the same repo:</p>
        <div class="h13-diff"><p class="h13-del">- ${run.fix.before}</p><p class="h13-add">+ ${run.fix.after}</p></div>
        <div class="h13-row-actions"><button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-rerun>Run rev 2</button></div>`;
      const rerun = outcome.querySelector<HTMLButtonElement>('[data-rerun]')!;
      rerun.addEventListener('click', () => runTest(source, 2));
      rerun.focus({ preventScroll: true });
      reveal();
      return;
    }
    outcome.innerHTML = `<div class="h13-verdict h13-verdict-pass"><b>Pass</b><span>The agent’s assessment. Whether you keep it is your call.</span></div>
      ${revision > 1 && run.fix ? `<p class="h13-lesson">${run.fix.lesson}</p>` : ''}
      <div class="h13-row-actions"><button type="button" class="h13-btn h13-btn-accent h13-btn-sm" data-approve>Approve rev ${revision} as a skill</button><button type="button" class="h13-btn h13-btn-sm h13-btn-subtle" data-skip>Not for me</button></div>
      <p class="h13-meta">Approving pins rev ${revision} and publishes it to your Kiln repository on GitHub.</p>`;
    const approve = outcome.querySelector<HTMLButtonElement>('[data-approve]')!;
    approve.focus({ preventScroll: true });
    reveal();
    approve.addEventListener('click', () => approveSkill(run, revision, approve));
    outcome.querySelector('[data-skip]')!.addEventListener('click', () => { current = null; capIdle(); testIdle(); });
  };

  const approveSkill = async (run: Run, revision: number, from: HTMLElement) => {
    stage.ensureTidy();
    const chip = document.createElement('div');
    chip.className = 'h13-ghost h13-chip-ghost';
    chip.innerHTML = `${kilnIcon(14)}<span>${run.skill}</span>`;
    const r = from.getBoundingClientRect();
    Object.assign(chip.style, { left: `${r.left}px`, top: `${r.top}px` });
    document.body.append(chip);
    panel.add(run.skill);
    rail('skills');
    kiln.querySelector<HTMLElement>('[data-landed-note]')!.textContent = `${run.skill} is approved at rev ${revision}. Choose where it’s installed.`;
    const status = skillsView.querySelector<HTMLElement>('[data-status]')!;
    status.textContent = `Approved rev ${revision} of ${run.skill} and installed it into ~/.claude/skills. Flip the other folders on if you want it there too.`;
    const row = skillsView.querySelector<HTMLElement>(`[data-row="${run.skill}"]`)!;
    if (innerWidth < 1000) kiln.scrollIntoView({ block: 'start', behavior: 'auto' });
    const t = row.getBoundingClientRect(), c = chip.getBoundingClientRect();
    if (!reduced()) await chip.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${t.left + 20 - c.left}px, ${t.top + t.height / 2 - c.top - c.height / 2}px) scale(.9)`, opacity: .2 }], { duration: 520, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }).finished;
    chip.remove();
    panel.flash(run.skill, skillsView);
    skillsView.querySelector<HTMLButtonElement>(`[data-skill="${run.skill}"][data-col="agents"]`)?.focus({ preventScroll: true });
  };

  // ----- sources: tabs, page and fallback button -----
  const sendActive = (ghost?: HTMLElement) => {
    if (busy) { ghost?.remove(); return; }
    const source = sources.find(item => item.key === active)!;
    const from = page.querySelector<HTMLElement>('[data-grab]') ?? page;
    busy = true;
    swallow(from, cap, ghost).then(() => analyze(source));
  };
  const sendTab = (key: SourceKey, ghost?: HTMLElement) => { if (active !== key) select(key); sendActive(ghost); };
  tabs.forEach((tab, n) => {
    tab.addEventListener('click', () => select(tab.dataset.tab as SourceKey));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      select(tabs[(n + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length].dataset.tab as SourceKey, true);
    });
    draggable({ handle: tab, ghostFrom: () => tab, target: () => cap, drop: ghost => sendTab(tab.dataset.tab as SourceKey, ghost) });
  });
  function bindPageDrag() {
    const grab = page.querySelector<HTMLElement>('[data-grab]');
    if (grab) draggable({ handle: grab, ghostFrom: () => grab, target: () => cap, drop: ghost => sendActive(ghost) });
  }
  addTab.addEventListener('click', () => sendActive());
  kiln.querySelector('[data-another]')!.addEventListener('click', () => {
    current = null; rail('capture'); capIdle(); testIdle();
    const next = sources.find(source => !added.has(source.key));
    if (next) select(next.key);
    kiln.querySelector<HTMLButtonElement>('[data-analyze]')?.focus();
  });
  kiln.querySelector('[data-see-first]')!.addEventListener('click', event => {
    event.preventDefault();
    const fresh = rows.find(row => row.fresh);
    if (fresh) stage.show(fresh.name);
  });

  select('yt');
  rail('capture');
  capIdle();
  testIdle();
}
