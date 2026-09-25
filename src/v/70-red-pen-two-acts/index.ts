// PROTOTYPE round 5, H05 — Red-pen review. A founder's printout, marked up in red pen and highlighter.
// Act 1: the skill folders, doodled in red pen, pop out into a crisp Kiln panel (duplicates merge, the dead link crumples).
// Act 2: "how do I add new skills?" — drag a clipped source into Capture, drag the prompt into Test, approve, and it lands on the panel.
import './style.css';
import { examples, installer } from '../../content';
import { cross, folder, line, reseed } from '../r3-kit/rough';
import { createInk, type Ink, type InkMark, type InkNote } from './ink';
import { draggable, flyInto } from './drag';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const auto = navigator.webdriver;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const icon = (d: string) => `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rail = ['M4 3.5v13M8 3.5v13M11.5 4.2l3.8 12', 'M10 3v9M6.5 8.5 10 12l3.5-3.5M4 15.5h12', 'M8 3h4M8.8 3v5L4.5 15.2a1.3 1.3 0 0 0 1.1 1.8h8.8a1.3 1.3 0 0 0 1.1-1.8L11.2 8V3M6.5 12h7', 'M3 6.5h8M3 13.5h5M14 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16 6.5h1M14 13.5h3', 'M5 2.8h6.5L15 6.3v10.9H5zM11.5 2.8v3.5H15M7.5 10h5M7.5 13h3.5'];
const titlebar = (where: string) => `<div class="h5-titlebar">
  <span class="h5-app"><i class="h5-logo"></i>Kiln<span>${where}</span></span>
  <span class="h5-search-all">Search everything<kbd>Ctrl+Shift+Space</kbd></span>
  <span class="h5-git">my-kiln · main · <b>synced</b></span>
  <span class="h5-winctl" aria-hidden="true"><i>&#x2013;</i><i>&#x25A1;</i><i>&#x2715;</i></span>
</div>`;
const note = (id: string, text: string, rot = 0, extra = '') => `<p class="h5-note${extra}" data-note="${id}" style="--r:${rot}deg" hidden>${text}</p>`;

// ---------- sample data: the panel ----------

type Cell = 'on' | 'off' | 'edited' | 'found';
type Col = 'claude' | 'shared' | 'codex' | 'copilot' | 'project';
type Drift = { why: string; del: string; add: string };
type Row = { name: string; caption: string; rev: number; cells: Record<Col, Cell>; drift?: Partial<Record<Col, Drift>>; fresh?: boolean };
const columns: { key: Col; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/<wbr>skills' },
  { key: 'shared', name: 'Shared (Codex, Copilot and others)', short: 'Shared', path: '~/.agents/<wbr>skills' },
  { key: 'codex', name: 'Codex only', short: 'Codex', path: '~/.codex/<wbr>skills' },
  { key: 'copilot', name: 'Copilot only', short: 'Copilot', path: '~/.copilot/<wbr>skills' },
  { key: 'project', name: 'my-game project', short: 'my-game', path: '.github/<wbr>skills' },
];
const plain = (html: string) => html.replace(/<wbr>/g, '');
const off: Record<Col, Cell> = { claude: 'off', shared: 'off', codex: 'off', copilot: 'off', project: 'off' };
const rows: Row[] = [
  { name: 'code-review', caption: '3 copies, 1 duplicate flagged', rev: 3, cells: { ...off, claude: 'on', shared: 'on', project: 'edited' },
    drift: { project: { why: 'Someone edited this copy by hand.', del: '- Review standards and the specification separately.', add: '+ Review the specification only. FINAL.' } } },
  { name: 'research', caption: '2 copies, 1 older', rev: 2, cells: { ...off, claude: 'on', shared: 'edited' },
    drift: { shared: { why: 'This copy is still revision 1.', del: '- Cite sources with links and dates.', add: '+ Cite sources.' } } },
  { name: 'writing-for-agents', caption: 'approved rev 1', rev: 1, cells: { ...off, claude: 'on' } },
  { name: 'playtest-brief', caption: 'approved rev 4', rev: 4, cells: { ...off, project: 'on' } },
  { name: 'pr-summary', caption: 'not in your library', rev: 0, cells: { ...off, codex: 'found' } },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'changed outside Kiln', found: 'found outside your library' };

// ---------- sample data: the doodled folders ----------

type DFile = { text: string; to: string; remark?: string; broken?: boolean };
type DFolder = { path: string; who: string; rot: number; files: DFile[] };
const folders: DFolder[][] = [[
  { path: '~/.claude/skills', who: 'Claude Code', rot: -1.2, files: [{ text: 'code-review', to: 'row-code-review' }, { text: 'code-review (1)', to: 'row-code-review', remark: 'dupe??' }, { text: 'research', to: 'row-research' }, { text: 'writing-for-agents', to: 'row-writing-for-agents' }] },
  { path: '~/.codex/skills', who: 'Codex', rot: .9, files: [{ text: 'pr-summary', to: 'row-pr-summary', remark: 'forgot I had this' }] },
  { path: 'my-game/.github/skills', who: 'this project', rot: -.5, files: [{ text: 'code-review', to: 'row-code-review', remark: 'final-final' }, { text: 'playtest-brief', to: 'row-playtest-brief' }] },
], [
  { path: '~/.agents/skills', who: 'Codex, Copilot & co.', rot: 1.3, files: [{ text: 'code-review', to: 'row-code-review' }, { text: 'research', to: 'row-research', remark: 'older one?' }, { text: 'old-link', to: 'cleanup', broken: true, remark: 'dead link' }] },
  { path: '~/.copilot/skills', who: 'Copilot', rot: -1.5, files: [{ text: 'untitled-skill/', to: 'cleanup', remark: '(empty)' }] },
]];

// ---------- sample data: the sources and what Kiln pulls out of them ----------

type Card = { kind: string; title: string; from?: string };
type Run = { lines: [string, string][]; verdict: 'pass' | 'uncertain'; text: string; edit?: { del: string; add: string }; again?: [string, string][]; passText?: string };
type Pack = { key: 'yt' | 'x' | 'gh'; label: string; star: { kind: string; title: string; text: string; from?: string }; cards: Card[]; skill?: string; run?: Run };
const packs: Record<Pack['key'], Pack> = {
  yt: {
    key: 'yt', label: 'YouTube: I let a seven-year-old test my app',
    star: { kind: 'Prompt', title: examples[0].title, text: examples[0].prompt, from: '04:12' },
    cards: [{ kind: 'Technique', title: 'Test as someone who won’t read the manual', from: '07:30' }, { kind: 'Insight', title: 'You stop seeing the confusing bits of your own app', from: '11:05' }, { kind: 'Tool', title: 'A screen recorder, to replay the session', from: '15:48' }],
    skill: 'fresh-eyes',
    run: {
      lines: [['read', 'Read README.md and package.json'], ['read', 'Opened src/screens/Start.tsx'], ['cmd', 'rg -l "signup" src/'], ['think', 'Start screen wants a parent account first']],
      verdict: 'uncertain', text: 'Couldn’t get past the parent signup, so it never reached an activity. Marked uncertain instead of guessing.',
      edit: { del: 'Skip the parent-only signup.', add: 'Skip the parent-only signup. If it blocks you, use the demo profile in README.md.' },
      again: [['read', 'README.md: found the demo profile'], ['read', 'Walked Levels, Shop and Settings'], ['think', 'First obstacle: Play is an icon with no label']],
      passText: 'First obstacle: the Play button is an icon with no label. Suggested fix: put the word “Play” under it. No files changed.',
    },
  },
  x: {
    key: 'x', label: 'Post on X by @nadiabuilds',
    star: { kind: 'Prompt', title: examples[1].title, text: examples[1].prompt },
    cards: [{ kind: 'Technique', title: 'Fix the instruction, not the output' }, { kind: 'Insight', title: 'Old AGENTS.md rules outlive their reasons' }, { kind: 'Tool', title: 'AGENTS.md and CLAUDE.md' }],
    skill: 'trace-the-instruction',
    run: {
      lines: [['read', 'Read AGENTS.md and CLAUDE.md'], ['cmd', 'git log -5 -- AGENTS.md'], ['read', 'Opened src/save/slots.ts'], ['think', '“Always add a migration” predates the new save format']],
      verdict: 'pass', text: 'Traced it to AGENTS.md, line 14: an outdated rule about migrations. Proposed a one-line change. No files changed.',
    },
  },
  gh: {
    key: 'gh', label: 'GitHub: mattpocock/skills',
    star: { kind: 'Skills repository', title: 'mattpocock/skills', text: 'The skills in <code>skills/</code> come in as drafts for review. The repository stays where it is, and nothing is installed until you approve a revision.' },
    cards: [{ kind: 'Source note', title: 'README.md, kept with the drafts' }, { kind: 'Resource', title: 'A link back to the repository' }],
  },
};

// ---------- the red pen ----------

const p1Notes: InkNote[] = [
  { id: 'n-merge', when: 'popped', reserve: true, target: '[data-slot="row-code-review"] small', mark: 'underline', side: 'above', ref: '[data-win1]', dx: -40, w: 250, bend: 1 },
  { id: 'n-flip', when: 'popped', reserve: true, target: '[data-slot="col-codex"]', mark: 'none', side: 'above', ref: '[data-win1]', dx: 40, w: 260, noArrow: true },
  { id: 'n-amber', when: 'popped', reserve: true, target: '[data-slot="row-code-review"] td[data-col="project"] .h5-switch', mark: 'circle', side: 'right', w: 176 },
  { id: 'n-found', when: 'popped', reserve: true, target: '[data-slot="row-pr-summary"] td[data-col="codex"] .h5-switch', mark: 'circle', side: 'right', w: 176, bend: -1 },
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
  { id: 'm-yt', when: 'p2', target: '[data-src="yt"] .h5-clip', mark: 'loop', pad: 2 },
  { id: 'm-x', when: 'p2', target: '[data-src="x"] .h5-clip', mark: 'loop', pad: 2 },
  { id: 'm-gh', when: 'p2', target: '[data-src="gh"] .h5-clip', mark: 'loop', pad: 2 },
];

// ---------- markup: hero and act 1 ----------

function doodle() {
  const file = (f: DFile) => `<li><span class="h5-file${f.broken ? ' is-broken' : ''}" data-file data-to="${f.to}">${f.text}</span>${f.remark ? `<em>${f.remark}</em>` : ''}</li>`;
  const box = (d: DFolder) => `<div class="h5-fold" style="--rot:${d.rot}deg"><svg class="h5-fold-art" aria-hidden="true"></svg>
    <p class="h5-fold-path">${d.path} <span>${d.who}</span></p><ul>${d.files.map(file).join('')}</ul></div>`;
  return `<figure class="h5-doodle" data-doodle role="img" aria-label="A red-pen doodle of five skill folders: ~/.claude/skills with code-review, a duplicate code-review (1), research and writing-for-agents; ~/.agents/skills with another code-review, an older research and a dead link; ~/.codex/skills with a forgotten pr-summary; an empty skill in ~/.copilot/skills; and my-game/.github/skills with a hand-edited code-review and playtest-brief.">
    <div class="h5-doodle-cols">${folders.map(col => `<div class="h5-doodle-col">${col.map(box).join('')}${col.length === 2 ? '<p class="h5-scrawl-q">which one is<br>Claude reading??</p>' : ''}</div>`).join('')}</div>
    <div class="h5-fly" data-fly aria-hidden="true"></div>
  </figure>`;
}

function panelMarkup(scope: 'p1' | 'p2') {
  return `<section class="h5-pane h5-panel" data-panel="${scope}" aria-label="Skills panel, sample library">
    <header class="h5-pane-head"><b>Skills</b><span>${scope === 'p1' ? 'one row per skill, one switch per place your agents look' : 'just approved'}</span>${scope === 'p1' ? '<span class="h5-tabs"><i class="is-on">Installed</i><i>Receipts</i></span>' : '<a class="h5-mini-link" href="#h5-p1" data-see-all>See it with the others</a>'}</header>
    <div class="h5-table-wrap">
      <table><thead><tr><th scope="col">Skill</th>${columns.map(c => `<th scope="col" data-slot="col-${c.key}" title="${c.name}"><span>${c.short}</span><code>${c.path}</code></th>`).join('')}</tr></thead><tbody data-rows></tbody></table>
      ${scope === 'p1' ? '<p class="h5-waiting" data-waiting>Kiln hasn’t read your folders yet.</p>' : ''}
    </div>
    ${scope === 'p1' ? `<div class="h5-cleanup" data-slot="cleanup"><p data-cleanup-text>Found a broken link in <code>~/.agents/skills</code> and an empty skill folder in <code>~/.copilot/skills</code>.</p><button type="button" class="h5-btn h5-btn-quiet" data-cleanup>Clean up safely</button></div>
    <ul class="h5-key" aria-label="What the switches mean"><li><i class="h5-sw h5-sw-on"></i>installed</li><li><i class="h5-sw h5-sw-edited"></i>changed outside Kiln</li><li><i class="h5-sw h5-sw-found"></i>found outside the library</li><li><i class="h5-sw h5-sw-off"></i>off</li></ul>` : ''}
    <footer class="h5-panel-foot"><p class="h5-context" data-context-wrap><span class="h5-hl" data-hl="n-context" data-context></span></p><p class="h5-status" data-status aria-live="polite"></p></footer>
    <div class="h5-pop" data-pop hidden role="dialog" aria-modal="false" aria-label="Skill copy"></div>
  </section>`;
}

function actOne() {
  return `<section class="h5-sheet h5-p1" id="h5-p1" aria-labelledby="h5-p1-title">
    <i class="h5-crop h5-crop-tl"></i><i class="h5-crop h5-crop-tr"></i><i class="h5-crop h5-crop-bl"></i><i class="h5-crop h5-crop-br"></i>
    <div class="h5-p1-grid">
      <div class="h5-p1-mess">
      <header class="h5-sheet-head">
      <h2 id="h5-p1-title">Here’s what was actually in my skill folders.</h2>
      <p>Five folders, three agents, one skill in three places. Kiln reads them all: one row per skill, one switch per place an agent looks.</p>
    </header>
      ${doodle()}
        <p class="h5-pop-row"><button type="button" class="h5-btn h5-btn-big" data-popin>Pop them into Kiln</button><span class="h5-pop-live" data-pop-live aria-live="polite"></span></p>
      </div>
      <div class="h5-notes">${note('n-merge', '3 folders, <b>1 row</b>. the “(1)” copy gets flagged as a duplicate.', -2)}${note('n-amber', 'amber = changed outside Kiln. hand-edited, or just old. it shows me the diff first.', 2)}${note('n-flip', 'p.s. the switches are real. flip one.', -1.5)}</div>
      <div class="h5-window h5-win1" data-win1>${titlebar('')}${panelMarkup('p1')}</div>
      <div class="h5-notes">${note('n-context', 'every description here rides along on <b>every turn</b>, used or not. switch it off and it’s out of context.', -1)}${note('n-clean', 'dead link + empty folder: flagged, cleaned up safely. nothing else touched.', 1.5)}${note('n-found', 'the one I forgot I had. import it, or bin it.', -2)}</div>
      <div class="h5-margin" data-margin aria-hidden="true"></div>
    </div>
    <svg class="h5-ink" data-ink aria-hidden="true"></svg>
  </section>`;
}

// ---------- markup: act 2 ----------

function sources() {
  const yt = `<div class="h5-clip h5-yt"><div class="h5-yt-thumb"><b>I let a 7&#8209;year&#8209;old<br>test my app</b><i class="h5-yt-play"></i><span class="h5-yt-time">18:24</span><span class="h5-yt-bar"><i></i></span></div>
    <div class="h5-yt-meta"><i class="h5-avatar h5-avatar-yt">P</i><p><b>I let a seven-year-old test my app (with an agent)</b><small>Pixel &amp; Pine · 3 weeks ago</small></p></div></div>`;
  const x = `<div class="h5-clip h5-x"><header><i class="h5-avatar">NB</i><p><b>Nadia Brooks</b><small>@nadiabuilds · 2h</small></p><span class="h5-x-mark" aria-hidden="true">X</span></header>
    <p class="h5-x-text">Agent did exactly what you didn’t mean? Don’t fix the output. Ask it which instruction made it do that, then fix the instruction.</p>
    <footer aria-hidden="true"><span>&#x1F5E8;&#xFE0E;</span><span>&#x21BB;</span><span>&#x2661;</span><span>&#x2197;</span></footer></div>`;
  const gh = `<div class="h5-clip h5-gh"><header><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.07 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8Z"/></svg><p><span>mattpocock</span> / <b>skills</b></p><em>Public</em></header>
    <div class="h5-gh-bar"><span>main</span><b>Code &#x25BE;</b></div>
    <ul><li class="is-dir">skills/</li><li>README.md</li><li>LICENSE</li></ul></div>`;
  const item = (key: Pack['key'], clip: string, caption: string, rot: number) => `<div class="h5-src" data-src="${key}" style="--rot:${rot}deg">
    <div class="h5-src-drag" data-drag="${key}" aria-label="${packs[key].label}. Drag it into Kiln’s capture area." role="group"><i class="h5-tape" aria-hidden="true"></i>${clip}</div>
    <p class="h5-src-foot"><span>${caption}</span><button type="button" class="h5-btn h5-btn-quiet h5-btn-sm" data-add="${key}">Add to Kiln</button></p>
  </div>`;
  return `<div class="h5-sources" aria-label="Where good ideas come from">
    ${item('yt', yt, 'watched it twice. tried it never.', -1.4)}
    ${item('x', x, 'saved. obviously never tried.', 1.2)}
    ${item('gh', gh, 'a whole repo of them.', -.8)}
  </div>`;
}

function actTwo() {
  const repos = ['~/code/my-game', '~/code/recipe-box', 'Isolated example'];
  return `<section class="h5-sheet h5-p2" id="h5-p2" aria-labelledby="h5-p2-title">
    <i class="h5-crop h5-crop-tl"></i><i class="h5-crop h5-crop-tr"></i><i class="h5-crop h5-crop-bl"></i><i class="h5-crop h5-crop-br"></i>
    <header class="h5-sheet-head">
      <h2 id="h5-p2-title">Then: how do I add new skills to this?</h2>
      <p>I’d find a great prompt in a video, save it, and never try it. Now I drag it into Kiln, test it on a repo, and keep it only if it works.</p>
    </header>
    <div class="h5-p2-grid">
      ${sources()}
      <div class="h5-window h5-win2" data-win2>
        ${titlebar('')}
        <div class="h5-p2-body">
          <nav class="h5-rail" aria-label="Sample app sections">${rail.map((d, i) => `<span class="${i === 1 ? 'is-lit' : ''}">${icon(d)}</span>`).join('')}</nav>
          <div class="h5-notes">${note('n-drag', 'drag one in here. <small>(no mouse? tab to <b>Add to Kiln</b>.)</small>', -1.5)}${note('n-star', 'the prompt is the star. techniques, insights and tools come along, <b>with timestamps</b>.', -1.5)}${note('n-gh', 'a repo comes in as drafts. nothing installs until I approve one.', -1.5)}</div>
          <section class="h5-pane h5-capture" data-zone="capture" aria-labelledby="h5-cap-title">
            <header class="h5-pane-head"><b id="h5-cap-title">Capture</b><span>Analyze and add</span><kbd>Ctrl+Shift+Space</kbd></header>
            <div class="h5-cap-body" data-cap></div>
          </section>
          <div class="h5-notes">${note('n-ro', 'read-only. it can’t change a line of my code.', 2)}</div>
          <section class="h5-pane h5-test" data-zone="test" aria-labelledby="h5-test-title">
            <header class="h5-pane-head"><b id="h5-test-title">Test run</b><span data-rev>no prompt yet</span><span class="h5-live" data-live>idle</span></header>
            <div class="h5-test-ctx">
              <p><span>Experiments inspect your code. They never edit it.</span><i class="h5-badge" data-ro>read-only</i></p>
              <label><span>Repo</span><select data-repo>${repos.map(r => `<option>${r}</option>`).join('')}</select></label>
              <label><span>Agent</span><select data-agent><option>Claude Code, your subscription</option><option>Codex, your subscription</option></select></label>
            </div>
            <div class="h5-test-body" data-testbody></div>
          </section>
          <div class="h5-notes">${note('n-verdict', 'pass is the agent’s call. keeping it is <b>mine</b>.', -1.5)}${note('n-uncertain', 'it said uncertain instead of faking a pass. one line fixes it.', 1.5)}${note('n-tokens', 'every run shows its tokens. <small>(sample numbers. my Claude plan, no API key.)</small>', -2)}</div>
        </div>
        <div class="h5-landing" data-landing hidden>${panelMarkup('p2')}</div>
        <div class="h5-notes">${note('n-landed', 'same panel as up top. pick where it goes.', 2)}</div>
      </div>
      <div class="h5-margin" data-margin aria-hidden="true"></div>
    </div>
    <svg class="h5-ink" data-ink aria-hidden="true"></svg>
  </section>`;
}

// ---------- markup: close ----------

function close() {
  const qa = [
    ['Do I need an API key?', 'No. Kiln drives the Codex or Claude Code you’re already signed into, on your ChatGPT or Claude plan. Its usage limits still apply. Editing, approving and installing never call a model.'],
    ['Will a test change my code?', 'No. Experiments are read-only, and the output is saved with the exact revision you ran.'],
    ['Where does an approved skill live?', 'Approval pins that revision and publishes it to your own Kiln GitHub repository. On another machine, run <code>kiln skills sync</code>.'],
  ];
  return `<section class="h5-close" id="h5-get" aria-labelledby="h5-get-title">
    <div class="h5-get">
      <h2 id="h5-get-title">Point it at your own skill folders.</h2>
      <p>Import what you have, switch off what you don’t use, and test the next prompt you save on your own repo.</p>
      <a class="h5-download" href="${installer}">${windows}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="h5-fine">The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned. Kiln is a Windows app with a CLI your agents can use, MIT licensed.</p>
    </div>
    <dl class="h5-qa">${qa.map(([q, a]) => `<div><dt>${q}</dt><dd>${a}</dd></div>`).join('')}</dl>
  </section>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h5" data-h5>
    <header class="h5-top"><a class="h5-brand" href="#main"><i class="h5-logo"></i>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h5-p1">My folders</a><a href="#h5-p2">New skills</a><a href="#h5-get" class="h5-top-get">Download</a></nav></header>
    <main id="main">
      <section class="h5-hero" aria-labelledby="h5-title">
        <h1 id="h5-title">My agents were loading skills I forgot I had. So I built this.</h1>
        <div class="h5-hero-side">
          <p>Kiln is a Windows app for Codex, Claude Code and Copilot. It shows every skill your agents load, one switch per folder, and lets you test a new prompt on your own repo before it becomes one.</p>
          <div class="h5-hero-actions"><a class="h5-download" href="${installer}">${windows}<span>Download for Windows</span></a><a class="h5-link" href="#h5-p1">See my folders</a></div>
        </div>
      </section>
      ${actOne()}
      ${actTwo()}
      ${close()}
    </main>
  </div>`;
  const page = root.querySelector<HTMLElement>('[data-h5]')!;
  const isDesk = () => innerWidth >= 1100;
  const setMode = () => { page.classList.toggle('h5-desk', isDesk()); page.classList.toggle('h5-stack', !isDesk()); };
  setMode();
  const ink1 = createInk(root.querySelector('.h5-p1')!, p1Notes, p1Marks, isDesk);
  const ink2 = createInk(root.querySelector('.h5-p2')!, p2Notes, p2Marks, isDesk);
  const panels = bindPanels(root, ink1, ink2);
  const pop = bindPopIn(root, panels, ink1);
  bindActTwo(root, page, panels, ink2);
  addEventListener('resize', () => { setMode(); drawDoodle(root); ink1.refresh(); ink2.refresh(); });
  document.fonts?.ready.then(() => { drawDoodle(root); ink1.refresh(); ink2.refresh(); });
  drawDoodle(root);
  ink2.reach('p2');
  pop.start();
}

// ---------- act 1: the doodle ----------

function drawDoodle(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.h5-fold').forEach((fold, n) => {
    const svg = fold.querySelector('svg')!, w = fold.offsetWidth, h = fold.offsetHeight;
    if (!w) return;
    const label = fold.querySelector<HTMLElement>('.h5-fold-path')!, top = label.offsetTop + label.offsetHeight + 3;
    const box = fold.getBoundingClientRect();
    reseed(40 + n * 11);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h));
    let d = `<path d="${folder(2, top, w - 6, h - top - 2)}" class="h5-s" pathLength="1" style="--i:${n}"/>`;
    fold.querySelectorAll<HTMLElement>('.is-broken').forEach(file => {
      const r = file.getBoundingClientRect(), x = r.left - box.left, y = r.top - box.top + r.height * .55;
      d += `<path d="${cross(x + 5, y, 5.5)}" class="h5-s" pathLength="1" style="--i:${n + 1}"/><path d="${line(x + 12, y, x + r.width + 3, y - 1, .8)}" class="h5-s" pathLength="1" style="--i:${n + 1.5}"/>`;
    });
    svg.innerHTML = d;
  });
}

// ---------- act 1: the panel (shared by both acts) ----------

type Panels = ReturnType<typeof bindPanels>;
function bindPanels(root: HTMLElement, ink1: Ink, ink2: Ink) {
  const landed = new Set<string>();
  let cleaned = false;
  const mounts = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const count = (key: Col) => rows.filter(row => row.cells[key] !== 'off').length;
  const sw = (row: Row, r: number, c: typeof columns[number]) => {
    const state = row.cells[c.key];
    return `<button type="button" role="switch" class="h5-switch h5-switch-${state}" data-row="${r}" data-col="${c.key}" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.name} in ${c.name}: ${stateText[state]}"><i></i></button>`;
  };
  const rowHtml = (row: Row, r: number, scope: string) => `<tr data-slot="row-${row.name}" class="${row.fresh ? 'is-fresh ' : ''}${scope === 'p2' || row.fresh || landed.has(row.name) ? 'is-in' : ''}">
    <th scope="row"><b data-aim>${row.name}</b><small>${row.caption}</small></th>${columns.map(c => `<td data-col="${c.key}">${sw(row, r, c)}</td>`).join('')}</tr>`;
  function paint() {
    for (const mount of mounts) {
      const scope = mount.dataset.panel!;
      const body = mount.querySelector<HTMLElement>('[data-rows]')!;
      body.innerHTML = rows.map((row, r) => (scope === 'p1' || row.fresh ? rowHtml(row, r, scope) : '')).join('');
      mount.querySelector('[data-context]')!.textContent = `Descriptions loaded in every new session: Claude Code ${count('claude')} · shared ${count('shared')} · Codex ${count('codex')} · Copilot ${count('copilot')} · my-game ${count('project')}`;
      mount.querySelector('[data-waiting]')?.classList.toggle('is-gone', landed.size > 0);
    }
    const cleanup = root.querySelector<HTMLElement>('[data-slot="cleanup"]')!;
    cleanup.classList.toggle('is-done', cleaned);
    ink1.refresh(); ink2.refresh();
  }
  const say = (mount: HTMLElement, text: string) => { const status = mount.querySelector<HTMLElement>('[data-status]')!; status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const refocus = (mount: HTMLElement, r: number, col: string) => mount.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${col}"]`)?.focus();

  for (const mount of mounts) {
    const pop = mount.querySelector<HTMLElement>('[data-pop]')!;
    let returnTo: HTMLElement | null = null;
    const closePop = () => { if (pop.hidden) return; pop.hidden = true; returnTo?.focus(); returnTo = null; };
    const openPop = (html: string, from: HTMLElement) => { pop.innerHTML = html; pop.hidden = false; returnTo = from; pop.querySelector<HTMLElement>('button')?.focus(); };
    mount.addEventListener('click', event => {
      const target = event.target as Element;
      const button = target.closest<HTMLButtonElement>('.h5-switch');
      if (button) {
        const r = Number(button.dataset.row), row = rows[r], c = columns.find(item => item.key === button.dataset.col)!, state = row.cells[c.key], path = plain(c.path);
        if (state === 'edited') {
          const drift = row.drift?.[c.key];
          openPop(`<h3>${path}/${row.name} differs from approved rev ${row.rev}</h3><p>${drift?.why ?? ''} Kiln won’t overwrite it without asking.</p>
            <div class="h5-diff"><p class="h5-del">${drift?.del ?? ''}</p><p class="h5-add">${drift?.add ?? ''}</p></div>
            <div class="h5-row-actions"><button type="button" class="h5-btn" data-act="replace">Replace with rev ${row.rev}</button><button type="button" class="h5-btn h5-btn-quiet" data-act="draft">Keep it as a draft</button><button type="button" class="h5-btn h5-btn-ghost" data-act="close">Cancel</button></div>`, button);
          pop.dataset.row = String(r); pop.dataset.col = c.key;
          say(mount, 'That copy changed outside Kiln. Compare it first.');
          return;
        }
        if (state === 'found') {
          openPop(`<h3>${row.name} isn’t in your library</h3><p>Import it as a draft. The folder in <code>${path}</code> stays exactly where it is.</p>
            <div class="h5-row-actions"><button type="button" class="h5-btn" data-act="import">Import as draft</button><button type="button" class="h5-btn h5-btn-ghost" data-act="close">Not now</button></div>`, button);
          pop.dataset.row = String(r); pop.dataset.col = c.key;
          return;
        }
        if (row.rev === 0) { say(mount, `Import ${row.name} first, then install it anywhere.`); return; }
        row.cells[c.key] = state === 'on' ? 'off' : 'on';
        paint();
        say(mount, state === 'on' ? `Removed ${row.name} from ${path}. It stays in your library.` : `Installed rev ${row.rev} of ${row.name} into ${path}. Receipt saved.`);
        refocus(mount, r, c.key);
        return;
      }
      const act = target.closest<HTMLElement>('[data-act]')?.dataset.act;
      if (act) {
        const r = Number(pop.dataset.row), row = rows[r], key = pop.dataset.col as Col, path = plain(columns.find(c => c.key === key)!.path);
        pop.hidden = true;
        if (act === 'replace') { row.cells[key] = 'on'; say(mount, `Moved the changed copy to a private backup and installed rev ${row.rev} into ${path}.`); }
        if (act === 'draft') { row.caption = `rev ${row.rev} approved, draft rev ${row.rev + 1} from the edit`; say(mount, `Saved the edit as draft rev ${row.rev + 1}. Rev ${row.rev} stays approved.`); }
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
    row.classList.remove('is-flash'); void row.offsetWidth; row.classList.add('is-flash');
  });
  paint();
  return {
    paint,
    reset() { landed.clear(); paint(); root.querySelector('[data-slot="cleanup"]')!.classList.remove('is-in'); },
    land(to: string) {
      if (to === 'cleanup') { root.querySelector('[data-slot="cleanup"]')!.classList.add('is-in'); return; }
      const name = to.replace('row-', '');
      const first = !landed.has(name);
      landed.add(name);
      root.querySelector('[data-panel="p1"] [data-waiting]')?.classList.add('is-gone');
      const tr = root.querySelector<HTMLElement>(`[data-panel="p1"] [data-slot="${to}"]`);
      if (!tr) return;
      tr.classList.add('is-in');
      tr.classList.remove('is-landed'); void tr.offsetWidth; tr.classList.add('is-landed');
      if (!first) { const cap = tr.querySelector('small'); cap?.classList.remove('is-bump'); void (cap as HTMLElement | null)?.offsetWidth; cap?.classList.add('is-bump'); }
    },
    landAll() { rows.forEach(row => landed.add(row.name)); paint(); root.querySelector('[data-slot="cleanup"]')!.classList.add('is-in'); },
    add(name: string, rev: number) {
      if (rows.some(row => row.name === name)) return;
      rows.push({ name, caption: `approved rev ${rev}, just now`, rev, cells: { ...off, claude: 'on', project: 'on' }, fresh: true });
      landed.add(name);
      paint();
      mounts.forEach(mount => say(mount, `Approved rev ${rev} of ${name}. Installed for Claude Code and my-game.`));
    },
  };
}

// ---------- act 1: the pop-in (FLIP, after H03's "Tidy this up") ----------

function bindPopIn(root: HTMLElement, panels: Panels, ink: Ink) {
  const sheet = root.querySelector<HTMLElement>('.h5-p1')!;
  const doodleEl = sheet.querySelector<HTMLElement>('[data-doodle]')!;
  const layer = sheet.querySelector<HTMLElement>('[data-fly]')!;
  const button = sheet.querySelector<HTMLButtonElement>('[data-popin]')!;
  const live = sheet.querySelector<HTMLElement>('[data-pop-live]')!;
  const files = [...sheet.querySelectorAll<HTMLElement>('[data-file]')];
  let busy = false, touched = false, popped = false;
  const slot = (to: string) => sheet.querySelector<HTMLElement>(`[data-panel="p1"] [data-slot="${to}"]`);
  const aim = (to: string) => { const s = slot(to); return s?.querySelector<HTMLElement>('[data-aim]') ?? s?.querySelector<HTMLElement>('p') ?? s; };

  const finish = () => {
    busy = false; popped = true;
    sheet.classList.remove('is-replaying');
    button.disabled = false; button.textContent = 'Do it again';
    doodleEl.classList.add('is-emptied');
    live.textContent = '11 files became 5 rows. The originals stay where they are.';
    ink.reach('popped');
  };
  const instant = () => { files.forEach(f => f.classList.add('is-copied')); panels.landAll(); finish(); };

  function flight(file: HTMLElement, from: DOMRect, rot: number) {
    const to = file.dataset.to!;
    const target = aim(to)!.getBoundingClientRect();
    const dx = target.left - from.left, dy = target.top + target.height / 2 - (from.top + from.height / 2);
    if (to === 'cleanup') {
      const rect = 'polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)';
      const crushed = 'polygon(10% 14%, 46% 6%, 90% 12%, 82% 48%, 94% 88%, 50% 80%, 8% 92%, 18% 52%)';
      const ball = 'polygon(30% 20%, 50% 34%, 72% 18%, 66% 50%, 80% 82%, 50% 68%, 24% 84%, 34% 50%)';
      const tx = target.left + 24 - from.left - from.width / 2;
      return { keyframes: [
        { transform: `rotate(${rot}deg) scale(1)`, clipPath: rect, opacity: 1 },
        { transform: `rotate(${rot + 12}deg) scale(.8)`, clipPath: crushed, offset: .25 },
        { transform: `rotate(${rot + 60}deg) scale(.5)`, clipPath: ball, opacity: 1, offset: .45 },
        { transform: `translate(${tx}px, ${dy}px) rotate(${rot + 320}deg) scale(.45)`, clipPath: ball, opacity: .9, offset: .92 },
        { transform: `translate(${tx}px, ${dy}px) rotate(${rot + 340}deg) scale(.2)`, clipPath: ball, opacity: 0 },
      ], duration: 1300, easing: 'cubic-bezier(.45,.05,.55,1)' };
    }
    const scale = Math.max(.55, Math.min(1.2, target.height / from.height * 1.1));
    return { keyframes: [
      { transform: `translate(0,0) rotate(${rot}deg) scale(1)`, opacity: 1 },
      { transform: `translate(${dx * .08}px, ${dy * .08 - 14}px) rotate(${rot - 4}deg) scale(1.12)`, opacity: 1, offset: .18 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${scale})`, opacity: 1, offset: .82 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${scale})`, opacity: 0 },
    ], duration: 900, easing: 'cubic-bezier(.55,0,.2,1)' };
  }

  async function play() {
    if (busy) return;
    touched = true; busy = true;
    button.disabled = true;
    files.forEach(f => f.classList.remove('is-copied'));
    doodleEl.classList.remove('is-emptied');
    if (popped) { sheet.classList.add('is-replaying'); panels.reset(); await wait(350); }
    if (reduced()) { instant(); return; }
    const holder = layer.getBoundingClientRect();
    // Merge order: all copies of one skill fly one after another, so the "3 into 1" moment reads.
    const order = [...files].sort((a, b) => (a.dataset.to === 'cleanup' ? 1 : 0) - (b.dataset.to === 'cleanup' ? 1 : 0) || rows.findIndex(r => `row-${r.name}` === a.dataset.to) - rows.findIndex(r => `row-${r.name}` === b.dataset.to));
    const runs = order.map((file, n) => {
      const from = file.getBoundingClientRect();
      const rot = parseFloat(getComputedStyle(file.closest('.h5-fold')!).getPropertyValue('--rot')) || 0;
      const clone = file.cloneNode(true) as HTMLElement;
      clone.removeAttribute('data-file');
      clone.className = `h5-flyer${file.classList.contains('is-broken') ? ' is-broken' : ''}`;
      Object.assign(clone.style, { left: `${from.left - holder.left}px`, top: `${from.top - holder.top}px`, width: `${from.width}px`, height: `${from.height}px` });
      const { keyframes, duration, easing } = flight(file, from, rot);
      const delay = 150 + n * 150;
      layer.append(clone);
      const animation = clone.animate(keyframes, { duration, delay, easing, fill: 'both' });
      setTimeout(() => file.classList.add('is-copied'), delay);
      return animation.finished.then(() => { clone.remove(); panels.land(file.dataset.to!); });
    });
    await Promise.all(runs);
    finish();
  }

  button.addEventListener('click', play);
  return {
    start() {
      // The doodle draws itself on load; the files pop into Kiln once the panel is in view.
      const drawDoodle = () => { doodleEl.classList.add('is-drawn'); ink.reach('drawn'); };
      if (auto) { drawDoodle(); instant(); return; }
      requestAnimationFrame(() => requestAnimationFrame(drawDoodle));
      if (reduced()) { instant(); return; }
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        document.fonts.ready.then(() => setTimeout(() => { if (!touched) play(); }, 2200));
      }, { threshold: .6 });
      observer.observe(sheet.querySelector('[data-win1]')!);
    },
  };
}

// ---------- act 2: capture, test, approve ----------

function bindActTwo(root: HTMLElement, page: HTMLElement, panels: Panels, ink: Ink) {
  const sheet = root.querySelector<HTMLElement>('.h5-p2')!;
  const cap = sheet.querySelector<HTMLElement>('[data-cap]')!;
  const capZone = sheet.querySelector<HTMLElement>('[data-zone="capture"]')!;
  const testZone = sheet.querySelector<HTMLElement>('[data-zone="test"]')!;
  const testBody = sheet.querySelector<HTMLElement>('[data-testbody]')!;
  const live = sheet.querySelector<HTMLElement>('[data-live]')!;
  const revLabel = sheet.querySelector<HTMLElement>('[data-rev]')!;
  const repo = sheet.querySelector<HTMLSelectElement>('[data-repo]')!;
  const landing = sheet.querySelector<HTMLElement>('[data-landing]')!;
  let pack: Pack | null = null, rev = 1, phase: 'empty' | 'ready' | 'running' | 'uncertain' | 'passed' | 'approved' = 'empty', analysing = false;
  const approved = new Set<string>();

  const idleCapture = () => `<div class="h5-drop" data-capdrop>
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <p><b>Drop a link, post, screenshot or file</b><span>Kiln analyzes it into a collection linked to the source.</span></p>
    <div class="h5-drop-actions"><span class="h5-fake-input">Paste a link or some text…</span><button type="button" class="h5-btn" disabled>Analyze and add</button><button type="button" class="h5-btn h5-btn-quiet" disabled>Save only</button></div>
    <small>From anywhere: <kbd>Ctrl+Shift+Space</kbd></small>
  </div>`;
  const idleTest = () => `<div class="h5-drop h5-drop-test"><p><b>Drag a prompt here</b><span>It runs that exact revision on the repo above. Nothing in your code changes.</span></p></div>`;
  cap.innerHTML = idleCapture();
  testBody.innerHTML = idleTest();

  const glyph: Record<string, string> = { read: '&#x25A4;', cmd: '&#x276F;', think: '&#x25C7;' };
  const logLine = ([kind, text]: [string, string]) => `<li><i>${glyph[kind]}</i><span>${text}</span></li>`;
  const kindClass = (kind: string) => kind.toLowerCase().replace(/\s+/g, '-');

  function collection(p: Pack) {
    const promptText = p.star.kind === 'Prompt' && rev > 1 && p.run?.edit ? p.star.text.replace(p.run.edit.del, `<mark>${p.run.edit.add}</mark>`) : p.star.text;
    const testable = p.star.kind === 'Prompt';
    return `<div class="h5-coll">
      <p class="h5-coll-head"><span>New collection</span><b>${p.star.title}</b><em>linked to ${p.label.split(':')[0].replace('Post on X by ', 'X, ')}</em></p>
      <article class="h5-star${testable ? '' : ' is-repo'}" data-star${testable ? ' data-drag="prompt"' : ''} aria-label="${p.star.kind}: ${p.star.title}${testable ? '. Drag it into the test run.' : ''}">
        <header><i class="h5-kind h5-kind-${kindClass(p.star.kind)}">${p.star.kind}</i>${testable ? `<span class="h5-revtag">rev ${rev}</span>` : '<span class="h5-revtag">drafts</span>'}<span class="h5-grip" aria-hidden="true">${testable ? '&#x2807;&#x2807;' : ''}</span></header>
        <h3>${testable ? '<span class="h5-star-glyph" aria-hidden="true">&#x2605;</span>' : ''}${p.star.title}</h3>
        <p class="h5-star-text">${promptText}</p>
        <footer>${p.star.from ? `<a href="#h5-p2" class="h5-ts" data-ts>from ${p.star.from}</a>` : `<span class="h5-ts">${p.key === 'x' ? 'from the post' : 'from the repository'}</span>`}${testable ? `<button type="button" class="h5-btn h5-btn-sm" data-test-it${phase === 'running' ? ' disabled' : ''}>Test on my repo</button>` : ''}</footer>
      </article>
      <ul class="h5-cards">${p.cards.map((c, i) => `<li style="--i:${i}"><i class="h5-kind h5-kind-${kindClass(c.kind)}">${c.kind}</i><b>${c.title}</b>${c.from ? `<span class="h5-ts">from ${c.from}</span>` : ''}</li>`).join('')}</ul>
    </div>`;
  }

  function bindStar() {
    const star = cap.querySelector<HTMLElement>('[data-drag="prompt"]');
    if (!star) return;
    draggable(star, { host: page, zones: () => [testZone], enabled: () => phase !== 'running', onDrop: () => startTest() });
    cap.querySelector<HTMLButtonElement>('[data-test-it]')?.addEventListener('click', () => {
      if (phase === 'running') return;
      flyInto(star, testZone, page, () => startTest());
    });
  }

  async function capture(key: Pack['key']) {
    if (analysing || phase === 'running') return;
    analysing = true;
    pack = packs[key]; rev = 1;
    sheet.querySelectorAll('.h5-src').forEach(src => src.classList.toggle('is-used', (src as HTMLElement).dataset.src === key || src.classList.contains('is-used')));
    capZone.classList.add('is-busy');
    cap.innerHTML = `<div class="h5-analysing"><p class="h5-chip-src">${pack.label}</p><ol class="h5-log" data-alog></ol></div>`;
    const alog = cap.querySelector<HTMLElement>('[data-alog]')!;
    const steps: [string, string][] = key === 'yt'
      ? [['read', 'Fetched the captions, 18:24'], ['think', 'Found 1 prompt, 1 technique, 1 insight, 1 tool'], ['read', 'Linked each one to its timestamp']]
      : key === 'x' ? [['read', 'Read the post'], ['think', 'Found 1 prompt, 1 technique, 1 insight, 1 tool']]
        : [['read', 'Cloned the repository list of skills/'], ['think', 'Staged each skill as a draft']];
    for (const step of steps) { await wait(auto ? 0 : 420); alog.insertAdjacentHTML('beforeend', logLine(step)); }
    await wait(auto ? 0 : 380);
    capZone.classList.remove('is-busy');
    cap.innerHTML = collection(pack);
    cap.querySelector('.h5-coll')!.classList.add('is-new');
    bindStar();
    analysing = false;
    testBody.innerHTML = idleTest(); testZone.classList.remove('is-loaded');
    revLabel.textContent = 'no prompt yet'; live.textContent = 'idle'; live.className = 'h5-live'; phase = 'ready';
    ink.reach('captured');
    ink.reach(key === 'gh' ? 'captured-gh' : 'captured-prompt');
    ink.refresh();
  }

  const meter = () => `<div class="h5-meter" data-meter><span><b data-elapsed>0:00</b> elapsed</span><span data-tokens>0.0k in · 0.0k cached · 0.0k out</span><em>sample</em></div>`;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  async function runLines(lines: [string, string][], total: number, base: { t: number; i: number; c: number; o: number }) {
    const log = testBody.querySelector<HTMLElement>('[data-tlog]')!, elapsed = testBody.querySelector<HTMLElement>('[data-elapsed]')!, tokens = testBody.querySelector<HTMLElement>('[data-tokens]')!;
    for (let i = 0; i < lines.length; i++) {
      await wait(auto ? 0 : 620);
      log.insertAdjacentHTML('beforeend', logLine(lines[i]));
      const k = (i + 1) / lines.length;
      elapsed.textContent = fmt(base.t + total * k);
      tokens.textContent = `${(base.i + 38.4 * k).toFixed(1)}k in · ${(base.c + 26.1 * k).toFixed(1)}k cached · ${(base.o + 1.9 * k).toFixed(1)}k out`;
      ink.refresh();
    }
  }

  async function startTest() {
    if (!pack?.run || phase === 'running') return;
    const p = pack, run = p.run!;
    phase = 'running';
    cap.querySelectorAll<HTMLButtonElement>('[data-test-it]').forEach(b => { b.disabled = true; });
    testZone.classList.add('is-loaded');
    revLabel.textContent = `${p.star.title} · rev ${rev}`;
    live.textContent = 'running'; live.className = 'h5-live is-running';
    testBody.innerHTML = `<p class="h5-running">Running rev ${rev} on <code>${repo.value}</code>, read-only</p>${meter()}<ol class="h5-log" data-tlog></ol><div class="h5-verdict" data-verdict aria-live="polite"></div>`;
    ink.reach('ran');
    await runLines(run.lines, 178, { t: 0, i: 0, c: 0, o: 0 });
    await wait(auto ? 0 : 450);
    const verdict = testBody.querySelector<HTMLElement>('[data-verdict]')!;
    live.className = 'h5-live';
    if (run.verdict === 'uncertain' && rev === 1 && run.edit) {
      phase = 'uncertain'; live.textContent = 'uncertain';
      verdict.innerHTML = `<p class="h5-v-head"><span class="h5-pill h5-pill-uncertain">Uncertain</span><span>the agent’s assessment</span></p><p class="h5-out">${run.text}</p>
        <div class="h5-edit" data-edit><p class="h5-edit-head">Change one line, then run rev 2</p><div class="h5-diff"><p class="h5-del">- ${run.edit.del}</p><p class="h5-add">+ ${run.edit.add}</p></div>
        <button type="button" class="h5-btn" data-rerun>Save as rev 2 and run again</button></div>`;
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
    cap.innerHTML = collection(pack); bindStar();
    cap.querySelector<HTMLButtonElement>('[data-test-it]')!.disabled = true;
    revLabel.textContent = `${pack.star.title} · rev 2`;
    live.textContent = 'running'; live.className = 'h5-live is-running';
    testBody.querySelector('.h5-running')!.innerHTML = `Running rev 2 on <code>${repo.value}</code>, read-only`;
    const verdict = testBody.querySelector<HTMLElement>('[data-verdict]')!;
    verdict.innerHTML = '';
    testBody.querySelector('[data-tlog]')!.insertAdjacentHTML('beforeend', '<li class="h5-log-sep"><i>&#x21BB;</i><span>rev 2</span></li>');
    ink.refresh();
    await runLines(run.again!, 101, { t: 178, i: 38.4, c: 26.1, o: 1.9 });
    await wait(auto ? 0 : 450);
    live.className = 'h5-live';
    pass(verdict, run.passText!);
    cap.querySelector<HTMLButtonElement>('[data-test-it]')!.disabled = false;
  }

  function pass(verdict: HTMLElement, text: string) {
    const p = pack!;
    phase = 'passed'; live.textContent = 'pass';
    const done = approved.has(p.skill!);
    verdict.innerHTML = `<p class="h5-v-head"><span class="h5-pill h5-pill-pass">Pass</span><span>the agent’s assessment</span></p><p class="h5-out">${text}</p>
      <div class="h5-yours" data-yours><p><b>Your call.</b> Approving pins rev ${rev} and publishes it to your Kiln repo.</p>
      <div class="h5-row-actions"><button type="button" class="h5-btn" data-approve${done ? ' disabled' : ''}>${done ? `Approved as ${p.skill}` : `Approve rev ${rev} as a skill`}</button><button type="button" class="h5-btn h5-btn-quiet" data-notyet${done ? ' hidden' : ''}>Not yet</button></div></div>`;
    ink.reach('passed');
    const approve = verdict.querySelector<HTMLButtonElement>('[data-approve]')!;
    approve.addEventListener('click', () => doApprove(approve));
    verdict.querySelector('[data-notyet]')!.addEventListener('click', event => {
      (event.currentTarget as HTMLElement).closest('.h5-yours')!.querySelector('p')!.innerHTML = '<b>Kept as a prompt.</b> Nothing was installed. Run it again whenever you like.';
    });
    if (!auto && !done) approve.focus({ preventScroll: true });
  }

  async function doApprove(button: HTMLButtonElement) {
    const p = pack!;
    if (!p.skill || approved.has(p.skill)) return;
    approved.add(p.skill);
    phase = 'approved';
    button.disabled = true; button.textContent = `Approved as ${p.skill}`;
    button.parentElement!.querySelector('[data-notyet]')?.setAttribute('hidden', '');
    button.closest('.h5-yours')!.querySelector('p')!.innerHTML = `<b>Approved rev ${rev}.</b> Published to my-kiln on GitHub. Editing it later makes a new draft.`;
    const wasHidden = landing.hidden;
    landing.hidden = false;
    panels.add(p.skill, rev);
    ink.reach('approved');
    const row = landing.querySelector<HTMLElement>(`[data-slot="row-${p.skill}"]`)!;
    if (wasHidden && !reduced()) landing.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
    // The prompt's title flies from its card into the new row.
    const title = cap.querySelector<HTMLElement>('.h5-star h3');
    if (title && !reduced() && !auto) {
      const from = title.getBoundingClientRect(), to = row.querySelector('b')!.getBoundingClientRect();
      const ghost = document.createElement('span');
      ghost.className = 'h5-title-ghost'; ghost.textContent = p.skill;
      Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px` });
      page.append(ghost);
      row.classList.add('is-waiting');
      await ghost.animate([{ transform: 'translate(0,0) scale(1.3)', opacity: 0 }, { transform: 'translate(0,-10px) scale(1.3)', opacity: 1, offset: .2 }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(1)`, opacity: 1 }], { duration: 850, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }).finished;
      ghost.remove(); row.classList.remove('is-waiting');
    }
    row.classList.add('is-landed');
    const rect = landing.getBoundingClientRect();
    if (rect.bottom > innerHeight || rect.top < 0) landing.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
    ink.refresh();
  }

  sheet.querySelectorAll<HTMLElement>('[data-drag]').forEach(el => {
    const key = el.dataset.drag as Pack['key'];
    draggable(el, { host: page, zones: () => [capZone], enabled: () => !analysing && phase !== 'running', onDrop: () => capture(key) });
  });
  sheet.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => button.addEventListener('click', () => {
    if (analysing || phase === 'running') return;
    const key = button.dataset.add as Pack['key'];
    flyInto(sheet.querySelector<HTMLElement>(`[data-drag="${key}"]`)!, capZone, page, () => capture(key));
  }));
  sheet.addEventListener('click', event => { if ((event.target as Element).closest('[data-ts]')) event.preventDefault(); });
}
