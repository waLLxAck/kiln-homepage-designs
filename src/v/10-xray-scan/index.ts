// PROTOTYPE variant 07 — X-ray scan. A sample skills folder tree on radiograph film; a scanner sweep reveals the findings, then a treatment plan.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Node = { depth: 0 | 1; name: string; file?: string; finding?: string; note?: string; state?: 'ok' | 'bad' | 'faint' };
const tree: Node[] = [
  { depth: 0, name: '~/.claude/skills' },
  { depth: 1, name: 'code-review/', file: 'SKILL.md', finding: 'B', note: 'Edited outside Kiln. Differs from approved revision 2.' },
  { depth: 1, name: 'pdf-helper/', file: 'SKILL.md', finding: 'A', note: 'Not in the library. Nobody remembers installing it.' },
  { depth: 1, name: 'deploy-notes', file: '→ ../old/deploy-notes', finding: 'C', note: 'Broken link. The target folder is gone.', state: 'faint' },
  { depth: 1, name: 'research/', file: 'SKILL.md', state: 'ok' },
  { depth: 0, name: '~/.agents/skills' },
  { depth: 1, name: 'code-review/', file: 'SKILL.md', state: 'ok', note: 'Approved revision 2. Matches.' },
  { depth: 1, name: 'research-old/', file: '(empty)', finding: 'D', note: 'Empty folder, left behind.', state: 'faint' },
  { depth: 1, name: 'writing-for-agents/', file: 'SKILL.md', state: 'ok' },
  { depth: 0, name: 'my-repo/.github/skills' },
  { depth: 1, name: 'playtest/', file: 'SKILL.md', state: 'ok' },
  { depth: 1, name: 'release-notes/', file: 'SKILL.md', finding: 'E', note: 'Stale draft from spring. Still described to the agent every turn.' },
];

const findings = [
  { key: 'A', title: 'A copy found outside the library', where: '~/.claude/skills/pdf-helper', body: 'An installed skill Kiln has never seen. “Find skills and agents not in the library” scans your locations and lists it.', plan: 'Import it as a draft. The original stays where it is until you decide.' },
  { key: 'B', title: 'Edited outside Kiln', where: '~/.claude/skills/code-review', body: 'Someone, possibly you at 1am, changed the installed copy by hand. It no longer matches the revision you approved.', plan: 'Compare the installed copy file by file with the approved version, then reinstall or keep the change as a new draft.' },
  { key: 'C', title: 'Broken link', where: '~/.claude/skills/deploy-notes', body: 'A link pointing at a folder that no longer exists.', plan: 'Safe cleanup removes it. Nothing with content is touched.' },
  { key: 'D', title: 'Empty folder', where: '~/.agents/skills/research-old', body: 'A folder with nothing in it, left over from an old install.', plan: 'Safe cleanup removes it along with the other empties.' },
  { key: 'E', title: 'Stale draft', where: 'my-repo/.github/skills/release-notes', body: 'Never approved, rarely used, and its description still sits in the agent’s context on every turn.', plan: 'Remove local copies. Managed copies are deleted; anything else moves to a private backup. It stays in your library.' },
];

const copies = [
  { where: 'Agents', path: '~/.agents/skills/code-review', state: 'Installed', tone: 'ok' },
  { where: 'Codex', path: '~/.codex/skills/code-review', state: 'Identical copy found', tone: 'ok' },
  { where: 'Claude Code', path: '~/.claude/skills/code-review', state: 'Edited outside Kiln', tone: 'bad' },
  { where: 'Copilot', path: '~/.copilot/skills/code-review', state: 'Linked', tone: 'ok' },
  { where: 'Game project', path: '.github/skills/code-review', state: 'Differs', tone: 'warn' },
];

const row = (node: Node, i: number) => `
  <li class="v07-node is-d${node.depth} ${node.finding ? 'has-finding' : ''} ${node.state ? `is-${node.state}` : ''}" data-i="${i}">
    <span class="v07-path"><span class="v07-bone" aria-hidden="true"></span><span class="v07-name">${node.name}</span>${node.file ? `<span class="v07-file">${node.file}</span>` : ''}${node.finding ? `<span class="v07-mark" aria-hidden="true">${node.finding}</span>` : ''}</span>
    ${node.note ? `<span class="v07-note">${node.finding ? `<span class="visually-hidden">Finding ${node.finding}: </span>` : ''}${node.note}</span>` : ''}
  </li>`;

const turns = 8;
const skillsInContext = [
  { name: 'code-review', used: [1, 4, 7] },
  { name: 'research', used: [2] },
  { name: 'writing-for-agents', used: [] },
  { name: 'pdf-helper', used: [] },
  { name: 'release-notes', used: [] },
  { name: 'playtest', used: [5] },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — See what’s really loaded into your agent';
  root.innerHTML = `
<div class="v07">
  <header class="v07-top">
    <a class="v07-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v07-findings">Findings</a><a href="#v07-copies">Copies</a><a href="#v07-plan">Treatment plan</a><a href="#v07-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v07-hero" aria-labelledby="v07-title">
      <div class="v07-hero-copy">
        <h1 id="v07-title">See what’s really loaded into your agent.</h1>
        <p>Skills pile up in <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and every project’s <code>.github/skills</code>. Kiln is a Windows app that shows you every copy, compares it with what you approved, and removes what you don’t use.</p>
        <div class="v07-cta">
          <a class="v07-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
          <p>Release 0.17.0, in a private GitHub repository. You’ll need an account with access.</p>
        </div>
      </div>
      <figure class="v07-box">
        <div class="v07-film" role="img" aria-labelledby="v07-film-cap">
          <div class="v07-film-head" aria-hidden="true">
            <span><b>SAMPLE STUDY</b><br>Skills survey, one laptop</span>
            <span class="v07-side">R</span>
            <span class="v07-film-date">24 SEP 2026<br>3 locations, 9 folders</span>
          </div>
          <ol class="v07-tree">${tree.map(row).join('')}</ol>
          <div class="v07-scan" aria-hidden="true"><span>SCAN</span></div>
          <p class="v07-edge" aria-hidden="true">KILN-07 SAMPLE FILM, NOT A REAL MACHINE</p>
        </div>
        <figcaption id="v07-film-cap">
          <span>A sample folder tree scanned for problems. Five findings: a skill copy found outside the library, a copy edited outside Kiln, a broken link, an empty folder and a stale draft.</span>
          <button type="button" class="v07-rescan">Scan again</button>
        </figcaption>
      </figure>
    </section>

    <section class="v07-report" id="v07-findings" aria-labelledby="v07-report-title">
      <div class="v07-report-head">
        <h2 id="v07-report-title">Report</h2>
        <dl>
          <div><dt>Question</dt><dd>What does this agent load before it does anything?</dd></div>
          <div><dt>Method</dt><dd>Kiln scans personal locations and enrolled projects. Nothing is changed by looking.</dd></div>
        </dl>
      </div>
      <ol class="v07-findings">
        ${findings.map(f => `
        <li class="v07-finding">
          <span class="v07-finding-key" aria-hidden="true">${f.key}</span>
          <div>
            <h3>${f.title}</h3>
            <p class="v07-where"><code>${f.where}</code></p>
            <p>${f.body}</p>
          </div>
          <p class="v07-rx"><span>Kiln</span>${f.plan}</p>
        </li>`).join('')}
      </ol>
    </section>

    <section class="v07-load" aria-labelledby="v07-load-title">
      <div class="v07-load-copy">
        <h2 id="v07-load-title">Every description rides along on every turn.</h2>
        <p>A model-invoked skill’s description sits in your agent’s context all the time, whether it fires or not. Forgotten, duplicate and stale skills spend tokens and attention on every message. The fix isn’t clever: know what’s installed where, and keep only what earns its place.</p>
        <p class="v07-honest">Kiln doesn’t measure a per-skill token cost. It shows you exactly what’s installed so you can prune. Test runs do show real token usage: input, cached and output.</p>
      </div>
      <figure class="v07-strip">
        <div class="v07-strip-film" role="img" aria-label="Illustration: eight turns of a conversation. The same six skill descriptions are present in every turn; most are used in none of them.">
          ${Array.from({ length: turns }, (_, t) => `
          <div class="v07-turn">
            <span class="v07-turn-label">Turn ${t + 1}</span>
            ${skillsInContext.map(s => `<span class="v07-desc ${s.used.includes(t + 1) ? 'is-used' : s.used.length ? '' : 'is-idle'}"></span>`).join('')}
            <span class="v07-msg"></span>
          </div>`).join('')}
        </div>
        <ul class="v07-legend">
          ${skillsInContext.map(s => `<li class="${s.used.length ? '' : 'is-idle'}"><span></span>${s.name}${s.used.length ? '' : ', never used'}</li>`).join('')}
        </ul>
        <figcaption>Illustrative, not measured. Each band is one skill description, present in every turn. Orange bands are skills that never fired in this sample.</figcaption>
      </figure>
    </section>

    <section class="v07-copies" id="v07-copies" aria-labelledby="v07-copies-title">
      <div class="v07-copies-head">
        <h2 id="v07-copies-title">One skill, every copy, side by side.</h2>
        <p>Open a skill in Kiln and see every installed copy across your personal locations and enrolled projects. Compare any copy with the approved version, file by file. Then remove local copies in bulk.</p>
      </div>
      <div class="v07-lightbox">
        <table class="v07-table">
          <caption><span class="v07-cap"><span>code-review</span><span>Sample: five copies found</span></span></caption>
          <thead><tr><th scope="col">Location</th><th scope="col">Path</th><th scope="col">State</th></tr></thead>
          <tbody>${copies.map(c => `<tr class="is-${c.tone}"><th scope="row">${c.where}</th><td><code>${c.path}</code></td><td><span class="v07-state">${c.state}</span></td></tr>`).join('')}</tbody>
        </table>
        <div class="v07-actions">
          <button type="button" class="v07-compare" aria-expanded="false" aria-controls="v07-diff">Compare the Claude Code copy</button>
          <button type="button" class="v07-remove">Remove local copies</button>
        </div>
        <div class="v07-diff" id="v07-diff" hidden>
          <p class="v07-diff-file">SKILL.md, approved revision 2 against the installed copy</p>
          <p class="is-ctx">&nbsp; Review the change against the repository’s standards.</p>
          <p class="is-del">− Review standards and the specification separately.</p>
          <p class="is-add">+ Review the specification only. Skip style.</p>
        </div>
        <p class="v07-remove-note" aria-live="polite"></p>
      </div>
    </section>

    <section class="v07-plan" id="v07-plan" aria-labelledby="v07-plan-title">
      <h2 id="v07-plan-title">Treatment plan</h2>
      <ol class="v07-steps">
        <li><h3>Import as drafts</h3><p>Bring in installed skills or a whole skills repository. They arrive as drafts for review; the originals stay where they are.</p></li>
        <li><h3>Approve exact revisions</h3><p>Approval pins one revision. Editing creates a new draft and never replaces it. Kiln commits and publishes the snapshot to your own Kiln GitHub repository, with validation that never executes skills.</p></li>
        <li><h3>Install with receipts</h3><p>Install always uses approved content, into compatible Codex, Claude Code or Copilot locations. Each receipt records the revision and the destination.</p></li>
        <li><h3>Follow up on another machine</h3><p>Open the repo and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>. Git status, sync and conflict resolution are built in.</p></li>
      </ol>
      <aside class="v07-also">
        <h3>Also examined: your config files</h3>
        <p>CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, permissions, VS Code settings and shell profiles, in one place. Kiln edits the real file with syntax validation and notices when it changed on disk. It keeps 30 private backups per file with a diff before you restore, and never executes hooks.</p>
      </aside>
    </section>

    <section class="v07-referral" aria-labelledby="v07-ref-title">
      <div>
        <h2 id="v07-ref-title">Before anything new goes in, test it.</h2>
        <p>Kiln runs a prompt on your own repository through your signed-in Codex or Claude Code, read-only, so nothing in your code changes. You watch the run live, and the output and the agent’s pass, fail or uncertain assessment stay with that revision. When it proves itself, “Create skill” drafts a SKILL.md and you approve it.</p>
        <p class="v07-sub">${subscription.text} ${subscription.fine}</p>
      </div>
      <figure class="v07-sample">
        <figcaption>A prompt worth testing on your own repo</figcaption>
        <p class="v07-sample-title">${examples[1].title}</p>
        <blockquote>${examples[1].prompt}</blockquote>
      </figure>
    </section>

    <section class="v07-download" id="v07-download" aria-labelledby="v07-dl-title">
      <h2 id="v07-dl-title">Get a clear picture of your skills folders.</h2>
      <a class="v07-button" href="${installer}">${windowsMark}<span>Download the Windows installer</span></a>
      <p>${releaseNote}</p>
      <p class="v07-fine">Builds are unsigned. The library lives on your machine and is backed by a GitHub repository Kiln creates for you with the official gh CLI.</p>
    </section>
  </main>
</div>`;

  const film = root.querySelector<HTMLElement>('.v07-film')!;
  const scan = root.querySelector<HTMLElement>('.v07-scan')!;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('.v07-node'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;
  const sweep = () => {
    cancelAnimationFrame(frame);
    nodes.forEach(node => node.classList.remove('is-seen'));
    film.classList.remove('is-done');
    if (reduced) { nodes.forEach(node => node.classList.add('is-seen')); film.classList.add('is-done'); return; }
    const duration = 2000, start = performance.now() + 250;
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const y = eased * film.clientHeight;
      scan.style.transform = `translateY(${y}px)`;
      scan.style.opacity = p >= 1 ? '0' : '1';
      nodes.forEach(node => { if (node.offsetTop + node.offsetHeight / 2 < y) node.classList.add('is-seen'); });
      if (p < 1) frame = requestAnimationFrame(step); else { nodes.forEach(node => node.classList.add('is-seen')); film.classList.add('is-done'); }
    };
    frame = requestAnimationFrame(step);
  };
  sweep();
  root.querySelector('.v07-rescan')!.addEventListener('click', sweep);

  const compare = root.querySelector<HTMLButtonElement>('.v07-compare')!;
  compare.addEventListener('click', () => {
    const open = compare.getAttribute('aria-expanded') !== 'true';
    compare.setAttribute('aria-expanded', String(open));
    compare.textContent = open ? 'Hide comparison' : 'Compare the Claude Code copy';
    root.querySelector<HTMLElement>('#v07-diff')!.hidden = !open;
  });
  const remove = root.querySelector<HTMLButtonElement>('.v07-remove')!;
  remove.addEventListener('click', () => {
    const removing = remove.dataset.done !== 'true';
    root.querySelectorAll('.v07-table tbody tr').forEach(tr => tr.classList.toggle('is-removed', removing));
    remove.dataset.done = String(removing);
    remove.textContent = removing ? 'Undo' : 'Remove local copies';
    root.querySelector<HTMLElement>('.v07-remove-note')!.textContent = removing
      ? 'Sample: five local copies removed. Managed copies deleted; the edited Claude Code copy moved to a private backup. code-review stays in your library.'
      : '';
  });
}
