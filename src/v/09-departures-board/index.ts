// PROTOTYPE variant 06 — Departures board. Saved ideas as delayed flights on a split-flap board; the rest of the page is airport wayfinding.
import './style.css';
import { examples, installer, installs, releaseNote, subscription, windowsMark } from '../../content';

const ALPHA = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/?';
const cols = { time: 5, idea: 22, gate: 2, status: 9 };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Flight = { time: string; idea: string; gate: string; status: string; remark: string; result?: string; resultRemark?: string; example?: number };
const flights: Flight[] = [
  { time: '08:05', idea: 'SEVEN-YEAR-OLD TEST', gate: 'T2', status: 'DELAYED', remark: 'From a YouTube talk. Saved “for later” in spring.', result: 'PASS', resultRemark: 'Agent’s assessment: pass. Keeping it is your call.', example: 0 },
  { time: '08:40', idea: 'WRONG INSTRUCTION HUNT', gate: 'T4', status: 'DELAYED', remark: 'From an agent workflow video. Bookmarked twice, opened never.', result: 'PASS', resultRemark: 'Found a stale line in AGENTS.md. Nothing was edited.', example: 1 },
  { time: '09:15', idea: 'PLAYTEST FOR THE FUN', gate: 'T1', status: 'CANCELLED', remark: 'Lost in a chat from March.', result: 'UNCERTAIN', resultRemark: 'It needs to play the build. Reported uncertain, not faked.', example: 2 },
  { time: '09:50', idea: 'REPO AND PR BRIEFING', gate: 'T3', status: 'BOARDING', remark: 'Testing on ./my-repo with Claude Code, read-only.' },
  { time: '10:25', idea: 'CODE REVIEW', gate: 'I1', status: 'DEPARTED', remark: 'Installed in Claude Code. Approved revision 2.' },
  { time: '11:00', idea: 'RISK-FIRST PROTOTYPE', gate: 'T2', status: 'DELAYED', remark: 'A screenshot from X, filed under someday.', result: 'PASS', resultRemark: 'Plan saved against revision 1. Edit it and run again.' },
];

const cell = () => `<span class="v06-f" data-c=" "><span class="v06-h v06-t"><b> </b></span><span class="v06-h v06-b"><b> </b></span><span class="v06-l v06-lt"><b> </b></span><span class="v06-l v06-lb"><b> </b></span></span>`;
const flaps = (key: string, n: number) => `<span class="v06-flaps v06-k-${key}" data-key="${key}" aria-hidden="true">${Array.from({ length: n }, cell).join('')}</span>`;
const statusClass = (status: string) => `is-${status.trim().toLowerCase().replace(/\s+/g, '-')}`;

const pictogram = {
  plane: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M29.6 4.2c-.9-.9-2.5-.8-3.6.3l-5.3 5.3L6.2 5.3 3.4 8.1l11.6 7.3-5 5-4.2-.6-2.3 2.3 5.2 2.9 2.9 5.2 2.3-2.3-.6-4.2 5-5 7.3 11.6 2.8-2.8-4.5-14.5 5.3-5.3c1.1-1.1 1.2-2.7.3-3.6z" transform="rotate(10 16 16)"/></svg>',
  capture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M7 9h18l-2 17H9zM11 9V7a5 5 0 0 1 10 0v2h-2.4V7a2.6 2.6 0 0 0-5.2 0v2z"/></svg>',
  test: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M4 7h24v14H4zm2.4 2.4v9.2h19.2V9.4zM9 11l4 3-4 3zm5 5h6v1.6h-6zM11 24h10v2.4H11z"/></svg>',
  approve: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3 5 7v8c0 7 4.7 12 11 14 6.3-2 11-7 11-14V7zm-2 18.4-5-5 1.8-1.8 3.2 3.2 7.2-7.2L23 12.4z"/></svg>',
  install: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M14.6 4h2.8v13.2l4.6-4.6 2 2-8 8-8-8 2-2 4.6 4.6zM5 24h22v3H5z"/></svg>',
  lost: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M13 4a9 9 0 1 0 5.6 16l7.2 7.2 2.1-2.1-7.2-7.2A9 9 0 0 0 13 4zm0 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm-.9 2.4h2v4h-2zm0 5.2h2v2h-2z"/></svg>',
  desk: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M3 17h26v3H3zm2 3h3v8H5zm19 0h3v8h-3zM12 6h8v2h4v7H8V8h4zm2 2h4V8h-4z"/></svg>',
};
const arrow = (deg: number) => `<svg class="v06-arrow" viewBox="0 0 32 32" style="transform:rotate(${deg}deg)" aria-hidden="true"><path fill="currentColor" d="M16 3 4 15h8v14h8V15h8z"/></svg>`;

const gates = [
  { key: 'C', id: 'v06-gate-c', name: 'Capture', icon: pictogram.capture, dir: -45 },
  { key: 'T', id: 'v06-gate-t', name: 'Test', icon: pictogram.test, dir: 0 },
  { key: 'A', id: 'v06-gate-a', name: 'Approve', icon: pictogram.approve, dir: 45 },
  { key: 'I', id: 'v06-gate-i', name: 'Install', icon: pictogram.install, dir: 90 },
];

const gateSign = (key: string, name: string, icon: string, note: string) => `
  <div class="v06-sign">
    <span class="v06-sign-key" aria-hidden="true">${key}</span>
    <span class="v06-sign-icon">${icon}</span>
    <span class="v06-sign-name"><span class="visually-hidden">Gate ${key}: </span><strong>${name}</strong></span>
    <span class="v06-sign-note">${note}</span>
  </div>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Your ideas have been delayed';
  root.innerHTML = `
<div class="v06">
  <header class="v06-top">
    <a class="v06-brand" href="?"><span aria-hidden="true">K</span>Kiln</a>
    <nav aria-label="Main navigation"><a href="#v06-gates">Gates</a><a href="#v06-lost">Lost and found</a><a href="#v06-desk">Check-in</a><a href="#v06-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v06-hero" aria-labelledby="v06-title">
      <div class="v06-hero-copy">
        <h1 id="v06-title">Your ideas have been delayed.</h1>
        <p>You saved the prompt, the post and the hour-long video. None of them took off. Kiln is a Windows app that tests a saved idea on your own repo through Codex or Claude Code, shows you the result, and turns the ones that work into skills.</p>
      </div>
      <div class="v06-board" role="region" aria-labelledby="v06-board-title">
        <div class="v06-board-head">
          <span class="v06-board-icon">${pictogram.plane}</span>
          <h2 id="v06-board-title">Departures</h2>
          <span class="v06-board-sub">Saved ideas, terminal K</span>
          <span class="v06-clock" aria-label="Local time"><span class="v06-clock-time">--:--</span></span>
        </div>
        <div class="v06-board-cols" aria-hidden="true"><span>Time</span><span>Saved idea</span><span>Gate</span><span>Status</span><span></span></div>
        <ol class="v06-rows">
          ${flights.map((flight, i) => `
          <li class="v06-row ${statusClass(flight.status)}" data-row="${i}">
            <span class="visually-hidden v06-read">${flight.time}, ${flight.idea.toLowerCase()}, gate ${flight.gate}, ${flight.status.toLowerCase()}. ${flight.remark}</span>
            ${flaps('time', cols.time)}${flaps('idea', cols.idea)}${flaps('gate', cols.gate)}${flaps('status', cols.status)}
            <span class="v06-act">${flight.result ? `<button type="button" class="v06-go" data-row="${i}">Test on ./my-repo</button>` : ''}</span>
            <span class="v06-remark" aria-hidden="true">${flight.remark}</span>
          </li>`).join('')}
        </ol>
        <p class="v06-board-foot"><span>Sample board. The statuses are what Kiln would show you; the ideas are yours.</span><span aria-live="polite" class="v06-announce"></span></p>
      </div>
      <div class="v06-hero-cta">
        <a class="v06-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p>Release 0.17.0 is in a private GitHub repository. Sign in with an account that has access.</p>
      </div>
    </section>

    <nav class="v06-hanging" id="v06-gates" aria-label="Gates">
      ${gates.map(gate => `<a href="#${gate.id}">${arrow(gate.dir)}<span class="v06-sign-key">${gate.key}</span><span>${gate.name}</span></a>`).join('')}
    </nav>

    <section class="v06-gate" id="v06-gate-c" aria-labelledby="v06-c-title">
      ${gateSign('C', 'Capture', pictogram.capture, 'All saved ideas check in here')}
      <div class="v06-gate-body v06-split">
        <div>
          <h2 id="v06-c-title">Check in anything, in seconds.</h2>
          <p>Paste or drop text, links, screenshots, images and files. Kiln sits in the tray, so the idea lands before you lose the tab.</p>
          <ul class="v06-keys">
            <li><kbd>Ctrl</kbd><kbd>N</kbd><span>Capture</span></li>
            <li><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>Space</kbd><span>Quick search, from anywhere</span></li>
          </ul>
        </div>
        <div class="v06-lanes">
          <div class="v06-lane"><h3>Save only</h3><p>Keeps it without calling a model.</p></div>
          <div class="v06-lane is-fast"><h3>Analyze and add</h3><p>Turns a source into prompts, insights, techniques, tools and resources, in a collection linked back to it.</p></div>
          <div class="v06-lane is-wide"><h3>Distill video</h3><p>Paste a YouTube link. Captions become reusable entries with timestamped source links, and the transcript stays attached.</p></div>
        </div>
      </div>
    </section>

    <section class="v06-gate is-main" id="v06-gate-t" aria-labelledby="v06-t-title">
      ${gateSign('T', 'Test', pictogram.test, 'Now boarding: ./my-repo')}
      <div class="v06-gate-body">
        <div class="v06-lead">
          <h2 id="v06-t-title">Stop saving it for later. Run it on your repo now.</h2>
          <p>Pick a local project or repository, or an isolated example, and run the exact prompt revision through Codex or Claude Code. Experiments are read-only: the agent inspects your code and nothing in it changes.</p>
        </div>
        <div class="v06-t-grid">
          <figure class="v06-monitor" aria-labelledby="v06-live-cap">
            <div class="v06-monitor-bar"><span class="v06-dot" aria-hidden="true"></span><span>Live run</span><span>Seven-year-old test, revision 1</span></div>
            <ol class="v06-log">
              <li><span>message</span>Starting in ./my-repo. I’ll use the app as a seven-year-old would.</li>
              <li><span>reasoning</span>Signup asks for a parent email. Skipping it as instructed.</li>
              <li><span>command</span><code>rg -n "onboarding" src/</code></li>
              <li><span>command</span><code>cat src/screens/Activities.tsx</code></li>
              <li><span>reasoning</span>The “Start” button and the “Play” card do the same thing. That’s the first obstacle.</li>
            </ol>
            <dl class="v06-stats">
              <div><dt>Agent</dt><dd>Codex</dd></div>
              <div><dt>Reasoning</dt><dd>Medium</dd></div>
              <div><dt>Elapsed</dt><dd>2:14</dd></div>
              <div><dt>Tokens in</dt><dd>41,380</dd></div>
              <div><dt>Cached</dt><dd>28,900</dd></div>
              <div><dt>Out</dt><dd>2,115</dd></div>
            </dl>
            <figcaption id="v06-live-cap">Sample run. Kiln shows messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and token counts as they happen. Up to two runs at once; cancel or retry either.</figcaption>
          </figure>
          <div class="v06-arrivals">
            <h3>Arrivals: the verdict</h3>
            <p>The output and the agent’s assessment are saved against the revision you ran. Its opinion and yours are kept apart.</p>
            <table>
              <caption class="visually-hidden">Agent assessment and your judgement, kept separately</caption>
              <thead><tr><th scope="col">Agent says</th><th scope="col">Meaning</th></tr></thead>
              <tbody>
                <tr><th scope="row" class="is-pass">PASS</th><td>It did what the prompt asked.</td></tr>
                <tr><th scope="row" class="is-fail">FAIL</th><td>It didn’t, and says why.</td></tr>
                <tr><th scope="row" class="is-unsure">UNCERTAIN</th><td>The task needed edits or tools it didn’t have. No faked successes.</td></tr>
              </tbody>
            </table>
            <p class="v06-yours"><strong>You decide.</strong> Keep it, revise it or let it go. Kiln never approves anything for you.</p>
          </div>
        </div>
        <div class="v06-transfer">
          <div class="v06-transfer-sign"><span class="v06-sign-key" aria-hidden="true">T</span><h3>Transfer: learn by revising</h3></div>
          <div class="v06-transfer-body">
            <p>Edit the prompt, compare revisions and run it again on the same repo. You see what changed the result, which is how prompting actually gets learned. Stuck? “Ask the agent” discusses the item with its attachments and the source video’s context.</p>
            <div class="v06-diff" role="group" aria-label="Sample diff between revision 1 and revision 2">
              <p class="v06-diff-head">Revision 1 to revision 2</p>
              <p class="is-del">− Describe the first obstacle and suggest a fix.</p>
              <p class="is-add">+ Describe the first obstacle, what you expected to happen, and one fix.</p>
              <p class="is-ctx">&nbsp; Make no changes yet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="v06-gate" id="v06-gate-a" aria-labelledby="v06-a-title">
      ${gateSign('A', 'Approve', pictogram.approve, 'Reviewed revisions only')}
      <div class="v06-gate-body v06-split">
        <div>
          <h2 id="v06-a-title">Only the revision you checked gets on board.</h2>
          <p>When a prompt proves itself, “Create skill” drafts a SKILL.md from it using Kiln’s bundled writing-for-agents guidance, linked back to its source. Approval pins that exact revision.</p>
        </div>
        <ul class="v06-rules">
          <li><strong>Editing never replaces the approved one.</strong> It creates a new draft; the approval stays with the revision you reviewed.</li>
          <li><strong>Published to your own GitHub repository.</strong> Approval commits the snapshot to the Kiln repo it set up for you, in a standard layout. Validation never executes skills.</li>
          <li><strong>Sync is built in.</strong> Git status, sync and conflict resolution, inside the app.</li>
        </ul>
      </div>
    </section>

    <section class="v06-gate" id="v06-gate-i" aria-labelledby="v06-i-title">
      ${gateSign('I', 'Install', pictogram.install, 'Codex, Claude Code, Copilot')}
      <div class="v06-gate-body v06-split">
        <div>
          <h2 id="v06-i-title">Departed. Your next agent session has it.</h2>
          <p>Install the approved revision into compatible Codex, Claude Code or Copilot locations, for you or for one project. A new agent session picks it up. Every install leaves a receipt with the revision and destination.</p>
          <p>On another machine, open the repo and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.</p>
        </div>
        <article class="v06-pass" aria-label="Sample install receipt, styled as a boarding pass">
          <div class="v06-pass-main">
            <p class="v06-pass-top"><span>Install receipt</span><span>Sample</span></p>
            <p class="v06-pass-route"><span><small>From</small>my-kiln</span>${pictogram.plane}<span><small>To</small>Claude Code</span></p>
            <dl>
              <div><dt>Skill</dt><dd>code-review</dd></div>
              <div><dt>Revision</dt><dd>2, approved</dd></div>
              <div class="is-wide"><dt>Destination</dt><dd>~/.claude/skills/code-review</dd></div>
            </dl>
          </div>
          <div class="v06-pass-stub" aria-hidden="true"><span>REV</span><strong>2</strong><span class="v06-pass-bars"></span></div>
        </article>
      </div>
    </section>

    <section class="v06-lost" id="v06-lost" aria-labelledby="v06-lost-title">
      <div class="v06-sign is-dark"><span class="v06-sign-icon">${pictogram.lost}</span><span class="v06-sign-name"><strong>Lost and found</strong></span><span class="v06-sign-note">One library for every prompt and skill</span></div>
      <div class="v06-lost-body">
        <div>
          <h2 id="v06-lost-title">Where did that skill end up?</h2>
          <p>Skills are loose folders in <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.github/skills</code> and more. Kiln keeps one library of prompts, skills, custom agents and source notes, with collections, tags, favorites and filters. Import installed skills or a skills repository as drafts; the originals stay where they are.</p>
          <p>“Find skills and agents not in the library” scans your locations and offers safe cleanup of broken links and empty folders. Every skill description sits in your agent’s context on every turn, so a stale copy costs attention even when it never fires.</p>
        </div>
        <table class="v06-claim">
          <caption>Baggage claim: code-review, every copy</caption>
          <thead><tr><th scope="col">Carousel</th><th scope="col">Path</th><th scope="col">State</th></tr></thead>
          <tbody>${installs.map(row => `<tr><th scope="row">${row.agent}</th><td><code>${row.path}</code></td><td><span class="v06-state ${row.ok ? '' : 'is-warn'}">${row.state}</span></td></tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="v06-lost-foot">Compare a copy with the approved version file by file. Remove local copies in bulk: managed copies are deleted, anything else is moved to private backups. Config files too: CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, edited in place with syntax checks, 30 private backups and a diff before you restore. Kiln never runs your hooks.</p>
    </section>

    <section class="v06-desk" id="v06-desk" aria-labelledby="v06-desk-title">
      <div class="v06-sign"><span class="v06-sign-icon">${pictogram.desk}</span><span class="v06-sign-name"><strong>Check-in</strong></span><span class="v06-sign-note">No extra ticket</span></div>
      <div class="v06-desk-body">
        <h2 id="v06-desk-title">${subscription.title}</h2>
        <p>${subscription.text} ${subscription.fine} Editing, approval and installation never call a model, and a consent notice explains what’s sent before any agent interaction.</p>
        <p>Your library lives on your machine and is backed by a GitHub repository Kiln creates for you with the official <code>gh</code> CLI. The MIT-licensed CLI scripts collections, experiments, approvals and installs with JSON results, so your agents can read the library too.</p>
      </div>
      <div class="v06-first">
        <h3>First flight, if you need one</h3>
        <p class="v06-first-title">${examples[0].title}</p>
        <blockquote>${examples[0].prompt}</blockquote>
      </div>
    </section>

    <section class="v06-download" id="v06-download" aria-labelledby="v06-dl-title">
      <div class="v06-dl-sign">${arrow(90)}<h2 id="v06-dl-title">Now boarding: Kiln 0.17.0 for Windows</h2></div>
      <div class="v06-dl-body">
        <a class="v06-button is-big" href="${installer}">${windowsMark}<span>Download the Windows installer</span></a>
        <p>${releaseNote}</p>
        <p class="v06-fine">Builds are unsigned, so Windows may ask before it runs the installer. Kiln uses your existing Codex or Claude Code sign-in.</p>
      </div>
    </section>
  </main>
</div>`;

  const board = root.querySelector<HTMLElement>('.v06-board')!;
  const announce = root.querySelector<HTMLElement>('.v06-announce')!;
  const clock = root.querySelector<HTMLElement>('.v06-clock-time')!;
  const tick = () => { const now = new Date(); clock.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; };
  tick();
  setInterval(tick, 10_000);

  const parts = (f: HTMLElement) => Array.from(f.querySelectorAll<HTMLElement>(':scope > span > b'));
  const flipOnce = (f: HTMLElement, from: string, to: string, duration: number) => {
    const [top, bottom, leafTop, leafBottom] = parts(f);
    top.textContent = to; bottom.textContent = from; leafTop.textContent = from; leafBottom.textContent = to;
    const lt = leafTop.parentElement!, lb = leafBottom.parentElement!;
    lt.style.visibility = lb.style.visibility = 'visible';
    const a = lt.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: duration / 2, easing: 'ease-in', fill: 'forwards' });
    const b = lb.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], { duration: duration / 2, delay: duration / 2, easing: 'ease-out', fill: 'both' });
    return b.finished.then(() => { bottom.textContent = to; lt.style.visibility = lb.style.visibility = 'hidden'; a.cancel(); b.cancel(); });
  };
  const setChar = async (f: HTMLElement, target: string, delay: number) => {
    const current = f.dataset.c ?? ' ';
    if (current === target) return;
    f.dataset.c = target;
    if (reduced) { parts(f).forEach(part => (part.textContent = target)); return; }
    const L = ALPHA.length, to = Math.max(0, ALPHA.indexOf(target)), from = Math.max(0, ALPHA.indexOf(current));
    const steps = Math.min((to - from + L) % L || L, 3 + Math.floor(Math.random() * 5));
    const sequence = Array.from({ length: steps }, (_, k) => ALPHA[(to - (steps - 1 - k) + L) % L]);
    await new Promise(resolve => setTimeout(resolve, delay));
    let shown = current;
    for (const next of sequence) { await flipOnce(f, shown, next, 64); shown = next; }
  };
  const setField = (row: HTMLElement, key: string, text: string, stagger = 0) => {
    const group = row.querySelector<HTMLElement>(`[data-key="${key}"]`)!;
    const chars = text.toUpperCase().padEnd(group.children.length, ' ').slice(0, group.children.length).split('');
    return Promise.all(Array.from(group.children as HTMLCollectionOf<HTMLElement>).map((f, i) => setChar(f, chars[i], stagger + i * 18)));
  };
  const rows = Array.from(root.querySelectorAll<HTMLElement>('.v06-row'));
  rows.forEach((row, i) => {
    const flight = flights[i];
    const base = i * 110;
    setField(row, 'time', flight.time, base);
    setField(row, 'idea', flight.idea, base + 60);
    setField(row, 'gate', flight.gate, base + 120);
    setField(row, 'status', flight.status, base + 160);
  });

  const setStatus = async (row: HTMLElement, status: string, remark: string) => {
    row.className = `v06-row ${statusClass(status)}`;
    row.querySelector<HTMLElement>('.v06-remark')!.textContent = remark;
    await setField(row, 'status', status);
  };
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? Math.min(ms, 400) : ms));
  board.addEventListener('click', async event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.v06-go');
    if (!button) return;
    const i = Number(button.dataset.row), row = rows[i], flight = flights[i];
    const stage = button.dataset.stage ?? 'test';
    button.disabled = true;
    const read = row.querySelector<HTMLElement>('.v06-read')!;
    const say = (status: string, remark: string) => { read.textContent = `${flight.time}, ${flight.idea.toLowerCase()}, ${status.toLowerCase()}. ${remark}`; announce.textContent = `${flight.idea.toLowerCase()}: ${status.toLowerCase()}. ${remark}`; };
    if (stage === 'test') {
      button.textContent = 'Boarding…';
      say('Boarding', 'Testing on ./my-repo, read-only.');
      await setStatus(row, 'BOARDING', 'Boarding: ./my-repo, read-only. Revision 1 through Codex.');
      await wait(1100);
      button.textContent = 'Running…';
      say('In flight', 'The run is live.');
      await setStatus(row, 'IN FLIGHT', 'Live: messages, commands and token counts streaming in.');
      await wait(1500);
      await setStatus(row, flight.result!, flight.resultRemark!);
      say(flight.result!, flight.resultRemark!);
      if (flight.result === 'UNCERTAIN') { button.textContent = 'Revise and retry'; button.dataset.stage = 'test'; button.disabled = false; flight.result = 'PASS'; flight.resultRemark = 'Revision 2 asked for a code read only. Agent says pass.'; return; }
      button.textContent = 'Approve and install';
      button.dataset.stage = 'install';
      button.disabled = false;
    } else {
      button.textContent = 'Installing…';
      await setStatus(row, 'APPROVED', 'You approved this exact revision. Published to my-kiln.');
      await wait(900);
      setField(row, 'gate', 'I1');
      await setStatus(row, 'DEPARTED', 'Installed in Claude Code. A new session picks it up.');
      say('Departed', 'Installed in Claude Code.');
      button.remove();
    }
  });
}
