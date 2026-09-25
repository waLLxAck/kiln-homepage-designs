// PROTOTYPE round 4, H04: a hand-inked comic. The hero is a four-panel strip whose last panel is broken open by a crisp, dark Kiln
// window. Two bigger panels follow: real switches with speech-balloon annotations, and a "Run it" test whose verdict lands as a sound effect.
import './style.css';
import { examples, installer } from '../../content';
import { defs, panelFour, panelOne, panelThree, panelTwo } from './art';
import { reseed, starburst } from './ink';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const windowsMark = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const bar = (title: string, note = '') => `<div class="h04-ui-bar"><b>${title}</b>${note ? `<span>${note}</span>` : ''}<i class="h04-winctl" aria-hidden="true"><em></em><em></em><em></em></i></div>`;
const tailSvg = '<svg class="h04-tail" viewBox="0 0 30 30" aria-hidden="true"><path class="h04-tail-fill" d="M3,-3.5 L26,-3.5 L6,28 Z"/><path class="h04-tail-line" d="M4,0 L6,28 L26,0"/></svg>';
const balloon = (text: string, tail: string, extra = '') => `<p class="h04-balloon h04-tail-${tail} ${extra}">${text}${tailSvg}</p>`;

// ---------- hero strip ----------

function miniUi() {
  const pill = (state: string) => `<i class="h04-pill h04-pill-${state}"></i>`;
  const row = (name: string, note: string, cells: string[]) => `<span class="h04-mini-name"><b>${name}</b><small>${note}</small></span>${cells.map(pill).join('')}`;
  return `<div class="h04-ui h04-breakout" aria-label="The Kiln window, in crisp product UI: every skill in one list with a switch per location, and a tested prompt marked pass." role="img">
    ${bar('Kiln', 'Skills')}
    <div class="h04-mini-grid"><span></span><small>Claude</small><small>Codex+</small><small>my-game</small>
      ${row('code-review', '3 folders, now 1 skill', ['edited', 'on', 'on'])}
      ${row('research', 'approved rev 2', ['on', 'on', 'off'])}
      ${row('kid-usability-check', 'new, tested today', ['on', 'on', 'off'])}
    </div>
    <p class="h04-mini-test"><span class="h04-chip h04-chip-pass">Pass</span><span>Try it as a seven-year-old<small>Tested on ~/code/my-game, read-only</small></span></p>
  </div>`;
}

function hero() {
  return `<section class="h04-hero" aria-labelledby="h04-title">
    <h1 id="h04-title">It's not a system. It's three <span class="h04-nowrap">code-review</span> folders.</h1>
    <ol class="h04-strip" aria-label="A four-panel comic strip">
      <li class="h04-panel h04-p1">${panelOne()}<p class="h04-cap">Monday, 9:02</p>${balloon('Which one is the real one?', 'bl', 'h04-b1')}</li>
      <li class="h04-panel h04-p2">${panelTwo()}<p class="h04-cap">Monday, 9:04</p>${balloon("Great prompt. I'll try it later.", 'bl', 'h04-b2')}</li>
      <li class="h04-panel h04-p3">${panelThree()}<p class="h04-cap">Tuesday. Enough.</p><p class="h04-sfx h04-sfx-click" aria-hidden="true">Click!</p></li>
      <li class="h04-panel h04-p4">${panelFour()}<p class="h04-cap">Tuesday, 9:06</p>${balloon('...oh.', 'bl', 'h04-b4')}${miniUi()}<svg class="h04-shards" viewBox="0 0 80 60" aria-hidden="true"><path d="M10,40 L22,30 L18,46Z M30,18 L40,10 L38,24Z M4,16 L14,14 L8,24Z M48,36 L58,30 L54,42Z"/></svg></li>
    </ol>
    <div class="h04-hero-foot">
      <p>Kiln puts every agent skill on one panel, with a switch for each place your agents look. And it runs that prompt you bookmarked on your own repo, read-only, so "later" takes about three minutes.</p>
      <div class="h04-actions"><a class="h04-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a><a class="h04-link" href="#h04-folders">Keep reading the comic</a></div>
    </div>
  </section>`;
}

// ---------- part one: the folders (real switches) ----------

type Cell = 'on' | 'off' | 'edited' | 'found';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; imported?: boolean; fresh?: boolean };
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
  { name: 'pr-summary', note: 'found outside your library', cells: { claude: 'off', agents: 'found', project: 'off' } },
];
const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };

function foldersSection() {
  return `<section class="h04-section" id="h04-folders" aria-labelledby="h04-folders-title">
    <div class="h04-head"><p class="h04-part">Part one</p><h2 id="h04-folders-title">The folder situation</h2>
      <p>Kiln finds every skill folder your agents read, on this machine and in your projects, and gives each skill one switch per place. Flip one on and Kiln installs the version you approved. Flip it off and that copy goes. The skill stays in your library either way.</p></div>
    <div class="h04-frame h04-frame-panel">
      <div class="h04-ui h04-panel-ui">
        ${bar('Kiln', 'Skills, sample library')}
        <div class="h04-table-scroll"><table class="h04-table">
          <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h04-long">${column.name}</span><span class="h04-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
          <tbody data-rows></tbody>
        </table></div>
        <div class="h04-pop" data-pop hidden role="dialog" aria-labelledby="h04-pop-title"></div>
        <div class="h04-ui-foot"><p data-context></p><p class="h04-status" data-status aria-live="polite">Flip a switch. Nothing on this page touches your files.</p></div>
      </div>
      <div class="h04-notes">
        ${balloon('<b class="h04-k-on">Green</b> is installed from the version you approved. Very grown-up.', 'l')}
        ${balloon("<b class=\"h04-k-edited\">Amber</b> means someone edited that copy by hand. It was me. It's always me. Click it to compare.", 'l')}
        ${balloon("<b class=\"h04-k-found\">Dashed</b> is a folder Kiln found outside your library. I have no memory of making pr-summary.", 'l')}
        ${balloon("Every installed skill's description rides along in your agent's context, every turn, used or not. Switch off the ones you forgot about.", 'l', 'h04-balloon-wide')}
      </div>
    </div>
    <ul class="h04-ribbon">
      <li>Import what's installed, or a whole skills repo, as drafts. The originals stay where they are.</li>
      <li>See every copy: identical, different, linked, or edited outside Kiln. Compare file by file.</li>
      <li>Approval pins an exact revision and publishes it to your own Kiln repo on GitHub. New machine? "Install everything marked for this machine".</li>
    </ul>
  </section>`;
}

// ---------- part two: the "later" pile (Run it) ----------

type Idea = { title: string; source: string; prompt: string; verdict: 'pass' | 'uncertain'; skill: string; steps: string[]; fix?: { before: string; after: string; step: string; lesson: string } };
const ideas: Idea[] = [
  { title: examples[0].title, source: 'saved from a YouTube talk', prompt: examples[0].prompt, verdict: 'uncertain', skill: 'kid-usability-check',
    steps: ['Read src/screens/Start.tsx', 'Searched src/ for "signup", skipped the parent flow', 'Read src/screens/Levels.tsx', 'Found two confusing spots; not sure which is first'],
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', step: 'Named the first obstacle and quoted the button: "Continue?"', lesson: 'One extra line, and it stopped hedging.' } },
  { title: examples[1].title, source: 'saved from a workflow video', prompt: examples[1].prompt, verdict: 'pass', skill: 'instruction-trace',
    steps: ['Read AGENTS.md and CLAUDE.md', 'Searched for "run every test"', 'Found the outdated line; proposed a one-line change'] },
  { title: examples[2].title, source: 'saved at 11:48 pm, obviously', prompt: examples[2].prompt, verdict: 'pass', skill: 'playtest-ten',
    steps: ['Read the game loop and level data', 'Traced the first five minutes of play', 'Ranked ten improvements, each with a reason'] },
];

function laterSection() {
  return `<section class="h04-section" id="h04-later" aria-labelledby="h04-later-title">
    <div class="h04-head"><p class="h04-part">Part two</p><h2 id="h04-later-title">The "later" pile</h2>
      <p>Pick a prompt you saved, pick a repo, press run. Kiln sends the exact revision through the Codex or Claude Code you're already signed into, and you watch every step. It's read-only, so nothing in your code changes. Then you get a verdict.</p></div>
    <div class="h04-frame h04-frame-test">
      <div class="h04-test-left">
        <div class="h04-ui h04-saved">
          ${bar('Saved for later', 'sample')}
          <div class="h04-chips" role="radiogroup" aria-label="Saved prompts">${ideas.map((idea, n) => `<button type="button" role="radio" aria-checked="${n === 0}" data-pick="${n}" tabindex="${n === 0 ? 0 : -1}">${idea.title}</button>`).join('')}</div>
          <p class="h04-source" data-source></p>
          <p class="h04-prompt" data-prompt></p>
          <p class="h04-where">Runs on <code>~/code/my-game</code> with Claude Code, read-only</p>
          <button type="button" class="h04-run-button" data-run-it>Run it</button>
        </div>
        ${balloon("Go on. It can't change your code. It can only look at it and judge you.", 'tr', 'h04-b-run')}
      </div>
      <div class="h04-test-right">
        <div class="h04-ui h04-log" data-log aria-live="polite"></div>
        <div class="h04-verdict" data-verdict aria-hidden="true"></div>
      </div>
    </div>
  </section>`;
}

// ---------- small print and the end ----------

function endSections() {
  const facts: [string, string][] = [
    ['No API bill', 'Kiln runs through your signed-in Codex or Claude Code, on the ChatGPT or Claude plan you already pay for. Usage limits still apply.'],
    ['Two verdicts', "The agent says pass, fail or uncertain. You decide what to keep, and that's saved separately. Jobs that need edits come back uncertain, not faked."],
    ['Receipts', 'Every run keeps its output, model, reasoning effort, time and token counts (input, cached, output) with the revision you ran.'],
    ['Capture fast', 'Ctrl+Shift+Space from anywhere. Paste a post, drop a screenshot. A YouTube link becomes prompts with timestamped sources.'],
    ['Config files too', 'CLAUDE.md, AGENTS.md, config.toml, hooks, MCP and settings, edited in place with 30 private backups.'],
    ['A CLI for your agents', 'Script collections, experiments, approvals and installs with JSON output. Your agents can read your library through it.'],
  ];
  return `<section class="h04-section" aria-labelledby="h04-print-title">
    <div class="h04-head"><p class="h04-part">Also in this issue</p><h2 id="h04-print-title">The small print, in big panels</h2></div>
    <ul class="h04-facts">${facts.map(([title, text]) => `<li class="h04-frame"><h3>${title}</h3><p>${text}</p></li>`).join('')}</ul>
  </section>
  <section class="h04-section h04-end" id="h04-get" aria-labelledby="h04-get-title">
    <div class="h04-frame h04-end-frame">
      <p class="h04-sfx h04-sfx-end" aria-hidden="true">The end</p>
      <h2 id="h04-get-title">of "I'll try it later".</h2>
      <a class="h04-btn h04-btn-big" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p class="h04-fine">Kiln 0.17.0 for Windows, with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so you'll need to sign in with an account that has access. Unsigned build. MIT licensed.</p>
    </div>
  </section>`;
}

// ---------- page ----------

export function render(root: HTMLElement) {
  document.title = "Kiln — It's not a system. It's three code-review folders.";
  root.innerHTML = `<div class="h04">${defs}
    <a class="skip" href="#h04-main">Skip to content</a>
    <header class="h04-top"><a class="h04-logo" href="#h04-main">Kiln</a><span class="h04-issue">Issue 0.17, for Windows</span>
      <nav aria-label="Main navigation"><a href="#h04-folders">The folders</a><a href="#h04-later">The later pile</a><a href="#h04-get">Download</a></nav></header>
    <main id="h04-main">${hero()}${foldersSection()}${laterSection()}${endSections()}</main>
  </div>`;
  bindStrip(root);
  const panel = bindPanel(root);
  bindTest(root, panel);
}

function bindStrip(root: HTMLElement) {
  const strip = root.querySelector<HTMLElement>('.h04-strip')!;
  if (reduced()) { strip.classList.add('is-read'); return; }
  strip.classList.add('is-waiting');
  requestAnimationFrame(() => requestAnimationFrame(() => { strip.classList.remove('is-waiting'); strip.classList.add('is-read'); }));
}

// ---------- behaviour: panel ----------

type Panel = { add(name: string): void };
function bindPanel(root: HTMLElement): Panel {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const context = root.querySelector<HTMLElement>('[data-context]')!;
  const pop = root.querySelector<HTMLElement>('[data-pop]')!;
  let target = { r: 0, key: 'claude' as Column };
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const count = (key: Column) => rows.filter(row => row.cells[key] === 'on' || row.cells[key] === 'edited').length;
  const draw = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="h04-switch h04-switch-${state}" role="switch" aria-checked="${state === 'on' || state === 'edited'}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${stateText[state]}"><i></i></button></td>`;
    }).join('')}</tr>`).join('');
    context.textContent = `Loaded into every new session: ${count('claude')} skills in Claude Code, ${count('agents')} in Codex.`;
  };
  const focusCell = (r: number, key: Column) => body.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${key}"]`)?.focus();
  const closePop = (refocus = true) => { if (pop.hidden) return; pop.hidden = true; if (refocus) focusCell(target.r, target.key); };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h04-switch');
    if (!button) return;
    const r = Number(button.dataset.row), key = button.dataset.col as Column, row = rows[r], column = columns.find(item => item.key === key)!, state = row.cells[key];
    target = { r, key };
    if (state === 'edited') {
      pop.innerHTML = `<h3 id="h04-pop-title">${column.path}/${row.name} was edited by hand</h3>
        <div class="h04-diff"><p class="h04-del">- Review standards and the specification separately.</p><p class="h04-add">+ Review the specification only. Skip style.</p></div>
        <div class="h04-pop-actions"><button type="button" class="h04-ui-btn" data-act="replace">Replace with approved rev 3</button><button type="button" class="h04-ui-btn h04-quiet" data-act="draft">Keep the edit as draft rev 4</button><button type="button" class="h04-ui-btn h04-quiet" data-act="close">Cancel</button></div>`;
      pop.hidden = false; pop.querySelector<HTMLElement>('button')?.focus();
      say('That copy changed outside Kiln. Compare before you replace it.');
      return;
    }
    if (state === 'found') {
      if (row.imported) { say(`${row.name} is a draft in your library now. Approve it and Kiln will manage this copy.`); return; }
      pop.innerHTML = `<h3 id="h04-pop-title">${row.name} isn't in your library</h3><p>Import it as a draft. The folder in <code>${column.path}</code> stays exactly where it is.</p>
        <div class="h04-pop-actions"><button type="button" class="h04-ui-btn" data-act="import">Import as draft</button><button type="button" class="h04-ui-btn h04-quiet" data-act="close">Not now</button></div>`;
      pop.hidden = false; pop.querySelector<HTMLElement>('button')?.focus();
      return;
    }
    row.cells[key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed ${row.name} from ${column.path}. It's still in your library, history and all.` : `Installed the approved ${row.name} into ${column.path}. Receipt saved.`);
    draw(); focusCell(r, key);
  });
  pop.addEventListener('click', event => {
    const act = (event.target as Element).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (!act) return;
    const row = rows[target.r];
    if (act === 'replace') { row.cells[target.key] = 'on'; say('Moved the hand-edited copy to a private backup and installed approved rev 3.'); }
    if (act === 'draft') { row.cells[target.key] = 'on'; row.note = 'approved rev 3, draft rev 4'; say('Saved your edit as draft rev 4. Rev 3 stays installed until you approve it.'); }
    if (act === 'import') { row.imported = true; row.note = 'draft, imported'; say(`Imported ${row.name} as a draft. The original folder hasn't moved.`); }
    if (act !== 'close') draw();
    closePop();
  });
  pop.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closePop(); } });
  draw();
  return {
    add(name: string) {
      if (rows.some(row => row.name === name)) return;
      rows.forEach(row => { row.fresh = false; });
      closePop(false);
      rows.push({ name, note: 'approved rev 1, just now', cells: { claude: 'on', agents: 'on', project: 'off' }, fresh: true });
      draw();
      say(`Approved ${name} and switched it on for Claude Code and Codex.`);
    },
  };
}

// ---------- behaviour: Run it ----------

function bindTest(root: HTMLElement, panel: Panel) {
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const verdict = root.querySelector<HTMLElement>('[data-verdict]')!;
  const runButton = root.querySelector<HTMLButtonElement>('[data-run-it]')!;
  const picks = [...root.querySelectorAll<HTMLButtonElement>('[data-pick]')];
  const source = root.querySelector<HTMLElement>('[data-source]')!, prompt = root.querySelector<HTMLElement>('[data-prompt]')!;
  let current = 0, token = 0;
  const revisions = ideas.map(() => 1);
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced() ? 0 : ms));
  const idle = () => {
    verdict.innerHTML = ''; verdict.className = 'h04-verdict';
    log.innerHTML = `${bar('Test', 'nothing running')}<div class="h04-log-idle"><p>Nothing has run yet.</p><p class="h04-muted">Which, to be fair, is also true of everything in your bookmarks. This replays a sample run; nothing runs on this page.</p></div>`;
  };
  const showIdea = () => {
    const idea = ideas[current], rev = revisions[current];
    source.textContent = `${idea.source}, rev ${rev}`;
    prompt.innerHTML = rev > 1 && idea.fix ? idea.prompt.replace(idea.fix.before, `<mark>${idea.fix.after}</mark>`) : idea.prompt;
    runButton.textContent = rev > 1 ? `Run it again (rev ${rev})` : 'Run it';
  };
  const pick = (n: number, focus = true) => {
    current = n; token++;
    picks.forEach((button, i) => { button.setAttribute('aria-checked', String(i === n)); button.tabIndex = i === n ? 0 : -1; });
    if (focus) picks[n].focus();
    runButton.disabled = false;
    showIdea(); idle();
  };
  picks.forEach((button, n) => {
    button.addEventListener('click', () => pick(n));
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      pick((n + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : ideas.length - 1)) % ideas.length);
    });
  });
  const burst = (kind: 'pass' | 'uncertain') => {
    reseed(kind === 'pass' ? 8 : 19);
    verdict.className = `h04-verdict h04-verdict-${kind}`;
    verdict.innerHTML = `<svg viewBox="0 0 240 200" aria-hidden="true"><polygon points="${starburst(120, 100, 88, 14)}" class="h04-burst-back"/><polygon points="${starburst(120, 100, 82, 14)}" class="h04-burst"/></svg><b>${kind === 'pass' ? 'Pass!' : 'Hmm. Uncertain.'}</b>`;
    void verdict.offsetWidth; verdict.classList.add('is-on');
  };
  runButton.addEventListener('click', async () => {
    const n = current, idea = ideas[n], rev = revisions[n], mine = ++token, outcome = rev > 1 ? 'pass' : idea.verdict;
    runButton.disabled = true; verdict.className = 'h04-verdict'; verdict.innerHTML = '';
    log.innerHTML = `${bar('Test', `${idea.title}, rev ${rev}`)}<p class="h04-log-meta" data-meta>Starting Claude Code on ~/code/my-game, read-only</p><ol class="h04-log-lines" data-lines></ol><div data-after></div>`;
    const lines = log.querySelector<HTMLElement>('[data-lines]')!, meta = log.querySelector<HTMLElement>('[data-meta]')!;
    const steps = rev > 1 && idea.fix ? [...idea.steps.slice(0, -1), idea.fix.step] : idea.steps;
    if (innerWidth < 900) log.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    for (const [index, text] of steps.entries()) {
      await wait(650);
      if (mine !== token) return;
      lines.insertAdjacentHTML('beforeend', `<li>${text}</li>`);
      const s = 41 * (index + 1);
      meta.textContent = `${Math.floor(s / 60)} min ${s % 60} s. Claude Code, medium effort. ${(6.8 * (index + 1)).toFixed(1)}k in, ${(3.9 * index).toFixed(1)}k cached, ${(.5 * (index + 1)).toFixed(1)}k out (sample)`;
    }
    await wait(350);
    if (mine !== token) return;
    burst(outcome);
    const after = log.querySelector<HTMLElement>('[data-after]')!;
    if (outcome === 'uncertain' && idea.fix) {
      after.innerHTML = `<p class="h04-log-note">The agent's own call: two confusing spots, couldn't say which comes first. Fair, honestly.</p>
        <p class="h04-muted">Change one line and run it again on the same repo:</p>
        <div class="h04-diff"><p class="h04-del">- ${idea.fix.before}</p><p class="h04-add">+ ${idea.fix.after}</p></div>
        <div class="h04-pop-actions"><button type="button" class="h04-ui-btn" data-edit>Make that edit (rev 2)</button></div>`;
      after.querySelector('[data-edit]')!.addEventListener('click', () => { revisions[n] = 2; showIdea(); runButton.disabled = false; runButton.focus(); after.querySelector('.h04-pop-actions')!.innerHTML = '<p class="h04-muted">Edited. Now press "Run it again" on the left.</p>'; });
      return;
    }
    after.innerHTML = `<p class="h04-log-note">${rev > 1 && idea.fix ? idea.fix.lesson + ' ' : ''}That's the agent's verdict. Whether you keep it is your call, and Kiln records that separately.</p>
      <div class="h04-pop-actions"><button type="button" class="h04-ui-btn" data-keep>Approve and install as ${idea.skill}</button><button type="button" class="h04-ui-btn h04-quiet" data-nah>Nah</button></div>`;
    after.querySelector('[data-keep]')!.addEventListener('click', () => {
      panel.add(idea.skill);
      after.innerHTML = `<p class="h04-log-note">${idea.skill} is on the panel now, switched on for Claude Code and Codex. <a href="#h04-folders">Scroll up and admire it.</a></p>`;
    });
    after.querySelector('[data-nah]')!.addEventListener('click', () => { runButton.disabled = false; idle(); });
  });
  pick(0, false);
}
