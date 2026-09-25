// PROTOTYPE variant 33 — One a day. A habit-app homepage with a small kiln mascot that reacts to test verdicts.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Mood = 'happy' | 'celebrate' | 'thinking' | 'encourage' | 'working';
type Verdict = 'pass' | 'uncertain' | 'fail';
type Run = { prompt: string; verdict: Verdict; result: string };
type Lesson = { title: string; skill: string; runs: [Run, Run]; lesson: string; changed: string };

const lessons: Lesson[] = [
  {
    title: examples[0].title, skill: 'Give it someone to be',
    runs: [
      { prompt: 'Check my app for usability problems.', verdict: 'fail', result: 'It came back with 23 generic tips, like “add tooltips” and “improve contrast”, without naming one real screen. The agent marked its own answer as failing the request.' },
      { prompt: examples[0].prompt, verdict: 'pass', result: 'It skipped the parent signup, tried three activities and stopped at the first obstacle: the picker assumes you can read the word “Quiz”. It suggested an icon and a spoken hint. No files changed.' },
    ],
    lesson: 'A persona gives the agent a point of view. “Describe that first obstacle” gives it a finish line. Together they turn a vague review into one finding you can act on today.',
    changed: 'Added who is using the app, what to skip, and when to stop.',
  },
  {
    title: examples[1].title, skill: 'Ask for the cause, not the fix',
    runs: [
      { prompt: 'You keep refactoring files I didn’t ask about. Fix AGENTS.md so you stop.', verdict: 'uncertain', result: 'Doing what you asked means editing AGENTS.md, and experiments are read-only. So instead of pretending, it came back uncertain and explained what it would have changed.' },
      { prompt: examples[1].prompt, verdict: 'pass', result: 'It traced the unwanted refactor to a line in AGENTS.md that asks for “tidy code on every change”, and proposed a one-sentence replacement for you to review.' },
    ],
    lesson: 'Ask for a diagnosis and a proposed change rather than the change itself. You get something to judge, and the run can succeed without touching a file.',
    changed: 'Swapped “fix it” for “trace it, explain it, propose the smallest change”.',
  },
  {
    title: examples[2].title, skill: 'Say what done looks like',
    runs: [
      { prompt: 'Playtest this game and tell me what you think.', verdict: 'fail', result: 'Three friendly paragraphs of impressions, no list and nothing ranked. The agent judged that it had not produced anything you could act on.' },
      { prompt: examples[2].prompt, verdict: 'pass', result: 'A ranked list of ten improvements with a reason for each, from reading the code and level data. It flagged which ones need a real playthrough to confirm.' },
    ],
    lesson: 'Name the output. “Rank the ten most impactful” and “give me a list to review” tell the agent what finished looks like, so it can tell you honestly whether it got there.',
    changed: 'Asked for a ranked top ten with reasons, and said “make no changes”.',
  },
];

const bubbles: Record<Mood, string> = {
  happy: 'Hi! Saved anything good today?',
  working: 'Reading your repo… read-only, promise.',
  celebrate: 'It passed! Your call now: keep it?',
  thinking: 'Hmm. It couldn’t be sure, and it said so. That’s useful.',
  encourage: 'Good try! Change one sentence and run it again.',
};
const moodFor: Record<Verdict, Mood> = { pass: 'celebrate', uncertain: 'thinking', fail: 'encourage' };
const verdictLabel: Record<Verdict, string> = { pass: 'Pass', uncertain: 'Uncertain', fail: 'Fail' };
const runSteps = ['Reading the files it needs', 'Running a search in your repo', 'Thinking it through', 'Checking its own answer'];

const mascot = (id: string, mood: Mood, label: string) => `
<svg class="v33-mascot" data-mascot="${id}" data-mood="${mood}" viewBox="0 0 200 230" role="img" aria-label="${label}">
  <ellipse class="v33-shadow" cx="100" cy="220" rx="58" ry="7"/>
  <g class="v33-bob">
    <g class="v33-chimney-flame"><path d="M100 2c9 10 14 17 10 25-2 5-6 7-10 7s-8-2-10-7c-3-7 2-12 5-16 1 4 3 6 5 6 1-5-1-9 0-15z" fill="#ffc53d"/><path d="M100 16c4 5 6 8 4 12-1 2-2 3-4 3s-3-1-4-3c-1-3 1-6 4-12z" fill="#ff7a1a"/></g>
    <rect x="86" y="30" width="28" height="22" rx="6" fill="#d9540b"/>
    <path class="v33-body" d="M28 200C20 116 44 50 100 46c56 4 80 70 72 154z" fill="#ff8a2a"/>
    <path d="M28 200c-1.5-12-1.5-24-.5-36h145c1 12 1 24-.5 36z" fill="#ef6c14"/>
    <path d="M58 70c10-12 24-18 38-19" stroke="#ffb46b" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M78 200v-22a22 22 0 0 1 44 0v22z" fill="#7a2e0e"/>
    <g class="v33-door-flame"><path d="M100 176c7 7 10 12 8 17-1 4-4 6-8 6s-7-2-8-6c-2-5 2-9 4-12 1 3 2 4 4 4 1-3-1-6 0-9z" fill="#ffc53d"/></g>
    <ellipse cx="68" cy="210" rx="16" ry="9" fill="#d9540b"/><ellipse cx="132" cy="210" rx="16" ry="9" fill="#d9540b"/>
    <ellipse class="v33-cheek" cx="62" cy="130" rx="10" ry="6"/><ellipse class="v33-cheek" cx="138" cy="130" rx="10" ry="6"/>
    <g class="v33-eyes">
      <g data-show="happy celebrate encourage working"><ellipse cx="76" cy="108" rx="8" ry="10" fill="#1d2b36"/><ellipse cx="124" cy="108" rx="8" ry="10" fill="#1d2b36"/><circle cx="79" cy="104" r="3" fill="#fff"/><circle cx="127" cy="104" r="3" fill="#fff"/></g>
      <g data-show="thinking"><ellipse cx="80" cy="104" rx="8" ry="10" fill="#1d2b36"/><ellipse cx="128" cy="104" rx="8" ry="10" fill="#1d2b36"/><circle cx="83" cy="99" r="3" fill="#fff"/><circle cx="131" cy="99" r="3" fill="#fff"/><path d="M68 88q10-6 20-4M118 78q10-5 20 0" stroke="#1d2b36" stroke-width="4" stroke-linecap="round" fill="none"/></g>
    </g>
    <g data-show="encourage"><path d="M66 88q10-7 20-3M114 85q10-4 20 3" stroke="#1d2b36" stroke-width="4" stroke-linecap="round" fill="none"/></g>
    <g data-show="happy working"><path d="M86 130q14 13 28 0" stroke="#1d2b36" stroke-width="5" stroke-linecap="round" fill="none"/></g>
    <g data-show="celebrate"><path d="M82 126q18 26 36 0z" fill="#1d2b36"/><path d="M92 136q8 6 16 0q-3 6-8 6t-8-6z" fill="#ff5f6d"/></g>
    <g data-show="thinking"><path d="M92 136l18-4" stroke="#1d2b36" stroke-width="5" stroke-linecap="round" fill="none"/></g>
    <g data-show="encourage"><path d="M84 128q16 16 32 0" stroke="#1d2b36" stroke-width="5" stroke-linecap="round" fill="none"/></g>
    <g class="v33-arms">
      <g data-show="happy working"><path d="M40 150q-18 4-22 -12" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M160 150q18 4 22 -12" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/></g>
      <g data-show="celebrate" class="v33-arms-up"><path d="M44 120q-20-10-20-40" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M156 120q20-10 20-40" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/></g>
      <g data-show="thinking"><path d="M40 152q-16 6-20-8" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M160 158q-10 4-40-10" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/><text x="150" y="70" class="v33-q">?</text></g>
      <g data-show="encourage"><path d="M40 150q-18 4-22-12" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M160 148q20-2 24-26" stroke="#ef6c14" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M184 122v-14" stroke="#ef6c14" stroke-width="9" stroke-linecap="round"/></g>
    </g>
  </g>
</svg>`;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const flame = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 2c3 4 7 7 7 12a7 7 0 0 1-14 0c0-3 2-5 3-7 0 2 1 3 2 3 1-3 0-5 2-8z" fill="currentColor"/></svg>';

export function render(root: HTMLElement) {
  document.title = 'Kiln — Try one prompt a day';
  root.innerHTML = `
<div class="v33">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v33-top">
    <a class="v33-brand" href="?"><span class="v33-brand-dot" aria-hidden="true">${flame}</span>Kiln</a>
    <nav aria-label="Main navigation"><a href="#v33-day">How a day goes</a><a href="#v33-lesson">Today’s lesson</a><a href="#v33-skill">Skills</a><a class="v33-nav-cta" href="#v33-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v33-hero" aria-labelledby="v33-title">
      <div class="v33-hero-copy">
        <h1 id="v33-title">Try one prompt a day.</h1>
        <p class="v33-sub">Get better at prompting without studying it.</p>
        <p>You already save good prompts. Kiln is the Windows app that makes trying one take minutes: capture it, run it on your own repo through Codex or Claude Code, and see what happened. Do that most days and you’ll notice what works.</p>
        <div class="v33-hero-actions">
          <a class="v33-btn v33-btn-orange" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <a class="v33-btn v33-btn-white" href="#v33-lesson">Try today’s lesson</a>
        </div>
      </div>
      <div class="v33-hero-art">
        <p class="v33-bubble" data-bubble="hero">${bubbles.happy}</p>
        ${mascot('hero', 'happy', 'Cinder, a small round kiln with a face and a flame on its chimney, waving')}
        <div class="v33-streak" aria-labelledby="v33-streak-title">
          <div class="v33-streak-top"><span class="v33-streak-flame">${flame}</span><p id="v33-streak-title"><strong data-streak>0</strong> <span data-streak-word>tries</span> this week</p></div>
          <ol class="v33-week" aria-label="Days tried on this page">${days.map(day => `<li><span class="v33-dot" aria-hidden="true"></span>${day}</li>`).join('')}</ol>
          <p class="v33-streak-note">Your habit, counted here on this page. Kiln has no streak counter; it just makes each day’s try quick.</p>
        </div>
      </div>
    </section>

    <section class="v33-day" id="v33-day" aria-labelledby="v33-day-title">
      <h2 id="v33-day-title">How a day goes</h2>
      <ol class="v33-steps">
        <li class="v33-step is-teal">
          <span class="v33-step-no">1</span>
          <h3>Save it the moment you see it</h3>
          <p>Paste or drop text, links, screenshots and files. Press Ctrl+N, use the tray icon, or Ctrl+Shift+Space from anywhere. Paste a YouTube link and “Distill video” turns captions into prompts with timestamped links.</p>
        </li>
        <li class="v33-step is-orange">
          <span class="v33-step-no">2</span>
          <h3>Run it on your own repo</h3>
          <p>Pick a local project, or an isolated example, and run the exact revision through Codex or Claude Code. Watch messages, commands and searches live. Experiments are read-only, so nothing in your code changes.</p>
        </li>
        <li class="v33-step is-ink">
          <span class="v33-step-no">3</span>
          <h3>Read the verdict</h3>
          <p>The output and the agent’s pass, fail or uncertain assessment are saved with that revision. Your own judgement is kept separately. You decide what to keep.</p>
        </li>
      </ol>
    </section>

    <section class="v33-lesson" id="v33-lesson" aria-labelledby="v33-lesson-title">
      <div class="v33-lesson-head">
        <h2 id="v33-lesson-title">Today’s lesson</h2>
        <p>Three real prompts from a Kiln library, each with a weaker first draft. Run revision 1, then revision 2, and watch what one change does. The runs here are samples; in Kiln they happen on your repo.</p>
      </div>
      <div class="v33-lessons" role="tablist" aria-label="Lessons">
        ${lessons.map((lesson, i) => `<button type="button" role="tab" class="v33-tab" id="v33-tab-${i}" aria-selected="${i === 0}" aria-controls="v33-panel" data-lesson="${i}"><span>Lesson ${i + 1}</span>${lesson.skill}</button>`).join('')}
      </div>
      <div class="v33-panel" id="v33-panel" role="tabpanel" aria-labelledby="v33-tab-0">
        <div class="v33-console">
          <p class="v33-console-title" data-lesson-title></p>
          <div class="v33-revs" role="radiogroup" aria-label="Revision">
            <button type="button" role="radio" class="v33-rev" aria-checked="true" data-rev="0">Revision 1</button>
            <button type="button" role="radio" class="v33-rev" aria-checked="false" data-rev="1">Revision 2</button>
          </div>
          <blockquote class="v33-prompt" data-prompt></blockquote>
          <p class="v33-repo"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor"/></svg> ~/code/your-app <em>read-only</em></p>
          <button type="button" class="v33-btn v33-btn-orange v33-run" data-run>Run on my repo</button>
          <div class="v33-progress" data-progress hidden><div class="v33-bar"><span data-bar></span></div><p data-step></p></div>
        </div>
        <div class="v33-reaction">
          <div class="v33-stage" data-stage>
            <p class="v33-bubble v33-bubble-small" data-bubble="lesson" aria-live="polite">${bubbles.happy}</p>
            ${mascot('lesson', 'happy', 'Cinder, reacting to the verdict')}
            <div class="v33-confetti" data-confetti aria-hidden="true"></div>
          </div>
          <div class="v33-result" data-result hidden>
            <p class="v33-verdict" data-verdict></p>
            <p class="v33-result-text" data-result-text></p>
            <div class="v33-yours"><span>Your call:</span><button type="button" class="v33-chip" aria-pressed="false">Keep it</button><button type="button" class="v33-chip" aria-pressed="false">Not yet</button></div>
          </div>
        </div>
        <div class="v33-cards">
          <article class="v33-card is-locked" data-card="why"><h3>What made it pass</h3><p data-why>Run revision 2 to unlock this card.</p></article>
          <article class="v33-card is-locked" data-card="diff"><h3>What changed between revisions</h3><p data-changed>Run both revisions to compare them.</p><div class="v33-diff" data-diff hidden></div></article>
        </div>
      </div>
    </section>

    <section class="v33-learn" aria-labelledby="v33-learn-title">
      <h2 id="v33-learn-title">What you pick up without trying to</h2>
      <ul class="v33-learn-grid">
        <li><h3>Diffs that explain results</h3><p>Edit a prompt, compare revisions side by side and run it again on the same repo. You see which sentence changed the outcome.</p></li>
        <li><h3>A second opinion on tap</h3><p>“Ask the agent” discusses any item with its attachments and the source video’s context, so a half-understood idea gets explained where you saved it.</p></li>
        <li><h3>What a run actually cost</h3><p>Every run shows its model, reasoning effort, elapsed time and token counts: input, cached and output. Long prompts stop being free in your head.</p></li>
        <li><h3>Honest “I don’t know”s</h3><p>A task that needs edits or a tool the run doesn’t have comes back uncertain, not as a faked pass. That’s a lesson in itself.</p></li>
      </ul>
    </section>

    <section class="v33-grad" id="v33-skill" aria-labelledby="v33-grad-title">
      <div class="v33-grad-art">${mascot('grad', 'celebrate', 'Cinder celebrating a prompt that became a skill')}</div>
      <div class="v33-grad-copy">
        <h2 id="v33-grad-title">When a prompt keeps passing, it graduates.</h2>
        <p>“Create skill” drafts a SKILL.md from the prompt, using Kiln’s bundled writing-for-agents guidance, linked back to where the idea came from. Approve the exact revision you trust and install it. The next agent session picks it up.</p>
        <ul class="v33-agents" aria-label="Install targets"><li>Claude Code</li><li>Codex</li><li>Copilot</li></ul>
        <p class="v33-small">Approval publishes that snapshot to your own Kiln GitHub repository. Editing later makes a new draft; the approved one stays put. Install always uses approved content, and never calls a model.</p>
      </div>
    </section>

    <section class="v33-honest" aria-labelledby="v33-honest-title">
      <h2 id="v33-honest-title">The small print, in big letters</h2>
      <ul class="v33-honest-grid">
        <li><strong>No streaks inside Kiln.</strong> The counter on this page is for fun. The habit is yours.</li>
        <li><strong>${subscription.title}</strong> ${subscription.text} ${subscription.fine}</li>
        <li><strong>Your code stays yours.</strong> Test runs are read-only, and a consent notice explains what’s sent before any agent interaction.</li>
        <li><strong>Windows, plus a CLI.</strong> Your library lives locally, backed by a GitHub repository Kiln sets up with the official gh CLI.</li>
      </ul>
    </section>

    <section class="v33-cta" id="v33-download" aria-labelledby="v33-cta-title">
      <div class="v33-cta-art">${mascot('cta', 'happy', 'Cinder waving goodbye')}</div>
      <div class="v33-cta-copy">
        <h2 id="v33-cta-title">Tomorrow’s prompt is already in your bookmarks.</h2>
        <p>Install Kiln and try it on your repo before lunch.</p>
        <a class="v33-btn v33-btn-white v33-btn-big" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p class="v33-cta-note">${releaseNote} The build is unsigned, so Windows may ask you to confirm.</p>
      </div>
    </section>
  </main>
  <footer class="v33-foot"><p>Kiln 0.17.0 · Windows desktop app and CLI · MIT licensed</p></footer>
</div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setMood = (id: string, mood: Mood) => {
    const svg = root.querySelector<SVGElement>(`[data-mascot="${id}"]`)!;
    svg.dataset.mood = mood;
    svg.classList.remove('is-reacting'); void svg.getBoundingClientRect(); svg.classList.add('is-reacting');
    const bubble = root.querySelector<HTMLElement>(`[data-bubble="${id}"]`);
    if (bubble) bubble.textContent = bubbles[mood];
  };

  // The page-local streak.
  let tries = 0;
  const bump = () => {
    tries = Math.min(7, tries + 1);
    root.querySelector('[data-streak]')!.textContent = String(tries);
    root.querySelector('[data-streak-word]')!.textContent = tries === 1 ? 'try' : 'tries';
    root.querySelectorAll('.v33-week li').forEach((day, i) => day.classList.toggle('is-done', i < tries));
    const streak = root.querySelector<HTMLElement>('.v33-streak')!;
    streak.classList.remove('is-bump'); void streak.offsetWidth; streak.classList.add('is-bump');
  };

  // Lesson player.
  let current = 0;
  let rev = 0;
  let timers: number[] = [];
  const ran = lessons.map(() => [false, false]);
  const prompt = root.querySelector<HTMLElement>('[data-prompt]')!;
  const runButton = root.querySelector<HTMLButtonElement>('[data-run]')!;
  const progress = root.querySelector<HTMLElement>('[data-progress]')!;
  const bar = root.querySelector<HTMLElement>('[data-bar]')!;
  const stepText = root.querySelector<HTMLElement>('[data-step]')!;
  const result = root.querySelector<HTMLElement>('[data-result]')!;
  const verdictOut = root.querySelector<HTMLElement>('[data-verdict]')!;
  const confetti = root.querySelector<HTMLElement>('[data-confetti]')!;

  const updateCards = () => {
    const lesson = lessons[current];
    const why = root.querySelector<HTMLElement>('[data-card="why"]')!;
    const diff = root.querySelector<HTMLElement>('[data-card="diff"]')!;
    why.classList.toggle('is-locked', !ran[current][1]);
    root.querySelector('[data-why]')!.textContent = ran[current][1] ? lesson.lesson : 'Run revision 2 to unlock this card.';
    const both = ran[current][0] && ran[current][1];
    diff.classList.toggle('is-locked', !both);
    root.querySelector('[data-changed]')!.textContent = both ? lesson.changed : 'Run both revisions to compare them.';
    const box = root.querySelector<HTMLElement>('[data-diff]')!;
    box.hidden = !both;
    box.innerHTML = both ? `<p class="is-del">− ${lesson.runs[0].prompt}</p><p class="is-add">+ ${lesson.runs[1].prompt}</p>` : '';
  };
  const show = () => {
    const lesson = lessons[current];
    root.querySelector('[data-lesson-title]')!.textContent = `Lesson ${current + 1}: ${lesson.title}`;
    prompt.textContent = lesson.runs[rev].prompt;
    root.querySelectorAll('[data-rev]').forEach(button => button.setAttribute('aria-checked', String(Number((button as HTMLElement).dataset.rev) === rev)));
    result.hidden = true;
    runButton.disabled = false;
    runButton.textContent = 'Run on my repo';
    progress.hidden = true;
    updateCards();
    setMood('lesson', 'happy');
  };
  const cancelRun = () => { timers.forEach(clearTimeout); timers = []; };

  root.querySelectorAll<HTMLButtonElement>('[data-lesson]').forEach(tab => tab.addEventListener('click', () => {
    cancelRun();
    current = Number(tab.dataset.lesson); rev = 0;
    root.querySelectorAll('[data-lesson]').forEach(other => other.setAttribute('aria-selected', String(other === tab)));
    root.querySelector('#v33-panel')!.setAttribute('aria-labelledby', tab.id);
    show();
  }));
  root.querySelector('[role="tablist"]')!.addEventListener('keydown', event => {
    const key = (event as KeyboardEvent).key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;
    event.preventDefault();
    const next = (current + (key === 'ArrowRight' ? 1 : -1) + lessons.length) % lessons.length;
    const tab = root.querySelector<HTMLButtonElement>(`[data-lesson="${next}"]`)!;
    tab.click(); tab.focus();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-rev]').forEach(button => button.addEventListener('click', () => { cancelRun(); rev = Number(button.dataset.rev); show(); }));

  const burst = () => {
    if (reduced) return;
    const colors = ['#ff7a1a', '#11a39a', '#ffc53d', '#ff5f6d', '#1d2b36'];
    confetti.innerHTML = Array.from({ length: 42 }, (_, i) => {
      const x = (Math.random() * 2 - 1) * 180;
      const y = -120 - Math.random() * 160;
      return `<i style="--x:${x.toFixed(0)}px;--y:${y.toFixed(0)}px;--r:${(Math.random() * 720 - 360).toFixed(0)}deg;--d:${(Math.random() * .25).toFixed(2)}s;background:${colors[i % colors.length]};${i % 3 ? '' : 'border-radius:50%;'}"></i>`;
    }).join('');
    confetti.classList.remove('is-go'); void confetti.offsetWidth; confetti.classList.add('is-go');
  };

  runButton.addEventListener('click', () => {
    cancelRun();
    const run = lessons[current].runs[rev];
    result.hidden = true;
    runButton.disabled = true;
    runButton.textContent = 'Running…';
    progress.hidden = false;
    setMood('lesson', 'working');
    const step = reduced ? 0 : 600;
    runSteps.forEach((text, i) => timers.push(window.setTimeout(() => { stepText.textContent = text; bar.style.width = `${(i + 1) / runSteps.length * 100}%`; }, step * i)));
    timers.push(window.setTimeout(() => {
      progress.hidden = true;
      bar.style.width = '0';
      runButton.disabled = false;
      runButton.textContent = 'Run it again';
      verdictOut.className = `v33-verdict is-${run.verdict}`;
      verdictOut.textContent = `Agent’s assessment: ${verdictLabel[run.verdict]}`;
      root.querySelector('[data-result-text]')!.textContent = run.result;
      result.querySelectorAll('.v33-chip').forEach(chip => chip.setAttribute('aria-pressed', 'false'));
      result.hidden = false;
      setMood('lesson', moodFor[run.verdict]);
      if (run.verdict === 'pass') burst();
      if (!ran[current][rev]) bump();
      ran[current][rev] = true;
      updateCards();
    }, step * runSteps.length + (reduced ? 0 : 200)));
  });
  result.querySelectorAll<HTMLButtonElement>('.v33-chip').forEach(chip => chip.addEventListener('click', () => result.querySelectorAll('.v33-chip').forEach(other => other.setAttribute('aria-pressed', String(other === chip)))));

  show();
}
