// PROTOTYPE H02, problem 2: taped-on sources → drag into Kiln's capture area → a prompt (the star) plus smaller technique,
// insight and tool cards → drag the prompt into Test → verdict → approve → a new row on the problem-1 panel, with switches.
// Drags use pointer events (mouse and touch) with a fixed-position ghost; every draggable also has a button and Enter/Space.
import { examples } from '../../content';
import { dragArrow, trace } from './art';
import type { Panel } from './panel';

type Extra = { kind: 'Technique' | 'Insight' | 'Tool'; text: string; from?: string };
type Run = { lines: string[]; out: string };
type Prompt = { title: string; text: string; from?: string; skill: string; first: Run; retry?: { why: string; was: string; now: string; run: Run } };
type Source = { id: 'video' | 'post' | 'repo'; label: string; title: string; meta: string; prompt?: Prompt; extras: Extra[] };

const sources: Source[] = [
  { id: 'video', label: 'the YouTube video', title: 'The usability test nobody runs', meta: 'Small Builds on YouTube, 18:42. Transcript attached, every card links to its moment.',
    prompt: { title: examples[0].title, text: examples[0].prompt, from: '04:12', skill: 'seven-year-old-test',
      first: { lines: ['read README.md, package.json', '$ rg -l "Screen" src/screens', 'tried to open the app: not possible in a read-only run'], out: '' },
      retry: { why: 'It can’t use the app in a read-only run, so it guessed from the code. Marked uncertain instead of faking a pass.', was: '- Use this app as a seven-year-old.', now: '+ Walk through the screens in src/screens as a seven-year-old would.',
        run: { lines: ['read src/screens/Welcome.tsx, Levels.tsx, Play.tsx', '$ rg -n "onPress" src/screens', 'walked Welcome, Levels and Play as a new player', 'first obstacle: Start sits below the level list'], out: 'First obstacle: on the Levels screen, Start is below the fold, so a new player only sees locked levels. Suggested fix: pin Start above the list. No files changed.' } } },
    extras: [{ kind: 'Technique', text: 'Borrow a user who knows less than you do', from: '02:30' }, { kind: 'Insight', text: 'You stop seeing the rough edges of an app you built', from: '09:05' }, { kind: 'Tool', text: 'A browser automation tool to click through screens', from: '13:48' }] },
  { id: 'post', label: 'the post on X', title: 'Post by @junebuilds', meta: 'Saved from X with the post text and a link back.',
    prompt: { title: examples[1].title, text: examples[1].prompt, skill: 'instruction-trace',
      first: { lines: ['read AGENTS.md, CLAUDE.md', '$ git log -3 --format=%s -- CLAUDE.md', '$ rg -n "full test suite" .', 'traced it to CLAUDE.md line 14'], out: 'CLAUDE.md line 14 says to run the full test suite, which predates the faster test command. Proposed a one-line change. No files changed.' } },
    extras: [{ kind: 'Technique', text: 'Ask for the cause before you ask for the fix' }, { kind: 'Insight', text: 'Old lines in CLAUDE.md keep steering new sessions' }, { kind: 'Tool', text: 'git log on your instruction files' }] },
  { id: 'repo', label: 'the GitHub repository', title: 'mattpocock/skills', meta: 'A skills repository on GitHub.', extras: [] },
];

const icon = {
  star: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m8 1.4 2 4.3 4.6.5-3.4 3.1 1 4.6L8 11.6l-4.2 2.3 1-4.6L1.4 6.2 6 5.7z" fill="currentColor"/></svg>',
  grip: '<svg viewBox="0 0 10 16" aria-hidden="true"><g fill="currentColor"><circle cx="2.5" cy="3" r="1.3"/><circle cx="7.5" cy="3" r="1.3"/><circle cx="2.5" cy="8" r="1.3"/><circle cx="7.5" cy="8" r="1.3"/><circle cx="2.5" cy="13" r="1.3"/><circle cx="7.5" cy="13" r="1.3"/></g></svg>',
  folder: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 3.5h5l1.4 1.6h6.6v8.4h-13z" fill="#54aeff"/></svg>',
  file: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9z M9.5 1.5v3h3" fill="none" stroke="#656d76" stroke-width="1.2"/></svg>',
  repo: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h8.5v11H4.5A1.5 1.5 0 0 0 3 13.5zm0 11A1.5 1.5 0 0 0 4.5 15H13v-3" fill="none" stroke="#656d76" stroke-width="1.3"/></svg>',
};

// ---------- markup ----------

function sourceCards() {
  const video = `<div class="h02-yt"><div class="h02-yt-thumb"><span class="h02-yt-words">test it like<br>you’re <b>7</b></span><span class="h02-yt-play" aria-hidden="true"></span><span class="h02-yt-time">18:42</span><span class="h02-yt-bar" aria-hidden="true"><i></i></span></div>
    <div class="h02-yt-info"><span class="h02-yt-avatar" aria-hidden="true">SB</span><span><b>The usability test nobody runs</b><small>Small Builds</small></span></div></div>`;
  const post = `<div class="h02-x"><div class="h02-x-head"><span class="h02-x-avatar" aria-hidden="true">JR</span><span><b>June Reyes</b><small>@junebuilds</small></span><span class="h02-x-mark" aria-hidden="true">X</span></div>
    <p>When your agent does X and you meant Y, don’t just correct it. Ask it which instruction made it do X. Usually it’s an old line in CLAUDE.md.</p></div>`;
  const repo = `<div class="h02-gh"><div class="h02-gh-head">${icon.repo}<span><span>mattpocock</span> / <b>skills</b></span><span class="h02-gh-code">Code</span></div>
    <ul><li>${icon.folder}skills</li><li>${icon.file}README.md</li><li>${icon.file}LICENSE</li></ul></div>`;
  const notes: Record<Source['id'], string> = { video: 'watched it. saved it. never tried it.', post: 'bookmarked, 3 weeks ago', repo: 'starred. then forgot.' };
  const art: Record<Source['id'], string> = { video, post, repo };
  return sources.map((source, n) => `<div class="h02-src h02-src-${source.id}">
      <div class="h02-src-pin">
        ${trace(120 + n * 7, notes[source.id])}
        <span class="h02-tape h02-tape-a" aria-hidden="true"></span><span class="h02-tape h02-tape-b" aria-hidden="true"></span>
        <div class="h02-src-card" data-source="${source.id}" tabindex="0" role="button" aria-label="${source.label}: ${source.title}. Press Enter to add it to Kiln, or drag it into the capture area." aria-describedby="h02-src-help">${art[source.id]}</div>
      </div>
      <p class="h02-src-note h02-pencil" aria-hidden="true">${notes[source.id]}</p>
      <button type="button" class="h02-add" data-add="${source.id}">Add to Kiln</button>
    </div>`).join('');
}

export function pipelineMarkup() {
  return `<div class="h02-pipe">
    <div class="h02-arrow" aria-hidden="true">${dragArrow(false)}${dragArrow(true)}</div>
    <div class="h02-sources">
      ${sourceCards()}
      <p class="h02-help" id="h02-src-help">Drag a source into Kiln, or press Add to Kiln. Fictional video and post.</p>
    </div>
    <div class="h02-win h02-capture" data-capture>
      <div class="h02-bar" aria-hidden="true"><span class="h02-bar-mark"></span><b>Kiln</b><span class="h02-bar-crumb">Capture</span><span class="h02-bar-ctl"><i></i><i></i><i></i></span></div>
      <div class="h02-drop" data-capture-drop>
        <div class="h02-drop-idle" data-capture-idle>
          <b>Drop it here</b>
          <p>A link, a post, a screenshot or a file. Kiln analyzes it and adds what it finds.</p>
          <span class="h02-ui h02-ui-fake">Analyze and add</span>
          <p class="h02-drop-meta">From anywhere: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd></p>
        </div>
        <div class="h02-collection" data-collection hidden aria-live="polite"></div>
      </div>
    </div>
    <div class="h02-win h02-test" data-test>
      <div class="h02-bar" aria-hidden="true"><span class="h02-bar-mark"></span><b>Kiln</b><span class="h02-bar-crumb">Test</span><span class="h02-bar-ctl"><i></i><i></i><i></i></span></div>
      <div class="h02-test-top">
        <div class="h02-seg" role="group" aria-label="Repository (sample)"><span>Repo</span><button type="button" aria-pressed="true" data-repo="my-game">~/code/my-game</button><button type="button" aria-pressed="false" data-repo="recipes-app">~/code/recipes-app</button></div>
        <div class="h02-seg" role="group" aria-label="Agent"><span>Agent</span><button type="button" aria-pressed="true" data-agent="Claude Code">Claude Code</button><button type="button" aria-pressed="false" data-agent="Codex">Codex</button></div>
        <span class="h02-ro">Read-only. Nothing in your code changes.</span>
      </div>
      <div class="h02-test-body">
        <div class="h02-test-drop" data-test-drop>
          <div class="h02-test-idle" data-test-idle><b>Drop the prompt here</b><p>It runs that exact revision on the repo above, through the agent you’re already signed into.</p></div>
          <div class="h02-log" data-log hidden></div>
        </div>
        <div class="h02-test-out" data-test-out aria-live="polite"><p class="h02-test-wait">The agent’s verdict shows up here. Whether to keep it is your call.</p></div>
      </div>
      <div class="h02-landed" data-landed hidden></div>
    </div>
  </div>`;
}

// ---------- drag ----------

type Zone = { el: HTMLElement; accepts(): boolean };
function draggable(host: HTMLElement, card: HTMLElement, zone: Zone, onDrop: () => void, reduced: boolean) {
  let start: { x: number; y: number; id: number } | null = null, ghost: HTMLElement | null = null, origin: DOMRect | null = null, raf = 0, point = { x: 0, y: 0 };
  const over = (x: number, y: number) => { const r = zone.el.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; };
  const autoscroll = () => {
    // Keep the page moving when the pointer nears the top or bottom edge, so a long phone layout still works.
    const edge = 70, speed = point.y > innerHeight - edge ? (point.y - innerHeight + edge) / 4 : point.y < edge ? -(edge - point.y) / 4 : 0;
    if (speed) { scrollBy(0, speed); zone.el.classList.toggle('is-over', over(point.x, point.y) && zone.accepts()); }
    raf = requestAnimationFrame(autoscroll);
  };
  const lift = () => {
    origin = card.getBoundingClientRect();
    ghost = card.cloneNode(true) as HTMLElement;
    ghost.removeAttribute('tabindex'); ghost.removeAttribute('role'); ghost.removeAttribute('data-source'); ghost.removeAttribute('data-prompt');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.classList.add('h02-ghost');
    ghost.style.cssText = `left:${origin.left}px;top:${origin.top}px;width:${origin.width}px;height:${origin.height}px`;
    host.appendChild(ghost);
    card.classList.add('is-lifted');
    raf = requestAnimationFrame(autoscroll);
  };
  card.addEventListener('pointerdown', event => {
    if ((event.pointerType === 'mouse' && event.button !== 0) || card.classList.contains('is-used')) return;
    start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    card.setPointerCapture(event.pointerId);
  });
  card.addEventListener('pointermove', event => {
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (!ghost && Math.hypot(dx, dy) > 6) lift();
    if (!ghost || !origin) return;
    point = { x: event.clientX, y: event.clientY };
    ghost.style.transform = `translate(${event.clientX - start.x}px, ${event.clientY - start.y}px) rotate(${Math.max(-6, Math.min(6, dx / 30))}deg) scale(1.03)`;
    zone.el.classList.toggle('is-over', over(event.clientX, event.clientY) && zone.accepts());
  });
  const end = (event: PointerEvent) => {
    if (!start) return;
    start = null;
    cancelAnimationFrame(raf);
    if (!ghost || !origin) return;
    const g = ghost, hit = over(event.clientX, event.clientY) && zone.accepts();
    ghost = null;
    zone.el.classList.remove('is-over');
    if (hit) {
      const z = zone.el.getBoundingClientRect();
      const tx = z.left + z.width / 2 - (origin.left + origin.width / 2), ty = z.top + Math.min(z.height / 2, 140) - (origin.top + origin.height / 2);
      const done = () => { g.remove(); card.classList.remove('is-lifted'); onDrop(); };
      if (reduced) { done(); return; }
      g.animate([{ transform: g.style.transform, opacity: 1 }, { transform: `translate(${tx}px, ${ty}px) scale(.18) rotate(-8deg)`, opacity: .2 }], { duration: 340, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished.then(done);
    } else {
      const home = card.getBoundingClientRect();
      const back = g.animate([{ transform: g.style.transform }, { transform: `translate(${home.left - origin.left}px, ${home.top - origin.top}px)` }], { duration: reduced ? 0 : 420, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'forwards' });
      back.finished.then(() => { g.remove(); card.classList.remove('is-lifted'); });
    }
  };
  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (zone.accepts()) onDrop(); } });
}

// ---------- behaviour ----------

export function bindPipeline(root: HTMLElement, panel: Panel, reduced: boolean, beforeLand: () => void) {
  const host = root.querySelector<HTMLElement>('.h02')!;
  const capture = root.querySelector<HTMLElement>('[data-capture-drop]')!;
  const idle = root.querySelector<HTMLElement>('[data-capture-idle]')!;
  const collection = root.querySelector<HTMLElement>('[data-collection]')!;
  const testDrop = root.querySelector<HTMLElement>('[data-test-drop]')!;
  const testIdle = root.querySelector<HTMLElement>('[data-test-idle]')!;
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const out = root.querySelector<HTMLElement>('[data-test-out]')!;
  const landed = root.querySelector<HTMLElement>('[data-landed]')!;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
  let current: Source | null = null, analyzing = false, running = false, token = 0, repo = 'my-game', agent = 'Claude Code';

  root.querySelectorAll<HTMLElement>('.h02-seg').forEach(group => group.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!button || running) return;
    group.querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    if (button.dataset.repo) repo = button.dataset.repo;
    if (button.dataset.agent) agent = button.dataset.agent;
  }));

  const captureZone: Zone = { el: capture, accepts: () => !analyzing };
  const testZone: Zone = { el: testDrop, accepts: () => !running && !!current?.prompt };
  root.querySelectorAll<HTMLElement>('[data-source]').forEach(card => {
    const id = card.dataset.source as Source['id'];
    draggable(host, card, captureZone, () => analyze(id), reduced);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => button.addEventListener('click', () => {
    analyze(button.dataset.add as Source['id']);
    capture.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  }));

  async function analyze(id: Source['id']) {
    if (analyzing) return;
    const source = sources.find(item => item.id === id)!;
    analyzing = true; current = source; token++;
    const mine = token;
    root.querySelectorAll('[data-source]').forEach(card => card.classList.toggle('is-used', (card as HTMLElement).dataset.source === id));
    capture.classList.remove('is-dropped'); void capture.offsetWidth; capture.classList.add('is-dropped');
    idle.hidden = true; collection.hidden = false;
    collection.innerHTML = `<div class="h02-analyzing"><p><span class="h02-pulse"></span>Analyzing ${source.label}</p><ol data-steps></ol></div>`;
    const steps = collection.querySelector('[data-steps]')!;
    const said = id === 'video' ? ['Reading the captions', 'Finding prompts, techniques, insights and tools', 'Linking each card to its moment in the video']
      : id === 'post' ? ['Reading the post', 'Finding prompts, techniques, insights and tools', 'Linking the collection to the post'] : ['Reading the repository', 'Found a skills/ folder'];
    for (const line of said) { await wait(420); if (mine !== token) return; steps.insertAdjacentHTML('beforeend', `<li>${line}</li>`); }
    await wait(360);
    if (mine !== token) return;
    analyzing = false;
    if (!source.prompt) {
      collection.innerHTML = `<div class="h02-col-head"><b>mattpocock/skills</b><span>Skills repository, linked to its source</span></div>
        <div class="h02-import"><p>Kiln can import the repository’s <code>skills/</code> folder as drafts. The repository stays where it is, and nothing is installed until you approve a revision.</p>
          <div class="h02-actions"><button type="button" class="h02-ui h02-ui-primary" data-import>Import as drafts</button></div></div>
        <p class="h02-col-foot">Drafts from a repository get tested like any prompt. For the full run on this page, drop the video.</p>`;
      collection.querySelector('[data-import]')!.addEventListener('click', event => {
        (event.currentTarget as HTMLElement).closest('.h02-import')!.innerHTML = '<p><span class="h02-verdict h02-verdict-pass">Imported</span> The skills are drafts in your library now, linked back to <code>mattpocock/skills</code>. Test one before you approve it.</p>';
      });
      collection.querySelector<HTMLElement>('[data-import]')!.focus({ preventScroll: true });
      return;
    }
    const prompt = source.prompt;
    collection.innerHTML = `<div class="h02-col-head"><b>${source.title}</b><span>${source.meta}</span></div>
      <article class="h02-prompt" data-prompt tabindex="0" role="button" aria-label="Prompt: ${prompt.title}. Press Enter to test it, or drag it into the test area.">
        <header><span class="h02-kind h02-kind-prompt">${icon.star}Prompt</span>${prompt.from ? `<span class="h02-from">from ${prompt.from}</span>` : ''}<span class="h02-grip">${icon.grip}<span>Drag to Test</span></span></header>
        <h3>${prompt.title}</h3>
        <p>${prompt.text}</p>
      </article>
      <div class="h02-actions h02-prompt-actions"><button type="button" class="h02-ui h02-ui-primary" data-send>Test this prompt</button></div>
      <ul class="h02-extras">${source.extras.map(extra => `<li class="h02-extra"><span class="h02-kind">${extra.kind}</span><p>${extra.text}</p>${extra.from ? `<span class="h02-from">from ${extra.from}</span>` : ''}</li>`).join('')}</ul>`;
    const card = collection.querySelector<HTMLElement>('[data-prompt]')!;
    draggable(host, card, testZone, () => startTest(), reduced);
    collection.querySelector('[data-send]')!.addEventListener('click', () => { startTest(); testDrop.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); });
    resetTest();
  }

  const resetTest = () => {
    if (running) return;
    log.hidden = true; testIdle.hidden = false; testDrop.classList.remove('is-busy');
    out.innerHTML = '<p class="h02-test-wait">The agent’s verdict shows up here. Whether to keep it is your call.</p>';
  };

  function startTest() {
    if (running || !current?.prompt) return;
    collection.querySelector('[data-prompt]')?.classList.add('is-used');
    testDrop.classList.remove('is-dropped'); void testDrop.offsetWidth; testDrop.classList.add('is-dropped');
    play(current.prompt, 1);
  }

  async function play(prompt: Prompt, rev: number) {
    running = true;
    const run = rev > 1 && prompt.retry ? prompt.retry.run : prompt.first;
    testIdle.hidden = true; log.hidden = false; landed.hidden = true; testDrop.classList.add('is-busy');
    out.innerHTML = '<p class="h02-test-wait">Running…</p>';
    log.innerHTML = `<div class="h02-log-head"><b>${prompt.title}</b><span>rev ${rev}</span></div>
      <p class="h02-log-meta"><span class="h02-pulse"></span>${agent} in <code>~/code/${repo}</code>, read-only</p>
      <ol data-lines></ol>
      <dl class="h02-stats"><div><dt>Elapsed</dt><dd data-stat="time">0 s</dd></div><div><dt>Input</dt><dd data-stat="in">0</dd></div><div><dt>Cached</dt><dd data-stat="cached">0</dd></div><div><dt>Output</dt><dd data-stat="out">0</dd></div></dl>
      <p class="h02-sample">Sample numbers.</p>`;
    const lines = log.querySelector('[data-lines]')!;
    const stat = (key: string, value: string) => { log.querySelector(`[data-stat="${key}"]`)!.textContent = value; };
    for (const [index, text] of run.lines.entries()) {
      await wait(620);
      lines.insertAdjacentHTML('beforeend', `<li class="${text.startsWith('$') ? 'is-cmd' : ''}">${text.replace(/^\$ /, '')}</li>`);
      const k = index + 1 + (rev - 1) * .6;
      stat('time', `${Math.round(k * 9)} s`); stat('in', `${(6.8 * k).toFixed(1)}k`); stat('cached', `${(4.1 * k).toFixed(1)}k`); stat('out', `${(.42 * k).toFixed(1)}k`);
    }
    await wait(420);
    log.querySelector('.h02-pulse')?.classList.add('is-done');
    running = false;
    if (rev === 1 && prompt.retry) {
      out.innerHTML = `<p class="h02-verdict-line"><span class="h02-verdict h02-verdict-uncertain">Uncertain</span>The agent’s verdict.</p>
        <p>${prompt.retry.why}</p>
        <p class="h02-edit-h">Edit one line:</p>
        <div class="h02-diff"><p class="h02-del">${prompt.retry.was}</p><p class="h02-add">${prompt.retry.now}</p></div>
        <div class="h02-actions"><button type="button" class="h02-ui h02-ui-primary" data-rerun>Save as rev 2 and run again</button></div>`;
      out.querySelector('[data-rerun]')!.addEventListener('click', () => play(prompt, 2));
      out.querySelector<HTMLElement>('[data-rerun]')!.focus({ preventScroll: true });
      return;
    }
    out.innerHTML = `<p class="h02-verdict-line"><span class="h02-verdict h02-verdict-pass">Pass</span>The agent’s verdict.</p>
      <p>${run.out}</p>
      <p class="h02-edit-h">Your call:</p>
      <div class="h02-actions"><button type="button" class="h02-ui h02-ui-primary" data-approve>Approve rev ${rev} as a skill</button><button type="button" class="h02-ui" data-later>Not yet</button></div>`;
    out.querySelector('[data-approve]')!.addEventListener('click', () => approve(prompt, rev));
    out.querySelector('[data-later]')!.addEventListener('click', () => { out.innerHTML = '<p class="h02-test-wait">Kept as rev ' + rev + ' with its run attached. Nothing installed.</p>'; });
    out.querySelector<HTMLElement>('[data-approve]')!.focus({ preventScroll: true });
  }

  function approve(prompt: Prompt, rev: number) {
    beforeLand();
    panel.add(prompt.skill, rev);
    out.innerHTML = `<p class="h02-verdict-line"><span class="h02-verdict h02-verdict-pass">Approved</span>rev ${rev} pinned. Published to your Kiln repository on GitHub.</p>
      <p>Drafted <code>${prompt.skill}/SKILL.md</code> from the prompt and put it on your skills panel. Choose where it goes below; a new agent session picks it up.</p>
      <div class="h02-actions"><a class="h02-ui" href="#h02-panel" data-see>See it with your other skills</a></div>`;
    landed.hidden = false;
    landed.innerHTML = '<p class="h02-landed-h">New on your skills panel</p><div data-mini></div>';
    panel.mini(landed.querySelector<HTMLElement>('[data-mini]')!, prompt.skill);
    landed.querySelector<HTMLElement>('.h02-switch[data-col="agents"]')?.focus({ preventScroll: true });
    out.querySelector('[data-see]')!.addEventListener('click', event => {
      event.preventDefault();
      const row = root.querySelector<HTMLElement>(`#h02-panel tr[data-skill="${prompt.skill}"]`);
      root.querySelector('#h02-panel')!.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      row?.classList.remove('is-fresh'); void row?.offsetWidth; row?.classList.add('is-fresh');
      row?.querySelector<HTMLElement>('.h02-switch')?.focus({ preventScroll: true });
    });
  }
}
