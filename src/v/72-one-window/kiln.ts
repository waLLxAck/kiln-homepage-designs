// PROTOTYPE H12: the one crisp Kiln window. Sample data plus pure render functions from a state object, so the live pinned
// window and the static screenshot snapshots share the same markup.
import { examples } from '../../content';

export type Col = 'claude' | 'agents' | 'codex' | 'copilot' | 'project';
export type Cell = 'on' | 'off' | 'edited' | 'found';
export type View = 'skills' | 'capture' | 'test';
export type SourceId = 'video' | 'post' | 'repo';
export type PromptId = 'video' | 'post';
export type Row = { id: string; name: string; note: string; copies: number; cells: Record<Col, Cell>; fresh?: boolean; imported?: boolean; draft?: boolean };
export type Phase = 'idle' | 'running' | 'uncertain' | 'pass' | 'approved';
export type State = {
  popped: boolean; cleaned: boolean; rows: Row[]; detail: { row: string; col: Col } | null;
  source: SourceId | null; analyzing: boolean; imported: boolean;
  prompt: PromptId | null; repo: string; rev: 1 | 2; phase: Phase; steps: number;
};

export const cols: { key: Col; name: string; path: string; who: string }[] = [
  { key: 'claude', name: 'Claude', path: '~/.claude/skills', who: 'Claude Code' },
  { key: 'agents', name: 'Agents', path: '~/.agents/skills', who: 'Codex, Copilot and others' },
  { key: 'codex', name: 'Codex', path: '.codex/skills', who: 'Codex' },
  { key: 'copilot', name: 'Copilot', path: '.copilot/skills', who: 'Copilot' },
  { key: 'project', name: 'my-game', path: 'my-game/.github/skills', who: 'the my-game project' },
];

const cells = (partial: Partial<Record<Col, Cell>>): Record<Col, Cell> => ({ claude: 'off', agents: 'off', codex: 'off', copilot: 'off', project: 'off', ...partial });
export const baseRows = (): Row[] => [
  { id: 'code-review', name: 'code-review', note: 'approved rev 3', copies: 4, cells: cells({ claude: 'edited', agents: 'on', codex: 'on', project: 'on' }) },
  { id: 'research', name: 'research', note: 'approved rev 2', copies: 2, cells: cells({ claude: 'on', agents: 'on' }) },
  { id: 'writing', name: 'writing-for-agents', note: 'approved rev 1', copies: 2, cells: cells({ claude: 'on', copilot: 'on' }) },
  { id: 'playtest', name: 'playtest-brief', note: 'approved rev 4', copies: 2, cells: cells({ codex: 'edited', project: 'on' }) },
  { id: 'pr-summary', name: 'pr-summary', note: 'not in your library', copies: 1, cells: cells({ copilot: 'found' }) },
];

// ---------- problem 2: sources, what Kiln pulls out of them, and the sample runs ----------

export const prompts: Record<PromptId, { title: string; text: string; skill: string; collection: string; from: string; via: string; at?: string;
  cards: { kind: 'Technique' | 'Insight' | 'Tool'; title: string; at?: string }[] }> = {
  video: { title: examples[0].title, text: examples[0].prompt, skill: 'kid-usability-check', collection: 'Usability ideas', at: '04:12',
    from: 'Let your coding agent play your app like a kid', via: 'YouTube · Pair Programming Club · transcript attached',
    cards: [
      { kind: 'Technique', title: 'Give the agent a persona with limits', at: '07:35' },
      { kind: 'Insight', title: 'The first confusing moment tells you more than the tenth', at: '11:02' },
      { kind: 'Tool', title: 'A browser the agent can click through', at: '14:48' },
    ] },
  post: { title: examples[1].title, text: examples[1].prompt, skill: 'instruction-trace', collection: 'Agent workflows',
    from: 'Post by Rae Okafor (@raeships)', via: 'X · saved with the post text',
    cards: [
      { kind: 'Technique', title: 'Ask for the cause before the fix' },
      { kind: 'Insight', title: 'Repeat mistakes often trace back to one stale line' },
      { kind: 'Tool', title: 'AGENTS.md and CLAUDE.md' },
    ] },
};

type Step = [kind: 'read' | 'search' | 'run' | 'think', text: string];
export const runs: Record<PromptId, { rev1: Step[]; rev2?: Step[]; fix?: { before: string; after: string; lesson: string }; unsure?: string }> = {
  video: {
    rev1: [['read', 'Read README.md and package.json'], ['run', 'Ran git ls-files src/screens'], ['search', 'Searched src/ for "signup", skipped the parent flow'], ['read', 'Walked Start, Levels and Shop'], ['think', 'Found two confusing spots, can’t tell which comes first']],
    rev2: [['read', 'Read README.md and package.json'], ['run', 'Ran git ls-files src/screens'], ['search', 'Searched src/ for "signup", skipped the parent flow'], ['read', 'Walked Start, Levels and Shop'], ['think', 'First obstacle: the play button is an icon with no label. Quoted it.']],
    unsure: 'It found two confusing spots and couldn’t say which one a child hits first.',
    fix: { before: 'Describe that first obstacle and suggest a fix.', after: 'Describe the first obstacle, quote the text on screen, and suggest a fix.', lesson: 'Asking for the on-screen text made it commit to one obstacle instead of hedging.' },
  },
  post: { rev1: [['read', 'Read AGENTS.md and CLAUDE.md'], ['search', 'Searched the session log for "run every test"'], ['read', 'Opened .github/workflows/ci.yml'], ['think', 'Traced it to one outdated line in AGENTS.md and proposed a one-line change']] },
};
export const stepsFor = (st: State) => (st.prompt ? (st.rev === 2 && runs[st.prompt].rev2) || runs[st.prompt].rev1 : []);

// ---------- icons ----------

const icon = (d: string, size = 16) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const icons = {
  skills: 'M3 5.5h8M3 14.5h5M14 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 12.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16 5.5h1M14 14.5h3',
  capture: 'M10 3v9M6 8.5l4 4 4-4M3.5 13v3.5h13V13',
  test: 'M8 3h4M8.8 3v5L4.5 15.2a1.3 1.3 0 0 0 1.1 1.8h8.8a1.3 1.3 0 0 0 1.1-1.8L11.2 8V3M6.5 12h7',
  read: 'M5 3h7l3 3v11H5zM12 3v3h3', search: 'M8.5 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 12l4.5 4.5',
  run: 'M3.5 5.5l4 4-4 4M9.5 14.5h7', think: 'M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM8 17h4',
  warn: 'M10 3.5 17.5 16.5h-15zM10 8.5v3.5M10 14.3v.2', check: 'M4.5 10.5l3.5 3.5 7.5-8', star: 'M10 2.8l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5L2.8 8l5-.6z',
  grip: 'M7 4.5v.1M13 4.5v.1M7 10v.1M13 10v.1M7 15.5v.1M13 15.5v.1', chevron: 'M5.5 12.5 10 8l4.5 4.5', link: 'M8.5 11.5l3-3M7 9.5l-1.5 1.5a2.5 2.5 0 0 0 3.5 3.5L10.5 13M13 10.5l1.5-1.5a2.5 2.5 0 0 0-3.5-3.5L9.5 7',
  play: 'M7 5l8 5-8 5z', repo: 'M5 3.5h9.5v11H6.5a1.5 1.5 0 0 0 0 3h8M5 16V5a1.5 1.5 0 0 1 1.5-1.5',
};
export const ico = (name: keyof typeof icons, size = 16) => icon(icons[name], size);

// ---------- skills pane ----------

const stateText: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln', found: 'found outside your library' };
export const onCount = (st: State) => st.rows.reduce((sum, row) => sum + Object.values(row.cells).filter(cell => cell === 'on' || cell === 'edited').length, 0);

export function toggle(row: Row, col: typeof cols[number]) {
  const state = row.cells[col.key];
  return `<button type="button" class="h12-sw h12-sw-${state}" data-row="${row.id}" data-col="${col.key}" role="switch" aria-checked="${state === 'on' || state === 'edited'}" aria-label="${row.name} in ${col.path}: ${stateText[state]}" title="${col.path}: ${stateText[state]}"><i></i></button>`;
}

export function rowHtml(row: Row, st: State) {
  const copies = row.copies > 1 && !row.fresh ? `<span class="h12-copies${st.popped ? ' is-shown' : ''}"> · <b>${row.copies}</b> copies</span>` : '';
  return `<tr class="h12-row${st.popped || row.fresh ? ' is-in' : ''}${row.fresh ? ' is-fresh' : ''}" data-rowid="${row.id}">
    <th scope="row"><b>${row.name}</b><small>${row.fresh ? `<span class="h12-new">new</span> ${row.note}` : `${row.note}${copies}`}</small></th>
    ${cols.map(col => `<td class="${st.popped || row.fresh ? 'is-in' : ''}${row.cells[col.key] !== 'off' ? ' has-file' : ''}" data-cell="${row.id}:${col.key}">${toggle(row, col)}</td>`).join('')}
  </tr>`;
}

function detailHtml(st: State) {
  if (!st.detail) return '';
  const row = st.rows.find(item => item.id === st.detail!.row)!, col = cols.find(item => item.key === st.detail!.col)!;
  if (row.cells[col.key] === 'found') return `<div class="h12-detail" role="group" aria-label="${row.name} details">
    <p><b>${row.name}</b> is in <code>${col.path}</code> but not in your library.</p>
    <p class="h12-dim">Import it as a draft. The folder stays exactly where it is.</p>
    <div class="h12-btns"><button type="button" class="h12-b h12-b-acc" data-act="import">Import as draft</button><button type="button" class="h12-b" data-act="close">Not now</button></div></div>`;
  const diff = row.id === 'playtest' ? ['- Rank the ten most impactful improvements.', '+ Rank the five most impactful improvements.'] : ['- Review standards and the specification separately.', '+ Review the specification only. Skip style.'];
  return `<div class="h12-detail" role="group" aria-label="${row.name} details">
    <p><b><code>${col.path}/${row.name}</code></b> was edited outside Kiln. It differs from ${row.note.replace('approved ', 'approved ')}:</p>
    <div class="h12-diff"><p class="h12-del">${diff[0]}</p><p class="h12-add">${diff[1]}</p></div>
    <div class="h12-btns"><button type="button" class="h12-b h12-b-acc" data-act="replace">Replace with the approved version</button><button type="button" class="h12-b" data-act="draft">Keep the edit as a draft</button><button type="button" class="h12-b h12-b-quiet" data-act="close">Close</button></div></div>`;
}

export function flagHtml(st: State) {
  if (st.cleaned) return `<p class="h12-flag is-ok">${ico('check')}<span>Removed the broken link and the empty folder. Nothing else was touched.</span></p>`;
  return `<p class="h12-flag">${ico('warn')}<span><b>2 things to clean up:</b> a broken link in <code>~/.agents/skills</code> and an empty folder in <code>.codex/skills</code>.</span><button type="button" class="h12-b h12-b-sm" data-act="clean">Clean up safely</button></p>`;
}

export function contextHtml(st: State) {
  return `Switched on: <b>${onCount(st)} copies</b> in ${cols.length} folders. Each description sits in your agent’s context every turn, used or not.`;
}

export function skillsPane(st: State) {
  const anyVisible = st.popped || st.rows.some(row => row.fresh);
  return `<div class="h12-pane-head"><h3>Skills</h3><p class="h12-dim">One row per skill, one switch per folder your agents read.</p></div>
    <div class="h12-flagslot${st.popped ? ' is-in' : ''}" data-flagslot>${flagHtml(st)}</div>
    <div class="h12-tablewrap" data-tablewrap>
      <table class="h12-table"><thead><tr><th scope="col" class="h12-th-skill">Skill</th>${cols.map(col => `<th scope="col" title="${col.path}"><span>${col.name}</span><code>${col.path.replace('/skills', '').replace('my-game/', '')}</code></th>`).join('')}</tr></thead>
      <tbody data-rows>${st.rows.map(row => rowHtml(row, st)).join('')}</tbody></table>
      <div class="h12-empty${anyVisible ? ' is-gone' : ''}" data-empty><p><b>No skills in your library yet.</b></p><p class="h12-dim">Kiln looks in every folder your agents read from, on this machine and in projects you add.</p><button type="button" class="h12-b h12-b-acc" data-act="find">Find skills on this machine</button></div>
    </div>
    <div data-detail>${detailHtml(st)}</div>
    <ul class="h12-legend" aria-label="What the switches mean"><li><i class="h12-sw h12-sw-on"><i></i></i>installed</li><li><i class="h12-sw h12-sw-edited"><i></i></i>edited outside Kiln</li><li><i class="h12-sw h12-sw-found"><i></i></i>found outside library</li><li><i class="h12-sw h12-sw-off"><i></i></i>off</li></ul>
    <p class="h12-context" data-context>${contextHtml(st)}</p>`;
}

// ---------- capture pane ----------

export function capturePane(st: State) {
  const drop = (small: boolean) => `<div class="h12-drop${small ? ' is-small' : ''}" data-dropzone>
    ${small ? '' : `<span class="h12-drop-icon">${ico('capture', 26)}</span>`}
    <p><b>${small ? 'Drop another source anywhere on this window' : 'Drop a link, post, screenshot or file'}</b></p>
    ${small ? '' : `<p class="h12-dim">Kiln reads it and adds prompts, techniques, insights and tools to a collection linked to the source.</p>
    <p class="h12-seg" aria-hidden="true"><span class="is-on">Analyze and add</span><span>Save only</span></p>
    <p class="h12-dim h12-kbds"><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>Space</kbd> captures from anywhere in Windows</p>`}
  </div>`;
  if (!st.source) return `<div class="h12-pane-head"><h3>Capture</h3><p class="h12-dim">Everything you save lands here first.</p></div>${drop(false)}`;
  if (st.source === 'repo') return `<div class="h12-pane-head"><h3>Capture</h3></div>
    <div class="h12-src-line">${ico('repo', 18)}<div><b>mattpocock/skills</b><small>GitHub repository${st.analyzing ? ' · reading the file list…' : ''}</small></div></div>
    ${st.analyzing ? '<div class="h12-progress"><i></i></div>' : `<div class="h12-import">
      <h4>Import this skills repository as drafts</h4>
      <p>Each skill folder under <code>skills/</code> comes in as a draft for you to read, test and approve. The repository stays as it is, and nothing is installed until you approve it.</p>
      <div class="h12-btns"><button type="button" class="h12-b h12-b-acc" data-act="import-repo"${st.imported ? ' disabled' : ''}>${st.imported ? 'Imported as drafts' : 'Import as drafts'}</button></div>
      <p class="h12-dim">Want a prompt to test? Drop the video or the post.</p></div>`}
    ${st.analyzing ? '' : drop(true)}`;
  const p = prompts[st.source];
  return `<div class="h12-pane-head"><h3>Capture</h3>${st.analyzing ? '' : `<p class="h12-dim">Added to <b>${p.collection}</b>, linked to the source</p>`}</div>
    <div class="h12-src-line">${st.source === 'video' ? '<i class="h12-yt-mini" aria-hidden="true"></i>' : '<i class="h12-x-mini" aria-hidden="true">X</i>'}<div><b>${p.from}</b><small>${st.analyzing ? (st.source === 'video' ? 'Distilling captions…' : 'Reading the post…') : p.via}</small></div></div>
    ${st.analyzing ? `<div class="h12-progress"><i></i></div><div class="h12-skel"><i></i><i></i><i></i></div>` : `
    <article class="h12-prompt" data-drag="prompt" data-id="${st.source}" aria-label="Prompt: ${p.title}">
      <header><span class="h12-kind">${ico('star', 13)}Prompt</span>${p.at ? `<span class="h12-ts">${ico('play', 11)}from ${p.at}</span>` : ''}<span class="h12-rev">rev 1</span></header>
      <h4>${p.title}</h4>
      <p>${p.text}</p>
      <button type="button" class="h12-grip h12-grip-win" data-grip>${ico('grip', 15)}<span>Drag onto a repo<span class="h12-or">, or click to test on my-game</span></span></button>
    </article>
    <div class="h12-repos"><span class="h12-dim">Test it on</span><button type="button" class="h12-repo" data-drop="prompt" data-repo="~/code/my-game">${ico('repo', 14)}~/code/my-game</button><button type="button" class="h12-repo" data-drop="prompt" data-repo="an isolated example">${ico('repo', 14)}Isolated example</button></div>
    <ul class="h12-minis">${p.cards.map((card, i) => `<li style="--i:${i}"><span class="h12-mkind">${card.kind}</span><b>${card.title}</b>${card.at ? `<span class="h12-ts">${ico('play', 10)}${card.at}</span>` : ''}</li>`).join('')}</ul>
    ${drop(true)}`}`;
}

// ---------- test pane ----------

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
export function testPane(st: State) {
  if (!st.prompt) return `<div class="h12-pane-head"><h3>Test</h3><p class="h12-dim">Run a prompt on a real repo, read-only.</p></div>
    <div class="h12-drop h12-drop-test" data-drop="prompt" data-repo="~/code/my-game"><span class="h12-drop-icon">${ico('test', 26)}</span><p><b>Nothing running yet</b></p><p class="h12-dim">Drag a prompt from Capture onto a repo, and it runs here.</p></div>`;
  const p = prompts[st.prompt], run = runs[st.prompt], steps = stepsFor(st), shown = steps.slice(0, st.steps);
  const secs = 38 * st.steps + (st.rev === 2 ? 6 : 0), done = st.phase !== 'running';
  const tokens = (k: number) => `${(7.4 * k).toFixed(1)}k in · ${(4.6 * Math.max(0, k - 1)).toFixed(1)}k cached · ${(.6 * k).toFixed(1)}k out`;
  const promptText = st.rev === 2 && run.fix ? p.text.replace(run.fix.before, `<mark>${run.fix.after}</mark>`) : p.text;
  let outcome = '';
  if (st.phase === 'uncertain' && run.fix) outcome = `<div class="h12-verdict is-unsure"><b>Uncertain</b><span>The agent’s own assessment. ${run.unsure}</span></div>
    <p class="h12-dim">Change one line and run it again on the same repo:</p>
    <div class="h12-diff"><p class="h12-del">- ${run.fix.before}</p><p class="h12-add">+ ${run.fix.after}</p></div>
    <div class="h12-btns"><button type="button" class="h12-b h12-b-acc" data-act="rerun">Save as rev 2 and run it</button></div>`;
  if (st.phase === 'pass') outcome = `<div class="h12-verdict is-pass"><b>Pass</b><span>The agent’s assessment. Keeping it is your call.</span></div>
    ${st.rev === 2 && run.fix ? `<p class="h12-lesson">${run.fix.lesson}</p>` : ''}
    <div class="h12-btns"><button type="button" class="h12-b h12-b-acc" data-act="approve">Approve rev ${st.rev} as a skill</button><button type="button" class="h12-b h12-b-quiet" data-act="dismiss">Not yet</button></div>
    <p class="h12-dim h12-small">Approving pins this exact revision and publishes it to your Kiln repository on GitHub.</p>`;
  if (st.phase === 'approved') outcome = `<div class="h12-verdict is-pass"><b>Approved</b><span><code>${p.skill}</code> rev ${st.rev} is on your Skills panel now.</span></div>
    <div class="h12-btns"><button type="button" class="h12-b" data-act="show-skills">Show it on the panel</button></div>`;
  if (st.phase === 'idle') outcome = `<p class="h12-dim">You chose not to keep it. It stays in Capture with its runs.</p>`;
  return `<div class="h12-pane-head"><h3>Test</h3><span class="h12-rev">rev ${st.rev}</span><span class="h12-live${done ? ' is-done' : ''}">${done ? 'finished' : 'running'}</span></div>
    <dl class="h12-ctx">
      <div><dt>Project</dt><dd>${st.repo} <span class="h12-ro">read-only</span></dd></div>
      <div><dt>Agent</dt><dd>Claude Code · your subscription · medium effort</dd></div>
    </dl>
    <p class="h12-run-prompt"><b>${p.title}</b> ${promptText}</p>
    <ol class="h12-log" aria-live="polite">${shown.map(([kind, text], i) => `<li class="${i === shown.length - 1 && !done ? 'is-new' : ''}">${ico(kind, 15)}<span>${text}</span></li>`).join('')}${done ? '' : '<li class="h12-log-wait"><span class="h12-spin" aria-hidden="true"></span><span>Working…</span></li>'}</ol>
    <p class="h12-meter"><span><b>${mmss(secs)}</b> elapsed</span><span>${tokens(Math.max(1, st.steps))}</span><em>sample</em></p>
    ${done ? '<p class="h12-dim h12-small">Finished. Nothing in the repo changed.</p>' : ''}
    <div data-outcome>${outcome}</div>`;
}

// ---------- the window shell ----------

export const viewName: Record<View, string> = { skills: 'Skills', capture: 'Capture', test: 'Test' };
export function windowHtml(st: State, view: View, status: string, live: boolean) {
  const tab = (key: View) => `<button type="button" role="tab" class="h12-tab" id="${live ? `h12-tab-${key}` : ''}" data-tab="${key}" aria-selected="${key === view}" ${live ? `aria-controls="h12-pane-${key}"` : ''} tabindex="${key === view ? 0 : -1}">${ico(key === 'skills' ? 'skills' : key === 'capture' ? 'capture' : 'test', 15)}<span>${viewName[key]}</span></button>`;
  const pane = (key: View, html: string) => `<section class="h12-pane${key === view ? ' is-current' : ''}" data-pane="${key}" ${live ? `id="h12-pane-${key}" role="tabpanel" aria-labelledby="h12-tab-${key}"` : ''}>${html}</section>`;
  return `<div class="h12-titlebar"><span class="h12-app"><i class="h12-logo" aria-hidden="true"></i>Kiln</span><span class="h12-search" aria-hidden="true">Search everything<kbd>Ctrl+Shift+Space</kbd></span><span class="h12-ctl" aria-hidden="true"><i>&#x2013;</i><i>&#x25A1;</i><i>&#x2715;</i></span></div>
    <div class="h12-tabs" role="tablist" aria-label="Kiln views">${tab('skills')}${tab('capture')}${tab('test')}<span class="h12-sample">sample library</span></div>
    <div class="h12-views">${pane('skills', skillsPane(st))}${pane('capture', capturePane(st))}${pane('test', testPane(st))}</div>
    <p class="h12-statusbar"><span data-status ${live ? 'aria-live="polite"' : ''}>${status}</span><span class="h12-git">you/my-kiln · main · synced</span></p>`;
}
