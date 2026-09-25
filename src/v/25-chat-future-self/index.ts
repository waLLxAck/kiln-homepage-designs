// PROTOTYPE variant 22 — Future self. A messenger thread between you today and you in three months; Kiln joins with a run card.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Who = 'T' | 'F' | 'K';
type Line = { who: Who; html: string; kind?: 'bubble' | 'card' | 'link' | 'diff' | 'receipt' | 'download'; run?: number };
type Block = { chapter?: number; stamp?: string; system?: string; lines: Line[] };

const playtest = examples[2];

const chapters = [
  { title: 'The loop', text: 'You save things to try later. Later rarely comes. Kiln’s answer is to try it now, on your own code, and keep what the run tells you.' },
  { title: 'Capture it', text: 'Ctrl+N captures text, links, screenshots, images and files; Ctrl+Shift+Space searches from anywhere. “Save only” keeps it without calling a model. “Analyze and add” turns a source into prompts, insights, techniques, tools and resources, linked to where it came from. A YouTube link becomes entries with timestamped source links.' },
  { title: 'Run it on your repo', text: 'Pick a local project or repository, or an isolated example, and run the exact prompt revision through Codex or Claude Code. Experiments are read-only: nothing in your code changes. It uses the Codex or Claude Code you’re already signed into, so there’s no API key and no extra API bill. Your subscription’s usage limits still apply.' },
  { title: 'Watch it work', text: 'The run shows messages, reasoning summaries, commands, web searches, the model, reasoning effort, elapsed time and token counts (input, cached, output) as they happen. Up to two runs at once; cancel or retry.' },
  { title: 'Uncertain is honest', text: 'The output and the agent’s pass, fail or uncertain are saved against that revision. Work that needs edits or tools it doesn’t have comes back uncertain instead of a faked success.' },
  { title: 'Edit, run, compare', text: 'Edit the prompt, compare revisions as a diff, and run it again on the same repo. You see what changed the result, which is how you actually get better at prompting. “Ask the agent” can discuss an item with its attachments and source.' },
  { title: 'Your verdict counts', text: 'The agent’s assessment is kept separate from yours. You decide what to keep.' },
  { title: 'From prompt to habit', text: '“Create skill” drafts a SKILL.md from the prompt using Kiln’s bundled writing-for-agents guidance, linked back to its source. Approval pins that exact revision and publishes it to your own Kiln GitHub repository. Install it into Codex, Claude Code or Copilot locations, and a new agent session picks it up.' },
  { title: 'And the pile', text: 'Everything else lives in one library: collections, search, tags and filters, with every installed copy of every skill visible, including copies edited outside Kiln.' },
];

const runs = [
  { rev: 1, lines: ['Reading README.md', 'Reading src/game/loop.ts', 'Searching for input handlers', 'Listing files in /levels', 'Could not launch the game to play it'], tokens: [41820, 27300, 2960], secs: 134, verdict: 'Uncertain', why: 'Needed to play the build to judge the fun. Reported six issues it could see in the code and said what it couldn’t check.' },
  { rev: 2, lines: ['Reading src/game/loop.ts', 'Reading levels/01.json … levels/08.json', 'Tracing jump input through src/input', 'Comparing enemy timings across levels', 'Ranking ten improvements'], tokens: [46210, 38950, 4180], secs: 171, verdict: 'Pass', why: 'Ranked ten improvements with reasons, listed what it could not verify, and changed nothing.' },
];

const blocks: Block[] = [
  { chapter: 0, stamp: 'Today 23:48', lines: [
    { who: 'T', kind: 'link', html: `<span class="v22-link-src">Saved post</span><strong>Try this on your game</strong><span>“${playtest.prompt.slice(0, 92)}…”</span>` },
    { who: 'T', html: 'saving this. will try it on the game this weekend' },
  ] },
  { stamp: 'Three months from now', lines: [
    { who: 'F', html: 'lol' },
    { who: 'F', html: 'hi. it’s me. you. from three months from now' },
    { who: 'T', html: '??? how' },
    { who: 'F', html: 'not important. did you try the playtest prompt' },
    { who: 'T', html: 'not yet, it’s in my bookmarks' },
    { who: 'F', html: 'it’s in OUR bookmarks. next to a lot of other things we were going to try this weekend' },
    { who: 'F', html: 'also a 70 minute video about agent workflows. we stopped at minute four' },
    { who: 'T', html: 'i’ll get to it' },
    { who: 'F', html: 'you will not get to it. i’m the one this already happened to' },
  ] },
  { chapter: 1, lines: [
    { who: 'T', html: 'ok fine. what do i do' },
    { who: 'F', html: 'open Kiln. Ctrl+N. paste the post' },
    { who: 'F', html: 'the video too. paste the link and hit Distill video. it pulls the ideas out with timestamps, so you can skip to minute 38 where the good bit is' },
  ] },
  { chapter: 2, lines: [
    { who: 'F', html: 'then run the prompt on the actual game repo. tonight. not this weekend' },
    { who: 'T', html: 'it’s going to rewrite my code while i sleep' },
    { who: 'F', html: 'it can’t. experiments are read-only. it reads the repo and reports back' },
    { who: 'T', html: 'and it needs another api key' },
    { who: 'F', html: 'it uses the Claude Code you’re already signed into. no api key, no extra bill' },
    { who: 'F', html: '(the usage limits still apply. we checked)' },
  ] },
  { chapter: 3, system: 'Kiln joined the conversation', lines: [
    { who: 'K', kind: 'card', run: 0, html: '' },
  ] },
  { chapter: 4, lines: [
    { who: 'T', html: 'UNCERTAIN? you said it works' },
    { who: 'F', html: 'it couldn’t play the game, so it said so. it didn’t fake a pass. that’s the whole point' },
    { who: 'F', html: 'tell it where to look and run it again' },
  ] },
  { chapter: 5, lines: [
    { who: 'T', kind: 'diff', html: `<span class="v22-diff-head">Revision 1 → 2</span><del>Playtest this game.</del><ins>Playtest this game from the code: read the level data in /levels and trace the input handlers. Say what you could not check.</ins>` },
    { who: 'K', kind: 'card', run: 1, html: '' },
  ] },
  { chapter: 6, lines: [
    { who: 'T', html: 'it found the jump buffer thing. that’s been annoying me for weeks' },
    { who: 'F', html: 'the agent’s pass isn’t the verdict btw. yours is' },
    { who: 'T', html: 'ok. mine says keep' },
  ] },
  { chapter: 7, lines: [
    { who: 'K', kind: 'card', run: -1, html: '' },
    { who: 'T', html: 'approve revision 2. install for claude code' },
    { who: 'K', kind: 'receipt', html: `<strong>Approved and installed</strong><dl><div><dt>Revision</dt><dd>2 (exact, pinned)</dd></div><div><dt>Published</dt><dd>my-kiln on GitHub</dd></div><div><dt>Installed</dt><dd><code>~/.claude/skills/playtest</code></dd></div></dl><p>A new Claude Code session picks it up. Editing later makes a new draft; revision 2 stays approved.</p>` },
  ] },
  { chapter: 8, lines: [
    { who: 'F', html: 'see. that’s the difference. i run it on every new build now' },
    { who: 'T', html: 'what about the rest of the bookmarks' },
    { who: 'F', html: 'same thing. one at a time. the ones that don’t work get archived, the ones that do become skills' },
    { who: 'F', html: 'and please look at what’s in ~/.claude/skills. there are three copies of the same code review skill in there and one of them is from march' },
    { who: 'T', html: 'how do you know that' },
    { who: 'F', html: 'kiln shows every installed copy. and which one got edited outside it' },
    { who: 'K', kind: 'download', html: '' },
  ] },
];

const avatar = (who: Who) => who === 'K'
  ? '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#ff5a1f"/><path d="M9 24V13a7 7 0 0 1 14 0v11z" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><path d="M13 24v-5h6v5" fill="#fff"/></svg>'
  : who === 'F'
    ? '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#d4f25c"/><path d="M7.5 13.5h17" stroke="#141414" stroke-width="2"/><rect x="8.5" y="12.5" width="6.5" height="4.5" rx="1.6" fill="#141414"/><rect x="17" y="12.5" width="6.5" height="4.5" rx="1.6" fill="#141414"/><path d="M11.5 22c2.6 1.8 6.4 1.8 9 0" fill="none" stroke="#141414" stroke-width="2" stroke-linecap="round"/></svg>'
    : '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#141414"/><circle cx="12" cy="14" r="1.8" fill="#fff"/><circle cx="20" cy="14" r="1.8" fill="#fff"/><path d="M12 21.5h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
const names: Record<Who, string> = { T: 'You (today)', F: 'You (three months from now)', K: 'Kiln' };

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function runCard(i: number) {
  if (i < 0) return `<div class="v22-card v22-suggest">
      <p class="v22-card-kicker">Suggestion</p>
      <h3>This prompt passed on your repo, and you kept it. Make it a skill?</h3>
      <p>Drafts a SKILL.md from revision 2 with Kiln’s writing-for-agents guidance, linked back to the saved post.</p>
      <div class="v22-card-actions"><button type="button" class="v22-primary" data-create>Create skill</button><button type="button" class="v22-ghost" data-later>Not now</button></div>
      <pre class="v22-skill" hidden>---
name: playtest
description: Playtest a game from its code and
  rank the ten most impactful fixes. Use when
  asked to playtest or review a game build.
---
Read the level data and trace the input
handlers. Find bugs, annoyances and what
takes away the fun. Say what you could not
check. Make no changes.</pre>
    </div>`;
  const r = runs[i];
  return `<div class="v22-card v22-run" data-run="${i}">
    <div class="v22-run-head"><span class="v22-dot"></span><span class="v22-run-status">Running</span><span class="v22-run-time">0:00</span></div>
    <h3>${playtest.title}<small>Revision ${r.rev} · Claude Code · <code>~/games/tiny-tower</code> · read-only</small></h3>
    <ol class="v22-activity" aria-label="Live activity">${r.lines.map(l => `<li>${l}</li>`).join('')}</ol>
    <dl class="v22-tokens"><div><dt>Input</dt><dd data-t="0">0</dd></div><div><dt>Cached</dt><dd data-t="1">0</dd></div><div><dt>Output</dt><dd data-t="2">0</dd></div><div><dt>Effort</dt><dd>medium</dd></div></dl>
    <div class="v22-verdict v22-${r.verdict.toLowerCase()}"><span>Agent’s assessment</span><strong>${r.verdict}</strong><p>${r.why}</p></div>
    <p class="v22-sample">Sample run. Numbers are illustrative.</p>
  </div>`;
}

function line(l: Line, first: boolean, last: boolean) {
  let body = l.html;
  if (l.kind === 'card') body = runCard(l.run ?? 0);
  if (l.kind === 'download') body = `<div class="v22-card v22-dl"><p class="v22-card-kicker">Kiln 0.17.0 for Windows</p><h3>Start with one saved prompt tonight.</h3><a class="v22-primary v22-dl-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a><p class="v22-fine">${releaseNote}</p></div>`;
  const cls = ['v22-msg', `v22-${l.who}`, `v22-kind-${l.kind ?? 'bubble'}`, first ? 'is-first' : '', last ? 'is-last' : ''].join(' ');
  return `<div class="${cls}" data-who="${l.who}">
    ${last && l.who !== 'T' ? `<span class="v22-av">${avatar(l.who)}</span>` : l.who !== 'T' ? '<span class="v22-av v22-av-gap"></span>' : ''}
    <div class="v22-col">${first && l.who !== 'T' ? `<span class="v22-name">${names[l.who]}</span>` : ''}<div class="v22-bubble">${body}</div></div>
    <span class="v22-typing" aria-hidden="true"><i></i><i></i><i></i></span>
  </div>`;
}

function thread() {
  return blocks.map(b => {
    const parts: string[] = [];
    if (b.chapter !== undefined) parts.push(`<aside class="v22-inline-note" data-chapter="${b.chapter}"><strong>${chapters[b.chapter].title}</strong><p>${chapters[b.chapter].text}</p></aside>`);
    if (b.stamp) parts.push(`<p class="v22-stamp">${b.stamp}</p>`);
    if (b.system) parts.push(`<p class="v22-system">${b.system}</p>`);
    b.lines.forEach((l, i) => {
      const prev = b.lines[i - 1], next = b.lines[i + 1];
      parts.push(line(l, !prev || prev.who !== l.who, !next || next.who !== l.who));
    });
    return parts.join('');
  }).join('');
}

export function render(root: HTMLElement) {
  document.title = 'Kiln — A message from you, three months from now';
  root.innerHTML = `
<div class="v22">
  <a class="skip" href="#v22-thread">Skip to the conversation</a>
  <header class="v22-top"><a class="v22-brand" href="?">${avatar('K')}<span>Kiln</span></a><a class="v22-top-dl" href="#v22-end">Download</a></header>
  <main class="v22-layout" id="main">
    <div class="v22-side">
      <section class="v22-hero" aria-labelledby="v22-title">
        <h1 id="v22-title">A message from you, three months from now.</h1>
        <p class="v22-lede">It’s about the prompt you saved tonight and haven’t tried. Kiln is a Windows app that runs saved prompts on your own repo, read-only, shows you exactly what happened, and turns the ones that work into skills for Claude Code, Codex and Copilot.</p>
        <a class="v22-primary" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        <p class="v22-fine">${releaseNote}</p>
      </section>
      <nav class="v22-notes" aria-label="What’s happening in the conversation">
        <p class="v22-notes-label">What’s happening</p>
        <ol>${chapters.map((c, i) => `<li data-note="${i}"><button type="button" data-jump="${i}">${c.title}</button><p>${c.text}</p></li>`).join('')}</ol>
      </nav>
    </div>
    <section class="v22-phone" aria-label="Conversation">
      <header class="v22-phone-head">
        <span class="v22-pair">${avatar('T')}${avatar('F')}</span>
        <span class="v22-phone-title"><strong>You &amp; you</strong><small>2 people · Kiln can join</small></span>
      </header>
      <div class="v22-thread" id="v22-thread" tabindex="-1">${thread()}<p class="v22-seen" id="v22-end">Seen by you (three months from now)</p></div>
      <div class="v22-composer" aria-hidden="true"><span>Message you (three months from now)</span><i></i></div>
    </section>
  </main>
</div>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const msgs = [...root.querySelectorAll<HTMLElement>('.v22-msg')];
  const runCards = new Set<HTMLElement>();

  const playRun = (card: HTMLElement) => {
    if (runCards.has(card)) return;
    runCards.add(card);
    const r = runs[Number(card.dataset.run)];
    const items = [...card.querySelectorAll<HTMLElement>('.v22-activity li')];
    const tokens = [...card.querySelectorAll<HTMLElement>('[data-t]')];
    const time = card.querySelector<HTMLElement>('.v22-run-time')!;
    const status = card.querySelector<HTMLElement>('.v22-run-status')!;
    const finish = () => {
      items.forEach(li => li.classList.add('is-on'));
      tokens.forEach((t, i) => (t.textContent = fmt(r.tokens[i])));
      time.textContent = clock(r.secs);
      status.textContent = 'Finished';
      card.classList.add('is-done');
    };
    if (reduce) return finish();
    const total = 3200, start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / total);
      items.forEach((li, i) => li.classList.toggle('is-on', k >= i / items.length));
      tokens.forEach((t, i) => (t.textContent = fmt(Math.round(r.tokens[i] * k))));
      time.textContent = clock(Math.round(r.secs * k));
      if (k < 1) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
  };

  // Reveal messages in order: a typing indicator first, then the bubble. Space is reserved so nothing jumps.
  const queue: HTMLElement[] = [];
  let busy = false;
  const reveal = (m: HTMLElement) => {
    m.classList.remove('is-pending', 'is-typing');
    m.classList.add('is-shown');
    const card = m.querySelector<HTMLElement>('.v22-run');
    if (card) playRun(card);
  };
  const pump = () => {
    if (busy) return;
    const m = queue.shift();
    if (!m) return;
    busy = true;
    const len = m.textContent?.trim().length ?? 0;
    const hurry = queue.length > 2;
    const wait = hurry ? 140 : Math.min(1300, 380 + len * 9);
    m.classList.add('is-typing');
    setTimeout(() => { reveal(m); busy = false; setTimeout(pump, hurry ? 40 : 180); }, wait);
  };
  if (reduce) msgs.forEach(reveal);
  else {
    msgs.forEach(m => m.classList.add('is-pending'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = msgs.indexOf(e.target as HTMLElement);
        msgs.slice(0, idx + 1).forEach(m => { if (m.classList.contains('is-pending') && !queue.includes(m)) queue.push(m); io.unobserve(m); });
      });
      pump();
    }, { rootMargin: '0px 0px -10% 0px' });
    msgs.forEach(m => io.observe(m));
    // The saved post opens the thread straight away, so the phone never starts empty.
    msgs.slice(0, 2).forEach(m => { queue.push(m); io.unobserve(m); });
    setTimeout(pump, 500);
  }

  // The quiet column follows the conversation.
  const notes = [...root.querySelectorAll<HTMLElement>('[data-note]')];
  const setNote = (i: number) => notes.forEach(n => n.classList.toggle('is-on', Number(n.dataset.note) === i));
  setNote(0);
  const markers = [...root.querySelectorAll<HTMLElement>('.v22-inline-note')];
  let current = 0, pending = false;
  const sync = () => {
    pending = false;
    const mid = innerHeight * 0.55;
    let active = 0;
    markers.forEach(m => { if (m.getBoundingClientRect().top < mid) active = Number(m.dataset.chapter); });
    if (active !== current) { current = active; setNote(active); }
  };
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(sync); } }, { passive: true });
  root.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach(b => b.addEventListener('click', () => {
    const target = markers.find(m => m.dataset.chapter === b.dataset.jump);
    const next = target?.nextElementSibling as HTMLElement | null;
    (next ?? target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }));

  root.querySelector('[data-create]')?.addEventListener('click', e => {
    const btn = e.currentTarget as HTMLButtonElement;
    const card = btn.closest('.v22-card')!;
    card.querySelector<HTMLElement>('.v22-skill')!.hidden = false;
    card.querySelector('.v22-card-actions')!.innerHTML = '<p class="v22-drafted">Draft created from revision 2. Review it, then approve.</p>';
  });
  root.querySelector('[data-later]')?.addEventListener('click', e => {
    (e.currentTarget as HTMLElement).closest('.v22-card-actions')!.innerHTML = '<p class="v22-drafted">Okay. It stays a tested prompt in your library.</p>';
  });
}
