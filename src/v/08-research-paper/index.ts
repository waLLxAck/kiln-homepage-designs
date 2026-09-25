// PROTOTYPE variant 05 — Research paper. A preprint page for "On Actually Running the Prompts We Save": numbered sections, a figure drawn on scroll, footnotes that pop over.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

const prompt = examples[0];
const notes: string[] = [
  'We make no claim about your numbers. You know them.',
  'Or an isolated example project, if the prompt shouldn’t see your code yet.',
  'Your subscription’s usage limits still apply. There is no separate API key and no extra API bill.',
  'Practitioners call this “it said it worked”. We call it Equation (3).',
  'A read-only run can inspect the code but cannot operate the app. Uncertain is the honest answer, and Kiln saves it as one.',
  'Kiln does not compute a per-skill token cost. It shows what is installed where. The tokens in Table 1 are what a test run reports.',
  'Including when the agent says pass. Especially then.',
  'The author was also the subject, the reviewer and the person who wanted it to pass.',
];
let fnIndex = 0;
const fn = (i: number) => `<a class="v05-fn" href="#v05-note-${i}" role="button" data-fn="${i}" aria-expanded="false" aria-controls="v05-pop" aria-label="Footnote ${i + 1}">${i + 1}</a>`;
const cite = (n: number) => `<a class="v05-cite" href="#v05-ref-${n}">[${n}]</a>`;
const eq = (body: string, n: number) => `<div class="v05-eq" role="math" aria-label="Equation ${n}"><span class="v05-eq-body">${body}</span><span class="v05-eq-n">(${n})</span></div>`;

// Figure 1 data: nine illustrative runs across five revisions of one prompt.
type Verdict = 'fail' | 'uncertain' | 'pass';
const runs: { rev: number; v: Verdict; change: string; you: string; tin: number; tout: number }[] = [
  { rev: 1, v: 'uncertain', change: 'As saved from the talk', you: 'unclear', tin: 38420, tout: 1910 },
  { rev: 1, v: 'fail', change: 'Same text, run again', you: 'no', tin: 36180, tout: 1204 },
  { rev: 2, v: 'uncertain', change: 'Named the first screen', you: 'closer', tin: 41005, tout: 2230 },
  { rev: 3, v: 'pass', change: 'Named the entry point file', you: 'yes', tin: 44870, tout: 2412 },
  { rev: 3, v: 'pass', change: 'Same text, run again', you: 'yes', tin: 43311, tout: 2198 },
  { rev: 4, v: 'uncertain', change: 'Asked it to “click through”', you: 'no', tin: 47650, tout: 1788 },
  { rev: 5, v: 'pass', change: 'Reverted to rev 3, added “rank by age”', you: 'keep', tin: 46102, tout: 2604 },
  { rev: 5, v: 'pass', change: 'Same text, other repo', you: 'keep', tin: 51233, tout: 2750 },
  { rev: 5, v: 'pass', change: 'Claude Code instead of Codex', you: 'keep', tin: 49870, tout: 2501 },
];
const levels: Verdict[] = ['fail', 'uncertain', 'pass'];
const W = 560, H = 258, L = 96, R = 20, T = 18, B = 54;
const xOf = (rev: number, k: number, count: number) => L + (rev - .5) / 5 * (W - L - R) + (k - (count - 1) / 2) * 16;
const yOf = (v: Verdict) => T + (2 - levels.indexOf(v)) * ((H - T - B - 18) / 2);
const points = runs.map((run, i) => {
  const same = runs.filter(r => r.rev === run.rev);
  return { ...run, i, x: xOf(run.rev, same.indexOf(run), same.length), y: yOf(run.v) };
});
const mark = (p: typeof points[number]) => {
  const label = `Run ${p.i + 1}, revision ${p.rev}: agent says ${p.v}. ${p.change}.`;
  const shape = p.v === 'pass' ? `<circle cx="${p.x}" cy="${p.y}" r="5.5" class="v05-m-pass"/>`
    : p.v === 'fail' ? `<path d="M${p.x - 5} ${p.y - 5}L${p.x + 5} ${p.y + 5}M${p.x + 5} ${p.y - 5}L${p.x - 5} ${p.y + 5}" class="v05-m-fail"/>`
    : `<path d="M${p.x} ${p.y - 6.5}L${p.x + 6} ${p.y + 4.5}L${p.x - 6} ${p.y + 4.5}Z" class="v05-m-unc"/>`;
  return `<g class="v05-mark" style="--d:${p.i}" tabindex="0" role="img" aria-label="${label}" data-tip="${label}"><rect x="${p.x - 10}" y="${p.y - 10}" width="20" height="20" fill="transparent"/>${shape}</g>`;
};
const figure = `
<svg class="v05-plot" viewBox="0 0 ${W} ${H}" role="group" aria-labelledby="v05-fig1-cap">
  ${levels.map(v => `<line class="v05-grid" x1="${L}" x2="${W - R}" y1="${yOf(v)}" y2="${yOf(v)}"/><text class="v05-ylab" x="${L - 12}" y="${yOf(v) + 5}" text-anchor="end">${v}</text>`).join('')}
  <line class="v05-axis" x1="${L}" x2="${L}" y1="${T - 8}" y2="${H - B}"/><line class="v05-axis" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>
  ${[1, 2, 3, 4, 5].map(r => `<line class="v05-axis" x1="${xOf(r, 0, 1)}" x2="${xOf(r, 0, 1)}" y1="${H - B}" y2="${H - B + 5}"/><text class="v05-xlab" x="${xOf(r, 0, 1)}" y="${H - B + 24}" text-anchor="middle">r${r}</text>`).join('')}
  <text class="v05-axlab" x="${(L + W - R) / 2}" y="${H - 2}" text-anchor="middle">revision of the prompt</text>
  <polyline class="v05-trace" pathLength="1" points="${points.map(p => `${p.x},${p.y}`).join(' ')}"/>
  ${points.map(mark).join('')}
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'On Actually Running the Prompts We Save — arKiln';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  fnIndex = 0;
  const f = () => fn(fnIndex++);
  root.innerHTML = `
<div class="v05">
  <header class="v05-server">
    <div class="v05-server-in">
      <a class="v05-logo" href="?">ar<span>Kiln</span></a>
      <p class="v05-crumbs">cs &gt; Software Engineering &gt; arKiln:2609.00417</p>
      <nav aria-label="Main navigation"><a href="#v05-abstract">Abstract</a><a href="#v05-s5">Limitations</a><a href="#v05-supp">Supplementary material</a></nav>
    </div>
  </header>

  <main id="main">
  <div class="v05-abs-page">
    <div class="v05-abs-main">
      <p class="v05-subj">Computer Science &gt; Software Engineering</p>
      <p class="v05-sub">[Submitted on 1 Sep 2026 (v1), last revised 22 Sep 2026 (this version, v3)]</p>
      <h1 class="v05-title">On Actually Running the Prompts We Save</h1>
      <p class="v05-authors">You<sup>1</sup> and Kiln<sup>2</sup></p>
      <p class="v05-affil"><sup>1</sup>Your desk, most days &nbsp; <sup>2</sup>A Windows desktop app and CLI, MIT licensed</p>
      <section class="v05-abstract" id="v05-abstract" aria-labelledby="v05-abs-h">
        <h2 id="v05-abs-h">Abstract</h2>
        <p>Developers who work with coding agents save prompts far faster than they run them. We present Kiln, a desktop application in which the natural next step after saving a prompt is testing it. A prompt is run, at an exact revision, as a read-only experiment on the developer’s own repository through the Codex or Claude Code session they already use. The agent’s assessment (pass, fail or uncertain) is recorded separately from the developer’s own judgement. In an illustrative case, one prompt moves from uncertain to pass over three revisions, and the diffs between those revisions turn out to be the useful artefact. We describe the method, report what a run shows, discuss what editing and re-running teaches about prompting, and state the limitations plainly.</p>
      </section>
      <p class="v05-kw"><b>Keywords:</b> prompts, agent skills, read-only experiments, the word “later”</p>
    </div>
    <aside class="v05-access" aria-labelledby="v05-access-h">
      <h2 id="v05-access-h">Access</h2>
      <ul>
        <li><a href="#v05-paper">Full text, below</a></li>
        <li><a href="#v05-supp">Supplementary material</a></li>
      </ul>
      <a class="v05-side-dl" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0<small>Windows installer, the apparatus</small></span></a>
      <p class="v05-side-note">Hosted in a private GitHub repository: sign in with an account that has access.</p>
      <h3>Subjects</h3>
      <p>Software Engineering (cs.SE); Human-Computer Interaction (cs.HC)</p>
      <h3>Cite as</h3>
      <p>arKiln:2609.00417 [cs.SE]</p>
      <h3>Submission history</h3>
      <p class="v05-hist"><b>[v1]</b> Tue, 1 Sep 2026. Saved it.<br><b>[v2]</b> Fri, 18 Sep 2026. After the sprint.<br><b>[v3]</b> Tue, 22 Sep 2026. Ran it.</p>
    </aside>
  </div>

  <article class="v05-sheet" id="v05-paper" aria-labelledby="v05-paper-title">
    <header class="v05-sheet-head">
      <h2 class="v05-paper-title" id="v05-paper-title">On Actually Running the Prompts We Save</h2>
      <p class="v05-paper-authors">You and Kiln</p>
    </header>

    <section class="v05-sec" id="v05-s1" aria-labelledby="v05-s1-h">
      <h3 id="v05-s1-h"><span>1</span>Introduction</h3>
      <div class="v05-cols">
        <p>A prompt arrives as a post from X, a screenshot or twelve minutes into a YouTube talk. It is good. It is saved, to bookmarks, a notes app, a chat thread or a folder called <i>misc</i>, and it is never run${cite(1)}. Let <i>S</i> be the set of prompts a developer has saved and <i>R</i> ⊆ <i>S</i> the subset they have actually tried. Anecdotally${f()},</p>
        ${eq('<i>|R|</i> / <i>|S|</i> &nbsp;→&nbsp; 0 &nbsp;&nbsp; as &nbsp;<i>|S|</i> → ∞', 1)}
        <p>and the time until a saved prompt is tried is best modelled${cite(2)} as</p>
        ${eq('<i>t</i><sub>try</sub> = lim<sub><i>n</i>→∞</sub> “later”<sub><i>n</i></sub>', 2)}
        <p>We call this the <i>bookmark problem</i>. It is not a storage problem; everything is stored. It is a friction problem: trying a prompt means opening an agent, finding the right repository, pasting, watching, and then remembering what happened. So the prompt waits for a better day.</p>
        <p>This paper describes a tool that removes the friction between saving and trying. Our contributions are:</p>
        <ol class="v05-list">
          <li>capture into one library, fast enough to be the default;</li>
          <li>read-only experiments on your own repository at an exact revision;</li>
          <li>a verdict from the agent, kept separate from yours;</li>
          <li>revisions and diffs, so re-running teaches something;</li>
          <li>promotion of a proven prompt to an approved, installed skill.</li>
        </ol>
      </div>
    </section>

    <section class="v05-sec" id="v05-s2" aria-labelledby="v05-s2-h">
      <h3 id="v05-s2-h"><span>2</span>Method</h3>
      <div class="v05-cols">
        <h4><span>2.1</span>Capture</h4>
        <p>Text, links, screenshots, images and files are pasted or dropped into Kiln, sent from the tray icon, or captured with <span class="v05-kbd">Ctrl+N</span>; a global quick search opens with <span class="v05-kbd">Ctrl+Shift+Space</span>. <i>Save only</i> keeps a source without calling a model. <i>Analyze and add</i> turns it into prompts, insights, techniques, tools and resources in a collection linked to the source. For a YouTube link, <i>Distill video</i> turns the captions into reusable entries with timestamped source links, and the transcript stays attached.</p>
        <h4><span>2.2</span>Experimental setup</h4>
        <p>The subject chooses a local project or repository${f()} and runs the exact prompt revision through Codex or Claude Code, using the app they are already signed in to${f()}. Experiments are read-only: the agent may inspect the code but nothing in it changes. During a run the subject observes messages, reasoning summaries, commands, web searches, the model, reasoning effort, elapsed time and token counts. Up to two runs proceed at once; either can be cancelled or retried.</p>
        <h4><span>2.3</span>Assessment</h4>
        <p>Each run yields output and an agent assessment <i>v</i> ∈ {pass, fail, uncertain}, stored against the revision that produced it. The subject’s judgement <i>h</i> is recorded separately, and in general</p>
        ${eq('<i>v</i>(<i>r</i>) &nbsp;≠&nbsp; <i>h</i>(<i>r</i>)', 3)}
        <p>which is a feature${f()}. Tasks that need edits or tools the agent cannot use are reported as uncertain rather than as successes the agent could not have verified.</p>
      </div>
      <figure class="v05-algo" aria-labelledby="v05-algo-cap">
        <figcaption id="v05-algo-cap"><b>Algorithm 1</b> Trying a saved prompt</figcaption>
        <ol>
          <li><i>p</i> ← capture(<i>source</i>)</li>
          <li><b>repeat</b></li>
          <li class="i1"><i>o</i>, <i>v</i> ← run(<i>p</i><sub><i>r</i></sub>, <i>repo</i>, read-only) <span class="v05-cmt">▷ nothing on disk changes</span></li>
          <li class="i1"><i>h</i> ← you(<i>o</i>) <span class="v05-cmt">▷ kept separately from <i>v</i></span></li>
          <li class="i1"><b>if</b> <i>h</i> = keep <b>then break</b></li>
          <li class="i1"><i>p</i><sub><i>r</i>+1</sub> ← edit(<i>p</i><sub><i>r</i></sub>) <span class="v05-cmt">▷ a new revision; <i>p</i><sub><i>r</i></sub> is kept</span></li>
          <li><b>until</b> tired</li>
          <li>approve(<i>p</i><sub><i>r</i></sub>); install(<i>p</i><sub><i>r</i></sub>) <span class="v05-cmt">▷ by you, never automatically</span></li>
        </ol>
      </figure>
    </section>

    <section class="v05-sec" id="v05-s3" aria-labelledby="v05-s3-h">
      <h3 id="v05-s3-h"><span>3</span>Results</h3>
      <div class="v05-cols">
        <p>We ran one prompt, taken from a talk and condensed, against a small web app written for children:</p>
        <blockquote class="v05-quote">${prompt.prompt}</blockquote>
        <p>Figure 1 shows the agent’s assessment for nine runs across five revisions. Revision 1 was uncertain and then failed on a second run: without knowing where the app starts, the agent guessed. Naming the first screen (r2) helped; naming the entry-point file (r3) passed twice. Revision 4 asked the agent to “click through” the app, which a read-only run cannot do, and was correctly reported as uncertain${f()}. Revision 5 returned to r3 and added one ranking instruction; it passed on a second repository and with a second agent.</p>
        <p>Table 1 lists every run with the token usage the run reported. We do not generalise from one prompt. The point is the shape: a verdict per revision, visible at a glance, instead of a vague memory that it “sort of worked”.</p>
      </div>
      <figure class="v05-fig" aria-labelledby="v05-fig1-cap">
        <div class="v05-fig-plot">${figure}<div class="v05-tip" role="status" aria-live="polite"></div></div>
        <figcaption id="v05-fig1-cap"><b>Figure 1:</b> Agent assessment per run across five revisions of one prompt on the same repository. Circle: pass. Triangle: uncertain. Cross: fail. <b>Illustrative data</b>, one prompt, nine runs, one very interested subject.</figcaption>
      </figure>
      <figure class="v05-table" aria-labelledby="v05-tab1-cap">
        <figcaption id="v05-tab1-cap"><b>Table 1:</b> Runs behind Figure 1. Token counts are sample values of the kind every Kiln run reports${f()}.</figcaption>
        <div class="v05-table-scroll"><table>
          <thead><tr><th scope="col">Run</th><th scope="col">Rev.</th><th scope="col">Change</th><th scope="col">Agent</th><th scope="col">You</th><th scope="col" class="num">Tokens in</th><th scope="col" class="num">Out</th></tr></thead>
          <tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>r${r.rev}</td><td>${r.change}</td><td>${r.v}</td><td>${r.you}</td><td class="num">${r.tin.toLocaleString('en-US')}</td><td class="num">${r.tout.toLocaleString('en-US')}</td></tr>`).join('')}</tbody>
        </table></div>
      </figure>
    </section>

    <section class="v05-sec" id="v05-s4" aria-labelledby="v05-s4-h">
      <h3 id="v05-s4-h"><span>4</span>Learning to prompt</h3>
      <div class="v05-cols">
        <p>The most useful output of the study was not any single answer but the diffs between revisions. Kiln keeps every revision; editing makes a new draft and never overwrites the one you ran. Comparing two revisions next to their verdicts makes the cause legible:</p>
        <pre class="v05-listing" aria-label="Diff from revision 1 to revision 3"><span class="ln">1</span> <del>- Use this app as a seven-year-old.</del>
<span class="ln">2</span> <ins>+ Start from src/routes/home.tsx.</ins>
<span class="ln">3</span> <ins>+ Use this app as a seven-year-old.</ins>
<span class="ln">4</span>   Skip the parent-only signup. …
<span class="ln">5</span>   Make no changes yet.</pre>
        <p><b>Observation 1.</b> Naming the entry point turned an uncertain into a pass. The agent was not less capable at r1; it was less informed.</p>
        <p><b>Observation 2.</b> Instructions the run cannot follow (“click through”) do not fail loudly. They come back uncertain, which is how you learn the boundary of a read-only experiment.</p>
        <p><b>Observation 3.</b> The same revision on a second repository is a cheap test of whether a prompt generalises before it becomes a habit.</p>
        <p>Two further tools support this loop. <i>Ask the agent</i> discusses an item with its attachments and the source video’s context. <i>Create skill</i> drafts a SKILL.md from a prompt, image or note using Kiln’s bundled writing-for-agents guidance${cite(3)}, linked back to its source. A prompt that has proven itself is approved at an exact revision and installed into Codex, Claude Code or Copilot locations, where a new agent session picks it up.</p>
      </div>
    </section>

    <section class="v05-sec" id="v05-s5" aria-labelledby="v05-s5-h">
      <h3 id="v05-s5-h"><span>5</span>Limitations</h3>
      <div class="v05-cols">
        <p>We state the boundaries of the system as plainly as its features.</p>
        <ul class="v05-lim">
          <li><b>Platform.</b> Kiln is a Windows desktop app with a CLI. There is no macOS or Linux build.</li>
          <li><b>Dependencies.</b> It uses your existing, signed-in Codex or Claude Code. Your subscription’s usage limits apply. It is not an offline or account-free product: the library lives locally and is backed by a GitHub repository that Kiln creates for you with the official gh CLI.</li>
          <li><b>Read-only.</b> Experiments never edit your code, so anything that needs an edit or a tool the agent lacks can only come back uncertain.</li>
          <li><b>Ground truth.</b> The agent’s assessment is an opinion about its own output. It is stored separately because you are the judge.</li>
          <li><b>Tokens.</b> Every model-invoked skill’s description sits in context every turn, so stale and duplicate skills cost tokens and attention. Kiln shows each installed copy so you can remove them; it does not measure a per-skill token cost. Test runs report input, cached and output tokens.</li>
          <li><b>Approval.</b> Never automatic${f()}. Normal editing, approval and installation never call a model; a consent notice explains what is sent before any agent interaction.</li>
          <li><b>Evidence.</b> Figure 1 has <i>n</i> = 1 and the subject was also the author${f()}.</li>
          <li><b>Distribution.</b> Builds are unsigned, and the release lives in a private GitHub repository.</li>
        </ul>
      </div>
    </section>

    <section class="v05-sec" id="v05-sA" aria-labelledby="v05-sA-h">
      <h3 id="v05-sA-h"><span>A</span>Appendix: keeping what works</h3>
      <div class="v05-cols">
        <p>A tested prompt is only useful if it can be found and trusted later. Kiln keeps one library of prompts, skills, custom agent definitions in native Codex, Claude Code and Copilot formats, source notes, insights, techniques, tools and resources, with collections, search, tags, favorites and filters by kind, status, provider, location, copy state, scope and tag. Existing installed skills or a skills repository can be imported as drafts; the originals stay where they are.</p>
        <p>For each skill Kiln lists every installed copy across personal locations and enrolled projects: installed, identical copy found, differs, linked, or edited outside Kiln. A drifted copy can be compared file by file with the approved version; local copies can be removed in bulk. Approval commits the exact snapshot to your own Kiln repository on GitHub, and <span class="v05-kbd">kiln skills sync</span> installs everything marked for a second machine. Agent config files (CLAUDE.md, AGENTS.md, config.toml, hooks, MCP and settings) are edited in place with syntax checks and 30 private backups; hooks are never executed.</p>
      </div>
    </section>

    <section class="v05-sec v05-refs" aria-labelledby="v05-refs-h">
      <h3 id="v05-refs-h">References</h3>
      <ol>
        <li id="v05-ref-1">You. <i>Bookmarks, various folders.</i> Unpublished, ongoing.</li>
        <li id="v05-ref-2">You. “I’ll try it later.” Personal communication, most weekdays.</li>
        <li id="v05-ref-3">Kiln. <i>Writing for agents</i>: guidance on context load, pruning and descriptions that trigger well. Bundled with Kiln 0.17.0.</li>
        <li id="v05-ref-4">Kiln. <i>Release 0.17.0 for Windows.</i> Private GitHub repository, 2026.</li>
      </ol>
    </section>

    <section class="v05-sec v05-notes" aria-labelledby="v05-notes-h">
      <h3 id="v05-notes-h">Notes</h3>
      <ol>${notes.map((note, i) => `<li id="v05-note-${i}">${note}</li>`).join('')}</ol>
    </section>

    <section class="v05-supp" id="v05-supp" aria-labelledby="v05-supp-h">
      <h3 id="v05-supp-h">Supplementary material</h3>
      <p>The apparatus used in this study, for readers who would like to replicate it on their own repository${cite(4)}.</p>
      <a class="v05-download" href="${installer}">${windowsMark}<span>Download Kiln.Setup.0.17.0.exe</span><small>Windows installer</small></a>
      <p class="v05-supp-note">${releaseNote} ${subscription.text} ${subscription.fine}</p>
    </section>
  </article>
  </main>
  <div class="v05-pop" id="v05-pop" role="note" hidden></div>
</div>`;

  // Footnotes: click a superscript, read the note beside it. Esc or a click elsewhere closes it.
  const pop = root.querySelector<HTMLElement>('#v05-pop')!;
  let open: HTMLElement | null = null;
  const close = () => { if (!open) return; open.setAttribute('aria-expanded', 'false'); pop.hidden = true; open = null; };
  const show = (button: HTMLElement) => {
    close();
    const i = Number(button.dataset.fn);
    pop.innerHTML = `<sup>${i + 1}</sup> ${notes[i]}`;
    pop.hidden = false;
    const rect = button.getBoundingClientRect();
    const width = Math.min(320, innerWidth - 24);
    pop.style.width = `${width}px`;
    pop.style.left = `${Math.max(12, Math.min(innerWidth - width - 12, rect.left + rect.width / 2 - width / 2)) + scrollX}px`;
    pop.style.top = `${rect.bottom + scrollY + 10}px`;
    button.setAttribute('aria-expanded', 'true');
    open = button;
  };
  root.querySelectorAll<HTMLElement>('.v05-fn').forEach(button => {
    const toggle = (event: Event) => { event.preventDefault(); event.stopPropagation(); if (open === button) close(); else show(button); };
    button.addEventListener('click', toggle);
    button.addEventListener('keydown', event => { if (event.key === ' ') toggle(event); });
  });
  document.addEventListener('click', event => { if (open && !pop.contains(event.target as Node)) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && open) { const b = open; close(); b.focus(); } });
  addEventListener('resize', close);

  // Figure 1: per-mark readout on hover and focus.
  const tip = root.querySelector<HTMLElement>('.v05-tip')!;
  root.querySelectorAll<SVGGElement>('.v05-mark').forEach(markEl => {
    const on = () => { tip.textContent = markEl.dataset.tip ?? ''; tip.classList.add('is-on'); };
    const off = () => tip.classList.remove('is-on');
    markEl.addEventListener('mouseenter', on); markEl.addEventListener('focus', on);
    markEl.addEventListener('mouseleave', off); markEl.addEventListener('blur', off);
  });

  // Figure 1 draws itself when it scrolls into view.
  const plot = root.querySelector<HTMLElement>('.v05-fig')!;
  if (reduce || !('IntersectionObserver' in window)) { plot.classList.add('is-drawn'); return; }
  plot.classList.add('is-waiting');
  const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { plot.classList.add('is-drawn'); io.disconnect(); } }, { threshold: .5 });
  io.observe(plot);
}
