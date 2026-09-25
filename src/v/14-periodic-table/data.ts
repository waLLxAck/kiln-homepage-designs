// PROTOTYPE 11 data: a sample library laid out as a periodic table. Every number here is illustrative.
export type Kind = 'prompt' | 'skill' | 'technique' | 'insight' | 'tool' | 'agent' | 'found';
export type Status = 'approved' | 'draft' | 'review' | 'saved' | 'found';
export type Loc = 'claude' | 'agents' | 'codex' | 'github';
export type CopyState = 'installed' | 'identical' | 'differs' | 'linked' | 'drift' | 'broken' | 'empty';
export type Install = { loc: Loc; path: string; state: CopyState };
export type Element = {
  n: number; sym: string; name: string; kind: Kind; status: Status; row: number; col: number;
  installs: Install[]; rev: number; approved: number | null; source: string; weight: number; run?: 'pass' | 'fail' | 'uncertain';
};

export const kinds: { key: Kind; label: string; plural: string; note: string }[] = [
  { key: 'prompt', label: 'Prompt', plural: 'Prompts', note: 'Reactive. Most plentiful. Worth testing before they turn into anything else.' },
  { key: 'skill', label: 'Skill', plural: 'Skills', note: 'The working metals. Installed into agent locations, where their descriptions load every turn.' },
  { key: 'technique', label: 'Technique', plural: 'Techniques', note: 'Ways of working you distilled from a talk, a post or a run.' },
  { key: 'insight', label: 'Insight', plural: 'Insights', note: 'Things you learned, kept with the source that taught you.' },
  { key: 'tool', label: 'Tool', plural: 'Tools', note: 'Programs and resources worth remembering.' },
  { key: 'agent', label: 'Agent definition', plural: 'Agent definitions', note: 'Noble and stable: custom agents in native Codex, Claude Code and Copilot formats.' },
];

export const statuses: { key: Status; label: string }[] = [
  { key: 'approved', label: 'Approved' },
  { key: 'draft', label: 'Draft' },
  { key: 'review', label: 'Needs review' },
];

export const locations: { key: Loc | 'none'; label: string }[] = [
  { key: 'claude', label: '~/.claude' },
  { key: 'agents', label: '~/.agents' },
  { key: 'codex', label: '~/.codex' },
  { key: 'github', label: 'Project .github' },
  { key: 'none', label: 'Library only' },
];

export const copyStates: { key: CopyState; label: string }[] = [
  { key: 'installed', label: 'Installed' },
  { key: 'identical', label: 'Identical copy found' },
  { key: 'differs', label: 'Differs' },
  { key: 'linked', label: 'Linked' },
  { key: 'drift', label: 'Edited outside Kiln' },
];

export const stateLabel: Record<CopyState, string> = { installed: 'Installed', identical: 'Identical copy found', differs: 'Differs', linked: 'Linked', drift: 'Edited outside Kiln', broken: 'Broken link', empty: 'Empty folder' };

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const pathFor = (kind: Kind, loc: Loc, name: string) => {
  const s = slug(name.replace(/\(.*\)/, ''));
  if (kind === 'agent') return loc === 'claude' ? `~/.claude/agents/${s}.md` : loc === 'codex' ? `~/.codex/agents/${s}.toml` : `game/.github/agents/${s}.agent.md`;
  return loc === 'github' ? `game/.github/skills/${s}` : `~/.${loc}/skills/${s}`;
};

type Seed = [sym: string, name: string, status: Status, installs: string, rev: number, approved: number | null, source: string, weight: number, run?: 'pass' | 'fail' | 'uncertain'];

const seeds: Record<Exclude<Kind, 'found'>, Seed[]> = {
  prompt: [
    ['Sy', 'Seven-year-old', 'draft', '', 2, null, 'Distilled from a YouTube talk. The timestamped source link and transcript stay attached.', 0, 'pass'],
    ['Iw', 'Instruction gone wrong', 'draft', '', 1, null, 'Distilled from an agent workflow video.', 0, 'uncertain'],
    ['Pt', 'Playtest', 'draft', '', 3, null, 'A saved prompt, rewritten twice after test runs.', 0, 'pass'],
    ['Rb', 'Repo briefing', 'draft', '', 1, null, 'Captured from a post on X with Analyze and add.', 0],
    ['Rk', 'Risk-first plan', 'draft', '', 1, null, 'Analyze and add, from a pasted article.', 0],
    ['Nh', 'New-hire explainer', 'draft', '', 2, null, 'Written in Kiln from a note.', 0, 'pass'],
    ['Sq', 'Slow query hunt', 'draft', '', 1, null, 'Captured from a screenshot of a thread.', 0, 'fail'],
    ['Pc', 'Plain changelog', 'draft', '', 1, null, 'Saved only. Not sent to a model yet.', 0],
    ['Ec', 'Error copy audit', 'draft', '', 1, null, 'Captured with Ctrl+N from a bookmark.', 0],
  ],
  skill: [
    ['Cr', 'Code review', 'review', 'claude:drift agents:installed github:installed', 3, 2, 'Imported from ~/.claude/skills as a draft. The original folder stayed where it was.', 118],
    ['Re', 'Research', 'approved', 'claude:installed agents:identical', 4, 4, 'Imported from an existing skills repository.', 96],
    ['Wa', 'Writing for agents', 'approved', 'agents:installed claude:linked', 2, 2, 'Drafted with Create skill from a note.', 164],
    ['Ps', 'PR summary', 'approved', 'codex:installed', 1, 1, 'Drafted with Create skill from the Repo briefing prompt.', 72],
    ['Tp', 'Test planner', 'draft', '', 1, null, 'Drafted with Create skill from a screenshot.', 0],
    ['Rn', 'Release notes', 'approved', 'agents:installed', 2, 2, 'Imported from ~/.agents/skills as a draft.', 81],
    ['Dt', 'Debug trace', 'review', 'claude:installed', 5, 4, 'Imported from ~/.claude/skills as a draft.', 133],
    ['Mg', 'Migration check', 'approved', 'github:installed', 1, 1, 'Drafted with Create skill from a prompt.', 90],
    ['Ax', 'A11y pass', 'draft', '', 2, null, 'Distilled from a conference talk.', 0],
    ['Da', 'Deps audit', 'approved', 'claude:differs agents:installed', 2, 2, 'Imported from a skills repository.', 104],
    ['Rs', 'Refactor safely', 'approved', 'claude:identical agents:installed', 3, 3, 'Imported from ~/.agents/skills as a draft.', 97],
    ['Cm', 'Commit messages', 'approved', 'claude:installed agents:installed codex:installed', 1, 1, 'Imported three times over from three folders, now one library entry.', 58],
    ['Dr', 'Design review', 'draft', '', 1, null, 'Drafted with Create skill from an image.', 0],
    ['Pf', 'Perf profile', 'approved', 'agents:drift', 2, 2, 'Imported from ~/.agents/skills as a draft.', 121],
    ['Sc', 'Security check', 'review', 'agents:installed github:installed', 3, 2, 'Imported from a skills repository.', 149],
    ['Dx', 'Docs sync', 'approved', 'claude:linked', 1, 1, 'Drafted with Create skill from a prompt.', 66],
    ['Lg', 'Log reader', 'draft', '', 1, null, 'Imported from ~/.codex/skills as a draft.', 0],
    ['Uc', 'UI copy edit', 'approved', 'claude:installed', 2, 2, 'Drafted with Create skill from a note.', 74],
    ['Gp', 'Game playtest', 'approved', 'github:installed', 2, 2, 'Drafted with Create skill from the Playtest prompt after three runs.', 112],
    ['Us', 'Usability check', 'approved', 'claude:installed github:installed', 2, 2, 'Drafted with Create skill from the Seven-year-old prompt.', 101],
  ],
  technique: [
    ['Pm', 'Project memory', 'saved', '', 1, null, 'Keep project memory specific. Distilled from a video, with the timestamp.', 0],
    ['Ex', 'Examples over rules', 'saved', '', 1, null, 'Analyze and add, from a blog post.', 0],
    ['Dn', 'Define done', 'saved', '', 1, null, 'Written after a test run came back uncertain.', 0],
    ['Rf', 'Read first', 'saved', '', 1, null, 'Distilled from a YouTube talk.', 0],
    ['Ss', 'Smallest step', 'saved', '', 1, null, 'Captured from a screenshot.', 0],
    ['Af', 'Ask first', 'saved', '', 1, null, 'Written in Kiln.', 0],
    ['Ck', 'Checklist last', 'saved', '', 1, null, 'Analyze and add, from a pasted thread.', 0],
    ['Nf', 'Name the failure', 'saved', '', 1, null, 'Distilled from an agent workflow video.', 0],
  ],
  insight: [
    ['Vc', 'Variety is choice', 'saved', '', 1, null, 'Judge variety by player decisions. From a game design talk.', 0],
    ['Cb', 'Context is a budget', 'saved', '', 1, null, 'From the bundled writing-for-agents guidance.', 0],
    ['Tw', 'Trigger words', 'saved', '', 1, null, 'A skill fires on its description. Learned from a run that never triggered.', 0],
    ['Fw', 'Fewer skills', 'saved', '', 1, null, 'Written after removing duplicate copies.', 0],
    ['Dv', 'Diff over vibe', 'saved', '', 1, null, 'Review the diff between revisions, not the feeling.', 0],
    ['Un', 'Uncertain is OK', 'saved', '', 1, null, 'From an experiment that needed edits it could not make.', 0],
    ['Ob', 'Obstacles first', 'saved', '', 1, null, 'From the Seven-year-old test output.', 0],
    ['Wy', 'Keep the why', 'saved', '', 1, null, 'Sources keep their explanation. From a distilled video.', 0],
  ],
  tool: [
    ['Gh', 'gh CLI', 'saved', '', 1, null, 'Saved as a tool. Kiln uses it to set up your library repository.', 0],
    ['Rg', 'ripgrep', 'saved', '', 1, null, 'Saved from a post on X.', 0],
    ['Pw', 'Playwright', 'saved', '', 1, null, 'Pulled out of a video by Distill video.', 0],
    ['Jq', 'jq', 'saved', '', 1, null, 'Saved as a resource with the Kiln CLI JSON output in mind.', 0],
  ],
  agent: [
    ['Rv', 'Reviewer', 'approved', 'claude:installed', 2, 2, 'Imported from ~/.claude/agents. Claude Code format.', 88],
    ['Pl', 'Planner', 'draft', '', 1, null, 'Written in Kiln. Codex format.', 0],
    ['Qa', 'QA tester', 'approved', 'github:installed', 1, 1, 'Imported from a project. Copilot format.', 79],
    ['Dw', 'Docs writer', 'review', 'claude:drift', 3, 2, 'Imported from ~/.claude/agents. Claude Code format.', 92],
    ['Tr', 'Triage', 'approved', 'codex:installed', 1, 1, 'Written in Kiln. Codex format.', 70],
  ],
};

const layout: number[][] = [[1, 18], [1, 2, 13, 14, 15, 16, 17, 18], [1, 2, 13, 14, 15, 16, 17, 18], Array.from({ length: 18 }, (_, i) => i + 1), Array.from({ length: 18 }, (_, i) => i + 1)];
const kindOfColumn = (col: number): Exclude<Kind, 'found'> => col <= 2 ? 'prompt' : col <= 12 ? 'skill' : col <= 14 ? 'technique' : col <= 16 ? 'insight' : col === 17 ? 'tool' : 'agent';

const build = (seed: Seed, kind: Kind, n: number, row: number, col: number): Element => {
  const [sym, name, status, installs, rev, approved, source, weight, run] = seed;
  return {
    n, sym, name, kind, status, row, col, rev, approved, source, weight, run,
    installs: installs ? installs.split(' ').map(pair => { const [loc, state] = pair.split(':') as [Loc, CopyState]; return { loc, state, path: pathFor(kind, loc, name) }; }) : [],
  };
};

const cursor: Record<string, number> = {};
let n = 0;
export const elements: Element[] = layout.flatMap((cols, r) => cols.map(col => {
  const kind = kindOfColumn(col);
  const seed = seeds[kind][cursor[kind] = (cursor[kind] ?? -1) + 1];
  return build(seed, kind, ++n, r + 1, col);
}));

const foundSeeds: [string, string, Loc, CopyState, string][] = [
  ['C1', 'code-review (1)', 'claude', 'identical', 'A copy of Code review. Identical to revision 2.'],
  ['Co', 'code-review-old', 'agents', 'differs', 'An older Code review. Differs from every revision.'],
  ['Sk', 'SKILL - Copy', 'claude', 'differs', 'A stray SKILL.md copy inside a skill folder.'],
  ['Bl', 'research (link)', 'claude', 'broken', 'A link whose target folder no longer exists.'],
  ['Ns', 'new-skill', 'agents', 'empty', 'An empty folder from an idea you never finished.'],
  ['Pr', 'pr-review', 'codex', 'installed', 'A skill in ~/.codex/skills that the library has never seen.'],
  ['Hx', 'helper', 'github', 'installed', 'A project skill nobody remembers adding.'],
];
export const found: Element[] = foundSeeds.map(([sym, name, loc, state, source], i) => ({
  n: 55 + i, sym, name, kind: 'found', status: 'found', row: 7, col: 3 + i, rev: 0, approved: null, source, weight: state === 'broken' || state === 'empty' ? 0 : 60 + ((i * 37) % 70),
  installs: [{ loc, state, path: loc === 'github' ? `game/.github/skills/${name}` : `~/.${loc}/skills/${name}` }],
}));
