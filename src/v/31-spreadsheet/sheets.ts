// PROTOTYPE 28: sheet data. Each sheet is rows of cells placed by column letter; mobile shows a subset of columns.
import { examples, installer, releaseNote, windowsMark } from '../../content';

export type Cell = { c: string; s?: number; html: string; cls?: string; id?: string; note?: string; full?: boolean; m?: [number, number] | false };
export type Row = { cells: Cell[]; cls?: string };
export type Sheet = { key: string; label: string; cols: string; mcols: string; mletters: string[]; name: string; formula: string; status: string; rows: Row[] };

const c = (letter: string, span: number, html: string, extra: Partial<Cell> = {}): Cell => ({ c: letter, s: span, html, ...extra });
const full = (letter: string, span: number, html: string, extra: Partial<Cell> = {}): Cell => c(letter, span, html, { full: true, ...extra });
const tag = (text: string, tone: string) => `<span class="v28-cf is-${tone}">${text}</span>`;
const heading = (text: string, level = 2) => ({ cls: 'v28-row-heading', cells: [full('A', 8, `<h${level}>${text}</h${level}>`)] });
const blank = (): Row => ({ cls: 'v28-row-blank', cells: [] });
const cta = (): Row => ({
  cls: 'v28-row-cta',
  cells: [
    full('A', 3, `<a class="v28-download" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>`),
    full('D', 5, `<p>${releaseNote} Uses your signed-in Codex or Claude Code: no API key and no extra API bill, though your subscription’s usage limits still apply. Builds are unsigned.</p>`, { cls: 'v28-muted' }),
  ],
});
const header = (cells: [string, number, string, string?][]): Row => ({ cls: 'v28-row-header', cells: cells.map(([letter, span, text, note]) => c(letter, span, text, note ? { note } : {})) });

const playtest = examples[2];

export const sheets: Sheet[] = [
  {
    key: 'library', label: 'Library', name: 'A1', formula: '', status: 'Count: 7 rows. Figures marked “sample” are illustrative.',
    cols: '118px minmax(220px, 2.3fr) 84px minmax(128px, 1.05fr) 108px 128px 120px minmax(120px, 1fr)',
    mcols: 'minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, .85fr)', mletters: ['B', 'D', 'E'],
    rows: [
      { cls: 'v28-row-hero', cells: [
        full('A', 6, `<h1>You’d never keep your finances in random folders.</h1>`, { id: 'v28-A1' }),
        full('G', 2, `<p class="v28-comment-pinned v28-comment-hero"><b>Comment</b>Watch row 4. The formula bar is testing a saved prompt on a real repository, read-only. Then you approve it and install it.</p>`, { cls: 'v28-hero-note', m: false }),
      ] },
      { cls: 'v28-row-lede', cells: [
        full('A', 5, `<p>So why do your prompts and skills live in six of them? Kiln is a Windows app that keeps them in one library, shows every installed copy, and tests any row on your own repository through Codex or Claude Code.</p>`),
        full('F', 3, `<a class="v28-download" href="${installer}">${windowsMark}<span>Download for Windows</span></a><small>Release 0.17.0, from a private GitHub repository: sign in with an account that has access.</small>`, { cls: 'v28-cta-cell' }),
      ] },
      header([['A', 1, 'Kind'], ['B', 1, 'Name'], ['C', 1, 'Revision'], ['D', 1, 'Test run'], ['E', 1, 'Agent says'], ['F', 1, 'You decide', 'The agent’s assessment and your judgement are kept apart. Only you approve.'], ['G', 1, 'Tokens <i>(sample)</i>', 'Illustrative numbers. Kiln shows token usage for every test run (input, cached, output). It does not compute a per-skill token cost.'], ['H', 1, 'Installed']]),
      { cls: 'v28-row-data is-target', cells: [
        c('A', 1, tag('Prompt', 'kind')), c('B', 1, playtest.title, { id: 'v28-B4' }), c('C', 1, 'rev 2', { cls: 'v28-num' }),
        c('D', 1, '', { id: 'v28-D4' }), c('E', 1, '', { id: 'v28-E4' }), c('F', 1, '', { id: 'v28-F4' }), c('G', 1, '', { id: 'v28-G4', cls: 'v28-num' }), c('H', 1, '', { id: 'v28-H4' }),
      ] },
      { cls: 'v28-row-data', cells: [c('A', 1, tag('Skill', 'kind')), c('B', 1, 'Code review'), c('C', 1, 'rev 4', { cls: 'v28-num' }), c('D', 1, 'Done, 2 min 10 s'), c('E', 1, tag('pass', 'good')), c('F', 1, tag('Approved rev 4', 'good')), c('G', 1, '<span class="v28-bar" style="--w:27%"></span>12,904', { cls: 'v28-num' }), c('H', 1, tag('Edited outside Kiln', 'warn'), { note: 'Drift: the copy in ~/.claude/skills was changed by hand. Compare it file by file with the approved revision.' })] },
      { cls: 'v28-row-data', cells: [c('A', 1, tag('Prompt', 'kind')), c('B', 1, examples[1].title), c('C', 1, 'rev 2', { cls: 'v28-num' }), c('D', 1, 'Done, 3 min 48 s'), c('E', 1, tag('uncertain', 'warn'), { note: 'Tasks that need edits or unavailable tools come back as uncertain rather than faked successes.' }), c('F', 1, tag('Revise', 'plain')), c('G', 1, '<span class="v28-bar" style="--w:100%"></span>52,410', { cls: 'v28-num' }), c('H', 1, '—', { cls: 'v28-dim' })] },
      { cls: 'v28-row-data', cells: [c('A', 1, tag('Skill', 'kind')), c('B', 1, 'Research'), c('C', 1, 'rev 1', { cls: 'v28-num' }), c('D', 1, 'Not run', { cls: 'v28-dim' }), c('E', 1, '—', { cls: 'v28-dim' }), c('F', 1, tag('Draft', 'plain')), c('G', 1, '—', { cls: 'v28-num v28-dim' }), c('H', 1, tag('Copy differs', 'warn'))] },
      { cls: 'v28-row-data', cells: [c('A', 1, tag('Agent', 'kind')), c('B', 1, 'Reviewer <span class="v28-dim">(Claude Code agent)</span>'), c('C', 1, 'rev 3', { cls: 'v28-num' }), c('D', 1, 'Done, 1 min 02 s'), c('E', 1, tag('pass', 'good')), c('F', 1, tag('Approved rev 3', 'good')), c('G', 1, '<span class="v28-bar" style="--w:15%"></span>7,730', { cls: 'v28-num' }), c('H', 1, tag('Installed', 'good'))] },
      { cls: 'v28-row-data', cells: [c('A', 1, tag('Prompt', 'kind')), c('B', 1, examples[0].title), c('C', 1, 'rev 1', { cls: 'v28-num' }), c('D', 1, 'Not run', { cls: 'v28-dim' }), c('E', 1, '—', { cls: 'v28-dim' }), c('F', 1, '—', { cls: 'v28-dim' }), c('G', 1, '—', { cls: 'v28-num v28-dim' }), c('H', 1, '—', { cls: 'v28-dim' })] },
      { cls: 'v28-row-data', cells: [c('A', 1, tag('Skill', 'kind')), c('B', 1, 'code-review <span class="v28-dim">(copy)</span>'), c('C', 1, '—', { cls: 'v28-num v28-dim' }), c('D', 1, '—', { cls: 'v28-dim' }), c('E', 1, '—', { cls: 'v28-dim' }), c('F', 1, '—', { cls: 'v28-dim' }), c('G', 1, '—', { cls: 'v28-num v28-dim' }), c('H', 1, tag('Identical copy found', 'info'))] },
      { cls: 'v28-row-mobile-card', cells: [full('A', 8, `<dl class="v28-card" aria-label="Row 4, all columns"><div><dt>A4 Kind</dt><dd>Prompt</dd></div><div><dt>C4 Revision</dt><dd>rev 2</dd></div><div><dt>F4 You decide</dt><dd data-mirror="v28-F4">—</dd></div><div><dt>G4 Tokens (sample)</dt><dd data-mirror="v28-G4">—</dd></div><div><dt>H4 Installed</dt><dd data-mirror="v28-H4">—</dd></div></dl>`)] },
      blank(),
      heading('Where your skills live today'),
      { cls: 'v28-row-prose', cells: [
        full('A', 5, `<p>Folders in <code>~/.claude/skills</code>, <code>~/.agents/skills</code> (shared by Codex, Copilot and others), <code>.codex/skills</code>, <code>.copilot/skills</code> and every project’s <code>.github/skills</code>. Plus the prompts buried in chats, notes and bookmarks.</p><p>“Find skills and agents not in the library” scans those locations. Import installed skills, or a whole skills repository, as drafts; the originals stay where they are. Kiln also offers a safe cleanup of broken links and empty folders.</p>`),
        full('F', 3, `<ul class="v28-kinds" aria-label="What a library row can be"><li>Prompts</li><li>Skills</li><li>Custom agents <span>in native Codex, Claude Code and Copilot formats</span></li><li>Source notes, insights, techniques, tools, resources</li></ul>`, { cls: 'v28-range' }),
      ] },
      heading('A shorter sheet is a lighter context'),
      { cls: 'v28-row-prose', cells: [
        full('A', 5, `<p>Every model-invoked skill’s description sits in your agent’s context on every turn, so forgotten, duplicate and stale skills spend tokens and attention whether or not they fire. Kiln shows exactly what is installed where, so you can remove what you don’t use and keep what earns its place.</p><p>Collections, tags, favorites, search and filters by kind, status, provider, location, copy state and scope. Select in bulk with Ctrl-click, Shift-click or Ctrl+A. Archive, trash, restore and undo.</p>`),
        full('F', 3, `<p class="v28-comment-pinned"><b>Comment</b>Kiln doesn’t measure a per-skill token cost. The token column above is a sample; real token counts come from each test run.</p>`),
      ] },
      heading('Test any row, right now'),
      { cls: 'v28-row-prose', cells: [
        full('A', 5, `<p>Pick a local project or repository, or an isolated example, and run the exact revision through Codex or Claude Code. You watch it live, it stays read-only, and the output and the agent’s pass, fail or uncertain are saved against that revision.</p>`),
        full('F', 3, `<button type="button" class="v28-jump" data-go="tests">Open the Tests sheet</button>`),
      ] },
      heading('Approve a revision, then install it'),
      { cls: 'v28-row-prose', cells: [
        full('A', 5, `<p>Approval pins an exact revision and commits it to your own Kiln GitHub repository. Editing creates a new draft and never replaces the approved one; installs always use approved content. On another machine, open the repository and press “Install everything marked for this machine”.</p>`),
        full('F', 3, `<button type="button" class="v28-jump" data-go="installs">Open the Installs sheet</button>`),
      ] },
      blank(),
      cta(),
    ],
  },
  {
    key: 'tests', label: 'Tests', name: 'D4', formula: '=TEST(B4, "./my-game")', status: 'Run on revision 2. Read-only. Sample figures.',
    cols: '92px 150px repeat(6, minmax(0, 1fr))', mcols: '52px 96px minmax(0, 1fr)', mletters: ['A', 'B', 'C'],
    rows: [
      heading('One row, one run, on your own code', 1),
      { cls: 'v28-row-prose', cells: [full('A', 8, `<p>Choose a repository and Kiln runs the exact prompt revision through the Codex or Claude Code you already use. Experiments are read-only, so nothing in your code changes. Up to two runs at once; cancel or retry either.</p>`)] },
      header([['A', 1, 'Elapsed'], ['B', 1, 'Event'], ['C', 6, 'Detail <i>(sample run)</i>']]),
      ...([
        ['0:00', 'Started', 'Revision 2 of “Playtest for what kills the fun” on <code>./my-game</code>, read-only. Claude Code, reasoning effort medium.'],
        ['0:04', 'Reasoning', 'Mapping the game loop and the level files before playing anything.'],
        ['0:09', 'Command', '<code>rg --files src/levels</code>'],
        ['0:31', 'Command', '<code>cat src/levels/level-02.ts</code>'],
        ['1:12', 'Web search', 'difficulty spikes in early platformer levels'],
        ['2:40', 'Message', 'Ranked ten improvements. First: level 2 spawns enemies before the player can move.'],
        ['3:51', 'Finished', 'Output and assessment saved against revision 2.'],
      ] as const).map(([time, kind, detail]) => ({ cls: 'v28-row-data', cells: [c('A', 1, time, { cls: 'v28-num' }), c('B', 1, tag(kind, kind === 'Finished' ? 'good' : 'kind')), c('C', 6, detail)] })),
      header([['A', 2, 'Input tokens', 'Every run shows its token usage, model and reasoning effort. These are sample figures.'], ['C', 2, 'Cached'], ['E', 2, 'Output'], ['G', 2, 'Agent says']]),
      { cls: 'v28-row-data v28-row-totals', cells: [c('A', 2, '41,380', { cls: 'v28-num', m: [1, 2] }), c('C', 2, '28,900', { cls: 'v28-num', m: [3, 1] }), c('E', 2, '2,614', { cls: 'v28-num', m: false }), c('G', 2, tag('pass', 'good'), { m: false })] },
      blank(),
      heading('The agent’s word, and yours'),
      { cls: 'v28-row-prose', cells: [
        full('A', 4, `<p>The agent returns pass, fail or uncertain. When a task needs edits or a tool it can’t use, it says uncertain rather than faking success. That assessment sits in its own column; your judgement sits in another, and only yours approves anything.</p>`),
        full('E', 4, `<figure class="v28-b4"><figcaption>B4 <span>${playtest.source}</span></figcaption><blockquote>${playtest.prompt}</blockquote></figure>`),
      ] },
      heading('Change a cell, run it again'),
      header([['A', 2, 'Revision'], ['C', 4, 'Change'], ['G', 2, 'Result <i>(sample)</i>']]),
      { cls: 'v28-row-data', cells: [c('A', 2, 'rev 1', { cls: 'v28-num', m: [1, 1] }), c('C', 4, 'Find bugs, annoyances and things that take away the fun.', { m: [2, 2] }), c('G', 2, tag('uncertain', 'warn'), { m: false })] },
      { cls: 'v28-row-data', cells: [c('A', 2, 'rev 2', { cls: 'v28-num', m: [1, 1] }), c('C', 4, '<ins>+ Rank the ten most impactful improvements. Make no changes.</ins>', { m: [2, 2] }), c('G', 2, tag('pass', 'good'), { m: false })] },
      { cls: 'v28-row-prose', cells: [full('A', 8, `<p>Compare revisions and their diffs, run again on the same repository, and see what changed the result. That’s how prompting gets learned: by doing it on real code. “Ask the agent” discusses an item with its attachments and source video, and “Create skill” drafts a SKILL.md from a prompt that proved itself.</p>`)] },
      blank(),
      cta(),
    ],
  },
  {
    key: 'installs', label: 'Installs', name: 'C4', formula: '=FILTER(Installs, state = "Edited outside Kiln")', status: 'Sample machine. One copy has drifted.',
    cols: '170px repeat(5, minmax(0, 1fr)) 90px 110px', mcols: '104px repeat(3, minmax(0, 1fr))', mletters: ['A', 'B', 'C', 'D'],
    rows: [
      heading('Every copy, and whether it drifted', 1),
      { cls: 'v28-row-prose', cells: [full('A', 8, `<p>For each skill, Kiln shows every installed copy across your personal locations and enrolled projects, and whether it matches the approved revision. Install receipts record the revision and destination.</p>`)] },
      header([['A', 1, 'Skill'], ['B', 1, '<code>~/.claude/skills</code>'], ['C', 1, '<code>~/.agents/skills</code>'], ['D', 1, '<code>my-game/.github</code>'], ['E', 1, '<code>.codex/skills</code>'], ['F', 1, '<code>.copilot/skills</code>'], ['G', 1, 'Receipt'], ['H', 1, '']]),
      ...([
        ['code-review', ['Installed', 'Edited outside Kiln', 'Installed', '', ''], 'rev 4', 'Compare'],
        ['playtest', ['Installed', 'Installed', 'Installed', '', ''], 'rev 2', ''],
        ['research', ['Copy differs', 'Identical copy', '', '', ''], 'rev 1', 'Compare'],
        ['writing-for-agents', ['Linked', '', '', 'Installed', ''], 'rev 3', ''],
        ['old-helper', ['', 'Identical copy', '', '', 'Identical copy'], '—', 'Remove'],
      ] as const).map(([name, states, receipt, action]) => ({
        cls: 'v28-row-data',
        cells: [
          c('A', 1, `<code>${name}</code>`),
          ...states.map((state, i) => c('BCDEF'[i], 1, state ? tag(state, state === 'Installed' ? 'good' : state === 'Linked' ? 'plain' : state.startsWith('Identical') ? 'info' : 'warn') : '<span class="v28-dim">—</span>')),
          c('G', 1, receipt, { cls: 'v28-num' }),
          c('H', 1, action ? `<span class="v28-link">${action}</span>` : ''),
        ],
      })),
      blank(),
      heading('Tidy it without losing anything'),
      { cls: 'v28-row-prose', cells: [
        full('A', 4, `<p>Compare an installed copy file by file with the approved version. Remove local copies in bulk: copies Kiln manages are deleted, anything else is moved to a private backup first.</p>`),
        full('E', 4, `<p>On another machine, open your Kiln repository and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>. Git status, sync and conflict resolution are built in.</p>`),
      ] },
      blank(),
      cta(),
    ],
  },
  {
    key: 'config', label: 'Config', name: 'A4', formula: '=VALIDATE(A4:A12)', status: 'Edits happen in the real file. 30 private backups each.',
    cols: '210px 110px 110px 110px repeat(2, minmax(0, 1fr)) repeat(2, minmax(0, 1fr))', mcols: '1.5fr .8fr .8fr', mletters: ['A', 'B', 'C'],
    rows: [
      heading('The files that steer your agents, on one sheet', 1),
      { cls: 'v28-row-prose', cells: [full('A', 8, `<p>Open personal and project config files in one place and edit the actual file, with syntax validation, a diff before you restore, and a warning when the file changed on disk while you were editing. Kiln never executes hooks.</p>`)] },
      header([['A', 1, 'File'], ['B', 1, 'Scope'], ['C', 1, 'Syntax'], ['D', 1, 'Backups <i>(sample)</i>'], ['E', 4, 'Note']]),
      ...([
        ['CLAUDE.md', 'Project', 'Valid', '12 of 30', 'Project memory for Claude Code.'],
        ['AGENTS.md', 'Project', 'Valid', '7 of 30', 'Instructions shared by Codex and others.'],
        ['~/.codex/config.toml', 'Personal', 'Valid', '30 of 30', 'Oldest backup rotates out.'],
        ['~/.codex/hooks.json', 'Personal', 'Valid', '4 of 30', 'Edited and validated. Never executed.'],
        ['~/.claude/settings.json', 'Personal', 'Error, line 9', '9 of 30', 'Trailing comma. Nothing saved until it parses.'],
        ['.mcp.json', 'Project', 'Valid', '2 of 30', 'MCP servers and permissions.'],
        ['.vscode/settings.json', 'Project', 'Valid', '5 of 30', 'Copilot and editor settings.'],
        ['PowerShell profile', 'Personal', 'Changed on disk', '3 of 30', 'Stale edit detected: compare before you save.'],
      ] as const).map(([file, scope, syntax, backups, note]) => ({
        cls: 'v28-row-data',
        cells: [c('A', 1, `<code>${file}</code>`), c('B', 1, scope), c('C', 1, tag(syntax, syntax === 'Valid' ? 'good' : syntax.startsWith('Error') ? 'bad' : 'warn')), c('D', 1, backups, { cls: 'v28-num' }), c('E', 4, note)],
      })),
      blank(),
      cta(),
    ],
  },
];
