// PROTOTYPE 13 — Letter to future self. Two handwritten letters on a desk: the promise to try a prompt later, and the reply from the day it was tested.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

const [seven, wrong, playtest] = examples;

const letterOne = [
  'Dear future me,',
  'I saved this prompt today. I’ll try it later.',
  'It’s the one from that talk, where you use your own app the way a seven-year-old would and write down the first thing that confuses you. It sounded clever. It probably is.',
  'It’s going in the folder with the others. You know the folder. Screenshots, a post from X, half a YouTube video, <s>two</s> three copies of the same code-review skill.',
  'If you’re reading this, you still haven’t tried it. That’s all right. But one of these is the one that changes how you work, and it isn’t going to test itself.',
];

const letterTwo = [
  'Dear Sunday me,',
  'I tried it.',
  'I opened Kiln, picked the game repo and ran your exact prompt through Claude Code. The run was read-only, so nothing in the code moved. I watched it go: the files it read, the commands, its reasoning, the time and the tokens.',
  'The first run spent its time on the parents\u2019 signup screen, which no seven-year-old would ever see. The agent called it uncertain. Fair.',
  'So I added one line, skip the parent-only signup, and ran it again on the same repo. This time it found a real obstacle: a button with a word no seven-year-old can read. The agent marked it a pass. I read the output and agreed, but deciding was my job, not its.',
  'I compared the two revisions side by side. One sentence made the difference, and now I know why.',
  'So I made it a skill, approved revision 2 and installed it for Claude Code. It isn’t something I meant to try any more. It’s how I check a build.',
  'One down.',
];

const hand = (lines: string[], sign: string, ps = '') => `
  ${lines.map((line, i) => `<p class="v13-hand${i === 0 ? ' is-greeting' : ''}">${line}</p>`).join('')}
  <p class="v13-hand is-sign">${sign}</p>
  ${ps ? `<p class="v13-hand is-ps">${ps}</p>` : ''}`;

const card = (title: string, prompt: string, tilt: string) => `
  <figure class="v13-card" style="--tilt:${tilt}">
    <span class="v13-tape" aria-hidden="true"></span>
    <figcaption class="v13-card-title">${title}</figcaption>
    <blockquote>${prompt}</blockquote>
  </figure>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — For every prompt you promised to try later';
  root.innerHTML = `
<div class="v13">
  <svg class="v13-defs" aria-hidden="true" width="0" height="0">
    <filter id="v13-rough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
    <filter id="v13-ink"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2"/><feDisplacementMap in="SourceGraphic" scale="1.1"/></filter>
  </svg>
  <header class="v13-top">
    <a class="v13-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v13-sunday">The letters</a><a href="#v13-enclosure">What Kiln is</a><a href="#v13-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v13-hero" id="v13-sunday" aria-labelledby="v13-title">
      <div class="v13-intro">
        <h1 id="v13-title">For every prompt you promised to try later.</h1>
        <p>Kiln is a Windows app that lets you test a saved prompt on your own repository the moment you save it, see what the agent did, and keep what works as a skill.</p>
        <p class="v13-actions"><a class="v13-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a><a class="v13-textlink" href="#v13-enclosure">Read the enclosure first</a></p>
      </div>
      <article class="v13-paper v13-notepad" aria-label="Letter from Sunday me">
        <span class="v13-coffee" aria-hidden="true"></span>
        <p class="v13-date">Sunday, 11:48 pm</p>
        <div class="v13-writing" data-letter>${hand(letterOne, 'Love, and a little guilt,<br>Sunday me')}</div>
        <button type="button" class="v13-skip">Show the whole letter</button>
      </article>
      <figure class="v13-clipping">
        <span class="v13-clip" aria-hidden="true"></span>
        <figcaption>The prompt, saved from a YouTube talk. Timestamped link attached.</figcaption>
        <blockquote>${seven.prompt}</blockquote>
      </figure>
    </section>

    <p class="v13-interlude">Two days later</p>

    <section class="v13-reply" id="v13-tuesday" aria-label="The reply from Tuesday me">
      <article class="v13-paper v13-legal" aria-label="Letter from Tuesday me">
        <p class="v13-date">Tuesday, lunch</p>
        <div class="v13-writing" data-letter>${hand(letterTwo, 'Tuesday me', 'P.S. The rest of the folder is next. Some of them will fail. That’s the point.')}</div>
        <button type="button" class="v13-skip">Show the whole letter</button>
      </article>
      <aside class="v13-slip" aria-labelledby="v13-slip-title">
        <span class="v13-staple" aria-hidden="true"></span>
        <h2 id="v13-slip-title">Experiment</h2>
        <p class="v13-slip-sub">${seven.title}. Sample run, figures illustrative.</p>
        <dl>
          <div><dt>Revision 1</dt><dd>Uncertain</dd></div>
          <div><dt>Revision 2</dt><dd>this run</dd></div>
          <div><dt>Repository</dt><dd>game, read-only</dd></div>
          <div><dt>Agent</dt><dd>Claude Code</dd></div>
          <div><dt>Reasoning effort</dt><dd>high</dd></div>
          <div><dt>Elapsed</dt><dd>4 min 10 s</dd></div>
          <div><dt>Tokens</dt><dd>41,200 in · 28,900 cached · 2,300 out</dd></div>
          <div><dt>Agent’s assessment</dt><dd><b>Pass</b></dd></div>
          <div><dt>Your judgement</dt><dd><b>Keep. Create skill.</b></dd></div>
        </dl>
        <p class="v13-slip-foot">Saved against the revision you ran. Kept apart from your own verdict.</p>
      </aside>
      <div class="v13-next">
        <h2>Still in the folder</h2>
        ${card(wrong.title, wrong.prompt, '-2deg')}
        ${card(playtest.title, playtest.prompt, '1.6deg')}
      </div>
    </section>

    <section class="v13-enclosure" id="v13-enclosure" aria-labelledby="v13-enc-title">
      <p class="v13-enc-kicker">Enclosure</p>
      <h2 id="v13-enc-title">What Tuesday me was using</h2>
      <div class="v13-enc-cols">
        <div><h3>Capture it before it gets lost</h3><p>Paste or drop text, links, screenshots, images and files. <kbd>Ctrl</kbd>+<kbd>N</kbd> to capture, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> for quick search, and a tray icon. <em>Save only</em> keeps it without calling a model; <em>Analyze and add</em> turns a source into prompts, insights, techniques and tools. Paste a YouTube link and press <em>Distill video</em> for entries with timestamped source links.</p></div>
        <div><h3>Test it on your own repo, right away</h3><p>Choose a local project, or an isolated example, and run the exact prompt revision through Codex or Claude Code. Watch messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and token counts live. Up to two runs at once; cancel or retry. Experiments are read-only, so nothing in your code changes.</p></div>
        <div><h3>A verdict, and your own</h3><p>The output and the agent’s pass, fail or uncertain assessment are saved against that revision, separate from your judgement. Tasks that would need edits or unavailable tools come back uncertain instead of pretending.</p></div>
        <div><h3>Learn prompting by doing it</h3><p>Edit, compare revisions and diffs, and run again on the same repo to see what changed the result. <em>Ask the agent</em> talks an item through with its attachments and source video. <em>Create skill</em> drafts a SKILL.md with bundled writing-for-agents guidance, linked back to its source.</p></div>
        <div><h3>From prompt to habit</h3><p>Approve the revision that proved itself. Kiln commits and publishes it to your own Kiln GitHub repository and installs it into Codex, Claude Code or Copilot locations. A new agent session picks it up. Your library shows every installed copy, and any edited outside Kiln.</p></div>
        <div><h3>No new bill</h3><p>Kiln uses your signed-in Codex or Claude Code, on your ChatGPT or Claude subscription. No API key and no extra API bill, though your usage limits still apply. A consent notice explains what is sent before any agent interaction. Organising, approving and installing never call a model.</p></div>
      </div>
      <div class="v13-coupon" id="v13-download">
        <div>
          <h2>Kiln 0.17.0 for Windows</h2>
          <p>${releaseNote} Builds are unsigned, so Windows may ask before running the installer. MIT licensed, with a CLI.</p>
        </div>
        <a class="v13-button is-dark" href="${installer}">${windowsMark}<span>Download the installer</span></a>
      </div>
    </section>
  </main>
</div>`;

  // Handwriting: wrap each word, then time it by its position on the page so lines are written left to right, top to bottom.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrap = (node: Node) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.append(part);
          else { const span = document.createElement('span'); span.className = 'v13-w'; span.textContent = part; frag.append(span); }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') wrap(child);
    });
  };
  root.querySelectorAll<HTMLElement>('[data-letter]').forEach(letter => {
    const paper = letter.closest<HTMLElement>('.v13-paper')!;
    const skip = paper.querySelector<HTMLButtonElement>('.v13-skip')!;
    letter.querySelectorAll('.v13-hand').forEach(wrap);
    if (reduce) { paper.classList.add('is-done'); skip.hidden = true; return; }
    const time = () => {
      const words = [...letter.querySelectorAll<HTMLElement>('.v13-w')];
      const speed = Math.max(380, letter.clientWidth * 1.05);
      let t = 0.2, lineTop = -1, lineStart = 0, lineLeft = 0, para: Element | null = null, lineEnd = 0;
      words.forEach(w => {
        const r = w.getBoundingClientRect();
        const p = w.closest('.v13-hand');
        if (lineTop < 0 || Math.abs(r.top - lineTop) > 8) {
          t = lineEnd + (p !== para && para ? .45 : .14);
          lineTop = r.top; lineStart = t; lineLeft = r.left;
        }
        para = p;
        const delay = lineStart + (r.left - lineLeft) / speed;
        const dur = Math.max(.08, r.width / speed);
        w.style.setProperty('--d', `${delay.toFixed(3)}s`);
        w.style.setProperty('--t', `${dur.toFixed(3)}s`);
        lineEnd = delay + dur;
      });
      return lineEnd;
    };
    let total = 0;
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      total = time();
      paper.classList.add('is-writing');
      setTimeout(() => { paper.classList.add('is-done'); skip.hidden = true; }, total * 1000 + 300);
    }, { threshold: .25 });
    io.observe(letter);
    skip.addEventListener('click', () => { paper.classList.add('is-done'); skip.hidden = true; io.disconnect(); });
  });
}
