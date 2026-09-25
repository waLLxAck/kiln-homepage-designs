// PROTOTYPE round 5, H14 — Red-pen review, combined. H05's marked-up printout, story and red pen; H11's warm Kiln window
// and editors; H01's phone with the YouTube video; H03's motion (FLIP pop-in, crumpling junk, lift-and-gulp drags, pulsing switches).
// Act 1: the skill folders, doodled in red pen, pop into a crisp Kiln panel: folder labels become the columns, every file flies
// into its own cell, duplicates merge into one row, the dead link and the empty folder crumple into the cleanup bar.
// Act 2: "how do I add new skills?" Drag the phone, the post or the repo into Capture, drag the prompt into Test, approve it,
// and it lands on the same panel with its install switches off, waiting for you to flip them.
import './style.css';
import { examples, installer } from '../../content';
import { cross, folder, line, reseed } from '../r3-kit/rough';
import { createInk, type Ink, type InkMark, type InkNote } from './ink';
import { draggable, flyInto } from './drag';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const auto = navigator.webdriver;
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const restart = (el: Element | null | undefined, cls: string) => { if (!el) return; el.classList.remove(cls); void (el as HTMLElement).offsetWidth; el.classList.add(cls); };
const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const logo = (size = 18) => `<svg class="h14-logo" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1f1c18"/><path d="M8 25V16a8 8 0 0 1 16 0v9z" fill="#f6efe3"/><path d="M13 25v-5.5a3 3 0 0 1 6 0V25z" fill="#e8892b"/></svg>`;
const icon = (d: string, size = 16) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icons = {
  capture: 'M10 3.5v9M6 8.5l4 4 4-4M3.5 14v2.5h13V14',
  library: 'M4 3.5v13M8 3.5v13M11.5 4.2l3.8 12',
  tests: 'M8 3h4M8.8 3v5L4.5 15.2a1.3 1.3 0 0 0 1.1 1.8h8.8a1.3 1.3 0 0 0 1.1-1.8L11.2 8V3M6.5 12h7',
  skills: 'M3 6.5h8M3 13.5h5M14 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16 6.5h1M14 13.5h3',
  config: 'M5 2.8h6.5L15 6.3v10.9H5zM11.5 2.8v3.5H15M7.5 10h5M7.5 13h3.5',
  read: 'M5 2.8h6.5L15 6.3v10.9H5zM11.5 2.8v3.5H15M7.5 10h5M7.5 13h3.5',
  cmd: 'M3.5 5.5l4 4-4 4M9.5 14.5h7',
  think: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4',
  star: 'M10 2.8l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5L2.8 8l5-.6z',
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  play: 'M6 4.5v11l9-5.5z',
};
const titlebar = () => `<div class="h14-titlebar">
  <span class="h14-app">${logo(15)}Kiln</span>
  <span class="h14-search-all">Search everything<kbd>Ctrl+Shift+Space</kbd></span>
  <span class="h14-git">my-kiln · main · <b>synced</b></span>
  <i class="h14-winctl" aria-hidden="true"><b></b><b></b><b></b></i>
</div>`;
const note = (id: string, text: string, rot = 0, extra = '') => `<p class="h14-note${extra}" data-note="${id}" style="--r:${rot}deg" hidden>${text}</p>`;
const paperBall = '<svg class="h14-ball" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 8.5 7 4l4.5 1L16 4.5l.5 5-2 2.5 1.5 3.5-4.5 1-3.5-1.5L4 16l.5-4z" fill="#fbf5ea" stroke="#8a7f70" stroke-width="1.1" stroke-linejoin="round"/><path d="m7 4 1.5 5 3-4M8.5 9 4.5 12M8.5 9l3.5 3.5 2.5-.5M12 12.5 11 16.5" fill="none" stroke="#8a7f70" stroke-width=".9"/></svg>';

/** A small diff editor: file bar, line numbers, one removed and one added line. Used for drift and for the one-line prompt fix. */
const editor = (file: string, versions: string, lineNo: number, del: string, add: string) => `<div class="h14-diff">
  <p class="h14-diff-bar"><span>${icon(icons.read, 13)}${file}</span><em>${versions}</em></p>
  <p class="h14-del"><i>${lineNo}</i><span>- ${del}</span></p>
  <p class="h14-add"><i>${lineNo}</i><span>+ ${add}</span></p>
</div>`;

// ---------- sample data: the panel ----------

type Cell = 'on' | 'off' | 'edited' | 'found';
type Col = 'claude' | 'shared' | 'codex' | 'copilot' | 'project';
type Drift = { why: string; line: number; del: string; add: string };
type Row = { name: string; caption: string; rev: number; cells: Record<Col, Cell>; drift?: Partial<Record<Col, Drift>>; fresh?: boolean; pulse?: boolean };
const columns: { key: Col; name: string; short: string; path: string; who: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/<wbr>skills', who: 'Claude Code' },
  { key: 'shared', name: 'Shared (Codex, Copilot and others)', short: 'Shared', path: '~/.agents/<wbr>skills', who: 'Codex or Copilot' },
  { key: 'codex', name: 'Codex only', short: 'Codex', path: '~/.codex/<wbr>skills', who: 'Codex' },
  { key: 'copilot', name: 'Copilot only', short: 'Copilot', path: '~/.copilot/<wbr>skills', who: 'Copilot' },
  { key: 'project', name: 'my-game project', short: 'my-game', path: '.github/<wbr>skills', who: 'my-game' },
];
const plain = (html: string) => html.replace(/<wbr>/g, '');
const off: Record<Col, Cell> = { claude: 'off', shared: 'off', codex: 'off', copilot: 'off', project: 'off' };
const rows: Row[] = [
  { name: 'code-review', caption: '3 copies, 1 duplicate flagged', rev: 3, cells: { ...off, claude: 'on', shared: 'on', project: 'edited' },
    drift: { project: { why: 'Someone edited this copy by hand.', line: 12, del: 'Review standards and the specification separately.', add: 'Review the specification only. FINAL.' } } },
  { name: 'research', caption: '2 copies, 1 older', rev: 2, cells: { ...off, claude: 'on', shared: 'edited' },
    drift: { shared: { why: 'This copy is still revision 1.', line: 7, del: 'Cite sources with links and dates.', add: 'Cite sources.' } } },
  { name: 'writing-for-agents', caption: 'approved rev 1', rev: 1, cells: { ...off, claude: 'on' } },
  { name: 'playtest-brief', caption: 'approved rev 4', rev: 4, cells: { ...off, project: 'on' } },
  { name: 'pr-summary', caption: 'not in your library', rev: 0, cells: { ...off, codex: 'found' } },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'changed outside Kiln', found: 'found outside your library' };

// ---------- sample data: the doodled folders ----------

type DFile = { text: string; row?: string; dupe?: boolean; junk?: boolean; remark?: string; broken?: boolean };
type DFolder = { path: string; who: string; col: Col; rot: number; files: DFile[] };
const folders: DFolder[][] = [[
  { path: '~/.claude/skills', who: 'Claude Code', col: 'claude', rot: -1.2, files: [{ text: 'code-review', row: 'code-review' }, { text: 'code-review (1)', row: 'code-review', dupe: true, remark: 'dupe??' }, { text: 'research', row: 'research' }, { text: 'writing-for-agents', row: 'writing-for-agents' }] },
  { path: '~/.codex/skills', who: 'Codex', col: 'codex', rot: .9, files: [{ text: 'pr-summary', row: 'pr-summary', remark: 'forgot I had this' }] },
  { path: 'my-game/.github/skills', who: 'this project', col: 'project', rot: -.5, files: [{ text: 'code-review', row: 'code-review', remark: 'final-final' }, { text: 'playtest-brief', row: 'playtest-brief' }] },
], [
  { path: '~/.agents/skills', who: 'Codex, Copilot & co.', col: 'shared', rot: 1.3, files: [{ text: 'code-review', row: 'code-review' }, { text: 'research', row: 'research', remark: 'older one?' }, { text: 'old-link', junk: true, broken: true, remark: 'dead link' }] },
  { path: '~/.copilot/skills', who: 'Copilot', col: 'copilot', rot: -1.5, files: [{ text: 'untitled-skill/', junk: true, remark: '(empty)' }] },
]];
const slotOf = (f: DFile, d: DFolder) => (f.junk ? 'cleanup' : f.dupe ? `row:${f.row}` : `cell:${f.row}:${d.col}`);
const targets = new Set(folders.flat().flatMap(d => d.files.map(f => slotOf(f, d))));

// ---------- sample data: the sources and what Kiln pulls out of them ----------

type Card = { kind: string; title: string; from?: string };
type Run = { lines: [string, string][]; verdict: 'pass' | 'uncertain'; text: string; edit?: { del: string; add: string }; again?: [string, string][]; passText?: string };
type Pack = { key: 'yt' | 'x' | 'gh'; label: string; chip: string; chipMeta: string; found: string; star: { kind: string; title: string; text: string; from?: string }; cards: Card[]; skill?: string; run?: Run };
const packs: Record<Pack['key'], Pack> = {
  yt: {
    key: 'yt', label: 'YouTube: I let a seven-year-old test my app', chip: 'I let a seven-year-old test my app (with an agent)', chipMeta: 'Pixel &amp; Pine · 18:24 · sample video',
    found: 'Found a prompt, a technique, an insight and a tool. Each one links to its minute in the video.',
    star: { kind: 'Prompt', title: examples[0].title, text: examples[0].prompt, from: '04:12' },
    cards: [{ kind: 'Technique', title: 'Test as someone who won’t read the manual', from: '07:30' }, { kind: 'Insight', title: 'You stop seeing the confusing bits of your own app', from: '11:05' }, { kind: 'Tool', title: 'A screen recorder, to replay the session', from: '15:48' }],
    skill: 'fresh-eyes',
    run: {
      lines: [['read', 'Read README.md and package.json'], ['read', 'Opened src/screens/Start.tsx'], ['cmd', 'rg -l "signup" src/'], ['think', 'Start screen wants a parent account first']],
      verdict: 'uncertain', text: 'It couldn’t get past the parent signup, so it never reached an activity. Marked uncertain instead of guessing.',
      edit: { del: 'Skip the parent-only signup.', add: 'Skip the parent-only signup. If it blocks you, use the demo profile in README.md.' },
      again: [['read', 'README.md: found the demo profile'], ['read', 'Walked Levels, Shop and Settings'], ['think', 'First obstacle: Play is an icon with no label']],
      passText: 'First obstacle: the Play button is an icon with no label. Suggested fix: put the word “Play” under it. No files changed.',
    },
  },
  x: {
    key: 'x', label: 'Post on X by @nadiabuilds', chip: 'Post by Nadia Brooks (@nadiabuilds)', chipMeta: 'Fictional post · sample',
    found: 'Found a prompt, a technique, an insight and a tool, linked to the post.',
    star: { kind: 'Prompt', title: examples[1].title, text: examples[1].prompt },
    cards: [{ kind: 'Technique', title: 'Fix the instruction, not the output' }, { kind: 'Insight', title: 'Old AGENTS.md rules outlive their reasons' }, { kind: 'Tool', title: 'AGENTS.md and CLAUDE.md' }],
    skill: 'trace-the-instruction',
    run: {
      lines: [['read', 'Read AGENTS.md and CLAUDE.md'], ['cmd', 'git log -5 -- AGENTS.md'], ['read', 'Opened src/save/slots.ts'], ['think', '“Always add a migration” predates the new save format']],
      verdict: 'pass', text: 'Traced it to AGENTS.md, line 14: an outdated rule about migrations. Proposed a one-line change. No files changed.',
    },
  },
  gh: {
    key: 'gh', label: 'GitHub: mattpocock/skills', chip: 'mattpocock/skills', chipMeta: 'GitHub repository · skills/, README.md, LICENSE',
    found: 'Staged every skill in skills/ as a draft, linked to the repository. Nothing is installed.',
    star: { kind: 'Skills repository', title: 'mattpocock/skills', text: 'The skills in <code>skills/</code> come in as drafts for review. The repository stays where it is, and nothing is installed until you approve a revision.' },
    cards: [{ kind: 'Source note', title: 'README.md, kept with the drafts' }, { kind: 'Resource', title: 'A link back to the repository' }],
  },
};

// ---------- the red pen ----------

const p1Notes: InkNote[] = [
  { id: 'n-merge', when: 'popped', reserve: true, target: '[data-panel="p1"] tr[data-row="code-review"] small', mark: 'underline', side: 'above', ref: '[data-win1]', dx: -40, w: 250, bend: 1 },
  { id: 'n-flip', when: 'popped', reserve: true, target: '[data-slot="col:codex"]', mark: 'none', side: 'above', ref: '[data-win1]', dx: 40, w: 260, noArrow: true },
  { id: 'n-amber', when: 'popped', reserve: true, target: '[data-panel="p1"] tr[data-row="code-review"] td[data-col="project"] .h14-switch', mark: 'circle', side: 'right', w: 176 },
  { id: 'n-found', when: 'popped', reserve: true, target: '[data-panel="p1"] tr[data-row="pr-summary"] td[data-col="codex"] .h14-switch', mark: 'circle', side: 'right', w: 176, bend: -1 },
  { id: 'n-clean', when: 'popped', reserve: true, target: '[data-slot="cleanup"]', mark: 'none', side: 'right', w: 176, dy: 30 },
  { id: 'n-context', when: 'popped', reserve: true, target: '[data-context]', mark: 'none', side: 'below', ref: '[data-win1]', dx: 60, w: 420, bend: -1 },
];
const p1Marks: InkMark[] = [{ id: 'm-link', when: 'drawn', from: '[data-doodle]', to: '[data-win1]', mark: 'link' }];
const p2Notes: InkNote[] = [
  { id: 'n-drag', when: 'p2', until: 'captured', target: '[data-zone="capture"]', mark: 'none', side: 'above', ref: '[data-win2]', dx: 40, w: 330 },
  { id: 'n-star', when: 'captured-prompt', until: 'captured-gh', target: '[data-star]', mark: 'none', side: 'above', ref: '[data-win2]', dx: 30, w: 360 },
  { id: 'n-gh', when: 'captured-gh', until: 'captured-prompt', target: '[data-star]', mark: 'none', side: 'above', ref: '[data-win2]', dx: 30, w: 360 },
  { id: 'n-ro', when: 'p2', target: '[data-ro]', mark: 'circle', side: 'right', w: 170 },
  { id: 'n-tokens', when: 'ran', target: '[data-meter]', mark: 'none', side: 'right', w: 170 },
  { id: 'n-uncertain', when: 'uncertain', until: 'passed', target: '[data-edit]', mark: 'box', side: 'right', w: 170 },
  { id: 'n-verdict', when: 'passed', target: '[data-yours]', mark: 'box', side: 'right', w: 170 },
  { id: 'n-landed', when: 'approved', target: '[data-panel="p2"] tr.is-fresh:last-child td:last-child', mark: 'none', side: 'right', w: 170 },
];
const p2Marks: InkMark[] = [
  { id: 'm-yt', when: 'p2', target: '[data-src="yt"] .h14-phone', mark: 'loop', pad: 2 },
  { id: 'm-x', when: 'p2', target: '[data-src="x"] .h14-clip', mark: 'loop', pad: 2 },
  { id: 'm-gh', when: 'p2', target: '[data-src="gh"] .h14-clip', mark: 'loop', pad: 2 },
];

// ---------- markup: hero and act 1 ----------

function doodle() {
  const file = (f: DFile, d: DFolder) => `<li><span class="h14-file${f.broken ? ' is-broken' : ''}" data-flyer data-to="${slotOf(f, d)}" data-r="${d.rot}">${f.text}</span>${f.remark ? `<em>${f.remark}</em>` : ''}</li>`;
  const box = (d: DFolder) => `<div class="h14-fold" style="--rot:${d.rot}deg"><svg class="h14-fold-art" aria-hidden="true"></svg>
    <p class="h14-fold-path" data-flyer data-to="col:${d.col}" data-r="${d.rot}">${d.path} <span>${d.who}</span></p><ul>${d.files.map(f => file(f, d)).join('')}</ul></div>`;
  return `<figure class="h14-doodle" data-doodle role="img" aria-label="A red-pen doodle of five skill folders: ~/.claude/skills with code-review, a duplicate code-review (1), research and writing-for-agents; ~/.agents/skills with another code-review, an older research and a dead link; ~/.codex/skills with a forgotten pr-summary; an empty skill in ~/.copilot/skills; and my-game/.github/skills with a hand-edited code-review and playtest-brief.">
    <div class="h14-doodle-cols">${folders.map(col => `<div class="h14-doodle-col">${col.map(box).join('')}${col.length === 2 ? '<p class="h14-scrawl-q" data-flyer data-to="context" data-r="-4">which one is<br>Claude reading??</p>' : ''}</div>`).join('')}</div>
  </figure>`;
}

function panelMarkup(scope: 'p1' | 'p2') {
  const main = scope === 'p1';
  return `<section class="h14-pane h14-panel" data-panel="${scope}" aria-label="${main ? 'Skills panel, sample library' : 'The same skills panel, with the skill you just approved'}">
    <header class="h14-pane-head"><b>Skills</b><span>${main ? 'one row per skill, one switch per place your agents look' : 'just approved, not installed yet'}</span>${main ? '<span class="h14-tabs"><i class="is-on">Installed</i><i>Receipts</i></span>' : '<a class="h14-mini-link" href="#h14-p1" data-see-all>See it with the others</a>'}</header>
    <div class="h14-table-wrap">
      <table><thead><tr><th scope="col">Skill</th>${columns.map(c => `<th scope="col"${main ? ` data-slot="col:${c.key}"` : ''} title="${c.name}"><span>${c.short}</span><code data-aim>${c.path}</code></th>`).join('')}</tr></thead><tbody data-rows></tbody></table>
      ${main ? '<p class="h14-waiting" data-waiting>Kiln hasn’t read your folders yet.</p>' : ''}
    </div>
    ${main ? `<div class="h14-cleanup" data-slot="cleanup"><span class="h14-ball-slot" data-aim>${paperBall}</span><p data-cleanup-text>Found a broken link in <code>~/.agents/skills</code> and an empty skill folder in <code>~/.copilot/skills</code>.</p><button type="button" class="h14-btn" data-cleanup>Clean up safely</button></div>
    <ul class="h14-key" aria-label="What the switches mean"><li><i class="h14-sw h14-sw-on"></i>installed</li><li><i class="h14-sw h14-sw-edited"></i>changed outside Kiln</li><li><i class="h14-sw h14-sw-found"></i>found outside the library</li><li><i class="h14-sw h14-sw-off"></i>off</li></ul>` : ''}
    <footer class="h14-panel-foot"><p class="h14-context"${main ? ' data-slot="context"' : ''}><span class="h14-hl" data-hl="n-context" data-context data-aim></span></p><p class="h14-status" data-status aria-live="polite"></p></footer>
    <div class="h14-pop" data-pop hidden role="dialog" aria-modal="false" aria-label="Skill copy"></div>
  </section>`;
}

function actOne() {
  return `<section class="h14-sheet h14-p1" id="h14-p1" aria-labelledby="h14-p1-title" data-state="mess">
    <i class="h14-crop h14-crop-tl"></i><i class="h14-crop h14-crop-tr"></i><i class="h14-crop h14-crop-bl"></i><i class="h14-crop h14-crop-br"></i>
    <div class="h14-p1-grid">
      <div class="h14-p1-mess">
        <header class="h14-sheet-head">
          <h2 id="h14-p1-title">Here’s what was actually in my skill folders.</h2>
          <p>Five folders, three agents, one skill in three places. Kiln reads them all: one row per skill, one switch per place an agent looks.</p>
        </header>
        ${doodle()}
        <p class="h14-pop-row"><button type="button" class="h14-btn h14-btn-ink h14-btn-big" data-popin>Pop them into Kiln</button><span class="h14-pop-live" data-pop-live aria-live="polite"></span></p>
      </div>
      <div class="h14-notes">${note('n-merge', '3 folders, <b>1 row</b>. the “(1)” copy gets flagged as a duplicate.', -2)}${note('n-amber', 'amber = changed outside Kiln. hand-edited, or just old. it shows me the diff first.', 2)}${note('n-flip', 'p.s. the switches are real. flip one.', -1.5)}</div>
      <div class="h14-window h14-win1" data-win1>${titlebar()}${panelMarkup('p1')}</div>
      <div class="h14-notes">${note('n-context', 'every description here rides along on <b>every turn</b>, used or not. switch it off and it’s out of context.', -1)}${note('n-clean', 'dead link + empty folder: flagged, cleaned up safely. nothing else touched.', 1.5)}${note('n-found', 'the one I forgot I had. import it, or bin it.', -2)}</div>
      <div class="h14-margin" data-margin aria-hidden="true"></div>
    </div>
    <div class="h14-flight" data-flight aria-hidden="true"></div>
    <svg class="h14-ink" data-ink aria-hidden="true"></svg>
  </section>`;
}

// ---------- markup: act 2 ----------

function phone() {
  return `<div class="h14-phone"><div class="h14-phone-screen">
    <p class="h14-phone-status"><span>9:41</span><i class="h14-island"></i><span class="h14-phone-bat"><i></i></span></p>
    <div class="h14-player">
      <div class="h14-frame"><i class="h14-frame-sun"></i><span class="h14-frame-tab"><i class="h14-frame-icon"></i><i class="h14-frame-line"></i><i class="h14-frame-line"></i></span></div>
      <div class="h14-paused"><span class="h14-ctl h14-ctl-prev"></span><span class="h14-ctl h14-ctl-play"><i></i></span><span class="h14-ctl h14-ctl-next"></span></div>
      <p class="h14-player-time"><b>4:12</b> / 18:24</p>
      <span class="h14-scrub"><i></i><b></b></span>
    </div>
    <div class="h14-yt-info"><b>I let a seven-year-old test my app (with an agent)</b><small>31K views · 3 weeks ago</small></div>
    <p class="h14-yt-chan"><i class="h14-avatar h14-avatar-yt">P</i><span>Pixel &amp; Pine</span><em>Subscribe</em></p>
    <p class="h14-yt-pills"><span>Like</span><span>Share</span><span>Save</span></p>
    <p class="h14-yt-next"><i></i><span></span></p><p class="h14-yt-next"><i></i><span></span></p>
  </div></div>`;
}

function sources() {
  const x = `<div class="h14-clip h14-x"><header><i class="h14-avatar">NB</i><p><b>Nadia Brooks</b><small>@nadiabuilds · 2h</small></p><span class="h14-x-mark" aria-hidden="true"></span></header>
    <p class="h14-x-text">Agent did exactly what you didn’t mean? Don’t fix the output. Ask it which instruction made it do that, then fix the instruction.</p>
    <footer aria-hidden="true">${icon('M4 5h12v8H9l-4 3v-3H4z', 13)}${icon('M5 8l3-3 3 3M8 5v8h6M15 12l-3 3-3-3', 13)}${icon('M10 16s-6-3.6-6-8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4.4-6 8-6 8z', 13)}</footer></div>`;
  const gh = `<div class="h14-clip h14-gh"><header><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.07 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8Z"/></svg><p><span>mattpocock</span> / <b>skills</b></p><em>Public</em></header>
    <div class="h14-gh-bar"><span>main</span><b>Code &#x25BE;</b></div>
    <ul><li class="is-dir">skills/</li><li>README.md</li><li>LICENSE</li></ul></div>`;
  const labels: Record<Pack['key'], string> = {
    yt: 'A phone playing a YouTube video, paused at 4:12 of 18:24: I let a seven-year-old test my app (with an agent), by Pixel &amp; Pine. Drag it into Kiln’s capture area.',
    x: 'A clipped post on X by Nadia Brooks, @nadiabuilds. Drag it into Kiln’s capture area.',
    gh: 'A clipped GitHub page for the repository mattpocock/skills. Drag it into Kiln’s capture area.',
  };
  const item = (key: Pack['key'], art: string, caption: string, rot: number, tape: boolean) => `<div class="h14-src" data-src="${key}" style="--rot:${rot}deg">
    <div class="h14-src-drag${key === 'yt' ? ' h14-phone-holder' : ''}" data-drag="${key}" data-r="${rot}" aria-label="${labels[key]}" role="group">${tape ? '<i class="h14-tape" aria-hidden="true"></i>' : ''}${art}</div>
    <p class="h14-src-foot"><span>${caption}</span><button type="button" class="h14-btn h14-btn-sm" data-add="${key}">Add to Kiln</button></p>
  </div>`;
  return `<div class="h14-sources" aria-label="Where good ideas come from">
    ${item('yt', phone(), 'watched it twice. tried it never.', -2.2, false)}
    ${item('x', x, 'saved. obviously never tried.', 1.2, true)}
    ${item('gh', gh, 'a whole repo of them.', -.8, true)}
  </div>`;
}

function actTwo() {
  const repos = ['~/code/my-game', '~/code/recipe-box', 'Isolated example'];
  const rail: [keyof typeof icons, string][] = [['capture', 'Capture'], ['library', 'Library'], ['tests', 'Tests'], ['skills', 'Skills'], ['config', 'Config']];
  return `<section class="h14-sheet h14-p2" id="h14-p2" aria-labelledby="h14-p2-title">
    <i class="h14-crop h14-crop-tl"></i><i class="h14-crop h14-crop-tr"></i><i class="h14-crop h14-crop-bl"></i><i class="h14-crop h14-crop-br"></i>
    <header class="h14-sheet-head">
      <h2 id="h14-p2-title">Then: how do I add new skills to this?</h2>
      <p>I’d find a great prompt in a video, save it, and never try it. Now I drag it into Kiln, test it on a repo, and keep it only if it works.</p>
    </header>
    <div class="h14-p2-grid">
      ${sources()}
      <div class="h14-window h14-win2" data-win2>
        ${titlebar()}
        <div class="h14-p2-body">
          <nav class="h14-rail" aria-label="Sample app sections">${rail.map(([key, name], i) => `<span class="${i === 0 ? 'is-lit' : ''}">${icon(icons[key], 17)}<small>${name}</small></span>`).join('')}</nav>
          <div class="h14-notes">${note('n-drag', 'drag one in here. <small>(no mouse? tab to <b>Add to Kiln</b>.)</small>', -1.5)}${note('n-star', 'the prompt is the star. techniques, insights and tools come along, <b>with timestamps</b>.', -1.5)}${note('n-gh', 'a repo comes in as drafts. nothing installs until I approve one.', -1.5)}</div>
          <section class="h14-pane h14-capture" data-zone="capture" aria-labelledby="h14-cap-title">
            <header class="h14-pane-head"><b id="h14-cap-title">Capture</b><span>Analyze and add</span><kbd>Ctrl+Shift+Space</kbd></header>
            <div class="h14-cap-body" data-cap></div>
          </section>
          <div class="h14-notes">${note('n-ro', 'read-only. it can’t change a line of my code.', 2)}</div>
          <section class="h14-pane h14-test" data-zone="test" aria-labelledby="h14-test-title">
            <header class="h14-pane-head"><b id="h14-test-title">Test</b><span data-rev>no prompt yet</span><span class="h14-live" data-live>idle</span></header>
            <div class="h14-test-ctx">
              <p><span>Experiments inspect your code. They never edit it.</span><i class="h14-badge h14-badge-ro" data-ro>Read-only</i></p>
              <div class="h14-test-pick">
                <label><span>Project (sample)</span><select data-repo>${repos.map(r => `<option>${r}</option>`).join('')}</select></label>
                <label><span>Agent</span><select data-agent><option>Claude Code</option><option>Codex</option></select></label>
              </div>
            </div>
            <div class="h14-test-body" data-testbody></div>
          </section>
          <div class="h14-notes">${note('n-verdict', 'pass is the agent’s call. keeping it is <b>mine</b>.', -1.5)}${note('n-uncertain', 'it said uncertain instead of faking a pass. one line fixes it.', 1.5)}${note('n-tokens', 'every run shows its tokens. <small>(sample numbers. my Claude plan, no API key.)</small>', -2)}</div>
        </div>
        <div class="h14-landing" data-landing hidden>${panelMarkup('p2')}</div>
        <div class="h14-notes">${note('n-landed', 'same panel as up top. pick where it goes.', 2)}</div>
      </div>
      <div class="h14-margin" data-margin aria-hidden="true"></div>
    </div>
    <svg class="h14-ink" data-ink aria-hidden="true"></svg>
  </section>`;
}

// ---------- markup: close ----------

function close() {
  const qa = [
    ['Do I need an API key?', 'No. Kiln drives the Codex or Claude Code you’re already signed into, on your ChatGPT or Claude plan. Its usage limits still apply. Editing, approving and installing never call a model.'],
    ['Will a test change my code?', 'No. Experiments are read-only, and the output is saved with the exact revision you ran.'],
    ['Where does an approved skill live?', 'Approval pins that revision and publishes it to your own Kiln GitHub repository. On another machine, run <code>kiln skills sync</code>.'],
  ];
  return `<section class="h14-close" id="h14-get" aria-labelledby="h14-get-title">
    <div class="h14-get">
      <h2 id="h14-get-title">Point it at your own skill folders.</h2>
      <p>Import what you have, switch off what you don’t use, and test the next prompt you save on your own repo.</p>
      <a class="h14-download" href="${installer}">${windows}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="h14-fine">The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned. Kiln is a Windows app with a CLI your agents can use, MIT licensed.</p>
    </div>
    <dl class="h14-qa">${qa.map(([q, a]) => `<div><dt>${q}</dt><dd>${a}</dd></div>`).join('')}</dl>
  </section>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h14" data-h14>
    <header class="h14-top"><a class="h14-brand" href="#main">${logo(20)}Kiln</a>
      <nav aria-label="Main navigation"><a href="#h14-p1">My folders</a><a href="#h14-p2">New skills</a><a href="#h14-get" class="h14-top-get">Download</a></nav></header>
    <main id="main">
      <section class="h14-hero" aria-labelledby="h14-title">
        <h1 id="h14-title">My agents were loading skills I forgot I had. So I built this.</h1>
        <div class="h14-hero-side">
          <p>Kiln is a Windows app for Codex, Claude Code and Copilot. It shows every skill your agents load, one switch per folder, and lets you test a new prompt on your own repo before it becomes one.</p>
          <div class="h14-hero-actions"><a class="h14-download" href="${installer}">${windows}<span>Download for Windows</span></a><a class="h14-link" href="#h14-p1">See my folders</a></div>
        </div>
      </section>
      ${actOne()}
      ${actTwo()}
      ${close()}
    </main>
  </div>`;
  const page = root.querySelector<HTMLElement>('[data-h14]')!;
  const isDesk = () => innerWidth >= 1100;
  const setMode = () => { page.classList.toggle('h14-desk', isDesk()); page.classList.toggle('h14-stack', !isDesk()); };
  setMode();
  const ink1 = createInk(root.querySelector('.h14-p1')!, p1Notes, p1Marks, isDesk);
  const ink2 = createInk(root.querySelector('.h14-p2')!, p2Notes, p2Marks, isDesk);
  const panels = bindPanels(root, ink1, ink2);
  const pop = bindPopIn(root, panels, ink1);
  bindActTwo(root, page, panels, pop, ink2);
  addEventListener('resize', () => { setMode(); drawDoodle(root); ink1.refresh(); ink2.refresh(); });
  document.fonts?.ready.then(() => { drawDoodle(root); ink1.refresh(); ink2.refresh(); });
  drawDoodle(root);
  ink2.reach('p2');
  pop.start();
}

// ---------- act 1: the doodle ----------

function drawDoodle(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.h14-fold').forEach((fold, n) => {
    const svg = fold.querySelector('svg')!, w = fold.offsetWidth, h = fold.offsetHeight;
    if (!w) return;
    const label = fold.querySelector<HTMLElement>('.h14-fold-path')!, top = label.offsetTop + label.offsetHeight + 3;
    const box = fold.getBoundingClientRect();
    reseed(40 + n * 11);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h));
    let d = `<path d="${folder(2, top, w - 6, h - top - 2)}" class="h14-s" pathLength="1" style="--i:${n}"/>`;
    fold.querySelectorAll<HTMLElement>('.is-broken').forEach(file => {
      const r = file.getBoundingClientRect(), x = r.left - box.left, y = r.top - box.top + r.height * .55;
      d += `<path d="${cross(x + 5, y, 5.5)}" class="h14-s" pathLength="1" style="--i:${n + 1}"/><path d="${line(x + 12, y, x + r.width + 3, y - 1, .8)}" class="h14-s" pathLength="1" style="--i:${n + 1.5}"/>`;
    });
    svg.innerHTML = d;
  });
}

// ---------- the panel (shared by both acts) ----------

type Panels = ReturnType<typeof bindPanels>;
function bindPanels(root: HTMLElement, ink1: Ink, ink2: Ink) {
  // Which slots of the first panel the pop-in has filled, so a repaint keeps them.
  const slots = new Set<string>(), rowsIn = new Set<string>();
  let cleaned = false;
  const mounts = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const count = (key: Col) => rows.filter(row => row.cells[key] === 'on' || row.cells[key] === 'edited').length;
  const sw = (row: Row, r: number, c: typeof columns[number]) => {
    const state = row.cells[c.key];
    return `<button type="button" role="switch" class="h14-switch h14-switch-${state}" data-row="${r}" data-col="${c.key}" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.name} in ${c.name}: ${stateText[state]}"><i></i></button>`;
  };
  const slotAttr = (scope: string, slot: string) => (scope === 'p1' && targets.has(slot) ? ` data-slot="${slot}"${slots.has(slot) ? ' class="is-in"' : ''}` : '');
  const rowHtml = (row: Row, r: number, scope: string) => `<tr data-row="${row.name}" class="${row.fresh ? 'is-fresh ' : ''}${row.pulse ? 'is-pulse ' : ''}${scope === 'p2' || row.fresh || rowsIn.has(row.name) ? 'is-in' : ''}">
    <th scope="row"${slotAttr(scope, `row:${row.name}`)}><b data-aim>${row.name}</b><small>${row.caption}</small></th>${columns.map(c => `<td data-col="${c.key}"${slotAttr(scope, `cell:${row.name}:${c.key}`)}>${sw(row, r, c)}</td>`).join('')}</tr>`;
  function paint() {
    for (const mount of mounts) {
      const scope = mount.dataset.panel!;
      const body = mount.querySelector<HTMLElement>('[data-rows]')!;
      body.innerHTML = rows.map((row, r) => (scope === 'p1' || row.fresh ? rowHtml(row, r, scope) : '')).join('');
      mount.querySelector('[data-context]')!.textContent = `Descriptions loaded in every new session: Claude Code ${count('claude')} · shared ${count('shared')} · Codex ${count('codex')} · Copilot ${count('copilot')} · my-game ${count('project')}`;
    }
    const cleanup = root.querySelector<HTMLElement>('[data-slot="cleanup"]')!;
    cleanup.classList.toggle('is-done', cleaned);
    ink1.refresh(); ink2.refresh();
  }
  const say = (mount: HTMLElement, text: string) => { const status = mount.querySelector<HTMLElement>('[data-status]')!; status.textContent = text; restart(status, 'is-new'); };
  const refocus = (mount: HTMLElement, r: number, col: string) => mount.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${col}"]`)?.focus();

  for (const mount of mounts) {
    const pop = mount.querySelector<HTMLElement>('[data-pop]')!;
    let returnTo: HTMLElement | null = null;
    // While a flyout is open, the red pen steps back so its circles don't land on the editor.
    const sheetOf = mount.closest('.h14-sheet')!;
    new MutationObserver(() => sheetOf.classList.toggle('has-pop', !pop.hidden)).observe(pop, { attributes: true, attributeFilter: ['hidden'] });
    const closePop = () => { if (pop.hidden) return; pop.hidden = true; returnTo?.focus(); returnTo = null; };
    const openPop = (html: string, from: HTMLElement) => { pop.innerHTML = html; pop.hidden = false; returnTo = from; pop.querySelector<HTMLElement>('button')?.focus(); };
    mount.addEventListener('click', event => {
      const target = event.target as Element;
      const button = target.closest<HTMLButtonElement>('.h14-switch');
      if (button) {
        const r = Number(button.dataset.row), row = rows[r], c = columns.find(item => item.key === button.dataset.col)!, state = row.cells[c.key], path = plain(c.path);
        if (state === 'edited') {
          const drift = row.drift![c.key]!;
          openPop(`<h3><code>${path}/${row.name}</code> changed outside Kiln</h3><p>${drift.why} Compared with approved rev ${row.rev}; Kiln won’t overwrite it without asking.</p>
            ${editor(`${row.name}/SKILL.md`, `approved rev ${row.rev} → this copy`, drift.line, drift.del, drift.add)}
            <div class="h14-row-actions"><button type="button" class="h14-btn h14-btn-ink" data-act="replace">Replace with rev ${row.rev}</button><button type="button" class="h14-btn" data-act="draft">Keep my edit as draft rev ${row.rev + 1}</button><button type="button" class="h14-btn h14-btn-ghost" data-act="close">Cancel</button></div>`, button);
          pop.dataset.row = String(r); pop.dataset.col = c.key;
          say(mount, 'That copy changed outside Kiln. Compare it first.');
          return;
        }
        if (state === 'found') {
          openPop(`<h3>${row.name} isn’t in your library</h3><p>Import it as a draft. The folder in <code>${path}</code> stays exactly where it is.</p>
            <div class="h14-row-actions"><button type="button" class="h14-btn h14-btn-ink" data-act="import">Import as a draft</button><button type="button" class="h14-btn h14-btn-ghost" data-act="close">Not now</button></div>`, button);
          pop.dataset.row = String(r); pop.dataset.col = c.key;
          return;
        }
        if (row.rev === 0) { say(mount, `Import ${row.name} first, then install it anywhere.`); return; }
        row.cells[c.key] = state === 'on' ? 'off' : 'on';
        const first = row.pulse;
        row.pulse = false;
        paint();
        say(mount, state === 'on' ? `Removed ${row.name} from ${path}. It stays in your library.` : `Installed rev ${row.rev} of ${row.name} into ${path}. ${first ? `A new ${c.who} session picks it up.` : 'Receipt saved.'}`);
        refocus(mount, r, c.key);
        return;
      }
      const act = target.closest<HTMLElement>('[data-act]')?.dataset.act;
      if (act) {
        const r = Number(pop.dataset.row), row = rows[r], key = pop.dataset.col as Col, path = plain(columns.find(c => c.key === key)!.path);
        pop.hidden = true;
        if (act === 'replace') { row.cells[key] = 'on'; say(mount, `Moved the changed copy to a private backup and installed rev ${row.rev} into ${path}.`); }
        if (act === 'draft') { row.cells[key] = 'on'; row.caption = `rev ${row.rev} approved, draft rev ${row.rev + 1} from the edit`; say(mount, `Saved the edit as draft rev ${row.rev + 1}. Rev ${row.rev} stays installed until you approve it.`); }
        if (act === 'import') { row.cells[key] = 'on'; row.rev = 1; row.caption = 'draft, imported just now'; say(mount, `Imported ${row.name} as a draft. The original stays in ${path}.`); }
        paint();
        refocus(mount, r, key); returnTo = null;
        if (act === 'close') say(mount, 'Nothing changed.');
        return;
      }
      if (target.closest('[data-cleanup]')) {
        cleaned = true; paint();
        root.querySelector('[data-cleanup-text]')!.textContent = 'Removed the broken link and the empty folder. Nothing else was touched.';
        say(mount, 'Cleaned up 1 broken link and 1 empty folder.');
      }
    });
    pop.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closePop(); } });
  }
  root.querySelector('[data-see-all]')!.addEventListener('click', event => {
    event.preventDefault();
    const row = root.querySelector<HTMLElement>('[data-panel="p1"] tr.is-fresh:last-child') ?? root.querySelector<HTMLElement>('[data-panel="p1"]')!;
    row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    restart(row, 'is-landed');
  });
  paint();
  const p1 = root.querySelector<HTMLElement>('[data-panel="p1"]')!;
  const p1Slot = (slot: string) => p1.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
  const rowOf = (slot: string) => (slot.startsWith('cell:') || slot.startsWith('row:') ? slot.split(':')[1] : '');
  return {
    paint,
    slot: p1Slot,
    /** Empty the first panel again (after the pop-in ran in reverse). */
    clear() {
      slots.clear(); rowsIn.clear(); cleaned = false;
      root.querySelector('[data-cleanup-text]')!.innerHTML = 'Found a broken link in <code>~/.agents/skills</code> and an empty skill folder in <code>~/.copilot/skills</code>.';
      paint();
    },
    unland(slot: string) {
      slots.delete(slot);
      p1Slot(slot)?.classList.remove('is-in', 'is-landed');
      const name = rowOf(slot);
      if (name && ![...slots].some(s => rowOf(s) === name)) { rowsIn.delete(name); p1.querySelector(`tr[data-row="${name}"]`)?.classList.remove('is-in'); }
    },
    /** A flyer arrived: show its slot and flash it like a highlighter swipe. Duplicates bump the row they merged into. */
    land(slot: string) {
      slots.add(slot);
      const el = p1Slot(slot);
      if (!el) return;
      const name = rowOf(slot);
      if (name) { rowsIn.add(name); p1.querySelector(`tr[data-row="${name}"]`)?.classList.add('is-in'); }
      el.classList.add('is-in');
      restart(el, 'is-landed');
      if (slot.startsWith('row:')) { restart(el.querySelector('b'), 'is-hit'); restart(el.querySelector('small'), 'is-bump'); }
      if (slot.startsWith('cell:')) restart(el.querySelector('.h14-switch'), 'is-hit');
    },
    landAll() {
      targets.forEach(slot => slots.add(slot));
      rows.forEach(row => rowsIn.add(row.name));
      paint();
    },
    add(name: string, rev: number) {
      if (rows.some(row => row.name === name)) return;
      rows.push({ name, caption: `approved rev ${rev}, just now`, rev, cells: { ...off }, fresh: true, pulse: true });
      paint();
      mounts.forEach(mount => say(mount, `Approved rev ${rev} of ${name}. It isn’t installed anywhere yet: flip a switch for Claude Code, Codex, Copilot or my-game.`));
    },
  };
}

// ---------- act 1: the pop-in (H03's "Tidy this up" FLIP, drawn in red pen) ----------

type Pop = ReturnType<typeof bindPopIn>;
function bindPopIn(root: HTMLElement, panels: Panels, ink: Ink) {
  const sheet = root.querySelector<HTMLElement>('.h14-p1')!;
  const doodleEl = sheet.querySelector<HTMLElement>('[data-doodle]')!;
  const win = sheet.querySelector<HTMLElement>('[data-win1]')!;
  const layer = sheet.querySelector<HTMLElement>('[data-flight]')!;
  const button = sheet.querySelector<HTMLButtonElement>('[data-popin]')!;
  const live = sheet.querySelector<HTMLElement>('[data-pop-live]')!;
  // Folder labels first (they become the columns), then the files row by row so the copies of one skill merge in sequence,
  // then the junk, then the scrawled question, which lands on the context line that answers it.
  const rank = (el: HTMLElement) => {
    const to = el.dataset.to!;
    if (to.startsWith('col:')) return 0;
    if (to === 'cleanup') return 20;
    if (to === 'context') return 30;
    return 1 + rows.findIndex(r => r.name === to.split(':')[1]) * 2 + (to.startsWith('row:') ? 1 : 0);
  };
  const flyers = [...sheet.querySelectorAll<HTMLElement>('[data-flyer]')].map((el, n) => ({ el, n })).sort((a, b) => rank(a.el) - rank(b.el) || a.n - b.n).map(item => item.el);
  const tabs = flyers.filter(el => el.dataset.to!.startsWith('col:')).length;
  let busy = false, touched = false;
  const setState = (state: 'mess' | 'tidying' | 'tidy' | 'messing') => {
    sheet.dataset.state = state;
    win.inert = state !== 'tidy';
    button.textContent = state === 'tidy' || state === 'tidying' ? 'Put them back' : 'Pop them into Kiln';
    button.disabled = state === 'tidying' || state === 'messing';
  };
  const aim = (to: string) => { const slot = panels.slot(to)!; return slot.querySelector<HTMLElement>('[data-aim]') ?? slot; };

  // FLIP: First is the file in its folder, Last is its column header, cell or row in the panel. A clone flies in a layer over
  // the sheet; the original stays behind, faded, because Kiln doesn't move your files. Junk crumples into a paper ball.
  function plan(el: HTMLElement) {
    const box = layer.getBoundingClientRect(), rect = el.getBoundingClientRect(), W = el.offsetWidth, H = el.offsetHeight;
    const cx = rect.left + rect.width / 2 - box.left, cy = rect.top + rect.height / 2 - box.top, rotate = Number(el.dataset.r) || 0;
    const to = el.dataset.to!, target = aim(to).getBoundingClientRect();
    const dx = target.left - box.left + target.width / 2 - cx, dy = target.top - box.top + target.height / 2 - cy;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.removeAttribute('data-flyer'); clone.classList.remove('is-read');
    clone.classList.add('h14-flyer');
    Object.assign(clone.style, { left: `${cx - W / 2}px`, top: `${cy - H / 2}px`, width: `${W}px`, height: `${H}px` });
    if (to === 'cleanup') {
      const flat = 'polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)';
      const crushed = 'polygon(10% 14%, 46% 6%, 90% 12%, 82% 48%, 94% 88%, 50% 80%, 8% 92%, 18% 52%)';
      const ball = 'polygon(30% 10%, 50% 30%, 70% 8%, 66% 50%, 74% 92%, 50% 70%, 28% 94%, 34% 50%)';
      const end = Math.max(.14, target.width / W * 1.4);
      clone.classList.add('is-junk');
      return { clone, keyframes: [
        { transform: `translate(0px, 0px) rotate(${rotate}deg) scale(1)`, clipPath: flat, backgroundColor: 'rgba(243, 234, 217, 0)' },
        { transform: `translate(0px, -8px) rotate(${rotate + 14}deg) scale(.78)`, clipPath: crushed, backgroundColor: 'rgba(243, 234, 217, 1)', offset: .22 },
        { transform: `translate(0px, 0px) rotate(${rotate + 70}deg) scale(.42)`, clipPath: ball, backgroundColor: 'rgba(233, 222, 202, 1)', offset: .45 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate + 320}deg) scale(${end})`, clipPath: ball, backgroundColor: 'rgba(233, 222, 202, 1)', opacity: 1, offset: .92 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate + 340}deg) scale(${end})`, clipPath: ball, backgroundColor: 'rgba(233, 222, 202, 1)', opacity: 0 },
      ], duration: 1250, easing: 'cubic-bezier(.45,.05,.4,1)' };
    }
    const sx = target.width / W, sy = target.height / H, mid = Math.min(Math.max(sy * 1.6, .5), 1);
    return { clone, keyframes: [
      { transform: `translate(0px, 0px) rotate(${rotate}deg) scale(1)`, opacity: 1 },
      { transform: `translate(0px, -14px) rotate(${rotate * .4 - 3}deg) scale(1.12)`, opacity: 1, offset: .16 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${mid})`, opacity: 1, offset: .78 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${Math.min(sx, 1)}, ${Math.min(sy, 1)})`, opacity: 0 },
    ], duration: 880, easing: 'cubic-bezier(.55,0,.2,1)' };
  }

  const finish = () => {
    setState('tidy'); busy = false;
    live.textContent = '11 files, 5 rows. The originals stay where they are.';
    ink.reach('popped');
  };
  const instant = () => { flyers.forEach(f => f.classList.add('is-read')); panels.landAll(); finish(); };

  async function tidy() {
    if (busy) return;
    touched = true;
    if (reduced()) { instant(); return; }
    busy = true;
    setState('tidying');
    await wait(320);
    const runs = flyers.map((el, n) => {
      const { clone, keyframes, duration, easing } = plan(el), to = el.dataset.to!;
      layer.append(clone);
      const delay = n < tabs ? n * 90 : tabs * 90 + 160 + (n - tabs) * 115;
      const animation = clone.animate(keyframes, { duration, delay, easing, fill: 'both' });
      setTimeout(() => el.classList.add('is-read'), delay);
      return animation.finished.then(() => { clone.remove(); panels.land(to); });
    });
    await Promise.all(runs);
    finish();
  }

  async function untidy() {
    if (busy) return;
    touched = true;
    sheet.querySelectorAll<HTMLElement>('[data-pop]').forEach(pop => { pop.hidden = true; });
    if (reduced()) { panels.clear(); flyers.forEach(f => f.classList.remove('is-read')); setState('mess'); live.textContent = 'Back in their folders.'; return; }
    busy = true;
    setState('messing');
    const order = [...flyers].reverse();
    const runs = order.map((el, n) => {
      const { clone, keyframes, duration, easing } = plan(el), to = el.dataset.to!;
      layer.append(clone);
      const animation = clone.animate(keyframes, { duration: duration * .7, delay: n * 45, easing, fill: 'both', direction: 'reverse' });
      setTimeout(() => panels.unland(to), n * 45);
      return animation.finished.then(() => { el.classList.remove('is-read'); clone.remove(); });
    });
    await Promise.all(runs);
    panels.clear();
    setState('mess'); busy = false;
    live.textContent = 'Back in their folders. Pop them in again whenever you like.';
  }

  button.addEventListener('click', () => (sheet.dataset.state === 'tidy' ? untidy() : tidy()));
  setState('mess');
  return {
    /** Act 2's approve needs the first panel filled; fill it at once if nobody has popped it yet. */
    tidyNow() { if (sheet.dataset.state === 'mess' && !busy) { touched = true; instant(); } },
    start() {
      // The doodle draws itself on load; the files pop into Kiln once the panel is mostly in view.
      const drawn = () => { doodleEl.classList.add('is-drawn'); ink.reach('drawn'); };
      if (auto) { drawn(); instant(); return; }
      requestAnimationFrame(() => requestAnimationFrame(drawn));
      if (reduced()) { instant(); return; }
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        document.fonts.ready.then(() => setTimeout(() => { if (!touched) tidy(); }, 1100));
      }, { threshold: .7 });
      observer.observe(win);
    },
  };
}

// ---------- act 2: capture, test, approve ----------

function bindActTwo(root: HTMLElement, page: HTMLElement, panels: Panels, popIn: Pop, ink: Ink) {
  const sheet = root.querySelector<HTMLElement>('.h14-p2')!;
  const cap = sheet.querySelector<HTMLElement>('[data-cap]')!;
  const capZone = sheet.querySelector<HTMLElement>('[data-zone="capture"]')!;
  const testZone = sheet.querySelector<HTMLElement>('[data-zone="test"]')!;
  const testBody = sheet.querySelector<HTMLElement>('[data-testbody]')!;
  const live = sheet.querySelector<HTMLElement>('[data-live]')!;
  const revLabel = sheet.querySelector<HTMLElement>('[data-rev]')!;
  const repo = sheet.querySelector<HTMLSelectElement>('[data-repo]')!;
  const agent = sheet.querySelector<HTMLSelectElement>('[data-agent]')!;
  const landing = sheet.querySelector<HTMLElement>('[data-landing]')!;
  let pack: Pack | null = null, rev = 1, phase: 'empty' | 'ready' | 'running' | 'uncertain' | 'passed' | 'approved' = 'empty', analysing = false;
  const approved = new Set<string>();

  const idleCapture = () => `<div class="h14-drop" data-capdrop>
    <span class="h14-drop-icon">${icon(icons.capture, 22)}</span>
    <p><b>Drop a video, a post, a repo or a screenshot</b><span>Kiln analyzes it and adds what it finds to a collection linked to the source.</span></p>
    <div class="h14-drop-actions"><span class="h14-fake-input">Paste a link or some text…</span><span class="h14-fakebtn">Save only</span><span class="h14-fakebtn h14-fakebtn-ink">Analyze and add</span></div>
    <small>From anywhere: <kbd>Ctrl+Shift+Space</kbd></small>
  </div>`;
  const idleTest = () => `<div class="h14-drop h14-drop-test${pack?.run ? ' is-ready' : ''}">${icon(icons.tests, 22)}<p><b>${pack?.run ? 'Drag the prompt here' : pack ? 'Drafts from a repo are tested one at a time' : 'Nothing to test yet'}</b><span>${pack?.run ? `It runs that exact revision on <code>${repo.value}</code>, read-only. On this page it replays a sample run.` : pack ? 'Open a draft in the app to test it. Here, the video and the post come with a sample run.' : 'Capture a source first. Nothing in your code changes.'}</span></p></div>`;
  cap.innerHTML = idleCapture();
  testBody.innerHTML = idleTest();

  const logLine = ([kind, text]: [string, string]) => `<li class="h14-step-${kind}">${icon(icons[kind as 'read' | 'cmd' | 'think'], 14)}<span>${text}</span></li>`;
  const kindClass = (kind: string) => kind.toLowerCase().replace(/\s+/g, '-');

  function collection(p: Pack) {
    const promptText = p.star.kind === 'Prompt' && rev > 1 && p.run?.edit ? p.star.text.replace(p.run.edit.del, `<mark>${p.run.edit.add}</mark>`) : p.star.text;
    const testable = p.star.kind === 'Prompt';
    return `<div class="h14-coll">
      <p class="h14-coll-head"><b>${p.key === 'yt' ? 'Fresh eyes' : p.key === 'x' ? 'Agent workflows' : 'mattpocock/skills'}</b><span>Collection, linked to ${p.key === 'yt' ? 'the video' : p.key === 'x' ? 'the post' : 'the repository'}</span></p>
      <article class="h14-star${testable ? '' : ' is-repo'}" data-star${testable ? ' data-drag="prompt"' : ''} aria-label="${p.star.kind}: ${p.star.title}${testable ? '. Drag it into the test run.' : ''}">
        <header>${testable ? `<span class="h14-grip" aria-hidden="true">${icon('M7 5h.01M13 5h.01M7 10h.01M13 10h.01M7 15h.01M13 15h.01', 15)}</span>` : ''}<i class="h14-kind h14-kind-${kindClass(p.star.kind)}">${testable ? icon(icons.star, 12) : ''}${p.star.kind}</i><span class="h14-rev">${testable ? `rev ${rev}` : 'drafts'}</span></header>
        <h3>${p.star.title}</h3>
        <p class="h14-star-text">${promptText}</p>
        <footer>${p.star.from ? `<a href="#h14-p2" class="h14-ts" data-ts>${icon(icons.play, 11)}from ${p.star.from}</a>` : `<span class="h14-ts-plain">${p.key === 'x' ? 'from the post' : 'from the repository'}</span>`}${testable ? `<button type="button" class="h14-btn h14-btn-sm" data-test-it${phase === 'running' ? ' disabled' : ''}>Test on my repo</button>` : ''}</footer>
      </article>
      <ul class="h14-cards">${p.cards.map((c, i) => `<li style="--i:${i}"><i class="h14-kind">${c.kind}</i><b>${c.title}</b>${c.from ? `<span class="h14-ts-small">from ${c.from}</span>` : ''}</li>`).join('')}</ul>
    </div>`;
  }

  function bindStar() {
    const star = cap.querySelector<HTMLElement>('[data-drag="prompt"]');
    if (!star) return;
    draggable(star, { host: page, zones: () => [testZone], enabled: () => phase !== 'running' && phase !== 'approved', onDrop: () => startTest() });
    cap.querySelector<HTMLButtonElement>('[data-test-it]')?.addEventListener('click', () => {
      if (phase === 'running' || phase === 'approved') return;
      flyInto(star, testZone, page).then(() => startTest());
    });
  }

  async function capture(key: Pack['key']) {
    if (analysing || phase === 'running') return;
    analysing = true;
    pack = packs[key]; rev = 1; phase = 'empty';
    sheet.querySelectorAll<HTMLElement>('.h14-src').forEach(src => src.classList.toggle('is-used', src.dataset.src === key || src.classList.contains('is-used')));
    capZone.classList.add('is-busy');
    cap.innerHTML = `<div class="h14-analysing">
      <div class="h14-chip h14-chip-${key}"><span class="h14-chip-icon" aria-hidden="true"></span><div><b>${pack.chip}</b><small>${pack.chipMeta}</small></div></div>
      <p class="h14-analyze"><span class="h14-spin" aria-hidden="true"></span>Analyze and add: ${key === 'yt' ? 'reading the captions of an 18-minute video' : key === 'x' ? 'reading the post' : 'importing the skills in skills/ as drafts'}…</p>
      <span class="h14-progress"><i></i></span></div>`;
    testBody.innerHTML = idleTest(); testZone.classList.remove('is-loaded');
    revLabel.textContent = 'no prompt yet'; live.textContent = 'idle'; live.className = 'h14-live';
    await wait(auto ? 0 : 1300);
    capZone.classList.remove('is-busy');
    cap.innerHTML = `<p class="h14-found"><span class="h14-ok" aria-hidden="true">${icon(icons.check, 13)}</span>${pack.found}</p>${collection(pack)}`;
    cap.querySelector('.h14-coll')!.classList.add('is-new');
    bindStar();
    analysing = false;
    phase = 'ready';
    testBody.innerHTML = idleTest();
    ink.reach('captured');
    ink.reach(key === 'gh' ? 'captured-gh' : 'captured-prompt');
    ink.refresh();
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  async function runLines(lines: [string, string][], total: number, base: { t: number; i: number; c: number; o: number }) {
    const log = testBody.querySelector<HTMLElement>('[data-tlog]')!, elapsed = testBody.querySelector<HTMLElement>('[data-elapsed]')!, tokens = testBody.querySelector<HTMLElement>('[data-tokens]')!;
    for (let i = 0; i < lines.length; i++) {
      await wait(auto ? 0 : 640);
      log.insertAdjacentHTML('beforeend', logLine(lines[i]));
      const k = (i + 1) / lines.length;
      elapsed.textContent = fmt(base.t + total * k);
      tokens.textContent = `${(base.i + 38.4 * k).toFixed(1)}k in · ${(base.c + 26.1 * k).toFixed(1)}k cached · ${(base.o + 1.9 * k).toFixed(1)}k out`;
      ink.refresh();
    }
  }
  const finished = (seconds: number) => {
    testBody.querySelector<HTMLElement>('[data-runmeta]')!.innerHTML = `<span class="h14-ok" aria-hidden="true">${icon(icons.check, 13)}</span><span>Finished in ${fmt(seconds)}. Nothing in <code>${repo.value}</code> changed.</span>`;
  };

  async function startTest() {
    if (!pack?.run || phase === 'running' || phase === 'approved') return;
    const p = pack, run = p.run!;
    phase = 'running';
    cap.querySelectorAll<HTMLButtonElement>('[data-test-it]').forEach(b => { b.disabled = true; });
    cap.querySelector('[data-star]')?.classList.add('is-testing');
    testZone.classList.add('is-loaded');
    revLabel.textContent = `rev ${rev}`;
    live.textContent = 'running'; live.className = 'h14-live is-running';
    testBody.innerHTML = `<div class="h14-run-top"><b>${p.star.title}</b><span class="h14-rev">rev ${rev}</span></div>
      <p class="h14-run-meta" data-runmeta><span class="h14-spin" aria-hidden="true"></span><span>Running on <code>${repo.value}</code> through ${agent.value}, read-only</span></p>
      <div class="h14-meter" data-meter><span><b data-elapsed>0:00</b> elapsed</span><span data-tokens>0.0k in · 0.0k cached · 0.0k out</span><em>sample</em></div>
      <ol class="h14-log" data-tlog></ol><div class="h14-verdict-wrap" data-verdict aria-live="polite"></div>`;
    ink.reach('ran');
    await runLines(rev > 1 && run.again ? run.again : run.lines, 178, { t: 0, i: 0, c: 0, o: 0 });
    await wait(auto ? 0 : 420);
    finished(178);
    cap.querySelector('[data-star]')?.classList.remove('is-testing');
    const verdict = testBody.querySelector<HTMLElement>('[data-verdict]')!;
    if (run.verdict === 'uncertain' && rev === 1 && run.edit) {
      phase = 'uncertain'; live.textContent = 'uncertain'; live.className = 'h14-live is-unsure';
      verdict.innerHTML = `<div class="h14-verdict h14-verdict-unsure"><b>Uncertain</b><span>The agent’s own assessment. ${run.text}</span></div>
        <div class="h14-edit" data-edit><p class="h14-edit-head">Change one line, then run it again on the same repo</p>
        ${editor(`prompt · ${p.star.title}`, 'rev 1 → rev 2', 2, run.edit.del, run.edit.add)}
        <button type="button" class="h14-btn h14-btn-ink" data-rerun>Save as rev 2 and run it</button></div>`;
      ink.reach('uncertain');
      verdict.querySelector<HTMLButtonElement>('[data-rerun]')!.addEventListener('click', rerun);
      if (!auto) verdict.querySelector<HTMLButtonElement>('[data-rerun]')!.focus({ preventScroll: true });
    } else pass(verdict, run.verdict === 'pass' ? run.text : run.passText!);
    cap.querySelectorAll<HTMLButtonElement>('[data-test-it]').forEach(b => { b.disabled = false; });
  }

  async function rerun() {
    if (!pack?.run?.again || phase !== 'uncertain') return;
    const run = pack.run;
    rev = 2; phase = 'running';
    cap.querySelector('.h14-coll')!.outerHTML = collection(pack); bindStar();
    const star = cap.querySelector<HTMLElement>('[data-star]')!;
    star.classList.add('is-testing');
    restart(star.querySelector('mark'), 'is-new');
    cap.querySelector<HTMLButtonElement>('[data-test-it]')!.disabled = true;
    revLabel.textContent = 'rev 2';
    live.textContent = 'running'; live.className = 'h14-live is-running';
    testBody.querySelector('.h14-run-top .h14-rev')!.textContent = 'rev 2';
    testBody.querySelector('[data-runmeta]')!.innerHTML = `<span class="h14-spin" aria-hidden="true"></span><span>Running rev 2 on <code>${repo.value}</code>, read-only</span>`;
    const verdict = testBody.querySelector<HTMLElement>('[data-verdict]')!;
    verdict.innerHTML = '';
    testBody.querySelector('[data-tlog]')!.insertAdjacentHTML('beforeend', `<li class="h14-log-sep">${icon('M4 10a6 6 0 1 0 2-4.5M4 3.5V6h2.5', 14)}<span>rev 2, same repo</span></li>`);
    ink.refresh();
    await runLines(run.again!, 101, { t: 178, i: 38.4, c: 26.1, o: 1.9 });
    await wait(auto ? 0 : 420);
    finished(279);
    star.classList.remove('is-testing');
    pass(verdict, run.passText!);
    cap.querySelector<HTMLButtonElement>('[data-test-it]')!.disabled = false;
  }

  function pass(verdict: HTMLElement, text: string) {
    const p = pack!;
    phase = 'passed'; live.textContent = 'pass'; live.className = 'h14-live is-pass';
    const already = approved.has(p.skill!);
    verdict.innerHTML = `<div class="h14-verdict h14-verdict-pass"><b>Pass</b><span>The agent’s assessment. ${text}</span></div>
      <div class="h14-yours" data-yours><p><b>Your call.</b> Approving pins rev ${rev} and publishes it to your Kiln repo. Nothing becomes a skill until you do.</p>
      <div class="h14-row-actions"><button type="button" class="h14-btn h14-btn-ink" data-approve${already ? ' disabled' : ''}>${already ? `Approved as ${p.skill}` : `Approve rev ${rev} as a skill`}</button><button type="button" class="h14-btn h14-btn-ghost" data-notyet${already ? ' hidden' : ''}>Not yet</button></div></div>`;
    ink.reach('passed');
    const approve = verdict.querySelector<HTMLButtonElement>('[data-approve]')!;
    approve.addEventListener('click', () => doApprove(approve));
    verdict.querySelector('[data-notyet]')!.addEventListener('click', event => {
      (event.currentTarget as HTMLElement).closest('.h14-yours')!.querySelector('p')!.innerHTML = '<b>Kept as a prompt.</b> Nothing was installed. Run it again whenever you like.';
    });
    if (!auto && !already) approve.focus({ preventScroll: true });
  }

  async function doApprove(button: HTMLButtonElement) {
    const p = pack!;
    if (!p.skill || approved.has(p.skill)) return;
    approved.add(p.skill);
    phase = 'approved';
    popIn.tidyNow();
    button.disabled = true; button.textContent = `Approved as ${p.skill}`;
    button.parentElement!.querySelector('[data-notyet]')?.setAttribute('hidden', '');
    button.closest('.h14-yours')!.querySelector('p')!.innerHTML = `<b>Approved rev ${rev}.</b> Pinned and published to <code>you/my-kiln</code> on GitHub (sample). Editing it later makes a new draft.`;
    const firstReveal = landing.hidden;
    landing.hidden = false;
    panels.add(p.skill, rev);
    ink.reach('approved');
    const row = landing.querySelector<HTMLElement>(`tr[data-row="${p.skill}"]`)!;
    if (firstReveal && !reduced()) landing.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.9,.3,1)' });
    const r = row.getBoundingClientRect();
    if (r.bottom > innerHeight - 40 || r.top < 0) { row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); await wait(auto ? 0 : 560); }
    // The prompt's title flies into the new row: the prompt becomes the skill.
    const title = cap.querySelector<HTMLElement>('.h14-star h3');
    if (title && !reduced() && !auto) {
      const from = title.getBoundingClientRect(), to = row.querySelector('th b')!.getBoundingClientRect();
      const chip = document.createElement('span');
      chip.className = 'h14-chip-fly'; chip.textContent = p.skill; chip.setAttribute('aria-hidden', 'true');
      page.append(chip);
      const W = chip.offsetWidth, H = chip.offsetHeight;
      const fx = from.left + Math.min(from.width, 200) / 2 - W / 2, fy = from.top + from.height / 2 - H / 2;
      Object.assign(chip.style, { left: `${fx}px`, top: `${fy}px` });
      const dx = to.left + to.width / 2 - W / 2 - fx, dy = to.top + to.height / 2 - H / 2 - fy;
      row.classList.add('is-waiting');
      await chip.animate([
        { transform: 'translate(0px, 0px) rotate(-4deg) scale(.6)', opacity: 0 },
        { transform: 'translate(0px, -16px) rotate(-3deg) scale(1.08)', opacity: 1, offset: .18 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(.9)`, opacity: 1, offset: .82 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${to.width / W}, ${to.height / H})`, opacity: 0 },
      ], { duration: 900, easing: 'cubic-bezier(.55,0,.2,1)', fill: 'forwards' }).finished;
      chip.remove(); row.classList.remove('is-waiting');
    }
    root.querySelectorAll<HTMLElement>(`tr[data-row="${p.skill}"]`).forEach(tr => restart(tr, 'is-landed'));
    if (!auto) landing.querySelector<HTMLElement>(`tr[data-row="${p.skill}"] .h14-switch`)?.focus({ preventScroll: true });
    ink.refresh();
  }

  const lock = () => analysing || phase === 'running';
  sheet.querySelectorAll<HTMLElement>('.h14-src [data-drag]').forEach(el => {
    const key = el.dataset.drag as Pack['key'];
    draggable(el, { host: page, zones: () => [capZone], enabled: () => !lock(), onDrop: () => capture(key) });
  });
  sheet.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => button.addEventListener('click', () => {
    if (lock()) return;
    const key = button.dataset.add as Pack['key'];
    flyInto(sheet.querySelector<HTMLElement>(`[data-drag="${key}"]`)!, capZone, page).then(() => capture(key));
  }));
  [repo, agent].forEach(select => select.addEventListener('change', () => { if (phase === 'ready' || phase === 'empty') testBody.innerHTML = idleTest(); }));
  sheet.addEventListener('click', event => { if ((event.target as Element).closest('[data-ts]')) event.preventDefault(); });
}
