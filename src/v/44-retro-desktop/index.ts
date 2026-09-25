// PROTOTYPE 41 — Retro desktop. The page is a late-90s desktop: the bookmark pile, the skills folder and Kiln
// sit in draggable windows; drop a bookmark on Kiln and it gets tested. Icons open the rest of the story.
import './style.css';
import { collections, examples, installer, provenance, windowsMark } from '../../content';
import { icons } from './icons';

type IconKey = keyof typeof icons;
type WinOptions = { icon: IconKey; menu?: string[]; status?: string[]; cls?: string; label: string; hidden?: boolean };

const P = 'v41';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const win = (id: string, title: string, body: string, o: WinOptions) => `
<section class="${P}-win ${o.cls ?? ''}" id="${P}-w-${id}" data-win="${id}" data-title="${title}" data-icon="${o.icon}" aria-label="${o.label}" ${o.hidden ? 'hidden' : ''}>
  <div class="${P}-bar" tabindex="0" aria-label="${title} window title bar. Arrow keys move the window.">
    <span class="${P}-bar-icon">${icons[o.icon].replace('width="32" height="32"', 'width="16" height="16"')}</span>
    <span class="${P}-bar-title">${title}</span>
    <span class="${P}-ctl">
      <button type="button" class="${P}-ctl-btn" data-act="min" aria-label="Minimise ${title}"><span aria-hidden="true">_</span></button>
      <button type="button" class="${P}-ctl-btn" data-act="close" aria-label="Close ${title}"><span aria-hidden="true">×</span></button>
    </span>
  </div>
  ${o.menu ? `<div class="${P}-menu" aria-hidden="true">${o.menu.map(m => `<span><u>${m[0]}</u>${m.slice(1)}</span>`).join('')}</div>` : ''}
  <div class="${P}-body">${body}</div>
  ${o.status ? `<div class="${P}-status">${o.status.map(s => `<span>${s}</span>`).join('')}</div>` : ''}
</section>`;

const head = (title: string, text: string, icon: IconKey, level = 'h2') => `
<div class="${P}-head"><div><${level}>${title}</${level}><p>${text}</p></div><span class="${P}-head-icon">${icons[icon]}</span></div>`;

// --- Content ------------------------------------------------------------------------------------------------------

const repos = ['C:\\code\\kids-app', 'C:\\code\\my-api', 'C:\\code\\space-game'];
const files = ['try-it-as-a-seven-year-old.url', 'find-the-instruction-that-went-wrong.txt', 'playtest-for-what-kills-the-fun.url'];
const results = [
  { verdict: 'Pass', text: 'First obstacle: past the parent-only signup, the Activities screen shows three icons with no labels. A seven-year-old cannot tell which one starts a game. Suggested fix: put a word under each icon.', tokens: '41,862 in · 28,114 cached · 1,905 out' },
  { verdict: 'Uncertain', text: 'Found an outdated line in AGENTS.md that asks for tabs while CLAUDE.md asks for spaces. The original session transcript was not available, so the agent marked this uncertain instead of guessing the cause.', tokens: '36,420 in · 22,907 cached · 1,288 out' },
  { verdict: 'Pass', text: 'Ranked ten improvements. Top three: the jump has no sound or dust, the pause menu hides the score, and level two starts before the tutorial text fades.', tokens: '52,310 in · 30,666 cached · 2,470 out' },
];

const bookmarks = `
<div class="${P}-toolbar"><button type="button" class="${P}-btn" data-send>Send to Kiln</button><span class="${P}-addr"><span>Address</span><span class="${P}-field">C:\\Users\\you\\Favorites\\Try later</span></span></div>
<div class="${P}-list" role="group" aria-label="Saved bookmarks">
  <div class="${P}-list-head" aria-hidden="true"><span>Name</span><span>Saved</span><span>Opened</span></div>
  ${examples.map((e, i) => `<button type="button" class="${P}-bm" data-ex="${i}" aria-pressed="${i === 0}" aria-describedby="${P}-bm-hint"><span class="${P}-bm-name">${icons[i === 1 ? 'txt' : 'url']}<span>${files[i]}</span></span><span>${['3 Mar', '19 Apr', '2 Jun'][i]}</span><span class="${P}-never">Never</span></button>`).join('')}
  ${[['video', 'Agent workflows, 1 h 12 min (watch later).url', '8 Feb'], ['url', '14 prompts that change how you code (thread).url', '11 Jan'], ['png', 'Screenshot 2026-02-11 prompt idea.png', '11 Feb'], ['txt', 'CLAUDE.md tricks FINAL (2).txt', '30 Dec'], ['url', 'the one where it reviews its own PR.url', '4 Nov'], ['folderSmall', 'more prompts to sort', '1 Oct']].map(([ic, name, date]) => `<div class="${P}-bm is-static"><span class="${P}-bm-name">${icons[ic as IconKey]}<span>${name}</span></span><span>${date}</span><span class="${P}-never">Never</span></div>`).join('')}
</div>
<p class="${P}-hint" id="${P}-bm-hint">Drag a prompt onto the Kiln window, or double-click it. On a phone, tap it.</p>`;

const skillFolders: [string, string][] = [['code-review', ''], ['code-review-old', ''], ['code-review (2)', ''], ['research', ''], ['research-v2-FINAL', ''], ['pdf-thing', ''], ['untitled-skill', 'empty'], ['writing-for-agents', ''], ['deploy', 'broken link'], ['test', ''], ['commit-msg', '']];
const skills = `
<div class="${P}-toolbar"><span class="${P}-addr"><span>Address</span><span class="${P}-field">C:\\Users\\you\\.claude\\skills</span></span></div>
<ul class="${P}-folders" aria-label="Skill folders (sample)">
  ${skillFolders.map(([name, note]) => `<li class="${note ? 'is-odd' : ''}">${icons.folder}<span>${name}</span>${note ? `<small>${note}</small>` : ''}</li>`).join('')}
</ul>
<p class="${P}-elsewhere">Also in <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and every project's <code>.github/skills</code>.</p>`;

const kiln = `
<div class="${P}-hero">
  <h1 id="${P}-h1">You bookmarked it.<br>Kiln runs it.</h1>
  <p class="${P}-lede">Kiln is a Windows desktop app for people who work with coding agents. It runs the prompt you saved on your own repo, read-only, through the Codex or Claude Code you already sign in to. The ones that work become skills, kept in one library where you can see every copy.</p>
  <div class="${P}-actions">
    <a class="${P}-btn ${P}-btn-default" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
    <button type="button" class="${P}-btn" data-open="run">Open a test run</button>
  </div>
  <p class="${P}-fine">Kiln 0.17.0. The release is in a private GitHub repository, so sign in with an account that has access.</p>
</div>
<fieldset class="${P}-group ${P}-drop" aria-live="polite">
  <legend>Try it</legend>
  <div class="${P}-drop-zone" data-drop>
    <p class="${P}-drop-idle"><span class="${P}-wide">Drag <strong>${files[0]}</strong> from Bookmarks onto this window.</span><span class="${P}-narrow">Tap a prompt in Bookmarks below, or send <strong>${files[0]}</strong>.</span> Kiln tests it on a sample repo.</p>
    <button type="button" class="${P}-btn" data-send>Send the selected bookmark</button>
  </div>
</fieldset>`;

const runLog = [
  ['sys', 'Experiment started on revision 2. Read-only: the agent can look, not change.'],
  ['msg', 'Reading the project to find the first screen a child would see.'],
  ['cmd', 'rg -n "signup|parent" src/screens'],
  ['cmd', 'Get-Content src/screens/Activities.tsx'],
  ['think', 'Reasoning summary: the parent gate blocks a child; skip it as asked and follow the Activities flow.'],
  ['msg', 'The Activities screen renders three icon buttons with no text labels.'],
  ['cmd', 'rg -n "aria-label|<Text" src/screens/Activities.tsx'],
  ['ok', 'Assessment: pass. One clear obstacle and one fix. No changes made.'],
];

const run = `
${head('Run it on your repo before it goes back in the pile.', 'Pick a local project or an isolated example, then run the exact prompt revision through Codex or Claude Code. You watch everything live. Up to two runs at once; cancel or retry any time.', 'run')}
<div class="${P}-split">
  <div class="${P}-pane">
    <fieldset class="${P}-group"><legend>Prompt, revision 2</legend><p class="${P}-prompt">${examples[0].prompt}</p></fieldset>
    <dl class="${P}-props">
      <div><dt>Project</dt><dd><span class="${P}-field">C:\\code\\kids-app</span></dd></div>
      <div><dt>Agent</dt><dd>Claude Code (your sign-in)</dd></div>
      <div><dt>Reasoning effort</dt><dd>Medium</dd></div>
      <div><dt>Mode</dt><dd><span class="${P}-check" aria-hidden="true">✓</span> Read-only, nothing in your code changes</dd></div>
    </dl>
  </div>
  <div class="${P}-pane">
    <div class="${P}-console" role="log" aria-label="Sample experiment log"><ol data-log></ol></div>
    <div class="${P}-meters">
      <span>Elapsed <b data-elapsed>00:00</b></span>
      <span>Tokens <b>${results[0].tokens}</b></span>
      <span class="${P}-sample">Sample run</span>
    </div>
    <div class="${P}-verdict" data-verdict hidden>
      <div><span class="${P}-pill is-pass">Agent: pass</span><span class="${P}-pill">Your call: not decided</span></div>
      <p>The agent's assessment is kept apart from yours. Tasks that need edits or missing tools come back as uncertain, not as faked successes.</p>
    </div>
  </div>
</div>
<div class="${P}-row-btns"><button type="button" class="${P}-btn" data-replay>Run again</button><button type="button" class="${P}-btn" data-open="diff">Compare revisions</button></div>`;

const diffRows: [string, string][] = [
  ['-', 'Use this app as a child and tell me what is confusing.'],
  ['+', 'Use this app as a seven-year-old.'],
  ['+', 'Skip the parent-only signup.'],
  ['+', 'Try different activities until you hit something confusing or cannot tell what to do next.'],
  ['+', 'Describe that first obstacle and suggest a fix.'],
  ['+', 'Make no changes yet.'],
];
const diff = `
${head('Change a line, run it again, see what moved the result.', 'Edit the prompt, compare revisions side by side and rerun on the same repo. That is how prompting gets learned: by watching which change made the difference.', 'copies')}
<div class="${P}-diff" role="table" aria-label="Revision 1 compared with revision 2">
  ${diffRows.map(([s, t]) => `<div role="row" class="${P}-diff-row ${s === '-' ? 'is-del' : 'is-add'}"><span role="cell" aria-label="${s === '-' ? 'Removed' : 'Added'}">${s}</span><span role="cell">${t}</span></div>`).join('')}
</div>
<div class="${P}-compare">
  <fieldset class="${P}-group"><legend>Revision 1 result</legend><p><span class="${P}-pill is-unsure">Uncertain</span> Stopped at the parent signup. Listed general advice instead of one obstacle.</p></fieldset>
  <fieldset class="${P}-group"><legend>Revision 2 result</legend><p><span class="${P}-pill is-pass">Pass</span> Got past the gate, found the unlabeled icons, suggested one fix.</p></fieldset>
</div>
<p class="${P}-note">Sample results. What changed: a concrete person, a way past the wall, a point to stop. "Ask the agent" talks it through with the source attached; "Create skill" drafts a SKILL.md from the revision that worked.</p>`;

const capture = `
<label class="${P}-label" for="${P}-cap">Paste text, a link, a screenshot or a file</label>
<textarea id="${P}-cap" class="${P}-input" rows="3">https://youtube.com/watch?v=agent-workflows</textarea>
<div class="${P}-row-btns"><button type="button" class="${P}-btn" data-cap="save">Save only</button><button type="button" class="${P}-btn" data-cap="analyze">Analyze and add</button><button type="button" class="${P}-btn ${P}-btn-default" data-cap="distill">Distill video</button></div>
<p class="${P}-cap-out" aria-live="polite" data-cap-out>Ctrl+Shift+Space opens this from anywhere. Ctrl+N captures inside Kiln.</p>`;

const consent = `
<pre class="${P}-notepad">Before anything runs, Kiln shows
a notice of what gets sent.

It uses the Codex or Claude Code
already signed in on this PC:
your ChatGPT or Claude plan.
No API key. No extra API bill.
(Your plan's usage limits still
apply.)

Editing, approving and installing
never call a model.</pre>`;

const libItems: Record<string, [string, string, string][]> = {
  ...Object.fromEntries(collections.map(c => [c.name, c.items.map(([kind, name], i) => [name, kind, kind === 'Skill' ? ['Approved', 'Draft', 'Approved'][i] : ['Tested', 'Draft', 'Saved'][i]] as [string, string, string])])),
  Favorites: [['Try it as a seven-year-old', 'Prompt', 'Tested'], ['Code review', 'Skill', 'Approved'], ['Reviewer', 'Custom agent', 'Approved']],
  Archive: [['Old commit message style', 'Prompt', 'Archived'], ['research-v1', 'Skill', 'Archived']],
  Trash: [['untitled-skill', 'Skill', 'In trash, restorable']],
};
const libNames = Object.keys(libItems);
const library = `
${head('One library, not folders everywhere.', 'Prompts, skills, custom agents for Codex, Claude Code and Copilot, source notes, insights, techniques, tools and resources. Import installed skills or a skills repo as drafts; the originals stay where they are.', 'library')}
<div class="${P}-toolbar ${P}-filters">
  <label class="visually-hidden" for="${P}-search">Search library</label><input id="${P}-search" class="${P}-input" type="search" placeholder="Search library" value="">
  ${[['Kind', ['All kinds', 'Prompt', 'Skill', 'Custom agent', 'Technique', 'Insight']], ['Status', ['Any status', 'Draft', 'Tested', 'Approved']], ['Provider', ['Any provider', 'Codex', 'Claude Code', 'Copilot']], ['Tag', ['Any tag', 'games', 'review', 'onboarding']]].map(([name, opts]) => `<label class="visually-hidden" for="${P}-f-${name}">${name}</label><select id="${P}-f-${name}" class="${P}-select">${(opts as string[]).map(o => `<option>${o}</option>`).join('')}</select>`).join('')}
  <button type="button" class="${P}-btn" data-open="scan">Find skills not in the library</button>
</div>
<div class="${P}-explorer">
  <ul class="${P}-tree" role="listbox" aria-label="Collections">${libNames.map((n, i) => `<li role="option" tabindex="${i === 0 ? 0 : -1}" aria-selected="${i === 0}" data-col="${n}">${icons[n === 'Trash' ? 'bin' : 'folderSmall']}<span>${n}</span></li>`).join('')}</ul>
  <div class="${P}-table" role="table" aria-label="Items in collection">
    <div role="row" class="${P}-tr ${P}-th"><span role="columnheader">Name</span><span role="columnheader">Kind</span><span role="columnheader">Status</span></div>
    <div data-rows role="rowgroup"></div>
  </div>
</div>`;

const scan = `
<div class="${P}-msg">${icons.info}<div>
<p><strong>Found 7 skills and 1 custom agent that are not in your library.</strong></p>
<p>Also found: 2 broken links and 1 empty folder. Cleanup removes only those.</p></div></div>
<div class="${P}-row-btns ${P}-end"><button type="button" class="${P}-btn ${P}-btn-default" data-act="close">Import as drafts</button><button type="button" class="${P}-btn" data-act="close">Clean up safely</button></div>
<p class="${P}-note">Sample scan.</p>`;

const copies: [string, string, string][] = [
  ['~/.agents/skills/code-review', 'Installed', 'ok'],
  ['~/.claude/skills/code-review', 'Edited outside Kiln', 'warn'],
  ['game-project/.github/skills/code-review', 'Installed', 'ok'],
  ['~/.codex/skills/code-review-old', 'Identical copy found', 'info'],
  ['kids-app/.claude/skills/code-review', 'Linked', 'info'],
];
const props = `
<div class="${P}-tabs" role="tablist" aria-label="code-review properties">
  ${['General', 'Copies', 'History'].map((t, i) => `<button type="button" role="tab" id="${P}-tab-${t}" aria-controls="${P}-panel-${t}" aria-selected="${i === 1}" tabindex="${i === 1 ? 0 : -1}">${t}</button>`).join('')}
</div>
<div class="${P}-tabpanel" role="tabpanel" id="${P}-panel-General" aria-labelledby="${P}-tab-General" hidden>
  <h2 class="${P}-h2-small">A version you can trust stays that version.</h2>
  <dl class="${P}-props">
    <div><dt>Approved</dt><dd>Revision 2, pinned</dd></div>
    <div><dt>Draft</dt><dd>Revision 3, needs review</dd></div>
    <div><dt>Published to</dt><dd>github.com/you/my-kiln (sample)</dd></div>
    <div><dt>Git</dt><dd>Clean, in sync</dd></div>
  </dl>
  <p class="${P}-note">Approval commits that exact snapshot to your own Kiln GitHub repository. Editing makes a new draft and never replaces the approved one; installs always use approved content. On another machine, open the repo and press "Install everything marked for this machine", or run <code>kiln skills sync</code>.</p>
</div>
<div class="${P}-tabpanel" role="tabpanel" id="${P}-panel-Copies" aria-labelledby="${P}-tab-Copies">
  <h2 class="${P}-h2-small">Every copy, and the one that drifted.</h2>
  <div class="${P}-table" role="table" aria-label="Installed copies of code-review">
    <div role="row" class="${P}-tr ${P}-th ${P}-tr2"><span role="columnheader">Location</span><span role="columnheader">State</span></div>
    ${copies.map(([path, state, tone]) => `<div role="row" class="${P}-tr ${P}-tr2"><span role="cell"><code>${path}</code></span><span role="cell"><span class="${P}-dot is-${tone}" aria-hidden="true"></span>${state}</span></div>`).join('')}
  </div>
  <div class="${P}-row-btns"><button type="button" class="${P}-btn" data-compare aria-expanded="false" aria-controls="${P}-drift">Compare with approved</button><button type="button" class="${P}-btn" data-remove>Remove local copies…</button></div>
  <div class="${P}-diff ${P}-drift" id="${P}-drift" hidden>
    <div class="${P}-diff-row is-del"><span>-</span><span>Review standards and the specification separately.</span></div>
    <div class="${P}-diff-row is-add"><span>+</span><span>Review the specification only. (edited by hand, 12 Aug)</span></div>
  </div>
  <p class="${P}-note" data-remove-out aria-live="polite">Install receipts record the revision and the destination of every copy.</p>
</div>
<div class="${P}-tabpanel" role="tabpanel" id="${P}-panel-History" aria-labelledby="${P}-tab-History" hidden>
  <h2 class="${P}-h2-small">Every revision, with its evidence.</h2>
  <ol class="${P}-history">${provenance.map(p => `<li><b>${p.event}</b><span>${p.detail}</span><em>${p.state}</em></li>`).join('')}</ol>
</div>
<div class="${P}-row-btns ${P}-end"><button type="button" class="${P}-btn ${P}-btn-default" data-act="close">OK</button><button type="button" class="${P}-btn" data-act="close">Cancel</button></div>`;

const tokens = `
<div class="${P}-msg">${icons.warn}<div>
<p><strong>Every skill description is loaded on every turn.</strong></p>
<p>Model-invoked skills put their description in your agent's context whether they fire or not. Forgotten, duplicate and stale ones spend tokens and attention. Kiln shows what is installed where, so you can remove what you don't use.</p>
<p class="${P}-note">Kiln doesn't measure a per-skill token cost. Test runs show their own token usage.</p></div></div>
<div class="${P}-row-btns ${P}-end"><button type="button" class="${P}-btn ${P}-btn-default" data-act="close">OK</button></div>`;

const configFiles: [string, string][] = [
  ['AGENTS.md', '# Project notes for agents\n\n- Run `npm test` before you say done.\n- Use spaces, not tabs.\n- Never commit generated files in /dist.\n- Ask before adding a dependency.'],
  ['CLAUDE.md', '# Claude Code\n\nSee AGENTS.md for shared rules.\n\n- Prefer small, reviewable diffs.\n- Explain the cause before the fix.'],
  ['config.toml', '# ~/.codex/config.toml\nmodel_reasoning_effort = "medium"\napproval_policy = "on-request"\n\n[mcp_servers.docs]\ncommand = "docs-mcp"'],
  ['settings.json', '{\n  "permissions": {\n    "allow": ["Bash(npm test)"],\n    "deny": ["Read(.env)"]\n  }\n}'],
  ['hooks.json', '{\n  "hooks": {\n    "Stop": [{ "command": "notify-done" }]\n  }\n}\n// Kiln edits hooks. It never runs them.'],
];
const config = `
${head('Your agent config, edited in place.', 'CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, permissions, VS Code settings and shell profiles, side by side.', 'config')}
<div class="${P}-explorer ${P}-cfg">
  <ul class="${P}-tree" role="listbox" aria-label="Config files">${configFiles.map(([n], i) => `<li role="option" tabindex="${i === 0 ? 0 : -1}" aria-selected="${i === 0}" data-cfg="${i}">${icons.txt}<span>${n}</span></li>`).join('')}</ul>
  <pre class="${P}-editor" data-cfg-text tabindex="0" aria-label="File contents"></pre>
</div>
<div class="${P}-cfg-status"><span><span class="${P}-dot is-ok" aria-hidden="true"></span>Syntax OK</span><span>30 private backups</span><button type="button" class="${P}-btn" data-stale>Diff with backup</button></div>
<p class="${P}-note" data-stale-out aria-live="polite">If the file changes on disk while you edit, Kiln notices before you save over it.</p>`;

const bin = `
<p class="${P}-note">Deleted from your library, restorable until you empty it. Archive, trash and undo work on whole selections too.</p>
<ul class="${P}-folders ${P}-bin-list"><li>${icons.txt}<span>Old commit message style</span></li><li>${icons.folder}<span>untitled-skill</span></li></ul>
<div class="${P}-row-btns ${P}-end"><button type="button" class="${P}-btn" data-restore>Restore all</button></div>`;

const setup = `
<div class="${P}-wizard">
  <div class="${P}-wizard-art" aria-hidden="true">${icons.kiln.replace('width="32" height="32"', 'width="96" height="96"')}<span>Kiln</span></div>
  <div class="${P}-wizard-body">
    <h2>Install Kiln 0.17.0 for Windows</h2>
    <p>Setup downloads the Windows installer. Kiln also ships a CLI, so scripts and your agents can read collections, run experiments, approve and install, with JSON results.</p>
    <fieldset class="${P}-group"><legend>You will need</legend>
      <ul class="${P}-needs">
        <li><span class="${P}-check" aria-hidden="true">✓</span>A Windows PC</li>
        <li><span class="${P}-check" aria-hidden="true">✓</span>Codex or Claude Code, already signed in</li>
        <li><span class="${P}-check" aria-hidden="true">✓</span>A GitHub account with access to the private release repository</li>
        <li><span class="${P}-check" aria-hidden="true">✓</span>The official <code>gh</code> CLI, which Kiln uses to create your library repository</li>
      </ul>
    </fieldset>
    <p class="${P}-note">Builds are unsigned, so Windows may ask you to confirm. MIT licensed.</p>
    <div class="${P}-row-btns ${P}-end ${P}-wizard-btns"><button type="button" class="${P}-btn" disabled>&lt; Back</button><a class="${P}-btn ${P}-btn-default" href="${installer}">${windowsMark}<span>Download installer</span></a></div>
  </div>
</div>`;

const desktopIcons: [string, string, IconKey][] = [
  ['kiln', 'Kiln', 'kiln'], ['bookmarks', 'Bookmarks', 'bookmarks'], ['skills', '.claude\\skills', 'skills'],
  ['run', 'Test run', 'run'], ['library', 'Library', 'library'], ['props', 'Installed copies', 'copies'],
  ['config', 'Config files', 'config'], ['setup', 'Kiln Setup', 'setup'], ['bin', 'Recycle Bin', 'bin'],
];

// --- Render -------------------------------------------------------------------------------------------------------

export function render(root: HTMLElement) {
  document.title = 'Kiln — You bookmarked it. Kiln runs it.';
  root.innerHTML = `
<a class="skip" href="#${P}-w-kiln">Skip to Kiln</a>
<div class="${P}">
  <nav class="${P}-taskbar" aria-label="Taskbar">
    <button type="button" class="${P}-start" aria-expanded="false" aria-controls="${P}-startmenu">${icons.start}<span>Start</span></button>
    <div class="${P}-startmenu" id="${P}-startmenu" hidden>
      <span class="${P}-startmenu-side" aria-hidden="true">Kiln <b>0.17</b></span>
      <ul>${desktopIcons.filter(([id]) => id !== 'bin').map(([id, label, ic]) => `<li><button type="button" data-open="${id}">${icons[ic].replace('width="32" height="32"', 'width="24" height="24"')}<span>${label}</span></button></li>`).join('')}
      <li class="${P}-sep" role="separator"></li>
      <li><a href="${installer}">${icons.setup.replace('width="32" height="32"', 'width="24" height="24"')}<span>Download for Windows</span></a></li></ul>
    </div>
    <div class="${P}-tasks" data-tasks></div>
    <div class="${P}-tray"><span class="${P}-tray-icon" title="Kiln quick search: Ctrl+Shift+Space">${icons.tray}<span class="visually-hidden">Kiln is in the tray. Quick search with Ctrl+Shift+Space.</span></span><time data-clock></time></div>
  </nav>
  <main id="main" class="${P}-desk">
    <div class="${P}-hero-desk">
      <ul class="${P}-icons" aria-label="Desktop icons. Double-click or press Enter to open.">
        ${desktopIcons.map(([id, label, ic]) => `<li><button type="button" class="${P}-icon" data-icon-open="${id}">${icons[ic]}<span>${label}</span></button></li>`).join('')}
      </ul>
      ${win('kiln', 'Kiln', kiln, { icon: 'kiln', label: 'Kiln', menu: ['File', 'Edit', 'View', 'Library', 'Help'], status: ['Ready', 'Uses your Codex or Claude Code sign-in'], cls: `${P}-w-kiln` })}
      ${win('bookmarks', 'Bookmarks (312 items)', bookmarks, { icon: 'bookmarks', label: 'Bookmarks, a sample of 312 saved items', menu: ['File', 'Edit', 'View', 'Favorites'], status: ['312 objects (sample)', '<span data-tried>0 tried</span>'], cls: `${P}-w-bm` })}
      ${win('skills', '~/.claude/skills', skills, { icon: 'skills', label: 'The skills folder, sample', menu: ['File', 'Edit', 'View'], status: ['11 folders (sample)', 'Which one is current?'], cls: `${P}-w-sk` })}
    </div>
    <div class="${P}-story">
      ${win('run', 'Experiment — Try it as a seven-year-old', run, { icon: 'run', label: 'Test run', status: ['Revision 2', 'Read-only', '1 of 2 run slots'], cls: `${P}-w-run` })}
      ${win('capture', 'Quick capture', capture, { icon: 'tray', label: 'Quick capture', cls: `${P}-w-cap` })}
      ${win('diff', 'Compare revisions', diff, { icon: 'copies', label: 'Compare revisions', status: ['Revision 1 ↔ Revision 2', 'Same repo'], cls: `${P}-w-diff` })}
      ${win('consent', 'before-you-run.txt - Notepad', consent, { icon: 'txt', label: 'What gets sent, and who pays', menu: ['File', 'Edit', 'Search', 'Help'], cls: `${P}-w-consent` })}
      ${win('library', 'Library — Kiln', library, { icon: 'library', label: 'Library', menu: ['File', 'Edit', 'View', 'Go'], status: ['<span data-count>3 items</span>', 'Ctrl/Shift-click to select, Ctrl+A for all', 'Archive, trash, restore, undo'], cls: `${P}-w-lib` })}
      ${win('scan', 'Find skills and agents', scan, { icon: 'info', label: 'Scan results', cls: `${P}-w-scan` })}
      ${win('props', 'code-review Properties', props, { icon: 'copies', label: 'Installed copies and versions of the code-review skill', cls: `${P}-w-props` })}
      ${win('tokens', 'About skill descriptions', tokens, { icon: 'warn', label: 'Why unused skills cost something', cls: `${P}-w-tok` })}
      ${win('config', 'Config files — Kiln', config, { icon: 'config', label: 'Config files', status: ['Edits the real file', 'Never runs hooks'], cls: `${P}-w-cfg` })}
      ${win('setup', 'Kiln Setup', setup, { icon: 'setup', label: 'Download Kiln', cls: `${P}-w-setup` })}
      ${win('bin', 'Recycle Bin', bin, { icon: 'bin', label: 'Recycle Bin', hidden: true, status: ['2 objects'], cls: `${P}-w-bin` })}
    </div>
  </main>
</div>`;

  const q = <T extends Element = HTMLElement>(sel: string, from: ParentNode = root) => from.querySelector<T>(sel)!;
  const qa = <T extends Element = HTMLElement>(sel: string, from: ParentNode = root) => [...from.querySelectorAll<T>(sel)];
  const desktop = () => matchMedia('(min-width: 1200px)').matches;
  const wins = new Map(qa<HTMLElement>(`.${P}-win`).map(w => [w.dataset.win!, w]));
  const tasks = q('[data-tasks]');
  let zTop = 10;

  // Taskbar buttons
  const syncTasks = () => {
    tasks.innerHTML = [...wins.values()].filter(w => !w.hidden || w.dataset.min === '1').map(w => `<button type="button" class="${P}-task ${w.classList.contains('is-active') && !w.hidden ? 'is-on' : ''}" data-task="${w.dataset.win}" aria-pressed="${w.classList.contains('is-active') && !w.hidden}">${icons[w.dataset.icon as IconKey].replace('width="32" height="32"', 'width="16" height="16"')}<span>${w.dataset.title}</span></button>`).join('');
  };
  const activate = (w: HTMLElement) => {
    if (w.classList.contains('is-active') && Number(w.style.zIndex) === zTop) return;
    wins.forEach(o => o.classList.toggle('is-active', o === w));
    w.style.zIndex = String(++zTop);
    syncTasks();
  };
  const open = (id: string, scroll = true) => {
    const w = wins.get(id);
    if (!w) return;
    w.hidden = false;
    delete w.dataset.min;
    activate(w);
    syncTasks();
    if (scroll) {
      const r = w.getBoundingClientRect();
      if (r.top < 50 || r.top > innerHeight - 120) w.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      q<HTMLElement>(`.${P}-bar`, w).focus({ preventScroll: true });
    }
  };

  wins.forEach(w => {
    w.addEventListener('pointerdown', () => activate(w));
    w.addEventListener('focusin', () => activate(w));
    qa<HTMLButtonElement>('[data-act]', w).forEach(b => b.addEventListener('click', () => {
      if (b.dataset.act === 'min') w.dataset.min = '1'; else delete w.dataset.min;
      w.hidden = true;
      w.classList.remove('is-active');
      syncTasks();
    }));
    // Dragging by the title bar (pointer and keyboard). Only on the desktop layout.
    const bar = q<HTMLElement>(`.${P}-bar`, w);
    let dx = 0, dy = 0;
    const place = () => { w.style.translate = `${dx}px ${dy}px`; };
    bar.addEventListener('pointerdown', e => {
      if (!desktop() || (e.target as HTMLElement).closest('button') || e.button !== 0) return;
      e.preventDefault();
      const sx = e.clientX - dx, sy = e.clientY - dy;
      const base = w.getBoundingClientRect();
      const bx = base.left - dx, by = base.top - dy;
      bar.setPointerCapture(e.pointerId);
      w.classList.add('is-dragging');
      const move = (m: PointerEvent) => {
        dx = Math.min(innerWidth - 80 - bx, Math.max(-bx - base.width + 120, m.clientX - sx));
        dy = Math.max(44 - by, m.clientY - sy);
        place();
      };
      const up = () => { w.classList.remove('is-dragging'); bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); bar.removeEventListener('pointercancel', up); };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });
    bar.addEventListener('keydown', e => {
      if (!desktop()) return;
      const step = e.shiftKey ? 48 : 12;
      const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (!map[e.key]) return;
      e.preventDefault();
      dx += map[e.key][0]; dy += map[e.key][1];
      place();
    });
    addEventListener('resize', () => { if (!desktop()) { dx = 0; dy = 0; w.style.translate = ''; } });
  });

  tasks.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-task]');
    if (!b) return;
    const w = wins.get(b.dataset.task!)!;
    if (!w.hidden && w.classList.contains('is-active')) { w.dataset.min = '1'; w.hidden = true; w.classList.remove('is-active'); syncTasks(); }
    else open(b.dataset.task!);
  });

  // Desktop icons: click selects, double-click or Enter opens. Touch opens on tap.
  qa<HTMLButtonElement>('[data-icon-open]').forEach(b => {
    let touch = false;
    b.addEventListener('pointerdown', e => { touch = e.pointerType === 'touch'; });
    b.addEventListener('click', () => {
      qa(`.${P}-icon`).forEach(i => i.classList.toggle('is-sel', i === b));
      if (touch || !desktop()) open(b.dataset.iconOpen!);
    });
    b.addEventListener('dblclick', () => open(b.dataset.iconOpen!));
    b.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); open(b.dataset.iconOpen!); } });
  });
  qa<HTMLButtonElement>('[data-open]').forEach(b => b.addEventListener('click', () => { closeStart(); open(b.dataset.open!); }));

  // Start menu
  const start = q<HTMLButtonElement>(`.${P}-start`);
  const menu = q<HTMLElement>(`#${P}-startmenu`);
  const closeStart = () => { menu.hidden = true; start.setAttribute('aria-expanded', 'false'); };
  start.addEventListener('click', () => {
    const show = menu.hidden;
    menu.hidden = !show;
    start.setAttribute('aria-expanded', String(show));
    if (show) q<HTMLElement>('button, a', menu).focus();
  });
  document.addEventListener('pointerdown', e => { if (!menu.hidden && !(e.target as HTMLElement).closest(`#${P}-startmenu, .${P}-start`)) closeStart(); });
  menu.addEventListener('keydown', e => { if (e.key === 'Escape') { closeStart(); start.focus(); } });

  // Clock
  const clock = q<HTMLTimeElement>('[data-clock]');
  const tick = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); clock.dateTime = d.toISOString(); };
  tick();
  setInterval(tick, 15000);

  // --- Bookmark onto Kiln -------------------------------------------------------------------------------------------
  let selected = 0;
  const tried = new Set<number>();
  const kilnWin = wins.get('kiln')!;
  const zone = q<HTMLElement>('[data-drop]');
  const bms = qa<HTMLButtonElement>(`button.${P}-bm`);
  const select = (i: number) => { selected = i; bms.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.ex) === i))); };
  let timers: number[] = [];
  const later = (ms: number, fn: () => void) => { timers.push(window.setTimeout(fn, reduced ? 0 : ms)); };

  const send = (i: number) => {
    select(i);
    timers.forEach(clearTimeout);
    timers = [];
    open('kiln', !desktop());
    const r = results[i];
    zone.innerHTML = `
      <ol class="${P}-steps" data-steps></ol>
      <div class="${P}-progress" role="progressbar" aria-label="Test run progress" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0"><span data-fill></span></div>`;
    const steps = q<HTMLOListElement>('[data-steps]', zone);
    const bar = q<HTMLElement>(`.${P}-progress`, zone);
    const fill = q<HTMLElement>('[data-fill]', zone);
    const lines = [`Captured <b>${files[i]}</b> as a prompt, revision 1.`, `Project <b>${repos[i]}</b>, read-only.`, 'Claude Code, your sign-in. Reasoning effort: medium.', 'Reading files, running searches…'];
    lines.forEach((l, n) => later(n * 520, () => { steps.insertAdjacentHTML('beforeend', `<li>${l}</li>`); }));
    for (let n = 1; n <= 10; n++) later(400 + n * 220, () => { fill.style.width = `${n * 10}%`; bar.setAttribute('aria-valuenow', String(n)); });
    later(2800, () => {
      zone.innerHTML = `
        <div class="${P}-result">
          <p class="${P}-result-head"><span class="${P}-pill ${r.verdict === 'Pass' ? 'is-pass' : 'is-unsure'}">Agent: ${r.verdict.toLowerCase()}</span><span class="${P}-sample">Sample output</span></p>
          <p>${r.text}</p>
          <p class="${P}-note">Tokens ${r.tokens}. Elapsed 01:${[42, 18, 57][i]}. Nothing in the repo changed.</p>
          <div class="${P}-row-btns" data-judge><button type="button" class="${P}-btn ${P}-btn-default" data-keep>Keep it</button><button type="button" class="${P}-btn" data-open-diff>Edit and run again</button><button type="button" class="${P}-btn" data-reset>Try another</button></div>
        </div>`;
      tried.add(i);
      q('[data-tried]').textContent = `${tried.size} tried`;
      bms[i].querySelector(`.${P}-never`)!.textContent = 'Today';
      bms[i].classList.add('is-tried');
      q<HTMLButtonElement>('[data-keep]', zone).addEventListener('click', () => {
        q('[data-judge]', zone).outerHTML = `<p class="${P}-approved">Approved revision 1 and published it to your Kiln repository. <button type="button" class="${P}-btn ${P}-btn-default" data-install>Install as a skill</button></p>`;
        q<HTMLButtonElement>('[data-install]', zone).focus();
        q<HTMLButtonElement>('[data-install]', zone).addEventListener('click', () => {
          const slug = files[i].replace(/\.(url|txt)$/, '');
          q(`.${P}-approved`, zone).innerHTML = `Installed <code>~/.claude/skills/${slug}</code>. A new Claude Code session picks it up. <button type="button" class="${P}-btn" data-reset>Try another</button>`;
          const list = q(`.${P}-folders`, wins.get('skills')!);
          if (!list.querySelector(`[data-new="${i}"]`)) list.insertAdjacentHTML('afterbegin', `<li class="is-new" data-new="${i}">${icons.folder}<span>${slug}</span><small>approved, rev 1</small></li>`);
          q<HTMLButtonElement>('[data-reset]', zone).addEventListener('click', reset);
        });
      });
      q<HTMLButtonElement>('[data-open-diff]', zone).addEventListener('click', () => open('diff'));
      q<HTMLButtonElement>('[data-reset]', zone).addEventListener('click', reset);
    });
  };
  const idle = zone.innerHTML;
  const reset = () => {
    timers.forEach(clearTimeout);
    const next = [0, 1, 2].find(n => !tried.has(n)) ?? 0;
    zone.innerHTML = idle.replace(files[0], files[next]);
    select(next);
    q<HTMLButtonElement>('[data-send]', zone).addEventListener('click', () => send(selected));
  };
  qa<HTMLButtonElement>('[data-send]').forEach(b => b.addEventListener('click', () => send(selected)));

  bms.forEach(b => {
    const i = Number(b.dataset.ex);
    let dragged = false;
    let touch = false;
    b.addEventListener('click', () => { if (dragged) { dragged = false; return; } select(i); if (touch || !desktop()) send(i); });
    b.addEventListener('dblclick', () => send(i));
    b.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(i); } });
    b.addEventListener('pointerdown', e => {
      touch = e.pointerType === 'touch';
      if (touch || e.button !== 0 || !desktop()) return;
      const sx = e.clientX, sy = e.clientY;
      let ghost: HTMLElement | null = null;
      const move = (m: PointerEvent) => {
        if (!ghost && Math.hypot(m.clientX - sx, m.clientY - sy) < 5) return;
        if (!ghost) {
          ghost = document.createElement('div');
          ghost.className = `${P}-ghost`;
          ghost.innerHTML = `${icons[i === 1 ? 'txt' : 'url'].replace('width="16" height="16"', 'width="32" height="32"')}<span>${files[i]}</span>`;
          document.body.append(ghost);
          select(i);
        }
        ghost.style.transform = `translate(${m.clientX + 6}px, ${m.clientY + 6}px)`;
        const k = kilnWin.getBoundingClientRect();
        const over = m.clientX > k.left && m.clientX < k.right && m.clientY > k.top && m.clientY < k.bottom;
        kilnWin.classList.toggle('is-target', over);
        ghost.classList.toggle('is-ok', over);
      };
      const up = (u: PointerEvent) => {
        removeEventListener('pointermove', move);
        removeEventListener('pointerup', up);
        if (!ghost) return;
        dragged = true;
        ghost.remove();
        const k = kilnWin.getBoundingClientRect();
        kilnWin.classList.remove('is-target');
        if (u.clientX > k.left && u.clientX < k.right && u.clientY > k.top && u.clientY < k.bottom) send(i);
      };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
    });
  });

  // --- Test run log (plays when the window scrolls into view) -------------------------------------------------------
  const log = q<HTMLOListElement>('[data-log]');
  const elapsed = q('[data-elapsed]');
  const verdict = q('[data-verdict]');
  let logTimers: number[] = [];
  const play = () => {
    logTimers.forEach(clearTimeout);
    logTimers = [];
    log.innerHTML = '';
    verdict.hidden = true;
    runLog.forEach(([kind, text], n) => logTimers.push(window.setTimeout(() => {
      log.insertAdjacentHTML('beforeend', `<li class="is-${kind}"><span>${kind === 'cmd' ? '&gt;' : kind === 'think' ? '…' : kind === 'ok' ? '✓' : '·'}</span>${text}</li>`);
      const s = Math.round((n + 1) / runLog.length * 102);
      elapsed.textContent = `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      if (n === runLog.length - 1) verdict.hidden = false;
    }, reduced ? 0 : 300 + n * 650)));
  };
  new IntersectionObserver((entries, obs) => { if (entries.some(e => e.isIntersecting)) { play(); obs.disconnect(); } }, { threshold: 0.35 }).observe(wins.get('run')!);
  q('[data-replay]').addEventListener('click', play);

  // --- Quick capture -----------------------------------------------------------------------------------------------
  const capOut = q('[data-cap-out]');
  const capMsg: Record<string, string> = {
    save: 'Saved to your library without calling a model.',
    analyze: 'Analyzing into prompts, insights, techniques, tools and resources, in a collection linked to the source.',
    distill: 'Distilling captions into reusable entries with timestamped links. The transcript stays attached.',
  };
  qa<HTMLButtonElement>('[data-cap]').forEach(b => b.addEventListener('click', () => { capOut.textContent = capMsg[b.dataset.cap!]; }));

  // --- Library tree ---------------------------------------------------------------------------------------------------
  const rows = q('[data-rows]');
  const count = q('[data-count]');
  const showCol = (name: string) => {
    rows.innerHTML = libItems[name].map(([n, k, s]) => `<div role="row" class="${P}-tr"><span role="cell">${n}</span><span role="cell">${k}</span><span role="cell">${s}</span></div>`).join('');
    count.textContent = `${libItems[name].length} items`;
  };
  const listbox = (sel: string, onPick: (el: HTMLElement) => void) => {
    const opts = qa<HTMLElement>(`${sel} [role=option]`);
    const pick = (el: HTMLElement, focus = false) => {
      opts.forEach(o => { o.setAttribute('aria-selected', String(o === el)); o.tabIndex = o === el ? 0 : -1; });
      if (focus) el.focus();
      onPick(el);
    };
    opts.forEach((o, n) => {
      o.addEventListener('click', () => pick(o));
      o.addEventListener('keydown', e => {
        const next = e.key === 'ArrowDown' ? opts[n + 1] : e.key === 'ArrowUp' ? opts[n - 1] : null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
        if (next) pick(next, true);
      });
    });
  };
  showCol(libNames[0]);
  listbox(`.${P}-w-lib .${P}-tree`, el => showCol(el.dataset.col!));

  // --- Properties tabs -----------------------------------------------------------------------------------------------
  const tabs = qa<HTMLButtonElement>('[role=tab]');
  const pickTab = (t: HTMLButtonElement) => tabs.forEach(o => { const on = o === t; o.setAttribute('aria-selected', String(on)); o.tabIndex = on ? 0 : -1; q(`#${o.getAttribute('aria-controls')}`).hidden = !on; });
  tabs.forEach((t, n) => {
    t.addEventListener('click', () => pickTab(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = tabs[(n + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      pickTab(next);
      next.focus();
    });
  });
  const cmp = q<HTMLButtonElement>('[data-compare]');
  cmp.addEventListener('click', () => { const on = cmp.getAttribute('aria-expanded') !== 'true'; cmp.setAttribute('aria-expanded', String(on)); q(`#${P}-drift`).hidden = !on; });
  q('[data-remove]').addEventListener('click', () => { q('[data-remove-out]').textContent = 'Sample: 3 managed copies would be deleted and 2 unmanaged ones moved to private backups. Your library keeps the skill.'; });

  // --- Config files ---------------------------------------------------------------------------------------------------
  const cfgText = q('[data-cfg-text]');
  cfgText.textContent = configFiles[0][1];
  listbox(`.${P}-cfg .${P}-tree`, el => { cfgText.textContent = configFiles[Number(el.dataset.cfg)][1]; });
  q('[data-stale]').addEventListener('click', () => { q('[data-stale-out]').textContent = 'Backup from yesterday: 1 line differs ("Use spaces, not tabs." was added). Restore puts the old file back and keeps this one as a backup.'; });

  q('[data-restore]').addEventListener('click', e => { q(`.${P}-bin-list`).innerHTML = ''; (e.currentTarget as HTMLButtonElement).textContent = 'Restored'; });

  activate(kilnWin);
  syncTasks();
}
