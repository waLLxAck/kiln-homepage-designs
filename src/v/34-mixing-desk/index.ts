// PROTOTYPE variant 31 — Mixing desk. Installed skills as channel strips feeding a "context in every session" master bus.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Tone = 'ok' | 'dup' | 'link' | 'warn';
type Channel = { name: string; where: string; state: string; tone: Tone; cap: string; tokens: number; use: number };

// Sample desk: names, locations and token loads are illustrative, not measured by Kiln.
const channels: Channel[] = [
  { name: 'code-review', where: '~/.claude/skills', state: 'Installed', tone: 'ok', cap: '#e5484d', tokens: 190, use: 85 },
  { name: 'code-review', where: '~/.agents/skills', state: 'Identical copy', tone: 'dup', cap: '#e5484d', tokens: 190, use: 5 },
  { name: 'research', where: '~/.agents/skills', state: 'Installed', tone: 'ok', cap: '#f5a524', tokens: 150, use: 60 },
  { name: 'writing-for-agents', where: '~/.claude/skills', state: 'Linked', tone: 'link', cap: '#f2d94e', tokens: 120, use: 45 },
  { name: 'playtest', where: 'game/.github/skills', state: 'Installed', tone: 'ok', cap: '#46a758', tokens: 110, use: 30 },
  { name: 'lint-rules-old', where: '~/.codex/skills', state: 'Edited outside Kiln', tone: 'warn', cap: '#3e8ef7', tokens: 210, use: 0 },
  { name: 'deploy-notes', where: '~/.copilot/skills', state: 'Differs', tone: 'warn', cap: '#a56de2', tokens: 140, use: 10 },
  { name: 'meeting-summary', where: '~/.claude/skills', state: 'Installed', tone: 'ok', cap: '#dcdcdc', tokens: 90, use: 0 },
];
const fullScale = 240;
const total = channels.reduce((sum, channel) => sum + channel.tokens, 0);

const jacks = [
  { file: 'CLAUDE.md', path: '~/.claude/CLAUDE.md', note: 'Personal memory for Claude Code. Edit the real file; Kiln keeps a private backup before every save.' },
  { file: 'AGENTS.md', path: 'your-app/AGENTS.md', note: 'Project guidance read by Codex and other agents. Compare it with any of the last 30 backups and restore one.' },
  { file: 'config.toml', path: '~/.codex/config.toml', note: 'Codex settings, checked for TOML syntax before the save goes through.' },
  { file: 'hooks.json', path: '~/.codex/hooks.json', note: 'Codex hooks, edited and validated as JSON. Kiln never executes a hook.' },
  { file: 'settings.json', path: '~/.claude/settings.json', note: 'Claude Code settings, permissions and hooks. If the file changes on disk while you edit, Kiln tells you before you overwrite it.' },
  { file: 'Copilot', path: 'Copilot settings', note: 'Copilot configuration next to the rest, instead of in another window.' },
  { file: 'MCP', path: 'MCP server config', note: 'The servers your agents can reach, with syntax checks and a diff before you restore.' },
  { file: 'VS Code', path: 'VS Code settings.json', note: 'Editor settings that shape agent behaviour, in the same place as the agent files.' },
  { file: 'Shell', path: 'Shell profile', note: 'The profile your agents inherit. Edited in place, backed up privately, never run by Kiln.' },
];

const takes = [
  { rev: 1, label: 'Imported draft', text: 'Review the diff for bugs and style.', lamp: '' },
  { rev: 2, label: 'Tested, approved', text: 'Review the diff against the repo standards, then against the spec. Report each separately.', lamp: 'approved' },
  { rev: 3, label: 'New draft', text: 'Review the diff against the repo standards, then against the spec. Skip generated files. Report each separately.', lamp: 'draft' },
];

type Verdict = 'pass' | 'uncertain' | 'fail';
const auditions: { verdict: Verdict; log: string[]; summary: string; tokens: [number, number, number] }[] = [
  { verdict: 'pass', tokens: [48210, 31900, 2140], summary: 'Found the first obstacle: the activity picker assumes you can read the word “Quiz”. Suggested an icon and a spoken hint. No files changed.', log: ['Reading app/routes and the onboarding flow', 'Command: rg "signup" --files-with-matches', 'Reasoning: skip parent-only screens, start at the activity picker', 'Command: rg "Quiz" app/components', 'Writing the first obstacle and a suggested fix'] },
  { verdict: 'pass', tokens: [39800, 27400, 1760], summary: 'Traced the unwanted refactor to an outdated line in AGENTS.md that asks for “tidy code on every change”. Proposed a one-sentence replacement.', log: ['Reading AGENTS.md and CLAUDE.md', 'Command: git log -5 --oneline -- AGENTS.md', 'Reasoning: the instruction predates the style guide', 'Comparing the guidance with the recent conversation', 'Writing the cause and the smallest instruction change'] },
  { verdict: 'uncertain', tokens: [52300, 30100, 2480], summary: 'Listed likely annoyances from the code, but a real playtest needs to run the game, and that tool was not available here. Marked uncertain rather than guessing.', log: ['Reading src/game and the level data', 'Command: rg "spawnRate|difficulty" src', 'Reasoning: fun depends on running the build', 'Checking for a way to launch the game: none available', 'Writing ranked suspicions and what it could not check'] },
];

const segments = (count: number) => Array.from({ length: count }, (_, i) => `<i data-seg="${i}"></i>`).join('');
const fmt = (value: number) => value.toLocaleString('en-US');
const screws = '<span class="v31-screw" aria-hidden="true"></span><span class="v31-screw" aria-hidden="true"></span><span class="v31-screw" aria-hidden="true"></span><span class="v31-screw" aria-hidden="true"></span>';

export function render(root: HTMLElement) {
  document.title = 'Kiln — Mute the skills you never use';
  root.innerHTML = `
<div class="v31">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v31-top">
    <a class="v31-brand" href="?"><span class="v31-brand-lamp" aria-hidden="true"></span>Kiln<small>Series 0.17</small></a>
    <nav aria-label="Main navigation">
      <a href="#v31-desk">Channels</a><a href="#v31-takes">Takes</a><a href="#v31-patch">Patch bay</a><a href="#v31-audition">Audition</a><a href="#v31-download">Download</a>
    </nav>
  </header>
  <main id="main">
    <section class="v31-hero" aria-labelledby="v31-title">
      <h1 id="v31-title">Mute the skills you never use.</h1>
      <div class="v31-lede">
        <p>Every skill an agent can call brings its description into the session, on every turn, whether it fires or not. The forgotten one, the duplicate, the one you edited by hand last spring: all of them are in the mix.</p>
        <p>Kiln is a Windows app that shows you every installed copy, in every location, so you can pull out what doesn’t earn its place.</p>
        <a class="v31-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      </div>
    </section>

    <section class="v31-desk-wrap" id="v31-desk" aria-labelledby="v31-desk-title">
      <h2 class="visually-hidden" id="v31-desk-title">Sample console of installed skills</h2>
      <div class="v31-desk">
        ${screws}
        <div class="v31-desk-head">
          <p class="v31-silk">Installed skills</p>
          <p class="v31-sample-tape">Sample desk · illustrative loads</p>
        </div>
        <ol class="v31-strips" aria-label="Channels, one per installed copy">
          ${channels.map((channel, i) => `
          <li class="v31-strip" data-ch="${i}" style="--cap:${channel.cap}">
            <p class="v31-num">CH ${String(i + 1).padStart(2, '0')}</p>
            <p class="v31-where" title="${channel.where}">${channel.where.replace(/\//g, '/<wbr>')}</p>
            <p class="v31-state is-${channel.tone}"><i aria-hidden="true"></i><span>${channel.state}</span></p>
            <div class="v31-gain">
              <div class="v31-meter" aria-hidden="true">${segments(16)}</div>
              <div class="v31-fader" role="slider" tabindex="0" aria-label="How often you use ${channel.name} in ${channel.where}, your guess" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${channel.use}" aria-valuetext="${channel.use}% of sessions" style="--v:${channel.use}">
                <span class="v31-slot" aria-hidden="true"></span><span class="v31-knob" aria-hidden="true"></span>
              </div>
            </div>
            <p class="v31-load"><span>~${channel.tokens}</span> tk</p>
            <button type="button" class="v31-mute" data-mute="${i}" aria-label="Remove local copy of ${channel.name} from ${channel.where}">Remove copy</button>
            <p class="v31-tape">${channel.name}</p>
          </li>`).join('')}
        </ol>
        <div class="v31-master">
          <p class="v31-silk">Master</p>
          <p class="v31-master-label">Context in every session</p>
          <div class="v31-master-meters" aria-hidden="true"><div class="v31-meter v31-meter-big" data-master="0">${segments(24)}</div><div class="v31-meter v31-meter-big" data-master="1">${segments(24)}</div></div>
          <p class="v31-readout" aria-live="polite"><b><span data-total>${fmt(total)}</span> tk</b><small>sample, per turn</small></p>
          <button type="button" class="v31-bulk" data-bulk>Remove copies you rarely use</button>
          <button type="button" class="v31-reset" data-reset>Reinstall all</button>
        </div>
      </div>
      <p class="v31-hint" aria-live="polite" data-hint>Pull a fader down first. Then press Remove copy.</p>
      <p class="v31-fine">A sample console. Channel names, locations and token loads are made up to show the idea; Kiln doesn’t measure a per-skill token cost. What it does show is real: every installed copy, where it lives and what state it’s in.</p>
    </section>

    <section class="v31-truth" aria-labelledby="v31-truth-title">
      <div class="v31-truth-head">
        <h2 id="v31-truth-title">Installed means loaded.</h2>
        <p>The fader on the desk is how often you use a skill. Pulling it down changes nothing, because an agent reads every model-invoked skill’s description on every turn to decide what to fire. The only way to take a channel out of the mix is to take the copy out of the folder.</p>
      </div>
      <ol class="v31-flow" aria-label="Signal flow">
        <li><strong>A skill folder</strong><span>~/.claude/skills, ~/.agents/skills, .codex, .copilot, a project’s .github/skills</span></li>
        <li><strong>Its description</strong><span>Written so the agent knows when to reach for it</span></li>
        <li><strong>Every turn’s context</strong><span>Tokens and attention, spent whether it fires or not</span></li>
      </ol>
      <div class="v31-cards">
        <article class="v31-card"><h3>What Kiln shows</h3><p>For each skill, every installed copy across your personal locations and enrolled projects: installed, identical copy found, differs, linked, or edited outside Kiln. Compare any copy file by file with the approved version.</p></article>
        <article class="v31-card"><h3>What Remove does</h3><p>Remove local copies one at a time or in bulk. Copies Kiln installed are deleted; anything else moves to a private backup. The skill stays in your library, ready to reinstall. Install receipts record which revision went where.</p></article>
        <article class="v31-card"><h3>Where the real numbers are</h3><p>Every test run shows its actual token usage (input, cached and output) with the model and reasoning effort. And when Kiln drafts a skill, its bundled writing-for-agents guidance is built around context load, pruning and descriptions that trigger well.</p></article>
      </div>
    </section>

    <section class="v31-takes" id="v31-takes" aria-labelledby="v31-takes-title">
      <div class="v31-section-head">
        <h2 id="v31-takes-title">Recall the exact take.</h2>
        <p>Approval pins one revision. Edit the skill and you record a new take; the approved one stays where it was, and install always plays the approved take.</p>
      </div>
      <div class="v31-rack">
        ${screws}
        <div class="v31-track-sheet" role="group" aria-label="Revisions of code-review">
          ${takes.map(take => `
          <button type="button" class="v31-take" data-take="${take.rev}" aria-pressed="${take.rev === 2}">
            <span class="v31-take-no">Take ${take.rev}</span>
            <span class="v31-take-label">${take.label}</span>
            <span class="v31-lamp ${take.lamp ? `is-${take.lamp}` : ''}" aria-hidden="true"></span>
          </button>`).join('')}
        </div>
        <div class="v31-take-view" aria-live="polite" data-take-view></div>
      </div>
      <ul class="v31-take-notes">
        <li><h3>Published where you can see it</h3><p>Approval commits and publishes the snapshot to your own Kiln GitHub repository, in a standard layout. Validation never executes a skill.</p></li>
        <li><h3>Same takes on the next machine</h3><p>Open the repository and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.</p></li>
        <li><h3>Git, handled</h3><p>Status, sync and conflict resolution are built in, so the library and the repository stay in step.</p></li>
      </ul>
    </section>

    <section class="v31-patch" id="v31-patch" aria-labelledby="v31-patch-title">
      <div class="v31-section-head">
        <h2 id="v31-patch-title">The patch bay.</h2>
        <p>The files that route your agents live in a dozen places. Kiln puts them on one panel and edits the real file in place.</p>
      </div>
      <div class="v31-bay">
        ${screws}
        <div class="v31-jacks" role="group" aria-label="Config files">
          ${jacks.map((jack, i) => `<button type="button" class="v31-jack" data-jack="${i}" aria-pressed="${i === 0}"><span class="v31-hole" aria-hidden="true"><span class="v31-plug"></span></span><span class="v31-jack-label">${jack.file}</span></button>`).join('')}
        </div>
        <div class="v31-jack-view" aria-live="polite" data-jack-view></div>
        <ul class="v31-bay-specs" aria-label="What the editor does">
          <li>Syntax validation</li><li>30 private backups</li><li>Diff and restore</li><li>Stale-edit detection</li><li>Never runs hooks</li>
        </ul>
      </div>
    </section>

    <section class="v31-audition" id="v31-audition" aria-labelledby="v31-audition-title">
      <div class="v31-section-head">
        <h2 id="v31-audition-title">The audition.</h2>
        <p>Before a prompt gets a channel, hear it on your own repo. Kiln runs the exact revision through your Codex or Claude Code, read-only, and you watch every message, command and search as it happens.</p>
      </div>
      <div class="v31-booth">
        ${screws}
        <div class="v31-booth-controls">
          <p class="v31-silk">Choose a track</p>
          <div class="v31-tracks" role="radiogroup" aria-label="Example prompt">
            ${examples.map((example, i) => `<button type="button" class="v31-track" role="radio" aria-checked="${i === 0}" data-track="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${example.title}</button>`).join('')}
          </div>
          <blockquote class="v31-prompt" data-prompt>${examples[0].prompt}</blockquote>
          <p class="v31-repo"><span class="v31-repo-lamp" aria-hidden="true"></span>~/code/your-app <small>read-only</small></p>
          <div class="v31-booth-buttons">
            <button type="button" class="v31-button v31-go" data-go>Audition on my repo</button>
            <button type="button" class="v31-cancel" data-cancel hidden>Cancel</button>
          </div>
        </div>
        <div class="v31-monitor">
          <div class="v31-monitor-head"><span>Live activity</span><span data-clock>00:00</span></div>
          <ol class="v31-log" data-log aria-live="polite"><li class="is-idle">Waiting for a run. Sample session.</li></ol>
          <dl class="v31-usage">
            <div><dt>Input</dt><dd data-tok="0">—</dd></div><div><dt>Cached</dt><dd data-tok="1">—</dd></div><div><dt>Output</dt><dd data-tok="2">—</dd></div><div><dt>Model</dt><dd>Your agent</dd></div>
          </dl>
          <div class="v31-verdict" role="group" aria-label="Agent assessment">
            <span class="v31-vlamp" data-v="pass">Pass</span><span class="v31-vlamp" data-v="uncertain">Uncertain</span><span class="v31-vlamp" data-v="fail">Fail</span>
          </div>
          <p class="v31-summary" data-summary></p>
          <div class="v31-yours" data-yours hidden><span>Your call, kept separately:</span><button type="button" class="v31-call" aria-pressed="false">Keep it</button><button type="button" class="v31-call" aria-pressed="false">Not yet</button></div>
        </div>
      </div>
      <p class="v31-fine">Sample run with illustrative token counts. Up to two runs at once; cancel or retry any of them. Tasks that need edits or tools the run doesn’t have come back uncertain instead of faking a pass. The agent’s assessment is saved with the revision, and your judgement is kept apart from it.</p>
    </section>

    <section class="v31-out" id="v31-download" aria-labelledby="v31-out-title">
      <div class="v31-out-panel">
        ${screws}
        <div class="v31-out-copy">
          <h2 id="v31-out-title">Clear the mix. Keep the takes that work.</h2>
          <p>${subscription.text} ${subscription.fine} Normal editing, approval and installation never call a model, and a consent notice explains what’s sent before any agent interaction.</p>
        </div>
        <div class="v31-out-action">
          <a class="v31-button v31-button-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
          <p>${releaseNote}</p>
          <p class="v31-fine-small">Unsigned build, so Windows may ask you to confirm. MIT licensed, with a CLI for scripting collections, experiments, approvals and installs. Your library is backed by a GitHub repository Kiln creates for you with the official gh CLI.</p>
        </div>
      </div>
    </section>
  </main>
  <footer class="v31-foot"><span>Kiln</span><span>Windows desktop app and CLI</span><span>Works with Codex, Claude Code and Copilot locations</span></footer>
</div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const strips = [...root.querySelectorAll<HTMLElement>('.v31-strip')];
  const muted = channels.map(() => false);
  const levels = channels.map(() => 0);
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const totalOut = root.querySelector<HTMLElement>('[data-total]')!;
  let shownTotal = total;
  let faderTold = false;

  const light = (meter: Element, level: number) => {
    const cells = meter.children;
    const lit = Math.round(level * cells.length);
    for (let i = 0; i < cells.length; i++) cells[i].classList.toggle('is-on', i < lit);
  };
  const liveTotal = () => channels.reduce((sum, channel, i) => sum + (muted[i] ? 0 : channel.tokens), 0);

  const setMute = (i: number, value: boolean, quiet = false) => {
    muted[i] = value;
    const strip = strips[i];
    strip.classList.toggle('is-muted', value);
    const button = strip.querySelector<HTMLButtonElement>('.v31-mute')!;
    button.textContent = value ? 'Reinstall' : 'Remove copy';
    button.setAttribute('aria-label', `${value ? 'Reinstall' : 'Remove local copy of'} ${channels[i].name} ${value ? 'into' : 'from'} ${channels[i].where}`);
    strip.querySelector('.v31-state span')!.textContent = value ? 'Copy removed' : channels[i].state;
    if (!quiet) hint.textContent = value
      ? `Removed ${channels[i].where}/${channels[i].name}. The master drops by ~${channels[i].tokens} sample tokens. The skill stays in your library; a managed copy is deleted, anything else goes to a private backup.`
      : `Reinstalled ${channels[i].name} into ${channels[i].where} from its approved revision.`;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-mute]').forEach(button => button.addEventListener('click', () => { const i = Number(button.dataset.mute); setMute(i, !muted[i]); }));
  root.querySelector('[data-bulk]')!.addEventListener('click', () => {
    const rarely = channels.map((_, i) => i).filter(i => !muted[i] && channels[i].use <= 15);
    rarely.forEach(i => setMute(i, true, true));
    hint.textContent = rarely.length ? `Removed ${rarely.length} cop${rarely.length === 1 ? 'y' : 'ies'} with the fader at 15% or lower. The library still has every one of them.` : 'Nothing left at 15% or lower. Pull another fader down to pick it.';
  });
  root.querySelector('[data-reset]')!.addEventListener('click', () => { channels.forEach((_, i) => setMute(i, false, true)); hint.textContent = 'Every copy reinstalled from its approved revision.'; });

  // Faders: pointer drag and keyboard.
  root.querySelectorAll<HTMLElement>('.v31-fader').forEach((fader, i) => {
    const set = (value: number) => {
      const v = Math.max(0, Math.min(100, Math.round(value)));
      channels[i].use = v;
      fader.style.setProperty('--v', String(v));
      fader.setAttribute('aria-valuenow', String(v));
      fader.setAttribute('aria-valuetext', `${v}% of sessions`);
      if (!faderTold) { faderTold = true; hint.textContent = 'Notice the meter didn’t move. Using a skill less doesn’t make its description any smaller. Press Remove copy to take it out of the mix.'; }
    };
    const fromPointer = (event: PointerEvent) => { const box = fader.getBoundingClientRect(); set((1 - (event.clientY - box.top - 14) / (box.height - 28)) * 100); };
    fader.addEventListener('pointerdown', event => { fader.setPointerCapture(event.pointerId); fromPointer(event); fader.focus(); event.preventDefault(); });
    fader.addEventListener('pointermove', event => { if (fader.hasPointerCapture(event.pointerId)) fromPointer(event); });
    fader.addEventListener('keydown', event => {
      const step = event.shiftKey ? 20 : 5;
      const map: Record<string, number> = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: 20, PageDown: -20 };
      if (event.key in map) { set(channels[i].use + map[event.key]); event.preventDefault(); }
      if (event.key === 'Home') { set(0); event.preventDefault(); }
      if (event.key === 'End') { set(100); event.preventDefault(); }
    });
  });

  // Meters: a bouncing level around each channel's sample load; the fader never touches it.
  const meters = strips.map(strip => strip.querySelector('.v31-meter')!);
  const masters = [...root.querySelectorAll('[data-master]')];
  let masterLevel = 0;
  const frame = (time: number) => {
    channels.forEach((channel, i) => {
      const base = muted[i] ? 0 : channel.tokens / fullScale;
      const wobble = reduced || muted[i] ? 0 : (Math.sin(time / 170 + i * 1.7) + Math.sin(time / 67 + i * 3.1) * .6) * .06;
      levels[i] += (Math.max(0, base + wobble) - levels[i]) * .25;
      light(meters[i], levels[i]);
    });
    const target = liveTotal() / total * .88;
    const wobble = reduced || target === 0 ? 0 : Math.sin(time / 130) * .025 + Math.sin(time / 53) * .015;
    masterLevel += (Math.max(0, target + wobble) - masterLevel) * .12;
    masters.forEach((meter, i) => light(meter, Math.max(0, masterLevel - i * .015)));
    const aim = liveTotal();
    if (shownTotal !== aim) { shownTotal += Math.sign(aim - shownTotal) * Math.max(1, Math.round(Math.abs(aim - shownTotal) * .15)); totalOut.textContent = fmt(shownTotal); }
    if (!reduced) requestAnimationFrame(frame);
  };
  if (reduced) {
    const still = () => { channels.forEach((channel, i) => light(meters[i], muted[i] ? 0 : channel.tokens / fullScale)); masters.forEach(meter => light(meter, liveTotal() / total * .88)); shownTotal = liveTotal(); totalOut.textContent = fmt(shownTotal); };
    still();
    root.querySelectorAll('[data-mute], [data-bulk], [data-reset]').forEach(button => button.addEventListener('click', still));
  } else requestAnimationFrame(frame);

  // Takes.
  const takeView = root.querySelector<HTMLElement>('[data-take-view]')!;
  const showTake = (rev: number) => {
    root.querySelectorAll<HTMLButtonElement>('[data-take]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.take) === rev)));
    const take = takes[rev - 1];
    const previous = takes[rev - 2];
    const status = rev === 2 ? 'Approved. Install plays this take.' : rev === 3 ? 'Draft. Needs review before it can replace take 2.' : 'Draft, superseded by take 2.';
    takeView.innerHTML = `<p class="v31-take-status">${status}</p><p class="v31-take-text">${take.text}</p>${previous ? `<div class="v31-diff"><p class="is-del">− ${previous.text}</p><p class="is-add">+ ${take.text}</p></div>` : '<p class="v31-take-meta">Imported from ~/.claude/skills as a draft. The original folder stayed where it was.</p>'}`;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-take]').forEach(button => button.addEventListener('click', () => showTake(Number(button.dataset.take))));
  showTake(2);

  // Patch bay.
  const jackView = root.querySelector<HTMLElement>('[data-jack-view]')!;
  const showJack = (i: number) => {
    root.querySelectorAll<HTMLButtonElement>('[data-jack]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.jack) === i)));
    jackView.innerHTML = `<code>${jacks[i].path}</code><p>${jacks[i].note}</p>`;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-jack]').forEach(button => button.addEventListener('click', () => showJack(Number(button.dataset.jack))));
  showJack(0);

  // Audition.
  let track = 0;
  let timers: number[] = [];
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const clock = root.querySelector<HTMLElement>('[data-clock]')!;
  const go = root.querySelector<HTMLButtonElement>('[data-go]')!;
  const cancel = root.querySelector<HTMLButtonElement>('[data-cancel]')!;
  const summary = root.querySelector<HTMLElement>('[data-summary]')!;
  const yours = root.querySelector<HTMLElement>('[data-yours]')!;
  const lamps = [...root.querySelectorAll<HTMLElement>('.v31-vlamp')];
  const tokens = [...root.querySelectorAll<HTMLElement>('[data-tok]')];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const idle = (text: string) => {
    clear();
    log.innerHTML = `<li class="is-idle">${text}</li>`;
    lamps.forEach(lamp => lamp.classList.remove('is-lit'));
    tokens.forEach(cell => { cell.textContent = '—'; });
    summary.textContent = ''; yours.hidden = true; clock.textContent = '00:00';
    go.disabled = false; go.textContent = 'Audition on my repo'; cancel.hidden = true;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-track]').forEach(button => button.addEventListener('click', () => {
    track = Number(button.dataset.track);
    root.querySelectorAll('[data-track]').forEach(other => other.setAttribute('aria-checked', String(other === button)));
    root.querySelector('[data-prompt]')!.textContent = examples[track].prompt;
    idle('Waiting for a run. Sample session.');
  }));
  go.addEventListener('click', () => {
    const run = auditions[track];
    idle('');
    log.innerHTML = '';
    go.disabled = true; go.textContent = 'Running…'; cancel.hidden = false;
    const step = reduced ? 0 : 520;
    run.log.forEach((line, i) => timers.push(window.setTimeout(() => {
      log.insertAdjacentHTML('beforeend', `<li><span>${String(Math.floor((i + 1) * 9 / 60)).padStart(2, '0')}:${String((i + 1) * 9 % 60).padStart(2, '0')}</span>${line}</li>`);
      clock.textContent = `00:${String((i + 1) * 9).padStart(2, '0')}`;
      tokens.forEach((cell, t) => { cell.textContent = fmt(Math.round(run.tokens[t] * (i + 1) / run.log.length)); });
    }, step * (i + 1))));
    timers.push(window.setTimeout(() => {
      lamps.forEach(lamp => lamp.classList.toggle('is-lit', lamp.dataset.v === run.verdict));
      summary.textContent = run.summary;
      yours.hidden = false;
      yours.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', 'false'));
      go.disabled = false; go.textContent = 'Run it again'; cancel.hidden = true;
    }, step * (run.log.length + 1.4)));
  });
  cancel.addEventListener('click', () => idle('Run cancelled. Nothing in your repo changed, because nothing could.'));
  yours.querySelectorAll<HTMLButtonElement>('button').forEach(button => button.addEventListener('click', () => yours.querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === button)))));
}
