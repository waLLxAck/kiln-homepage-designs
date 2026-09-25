// PROTOTYPE variant 39 — Darkroom. Under the safelight: develop a test print from your repo, pick the keeper off the contact sheet, archive the negatives.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Print = {
  title: string; rev: number; agent: string; repo: string; verdict: 'pass' | 'uncertain';
  lines: string[]; summary: string; tokens: [string, string, string]; time: string;
};

const prints: Print[] = [
  {
    title: examples[2].title, rev: 2, agent: 'Claude Code', repo: '~/code/tiny-racer', verdict: 'pass',
    lines: ['Jump buffering drops inputs on slopes', 'Checkpoint 3 respawns behind a hazard', 'Boost pads look like decoration', 'No way to skip the intro after a restart'],
    summary: 'Ten ranked improvements, three flagged for a human playtest. No changes made.',
    tokens: ['61,300', '40,720', '2,880'], time: '3:05',
  },
  {
    title: examples[0].title, rev: 2, agent: 'Codex', repo: '~/code/kid-quiz', verdict: 'pass',
    lines: ['Home screen: two big buttons and a grey icon', 'The grey icon has no label', 'A child taps the brighter button first', 'Suggestion: label the icon, enlarge the target'],
    summary: 'First obstacle found and explained. Nothing in the code changed.',
    tokens: ['48,210', '31,900', '2,114'], time: '2:14',
  },
  {
    title: examples[1].title, rev: 1, agent: 'Claude Code', repo: '~/code/billing-api', verdict: 'uncertain',
    lines: ['Read AGENTS.md, CLAUDE.md and recent history', 'Found an old naming rule in AGENTS.md', 'Could not see the chat where it happened', 'Proposed change needs your confirmation'],
    summary: 'Likely cause found, but the original conversation was not available, so: uncertain.',
    tokens: ['36,480', '22,050', '1,720'], time: '1:38',
  },
];

const frames = [
  { rev: 1, verdict: 'uncertain', text: 'Couldn’t tell which activity a child opens first.', mark: 'x' },
  { rev: 2, verdict: 'pass', text: 'Names the grey icon with no label. One fix.', mark: 'keep' },
  { rev: 3, verdict: 'uncertain', text: 'Asked it to fix the icon too. Needs edits, so uncertain. Nothing changed.', mark: 'x' },
  { rev: 4, verdict: 'pass', text: 'Right answer, written like a QA report, not a child.', mark: 'q' },
  { rev: 5, verdict: 'fail', text: 'Tested the parent signup instead. Wrong task.', mark: 'x' },
  { rev: 6, verdict: 'pass', text: 'Same as revision 2, with more words.', mark: 'x' },
];

const negatives = [
  { kind: 'Post from X', body: `<b>someone who ships</b><span>${examples[0].prompt.slice(0, 92)}…</span>` },
  { kind: 'Screenshot', body: '<i class="v39-neg-shot"></i><span>a stranger’s CLAUDE.md</span>' },
  { kind: 'YouTube talk', body: '<i class="v39-neg-play"></i><span>distilled at 14:32, 31:05, 47:18</span>' },
  { kind: 'Note', body: `<span>${examples[2].prompt.slice(0, 84)}…</span>` },
];

const sleeves = [
  { name: 'code-review', kind: 'Skill', approved: 2, revs: 4, copies: [['~/.agents/skills', 'installed'], ['~/.claude/skills', 'edited outside Kiln'], ['game/.github/skills', 'identical copy']] },
  { name: 'try-it-as-a-child', kind: 'Skill', approved: 2, revs: 6, copies: [['~/.claude/skills', 'installed'], ['kid-quiz/.github/skills', 'linked']] },
  { name: 'research', kind: 'Custom agent', approved: 1, revs: 3, copies: [['~/.codex/agents', 'installed'], ['old-app/.codex/skills', 'differs']] },
  { name: 'playtest-brief', kind: 'Prompt', approved: 0, revs: 2, copies: [] },
];

const printHtml = (p: Print) => `
  <div class="v39-p-head" data-tone="1"><span>Experiment</span><span>Revision ${p.rev}</span></div>
  <h3 class="v39-p-title" data-tone="1">${p.title}</h3>
  <p class="v39-p-meta" data-tone="2">${p.agent} on <b>${p.repo}</b>, read-only</p>
  <ol class="v39-p-out" data-tone="2">${p.lines.map(line => `<li>${line}</li>`).join('')}</ol>
  <p class="v39-p-sum" data-tone="3">${p.summary}</p>
  <div class="v39-p-foot">
    <div class="v39-p-verdict is-${p.verdict}" data-tone="1"><small>Agent’s verdict</small><b>${p.verdict}</b></div>
    <dl data-tone="3"><div><dt>Time</dt><dd>${p.time}</dd></div><div><dt>In</dt><dd>${p.tokens[0]}</dd></div><div><dt>Cached</dt><dd>${p.tokens[1]}</dd></div><div><dt>Out</dt><dd>${p.tokens[2]}</dd></div></dl>
  </div>
  <p class="v39-p-sample" data-tone="3">Sample print. Your judgement is recorded separately.</p>`;

const grease = {
  keep: `<svg class="v39-grease is-keep" viewBox="0 0 200 150" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M104 8C52 4 10 26 8 70c-2 44 44 72 100 70 52-2 88-30 86-68C192 30 150 8 96 12 70 14 50 20 38 30"/></svg>`,
  x: `<svg class="v39-grease is-x" viewBox="0 0 100 100" aria-hidden="true"><path pathLength="1" d="M18 16C40 40 62 62 84 86"/><path pathLength="1" d="M82 14C58 38 40 60 16 88"/></svg>`,
  q: `<svg class="v39-grease is-q" viewBox="0 0 60 80" aria-hidden="true"><path pathLength="1" d="M14 24C14 8 46 4 46 22c0 14-16 14-16 30"/><path pathLength="1" d="M30 66v4"/></svg>`,
};

const tray = (label: string, text: string) => `<li class="v39-step"><div class="v39-mini-tray" aria-hidden="true"><span></span></div><h3>${label}</h3><p>${text}</p></li>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Watch the idea develop';
  root.innerHTML = `
<div class="v39">
  <div class="v39-safelight" aria-hidden="true"></div>
  <header class="v39-top">
    <a class="v39-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v39-contact">Contact sheet</a><a href="#v39-archive">Archive</a><a href="#v39-lights">Download</a></nav>
  </header>
  <main id="main">
    <section class="v39-hero" aria-labelledby="v39-title">
      <div class="v39-hero-copy">
        <h1 id="v39-title">Watch the idea develop.</h1>
        <p>You saved a good prompt. Until it runs on your own code, it’s a latent image: something might be there. Kiln runs it on your repository through Codex or Claude Code, read-only, and the result comes up in front of you with a verdict.</p>
        <div class="v39-hero-actions">
          <button type="button" class="v39-develop" aria-controls="v39-print">Develop the print</button>
          <a class="v39-link" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        </div>
        <p class="v39-hint">Windows desktop app. Uses your signed-in Codex or Claude Code; no extra API bill.</p>
      </div>
      <figure class="v39-bench">
        <div class="v39-tray">
          <div class="v39-liquid" aria-hidden="true"></div>
          <div class="v39-paper" id="v39-print" aria-live="polite" aria-label="Test print"></div>
        </div>
        <figcaption class="v39-timer"><span>Developer</span><b class="v39-clock">0:00</b><span class="v39-status">Blank paper. Press develop.</span></figcaption>
      </figure>
    </section>

    <section class="v39-exposure" aria-labelledby="v39-exp-title">
      <div class="v39-sec-head">
        <h2 id="v39-exp-title">Every idea starts as a negative.</h2>
        <p>Paste or drop text, links, screenshots, images and files. Press Ctrl+N to capture, or Ctrl+Shift+Space to search from anywhere; the tray icon is always there. Save only keeps it without calling a model. Analyze and add turns it into prompts, techniques, tools and insights, in a collection linked to the source. A YouTube link becomes entries with timestamped links back into the video, with the transcript attached.</p>
      </div>
      <div class="v39-strip" role="list" tabindex="0" aria-label="A strip of saved ideas, shown as negatives">
        ${negatives.map((neg, i) => `<div class="v39-neg" role="listitem"><p class="v39-edge">KILN 400 <span>${12 + i * 2}${i % 2 ? 'A' : ''}</span></p><div class="v39-neg-frame"><div class="v39-neg-img">${neg.body}</div></div><p class="v39-neg-kind">${neg.kind}</p></div>`).join('')}
      </div>
    </section>

    <section class="v39-contact" id="v39-contact" aria-labelledby="v39-contact-title">
      <div class="v39-sec-head">
        <h2 id="v39-contact-title">Pick the keeper off the contact sheet.</h2>
        <p>Edit the prompt and you get a new revision; run it again on the same repo and the only thing that changed is your wording. Compare revisions and their diffs side by side, up to two runs at once. The agent prints its verdict on each frame. The grease pencil is yours: the agent’s assessment is kept separate from your judgement, and tasks that need edits come back uncertain rather than faked.</p>
      </div>
      <div class="v39-sheet" role="list" aria-label="Contact sheet: six revisions of ${examples[0].title}">
        <p class="v39-sheet-label">${examples[0].title} <span>on ~/code/kid-quiz</span></p>
        ${frames.map((frame, i) => `
          <div class="v39-frame${frame.mark === 'keep' ? ' is-keeper' : ''}" role="listitem" style="--i:${i}">
            <p class="v39-edge"><span>▸ ${i + 1}</span> REV ${frame.rev}</p>
            <div class="v39-frame-img">
              <p class="v39-f-verdict is-${frame.verdict}">${frame.verdict}</p>
              <p class="v39-f-text">${frame.text}</p>
            </div>
            ${grease[frame.mark as keyof typeof grease]}
            ${frame.mark === 'keep' ? '<p class="v39-grease-note" aria-hidden="true">approve this one</p>' : ''}
            <p class="visually-hidden">${frame.mark === 'keep' ? 'Circled: the keeper, approved.' : frame.mark === 'q' ? 'Marked with a question mark.' : 'Crossed out.'}</p>
          </div>`).join('')}
      </div>
      <p class="v39-sheet-caption">Sample contact sheet. The circled frame is revision 2, the one you approve.</p>
    </section>

    <section class="v39-chem" aria-labelledby="v39-chem-title">
      <h2 id="v39-chem-title" class="v39-chem-title">Then fix it, so it lasts.</h2>
      <ol class="v39-steps">
        ${tray('Develop', 'Run the exact revision on your repo. Watch messages, commands, reasoning effort and tokens as it goes.')}
        ${tray('Stop', 'Read the output. The agent says pass, fail or uncertain; you decide.')}
        ${tray('Fix', 'Create skill drafts a SKILL.md from the keeper. Approval pins that exact revision. Nothing is approved for you.')}
        ${tray('Wash', 'Approval commits and publishes the snapshot to your own Kiln GitHub repository, with validation that never executes skills.')}
      </ol>
    </section>

    <section class="v39-archive" id="v39-archive" aria-labelledby="v39-archive-title">
      <div class="v39-sec-head">
        <h2 id="v39-archive-title">Archive the negatives.</h2>
        <p>One library for prompts, skills and custom agents in native Codex, Claude Code and Copilot formats, with collections, search, tags, favorites and filters. Import skills you already installed, or a whole skills repository, as drafts; the originals stay put. Each sleeve shows the revisions, the one you approved, and every installed copy, including ones edited outside Kiln.</p>
      </div>
      <div class="v39-binder">
        ${sleeves.map(sleeve => `
          <article class="v39-sleeve" aria-label="${sleeve.name}">
            <header><h3>${sleeve.name}</h3><span>${sleeve.kind}</span></header>
            <div class="v39-sleeve-strip" aria-hidden="true">${Array.from({ length: sleeve.revs }, (_, r) => `<span class="${r + 1 === sleeve.approved ? 'is-approved' : ''}">${r + 1}</span>`).join('')}</div>
            <p class="v39-sleeve-rev">${sleeve.approved ? `Revision ${sleeve.approved} approved. Later edits are drafts.` : 'Not approved yet. Still a draft.'}</p>
            ${sleeve.copies.length ? `<ul class="v39-copies">${sleeve.copies.map(([path, state]) => `<li><code>${path}</code><span class="${state === 'edited outside Kiln' || state === 'differs' ? 'is-warn' : ''}">${state}</span></li>`).join('')}</ul>` : '<p class="v39-copies-none">Not installed anywhere.</p>'}
          </article>`).join('')}
      </div>
      <div class="v39-archive-notes">
        <p><b>Compare and clean up.</b> Compare an installed copy with the approved version, file by file. Remove local copies in bulk: managed copies are deleted, others move to private backups. Every skill an agent can invoke puts its description in the context on every turn, so keep only what earns its place.</p>
        <p><b>Print from the same negative anywhere.</b> Install always uses approved content, into Codex, Claude Code or Copilot locations, and a receipt records the revision and destination. On another machine, open the repository and press Install everything marked for this machine.</p>
      </div>
      <p class="v39-sheet-caption">Sample binder.</p>
    </section>

    <section class="v39-lights" id="v39-lights" aria-labelledby="v39-lights-title">
      <div class="v39-lights-inner">
        <h2 id="v39-lights-title">Lights on.</h2>
        <p>Kiln is a Windows desktop app with an MIT-licensed CLI. It uses the Codex or Claude Code you are already signed into, on your ChatGPT or Claude subscription: no API key, no extra API bill, and your plan’s usage limits still apply. A consent notice explains what is sent before any agent interaction.</p>
        <a class="v39-download" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p class="v39-fine">${releaseNote} Builds are unsigned.</p>
      </div>
    </section>
  </main>
</div>`;

  const paper = root.querySelector<HTMLElement>('.v39-paper')!;
  const bench = root.querySelector<HTMLElement>('.v39-bench')!;
  const button = root.querySelector<HTMLButtonElement>('.v39-develop')!;
  const clock = root.querySelector<HTMLElement>('.v39-clock')!;
  const status = root.querySelector<HTMLElement>('.v39-status')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let next = 0;
  let timer = 0;

  const load = (p: Print) => { paper.innerHTML = printHtml(p); bench.classList.remove('is-developing', 'is-done'); };
  load(prints[0]);

  const develop = () => {
    clearInterval(timer);
    if (bench.classList.contains('is-done')) { next = (next + 1) % prints.length; load(prints[next]); void paper.offsetWidth; }
    button.disabled = true;
    status.textContent = 'Developing. Nothing in your code changes.';
    bench.classList.add('is-developing');
    const instant = reduced || navigator.webdriver;
    const total = instant ? 0 : 4200;
    const start = performance.now();
    const tick = () => {
      const t = instant ? 1 : Math.min(1, (performance.now() - start) / total);
      const secs = Math.round(t * 60);
      clock.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      if (t >= 1) {
        clearInterval(timer);
        bench.classList.add('is-done');
        button.disabled = false;
        button.textContent = 'Develop another print';
        status.textContent = `Developed: ${prints[next].title}, revision ${prints[next].rev}. The verdict is the agent’s; the keeping is yours.`;
      }
    };
    if (instant) tick(); else timer = window.setInterval(tick, 100);
  };
  button.addEventListener('click', develop);

  // Automated full-page screenshots see the finished print.
  if (navigator.webdriver) { bench.classList.add('is-static'); develop(); }

  // Grease pencil marks draw themselves once the contact sheet is in view.
  const sheet = root.querySelector<HTMLElement>('.v39-sheet')!;
  if (navigator.webdriver || reduced || !('IntersectionObserver' in window)) sheet.classList.add('is-marked');
  else {
    const watch = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { sheet.classList.add('is-marked'); watch.disconnect(); } }, { threshold: .4 });
    watch.observe(sheet);
  }
}
