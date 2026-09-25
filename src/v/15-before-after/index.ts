// PROTOTYPE 12 — Before and after. A full-bleed comparison with a draggable divider: your folders today on the left, the same skills in Kiln on the right.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

const folder = '<i class="v12-ico is-folder" aria-hidden="true"></i>';
const file = '<i class="v12-ico is-file" aria-hidden="true"></i>';
const link = '<i class="v12-ico is-folder is-link" aria-hidden="true"></i>';

const win = (cls: string, title: string, address: string, rows: [string, string, string, string?][]) => `
  <div class="v12-win ${cls}">
    <div class="v12-bar"><span>${title}</span><span class="v12-ctl">&#8212; &#9744; &#10005;</span></div>
    <div class="v12-addr">${address}</div>
    <div class="v12-files">
      <div class="v12-frow is-head"><span>Name</span><span>Date modified</span><span>Type</span></div>
      ${rows.map(([icon, name, date, type]) => `<div class="v12-frow${icon === link ? ' is-broken' : ''}"><span>${icon}${name}</span><span>${date}</span><span>${type ?? 'File folder'}</span></div>`).join('')}
    </div>
  </div>`;

const state = (label: string, tone = '') => `<span class="v12-state${tone ? ` is-${tone}` : ''}">${label}</span>`;

const heroBefore = `
  <div class="v12-desk">
    ${win('v12-w1', 'skills', 'C:\\Users\\you\\.claude\\skills', [
      [folder, 'code-review', '14/03 22:14'], [folder, 'code-review (1)', '14/03 22:15'], [folder, 'code-review-old', '02/01 09:40'],
      [folder, 'code-review-FINAL', '20/03 23:58'], [link, 'research', '11/02 17:03', 'Shortcut'], [folder, 'new-skill', '05/04 01:12'],
      [folder, 'writing-for-agents', '28/02 12:30'], [file, 'SKILL.md', '14/03 22:16', 'Markdown'], [file, 'SKILL - Copy.md', '14/03 22:16', 'Markdown'],
    ])}
    ${win('v12-w2', 'skills', 'C:\\Users\\you\\.agents\\skills', [
      [folder, 'code-review', '09/03 18:20'], [folder, 'code-review (2)', '15/03 08:02'], [folder, 'commit-messages', '01/03 10:11'],
      [folder, 'research', '11/02 17:01'], [folder, 'playtest', '22/03 20:45'],
    ])}
    ${win('v12-w3', 'skills', 'C:\\Users\\you\\.codex\\skills', [[folder, 'commit-messages', '01/03 10:12'], [folder, 'pr-review', '18/03 14:33']])}
    <div class="v12-alert"><div class="v12-bar"><span>Location is not available</span><span class="v12-ctl">&#10005;</span></div>
      <p><b class="v12-x" aria-hidden="true">!</b>C:\\Users\\you\\.claude\\skills\\research refers to a location that is unavailable.</p><span class="v12-ok">OK</span></div>
    <div class="v12-note">which code-review is the real one??</div>
    <div class="v12-note is-two">empty?? delete later</div>
  </div>`;

const libRow = (name: string, kind: string, status: string, copies: string, extra = '') => `
  <div class="v12-lrow${extra}"><span class="v12-lname">${name}</span><span class="v12-lkind">${kind}</span><span class="v12-lstatus">${status}</span><span class="v12-lcopies">${copies}</span></div>`;

const heroAfter = `
  <div class="v12-lib">
    <div class="v12-lib-head">
      <p class="v12-lib-title">Library</p>
      <p class="v12-lib-filters"><span class="is-on">Skills</span><span>Prompts</span><span>Agents</span><span>Insights</span></p>
    </div>
    <div class="v12-lrow is-head"><span>Name</span><span>Kind</span><span>Status</span><span>Installed copies</span></div>
    ${libRow('Code review', 'Skill', state('Approved, revision 2', 'ok'), `${state('2 installed')} ${state('1 edited outside Kiln', 'warn')}`)}
    ${libRow('Research', 'Skill', state('Approved, revision 4', 'ok'), `${state('Installed')} ${state('Identical copy found')}`)}
    ${libRow('Commit messages', 'Skill', state('Approved, revision 1', 'ok'), `${state('2 installed')}`)}
    ${libRow('Writing for agents', 'Skill', state('Approved, revision 2', 'ok'), `${state('Installed')} ${state('Linked')}`)}
    ${libRow('Playtest', 'Skill', state('Draft, revision 3'), 'Not installed')}
    ${libRow('PR review', 'Skill', state('Not in the library'), '<span>Found in ~/.codex/skills. Import as a draft?</span>')}
    <div class="v12-lib-foot">
      <p><b>Safe cleanup</b> 1 broken link and 1 empty folder can be removed.</p>
      <p><b>Look-alikes</b> Four more code-review folders: one identical, three that differ. Compare each with revision 2, or remove local copies.</p>
    </div>
  </div>`;

const versionsBefore = `
  <div class="v12-desk is-small">
    ${win('v12-w4', 'code-review', 'C:\\Users\\you\\.claude\\skills\\code-review', [
      [file, 'SKILL.md', '14/03 22:16', 'Markdown'], [file, 'SKILL-v2.md', '15/03 09:02', 'Markdown'], [file, 'SKILL-final.md', '20/03 23:40', 'Markdown'],
      [file, 'SKILL-final-REAL.md', '20/03 23:58', 'Markdown'], [file, 'SKILL.md.bak', '02/01 09:40', 'BAK file'], [file, 'notes.txt', '21/03 00:03', 'Text'],
    ])}
    <div class="v12-note is-three">installed v2? or final?</div>
  </div>`;

const versionsAfter = `
  <div class="v12-panel">
    <p class="v12-panel-title">Code review <span>Revision history</span></p>
    <ol class="v12-revs">
      <li><b>Revision 3</b>${state('Draft')}<span>Added guidance for generated files. Editing made a new draft.</span></li>
      <li class="is-approved"><b>Revision 2</b>${state('Approved', 'ok')}<span>Committed and published to my-kiln on GitHub. Every install uses this exact revision.</span></li>
      <li><b>Revision 1</b>${state('Imported')}<span>Brought in from ~/.claude/skills. The original folder stayed put.</span></li>
    </ol>
    <div class="v12-diff"><p>Revision 2 against revision 3</p><code class="is-add">+ Skip generated files unless they changed by hand.</code></div>
  </div>`;

const configBefore = `
  <div class="v12-desk is-small">
    <pre class="v12-tree" aria-hidden="true">C:\\Users\\you
├─ .claude
│  ├─ settings.json
│  ├─ settings.json.bak
│  ├─ settings.json.bak2
│  └─ CLAUDE.md
├─ .codex
│  ├─ config.toml
│  ├─ config.toml.old
│  └─ hooks.json
├─ AppData\\Roaming\\Code\\User
│  └─ settings.json
└─ Documents\\PowerShell
   └─ Microsoft.PowerShell_profile.ps1
C:\\src\\game
├─ AGENTS.md
├─ CLAUDE.md
└─ .vscode\\mcp.json</pre>
    <div class="v12-note is-four">which settings.json broke it?</div>
  </div>`;

const configAfter = `
  <div class="v12-panel v12-cfg">
    <ul class="v12-cfg-list">
      <li class="is-group">Personal</li><li>CLAUDE.md</li><li>Claude settings</li><li class="is-on">Codex config.toml</li><li>Codex hooks.json</li><li>Copilot settings</li><li>VS Code settings</li><li>PowerShell profile</li>
      <li class="is-group">game</li><li>AGENTS.md</li><li>CLAUDE.md</li><li>MCP config</li>
    </ul>
    <div class="v12-cfg-file">
      <p class="v12-panel-title">~/.codex/config.toml <span>${state('Valid TOML', 'ok')}</span></p>
      <pre><span>model_reasoning_effort = "high"</span>
<span class="is-del">approval_policy = "never"</span>
<span class="is-add">approval_policy = "on-request"</span></pre>
      <p class="v12-cfg-meta">Edited in place. 30 private backups, each with a diff and restore. If the file changes on disk while you edit, Kiln tells you before you save.</p>
    </div>
  </div>`;

const installBefore = `
  <div class="v12-desk is-small">
    <pre class="v12-term" aria-hidden="true"><span class="p">PS&gt;</span> Copy-Item -Recurse .\\code-review ~\\.claude\\skills\\
<span class="e">Copy-Item : An item with the specified name
C:\\Users\\you\\.claude\\skills\\code-review already exists.</span>
<span class="p">PS&gt;</span> Copy-Item -Recurse -Force .\\code-review ~\\.claude\\skills\\
<span class="p">PS&gt;</span> Copy-Item -Recurse .\\code-review ~\\.agents\\skills\\
<span class="p">PS&gt;</span> Copy-Item -Recurse .\\code-review C:\\src\\game\\.github\\skills\\
<span class="p">PS&gt;</span> # was that the new one or the old one
<span class="p">PS&gt;</span> # do the same on the laptop tomorrow</pre>
  </div>`;

const installAfter = `
  <div class="v12-panel">
    <p class="v12-panel-title">Install receipt <span>Code review, revision 2</span></p>
    <ul class="v12-receipt">
      <li><code>~/.claude/skills/code-review</code>${state('Installed', 'ok')}</li>
      <li><code>~/.agents/skills/code-review</code>${state('Installed', 'ok')}</li>
      <li><code>game/.github/skills/code-review</code>${state('Installed', 'ok')}</li>
    </ul>
    <p class="v12-cfg-meta">Each receipt records the revision and the destination. On the laptop, open your Kiln repository and press <b>Install everything marked for this machine</b>, or run <code>kiln skills sync</code>.</p>
  </div>`;

const sample = examples[0];
const testBefore = `
  <div class="v12-desk is-small">
    <div class="v12-win v12-pad"><div class="v12-bar"><span>prompts-to-try.txt - Notepad</span><span class="v12-ctl">&#8212; &#9744; &#10005;</span></div>
      <pre>- the seven year old one from that talk (try later)
- ask why it did X instead of Y ??
- playtest prompt, the game one
- "act as a senior reviewer" (does this work?)
- that thread about AGENTS.md
- TRY THESE THIS WEEKEND
- screenshot_0412.png has one too</pre></div>
  </div>`;

const testAfter = `
  <div class="v12-panel">
    <p class="v12-panel-title">Experiment <span>${sample.title}, revision 2</span></p>
    <p class="v12-quote">${sample.prompt}</p>
    <dl class="v12-run">
      <div><dt>Repository</dt><dd>game, read-only</dd></div>
      <div><dt>Agent</dt><dd>Claude Code, reasoning effort high</dd></div>
      <div><dt>Tokens</dt><dd>input, cached and output shown per run</dd></div>
      <div><dt>Agent's assessment</dt><dd>${state('Pass', 'ok')}</dd></div>
      <div><dt>Your judgement</dt><dd>Keep. Create skill.</dd></div>
    </dl>
  </div>`;

const compare = (id: string, label: string, before: string, after: string, hero = false) => `
  <div class="v12-cmp${hero ? ' is-hero' : ''}" data-cmp style="--x: 50%">
    <div class="v12-side v12-after">${after}</div>
    <div class="v12-side v12-before" aria-hidden="true">${before}</div>
    <span class="v12-tag is-before" aria-hidden="true">${hero ? 'Your folders today' : 'Before'}</span>
    <span class="v12-tag is-after" aria-hidden="true">In Kiln</span>
    <button type="button" class="v12-handle" role="slider" id="${id}" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Showing half before, half after"><span aria-hidden="true"></span></button>
  </div>`;

const pairs = [
  { id: 'versions', title: 'SKILL-final-REAL.md, retired.', text: 'Kiln keeps every revision with its diff. Approval pins one exact revision. Editing creates a new draft and never replaces the approved one, and installs always use approved content.', before: versionsBefore, after: versionsAfter },
  { id: 'config', title: 'Every agent config file, in one place.', text: 'CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, permissions, hooks, VS Code settings and shell profiles. Edit the real file with syntax validation, a diff and restore. Kiln never executes hooks.', before: configBefore, after: configAfter },
  { id: 'installs', title: 'Install once. Know what went where.', text: 'Install an approved revision into Codex, Claude Code or Copilot locations, personal or per project. A new agent session picks it up. Your library is backed by your own Kiln GitHub repository, so another machine is one button away.', before: installBefore, after: installAfter },
  { id: 'testing', title: 'The list of prompts to try, tried.', text: 'Pick a local repository and run the exact prompt revision through your signed-in Codex or Claude Code. Experiments are read-only. The agent\u2019s pass, fail or uncertain assessment is saved with the revision, and kept apart from your own judgement.', before: testBefore, after: testAfter },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Same skills, minus the mess';
  root.innerHTML = `
<div class="v12">
  <header class="v12-top">
    <a class="v12-brand" href="?">Kiln</a>
    <a class="v12-toplink" href="#v12-download">Download for Windows</a>
  </header>
  <main id="main">
    <section class="v12-hero" aria-labelledby="v12-title">
      <h1 id="v12-title">Same skills, minus the mess.</h1>
      <p class="v12-lede">Kiln is a Windows app that keeps your agent skills, prompts and custom agents in one library, and shows every copy it finds on your machine. Drag the line.</p>
    </section>
    <figure class="v12-stage">
      ${compare('v12-hero-slider', 'Compare your skill folders today with the same skills in Kiln', heroBefore, heroAfter, true)}
      <figcaption class="v12-cap">
        <p class="visually-hidden">Before: three Explorer windows of skill folders with duplicate code-review folders, stray SKILL.md copies, a broken research shortcut and an empty folder. After: one library listing each skill once, with its approved revision and the state of every installed copy.</p>
        <p>Sample folders. Left: <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and <code>~/.codex/skills</code> as they tend to end up. Right: the same skills after <em>Import</em> and <em>Find skills and agents not in the library</em>. Originals stay where they are until you choose to remove them.</p>
      </figcaption>
    </figure>

    <section class="v12-states" aria-labelledby="v12-states-title">
      <h2 id="v12-states-title">Every copy has a state.</h2>
      <p class="v12-states-lede">For each skill, Kiln looks across personal locations and enrolled projects and names what it finds.</p>
      <dl>
        <div><dt>${state('Installed', 'ok')}</dt><dd>Installed by Kiln, matching its receipt.</dd></div>
        <div><dt>${state('Identical copy found')}</dt><dd>Not installed by Kiln, but the same files.</dd></div>
        <div><dt>${state('Differs')}</dt><dd>Doesn't match the approved revision. Compare file by file.</dd></div>
        <div><dt>${state('Linked')}</dt><dd>A link rather than a copy of its own.</dd></div>
        <div><dt>${state('Edited outside Kiln', 'warn')}</dt><dd>Changed after install. That's drift, and you can see the diff.</dd></div>
      </dl>
      <p class="v12-states-foot">Every model-invoked skill's description sits in the agent's context on every turn, so forgotten, duplicate and stale copies spend tokens and attention whether or not they fire. <b>Remove local copies</b> clears them in bulk: copies Kiln manages are deleted, anything else is moved to a private backup.</p>
    </section>

    ${pairs.map((pair, i) => `
    <section class="v12-pair${i % 2 ? ' is-flip' : ''}" aria-labelledby="v12-${pair.id}-title">
      <div class="v12-pair-text"><h2 id="v12-${pair.id}-title">${pair.title}</h2><p>${pair.text}</p></div>
      ${compare(`v12-${pair.id}-slider`, `Compare before and after: ${pair.title}`, pair.before, pair.after)}
    </section>`).join('')}

    <section class="v12-quiet" aria-labelledby="v12-quiet-title">
      <h2 id="v12-quiet-title">No new bill.</h2>
      <p>${subscription.text} ${subscription.fine} Organising, approving and installing never call a model at all.</p>
    </section>

    <section class="v12-download" id="v12-download" aria-labelledby="v12-dl-title">
      <h2 id="v12-dl-title">Import what you already have.</h2>
      <a class="v12-button" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p>${releaseNote} Builds are unsigned. MIT licensed, with a CLI.</p>
    </section>
  </main>
</div>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll<HTMLElement>('[data-cmp]').forEach(cmp => {
    const handle = cmp.querySelector<HTMLButtonElement>('.v12-handle')!;
    let x = 50, touched = false, frame = 0;
    const set = (value: number) => {
      x = Math.max(0, Math.min(100, value));
      cmp.style.setProperty('--x', `${x}%`);
      cmp.classList.toggle('is-left', x < 16);
      cmp.classList.toggle('is-right', x > 84);
      handle.setAttribute('aria-valuenow', String(Math.round(x)));
      handle.setAttribute('aria-valuetext', x <= 0 ? 'Showing only after' : x >= 100 ? 'Showing only before' : `${Math.round(x)} percent before`);
    };
    const stop = () => { touched = true; cancelAnimationFrame(frame); };
    const fromPointer = (event: PointerEvent) => { const r = cmp.getBoundingClientRect(); set((event.clientX - r.left) / r.width * 100); };
    cmp.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      stop();
      cmp.setPointerCapture(event.pointerId);
      cmp.classList.add('is-dragging');
      fromPointer(event);
      handle.focus({ preventScroll: true });
    });
    cmp.addEventListener('pointermove', event => { if (cmp.hasPointerCapture(event.pointerId)) fromPointer(event); });
    const end = (event: PointerEvent) => { if (cmp.hasPointerCapture(event.pointerId)) cmp.releasePointerCapture(event.pointerId); cmp.classList.remove('is-dragging'); };
    cmp.addEventListener('pointerup', end);
    cmp.addEventListener('pointercancel', end);
    handle.addEventListener('keydown', event => {
      const step = event.shiftKey ? 20 : 5;
      const next = { ArrowLeft: x - step, ArrowRight: x + step, ArrowDown: x - step, ArrowUp: x + step, PageDown: x - 20, PageUp: x + 20, Home: 0, End: 100 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      stop();
      set(next);
    });
    set(50);
    if (reduce) return;
    // One slow sweep the first time it scrolls into view, as a hint that the line moves.
    const sweep = () => {
      const keys = cmp.classList.contains('is-hero') ? [50, 76, 24, 50] : [50, 68, 50];
      const each = 900, start = performance.now();
      const tick = (now: number) => {
        if (touched) return;
        const t = (now - start) / each, i = Math.min(Math.floor(t), keys.length - 2), f = Math.min(1, t - i);
        const ease = f < .5 ? 4 * f * f * f : 1 - (-2 * f + 2) ** 3 / 2;
        set(keys[i] + (keys[i + 1] - keys[i]) * ease);
        if (t < keys.length - 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); setTimeout(() => { if (!touched) sweep(); }, 500); }
    }, { threshold: .55 });
    io.observe(cmp);
  });
}
