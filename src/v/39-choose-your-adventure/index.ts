// PROTOTYPE variant 36 — Choose your adventure. A 1980s pick-your-path paperback: bookmark the prompt and loop, or test it now and reach the good ending.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Choice = { text: string; to: number | 'back' };
type Page = { n: number; body: string[]; figure?: string; choices: Choice[]; end?: 'bad' | 'good' };

const seven = examples[0];

const figures = {
  post: `<figure class="v36-fig v36-fig-post" aria-label="The post you saw on X">
    <div class="v36-post-head"><span class="v36-avatar" aria-hidden="true"></span><span><strong>someone who ships</strong><small>11:40 PM</small></span></div>
    <p>${seven.prompt}</p>
    <figcaption>The prompt, as you first saw it.</figcaption>
  </figure>`,
  calendar: `<figure class="v36-fig v36-fig-cal" aria-label="A calendar, three months later">
    <svg viewBox="0 0 220 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round">
      <path d="M22 26h70v78H22zM76 18h70v78H76z" fill="#f5ecd3"/><path d="M130 10h70v78h-70z" fill="#f5ecd3"/>
      <path d="M130 30h70M22 44h70M76 36h70" /><path d="M140 4v12M190 4v12M86 12v12M136 12v0" stroke-linecap="round"/></g>
      <g font-family="'P Spectral', serif" font-weight="800" fill="currentColor" text-anchor="middle"><text x="57" y="80" font-size="26">MAR</text><text x="111" y="72" font-size="26">APR</text><text x="165" y="64" font-size="26">JUN</text></g>
      <path d="M40 60l30 30M70 60 40 90M94 52l30 30M124 52 94 82" stroke="#b3302a" stroke-width="3" stroke-linecap="round"/></svg>
    <figcaption>It is three months later.</figcaption>
  </figure>`,
  capture: `<figure class="v36-fig v36-fig-ui" aria-label="The capture dialog in Kiln">
    <div class="v36-ui-bar"><span>New capture</span><kbd>Ctrl+N</kbd></div>
    <p class="v36-ui-paste">Pasted: post from X, 1 image</p>
    <div class="v36-ui-actions"><span>Save only</span><span class="is-main">Analyze and add</span></div>
    <figcaption>Save only never calls a model. Analyze and add does.</figcaption>
  </figure>`,
  run: `<figure class="v36-fig v36-fig-log" aria-label="A live run, sample">
    <ol>
      <li><b>message</b> Reading the router and the signup flow.</li>
      <li><b>reasoning</b> The first screen asks for a parent account.</li>
      <li><b>command</b> <code>rg "onboarding" src/</code></li>
      <li><b>message</b> Tracing what a child would tap first.</li>
    </ol>
    <dl><div><dt>Model</dt><dd>your default</dd></div><div><dt>Effort</dt><dd>medium</dd></div><div><dt>Elapsed</dt><dd>1:52</dd></div><div><dt>Tokens</dt><dd>in, cached, out</dd></div></dl>
    <figcaption>Sample run. Everything it does, as it does it.</figcaption>
  </figure>`,
  verdict: `<figure class="v36-fig v36-fig-verdict" aria-label="Three possible verdicts, uncertain circled">
    <span>pass</span><span>fail</span><span class="is-on">uncertain</span>
    <figcaption>The agent’s assessment. Yours comes separately.</figcaption>
  </figure>`,
  diff: `<figure class="v36-fig v36-fig-diff" aria-label="Revision 1 compared with revision 2">
    <p class="v36-diff-head">Revision 1 → revision 2</p>
    <p>  Describe that first obstacle and suggest a fix.</p>
    <p class="is-add">+ Start from the home screen and name the exact</p>
    <p class="is-add">+ button you would press.</p>
    <p>  Make no changes yet.</p>
    <figcaption>Same repo. One sentence different.</figcaption>
  </figure>`,
  receipt: `<figure class="v36-fig v36-fig-receipt" aria-label="Install receipt, sample">
    <p><span>Skill</span><b>try-it-as-a-child</b></p>
    <p><span>Revision</span><b>2, approved</b></p>
    <p><span>Installed to</span><b>~/.claude/skills</b></p>
    <figcaption>Sample install receipt.</figcaption>
  </figure>`,
  copies: `<figure class="v36-fig v36-fig-copies" aria-label="Where copies of a skill live, sample">
    <table><tbody>
      <tr><th>~/.claude/skills</th><td>installed</td></tr>
      <tr><th>~/.agents/skills</th><td>identical copy found</td></tr>
      <tr><th>game/.github/skills</th><td class="is-warn">edited outside Kiln</td></tr>
      <tr><th>old-app/.codex/skills</th><td>differs</td></tr>
    </tbody></table>
    <figcaption>Sample. One skill, four copies, one drifted.</figcaption>
  </figure>`,
};

const pages: Page[] = [
  { n: 1, figure: figures.post, body: [
    'It is twenty to midnight and you are scrolling X when you see it: a prompt that makes an agent use your app the way a seven-year-old would, then report the first thing that confuses it.',
    'It is brilliant. It is exactly what your project needs. You have a stand-up at nine.',
  ], choices: [{ text: 'If you bookmark it for later, turn to 12.', to: 12 }, { text: 'If you test it now, turn to 40.', to: 40 }] },
  { n: 12, body: [
    'You bookmark it. A small ribbon fills in. It feels a lot like progress.',
    'The prompt joins the others: the thread about agent memory, the video called “the only workflow you need”, the screenshot of a stranger’s CLAUDE.md. Together they form a pile you will definitely read one day.',
  ], choices: [{ text: 'If you close the laptop and go to bed, turn to 19.', to: 19 }, { text: 'If you bookmark three more things while you’re here, turn to 23.', to: 23 }] },
  { n: 19, figure: figures.calendar, body: [
    'It is three months later.',
    'You are in the shower when you remember the prompt. Something about a child? Or a game? You search your bookmarks for “seven” and find a bread recipe.',
  ], choices: [{ text: 'If you keep scrolling until you find it, turn to 27.', to: 27 }, { text: 'If you give up and rewrite it from memory, turn to 31.', to: 31 }] },
  { n: 23, body: [
    'You bookmark a prompt for writing better commit messages, a thread arguing with that prompt, and a reply that says “this, but for tests.”',
    'You feel extremely prepared. It is quarter past one.',
  ], choices: [{ text: 'Turn to 19.', to: 19 }] },
  { n: 27, body: [
    'Forty minutes later you find it, wedged between a keyboard review and a post you no longer agree with.',
    'It is still brilliant. Your sprint ends tomorrow. It is, once again, a bad time.',
  ], choices: [{ text: 'If you bookmark it again, so you’ll really see it next time, turn to 12.', to: 12 }, { text: 'If you test it right now, turn to 40.', to: 40 }] },
  { n: 31, end: 'bad', body: [
    'Your version from memory is worse. You run it once, in a chat, and close the tab. You never find out whether the original would have worked.',
    'Meanwhile, the skills you installed in March are still there in four different folders, their descriptions sitting in your agent’s context on every turn, whether or not they ever fire.',
  ], choices: [{ text: 'Start again at page 1.', to: 1 }, { text: 'Pretend you never read this and turn to 40.', to: 40 }] },
  { n: 40, figure: figures.capture, body: [
    'You open Kiln on your Windows machine, press Ctrl+N and paste the post. You could have dropped the screenshot in instead, or used the tray icon.',
    'Two buttons wait. Save only keeps it without calling a model. Analyze and add turns the post into a prompt, plus any techniques, tools and insights it holds, in a collection linked back to where it came from.',
  ], choices: [{ text: 'If you press Analyze and add, turn to 44.', to: 44 }, { text: 'If the idea was really buried in an hour-long YouTube video, turn to 42.', to: 42 }] },
  { n: 42, body: [
    'You paste the link and press Distill video. Kiln reads the captions and turns the talk into a collection of reusable entries, each with a timestamped link back to the moment it came from.',
    'The transcript stays attached, so the prompt keeps its explanation. You won’t need to rewatch the whole hour to remember why it mattered.',
  ], choices: [{ text: 'Turn to 44.', to: 44 }] },
  { n: 44, body: [
    'The prompt sits in its collection as revision 1. You press Run and pick a repository: your actual game project, not a toy. (An isolated example is there if you’d rather start small.)',
    'Before anything is sent, a consent notice tells you what goes to the agent. Experiments are read-only. Nothing in your code will change.',
  ], choices: [{ text: 'If you run it through Claude Code, turn to 47.', to: 47 }, { text: 'If you run it through Codex, turn to 47.', to: 47 }] },
  { n: 47, figure: figures.run, body: [
    'Both roads lead here. Kiln uses whichever agent you are already signed into, on the ChatGPT or Claude subscription you already pay for. There is no API key and no extra API bill, though your plan’s usage limits still apply.',
    'You watch it live: messages, reasoning summaries, commands, searches, the model, the reasoning effort, the elapsed time and the token counts.',
  ], choices: [{ text: 'If you let it finish, turn to 52.', to: 52 }, { text: 'If you tell it to fix whatever it finds, turn to 49.', to: 49 }] },
  { n: 49, body: [
    'You type “and fix it.” The agent reads your code, but it cannot change it: experiments are read-only.',
    'Instead of pretending, it reports that the task needs edits and marks the result uncertain. Your working tree is exactly as you left it. You are almost disappointed.',
  ], choices: [{ text: 'Turn to 52.', to: 52 }] },
  { n: 52, figure: figures.verdict, body: [
    'The run ends. Kiln saves the output against revision 1, with the agent’s own verdict: pass, fail or uncertain.',
    'Tonight it says uncertain. It found the parent-only signup, but it couldn’t tell which activity a child would open first. That is the agent’s view. What you keep is up to you.',
  ], choices: [{ text: 'If you edit the prompt and run it again, turn to 55.', to: 55 }, { text: 'If you think it’s already good enough, turn to 61.', to: 61 }] },
  { n: 55, figure: figures.diff, body: [
    'You add one sentence, and that makes revision 2. The approved and earlier versions stay exactly as they were.',
    'You run it again on the same repo, so the only thing that changed is your wording. Up to two runs can go at once if you want them side by side.',
  ], choices: [{ text: 'Turn to 58.', to: 58 }] },
  { n: 58, body: [
    'Revision 2 names the button: a grey icon with no label, next to a brighter one that looks more fun. The agent marks it pass. You read both outputs and agree.',
    'You can see what the extra sentence did. That is a thing about prompting no thread would have taught you, because you learned it on your own code.',
  ], choices: [{ text: 'If you want this check every time you ship, turn to 61.', to: 61 }] },
  { n: 61, body: [
    'You press Create skill. Kiln drafts a SKILL.md from the prompt using its bundled writing-for-agents guidance: a description that triggers when it should, and instructions short enough to earn their place in the context.',
    'The draft links back to the post, the runs and the revision it grew from.',
  ], choices: [{ text: 'Turn to 66.', to: 66 }] },
  { n: 66, body: [
    'You read the draft and approve it. Nothing is approved for you. Approval pins this exact revision and publishes that snapshot to your own Kiln repository on GitHub.',
    'If you edit it tomorrow you get a new draft. The approved one stays exactly as you reviewed it.',
  ], choices: [{ text: 'If you install it, turn to 70.', to: 70 }] },
  { n: 70, end: 'good', figure: figures.receipt, body: [
    'You install it into Claude Code. It could just as well go to Codex or Copilot locations. Install always uses the approved content, and a receipt records the revision and where it went.',
    'You open a new agent session and it picks the skill up. Next release you type one line instead of hunting for a post from March.',
  ], choices: [{ text: 'If you want to see where every copy of every skill lives, turn to 73.', to: 73 }, { text: 'Start again at page 1.', to: 1 }] },
  { n: 73, figure: figures.copies, body: [
    'Kiln shows every installed copy of a skill across your personal folders and enrolled projects: installed, identical, differs, linked, or edited outside Kiln. You compare a drifted copy file by file, and remove the ones you don’t use in bulk.',
    'On another machine you open your repo and press Install everything marked for this machine.',
  ], choices: [{ text: 'Turn to the back cover.', to: 'back' }] },
];

const byNumber = new Map(pages.map(page => [page.n, page]));
const endings = pages.filter(page => page.end).map(page => page.n);

const coverArt = `
<svg class="v36-art" viewBox="0 0 360 300" role="img" aria-label="Cover painting: you stand at a fork in a dusk path holding a glowing phone. A signpost points left to a cave full of bookmarks with eyes glowing in the dark, and right, up a hill, to a kiln with a blazing door.">
  <defs>
    <linearGradient id="v36-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1840"/><stop offset=".45" stop-color="#9a2d55"/><stop offset=".75" stop-color="#ee7b35"/><stop offset="1" stop-color="#ffc55a"/></linearGradient>
    <radialGradient id="v36-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3b0"/><stop offset=".4" stop-color="#ffc64d" stop-opacity=".8"/><stop offset="1" stop-color="#ff8a2b" stop-opacity="0"/></radialGradient>
    <radialGradient id="v36-phone" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d8fbff"/><stop offset="1" stop-color="#6fe3ff" stop-opacity="0"/></radialGradient>
    <pattern id="v36-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="#1b0d1f"/></pattern>
    <clipPath id="v36-frame"><rect width="360" height="300"/></clipPath>
  </defs>
  <g clip-path="url(#v36-frame)">
    <rect width="360" height="300" fill="url(#v36-sky)"/>
    <rect width="360" height="150" fill="url(#v36-dots)" opacity=".18"/>
    <g fill="#fff6d8"><circle cx="40" cy="30" r="1.4"/><circle cx="96" cy="18" r="1"/><circle cx="150" cy="40" r="1.3"/><circle cx="212" cy="14" r="1"/><circle cx="330" cy="26" r="1.5"/><circle cx="18" cy="70" r="1"/></g>
    <g class="v36-rays" fill="#ffe08a" opacity=".32">
      ${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const b = a + .12; return `<polygon points="272,150 ${272 + Math.cos(a) * 420},${150 + Math.sin(a) * 420} ${272 + Math.cos(b) * 420},${150 + Math.sin(b) * 420}"/>`; }).join('')}
    </g>
    <path d="M0 196 40 150l30 22 52-58 42 50 38-30 44 44 38-50 38 34 38-24v80H0z" fill="#58234f"/>
    <path d="M0 214 60 186l50 16 60-26 50 20 60-18 50 14 30-6v40H0z" fill="#3c1840"/>
    <circle cx="272" cy="152" r="70" fill="url(#v36-glow)"/>
    <path d="M168 300c20-90 90-150 192-156v156z" fill="#2a1233" stroke="#1b0d1f" stroke-width="2"/>
    <g stroke="#1b0d1f" stroke-width="2.2" stroke-linejoin="round">
      <rect x="291" y="96" width="11" height="34" fill="#6d2f2a"/>
      <path d="M238 172c0-34 14-52 34-52s34 18 34 52z" fill="#8c3d2e"/>
      <path d="M244 150h56M240 162h64M250 138h44M262 128h22" fill="none" stroke-width="1.2" opacity=".6"/>
      <path d="M260 172c0-16 5-24 12-24s12 8 12 24z" fill="#ffd45a"/>
    </g>
    <path class="v36-smoke" d="M296 94c-10-10 8-16-2-26s6-18-2-26" fill="none" stroke="#e7c7d9" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    <path d="M0 150c52-6 98 20 128 70l24 80H0z" fill="#2a1233" stroke="#1b0d1f" stroke-width="2"/>
    <path d="M14 300c0-58 20-86 50-88 32 2 52 30 54 88z" fill="#0e0612"/>
    <path d="M30 222l6 16 6-18 7 14 6-20 7 18 6-16 8 14 6-10" fill="none" stroke="#2a1233" stroke-width="5" stroke-linejoin="round"/>
    <g stroke="#1b0d1f" stroke-width="1.2">
      <path d="M30 288h16v-12l-8 5-8-5z" fill="#d23a33" transform="rotate(-18 38 282)"/>
      <path d="M56 294h16v-14l-8 5-8-5z" fill="#3c7bd0" transform="rotate(12 64 287)"/>
      <path d="M78 286h14v-12l-7 5-7-5z" fill="#f2b632" transform="rotate(-6 85 280)"/>
      <path d="M44 272h14v-12l-7 5-7-5z" fill="#e8e0c8" transform="rotate(24 51 266)"/>
      <path d="M92 296h14v-12l-7 5-7-5z" fill="#d23a33" transform="rotate(30 99 290)"/>
      <path d="M62 266h13v-11l-6.5 4-6.5-4z" fill="#3c7bd0" transform="rotate(-30 68 260)"/>
    </g>
    <g class="v36-eyes" fill="#ffe36b"><ellipse cx="46" cy="246" rx="3" ry="2"/><ellipse cx="56" cy="246" rx="3" ry="2"/><ellipse cx="84" cy="256" rx="2.4" ry="1.6"/><ellipse cx="92" cy="256" rx="2.4" ry="1.6"/></g>
    <path d="M0 300v-26c80-16 200-20 360-10v36z" fill="#1b0d1f"/>
    <path d="M150 300c6-22 14-34 30-44-30 2-60 6-86 4 22 4 40 8 56 40zM196 300c4-24 10-40 24-50 16-14 26-26 34-44-2 22-8 34-18 48-12 16-20 26-22 46z" fill="#e39a55" opacity=".9"/>
    <g stroke="#1b0d1f" stroke-width="2.2" stroke-linejoin="round">
      <rect x="236" y="214" width="6" height="86" fill="#6b3b26"/>
      <path d="M244 220h58l12 10-12 10h-58z" fill="#f3e2b6"/>
      <path d="M234 244h-58l-12 10 12 10h58z" fill="#f3e2b6"/>
    </g>
    <g font-family="'P Bowlby One', sans-serif" font-size="11" fill="#1b0d1f" text-anchor="middle"><text x="276" y="234">TEST IT</text><text x="202" y="258">LATER</text></g>
    <g stroke="#1b0d1f" stroke-width="2.2" stroke-linejoin="round" transform="translate(-50 0)">
      <circle cx="190" cy="206" r="30" fill="url(#v36-phone)" stroke="none"/>
      <path d="M160 300c0-30 4-52 12-62 6-8 26-8 32 0 8 10 12 32 12 62z" fill="#27406d"/>
      <path d="M172 238c-6-14-2-30 16-30s22 16 16 30c-6 4-26 4-32 0z" fill="#324f86"/>
      <path d="M204 244c8-6 10-20 0-34" fill="none" stroke-width="7" stroke="#27406d" stroke-linecap="round"/>
      <path d="M204 244c8-6 10-20 0-34" fill="none" stroke-width="2.2"/>
      <rect x="194" y="198" width="12" height="18" rx="2" fill="#bff6ff" transform="rotate(12 200 207)"/>
      <path d="M186 300v-30M190 300v-30" fill="none" stroke-width="1.2" opacity=".5"/>
    </g>
  </g>
  <rect width="360" height="300" fill="none" stroke="#1b0d1f" stroke-width="4"/>
</svg>`;

const renderPage = (page: Page, linear = false) => `
<article class="v36-page${page.end ? ` is-end-${page.end}` : ''}" data-page="${page.n}" ${linear ? `id="v36-p${page.n}"` : ''} aria-labelledby="v36-h${page.n}${linear ? '-l' : ''}">
  <h3 class="v36-num" id="v36-h${page.n}${linear ? '-l' : ''}" tabindex="-1"><span class="visually-hidden">Page </span>${page.n}</h3>
  <div class="v36-text">
    ${page.body.map((paragraph, i) => `<p${i === 0 ? ' class="v36-first"' : ''}>${paragraph}</p>`).join('')}
    ${page.figure ?? ''}
  </div>
  ${page.end ? `<p class="v36-the-end">The End</p>` : ''}
  <div class="v36-choices">${page.choices.map(choice => `<button type="button" class="v36-choice" data-to="${choice.to}"><span class="v36-hand" aria-hidden="true">☞</span><span>${choice.text.replace(/(turn to (?:page )?(\d+|the back cover)\.)$/i, '<b>$1</b>')}</span></button>`).join('')}</div>
  <p class="v36-folio">The Prompt That Got Away</p>
</article>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — The Prompt That Got Away';
  root.innerHTML = `
<div class="v36">
  <header class="v36-top">
    <a class="v36-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v36-book">Open the book</a><a href="#v36-book" data-mode-link="linear">Read it straight through</a><a href="#v36-back">Download</a></nav>
  </header>
  <main id="main">
    <section class="v36-hero" aria-labelledby="v36-title">
      <div class="v36-cover" role="group" aria-label="Book cover">
        <div class="v36-cover-frame">
          <div class="v36-series"><span class="v36-series-name">Pick Your Path</span><span class="v36-series-no" aria-label="Number 17">No.<b>17</b></span></div>
          <h1 id="v36-title" class="v36-cover-title">The Prompt That Got Away</h1>
          ${coverArt}
          <p class="v36-cover-strap">You’re the developer! Choose from 2 possible endings.</p>
          <p class="v36-cover-feat">Featuring Kiln for Windows, with Codex and Claude Code</p>
        </div>
      </div>
      <div class="v36-hook">
        <p class="v36-hook-line">You see a brilliant prompt on X.</p>
        <div class="v36-hook-choices">
          <button type="button" class="v36-choice v36-choice-big" data-start="12"><span class="v36-hand" aria-hidden="true">☞</span><span>If you bookmark it, <b>turn to 12.</b></span></button>
          <button type="button" class="v36-choice v36-choice-big" data-start="40"><span class="v36-hand" aria-hidden="true">☞</span><span>If you test it now, <b>turn to 40.</b></span></button>
        </div>
        <p class="v36-hook-note">Kiln is a Windows desktop app for developers who use Codex or Claude Code. It turns the prompts you save into read-only test runs on your own repo, and the ones that work into skills you approve and install.</p>
      </div>
    </section>

    <aside class="v36-warning" aria-labelledby="v36-warn-title">
      <h2 id="v36-warn-title">Warning!</h2>
      <p>Do not read this book straight through from beginning to end. It contains many adventures you may have with a good prompt, and most of them end with it in a bookmarks folder. From time to time you will be asked to make a choice. Your choice decides whether the prompt ever runs.</p>
      <p>In a hurry? <button type="button" class="v36-link" data-mode-link="linear">Read the whole book in order</button> instead.</p>
    </aside>

    <section class="v36-book" id="v36-book" aria-labelledby="v36-book-title">
      <h2 class="visually-hidden" id="v36-book-title">The book</h2>
      <div class="v36-modes" role="group" aria-label="How to read">
        <button type="button" data-mode="adventure" aria-pressed="true">Choose your path</button>
        <button type="button" data-mode="linear" aria-pressed="false">Read the whole book</button>
      </div>
      <div class="v36-desk">
        <aside class="v36-card" aria-labelledby="v36-card-title">
          <div class="v36-card-head"><h3 id="v36-card-title">Pages visited</h3><p class="v36-card-count" aria-live="polite"></p></div>
          <ol class="v36-trail"></ol>
          <p class="v36-endings"></p>
          <button type="button" class="v36-restart">Start over at page 1</button>
        </aside>
        <div class="v36-stage" aria-live="polite"></div>
        <div class="v36-linear" hidden></div>
      </div>
    </section>

    <section class="v36-back" id="v36-back" aria-labelledby="v36-back-title">
      <div class="v36-back-frame">
        <div class="v36-back-copy">
        <h2 id="v36-back-title">Make sure it doesn’t get away.</h2>
        <p class="v36-back-blurb">You have saved more good prompts than you have ever run. Kiln gives each one a place to live, a read-only run on your own repository, a verdict you can argue with, and a way to become a skill once it proves itself. It keeps one library of what you have, shows every copy you have installed, and uses the Codex or Claude Code you are already signed into.</p>
        </div>
        <div class="v36-series-list">
          <h3>Also in the Pick Your Path series</h3>
          <ol>
            <li><b>No. 4</b> The Bookmark That Ate Tuesday</li>
            <li><b>No. 9</b> Curse of the Duplicate Skill</li>
            <li><b>No. 11</b> Who Edited ~/.claude/skills?</li>
            <li><b>No. 15</b> Lost in the Hour-Long Video</li>
          </ol>
          <p>Not real books. Real situations.</p>
        </div>
        <div class="v36-back-row">
          <div class="v36-back-cta">
            <a class="v36-download" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
            <p class="v36-back-note">${releaseNote}</p>
          </div>
          <div class="v36-price">
            <p class="v36-price-tag">No extra API bill<sup>*</sup></p>
            <p class="v36-barcode" aria-hidden="true">KILN0170</p>
            <p class="v36-fine">* Uses your ChatGPT or Claude subscription through the signed-in Codex or Claude Code app. Your subscription’s usage limits still apply. Includes an MIT-licensed CLI. Builds are unsigned, so Windows may ask before running the installer.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>`;

  const stage = root.querySelector<HTMLElement>('.v36-stage')!;
  const linear = root.querySelector<HTMLElement>('.v36-linear')!;
  const trail = root.querySelector<HTMLElement>('.v36-trail')!;
  const count = root.querySelector<HTMLElement>('.v36-card-count')!;
  const endingsLine = root.querySelector<HTMLElement>('.v36-endings')!;
  const book = root.querySelector<HTMLElement>('#v36-book')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 1;
  let busy = false;
  const path: number[] = [1];
  const visited = new Set<number>([1]);

  linear.innerHTML = pages.map(page => renderPage(page, true)).join('');

  const updateCard = () => {
    const shown = path.length > 24 ? path.slice(-23) : path;
    trail.innerHTML = (path.length > 24 ? '<li class="is-more">…</li>' : '') + shown.map((n, i) => `<li class="${i === shown.length - 1 ? 'is-now' : ''}" style="--tilt:${((n * 37) % 7) - 3}deg"><span>p.</span>${n}</li>`).join('');
    trail.scrollLeft = trail.scrollWidth;
    count.textContent = `${visited.size} of ${pages.length} pages read`;
    const found = endings.filter(n => visited.has(n)).length;
    endingsLine.textContent = `Endings found: ${found} of ${endings.length}`;
  };

  const place = (n: number) => { stage.innerHTML = renderPage(byNumber.get(n)!); };

  const go = (n: number, focus = true) => {
    if (busy || n === current) return;
    const old = stage.querySelector<HTMLElement>('.v36-page');
    const forward = n > current;
    current = n;
    path.push(n);
    visited.add(n);
    updateCard();
    const next = document.createElement('div');
    next.innerHTML = renderPage(byNumber.get(n)!);
    const fresh = next.firstElementChild as HTMLElement;
    const finish = () => {
      stage.querySelectorAll('.v36-page').forEach(page => { if (page !== fresh) page.remove(); });
      fresh.classList.remove('is-arriving');
      stage.classList.remove('is-turning');
      busy = false;
      if (focus) fresh.querySelector<HTMLElement>('.v36-num')?.focus({ preventScroll: true });
      const top = stage.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * .6) stage.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    };
    if (!old || reduced.matches) { stage.replaceChildren(fresh); finish(); return; }
    busy = true;
    stage.classList.add('is-turning');
    if (forward) {
      old.classList.add('is-leaving');
      stage.insertBefore(fresh, old);
      old.addEventListener('animationend', finish, { once: true });
    } else {
      old.classList.add('is-under');
      fresh.classList.add('is-arriving');
      stage.appendChild(fresh);
      fresh.addEventListener('animationend', finish, { once: true });
    }
  };

  const setMode = (mode: 'adventure' | 'linear') => {
    root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    stage.hidden = mode === 'linear';
    linear.hidden = mode !== 'linear';
    book.classList.toggle('is-linear', mode === 'linear');
  };

  root.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const choice = target.closest<HTMLButtonElement>('.v36-choice[data-to]');
    if (choice) {
      const to = choice.dataset.to!;
      if (to === 'back') { root.querySelector('#v36-back')!.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' }); return; }
      if (!linear.hidden) { root.querySelector<HTMLElement>(`#v36-p${to}`)?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' }); root.querySelector<HTMLElement>(`#v36-h${to}-l`)?.focus({ preventScroll: true }); return; }
      go(Number(to));
      return;
    }
    const start = target.closest<HTMLButtonElement>('[data-start]');
    if (start) {
      setMode('adventure');
      book.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => go(Number(start.dataset.start)), reduced.matches ? 0 : 550);
      return;
    }
    const mode = target.closest<HTMLElement>('[data-mode], [data-mode-link]');
    if (mode) {
      const value = (mode.dataset.mode ?? mode.dataset.modeLink) as 'adventure' | 'linear';
      setMode(value);
      if (mode.dataset.modeLink) { event.preventDefault(); book.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' }); }
      return;
    }
    if (target.closest('.v36-restart')) {
      path.length = 0; visited.clear(); current = 0; setMode('adventure'); busy = false; go(1);
    }
  });

  place(1);
  updateCard();
}
