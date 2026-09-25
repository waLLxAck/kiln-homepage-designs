// PROTOTYPE 42 — Haute horlogerie. Kiln presented as a fine movement: the approved revision, the draft, the evidence,
// the receipt and the repository are its components. The movement ticks, then comes apart on scroll.
import './style.css';
import { examples, installer, windowsMark } from '../../content';
import { movement } from './movement';

const P = 'v42';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const assembled = (id: string) => movement(id).map(l => `<div class="${P}-layer" data-layer="${l.key}">${l.svg}</div>`).join('');

// Top of the stack first, so the list reads as you would take the movement apart.
const parts = [
  { key: 'bridges', name: 'The draft', part: 'Bridges', text: 'The part you lift off and rework. Editing a skill makes a new draft; the approved revision beneath it does not move.' },
  { key: 'balance', name: 'The experiment evidence', part: 'Balance wheel', text: 'What regulates trust. Each test run keeps its output, the agent’s assessment and your own judgement against the revision it ran.' },
  { key: 'barrel', name: 'The approved revision', part: 'Barrel', text: 'The reference everything draws from. Approval pins one exact revision, and installs always use approved content.' },
  { key: 'train', name: 'The install receipt', part: 'Going train', text: 'How the work reaches its destination. Each receipt records the revision and the folder it went to, for Codex, Claude Code or Copilot.' },
  { key: 'plate', name: 'The GitHub repository', part: 'Mainplate', text: 'What everything is mounted on. Approval commits and publishes the snapshot to your own Kiln repository, validated without running a thing.' },
];

const complications = [
  { name: 'The library', text: 'Prompts, skills, custom agents in native Codex, Claude Code and Copilot formats, source notes and techniques, held in collections. Search, tags, favorites and filters by kind, status, provider, location and scope.', hand: 40 },
  { name: 'Every copy, accounted for', text: 'For each skill, every installed copy across your personal folders and enrolled projects: installed, identical, differs, linked, or edited outside Kiln. Compare file by file with the approved version.', hand: 130 },
  { name: 'Import without disturbance', text: 'Bring installed skills or a skills repository in as drafts; the originals stay where they are. A scan finds what is not yet in the library and offers to clear broken links and empty folders.', hand: 210 },
  { name: 'The configuration', text: 'CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP, permissions, VS Code and shell profiles. Edited in place, with syntax checks, thirty private backups and restore. Hooks are never run.', hand: 300 },
  { name: 'A second residence', text: 'On another machine, open your repository and press “Install everything marked for this machine”. Or type kiln skills sync. Git status, sync and conflicts are handled inside.', hand: 350 },
  { name: 'The command line', text: 'A CLI for collections, items, experiments, approvals and installs, with JSON results. Your agents can read your library through it.', hand: 80 },
];

const runs = [
  { rev: 'Revision 1', agent: 'Claude Code', effort: 'Medium', time: '1 min 12 s', tin: '38,904', tcache: '21,660', tout: '1,402', verdict: 'Uncertain', mine: 'Revise' },
  { rev: 'Revision 2', agent: 'Codex', effort: 'High', time: '1 min 46 s', tin: '44,120', tcache: '30,008', tout: '2,215', verdict: 'Pass', mine: 'Keep' },
  { rev: 'Revision 2', agent: 'Claude Code', effort: 'Medium', time: '1 min 39 s', tin: '41,862', tcache: '28,114', tout: '1,905', verdict: 'Pass', mine: 'Approved' },
];

const subdial = (hand: number, i: number) => `<svg class="${P}-subdial" viewBox="0 0 80 80" aria-hidden="true">
  <circle cx="40" cy="40" r="36"/><circle cx="40" cy="40" r="30" class="${P}-sub-inner"/>
  ${Array.from({ length: 12 }, (_, t) => { const a = t / 12 * Math.PI * 2; return `<line x1="${40 + Math.cos(a) * 30}" y1="${40 + Math.sin(a) * 30}" x2="${40 + Math.cos(a) * (t % 3 ? 27 : 24)}" y2="${40 + Math.sin(a) * (t % 3 ? 27 : 24)}"/>`; }).join('')}
  <line x1="40" y1="40" x2="40" y2="16" class="${P}-sub-hand" style="--a:${hand}deg;--d:${i * -1.7}s"/>
  <circle cx="40" cy="40" r="2.4" class="${P}-sub-pin"/>
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Precision, down to the exact revision';
  root.innerHTML = `
<a class="skip" href="#${P}-main">Skip to content</a>
<div class="${P}">
  <header class="${P}-top">
    <a class="${P}-mark" href="#${P}-main" aria-label="Kiln, top of page">Kiln</a>
    <nav aria-label="Sections"><a href="#${P}-movement">The movement</a><a href="#${P}-complications">Complications</a><a href="#${P}-testing">The testing</a><a href="#${P}-acquire">Download</a></nav>
  </header>
  <main id="${P}-main">
    <section class="${P}-hero" aria-labelledby="${P}-h1">
      <div class="${P}-hero-copy">
        <p class="${P}-kicker">Kiln 0.17.0, for Windows</p>
        <h1 id="${P}-h1">Precision, down to the exact revision.</h1>
        <p class="${P}-lede">Every skill you rely on, kept at the revision you approved. With the test that earned it, a receipt for every place it was installed, and a record on GitHub of what you signed off.</p>
        <div class="${P}-cta"><a class="${P}-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a><a class="${P}-quiet" href="#${P}-movement">See the movement</a></div>
      </div>
      <figure class="${P}-hero-watch">
        <div class="${P}-case" role="img" aria-label="A watch movement drawn in gold lines, its wheels turning slowly.">${assembled('h')}</div>
        <figcaption>Calibre 0.17. Shown ticking at a leisurely pace.</figcaption>
      </figure>
    </section>

    <section class="${P}-explode" id="${P}-movement" aria-labelledby="${P}-mv-title">
      <div class="${P}-sticky">
        <div class="${P}-explode-head">
          <h2 id="${P}-mv-title">The movement, taken apart.</h2>
          <p>Five components, each with one job. Scroll to separate them.</p>
        </div>
        <div class="${P}-stage-wrap">
          <div class="${P}-stage" role="img" aria-label="Exploded view of the movement in five layers.">${assembled('x')}</div>
        </div>
        <svg class="${P}-leaders" aria-hidden="true"></svg>
        <ol class="${P}-parts">
          ${parts.map((p, i) => `<li data-part="${p.key}"><span class="${P}-num" aria-hidden="true">${['I', 'II', 'III', 'IV', 'V'][i]}</span><div><h3>${p.name}</h3><p class="${P}-part-sub">${p.part}</p><p>${p.text}</p></div></li>`).join('')}
        </ol>
      </div>
    </section>

    <section class="${P}-comps" id="${P}-complications" aria-labelledby="${P}-comp-title">
      <div class="${P}-section-head">
        <h2 id="${P}-comp-title">The complications.</h2>
        <p>What a skills folder never had. Everything on one library, shown plainly.</p>
      </div>
      <ul class="${P}-comp-grid">
        ${complications.map((c, i) => `<li>${subdial(c.hand, i)}<h3>${c.name}</h3><p>${c.text}</p></li>`).join('')}
      </ul>
    </section>

    <section class="${P}-restraint" aria-labelledby="${P}-rs-title">
      <div class="${P}-restraint-inner">
        <h2 id="${P}-rs-title">A fine movement carries no part it does not need.</h2>
        <div class="${P}-restraint-body">
          <p>Every model-invoked skill places its description in your agent’s context on every turn, whether it fires or not. The forgotten one, the duplicate, the stale copy in a project you left: each spends tokens and attention.</p>
          <p>Kiln shows exactly what is installed where, so you can remove what you do not use and keep what earns its place. The writing guidance Kiln uses when it drafts a skill is built around the same restraint: a light context, and a description that triggers well.</p>
          <p class="${P}-fine">Kiln does not compute a token cost per skill. Test runs report their own token usage.</p>
        </div>
      </div>
    </section>

    <section class="${P}-testing" id="${P}-testing" aria-labelledby="${P}-test-title">
      <div class="${P}-section-head">
        <h2 id="${P}-test-title">The testing. Every calibration, recorded.</h2>
        <p>Before a prompt becomes a skill, run it on your own repository through Codex or Claude Code. The run is read-only: nothing in your code changes. You watch the messages, reasoning summaries and commands as they happen, and the result stays with the revision it tested.</p>
      </div>
      <div class="${P}-cert">
        <div class="${P}-cert-head">
          <div><p class="${P}-cert-label">Certificate of testing</p><h3>${examples[1].title}</h3></div>
          <p class="${P}-cert-sample">Sample record. Figures illustrative.</p>
        </div>
        <blockquote class="${P}-prompt"><p>${examples[1].prompt}</p><footer>${examples[1].source}, saved as a prompt</footer></blockquote>
        <div class="${P}-table-wrap" tabindex="0" role="region" aria-label="Test runs, scrollable">
        <table class="${P}-table">
          <caption class="visually-hidden">Sample test runs on a local repository</caption>
          <thead><tr><th scope="col">Revision</th><th scope="col">Agent</th><th scope="col">Effort</th><th scope="col">Elapsed</th><th scope="col">Tokens in</th><th scope="col">Cached</th><th scope="col">Out</th><th scope="col">Agent’s assessment</th><th scope="col">Your judgement</th></tr></thead>
          <tbody>${runs.map(r => `<tr><th scope="row">${r.rev}</th><td data-label="Agent">${r.agent}</td><td data-label="Effort">${r.effort}</td><td data-label="Elapsed">${r.time}</td><td data-label="Tokens in">${r.tin}</td><td data-label="Tokens cached">${r.tcache}</td><td data-label="Tokens out">${r.tout}</td><td data-label="Agent’s assessment">${r.verdict}</td><td data-label="Your judgement" class="${r.mine === 'Approved' ? `${P}-approved` : ''}">${r.mine}</td></tr>`).join('')}</tbody>
        </table>
        </div>
        <dl class="${P}-cert-notes">
          <div><dt>Assessments</dt><dd>Pass, fail or uncertain. A task that needs edits or an unavailable tool returns uncertain rather than a false success.</dd></div>
          <div><dt>Judgement</dt><dd>Kept apart from the agent’s. You decide what stays.</dd></div>
          <div><dt>Adjustment</dt><dd>Edit, compare revisions, run again on the same repository. Up to two runs at once.</dd></div>
        </dl>
      </div>
    </section>

    <section class="${P}-wound" aria-labelledby="${P}-wound-title">
      <h2 id="${P}-wound-title">Wound by what you already own.</h2>
      <p>Kiln works through the Codex or Claude Code already signed in on your machine, on your ChatGPT or Claude subscription. There is no separate API key and no additional API bill. Your plan’s usage limits still apply. Editing, approving and installing never call a model, and a notice tells you what is sent before any agent is involved.</p>
    </section>

    <section class="${P}-acquire" id="${P}-acquire" aria-labelledby="${P}-acq-title">
      <div class="${P}-acquire-ring" aria-hidden="true"></div>
      <h2 id="${P}-acq-title">Kiln 0.17.0 for Windows.</h2>
      <p>With the command line included. MIT licensed.</p>
      <a class="${P}-btn ${P}-btn-solid" href="${installer}">${windowsMark}<span>Download the installer</span></a>
      <p class="${P}-fine">The release is hosted in a private GitHub repository. Sign in with an account that has access. The build is unsigned, so Windows may ask you to confirm. Kiln creates your library repository with the official GitHub CLI.</p>
    </section>
  </main>
</div>`;

  // Exploded view, driven by scroll position through the tall section.
  const section = root.querySelector<HTMLElement>(`.${P}-explode`)!;
  const stage = root.querySelector<HTMLElement>(`.${P}-stage`)!;
  const leaders = root.querySelector<SVGSVGElement>(`.${P}-leaders`)!;
  const items = [...root.querySelectorAll<HTMLElement>(`.${P}-parts li`)];
  const order = ['plate', 'train', 'barrel', 'balance', 'bridges'];
  const layers = order.map(k => stage.querySelector<HTMLElement>(`[data-layer="${k}"]`)!);
  const ease = (a: number, b: number, t: number) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = section.getBoundingClientRect();
    const p = reduced ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
    const tilt = ease(0, .3, p), spread = ease(.18, .8, p);
    stage.style.setProperty('--tilt', String(tilt));
    stage.style.setProperty('--spread', String(spread));
    const wide = innerWidth > 900;
    const wrap = leaders.getBoundingClientRect();
    let lines = '';
    items.forEach((li, n) => {
      const on = spread > (n * .17 + .1) || reduced;
      li.classList.toggle('is-on', on);
      const a = layers[order.indexOf(li.dataset.part!)].querySelector('.v42-anchor')!.getBoundingClientRect();
      if (!wide || !on) return;
      const t = li.querySelector('h3')!.getBoundingClientRect();
      const x1 = a.left + a.width / 2 - wrap.left, y1 = a.top + a.height / 2 - wrap.top;
      const x2 = li.getBoundingClientRect().left - 14 - wrap.left, y2 = t.top + t.height / 2 - wrap.top;
      const mid = x2 - 40;
      lines += `<circle cx="${x1}" cy="${y1}" r="3.5"/><polyline points="${x1},${y1} ${mid},${y2} ${x2},${y2}"/>`;
    });
    leaders.innerHTML = lines;
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
  setTimeout(update, 300);
}
