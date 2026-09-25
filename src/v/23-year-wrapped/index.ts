// PROTOTYPE variant 20 — Year wrapped. A full-screen story recap of a sample year in saving things, then the Kiln year, then the details.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

const ink = '#1a0b3d', lime = '#c6ff3d', orange = '#ff4f1f', pink = '#ff8fd0', cream = '#fff3d6', teal = '#0e7c66';

// Digits become reels that roll into place when their slide opens; everything else stays still.
const roll = (value: string) => `<span class="v20-roll"><span class="visually-hidden">${value}</span><span aria-hidden="true">${[...value].map((char, i) => /\d/.test(char)
  ? `<span class="v20-reel" style="--d:${char};--i:${i}"><span class="v20-strip">${'01234567890123456789'.split('').map(n => `<span>${n}</span>`).join('')}</span></span>`
  : `<span class="v20-static">${char}</span>`).join('')}</span></span>`;

type Slide = { bg: string; fg: string; shape: string; html: string };
const slides: Slide[] = [
  { bg: orange, fg: ink, shape: 'sun', html: `<p class="v20-kicker">Kiln presents</p><h1 class="v20-h1">Your year in saving things</h1><p class="v20-sub">A sample year. Probably not far off yours.</p><p class="v20-hint">Tap, click or press → to continue</p>` },
  { bg: ink, fg: lime, shape: 'rings', html: `<p class="v20-kicker">This year you saved</p><p class="v20-big">${roll('312')}</p><p class="v20-after">things</p><p class="v20-sub">Screenshots, threads, links, “watch later” videos, and a note called “prompts” with 64 prompts in it.</p>` },
  { bg: lime, fg: ink, shape: 'block', html: `<p class="v20-kicker">You tried</p><p class="v20-big v20-huge">${roll('4')}</p><p class="v20-sub">One of them worked. You can’t remember which, or where you saved it.</p>` },
  { bg: pink, fg: ink, shape: 'moon', html: `<p class="v20-kicker">Your top saving hour</p><p class="v20-big v20-big-long">${roll('11:48')}<span class="v20-unit">pm</span></p><p class="v20-sub">Peak optimism. Lowest follow-through.</p>` },
  { bg: teal, fg: cream, shape: 'stripes', html: `<p class="v20-kicker">Your most saved genre</p><p class="v20-quote">“This will change how you use AI”</p><p class="v20-sub">Saved ${roll('41')} times. Tested ${roll('0')} times.</p>` },
  { bg: cream, fg: ink, shape: 'folders', html: `<p class="v20-kicker">Skills installed across 5 folders</p><p class="v20-big">${roll('47')}</p><p class="v20-sub">You remember writing 9. Every one of them describes itself to your agent on every turn.</p>` },
  { bg: ink, fg: orange, shape: 'flip', html: `<p class="v20-kicker">Same you. Same sample year.</p><h2 class="v20-h2">Now, the year with Kiln.</h2>` },
  { bg: orange, fg: ink, shape: 'sun', html: `<p class="v20-kicker">Tested on your repo</p><p class="v20-mid">within minutes of saving</p><p class="v20-sub">Save the prompt, pick <code>./my-game</code>, run it through Codex or Claude Code. Read-only. You watch it work, and the verdict lands on that exact revision.</p>` },
  { bg: lime, fg: ink, shape: 'block', html: `<p class="v20-kicker">Your top revision</p><ol class="v20-chips"><li class="is-unc">r1 <span>uncertain</span></li><li class="is-fail">r2 <span>fail</span></li><li class="is-pass">r3 <span>pass</span></li></ol><p class="v20-big">r${roll('3')}</p><p class="v20-sub">You edited it, read the diff, ran it again on the same repo. Now you know which line made the difference.</p>` },
  { bg: pink, fg: ink, shape: 'rings', html: `<p class="v20-kicker">Prompts that became skills</p><p class="v20-big">${roll('6')}</p><p class="v20-sub">Each one approved at an exact revision and installed into Claude Code, Codex or Copilot. Every session since has them.</p>` },
  { bg: cream, fg: ink, shape: 'end', html: `<p class="v20-kicker">Your next year starts with</p><h2 class="v20-h2">one test.</h2><div class="v20-end-actions"><a class="v20-btn v20-btn-dark" href="${installer}">${windowsMark}<span>Download for Windows</span></a><button type="button" class="v20-btn" data-replay>Watch again</button><a class="v20-btn" href="#v20-details">See how it works</a></div><p class="v20-end-fine">${releaseNote}</p>` },
];
const DURATION = 5200;

const blocks = [
  { c: 'v20-b-orange v20-b-wide', h: 'Test it on your own repo, today', p: 'Choose a local project or repository, or an isolated example, and run the exact prompt revision through Codex or Claude Code. Watch it live: messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and token counts. Up to two runs at once; cancel or retry. Experiments are read-only, so nothing in your code changes.' },
  { c: 'v20-b-ink', h: 'A verdict, not a vibe', p: 'Output and the agent’s pass, fail or uncertain assessment are saved against the revision you ran. Tasks that need edits or unavailable tools come back uncertain rather than faked. The agent’s assessment is kept separate from yours.' },
  { c: 'v20-b-lime', h: 'Learn by running it again', p: 'Edit the prompt, compare revisions and diffs, and run it on the same repo. “Ask the agent” talks an item through with its attachments and source video.' },
  { c: 'v20-b-pink', h: 'Keep the one that worked', p: '“Create skill” drafts a SKILL.md from a prompt, image or note, using bundled writing-for-agents guidance. Approve the exact revision and install it into Codex, Claude Code or Copilot locations. A new session picks it up.' },
  { c: 'v20-b-cream', h: 'Save it in a second', p: 'Paste or drop text, links, screenshots and files. Ctrl+N to capture, Ctrl+Shift+Space for quick search, a tray icon. “Save only” never calls a model; “Analyze and add” turns a source into prompts, insights, techniques, tools and resources.' },
  { c: 'v20-b-teal', h: 'That video, distilled', p: 'Paste a YouTube link and press Distill video. Captions become entries with timestamped source links, and the transcript stays attached.' },
  { c: 'v20-b-ink v20-b-wide', h: 'See every skill you actually installed', p: 'One library for prompts, skills and custom agents. For each skill, every installed copy across personal locations and enrolled projects: installed, identical, differs, linked or edited outside Kiln. Compare file by file, remove copies in bulk. Approvals publish to your own Kiln repository on GitHub, and CLAUDE.md, AGENTS.md and other config files get in-place editing with 30 private backups.' },
];
const sample = examples[2];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Your year in saving things';
  root.innerHTML = `
<div class="v20">
  <main id="main">
    <section class="v20-story" tabindex="0" aria-roledescription="story" aria-label="Your sample year in saving things, ${slides.length} slides. Use the left and right arrow keys to move, space to pause." data-state="playing">
      <div class="v20-bars" aria-hidden="true">${slides.map((_, i) => `<span data-bar="${i}"><i></i></span>`).join('')}</div>
      <div class="v20-chrome">
        <a class="v20-brand" href="?">Kiln</a>
        <div class="v20-chrome-r">
          <button type="button" class="v20-pause" aria-pressed="false">Pause</button>
          <a class="v20-skip" href="#v20-details">Skip the story</a>
        </div>
      </div>
      <p class="visually-hidden" aria-live="polite" data-status></p>
      <div class="v20-slides">${slides.map((slide, i) => `
        <div class="v20-slide" data-slide="${i}" data-shape="${slide.shape}" style="--bg:${slide.bg};--fg:${slide.fg}" aria-hidden="true" inert>
          <span class="v20-shape" aria-hidden="true"></span>
          <div class="v20-slide-body">${slide.html}</div>
        </div>`).join('')}
      </div>
      <button type="button" class="v20-zone v20-zone-prev" aria-label="Previous slide"></button>
      <button type="button" class="v20-zone v20-zone-next" aria-label="Next slide"></button>
    </section>

    <section class="v20-details" id="v20-details" aria-labelledby="v20-details-title">
      <div class="v20-details-head">
        <h2 id="v20-details-title">Tested on your repo within minutes of saving.</h2>
        <p>Kiln is a Windows desktop app, with a CLI, for people who use coding agents. It takes the things you save, runs them where they matter, and keeps the ones that prove themselves.</p>
      </div>
      <div class="v20-mosaic">${blocks.map(block => `<article class="v20-block ${block.c}"><h3>${block.h}</h3><p>${block.p}</p></article>`).join('')}</div>
    </section>

    <section class="v20-example" aria-labelledby="v20-example-title">
      <p class="v20-ex-src">${sample.source}</p>
      <h2 id="v20-example-title">${sample.title}</h2>
      <blockquote>${sample.prompt}</blockquote>
      <p class="v20-ex-foot">A real prompt from a Kiln library, shortened. Run it on a game project and see whether it earns a place as a skill: ${sample.skill.charAt(0).toLowerCase()}${sample.skill.slice(1)}</p>
    </section>

    <section class="v20-facts" aria-label="Good to know">
      <p><b>Uses what you already pay for.</b> Your signed-in Codex or Claude Code, on your ChatGPT or Claude subscription. No API key, no extra API bill. Usage limits still apply.</p>
      <p><b>Asks first.</b> A consent notice explains what’s sent before any agent interaction. Editing, approving and installing never call a model.</p>
      <p><b>Lives with you, backed by GitHub.</b> The library is local and backed by a GitHub repository Kiln creates for you with the official <code>gh</code> CLI. Not offline, not account-free.</p>
    </section>
  </main>

  <footer class="v20-download" id="v20-download" aria-labelledby="v20-dl-title">
    <h2 id="v20-dl-title">Next year, test what you save.</h2>
    <a class="v20-btn v20-btn-lime" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
    <p>${releaseNote} Builds are unsigned. MIT licensed.</p>
    <p class="v20-footnote">Every number in the story above is from a sample year, not from real users.</p>
  </footer>
</div>`;

  const story = root.querySelector<HTMLElement>('.v20-story')!;
  const slideEls = [...root.querySelectorAll<HTMLElement>('.v20-slide')];
  const bars = [...root.querySelectorAll<HTMLElement>('[data-bar]')];
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const pauseButton = root.querySelector<HTMLButtonElement>('.v20-pause')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = -1;
  let manualPause = reduced;
  let hovered = false;
  let held = false;
  let holdTimer = 0;
  let focused = false;

  const syncPause = () => {
    const paused = manualPause || hovered || held || focused;
    story.dataset.state = paused ? 'paused' : 'playing';
    pauseButton.setAttribute('aria-pressed', String(manualPause));
    pauseButton.textContent = manualPause ? 'Play' : 'Pause';
  };
  const go = (index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    if (next === current) return;
    const forward = next > current;
    const previous = slideEls[current];
    story.style.setProperty('--fg', slides[next].fg);
    story.style.setProperty('--bg', slides[next].bg);
    slideEls.forEach(el => el.classList.remove('is-leaving'));
    if (previous && !reduced) { previous.classList.add('is-leaving'); setTimeout(() => previous.classList.remove('is-leaving'), 760); }
    slideEls.forEach((el, i) => {
      const active = i === next;
      el.classList.toggle('is-active', active);
      el.classList.remove('is-in-next', 'is-in-prev');
      el.setAttribute('aria-hidden', String(!active));
      el.inert = !active;
    });
    if (!reduced && current !== -1) {
      const el = slideEls[next];
      void el.offsetWidth;
      el.classList.add(forward ? 'is-in-next' : 'is-in-prev');
    }
    bars.forEach((bar, i) => {
      bar.classList.toggle('is-done', i < next);
      bar.classList.remove('is-now');
    });
    void bars[next].offsetWidth;
    bars[next].classList.add('is-now');
    current = next;
    story.classList.toggle('is-end', next === slides.length - 1);
    status.textContent = `Slide ${next + 1} of ${slides.length}`;
    syncPause();
  };
  bars.forEach((bar, i) => bar.querySelector('i')!.addEventListener('animationend', () => { if (i === current && current < slides.length - 1) go(current + 1); }));
  story.style.setProperty('--dur', `${DURATION}ms`);

  root.querySelector('.v20-zone-prev')!.addEventListener('click', () => go(current - 1));
  root.querySelector('.v20-zone-next')!.addEventListener('click', () => go(current + 1));
  pauseButton.addEventListener('click', () => { manualPause = !manualPause; syncPause(); });
  root.querySelector('[data-replay]')!.addEventListener('click', () => { go(0); story.focus(); });
  story.addEventListener('keydown', event => {
    if ((event.target as HTMLElement).closest('a')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(current + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === ' ' && event.target === story) {
      event.preventDefault();
      manualPause = !manualPause;
      syncPause();
    }
  });
  // Hovering the words you're reading pauses; so does pressing and holding, or keyboard focus.
  story.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || current < 0) return;
    const box = slideEls[current].querySelector<HTMLElement>('.v20-slide-body')!.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (inside !== hovered) { hovered = inside; syncPause(); }
  });
  story.addEventListener('pointerleave', () => { hovered = false; syncPause(); });
  story.addEventListener('pointerdown', () => { holdTimer = window.setTimeout(() => { held = true; syncPause(); }, 220); });
  const release = () => { clearTimeout(holdTimer); if (held) setTimeout(() => { held = false; syncPause(); }); };
  story.addEventListener('pointerup', release);
  story.addEventListener('pointercancel', release);
  story.addEventListener('click', event => { if (held) event.stopPropagation(); }, true);
  story.addEventListener('focusin', event => { focused = (event.target as HTMLElement).matches(':focus-visible'); syncPause(); });
  story.addEventListener('focusout', event => { if (!story.contains(event.relatedTarget as Node)) { focused = false; syncPause(); } });
  go(0);
}
