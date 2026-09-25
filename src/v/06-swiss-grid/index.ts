// PROTOTYPE variant 03 — Swiss grid. Four verbs on a visible 12-column grid; words and cells change width with scroll via Archivo's wdth axis.
import './style.css';
import { collections, examples, installer, provenance, releaseNote, subscription, windowsMark } from '../../content';

const verbs = [
  { word: 'Capture', n: 1, id: 'v03-capture', line: 'Text, links, screenshots, files and YouTube videos. Ctrl+Shift+Space from anywhere.' },
  { word: 'Test', n: 2, id: 'v03-test', line: 'Run the exact revision on your own repo through Codex or Claude Code. Read-only.' },
  { word: 'Keep', n: 3, id: 'v03-keep', line: 'One library. Approve an exact revision, publish it to your GitHub repo, install it.' },
  { word: 'Prune', n: 4, id: 'v03-prune', line: 'See every installed copy of every skill. Remove what doesn’t earn its place.' },
];

// Sample folder for the prune grid: 24 skills, 7 of them dead weight.
const cells = [
  ['code-review', ''], ['research', ''], ['pdf-tools', 'dup'], ['playtest', ''], ['react-rules-v2', 'stale'], ['writing-for-agents', ''],
  ['seo-audit', 'stale'], ['commit-msg', ''], ['pdf-tools', ''], ['code-review', 'drift'], ['api-docs', ''], ['deploy-notes', 'stale'],
  ['test-plan', ''], ['changelog', ''], ['code-review-old', 'dup'], ['figma-to-css', ''], ['sql-review', ''], ['perf-audit', ''],
  ['onboarding', ''], ['a11y-check', ''], ['release', 'dup'], ['i18n', ''], ['prd-writer', 'stale'], ['security', ''],
];
const cut = cells.filter(([, flag]) => flag && flag !== 'drift').length;

const facts = (rows: [string, string][]) => `<dl class="v03-facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const head = (verb: typeof verbs[number], order: string) => `
  <header class="v03-sect-head">
    <p class="v03-num"><span>${verb.n}</span><small>${order}</small></p>
    <h2 class="v03-kin" id="${verb.id}-title">${verb.word}</h2>
  </header>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Capture. Test. Keep. Prune.';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
<div class="v03${reduce ? ' is-still' : ''}">
  <div class="v03-grid" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<span><i>${String(i + 1).padStart(2, '0')}</i></span>`).join('')}</div>
  <header class="v03-top">
    <a class="v03-brand" href="?">Kiln</a>
    <p class="v03-top-line">A library and test bench for agent prompts and skills. Windows.</p>
    <nav aria-label="Main navigation">${[verbs[2], verbs[3], verbs[0], verbs[1]].map(v => `<a href="#${v.id}">${v.word}</a>`).join('')}<a href="#v03-get">Download</a></nav>
  </header>

  <main id="main">
    <section class="v03-stage-wrap" aria-labelledby="v03-title">
      <div class="v03-stage">
        <h1 id="v03-title" class="v03-verbs">${verbs.map((v, i) => `
          <span class="v03-row" data-i="${i}"><span class="v03-word">${v.word}.</span><span class="v03-cap" aria-hidden="true"><b>${v.n}</b>${v.line}</span></span>`).join('')}
        </h1>
        <div class="v03-stage-foot">
          <p class="v03-cap-mobile" aria-live="off">${verbs[0].line}</p>
          <p class="v03-intro">Kiln keeps the prompts, skills and custom agents you use with Codex, Claude Code and Copilot in one library, and tests them on your own code before they become habits.</p>
          <a class="v03-button" href="#v03-get">${windowsMark}<span>Download for Windows</span></a>
        </div>
      </div>
    </section>

    <section class="v03-start" aria-label="Where to start">
      <p class="v03-start-a">Start at 3.</p>
      <p class="v03-start-b">You already have a skills folder. Most of the value is in the mess you’ve made already, so this page starts with keeping and pruning, then goes back to capture and test.</p>
    </section>

    <section class="v03-sect" id="v03-keep" aria-labelledby="v03-keep-title">
      ${head(verbs[2], 'First')}
      <p class="v03-lede">One library for prompts, skills, custom agent definitions, source notes, insights, techniques, tools and resources.</p>
      ${facts([
        ['Organise', 'Collections, search, tags, favorites. Filter by kind, status, provider, location, copy state, scope and tag.'],
        ['Handle', 'Ctrl- and Shift-click, Ctrl+A. Archive, trash, restore, undo.'],
        ['Import', 'Installed skills or a skills repository come in as drafts. The originals stay where they are.'],
        ['Agents', 'Custom agent definitions in native Codex, Claude Code and Copilot formats.'],
      ])}
      <div class="v03-index" role="table" aria-label="A sample library">
        <div class="v03-index-row v03-index-head" role="row"><span role="columnheader">Collection</span><span role="columnheader">Kind</span><span role="columnheader">Title</span></div>
        ${collections.flatMap(c => c.items.map(([kind, title], i) => `<div class="v03-index-row" role="row"><span role="cell">${i === 0 ? c.name : ''}</span><span role="cell">${kind}</span><span role="cell">${title}</span></div>`)).join('')}
      </div>
      <div class="v03-trust">
        <h3 class="v03-h3">Versions you can trust</h3>
        <p>Approval pins an exact revision. Editing creates a new draft and never replaces the approved one. Installs always use approved content, committed and published to your own Kiln repository on GitHub. On another machine: open the repo, press <b>Install everything marked for this machine</b>, or run <code>kiln skills sync</code>.</p>
      </div>
      <ol class="v03-prov" aria-label="Sample history of one skill">
        ${provenance.map((p, i) => `<li class="${p.state === 'Approved' ? 'is-red' : ''}"><span class="v03-prov-n">${i + 1}</span><b>${p.event}</b><span>${p.detail}</span><em>${p.state}</em></li>`).join('')}
      </ol>
    </section>

    <section class="v03-sect" id="v03-prune" aria-labelledby="v03-prune-title">
      ${head(verbs[3], 'Second')}
      <p class="v03-lede">Every model-invoked skill’s description sits in your agent’s context on every turn. Used or not.</p>
      ${facts([
        ['Visibility', 'Each skill’s copies across personal locations and enrolled projects: installed, identical copy found, differs, linked, edited outside Kiln.'],
        ['Compare', 'A drifted copy, file by file, against the approved version.'],
        ['Remove', 'Local copies in bulk. Managed copies are deleted; others move to private backups.'],
        ['Clean up', 'Find skills and agents not in the library. Broken links and empty folders, removed safely.'],
      ])}
      <figure class="v03-prune">
        <div class="v03-cells" role="list" aria-label="Sample skills folder">
          ${cells.map(([name, flag]) => `<span role="listitem" class="v03-cell${flag ? ` is-${flag}` : ''}" data-flag="${flag}"><span>${name}</span>${flag ? `<small>${flag === 'dup' ? 'duplicate' : flag === 'stale' ? 'not in library' : 'edited outside Kiln'}</small>` : ''}</span>`).join('')}
        </div>
        <figcaption class="v03-prune-cap">
          <p><b data-left>${cells.length}</b> skills in a sample folder. <span data-note>${cut} are duplicates or skills you forgot you installed.</span></p>
          <button type="button" class="v03-prune-btn" aria-pressed="false">Remove the ${cut} local copies</button>
          <p class="v03-small">Illustrative folder. Kiln shows what’s installed where; it doesn’t measure tokens per skill. Test runs do show their token usage.</p>
        </figcaption>
      </figure>
    </section>

    <section class="v03-sect" id="v03-capture" aria-labelledby="v03-capture-title">
      ${head(verbs[0], 'Third')}
      <p class="v03-lede">Paste it, drop it, or press Ctrl+Shift+Space. Keep moving.</p>
      ${facts([
        ['Sources', 'Text, links, screenshots, images, files. Tray icon. Ctrl+N to capture.'],
        ['Save only', 'Keeps it without calling a model.'],
        ['Analyze and add', 'Turns a source into prompts, insights, techniques, tools and resources, in a collection linked to the source.'],
        ['Distill video', 'Captions of a YouTube video become reusable entries with timestamped links. The transcript stays attached.'],
      ])}
      <ul class="v03-sources" aria-label="Things you can capture">${['Post from X', 'Screenshot', 'YouTube talk', 'Link', 'Note', 'File'].map(s => `<li>${s}</li>`).join('')}</ul>
    </section>

    <section class="v03-sect" id="v03-test" aria-labelledby="v03-test-title">
      ${head(verbs[1], 'Fourth')}
      <p class="v03-lede">Choose a local repository. Run the exact revision through Codex or Claude Code. Nothing in your code changes.</p>
      ${facts([
        ['Watch', 'Messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and token counts, live. Up to two runs at once.'],
        ['Verdict', 'The agent’s pass, fail or uncertain, saved against that revision. Your judgement is kept separately.'],
        ['Honest', 'Tasks that need edits or unavailable tools come back uncertain, not as faked successes.'],
        ['Learn', 'Edit, compare revisions and diffs, run again on the same repo. See what changed the result.'],
      ])}
      <blockquote class="v03-quote"><p>${examples[0].prompt}</p><footer>${examples[0].title}. ${examples[0].source}.</footer></blockquote>
      <div class="v03-verdicts" role="img" aria-label="Three possible verdicts: pass, fail, uncertain. Uncertain is highlighted.">
        <span class="v03-kin-v">Pass</span><span class="v03-kin-v">Fail</span><span class="v03-kin-v is-red">Uncertain</span>
      </div>
      <p class="v03-small v03-verdict-note">Illustrative. First run, uncertain: a read-only agent can’t tap through the app like a child, so it flagged its guesses. Revision 2 asked it to walk the first three screens from the code instead. Second run: pass. You still decide.</p>
      <p class="v03-habit">A prompt that proves itself becomes a skill. <b>Create skill</b> drafts a SKILL.md from a prompt, image or note, using bundled writing-for-agents guidance. Approve it, install it into Codex, Claude Code or Copilot locations, and the next agent session picks it up.</p>
    </section>

    <section class="v03-get" id="v03-get" aria-labelledby="v03-get-title">
      <h2 class="v03-kin" id="v03-get-title">Download</h2>
      <div class="v03-get-body">
        <a class="v03-button v03-button-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
        <p>${releaseNote}</p>
        <p class="v03-small">Unsigned build. MIT licensed. Setup creates your library repository with the official gh CLI.</p>
      </div>
      ${facts([
        ['Cost', `${subscription.text} ${subscription.fine}`],
        ['Consent', 'A notice explains what’s sent before any agent interaction. Editing, approving and installing never call a model.'],
        ['CLI', 'Script collections, items, experiments, approvals and installs. JSON results. Your agents can read your library through it.'],
        ['Config', 'CLAUDE.md, AGENTS.md, config.toml, hooks.json, settings, MCP. Edited in place with 30 private backups. Hooks never run.'],
      ])}
    </section>
  </main>
</div>`;

  // Prune: the red cells collapse and the grid re-flows.
  const pruneButton = root.querySelector<HTMLButtonElement>('.v03-prune-btn')!;
  pruneButton.addEventListener('click', () => {
    const on = pruneButton.getAttribute('aria-pressed') !== 'true';
    pruneButton.setAttribute('aria-pressed', String(on));
    root.querySelector('.v03-cells')!.classList.toggle('is-pruned', on);
    root.querySelector('[data-left]')!.textContent = String(on ? cells.length - cut : cells.length);
    root.querySelector('[data-note]')!.textContent = on ? `${cut} removed. Managed copies deleted, the rest in private backups. The drifted copy stays for you to compare.` : `${cut} are duplicates or skills you forgot you installed.`;
    pruneButton.textContent = on ? 'Put them back' : `Remove the ${cut} local copies`;
  });

  if (reduce) return;
  // Kinetic type: the verb nearest the scroll position widens to 125, the others compress to 62. Section headings widen as they rise.
  const wrap = root.querySelector<HTMLElement>('.v03-stage-wrap')!;
  const rows = [...root.querySelectorAll<HTMLElement>('.v03-row')];
  const capMobile = root.querySelector<HTMLElement>('.v03-cap-mobile')!;
  const kin = [...root.querySelectorAll<HTMLElement>('.v03-kin, .v03-kin-v')];
  let last = -1;
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    const rect = wrap.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - vh))) * (rows.length - 1);
    rows.forEach((row, i) => {
      const t = Math.max(0, 1 - Math.abs(p - i));
      row.style.setProperty('--t', t.toFixed(3));
    });
    const active = Math.round(p);
    if (active !== last) { last = active; capMobile.innerHTML = `<b>${verbs[active].n}</b>${verbs[active].line}`; rows.forEach((row, i) => row.classList.toggle('is-active', i === active)); }
    kin.forEach(el => {
      const top = el.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, (vh * .92 - top) / (vh * .6)));
      el.style.setProperty('--t', t.toFixed(3));
    });
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();
}
