// PROTOTYPE H02: the dark Kiln skills panel. One store, two views: the big panel in problem 1 and the landed row in problem 2.
export type Cell = 'on' | 'off' | 'edited' | 'found';
export type Col = 'claude' | 'agents' | 'copilot' | 'project';
export const columns: { key: Col; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Codex and others', short: 'Codex+', path: '~/.agents/skills' },
  { key: 'copilot', name: 'Copilot', short: 'Copilot', path: '~/.copilot/skills' },
  { key: 'project', name: 'my-game', short: 'Project', path: '.github/skills' },
];
type Diff = { was: string; now: string; why: string };
type Row = { name: string; note: string; rev: number; cells: Record<Col, Cell>; diff?: Partial<Record<Col, Diff>>; fresh?: boolean };
const rows: Row[] = [
  { name: 'code-review', note: '4 copies, one row. rev 3 approved', rev: 3, cells: { claude: 'edited', agents: 'on', copilot: 'off', project: 'on' },
    diff: { claude: { was: '- Review standards and the specification separately.', now: '+ Review the specification only.', why: 'was edited by hand outside Kiln' } } },
  { name: 'research', note: 'rev 2 approved', rev: 2, cells: { claude: 'on', agents: 'off', copilot: 'edited', project: 'off' },
    diff: { copilot: { was: '- Cite every source inline, with a link.', now: '+ List the sources at the end.', why: 'is an older copy' } } },
  { name: 'writing-for-agents', note: 'rev 1 approved', rev: 1, cells: { claude: 'on', agents: 'off', copilot: 'off', project: 'off' } },
  { name: 'playtest-brief', note: 'rev 4 approved', rev: 4, cells: { claude: 'off', agents: 'off', copilot: 'off', project: 'on' } },
  { name: 'pr-summary', note: 'found outside your library', rev: 0, cells: { claude: 'off', agents: 'found', copilot: 'off', project: 'off' } },
];
const said: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'differs from the approved revision', found: 'found outside your library' };

const switchMarkup = (row: Row, column: typeof columns[number]) => {
  const state = row.cells[column.key];
  return `<button type="button" class="h02-switch h02-switch-${state}" role="switch" aria-checked="${state !== 'off'}" data-row="${row.name}" data-col="${column.key}" aria-label="${row.name} in ${column.name} (${column.path}): ${said[state]}"><i></i></button>`;
};
const head = () => `<thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h02-long">${column.name}</span><span class="h02-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>`;

export function panelMarkup() {
  return `<div class="h02-panel h02-win" id="h02-panel" role="region" aria-label="Kiln skills panel, sample library">
    <div class="h02-bar" aria-hidden="true"><span class="h02-bar-mark"></span><b>Kiln</b><span class="h02-bar-crumb">Skills</span><span class="h02-bar-ctl"><i></i><i></i><i></i></span></div>
    <div class="h02-panel-body">
      <ul class="h02-side" aria-hidden="true"><li>Library</li><li class="is-on">Skills</li><li>Tests</li><li>Config files</li></ul>
      <div class="h02-main">
        <div class="h02-main-head"><b>Skills</b><span>Sample library. One switch per place your agents look.</span></div>
        <div class="h02-table-wrap"><table>
          <caption class="visually-hidden">Each switch installs or removes that skill in that location.</caption>
          ${head()}<tbody data-rows></tbody>
        </table></div>
        <div class="h02-compare" data-compare hidden></div>
        <div class="h02-cleanup" data-cleanup data-cell="cleanup">
          <p data-cleanup-text><b>Safe cleanup.</b> <code>old-link</code> in <code>~/.agents/skills</code> links to nothing, and <code>~/.codex/skills</code> is empty.</p>
          <button type="button" class="h02-ui" data-clean>Clean up 2 items</button>
        </div>
        <ul class="h02-legend" aria-label="What the switches mean"><li><i class="h02-dot h02-dot-on"></i>Installed</li><li><i class="h02-dot h02-dot-edited"></i>Differs, edited outside Kiln</li><li><i class="h02-dot h02-dot-found"></i>Found outside your library</li></ul>
        <p class="h02-status" data-status aria-live="polite"><span data-say></span><span class="h02-status-count" data-count></span></p>
      </div>
    </div>
  </div>`;
}

export type Panel = { add(name: string, rev: number): void; mini(el: HTMLElement, name: string): void; say(text: string): void; cells(): HTMLElement[] };

export function bindPanel(root: HTMLElement): Panel {
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const sayEl = status.querySelector<HTMLElement>('[data-say]')!, countEl = status.querySelector<HTMLElement>('[data-count]')!;
  const cleanup = root.querySelector<HTMLElement>('[data-cleanup]')!;
  let minis: { el: HTMLElement; name: string }[] = [];
  const loaded = (key: Col) => rows.filter(row => row.cells[key] !== 'off').length;
  const say = (text: string) => { sayEl.textContent = text; status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const count = () => { countEl.textContent = `Descriptions in context every turn: ${loaded('claude')} from ~/.claude, ${loaded('agents')} from ~/.agents`; };

  const draw = () => {
    body.innerHTML = rows.map(row => `<tr class="${row.fresh ? 'is-fresh' : ''}" data-skill="${row.name}"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column =>
      `<td data-cell="${row.name}:${column.key}">${switchMarkup(row, column)}</td>`).join('')}</tr>`).join('');
    minis.forEach(drawMini);
    count();
  };
  const drawMini = ({ el, name }: { el: HTMLElement; name: string }) => {
    const row = rows.find(item => item.name === name);
    if (!row) return;
    el.innerHTML = `<div class="h02-mini">
      <div class="h02-bar" aria-hidden="true"><span class="h02-bar-mark"></span><b>Kiln</b><span class="h02-bar-crumb">Skills</span></div>
      <div class="h02-table-wrap"><table><caption class="visually-hidden">Where ${row.name} is installed</caption>${head()}
        <tbody><tr class="h02-mini-ghost" aria-hidden="true"><th scope="row" colspan="${columns.length + 1}">${rows.length - 1} other skills, as above</th></tr>
        <tr class="is-fresh"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => `<td>${switchMarkup(row, column)}</td>`).join('')}</tr></tbody>
      </table></div></div>`;
  };

  const flip = (button: HTMLButtonElement) => {
    const row = rows.find(item => item.name === button.dataset.row)!, column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    const inMini = !!button.closest('.h02-mini');
    if (state === 'edited' && row.diff?.[column.key]) {
      const diff = row.diff[column.key]!;
      compare.hidden = false;
      compare.innerHTML = `<p><code>${column.path}/${row.name}</code> ${diff.why}. Installed copy against approved rev ${row.rev}:</p>
        <div class="h02-diff"><p class="h02-del">${diff.was}</p><p class="h02-add">${diff.now}</p></div>
        <div class="h02-actions"><button type="button" class="h02-ui h02-ui-primary" data-fix="replace">Replace with rev ${row.rev}</button><button type="button" class="h02-ui" data-fix="keep">Keep it as draft rev ${row.rev + 1}</button></div>`;
      compare.dataset.row = row.name; compare.dataset.col = column.key;
      say('That copy differs. Compare it first.');
      compare.querySelector<HTMLButtonElement>('button')!.focus();
      return;
    }
    if (state === 'found') {
      row.cells[column.key] = 'on'; row.note = 'draft rev 1, imported. Original untouched'; row.rev = 1;
      say(`Imported ${row.name} as a draft. The folder in ${column.path} stays where it is.`);
    } else {
      row.cells[column.key] = state === 'on' ? 'off' : 'on';
      say(state === 'on' ? `Removed from ${column.path}. Still in your library.` : `Installed rev ${row.rev} into ${column.path}. Receipt saved.`);
    }
    draw();
    const scope = inMini ? minis.find(mini => mini.name === row.name)?.el ?? root : body;
    scope.querySelector<HTMLButtonElement>(`.h02-switch[data-row="${row.name}"][data-col="${column.key}"]`)?.focus();
  };
  root.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button.h02-switch');
    if (button && root.contains(button)) flip(button);
  });
  compare.addEventListener('click', event => {
    const fix = (event.target as Element).closest<HTMLElement>('[data-fix]')?.dataset.fix;
    if (!fix) return;
    const row = rows.find(item => item.name === compare.dataset.row)!, key = compare.dataset.col as Col, path = columns.find(column => column.key === key)!.path;
    if (fix === 'replace') { row.cells[key] = 'on'; say(`Backed up the old copy privately. Installed rev ${row.rev} into ${path}.`); }
    else { row.cells[key] = 'on'; row.note = `rev ${row.rev} approved, draft rev ${row.rev + 1}`; delete row.diff?.[key]; say(`Saved as draft rev ${row.rev + 1}. Rev ${row.rev} stays approved.`); }
    compare.hidden = true;
    draw();
    body.querySelector<HTMLButtonElement>(`[data-row="${row.name}"][data-col="${key}"]`)?.focus();
  });
  cleanup.querySelector('[data-clean]')!.addEventListener('click', () => {
    cleanup.classList.add('is-done');
    cleanup.querySelector('[data-cleanup-text]')!.innerHTML = '<b>Cleaned up.</b> Removed 1 broken link and 1 empty folder. No skill was touched.';
    say('Cleaned up the broken link and the empty folder.');
  });
  draw();
  say('Found 9 skill folders and a broken link in 5 places. That is 5 skills.');
  return {
    say,
    cells: () => [...root.querySelectorAll<HTMLElement>('#h02-panel [data-cell]')],
    add(name, rev) {
      rows.forEach(row => { row.fresh = false; });
      const existing = rows.find(row => row.name === name);
      if (existing) { existing.fresh = true; existing.rev = rev; existing.note = `rev ${rev} approved just now`; }
      else rows.push({ name, note: `rev ${rev} approved just now`, rev, cells: { claude: 'on', agents: 'off', copilot: 'off', project: 'off' }, fresh: true });
      draw();
      say(`${name} rev ${rev} approved and installed into ~/.claude/skills.`);
    },
    mini(el, name) { minis = minis.filter(mini => mini.el !== el); minis.push({ el, name }); drawMini({ el, name }); },
  };
}
