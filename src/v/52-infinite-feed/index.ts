// PROTOTYPE variant 49 — Infinite feed. A greyscale doomscroll of saved things; "Pick one" freezes it and tests one item live on your repo.
import './style.css';
import { collections, examples, installer, installs, releaseNote, subscription, windowsMark } from '../../content';

type Kind = 'post' | 'video' | 'shot' | 'note' | 'link';
type Run = { repo: string; agent: string; lines: string[]; verdict: 'pass' | 'fail' | 'uncertain'; why: string };
type Item = { kind: Kind; head: string; text: string; meta: string; run?: Run };

const items: Item[] = [
  { kind: 'video', head: 'How I review agent PRs without reading every line', text: '', meta: '48:12 · saved 5 weeks ago' },
  { kind: 'post', head: 'post on X', text: 'make the agent explain its plan before it touches a file. you catch half the bad ideas right there', meta: 'saved at 1:14 a.m.',
    run: { repo: 'billing-service', agent: 'Codex', lines: ['read AGENTS.md', 'plan: 4 steps, touches 3 files', 'reasoning: step 3 edits a generated client', 'flagged step 3 before any edit', 'report ready, no files changed'], verdict: 'pass', why: 'The plan exposed a bad step before anything was touched.' } },
  { kind: 'note', head: 'note to self', text: examples[1].prompt, meta: 'saved “for Monday”',
    run: { repo: 'billing-service', agent: 'Claude Code', lines: ['read AGENTS.md, CLAUDE.md', '$ git log -8 --stat', 'reasoning: AGENTS.md still points at the v1 client', 'traced the unwanted import to that line', 'proposed a one-line instruction change'], verdict: 'pass', why: 'Found the outdated instruction and proposed the smallest fix.' } },
  { kind: 'shot', head: 'screenshot', text: 'someone’s CLAUDE.md, cropped badly', meta: 'saved from a thread' },
  { kind: 'link', head: 'github.com/…/awesome-agent-skills', text: '312 skills. You will definitely read all of them.', meta: 'bookmarked' },
  { kind: 'video', head: examples[0].title, text: '', meta: '1:02:40 · watched 4 minutes',
    run: { repo: 'kids-app', agent: 'Claude Code', lines: ['read README.md, src/routes', 'walked the activity picker as a new user', 'reasoning: the “Next” arrow has no label', 'reasoning: the reward screen hides the way back', 'first obstacle described, fix suggested'], verdict: 'pass', why: 'Named the first confusing moment and a fix. Changed nothing.' } },
  { kind: 'post', head: 'post on X', text: 'hot take: your skills folder is a junk drawer and your agent reads the whole drawer every turn', meta: 'saved, agreed, did nothing' },
  { kind: 'note', head: 'prompt idea', text: examples[2].prompt, meta: 'saved during a build',
    run: { repo: 'game-project', agent: 'Claude Code', lines: ['read src/levels, src/input', '$ rg "cooldown" src', 'reasoning: level 2 spikes before the dash is taught', 'reasoning: three findings need a playable build', 'ranked ten improvements'], verdict: 'uncertain', why: 'A useful list, but it can’t play the build, so it says so instead of pretending.' } },
  { kind: 'shot', head: 'screenshot', text: 'a diagram of someone’s agent setup', meta: 'saved, never opened' },
  { kind: 'link', head: 'blog · 14 min read', text: 'Stop writing prompts, start writing specs', meta: 'in “read later” since spring' },
  { kind: 'post', head: 'post on X', text: 'ask it to list every unused export with evidence. free cleanup', meta: 'saved during standup',
    run: { repo: 'billing-service', agent: 'Codex', lines: ['$ rg "export " src --count', 'reasoning: dynamic imports hide real usage', 'reasoning: most findings are used by plugins', 'report ready, no files changed'], verdict: 'fail', why: 'Most findings were wrong for this repo. Edit the prompt before trusting it.' } },
  { kind: 'video', head: 'Subagents, explained badly, at 2×', text: '', meta: '37:05 · saved twice' },
  { kind: 'note', head: 'note to self', text: 'Get a repository and recent-PR briefing every morning?', meta: 'saved “to try”',
    run: { repo: 'game-project', agent: 'Claude Code', lines: ['read README.md, package.json', '$ git log --merges -5', 'summarised five merged PRs', 'report ready, no files changed'], verdict: 'pass', why: 'One screen: what the repo does and what changed this week.' } },
  { kind: 'link', head: 'gist · CLAUDE.md template', text: 'the one everyone forks', meta: 'forked, forgotten' },
  { kind: 'shot', head: 'screenshot', text: 'terminal output, no context', meta: 'saved at 11:58 p.m.' },
  { kind: 'post', head: 'post on X', text: 'the best prompt I ever wrote was the one I actually ran', meta: 'saved ironically' },
];

const media = (it: Item) => {
  if (it.kind === 'video') return '<span class="v49-thumb v49-thumb-video" aria-hidden="true"><i></i></span>';
  if (it.kind === 'shot') return '<span class="v49-thumb v49-thumb-shot" aria-hidden="true"><b></b><b></b><b></b><b></b></span>';
  return '';
};
const itemHtml = (it: Item, i: number) => `<article class="v49-item v49-k-${it.kind}" data-i="${i}" ${it.run ? 'data-pick' : ''}>${media(it)}<p class="v49-item-head">${it.head}</p>${it.text ? `<p class="v49-item-text">${it.text}</p>` : ''}<p class="v49-item-meta">${it.meta}</p></article>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — You’ll never reach the bottom.';
  const cols = 5;
  const colItems = Array.from({ length: cols }, (_, c) => items.map((_, k) => { const i = (k * 3 + c * 5) % items.length; return { it: items[i], i }; }).filter((_, k) => k % 2 === c % 2 || k < 4));
  root.innerHTML = `
<div class="v49">
  <a class="skip" href="#main">Skip to content</a>
  <main id="main">
    <section class="v49-hero" aria-labelledby="v49-title">
      <div class="v49-feed" aria-hidden="true">
        ${colItems.map((list, c) => `<div class="v49-col" style="--speed:${[64, 82, 58, 90, 70][c]}s; --delay:-${c * 7}s">${[0, 1].map(copy => `<div class="v49-col-set" ${copy ? 'data-copy' : ''}>${list.map(({ it, i }) => itemHtml(it, i)).join('')}</div>`).join('')}</div>`).join('')}
      </div>
      <header class="v49-top">
        <a class="v49-brand" href="?">kiln</a>
        <a class="v49-top-link" href="#v49-download">Download for Windows</a>
      </header>
      <div class="v49-copy">
        <h1 id="v49-title">You’ll never reach the bottom.</h1>
        <p>Every post, video and screenshot you saved is still in there, scrolling. Kiln is a Windows app that pulls one out and runs it on your own repo through Codex or Claude Code, read-only, so you find out if it works today.</p>
        <button type="button" class="v49-pick" data-pick-one><span>Pick one</span></button>
        <p class="v49-count" aria-hidden="true">saved items: too many to count</p>
      </div>
      <div class="v49-stage" hidden role="region" aria-label="Test run of the picked item" aria-live="polite">
        <div class="v49-lift-wrap"><p class="v49-lift-cap">Picked. The rest of the feed can wait.</p><div class="v49-lifted"></div></div>
        <div class="v49-run">
          <p class="v49-run-head"><span class="v49-dot" aria-hidden="true"></span><span class="v49-run-title">Testing</span></p>
          <dl class="v49-run-meta"></dl>
          <ol class="v49-run-log"></ol>
          <div class="v49-verdict" hidden></div>
          <div class="v49-run-actions" hidden>
            <button type="button" class="v49-btn v49-btn-accent" data-keep>Keep it in the library</button>
            <button type="button" class="v49-btn" data-again>Pick another</button>
            <button type="button" class="v49-btn v49-btn-quiet" data-unfreeze>Back to the feed</button>
          </div>
        </div>
      </div>
    </section>

    <div class="v49-seam" aria-hidden="true"><span>the scroll stops here</span></div>

    <section class="v49-calm" id="v49-library" aria-labelledby="v49-lib-title">
      <div class="v49-calm-head">
        <h2 id="v49-lib-title">Here, things have a place.</h2>
        <p>The library is where the one you picked goes, and where it stays findable. Prompts, skills, custom agent definitions for Codex, Claude Code and Copilot, source notes, insights, techniques, tools and resources, sorted into collections.</p>
      </div>
      <div class="v49-lib" role="group" aria-label="Sample library">
        <nav class="v49-lib-side" aria-label="Sample collections">
          <p class="v49-lib-label">Collections</p>
          <ul>${collections.map((c, i) => `<li><button type="button" data-col="${i}" aria-pressed="${i === 0}">${c.name}<span>${c.items.length}</span></button></li>`).join('')}</ul>
          <p class="v49-lib-label">Also</p>
          <ul class="v49-lib-plain"><li>Favorites</li><li>Archive</li><li>Trash</li></ul>
        </nav>
        <div class="v49-lib-main">
          <div class="v49-filters" aria-label="Filters">${['kind', 'status', 'provider', 'location', 'copy state', 'scope', 'tag'].map(f => `<span>${f}</span>`).join('')}</div>
          <ul class="v49-rows"></ul>
          <p class="v49-lib-foot">Ctrl-click, Shift-click or Ctrl+A to select in bulk. Archive, trash, restore, undo. Swipe to archive, too.</p>
        </div>
      </div>
    </section>

    <section class="v49-calm v49-grid" aria-labelledby="v49-cap-title">
      <h2 id="v49-cap-title">Saving stops feeding the scroll.</h2>
      <div class="v49-cols3">
        <div><h3>Capture in a keystroke</h3><p>Paste or drop text, links, screenshots, images and files. <kbd>Ctrl</kbd>+<kbd>N</kbd> captures; <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> searches from anywhere; the tray icon is always there.</p></div>
        <div><h3>Save only, or analyze</h3><p>“Save only” keeps it without calling a model. “Analyze and add” turns a source into prompts, insights, techniques, tools and resources in a collection linked to the source.</p></div>
        <div><h3>Distill the hour-long video</h3><p>Paste a YouTube link and press “Distill video”. Captions become reusable entries with timestamped source links; the transcript stays attached.</p></div>
      </div>
    </section>

    <section class="v49-calm v49-grid" aria-labelledby="v49-test-title">
      <h2 id="v49-test-title">What a pick actually does.</h2>
      <div class="v49-split">
        <ol class="v49-steps">
          <li><span><b>Choose where.</b> A local project or repository, or an isolated example.</span></li>
          <li><span><b>Run the exact revision.</b> Through your signed-in Codex or Claude Code. Up to two runs at once, cancel or retry.</span></li>
          <li><span><b>Watch it live.</b> Messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time, and input, cached and output tokens.</span></li>
          <li><span><b>Read the verdict.</b> The agent says pass, fail or uncertain, saved against that revision. Tasks that need edits or unavailable tools come back uncertain, not as faked successes.</span></li>
          <li><span><b>Make your call.</b> Your judgement is kept separate from the agent’s. Edit the prompt, compare the diff, run it again on the same repo, and learn what changed the result.</span></li>
        </ol>
        <aside class="v49-readonly"><p class="v49-big">read-only</p><p>Experiments inspect your code. They never change it.</p></aside>
      </div>
    </section>

    <section class="v49-calm v49-grid" aria-labelledby="v49-skill-title">
      <h2 id="v49-skill-title">The keepers become skills. The rest leave.</h2>
      <div class="v49-split">
        <div class="v49-prose">
          <p>A prompt that proves itself becomes a skill: “Create skill” drafts a SKILL.md using Kiln’s bundled writing-for-agents guidance. Approval pins the exact revision you trust and publishes it to your own Kiln GitHub repository. Editing makes a new draft; installs always use the approved one. Install into Codex, Claude Code or Copilot locations, and the next agent session picks it up.</p>
          <p>Then look at what’s already installed. Every model-invoked skill’s description sits in your agent’s context on every turn, fired or not. Kiln lists every copy of each skill across your personal locations and projects, including copies edited outside Kiln, so you can compare them, remove the ones you don’t use, and keep what earns its place.</p>
        </div>
        <table class="v49-table">
          <caption>code-review, installed copies (sample)</caption>
          <thead><tr><th scope="col">Location</th><th scope="col">State</th></tr></thead>
          <tbody>${installs.map(r => `<tr><td><code>${r.path}</code><small>${r.agent}</small></td><td><span class="v49-state ${r.ok ? '' : 'is-warn'}">${r.state}</span></td></tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="v49-note">On another machine: open the repository and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>. Config files (CLAUDE.md, AGENTS.md, config.toml, hooks.json, settings, MCP) are edited in place with 30 private backups, and Kiln never executes hooks.</p>
    </section>

    <section class="v49-calm v49-dl" id="v49-download" aria-labelledby="v49-dl-title">
      <div>
        <h2 id="v49-dl-title">Pick one tonight.</h2>
        <p>${subscription.text} ${subscription.fine}</p>
      </div>
      <div class="v49-dl-box">
        <a class="v49-btn v49-btn-accent v49-btn-big" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p>${releaseNote}</p>
        <p class="v49-fine">Unsigned build; Windows may ask you to confirm. MIT licensed, with a CLI that returns JSON.</p>
      </div>
    </section>
  </main>
</div>`;

  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const hero = q('.v49-hero');
  const stage = q('.v49-stage');
  const lifted = q('.v49-lifted');
  const log = q('.v49-run-log');
  const meta = q('.v49-run-meta');
  const verdict = q('.v49-verdict');
  const actions = q('.v49-run-actions');
  const runTitle = q('.v49-run-title');
  const rows = q('.v49-rows');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers: number[] = [];
  let picked: HTMLElement | null = null;
  let current: Item | null = null;
  let col = 0;
  const added: Item[] = [];
  let lastPick = -1;

  const renderRows = () => {
    const base = collections[col].items.map(([kind, title]) => `<li><span class="v49-kind">${kind}</span><span class="v49-rtitle">${title}</span><span class="v49-rstate">${kind === 'Skill' ? 'approved' : 'tested'}</span></li>`);
    const extra = col === 0 ? added.map(it => `<li class="is-new"><span class="v49-kind">Prompt</span><span class="v49-rtitle">${it.head.startsWith('post') || it.head.startsWith('note') || it.head.startsWith('prompt') ? it.text.slice(0, 64) + (it.text.length > 64 ? '…' : '') : it.head}</span><span class="v49-rstate">${it.run!.verdict}, kept</span></li>`) : [];
    rows.innerHTML = [...extra, ...base].join('');
  };
  renderRows();

  const clear = () => { timers.forEach(t => clearTimeout(t)); timers = []; };

  const choose = (): HTMLElement | null => {
    const hr = hero.getBoundingClientRect();
    const cands = [...root.querySelectorAll<HTMLElement>('.v49-item[data-pick]')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.top > hr.top + 60 && r.bottom < hr.bottom - 40 && r.width > 0 && Number(el.dataset.i) !== lastPick;
    });
    if (!cands.length) return root.querySelector<HTMLElement>('.v49-item[data-pick]');
    return cands[Math.floor(Math.random() * cands.length)];
  };

  const pick = () => {
    clear();
    if (picked) picked.classList.remove('is-picked');
    hero.classList.add('is-frozen');
    const el = choose();
    if (!el) return;
    picked = el;
    lastPick = Number(el.dataset.i);
    const it = items[lastPick];
    current = it;
    const run = it.run!;
    el.classList.add('is-picked');
    stage.hidden = false;
    lifted.innerHTML = el.outerHTML;
    const card = lifted.firstElementChild as HTMLElement;
    card.classList.remove('is-picked');
    card.classList.add('is-lifted');
    // FLIP from the feed position into the stage
    const from = el.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    if (!reduced && to.width) {
      const s = from.width / to.width;
      card.style.transformOrigin = 'top left';
      card.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${s})`;
      card.getBoundingClientRect();
      card.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1), box-shadow .7s';
      requestAnimationFrame(() => { card.style.transform = ''; });
    }
    runTitle.textContent = `Testing on ${run.repo}`;
    meta.innerHTML = `<div><dt>agent</dt><dd>${run.agent}</dd></div><div><dt>effort</dt><dd>medium</dd></div><div><dt>mode</dt><dd>read-only</dd></div><div><dt>elapsed</dt><dd class="v49-el">0s</dd></div><div><dt>tokens</dt><dd class="v49-tok">0</dd></div>`;
    log.innerHTML = '';
    verdict.hidden = true; actions.hidden = true;
    stage.classList.remove('is-done');
    const step = reduced ? 0 : 650;
    const el2 = meta.querySelector<HTMLElement>('.v49-el')!;
    const tok = meta.querySelector<HTMLElement>('.v49-tok')!;
    run.lines.forEach((line, i) => timers.push(window.setTimeout(() => {
      log.insertAdjacentHTML('beforeend', `<li><span>${String(3 + i * 5).padStart(2, '0')}s</span>${line}</li>`);
      el2.textContent = `${3 + i * 5}s`;
      tok.textContent = `${(6200 * (i + 1)).toLocaleString('en-US')}`;
    }, 800 + i * step)));
    timers.push(window.setTimeout(() => {
      verdict.hidden = false; actions.hidden = false;
      stage.classList.add('is-done');
      tok.textContent = '31,840';
      verdict.dataset.v = run.verdict;
      verdict.innerHTML = `<p class="v49-v-word">${run.verdict}</p><p>${run.why}</p><p class="v49-v-small">The agent’s assessment. Your call is separate. Token counts are sample numbers.</p>`;
      q<HTMLButtonElement>('[data-keep]').disabled = added.includes(it);
      q<HTMLButtonElement>('[data-keep]').textContent = added.includes(it) ? 'Already in the library' : 'Keep it in the library';
    }, 1100 + run.lines.length * step));
  };

  const unfreeze = () => {
    clear();
    stage.hidden = true;
    hero.classList.remove('is-frozen');
    picked?.classList.remove('is-picked');
    picked = null;
    q<HTMLButtonElement>('[data-pick-one]').focus({ preventScroll: true });
  };

  root.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-pick-one]') || t.closest('[data-again]')) pick();
    if (t.closest('[data-unfreeze]')) unfreeze();
    if (t.closest('[data-keep]') && current && !added.includes(current)) {
      added.unshift(current);
      col = 0;
      root.querySelectorAll<HTMLElement>('[data-col]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.col === '0')));
      renderRows();
      const keep = q<HTMLButtonElement>('[data-keep]');
      keep.disabled = true; keep.textContent = 'Kept. It’s in Agent workflows';
      timers.push(window.setTimeout(() => q('#v49-library').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), 700));
    }
    const c = t.closest<HTMLElement>('[data-col]');
    if (c) {
      col = Number(c.dataset.col);
      root.querySelectorAll<HTMLElement>('[data-col]').forEach(b => b.setAttribute('aria-pressed', String(b === c)));
      renderRows();
    }
  });
  stage.addEventListener('keydown', e => { if (e.key === 'Escape') unfreeze(); });
}
