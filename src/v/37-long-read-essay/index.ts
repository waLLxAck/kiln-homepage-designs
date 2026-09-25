// PROTOTYPE variant 34 — The long read. A literary essay about saved prompts and unexamined skills; Kiln appears only at the end.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

const notes = [
  'Most prompts worth saving ask for an opinion about code you care about. That is also what makes them awkward to run casually: a willing agent, told to find problems, may start fixing them.',
  'This is why the revisions matter as much as the runs. The diff between the prompt that failed and the prompt that passed is a lesson you wrote yourself, in your own codebase’s terms.',
  'The usual places, for now: ~/.claude/skills; ~/.agents/skills, which Codex, Copilot and others share; .codex/skills; .copilot/skills; and a project’s own .github/skills.',
  'We are careful here. Nothing measures what any single skill costs you, and it varies with the agent and the description. The point is only that installed means read, every turn.',
];

const ref = (n: number) => `<sup class="v34-ref"><a href="#v34-fn-${n}" id="v34-ref-${n}" data-note="${n}" aria-describedby="v34-sn-${n}">${n}</a></sup>`;
const side = (n: number) => `<span class="v34-sn" role="note" id="v34-sn-${n}" data-sn="${n}"><span class="v34-sn-no">${n}</span> ${notes[n - 1]}</span>`;

export function render(root: HTMLElement) {
  document.title = 'The bookmark is where ideas go to wait';
  root.innerHTML = `
<div class="v34">
  <a class="skip" href="#main">Skip to the essay</a>
  <div class="v34-progress" aria-hidden="true"><span data-progress></span></div>
  <header class="v34-mast">
    <p class="v34-series">An essay on working with coding agents</p>
    <p class="v34-time" data-time></p>
  </header>
  <main id="main">
    <article class="v34-essay" aria-labelledby="v34-title">
      <header class="v34-head">
        <h1 id="v34-title">The bookmark is where ideas go to wait.</h1>
        <p class="v34-deck">Why the prompts we save never get tried, why the skills we install never get examined, and what changes when finding out costs minutes instead of an afternoon.</p>
      </header>

      <div class="v34-body" data-body>
        <p class="v34-first">Somewhere on your machine there is a list. It might be a bookmarks folder called “AI”, a notes file titled “prompts to try”, a pinned message to yourself, a screenshot of a post you meant to come back to. It began with good intentions. Each entry arrived with a small jolt of recognition: yes, that is how I should be asking. Then it went on the list, and the list did what lists do. It waited.</p>
        <p>Saving feels like progress. It has the shape of an action: you noticed something, you kept it, you were diligent about it. But the value of a prompt is not in its words. It is in what happens when those words meet something real, and that is exactly the step the bookmark postpones.</p>
        <blockquote class="v34-pull"><p>Saving has the shape of an action. Mostly it is a way of deciding later.</p></blockquote>

        <h2><span class="v34-num">I</span> The cost of finding out</h2>
        <p>Why does later never come? Not laziness. The honest answer is that trying a saved prompt is expensive in a way that never shows up on any list. You have to find it again. You have to remember why you saved it. You need a repository where it would make sense, an agent session that isn’t already busy, and a clear enough head to judge what comes back. And you need to be willing to let an agent loose on your working tree after telling it to find the ten most impactful improvements.${ref(1)}${side(1)}</p>
        <p>Each of those costs is small. Together they form a toll booth, and the toll is paid in attention, the one thing a working developer never has spare. So the prompt stays on the list, the list grows, and eventually it becomes a small, steady source of guilt, which is the least useful thing a list can be.</p>
        <p>Notice that none of this is about the quality of the idea. A brilliant prompt and a mediocre one wait in exactly the same queue, because what is missing is not judgement. It is a cheap way to exercise it.</p>

        <h2><span class="v34-num">II</span> What changes when it takes minutes</h2>
        <p>Suppose the toll disappeared. You come across a prompt, and a few minutes later you have run it against your own repository, not a toy example but the code you will be working in tomorrow, and you are reading the result. Nothing in the repository changed, because the run could only read. The agent’s own assessment sits beside the output: it passed, it failed, or it wasn’t sure.</p>
        <p>Three things happen. The question changes: it stops being “is this a good prompt?”, which nobody can answer in the abstract, and becomes “is this a good prompt here?”, which you can answer by looking. The backlog stops growing, because the natural moment to try something becomes the moment you find it. And, less obviously, you start to learn.</p>
        <p>Take a prompt that circulates in one form or another, this one condensed from a talk:</p>
        <blockquote class="v34-example"><p>${examples[0].prompt}</p></blockquote>
        <p>On a children’s app it finds the button nobody under ten can read. On a command-line tool it probably finds nothing, and knowing that within a few minutes, rather than never, is worth something too.</p>

        <h2><span class="v34-num">III</span> Prompting is learned by revision</h2>
        <p>There is no shortage of advice about writing prompts. Most of it is true and almost none of it sticks, for the same reason that advice about writing rarely makes anyone a writer. What sticks is watching your own words produce a result, changing one sentence, and watching the result change.</p>
        <p>Run the vague version first, “check my app for usability problems”, and you get a list of tips that could apply to any app ever made. Give the agent someone to be, something to skip and a place to stop, and the same agent on the same code comes back with one concrete finding and a fix. You didn’t learn a rule. You saw a difference, and you will remember it the next time you write a prompt at eleven at night.${ref(2)}${side(2)}</p>
        <blockquote class="v34-pull"><p>You didn’t learn a rule. You saw a difference.</p></blockquote>
        <p>An honest verdict helps more than a flattering one. A run that would need to edit files, or use a tool it doesn’t have, should say it is uncertain rather than pretend. “I couldn’t check” is information; a confident fake success teaches you the wrong lesson. And the agent’s verdict is not yours. It is a second opinion, recorded, that you are free to overrule.</p>

        <h2><span class="v34-num">IV</span> The drawer nobody opens</h2>
        <p>The prompts that prove themselves get a second life. They become skills: small folders of instructions an agent can reach for on its own. This is where the other half of the problem lives, the half that looks like order.</p>
        <p>Skills accumulate the way browser extensions do. One lives in the Claude folder, another in the shared agents folder, a third inside a project. A couple were copied twice. One was edited by hand months ago and no longer matches anything. Nobody remembers installing the one about meeting summaries.${ref(3)}${side(3)}</p>
        <p>Unlike bookmarks, these are not inert. An agent reads the description of every skill it might invoke, on every turn, so that it can decide which to use. The forgotten ones, the duplicates and the stale ones all spend a little context and a little attention, whether or not they ever fire.${ref(4)}${side(4)} A drawer nobody opens is still in the room.</p>

        <h2><span class="v34-num">V</span> Visibility is most of the fix</h2>
        <p>You cannot prune what you cannot see. The useful move is almost embarrassingly simple: one view of every skill, every installed copy of it, and whether each copy still matches the version you approved. Once that view exists, most decisions make themselves. Remove the duplicate. Retire the one you never use. Compare the hand-edited copy with the version you trust, and choose.</p>
        <p>Pair that with versions you can rely on, an approved revision that a later edit cannot quietly overwrite and installs that always use it, and the drawer becomes a shelf. What is on it is there because it earned the place.</p>
        <blockquote class="v34-pull"><p>A drawer nobody opens is still in the room.</p></blockquote>

        <h2 class="v34-turn"><span class="v34-num">VI</span> Where we ended up</h2>
        <p>We had the list and we had the drawer, and we wanted both to shrink. So we built the tool we kept wishing for. It is called Kiln.</p>
      </div>
      <section class="v34-footnotes" aria-labelledby="v34-fn-title">
        <h2 id="v34-fn-title">Notes</h2>
        <ol>${notes.map((note, i) => `<li id="v34-fn-${i + 1}">${note} <a href="#v34-ref-${i + 1}" aria-label="Back to the text for note ${i + 1}">Back</a></li>`).join('')}</ol>
      </section>
    </article>

    <section class="v34-resolution" id="v34-kiln" aria-labelledby="v34-kiln-title">
      <div class="v34-res-inner">
        <h2 id="v34-kiln-title">Kiln</h2>
        <p class="v34-res-lede">A Windows desktop app for people who work with Codex and Claude Code, and install skills for Copilot too. It makes the few minutes this essay keeps talking about real.</p>
        <dl class="v34-facts">
          <div><dt>For the list</dt><dd>Capture text, links, screenshots and files as they happen, from the tray or with Ctrl+Shift+Space. Paste a YouTube link and distill the captions into prompts with timestamped links back to the moment.</dd></div>
          <div><dt>For finding out</dt><dd>Choose a local repository and run the exact revision of a prompt through your own signed-in Codex or Claude Code. Watch its messages, commands, searches and token counts live. Runs are read-only. The output and the agent’s pass, fail or uncertain assessment are saved with that revision, apart from your own judgement.</dd></div>
          <div><dt>For learning</dt><dd>Edit, compare revisions, run again on the same repository and see what changed the result. Ask the agent about an item with its source attached.</dd></div>
          <div><dt>For the drawer</dt><dd>Turn a proven prompt into a skill, approve the exact revision and install it for Claude Code, Codex or Copilot. See every installed copy on your machine, whether it matches or was edited outside Kiln, and remove the ones that don’t earn their place. Approved revisions are published to your own GitHub repository.</dd></div>
          <div><dt>What it costs</dt><dd>${subscription.text} ${subscription.fine} Editing, approving and installing never call a model.</dd></div>
        </dl>
        <div class="v34-download">
          <a class="v34-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
          <p>${releaseNote} The build is unsigned, and the app and its CLI are MIT licensed.</p>
        </div>
        <p class="v34-coda">Pick one thing from the list. Try it before you close this tab.</p>
      </div>
    </section>

  </main>
</div>`;

  // Reading time from the essay itself.
  const words = (root.querySelector('[data-body]')!.textContent ?? '').trim().split(/\s+/).length;
  root.querySelector('[data-time]')!.textContent = `About ${Math.max(1, Math.round(words / 230))} minutes to read`;

  // Progress bar that heats from warm grey to ember.
  const bar = root.querySelector<HTMLElement>('[data-progress]')!;
  const essay = root.querySelector<HTMLElement>('.v34-essay')!;
  const grey = [150, 143, 134];
  const ember = [214, 69, 18];
  const mix = (t: number) => grey.map((g, i) => Math.round(g + (ember[i] - g) * t));
  let ticking = false;
  const update = () => {
    ticking = false;
    const start = essay.offsetTop;
    const end = essay.offsetTop + essay.offsetHeight - innerHeight * .6;
    const p = Math.min(1, Math.max(0, (scrollY - start + innerHeight * .15) / Math.max(1, end - start)));
    const heat = p * p;
    const [r, g, b] = mix(heat);
    bar.style.width = `${(p * 100).toFixed(2)}%`;
    bar.style.background = `rgb(${r} ${g} ${b})`;
    bar.style.boxShadow = heat > .5 ? `0 0 ${Math.round((heat - .5) * 28)}px rgb(${r} ${g} ${b} / .7)` : 'none';
    document.documentElement.style.setProperty('--v34-heat', heat.toFixed(3));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  // On wide screens the numbered references point at the sidenote beside them, so highlight it instead of jumping.
  root.querySelectorAll<HTMLAnchorElement>('[data-note]').forEach(link => link.addEventListener('click', event => {
    if (!matchMedia('(min-width: 1100px)').matches) return;
    event.preventDefault();
    const note = root.querySelector<HTMLElement>(`[data-sn="${link.dataset.note}"]`)!;
    note.classList.remove('is-lit'); void note.offsetWidth; note.classList.add('is-lit');
  }));
}
