// PROTOTYPE round 5, H12 — One window. Split screen: the left column is a brush-pen story on paper, the right is one crisp
// Kiln window pinned for the whole page. Folder files fly into its Skills panel; saved sources are dragged into its Capture
// view; the prompt is dragged onto a repo in Test; approving flips it back to Skills with a new row. On phones the window
// docks at the bottom and expands when something lands in it. Screenshots (navigator.webdriver) get static window snapshots
// beside each beat instead of the pinned window, so full-page captures have no blank column.
import './style.css';
import { installer } from '../../content';
import { arrowInk, bandInk, docInk, folderInk, roughFilter } from './brush';
import { baseRows, capturePane, cols, contextHtml, flagHtml, ico, prompts, rowHtml, runs, skillsPane, stepsFor, testPane, viewName, windowHtml } from './kiln';
import type { Col, PromptId, Row, SourceId, State, View } from './kiln';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = () => matchMedia('(max-width: 1079px)').matches;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced() ? Math.min(ms, 60) : ms));
const windows = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';

// ---------- the mess: folders with skill files inside ----------

type FileItem = { name: string; row?: string; cleanup?: 'broken' | 'empty'; aside?: string };
const folders: { col: Col; path: string; who: string; files: FileItem[] }[] = [
  { col: 'claude', path: '~/.claude/skills', who: 'Claude Code', files: [{ name: 'code-review', row: 'code-review', aside: 'edited by hand?' }, { name: 'research', row: 'research' }, { name: 'writing-for-agents', row: 'writing' }] },
  { col: 'agents', path: '~/.agents/skills', who: 'Codex, Copilot and others', files: [{ name: 'code-review', row: 'code-review' }, { name: 'research', row: 'research', aside: 'same one??' }, { name: 'old-link', cleanup: 'broken', aside: 'goes nowhere' }] },
  { col: 'codex', path: '.codex/skills', who: 'Codex', files: [{ name: 'code-review (1)', row: 'code-review' }, { name: 'playtest-brief', row: 'playtest', aside: 'the old one' }, { name: 'deploy-notes/', cleanup: 'empty', aside: 'empty' }] },
  { col: 'copilot', path: '.copilot/skills', who: 'Copilot', files: [{ name: 'writing-for-agents', row: 'writing' }, { name: 'pr-summary', row: 'pr-summary', aside: 'forgot I had this' }] },
  { col: 'project', path: 'my-game/.github/skills', who: 'a project', files: [{ name: 'code-review-FINAL', row: 'code-review' }, { name: 'playtest-brief', row: 'playtest' }] },
];
const tilt = [-2.2, 1.6, -1, 2.2, -1.5];

function foldersHtml() {
  return `<figure class="h12-folders" data-folders aria-labelledby="h12-folders-cap">
    <div class="h12-folder-grid">${folders.map((folder, f) => `<div class="h12-folder" style="--r:${tilt[f]}deg" data-folder="${folder.col}">
      <p class="h12-folder-name">${folder.path}<small>${folder.who}</small></p>
      <div class="h12-folder-body">${folderInk(240, 172, 11 + f * 7)}
        <ul class="h12-files">${folder.files.map((file, i) => `<li class="h12-file${file.cleanup ? ` is-${file.cleanup}` : ''}" data-to="${file.row ? `${file.row}:${folder.col}` : 'cleanup'}" style="--r:${tilt[f]}deg"><span class="h12-fname">${docInk(40 + f * 5 + i, file.cleanup ?? 'file')}<span>${file.name}</span></span>${file.aside ? `<em class="h12-aside">${file.aside}</em>` : ''}</li>`).join('')}</ul>
      </div></div>`).join('')}</div>
    <figcaption id="h12-folders-cap">my skill folders, as I found them <small>(a sample, but you know the type)</small></figcaption>
  </figure>`;
}

// ---------- sources: small crisp renders, taped to the paper ----------

const grip = (label: string, name: string) => `<button type="button" class="h12-grip" data-grip aria-label="${label} ${name}">${ico('grip', 15)}<span>${label}</span></button>`;
function sourcesHtml() {
  return `<div class="h12-sources">
    <article class="h12-src h12-yt" data-drag="source" data-id="video" aria-label="YouTube video, fictional: Let your coding agent play your app like a kid, by Pair Programming Club, 18 minutes">
      <i class="h12-tape" aria-hidden="true"></i>
      <div class="h12-yt-thumb" aria-hidden="true"><span class="h12-yt-art"><b>play it</b><b>like a kid</b></span><span class="h12-yt-play"></span><span class="h12-yt-dur">18:40</span><span class="h12-yt-bar"><i></i></span></div>
      <div class="h12-yt-meta"><i class="h12-av" aria-hidden="true">P</i><div><b>Let your coding agent play your app like a kid</b><small>Pair Programming Club</small></div></div>
      ${grip('Add to Kiln', 'the video')}
      <p class="h12-scrawl" aria-hidden="true">watched it twice. never tried it.</p>
    </article>
    <article class="h12-src h12-x" data-drag="source" data-id="post" aria-label="Post on X, fictional, by Rae Okafor">
      <i class="h12-tape" aria-hidden="true"></i>
      <header><i class="h12-av h12-av-x" aria-hidden="true">R</i><div><b>Rae Okafor</b><small>@raeships · Mar 3</small></div><span class="h12-xmark" aria-hidden="true">X</span></header>
      <p>When your agent does the wrong thing, don’t just correct it. Ask it to trace the decision back to the instruction that caused it. Mine was one stale line in AGENTS.md.</p>
      <footer aria-hidden="true"><i></i><i></i><i></i><i></i></footer>
      ${grip('Add to Kiln', 'the post')}
      <p class="h12-scrawl" aria-hidden="true">bookmarked. obviously.</p>
    </article>
    <article class="h12-src h12-gh" data-drag="source" data-id="repo" aria-label="GitHub repository mattpocock/skills">
      <i class="h12-tape" aria-hidden="true"></i>
      <header>${ico('repo', 16)}<b><span>mattpocock</span> / <strong>skills</strong></b></header>
      <div class="h12-gh-bar" aria-hidden="true"><span class="h12-gh-branch">main</span><span class="h12-gh-code">&lt;&gt; Code</span></div>
      <ul aria-label="Files"><li class="is-dir">skills/</li><li>README.md</li><li>LICENSE</li></ul>
      ${grip('Add to Kiln', 'the repository')}
      <p class="h12-scrawl" aria-hidden="true">a whole repo of them</p>
    </article>
  </div>`;
}

const hint = (desk: string, touch: string, cls: string, s: number) => `<p class="h12-hint ${cls}" aria-hidden="true">
  <span class="h12-desk-only">${desk}</span><span class="h12-phone-only">${touch}</span>${arrowInk(170, 80, [10, 62], [158, 22], -22, s)}</p>`;

// ---------- the page ----------

const beat = (id: string, view: 'skills' | 'act2', left: string, cls = '', label = '') =>
  `<section class="h12-beat ${cls}" id="${id}" data-view="${view}" ${label}><div class="h12-l">${left}</div><div class="h12-slot" data-slot="${id}" aria-hidden="true"></div></section>`;

function pageHtml() {
  const hero = beat('h12-hero', 'skills', `
    <h1 id="h12-title">My agents were loading skills I forgot I had.</h1>
    <p class="h12-lede">Five folders, four copies of code-review, one link to nowhere, and every one of them sitting in my agent’s context on every turn. Kiln pulls them into one window, with a switch for every place your agents look.</p>
    <div class="h12-actions"><a class="h12-dl" href="${installer}">${windows}<span>Download for Windows</span></a><button type="button" class="h12-inkbtn" data-pop>Pull them into Kiln</button></div>
    <p class="h12-fine">Free and MIT licensed. The installer is in a private GitHub repository, so you’ll need to sign in with an account that has access.</p>
    ${foldersHtml()}`, 'h12-hero', 'aria-labelledby="h12-title"');

  const p1 = beat('h12-p1', 'skills', `
    <h2 id="h12-p1-title">One row per skill. A switch for every folder.</h2>
    <p>The copies merge into one row. The broken link and the empty folder get flagged, and Kiln cleans them up without touching anything else. Amber means a copy was edited by hand; Kiln shows you the diff before it replaces anything.</p>
    <p>Why switch things off? Every installed skill’s description sits in your agent’s context on every turn, whether it fires or not. Keep the ones that earn their place.</p>
    <p class="h12-small">Importing makes drafts; your original folders stay where they are. Kiln shows you what’s installed where. It doesn’t measure tokens per skill.</p>
    ${hint('go on, flip one. they’re real.', 'tap the Kiln bar at the bottom', 'h12-hint-p1', 71)}
    <p class="h12-row-btns"><button type="button" class="h12-inkbtn h12-inkbtn-quiet" data-pop>Put them back</button><button type="button" class="h12-inkbtn h12-phone-only" data-open="skills">Open the panel</button></p>`, 'h12-p1', 'aria-labelledby="h12-p1-title"');

  const band = `<div class="h12-band" id="h12-p2">${bandInk(700, 250, 5)}<div class="h12-band-copy">
      <h2 id="h12-p2-title">Okay. But how do I add new skills to this?</h2>
      <p>Honestly, I didn’t. I’d find a great prompt in a video, save it, and never try it.</p></div></div>`;
  const sources = beat('h12-sources', 'act2', `${band}
    <h3>Drag the thing you saved into Kiln.</h3>
    <p>A video, a post, a whole repo of skills. Drop one on the window and Kiln pulls out the prompt, plus the techniques, insights and tools around it, each linked back to where it came from. <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> does the same from anywhere in Windows.</p>
    ${hint('drag one onto the window', 'drag a handle down onto Kiln, or tap it', 'h12-hint-src', 83)}
    ${sourcesHtml()}`, 'h12-act2', 'aria-labelledby="h12-p2-title"');

  const test = beat('h12-test', 'act2', `
    <h3 id="h12-test-title">Then try the prompt on your own repo. Today, not someday.</h3>
    <p>Drag the prompt onto a repo in the window. Kiln runs that exact revision through the Codex or Claude Code you’re already signed into. It’s read-only, so nothing in your code changes. You watch every step, the time and the tokens, and get the agent’s verdict.</p>
    <p>If it comes back uncertain, change one line and run it again. That’s how you find out what actually changes the result. The agent’s verdict and your judgement stay separate: you decide what to keep.</p>
    ${hint('the prompt goes onto my-game', 'in Kiln: drag the prompt onto my-game', 'h12-hint-test', 97)}`, 'h12-act2', 'aria-labelledby="h12-test-title"');

  const facts: [string, string][] = [
    ['No API key.', 'Kiln drives the Codex or Claude Code you’re signed into, on your ChatGPT or Claude plan. Its usage limits still apply.'],
    ['Tests are read-only.', 'Your code doesn’t change. Jobs that need edits come back uncertain, not faked.'],
    ['Your own GitHub repo.', 'Approvals publish there. On another machine, one button installs everything marked for it.'],
    ['Windows app and CLI.', 'MIT licensed. The CLI returns JSON, so your agents can read your library too.'],
  ];
  const end = beat('h12-end', 'skills', `
    <div class="h12-payoff">
      <h3 id="h12-payoff-title">Approve it, and it lands on the same panel.</h3>
      <p>Approving pins that exact revision and publishes it to your own Kiln repository on GitHub. Edit it later and you get a new draft; installs keep using the approved one. Then switch it on where you want it: Claude Code, Codex, Copilot, or just this project. The next agent session picks it up.</p>
      <p class="h12-row-btns h12-phone-only"><button type="button" class="h12-inkbtn" data-open="skills">Show me the panel</button></p>
    </div>
    <section class="h12-get" id="h12-get" aria-labelledby="h12-get-title">
      <h2 id="h12-get-title">See what your agents are loading.</h2>
      <ul class="h12-facts">${facts.map(([title, text]) => `<li><b>${title}</b> ${text}</li>`).join('')}</ul>
      <a class="h12-dl h12-dl-big" href="${installer}">${windows}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="h12-fine">Works with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned, so Windows may ask before it runs.</p>
    </section>`, 'h12-end', 'aria-labelledby="h12-payoff-title"');

  return `<div class="h12" data-root>
    ${roughFilter}
    <a class="skip" href="#h12-main">Skip to content</a>
    <header class="h12-top"><a class="h12-brand" href="#h12-main"><i class="h12-brand-mark" aria-hidden="true"></i>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h12-p1">The folders</a><a href="#h12-p2">New skills</a><a href="#h12-get">Download</a></nav></header>
    <main id="h12-main">${hero}${p1}${sources}${test}${end}</main>
    <div class="h12-rail" data-rail><aside class="h12-win" data-win data-dock="peek" aria-label="The Kiln window, with sample data">
      <button type="button" class="h12-dockbar" data-dockbar aria-expanded="false"><i class="h12-logo" aria-hidden="true"></i><b data-dock-view>Skills</b><span data-dock-status></span>${ico('chevron', 18)}</button>
      <div class="h12-win-in" data-win-in></div>
    </aside></div>
    <div class="h12-sky" data-sky aria-hidden="true"></div>
  </div>`;
}

// ---------- state ----------

const fresh = (): State => ({ popped: false, cleaned: false, rows: baseRows(), detail: null, source: null, analyzing: false, imported: false, prompt: null, repo: '~/code/my-game', rev: 1, phase: 'idle', steps: 0 });

function snapshots(root: HTMLElement) {
  const done = (patch: Partial<State>) => ({ ...fresh(), popped: true, ...patch });
  const newRow: Row = { id: 'kid-usability-check', name: 'kid-usability-check', note: 'approved rev 2, just now', copies: 1, fresh: true, cells: { claude: 'on', agents: 'off', codex: 'off', copilot: 'off', project: 'on' } };
  const shots: Record<string, [State, View, string]> = {
    'h12-hero': [done({}), 'skills', '13 things in 5 folders became 5 skills. 2 flagged for cleanup.'],
    'h12-p1': [done({ detail: { row: 'code-review', col: 'claude' } }), 'skills', 'This copy was changed outside Kiln. Compare it first.'],
    'h12-sources': [done({ source: 'video' }), 'capture', 'Added 1 prompt, 1 technique, 1 insight and 1 tool to Usability ideas.'],
    'h12-test': [done({ source: 'video', prompt: 'video', rev: 2, phase: 'pass', steps: 5 }), 'test', 'Rev 2 passed on ~/code/my-game. Nothing in the repo changed.'],
    'h12-end': [done({ cleaned: true, rows: [newRow, ...baseRows()] }), 'skills', 'Approved rev 2 and published it to you/my-kiln. Installed into ~/.claude/skills and my-game.'],
  };
  for (const [id, [st, view, status]] of Object.entries(shots)) {
    const slot = root.querySelector<HTMLElement>(`[data-slot="${id}"]`)!;
    slot.innerHTML = `<div class="h12-win h12-snap" inert>${windowHtml(st, view, status, false)}</div>`;
  }
}

export function render(root: HTMLElement) {
  document.title = 'Kiln — My agents were loading skills I forgot I had';
  root.innerHTML = pageHtml();
  const page = root.querySelector<HTMLElement>('[data-root]')!;
  if (!new URLSearchParams(location.search).has('bare')) page.classList.add('has-switcher');
  if (navigator.webdriver) { page.classList.add('is-shot'); snapshots(root); return; }
  bind(root, page);
}

// ---------- behaviour ----------

function bind(root: HTMLElement, page: HTMLElement) {
  const st = fresh();
  const win = root.querySelector<HTMLElement>('[data-win]')!;
  const inner = win.querySelector<HTMLElement>('[data-win-in]')!;
  const sky = root.querySelector<HTMLElement>('[data-sky]')!;
  const dockbar = win.querySelector<HTMLButtonElement>('[data-dockbar]')!;
  let view: View = 'skills', act2: View = 'capture', status = 'Sample library. Nothing imported yet.';
  let popping = false, touched = false, dragging = false, keyboard = false, dockTouched = false;
  inner.innerHTML = windowHtml(st, view, status, true);
  win.dataset.drop = 'source';
  const pane = (key: View) => inner.querySelector<HTMLElement>(`[data-pane="${key}"]`)!;
  const statusEl = inner.querySelector<HTMLElement>('[data-status]')!;
  const tabs = [...inner.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const testTab = tabs.find(tab => tab.dataset.tab === 'test')!;
  testTab.dataset.drop = 'prompt'; testTab.dataset.repo = '~/code/my-game';

  addEventListener('keydown', event => { if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') keyboard = true; }, true);
  addEventListener('pointerdown', () => { keyboard = false; }, true);

  const say = (text: string) => {
    status = text;
    statusEl.textContent = text;
    statusEl.classList.remove('is-new'); void statusEl.offsetWidth; statusEl.classList.add('is-new');
    win.querySelector('[data-dock-status]')!.textContent = text;
  };
  const draw = (key: View) => {
    const el = pane(key);
    el.innerHTML = key === 'skills' ? skillsPane(st) : key === 'capture' ? capturePane(st) : testPane(st);
  };
  const focusIn = (selector: string) => { if (keyboard) requestAnimationFrame(() => inner.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true })); };

  function setView(next: View, focusTab = false) {
    if (next === 'capture' || next === 'test') act2 = next;
    win.querySelector('[data-dock-view]')!.textContent = viewName[next];
    if (next === view) { if (focusTab) tabs.find(tab => tab.dataset.tab === next)?.focus(); return; }
    view = next;
    win.dataset.view = next;
    tabs.forEach(tab => { const on = tab.dataset.tab === next; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; if (on && focusTab) tab.focus(); });
    (['skills', 'capture', 'test'] as View[]).forEach(key => { const el = pane(key); el.classList.toggle('is-current', key === next); el.inert = key !== next; });
  }
  (['capture', 'test'] as View[]).forEach(key => { pane(key).inert = true; });

  // ----- the phone dock -----
  const dock = (open: boolean) => {
    if (!phone()) return;
    win.dataset.dock = open ? 'open' : 'peek';
    dockbar.setAttribute('aria-expanded', String(open));
    inner.inert = !open;
  };
  dockbar.addEventListener('click', () => { dockTouched = true; dock(win.dataset.dock !== 'open'); });
  win.addEventListener('pointerdown', event => { if (!(event.target as Element).closest('[data-dockbar]')) dockTouched = true; });
  const syncDock = () => { win.dataset.dock = 'peek'; dockbar.setAttribute('aria-expanded', 'false'); inner.inert = phone(); };
  matchMedia('(max-width: 1079px)').addEventListener('change', syncDock);
  syncDock();
  root.querySelectorAll<HTMLButtonElement>('[data-open]').forEach(button => button.addEventListener('click', () => {
    setView(button.dataset.open as View); dockTouched = true; dock(true);
    if (!phone()) win.animate([{ boxShadow: '0 0 0 0 #c2f24c' }, { boxShadow: '0 0 0 6px #c2f24c00' }], { duration: 700 });
  }));

  // ----- flights -----
  const flyEl = (el: HTMLElement, from: DOMRect, to: DOMRect, o: { delay?: number; duration?: number; reverse?: boolean; crumple?: boolean; rotate?: number }) => {
    Object.assign(el.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
    el.classList.add('h12-flyer');
    sky.append(el);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const s = Math.max(.14, Math.min(1, to.width / from.width, to.height / from.height * 1.4));
    const lift = -Math.min(150, Math.hypot(dx, dy) * .3), cx = dx * .42, cy = Math.min(0, dy) * .45 + lift, r = o.rotate ?? 0;
    const at = (t: number) => { const u = 1 - t; return [2 * u * t * cx + t * t * dx, 2 * u * t * cy + t * t * dy]; };
    const frames: Keyframe[] = o.crumple
      ? [
        { transform: `translate(0,0) rotate(${r}deg) scale(1)`, clipPath: 'polygon(0 0,50% 0,100% 0,100% 50%,100% 100%,50% 100%,0 100%,0 50%)', opacity: 1 },
        { transform: `translate(0,-6px) rotate(${r + 12}deg) scale(.75)`, clipPath: 'polygon(12% 14%,46% 4%,90% 12%,80% 48%,94% 88%,50% 78%,8% 92%,20% 50%)', offset: .25 },
        { transform: `translate(0,0) rotate(${r + 80}deg) scale(.4)`, clipPath: 'polygon(30% 24%,50% 36%,74% 20%,66% 50%,80% 78%,50% 66%,22% 80%,34% 50%)', offset: .45 },
        ...[.62, .8].map(t => { const [x, y] = at(t); return { transform: `translate(${x}px,${y}px) rotate(${r + 80 + t * 260}deg) scale(${.4 - t * .15})`, clipPath: 'polygon(30% 24%,50% 36%,74% 20%,66% 50%,80% 78%,50% 66%,22% 80%,34% 50%)', offset: t, opacity: 1 }; }),
        { transform: `translate(${dx}px,${dy}px) rotate(${r + 380}deg) scale(.18)`, clipPath: 'polygon(30% 24%,50% 36%,74% 20%,66% 50%,80% 78%,50% 66%,22% 80%,34% 50%)', opacity: 0 },
      ]
      : [
        { transform: `translate(0,0) rotate(${r}deg) scale(1)`, opacity: 1 },
        { transform: `translate(0,-10px) rotate(${r * .5}deg) scale(1.08)`, opacity: 1, offset: .12 },
        ...[.32, .52, .72, .88].map(t => { const [x, y] = at(t); return { transform: `translate(${x}px,${y}px) rotate(0deg) scale(${1 + (s - 1) * t})`, opacity: 1, offset: t }; }),
        { transform: `translate(${dx}px,${dy}px) rotate(0deg) scale(${s})`, opacity: 0 },
      ];
    const animation = el.animate(frames, { duration: o.duration ?? 900, delay: o.delay ?? 0, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'both', direction: o.reverse ? 'reverse' : 'normal' });
    return animation.finished.then(() => el.remove(), () => el.remove());
  };
  const fly = (src: HTMLElement, to: DOMRect, o: Parameters<typeof flyEl>[3]) => flyEl(src.cloneNode(true) as HTMLElement, src.getBoundingClientRect(), to, o);

  // ----- problem 1: pop the files out of their folders into the Skills panel -----
  const files = [...root.querySelectorAll<HTMLElement>('.h12-file')];
  const popButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-pop]')];
  const labelPops = () => popButtons.forEach(button => { button.textContent = st.popped ? 'Put them back' : 'Pull them into Kiln'; button.disabled = popping; });
  const targetOf = (file: HTMLElement) => {
    const to = file.dataset.to!;
    if (to === 'cleanup') return inner.querySelector<HTMLElement>('[data-flagslot]')!;
    return inner.querySelector<HTMLElement>(`[data-cell="${to}"] .h12-sw`)!;
  };
  const landed = new Map<string, number>();
  const land = (file: HTMLElement) => {
    const to = file.dataset.to!;
    if (to === 'cleanup') { const slot = inner.querySelector<HTMLElement>('[data-flagslot]')!; slot.classList.add('is-in'); slot.classList.remove('is-landed'); void slot.offsetWidth; slot.classList.add('is-landed'); return; }
    const [rowId] = to.split(':');
    const cell = inner.querySelector<HTMLElement>(`[data-cell="${to}"]`)!, tr = cell.closest('tr')!;
    tr.classList.add('is-in');
    cell.classList.add('is-in'); cell.classList.remove('is-landed'); void cell.offsetWidth; cell.classList.add('is-landed');
    const count = (landed.get(rowId) ?? 0) + 1;
    landed.set(rowId, count);
    const copies = tr.querySelector<HTMLElement>('.h12-copies');
    if (copies && count > 1) { copies.classList.add('is-shown'); copies.querySelector('b')!.textContent = String(count); tr.classList.remove('is-merged'); void tr.offsetWidth; tr.classList.add('is-merged'); }
  };

  async function pop(into: boolean, automatic = false) {
    if (popping || into === st.popped) return;
    if (!automatic) touched = true;
    popping = true; labelPops();
    setView('skills');
    if (phone()) { dock(true); await wait(430); }
    st.detail = null;
    if (into) {
      st.rows = [...st.rows.filter(row => row.fresh), ...baseRows()];
      draw('skills');
      inner.querySelectorAll('.h12-copies').forEach(el => el.classList.remove('is-shown'));
      inner.querySelector('[data-empty]')!.classList.add('is-gone');
      inner.querySelector('[data-flagslot]')!.classList.remove('is-in');
      landed.clear();
      say('Looking in 5 folders…');
      if (reduced()) { st.popped = true; draw('skills'); files.forEach(file => file.classList.add('is-out')); }
      else {
        await Promise.all(files.map((file, n) => {
          const target = targetOf(file).getBoundingClientRect(), crumple = file.dataset.to === 'cleanup' && file.classList.contains('is-broken');
          const flight = fly(file.querySelector<HTMLElement>('.h12-fname')!, target, { delay: 120 + n * 95, duration: crumple ? 1250 : 920, crumple, rotate: parseFloat(file.style.getPropertyValue('--r')) || 0 });
          setTimeout(() => file.classList.add('is-out'), 120 + n * 95);
          return flight.then(() => land(file));
        }));
        st.popped = true;
      }
      say('13 things in 5 folders became 5 skills. The copies merged; 2 things flagged for cleanup.');
    } else {
      const order = [...files].reverse();
      if (!reduced()) {
        await Promise.all(order.map((file, n) => {
          const target = targetOf(file).getBoundingClientRect(), crumple = file.dataset.to === 'cleanup' && file.classList.contains('is-broken');
          const name = file.querySelector<HTMLElement>('.h12-fname')!, clone = name.cloneNode(true) as HTMLElement;
          const home = name.getBoundingClientRect();
          file.classList.add('is-out');
          setTimeout(() => {
            const to = file.dataset.to!;
            if (to !== 'cleanup') inner.querySelector(`[data-cell="${to}"]`)?.classList.remove('is-in');
          }, n * 60);
          return flyEl(clone, home, target, { delay: n * 60, duration: crumple ? 900 : 700, reverse: true, crumple, rotate: parseFloat(file.style.getPropertyValue('--r')) || 0 }).then(() => file.classList.remove('is-out'));
        }));
      }
      files.forEach(file => file.classList.remove('is-out'));
      st.popped = false; st.cleaned = false;
      st.rows = [...st.rows.filter(row => row.fresh), ...baseRows()];
      draw('skills');
      say('Back in their folders. Pull them in again whenever you like.');
    }
    popping = false; labelPops();
    if (into && automatic && phone()) setTimeout(() => { if (!dockTouched && !dragging) dock(false); }, 1900);
  }
  popButtons.forEach(button => button.addEventListener('click', () => pop(!st.popped)));
  const folderFigure = root.querySelector<HTMLElement>('[data-folders]')!;
  const autoPop = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    autoPop.disconnect();
    document.fonts.ready.then(() => setTimeout(() => { if (!touched && !st.popped) pop(true, true); }, 700));
  }, { threshold: phone() ? .7 : .85 });
  autoPop.observe(folderFigure.querySelector('.h12-folder-grid')!);

  // ----- the skills pane -----
  const redrawRow = (row: Row) => {
    const tr = inner.querySelector(`[data-rowid="${row.id}"]`);
    if (tr) tr.outerHTML = rowHtml(row, st);
    inner.querySelector('[data-context]')!.innerHTML = contextHtml(st);
  };
  pane('skills').addEventListener('click', event => {
    const target = event.target as Element;
    const act = target.closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act) {
      const detail = st.detail, row = detail && st.rows.find(item => item.id === detail.row), col = detail && cols.find(item => item.key === detail.col);
      if (act === 'find') { pop(true); return; }
      if (act === 'clean') { st.cleaned = true; inner.querySelector('[data-flagslot]')!.innerHTML = flagHtml(st); say('Removed the broken link in ~/.agents/skills and the empty folder in .codex/skills.'); inner.querySelector<HTMLElement>('[data-flagslot] .h12-flag')!.tabIndex = -1; inner.querySelector<HTMLElement>('[data-flagslot] .h12-flag')!.focus({ preventScroll: true }); return; }
      if (row && col) {
        if (act === 'replace') { row.cells[col.key] = 'on'; say(`Moved the hand-edited copy to a private backup and installed the approved ${row.name}.`); }
        if (act === 'draft') { row.cells[col.key] = 'on'; row.note = `${row.note}, new draft`; say('Saved the edit as a new draft. The approved version stays installed until you approve the draft.'); }
        if (act === 'import') { row.imported = true; row.note = 'draft, imported'; say(`Imported ${row.name} as a draft. The original folder hasn’t moved.`); }
      }
      st.detail = null;
      inner.querySelector('[data-detail]')!.innerHTML = '';
      if (row) redrawRow(row);
      if (row && col) inner.querySelector<HTMLElement>(`.h12-sw[data-row="${row.id}"][data-col="${col.key}"]`)?.focus({ preventScroll: true });
      return;
    }
    const sw = target.closest<HTMLButtonElement>('button.h12-sw');
    if (!sw || popping) return;
    const row = st.rows.find(item => item.id === sw.dataset.row)!, col = cols.find(item => item.key === sw.dataset.col)!, state = row.cells[col.key];
    if (state === 'edited' || (state === 'found' && !row.imported)) {
      st.detail = { row: row.id, col: col.key };
      pane('skills').innerHTML = skillsPane(st);
      say(state === 'edited' ? 'This copy was changed outside Kiln. Compare it first.' : `${row.name} isn’t in your library yet.`);
      inner.querySelector<HTMLElement>('.h12-detail button')?.focus({ preventScroll: true });
      return;
    }
    if (state === 'found') { say(`${row.name} is a draft in your library now. Approve it to manage this copy.`); return; }
    row.cells[col.key] = state === 'on' ? 'off' : 'on';
    if (row.fresh) row.note = row.note.replace(', just now', '');
    say(state === 'on' ? `Removed ${row.name} from ${col.path}. It stays in your library, history and all.`
      : `Installed the approved ${row.name} into ${col.path}. Receipt saved.${row.fresh ? ' A new agent session picks it up.' : ''}`);
    redrawRow(row);
    inner.querySelector<HTMLElement>(`.h12-sw[data-row="${row.id}"][data-col="${col.key}"]`)?.focus({ preventScroll: true });
  });

  // ----- tabs -----
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setView(tab.dataset.tab as View));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      setView(tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length].dataset.tab as View, true);
    });
  });

  // ----- problem 2: capture -----
  let capToken = 0;
  async function capture(id: SourceId) {
    const mine = ++capToken;
    Object.assign(st, { source: id, analyzing: true });
    setView('capture'); dock(true);
    draw('capture');
    root.querySelector(`.h12-src[data-id="${id}"]`)?.classList.add('is-sent');
    say(id === 'repo' ? 'Reading mattpocock/skills…' : id === 'video' ? 'Distilling the video’s captions…' : 'Reading the post…');
    await wait(1500);
    if (mine !== capToken) return;
    st.analyzing = false;
    draw('capture');
    pane('capture').classList.remove('is-arriving'); void pane('capture').offsetWidth; pane('capture').classList.add('is-arriving');
    say(id === 'repo' ? 'Found a skills repository. Import it as drafts when you’re ready.' : `Added 1 prompt, 1 technique, 1 insight and 1 tool to ${prompts[id].collection}.`);
    focusIn(id === 'repo' ? '[data-act="import-repo"]' : '.h12-prompt [data-grip]');
  }
  pane('capture').addEventListener('click', event => {
    const target = event.target as Element;
    if (target.closest('[data-act="import-repo"]')) { st.imported = true; draw('capture'); say('Imported mattpocock/skills as drafts. Nothing installs until you approve it.'); focusIn('.h12-drop'); return; }
    const repo = target.closest<HTMLElement>('.h12-repo');
    if (repo && st.source && st.source !== 'repo') startTest(st.source, repo.dataset.repo!);
  });

  // ----- problem 2: test -----
  let runToken = 0;
  async function startTest(id: PromptId, repo: string, rev: 1 | 2 = 1) {
    const mine = ++runToken;
    Object.assign(st, { prompt: id, repo, rev, phase: 'running', steps: 0 });
    setView('test'); dock(true);
    draw('test');
    say(`Running rev ${rev} on ${repo}, read-only…`);
    const steps = stepsFor(st);
    for (let i = 1; i <= steps.length; i++) {
      await wait(680);
      if (mine !== runToken) return;
      st.steps = i; draw('test');
    }
    await wait(380);
    if (mine !== runToken) return;
    st.phase = runs[id].fix && rev === 1 ? 'uncertain' : 'pass';
    draw('test');
    say(st.phase === 'uncertain' ? 'Rev 1 came back uncertain. Nothing in the repo changed.' : `Rev ${rev} passed on ${repo}. Nothing in the repo changed.`);
    focusIn('[data-outcome] .h12-b-acc');
  }
  function approve() {
    const id = st.prompt!, p = prompts[id], from = inner.querySelector<HTMLElement>('[data-act="approve"]')!.getBoundingClientRect();
    st.rows = st.rows.filter(row => row.id !== p.skill);
    st.rows.unshift({ id: p.skill, name: p.skill, note: `approved rev ${st.rev}, just now`, copies: 1, fresh: true, cells: { claude: 'off', agents: 'off', codex: 'off', copilot: 'off', project: 'off' } });
    st.phase = 'approved';
    draw('test'); setView('skills'); draw('skills');
    const tr = inner.querySelector<HTMLElement>(`[data-rowid="${p.skill}"]`)!;
    tr.classList.add('is-landing');
    if (!reduced()) {
      const chip = document.createElement('span');
      chip.className = 'h12-chip'; chip.textContent = p.skill;
      tr.style.opacity = '0';
      flyEl(chip, new DOMRect(from.left, from.top, Math.min(from.width, 200), from.height), tr.querySelector('th')!.getBoundingClientRect(), { duration: 800 }).then(() => { tr.style.opacity = ''; });
    }
    say(`Approved rev ${st.rev} and published it to you/my-kiln on GitHub. Now choose where it’s installed.`);
    focusIn(`.h12-sw[data-row="${p.skill}"]`);
  }
  pane('test').addEventListener('click', event => {
    const act = (event.target as Element).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (!act || !st.prompt) return;
    if (act === 'rerun') startTest(st.prompt, st.repo, 2);
    if (act === 'approve') approve();
    if (act === 'dismiss') { st.phase = 'idle'; draw('test'); say('Not kept. It stays in Capture with its runs.'); }
    if (act === 'show-skills') { setView('skills'); focusIn(`[data-rowid="${prompts[st.prompt].skill}"] .h12-sw`); }
  });

  // ----- dragging: sources onto the window, the prompt onto a repo. Pointer events, so touch works; the grip is also a button. -----
  let justDragged = false;
  root.addEventListener('pointerdown', event => {
    const target = event.target as Element, item = target.closest<HTMLElement>('[data-drag]');
    if (!item || item.classList.contains('is-lifted')) return;
    const onGrip = !!target.closest('[data-grip]');
    if (event.pointerType === 'mouse' ? event.button !== 0 : !onGrip) return;
    if (!onGrip && target.closest('button, a')) return;
    const kind = item.dataset.drag as 'source' | 'prompt', id = item.dataset.id!;
    const startX = event.clientX, startY = event.clientY, box = item.getBoundingClientRect();
    let ghost: HTMLElement | null = null, over: HTMLElement | null = null;
    item.setPointerCapture(event.pointerId);
    if (event.pointerType === 'mouse') event.preventDefault();
    const scale = kind === 'source' ? .74 : .9;
    const move = (e: PointerEvent) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!ghost) {
        if (Math.hypot(dx, dy) < 6) return;
        dragging = true;
        ghost = item.cloneNode(true) as HTMLElement;
        ghost.classList.add('h12-ghost');
        Object.assign(ghost.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px`, transformOrigin: `${startX - box.left}px ${startY - box.top}px` });
        sky.append(ghost);
        item.classList.add('is-lifted');
        page.classList.add('is-dragging', `is-dragging-${kind}`);
        if (kind === 'source') { setView('capture'); dock(true); }
      }
      ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-6, Math.min(6, dx / 60))}deg) scale(${scale})`;
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>(`[data-drop~="${kind}"]`) ?? null;
      if (hit !== over) { over?.classList.remove('is-over'); hit?.classList.add('is-over'); over = hit; }
    };
    const up = (e: PointerEvent) => {
      item.removeEventListener('pointermove', move); item.removeEventListener('pointerup', up); item.removeEventListener('pointercancel', up);
      if (!ghost) return;
      justDragged = true; setTimeout(() => { justDragged = false; }, 60);
      dragging = false;
      page.classList.remove('is-dragging', `is-dragging-${kind}`);
      const g = ghost, target = e.type === 'pointerup' ? over : null;
      over?.classList.remove('is-over');
      if (target) {
        const to = (target.matches('[data-win]') ? target.querySelector('[data-dropzone]') ?? target : target).getBoundingClientRect(), from = g.getBoundingClientRect();
        const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
        g.animate([{ transform: g.style.transform, opacity: 1 }, { transform: `${g.style.transform} translate(${dx / scale}px, ${dy / scale}px) scale(.2)`, opacity: 0 }], { duration: reduced() ? 0 : 380, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }).finished.then(() => g.remove());
        item.classList.remove('is-lifted');
        if (kind === 'source') capture(id as SourceId);
        else startTest(id as PromptId, target.dataset.repo ?? '~/code/my-game');
      } else {
        g.animate([{ transform: g.style.transform }, { transform: 'translate(0,0) rotate(0) scale(1)' }], { duration: reduced() ? 0 : 420, easing: 'cubic-bezier(.2,1.3,.4,1)', fill: 'forwards' }).finished.then(() => { g.remove(); item.classList.remove('is-lifted'); });
      }
    };
    item.addEventListener('pointermove', move); item.addEventListener('pointerup', up); item.addEventListener('pointercancel', up);
  });
  root.addEventListener('click', event => {
    const gripButton = (event.target as Element).closest<HTMLElement>('[data-grip]');
    if (!gripButton || justDragged) return;
    const item = gripButton.closest<HTMLElement>('[data-drag]')!;
    if (item.dataset.drag === 'source') capture(item.dataset.id as SourceId);
    else startTest(item.dataset.id as PromptId, '~/code/my-game');
  });

  // ----- the story drives the window: each beat shows its view as it crosses the middle of the screen -----
  let current = '';
  const beats = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      if (el.id === current) continue;
      current = el.id;
      if (!dragging && !popping) setView(el.dataset.view === 'act2' ? act2 : 'skills');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  root.querySelectorAll<HTMLElement>('.h12-beat').forEach(el => beats.observe(el));

  say(status);
  labelPops();
  // the small arrows and loops get a tiny ink-in once they scroll into view
  const inks = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); inks.unobserve(entry.target); } }), { threshold: .6 });
  root.querySelectorAll('.h12-hint').forEach(el => inks.observe(el));
}
