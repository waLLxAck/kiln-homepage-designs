// PROTOTYPE 43 — Sketchnote. A whiteboard explainer whose marker strokes draw themselves section by section:
// the "I'll try it later" loop, cut by a quick read-only test on your repo, prompting learned by iterating, then a skill.
import './style.css';
import { examples, installer, windowsMark } from '../../content';
import { arrow, bubble, check, ellipse, line, rect, reseed, s, scribble, stick, type Ink } from './rough';

const P = 'v43';

/** HTML box with a hand-drawn frame that stretches to fit its content. */
const box = (content: string, ink: Ink = 'k', cls = '') => `<div class="${P}-box ${cls}"><svg class="${P}-frame" viewBox="-3 -3 106 106" preserveAspectRatio="none" aria-hidden="true">${s(rect(0, 0, 100, 100, 1.2), ink, `${P}-ns`)}</svg><div class="${P}-box-in">${content}</div></div>`;
const flowArrow = (ink: Ink = 'k') => `<svg class="${P}-arr" viewBox="0 0 80 40" aria-hidden="true">${s(arrow(6, 22, 72, 18, -6, 13), ink)}</svg>`;
const t = (x: number, y: number, text: string, ink: Ink = 'k', size = 28, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" class="${P}-t ${P}-${ink}t" font-size="${size}" text-anchor="${anchor}" ${extra}>${text}</text>`;
const underline = (ink: Ink = 'b') => `<svg class="${P}-ul" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">${s(`M4,7 Q80,${3 + Math.random() * 4} 150,7 T296,6`, ink, `${P}-ns`)}</svg>`;

const heroSketch = () => {
  reseed(5);
  const cards = [['prompt', -8, 40, 330], ['thread', 6, 130, 350], ['video', -3, 20, 392], ['tip!!', 10, 150, 404], ['CLAUDE.md trick', -5, 60, 436]] as const;
  return `<svg class="${P}-art ${P}-hero-art" viewBox="0 0 560 480" role="img" aria-labelledby="${P}-hero-art-t">
  <title id="${P}-hero-art-t">A stick figure at a laptop says “I’ll try it later!” next to a pile of saved prompts, threads and videos. Saved: a lot. Tried: none.</title>
  ${cards.map(([label, rot, x, y], i) => `<g transform="rotate(${rot} ${x + 60} ${y})">${s(rect(x, y - 26, label.length > 8 ? 170 : 120, 40, 2), i % 2 ? 'b' : 'k')}${t(x + (label.length > 8 ? 85 : 60), y + 2, label, i % 2 ? 'b' : 'k', 22)}</g>`).join('')}
  ${s(rect(230, 250, 150, 96, 2))}${s(line(200, 360, 410, 360, 2))}${s(line(200, 360, 222, 346, 1))}${s(line(410, 360, 388, 346, 1))}
  ${s(scribble(252, 272, 104, 4, 14), 'b')}
  ${s(stick(470, 214, 1.25), 'k')}
  ${s(bubble(252, 44, 290, 104, 452, 190), 'k')}
  ${t(397, 106, 'I’ll try it later!', 'k', 38)}
  ${t(28, 214, 'saved: a lot', 'r', 30, 'start')}
  ${t(28, 250, 'tried: 0', 'r', 30, 'start')}
  ${s(arrow(120, 262, 110, 300, 12, 12), 'r')}
</svg>`;
};

const loopSketch = () => {
  reseed(23);
  const tally = Array.from({ length: 3 }, (_, g) => [0, 1, 2, 3].map(n => line(262 + g * 56 + n * 10, 262, 264 + g * 56 + n * 10, 300, 1)).join(' ') + ' ' + line(256 + g * 56, 294, 300 + g * 56, 266, 1)).join(' ');
  return `<svg class="${P}-art ${P}-loop" viewBox="0 0 680 580" role="img" aria-labelledby="${P}-loop-t">
  <title id="${P}-loop-t">The loop: see a great prompt, bookmark it, say “I’ll try it later”, forget it, see another great prompt. A red cut through the loop is labelled “snip: test it now”.</title>
  ${s(arrow(452, 96, 590, 226, -48, 16), 'b')}
  ${s(arrow(590, 352, 452, 482, -48, 16), 'b')}
  ${s(arrow(228, 482, 90, 352, -48, 16), 'b')}
  ${s(arrow(90, 226, 228, 96, -48, 16), 'b')}
  ${t(340, 82, 'see a great prompt', 'k', 34)}
  ${t(598, 300, 'bookmark it', 'k', 32)}
  ${t(340, 526, '“I’ll try it later”', 'k', 34)}
  ${t(84, 300, 'forget it', 'k', 32)}
  ${t(340, 238, 'saved', 'b', 24)}
  ${s(tally, 'b')}
  ${t(340, 344, 'tried: 0', 'r', 28)}
  ${s(line(612, 498, 470, 360, 2), 'r', `${P}-dash`)}
  ${s(`${ellipse(606, 520, 11, 11, .05, 1.05)} ${ellipse(632, 508, 11, 11, .05, 1.05)} ${line(612, 511, 660, 468, 1)} ${line(624, 502, 666, 482, 1)}`, 'r')}
  ${t(470, 438, 'snip!', 'r', 34, 'middle', `transform="rotate(-38 470 438)"`)}
  ${t(528, 470, 'test it now', 'r', 24, 'middle', `transform="rotate(-38 528 470)"`)}
</svg>`;
};

const judgeSketch = () => {
  reseed(41);
  return `<svg class="${P}-art ${P}-judge" viewBox="20 0 710 400" role="img" aria-labelledby="${P}-judge-t">
  <title id="${P}-judge-t">A robot says “uncertain: this needs edits, and I’m read-only.” A stick figure replies “My call: keep the idea, tweak the prompt.”</title>
  ${s(`${rect(92, 150, 76, 64, 2)} ${line(130, 150, 130, 120, 1)} ${ellipse(130, 114, 7, 7, .05)} ${ellipse(114, 178, 5, 5, .05)} ${ellipse(146, 178, 5, 5, .05)} ${line(114, 198, 146, 198, 1)}`, 'b')}
  ${s(`${rect(98, 222, 64, 78, 2)} ${line(110, 300, 104, 350, 1)} ${line(150, 300, 156, 350, 1)} ${line(98, 240, 62, 276, 1)} ${line(162, 240, 196, 214, 1)}`, 'b')}
  ${s(bubble(166, 4, 272, 150, 170, 150, .1), 'b')}
  ${t(302, 60, 'uncertain:', 'b', 34)}${t(302, 96, 'this needs edits,', 'k', 28)}${t(302, 126, 'and I’m read-only', 'k', 28)}
  ${s(stick(640, 190, 1.2, true), 'k')}
  ${s(bubble(452, 28, 236, 124, 624, 172, .7), 'g')}
  ${t(570, 82, 'my call:', 'g', 34)}${t(570, 118, 'keep it, tweak it', 'k', 26)}
  ${t(146, 388, 'agent’s assessment', 'b', 28)}
  ${t(632, 388, 'your judgement', 'g', 28)}
  ${s(line(395, 250, 395, 390, 2), 'k', `${P}-dash`)}
</svg>`;
};

const cycleSketch = () => {
  reseed(61);
  return `<svg class="${P}-art ${P}-cycle" viewBox="-30 0 420 250" role="img" aria-labelledby="${P}-cycle-t">
  <title id="${P}-cycle-t">A small loop: edit, run again on the same repo, compare. Repeat.</title>
  ${s(arrow(200, 34, 300, 150, -40, 13), 'g')}${s(arrow(270, 206, 90, 206, -40, 13), 'g')}${s(arrow(60, 150, 150, 34, -40, 13), 'g')}
  ${t(180, 36, 'edit', 'k', 28)}${t(318, 190, 'run again', 'k', 26)}${t(40, 190, 'compare', 'k', 26)}
  ${t(180, 132, 'same repo', 'g', 22)}
</svg>`;
};

const doodles = {
  lock: `<svg class="${P}-doodle" viewBox="0 0 60 60" aria-hidden="true">${s(`${rect(12, 26, 36, 28, 1.2)} M20,26 Q20,8 30,8 Q40,8 40,26`, 'g')}${s(line(30, 36, 30, 44, .5), 'g')}</svg>`,
  eye: `<svg class="${P}-doodle" viewBox="0 0 70 44" aria-hidden="true">${s('M4,22 Q35,-6 66,22 Q35,50 4,22', 'b')}${s(ellipse(35, 22, 9, 9, .05), 'b')}</svg>`,
  money: `<svg class="${P}-doodle" viewBox="0 0 60 60" aria-hidden="true">${s(ellipse(30, 30, 22, 22, .04), 'k')}<text x="30" y="40" class="${P}-t ${P}-kt" font-size="30" text-anchor="middle">$</text>${s(line(10, 50, 50, 10, 1.2), 'r')}</svg>`,
  file: `<svg class="${P}-doodle" viewBox="0 0 60 70" aria-hidden="true">${s('M10,4 L40,4 L52,16 L52,66 L10,66 Z M40,4 L40,16 L52,16', 'k')}${s(`${line(18, 30, 44, 30, .6)} ${line(18, 40, 44, 40, .6)} ${line(18, 50, 36, 50, .6)}`, 'b')}</svg>`,
  stamp: `<svg class="${P}-doodle" viewBox="0 0 70 70" aria-hidden="true">${s(`${ellipse(35, 35, 30, 30, .03)} ${ellipse(35, 35, 23, 23, .03)}`, 'r')}${s(check(22, 30, 1.1), 'r')}</svg>`,
  folder: `<svg class="${P}-doodle" viewBox="0 0 70 56" aria-hidden="true">${s('M4,12 L24,12 L30,18 L66,18 L66,52 L4,52 Z', 'k')}${s(line(4, 26, 66, 26, .6), 'k')}</svg>`,
  bulb: `<svg class="${P}-doodle" viewBox="0 0 60 70" aria-hidden="true">${s('M20,46 Q6,34 12,20 Q20,4 36,6 Q54,10 50,30 Q48,38 40,46 Z', 'k')}${s(`${line(22, 52, 38, 52, .6)} ${line(24, 58, 36, 58, .6)}`, 'k')}${s(`${line(30, 0, 30, -6, .3)} ${line(54, 8, 60, 3, .3)} ${line(6, 8, 0, 3, .3)}`, 'g')}</svg>`,
  video: `<svg class="${P}-doodle" viewBox="0 0 70 50" aria-hidden="true">${s(rect(4, 4, 62, 42, 1.2), 'r')}${s('M28,15 L46,25 L28,35 Z', 'r')}</svg>`,
  shelf: `<svg class="${P}-doodle" viewBox="0 0 80 60" aria-hidden="true">${s(`${rect(8, 12, 12, 40, .6)} ${rect(22, 8, 12, 44, .6)} ${rect(36, 16, 12, 36, .6)}`, 'b')}${s('M52,52 L60,14 L72,17 L64,54 Z', 'g')}${s(line(2, 54, 78, 54, 1), 'k')}</svg>`,
};

const checkbox = (label: string, on: boolean, ink: Ink) => `<li><svg class="${P}-cb" viewBox="0 0 34 34" aria-hidden="true">${s(rect(4, 6, 24, 24, 1), 'k')}${on ? s(check(6, 12, 1.1), ink) : ''}</svg><span class="${on ? `${P}-${ink}c` : ''}">${label}</span></li>`;

const newLines: [string, string][] = [
  ['Use this app as a seven-year-old.', 'a real person'],
  ['Skip the parent-only signup.', 'a way past the wall'],
  ['Try different activities until you hit something confusing or cannot tell what to do next.', 'keep going until…'],
  ['Describe that first obstacle and suggest a fix.', 'a finish line'],
  ['Make no changes yet.', 'hands off'],
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Later is a loop. Kiln cuts it.';
  root.innerHTML = `
<a class="skip" href="#${P}-main">Skip to content</a>
<div class="${P}">
  <header class="${P}-top">
    <a class="${P}-brand" href="#${P}-main">Kiln</a>
    <nav aria-label="Sections"><a href="#${P}-loop">the loop</a><a href="#${P}-test">the test</a><a href="#${P}-learn">the lesson</a><a href="#${P}-skill">the skill</a><a class="${P}-top-dl" href="#${P}-get">download</a></nav>
  </header>
  <main id="${P}-main">
    <section class="${P}-sec ${P}-hero" aria-labelledby="${P}-h1">
      <div class="${P}-hero-copy">
        <h1 id="${P}-h1" class="${P}-write">Later is a loop.<br>Kiln cuts it.</h1>
        ${underline('r')}
        <p class="${P}-lede">Kiln is a Windows app that runs the prompt you saved on your own repo, right now, read-only, through the Codex or Claude Code you already use. You see what it does, learn why, and keep the good ones as skills.</p>
        <a class="${P}-cta" href="${installer}">${box(`${windowsMark}<span>Download for Windows</span>`, 'b', `${P}-cta-box`)}</a>
        <p class="${P}-small">Version 0.17.0. The release lives in a private GitHub repository, so you need an account with access.</p>
      </div>
      ${heroSketch()}
    </section>

    <section class="${P}-sec" id="${P}-loop" aria-labelledby="${P}-loop-h">
      <div class="${P}-sec-head"><span class="${P}-num" aria-hidden="true">1</span><h2 id="${P}-loop-h" class="${P}-write">You know this loop.</h2></div>
      <div class="${P}-two">
        ${loopSketch()}
        <div class="${P}-aside">
          <p>A great prompt goes by. You bookmark it, screenshot it, paste it into a note. You’ll try it later. Later doesn’t come, and the pile grows.</p>
          <p>The loop breaks at one spot: the moment between saving and forgetting. That’s where Kiln puts a quick test on your own code.</p>
          ${box(`<p class="${P}-note-t">Capture is quick too</p><p>Paste or drop text, links, screenshots and files. <b>Ctrl+Shift+Space</b> from anywhere, <b>Ctrl+N</b> inside Kiln. “Save only” keeps it without calling a model.</p>`, 'b', `${P}-sticky`)}
        </div>
      </div>
    </section>

    <section class="${P}-sec" id="${P}-test" aria-labelledby="${P}-test-h">
      <div class="${P}-sec-head"><span class="${P}-num" aria-hidden="true">2</span><h2 id="${P}-test-h" class="${P}-write">Test it now, on your repo.</h2></div>
      <ol class="${P}-flow" aria-label="How a test run works">
        <li>${box(`<h3>your saved prompt</h3><p class="${P}-quote">“${examples[0].prompt.split('. ').slice(0, 2).join('. ')}…”</p>`, 'k')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow()}</li>
        <li>${box(`<h3>Kiln</h3><p>pick a local project or repo (or an isolated example) and run that exact revision</p>`, 'b')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow()}</li>
        <li>${box(`<h3>Codex or Claude Code</h3><div class="${P}-with">${doodles.money}<p>the one you’re already signed into. No API key, no extra bill.</p></div>`, 'k')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow('g')}</li>
        <li>${box(`<h3>your repo</h3><div class="${P}-with">${doodles.lock}<p>read-only. Nothing in your code changes.</p></div>`, 'g')}</li>
      </ol>
      <div class="${P}-after">
        <div class="${P}-watch">${doodles.eye}<p><b>You watch it live:</b> messages, reasoning summaries, commands, web searches, the model, reasoning effort, elapsed time and token counts. Two runs at once if you like. Cancel or retry any time.</p></div>
        ${box(`<h3>the verdict, saved with that revision</h3><ul class="${P}-checks">${checkbox('pass', true, 'g')}${checkbox('fail', false, 'r')}${checkbox('uncertain', false, 'b')}</ul><p class="${P}-small">Sample. Your subscription’s usage limits still apply, and a notice tells you what gets sent before anything runs.</p>`, 'g', `${P}-verdict`)}
      </div>
    </section>

    <section class="${P}-sec" aria-labelledby="${P}-judge-h">
      <div class="${P}-sec-head"><span class="${P}-num" aria-hidden="true">3</span><h2 id="${P}-judge-h" class="${P}-write">The agent grades. You decide.</h2></div>
      <div class="${P}-two ${P}-two-flip">
        ${judgeSketch()}
        <div class="${P}-aside">
          <p>The agent marks each run pass, fail or uncertain, and that stays separate from your own judgement.</p>
          <p>If a task needs edits or a tool that isn’t there, it comes back <span class="${P}-bc">uncertain</span>, not as a success it faked. That’s useful: it tells you what to change in the prompt.</p>
        </div>
      </div>
    </section>

    <section class="${P}-sec" id="${P}-learn" aria-labelledby="${P}-learn-h">
      <div class="${P}-sec-head"><span class="${P}-num" aria-hidden="true">4</span><h2 id="${P}-learn-h" class="${P}-write">Prompting, learned by doing.</h2></div>
      <p class="${P}-intro">Edit the prompt, run it again on the same repo, compare the two revisions. You can see which change moved the result. Here’s one we tried (sample runs).</p>
      <div class="${P}-diff">
        ${box(`<p class="${P}-rev ${P}-rc">revision 1</p>
          <p class="${P}-old">Use this app as a kid and tell me what’s confusing.</p>
          <ul class="${P}-margin ${P}-rc"><li>which kid? how old?</li><li>stops at the signup wall</li><li>no finish line, so you get a long vague list</li></ul>
          <p class="${P}-result"><span class="${P}-bc">uncertain</span> 23 general tips, never got past signup</p>`, 'r', `${P}-v1`)}
        <div class="${P}-edit" aria-hidden="true"><svg viewBox="0 0 100 60">${s(arrow(8, 40, 90, 30, -14, 14), 'k')}</svg><span>edit</span></div>
        ${box(`<p class="${P}-rev ${P}-gc">revision 2</p>
          <ul class="${P}-newlines">${newLines.map(([text, note]) => `<li><span class="${P}-line">${text}${underline('g')}</span><span class="${P}-why ${P}-gc">${note}</span></li>`).join('')}</ul>
          <p class="${P}-result"><span class="${P}-gc">pass</span> one obstacle (unlabelled icons), one fix</p>`, 'g', `${P}-v2`)}
      </div>
      <div class="${P}-lesson">
        ${cycleSketch()}
        <div>
          <p class="${P}-big">What you learn isn’t “this prompt works”. It’s <em>why</em>: a real person, a way past the wall, a finish line.</p>
          <p>Stuck? “Ask the agent” talks an item through with its attachments and the source video attached.</p>
        </div>
      </div>
    </section>

    <section class="${P}-sec" id="${P}-skill" aria-labelledby="${P}-skill-h">
      <div class="${P}-sec-head"><span class="${P}-num" aria-hidden="true">5</span><h2 id="${P}-skill-h" class="${P}-write">Then it becomes a habit.</h2></div>
      <ol class="${P}-flow ${P}-flow-5" aria-label="From prompt to skill">
        <li>${box(`<h3>the prompt that worked</h3><p>revision 2, with its test run</p>`, 'k')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow()}</li>
        <li>${box(`<div class="${P}-with">${doodles.file}<div><h3>Create skill</h3><p>drafts a SKILL.md with Kiln’s writing-for-agents guidance</p></div></div>`, 'b')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow()}</li>
        <li>${box(`<div class="${P}-with">${doodles.stamp}<div><h3>approve</h3><p>pins that exact revision and publishes it to your Kiln GitHub repo</p></div></div>`, 'r')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow()}</li>
        <li>${box(`<div class="${P}-with">${doodles.folder}<div><h3>install</h3><p>into Codex, Claude Code or Copilot folders</p></div></div>`, 'k')}</li>
        <li class="${P}-arrow-li" aria-hidden="true">${flowArrow('g')}</li>
        <li>${box(`<div class="${P}-with">${doodles.bulb}<div><h3>next session</h3><p>your agent picks it up</p></div></div>`, 'g')}</li>
      </ol>
      <p class="${P}-intro ${P}-after-flow">Edit it later and you get a new draft; the approved one keeps working until you approve again. One tested prompt can quietly change how you do everyday AI work.</p>
    </section>

    <section class="${P}-sec ${P}-corners" aria-label="Also in Kiln">
      ${box(`<h2 class="${P}-corner-h">the capture corner</h2>${doodles.video}
        <ul class="${P}-list">
          <li>Paste a YouTube link, press <b>Distill video</b>. Captions become prompts, techniques, tools and insights, each with a timestamped link.</li>
          <li>The transcript stays attached, so an idea keeps its explanation.</li>
          <li>“Analyze and add” does the same for a post, a screenshot or a file.</li>
        </ul>`, 'b', `${P}-corner ${P}-corner-a`)}
      ${box(`<h2 class="${P}-corner-h">the library corner</h2>${doodles.shelf}
        <ul class="${P}-list">
          <li>One library for prompts, skills, custom agents and notes, instead of <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code> and friends.</li>
          <li>Every installed copy in every project, including the one someone <span class="${P}-rc">edited by hand</span>.</li>
          <li>Each skill’s description sits in your agent’s context every turn, so remove what you don’t use.</li>
          <li>CLAUDE.md, AGENTS.md, config.toml and more, edited in place with 30 backups.</li>
        </ul>`, 'k', `${P}-corner ${P}-corner-b`)}
    </section>

    <section class="${P}-sec ${P}-get" id="${P}-get" aria-labelledby="${P}-get-h">
      <svg class="${P}-art ${P}-wave" viewBox="0 0 120 150" aria-hidden="true">${(reseed(77), s(stick(60, 26, 1.1, true)))}</svg>
      <h2 id="${P}-get-h" class="${P}-write">Go on. Try the one you saved this morning.</h2>
      <a class="${P}-cta ${P}-cta-big" href="${installer}">${box(`${windowsMark}<span>Download Kiln for Windows</span>`, 'b', `${P}-cta-box`)}</a>
      <p class="${P}-small">Kiln 0.17.0, Windows. The release is in a private GitHub repository: sign in with an account that has access. Unsigned build, MIT licence. Kiln sets up your library repository with the official <code>gh</code> CLI.</p>
    </section>
  </main>
</div>`;

  // Number the strokes and handwriting inside each section so they draw in order.
  const sections = [...root.querySelectorAll<HTMLElement>(`.${P}-sec`)];
  sections.forEach(sec => {
    sec.querySelectorAll<SVGElement>(`.${P}-s`).forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, 40))));
    sec.querySelectorAll<SVGElement>(`.${P}-t`).forEach((el, i) => el.style.setProperty('--i', String(Math.min(i * 2 + 2, 40))));
  });
  if (!('IntersectionObserver' in window)) { sections.forEach(sec => sec.classList.add('is-drawn')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-drawn');
    io.unobserve(e.target);
  }), { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  sections.forEach(sec => io.observe(sec));
}
