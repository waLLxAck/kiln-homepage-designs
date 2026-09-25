// PROTOTYPE round 3 kit. One visual system, three story orders (R1 library first, R2 testing first, R3 both in the hero).
// Your mess is drawn by hand; Kiln is crisp product UI. Each section uses one device once: the panel, the swipe, the loop.
import './kit.css';
import { examples, installer } from '../../content';
import { arrow, creature, cross, ellipse, folder, label, puzzled, rect, reseed, stroke } from './rough';

export type Story = 'library' | 'testing' | 'both';
const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download for Windows') => `<a class="r3-button" href="${installer}">${windows}<span>${text}</span></a>`;

// ---------- hand-drawn pieces ----------

function foldersSketch() {
  reseed(7);
  let i = 0;
  const item = (x: number, y: number, text: string, ink: 'k' | 'r' = 'k') => label(x, y, text, ink, i++, 20);
  return `<svg class="r3-sketch" viewBox="0 0 520 390" role="img" aria-label="A hand-drawn mess: three skill folders holding code-review, code-review (1), code-review-old, a broken link and a puzzled person asking which one is current.">
    ${stroke(folder(16, 44, 222, 150), 'k', i++)}${label(22, 34, '~/.claude/skills', 'b', i++, 19)}
    ${item(34, 88, 'code-review')}${item(34, 114, 'code-review (1)')}${item(34, 140, 'research')}${item(34, 166, 'playtest ??')}
    ${stroke(folder(272, 18, 226, 138), 'k', i++)}${label(278, 10, '~/.agents/skills', 'b', i++, 19)}
    ${item(290, 62, 'code-review')}${item(290, 88, 'writing-for-agents')}${item(290, 114, 'pr-summary', 'k')}${item(312, 140, 'old-link', 'r')}${stroke(cross(298, 134, 7), 'r', i++)}
    ${stroke(folder(16, 262, 238, 116), 'k', i++)}${label(22, 252, 'my-game/.github/skills', 'b', i++, 19)}
    ${item(34, 302, 'code-review-old')}${item(34, 328, 'code-review-FINAL')}${item(34, 354, 'playtest')}
    ${stroke(arrow(262, 236, 190, 114, 18), 'r', i++)}${label(262, 262, 'which one is current??', 'r', i++, 19, -3)}
    ${stroke(ellipse(343, 56, 62, 16, .06), 'r', i++)}${stroke(arrow(446, 196, 420, 70, -24), 'r', i++)}${label(370, 218, 'edited by hand?', 'r', i++, 19, -4)}
    ${stroke(puzzled(460, 282), 'k', i++)}
  </svg>`;
}

function bookmarksSketch() {
  reseed(19);
  let i = 0;
  const note = (x: number, y: number, w: number, h: number, rotate: number, lines: string[], ink: 'k' | 'b' = 'k') =>
    `<g transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})">${stroke(rect(x, y, w, h), 'k', i++)}${lines.map((text, n) => label(x + 12, y + 30 + n * 26, text, n ? 'k' : ink, i++, n ? 19 : 21)).join('')}</g>`;
  return `<svg class="r3-sketch" viewBox="0 0 520 390" role="img" aria-label="A hand-drawn pile of saved things: an X post, an hour-long video, a screenshot and a note saying try this later, marked times fifty, with a sleepy person.">
    ${note(20, 30, 210, 88, -4, ['X post', '"this prompt is insane"'], 'b')}
    ${note(250, 18, 220, 88, 3, ['video, 58 minutes', 'agent workflows talk'], 'b')}
    ${note(56, 146, 200, 88, 2, ['screenshot_0412.png', 'someone\'s CLAUDE.md'], 'b')}
    ${note(284, 128, 196, 96, -5, ['note to self', 'TRY THIS LATER!!'], 'b')}
    ${note(150, 262, 206, 80, -2, ['bookmark #50', 'saved at 11:48 pm'], 'b')}
    ${label(410, 300, '×50', 'r', i++, 54, -8)}${stroke(ellipse(446, 285, 62, 38, .08), 'r', i++)}
    ${label(384, 366, 'tried: 0', 'r', i++, 22, -3)}
  </svg>`;
}

function loopSketch() {
  reseed(31);
  let i = 0;
  return `<svg class="r3-sketch r3-loop-art" viewBox="0 0 900 340" role="img" aria-label="A hand-drawn loop: save it, test it on your repo, keep it as an approved skill, switch it on where you need it, switch off what you don't use, and back to saving.">
    ${stroke(ellipse(450, 170, 300, 118, .03, 1.02, 3.3), 'k', i++)}
    ${stroke(arrow(262, 72, 300, 60, 0, 16), 'k', i++)}${stroke(arrow(636, 262, 600, 280, 0, 16), 'k', i++)}
    ${label(450, 182, 'Kiln', 'k', i++, 44, 0, 'middle')}
    ${label(136, 180, 'save it', 'b', i++, 26, 0, 'end')}
    ${label(250, 30, 'test it on your repo', 'b', i++, 26, 0, 'middle')}
    ${label(650, 30, 'keep it as a skill', 'g', i++, 26, 0, 'middle')}
    ${label(766, 164, 'switch it on', 'g', i++, 26, 0, 'start')}${label(766, 192, 'where you need it', 'g', i++, 22, 0, 'start')}
    ${label(450, 324, 'switch off what you don\'t use', 'r', i++, 26, 0, 'middle')}
  </svg>`;
}

function loopSketchTall() {
  reseed(33);
  let i = 0;
  const steps: [string, 'b' | 'g' | 'r'][] = [['save it', 'b'], ['test it on your repo', 'b'], ['keep it as a skill', 'g'], ['switch it on where you need it', 'g'], ['switch off what you don\'t use', 'r']];
  return `<svg class="r3-sketch r3-loop-tall" viewBox="0 0 360 520" role="img" aria-label="The same loop as a list: save it, test it on your repo, keep it as a skill, switch it on where you need it, switch off what you don't use, then back to the top.">
    ${steps.map(([text, ink], n) => `${label(60, 52 + n * 96, text, ink, i++, 25)}${n < steps.length - 1 ? stroke(arrow(34, 66 + n * 96, 34, 124 + n * 96, 6, 11), 'k', i++) : ''}`).join('')}
    ${stroke(arrow(20, 452, 18, 40, -70, 13), 'k', i++)}${label(300, 290, 'Kiln', 'k', i++, 40, -6, 'middle')}
  </svg>`;
}

function heroArrow() {
  reseed(3);
  return `<svg class="r3-hero-arrow" viewBox="0 0 110 70" aria-hidden="true">${stroke(arrow(6, 44, 100, 34, -22, 15), 'r', 16)}</svg>`;
}

// ---------- crisp product pieces ----------

type Cell = 'on' | 'off' | 'edited';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; fresh?: boolean };
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

function miniPanel() {
  const dot = (state: Cell) => `<i class="r3-dot r3-dot-${state}"></i>`;
  return `<div class="r3-ui r3-mini" aria-hidden="true">
    <div class="r3-ui-bar"><b>Kiln</b><span>Skills</span></div>
    <div class="r3-mini-grid"><span></span>${columns.map(column => `<small>${column.short}</small>`).join('')}
    ${rows.map(row => `<span>${row.name}</span>${columns.map(column => dot(row.cells[column.key])).join('')}`).join('')}</div>
    <p class="r3-mini-foot"><i class="r3-dot r3-dot-edited"></i> 1 copy edited by hand</p>
  </div>`;
}

function miniRun() {
  return `<div class="r3-ui r3-mini" aria-hidden="true">
    <div class="r3-ui-bar"><b>Test</b><span>~/code/my-game, read-only</span></div>
    <ol class="r3-mini-lines"><li>Read src/screens/Start.tsx</li><li>Searched src/ for "signup"</li><li>The first screen has three buttons; none says play</li></ol>
    <p class="r3-mini-foot"><span class="r3-verdict r3-verdict-pass">Pass</span> 2 min 51 s, sample run</p>
  </div>`;
}

function panelSection() {
  return `<section class="r3-section r3-panel-section" id="r3-panel" aria-labelledby="r3-panel-title">
    <div class="r3-head">
      <h2 id="r3-panel-title">Switch a skill on.<br>Switch it off.<br>See every copy.</h2>
      <p>Kiln finds every skill folder your agents read, on this machine and in your projects. Each skill gets one switch per location. Flip one and Kiln installs the approved version there, or removes that copy. Your library keeps the skill either way.</p>
    </div>
    <div class="r3-panel-wrap">
      <div class="r3-ui r3-panel">
        <div class="r3-ui-bar"><b>Skills</b><span>Sample library</span></div>
        <div class="r3-table-scroll"><table>
          <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="r3-col-long">${column.name}</span><span class="r3-col-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
          <tbody data-rows></tbody>
        </table></div>
        <div class="r3-compare" data-compare hidden>
          <p><b>~/.claude/skills/code-review</b> differs from approved rev 3</p>
          <div class="r3-diff"><p class="r3-del">− Review standards and the specification separately.</p><p class="r3-add">+ Review the specification only.</p></div>
          <div class="r3-row-actions"><button type="button" class="r3-ui-button" data-compare-replace>Replace with approved rev 3</button><button type="button" class="r3-ui-button r3-quiet" data-compare-keep>Keep the edit as a new draft</button></div>
        </div>
        <div class="r3-found"><h3>Found outside your library</h3><ul data-found></ul></div>
        <div class="r3-ui-foot"><p data-context></p><p class="r3-status" data-status aria-live="polite">Flip a switch to see what Kiln does.</p></div>
      </div>
      <aside class="r3-notes" aria-label="Notes">
        <p class="r3-note r3-note-b"><b>Green</b> means installed from the version you approved.</p>
        <p class="r3-note r3-note-r"><b>Amber</b> means someone edited that copy by hand. Compare it before you replace it.</p>
        <p class="r3-note">Every installed skill's description sits in your agent's context on every turn, whether it fires or not. Switch off what you don't use.</p>
        <figure class="r3-creature r3-drawable">${(() => { reseed(41); return `<svg viewBox="0 0 150 110" aria-hidden="true">${stroke(creature(64, 50), 'k', 0)}</svg>`; })()}
          <figcaption><i>Duplicatus agentis</i>: the copy nobody remembers making. Kiln finds it; you remove it.</figcaption></figure>
      </aside>
    </div>
  </section>`;
}

type Card = { source: string; title: string; prompt: string; verdict: 'pass' | 'uncertain'; skill: string; lines: string[]; fix?: { before: string; after: string; lesson: string } };
const cards: Card[] = [
  { source: 'From a YouTube talk', title: examples[0].title, prompt: examples[0].prompt, verdict: 'uncertain', skill: 'kid-usability-check',
    lines: ['Read src/screens/Start.tsx', 'Searched src/ for "signup" and skipped the parent flow', 'Read src/screens/Levels.tsx', 'Found two obstacles but could not tell which one comes first'],
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', lesson: 'Asking for the on-screen text made it name one obstacle instead of guessing.' } },
  { source: 'Sample X post', title: 'Make the agent review its own diff first', prompt: 'Before you tell me you are done, review your own diff as a strict reviewer. List problems by severity and explain the serious ones. Make no changes.', verdict: 'pass', skill: 'self-review',
    lines: ['Ran git diff against main', 'Read the three changed files', 'Listed 1 serious and 3 minor problems with reasons'] },
  { source: 'From an agent workflow video', title: examples[1].title, prompt: examples[1].prompt, verdict: 'pass', skill: 'instruction-trace',
    lines: ['Read AGENTS.md and CLAUDE.md', 'Found an outdated line about running every test', 'Proposed a one-line change'] },
  { source: 'From a saved prompt', title: examples[2].title, prompt: examples[2].prompt, verdict: 'pass', skill: 'playtest-ten',
    lines: ['Read the game loop and level data', 'Traced the first five minutes of play', 'Ranked ten improvements with reasons'] },
];

function trySection() {
  return `<section class="r3-section r3-try-section" id="r3-try" aria-labelledby="r3-try-title">
    <div class="r3-head">
      <h2 id="r3-try-title">Saved something?<br>Swipe it into a test.</h2>
      <p>Right runs the prompt on your own repo through the Codex or Claude Code you're already signed into. It's read-only, so nothing in your code changes. You see what the agent does and get a verdict in minutes. Left archives it.</p>
    </div>
    <div class="r3-try">
      <div class="r3-stack-wrap">
        <p class="r3-hint r3-hint-left" aria-hidden="true">← archive</p><p class="r3-hint r3-hint-right" aria-hidden="true">test it →</p>
        <div class="r3-stack" data-stack tabindex="0" role="group" aria-label="Saved ideas. Use the buttons below, or the left and right arrow keys while this is focused."></div>
        <div class="r3-stack-buttons"><button type="button" class="r3-ui-button r3-quiet" data-archive>Archive</button><button type="button" class="r3-ui-button" data-test>Test on my repo</button></div>
        <p class="r3-small">Sample saved ideas. Three are real prompts from a Kiln library, shortened.</p>
      </div>
      <div class="r3-ui r3-run" data-run aria-live="polite"></div>
    </div>
    <div class="r3-toast" data-toast hidden><span>Archived.</span><button type="button" data-undo>Undo</button></div>
  </section>`;
}

function loopSection() {
  return `<section class="r3-section r3-loop-section" aria-labelledby="r3-loop-title">
    <div class="r3-head r3-head-center"><h2 id="r3-loop-title">Two jobs, one loop.</h2>
    <p>Every skill on your panel passed a test on your own code. Every copy your agents load is on the panel. That's the whole idea.</p></div>
    <div class="r3-drawable">${loopSketch()}${loopSketchTall()}</div>
  </section>`;
}

function factsSection() {
  const facts = [
    ['Uses what you already pay for', 'Runs through your signed-in Codex or Claude Code. No API key, no extra API bill. Your plan\'s usage limits still apply.'],
    ['Tests never touch your code', 'Experiments are read-only. The agent says pass, fail or uncertain; whether you keep it is your call, recorded separately.'],
    ['Approval pins the exact version', 'Edit a skill and you get a new draft; the approved one stays installed. Approvals publish to your own Kiln GitHub repo.'],
    ['Same setup on your other machine', 'Open your Kiln repo there and install everything marked for that machine in one go.'],
    ['Capture in a keystroke', 'Ctrl+Shift+Space from anywhere. Paste a post, a screenshot or a file. A YouTube link becomes prompts with timestamped sources.'],
    ['Config files in the same place', 'CLAUDE.md, AGENTS.md, settings, hooks and MCP config, edited where they live, with 30 backups to roll back to.'],
  ];
  return `<section class="r3-section r3-facts" aria-labelledby="r3-facts-title">
    <h2 id="r3-facts-title" class="r3-facts-title">The details</h2>
    <dl>${facts.map(([term, text]) => `<div><dt>${term}</dt><dd>${text}</dd></div>`).join('')}</dl>
  </section>
  <section class="r3-section r3-get" id="r3-get" aria-labelledby="r3-get-title">
    <h2 id="r3-get-title">Put your skills on one panel.<br>Try your first saved idea tonight.</h2>
    ${download()}
    <p class="r3-small">Kiln 0.17.0 for Windows, with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository: sign in with an account that has access. Unsigned build. MIT licensed.</p>
  </section>`;
}

// ---------- heroes ----------

function heroFrame(title: string, text: string, link: string, before: string, sketch: string, after: string, mini: string) {
  return `<section class="r3-hero" aria-labelledby="r3-title">
    <h1 id="r3-title">${title}</h1>
    <div class="r3-hero-body">
      <div class="r3-hero-copy"><p>${text}</p><div class="r3-actions">${download()}${link}</div></div>
      <div class="r3-hero-art r3-drawable">
        <figure class="r3-before"><figcaption class="r3-art-label">${before}</figcaption>${sketch}</figure>
        ${heroArrow()}
        <figure class="r3-after"><figcaption class="r3-art-label">${after}</figcaption>${mini}</figure>
      </div>
    </div>
  </section>`;
}

function heroLibrary() {
  return heroFrame('Every agent skill you have.<br>One switch each.',
    'Your skills are scattered across <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and every project\'s <code>.github/skills</code>: duplicates, old versions, copies someone edited by hand. Kiln puts them on one panel. And before a new idea joins them, you test it on your own repo.',
    '<a class="r3-link" href="#r3-panel">See the panel</a>', 'your folders today', foldersSketch(), 'in Kiln', miniPanel());
}

function heroTesting() {
  return heroFrame('You saved it.<br>Find out if it works. Now.',
    'Kiln runs the prompt you bookmarked on your own repo, through the Codex or Claude Code you already use. It\'s read-only, you watch it work, and you get a verdict in minutes. The ones that pass become skills, and every skill you keep sits on one panel.',
    '<a class="r3-link" href="#r3-try">Try one here</a>', 'saved for later', bookmarksSketch(), 'tried in Kiln', miniRun());
}

function heroBoth() {
  reseed(5);
  return `<section class="r3-hero r3-hero-both" aria-labelledby="r3-title">
    <h1 id="r3-title"><span>Keep what works.</span><span>Test what's new.</span></h1>
    <div class="r3-both r3-drawable">
      <div class="r3-both-side"><p>Every skill folder your agents read, on one panel with a switch per location. Duplicates and hand-edited copies show up.</p>${miniPanel()}</div>
      <div class="r3-both-side"><p>Every idea you saved, one swipe from a read-only test on your own repo, with a verdict in minutes.</p>${miniRun()}</div>
      <svg class="r3-both-arrow" viewBox="0 0 200 90" aria-hidden="true">${stroke(arrow(186, 30, 16, 40, 34, 15), 'r', 4)}${label(100, 86, 'passes land here', 'r', 6, 20, 0, 'middle')}</svg>
    </div>
    <div class="r3-actions r3-actions-center">${download()}<a class="r3-link" href="#r3-panel">See the panel</a><a class="r3-link" href="#r3-try">Try an idea</a></div>
  </section>`;
}

// ---------- page ----------

export function page(root: HTMLElement, story: Story) {
  document.title = { library: 'Kiln — Every agent skill you have. One switch each.', testing: 'Kiln — You saved it. Find out if it works.', both: 'Kiln — Keep what works. Test what\'s new.' }[story];
  const hero = { library: heroLibrary, testing: heroTesting, both: heroBoth }[story]();
  const middle = story === 'testing' ? trySection() + panelSection() : panelSection() + trySection();
  root.innerHTML = `<div class="r3">
    <header class="r3-top"><a class="r3-brand" href="#main">Kiln</a><nav aria-label="Main navigation"><a href="#r3-panel">The panel</a><a href="#r3-try">Try an idea</a><a href="#r3-get">Download</a></nav></header>
    <main id="main">${hero}${middle}${loopSection()}${factsSection()}</main>
  </div>`;
  bindDrawing(root);
  const panel = bindPanel(root);
  bindTry(root, panel, story);
}

function bindDrawing(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('.r3-drawable');
  if (navigator.webdriver || !('IntersectionObserver' in window)) { targets.forEach(target => target.classList.add('is-drawn')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); observer.unobserve(entry.target); }
  }), { threshold: .25 });
  targets.forEach(target => observer.observe(target));
}

function bindPanel(root: HTMLElement) {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foundList = root.querySelector<HTMLElement>('[data-found]')!;
  const stateText: Record<Cell, string> = { on: 'Installed', off: 'Off', edited: 'Edited by hand' };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const render = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="r3-switch r3-switch-${state}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${stateText[state]}" aria-pressed="${state !== 'off'}"><i></i></button></td>`;
    }).join('')}</tr>`).join('');
    foundList.innerHTML = found.map((item, f) => `<li><div><b>${item.name}</b><small>${item.where}. ${item.text}</small></div><button type="button" class="r3-ui-button r3-quiet" data-found="${f}">${item.kind === 'duplicate' ? 'Remove duplicate' : 'Import as draft'}</button></li>`).join('') || '<li class="r3-empty">Nothing left outside your library.</li>';
    const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
    context.textContent = `Loaded into every new session: ${count('claude')} skills in Claude Code, ${count('agents')} in Codex.`;
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.r3-switch');
    if (!button) return;
    const row = rows[Number(button.dataset.row)], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('This copy was changed outside Kiln. Compare it first.'); compare.querySelector('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed ${column.path}/${row.name}. The skill and its history stay in your library.` : `Installed ${row.note.replace('approved ', '')} of ${row.name} into ${column.path}. Install receipt saved.`);
    render();
    body.querySelector<HTMLButtonElement>(`[data-row="${button.dataset.row}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-compare-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; render();
    say('Moved the hand-edited copy to a private backup and installed approved rev 3.');
  });
  compare.querySelector('[data-compare-keep]')!.addEventListener('click', () => {
    rows[0].note = 'approved rev 3, draft rev 4'; compare.hidden = true; render();
    say('Saved the edit as draft rev 4. Approve it when you trust it; until then rev 3 stays the approved version.');
  });
  foundList.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-found]');
    if (!button) return;
    const [item] = found.splice(Number(button.dataset.found), 1);
    if (item.kind === 'duplicate') say(`Moved ${item.name} to a private backup. One code-review left in ~/.claude/skills.`);
    else { rows.push({ name: item.name, note: 'draft, imported', cells: { claude: 'off', agents: 'off', project: 'off' }, fresh: true }); say(`Imported ${item.name} as a draft. The original folder stays where it was.`); }
    render();
  });
  render();
  return {
    add(name: string) {
      rows.forEach(row => { row.fresh = false; });
      rows.push({ name, note: 'approved rev 1, just now', cells: { claude: 'on', agents: 'on', project: 'off' }, fresh: true });
      render();
      say(`Approved ${name} and installed it for Claude Code and Codex.`);
    },
  };
}

function bindTry(root: HTMLElement, panel: { add(name: string): void }, story: Story) {
  const stack = root.querySelector<HTMLElement>('[data-stack]')!;
  const run = root.querySelector<HTMLElement>('[data-run]')!;
  const toast = root.querySelector<HTMLElement>('[data-toast]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let deck = cards.map((_, index) => index), archived: number[] = [], busy = false, toastTimer = 0;
  const idle = () => { run.innerHTML = `<div class="r3-run-idle"><p class="r3-hand">Swipe a card right<br>and watch it run here.</p><p class="r3-small">Nothing runs on this page; it replays a sample.</p></div>`; };
  const renderStack = () => {
    stack.innerHTML = deck.length ? deck.slice(0, 3).map((cardIndex, depth) => {
      const card = cards[cardIndex];
      return `<article class="r3-card" style="--depth:${depth}" ${depth ? 'aria-hidden="true"' : 'data-top'}><small>${card.source}</small><h3>${card.title}</h3><p>${card.prompt}</p></article>`;
    }).reverse().join('') : `<div class="r3-card r3-card-empty"><p class="r3-hand">That's the pile.</p><button type="button" class="r3-ui-button" data-deal>Deal them again</button></div>`;
    stack.querySelector('[data-deal]')?.addEventListener('click', () => { deck = cards.map((_, index) => index); archived = []; renderStack(); idle(); });
    bindDrag();
  };
  const top = () => stack.querySelector<HTMLElement>('.r3-card[data-top]');
  const fling = (direction: 1 | -1) => {
    const card = top();
    if (busy || !card || !deck.length) return;
    busy = true;
    card.style.transition = reduced ? 'none' : 'transform .38s cubic-bezier(.3,.7,.4,1), opacity .38s';
    card.style.transform = `translate(${direction * 130}%, -4%) rotate(${direction * 16}deg)`;
    card.style.opacity = '0';
    const cardIndex = deck.shift()!;
    setTimeout(() => {
      busy = false; renderStack();
      if (direction === 1) play(cardIndex);
      else { archived.push(cardIndex); showToast(); }
    }, reduced ? 0 : 360);
  };
  const showToast = () => {
    toast.hidden = false; clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 6000);
  };
  toast.querySelector('[data-undo]')!.addEventListener('click', () => { const last = archived.pop(); if (last !== undefined) { deck.unshift(last); renderStack(); } toast.hidden = true; });
  function bindDrag() {
    const card = top();
    if (!card) return;
    let startX = 0, startY = 0, dx = 0, lastX = 0, lastT = 0, velocity = 0, dragging = false;
    card.addEventListener('pointerdown', event => {
      if (busy || (event.pointerType === 'mouse' && event.button !== 0)) return;
      dragging = true; startX = lastX = event.clientX; startY = event.clientY; lastT = performance.now(); dx = 0;
      card.setPointerCapture(event.pointerId); card.style.transition = 'none';
    });
    card.addEventListener('pointermove', event => {
      if (!dragging) return;
      dx = event.clientX - startX;
      const now = performance.now(); velocity = (event.clientX - lastX) / Math.max(1, now - lastT); lastX = event.clientX; lastT = now;
      card.style.transform = `translate(${dx}px, ${(event.clientY - startY) * .2}px) rotate(${dx / 18}deg)`;
      stack.dataset.lean = dx > 40 ? 'right' : dx < -40 ? 'left' : '';
    });
    const end = () => {
      if (!dragging) return;
      dragging = false; stack.dataset.lean = '';
      if (dx > 110 || (velocity > .6 && dx > 30)) return fling(1);
      if (dx < -110 || (velocity < -.6 && dx < -30)) return fling(-1);
      card.style.transition = 'transform .45s cubic-bezier(.2,1.6,.4,1)'; card.style.transform = '';
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
  }
  stack.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); fling(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); fling(-1); }
  });
  root.querySelector('[data-test]')!.addEventListener('click', () => fling(1));
  root.querySelector('[data-archive]')!.addEventListener('click', () => fling(-1));

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
  async function play(cardIndex: number, revision = 1) {
    const card = cards[cardIndex], verdict = revision > 1 ? 'pass' : card.verdict;
    run.innerHTML = `<div class="r3-ui-bar"><b>Testing: ${card.title}</b><span>rev ${revision}</span></div>
      <p class="r3-run-meta">~/code/my-game, read-only. Claude Code, your subscription.</p>
      <ol class="r3-run-lines" data-lines></ol>
      <p class="r3-run-meta" data-tokens>0 tokens in, 0 out</p>
      <div data-outcome></div>`;
    run.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    const list = run.querySelector('[data-lines]')!, tokens = run.querySelector('[data-tokens]')!;
    for (const [index, text] of card.lines.entries()) {
      await wait(520);
      list.insertAdjacentHTML('beforeend', `<li>${revision > 1 && index === card.lines.length - 1 ? 'Named the first obstacle and quoted the button text' : text}</li>`);
      tokens.textContent = `${(6.2 * (index + 1)).toFixed(1)}k tokens in, ${(0.4 * (index + 1)).toFixed(1)}k out (sample)`;
    }
    await wait(450);
    const outcome = run.querySelector<HTMLElement>('[data-outcome]')!;
    if (verdict === 'uncertain' && card.fix) {
      outcome.innerHTML = `<p><span class="r3-verdict r3-verdict-uncertain">Uncertain</span> The agent's call. It found two obstacles and couldn't say which comes first.</p>
        <p class="r3-run-meta">Change one line and run it again on the same repo:</p>
        <div class="r3-diff"><p class="r3-del">− ${card.fix.before}</p><p class="r3-add">+ ${card.fix.after}</p></div>
        <div class="r3-row-actions"><button type="button" class="r3-ui-button" data-rerun>Run rev 2</button></div>`;
      outcome.querySelector('[data-rerun]')!.addEventListener('click', () => play(cardIndex, 2));
      return;
    }
    const lesson = revision > 1 && card.fix ? `<p class="r3-hand r3-lesson">${card.fix.lesson}</p>` : '';
    outcome.innerHTML = `<p><span class="r3-verdict r3-verdict-pass">Pass</span> The agent's call. Keeping it is yours.</p>${lesson}
      <div class="r3-row-actions"><button type="button" class="r3-ui-button" data-keep>Approve and install as ${card.skill}</button><button type="button" class="r3-ui-button r3-quiet" data-skip>Not for me</button></div>`;
    outcome.querySelector('[data-keep]')!.addEventListener('click', () => {
      panel.add(card.skill);
      outcome.innerHTML = `<p class="r3-hand r3-landed">${card.skill} is on your panel now. <a href="#r3-panel">${story === 'testing' ? 'See it below ↓' : 'See it above ↑'}</a></p>`;
    });
    outcome.querySelector('[data-skip]')!.addEventListener('click', idle);
  }
  renderStack();
  idle();
}
