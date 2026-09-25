// PROTOTYPE variant 47 — Swipe triage. Saved ideas as a card stack: right to test on your repo, left to archive.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Kind = 'video' | 'post' | 'shot' | 'note';
type Verdict = 'pass' | 'fail' | 'uncertain';
type Card = { id: string; kind: Kind; source: string; saved: string; title: string; idea: string; prompt: string; repo: string; agent: string; log: string[]; verdict: Verdict; why: string };

const cards: Card[] = [
  { id: 'kid', kind: 'video', source: examples[0].source, saved: 'saved during a lunch break', title: examples[0].title, idea: examples[0].idea, prompt: examples[0].prompt, repo: 'kids-app', agent: 'Claude Code',
    log: ['read README.md, src/routes', 'opened the activity picker flow', 'reasoning: the "Next" icon has no label', 'reasoning: the reward screen hides the back button', 'report ready, no files changed'], verdict: 'pass', why: 'Found the first obstacle and suggested a fix, without changing anything.' },
  { id: 'why', kind: 'post', source: 'A post you saved on X', saved: 'saved, then forgotten', title: examples[1].title, idea: examples[1].idea, prompt: examples[1].prompt, repo: 'billing-service', agent: 'Codex',
    log: ['read AGENTS.md, CLAUDE.md', '$ git log -5 --stat', 'reasoning: AGENTS.md still says "use the v1 client"', 'reasoning: the agent followed that line literally', 'proposed a one-line instruction change'], verdict: 'pass', why: 'Traced the decision to an outdated line in AGENTS.md.' },
  { id: 'fun', kind: 'shot', source: 'A screenshot from a thread', saved: 'saved at 1 a.m.', title: examples[2].title, idea: examples[2].idea, prompt: examples[2].prompt, repo: 'game-project', agent: 'Claude Code',
    log: ['read src/levels, src/input', '$ rg "cooldown" src', 'reasoning: level 2 spikes before the dash is taught', 'reasoning: some findings need a playable build', 'ranked ten improvements'], verdict: 'uncertain', why: 'Useful list, but it can’t play the build, so it says so instead of pretending.' },
  { id: 'dead', kind: 'note', source: 'A note to self', saved: 'saved “for the weekend”', title: 'Find all the dead code', idea: 'One prompt to clean the whole repo.', prompt: 'List every unused export, file and dependency in this repository with evidence for each. Make no changes.', repo: 'billing-service', agent: 'Codex',
    log: ['$ rg "export " src --count', 'reasoning: dynamic imports hide real usage', 'reasoning: 9 of 14 findings are used by plugins', 'report ready, no files changed'], verdict: 'fail', why: 'Most findings were wrong. Worth editing the prompt before you trust it.' },
  { id: 'brief', kind: 'video', source: 'From an agent workflow video', saved: 'saved at 2×, never finished', title: 'Get a repository and recent-PR briefing', idea: 'Start the day knowing what changed.', prompt: 'Summarise what this repository does, then the last five merged pull requests: what changed, why, and what to watch. Keep it under one screen.', repo: 'game-project', agent: 'Claude Code',
    log: ['read README.md, package.json', '$ git log --merges -5', 'web search: none needed', 'report ready, no files changed'], verdict: 'pass', why: 'One screen, five PRs, and a watch list.' },
];

const kindLabel: Record<Kind, string> = { video: 'Video', post: 'Post', shot: 'Screenshot', note: 'Note' };
const media = (c: Card) => {
  if (c.kind === 'video') return `<div class="v47-media v47-m-video" aria-hidden="true"><span class="v47-play"></span><span class="v47-dur">48:12</span><span class="v47-bar"><i></i></span></div>`;
  if (c.kind === 'post') return `<div class="v47-media v47-m-post" aria-hidden="true"><span class="v47-av"></span><span class="v47-lines"><i></i><i></i><i></i></span><span class="v47-x">𝕏</span></div>`;
  if (c.kind === 'shot') return `<div class="v47-media v47-m-shot" aria-hidden="true"><span class="v47-win"><i></i><i></i><i></i></span><span class="v47-lines"><i></i><i></i><i></i><i></i></span></div>`;
  return `<div class="v47-media v47-m-note" aria-hidden="true"><span class="v47-lines"><i></i><i></i><i></i></span></div>`;
};
const cardHtml = (c: Card, i: number) => `
  <article class="v47-card" data-id="${c.id}" style="--i:${i}" aria-label="${c.title}. ${kindLabel[c.kind]}, ${c.saved}.">
    <span class="v47-stamp v47-stamp-yes" aria-hidden="true">Test it</span><span class="v47-stamp v47-stamp-no" aria-hidden="true">Archive</span>
    ${media(c)}
    <div class="v47-card-body">
      <p class="v47-card-src"><b>${kindLabel[c.kind]}</b> ${c.source}</p>
      <h3>${c.title}</h3>
      <p class="v47-card-idea">${c.idea}</p>
      <p class="v47-card-prompt">${c.prompt}</p>
      <p class="v47-card-saved">${c.saved}</p>
    </div>
  </article>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Stop saving. Start deciding.';
  root.innerHTML = `
<div class="v47">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v47-top">
    <a class="v47-brand" href="?">kiln</a>
    <nav aria-label="Main navigation"><a href="#v47-capture">Capture</a><a href="#v47-decide">Decide</a><a href="#v47-keep">Keep</a><a class="v47-top-dl" href="#v47-download">Get Kiln</a></nav>
  </header>
  <main id="main">
    <section class="v47-hero" aria-labelledby="v47-title">
      <div class="v47-hero-text">
        <h1 id="v47-title">Stop saving.<br>Start deciding.</h1>
        <p class="v47-lede">You saved the video, the post, the screenshot. Kiln is a Windows app that gets you to a verdict: swipe an idea right and it runs on your own repo through Codex or Claude Code, read-only, in about the time it took to bookmark it. Swipe left and it’s archived. Undo is one click.</p>
        <p class="v47-try">Drag the top card, or use the buttons. Right runs a test. Left archives.</p>
      </div>
      <div class="v47-stage">
        <div class="v47-stack" tabindex="0" role="group" aria-label="Saved ideas. Press the right arrow to test the top idea, left arrow to archive it." aria-describedby="v47-live"></div>
        <div class="v47-empty" hidden>
          <p class="v47-empty-big">That’s the pile.</p>
          <p>What’s left in your library earned its place.</p>
          <button type="button" class="v47-pill" data-reset>Deal the cards again</button>
        </div>
        <div class="v47-controls">
          <button type="button" class="v47-round v47-no" data-act="left" aria-label="Archive this idea"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></button>
          <button type="button" class="v47-round v47-undo" data-act="undo" aria-label="Undo the last archive" disabled><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 7H4V2M4.5 7A8 8 0 1 1 4 13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
          <button type="button" class="v47-round v47-yes" data-act="right" aria-label="Test this idea on my repo"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg></button>
        </div>
        <p class="v47-tally" id="v47-live" aria-live="polite"></p>
        <div class="v47-match" hidden role="dialog" aria-modal="false" aria-labelledby="v47-match-title"></div>
      </div>
    </section>

    <section class="v47-band v47-capture" id="v47-capture" aria-labelledby="v47-cap-title">
      <div class="v47-band-head"><span class="v47-num" aria-hidden="true">1</span><h2 id="v47-cap-title">Capture fast.</h2></div>
      <div class="v47-cap-grid">
        <p class="v47-big-copy">Saving should cost you nothing, so it doesn’t. Paste or drop text, links, screenshots, images and files. Kiln sits in the tray; the global quick search is one shortcut away.</p>
        <ul class="v47-keys" aria-label="Shortcuts">
          <li><span><kbd>Ctrl</kbd><kbd>N</kbd></span>Capture something new</li>
          <li><span><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>Space</kbd></span>Quick search from anywhere</li>
        </ul>
        <div class="v47-two">
          <div><h3>Save only</h3><p>Keeps it without calling a model. Deal with it later, honestly.</p></div>
          <div><h3>Analyze and add</h3><p>Turns a source into prompts, insights, techniques, tools and resources, in a collection linked back to it.</p></div>
          <div><h3>Distill video</h3><p>Paste a YouTube link. Captions become reusable entries with timestamped source links, and the transcript stays attached.</p></div>
        </div>
      </div>
    </section>

    <section class="v47-band v47-decide" id="v47-decide" aria-labelledby="v47-dec-title">
      <div class="v47-band-head"><span class="v47-num" aria-hidden="true">2</span><h2 id="v47-dec-title">Decide fast.</h2></div>
      <div class="v47-dec-grid">
        <div class="v47-dec-copy">
          <p class="v47-big-copy">A decision needs evidence. Pick a local project or repository, or an isolated example, and run the exact prompt revision through Codex or Claude Code.</p>
          <p>You watch it live: messages, reasoning summaries, commands, web searches, the model, reasoning effort, elapsed time and token counts. Up to two runs at once; cancel or retry. Experiments are read-only, so nothing in your code changes.</p>
          <p>The output and the agent’s assessment are saved against that revision. Tasks that need edits or tools it doesn’t have come back uncertain rather than as faked successes. Then you judge. The agent’s opinion and yours are kept apart.</p>
        </div>
        <ul class="v47-verdicts" aria-label="Possible verdicts">
          <li class="v47-v-pass"><strong>Pass</strong><span>The agent thinks it did the job. You still decide.</span></li>
          <li class="v47-v-unc"><strong>Uncertain</strong><span>It needed an edit or a tool it didn’t have, and said so.</span></li>
          <li class="v47-v-fail"><strong>Fail</strong><span>Edit the prompt, compare the revisions, run it again on the same repo.</span></li>
        </ul>
      </div>
      <div class="v47-learn">
        <h3>That’s how you learn prompting</h3>
        <p>Change one line, run it again, and the diff next to the new result shows you what made the difference. “Ask the agent” talks an item through with its attachments and the source video’s context.</p>
      </div>
    </section>

    <section class="v47-band v47-keep" id="v47-keep" aria-labelledby="v47-keep-title">
      <div class="v47-band-head"><span class="v47-num" aria-hidden="true">3</span><h2 id="v47-keep-title">Keep only what earned its place.</h2></div>
      <div class="v47-keep-grid">
        <article class="v47-keep-card">
          <h3>A library, not a pile</h3>
          <p>Prompts, skills, custom agents, source notes, insights, techniques, tools and resources, in collections with search, tags, favorites and filters. Bulk-select with Ctrl and Shift. Archive, trash, restore.</p>
          <p class="v47-aside">And yes: Kiln itself has swipe-to-archive, with undo.</p>
        </article>
        <article class="v47-keep-card">
          <h3>A prompt that keeps passing becomes a skill</h3>
          <p>“Create skill” drafts a SKILL.md from the prompt, an image or a note, using Kiln’s bundled writing-for-agents guidance. Approve the exact revision you trust and install it into Codex, Claude Code or Copilot. Your next agent session picks it up.</p>
        </article>
        <article class="v47-keep-card">
          <h3>Prune what your agents carry</h3>
          <p>Every model-invoked skill’s description sits in the agent’s context on every turn, used or not. Kiln shows each skill’s installed copies across your folders and projects, including ones edited outside Kiln, so you can remove what you don’t use.</p>
        </article>
        <article class="v47-keep-card">
          <h3>Edits never overwrite the approval</h3>
          <p>Editing makes a new draft. Installs use the approved revision, which is committed to your own Kiln GitHub repository. On another machine, “Install everything marked for this machine”.</p>
        </article>
      </div>
      <p class="v47-sub"><strong>${subscription.title}</strong> ${subscription.text} ${subscription.fine}</p>
    </section>

    <section class="v47-dl" id="v47-download" aria-labelledby="v47-dl-title">
      <h2 id="v47-dl-title">Swipe through your pile tonight.</h2>
      <a class="v47-dl-btn" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p>${releaseNote}</p>
      <p class="v47-fine">Unsigned build, so Windows may ask you to confirm. MIT licensed, with a CLI. Uses your signed-in Codex or Claude Code.</p>
    </section>
  </main>
</div>`;

  const stack = root.querySelector<HTMLElement>('.v47-stack')!;
  const empty = root.querySelector<HTMLElement>('.v47-empty')!;
  const tally = root.querySelector<HTMLElement>('.v47-tally')!;
  const match = root.querySelector<HTMLElement>('.v47-match')!;
  const undoBtn = root.querySelector<HTMLButtonElement>('[data-act="undo"]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let deck: Card[] = [];
  let archived: Card[] = [];
  let tested: Card[] = [];
  let kept: Card[] = [];
  let busy = false;
  let runTimers: number[] = [];

  const top = () => stack.querySelector<HTMLElement>('.v47-card:last-child');
  const updateTally = (msg = '') => {
    tally.innerHTML = `${msg ? `<span class="v47-msg">${msg}</span>` : ''}<span><b>${deck.length}</b> left</span><span><b>${archived.length}</b> archived</span><span><b>${tested.length}</b> tested</span><span><b>${kept.length}</b> kept</span>`;
    undoBtn.disabled = archived.length === 0;
    empty.hidden = deck.length > 0;
    root.querySelectorAll<HTMLButtonElement>('[data-act="left"], [data-act="right"]').forEach(b => b.disabled = deck.length === 0);
  };
  const deal = () => {
    stack.innerHTML = deck.slice().reverse().map((c, i, arr) => cardHtml(c, arr.length - 1 - i)).join('');
    bindTop();
    updateTally();
  };

  const fling = (dir: 1 | -1, fromDrag = false) => {
    const card = top();
    if (!card || busy) return;
    busy = true;
    const c = deck[0];
    card.classList.add(dir > 0 ? 'is-yes' : 'is-no');
    card.style.transition = reduced ? 'opacity .2s' : 'transform .45s cubic-bezier(.3,.1,.6,1), opacity .45s';
    const current = fromDrag ? card.style.transform : 'translate(0px, 0px) rotate(0deg)';
    const m = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(current);
    const y = m ? Number(m[2]) : 0;
    requestAnimationFrame(() => {
      card.style.transform = reduced ? '' : `translate(${dir * (innerWidth * .9 + 200)}px, ${y + 60}px) rotate(${dir * 34}deg)`;
      card.style.opacity = '0';
    });
    window.setTimeout(() => {
      deck = deck.slice(1);
      card.remove();
      stack.querySelectorAll<HTMLElement>('.v47-card').forEach((el, i, all) => el.style.setProperty('--i', String(all.length - 1 - i)));
      busy = false;
      bindTop();
      if (dir < 0) { archived = [c, ...archived]; updateTally(`Archived “${c.title}”.`); }
      else { tested = [c, ...tested]; updateTally(); openMatch(c); }
    }, reduced ? 200 : 430);
  };

  const openMatch = (c: Card) => {
    runTimers.forEach(t => clearTimeout(t)); runTimers = [];
    match.hidden = false;
    match.dataset.verdict = c.verdict;
    match.innerHTML = `
      <div class="v47-match-in">
        <p class="v47-match-kicker">Right swipe on ${kindLabel[c.kind].toLowerCase()} × <code>${c.repo}</code></p>
        <h2 id="v47-match-title" class="v47-match-title">It’s a match.<br><span>Let’s see if it works.</span></h2>
        <div class="v47-pair" aria-hidden="true"><span class="v47-pair-a">${c.title.split(' ').slice(0, 2).join(' ')}…</span><span class="v47-pair-b">${c.repo}</span></div>
        <p class="v47-run-meta"><span>${c.agent}</span><span>effort medium</span><span>read-only</span><span class="v47-clock">0:00</span></p>
        <ol class="v47-log" aria-live="polite"></ol>
        <div class="v47-verdict" hidden>
          <p class="v47-verdict-word">${c.verdict}</p>
          <p class="v47-verdict-why"><b>The agent’s assessment.</b> ${c.why}</p>
          <p class="v47-tokens">tokens: in 31,840 · cached 22,410 · out 1,720 <em>sample numbers</em></p>
          <div class="v47-judge"><button type="button" class="v47-pill v47-pill-ink" data-keep>Keep it in my library</button><button type="button" class="v47-pill" data-back>Back to the pile</button></div>
        </div>
      </div>`;
    const log = match.querySelector<HTMLElement>('.v47-log')!;
    const clock = match.querySelector<HTMLElement>('.v47-clock')!;
    const step = reduced ? 0 : 520;
    c.log.forEach((line, i) => runTimers.push(window.setTimeout(() => {
      log.insertAdjacentHTML('beforeend', `<li><span>0:${String(4 + i * 6).padStart(2, '0')}</span>${line}</li>`);
      clock.textContent = `0:${String(4 + i * 6).padStart(2, '0')}`;
    }, 500 + i * step)));
    runTimers.push(window.setTimeout(() => {
      match.querySelector<HTMLElement>('.v47-verdict')!.hidden = false;
      match.classList.add('is-done');
      match.querySelector<HTMLElement>('[data-keep]')?.focus({ preventScroll: true });
    }, 700 + c.log.length * step));
    requestAnimationFrame(() => match.classList.add('is-open'));
  };
  const closeMatch = (keep: boolean) => {
    const c = tested[0];
    if (keep && c && !kept.includes(c)) kept = [c, ...kept];
    runTimers.forEach(t => clearTimeout(t));
    match.classList.remove('is-open', 'is-done');
    match.hidden = true;
    updateTally(keep && c ? `Kept “${c.title}”. It can become a skill.` : '');
    stack.focus({ preventScroll: true });
  };

  // pointer physics
  const bindTop = () => {
    const card = top();
    if (!card || card.dataset.bound) return;
    card.dataset.bound = '1';
    let sx = 0, sy = 0, dx = 0, dy = 0, lx = 0, lt = 0, vx = 0, drag = false;
    const next = () => card.previousElementSibling as HTMLElement | null;
    card.addEventListener('pointerdown', e => {
      if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
      drag = true; sx = e.clientX; sy = e.clientY; dx = dy = vx = 0; lx = e.clientX; lt = e.timeStamp;
      card.setPointerCapture(e.pointerId);
      card.style.transition = 'none';
      card.classList.add('is-drag');
    });
    card.addEventListener('pointermove', e => {
      if (!drag) return;
      dx = e.clientX - sx; dy = (e.clientY - sy) * .35;
      const dt = Math.max(1, e.timeStamp - lt);
      vx = vx * .6 + ((e.clientX - lx) / dt) * .4; lx = e.clientX; lt = e.timeStamp;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * .06}deg)`;
      card.style.setProperty('--yes', String(Math.max(0, Math.min(1, dx / 110))));
      card.style.setProperty('--no', String(Math.max(0, Math.min(1, -dx / 110))));
      const n = next();
      if (n) n.style.setProperty('--lift', String(Math.min(1, Math.abs(dx) / 140)));
    });
    const end = () => {
      if (!drag) return;
      drag = false;
      card.classList.remove('is-drag');
      const n = next();
      if (dx > 110 || (vx > .55 && dx > 30)) { fling(1, true); return; }
      if (dx < -110 || (vx < -.55 && dx < -30)) { fling(-1, true); return; }
      card.style.transition = 'transform .6s cubic-bezier(.25,1.8,.45,1)';
      card.style.transform = '';
      card.style.setProperty('--yes', '0'); card.style.setProperty('--no', '0');
      if (n) n.style.setProperty('--lift', '0');
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
  };

  root.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    const act = t.closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'left') fling(-1);
    if (act === 'right') fling(1);
    if (act === 'undo' && archived.length && !busy) {
      const c = archived[0]; archived = archived.slice(1); deck = [c, ...deck]; deal(); updateTally(`Restored “${c.title}”.`);
    }
    if (t.closest('[data-keep]')) closeMatch(true);
    if (t.closest('[data-back]')) closeMatch(false);
    if (t.closest('[data-reset]')) { deck = cards.slice(); archived = []; tested = []; kept = []; deal(); stack.focus(); }
  });
  stack.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); fling(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); fling(-1); }
  });
  match.addEventListener('keydown', e => { if (e.key === 'Escape') closeMatch(false); });

  deck = cards.slice();
  deal();
  // a small nudge so the stack reads as swipeable
  if (!reduced) window.setTimeout(() => {
    const card = top();
    if (!card || card.classList.contains('is-drag')) return;
    card.classList.add('v47-nudge');
    card.addEventListener('animationend', () => card.classList.remove('v47-nudge'), { once: true });
  }, 900);
}
