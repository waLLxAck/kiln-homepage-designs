// PROTOTYPE round 4, H06 — Chalk lesson. Testing first, framed as learning to prompt. The teacher's chalk writes the lesson
// line by line; Kiln appears as crisp slides on a pull-down screen. Lesson 1: run, fix one line on the board, re-run. Lesson 2: the panel.
import './style.css';
import { examples, installer } from '../../content';
import { arrow, cross, ellipse, folder, line, reseed } from '../r3-kit/rough';

type Chalk = 'w' | 'y' | 'p' | 'b' | 'g';
const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Chalk strokes: rough paths that draw themselves once their container is `.is-written`.
let strokeIndex = 0;
const chalk = (d: string, ink: Chalk = 'w', width = 3) => `<path d="${d}" class="h6-s h6-${ink}" stroke-width="${width}" pathLength="1" style="--i:${strokeIndex++}"/>`;
const word = (x: number, y: number, text: string, ink: Chalk = 'w', size = 22, rot = 0, anchor = 'start') =>
  `<text x="${x}" y="${y}" class="h6-st h6-${ink}t" font-size="${size}" text-anchor="${anchor}" style="--i:${strokeIndex++}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''}>${text}</text>`;
/** One line of chalk writing. The page writes these one after another when they scroll into view. */
const l = (text: string, ink: Chalk = 'w', tag = 'p', extra = '') => `<${tag} class="h6-l h6-${ink}"${extra}>${text}</${tag}>`;

// ---------- art ----------

function tally() {
  reseed(11); strokeIndex = 0;
  let marks = '';
  for (let g = 0; g < 4; g++) {
    const x0 = 20 + g * 74;
    for (let k = 0; k < 4; k++) marks += chalk(line(x0 + k * 12, 18, x0 + k * 12 + 2, 70, 1.6), 'w', 3.2);
    marks += chalk(line(x0 - 8, 62, x0 + 50, 26, 1.6), 'w', 3.2);
  }
  for (let k = 0; k < 3; k++) marks += chalk(line(316 + k * 12, 18, 318 + k * 12, 70, 1.6), 'w', 3.2);
  return `<svg class="h6-tally" viewBox="0 0 380 150" role="img" aria-label="Tally marks: saved for later, twenty-three. Tried: zero, circled in pink.">
    ${marks}
    ${word(20, 118, 'tried:', 'p', 30)}${word(112, 120, '0', 'p', 38)}${chalk(ellipse(122, 107, 26, 24, .08, 1.12), 'p', 2.6)}
    ${word(180, 122, '(be honest)', 'w', 22, -3)}
  </svg>`;
}

function foldersArt() {
  reseed(29); strokeIndex = 0;
  const item = (x: number, y: number, text: string, ink: Chalk = 'w') => word(x, y, text, ink, 20);
  return `<svg class="h6-folders" viewBox="0 0 560 360" role="img" aria-label="Chalk drawing: three skill folders. ~/.claude/skills holds code-review and code-review (1); ~/.agents/skills holds code-review and an old link; my-game/.github/skills holds code-review-FINAL. A pink note asks which one is current, and a yellow note says every one rides along in context.">
    ${chalk(folder(14, 40, 230, 124))}${word(20, 28, '~/.claude/skills', 'b', 20)}
    ${item(34, 84, 'code-review')}${item(34, 110, 'code-review (1)', 'p')}${item(34, 136, 'research')}
    ${chalk(folder(300, 20, 240, 124))}${word(306, 10, '~/.agents/skills', 'b', 20)}
    ${item(320, 64, 'code-review')}${item(320, 90, 'writing-for-agents')}${item(344, 118, 'old-link', 'p')}${chalk(cross(330, 112, 7), 'p', 2.6)}
    ${chalk(folder(60, 214, 250, 104))}${word(66, 202, 'my-game/.github/skills', 'b', 20)}
    ${item(80, 258, 'code-review-FINAL')}${item(80, 284, 'playtest ??')}
    ${chalk(ellipse(102, 104, 84, 17, .06), 'p', 2.6)}${word(336, 196, 'which one is current?', 'p', 22, -4)}
    ${chalk(arrow(330, 184, 196, 112, -22, 12), 'p', 2.6)}
    ${word(350, 262, 'every one of these', 'y', 21, -2)}${word(350, 288, 'rides along in context,', 'y', 21, -2)}${word(350, 314, 'every turn', 'y', 21, -2)}
    ${chalk(line(350, 322, 446, 319, 1), 'y', 2.4)}
  </svg>`;
}

function foldersArtTall() {
  reseed(31); strokeIndex = 0;
  const item = (x: number, y: number, text: string, ink: Chalk = 'w') => word(x, y, text, ink, 21);
  return `<svg class="h6-folders h6-folders-tall" viewBox="0 0 340 600" role="img" aria-label="Chalk drawing: three skill folders stacked. ~/.claude/skills holds code-review and code-review (1); ~/.agents/skills holds code-review and an old link; my-game/.github/skills holds code-review-FINAL. Notes ask which one is current and say every one rides along in context.">
    ${chalk(folder(10, 40, 236, 124))}${word(16, 28, '~/.claude/skills', 'b', 21)}
    ${item(30, 86, 'code-review')}${item(30, 113, 'code-review (1)', 'p')}${item(30, 140, 'research')}
    ${chalk(ellipse(100, 106, 86, 17, .06), 'p', 2.6)}${word(254, 70, 'which', 'p', 22, -6)}${word(254, 94, 'one is', 'p', 22, -6)}${word(254, 118, 'current?', 'p', 22, -6)}
    ${chalk(folder(70, 214, 250, 124))}${word(76, 202, '~/.agents/skills', 'b', 21)}
    ${item(90, 258, 'code-review')}${item(90, 285, 'writing-for-agents')}${item(112, 313, 'old-link', 'p')}${chalk(cross(98, 306, 7), 'p', 2.6)}
    ${chalk(folder(10, 388, 262, 100))}${word(16, 376, 'my-game/.github/skills', 'b', 21)}
    ${item(30, 432, 'code-review-FINAL')}${item(30, 459, 'playtest ??')}
    ${word(20, 530, 'every one of these rides along', 'y', 21, -2)}${word(20, 556, 'in context, every turn', 'y', 21, -2)}${chalk(line(20, 566, 200, 562, 1), 'y', 2.4)}
  </svg>`;
}

function ledge() {
  return `<div class="h6-ledge" aria-hidden="true"><i class="h6-stick h6-stick-w"></i><i class="h6-stick h6-stick-y"></i><i class="h6-stick h6-stick-p"></i><i class="h6-eraser"></i></div>`;
}

// ---------- crisp slides ----------

const screen = (content: string, label: string, extra = '') => `<figure class="h6-screen" ${extra}>
  <div class="h6-roller" aria-hidden="true"></div>
  <div class="h6-surface" role="group" aria-label="${label}">${content}<i class="h6-pull" aria-hidden="true"></i></div>
</figure>`;

function heroSlide() {
  const steps = [['Saved', 'from a YouTube talk, 12:41', 'done'], ['Tested', 'on ~/code/my-game, read-only', 'done'], ['Pass', 'the agent’s call; you keep it', 'pass'], ['Skill', 'approved rev 2, installed', 'skill']];
  return `<div class="h6-app">
    <div class="h6-app-bar"><b>Kiln</b><span>Library · Prompt</span></div>
    <div class="h6-hero-card">
      <p class="h6-kicker">Prompt</p>
      <h3>${examples[0].title}</h3>
      <p class="h6-hero-prompt">${examples[0].prompt}</p>
      <ol class="h6-steps">${steps.map(([name, text, kind]) => `<li class="h6-step-${kind}"><b>${name}</b><span>${text}</span></li>`).join('')}</ol>
    </div>
  </div>`;
}

const promptLines = [
  'Use this app as a seven-year-old.',
  'Skip the parent-only signup.',
  'Try different activities until you hit something confusing or can’t tell what to do next.',
  'Describe that first obstacle and suggest a fix.',
  'Make no changes yet.',
];
const fixedLine = 'Describe the first obstacle, quote the text on screen, and suggest a fix.';
const hints = [
  'Keep that one. It’s the whole idea.',
  'That line’s fine: it tells the agent what to skip.',
  'Good instructions. The trouble starts after it finds things.',
  '',
  'Keep it. That’s what makes the test safe to run.',
];

function runSlide() {
  return `<div class="h6-app h6-run" data-run>
    <div class="h6-app-bar"><b>Kiln</b><span>Test run · <span data-rev>rev 1</span></span></div>
    <dl class="h6-ctx">
      <div><dt>Prompt</dt><dd>${examples[0].title}</dd></div>
      <div><dt>Project</dt><dd>~/code/my-game <i class="h6-badge">read-only</i></dd></div>
      <div><dt>Agent</dt><dd>Claude Code, your subscription · default model, medium effort</dd></div>
    </dl>
    <div class="h6-diff" data-diff hidden><p class="h6-del">− ${promptLines[3]}</p><p class="h6-add">+ ${fixedLine}</p></div>
    <ol class="h6-log" data-log><li class="h6-log-idle">Press run. The agent reads your repo; nothing in it changes.</li></ol>
    <p class="h6-meter" data-meter>0:00 · 0 in · 0 cached · 0 out</p>
    <div class="h6-verdict" data-verdict aria-live="polite"></div>
    <div class="h6-actions" data-actions><button type="button" class="h6-btn" data-go>Run rev 1 on my-game</button></div>
  </div>`;
}

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

function panelSlide() {
  return `<div class="h6-app h6-panel">
    <div class="h6-app-bar"><b>Kiln</b><span>Skills · sample library</span></div>
    <div class="h6-table"><table>
      <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h6-long">${column.name}</span><span class="h6-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
      <tbody data-rows></tbody>
    </table></div>
    <div class="h6-compare" data-compare hidden>
      <p><b>~/.claude/skills/code-review</b> was edited outside Kiln.</p>
      <div class="h6-diff"><p class="h6-del">− Review standards and the specification separately.</p><p class="h6-add">+ Review the specification only.</p></div>
      <div class="h6-row-actions"><button type="button" class="h6-btn" data-replace>Replace with approved rev 3</button><button type="button" class="h6-btn h6-btn-quiet" data-keep>Keep the edit as a draft</button></div>
    </div>
    <p class="h6-panel-foot"><span data-context></span><span class="h6-status" data-status aria-live="polite">Flip a switch.</span></p>
  </div>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = 'Kiln — Prompting, lesson 1: stop saving, start testing';
  root.innerHTML = `<div class="h6">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
      <filter id="h6-chalk" x="-5%" y="-10%" width="110%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.05" result="grain"/>
        <feComposite in="SourceGraphic" in2="grain" operator="in" result="c"/>
        <feDisplacementMap in="c" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs></svg>
    <div class="h6-ghost" aria-hidden="true"><span>Lesson 0: save it for later</span><span>bookmark everything</span><span>∑ prompts ≠ skills</span></div>
    <header class="h6-top"><a class="h6-brand" href="#main">Kiln</a><nav aria-label="Main navigation"><a href="#h6-l1">Lesson 1</a><a href="#h6-l2">Lesson 2</a><a href="#h6-get">Homework</a></nav></header>
    <main id="main">
      <section class="h6-hero" aria-labelledby="h6-title">
        <div class="h6-hero-board h6-write">
          ${l('Tuesday. Bring one saved prompt.', 'b', 'p', ' data-small')}
          <h1 id="h6-title">${l('Prompting, lesson 1:', 'w', 'span')}${l('stop saving,', 'y', 'span')}${l('start testing.', 'y', 'span')}</h1>
          ${l('You’ve saved posts, videos and someone’s CLAUDE.md, all “for later”. Today we take one and see if it works on your own code.')}
          <figure class="h6-hero-tally">${l('saved for later this year:', 'w', 'figcaption')}${tally()}</figure>
        </div>
        <div class="h6-hero-side">
          ${screen(heroSlide(), 'Kiln slide: a saved prompt, tested on your repo, passed, and approved as a skill')}
          <div class="h6-hero-actions"><a class="h6-download" href="${installer}">${windows}<span>Download Kiln for Windows</span></a><a class="h6-chalk-link" href="#h6-l1">Start lesson 1 ↓</a></div>
          <p class="h6-under">Kiln is a Windows app. It runs your prompt through the Codex or Claude Code you already use.</p>
        </div>
      </section>

      <section class="h6-lesson" id="h6-l1" aria-labelledby="h6-l1-title">
        <div class="h6-head h6-write">
          <h2 id="h6-l1-title">${l('Exercise: run it before you trust it', 'w', 'span')}</h2>
          <ol class="h6-plan">${l('Take the prompt on the board. It came from a YouTube talk.', 'w', 'li')}${l('Run it on the screen, on a sample repo. Tests are read-only.', 'w', 'li')}${l('Read the verdict. If it’s shaky, fix one line and run it again.', 'w', 'li')}</ol>
        </div>
        <div class="h6-exercise">
          <div class="h6-board-prompt h6-write" data-board>
            ${l('the prompt, rev <span data-board-rev>1</span>', 'b', 'p', ' data-small')}
            <ol class="h6-lines" data-lines>${promptLines.map((text, i) => `<li class="h6-line" data-line="${i}"><button type="button" class="h6-line-btn" data-pick="${i}" disabled><span class="h6-l h6-w">${text}</span></button></li>`).join('')}</ol>
            <div class="h6-teacher" data-teacher aria-live="polite"></div>
          </div>
          ${screen(runSlide(), 'Kiln slide: a test run', 'data-run-screen')}
        </div>
        <div class="h6-learned h6-write" data-learned hidden>
          ${l('What changed', 'g', 'h3')}
          ${l('Rev 1 said “that first obstacle” and never said how to tell which is first. It found two and couldn’t pick.', 'w')}
          ${l('Rev 2 asked it to quote the screen. It named one obstacle and stopped guessing.', 'w')}
          ${l('One line. Same repo. That’s how you learn prompting: change one thing, run it, compare.', 'y')}
        </div>
        <div class="h6-rules h6-write">
          ${l('Class rules', 'b', 'h3')}
          <ul>
            ${l('Test it the day you save it. On your own repo. Nothing in your code changes.', 'w', 'li')}
            ${l('The verdict is the agent’s. Pass, fail or uncertain. Keeping it is your call.', 'w', 'li')}
            ${l('Uncertain isn’t failure. Tasks that need edits or missing tools come back uncertain, never a fake pass.', 'w', 'li')}
            ${l('Watch it work: messages, commands, model, effort, time and tokens, on every run.', 'w', 'li')}
          </ul>
        </div>
      </section>

      <section class="h6-lesson h6-lesson-2" id="h6-l2" aria-labelledby="h6-l2-title">
        <div class="h6-head h6-write">
          <h2 id="h6-l2-title">${l('Lesson 2: where skills live', 'w', 'span')}</h2>
          ${l('A prompt that passes becomes a skill. Skills are folders your agents read. Most of us have too many, in too many places.')}
        </div>
        <div class="h6-l2">
          <div class="h6-l2-board">
            <figure class="h6-folders-fig h6-write">${foldersArt()}${foldersArtTall()}</figure>
            <div class="h6-key h6-write">
              ${l('How to read the screen', 'b', 'h3')}
              <ul>
                ${l('<b class="h6-g">green</b> installed from the version you approved', 'w', 'li')}
                ${l('<b class="h6-y">amber</b> someone edited that copy by hand; compare before you replace it', 'w', 'li')}
                ${l('<b class="h6-p">off</b> gone from that agent’s context; your library still keeps it', 'w', 'li')}
              </ul>
              ${l('Kiln finds every folder your agents read, on this machine and in your projects. Import what’s there; the originals stay put.', 'w', 'p')}
            </div>
          </div>
          ${screen(panelSlide(), 'Kiln slide: the skills panel, one switch per skill per location', 'data-panel-screen')}
        </div>
      </section>

      <section class="h6-get" id="h6-get" aria-labelledby="h6-get-title">
        <div class="h6-write">
          <h2 id="h6-get-title">${l('Homework: test one saved prompt tonight.', 'w', 'span')}</h2>
          ${l('Import the skills you already have (the originals stay put), then run the prompt you bookmarked last week on your own repo.')}
        </div>
        <div class="h6-get-row">
          <div class="h6-get-cta"><a class="h6-download" href="${installer}">${windows}<span>Download Kiln 0.17.0 for Windows</span></a>
            <p class="h6-fine">Works with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository: sign in with an account that has access. Unsigned build. MIT licensed.</p></div>
          <dl class="h6-faq h6-write">
            <div>${l('No API key', 'y', 'dt')}${l('It uses your signed-in Codex or Claude Code. Your plan’s limits apply; editing and installing never call a model.', 'w', 'dd')}</div>
            <div>${l('Approval pins a version', 'y', 'dt')}${l('Approving publishes that exact revision to your own Kiln GitHub repo. Edits become new drafts.', 'w', 'dd')}</div>
            <div>${l('Capture in a keystroke', 'y', 'dt')}${l('Ctrl+Shift+Space from anywhere. A YouTube link becomes prompts with timestamped sources.', 'w', 'dd')}</div>
            <div>${l('Your other machine', 'y', 'dt')}${l('Open your Kiln repo there and install everything marked for it in one go.', 'w', 'dd')}</div>
          </dl>
        </div>
        ${ledge()}
      </section>
    </main>
  </div>`;
  bindWriting(root);
  bindScreens(root);
  const panel = bindPanel(root);
  bindExercise(root, panel);
}

// ---------- chalk writing ----------

function schedule(block: HTMLElement) {
  let delay = 0;
  block.querySelectorAll<HTMLElement>('.h6-l').forEach(el => {
    if (el.closest('.h6-write') !== block) return;
    const length = (el.textContent ?? '').length;
    const duration = Math.min(1400, 260 + length * 16);
    el.style.setProperty('--d', `${delay}ms`); el.style.setProperty('--t', `${duration}ms`);
    delay += duration + 120;
  });
  block.style.setProperty('--after', `${delay}ms`);
}

function bindWriting(root: HTMLElement) {
  const blocks = root.querySelectorAll<HTMLElement>('.h6-write');
  blocks.forEach(schedule);
  if (navigator.webdriver || !('IntersectionObserver' in window)) { blocks.forEach(block => block.classList.add('is-written')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-written'); observer.unobserve(entry.target); }
  }), { threshold: .3 });
  blocks.forEach(block => observer.observe(block));
}

function bindScreens(root: HTMLElement) {
  const screens = root.querySelectorAll<HTMLElement>('.h6-screen');
  if (navigator.webdriver || !('IntersectionObserver' in window)) { screens.forEach(s => s.classList.add('is-down')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-down'); observer.unobserve(entry.target); }
  }), { threshold: .2 });
  screens.forEach(s => observer.observe(s));
}

/** Rewrites a chalk line: an eraser sweeps it away, leaves a smudge, then the new text is written in. */
async function rewrite(target: HTMLElement, text: string, ink: Chalk) {
  const quick = reduced();
  const li = target.closest('li')!;
  li.classList.add('is-erasing');
  await wait(quick ? 0 : 700);
  target.className = `h6-l h6-${ink}`;
  target.textContent = text;
  target.style.setProperty('--d', '0ms'); target.style.setProperty('--t', `${Math.min(1600, 260 + text.length * 16)}ms`);
  li.classList.remove('is-erasing'); li.classList.add('is-smudged', 'is-rewriting');
  void target.offsetWidth;
  li.classList.remove('is-rewriting');
  await wait(quick ? 0 : 260 + text.length * 16);
}

/** Writes a teacher's note into a container, line by line. */
function teacherSays(box: HTMLElement, lines: [string, Chalk][]) {
  box.innerHTML = `<div class="h6-write">${lines.map(([text, ink]) => l(text, ink)).join('')}</div>`;
  const block = box.firstElementChild as HTMLElement;
  schedule(block);
  requestAnimationFrame(() => requestAnimationFrame(() => block.classList.add('is-written')));
}

// ---------- lesson 1: the exercise ----------

type Panel = ReturnType<typeof bindPanel>;

function bindExercise(root: HTMLElement, panel: Panel) {
  const run = root.querySelector<HTMLElement>('[data-run]')!;
  const log = run.querySelector<HTMLElement>('[data-log]')!;
  const meter = run.querySelector<HTMLElement>('[data-meter]')!;
  const verdict = run.querySelector<HTMLElement>('[data-verdict]')!;
  const actions = run.querySelector<HTMLElement>('[data-actions]')!;
  const diff = run.querySelector<HTMLElement>('[data-diff]')!;
  const revLabel = run.querySelector<HTMLElement>('[data-rev]')!;
  const teacher = root.querySelector<HTMLElement>('[data-teacher]')!;
  const board = root.querySelector<HTMLElement>('[data-board]')!;
  const learned = root.querySelector<HTMLElement>('[data-learned]')!;
  const picks = root.querySelectorAll<HTMLButtonElement>('[data-pick]');
  let rev = 1, running = false;

  const traces: Record<number, string[]> = {
    1: ['Read README.md and package.json', 'Opened src/screens/Start.tsx', 'Searched src/ for "signup" and skipped the parent flow', 'Tried Levels, then Shop', 'Found two confusing spots; can’t tell which comes first'],
    2: ['Read README.md and package.json', 'Opened src/screens/Start.tsx', 'Searched src/ for "signup" and skipped the parent flow', 'Tried Levels, then Shop', 'Quoted the start screen: “Levels”, “Shop” and an unlabeled ▶ icon'],
  };
  const totals: Record<number, [number, number, number, number]> = { 1: [171, 38.4, 24.1, 1.9], 2: [184, 40.2, 26.0, 2.2] };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const button = (label: string, attr: string, quiet = false) => `<button type="button" class="h6-btn${quiet ? ' h6-btn-quiet' : ''}" ${attr}>${label}</button>`;

  async function go() {
    if (running) return;
    running = true;
    actions.innerHTML = button(`Running rev ${rev}…`, 'disabled');
    verdict.innerHTML = '';
    log.innerHTML = '';
    const steps = traces[rev], [secs, tin, tcached, tout] = totals[rev];
    for (let i = 0; i < steps.length; i++) {
      await wait(reduced() ? 0 : 620);
      log.insertAdjacentHTML('beforeend', `<li>${steps[i]}</li>`);
      const f = (i + 1) / steps.length;
      meter.textContent = `${fmt(secs * f)} · ${(tin * f).toFixed(1)}k in · ${(tcached * f).toFixed(1)}k cached · ${(tout * f).toFixed(1)}k out`;
    }
    meter.textContent += ' · sample run, replayed fast';
    await wait(reduced() ? 0 : 400);
    running = false;
    if (rev === 1) uncertain(); else passed();
  }

  function uncertain() {
    verdict.innerHTML = '<p><span class="h6-pill h6-pill-uncertain">Uncertain</span> the agent’s assessment</p><p class="h6-out">Found two obstacles on the start screen and couldn’t say which a child would hit first.</p>';
    actions.innerHTML = '<p class="h6-wait-note">Fix a line on the board, then run it again.</p>';
    board.classList.add('is-picking');
    picks.forEach(pick => { pick.disabled = false; });
    teacherSays(teacher, [['Uncertain. Good: it didn’t fake a pass.', 'y'], ['One line asked for “that first obstacle” and never said how to tell. Which one? Tap it.', 'w']]);
    if (!matchMedia('(min-width: 900px)').matches) board.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
  }

  picks.forEach(pick => pick.addEventListener('click', async () => {
    const index = Number(pick.dataset.pick);
    if (index !== 3) { teacherSays(teacher, [[hints[index], 'p'], ['Look for the line that says “that first obstacle”.', 'w']]); return; }
    picks.forEach(other => { other.disabled = true; });
    board.classList.remove('is-picking');
    teacher.innerHTML = '';
    await rewrite(pick.querySelector<HTMLElement>('.h6-l')!, fixedLine, 'y');
    rev = 2;
    root.querySelector<HTMLElement>('[data-board-rev]')!.textContent = '2';
    revLabel.textContent = 'rev 2';
    diff.hidden = false;
    log.innerHTML = '<li class="h6-log-idle">Same repo, same agent. Only one line changed.</li>';
    meter.textContent = '0:00 · 0 in · 0 cached · 0 out';
    verdict.innerHTML = '';
    actions.innerHTML = button('Run rev 2 on my-game', 'data-go');
    teacherSays(teacher, [['Now run the same test again.', 'w']]);
    if (!matchMedia('(min-width: 900px)').matches) run.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    actions.querySelector<HTMLButtonElement>('[data-go]')?.focus();
  }));

  function passed() {
    verdict.innerHTML = '<p><span class="h6-pill h6-pill-pass">Pass</span> the agent’s assessment</p><p class="h6-out">“The first thing a seven-year-old hits: the play button is an icon with no label, next to two words. Label it Play.” No changes made.</p>';
    actions.innerHTML = `${button('Approve rev 2 as a skill', 'data-approve')}${button('Not yet', 'data-later', true)}`;
    teacherSays(teacher, [['Pass. Same repo, one line changed.', 'g']]);
    learned.hidden = false;
    schedule(learned);
    requestAnimationFrame(() => requestAnimationFrame(() => learned.classList.add('is-written')));
    actions.querySelector('[data-approve]')!.addEventListener('click', () => {
      panel.add('kid-usability-check');
      actions.innerHTML = '<p class="h6-done">Approved rev 2 as <b>kid-usability-check</b> and installed it for Claude Code and my-game.</p><a class="h6-btn h6-btn-quiet" href="#h6-l2">See it in lesson 2</a>';
      teacherSays(teacher, [['It’s a skill now. Lesson 2 is where it lives.', 'g']]);
    });
    actions.querySelector('[data-later]')!.addEventListener('click', () => {
      actions.innerHTML = `<p class="h6-done">Kept as rev 2, tested. Nothing installed.</p>${button('Approve rev 2 as a skill', 'data-approve')}`;
      actions.querySelector('[data-approve]')!.addEventListener('click', () => {
        panel.add('kid-usability-check');
        actions.innerHTML = '<p class="h6-done">Approved rev 2 as <b>kid-usability-check</b> and installed it for Claude Code and my-game.</p><a class="h6-btn h6-btn-quiet" href="#h6-l2">See it in lesson 2</a>';
      });
    });
  }

  run.addEventListener('click', event => { if ((event.target as Element).closest('[data-go]')) go(); });
}

// ---------- lesson 2: the panel ----------

function bindPanel(root: HTMLElement) {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln' };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  let landed = false;
  const paint = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="h6-switch h6-switch-${state}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${stateText[state]}" aria-pressed="${state !== 'off'}"><i></i></button></td>`;
    }).join('')}</tr>`).join('') + (landed ? '' : `<tr class="h6-slot"><th scope="row" colspan="4"><span>Your skill from lesson 1 lands here.</span> <a href="#h6-l1">Back to the exercise</a></th></tr>`);
    const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
    context.textContent = `Loaded into every new session: ${count('claude')} skills in Claude Code, ${count('agents')} in Codex.`;
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h6-switch');
    if (!button) return;
    const row = rows[Number(button.dataset.row)], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('That copy changed outside Kiln. Compare it first.'); compare.querySelector('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed ${row.name} from ${column.path}. Its description is out of context; the skill stays in your library.` : `Installed ${row.note.replace('approved ', '')} of ${row.name} into ${column.path}.`);
    paint();
    body.querySelector<HTMLButtonElement>(`[data-row="${button.dataset.row}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; paint();
    say('Moved the hand-edited copy to a private backup and installed approved rev 3.');
  });
  compare.querySelector('[data-keep]')!.addEventListener('click', () => {
    rows[0].note = 'rev 3 approved, rev 4 draft'; compare.hidden = true; paint();
    say('Saved the edit as draft rev 4. Rev 3 stays approved until you approve rev 4.');
  });
  paint();
  return {
    add(name: string) {
      if (landed) return;
      landed = true;
      rows.forEach(row => { row.fresh = false; });
      rows.push({ name, note: 'approved rev 2, from lesson 1', cells: { claude: 'on', agents: 'off', project: 'on' }, fresh: true });
      paint();
      say(`Installed ${name} for Claude Code and my-game.`);
      root.querySelector('[data-panel-screen]')?.classList.add('has-landed');
    },
  };
}
