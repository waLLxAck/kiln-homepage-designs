// PROTOTYPE 26 — Ensō. Quiet Japanese minimalism: pale grey paper, sumi ink, one vermilion seal. One idea, tried properly.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';
import { ensoSvg, sealSvg } from './enso';

const prompt = examples[2];

const moment = (id: string, vertical: string, body: string, extra = '', place = '') => `
<section class="v26-moment ${place}" aria-labelledby="${id}">
  <h2 class="v26-v" id="${id}">${vertical}</h2>
  <div class="v26-body">${body}${extra}</div>
</section>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — One idea, tried properly';
  root.innerHTML = `
<div class="v26">
  <header class="v26-top">
    <a class="v26-mark" href="?">Kiln</a>
    <a class="v26-quiet-link" href="#v26-begin">Download</a>
  </header>
  <main id="main">
    <section class="v26-hero" aria-labelledby="v26-title">
      <div class="v26-circle">
        ${ensoSvg('v26-e', 'An ensō, a single brush circle, painted in black ink')}
        <h1 class="v26-v v26-title" id="v26-title"><span>One idea,</span> <span>tried</span> <span>properly.</span></h1>
      </div>
      <p class="v26-lede">Kiln is a Windows app for people who work with Codex or Claude Code. Take one prompt you saved, run it on your own repository, and keep it only if it earns its place.</p>
      <span class="v26-breath" aria-hidden="true"></span>
    </section>

    ${moment('v26-s1', 'You saved it.', `<p>You meant to try it later.</p><p class="v26-soft">Later is a long place. The bookmark, the screenshot and the note are still there, untried.</p>`)}

    ${moment('v26-s2', 'Choose one.', `<p>Not fifty. One.</p>`, `
      <figure class="v26-prompt">
        <figcaption>${prompt.title}<span>${prompt.source.toLowerCase()}</span></figcaption>
        <blockquote>${prompt.prompt}</blockquote>
      </figure>
      <p class="v26-soft">The rest can wait safely. Paste it, drop a screenshot, or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>. Save only, and no model is called.</p>`, 'is-wide')}

    ${moment('v26-s3', 'On your own code.', `<p>Pick a local repository. Kiln runs that exact revision through the Codex or Claude Code you already use.</p><p class="v26-soft">The run is read-only. Nothing in your code changes.</p>`, `
      <dl class="v26-run" aria-label="What you see while it runs, with sample figures">
        <div><dt>You watch</dt><dd>messages, reasoning summaries, commands, web searches</dd></div>
        <div><dt>Model</dt><dd>the one your agent uses, and its reasoning effort</dd></div>
        <div><dt>Elapsed</dt><dd>4 min 12 s <small>sample</small></dd></div>
        <div><dt>Tokens</dt><dd>41,380 in · 28,900 cached · 2,614 out <small>sample</small></dd></div>
      </dl>`, 'is-left')}

    ${moment('v26-s4', 'Look closely.', `<p>The agent gives its own assessment.</p>`, `
      <ul class="v26-verdicts" aria-label="Possible assessments">
        <li>pass</li><li>fail</li><li class="is-circled">uncertain<svg viewBox="0 0 200 90" aria-hidden="true"><path pathLength="1" d="M18 52C14 24 70 8 118 10c48 2 76 20 70 40-6 22-62 32-110 30C38 78 12 66 22 40 30 22 58 14 80 12"/></svg></li>
      </ul>
      <p class="v26-soft">When a task needs edits, or a tool it cannot use, it says uncertain rather than pretending. Its word is kept apart from yours.</p>`, 'is-right')}

    ${moment('v26-s5', 'Change a line. Again.', `<p>Edit the prompt. Compare the two revisions. Run it on the same repository.</p>`, `
      <div class="v26-diff" role="group" aria-label="A one-line change between two revisions">
        <p><span aria-hidden="true">−</span> Rank the ten most impactful improvements.</p>
        <p><span aria-hidden="true">+</span> Rank the five that a new player would notice first.</p>
      </div>
      <p class="v26-soft">You see what the change did. This is how prompting is learned: by doing it, on something real.</p>`, 'is-left')}

    <section class="v26-moment v26-approve" aria-labelledby="v26-s6">
      <h2 class="v26-v" id="v26-s6">Only you decide.</h2>
      <div class="v26-body">
        <p>When it is right, approve that exact revision.</p>
        <p class="v26-soft">Kiln commits it to your own GitHub repository. Edit it later and you get a new draft; the approved one stays as it was.</p>
      </div>
      <div class="v26-seal" aria-live="polite">
        <div class="v26-seal-stamp">${sealSvg('v26-seal')}</div>
        <p class="v26-seal-note">Revision 3<br>approved by you</p>
      </div>
    </section>

    ${moment('v26-s7', 'Then, a habit.', `<p>Install it as a skill for Codex, Claude Code or Copilot. The next agent session picks it up.</p>`, `
      <ul class="v26-paths" aria-label="Example install locations">
        <li>~/.claude/skills/playtest</li><li>~/.agents/skills/playtest</li><li>my-game/.github/skills/playtest</li>
      </ul>
      <p class="v26-soft">One tried prompt, used every day, changes how you work with an agent more than fifty saved ones.</p>`)}

    <section class="v26-notes" aria-labelledby="v26-notes-title">
      <h2 class="visually-hidden" id="v26-notes-title">Quiet details</h2>
      <dl>
        <div><dt>The agent</dt><dd>Your signed-in Codex or Claude Code. No API key and no extra bill; your plan’s usage limits still apply.</dd></div>
        <div><dt>Before it runs</dt><dd>A notice explains what is sent. Editing, approving and installing never call a model.</dd></div>
        <div><dt>The rest</dt><dd>Everything else you saved waits in a local library of collections, tags and search, backed by a GitHub repository Kiln creates for you.</dd></div>
        <div><dt>By hand or by script</dt><dd>A command line for collections, experiments, approvals and installs, with JSON results.</dd></div>
      </dl>
    </section>

    <section class="v26-moment v26-begin" id="v26-begin" aria-labelledby="v26-s8">
      <h2 class="v26-v" id="v26-s8">Begin with one.</h2>
      <div class="v26-body">
        <a class="v26-button" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
        <p class="v26-soft">${releaseNote}</p>
        <p class="v26-fine">Builds are not code-signed yet, so Windows may ask before it opens the installer.</p>
      </div>
    </section>
  </main>
</div>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const moments = root.querySelectorAll<HTMLElement>('.v26-moment, .v26-notes');
  const seal = root.querySelector<HTMLElement>('.v26-approve')!;
  if (reduce || !('IntersectionObserver' in window)) {
    moments.forEach(el => el.classList.add('is-in'));
    seal.classList.add('is-stamped');
    return;
  }
  root.querySelector('.v26')!.classList.add('is-waiting');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    reveal.unobserve(entry.target);
  }), { threshold: .25 });
  moments.forEach(el => reveal.observe(el));
  const stamp = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    setTimeout(() => seal.classList.add('is-stamped'), 1100);
    stamp.disconnect();
  }), { threshold: .6 });
  stamp.observe(seal);
}
