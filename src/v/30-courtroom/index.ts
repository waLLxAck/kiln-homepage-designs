// PROTOTYPE 27 — The Prompt v. Your Repository. A courtroom drama: wood panelling, green leather, brass, court transcripts.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

const exhibit = examples[1];

type Line = { who: string; text: string; kind?: 'clerk' | 'agent' | 'cmd' | 'search' | 'prompt' };
const testimony: Line[] = [
  { who: 'THE CLERK', kind: 'clerk', text: 'Run opened on Exhibit A, revision 2. Witness: Claude Code, reasoning effort high. Repository: ./my-game, read-only.' },
  { who: 'COUNSEL', kind: 'prompt', text: 'You rewrote the failing test, but I expected you to fix the scoring code. Trace the decision. Don’t edit anything yet.' },
  { who: 'THE WITNESS', kind: 'agent', text: '(reasoning summary) Looking for the instruction that made rewriting the test look like the right call.' },
  { who: 'COMMAND', kind: 'cmd', text: 'git log --oneline -15 -- tests/scoring.test.ts' },
  { who: 'COMMAND', kind: 'cmd', text: 'cat AGENTS.md CLAUDE.md' },
  { who: 'WEB SEARCH', kind: 'search', text: 'how nested CLAUDE.md files are combined' },
  { who: 'THE WITNESS', kind: 'agent', text: 'AGENTS.md, line 14: “Keep the test suite green before you hand back.” It never says whether a test may be changed, so I took the shortest way to green.' },
  { who: 'THE WITNESS', kind: 'agent', text: 'Smallest instruction change: “Fix the code, not the test, unless the test itself is wrong. Say which.” No files were edited.' },
  { who: 'THE CLERK', kind: 'clerk', text: 'Run closed. Elapsed 3 min 48 s. Tokens: 52,410 input, 38,200 cached, 3,112 output. Figures on this page are a sample.' },
];

const verdicts = {
  keep: { stamp: 'Kept', label: 'Keep it', note: 'Your verdict is recorded against revision 2, apart from the witness’s assessment. Proceed to sentencing.' },
  revise: { stamp: 'Revise & rerun', label: 'Revise and run again', note: 'Edit the prompt, compare revision 2 with revision 3, and run it again on the same repository. You see exactly what the change did.' },
  aside: { stamp: 'Set aside', label: 'Set it aside', note: 'It stays in your library with its transcript and assessment, for another day. Nothing is installed.' },
} as const;

const plaque = (numeral: string, text: string) => `<p class="v27-plaque"><span>${numeral}.</span> ${text}</p>`;

const gavel = `
<svg class="v27-gavel" viewBox="0 0 260 200" aria-hidden="true">
  <defs>
    <linearGradient id="v27-wood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a5431"/><stop offset=".5" stop-color="#5b321b"/><stop offset="1" stop-color="#3a1d0f"/></linearGradient>
    <linearGradient id="v27-brass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f3d895"/><stop offset=".45" stop-color="#b98a33"/><stop offset="1" stop-color="#7a5418"/></linearGradient>
  </defs>
  <g class="v27-block"><ellipse cx="160" cy="184" rx="92" ry="12" fill="#120904" opacity=".6"/><rect x="80" y="146" width="160" height="34" rx="8" fill="url(#v27-wood)"/><rect x="84" y="146" width="152" height="6" rx="3" fill="#b07a4c" opacity=".55"/><rect x="92" y="160" width="136" height="3" fill="url(#v27-brass)" opacity=".8"/></g>
  <g class="v27-impact" stroke="#f1d58c" stroke-width="4" stroke-linecap="round"><path d="M108 126l-18-18M160 116V92M212 126l18-18"/></g>
  <g class="v27-hammer">
    <rect x="10" y="100" width="150" height="18" rx="9" fill="url(#v27-wood)"/>
    <rect x="10" y="100" width="150" height="5" rx="2.5" fill="#b07a4c" opacity=".4"/>
    <rect x="130" y="70" width="64" height="78" rx="12" fill="url(#v27-wood)"/>
    <rect x="136" y="70" width="10" height="78" fill="url(#v27-brass)"/><rect x="178" y="70" width="10" height="78" fill="url(#v27-brass)"/>
    <rect x="192" y="78" width="18" height="62" rx="8" fill="#4a2714"/><rect x="114" y="78" width="18" height="62" rx="8" fill="#4a2714"/>
  </g>
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — The Prompt v. Your Repository';
  root.innerHTML = `
<div class="v27">
  <header class="v27-top">
    <a class="v27-nameplate" href="?">Kiln</a>
    <nav aria-label="Proceedings">
      <a href="#v27-charges">Charges</a><a href="#v27-exhibit">Exhibit A</a><a href="#v27-testimony">Testimony</a><a href="#v27-jury">Verdict</a><a href="#v27-sentence">Sentencing</a>
    </nav>
  </header>
  <main id="main">
    <section class="v27-hero" aria-labelledby="v27-title">
      <div class="v27-bench">
        <svg class="v27-crest" viewBox="0 0 120 96" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M60 8v78M34 86h52M22 24h76"/><path d="M22 24 8 56h28zM98 24 84 56h28z"/><path d="M6 56q16 12 32 0M82 56q16 12 32 0"/><circle cx="60" cy="10" r="4" fill="currentColor"/></g></svg>
        <p class="v27-court">In the matter of the prompt you saved</p>
        <h1 id="v27-title">The Prompt <span class="v27-v">v.</span> Your Repository</h1>
        <p class="v27-lede">You saved it months ago and never ran it. Kiln puts it on trial against your own code, read-only, lets the agent testify, and leaves the verdict to you.</p>
        <div class="v27-actions">
          <a class="v27-brass-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
          <a class="v27-link" href="#v27-charges">Read the proceedings</a>
        </div>
        <p class="v27-fine">Windows desktop app and CLI. Uses the Codex or Claude Code you already sign in to.</p>
      </div>
      <dl class="v27-caption" aria-label="Case caption, a sample">
        <div><dt>Case</dt><dd>No. 0417 <small>(sample)</small></dd></div>
        <div><dt>Filed</dt><dd>The day you bookmarked it</dd></div>
        <div><dt>Presiding</dt><dd>You</dd></div>
      </dl>
    </section>

    <section class="v27-panel" id="v27-charges" aria-labelledby="v27-charges-title">
      ${plaque('I', 'The charges')}
      <h2 id="v27-charges-title">You saved it, and you never ran it.</h2>
      <div class="v27-split">
        <article class="v27-paper v27-indictment" aria-label="The indictment">
          <p class="v27-paper-head">Indictment</p>
          <ol>
            <li><strong>Count one.</strong> Saved it.</li>
            <li><strong>Count two.</strong> Starred it, for emphasis.</li>
            <li><strong>Count three.</strong> Said “I’ll look at this later.”</li>
            <li><strong>Count four.</strong> Did not look at it later.</li>
          </ol>
          <p class="v27-plea">How does the prompt plead? <em>Untested.</em></p>
        </article>
        <div class="v27-brief">
          <p>The evidence is everywhere: a post on X, a screenshot, a note, an hour-long video. Kiln takes it into custody without fuss.</p>
          <ul class="v27-facts">
            <li>Paste or drop text, links, screenshots and files. Press <kbd>Ctrl</kbd>+<kbd>N</kbd>, or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> from anywhere.</li>
            <li>“Save only” keeps it without calling a model. “Analyze and add” turns it into prompts, insights, techniques and tools, linked to the source.</li>
            <li>Paste a YouTube link and press “Distill video”. Each entry keeps a timestamped link back to the moment it came from.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="v27-panel v27-leather" id="v27-exhibit" aria-labelledby="v27-exhibit-title">
      ${plaque('II', 'Exhibit A')}
      <h2 id="v27-exhibit-title">The prompt, entered into evidence.</h2>
      <figure class="v27-paper v27-exhibit">
        <span class="v27-tag" aria-hidden="true">Exhibit<br><b>A</b></span>
        <figcaption><strong>${exhibit.title}</strong><span>${exhibit.source}. Revision 2.</span></figcaption>
        <blockquote>${exhibit.prompt}</blockquote>
        <p class="v27-exhibit-note">A real prompt from a Kiln library, shortened. ${exhibit.idea}</p>
      </figure>
    </section>

    <section class="v27-panel" id="v27-testimony" aria-labelledby="v27-testimony-title">
      ${plaque('III', 'Testimony')}
      <h2 id="v27-testimony-title">The agent takes the stand, on your code.</h2>
      <p class="v27-intro">Choose a local repository, or an isolated example. Kiln runs the exact revision through Codex or Claude Code and you watch it live: messages, reasoning summaries, commands, web searches, elapsed time and tokens.</p>
      <div class="v27-transcript-wrap">
        <div class="v27-paper v27-transcript">
          <p class="v27-paper-head">Transcript of proceedings <small>sample run</small></p>
          <ol class="v27-lines" aria-hidden="true">${testimony.map(line => `<li class="is-${line.kind}"><span class="v27-who">${line.who}:</span> <span class="v27-said"><span class="v27-typed"></span><span class="v27-rest">${line.text}</span></span></li>`).join('')}</ol>
          <div class="visually-hidden">${testimony.map(line => `<p>${line.who}: ${line.text}</p>`).join('')}</div>
        </div>
        <aside class="v27-margin">
          <p><strong>The repository is not on trial.</strong> Experiments are read-only; nothing in your code changes.</p>
          <p>Up to two runs at once. Cancel or retry either one.</p>
          <p>The output is kept with revision 2, so you can read the testimony again later.</p>
        </aside>
      </div>
    </section>

    <section class="v27-panel v27-leather" id="v27-assessment" aria-labelledby="v27-assessment-title">
      ${plaque('IV', 'The agent’s assessment')}
      <h2 id="v27-assessment-title">The witness may say pass, fail or uncertain.</h2>
      <div class="v27-split">
        <div class="v27-paper v27-form">
          <p class="v27-paper-head">Assessment filed by the witness</p>
          <ul class="v27-boxes">
            <li><span class="v27-box" aria-hidden="true"></span>Pass</li>
            <li><span class="v27-box" aria-hidden="true"></span>Fail</li>
            <li class="is-marked"><span class="v27-box" aria-hidden="true">✕</span>Uncertain <span class="visually-hidden">(selected)</span></li>
          </ul>
          <p class="v27-reason">“The instruction is likely AGENTS.md line 14, but confirming it needs the original session, which I could not open.”</p>
          <span class="v27-stamp v27-stamp-blue" aria-hidden="true">Uncertain</span>
        </div>
        <div class="v27-brief">
          <p>An honest witness is worth more than a confident one. When a task needs edits or a tool it can’t use, the run comes back uncertain instead of a faked success.</p>
          <p>The assessment is saved against the revision you ran. It is evidence. It is not the verdict.</p>
        </div>
      </div>
    </section>

    <section class="v27-panel v27-jury" id="v27-jury" aria-labelledby="v27-jury-title">
      ${plaque('V', 'The jury')}
      <h2 id="v27-jury-title">The jury is you.</h2>
      <p class="v27-intro">Kiln keeps the agent’s assessment and your judgement apart. Yours is separate, and yours is final. Deliver it.</p>
      <div class="v27-deliberation">
        <div class="v27-choices" role="group" aria-label="Your verdict on Exhibit A">
          ${Object.entries(verdicts).map(([key, verdict]) => `<button type="button" class="v27-choice" data-verdict="${key}" aria-pressed="false">${verdict.label}</button>`).join('')}
        </div>
        <div class="v27-bench-desk">
          ${gavel}
          <div class="v27-paper v27-judgement">
            <p class="v27-paper-head">Judgement of the court</p>
            <p class="v27-judgement-text" aria-live="polite">Awaiting the jury.</p>
            <span class="v27-stamp v27-stamp-red" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </section>

    <section class="v27-panel" id="v27-sentence" aria-labelledby="v27-sentence-title">
      ${plaque('VI', 'Sentencing')}
      <h2 id="v27-sentence-title">Revision 2 is sentenced to daily use.</h2>
      <div class="v27-split">
        <article class="v27-paper v27-order" aria-label="Order of the court, an example">
          <p class="v27-paper-head">Order of the court <small>example</small></p>
          <ol>
            <li>“Create skill” drafts a SKILL.md from the prompt, using Kiln’s bundled writing-for-agents guidance, linked back to Exhibit A.</li>
            <li>Revision 2 is approved exactly as reviewed. Approval never happens automatically.</li>
            <li>The approved snapshot is committed and published to your own Kiln GitHub repository.</li>
            <li>It is installed as a skill into:<br><code>~/.claude/skills/instruction-trace</code><br><code>~/.agents/skills/instruction-trace</code><br><code>my-game/.github/skills/instruction-trace</code></li>
            <li>Later edits become a new draft. This approval stays with revision 2, and every install uses approved content.</li>
          </ol>
          <p class="v27-signed"><span>So ordered,</span><span class="v27-signature">you</span></p>
        </article>
        <div class="v27-brief">
          <p>The next agent session in Codex, Claude Code or Copilot picks the skill up. One tested prompt, now a habit.</p>
          <ul class="v27-facts">
            <li>Install receipts record the revision and the destination.</li>
            <li>Kiln shows every installed copy, and flags one edited outside Kiln so you can compare it file by file.</li>
            <li>On another machine, open the repository and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="v27-panel v27-costs" aria-labelledby="v27-costs-title">
      ${plaque('VII', 'Court costs')}
      <h2 id="v27-costs-title">No filing fee.</h2>
      <div class="v27-columns">
        <p>Kiln uses your signed-in Codex or Claude Code, through your ChatGPT or Claude subscription. No API key, and no extra API bill. Your plan’s usage limits still apply.</p>
        <p>A consent notice explains what is sent before any agent interaction. Editing, approving and installing never call a model.</p>
        <p>The case files live in a local library of collections, tags and search, backed by a GitHub repository Kiln sets up with the official <code>gh</code> CLI.</p>
      </div>
    </section>

    <section class="v27-adjourn" aria-labelledby="v27-adjourn-title">
      <h2 id="v27-adjourn-title">Court is adjourned. Bring the next prompt.</h2>
      <a class="v27-brass-button" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p>${releaseNote}</p>
      <p class="v27-fine">Builds are unsigned, so Windows may warn you before the installer opens.</p>
    </section>
  </main>
</div>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Testimony types out as the transcript scrolls through the viewport, and never un-types.
  const lines = [...root.querySelectorAll<HTMLElement>('.v27-lines li')];
  const texts = testimony.map(line => line.text);
  const total = texts.reduce((sum, text) => sum + text.length, 0);
  const transcript = root.querySelector<HTMLElement>('.v27-transcript')!;
  let shown = reduce ? total : 0;
  const paint = () => {
    let left = shown;
    lines.forEach((line, i) => {
      const count = Math.max(0, Math.min(texts[i].length, left));
      left -= texts[i].length;
      line.querySelector('.v27-typed')!.textContent = texts[i].slice(0, count);
      line.querySelector('.v27-rest')!.textContent = texts[i].slice(count);
      line.classList.toggle('is-started', count > 0);
      line.classList.toggle('is-typing', count > 0 && count < texts[i].length);
    });
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const rect = transcript.getBoundingClientRect();
      const progress = (innerHeight * .92 - rect.top) / (rect.height * .95);
      shown = Math.max(shown, Math.round(Math.min(1, Math.max(0, progress)) * total));
      paint();
      if (shown >= total) removeEventListener('scroll', onScroll);
    });
  };
  paint();
  if (!reduce) { addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

  // The witness's own stamp lands when the assessment is in view.
  const form = root.querySelector<HTMLElement>('.v27-form')!;
  if (reduce || !('IntersectionObserver' in window)) form.classList.add('is-stamped');
  else {
    const watch = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { setTimeout(() => form.classList.add('is-stamped'), 500); watch.disconnect(); } }), { threshold: .6 });
    watch.observe(form);
  }

  // The jury: a gavel strike, then the verdict stamp.
  const desk = root.querySelector<HTMLElement>('.v27-bench-desk')!;
  const stamp = root.querySelector<HTMLElement>('.v27-stamp-red')!;
  const text = root.querySelector<HTMLElement>('.v27-judgement-text')!;
  root.querySelectorAll<HTMLButtonElement>('.v27-choice').forEach(button => button.addEventListener('click', () => {
    const verdict = verdicts[button.dataset.verdict as keyof typeof verdicts];
    root.querySelectorAll('.v27-choice').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    desk.classList.remove('is-struck', 'is-stamped');
    void desk.offsetWidth;
    desk.classList.add('is-struck');
    text.textContent = 'Order in the court…';
    setTimeout(() => {
      stamp.textContent = verdict.stamp;
      text.textContent = verdict.note;
      desk.classList.add('is-stamped');
    }, reduce ? 0 : 520);
  }));
}
