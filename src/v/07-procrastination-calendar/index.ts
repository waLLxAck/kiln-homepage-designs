// PROTOTYPE variant 04 — Procrastination calendar. A sticky note hops from excuse to excuse across September until the day it finally gets run.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

const prompt = examples[0];
// September 2026 starts on a Tuesday. Monday-first grid: Aug 31 → Oct 4.
const days = Array.from({ length: 35 }, (_, i) => {
  const date = new Date(2026, 7, 31 + i);
  return { key: `${date.getMonth()}-${date.getDate()}`, day: date.getDate(), month: date.getMonth(), dow: (i % 7) };
});
const stops = [
  { key: '8-1', say: 'saved it!', agenda: 'Saved it from a YouTube talk' },
  { key: '8-3', say: 'later', agenda: 'Later' },
  { key: '8-5', say: 'this weekend', agenda: 'This weekend' },
  { key: '8-18', say: 'after the sprint', agenda: 'After the sprint' },
  { key: '8-23', say: 'when it calms down', agenda: 'When things calm down' },
  { key: '8-28', say: 'new month, new me', agenda: 'New month, new me' },
  { key: '8-29', say: 'ran it.', agenda: 'Ran it' },
];
const life: Record<string, string> = { '8-7': 'sprint planning', '8-10': 'dentist 3:30', '8-12': 'Mia’s b’day', '8-17': 'demo!!', '8-25': 'retro', '9-2': 'pay rent' };
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const agendaKeys = [...new Set([...stops.map(s => s.key), ...Object.keys(life)])].filter(key => key.startsWith('8-')).sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));

const cell = (d: typeof days[number]) => {
  const stop = stops.findIndex(s => s.key === d.key);
  const out = d.month !== 8;
  return `<div class="v04-cell${out ? ' is-out' : ''}${d.dow === 6 ? ' is-sun' : ''}${d.day >= 7 && d.day <= 18 && !out ? ' is-sprint' : ''}"${stop >= 0 ? ` data-stop="${stop}"` : ''}>
    <span class="v04-date">${d.day}</span>
    ${d.key === '8-7' ? '<span class="v04-band">SPRINT 14</span>' : ''}
    ${life[d.key] ? `<span class="v04-life">${life[d.key]}</span>` : ''}
    ${stop >= 0 ? `<span class="v04-say${stop === stops.length - 1 ? ' is-final' : ''}">${stops[stop].say}</span>` : ''}
    ${stop === stops.length - 1 ? '<svg class="v04-ring" viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M18 40 C 16 12, 96 4, 108 34 C 118 62, 86 94, 50 92 C 16 90, 4 60, 22 30 C 30 18, 44 12, 58 11"/></svg>' : ''}
  </div>`;
};
const agendaRow = (key: string) => {
  const d = days.find(x => x.key === key)!;
  const stop = stops.findIndex(s => s.key === key);
  return `<li class="v04-arow${d.dow === 6 ? ' is-sun' : ''}"${stop >= 0 ? ` data-astop="${stop}"` : ''}>
    <span class="v04-adate"><small>${weekdays[d.dow]}</small>${d.day}</span>
    <span class="v04-atext">${life[key] ? `<span class="v04-life">${life[key]}</span>` : ''}${stop >= 0 ? `<span class="v04-say${stop === stops.length - 1 ? ' is-final' : ''}">${stops[stop].say}</span>` : ''}</span>
  </li>`;
};

export function render(root: HTMLElement) {
  document.title = 'Kiln — Later isn’t a date';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
<div class="v04">
  <header class="v04-top">
    <a class="v04-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v04-tuesday">Tuesday</a><a href="#v04-how">How it works</a><a href="#v04-now">Download</a></nav>
  </header>
  <main id="main">
    <section class="v04-hero" aria-labelledby="v04-title">
      <div class="v04-hero-text">
        <h1 id="v04-title">Later isn’t a date.</h1>
        <p class="v04-lede">On the 1st I saved a prompt from a YouTube talk. A good one. I was going to try it later. This is where later went.</p>
        <div class="v04-hero-actions">
          <button type="button" class="v04-replay" hidden>Replay the excuses</button>
          <a class="v04-link" href="#v04-now">Skip to the download</a>
        </div>
      </div>

      <figure class="v04-wall">
        <div class="v04-nail" aria-hidden="true"></div>
        <div class="v04-cal">
          <div class="v04-rings" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
          <div class="v04-cal-head">
            <p class="v04-month">September <span>2026</span></p>
            <p class="v04-compliments">With compliments of your good intentions</p>
          </div>
          <div class="v04-board">
            <div class="v04-grid" aria-hidden="true">
              ${weekdays.map((w, i) => `<span class="v04-wd${i === 6 ? ' is-sun' : ''}">${w}</span>`).join('')}
              ${days.map(cell).join('')}
            </div>
            <ol class="v04-agenda" aria-hidden="true">${agendaKeys.map(agendaRow).join('')}</ol>
            <div class="v04-note" aria-hidden="true"><span class="v04-note-text">try the seven-year-old usability prompt</span></div>
          </div>
          <div class="v04-notes">
            <span class="v04-notes-label">Notes</span>
            <p class="v04-notes-text"><span>Tuesday: tried it on my repo. 4 minutes. uncertain → edited → pass.</span></p>
          </div>
        </div>
        <figcaption class="visually-hidden">A September wall calendar. A sticky note that says “try the seven-year-old usability prompt” is saved on Tuesday the 1st, then moved to “later” on the 3rd, “this weekend” on the 5th, “after the sprint” on the 18th, “when it calms down” on the 23rd and “new month, new me” on the 28th. On Tuesday the 29th it finally gets run: tried it on my repo, 4 minutes, uncertain, edited, pass.</figcaption>
      </figure>
    </section>

    <section class="v04-tuesday" id="v04-tuesday" aria-labelledby="v04-tue-title">
      <div class="v04-tue-head">
        <h2 id="v04-tue-title">What Tuesday actually took</h2>
        <p>Four weeks of moving a sticky note. Four minutes of doing the thing. Here is the four minutes, as it happened in Kiln.</p>
      </div>
      <ol class="v04-log">
        <li><time>9:12</time><div><h3>Opened the prompt I’d already saved</h3><p>It was in Kiln from the 1st, with a link back to the exact moment in the talk.</p><blockquote>${prompt.prompt}</blockquote></div></li>
        <li><time>9:13</time><div><h3>Picked my repo and pressed run</h3><p>Chose <code>~/family-app</code>, ran it through Claude Code, and watched it read: messages, reasoning summaries, commands, elapsed time, tokens. The run is read-only, so nothing in the code changed.</p></div></li>
        <li><time>9:15</time><div><h3>Uncertain</h3><p>The agent said it couldn’t tell which screen a child lands on without running the app. Fair. It came back as <em class="v04-tag v04-tag-u">uncertain</em> instead of pretending.</p></div></li>
        <li><time>9:16</time><div><h3>Edited one line, ran it again</h3><p class="v04-diff"><del>Use this app as a seven-year-old.</del><ins>Start from the first screen in src/routes/home.tsx and use this app as a seven-year-old.</ins></p><p>Same repo, new revision. Kiln keeps both so I can see what changed the result.</p></div></li>
        <li><time>9:17</time><div><h3>Pass</h3><p><em class="v04-tag v04-tag-p">pass</em> “The first obstacle: the Start button sits below the fold on a tablet, under a paragraph a seven-year-old won’t read.” That’s the agent’s verdict. Mine, recorded separately: keep it.</p></div></li>
      </ol>
      <p class="v04-fine">A dramatisation, with a real prompt from a real Kiln library. Your times will vary with your repo and your agent.</p>
    </section>

    <section class="v04-how" id="v04-how" aria-labelledby="v04-how-title">
      <h2 id="v04-how-title">How Kiln makes “now” the easy option</h2>
      <p class="v04-how-lede">Saving and testing live in the same place, so the shortest path after saving a prompt is running it.</p>
      <ul class="v04-todo">
        <li><h3>Save it without leaving what you’re doing</h3><p>Paste or drop text, links, screenshots and files. <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> from anywhere, <kbd>Ctrl</kbd>+<kbd>N</kbd> to capture, or the tray icon. Paste a YouTube link and press <b>Distill video</b> to get prompts, techniques and insights with timestamped links.</p></li>
        <li><h3>Run it on your own code, right there</h3><p>Pick a local project or repository, or an isolated example. Run the exact revision through Codex or Claude Code and watch it work. Up to two runs at once, cancel or retry. Read-only, always.</p></li>
        <li><h3>Get a verdict, keep your own</h3><p>Output and the agent’s pass, fail or uncertain are saved against that revision. Your judgement is separate. Tasks that need edits or unavailable tools come back uncertain, not as fake wins.</p></li>
        <li><h3>Get better at prompting by accident</h3><p>Edit, compare revisions and diffs, run again on the same repo. <b>Ask the agent</b> talks an item through with its attachments and the source video’s context.</p></li>
        <li><h3>Turn the keeper into a habit</h3><p><b>Create skill</b> drafts a SKILL.md from the prompt using Kiln’s writing-for-agents guidance. Approve the exact revision, install it into Codex, Claude Code or Copilot, and the next session picks it up.</p></li>
      </ul>
      <aside class="v04-pile">
        <h3>And the pile from every other “later”</h3>
        <p>Import the skills you already installed as drafts; the originals stay put. Collections, tags, search and filters keep the library findable, and Kiln shows every installed copy, including ones edited outside Kiln, so you can remove the ones you forgot about.</p>
      </aside>
    </section>

    <section class="v04-now" id="v04-now" aria-labelledby="v04-now-title">
      <div class="v04-now-note">
        <h2 id="v04-now-title">Today, not later.</h2>
        <a class="v04-download" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p>${releaseNote}</p>
      </div>
      <div class="v04-now-facts">
        <p><b>${subscription.title}</b> ${subscription.text} ${subscription.fine}</p>
        <p>Editing, approving and installing never call a model. A consent notice explains what’s sent before any agent sees your work. Your library is local and backed by a GitHub repository Kiln sets up for you with the official gh CLI.</p>
        <p class="v04-fine">Windows only. Unsigned build. MIT licensed, with a CLI your agents can use too.</p>
      </div>
    </section>
  </main>
</div>`;

  const board = root.querySelector<HTMLElement>('.v04-board')!;
  const note = root.querySelector<HTMLElement>('.v04-note')!;
  const noteText = root.querySelector<HTMLElement>('.v04-note-text')!;
  const replay = root.querySelector<HTMLButtonElement>('.v04-replay')!;
  const cal = root.querySelector<HTMLElement>('.v04-cal')!;
  const targets = () => {
    const grid = root.querySelector<HTMLElement>('.v04-grid')!;
    const selector = getComputedStyle(grid).display === 'none' ? '[data-astop]' : '[data-stop]';
    return [...root.querySelectorAll<HTMLElement>(selector)].sort((a, b) => Number(a.dataset.stop ?? a.dataset.astop) - Number(b.dataset.stop ?? b.dataset.astop));
  };
  const place = (i: number) => {
    const target = targets()[i];
    const box = board.getBoundingClientRect(), rect = target.getBoundingClientRect();
    const tilt = [-4, 3, -2, 5, -3, 2, -1][i];
    const last = i === stops.length - 1 && !target.dataset.astop;
    return { x: rect.left - box.left + rect.width - note.offsetWidth - (last ? -18 : 4), y: rect.top - box.top + (target.dataset.astop ? (rect.height - note.offsetHeight) / 2 : rect.height - note.offsetHeight + (last ? 26 : -4)), r: tilt };
  };
  const setState = (i: number) => {
    root.querySelectorAll<HTMLElement>('[data-stop], [data-astop]').forEach(el => {
      const k = Number(el.dataset.stop ?? el.dataset.astop);
      el.classList.toggle('is-said', k <= i); el.classList.toggle('is-passed', k > 0 && k < i);
    });
    cal.classList.toggle('is-done', i === stops.length - 1);
    noteText.textContent = i === stops.length - 1 ? 'tried it on my repo ✓' : 'try the seven-year-old usability prompt';
  };
  const put = (i: number) => { const p = place(i); note.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`; };

  let current = 0;
  let playing = false;
  const hop = (i: number) => new Promise<void>(resolve => {
    const from = place(current), to = place(i);
    const lift = Math.min(90, Math.abs(to.x - from.x) * .25 + Math.abs(to.y - from.y) * .25 + 30);
    const midX = (from.x + to.x) / 2, midY = Math.min(from.y, to.y) - lift;
    note.classList.add('is-flying');
    const anim = note.animate([
      { transform: `translate(${from.x}px, ${from.y}px) rotate(${from.r}deg)` },
      { transform: `translate(${from.x}px, ${from.y - 14}px) rotate(${from.r - 8}deg) scale(1.04)`, offset: .18 },
      { transform: `translate(${midX}px, ${midY}px) rotate(${(from.r + to.r) / 2 + 10}deg) scale(1.08)`, offset: .6 },
      { transform: `translate(${to.x}px, ${to.y}px) rotate(${to.r}deg)` },
    ], { duration: 820, easing: 'cubic-bezier(.45, 0, .3, 1)' });
    anim.onfinish = () => { note.classList.remove('is-flying'); current = i; put(i); setState(i); resolve(); };
  });
  const play = async () => {
    if (playing) return;
    playing = true;
    replay.hidden = true;
    current = 0; put(0); setState(0);
    for (let i = 1; i < stops.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 1 ? 1100 : 750));
      await hop(i);
    }
    playing = false;
    replay.hidden = false;
  };
  replay.addEventListener('click', () => { replay.blur(); play(); });

  const finish = () => { current = stops.length - 1; put(current); setState(current); };
  if (reduce) { finish(); replay.hidden = true; return; }
  put(0); setState(0);
  const start = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { start.disconnect(); play(); }
  }, { threshold: .2 });
  start.observe(board);
  addEventListener('resize', () => { if (!note.classList.contains('is-flying')) put(current); });
}
