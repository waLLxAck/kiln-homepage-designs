// PROTOTYPE variant 16 — Skill Facts. Every installed skill read like an FDA nutrition label, on a tomato-red box.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Copy = [path: string, state: string];
type Skill = { name: string; description: string; tokens: number; copies: Copy[]; revision: string; memory: string; files: string[]; note: string; stale?: boolean };

// Sample shelf. Token figures are illustrative: Kiln lists installs and copies, it doesn't meter tokens per skill.
const shelf: Skill[] = [
  { name: 'code-review', description: 'Review changes against the repo’s standards and the spec, separately.', tokens: 62, copies: [['~/.agents/skills', 'Installed'], ['~/.claude/skills', 'Edited outside Kiln'], ['my-game/.github/skills', 'Installed']], revision: 'r2', memory: 'This morning', files: ['SKILL.md', 'references/standards.md', 'references/spec-check.md'], note: 'Earns its place. One copy has drifted: somebody edited the one in ~/.claude/skills by hand. Compare it with r2 before it teaches your agent the wrong review.' },
  { name: 'research', description: 'Answer a question from primary sources and save the findings as Markdown.', tokens: 48, copies: [['~/.agents/skills', 'Installed'], ['~/.claude/skills', 'Identical copy found']], revision: 'r4', memory: 'Yesterday', files: ['SKILL.md', 'sources.md'], note: 'Used most days. The second copy is identical and arrived some other way, so one location would do.' },
  { name: 'writing-for-agents', description: 'Draft instructions an agent can follow: short, specific, easy to trigger.', tokens: 55, copies: [['~/.claude/skills', 'Installed']], revision: 'r3', memory: 'Last week', files: ['SKILL.md', 'checklist.md'], note: 'Small, specific, reviewed, used. Keep it.' },
  { name: 'pdf-helper-old', description: 'Helps with PDFs. Use for any PDF, document, file or attachment task.', tokens: 71, copies: [['~/.claude/skills', 'Differs'], ['~/.agents/skills', 'Installed']], revision: 'none', memory: 'Can’t remember', files: ['SKILL.md', 'scripts/extract.py', 'notes-v1.md'], stale: true, note: 'Never reviewed, and its description claims every file task there is, so it’s in the running on turns it has no business in.' },
  { name: 'code-review-copy', description: 'Review changes against the repo’s standards and the spec, separately.', tokens: 60, copies: [['~/.claude/skills', 'Identical copy found']], revision: 'none', memory: 'It’s the same skill twice', files: ['SKILL.md', 'references/standards.md'], stale: true, note: 'A duplicate of code-review under another name. Two near-identical descriptions compete for the same trigger.' },
  { name: 'make-it-pop', description: 'Make any interface pop. Use whenever UI, CSS, design or colours come up.', tokens: 84, copies: [['~/.agents/skills', 'Linked'], ['my-game/.github/skills', 'Installed']], revision: 'none', memory: 'March, maybe', files: ['SKILL.md', 'palettes.md', 'inspiration/'], stale: true, note: 'Linked from somewhere, installed in a project, remembered by no one. It still describes itself to your agent every turn.' },
];
const load = (skill: Skill) => skill.tokens * skill.copies.length;
const fullLoad = shelf.reduce((sum, skill) => sum + load(skill), 0);
const hero = shelf[0];
const heroShare = Math.round(load(hero) / fullLoad * 100);

const count = (to: number, suffix = '') => `<span class="v16-num" data-to="${to}" data-suffix="${suffix}">${to.toLocaleString('en-US')}${suffix}</span>`;
const stateClass = (state: string) => state === 'Installed' || state === 'Identical copy found' ? '' : ' is-flag';

const heroLabel = `
<figure class="v16-label v16-hero-label" aria-labelledby="v16-hl-title">
  <h2 class="v16-facts" id="v16-hl-title">Skill Facts</h2>
  <p class="v16-skill-name">${hero.name}</p>
  <p class="v16-desc">“${hero.description}”</p>
  <div class="v16-row v16-row-lg"><span>Serving size</span><strong>Every session</strong></div>
  <div class="v16-row"><span>Copies on this machine</span><strong>${count(hero.copies.length)}</strong></div>
  <hr class="v16-rule-xl">
  <p class="v16-small-b">Amount per turn <em>(sample)</em></p>
  <div class="v16-amount"><span>Always in context</span><strong>${count(hero.tokens)}<small> tokens</small></strong></div>
  <hr class="v16-rule-md">
  <p class="v16-dv-head">% Daily value*</p>
  <div class="v16-row"><span><b>Name and description</b> ${hero.tokens} tok × ${hero.copies.length} copies</span><strong>${count(heroShare, '%')}</strong></div>
  <div class="v16-row v16-indent"><span>Loaded only when it fires: SKILL.md and references, ${count(2380)} tok</span><strong>—</strong></div>
  <div class="v16-row"><span><b>Installed in</b></span><strong></strong></div>
  ${hero.copies.map(([path, state]) => `<div class="v16-row v16-indent"><span><code>${path}</code></span><strong class="v16-state${stateClass(state)}">${state}</strong></div>`).join('')}
  <div class="v16-row"><span><b>Approved revision</b></span><strong>r2, in my-kiln on GitHub</strong></div>
  <div class="v16-row v16-indent"><span>Newer draft</span><strong>r3, needs review</strong></div>
  <div class="v16-row"><span><b>Last test run</b> on r2</span><strong>Agent says pass</strong></div>
  <hr class="v16-rule-xl">
  <figcaption class="v16-foot">* Sample figures for a sample shelf of six skills. Kiln lists every installed copy and its state; it doesn’t meter tokens per skill. Test runs do report their real token usage.</figcaption>
  <p class="v16-ingredients"><b>Ingredients:</b> ${hero.files.join(', ')}.</p>
</figure>`;

const miniLabel = (skill: Skill, index: number) => `
<article class="v16-label v16-mini${skill.stale ? ' is-stale' : ''}" data-i="${index}" data-pos="${index}" aria-labelledby="v16-mini-${index}">
  <h3 class="v16-facts v16-facts-sm">Skill Facts</h3>
  <p class="v16-skill-name" id="v16-mini-${index}">${skill.name}</p>
  <p class="v16-desc">“${skill.description}”</p>
  <div class="v16-row"><span>Serving size</span><strong>Every session</strong></div>
  <hr class="v16-rule-lg">
  <div class="v16-amount v16-amount-sm"><span>Description, per copy <em>(sample)</em></span><strong>${skill.tokens}<small> tok</small></strong></div>
  <hr class="v16-rule-md">
  ${skill.copies.map(([path, state]) => `<div class="v16-row v16-copy"><span><code>${path}</code></span><strong class="v16-state${stateClass(state)}">${state}</strong></div>`).join('')}
  <div class="v16-row"><span><b>Approved revision</b></span><strong>${skill.revision === 'none' ? 'Never reviewed' : skill.revision}</strong></div>
  <div class="v16-row"><span><b>Last used</b> <em>(your memory)</em></span><strong>${skill.memory}</strong></div>
  <hr class="v16-rule-lg">
  <p class="v16-ingredients"><b>Ingredients:</b> ${skill.files.join(', ')}.</p>
  <div class="v16-mini-actions">
    <button type="button" class="v16-remove" data-remove="${index}" aria-pressed="false">Remove local copies</button>
    <p class="v16-stamp" aria-hidden="true">Removed from ${skill.copies.length} ${skill.copies.length === 1 ? 'location' : 'locations'}. Still in your library.</p>
  </div>
</article>`;

const locations = [
  ['~/.claude/skills', 'Claude Code, personal'],
  ['~/.agents/skills', 'Shared by Codex, Copilot and others'],
  ['.codex/skills', 'Codex'],
  ['.copilot/skills', 'Copilot'],
  ['.github/skills', 'Inside each enrolled project'],
];
const states = [
  ['Installed', 'Kiln put it there, from an approved revision, with a receipt.'],
  ['Identical copy found', 'Same files as your library version, arrived some other way.'],
  ['Differs', 'Not the same as the approved version. Compare it file by file.'],
  ['Linked', 'A link pointing somewhere else. Kiln shows where.'],
  ['Edited outside Kiln', 'Drift: someone, maybe you, changed the installed copy by hand.'],
];
const lots = [
  ['r1', 'Imported from ~/.claude/skills as a draft. The original stays where it is.', 'Draft'],
  ['r2', 'Reviews standards and the spec separately. Tested, then approved.', 'Approved'],
  ['r2', 'Committed and published to my-kiln, your own GitHub repository.', 'Published'],
  ['r2', 'Installed to three locations. Each install gets a receipt.', 'Installed'],
  ['r3', 'Added guidance for generated files. A new draft; r2 stays approved.', 'Needs review'],
];
const sample = examples[2];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Know what you’re feeding your agent';
  root.innerHTML = `
<div class="v16">
  <header class="v16-top">
    <a class="v16-brand" href="?" aria-label="Kiln home">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v16-shelf">The shelf</a><a href="#v16-where">Copies</a><a href="#v16-batch">Revisions</a><a href="#v16-test">Tests</a><a href="#v16-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v16-hero" aria-labelledby="v16-title">
      <div class="v16-hero-copy">
        <p class="v16-kicker">Kiln for Windows. A library for prompts, skills and custom agents.</p>
        <h1 id="v16-title">Know what you’re feeding your agent.</h1>
        <p class="v16-lede">Every skill you install puts its description in your agent’s context on every turn, whether it fires or not. Kiln lists every skill, every copy and every folder it sits in, so you can keep the ones that earn their place and clear out the rest.</p>
        <div class="v16-cta">
          <a class="v16-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <a class="v16-textlink" href="#v16-shelf">Read the back of six sample skills</a>
        </div>
        <p class="v16-release">${releaseNote}</p>
      </div>
      ${heroLabel}
    </section>

    <section class="v16-shelf" id="v16-shelf" aria-labelledby="v16-shelf-title">
      <div class="v16-section-head">
        <h2 id="v16-shelf-title">Read the back of every skill you installed.</h2>
        <p>Here’s a sample shelf. Three skills you use, a duplicate, a catch-all that fires on anything, and one you can’t place. They all ride along in every session. Flip through them, compare them side by side, then remove the local copies you don’t use and watch the daily value drop.</p>
      </div>
      <div class="v16-shelf-grid">
        <div class="v16-stack-wrap">
          <div class="v16-controls" role="group" aria-label="Sample skill labels">
            <button type="button" class="v16-flip" data-by="-1" aria-label="Previous label">Previous</button>
            <p class="v16-counter" aria-live="polite"><span data-counter>1</span> of ${shelf.length}</p>
            <button type="button" class="v16-flip" data-by="1" aria-label="Next label">Next</button>
            <button type="button" class="v16-mode" aria-pressed="false">Compare side by side</button>
          </div>
          <div class="v16-stack-row">
            <div class="v16-stack" data-mode="stack" tabindex="0" aria-label="Label stack. Use the left and right arrow keys to flip.">${shelf.map(miniLabel).join('')}</div>
            <div class="v16-verdict" aria-live="polite"><p class="v16-verdict-name" data-vname>${shelf[0].name}</p><p data-vnote>${shelf[0].note}</p></div>
          </div>
        </div>
        <aside class="v16-label v16-intake" aria-labelledby="v16-intake-title">
          <h3 class="v16-facts v16-facts-sm" id="v16-intake-title">Daily Intake</h3>
          <p class="v16-desc">Skill descriptions your agents carry into every turn, across all installed copies. <em>Sample shelf.</em></p>
          <hr class="v16-rule-xl">
          <div class="v16-amount"><span>Per turn</span><strong><span data-total>${fullLoad}</span><small> tokens</small></strong></div>
          <div class="v16-bar" aria-hidden="true">${shelf.map((skill, i) => `<span data-seg="${i}" class="${skill.stale ? 'is-stale' : ''}" style="--w:${(load(skill) / fullLoad * 100).toFixed(2)}%"></span>`).join('')}</div>
          <hr class="v16-rule-md">
          <p class="v16-dv-head">% of today’s load</p>
          ${shelf.map((skill, i) => `<div class="v16-row" data-line="${i}"><span>${skill.name} <small>× ${skill.copies.length}</small></span><strong>${Math.round(load(skill) / fullLoad * 100)}%</strong></div>`).join('')}
          <hr class="v16-rule-lg">
          <div class="v16-row v16-row-lg"><span>Total daily value</span><strong><span data-dv>100</span>%</strong></div>
          <p class="v16-foot" aria-live="polite" data-intake-note>Nothing removed yet. Try the three you can’t vouch for.</p>
        </aside>
      </div>
      <p class="v16-honest"><strong>The honest part:</strong> the numbers above are made up for a sample shelf. Kiln doesn’t count tokens per skill. It shows you exactly what’s installed where, and its bundled writing-for-agents guidance, which it uses when it drafts skills, is built around context load, pruning and descriptions that trigger well.</p>
    </section>

    <section class="v16-where" id="v16-where" aria-labelledby="v16-where-title">
      <div class="v16-section-head">
        <h2 id="v16-where-title">One skill. Five folders. Pick the true one.</h2>
        <p>Skills today are folders scattered wherever an agent looks for them, plus prompts buried in chats, notes and bookmarks. Kiln scans the personal locations and your enrolled projects, and shows each copy next to the version you approved.</p>
      </div>
      <div class="v16-where-grid">
        <div class="v16-label v16-sheet">
          <h3 class="v16-sheet-title">Found in</h3>
          <hr class="v16-rule-lg">
          ${locations.map(([path, who]) => `<div class="v16-row"><span><code>${path}</code></span><strong>${who}</strong></div>`).join('')}
          <hr class="v16-rule-lg">
          <p class="v16-foot">Find skills and agents not in the library scans these locations. Import what it finds, or a whole skills repository, as drafts; the originals stay where they are. It also offers safe cleanup of broken links and empty folders.</p>
        </div>
        <div class="v16-label v16-sheet">
          <h3 class="v16-sheet-title">Copy states</h3>
          <hr class="v16-rule-lg">
          <dl class="v16-states">${states.map(([state, meaning]) => `<div><dt class="v16-state${stateClass(state)}">${state}</dt><dd>${meaning}</dd></div>`).join('')}</dl>
        </div>
        <div class="v16-actions">
          <div class="v16-action">
            <h3>Compare, file by file</h3>
            <p>Open a drifted copy next to the approved revision and see exactly which lines moved.</p>
            <button type="button" class="v16-outline" aria-expanded="false" aria-controls="v16-diff">Compare ~/.claude/skills/code-review</button>
            <div class="v16-diff" id="v16-diff" hidden>
              <p class="v16-diff-file">SKILL.md</p>
              <p class="is-del">− Review the repo’s standards and the spec, separately.</p>
              <p class="is-add">+ Review the spec. Skip style.</p>
              <p class="v16-diff-file">references/standards.md</p>
              <p class="is-same">  No differences.</p>
            </div>
          </div>
          <div class="v16-action">
            <h3>Remove local copies, in bulk</h3>
            <p>Select a handful and remove them. Copies Kiln installed are deleted. Anything else is moved to a private backup, not thrown away. The library entry stays.</p>
          </div>
          <div class="v16-receipt" aria-label="Sample install receipt">
            <p class="v16-receipt-head">Install receipt <em>(sample)</em></p>
            <p><span>Skill</span><b>code-review</b></p>
            <p><span>Revision</span><b>r2, approved</b></p>
            <p><span>Destination</span><b>my-game/.github/skills</b></p>
            <p><span>Content</span><b>From the approved snapshot</b></p>
          </div>
        </div>
      </div>
    </section>

    <section class="v16-batch" id="v16-batch" aria-labelledby="v16-batch-title">
      <div class="v16-section-head">
        <h2 id="v16-batch-title">The label matches what’s in the jar.</h2>
        <p>Approval pins an exact revision. Editing makes a new draft and never replaces the approved one, and installs always use approved content. Each approval is committed and published to your own Kiln repository on GitHub, in a standard layout, checked by validation that never runs a skill.</p>
      </div>
      <div class="v16-batch-grid">
      <p class="v16-big-rev" aria-hidden="true"><span>r2</span></p>
      <p class="v16-big-rev-cap">The revision on the label is the revision in every install. Editing it again starts r3, a draft, until you approve it.</p>
      <div class="v16-label v16-lot">
        <h3 class="v16-sheet-title">Batch record: code-review</h3>
        <hr class="v16-rule-xl">
        <ol>${lots.map(([rev, text, state]) => `<li><b class="v16-lot-rev">${rev}</b><span>${text}</span><strong class="v16-state${state === 'Needs review' ? ' is-flag' : ''}">${state}</strong></li>`).join('')}</ol>
        <hr class="v16-rule-lg">
        <p class="v16-foot">On another machine, open the repository and press <b>Install everything marked for this machine</b>, or run <code>kiln skills sync</code>. Git status, sync and conflict resolution are built in.</p>
      </div>
      </div>
    </section>

    <section class="v16-test" id="v16-test" aria-labelledby="v16-test-title">
      <div class="v16-section-head">
        <h2 id="v16-test-title">Taste it before it goes on the shelf.</h2>
        <p>Before a prompt becomes a skill, run the exact revision against a local repository through Codex or Claude Code. You watch the messages, reasoning summaries, commands and web searches as they happen. Experiments are read-only, so nothing in your code changes. This is where the real numbers are.</p>
      </div>
      <div class="v16-test-grid">
        <div class="v16-prompt">
          <p class="v16-prompt-src">${sample.source}: <b>${sample.title}</b></p>
          <blockquote>${sample.prompt}</blockquote>
          <p class="v16-prompt-repo">Tested on <code>./my-game</code>, read-only</p>
        </div>
        <figure class="v16-label v16-run" aria-labelledby="v16-run-title">
          <h3 class="v16-facts v16-facts-sm" id="v16-run-title">Run Facts</h3>
          <p class="v16-desc">Every test run reports these itself. The values here are a sample.</p>
          <div class="v16-row"><span>Agent</span><strong>Claude Code</strong></div>
          <div class="v16-row"><span>Reasoning effort</span><strong>Medium</strong></div>
          <div class="v16-row"><span>Elapsed</span><strong>3 min 12 s</strong></div>
          <hr class="v16-rule-xl">
          <p class="v16-small-b">Token usage</p>
          <div class="v16-row v16-row-lg"><span>Input</span><strong>${count(48210)}</strong></div>
          <div class="v16-row v16-indent"><span>of which cached</span><strong>${count(31904)}</strong></div>
          <div class="v16-row v16-row-lg"><span>Output</span><strong>${count(2318)}</strong></div>
          <hr class="v16-rule-md">
          <div class="v16-row"><span><b>Agent’s assessment</b></span><strong class="v16-state">Pass</strong></div>
          <div class="v16-row"><span><b>Your judgement</b></span><strong>Yours to make</strong></div>
          <hr class="v16-rule-lg">
          <figcaption class="v16-foot">Pass, fail or uncertain. A task that needs edits or unavailable tools comes back uncertain rather than as a faked success. Up to two runs at once; cancel or retry either.</figcaption>
        </figure>
      </div>
    </section>

    <section class="v16-box" aria-labelledby="v16-box-title">
      <h2 id="v16-box-title" class="visually-hidden">Everything else in the box</h2>
      <p class="v16-ing-list"><b>Ingredients:</b> prompts, skills, custom agent definitions (in native Codex, Claude Code and Copilot formats), source notes, insights, techniques, tools and resources, collections, search, tags, favorites, filters (kind, status, provider, location, copy state, scope, tag), bulk selection, archive, trash and restore, undo. <b>Capture:</b> paste or drop text, links, screenshots and files; tray icon; quick search with Ctrl+Shift+Space; Ctrl+N. “Save only” keeps a source without calling a model; “Analyze and add” turns it into entries. <b>YouTube:</b> captions distilled into entries with timestamped source links, transcript attached. <b>Config files:</b> CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, permissions, VS Code settings and shell profiles, edited in place with syntax checks, 30 private backups, diff and restore. Kiln never runs hooks. <b>CLI:</b> scripts collections, experiments, approvals and installs, with JSON results your agents can read.</p>
      <div class="v16-allergy">
        <p><b>Contains:</b> your existing, signed-in Codex or Claude Code, on your ChatGPT or Claude subscription. No API key. No extra API bill.</p>
        <p><b>May contain:</b> your subscription’s usage limits, which still apply. Editing, approving and installing never call a model, and a consent notice explains what’s sent before any agent interaction.</p>
        <p><b>Storage:</b> the library lives on your machine and is backed by a GitHub repository Kiln creates for you with the official <code>gh</code> CLI. Not an offline or account-free product.</p>
      </div>
    </section>
  </main>

  <footer class="v16-download" id="v16-download" aria-labelledby="v16-dl-title">
    <div class="v16-label v16-kiln-label">
      <h2 class="v16-facts" id="v16-dl-title">Kiln Facts</h2>
      <div class="v16-row v16-row-lg"><span>Serving size</span><strong>1 Windows desktop app, plus a CLI</strong></div>
      <hr class="v16-rule-xl">
      <div class="v16-row"><span><b>Release</b></span><strong>0.17.0</strong></div>
      <div class="v16-row"><span><b>Runs tests through</b></span><strong>Codex, Claude Code</strong></div>
      <div class="v16-row"><span><b>Installs skills for</b></span><strong>Codex, Claude Code, Copilot</strong></div>
      <div class="v16-row"><span><b>Licence</b></span><strong>MIT</strong></div>
      <hr class="v16-rule-lg">
      <a class="v16-button v16-button-dark" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="v16-foot">${releaseNote} Builds are unsigned, so Windows may ask before it runs the installer.</p>
      <p class="v16-barcode" aria-hidden="true">Kiln 0.17.0</p>
    </div>
  </footer>
</div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tween = (element: HTMLElement, from: number, to: number, suffix = '', duration = 1100) => {
    if (reduced) { element.textContent = `${to.toLocaleString('en-US')}${suffix}`; return; }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = `${Math.round(from + (to - from) * eased).toLocaleString('en-US')}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Count up each label's numbers the first time it scrolls into view.
  const seen = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    seen.unobserve(entry.target);
    entry.target.querySelectorAll<HTMLElement>('.v16-num').forEach(number => tween(number, 0, Number(number.dataset.to), number.dataset.suffix ?? ''));
  }), { threshold: .3 });
  root.querySelectorAll('.v16-hero-label, .v16-run').forEach(label => seen.observe(label));

  // The stack: flip through, or spread out to compare.
  const stack = root.querySelector<HTMLElement>('.v16-stack')!;
  const minis = [...stack.querySelectorAll<HTMLElement>('.v16-mini')];
  const counter = root.querySelector<HTMLElement>('[data-counter]')!;
  const flips = root.querySelectorAll<HTMLButtonElement>('.v16-flip');
  let top = 0;
  const place = () => {
    minis.forEach((mini, i) => {
      const pos = (i - top + minis.length) % minis.length;
      mini.dataset.pos = String(pos);
      mini.inert = stack.dataset.mode === 'stack' && pos !== 0;
    });
    counter.textContent = String(top + 1);
    root.querySelector<HTMLElement>('[data-vname]')!.textContent = shelf[top].name;
    root.querySelector<HTMLElement>('[data-vnote]')!.textContent = shelf[top].note;
  };
  const flip = (by: number) => {
    const leaving = minis[top];
    top = (top + by + minis.length) % minis.length;
    if (!reduced && by > 0) leaving.animate([{ transform: 'none', zIndex: 20 }, { transform: 'translate(-58%, -4%) rotate(-9deg)', zIndex: 20, offset: .45 }, { transform: 'translate(-20%, 2%) rotate(-3deg)', zIndex: 0, offset: .55 }, { transform: 'translate(34px, 26px) rotate(5deg)', zIndex: 0 }], { duration: 620, easing: 'cubic-bezier(.4,0,.2,1)' });
    if (!reduced && by < 0) minis[top].animate([{ transform: 'translate(34px, 26px) rotate(5deg)', zIndex: 0 }, { transform: 'translate(-58%, -4%) rotate(-9deg)', zIndex: 0, offset: .45 }, { transform: 'translate(-50%, -4%) rotate(-8deg)', zIndex: 20, offset: .55 }, { transform: 'none', zIndex: 20 }], { duration: 620, easing: 'cubic-bezier(.4,0,.2,1)' });
    place();
  };
  flips.forEach(button => button.addEventListener('click', () => flip(Number(button.dataset.by))));
  stack.addEventListener('keydown', event => {
    if (stack.dataset.mode !== 'stack' || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    flip(event.key === 'ArrowRight' ? 1 : -1);
  });
  const mode = root.querySelector<HTMLButtonElement>('.v16-mode')!;
  mode.addEventListener('click', () => {
    const compare = stack.dataset.mode === 'stack';
    stack.dataset.mode = compare ? 'compare' : 'stack';
    mode.setAttribute('aria-pressed', String(compare));
    mode.textContent = compare ? 'Stack them again' : 'Compare side by side';
    flips.forEach(button => { button.disabled = compare; });
    place();
  });
  place();

  // Removing local copies drops the sample daily value.
  const removed = new Set<number>();
  const total = root.querySelector<HTMLElement>('[data-total]')!;
  const dv = root.querySelector<HTMLElement>('[data-dv]')!;
  const note = root.querySelector<HTMLElement>('[data-intake-note]')!;
  let shown = fullLoad;
  root.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button => button.addEventListener('click', () => {
    const i = Number(button.dataset.remove);
    const off = !removed.has(i);
    if (off) removed.add(i); else removed.delete(i);
    button.setAttribute('aria-pressed', String(off));
    button.textContent = off ? 'Undo' : 'Remove local copies';
    minis[i].classList.toggle('is-removed', off);
    root.querySelector<HTMLElement>(`[data-seg="${i}"]`)!.classList.toggle('is-gone', off);
    root.querySelector<HTMLElement>(`[data-line="${i}"]`)!.classList.toggle('is-gone', off);
    const now = shelf.reduce((sum, skill, j) => sum + (removed.has(j) ? 0 : load(skill)), 0);
    tween(total, shown, now, '', 700);
    tween(dv, Math.round(shown / fullLoad * 100), Math.round(now / fullLoad * 100), '', 700);
    shown = now;
    const copies = [...removed].reduce((sum, j) => sum + shelf[j].copies.length, 0);
    note.textContent = removed.size ? `Removed ${copies} local ${copies === 1 ? 'copy' : 'copies'} of ${removed.size} ${removed.size === 1 ? 'skill' : 'skills'}. The library entries stay, and anything Kiln didn’t install went to a private backup.` : 'Nothing removed yet. Try the three you can’t vouch for.';
  }));

  const compare = root.querySelector<HTMLButtonElement>('[aria-controls="v16-diff"]')!;
  compare.addEventListener('click', () => {
    const open = compare.getAttribute('aria-expanded') !== 'true';
    compare.setAttribute('aria-expanded', String(open));
    root.querySelector<HTMLElement>('#v16-diff')!.hidden = !open;
  });
}
