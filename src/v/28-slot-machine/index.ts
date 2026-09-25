// PROTOTYPE variant 25 — Slot machine. Pull the lever, the reels land on a real saved prompt, the payout is evidence.
import './style.css';
import { collections, examples, installer, releaseNote, windowsMark } from '../../content';

const sources = ['YouTube talk', 'Post on X', 'Screenshot', 'Saved prompt', 'Workflow video', 'Tab from March'];
const titles = ['Unread thread', 'Try it as a seven-year-old', 'Tip you starred', 'Find the instruction that went wrong', 'Someday list', 'Playtest for what kills the fun'];
const repos = ['~/code/kids-app', '~/code/api', '~/games/tiny-tower', '“later”', 'some repo', 'this weekend'];

const pulls = [
  { ex: 0, reel: [0, 1, 0], agent: 'Claude Code', lines: ['Reading src/routes/start.tsx', 'Following the first activity link', 'Looking for words a child could not read', 'Could not sign in past the parent gate'], tokens: ['38.4k', '22.9k', '2.7k'], verdict: 'Uncertain', note: 'It could read the screens but not use the app past signup, so it said so. Edit the prompt to point it at the child routes and run it again.' },
  { ex: 1, reel: [4, 3, 1], agent: 'Codex', lines: ['Reading AGENTS.md and CLAUDE.md', 'Searching for “always run the full suite”', 'Comparing guidance with package.json scripts', 'Drafting the smallest instruction change'], tokens: ['29.1k', '18.0k', '1.9k'], verdict: 'Pass', note: 'Traced the unwanted test run to a stale line in AGENTS.md and proposed a one-line change. Edited nothing.' },
  { ex: 2, reel: [3, 5, 2], agent: 'Claude Code', lines: ['Reading src/game/loop.ts', 'Reading levels/01.json … 08.json', 'Tracing jump input through src/input', 'Ranking ten improvements'], tokens: ['46.2k', '39.0k', '4.2k'], verdict: 'Pass', note: 'Ranked ten improvements with reasons and listed what it could not verify from the code. Edited nothing.' },
];

const REPEAT = 6;
const strip = (items: string[], cls: string) => Array.from({ length: REPEAT }, () => items.map(t => `<li class="${cls}">${t}</li>`).join('')).join('');

export function render(root: HTMLElement) {
  document.title = 'Kiln — Quit gambling on bookmarks';
  root.innerHTML = `
<div class="v25">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v25-top"><a class="v25-brand" href="?">KILN</a><a class="v25-top-link" href="#v25-cash">Download</a></header>
  <main id="main">
    <section class="v25-hero" aria-labelledby="v25-title">
      <div class="v25-marquee"><div class="v25-marquee-in">
        <h1 id="v25-title">Quit gambling on bookmarks</h1>
        <p>Every saved prompt is a bet until you run it.</p>
      </div></div>

      <div class="v25-cabinet">
        <div class="v25-cab-face">
          <div class="v25-reels" aria-hidden="true">
            <div class="v25-reel"><ul>${strip(sources, 'v25-src')}</ul></div>
            <div class="v25-reel"><ul>${strip(titles, 'v25-ttl')}</ul></div>
            <div class="v25-reel"><ul>${strip(repos, 'v25-repo')}</ul></div>
            <div class="v25-payline"></div>
          </div>
          <p class="v25-reel-text visually-hidden" aria-live="polite"></p>
          <div class="v25-cab-row">
            <p class="v25-cab-label">Source · Prompt · Your repo</p>
            <button type="button" class="v25-pull">Pull the lever</button>
          </div>
        </div>
        <button type="button" class="v25-lever" aria-label="Pull the lever"><span class="v25-lever-rod"><i></i></span><span class="v25-lever-base"></span></button>
      </div>

      <div class="v25-payout" aria-live="polite">
        <div class="v25-slot" aria-hidden="true"></div>
        <div class="v25-ticket"><p class="v25-ticket-wait">Pull the lever. Kiln runs whatever comes up on your own repo, read-only, and prints what happened.</p></div>
      </div>
        <div class="v25-intro">
          <p>Kiln is a Windows app that runs the prompts you saved on your own repo, read-only, and keeps the evidence: the exact revision, the whole run, the verdict. What you keep is your call.</p>
          <a href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <small>Private GitHub release; you need an account with access.</small>
        </div>
    </section>

    <section class="v25-odds" aria-labelledby="v25-odds-title">
      <h2 id="v25-odds-title">Luck out. Evidence in.</h2>
      <div class="v25-odds-grid">
        <div class="v25-bet"><h3>A bookmark</h3><ul><li>Might work.</li><li>Might be for a different codebase.</li><li>Might be the old version.</li><li>You’ll find out this weekend. Probably.</li></ul></div>
        <div class="v25-vs" aria-hidden="true">VS</div>
        <div class="v25-proof"><h3>A Kiln run</h3><dl>
          <div><dt>Exact revision</dt><dd>The prompt text you ran, kept with its result.</dd></div>
          <div><dt>Your repo</dt><dd>Local project or repository, or an isolated example. Read-only.</dd></div>
          <div><dt>Live window</dt><dd>Messages, reasoning summaries, commands, web searches, model, effort, time, tokens in / cached / out.</dd></div>
          <div><dt>Verdict</dt><dd>Pass, fail or uncertain, saved against that revision. Uncertain beats a faked win.</dd></div>
          <div><dt>Your call</dt><dd>Kept separate from the agent’s. You decide what stays.</dd></div>
        </dl></div>
      </div>
      <p class="v25-odds-foot">Didn’t pay out? Edit the prompt, compare the diff, and run it again on the same repo. Up to two runs at once. That’s how you get better at prompting: one changed line, one visible result.</p>
    </section>

    <section class="v25-cashout" aria-labelledby="v25-win-title">
      <div class="v25-chip" aria-hidden="true"><span>SKILL</span></div>
      <div>
        <h2 id="v25-win-title">Cash in the winner.</h2>
        <p>“Create skill” drafts a SKILL.md from the prompt that worked, using Kiln’s writing-for-agents guidance, linked back to where you found it. Approve the exact revision you trust; Kiln commits and publishes it to your own Kiln GitHub repository. Install it into Codex, Claude Code or Copilot locations and the next agent session picks it up.</p>
        <p>Edit it later and you get a new draft. The approved revision doesn’t move.</p>
      </div>
    </section>

    <section class="v25-vault" aria-labelledby="v25-vault-title">
      <h2 id="v25-vault-title">Keep the vault in order.</h2>
      <p class="v25-vault-lede">Prompts, skills, custom agents, notes and sources in one library, instead of loose folders across <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code> and every project’s <code>.github/skills</code>.</p>
      <div class="v25-vault-grid">
        ${collections.map(c => `<div class="v25-drawer"><h3>${c.name}</h3><ul>${c.items.map(([k, t]) => `<li><span>${k}</span>${t}</li>`).join('')}</ul></div>`).join('')}
      </div>
      <ul class="v25-vault-facts">
        <li><strong>Every copy on the table.</strong> See each installed copy across personal locations and projects: installed, identical, differs, linked, or edited outside Kiln. Compare file by file. Remove local copies in bulk.</li>
        <li><strong>Dead weight costs tokens.</strong> Every model-invoked skill’s description sits in the agent’s context on every turn, fired or not. Clear out what you don’t use.</li>
        <li><strong>Bring your stack.</strong> Import installed skills or a skills repo as drafts; originals stay put. Config files (CLAUDE.md, AGENTS.md, config.toml, MCP, hooks) edited in place with 30 backups. Hooks never run.</li>
      </ul>
    </section>

    <section class="v25-cash" id="v25-cash" aria-labelledby="v25-cash-title">
      <h2 id="v25-cash-title">No new chips required.</h2>
      <p>Kiln uses the Codex or Claude Code you’re already signed into, on your ChatGPT or Claude subscription. No API key, no extra API bill. Usage limits still apply. Editing, approving and installing never call a model.</p>
      <a class="v25-bigbtn" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p class="v25-fine">${releaseNote} Unsigned build. MIT licensed, with a CLI.</p>
    </section>
  </main>
</div>`;

  const reels = [...root.querySelectorAll<HTMLElement>('.v25-reel ul')];
  const ticket = root.querySelector<HTMLElement>('.v25-ticket')!;
  const lever = root.querySelector<HTMLButtonElement>('.v25-lever')!;
  const pullBtn = root.querySelector<HTMLButtonElement>('.v25-pull')!;
  const said = root.querySelector<HTMLElement>('.v25-reel-text')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lists = [sources, titles, repos];
  let turn = 0, spinning = false, printTimer = 0;
  const itemH = () => reels[0].querySelector('li')!.getBoundingClientRect().height;

  const shown = [0, 0, 0];
  const land = (p: typeof pulls[number], instant: boolean) => {
    const h = itemH();
    reels.forEach((ul, i) => {
      const target = (REPEAT - 1) * lists[i].length + p.reel[i];
      // Jump back to the same symbol in the first repetition, then spin forward through the strip.
      ul.style.transition = 'none';
      ul.style.transform = `translateY(${-shown[i] * h}px)`;
      shown[i] = p.reel[i];
      ul.classList.remove('is-blur');
      void ul.offsetHeight;
      if (instant) { ul.style.transform = `translateY(${-target * h}px)`; return; }
      ul.classList.add('is-blur');
      ul.style.transition = `transform ${1.1 + i * 0.45}s cubic-bezier(.25, .1, .25, 1.06)`;
      ul.style.transform = `translateY(${-target * h}px)`;
      setTimeout(() => ul.classList.remove('is-blur'), (1.1 + i * 0.45) * 1000 - 250);
    });
  };

  const print = (p: typeof pulls[number], instant = false, label = 'Payout') => {
    clearTimeout(printTimer);
    const e = examples[p.ex];
    const rows = [
      `<p class="v25-t-head">${label} · ${e.title}</p>`,
      `<p class="v25-t-prompt">${e.prompt}</p>`,
      `<p class="v25-t-kv"><span>Repo</span><span>${repos[p.reel[2]]} · read-only</span></p>`,
      `<p class="v25-t-kv"><span>Agent</span><span>${p.agent}, already signed in</span></p>`,
      ...p.lines.map(l => `<p class="v25-t-line">› ${l}</p>`),
      `<p class="v25-t-kv"><span>Tokens</span><span>${p.tokens[0]} in · ${p.tokens[1]} cached · ${p.tokens[2]} out</span></p>`,
      `<p class="v25-t-verdict v25-${p.verdict.toLowerCase()}"><span>Agent says</span><strong>${p.verdict}</strong></p>`,
      `<p class="v25-t-note">${p.note}</p>`,
      `<p class="v25-t-kv v25-t-you"><span>Your call</span><span>${p.verdict === 'Pass' ? 'Keep it, or make it a skill' : 'Edit, then run it again'}</span></p>`,
      `<p class="v25-t-sample">Sample run · code unchanged</p>`,
    ];
    ticket.innerHTML = '';
    ticket.classList.remove('is-printing'); void ticket.offsetWidth; ticket.classList.add('is-printing');
    let i = 0;
    const next = () => {
      ticket.insertAdjacentHTML('beforeend', rows[i]);
      i++;
      if (i < rows.length) printTimer = window.setTimeout(next, reduce ? 0 : i < 2 ? 260 : 330);
      else { spinning = false; pullBtn.disabled = false; }
    };
    if (instant) { ticket.classList.remove('is-printing'); ticket.innerHTML = rows.join(''); ticket.querySelectorAll('p').forEach(el => (el.style.animation = 'none')); return; }
    next();
  };

  const pull = () => {
    if (spinning) return;
    spinning = true; pullBtn.disabled = true;
    const p = pulls[turn % pulls.length];
    turn++;
    lever.classList.remove('is-pulled'); void lever.offsetWidth; lever.classList.add('is-pulled');
    root.querySelector('.v25-cabinet')!.classList.add('is-spinning');
    said.textContent = `The reels land on ${sources[p.reel[0]]}, ${titles[p.reel[1]]}, ${repos[p.reel[2]]}.`;
    ticket.innerHTML = '<p class="v25-ticket-wait">Spinning…</p>';
    land(p, reduce);
    setTimeout(() => { root.querySelector('.v25-cabinet')!.classList.remove('is-spinning'); print(p); }, reduce ? 0 : 2150);
  };
  lever.addEventListener('click', pull);
  pullBtn.addEventListener('click', pull);

  // Start on a landed prompt so the page reads before anyone pulls.
  requestAnimationFrame(() => { land(pulls[2], true); print(pulls[2], true, 'Last pull'); });
  addEventListener('resize', () => { if (!spinning) land(pulls[(turn + 2) % pulls.length], true); });
}
