// PROTOTYPE variant 01 — Phosphor terminal. An amber CRT plays a sample session: capture a post, test it read-only on ./my-game, then the reader picks the next command.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

const playtest = examples[2];
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ps = (path = '~/my-game') => `<span class="v01-ps">${path} $</span>`;

type Step =
  | { kind: 'cmd'; text: string; path?: string }
  | { kind: 'line'; html: string; wait?: number }
  | { kind: 'status'; time: string; input: number; output: number };

const act = (time: string, type: string, text: string) => `<div class="v01-act"><span class="v01-t">${time}</span><span class="v01-k v01-k-${type}">${type}</span><span class="v01-x">${text}</span></div>`;
const kv = (key: string, value: string) => `<div class="v01-kv"><span>${key}</span><span>${value}</span></div>`;
const verdict = (pick: 'pass' | 'fail' | 'uncertain') => `<div class="v01-verdict" role="img" aria-label="Agent's assessment: ${pick}">${(['pass', 'fail', 'uncertain'] as const).map(v => `<span class="${v === pick ? 'is-on' : ''}">${v}</span>`).join('')}</div>`;

const session: Step[] = [
  { kind: 'cmd', text: 'kiln capture https://x.com/…/status/1838…' },
  { kind: 'line', html: '<div class="v01-o v01-lead"><span>fetching post from X</span><span>ok</span></div>', wait: 380 },
  { kind: 'line', html: '<div class="v01-o">saved as a source note in <b>Inbox</b></div>' },
  { kind: 'line', html: '<div class="v01-o">analyze and add: 1 prompt, 1 technique, 1 insight, linked to the post</div>', wait: 520 },
  { kind: 'line', html: `<div class="v01-o"><b>prompt</b>  “${playtest.title}”  rev 1 <span class="v01-dim">a1f3c9</span></div>` },
  { kind: 'line', html: `<blockquote class="v01-prompt">${esc(playtest.prompt)}</blockquote>`, wait: 700 },
  { kind: 'cmd', text: `kiln test "${playtest.title}" --repo ./my-game --agent codex` },
  { kind: 'line', html: kv('experiment', '<b class="v01-ro">read-only</b>  the agent can look at ./my-game, not change it'), wait: 300 },
  { kind: 'line', html: kv('revision', 'a1f3c9, the exact text you just saved') },
  { kind: 'line', html: kv('agent', 'Codex, signed in with your ChatGPT plan, reasoning effort medium'), wait: 500 },
  { kind: 'status', time: '00:03', input: 4120, output: 96 },
  { kind: 'line', html: act('00:03', 'message', 'Looking for the game loop and the player controller first.'), wait: 420 },
  { kind: 'line', html: act('00:06', 'command', 'rg --files src | rg -i "player|level|input"'), wait: 380 },
  { kind: 'status', time: '00:09', input: 11840, output: 212 },
  { kind: 'line', html: act('00:09', 'command', 'sed -n 1,160p src/player/controller.ts'), wait: 380 },
  { kind: 'line', html: act('00:15', 'reasoning', 'Jump only fires on the exact frame the player is grounded. Early presses are dropped.'), wait: 520 },
  { kind: 'status', time: '00:22', input: 26310, output: 640 },
  { kind: 'line', html: act('00:22', 'command', 'cat src/levels/level-2.json | head -80'), wait: 380 },
  { kind: 'line', html: act('00:31', 'reasoning', 'The key sprite shares a palette with the background tiles. Easy to walk past.'), wait: 520 },
  { kind: 'status', time: '00:48', input: 41200, output: 1480 },
  { kind: 'line', html: act('00:48', 'message', 'Wants to add a jump buffer to controller.ts. Read-only run, so it writes the fix down instead.'), wait: 560 },
  { kind: 'status', time: '01:52', input: 48210, output: 2377 },
  { kind: 'line', html: act('01:52', 'message', 'Done. Ten ranked improvements, nothing changed on disk.'), wait: 500 },
  { kind: 'line', html: `<ol class="v01-result">
    <li>Early jump presses are dropped. Add a 100 ms jump buffer in the controller.</li>
    <li>The level 2 key blends into the tiles. Give it a bob and a glint.</li>
    <li>Dying restarts the whole level, so one hard jump costs 40 seconds of replay.</li>
    <li class="v01-dim">… seven more, saved with the output</li></ol>`, wait: 600 },
  { kind: 'line', html: `<div class="v01-o">agent’s assessment</div>${verdict('pass')}`, wait: 300 },
  { kind: 'line', html: `<div class="v01-o">your judgement: <b>not recorded</b>. The agent graded its own homework; you decide what to keep.</div>` },
];

const sections: Record<string, { cmd: string; why: string; path?: string; html: string[] }> = {
  again: {
    cmd: 'kiln diff a1f3c9 b72e10 && kiln test --again',
    why: 'edit the prompt, see what changed',
    html: [
      `<h2 class="v01-h" tabindex="-1">Edit one sentence. Run it on the same repo.</h2>`,
      `<pre class="v01-diff" aria-label="Difference between revision a1f3c9 and b72e10"><span class="v01-dim">@@ Playtest for what kills the fun @@</span>
<del>- Rank the ten most impactful improvements, explain why each helps,</del>
<ins>+ Rank the five most impactful improvements. For each, name the file</ins>
<ins>+ and the moment in play it affects, and say how to check the fix.</ins></pre>`,
      act('00:04', 'command', 'rg -n "respawn|checkpoint" src'),
      act('01:37', 'message', 'Two fixes need the game running to confirm. A read-only run can’t play it.'),
      `<div class="v01-o">agent’s assessment</div>${verdict('uncertain')}`,
      `<p class="v01-p">Uncertain is a real answer. When a task needs edits or a tool the agent doesn’t have, Kiln saves it as uncertain instead of letting it pass on vibes. Every run keeps its output, model, reasoning effort, elapsed time and token usage against the revision it ran, so you can put two revisions side by side and see which sentence changed the result.</p>`,
      `<p class="v01-p">That is how you learn to prompt: by running the thing twice. When a prompt keeps earning its place, <b>Create skill</b> drafts a SKILL.md from it, using Kiln’s bundled writing-for-agents guidance, linked back to the post it came from. <b>Ask the agent</b> talks it through with the attachments and source in view.</p>`,
    ],
  },
  library: {
    cmd: 'kiln library',
    why: 'where the prompt went',
    html: [
      `<h2 class="v01-h" tabindex="-1">Everything you saved, in one library.</h2>`,
      `<pre class="v01-tree" aria-label="Sample library tree">library/
├── Inbox/                        3 captures, 1 video
├── Game design/
│   ├── prompt     Playtest for what kills the fun   <b>approved b72e10</b>
│   ├── prompt     Build a risk-first prototype plan
│   └── insight    Judge variety by player decisions
├── Agent workflows/
│   ├── prompt     Find the instruction that went wrong
│   ├── technique  Keep project memory specific
│   └── agent      reviewer.md   (Claude Code format)
└── Skills to refine/
    ├── skill      code-review   <span class="v01-warn">1 copy edited outside Kiln</span>
    └── skill      research</pre>`,
      `<p class="v01-p">Paste or drop text, links, screenshots and files, or hit <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> from anywhere. <b>Save only</b> keeps it without calling a model; <b>Analyze and add</b> turns it into prompts, insights, techniques, tools and resources in a collection linked to the source. Paste a YouTube link and press <b>Distill video</b>: the captions become entries with timestamped links, and the transcript stays attached.</p>`,
      `<p class="v01-p">Prompts, skills, custom agents for Codex, Claude Code and Copilot, and notes live together. Search, tags, favorites and filters by kind, status, provider, location or copy state narrow it down. Already have a skills folder? Import it as drafts. The originals stay where they are.</p>`,
    ],
  },
  installs: {
    cmd: 'kiln installs code-review',
    why: 'every copy of a skill',
    html: [
      `<h2 class="v01-h" tabindex="-1">Every copy, and which ones drifted.</h2>`,
      `<div class="v01-table" role="table" aria-label="Sample installed copies of code-review">
        <div role="row" class="v01-tr v01-th"><span role="columnheader">location</span><span role="columnheader">path</span><span role="columnheader">state</span></div>
        <div role="row" class="v01-tr"><span role="cell">Agents</span><span role="cell">~/.agents/skills/code-review</span><span role="cell">installed</span></div>
        <div role="row" class="v01-tr"><span role="cell">Claude Code</span><span role="cell">~/.claude/skills/code-review</span><span role="cell" class="v01-warn">edited outside Kiln</span></div>
        <div role="row" class="v01-tr"><span role="cell">Codex</span><span role="cell">~/my-game/.codex/skills/code-review</span><span role="cell">identical copy found</span></div>
        <div role="row" class="v01-tr"><span role="cell">Game project</span><span role="cell">~/my-game/.github/skills/code-review</span><span role="cell">linked</span></div>
      </div>`,
      `<p class="v01-p">Kiln shows each skill’s installed copies across your personal locations and enrolled projects: installed, identical, differs, linked, or edited outside Kiln. Compare a drifted copy file by file with the approved version. <b>Remove local copies</b> in bulk; managed copies are deleted, anything else goes to a private backup.</p>`,
      `<p class="v01-p">Why bother: every model-invoked skill’s description sits in your agent’s context on every turn, whether it fires or not. Forgotten duplicates cost tokens and attention. Kiln doesn’t meter tokens per skill; it shows you exactly what’s installed where, so you can keep what earns its place. Test runs do show their token usage.</p>`,
    ],
  },
  sync: {
    cmd: 'kiln skills sync',
    why: 'the same skills on your other machine',
    path: 'C:\\Users\\you',
    html: [
      `<h2 class="v01-h" tabindex="-1">Approve once. Install anywhere you sign in.</h2>`,
      `<div class="v01-log"><div class="v01-o"><span class="v01-dim">library</span>  github.com/you/my-kiln, up to date</div><div class="v01-o">installing 4 skills marked for this machine</div>${[
        ['code-review', '4d2e81', '~/.claude/skills/code-review'],
        ['playtest', 'b72e10', '~/.agents/skills/playtest'],
        ['research', '91c0aa', '~/.agents/skills/research'],
        ['writing-for-agents', '3e7f12', '~/.claude/skills/writing-for-agents'],
      ].map(([name, rev, dest]) => `<div class="v01-sync"><span>${name}</span><span>rev ${rev}</span><span>→ ${dest}</span></div>`).join('')}<div class="v01-o">wrote 4 install receipts with revision and destination</div></div>`,
      `<p class="v01-p">Approval pins an exact revision and publishes that snapshot to your own Kiln repository on GitHub. Editing makes a new draft and never touches the approved one, and installs always use approved content. Git status, sync and conflict resolution are built in. On another machine, open the repo and press <b>Install everything marked for this machine</b>, or run the line above.</p>`,
      `<p class="v01-p">While you’re there: CLAUDE.md, AGENTS.md, Codex config.toml, Claude and Copilot settings, MCP config and hooks open in one editor. Edits happen in place with syntax checks, 30 private backups, diff and restore. Kiln never runs your hooks.</p>`,
    ],
  },
  download: {
    cmd: 'kiln download --windows',
    why: 'get the app',
    html: [`<div class="v01-o">Kiln 0.17.0 for Windows <span class="v01-dim">(private release, needs a GitHub account with access)</span>. Opening the download below.</div>`],
  },
};
const order = ['again', 'library', 'installs', 'sync', 'download'];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Don’t bookmark it. Run it.';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
<div class="v01">
  <div class="v01-glass" aria-hidden="true"></div>
  <header class="v01-bar">
    <a class="v01-brand" href="?">KILN</a>
    <span class="v01-bar-mid">tty1 ~/my-game</span>
    <nav aria-label="Main navigation"><a href="#v01-session">session</a><a href="#v01-end">download</a></nav>
  </header>
  <main id="main" class="v01-screen">
    <section class="v01-hero" aria-labelledby="v01-title">
      <p class="v01-boot">KILN 0.17.0 for Windows. MIT licensed. Uses the Codex or Claude Code you already sign in to.</p>
      <h1 id="v01-title"><span class="v01-l">Don’t bookmark it.</span><span class="v01-l">Run it.<span class="v01-cursor" aria-hidden="true"></span></span></h1>
      <p class="v01-lede">You saved a prompt from X last week. It’s still sitting there. Kiln captures it and runs it on your own repo, read-only, so you get a verdict before you’d have found the bookmark again.</p>
      <div class="v01-hero-cta"><a class="v01-btn" href="#v01-end">${windowsMark}<span>Get the Windows app</span></a><button type="button" class="v01-skip">print the whole session</button></div>
    </section>

    <section class="v01-session" id="v01-session" aria-labelledby="v01-session-title">
      <h2 class="visually-hidden" id="v01-session-title">Sample session: capture a post, then test it on a game project</h2>
      <p class="v01-rule" aria-hidden="true">── sample session ─────────────────────────────────────────────────────────────────────────────</p>
      <div class="v01-log" id="v01-log"></div>
      <div class="v01-status" hidden><span>elapsed <b data-s="time">00:00</b></span><span>input <b data-s="in">0</b></span><span>cached <b data-s="cached">0</b></span><span>output <b data-s="out">0</b></span><span class="v01-dim">sample numbers</span></div>
      <div class="v01-more" id="v01-more"></div>
      <div class="v01-menu" id="v01-menu" hidden>
        <p class="v01-o">${ps()} <span class="v01-dim"># choose the next command</span></p>
        <div class="v01-opts" role="group" aria-label="Run the next command"></div>
      </div>
    </section>

    <footer class="v01-end" id="v01-end" aria-labelledby="v01-end-title">
      <p class="v01-o">${ps()} kiln download --windows</p>
      <h2 id="v01-end-title" tabindex="-1">Run the next thing you save.</h2>
      <div class="v01-dl"><a class="v01-btn v01-btn-big" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      <p class="v01-note">${releaseNote} Builds are unsigned, so Windows may ask before it runs the installer.</p></div>
      <dl class="v01-facts">
        <div><dt>needs</dt><dd>Windows, a signed-in Codex or Claude Code, and a GitHub account. Setup creates your library repo with the official gh CLI.</dd></div>
        <div><dt>costs</dt><dd>No API key and no extra API bill. Your ChatGPT or Claude plan’s usage limits still apply.</dd></div>
        <div><dt>scripts</dt><dd>A CLI with JSON results, so your agents can read the library too.</dd></div>
      </dl>
      <p class="v01-fine">The session on this page is a sample retelling. Captures and experiments run in the Kiln desktop app; the real CLI scripts the same library with commands like <code>kiln items list</code> and <code>kiln skills sync</code>. Numbers shown are examples.</p>
    </footer>
  </main>
</div>`;

  const log = root.querySelector<HTMLElement>('#v01-log')!;
  const more = root.querySelector<HTMLElement>('#v01-more')!;
  const menu = root.querySelector<HTMLElement>('#v01-menu')!;
  const opts = menu.querySelector<HTMLElement>('.v01-opts')!;
  const status = root.querySelector<HTMLElement>('.v01-status')!;
  const skip = root.querySelector<HTMLButtonElement>('.v01-skip')!;
  let fast = reduce;
  let busy = false;
  const done = new Set<string>();
  const wait = (ms: number) => fast ? Promise.resolve() : new Promise<void>(resolve => setTimeout(resolve, ms));
  const add = (parent: HTMLElement, html: string) => {
    const holder = document.createElement('div');
    holder.className = 'v01-burn';
    holder.innerHTML = html;
    parent.append(holder);
    return holder;
  };
  const type = async (parent: HTMLElement, text: string, path?: string) => {
    const line = add(parent, `<div class="v01-cmd">${ps(path)} <span class="v01-typed"></span><span class="v01-cursor" aria-hidden="true"></span></div>`);
    const typed = line.querySelector<HTMLElement>('.v01-typed')!;
    for (let i = 1; i <= text.length; i++) {
      if (fast) { typed.textContent = text; break; }
      typed.textContent = text.slice(0, i);
      await wait(text[i - 1] === ' ' ? 45 : 16 + Math.random() * 22);
    }
    line.querySelector('.v01-cursor')?.remove();
    await wait(260);
  };
  const setStatus = (step: { time: string; input: number; output: number }) => {
    status.hidden = false;
    const n = (value: number) => value.toLocaleString('en-US');
    status.querySelector('[data-s="time"]')!.textContent = step.time;
    status.querySelector('[data-s="in"]')!.textContent = n(step.input);
    status.querySelector('[data-s="cached"]')!.textContent = n(Math.round(step.input * 0.66));
    status.querySelector('[data-s="out"]')!.textContent = n(step.output);
  };

  const showMenu = () => {
    const left = order.filter(key => !done.has(key));
    opts.innerHTML = left.map(key => `<button type="button" class="v01-opt" data-key="${key}"><span class="v01-opt-cmd">${sections[key].cmd}</span><span class="v01-opt-why"># ${sections[key].why}</span></button>`).join('')
      + (left.length > 1 ? `<button type="button" class="v01-opt v01-opt-all" data-key="all"><span class="v01-opt-cmd">kiln --all</span><span class="v01-opt-why"># print the rest</span></button>` : '');
    menu.hidden = left.length === 0;
  };

  const runSection = async (key: string, focus: boolean): Promise<boolean> => {
    done.add(key);
    const section = sections[key];
    const block = document.createElement('section');
    block.className = 'v01-block';
    more.append(block);
    await type(block, section.cmd, section.path);
    for (const html of section.html) { add(block, html); await wait(110); }
    if (key === 'download') { await wait(500); root.querySelector('#v01-end')?.scrollIntoView({ behavior: fast ? 'auto' : 'smooth' }); root.querySelector<HTMLElement>('#v01-end-title')?.focus({ preventScroll: true }); return true; }
    return false;
    if (focus) block.querySelector<HTMLElement>('.v01-h')?.focus({ preventScroll: true });
  };

  opts.addEventListener('click', async event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.v01-opt');
    if (!button || busy) return;
    busy = true;
    menu.hidden = true;
    const keys = button.dataset.key === 'all' ? order.filter(key => !done.has(key)) : [button.dataset.key!];
    const start = more.children.length;
    let jumped = false;
    for (const key of keys) jumped = (await runSection(key, keys.length === 1)) || jumped;
    if (!jumped) more.children[start]?.scrollIntoView({ behavior: fast ? 'auto' : 'smooth', block: 'start' });
    if (keys.length > 1) more.children[start]?.querySelector<HTMLElement>('.v01-h')?.focus({ preventScroll: true });
    showMenu();
    busy = false;
  });

  skip.addEventListener('click', () => { fast = true; skip.hidden = true; });

  (async () => {
    await wait(700);
    for (const step of session) {
      if (step.kind === 'cmd') await type(log, step.text, step.path);
      else if (step.kind === 'status') setStatus(step);
      else { add(log, step.html); await wait(step.wait ?? 200); }
    }
    status.classList.add('is-final');
    skip.hidden = true;
    showMenu();
  })();
}
