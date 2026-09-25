// PROTOTYPE H09 — Crayon. A child's crayon drawing of your skills folders (a messy toy box) next to a calm, big-control Kiln panel.
// Signature: the reader colours in. Tap a scribbled folder and the matching crisp row gets coloured with the same crayon.
import './style.css';
import { examples, installer } from '../../content';
import { startScreen, tidyBox, toyBoxTall, toyBoxWide } from './art';
import { crayons, filters, reseed, swash } from './crayon';
import { locations, pile, rows, type Kind, type Loc, type Row } from './data';

const windows = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download Kiln for Windows') => `<a class="h09-button" href="${installer}">${windows}<span>${text}</span></a>`;
const stateLabel: Record<Kind, string> = { on: 'Installed', off: 'Off', edited: 'Edited outside Kiln', duplicate: 'Duplicate', stray: 'Found outside library', broken: 'Broken link' };
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function hero() {
  return `<section class="h09-hero" aria-labelledby="h09-title">
    <div class="h09-hero-head">
      <h1 id="h09-title">So simple, a <span class="h09-nowrap">seven-year-old</span> could draw it.</h1>
      <div class="h09-lead">
        <p>Here are your skills, in crayon: <code>code-review</code> in three places, one copy somebody changed by hand, a link to nowhere. Beside it is the same mess in Kiln: every skill, every folder your agents read, one big switch each.</p>
        <div class="h09-actions">${download()}<a class="h09-link" href="#h09-test">See the seven-year-old test</a></div>
      </div>
    </div>
    <div class="h09-hero-body">
      <div class="h09-art-col">
        <figure class="h09-sheet">
          ${toyBoxWide()}${toyBoxTall()}
          <figcaption class="visually-hidden">Drawn in crayon: seven skill folders spilling out of a toy box, colour-coded by where they live.</figcaption>
        </figure>
        <p class="h09-hint" data-hint aria-hidden="true">pick a folder and colour it in</p>
        <div class="h09-says" data-says aria-live="polite"></div>
      </div>
      ${panel()}
    </div>
  </section>`;
}

function panel() {
  return `<div class="h09-ui h09-panel" id="h09-panel" aria-label="Kiln skills panel, sample library">
    <div class="h09-ui-bar"><span class="h09-ui-brand">Kiln</span><b>Skills</b><span class="h09-ui-sample">Sample library</span></div>
    <div data-rows></div>
    <div class="h09-compare" data-compare hidden>
      <p><b>~/.claude/skills/code-review</b> differs from approved rev 3 in <code>SKILL.md</code></p>
      <div class="h09-diff"><p class="h09-del">− Review standards and the specification separately.</p><p class="h09-add">+ Review the specification only.</p></div>
      <div class="h09-row-actions"><button type="button" class="h09-ui-button" data-replace>Replace with approved rev 3</button><button type="button" class="h09-ui-button h09-quiet" data-keep-edit>Keep the edit as a new draft</button></div>
    </div>
    <div class="h09-ui-foot"><p data-load></p><p class="h09-status" data-status aria-live="polite">Flip a switch and Kiln says what it did.</p></div>
  </div>`;
}

function statesSection() {
  const states = [
    ['on', 'Installed', 'Kiln put the version you approved there. An install receipt records the revision and the folder.'],
    ['off', 'Off', 'Not installed here. The skill still lives in your library with its whole history. Flip it and the approved version goes in.'],
    ['edited', 'Edited outside Kiln', 'Somebody changed the copy by hand. Compare it with the approved version file by file, then replace it or keep the edit as a new draft.'],
    ['found', 'Found outside the library', 'A skill Kiln has no record of. Import it as a draft; the original stays where it is. Duplicates and broken links get a safe clean-up.'],
  ];
  const sample = (kind: string) => kind === 'found' ? '<span class="h09-found-badge">Import</span>' : `<span class="h09-switch h09-switch-${kind}" aria-hidden="true"><i></i></span>`;
  return `<section class="h09-section h09-states" aria-labelledby="h09-states-title">
    <div class="h09-section-head">
      <h2 id="h09-states-title">Every switch says one of four things.</h2>
      <p>Kiln scans every skill folder your agents read: <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and each enrolled project's <code>.github/skills</code>. Then it tells you, per folder, which of these is true.</p>
    </div>
    <ul class="h09-state-list">${states.map(([kind, title, text]) => `<li>${sample(kind)}<h3>${title}</h3><p>${text}</p></li>`).join('')}</ul>
    <div class="h09-why">
      <p><b>Why bother tidying?</b> Every skill your agent can invoke puts its description in the context on every turn. Forgotten, duplicate and stale copies spend tokens and attention whether they fire or not. Kiln doesn't count tokens per skill; it shows you exactly what's installed where, so you can switch off what you don't use.</p>
      <p><b>And the versions stay put.</b> Approving a skill pins an exact revision and publishes it to your own Kiln GitHub repository. Editing makes a new draft and never replaces the approved one; installs always use approved content. On another machine, open the repo and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.</p>
    </div>
  </section>`;
}

function testSection() {
  const example = examples[0];
  return `<section class="h09-section h09-test" id="h09-test" aria-labelledby="h09-test-title">
    <div class="h09-section-head">
      <h2 id="h09-test-title">Here's a prompt about seven-year-olds. Run it.</h2>
      <p>It's a real one, saved from a YouTube talk into a Kiln library. Kiln hands this exact revision to the Codex or Claude Code you're already signed into and points it at a repo you choose. The run is read-only: nothing in your code changes. You watch every step, then get the agent's verdict.</p>
    </div>
    <div class="h09-test-grid">
      <div class="h09-ui h09-prompt">
        <div class="h09-ui-bar"><span class="h09-ui-brand">Kiln</span><b>Prompt</b><span class="h09-ui-sample" data-rev-label>Revision 1</span></div>
        <div class="h09-prompt-body">
          <p class="h09-muted">${example.source}</p>
          <h3>${example.title}</h3>
          <p class="h09-prompt-text" data-prompt-text>${example.prompt}</p>
          <fieldset class="h09-repo"><legend>Run it on</legend>
            <label><input type="radio" name="h09-repo" value="my-game" checked><span><b>my-game</b><small>Sample repository</small></span></label>
            <label><input type="radio" name="h09-repo" value="example"><span><b>Isolated example</b><small>Not your code at all</small></span></label>
          </fieldset>
          <button type="button" class="h09-run-button" data-run>Run revision 1</button>
          <p class="h09-muted h09-center">Read-only. Nothing on this page calls a model; it replays a sample run.</p>
        </div>
      </div>
      <div class="h09-ui h09-run" data-runbox aria-live="polite"></div>
      <figure class="h09-sheet h09-sheet-small" data-screen-art>${startScreen()}<figcaption>The first screen of the sample game, drawn in crayon. The agent's finding gets circled when the run passes.</figcaption></figure>
    </div>
  </section>`;
}

function factsSection() {
  const facts = [
    ['No API key, no extra bill', 'Kiln runs through the Codex or Claude Code you\'re signed into, on your ChatGPT or Claude subscription. Its usage limits still apply. Editing, approving and installing never call a model.'],
    ['You see what gets sent', 'A consent notice explains what goes to the agent before the first interaction.'],
    ['Capture with one shortcut', 'Ctrl+Shift+Space from anywhere, or Ctrl+N inside Kiln. Paste text, links, screenshots or files. A YouTube link distils into prompts with timestamped source links.'],
    ['Config files, carefully', 'CLAUDE.md, AGENTS.md, Codex config.toml, settings, MCP config and hooks, edited in place with syntax checks, a diff and 30 private backups. Kiln never runs your hooks.'],
    ['Your library, your repo', 'The library lives on your machine and is backed by a GitHub repository Kiln creates for you with the official gh CLI. So it does need a GitHub account.'],
    ['Scriptable', 'The kiln CLI covers collections, items, experiments, approvals and installs, with JSON results. Your agents can read your library through it.'],
  ];
  return `<section class="h09-section h09-facts" aria-labelledby="h09-facts-title">
    <h2 id="h09-facts-title">The grown-up bits.</h2>
    <dl>${facts.map(([term, text]) => `<div><dt>${term}</dt><dd>${text}</dd></div>`).join('')}</dl>
  </section>`;
}

function getSection() {
  return `<section class="h09-section h09-get" id="h09-get" aria-labelledby="h09-get-title">
    ${tidyBox()}
    <div>
      <h2 id="h09-get-title">Tidy the toy box tonight.</h2>
      <p>Kiln 0.17.0 for Windows, for Codex, Claude Code and Copilot. MIT licensed.</p>
      <div class="h09-actions">${download()}</div>
      <p class="h09-muted">The release is hosted in a private GitHub repository, so you need to be signed in to an account with access. The build is unsigned, so Windows may ask before it runs.</p>
    </div>
  </section>`;
}

export function render(root: HTMLElement) {
  document.title = 'Kiln — So simple, a seven-year-old could draw it.';
  root.innerHTML = `${filters}<div class="h09">
    <header class="h09-top"><a class="h09-brand" href="#main">Kiln</a><nav aria-label="Main navigation"><a href="#h09-panel">The panel</a><a href="#h09-test">The test</a><a href="#h09-get">Download</a></nav></header>
    <main id="main">${hero()}${statesSection()}${testSection()}${factsSection()}${getSection()}</main>
  </div>`;
  const panelApi = bindPanel(root);
  bindTest(root, panelApi);
}

// ---------- panel + colouring ----------

type PanelApi = { colour(key: string, from: 'drawing' | 'test'): void; add(row: Row): void };

function bindPanel(root: HTMLElement): PanelApi {
  const host = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const load = root.querySelector<HTMLElement>('[data-load]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const says = root.querySelector<HTMLElement>('[data-says]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const coloured = new Set<string>();
  const extraColour: Record<string, keyof typeof crayons> = {};
  const say = (text: string) => { status.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };

  const swashSvg = (key: string) => { reseed(key.length * 97 + key.charCodeAt(0)); return `<svg class="h09-swash" viewBox="0 0 1000 80" preserveAspectRatio="xMinYMid slice" aria-hidden="true"><path d="${swash(1000, 80, 8)}" pathLength="1" filter="url(#h09-wax-soft)"/></svg>`; };
  const control = (row: Row, index: number) => {
    const label = `${row.name} in ${locations[row.loc].path}`;
    if (row.kind === 'duplicate') return `<button type="button" class="h09-ui-button h09-quiet" data-act="${index}">Remove</button>`;
    if (row.kind === 'stray') return `<button type="button" class="h09-ui-button h09-quiet" data-act="${index}">Import as draft</button>`;
    if (row.kind === 'broken') return `<button type="button" class="h09-ui-button h09-quiet" data-act="${index}">Clean up</button>`;
    if (row.kind === 'off' || row.kind === 'on' || row.kind === 'edited') return `<button type="button" class="h09-switch h09-switch-${row.kind}" data-act="${index}" role="switch" aria-checked="${row.kind !== 'off'}" aria-label="${escape(label)}: ${stateLabel[row.kind]}"><i></i></button>`;
    return '';
  };
  const render = () => {
    host.innerHTML = (Object.keys(locations) as Loc[]).map(loc => {
      const list = rows.map((row, index) => ({ row, index })).filter(({ row }) => row.loc === loc);
      return `<div class="h09-group"><h3 class="h09-group-head"><span>${locations[loc].name}</span><code>${locations[loc].path}</code></h3>
        <ul>${list.map(({ row, index }) => `<li class="h09-row h09-row-${row.kind}${coloured.has(row.key) ? ' is-coloured' : ''}${row.fresh ? ' is-fresh' : ''}" data-key="${row.key}" style="--c:${crayons[extraColour[row.key] ?? locations[row.loc].color]}">
          ${swashSvg(row.key)}
          <div class="h09-row-name"><b>${row.name}</b><small>${row.note}</small></div>
          <span class="h09-state">${row.kind === 'stray' && row.note.startsWith('Draft') ? 'Identical copy found' : stateLabel[row.kind]}</span>
          <div class="h09-control">${control(row, index)}</div>
        </li>`).join('')}</ul></div>`;
    }).join('');
    const loaded = (loc: Loc) => rows.filter(row => row.loc === loc && row.kind !== 'off' && row.kind !== 'broken').length;
    load.textContent = `Skill descriptions loaded into every new session: ${loaded('claude')} for Claude Code, ${loaded('agents')} for Codex and others, ${loaded('game')} extra in my-game.`;
  };

  host.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-act]');
    if (!button) return;
    const index = Number(button.dataset.act), row = rows[index], where = locations[row.loc].path;
    if (row.kind === 'edited') { compare.hidden = false; say('This copy was changed outside Kiln. Compare it before anything is replaced.'); compare.querySelector('button')?.focus(); return; }
    if (row.kind === 'on') { row.kind = 'off'; say(`Removed ${row.name} from ${where}. It stays in your library, history and all.`); }
    else if (row.kind === 'off') { row.kind = 'on'; say(`Installed ${row.note.toLowerCase()} of ${row.name} into ${where}. Install receipt saved.`); }
    else if (row.kind === 'duplicate') { rows.splice(index, 1); say(`Moved ${row.name} to a private backup. One code-review left in ${where}.`); }
    else if (row.kind === 'stray' && !row.note.startsWith('Draft')) { row.note = 'Draft in your library'; say(`Imported ${row.name} as a draft. The original folder stays where it was.`); }
    else if (row.kind === 'broken') { rows.splice(index, 1); say(`Removed the broken link ${row.name}. Nothing else was touched.`); }
    render();
    host.querySelector<HTMLButtonElement>(`[data-key="${row.key}"] [data-act]`)?.focus();
  });
  compare.querySelector('[data-replace]')!.addEventListener('click', () => {
    const row = rows.find(item => item.key === 'cr-claude')!;
    row.kind = 'on'; compare.hidden = true; render();
    say('Moved the hand-edited copy to a private backup and installed approved rev 3.');
  });
  compare.querySelector('[data-keep-edit]')!.addEventListener('click', () => {
    const row = rows.find(item => item.key === 'cr-claude')!;
    row.kind = 'on'; row.note = 'Approved rev 3, draft rev 4'; compare.hidden = true; render();
    say('Saved the edit as draft rev 4 and put approved rev 3 back. Approve rev 4 when you trust it.');
  });

  const showSays = (key: string) => {
    const item = pile.find(entry => entry.key === key);
    const row = rows.find(entry => entry.key === key);
    if (!item) return;
    says.style.setProperty('--c', crayons[item.color]);
    says.innerHTML = `<p class="h09-says-where"><i></i>${item.name} in <code>${item.where}</code></p>
      <h3>${item.title}</h3><p>${item.explain}</p>
      <p class="h09-says-foot"><span>${coloured.size} of ${pile.length} coloured in${coloured.size === pile.length ? '. That\'s every copy, on one panel.' : ''}</span>${row ? `<a href="#h09-panel" class="h09-says-link" data-jump="${key}">See its row</a>` : '<span>Already tidied on the panel.</span>'}</p>`;
  };
  const idle = () => { says.innerHTML = `<p class="h09-says-idle">Every folder in the drawing is a real kind of copy Kiln finds. Colour one in and its row on the panel gets coloured too, with Kiln's explanation here.</p><p class="h09-says-foot"><span>0 of ${pile.length} coloured in</span></p>`; };

  const colour = (key: string, from: 'drawing' | 'test') => {
    coloured.add(key);
    root.querySelectorAll<SVGGElement>(`.h09-folder[data-key="${key}"]`).forEach(group => { group.classList.add('is-coloured'); group.setAttribute('aria-pressed', 'true'); });
    root.querySelectorAll('.h09-row.is-latest').forEach(el => el.classList.remove('is-latest'));
    const rowEl = host.querySelector<HTMLElement>(`.h09-row[data-key="${key}"]`);
    if (rowEl) {
      rowEl.classList.remove('is-coloured'); void rowEl.offsetWidth; rowEl.classList.add('is-coloured', 'is-latest');
    }
    if (from === 'drawing') { hint.classList.add('is-gone'); showSays(key); }
  };
  root.querySelectorAll<SVGGElement>('.h09-folder').forEach(group => {
    const go = () => colour(group.dataset.key!, 'drawing');
    group.addEventListener('click', go);
    group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); } });
  });
  says.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-jump]');
    if (!link) return;
    event.preventDefault();
    const rowEl = host.querySelector<HTMLElement>(`.h09-row[data-key="${link.dataset.jump}"]`);
    rowEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    rowEl?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  });
  render();
  idle();
  return {
    colour,
    add(row: Row) {
      rows.forEach(item => { item.fresh = false; });
      extraColour[row.key] = 'yellow';
      rows.splice(3, 0, row);
      render();
      say(`Approved ${row.name} rev 2 and installed it into ~/.claude/skills. A new Claude Code session picks it up.`);
      colour(row.key, 'test');
    },
  };
}

// ---------- the seven-year-old test ----------

type Step = { kind: 'think' | 'cmd' | 'msg'; text: string };
const runs: Record<1 | 2, { steps: Step[]; seconds: number; tokens: [number, number, number] }> = {
  1: { seconds: 104, tokens: [41.8, 22.4, 1.6], steps: [
    { kind: 'think', text: 'Find the first screen a new player sees and skip the parent-only signup.' },
    { kind: 'cmd', text: 'rg -n "signup|parent" src/' },
    { kind: 'cmd', text: 'sed -n 1,80p src/screens/Start.tsx' },
    { kind: 'msg', text: 'The start screen has three buttons: Continue, Profiles and Settings.' },
    { kind: 'cmd', text: 'sed -n 1,60p src/screens/Profiles.tsx' },
    { kind: 'think', text: 'I can\'t tap through the app in a read-only run. Two screens could be the first obstacle.' },
  ] },
  2: { seconds: 97, tokens: [39.2, 24.0, 1.9], steps: [
    { kind: 'think', text: 'Follow the screens in render order: Start, then whatever the biggest button opens.' },
    { kind: 'cmd', text: 'sed -n 1,80p src/screens/Start.tsx' },
    { kind: 'msg', text: 'On screen: "Profiles" (largest), "Continue" (small, grey), "Settings".' },
    { kind: 'cmd', text: 'sed -n 1,60p src/screens/Profiles.tsx' },
    { kind: 'msg', text: 'Profiles opens a form with an email field, meant for a parent.' },
  ] },
};
const edit = { before: 'Describe that first obstacle and suggest a fix.', after: 'Follow the screens in the order a new player meets them, quote the words on screen, then describe the first obstacle and suggest a fix.' };

function bindTest(root: HTMLElement, panel: PanelApi) {
  const box = root.querySelector<HTMLElement>('[data-runbox]')!;
  const runButton = root.querySelector<HTMLButtonElement>('[data-run]')!;
  const promptText = root.querySelector<HTMLElement>('[data-prompt-text]')!;
  const revLabel = root.querySelector<HTMLElement>('[data-rev-label]')!;
  const art = root.querySelector<HTMLElement>('[data-screen-art]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
  let revision: 1 | 2 = 1, busy = false, approved = false;
  const repo = () => root.querySelector<HTMLInputElement>('input[name="h09-repo"]:checked')?.value === 'example' ? 'isolated example' : 'my-game';
  const idle = () => { box.innerHTML = `<div class="h09-run-idle"><p class="h09-run-idle-big">Nothing has run yet.</p><p>Press <b>Run revision 1</b>. You'll see the agent's reasoning, the commands it runs and what it finds, as it happens.</p></div>`; };
  const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  async function play() {
    if (busy) return;
    busy = true; runButton.disabled = true;
    const run = runs[revision];
    box.innerHTML = `<div class="h09-ui-bar"><span class="h09-ui-brand">Kiln</span><b>Experiment</b><span class="h09-pill">Read-only</span></div>
      <dl class="h09-run-meta"><div><dt>Repository</dt><dd>${repo()}</dd></div><div><dt>Agent</dt><dd>Claude Code</dd></div><div><dt>Reasoning</dt><dd>Medium</dd></div><div><dt>Elapsed</dt><dd data-clock>0:00</dd></div></dl>
      <ol class="h09-steps" data-steps></ol>
      <p class="h09-tokens" data-tokens>Tokens: 0 in, 0 cached, 0 out</p>
      <div class="h09-verdict" data-verdict></div>`;
    const steps = box.querySelector('[data-steps]')!, tokens = box.querySelector('[data-tokens]')!, clockEl = box.querySelector('[data-clock]')!;
    for (const [index, step] of run.steps.entries()) {
      await wait(560);
      const share = (index + 1) / run.steps.length;
      steps.insertAdjacentHTML('beforeend', `<li class="h09-step h09-step-${step.kind}"><span>${{ think: 'Reasoning', cmd: 'Command', msg: 'Message' }[step.kind]}</span>${step.kind === 'cmd' ? `<code>${escape(step.text)}</code>` : `<p>${escape(step.text)}</p>`}</li>`);
      clockEl.textContent = clock(run.seconds * share);
      tokens.textContent = `Tokens: ${(run.tokens[0] * share).toFixed(1)}k in, ${(run.tokens[1] * share).toFixed(1)}k cached, ${(run.tokens[2] * share).toFixed(1)}k out (sample)`;
    }
    await wait(500);
    const verdict = box.querySelector<HTMLElement>('[data-verdict]')!;
    busy = false; runButton.disabled = false;
    if (revision === 1) {
      verdict.innerHTML = `<p><span class="h09-badge h09-badge-uncertain">Uncertain</span><b>The agent's assessment.</b> It couldn't tap through the game in a read-only run, so it read the screens in code instead. It found two possible first obstacles and couldn't tell which a child meets first.</p>
        <p class="h09-muted">Change one line and run it again on the same repo.</p>
        <div class="h09-diff"><p class="h09-del">− ${edit.before}</p><p class="h09-add">+ ${edit.after}</p></div>
        <div class="h09-row-actions"><button type="button" class="h09-ui-button" data-rerun>Save as revision 2 and run it</button></div>`;
      verdict.querySelector('[data-rerun]')!.addEventListener('click', () => {
        revision = 2; revLabel.textContent = 'Revision 2';
        promptText.innerHTML = examples[0].prompt.replace(edit.before, `<mark>${edit.after}</mark>`);
        runButton.textContent = 'Run revision 2';
        play();
      });
      verdict.querySelector<HTMLElement>('[data-rerun]')?.focus({ preventScroll: true });
      return;
    }
    art.classList.add('is-found');
    verdict.innerHTML = `<p><span class="h09-badge h09-badge-pass">Pass</span><b>The agent's assessment.</b> First obstacle: the biggest button on the start screen says Profiles, and it opens a form meant for a parent. Play hides behind a small grey Continue. Suggested fix: make Play the biggest button. No files were changed.</p>
      <p class="h09-lesson"><b>What changed the result:</b> asking for the words on screen made it walk the screens in order instead of guessing.</p>
      <div class="h09-row-actions" data-keep-actions>${approved ? '' : '<button type="button" class="h09-ui-button" data-approve>Approve rev 2 and install for Claude Code</button><button type="button" class="h09-ui-button h09-quiet" data-later>Keep it as a prompt</button>'}</div>
      <p class="h09-muted">The verdict is the agent's. Whether to keep it is yours, and Kiln records the two separately.</p>`;
    verdict.querySelector('[data-approve]')?.addEventListener('click', () => {
      approved = true;
      panel.add({ key: 'kid-check', name: 'kid-usability-check', loc: 'claude', kind: 'on', note: 'Approved rev 2, just now', fresh: true });
      verdict.querySelector('[data-keep-actions]')!.innerHTML = `<p class="h09-landed">Installed. It's on the panel now, coloured in yellow. <a href="#h09-panel" data-back>Back to the panel</a></p>`;
      verdict.querySelector('[data-back]')!.addEventListener('click', event => {
        event.preventDefault();
        const row = root.querySelector<HTMLElement>('.h09-row[data-key="kid-check"]');
        row?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
        setTimeout(() => panel.colour('kid-check', 'test'), reduced ? 0 : 650);
      });
    });
    verdict.querySelector('[data-later]')?.addEventListener('click', event => { (event.target as HTMLElement).closest('[data-keep-actions]')!.innerHTML = '<p class="h09-muted">Kept as a prompt with its run attached. Approve it whenever you like.</p>'; });
  }
  runButton.addEventListener('click', play);
  idle();
}
