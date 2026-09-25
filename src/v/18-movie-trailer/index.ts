// PROTOTYPE 15 — Movie trailer. Letterbox, grain, a scroll-scrubbed teaser, title reveal, stills and a credits roll of features.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Scene = { cls: string; html: string; sub: string };
const scenes: Scene[] = [
  { cls: 'is-rating', sub: '[projector hum]', html: `<div class="v15-rating"><p>The following preview has been approved for</p><p class="v15-rating-big">All repositories</p><p>Experiments are read-only. Nothing in your code changes.</p></div>` },
  { cls: '', sub: '[low drone]', html: `<p class="v15-line">In a world&hellip;</p>` },
  { cls: '', sub: '[a notification chimes]', html: `<p class="v15-line">&hellip;where every developer&hellip;</p>` },
  { cls: '', sub: '[drums]', html: `<p class="v15-line">&hellip;has saved 312 prompts&hellip;</p><p class="v15-aside">give or take</p>` },
  { cls: '', sub: '[silence]', html: `<p class="v15-line is-big">&hellip;and tried none.</p>` },
  { cls: '', sub: '[a single key press]', html: `<p class="v15-line">One prompt.</p><p class="v15-line is-small">One real repository.</p><p class="v15-line is-small">One verdict.</p>` },
  { cls: 'is-title', sub: '[the whole orchestra]', html: `<h1 class="v15-title" aria-label="Kiln">KILN</h1><p class="v15-tag">Test the prompts you saved. Keep the ones that work.</p>` },
  { cls: '', sub: '[applause, probably]', html: `<p class="v15-line is-small">Coming to a</p><p class="v15-line">Windows desktop</p><p class="v15-line is-small">near you</p>` },
];

const credits: [string, string][] = [
  ['Directed by', 'You'],
  ['Written by', 'You, revision 2'],
  ['Tested on', 'Your own repo'],
  ['Starring', 'Codex<br>Claude Code'],
  ['Special appearance by', 'Copilot, for installs'],
  ['Verdict by', 'The agent'],
  ['Final cut', 'You'],
  ['Stunts', 'None. Experiments are read-only'],
  ['Continuity', 'Revision history and diffs'],
  ['Editor', 'Compare revisions, run it again'],
  ['Sound', 'Token usage: input, cached, output'],
  ['Second unit', 'Up to two runs at once'],
  ['Script doctor', 'Ask the agent'],
  ['Adapted for the screen by', 'Create skill, with bundled writing-for-agents guidance'],
  ['Source material', 'Screenshots, posts, links, files and YouTube videos, with timestamped links'],
  ['Location scout', 'Find skills and agents not in the library'],
  ['Continuity of copies', 'Installed, identical, differs, linked, edited outside Kiln'],
  ['Set decoration', 'CLAUDE.md, AGENTS.md, config.toml, hooks.json, MCP and settings files, 30 backups each'],
  ['Archivist', 'Your own Kiln repository on GitHub'],
  ['Distribution', 'Codex, Claude Code and Copilot skill locations'],
  ['Catering', 'Your existing ChatGPT or Claude subscription. No API key'],
  ['Filmed on location in', 'Windows'],
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — In a world where every developer has saved 312 prompts';
  const ex = examples[0];
  root.innerHTML = `
<div class="v15">
  <div class="v15-grain" aria-hidden="true"></div>
  <header class="v15-bar is-top">
    <a class="v15-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v15-stills">Scenes</a><a href="#v15-credits">Credits</a><a href="#v15-tickets">Tickets</a></nav>
  </header>
  <div class="v15-bar is-bottom" aria-hidden="true"><span class="v15-sub"></span><span class="v15-tc">00:00:00:00</span></div>
  <main id="main">
    <section class="v15-trailer" aria-label="Trailer" style="--n:${scenes.length}">
      <div class="v15-stage">
        ${scenes.map((s, i) => `<div class="v15-scene ${s.cls}" data-scene="${i}" data-sub="${s.sub}">${s.html}</div>`).join('')}
        <p class="v15-hint" aria-hidden="true">Scroll to play</p>
      </div>
    </section>

    <section class="v15-logline" aria-labelledby="v15-log-title">
      <h2 id="v15-log-title">The prompt you saved finally gets its screen test.</h2>
      <p>Kiln is a Windows desktop app. Save a prompt, pick one of your own repositories and run the exact revision through the Codex or Claude Code you already use. Watch it live, get a verdict, change a line, run it again. When it earns it, it becomes a skill your agents pick up in the next session.</p>
    </section>

    <section class="v15-stills" id="v15-stills" aria-labelledby="v15-stills-title">
      <h2 id="v15-stills-title" class="visually-hidden">Scenes from the film</h2>

      <article class="v15-still">
        <div class="v15-frame v15-script">
          <p class="v15-slug">INT. YOUR REPOSITORY &mdash; LATE</p>
          <p class="v15-action">A developer finds a prompt saved weeks ago. Opens Kiln. Picks the game project.</p>
          <p class="v15-char">YOU</p>
          <p class="v15-dialog">${ex.prompt}</p>
          <p class="v15-caption">&ldquo;Try it as a seven-year-old&rdquo; &mdash; from a YouTube talk</p>
        </div>
        <div class="v15-still-text"><h3>Scene 1. The script</h3><p>Capture anything the moment it catches your eye: paste or drop text, links, screenshots, images and files, press <kbd>Ctrl</kbd>+<kbd>N</kbd>, or find it again with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>. Paste a YouTube link and <em>Distill video</em> turns the captions into prompts and techniques with timestamped links.</p></div>
      </article>

      <article class="v15-still is-flip">
        <div class="v15-frame v15-run" role="img" aria-label="A live experiment log showing files read, commands, reasoning, model, reasoning effort, elapsed time and tokens.">
          <p class="v15-run-head"><span>Claude Code</span><span>reasoning effort: high</span><span class="v15-rec">REC 03:52</span></p>
          <ol>
            <li><b>read</b> src/screens/Start.tsx</li>
            <li><b>read</b> src/screens/Signup.tsx</li>
            <li><b>run</b> git log --oneline -5</li>
            <li><b>think</b> The first screen after signup asks the player to &ldquo;configure a profile&rdquo;.</li>
            <li><b>search</b> reading age vocabulary lists</li>
            <li><b>think</b> A seven-year-old would stop here.</li>
          </ol>
          <p class="v15-run-foot">tokens 41,200 in &middot; 28,900 cached &middot; 2,300 out <i>(sample)</i></p>
        </div>
        <div class="v15-still-text"><h3>Scene 2. The test</h3><p>Choose a local project or an isolated example and run the exact prompt revision. You watch messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and tokens as they happen. Up to two runs at once; cancel or retry. No stunt doubles needed: nothing in your code changes.</p></div>
      </article>

      <article class="v15-still">
        <div class="v15-frame v15-verdict" role="img" aria-label="The agent's verdict, pass, shown apart from your own decision.">
          <div class="v15-stamp">Pass</div>
          <dl><div><dt>The agent's assessment</dt><dd>Pass</dd></div><div><dt>Your judgement</dt><dd>Keep, with one change</dd></div></dl>
        </div>
        <div class="v15-still-text"><h3>Scene 3. The verdict</h3><p>Output and the agent&rsquo;s pass, fail or uncertain are saved against that revision, and kept apart from your own call. Tasks that would need edits or unavailable tools come back uncertain, not faked. Edit the prompt, compare the revisions and diffs, and run it again on the same repo. That&rsquo;s how you learn what changed the result.</p></div>
      </article>

      <article class="v15-still is-flip">
        <div class="v15-frame v15-sequel" role="img" aria-label="A sequel title card: the prompt became an approved, installed skill.">
          <p class="v15-sequel-title">Usability check</p>
          <p class="v15-sequel-sub">Part II: the skill</p>
          <p class="v15-sequel-meta">Revision 2 approved &middot; installed for Claude Code</p>
        </div>
        <div class="v15-still-text"><h3>Scene 4. The sequel</h3><p><em>Create skill</em> drafts a SKILL.md from the prompt that proved itself. Approve the exact revision; Kiln commits it to your own Kiln repository on GitHub and installs it into Codex, Claude Code or Copilot locations. A new agent session picks it up. One tested prompt, and your everyday work changes.</p></div>
      </article>
    </section>

    <section class="v15-credits" id="v15-credits" aria-labelledby="v15-credits-title">
      <h2 id="v15-credits-title">Kiln</h2>
      <dl>${credits.map(([role, who]) => `<div><dt>${role}</dt><dd>${who}</dd></div>`).join('')}</dl>
      <p class="v15-disclaimer">No code was harmed in the making of this film. The agent&rsquo;s assessment is its own and does not represent your judgement. Your subscription&rsquo;s usage limits still apply. A consent notice explains what is sent before any agent interaction.</p>
    </section>

    <section class="v15-tickets" id="v15-tickets" aria-labelledby="v15-tix-title">
      <div class="v15-ticket">
        <div class="v15-ticket-main">
          <p class="v15-admit">Admit one</p>
          <h2 id="v15-tix-title">Kiln 0.17.0</h2>
          <p class="v15-ticket-info">Now showing on Windows. Desktop app and CLI. MIT licensed.</p>
          <a class="v15-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        </div>
        <div class="v15-ticket-stub" aria-hidden="true"><span>No. 0170</span><span>Seat: yours</span></div>
      </div>
      <p class="v15-fine">${releaseNote} Builds are unsigned.</p>
    </section>
  </main>
</div>`;

  const trailer = root.querySelector<HTMLElement>('.v15-trailer')!;
  const sceneEls = [...root.querySelectorAll<HTMLElement>('.v15-scene')];
  const sub = root.querySelector<HTMLElement>('.v15-sub')!;
  const tc = root.querySelector<HTMLElement>('.v15-tc')!;
  const hint = root.querySelector<HTMLElement>('.v15-hint')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = trailer.getBoundingClientRect();
    const total = trailer.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / total));
    const n = sceneEls.length;
    const at = p * n;
    let current = 0, best = -1;
    sceneEls.forEach((el, i) => {
      const local = at - i;
      const fadeIn = i === 0 ? 1 : Math.min(1, Math.max(0, local / .28));
      const fadeOut = i === n - 1 ? 1 : Math.min(1, Math.max(0, (1 - local) / .28));
      const o = local < -0.001 || local > 1.001 ? 0 : Math.min(fadeIn, fadeOut);
      const k = Math.min(1, Math.max(0, local));
      const scale = el.classList.contains('is-title') ? 1.5 - .5 * Math.min(1, k * 1.6) : 1.1 - .1 * k;
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(4)})`;
      if (o > best) { best = o; current = i; }
    });
    sub.textContent = rect.top <= 1 && rect.bottom > innerHeight * .5 ? sceneEls[current].dataset.sub ?? '' : '';
    const secs = p * 94;
    tc.textContent = `00:${pad(secs / 60)}:${pad(secs % 60)}:${pad((secs * 24) % 24)}`;
    hint.style.opacity = p < .02 ? '1' : '0';
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const setMode = () => {
    root.querySelector('.v15')!.classList.toggle('v15-static', reduce.matches);
    if (reduce.matches) { sceneEls.forEach(el => { el.style.cssText = ''; }); sub.textContent = ''; removeEventListener('scroll', onScroll); }
    else { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); update(); }
  };
  reduce.addEventListener('change', setMode);
  setMode();
}
