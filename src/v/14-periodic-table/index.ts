// PROTOTYPE 11 — Periodic table of your skills. A classroom wall chart of a sample library; filters light up groups, tiles open element cards.
import './style.css';
import { examples, installer, provenance, releaseNote, subscription, windowsMark } from '../../content';
import { copyStates, elements, found, kinds, locations, stateLabel, statuses, type Element, type Kind } from './data';

type Group = 'kind' | 'status' | 'loc' | 'copy';
const all = [...elements, ...found];
const kindLabel = (kind: Kind) => kind === 'found' ? 'Found, not in the library' : kinds.find(k => k.key === kind)!.label;
const statusText: Record<string, string> = { approved: 'Approved', draft: 'Draft', review: 'Needs review', saved: 'Saved', found: 'Not in the library' };
const matches = (el: Element, group: Group, value: string) =>
  group === 'kind' ? el.kind === value
    : group === 'status' ? el.status === value
      : group === 'loc' ? (value === 'none' ? el.installs.length === 0 && el.kind !== 'found' : el.installs.some(i => i.loc === value))
        : el.installs.some(i => i.state === value);

const tile = (el: Element, extra = '') => `
  <button type="button" class="v11-el v11-k-${el.kind} is-${el.status}${el.installs.some(i => i.state === 'drift') ? ' has-drift' : ''}" data-n="${el.n}" ${extra}
    aria-label="${el.name}, ${kindLabel(el.kind).toLowerCase()}, ${statusText[el.status].toLowerCase()}. Open the element card.">
    <span class="v11-n">${el.n}</span><span class="v11-w" aria-hidden="true">${el.weight || '–'}</span>
    <span class="v11-sym">${el.sym}</span><span class="v11-name">${el.name}</span>
    <span class="v11-mark" aria-hidden="true"></span>
  </button>`;

const chip = (group: Group, key: string, label: string, swatch = '') =>
  `<button type="button" class="v11-chip" data-group="${group}" data-value="${key}" aria-pressed="false">${swatch ? `<span class="v11-swatch v11-k-${swatch}" aria-hidden="true"></span>` : ''}${label}</button>`;

const molecule = (name: string, syms: string[], note: string) => {
  const pts = syms.length === 3 ? [[60, 90], [150, 40], [240, 90]] : [[60, 70], [150, 40], [240, 70], [150, 125]];
  const els = syms.map(s => all.find(e => e.sym === s)!);
  return `<figure class="v11-molecule">
    <svg viewBox="0 0 300 160" role="img" aria-label="${name}: ${els.map(e => e.name).join(', ')}">
      ${pts.slice(1).map(([x, y], i) => `<line x1="${pts[i === 2 ? 1 : i][0]}" y1="${pts[i === 2 ? 1 : i][1]}" x2="${x}" y2="${y}"/>`).join('')}
      ${els.map((e, i) => `<g class="v11-k-${e.kind}"><circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="30"/><text x="${pts[i][0]}" y="${pts[i][1] + 8}" text-anchor="middle">${e.sym}</text></g>`).join('')}
    </svg>
    <figcaption><strong>${name}</strong><span class="v11-formula">${els.map(e => e.sym).join('·')}</span><p>${note}</p></figcaption>
  </figure>`;
};

export function render(root: HTMLElement) {
  document.title = 'Kiln — Know what your agents are made of';
  const cr = elements.find(e => e.sym === 'Cr')!;
  const sy = examples[0];
  root.innerHTML = `
<div class="v11">
  <header class="v11-top">
    <a class="v11-brand" href="?" aria-label="Kiln home"><span class="v11-brand-tile"><small>0.17</small><b>Ki</b></span><span>Kiln</span></a>
    <nav aria-label="Main navigation"><a href="#v11-chart">The chart</a><a href="#v11-isotopes">Copies</a><a href="#v11-organise">Organise</a><a href="#v11-import">Import</a><a href="#v11-search">Search</a><a href="#v11-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v11-hero" aria-labelledby="v11-title">
      <h1 id="v11-title">Know what your agents are made of.</h1>
      <div class="v11-lede">
        <p>Kiln is a Windows app that gathers your skills, prompts and agent definitions into one library, then shows you every copy, every revision and every approval. Here is a sample library, charted.</p>
        <a class="v11-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      </div>
    </section>

    <section class="v11-chart-wrap" id="v11-chart" aria-labelledby="v11-chart-title">
      <div class="v11-chart-head">
        <h2 id="v11-chart-title">Periodic Table of the Library</h2>
        <p>A sample library of 54 entries. Point at a group to light it up. Select an element to read its card.</p>
      </div>
      <div class="v11-filters" role="group" aria-label="Light up elements by group">
        <div class="v11-fgroup"><h3>Kind</h3><div>${kinds.map(k => chip('kind', k.key, k.plural, k.key)).join('')}</div></div>
        <div class="v11-fgroup"><h3>Status</h3><div>${statuses.map(s => chip('status', s.key, s.label)).join('')}</div></div>
        <div class="v11-fgroup"><h3>Location</h3><div>${locations.map(l => chip('loc', l.key, l.label)).join('')}</div></div>
        <div class="v11-fgroup"><h3>Copy state</h3><div>${copyStates.map(c => chip('copy', c.key, c.label)).join('')}</div></div>
      </div>
      <div class="v11-table" role="group" aria-label="Sample library elements. Use arrow keys to move between elements.">
        ${elements.map(el => tile(el, `style="grid-row:${el.row};grid-column:${el.col}"`)).join('')}
        <div class="v11-key" aria-hidden="false">
          <div class="v11-key-tile v11-k-skill">
            <span class="v11-n">${cr.n}</span><span class="v11-w">${cr.weight}</span><span class="v11-sym">${cr.sym}</span><span class="v11-name">${cr.name}</span>
            <i class="v11-key-l v11-key-n">Library number</i><i class="v11-key-l v11-key-w">Context weight, sample tokens</i><i class="v11-key-l v11-key-s">Symbol</i><i class="v11-key-l v11-key-name">Name</i>
          </div>
          <div class="v11-readout" aria-live="polite"></div>
        </div>
      </div>
      <div class="v11-series">
        <p class="v11-series-label"><strong>Found in a scan</strong> Folders and copies on disk that are not in the library yet.</p>
        <div class="v11-series-row">${found.map(el => tile(el)).join('')}</div>
      </div>
      <p class="v11-fine">Sample library. Context weight is an illustrative estimate of how many tokens a skill description adds to an agent's context. Kiln does not measure per-skill cost. Library-only entries show a dash because nothing of theirs is installed. Marks: a solid dot is approved, a ring is a draft, half a dot needs review, a red corner means a copy was edited outside Kiln.</p>
    </section>

    <section class="v11-sec" id="v11-isotopes" aria-labelledby="v11-iso-title">
      <div class="v11-sec-head">
        <h2 id="v11-iso-title">One element. Several isotopes.</h2>
        <p>The same skill tends to exist in more than one place: <code>~/.claude/skills</code>, <code>~/.agents/skills</code> (shared by Codex, Copilot and others), <code>.codex/skills</code>, <code>.copilot/skills</code>, a project's <code>.github/skills</code>. Kiln finds every installed copy across your personal locations and enrolled projects and tells you what state it is in.</p>
      </div>
      <div class="v11-iso">
        <div class="v11-iso-copies">
          <h3>Code review, installed copies</h3>
          <table>
            <thead><tr><th scope="col">Copy</th><th scope="col">State</th></tr></thead>
            <tbody>${cr.installs.map(i => `<tr><th scope="row"><code>${i.path}</code></th><td><span class="v11-pill is-${i.state}">${stateLabel[i.state]}</span>${i.state === 'drift' ? ' <button type="button" class="v11-link" aria-expanded="false" aria-controls="v11-diff">Compare with approved</button>' : ''}</td></tr>`).join('')}</tbody>
          </table>
          <div class="v11-diff" id="v11-diff" hidden>
            <p class="v11-diff-file">SKILL.md, installed copy against approved revision 2</p>
            <p class="is-del">- Review standards and the specification separately.</p>
            <p class="is-add">+ Review the specification only. Skip style.</p>
          </div>
        </div>
        <dl class="v11-states">
          ${[['installed', 'The copy Kiln put there, matching its install receipt.'], ['identical', 'A copy Kiln did not install, but byte for byte the same.'], ['differs', 'A copy that does not match the approved revision.'], ['linked', 'A link to the library copy rather than a folder of its own.'], ['drift', 'Someone changed the installed files after Kiln installed them.']].map(([k, d]) => `<div><dt><span class="v11-pill is-${k}">${stateLabel[k as keyof typeof stateLabel]}</span></dt><dd>${d}</dd></div>`).join('')}
        </dl>
      </div>
      <div class="v11-mass">
        <h3>Why the weight matters</h3>
        <p>Every model-invoked skill's description sits in the agent's context on every turn, whether or not the skill fires. Forgotten, duplicate and stale copies spend tokens and attention all the same. Kiln shows exactly what is installed where, so you can remove what you don't use. <strong>Remove local copies</strong> works in bulk: copies Kiln manages are deleted, anything else is moved to a private backup first.</p>
      </div>
    </section>

    <section class="v11-sec" id="v11-organise" aria-labelledby="v11-org-title">
      <div class="v11-sec-head">
        <h2 id="v11-org-title">Groups, periods and your own order.</h2>
        <p>The chart above is one arrangement. In Kiln you choose the arrangement.</p>
      </div>
      <div class="v11-org">
        <div><h3>Filter by</h3><p>Kind, status, provider, location, copy state, scope and tag. Combine them to answer questions like "which approved skills are edited outside Kiln in this project".</p></div>
        <div><h3>Mark and find</h3><p>Tags and favorites for what you reach for. Collections for what belongs together. Search across all of it.</p></div>
        <div><h3>Handle many at once</h3><p>Ctrl-click and Shift-click to select, <kbd>Ctrl</kbd>+<kbd>A</kbd> for everything in view. Archive, trash, restore. Swipe a row to archive it, and undo if you didn't mean it.</p></div>
        <div><h3>Everything in one table</h3><p>Prompts, skills, custom agent definitions in native Codex, Claude Code and Copilot formats, source notes, insights, techniques, tools and resources.</p></div>
      </div>
    </section>

    <section class="v11-sec" id="v11-import" aria-labelledby="v11-imp-title">
      <div class="v11-sec-head">
        <h2 id="v11-imp-title">Discover the elements you already have.</h2>
        <p>You don't start from an empty chart. Kiln reads what is already on your machine.</p>
      </div>
      <ol class="v11-steps">
        <li><h3>Import as drafts</h3><p>Bring in installed skills, or a whole skills repository. Each arrives as a draft for review. The original files stay exactly where they are.</p></li>
        <li><h3>Find what is missing</h3><p><em>Find skills and agents not in the library</em> scans your locations and lists everything the library hasn't seen, like the grey row under the chart.</p></li>
        <li><h3>Clean up safely</h3><p>It offers safe cleanup of broken links and empty folders. Anything else is yours to import, compare or leave alone.</p></li>
      </ol>
    </section>

    <section class="v11-sec" id="v11-collections" aria-labelledby="v11-col-title">
      <div class="v11-sec-head">
        <h2 id="v11-col-title">Elements combine into collections.</h2>
        <p>A collection holds related work of any kind. When you use <em>Analyze and add</em> on a source, the prompts, insights, techniques and tools it yields land in a collection linked back to that source.</p>
      </div>
      <div class="v11-molecules">
        ${molecule('Agent workflows', ['Iw', 'Pm', 'Rb'], 'Find the instruction behind an unwanted decision, keep project memory specific, get a repository briefing.')}
        ${molecule('Game design', ['Pt', 'Vc', 'Gp', 'Rk'], 'A playtest prompt, the skill it became, an insight about variety and a risk-first plan.')}
        ${molecule('Skills to refine', ['Cr', 'Re', 'Wa'], 'Code review, research and writing for agents, each with its revision history.')}
      </div>
    </section>

    <section class="v11-sec" id="v11-search" aria-labelledby="v11-search-title">
      <div class="v11-sec-head">
        <h2 id="v11-search-title">Look it up.</h2>
        <p>Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> anywhere in Windows for quick search, or <kbd>Ctrl</kbd>+<kbd>N</kbd> to capture something new. Try it on the sample chart.</p>
      </div>
      <div class="v11-lookup">
        <label for="v11-q">Search the sample library</label>
        <input id="v11-q" type="search" value="review" autocomplete="off" spellcheck="false">
        <ul class="v11-results" aria-live="polite"></ul>
      </div>
    </section>

    <section class="v11-sec" id="v11-versions" aria-labelledby="v11-ver-title">
      <div class="v11-sec-head">
        <h2 id="v11-ver-title">Stable isotopes: approved means this exact revision.</h2>
        <p>Approval pins one revision. Editing creates a new draft and never replaces what you approved, and installs always use approved content. Approval commits and publishes that snapshot to your own Kiln GitHub repository, with validation that never executes a skill. On another machine, open the repository and press <em>Install everything marked for this machine</em>, or run <code>kiln skills sync</code>.</p>
      </div>
      <ol class="v11-decay">${provenance.map(p => `<li class="${p.state === 'Approved' ? 'is-approved' : p.state === 'Needs review' ? 'is-review' : ''}"><strong>${p.event}</strong><span>${p.detail}</span><em>${p.state}</em></li>`).join('')}</ol>
    </section>

    <section class="v11-sec" id="v11-reactions" aria-labelledby="v11-rx-title">
      <div class="v11-sec-head">
        <h2 id="v11-rx-title">Run the reaction before you add it to the chart.</h2>
        <p>A prompt earns its tile by being tested. Pick a local repository, run the exact revision through your signed-in Codex or Claude Code, and watch it live. Experiments are read-only, so nothing in your code changes. The agent's pass, fail or uncertain assessment is saved with the revision, apart from your own judgement. ${subscription.text} ${subscription.fine}</p>
      </div>
      <figure class="v11-rx">
        <blockquote><p>${sy.prompt}</p></blockquote>
        <figcaption><span class="v11-rx-eq"><b class="v11-k-prompt">Sy</b> <span aria-hidden="true">+</span> your repo <span aria-hidden="true">⟶</span> <b class="v11-k-skill">Us</b></span><span>${sy.title}, ${sy.source.toLowerCase()}. It became the Usability check skill: ${sy.skill.toLowerCase()}</span></figcaption>
      </figure>
    </section>

    <section class="v11-download" id="v11-download" aria-labelledby="v11-dl-title">
      <h2 id="v11-dl-title">Chart your own library.</h2>
      <p>Import the skills you already have and see where every copy lives.</p>
      <a class="v11-button" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="v11-note">${releaseNote} Builds are unsigned, so Windows may ask before it runs the installer. MIT licensed, with a CLI for scripting.</p>
    </section>
  </main>
  <dialog class="v11-card" aria-labelledby="v11-card-title"></dialog>
</div>`;

  // Group lighting: hover or focus previews, click pins.
  const table = root.querySelector<HTMLElement>('.v11')!;
  const readout = root.querySelector<HTMLElement>('.v11-readout')!;
  const chips = [...root.querySelectorAll<HTMLButtonElement>('.v11-chip')];
  const tiles = [...root.querySelectorAll<HTMLButtonElement>('.v11-el')];
  let pinned: HTMLButtonElement | null = null;
  const idle = `<strong>54 elements, 7 strays</strong><span>Light up a group to see how much of your library it covers. Select any element to read where it is installed, its revision, its approval and its source.</span>`;
  const light = (button: HTMLButtonElement | null) => {
    if (!button) { table.removeAttribute('data-lit'); tiles.forEach(t => t.classList.remove('is-lit')); readout.innerHTML = idle; return; }
    const group = button.dataset.group as Group, value = button.dataset.value!;
    const hits = all.filter(el => matches(el, group, value));
    tiles.forEach(t => t.classList.toggle('is-lit', hits.some(h => h.n === Number(t.dataset.n))));
    table.setAttribute('data-lit', '');
    const installed = hits.filter(h => h.installs.length && h.kind !== 'found');
    const weight = installed.reduce((sum, h) => sum + h.weight * h.installs.length, 0);
    const k = kinds.find(k => k.key === value);
    readout.innerHTML = `<strong>${button.textContent}: ${hits.length} element${hits.length === 1 ? '' : 's'}</strong><span>${k ? k.note + ' ' : ''}${weight ? `Sample context weight across ${installed.length === 1 ? 'its' : 'their'} installed copies: about ${weight.toLocaleString('en')} tokens (illustrative).` : 'Nothing installed, so nothing loaded into an agent’s context.'}</span>`;
  };
  chips.forEach(button => {
    button.addEventListener('mouseenter', () => light(button));
    button.addEventListener('focus', () => light(button));
    button.addEventListener('mouseleave', () => light(pinned));
    button.addEventListener('blur', () => light(pinned));
    button.addEventListener('click', () => {
      pinned = pinned === button ? null : button;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === pinned)));
      light(pinned ?? button);
      if (!pinned) light(null);
    });
  });
  light(null);

  // Element cards.
  const dialog = root.querySelector<HTMLDialogElement>('.v11-card')!;
  const open = (el: Element) => {
    const locName = (loc: string) => locations.find(l => l.key === loc)!.label;
    const approval = el.kind === 'found' ? 'Not in the library, so nothing to approve yet.'
      : el.approved ? (el.rev > el.approved ? `Revision ${el.approved} is approved and published to my-kiln on GitHub. Revision ${el.rev} is a newer draft; installs keep using revision ${el.approved} until you approve again.` : `Revision ${el.approved} is approved, committed and published to my-kiln on GitHub. Installs use exactly this revision.`)
        : el.kind === 'skill' || el.kind === 'agent' ? 'Not approved yet. It can’t be installed until you approve a revision.' : 'Library entries like this one don’t need approval. Turn it into a skill when it proves itself.';
    const run = el.run ? `<div><dt>Last experiment</dt><dd>Revision ${el.rev} on a local repository. The agent's assessment: <strong>${el.run}</strong>. Your judgement is recorded separately.</dd></div>` : '';
    dialog.innerHTML = `
      <div class="v11-card-body">
        <div class="v11-card-tile v11-k-${el.kind}" aria-hidden="true"><span class="v11-n">${el.n}</span><span class="v11-w">${el.weight || '–'}</span><span class="v11-sym">${el.sym}</span><span class="v11-name">${el.name}</span></div>
        <div class="v11-card-info">
          <p class="v11-card-kind">${kindLabel(el.kind)}, ${statusText[el.status].toLowerCase()}</p>
          <h2 id="v11-card-title">${el.name}</h2>
          <dl>
            <div><dt>Installed</dt><dd>${el.installs.length ? `<ul>${el.installs.map(i => `<li><code>${i.path}</code><span class="v11-pill is-${i.state}">${stateLabel[i.state]}</span><small>${locName(i.loc)}</small></li>`).join('')}</ul>` : 'Not installed anywhere. It lives in the library only.'}</dd></div>
            ${el.kind === 'found' ? '' : `<div><dt>Revision</dt><dd>Revision ${el.rev}${el.rev > 1 ? `, with ${el.rev - 1} earlier revision${el.rev > 2 ? 's' : ''} and their diffs kept` : ''}.</dd></div>`}
            <div><dt>Approval</dt><dd>${approval}</dd></div>
            <div><dt>Source</dt><dd>${el.source}</dd></div>
            ${run}
            <div><dt>Context weight</dt><dd>${el.weight ? `About ${el.weight} tokens of description per installed copy, per turn. A sample figure for this illustration; Kiln doesn't compute it.` : 'Nothing installed, so nothing in context.'}</dd></div>
          </dl>
        </div>
      </div>
      <form method="dialog"><button class="v11-close" type="submit">Close card</button></form>`;
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector<HTMLButtonElement>('.v11-close')!.focus({ preventScroll: true });
  };
  tiles.forEach(t => t.addEventListener('click', () => open(all.find(e => e.n === Number(t.dataset.n))!)));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  // Arrow keys move between tiles by their on-screen position (works in the wall-chart and phone layouts).
  const grid = [...root.querySelectorAll<HTMLButtonElement>('.v11-table .v11-el, .v11-series .v11-el')];
  grid.forEach((t, i) => t.tabIndex = i === 0 ? 0 : -1);
  const move = (from: HTMLButtonElement, key: string) => {
    const a = from.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    let best: HTMLButtonElement | null = null, score = Infinity;
    for (const t of grid) {
      if (t === from) continue;
      const b = t.getBoundingClientRect(), dx = b.left + b.width / 2 - ax, dy = b.top + b.height / 2 - ay;
      const along = key === 'ArrowRight' ? dx : key === 'ArrowLeft' ? -dx : key === 'ArrowDown' ? dy : -dy;
      const across = key === 'ArrowRight' || key === 'ArrowLeft' ? Math.abs(dy) : Math.abs(dx);
      if (along <= 4) continue;
      const s = along + across * 3;
      if (s < score) { score = s; best = t; }
    }
    return best;
  };
  grid.forEach(t => t.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? grid[0] : event.key === 'End' ? grid[grid.length - 1] : move(t, event.key);
    if (!next) return;
    grid.forEach(g => g.tabIndex = -1);
    next.tabIndex = 0;
    next.focus();
  }));

  // Copy diff.
  const cmp = root.querySelector<HTMLButtonElement>('.v11-iso .v11-link');
  cmp?.addEventListener('click', () => {
    const openNow = cmp.getAttribute('aria-expanded') !== 'true';
    cmp.setAttribute('aria-expanded', String(openNow));
    cmp.textContent = openNow ? 'Hide comparison' : 'Compare with approved';
    root.querySelector<HTMLElement>('#v11-diff')!.hidden = !openNow;
  });

  // Search.
  const q = root.querySelector<HTMLInputElement>('#v11-q')!;
  const results = root.querySelector<HTMLUListElement>('.v11-results')!;
  const search = () => {
    const term = q.value.trim().toLowerCase();
    const hits = term ? all.filter(e => `${e.name} ${e.source} ${e.sym}`.toLowerCase().includes(term)).slice(0, 6) : [];
    results.innerHTML = hits.length ? hits.map(e => `<li><button type="button" data-n="${e.n}"><span class="v11-mini v11-k-${e.kind}" aria-hidden="true">${e.sym}</span><span><strong>${e.name}</strong><small>${kindLabel(e.kind)}${e.kind === 'found' ? '' : `, ${statusText[e.status].toLowerCase()}`}${e.installs.length ? `, ${e.installs.length} cop${e.installs.length === 1 ? 'y' : 'ies'}` : ''}</small></span></button></li>`).join('')
      : `<li class="v11-empty">${term ? 'Nothing in the sample library matches.' : 'Type to search names and sources.'}</li>`;
  };
  q.addEventListener('input', search);
  results.addEventListener('click', event => {
    const b = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-n]');
    if (b) open(all.find(e => e.n === Number(b.dataset.n))!);
  });
  search();
}
