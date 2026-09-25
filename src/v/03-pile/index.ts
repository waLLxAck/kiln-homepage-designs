// PROTOTYPE variant C — The pile. A two-ink risograph zine that opens on the bookmark pile and sorts it into what you kept.
import './pile.css';
import { examples, installer, releaseNote, steps, subscription, windowsMark, worries } from '../../content';

// Sample bookmarks. `lane` is how far each got: 0 captured, 1 prompt, 2 tested, 3 approved skill.
const bookmarks = [
  { kind: 'X', text: 'A prompt that makes the agent review its own PR before you do', lane: 1, x: 4, y: 8, r: -7 },
  { kind: 'Video', text: 'Agent workflows talk, 58 minutes', lane: 2, x: 46, y: 2, r: 4 },
  { kind: 'Screenshot', text: 'Someone’s CLAUDE.md, cropped badly', lane: 0, x: 24, y: 22, r: -2 },
  { kind: 'Note', text: 'Try the seven-year-old usability trick', lane: 3, x: 54, y: 30, r: 8 },
  { kind: 'X', text: 'Thread: stop letting your agent guess', lane: 1, x: 0, y: 42, r: 5 },
  { kind: 'Video', text: 'Procedural generation talk, 64 minutes', lane: 0, x: 38, y: 50, r: -9 },
  { kind: 'Link', text: 'A risk-first plan for game prototypes', lane: 0, x: 12, y: 66, r: 3 },
  { kind: 'Prompt', text: 'Playtest this game and rank ten fixes', lane: 2, x: 50, y: 70, r: -4 },
  { kind: 'Screenshot', text: 'A hooks config from a stranger’s repo', lane: 0, x: 30, y: 82, r: 6 },
  { kind: 'X', text: 'Get a repo briefing before picking work', lane: 1, x: 58, y: 88, r: -3 },
];
const lanes = ['Captured', 'Turned into a prompt', 'Tested on a repo', 'Approved as a skill'];

export function render(root: HTMLElement) {
  document.title = 'Kiln — You saved 50 things. Try one.';
  root.innerHTML = `
<div class="pl">
  <header class="pl-top">
    <a class="pl-brand" href="?">Kiln</a>
    <a class="pl-top-link" href="#pl-get">Download for Windows</a>
  </header>
  <main id="main">
    <section class="pl-hero" aria-labelledby="pl-title">
      <div class="pl-hero-copy">
        <h1 id="pl-title">You saved<br>50 things.<br>You tried<br>none of them.</h1>
        <p>A clever prompt on X. A workflow buried in an hour of video. A screenshot of someone else’s config. Kiln is a Windows desktop app that turns that pile into prompts you test on your own repos, and keeps the ones that work as skills your agents can use.</p>
        <button type="button" class="pl-sort" aria-pressed="false">Sort the pile</button>
        <p class="pl-sort-note" aria-live="polite">Ten sample bookmarks, as they usually sit.</p>
      </div>
      <div class="pl-pile" aria-label="Sample bookmarks">
        ${lanes.map((lane, i) => `<span class="pl-lane" style="--lane:${i}">${lane}</span>`).join('')}
        ${bookmarks.map((bookmark, i) => `<article class="pl-card pl-kind-${bookmark.kind.toLowerCase()}" data-card="${i}" style="--x:${bookmark.x}%;--y:${bookmark.y}%;--r:${bookmark.r}deg;--d:${i * 45}ms"><small>${bookmark.kind}</small><p>${bookmark.text}</p></article>`).join('')}
      </div>
    </section>

    <section class="pl-route" aria-labelledby="pl-route-title">
      <h2 class="visually-hidden" id="pl-route-title">From a bookmark to a skill</h2>
      <ol>${steps.map((step, i) => `<li><span class="pl-big" aria-hidden="true">${i + 1}</span><h3>${step.short}</h3><p>${step.text}</p></li>`).join('')}</ol>
    </section>

    <section class="pl-questions" aria-labelledby="pl-questions-title">
      <h2 id="pl-questions-title">Questions you stop asking</h2>
      <div class="pl-faq">${worries.map((worry, i) => `<details${i === 0 ? ' open' : ''}><summary>${worry.question}</summary><p>${worry.answer}</p></details>`).join('')}</div>
    </section>

    <section class="pl-tonight" aria-labelledby="pl-tonight-title">
      <div class="pl-tonight-head">
        <h2 id="pl-tonight-title">Three to try tonight</h2>
        <p>Real prompts from a Kiln library, shortened for a first try. Pick a repo where the idea fits. Keep it only if you want to use it again.</p>
      </div>
      <div class="pl-slips">${examples.map((example, i) => `
        <article class="pl-slip">
          <small>${example.source}</small>
          <h3>${example.title}</h3>
          <blockquote id="pl-prompt-${i}">${example.prompt}</blockquote>
          <p class="pl-slip-skill">If it earns its place: ${example.skill}</p>
          <button type="button" class="pl-copy" data-copy="${i}">Copy prompt</button>
        </article>`).join('')}
      </div>
    </section>

    <section class="pl-bill" aria-labelledby="pl-bill-title">
      <p class="pl-stamp" aria-hidden="true">No extra API bill</p>
      <div><h2 id="pl-bill-title">${subscription.title}</h2><p>${subscription.text}</p><small>${subscription.fine}</small></div>
    </section>
  </main>
  <footer class="pl-get" id="pl-get">
    <h2>Try one tonight.</h2>
    <a class="pl-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
    <small>${releaseNote}</small>
  </footer>
</div>`;

  const pile = root.querySelector<HTMLElement>('.pl-pile')!;
  const toggle = root.querySelector<HTMLButtonElement>('.pl-sort')!;
  const note = root.querySelector<HTMLElement>('.pl-sort-note')!;
  const layout = () => {
    const sorted = toggle.getAttribute('aria-pressed') === 'true';
    const narrow = matchMedia('(max-width: 900px)').matches;
    const counts = [0, 0, 0, 0];
    root.querySelectorAll<HTMLElement>('.pl-card').forEach(card => {
      const bookmark = bookmarks[Number(card.dataset.card)];
      if (!sorted) { card.style.removeProperty('--sx'); card.style.removeProperty('--sy'); return; }
      const slot = counts[bookmark.lane]++;
      card.style.setProperty('--sx', narrow ? `${(slot % 2) * 50}%` : `${bookmark.lane * 25}%`);
      card.style.setProperty('--sy', narrow ? `${bookmark.lane * 25 + 4 + Math.floor(slot / 2) * 10.5}%` : `${10 + slot * 21}%`);
    });
  };
  toggle.addEventListener('click', () => {
    const sorted = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(sorted));
    pile.classList.toggle('is-sorted', sorted);
    toggle.textContent = sorted ? 'Back to the pile' : 'Sort the pile';
    note.textContent = sorted ? 'Four still waiting, three prompts, two tested, one skill you approved. Only the keepers go further.' : 'Ten sample bookmarks, as they usually sit.';
    layout();
  });
  addEventListener('resize', layout);

  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(examples[Number(button.dataset.copy)].prompt).catch(() => undefined);
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy prompt'; }, 1800);
  }));
}
