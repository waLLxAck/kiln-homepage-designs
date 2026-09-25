// PROTOTYPE H10: the crisp Kiln window that lives on the laptop screen and becomes the page's panel section.
// Windows 11 flavour: title bar, navigation rail, cards of rows with toggle switches, a details pane.

type Loc = 'claude' | 'agents' | 'game';
type Kind = 'on' | 'off' | 'edited' | 'duplicate' | 'stray' | 'broken' | 'draft';
type Row = { key: string; name: string; loc: Loc; kind: Kind; note: string; filed: boolean; paper: boolean };

const locations: Record<Loc, { name: string; path: string }> = {
  claude: { name: 'Claude Code', path: '~/.claude/skills' },
  agents: { name: 'Codex, Copilot and others', path: '~/.agents/skills' },
  game: { name: 'my-game', path: 'my-game/.github/skills' },
};
const rows: Row[] = [
  { key: 'cr-claude', name: 'code-review', loc: 'claude', kind: 'edited', note: 'Approved rev 3', filed: false, paper: true },
  { key: 'dup', name: 'code-review (1)', loc: 'claude', kind: 'duplicate', note: 'Not in your library', filed: false, paper: true },
  { key: 'research-claude', name: 'research', loc: 'claude', kind: 'on', note: 'Approved rev 2', filed: false, paper: true },
  { key: 'cr-agents', name: 'code-review', loc: 'agents', kind: 'on', note: 'Approved rev 3', filed: false, paper: true },
  { key: 'stray', name: 'pr-summary', loc: 'agents', kind: 'stray', note: 'Not in your library', filed: false, paper: true },
  { key: 'broken', name: 'old-link', loc: 'agents', kind: 'broken', note: 'Link to a deleted folder', filed: false, paper: true },
  { key: 'playtest-game', name: 'playtest-brief', loc: 'game', kind: 'on', note: 'Approved rev 4', filed: false, paper: true },
  { key: 'cr-game', name: 'code-review', loc: 'game', kind: 'off', note: 'Approved rev 3', filed: true, paper: false },
];
const stateText: Record<Kind, string> = { on: 'Installed', off: 'Off', edited: 'Edited outside Kiln', duplicate: 'Duplicate', stray: 'Not in your library', broken: 'Broken link', draft: 'Draft, identical copy' };
const details: Record<string, string> = {
  'code-review': 'Reviews a change against your standards and its specification, separately. Approved rev 3 is pinned and published to my-kiln on GitHub. Editing it makes rev 4 as a draft; the installed copies keep rev 3 until you approve again.',
  research: 'Plans a research pass and cites what it read. Approved rev 2 is pinned; the install receipt records the revision and the folder.',
  'playtest-brief': 'Ranks the ten changes that would most improve a game build. Installed only in my-game, so other projects never load its description.',
  'code-review (1)': 'A second copy of code-review in the same folder, not made by Kiln. Your agent reads both descriptions on every turn. Removing it moves it to a private backup.',
  'pr-summary': 'Kiln has no record of this one. Import it as a draft to review; the original folder stays where it is.',
  'old-link': 'A link that points at a folder which no longer exists. Kiln can clean up broken links and empty folders, and touches nothing else.',
  'instruction-trace': 'Traces an unwanted decision back to the instruction behind it. Tested read-only on my-game, passed, approved as rev 1 and installed for Claude Code. A new session picks it up.',
};

const icon = (d: string) => `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icons = {
  library: icon('M4 3.5h3v13H4zM8.5 3.5h3v13h-3zM13 4.2l2.8-.7 2.4 12.4-2.8.6z'),
  skills: icon('M4 5h12M4 10h12M4 15h12M14 3.5v3M7 8.5v3M12 13.5v3'),
  test: icon('M7.5 3v5L3.5 15.5a1 1 0 0 0 .9 1.5h11.2a1 1 0 0 0 .9-1.5L12.5 8V3M6.5 3h7M5.5 12h9'),
  config: icon('M5 3h7l3 3v11H5zM12 3v3h3M7.5 10h5M7.5 13h5'),
};

export function windowHtml() {
  return `<div class="h10-win" data-win>
    <div class="h10-titlebar"><span class="h10-appicon" aria-hidden="true">K</span><span>Kiln</span><span class="h10-winctl" aria-hidden="true"><i>—</i><i>▢</i><i>✕</i></span></div>
    <div class="h10-winbody">
      <nav class="h10-rail" aria-label="Kiln sections (illustration)">
        <span class="h10-rail-item">${icons.library}Library</span>
        <span class="h10-rail-item is-active">${icons.skills}Skills</span>
        <span class="h10-rail-item">${icons.test}Experiments</span>
        <span class="h10-rail-item">${icons.config}Config files</span>
        <span class="h10-rail-foot"><i class="h10-okdot"></i>my-kiln, synced with GitHub</span>
      </nav>
      <div class="h10-page">
        <div class="h10-page-head">
          <h2 class="h10-page-title" id="h10-panel-title">Skills</h2>
          <p>Every copy your agents load, on this PC and in enrolled projects. One switch per place.</p>
        </div>
        <p class="h10-infobar" data-info aria-live="polite"></p>
        <div class="h10-groups" data-groups></div>
      </div>
      <aside class="h10-details" data-details aria-live="polite"></aside>
    </div>
  </div>`;
}

export type Panel = { file(key: string, filed: boolean): void; add(name: string): void; rowRect(key: string): DOMRect | null; allFiled(): boolean };

export function bindWindow(root: HTMLElement): Panel {
  const groups = root.querySelector<HTMLElement>('[data-groups]')!;
  const info = root.querySelector<HTMLElement>('[data-info]')!;
  const detailsEl = root.querySelector<HTMLElement>('[data-details]')!;
  let selected = 'cr-claude', compareOpen = false, message = '';

  const infoText = () => {
    if (message) return message;
    const filed = rows.filter(row => row.paper && row.filed).length, total = rows.filter(row => row.paper).length;
    if (filed < total) return `Looking through your skill folders… ${filed} of ${total} copies filed.`;
    return 'Found 7 copies in 3 folders: 1 edited outside Kiln, 1 duplicate, 1 not in your library, 1 broken link.';
  };
  const control = (row: Row, index: number) => {
    const label = `${row.name} in ${locations[row.loc].path}`;
    if (row.kind === 'duplicate') return `<button type="button" class="h10-btn" data-act="${index}" aria-label="Remove duplicate ${label}">Remove</button>`;
    if (row.kind === 'stray') return `<button type="button" class="h10-btn" data-act="${index}" aria-label="Import ${label} as a draft">Import as draft</button>`;
    if (row.kind === 'broken') return `<button type="button" class="h10-btn" data-act="${index}" aria-label="Clean up broken link ${label}">Clean up</button>`;
    if (row.kind === 'draft') return '';
    const on = row.kind !== 'off';
    return `<span class="h10-toggle-text">${row.kind === 'edited' ? 'Changed' : on ? 'On' : 'Off'}</span><button type="button" role="switch" aria-checked="${on}" class="h10-toggle h10-toggle-${row.kind}" data-act="${index}" aria-label="${label}"><i></i></button>`;
  };
  const renderDetails = () => {
    const row = rows.find(item => item.key === selected) ?? rows[0];
    const copies = rows.filter(item => item.name === row.name);
    detailsEl.innerHTML = `<p class="h10-details-kicker">Selected</p><h3>${row.name}</h3><p>${details[row.name] ?? ''}</p>
      <h4>Copies</h4><ul>${copies.map(item => `<li><span>${locations[item.loc].path}</span><b class="h10-chip h10-chip-${item.kind}">${stateText[item.kind]}</b></li>`).join('')}</ul>`;
  };
  const render = () => {
    groups.innerHTML = (Object.keys(locations) as Loc[]).map(loc => `<section class="h10-card" aria-label="${locations[loc].name}">
      <h3 class="h10-card-head"><span>${locations[loc].name}</span><code>${locations[loc].path}</code></h3>
      <ul>${rows.map((row, index) => ({ row, index })).filter(({ row }) => row.loc === loc).map(({ row, index }) => `
        <li class="h10-row h10-row-${row.kind}${row.filed ? ' is-filed' : ''}${row.key === selected ? ' is-selected' : ''}" data-key="${row.key}">
          <button type="button" class="h10-row-name" data-select="${row.key}"><b>${row.name}</b><small>${row.note}</small></button>
          <span class="h10-state">${stateText[row.kind]}</span>
          <span class="h10-control">${control(row, index)}</span>
        </li>
        ${row.key === 'cr-claude' && compareOpen ? `<li class="h10-compare"><p><b>SKILL.md</b> differs from approved rev 3</p>
          <div class="h10-diff"><p class="h10-del">− Review standards and the specification separately.</p><p class="h10-add">+ Review the specification only.</p></div>
          <div class="h10-actions-row"><button type="button" class="h10-btn h10-btn-accent" data-replace>Replace with approved rev 3</button><button type="button" class="h10-btn" data-keep>Keep the edit as a new draft</button></div></li>` : ''}`).join('')}</ul>
    </section>`).join('');
    info.textContent = infoText();
    renderDetails();
  };
  const say = (text: string) => { message = text; info.textContent = text; info.classList.remove('is-new'); void info.offsetWidth; info.classList.add('is-new'); };

  groups.addEventListener('click', event => {
    const target = event.target as Element;
    const select = target.closest<HTMLElement>('[data-select]');
    if (select) { selected = select.dataset.select!; render(); groups.querySelector<HTMLElement>(`[data-select="${selected}"]`)?.focus(); return; }
    if (target.closest('[data-replace]')) { rows[0].kind = 'on'; compareOpen = false; say('Moved the hand-edited copy to a private backup and installed approved rev 3.'); render(); return; }
    if (target.closest('[data-keep]')) { rows[0].kind = 'on'; rows[0].note = 'Approved rev 3, draft rev 4'; compareOpen = false; say('Saved the edit as draft rev 4. Approved rev 3 is back in place until you approve the draft.'); render(); return; }
    const button = target.closest<HTMLButtonElement>('[data-act]');
    if (!button) return;
    const index = Number(button.dataset.act), row = rows[index], where = locations[row.loc].path;
    selected = row.key;
    if (row.kind === 'edited') { compareOpen = !compareOpen; say('This copy was changed outside Kiln. Compare it before anything is replaced.'); render(); groups.querySelector<HTMLElement>('[data-replace]')?.focus(); return; }
    if (row.kind === 'on') { row.kind = 'off'; say(`Removed ${row.name} from ${where}. The skill stays in your library, history and all.`); }
    else if (row.kind === 'off') { row.kind = 'on'; say(`Installed ${row.note.toLowerCase()} of ${row.name} into ${where}. Install receipt saved.`); }
    else if (row.kind === 'duplicate') { rows.splice(index, 1); selected = 'cr-claude'; say(`Moved ${row.name} to a private backup. One code-review left in ${where}.`); }
    else if (row.kind === 'stray') { row.kind = 'draft'; row.note = 'Draft in your library'; say(`Imported ${row.name} as a draft. The original folder stays where it was.`); }
    else if (row.kind === 'broken') { rows.splice(index, 1); selected = 'cr-claude'; say(`Cleaned up the broken link ${row.name}. Nothing else was touched.`); }
    render();
    groups.querySelector<HTMLElement>(`[data-key="${row.key}"] [data-act]`)?.focus();
  });
  render();

  return {
    file(key, filed) {
      const row = rows.find(item => item.key === key);
      if (!row || row.filed === filed) return;
      row.filed = filed;
      const el = groups.querySelector(`[data-key="${key}"]`);
      el?.classList.toggle('is-filed', filed);
      if (filed && el) { el.classList.add('is-arriving'); setTimeout(() => el.classList.remove('is-arriving'), 700); }
      if (!message) info.textContent = infoText();
    },
    rowRect(key) { return groups.querySelector(`[data-key="${key}"]`)?.getBoundingClientRect() ?? null; },
    allFiled: () => rows.every(row => !row.paper || row.filed),
    add(name) {
      rows.forEach(row => { row.filed = true; });
      rows.splice(3, 0, { key: 'kid-check', name, loc: 'claude', kind: 'on', note: 'Approved rev 1, just now', filed: true, paper: false });
      selected = 'kid-check';
      say(`Approved ${name} and installed it into ~/.claude/skills.`);
      render();
      groups.querySelector('[data-key="kid-check"]')?.classList.add('is-new');
    },
  };
}
