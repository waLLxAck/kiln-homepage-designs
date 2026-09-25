// PROTOTYPE variant 46 — Code editor. The library as a warm light IDE: blame gutter, diffs against the approved revision, a status bar that tells the truth.
import './style.css';
import { examples, installer, installs, provenance, releaseNote, subscription, windowsMark } from '../../content';

type Blame = 'imported' | 'approved' | 'draft' | 'note' | 'ok' | 'warn' | 'none';
type Line = { t: string; b?: string; k?: Blame };
type Doc = { id: string; name: string; crumb: string; lang: string; status: string; tone: 'ok' | 'draft' | 'info'; lines: Line[] };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const EDIT = 'Skip generated files and lockfiles.';

const skillLines: Line[] = [
  { t: '---', b: 'rev 1 · imported', k: 'imported' },
  { t: 'name: code-review', b: 'rev 1 · imported', k: 'imported' },
  { t: 'description: Review a change against the repo’s standards and the spec it came from. Use when asked to review a branch, a PR or work in progress.', b: 'rev 2 · approved', k: 'approved' },
  { t: '---', b: 'rev 1 · imported', k: 'imported' },
  { t: '' },
  { t: '# Code review', b: 'rev 1 · imported', k: 'imported' },
  { t: '' },
  { t: 'Review the changes since a fixed point along two axes.', b: 'rev 2 · approved', k: 'approved' },
  { t: '' },
  { t: '## Standards', b: 'rev 2 · approved', k: 'approved' },
  { t: 'Does the code follow this repo’s documented coding standards?', b: 'rev 2 · approved', k: 'approved' },
  { t: 'Read `AGENTS.md` and `CLAUDE.md` before you judge.', b: 'rev 2 · approved', k: 'approved' },
  { t: '' },
  { t: '## Spec', b: 'rev 2 · approved', k: 'approved' },
  { t: 'Does the code match what the originating issue asked for?', b: 'rev 2 · approved', k: 'approved' },
  { t: '' },
  { t: '## Report', b: 'rev 1 · imported', k: 'imported' },
  { t: 'List both reviews side by side. Mark each finding must-fix or optional.', b: 'rev 2 · approved', k: 'approved' },
  { t: 'Make no changes.', b: 'rev 1 · imported', k: 'imported' },
];
const EDIT_AT = 12; // inserted after "Read AGENTS.md…"

const docs: Record<string, Doc> = {
  history: {
    id: 'history', name: 'history', crumb: 'Skills to refine › code-review › history', lang: 'Kiln history', tone: 'ok',
    status: 'rev 2 approved and published to my-kiln · editing never replaces it',
    lines: [
      { t: '# Revisions of code-review', b: 'newest last', k: 'note' },
      { t: '' },
      ...provenance.flatMap((row, i): Line[] => [
        { t: `${String(i + 1).padStart(2, '0')}  ${row.event}`, b: row.state.toLowerCase(), k: row.state === 'Approved' ? 'approved' : row.state === 'Needs review' ? 'draft' : 'imported' },
        { t: `    ${row.detail}` },
      ]),
      { t: '' },
      { t: '> Install always uses the approved revision.', b: 'rule', k: 'note' },
    ],
  },
  runs: {
    id: 'runs', name: 'experiments.log', crumb: 'Skills to refine › code-review › experiments.log', lang: 'Experiment log', tone: 'info',
    status: 'last run: rev 2 on game-project · read-only · agent says pass, you decide',
    lines: [
      { t: '# Experiment on rev 2 — sample values', b: 'sample run', k: 'note' },
      { t: 'repo:     C:\\dev\\game-project   (read-only)', b: 'rev 2', k: 'approved' },
      { t: 'agent:    Claude Code, your signed-in app', b: 'rev 2', k: 'approved' },
      { t: 'effort:   medium', b: 'rev 2', k: 'approved' },
      { t: '' },
      { t: '00:02  read  AGENTS.md, CLAUDE.md', b: 'streamed live', k: 'none' },
      { t: '00:05  $ git diff --stat main...HEAD', b: 'streamed live', k: 'none' },
      { t: '00:11  reasoning  Standards pass: two naming issues in src/levels.', b: 'streamed live', k: 'none' },
      { t: '00:19  reasoning  Spec pass: the dash cooldown is missing from the issue.', b: 'streamed live', k: 'none' },
      { t: '00:26  report ready, no files changed', b: 'streamed live', k: 'none' },
      { t: '' },
      { t: 'agent assessment:  pass', b: 'the agent’s view', k: 'ok' },
      { t: 'your judgement:    not decided yet', b: 'yours, kept apart', k: 'draft' },
      { t: 'tokens:  input 38,412 · cached 29,760 · output 1,904', b: 'sample numbers', k: 'note' },
    ],
  },
  installs: {
    id: 'installs', name: 'installs', crumb: 'Skills to refine › code-review › installs', lang: 'Installed copies', tone: 'draft',
    status: 'installed in 3 places · 1 copy edited outside Kiln · compare before you decide',
    lines: [
      { t: '# Where code-review lives on this machine', b: 'scanned now', k: 'note' },
      { t: '' },
      ...installs.map((row): Line => ({ t: `${row.path.padEnd(34)} ${row.agent}`, b: row.state.toLowerCase(), k: row.ok ? 'ok' : 'warn' })),
      { t: '' },
      { t: '# Receipts', b: 'install receipts', k: 'note' },
      { t: 'rev 2 → ~/.agents/skills/code-review', b: 'receipt', k: 'approved' },
      { t: 'rev 2 → .github/skills/code-review (game-project)', b: 'receipt', k: 'approved' },
      { t: '' },
      { t: '> Compare the drifted copy file by file with rev 2,', b: 'next step', k: 'draft' },
      { t: '> reinstall the approved revision, or remove the copy.', b: 'next step', k: 'draft' },
    ],
  },
  prompt: {
    id: 'prompt', name: 'playtest-for-fun.prompt', crumb: 'Game design › playtest-for-fun.prompt', lang: 'Prompt', tone: 'info',
    status: `${examples[2].source.toLowerCase()} · rev 4 · 2 experiments on game-project`,
    lines: [
      { t: `# ${examples[2].title}`, b: 'rev 1 · captured', k: 'imported' },
      { t: '' },
      ...examples[2].prompt.split(/(?<=\.) /).map((sentence, i): Line => ({ t: sentence, b: i < 2 ? 'rev 1 · captured' : i < 4 ? 'rev 3 · after first run' : 'rev 4 · after second run', k: i < 2 ? 'imported' : 'approved' })),
      { t: '' },
      { t: `> If it earns its place: ${examples[2].skill}`, b: 'your note', k: 'note' },
    ],
  },
  config: {
    id: 'config', name: 'CLAUDE.md', crumb: 'Config files › personal › CLAUDE.md', lang: 'Markdown', tone: 'ok',
    status: 'edited in place · syntax checked · backup 12 of 30 · no changes on disk since you opened it',
    lines: [
      { t: '# Personal instructions', b: 'on disk', k: 'none' },
      { t: '' },
      { t: '- Prefer small, reviewable commits.', b: 'backup 11', k: 'imported' },
      { t: '- Ask before touching generated files.', b: 'backup 11', k: 'imported' },
      { t: '- Run the tests you changed before you say done.', b: 'backup 12', k: 'approved' },
      { t: '- Keep project memory specific; delete stale notes.', b: 'backup 12', k: 'approved' },
      { t: '' },
      { t: '> 30 private backups, each with a diff and a restore.', b: 'Kiln', k: 'note' },
    ],
  },
  hooks: {
    id: 'hooks', name: 'hooks.json', crumb: 'Config files › Codex › hooks.json', lang: 'JSON', tone: 'info',
    status: 'valid JSON · Kiln edits hooks and never executes them',
    lines: [
      { t: '{', b: 'on disk', k: 'none' },
      { t: '  "hooks": {', b: 'backup 3', k: 'imported' },
      { t: '    "PostToolUse": [', b: 'backup 3', k: 'imported' },
      { t: '      { "matcher": "Edit", "command": "npm run lint" }', b: 'backup 4', k: 'approved' },
      { t: '    ]', b: 'backup 3', k: 'imported' },
      { t: '  }', b: 'backup 3', k: 'imported' },
      { t: '}', b: 'on disk', k: 'none' },
    ],
  },
};

const skillDoc = (): Doc => ({ id: 'skill', name: 'SKILL.md', crumb: 'Skills to refine › code-review › SKILL.md', lang: 'Markdown', tone: 'ok', status: '', lines: [] });

const icons: Record<string, string> = {
  library: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.8l3.6-1 3 15.4-3.6 1z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
  versions: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.2v9.6M18 10.2c0 5-12 3-12 6.6"/>',
  tests: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  installs: '<path d="M12 3v11M7 9.5l5 5 5-5M4 16v4h16v-4"/>',
  config: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
};
const activity: [string, string, string][] = [
  ['library', 'Library: open SKILL.md', 'skill'], ['search', 'Search: open a saved prompt', 'prompt'], ['versions', 'Versions: open history', 'history'],
  ['tests', 'Experiments: open the run log', 'runs'], ['installs', 'Installed copies', 'installs'], ['config', 'Config files: open CLAUDE.md', 'config'],
];
const svg = (name: string) => `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const fileBtn = (id: string, label: string, depth: number, badge = '') =>
  `<li><button type="button" class="v46-file" data-open="${id}" style="--d:${depth}"><span class="v46-ficon v46-ficon-${id}" aria-hidden="true"></span><span class="v46-fname">${label}</span>${badge ? `<span class="v46-fbadge" data-badge="${id}">${badge}</span>` : ''}</button></li>`;
const folder = (label: string, depth: number, open: boolean) => `<li class="v46-folder${open ? '' : ' is-closed'}" style="--d:${depth}"><span aria-hidden="true">${open ? '▾' : '▸'}</span>${label}</li>`;

function highlight(text: string, lang: string) {
  let s = esc(text);
  if (lang === 'JSON') return s.replace(/(&quot;|")([^"]+)(")(\s*:)?/g, (_m, _a, body, _c, colon) => colon ? `<i class="k">"${body}"</i>${colon}` : `<i class="s">"${body}"</i>`);
  if (/^---$/.test(text)) return `<i class="m">${s}</i>`;
  if (/^#{1,3} /.test(text)) return `<i class="h">${s}</i>`;
  if (/^&gt; /.test(s)) return `<i class="q">${s}</i>`;
  s = s.replace(/^(name|description|repo|agent|effort|tokens|agent assessment|your judgement):/, '<i class="k">$1</i>:');
  s = s.replace(/`([^`]+)`/g, '<i class="c">`$1`</i>');
  s = s.replace(/^(\d\d:\d\d)/, '<i class="m">$1</i>');
  s = s.replace(/^(- )/, '<i class="p">$1</i>');
  s = s.replace(/\b(pass|read-only)\b/g, '<i class="s">$1</i>');
  return s;
}

export function render(root: HTMLElement) {
  document.title = 'Kiln — Edit freely. Your agents keep the version you approved.';
  root.innerHTML = `
<div class="v46">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v46-menubar">
    <a class="v46-brand" href="?"><span class="v46-logo" aria-hidden="true"></span>Kiln</a>
    <nav aria-label="Main navigation"><a href="#v46-versions">Versions</a><a href="#v46-copies">Copies</a><a href="#v46-tests">Tests</a><a href="#v46-sync">Sync</a><a href="#v46-config">Config files</a></nav>
    <a class="v46-menu-cta" href="#v46-download">Download</a>
  </header>
  <main id="main">
    <section class="v46-hero" aria-labelledby="v46-title">
      <div class="v46-hero-text">
        <h1 id="v46-title">Edit freely. Your agents keep the version you approved.</h1>
        <div class="v46-lede">
          <p>Kiln is a Windows app that keeps your prompts and agent skills in one library with real revision history. Approval pins an exact revision, installs always use it, and you can see every copy on your machine, including the ones someone changed by hand.</p>
          <div class="v46-hero-actions"><a class="v46-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a><button type="button" class="v46-btn v46-btn-ghost" data-replay>Replay the edit</button></div>
        </div>
      </div>

      <div class="v46-window" role="group" aria-label="Kiln library shown as an editor">
        <div class="v46-titlebar"><span class="v46-title-text">SKILL.md — code-review — my-kiln</span><span class="v46-winctl" aria-hidden="true"><i></i><i></i><i></i></span></div>
        <div class="v46-body">
          <nav class="v46-activity" aria-label="Editor views">${activity.map(([icon, label, id], i) => `<button type="button" data-open="${id}" aria-label="${label}" class="${i === 0 ? 'is-on' : ''}" data-act="${id}">${svg(icon)}</button>`).join('')}</nav>
          <aside class="v46-explorer" aria-label="Library explorer">
            <p class="v46-pane-title">Explorer</p>
            <p class="v46-group">Library</p>
            <ul role="list">
              ${folder('Skills to refine', 0, true)}
              ${folder('code-review', 1, true)}
              ${fileBtn('skill', 'SKILL.md', 2, 'rev 2')}
              ${fileBtn('history', 'history', 2)}
              ${fileBtn('runs', 'experiments.log', 2)}
              ${fileBtn('installs', 'installs', 2, '1 drift')}
              ${folder('research', 1, false)}
              ${folder('writing-for-agents', 1, false)}
              ${folder('Game design', 0, true)}
              ${fileBtn('prompt', 'playtest-for-fun.prompt', 1)}
              ${folder('Agent workflows', 0, false)}
            </ul>
            <p class="v46-group">Config files</p>
            <ul role="list">
              ${fileBtn('config', 'CLAUDE.md', 0)}
              ${fileBtn('hooks', 'hooks.json', 0)}
            </ul>
          </aside>
          <div class="v46-main">
            <div class="v46-tabs" role="tablist" aria-label="Open files"></div>
            <div class="v46-crumb" aria-hidden="true"></div>
            <div class="v46-editor">
              <div class="v46-code" aria-live="off"></div>
              <div class="v46-minimap" aria-hidden="true"><div class="v46-mm-lines"></div><div class="v46-mm-view"></div></div>
              <section class="v46-diff" aria-label="Compare with the approved revision" aria-hidden="true">
                <header class="v46-diff-head"><strong>SKILL.md</strong><span><b class="v46-chip v46-chip-ok">approved rev 2</b> ↔ <b class="v46-chip v46-chip-draft">draft rev 3</b></span><button type="button" class="v46-x" data-close-diff aria-label="Close compare">×</button></header>
                <div class="v46-diff-grid"></div>
                <footer class="v46-diff-foot">
                  <p>Installed copies stay on rev 2 until you approve rev 3 and install it.</p>
                  <div><button type="button" class="v46-btn v46-btn-small" data-approve>Approve rev 3</button><button type="button" class="v46-btn v46-btn-small v46-btn-ghost" data-open="runs">Open the last test</button></div>
                </footer>
              </section>
            </div>
          </div>
        </div>
        <footer class="v46-status" aria-live="polite">
          <span class="v46-st-branch">${svg('versions')}main</span>
          <span class="v46-st-msg"></span>
          <span class="v46-st-right"><span class="v46-st-pos">Ln 12, Col 1</span><span class="v46-st-lang">Markdown</span><span>UTF-8</span></span>
        </footer>
      </div>
      <p class="v46-hint">The sidebar works: open the history, the experiment log, the installed copies or a config file.</p>
    </section>

    <section class="v46-sec" id="v46-versions" aria-labelledby="v46-v-title">
      <div class="v46-sec-text">
        <h2 id="v46-v-title"><span class="v46-hash" aria-hidden="true">##</span> A draft is a draft. An approval is a pin.</h2>
        <p>Every prompt and skill in Kiln has a revision history with diffs. Editing creates a new draft and never replaces the approved one. Approval pins an exact revision, and installing always uses approved content, so your agents run what you reviewed, not what you were halfway through typing.</p>
        <p>Approving commits that snapshot and publishes it to your own Kiln GitHub repository. Normal editing, approval and installation never call a model.</p>
      </div>
      <ol class="v46-log" aria-label="Sample history of the code-review skill">
        ${provenance.map((row, i) => `<li class="${row.state === 'Approved' ? 'is-pin' : row.state === 'Needs review' ? 'is-draft' : ''}"><span class="v46-log-dot" aria-hidden="true"></span><code>${['a41c09e', '7be2d11', '7be2d11', 'c90f3a2', 'e13b8f0'][i]}</code><strong>${row.event}</strong><span>${row.detail}</span><em>${row.state}</em></li>`).join('')}
      </ol>
    </section>

    <section class="v46-sec v46-sec-flip" id="v46-copies" aria-labelledby="v46-c-title">
      <div class="v46-sec-text">
        <h2 id="v46-c-title"><span class="v46-hash" aria-hidden="true">##</span> One skill. Every copy of it.</h2>
        <p>Skills are loose folders: <code>~/.claude/skills</code>, <code>~/.agents/skills</code> (shared by Codex, Copilot and others), <code>.codex/skills</code>, <code>.copilot/skills</code>, a project’s <code>.github/skills</code>. Kiln finds the ones that aren’t in your library, imports them as drafts and leaves the originals where they are.</p>
        <p>For each skill you see every installed copy across your personal locations and enrolled projects: installed, identical copy found, differs, linked, or edited outside Kiln. Compare a drifted copy file by file with the approved one. Remove local copies in bulk; managed copies are deleted, anything else moves to a private backup.</p>
        <aside class="v46-aside"><h3>Why pruning matters</h3><p>Every model-invoked skill’s description sits in your agent’s context on every turn, so forgotten, duplicate and stale skills spend tokens and attention whether or not they fire. Kiln doesn’t measure a cost per skill. It shows you exactly what is installed where, so you can keep only what earns its place.</p></aside>
      </div>
      <div class="v46-panel" role="group" aria-label="Problems panel, sample scan">
        <div class="v46-panel-tabs" aria-hidden="true"><span class="is-on">Problems <b>4</b></span><span>Output</span><span>Terminal</span></div>
        <ul class="v46-problems">
          <li class="is-warn"><span class="v46-pi" aria-hidden="true">▲</span><div><strong>code-review</strong> The copy in <code>~/.claude/skills</code> was edited outside Kiln.</div><button type="button" class="v46-qf" data-toggle="v46-drift">Compare</button></li>
          <li class="v46-drift" id="v46-drift" hidden><div class="v46-mini-diff"><p class="d">− Review standards and the specification separately.</p><p class="a">+ Review the specification only.</p><small>~/.claude/skills/code-review/SKILL.md against approved rev 2</small></div></li>
          <li class="is-info"><span class="v46-pi" aria-hidden="true">●</span><div><strong>research</strong> Identical copy found in <code>.codex/skills/research</code>.</div><button type="button" class="v46-qf" data-quiet>Remove local copy</button></li>
          <li class="is-err"><span class="v46-pi" aria-hidden="true">✕</span><div><strong>old-helper</strong> Broken link in <code>~/.agents/skills</code>.</div><button type="button" class="v46-qf" data-quiet>Clean up</button></li>
          <li class="is-info"><span class="v46-pi" aria-hidden="true">●</span><div><strong>4 skills</strong> in <code>~/.claude/skills</code> are not in the library.</div><button type="button" class="v46-qf" data-quiet>Import as drafts</button></li>
        </ul>
        <p class="v46-panel-note">Sample scan. Names and counts are illustrative.</p>
      </div>
    </section>

    <section class="v46-sec" id="v46-tests" aria-labelledby="v46-t-title">
      <div class="v46-sec-text">
        <h2 id="v46-t-title"><span class="v46-hash" aria-hidden="true">##</span> Revisions earn approval on your own repo.</h2>
        <p>Before a prompt becomes a skill, run the exact revision against a local project through Codex or Claude Code. You watch it live: messages, reasoning summaries, commands, web searches, model, effort, elapsed time and token counts. Experiments are read-only, so nothing in your code changes.</p>
        <p>The output and the agent’s pass, fail or uncertain assessment are saved against that revision. Your judgement is kept separately. Tasks that need edits or missing tools come back uncertain instead of faking a success. Edit, compare the diff, run it again, and you see what changed the result.</p>
      </div>
      <figure class="v46-prompt">
        <figcaption><span>${examples[0].source}</span><strong>${examples[0].title}</strong></figcaption>
        <pre><code>${esc(examples[0].prompt)}</code></pre>
        <div class="v46-prompt-run"><span class="v46-chip v46-chip-ok">rev 3</span><span>Claude Code on <code>C:\\dev\\kids-app</code>, read-only</span><span class="v46-verdict">agent: uncertain · you: keep</span></div>
        <p class="v46-fine">A real prompt from a Kiln library, shortened. The run line is a sample.</p>
      </figure>
    </section>

    <section class="v46-sec v46-sec-flip" id="v46-sync" aria-labelledby="v46-s-title">
      <div class="v46-sec-text">
        <h2 id="v46-s-title"><span class="v46-hash" aria-hidden="true">##</span> Your repository. Your other machine.</h2>
        <p>Kiln creates a GitHub repository for your library during setup, using the official <code>gh</code> CLI. Approvals are committed there in a standard layout, validated without ever executing a skill. Git status, sync and conflict resolution are built in.</p>
        <p>On another machine, open the repository and press <strong>Install everything marked for this machine</strong>, or run it from the CLI. The CLI returns JSON, so your agents can read your library too.</p>
      </div>
      <div class="v46-term" role="group" aria-label="Terminal">
        <div class="v46-panel-tabs" aria-hidden="true"><span>Problems</span><span>Output</span><span class="is-on">Terminal</span></div>
        <pre><code><span class="v46-ps">PS C:\\Users\\you&gt;</span> kiln skills sync
<span class="v46-dim"># installs the approved revision of every skill marked for this machine</span>
<span class="v46-ps">PS C:\\Users\\you&gt;</span> git -C my-kiln log --oneline -3
<span class="v46-hashc">c90f3a2</span> approve code-review rev 2
<span class="v46-hashc">5d17a4b</span> approve writing-for-agents rev 5
<span class="v46-hashc">2e08c6f</span> approve research rev 1
<span class="v46-dim"># sample log</span></code></pre>
      </div>
    </section>

    <section class="v46-sec" id="v46-config" aria-labelledby="v46-f-title">
      <div class="v46-sec-text">
        <h2 id="v46-f-title"><span class="v46-hash" aria-hidden="true">##</span> The config files get the same care.</h2>
        <p>Open every agent config file in one place and edit the actual file, in place. Kiln checks the syntax, keeps 30 private backups per file with a diff and a restore, and notices when a file changes on disk while you edit. It never executes your hooks.</p>
      </div>
      <ul class="v46-files" aria-label="Config files Kiln can open">
        ${['CLAUDE.md', 'AGENTS.md', 'config.toml', 'hooks.json', 'Claude settings', 'Copilot settings', 'MCP config', 'permissions', 'hooks', 'VS Code settings', 'shell profiles'].map(f => `<li>${f}</li>`).join('')}
      </ul>
    </section>

    <section class="v46-cta" id="v46-download" aria-labelledby="v46-d-title">
      <div>
        <h2 id="v46-d-title">Open your library in Kiln.</h2>
        <p>${subscription.text} <span class="v46-dim">${subscription.fine}</span></p>
      </div>
      <div class="v46-cta-box">
        <a class="v46-btn v46-btn-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
        <p>${releaseNote}</p>
        <p class="v46-fine">Builds are unsigned, so Windows may ask you to confirm. The CLI and app are MIT licensed.</p>
      </div>
    </section>
  </main>
</div>`;

  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const code = q('.v46-code');
  const tabsEl = q('.v46-tabs');
  const crumb = q('.v46-crumb');
  const mm = q('.v46-mm-lines');
  const mmView = q('.v46-mm-view');
  const diff = q('.v46-diff');
  const status = q('.v46-status');
  const statusMsg = q('.v46-st-msg');
  const pos = q('.v46-st-pos');
  const langEl = q('.v46-st-lang');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let typed = 0; // characters of EDIT typed
  let approved = false;
  let current = 'skill';
  let open = ['skill'];
  let timers: number[] = [];

  const skillState = () => typed === 0 ? 'clean' : typed < EDIT.length ? 'typing' : 'draft';
  const skillLinesNow = (): Line[] => {
    if (typed === 0) return skillLines;
    const line: Line = { t: EDIT.slice(0, typed), b: approved ? 'rev 3 · approved' : 'draft rev 3 · just now', k: approved ? 'approved' : 'draft' };
    return [...skillLines.slice(0, EDIT_AT), line, ...skillLines.slice(EDIT_AT)];
  };
  const docFor = (id: string): Doc => {
    if (id !== 'skill') return docs[id];
    const d = skillDoc();
    d.lines = skillLinesNow();
    const st = skillState();
    if (approved) { d.tone = 'ok'; d.status = 'approved rev 3 · published to my-kiln · 3 copies still on rev 2 until you install'; }
    else if (st === 'clean') { d.tone = 'ok'; d.status = 'approved rev 2 · installed in 3 places · 1 copy edited outside Kiln'; }
    else { d.tone = 'draft'; d.status = 'draft rev 3 · approved rev 2 stays installed · installed in 3 places · 1 copy edited outside Kiln'; }
    return d;
  };

  const renderTabs = () => {
    tabsEl.innerHTML = open.map(id => {
      const d = id === 'skill' ? docFor('skill') : docs[id];
      const dirty = id === 'skill' && skillState() !== 'clean' && !approved;
      return `<button type="button" role="tab" aria-selected="${id === current}" class="v46-tab" data-open="${id}"><span class="v46-ficon v46-ficon-${id}" aria-hidden="true"></span>${d.name}${dirty ? '<span class="v46-tab-draft">draft</span>' : ''}${id === 'skill' && approved ? '<span class="v46-tab-ok">rev 3</span>' : ''}</button>`;
    }).join('');
  };

  const renderDoc = () => {
    const d = docFor(current);
    const typingRow = current === 'skill' && typed > 0 ? EDIT_AT : -1;
    let prev = '';
    code.innerHTML = d.lines.map((line, i) => {
      const show = line.b && line.b !== prev;
      prev = line.b ?? '';
      const cursor = i === typingRow && (skillState() === 'typing' || !diff.classList.contains('is-open')) ? '<span class="v46-caret" aria-hidden="true"></span>' : '';
      return `<div class="v46-row${line.k === 'draft' && i === typingRow ? ' is-new' : ''}${i === typingRow ? ' is-cur' : ''}"><span class="v46-blame v46-b-${line.k ?? 'none'}">${show ? esc(line.b!) : ''}</span><span class="v46-ln">${i + 1}</span><span class="v46-src">${highlight(line.t, d.lang) || ' '}${cursor}</span></div>`;
    }).join('');
    crumb.textContent = d.crumb;
    mm.innerHTML = d.lines.map(line => `<i style="width:${Math.min(100, line.t.length * 1.1)}%" class="${line.k === 'draft' ? 'is-draft' : /^#/.test(line.t) ? 'is-h' : ''}"></i>`).join('');
    mmView.style.height = `${Math.min(100, 28 / Math.max(d.lines.length, 1) * 100)}%`;
    statusMsg.textContent = d.status;
    status.dataset.tone = d.tone;
    langEl.textContent = d.lang;
    pos.textContent = typingRow >= 0 && current === 'skill' ? `Ln ${EDIT_AT + 1}, Col ${typed + 1}` : `Ln 1, Col 1`;
    root.querySelectorAll<HTMLElement>('[data-act]').forEach(b => b.classList.toggle('is-on', b.dataset.act === current || (current === 'hooks' && b.dataset.act === 'config')));
    root.querySelectorAll<HTMLElement>('.v46-file').forEach(b => b.classList.toggle('is-on', b.dataset.open === current));
    const badge = root.querySelector<HTMLElement>('[data-badge="skill"]');
    if (badge) { badge.textContent = approved ? 'rev 3' : skillState() === 'clean' ? 'rev 2' : 'draft'; badge.classList.toggle('is-draft', skillState() !== 'clean' && !approved); }
    q('.v46-title-text').textContent = `${d.name} — ${current === 'config' || current === 'hooks' ? 'config files' : 'my-kiln'} — Kiln`;
    renderTabs();
  };

  const renderDiff = () => {
    const before = skillLines.slice(EDIT_AT - 3, EDIT_AT + 3);
    const cell = (line: Line | null, n: number | null, kind: string) => `<div class="v46-dc ${kind}"><span class="v46-ln">${n ?? ''}</span><span class="v46-src">${line ? highlight(line.t, 'Markdown') || ' ' : ''}</span></div>`;
    const rows: string[] = [];
    before.forEach((line, i) => {
      const n = EDIT_AT - 3 + i + 1;
      if (i === 3) rows.push(cell(null, null, 'is-gap') + cell({ t: EDIT }, EDIT_AT + 1, 'is-add'));
      rows.push(cell(line, n, '') + cell(line, n + (i >= 3 ? 1 : 0), ''));
    });
    q('.v46-diff-grid').innerHTML = `<div class="v46-diff-cols" aria-hidden="true"><span>approved rev 2, installed</span><span>draft rev 3, yours</span></div><div class="v46-hunk">@@ -${EDIT_AT - 2},6 +${EDIT_AT - 2},7 @@ ## Standards</div>${rows.join('')}`;
  };
  renderDiff();

  const openDoc = (id: string) => {
    if (!docs[id] && id !== 'skill') return;
    if (!open.includes(id)) open = [...open, id].slice(-4);
    if (!open.includes('skill')) open = ['skill', ...open.slice(-3)];
    current = id;
    if (id !== 'skill') setDiff(false);
    renderDoc();
  };
  const setDiff = (on: boolean) => {
    diff.classList.toggle('is-open', on);
    diff.setAttribute('aria-hidden', String(!on));
    diff.toggleAttribute('inert', !on);
  };
  setDiff(false);

  const clear = () => { timers.forEach(t => clearTimeout(t)); timers = []; };
  const play = () => {
    clear();
    typed = 0; approved = false; current = 'skill';
    setDiff(false);
    q<HTMLButtonElement>('[data-approve]').disabled = false;
    q<HTMLButtonElement>('[data-approve]').textContent = 'Approve rev 3';
    renderDoc();
    if (reduced) { typed = EDIT.length; renderDoc(); setDiff(true); renderDoc(); return; }
    let t = 700;
    for (let i = 1; i <= EDIT.length; i++) {
      t += 28 + (EDIT[i - 1] === ' ' ? 40 : 0) + (i % 7 === 0 ? 30 : 0);
      timers.push(window.setTimeout(() => { typed = i; if (current === 'skill') renderDoc(); else renderTabs(); }, t));
    }
    timers.push(window.setTimeout(() => { if (current === 'skill') { setDiff(true); renderDoc(); } }, t + 700));
  };

  root.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const opener = target.closest<HTMLElement>('[data-open]');
    if (opener) { openDoc(opener.dataset.open!); return; }
    if (target.closest('[data-close-diff]')) { setDiff(false); renderDoc(); return; }
    if (target.closest('[data-replay]')) { play(); q('.v46-window').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); return; }
    const approve = target.closest<HTMLButtonElement>('[data-approve]');
    if (approve) { approved = true; approve.disabled = true; approve.textContent = 'Approved rev 3'; renderDoc(); return; }
    const toggle = target.closest<HTMLButtonElement>('[data-toggle]');
    if (toggle) {
      const panel = root.querySelector<HTMLElement>(`#${toggle.dataset.toggle}`)!;
      panel.hidden = !panel.hidden;
      toggle.textContent = panel.hidden ? 'Compare' : 'Hide';
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      return;
    }
    const quiet = target.closest<HTMLButtonElement>('[data-quiet]');
    if (quiet) { quiet.closest('li')!.classList.add('is-done'); quiet.textContent = 'Done'; quiet.disabled = true; }
  });

  tabsEl.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const i = open.indexOf(current);
    const next = open[(i + (event.key === 'ArrowRight' ? 1 : -1) + open.length) % open.length];
    openDoc(next);
    tabsEl.querySelector<HTMLElement>(`[data-open="${next}"]`)?.focus();
  });

  renderDoc();
  play();
}
