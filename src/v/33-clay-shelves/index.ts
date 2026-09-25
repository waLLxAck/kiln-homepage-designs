// PROTOTYPE 30 — Clay shelves. Soft claymorphism; a scroll-driven 3D scene sorts a tumbled pile of skill folders onto collection shelves.
import './style.css';
import { examples, installer, installs, provenance, releaseNote, windowsMark } from '../../content';
import { folders, layout, paint, shelfY, shelves } from './scene';

const folderHtml = folders.map(folder => `
  <div class="v30-folder is-${folder.tone} ${folder.drift ? 'is-drift' : ''} is-${folder.role}" aria-hidden="true">
    <span class="v30-plate is-5"></span><span class="v30-plate is-4"></span><span class="v30-plate is-3"></span><span class="v30-plate is-2"></span><span class="v30-plate is-1"></span>
    <span class="v30-face"><span class="v30-tab"></span><span class="v30-fname">${folder.name}</span><span class="v30-fmeta">${folder.role === 'trash' ? (folder.name === 'broken-link' ? 'link to nowhere' : 'no files') : 'SKILL.md'}</span>${folder.badge ? `<span class="v30-badge">${folder.badge}</span>` : ''}</span>
  </div>`).join('');

const captions = [
  `<h1 id="v30-title">Put your skills on shelves.</h1>
   <p class="v30-lede">Right now they’re loose folders in six places. Kiln lifts them into one library, sorts them into collections, and shows every copy you have installed.</p>
   <div class="v30-cta"><a class="v30-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a><a class="v30-textlink" href="#v30-shelf-life">Scroll to tidy up</a></div>
   <p class="v30-fine">Kiln 0.17.0 for Windows, from a private GitHub repository. Sign in with an account that has access.</p>`,
  `<h2>Import what you already have.</h2><p>“Find skills and agents not in the library” scans <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and your projects’ <code>.github/skills</code>. Each one comes in as a draft. The originals stay exactly where they are.</p>`,
  `<h2>Every folder gets a shelf.</h2><p>Collections you name. Search, tags and favorites, and filters by kind, status, provider, location, copy state and scope. Broken links and empty folders get a safe cleanup instead of a guilty glance.</p>`,
  `<h2>Copies stop multiplying.</h2><p>For each skill Kiln lists every installed copy across your personal locations and enrolled projects: installed, identical copy found, differs, or linked. The duplicates fold into the one you keep.</p>`,
  `<h2>Amber means someone touched it.</h2><p><code>code-review</code> was edited outside Kiln. Compare that installed copy file by file with the approved revision, and decide what stays.</p>`,
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Put your skills on shelves';
  const test = examples[1];
  root.innerHTML = `
<div class="v30">
  <header class="v30-top">
    <a class="v30-logo" href="?"><span class="v30-blob" aria-hidden="true"></span>Kiln</a>
    <nav aria-label="Main"><a href="#v30-kinds">Library</a><a href="#v30-copies">Copies</a><a href="#v30-pinned">Approvals</a><a href="#v30-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v30-scene" id="v30-shelf-life" aria-labelledby="v30-title">
      <div class="v30-stage">
        <div class="v30-captions">
          ${captions.map((caption, i) => `<div class="v30-caption ${i === 0 ? 'is-on is-hero' : ''}">${caption}</div>`).join('')}
          <div class="v30-pips" aria-hidden="true">${captions.map(() => '<span></span>').join('')}</div>
        </div>
        <div class="v30-area" role="img" aria-label="A tumbled pile of sample skill folders, including duplicates and an empty folder, lifts and sorts itself onto three shelves named Agent workflows, Game design and Skills to refine. Duplicates fold into their originals and one folder, code-review, glows amber because it was edited outside Kiln.">
          <div class="v30-room">
            ${shelves.map((name, i) => `<div class="v30-shelf" data-shelf="${i}"><span class="v30-plank"></span><span class="v30-shelf-label">${name}<b>3</b></span></div>`).join('')}
            ${folderHtml}
          </div>
          <p class="v30-sample">Sample skill folders</p>
        </div>
      </div>
    </section>

    <section class="v30-section v30-kinds" id="v30-kinds" aria-labelledby="v30-kinds-title">
      <div class="v30-head"><h2 id="v30-kinds-title">A shelf holds more than skills.</h2><p>One library for everything you use to steer an agent, with originals linked back to where they came from.</p></div>
      <ul class="v30-chips">
        <li class="is-lilac is-big"><b>Skills</b><span>SKILL.md folders, imported as drafts</span></li>
        <li class="is-peach is-big"><b>Prompts</b><span>with every revision kept</span></li>
        <li class="is-mint is-big"><b>Custom agents</b><span>in native Codex, Claude Code and Copilot formats</span></li>
        <li class="is-cream"><b>Source notes</b></li><li class="is-lilac"><b>Insights</b></li><li class="is-peach"><b>Techniques</b></li><li class="is-mint"><b>Tools</b></li><li class="is-cream"><b>Resources</b></li>
      </ul>
      <p class="v30-hands">Select with <kbd>Ctrl</kbd>-click, <kbd>Shift</kbd>-click or <kbd>Ctrl</kbd>+<kbd>A</kbd>. Archive, swipe to archive, trash, restore, and undo when your hand slips.</p>
    </section>

    <section class="v30-section v30-copies" id="v30-copies" aria-labelledby="v30-copies-title">
      <div class="v30-head"><h2 id="v30-copies-title">Every copy, accounted for.</h2><p>Pick a skill and Kiln shows where it lives on this machine, and whether each copy still matches what you approved.</p></div>
      <div class="v30-tray">
        <p class="v30-tray-title"><span class="v30-mini is-mint" aria-hidden="true"></span>code-review <small>approved revision 2</small></p>
        <ul class="v30-copies-list">
          ${installs.map(row => `<li class="${row.ok ? '' : 'is-drift'}"><span class="v30-agent">${row.agent}</span><code>${row.path}</code><span class="v30-state">${row.state}</span>${row.ok ? '' : '<button type="button" class="v30-compare" aria-expanded="false" aria-controls="v30-diff">Compare</button>'}</li>`).join('')}
        </ul>
        <div class="v30-diff" id="v30-diff" hidden><p class="is-out">− Review standards and the specification.</p><p class="is-in">+ Review the specification only.</p><small>SKILL.md, installed copy against revision 2</small></div>
      </div>
      <ul class="v30-notes">
        <li><b>Remove local copies</b> in bulk. Copies Kiln manages are deleted; anything else is moved to a private backup first.</li>
        <li><b>Install receipts</b> record which revision went where.</li>
        <li><b>Nothing runs.</b> Kiln validates skills without ever executing them.</li>
      </ul>
    </section>

    <section class="v30-section v30-weight" aria-labelledby="v30-weight-title">
      <div class="v30-head"><h2 id="v30-weight-title">A lighter shelf is a lighter context.</h2><p>Every model-invoked skill’s description sits in your agent’s context on every turn. Forgotten, duplicate and stale skills spend tokens and attention whether they fire or not.</p></div>
      <figure class="v30-jar">
        <div class="v30-pebbles" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<span class="${[2, 5, 6, 9, 11, 13, 14, 17, 19, 20, 22, 23].includes(i) ? 'is-idle' : ''}"></span>`).join('')}</div>
        <figcaption><b>A sample skills folder:</b> 24 installed, 12 of them duplicates or never used. Illustrative, not a measurement.</figcaption>
      </figure>
      <p class="v30-honest">Kiln doesn’t put a token price on each skill. It shows exactly what is installed where, so you can remove what you don’t use and keep what earns its place. When Kiln drafts a skill, its bundled writing-for-agents guidance aims for short descriptions that trigger well.</p>
    </section>

    <section class="v30-section v30-pinned" id="v30-pinned" aria-labelledby="v30-pinned-title">
      <div class="v30-head"><h2 id="v30-pinned-title">Approved means pinned.</h2><p>Approval fixes one exact revision and commits it to your own Kiln GitHub repository. Editing makes a new draft; installs always use approved content.</p></div>
      <ol class="v30-steps">
        ${provenance.map((row, i) => `<li class="${row.state === 'Approved' ? 'is-approved' : row.state === 'Needs review' ? 'is-review' : ''}" style="--i:${i}"><b>${row.event}</b><span>${row.detail}</span><em>${row.state}</em></li>`).join('')}
      </ol>
      <div class="v30-sync">
        <p><b>New laptop?</b> Open your Kiln repository and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>. Git status, sync and conflict resolution are built in.</p>
      </div>
    </section>

    <section class="v30-section v30-config" aria-labelledby="v30-config-title">
      <div class="v30-head"><h2 id="v30-config-title">Config files get a shelf too.</h2><p>Edit the real file in place, with syntax checks, 30 private backups, a diff before you restore, and a warning if it changed on disk while you were editing. Kiln never executes hooks.</p></div>
      <ul class="v30-files">${['CLAUDE.md', 'AGENTS.md', 'config.toml', 'hooks.json', 'Claude settings', 'Copilot settings', 'MCP config', 'permissions', 'VS Code settings', 'shell profile'].map((file, i) => `<li class="is-${['lilac', 'peach', 'mint', 'cream'][i % 4]}">${file}</li>`).join('')}</ul>
    </section>

    <section class="v30-section v30-try" aria-labelledby="v30-try-title">
      <div class="v30-head"><h2 id="v30-try-title">Then take one down and try it.</h2><p>Run any prompt on your own repository through Codex or Claude Code. It’s read-only, you watch it live, and the agent’s pass, fail or uncertain is kept apart from your own judgement.</p></div>
      <figure class="v30-card">
        <figcaption><span class="v30-mini is-lilac" aria-hidden="true"></span>${test.title}<small>${test.source}</small></figcaption>
        <blockquote>${test.prompt}</blockquote>
        <p class="v30-card-foot"><span>Read-only run</span><span>Saved against revision 1</span><span>Becomes a skill once you approve it</span></p>
      </figure>
    </section>

    <section class="v30-download" id="v30-download" aria-labelledby="v30-download-title">
      <h2 id="v30-download-title">Tidy shelves by tonight.</h2>
      <p>Kiln uses your signed-in Codex or Claude Code, so there’s no API key and no extra API bill; your subscription’s usage limits still apply. Organising, approving and installing never call a model.</p>
      <a class="v30-button is-big" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p class="v30-fine">${releaseNote} Builds are unsigned.</p>
    </section>
  </main>
</div>`;

  const scene = root.querySelector<HTMLElement>('.v30-scene')!;
  const area = root.querySelector<HTMLElement>('.v30-area')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let size = layout(area);
  const place = () => {
    size = layout(area);
    scene.style.setProperty('--fw', `${size.fw}px`);
    scene.style.setProperty('--fh', `${size.fh}px`);
    root.querySelectorAll<HTMLElement>('.v30-shelf').forEach(shelf => { shelf.style.setProperty('--y', `${shelfY(size, Number(shelf.dataset.shelf))}px`); });
  };
  const progress = () => {
    if (reduce) return 1;
    const rect = scene.getBoundingClientRect();
    return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)));
  };
  let queued = false;
  const frame = () => { queued = false; paint(scene, size, progress()); };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  place();
  paint(scene, size, progress());
  if (reduce) scene.classList.add('is-static');
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { place(); request(); });
  document.fonts?.ready.then(() => { place(); request(); });

  root.querySelector('.v30-compare')?.addEventListener('click', event => {
    const button = event.currentTarget as HTMLButtonElement;
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Hide' : 'Compare';
    root.querySelector<HTMLElement>('#v30-diff')!.hidden = !open;
  });
}
