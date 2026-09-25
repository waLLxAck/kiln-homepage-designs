// PROTOTYPE 44 — Science fair. A tri-fold poster board that runs the scientific method on a saved prompt.
// Signature: the board unfolds on load (3D hinges) and a blue first-place rosette swings from its pin.
import './style.css';
import { examples, installer, windowsMark } from '../../content';

const P = 'v44';
const paper = ['#e2483a', '#f3c233', '#2f6fd1', '#3b9a4c', '#ef8b2b', '#8e5cb8'];
const tilt = (n: number) => [-1.6, 1.1, -.7, 1.8, -1.2, .6, 1.4, -.9][n % 8];

const title = (text: string) => text.split('').map((ch, i) => ch === ' '
  ? '<span class="v44-gap"></span>'
  : `<span class="${P}-tile" style="--c:${paper[i % paper.length]};--r:${tilt(i * 3) * 3}deg">${ch}</span>`).join('');

/** A construction-paper backing with a marker title and a glued printout on top. */
let cardId = 0;
// Reading order when the panels stack on a phone: the scientific method, top to bottom.
const phoneOrder = ['Question', 'Hypothesis', 'Materials', 'Procedure', 'Results', 'Conclusion', 'What I learned about prompting', 'Further research', 'Bibliography'];
const card = (n: number, heading: string, body: string, cls = '') => `
<section class="${P}-card ${cls}" style="--o:${phoneOrder.indexOf(heading) + 1};--c:${paper[n % paper.length]};--r:${tilt(n)}deg;--pr:${tilt(n + 3) * .7}deg" aria-labelledby="${P}-h-${++cardId}">
  <h2 id="${P}-h-${cardId}" class="${P}-label">${heading}</h2>
  <div class="${P}-print">${body}</div>
</section>`;

const rosette = `<svg class="${P}-rosette" viewBox="0 0 160 260" role="img" aria-label="Blue first place rosette">
  <path d="M58 118 L30 250 L56 232 L70 256 L84 128 Z" fill="#1d4fb0"/><path d="M102 118 L130 250 L104 232 L90 256 L76 128 Z" fill="#2a63cf"/>
  <path d="M60 128 L44 210 M100 128 L116 210" stroke="#f3c233" stroke-width="3" opacity=".8"/>
  <polygon fill="#2a63cf" points="${Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2, r = i % 2 ? 66 : 76; return `${80 + Math.cos(a) * r},${80 + Math.sin(a) * r}`; }).join(' ')}"/>
  <polygon fill="#1d4fb0" points="${Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2 + .1, r = i % 2 ? 50 : 58; return `${80 + Math.cos(a) * r},${80 + Math.sin(a) * r}`; }).join(' ')}"/>
  <circle cx="80" cy="80" r="42" fill="#f3c233"/><circle cx="80" cy="80" r="36" fill="none" stroke="#1d4fb0" stroke-width="2" stroke-dasharray="3 4"/>
  <text x="80" y="76" text-anchor="middle" class="${P}-ros-big">1st</text><text x="80" y="98" text-anchor="middle" class="${P}-ros-small">PLACE</text>
  <circle cx="80" cy="6" r="6" fill="#c9312a"/><circle cx="78" cy="4" r="2" fill="#fff" opacity=".7"/>
</svg>`;

const graph = () => {
  const bars = [{ rev: 'rev 1', v: 2, verdict: 'uncertain', c: '#f3c233' }, { rev: 'rev 2', v: 3, verdict: 'fail', c: '#e2483a' }, { rev: 'rev 3', v: 5, verdict: 'pass', c: '#3b9a4c' }];
  const H = 190, base = 220, unit = H / 5;
  return `<svg class="${P}-graph" viewBox="0 0 420 290" role="img" aria-labelledby="${P}-graph-t">
    <title id="${P}-graph-t">Illustrative bar chart, not measured: how useful each revision’s answer was, rated by me from 1 to 5. Revision 1: 2, agent said uncertain. Revision 2: 3, agent said fail. Revision 3: 5, agent said pass.</title>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="56" x2="400" y1="${base - i * unit}" y2="${base - i * unit}" class="${P}-grid"/><text x="44" y="${base - i * unit + 6}" text-anchor="end" class="${P}-axis">${i}</text>`).join('')}
    <line x1="56" y1="20" x2="56" y2="${base}" class="${P}-axis-line"/><line x1="56" y1="${base}" x2="400" y2="${base}" class="${P}-axis-line"/>
    ${bars.map((b, i) => `<rect x="${96 + i * 104}" y="${base - b.v * unit}" width="64" height="${b.v * unit}" fill="${b.c}" class="${P}-bar" style="--d:${1.9 + i * .25}s"/>
      <text x="${128 + i * 104}" y="${base + 26}" text-anchor="middle" class="${P}-axis">${b.rev}</text>
      <text x="${128 + i * 104}" y="${base + 50}" text-anchor="middle" class="${P}-axis ${P}-axis-v">${b.verdict}</text>`).join('')}
    <text x="18" y="130" transform="rotate(-90 18 130)" text-anchor="middle" class="${P}-axis">how useful (my rating)</text>
  </svg>`;
};

export function render(root: HTMLElement) {
  document.title = 'Kiln — Prompt or flop? A science project';
  const ex = examples[0];
  root.innerHTML = `
<a class="skip" href="#${P}-main">Skip to the project</a>
<div class="${P}">
  <header class="${P}-top">
    <a class="${P}-logo" href="#${P}-main">Kiln</a>
    <p class="${P}-banner" aria-hidden="true">Science fair</p>
    <a class="${P}-top-dl" href="#${P}-take">Get Kiln for Windows</a>
  </header>
  <main id="${P}-main" class="${P}-stage">
    <div class="${P}-board">
      <div class="${P}-panel ${P}-left"><div class="${P}-face">
        ${card(0, 'Question', `<p class="${P}-typed ${P}-q">Does this prompt I saved actually work on my code?</p><p class="${P}-hand ${P}-note-r">(I have saved a lot of prompts. I have tried none of them.)</p>`)}
        ${card(1, 'Hypothesis', `<p class="${P}-typed">If I run the saved prompt on my own repo right away, and read-only, I will know in a few minutes whether it is worth keeping. That beats “I’ll try it later”, which so far has meant never.</p>`)}
        ${card(2, 'Materials', `<ul class="${P}-materials">
          <li><b>Kiln</b>, the Windows desktop app (version 0.17.0)</li>
          <li><b>My repo</b>, a local project (or an isolated example)</li>
          <li><b>My existing Codex or Claude Code sign-in.</b> No API key, no extra bill. My plan’s usage limits still apply.</li>
          <li><b>One saved prompt</b>, from a YouTube talk</li>
          <li class="${P}-hand">snacks (optional)</li>
        </ul>`)}
        ${card(5, 'Further research', `<p class="${P}-typed ${P}-small">Kiln also keeps one library for prompts, skills and custom agents, instead of skill folders scattered across <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and every project. It shows every installed copy, including ones edited outside Kiln, and edits CLAUDE.md, AGENTS.md and config.toml in place with 30 backups. Each skill’s description sits in the agent’s context every turn, so I removed the ones I don’t use.</p>`)}
      </div><div class="${P}-back" aria-hidden="true"></div></div>

      <div class="${P}-panel ${P}-center"><div class="${P}-face">
        <div class="${P}-title-wrap">
          <h1 class="${P}-title" aria-label="Prompt or flop?"><span aria-hidden="true"><span class="${P}-word">${title('PROMPT')}</span> <span class="${P}-word">${title('OR FLOP?')}</span></span></h1>
          <p class="${P}-byline">A science project about the prompts I saved and never tried. Tested with Kiln, which runs a saved prompt on your own repo so you can see if it works, learn why, and keep it as a skill.</p>
          <div class="${P}-pin-wrap">${rosette}</div>
        </div>
        ${card(3, 'Procedure', `<ol class="${P}-steps">
          <li>Save the prompt in Kiln. <span class="${P}-kbd">Ctrl+N</span> in the app, or <span class="${P}-kbd">Ctrl+Shift+Space</span> from anywhere.</li>
          <li>Pick a local repository to test on.</li>
          <li>Choose Codex or Claude Code and run that exact prompt revision. Kiln explains what gets sent first.</li>
          <li>Watch it live: messages, reasoning summaries, commands, web searches, model, reasoning effort, time and tokens.</li>
          <li>Experiments are <b>read-only</b>, so nothing in my code changes. (Control variable!)</li>
          <li>Read the agent’s verdict: pass, fail or uncertain. Then decide for myself.</li>
          <li>Change one thing in the prompt. Run it again on the same repo. Compare.</li>
        </ol>`, `${P}-wide`)}
        ${card(4, 'Results', `<div class="${P}-results">
          <figure class="${P}-fig">${graph()}<figcaption class="${P}-hand ${P}-note-r">Illustrative, not measured. The ratings are mine.</figcaption></figure>
          <div class="${P}-log">
            <p class="${P}-log-h">Revision 3, Claude Code, read-only</p>
            <pre>&gt; rg -n "signup|parent" src/screens
&gt; open src/screens/Activities.tsx
  3 icon buttons, no text labels
verdict: PASS
  first obstacle: can't tell which
  icon starts a game. fix: add a
  word under each icon.
tokens 41,862 in / 28,114 cached
       1,905 out        (sample)</pre>
          </div>
        </div>
        <p class="${P}-typed ${P}-small">The agent’s assessment is saved against the revision, separate from my judgement. Revision 1 came back <b>uncertain</b> instead of pretending: it needed to get past the signup screen.</p>`, `${P}-wide`)}
      </div></div>

      <div class="${P}-panel ${P}-right"><div class="${P}-face">
        ${card(5, 'Conclusion', `<p class="${P}-typed">Yes, revision 3 works. I <b>approved</b> it, which pins that exact revision and publishes it to my own Kiln repository on GitHub. Then I <b>installed</b> it as a skill for Claude Code. A new session picked it up. If I edit it, I get a new draft; the approved one stays put.</p>`)}
        ${card(0, 'What I learned about prompting', `<ul class="${P}-lined">
          <li>Say who the user is: “as a seven-year-old”.</li>
          <li>Give it a way past the wall: “skip the parent-only signup”.</li>
          <li>Tell it where to stop: “describe that <u>first</u> obstacle”.</li>
          <li>Say “make no changes yet”.</li>
          <li>Change one thing per run, then read the diff.</li>
        </ul><p class="${P}-hand ${P}-note-g">the final prompt:</p><blockquote class="${P}-typed ${P}-quote">${ex.prompt}</blockquote>`, `${P}-lined-card`)}
        ${card(3, 'Bibliography', `<ol class="${P}-bib">
          <li>The YouTube talk where the seven-year-old idea came from. Distilled with Kiln: I pasted the link and pressed “Distill video”, and the captions became prompts, techniques and insights, each with a timestamped link back. The transcript stays attached.</li>
          <li>Screenshots and posts, pasted in with <span class="${P}-kbd">Ctrl+Shift+Space</span> and saved with “Save only”, which does not call a model.</li>
        </ol>`)}
      </div><div class="${P}-back" aria-hidden="true"></div></div>
    </div>

    <div class="${P}-table">
      <section class="${P}-flyer" id="${P}-take" aria-labelledby="${P}-take-h">
        <h2 id="${P}-take-h">Try this experiment at home</h2>
        <p>Kiln 0.17.0 for Windows, with a CLI. MIT licensed.</p>
        <a class="${P}-dl" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p class="${P}-fine">The release is in a private GitHub repository, so sign in with an account that has access. The build is unsigned; Windows may ask you to confirm.</p>
        <div class="${P}-tabs" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<span style="--r:${tilt(i) * 1.5}deg" ${i === 3 ? `class="${P}-torn"` : ''}>Kiln for Windows</span>`).join('')}</div>
      </section>
      <aside class="${P}-index" aria-label="Safety note">
        <p class="${P}-hand">Safety note for judges:</p>
        <p>No API key was used. Kiln works through the Codex or Claude Code already signed in, on a ChatGPT or Claude subscription. Editing, approving and installing never call a model. Kiln never runs hooks.</p>
      </aside>
    </div>
  </main>
</div>`;
  // Once a panel has unfolded, drop the animation so the resting hinge angle is a plain transform.
  root.querySelectorAll<HTMLElement>(`.${P}-panel`).forEach(panel => panel.addEventListener('animationend', () => panel.classList.add('is-open')));
}
