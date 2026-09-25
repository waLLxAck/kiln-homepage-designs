// PROTOTYPE H09: the sample library. Every scribbled folder in the toy box maps to exactly one row on the panel.
import type { Crayon } from './crayon';

export type Loc = 'claude' | 'agents' | 'game';
export const locations: Record<Loc, { name: string; path: string; color: Crayon }> = {
  claude: { name: 'Claude Code', path: '~/.claude/skills', color: 'blue' },
  agents: { name: 'Codex, Copilot and others', path: '~/.agents/skills', color: 'green' },
  game: { name: 'my-game project', path: 'my-game/.github/skills', color: 'orange' },
};

export type Kind = 'on' | 'off' | 'edited' | 'duplicate' | 'stray' | 'broken';
export type Row = { key: string; name: string; loc: Loc; kind: Kind; note: string; fresh?: boolean };
export type PileItem = { key: string; name: string; where: string; color: Crayon; kind: Kind; title: string; explain: string };

export const rows: Row[] = [
  { key: 'cr-claude', name: 'code-review', loc: 'claude', kind: 'edited', note: 'Approved rev 3' },
  { key: 'dup', name: 'code-review (1)', loc: 'claude', kind: 'duplicate', note: 'Not in your library' },
  { key: 'research-claude', name: 'research', loc: 'claude', kind: 'on', note: 'Approved rev 2' },
  { key: 'cr-agents', name: 'code-review', loc: 'agents', kind: 'on', note: 'Approved rev 3' },
  { key: 'stray', name: 'pr-summary', loc: 'agents', kind: 'stray', note: 'Not in your library' },
  { key: 'broken', name: 'old-link', loc: 'agents', kind: 'broken', note: 'Points at a deleted folder' },
  { key: 'playtest-game', name: 'playtest-brief', loc: 'game', kind: 'on', note: 'Approved rev 4' },
  { key: 'cr-game', name: 'code-review', loc: 'game', kind: 'off', note: 'Approved rev 3' },
];

const explain: Record<string, [string, string]> = {
  'cr-claude': ['Edited outside Kiln', 'Somebody changed this copy by hand, so it no longer matches approved rev 3. Its switch is amber. Flip it and Kiln shows the difference, file by file, before anything is replaced.'],
  dup: ['Duplicate', 'A second code-review in the same folder. Your agent reads both descriptions on every turn, whether either one fires or not. Remove it and Kiln moves it to a private backup.'],
  'research-claude': ['Installed', 'Exactly approved rev 2, put there by Kiln. An install receipt records the revision and where it went.'],
  'cr-agents': ['Installed', 'Approved rev 3. Codex, Copilot and others all read ~/.agents/skills, so this one copy serves every one of them.'],
  stray: ['Found outside your library', 'Kiln didn\'t put it there and has no record of it. Import it as a draft to review; the original folder stays exactly where it is.'],
  broken: ['Broken link', 'It points at a folder that no longer exists. Kiln offers to clean up broken links and empty folders, and leaves everything else alone.'],
  'playtest-game': ['Installed in one project', 'Only sessions inside my-game see it. Your other projects never load its description.'],
};

export const pile: PileItem[] = rows.filter(row => explain[row.key]).map(row => ({
  key: row.key, name: row.name, where: locations[row.loc].path, color: locations[row.loc].color, kind: row.kind, title: explain[row.key][0], explain: explain[row.key][1],
}));
