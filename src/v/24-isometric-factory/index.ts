// PROTOTYPE variant 21 — Toy factory. An isometric factory line: bookmarks go in, tested skills come out.
import './style.css';
import { collections, examples, installer, provenance, releaseNote, subscription, windowsMark } from '../../content';
import { BELT, CHUTE, FOLDERS, HOPPER, MANIFOLD_X, PRESS, STAMP, TEST, itemKinds, project, scene, sprite } from './scene';

const stations = [
  { name: 'Capture hopper', short: 'Capture', title: 'Drop anything in the top.', text: 'Paste or drop text, links, screenshots, images and files. Ctrl+N captures, Ctrl+Shift+Space searches from anywhere, and the tray icon is always there.', spec: [['Save only', 'Keeps it without calling a model.'], ['Analyze and add', 'Splits a source into prompts, insights, techniques, tools and resources, linked back to where it came from.'], ['Distill video', 'A YouTube link becomes entries with timestamped source links. The transcript stays attached.']] },
  { name: 'Prompt press', short: 'Prompt', title: 'Pressed into something you can run.', text: 'An idea gets shaped into a clear prompt for your own codebase. Every edit makes a new revision, and any two revisions can be compared as a diff.', spec: [['Ask the agent', 'Discuss an item with its attachments and the video it came from.'], ['Revisions', 'Nothing is overwritten. The old version is still there when the new one is worse.']] },
  { name: 'Test chamber', short: 'Test', title: 'Tried on your repo, right now.', text: 'Pick a local project (or an isolated example) and run the exact revision through Codex or Claude Code. The pipe to your repo only reads: experiments are read-only, so nothing in your code changes.', spec: [['Live window', 'Messages, reasoning summaries, commands, web searches, model, effort, elapsed time and tokens.'], ['Verdict', 'The agent says pass, fail or uncertain. Work that needs edits or missing tools comes back uncertain, not faked.'], ['Two at once', 'Run up to two experiments side by side. Cancel or retry.']] },
  { name: 'Approval stamp', short: 'Approve', title: 'The stamp is yours.', text: 'The agent’s assessment is saved next to the output, but your judgement is kept separately and it’s the one that counts. Approval pins the exact revision you reviewed.', spec: [['Published', 'The approved snapshot is committed to your own Kiln GitHub repository.'], ['Edit later', 'Editing makes a new draft. The approved revision keeps its identity.']] },
  { name: 'Install chute', short: 'Install', title: 'Out into your agents’ folders.', text: 'Only approved content goes down the chute, into Claude Code, Codex or Copilot locations, personal or per project. A new agent session picks it up.', spec: [['Receipts', 'Each install records the revision and where it went.'], ['Another machine', 'Open the repo and press “Install everything marked for this machine”.']] },
  { name: 'Warehouse', short: 'Library', title: 'Everything on a shelf.', text: 'Prompts, skills, custom agents, source notes, insights, techniques, tools and resources, sorted into collections. The warehouse also knows every copy you’ve installed and whether one changed behind its back.', spec: [['Find things', 'Search, tags, favorites and filters by kind, status, provider, location and copy state.'], ['Bring stock in', 'Import installed skills or a skills repository as drafts. The originals stay put.']] },
];

const runs = [
  { agent: 'Claude Code', lines: ['Reading AGENTS.md', 'Reading src/game/loop.ts', 'Running npm test -- --list (read-only)', 'Listing input handlers in src/ui'], verdict: 'Pass', note: 'Ranked list of ten fixes, nothing edited.' },
  { agent: 'Codex', lines: ['Reading AGENTS.md and CLAUDE.md', 'Searching for “always run the full suite”', 'Comparing guidance with package.json scripts', 'Drafting the smallest instruction change'], verdict: 'Uncertain', note: 'Found the stale line; the fix needs an edit, so it asks you.' },
  { agent: 'Claude Code', lines: ['Opening the start screen route', 'Looking for text a child could not read', 'Following the first activity link', 'Noting where the next step is unclear'], verdict: 'Pass', note: 'First obstacle described, fix suggested, no changes.' },
];
const batch = [2, 1, 0];

const copies = [
  { where: '~/.agents/skills/code-review', who: 'Codex, Copilot', state: 'Installed', tone: 'ok' },
  { where: '~/.claude/skills/code-review', who: 'Claude Code', state: 'Edited outside Kiln', tone: 'warn' },
  { where: '~/.codex/skills/code-review', who: 'Codex', state: 'Identical copy found', tone: 'info' },
  { where: 'game/.github/skills/code-review', who: 'Project', state: 'Installed', tone: 'ok' },
  { where: 'old-site/.github/skills/code-review', who: 'Project', state: 'Differs', tone: 'warn' },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — In goes a bookmark, out comes a skill';
  root.innerHTML = `
<div class="v21">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v21-top">
    <a class="v21-brand" href="?"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 26V12l8 5V12l8 5V6h8v20z"/></svg>Kiln</a>
    <nav aria-label="Main"><a href="#v21-floor">The line</a><a href="#v21-batch">Today’s batch</a><a href="#v21-warehouse">Warehouse</a><a href="#v21-get">Download</a></nav>
  </header>
  <main id="main">
    <section class="v21-hero" id="v21-floor" aria-labelledby="v21-title">
      <div class="v21-intro">
        <h1 id="v21-title">In goes a bookmark. Out comes a skill.</h1>
        <div class="v21-lede">
          <p>Kiln is a Windows app that runs the things you saved through one small factory: capture, prompt, a read-only test on your own repo, your approval, and an install into Claude Code, Codex or Copilot.</p>
          <a class="v21-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        </div>
      </div>
      <figure class="v21-stage">
        <svg class="v21-scene" viewBox="-300 -370 1760 1080" role="group" aria-label="The Kiln factory. Saved posts, videos and screenshots fall into a capture hopper, ride a conveyor through a prompt press and a test chamber piped read-only to your repo, get an approval stamp, and drop down an install chute into Claude Code, Codex and Copilot folders. A warehouse holds the library.">${scene()}</svg>
        <div class="v21-panel" aria-live="polite">
          <div class="v21-panel-body"></div>
          <div class="v21-controls" role="group" aria-label="Stations">
            ${stations.map((s, i) => `<button type="button" class="v21-chip" data-go="${i}" aria-pressed="false"><span>${i + 1}</span>${s.short}</button>`).join('')}
            <button type="button" class="v21-chip v21-chip-all" data-go="-1" aria-pressed="true">Whole factory</button>
          </div>
        </div>
      </figure>
    </section>

    <section class="v21-batch" id="v21-batch" aria-labelledby="v21-batch-title">
      <div class="v21-batch-head">
        <h2 id="v21-batch-title">Today’s batch</h2>
        <p>Three real prompts from a Kiln library, shortened. Pick one and follow it down the line. The run logs are samples of what the live window shows.</p>
      </div>
      <div class="v21-tabs" role="tablist" aria-label="Example prompts">
        ${batch.map((e, i) => `<button type="button" role="tab" id="v21-tab-${i}" aria-controls="v21-ticket" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-ex="${i}">${examples[e].title}</button>`).join('')}
      </div>
      <article class="v21-ticket" id="v21-ticket" role="tabpanel" aria-live="polite"></article>
    </section>

    <section class="v21-warehouse" id="v21-warehouse" aria-labelledby="v21-wh-title">
      <div class="v21-wh-head">
        <h2 id="v21-wh-title">The warehouse knows where every box went.</h2>
        <p>Skills don’t stay in one place. They end up in <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and every project’s <code>.github/skills</code>, next to prompts lost in chats and bookmarks. Kiln keeps one library and tracks the copies.</p>
      </div>
      <div class="v21-wh-grid">
        <div class="v21-shelves" aria-label="Sample shelves">
          ${collections.map((c, i) => `<div class="v21-shelf v21-shelf-${i}"><h3>${c.name}</h3><ul>${c.items.map(([kind, title]) => `<li class="v21-crate v21-k-${kind.toLowerCase()}"><small>${kind}</small>${title}</li>`).join('')}</ul></div>`).join('')}
          <p class="v21-filters">Filter by <span>kind</span><span>status</span><span>provider</span><span>location</span><span>copy state</span><span>scope</span><span>tag</span></p>
        </div>
        <div class="v21-stock">
          <h3>Stock check: code-review <small>sample</small></h3>
          <table>
            <thead><tr><th scope="col">Copy</th><th scope="col">State</th></tr></thead>
            <tbody>${copies.map(c => `<tr><td><code>${c.where}</code><small>${c.who}</small></td><td><span class="v21-state v21-${c.tone}">${c.state}</span></td></tr>`).join('')}</tbody>
          </table>
          <p>Compare a drifted copy with the approved version file by file. Remove local copies in bulk: managed ones are deleted, anything else is moved to a private backup.</p>
        </div>
      </div>
      <div class="v21-wh-notes">
        <div><h3>Old stock costs you on every turn.</h3><p>Every model-invoked skill’s description rides along in your agent’s context on every turn, whether it fires or not. Forgotten, duplicate and stale skills spend tokens and attention. The stock check shows what’s installed where, so you can clear out what you don’t use and keep what earns its shelf.</p></div>
        <div><h3>Bring in what you already have.</h3><p>Import installed skills, or a whole skills repository, as drafts. The originals stay where they are. “Find skills and agents not in the library” scans your locations and offers to clean up broken links and empty folders.</p></div>
        <div><h3>Config files, same building.</h3><p>CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config and shell profiles open in one place. Edits land in the real file, with syntax checks, 30 private backups and a diff before you restore. Kiln never runs your hooks.</p></div>
      </div>
    </section>

    <section class="v21-records" aria-labelledby="v21-rec-title">
      <h2 id="v21-rec-title">Every box has a delivery note.</h2>
      <ol class="v21-notes">${provenance.map((p, i) => `<li><span class="v21-note-n">${i + 1}</span><strong>${p.event}</strong><p>${p.detail}</p><em>${p.state}</em></li>`).join('')}</ol>
      <p class="v21-records-foot">Sample history of one skill. Approval commits the reviewed snapshot to your own Kiln GitHub repository, with Git status, sync and conflict resolution built in. On another machine, <code>kiln skills sync</code> installs everything marked for it. The CLI returns JSON, so your agents can read the library too.</p>
    </section>

    <section class="v21-power" aria-labelledby="v21-power-title">
      <svg class="v21-plug" viewBox="0 0 120 120" aria-hidden="true"><rect x="30" y="40" width="60" height="50" rx="10"/><rect x="42" y="16" width="10" height="26" rx="3"/><rect x="68" y="16" width="10" height="26" rx="3"/><path d="M60 90v22"/></svg>
      <div>
        <h2 id="v21-power-title">Runs on the power you already have.</h2>
        <p>${subscription.text} Editing, approving and installing never call a model at all. Before any agent interaction, a consent notice explains what gets sent.</p>
        <p class="v21-fine">${subscription.fine}</p>
      </div>
    </section>

    <section class="v21-get" id="v21-get" aria-labelledby="v21-get-title">
      <h2 id="v21-get-title">Open your own factory.</h2>
      <p>Kiln 0.17.0 for Windows, with a CLI. MIT licensed. Setup creates the GitHub repository that backs your library, using the official <code>gh</code> CLI.</p>
      <a class="v21-btn v21-btn-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="v21-fine">${releaseNote} Builds are unsigned, so Windows may ask before it runs.</p>
    </section>
  </main>
</div>`;

  const svg = root.querySelector<SVGSVGElement>('.v21-scene')!;
  const body = root.querySelector<HTMLElement>('.v21-panel-body')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideHome = { x: -300, y: -370, w: 1760, h: 1080 }, narrowHome = { x: -150, y: -300, w: 1480, h: 980 };
  let home = matchMedia('(min-width: 1000px)').matches ? wideHome : narrowHome;
  let view = { ...home };
  setView(view);
  let tween = 0;
  function setView(v: { x: number; y: number; w: number; h: number }) { svg.setAttribute('viewBox', `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`); }
  const zoomTo = (target: typeof view) => {
    cancelAnimationFrame(tween);
    const from = { ...view }, start = performance.now(), dur = reduce ? 1 : 720;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      view = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
      setView(view);
      if (k < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  };

  const machines = [...svg.querySelectorAll<SVGGElement>('.v21-m')];
  machines.forEach(m => {
    const i = Number(m.dataset.m);
    m.setAttribute('tabindex', '0');
    m.setAttribute('role', 'button');
    m.setAttribute('aria-label', `${stations[i].name}: explain this stage`);
  });

  const select = (i: number) => {
    root.querySelectorAll<HTMLButtonElement>('[data-go]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.go) === i)));
    svg.classList.toggle('has-focus', i >= 0);
    machines.forEach(m => m.classList.toggle('is-on', Number(m.dataset.m) === i));
    if (i < 0) {
      body.innerHTML = `<h2>The line, top to bottom</h2><p>Six stations, one idea at a time. ${matchMedia('(max-width: 760px)').matches ? 'Tap' : 'Click'} a machine, or a number below, to zoom in and see what it does.</p>`;
      zoomTo(home);
      return;
    }
    const s = stations[i];
    body.innerHTML = `<p class="v21-station-n">Station ${i + 1} of 6 · ${s.name}</p><h2>${s.title}</h2><p>${s.text}</p><dl>${s.spec.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
    const boxes = machines.filter(m => Number(m.dataset.m) === i).map(m => m.getBBox());
    const x1 = Math.min(...boxes.map(b => b.x)), y1 = Math.min(...boxes.map(b => b.y));
    const x2 = Math.max(...boxes.map(b => b.x + b.width)), y2 = Math.max(...boxes.map(b => b.y + b.height));
    const pad = 70, w = x2 - x1 + pad * 2, h = y2 - y1 + pad * 2;
    const aspect = home.w / home.h;
    const vw = Math.max(w, h * aspect, 560), vh = vw / aspect;
    const wide = matchMedia('(min-width: 1000px)').matches;
    // On wide screens the panel covers the lower-left, so frame the machine to the right of it.
    const cx = (x1 + x2) / 2 - (wide ? vw * 0.2 : 0), cy = (y1 + y2) / 2;
    zoomTo({ x: cx - vw / 2, y: cy - vh / 2, w: vw, h: vh });
  };
  root.querySelectorAll<HTMLButtonElement>('[data-go]').forEach(b => b.addEventListener('click', () => select(Number(b.dataset.go))));
  machines.forEach(m => {
    const go = () => select(Number(m.dataset.m));
    m.addEventListener('click', go);
    m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  select(-1);

  // The conveyor: items fall into the hopper, ride the belt, disappear into pipes and drop into a folder.
  const layer = svg.querySelector<SVGGElement>('.v21-items')!;
  const drops = svg.querySelector<SVGGElement>('.v21-drops')!;
  const count = 10;
  const FALL = 130, HIDE = 40, RIDE = BELT.end - (HOPPER.x + HOPPER.w), PIPE = 110, DROP = 44;
  const LOOP = FALL + HIDE + RIDE + PIPE + DROP;
  const items = Array.from({ length: count }, (_, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'v21-it');
    g.innerHTML = sprite(itemKinds[i % 3]);
    layer.append(g);
    return { g, folder: (i * 2) % 3, where: 'belt' as 'belt' | 'drop' };
  });
  const pressHead = svg.querySelector<SVGGElement>('.v21-press-head')!;
  const stampHead = svg.querySelector<SVGGElement>('.v21-stamp-head')!;
  const speed = 34;
  svg.style.setProperty('--v21-belt-period', `${30 / speed}s`);
  const bump = (d: number, r: number) => Math.max(0, 1 - Math.abs(d) / r);
  let chamberBusy = false;
  const frame = (now: number) => {
    const t = reduce ? 0 : now / 1000 * speed;
    let press = 0, stampK = 0, busy = false;
    items.forEach((it, i) => {
      const d = (t + i * LOOP / count) % LOOP;
      let x = HOPPER.x + HOPPER.w / 2, y = 35, z = 0, stage = 0, show = true, opacity = 1;
      if (d < FALL) { z = 330 - d; opacity = Math.min(1, d / 30); }
      else if (d < FALL + HIDE) show = false;
      else if (d < FALL + HIDE + RIDE) {
        x = HOPPER.x + HOPPER.w + (d - FALL - HIDE); z = BELT.h;
        stage = x < PRESS.x + PRESS.w ? 0 : x < TEST.x + TEST.w ? 1 : x < STAMP.x ? 2 : 3;
        press = Math.max(press, bump(x - (PRESS.x + PRESS.w / 2), 24));
        stampK = Math.max(stampK, bump(x - STAMP.x, 22));
        if (x > TEST.x && x < TEST.x + TEST.w) busy = true;
        if (x > CHUTE.x + 10) show = false;
      } else if (d < FALL + HIDE + RIDE + PIPE) show = false;
      else {
        const s = d - (FALL + HIDE + RIDE + PIPE);
        x = MANIFOLD_X; y = FOLDERS[it.folder].y + 45; z = 96 - s; stage = 4; opacity = Math.max(0, 1 - Math.max(0, s - 24) / 20);
      }
      const where = stage === 4 ? 'drop' : 'belt';
      if (where !== it.where) { (where === 'drop' ? drops : layer).append(it.g); it.where = where; }
      const [sx, sy] = project(x, y, z);
      it.g.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(1.4)`);
      it.g.setAttribute('data-stage', String(stage));
      it.g.style.opacity = show ? String(opacity) : '0';
    });
    pressHead.setAttribute('transform', `translate(0 ${(press * 26).toFixed(1)})`);
    stampHead.setAttribute('transform', `translate(0 ${(-34 + stampK * 34).toFixed(1)})`);
    if (busy !== chamberBusy) { chamberBusy = busy; svg.classList.toggle('is-testing', busy); }
    if (!reduce) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // Today's batch tabs.
  const ticket = root.querySelector<HTMLElement>('#v21-ticket')!;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const show = (i: number) => {
    tabs.forEach((tab, j) => { tab.setAttribute('aria-selected', String(i === j)); tab.tabIndex = i === j ? 0 : -1; });
    ticket.setAttribute('aria-labelledby', `v21-tab-${i}`);
    const e = examples[batch[i]], r = runs[i];
    ticket.innerHTML = `
      <div class="v21-t-step"><span class="v21-t-n">1</span><h3>Came in</h3><p>${e.source}. ${e.idea}</p></div>
      <div class="v21-t-step v21-t-prompt"><span class="v21-t-n">2</span><h3>Pressed into a prompt</h3><blockquote>${e.prompt}</blockquote></div>
      <div class="v21-t-step v21-t-run"><span class="v21-t-n">3</span><h3>Tested on your repo, read-only, with ${r.agent}</h3>
        <ol class="v21-log">${r.lines.map(l => `<li>${l}</li>`).join('')}</ol>
        <p class="v21-log-meta">Sample run · tokens in, cached and out shown live</p>
        <p class="v21-verdict"><span class="v21-state ${r.verdict === 'Pass' ? 'v21-ok' : 'v21-warn'}">Agent says: ${r.verdict}</span><span>${r.note}</span></p></div>
      <div class="v21-t-step"><span class="v21-t-n">4</span><h3>You stamp it</h3><p>${r.verdict === 'Pass' ? 'Read the output yourself. If it holds up, approve that exact revision.' : 'Edit the prompt, run it again on the same repo, and compare what changed. Approve when you’re satisfied.'}</p></div>
      <div class="v21-t-step v21-t-out"><span class="v21-t-n">5</span><h3>Out comes a skill</h3><p>${e.skill} “Create skill” drafts the SKILL.md for you, linked back to the source.</p></div>`;
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].focus(); show(next);
    });
  });
  show(0);
}
