// PROTOTYPE variant 17 — Ticker tape. A light financial-newspaper page: saved ideas as a watchlist, one prompt's revisions charted as test verdicts.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Verdict = 'pass' | 'fail' | 'uncertain' | 'held';
const tape: [string, string, Verdict, string][] = [
  ['7YO', 'Try it as a seven-year-old', 'held', 'held 41 days, untested'],
  ['WHY', 'Find the instruction that went wrong', 'pass', 'r3 pass'],
  ['BRIEF', 'Repository and recent-PR briefing', 'held', 'held 12 days, untested'],
  ['PLAY', 'Playtest for what kills the fun', 'pass', 'r5 approved'],
  ['MEMO', 'Keep project memory specific', 'held', 'held 3 months, untested'],
  ['RISK', 'Risk-first prototype plan', 'fail', 'r1 fail'],
  ['THRD', 'That thread with 40 prompts', 'held', 'saved, never opened'],
  ['VID', 'Agent workflows talk, 1 h 12 min', 'held', 'watch later'],
  ['VAR', 'Judge variety by player decisions', 'uncertain', 'r2 uncertain'],
  ['SCRN', 'Screenshot of a prompt from X', 'held', 'held 5 weeks, untested'],
];
const mark = { pass: '▲', fail: '▼', uncertain: '◆', held: '■' };
const word = { pass: 'Pass', fail: 'Fail', uncertain: 'Uncertain', held: 'Untested' };

// Illustrative revision history for the real "Playtest" example prompt.
const revisions = [
  { r: 'r1', verdict: 'uncertain' as Verdict, del: [], add: ['Playtest this game and fix what’s wrong.'], result: 'Fixing needs edits, and experiments are read-only, so the agent came back uncertain instead of faking a fix.', you: 'Rewrite it', tokens: 38, time: '1 min 50 s' },
  { r: 'r2', verdict: 'fail' as Verdict, del: ['and fix what’s wrong.'], add: ['Make no changes.'], result: 'It opened the menu, wrote three vague notes and stopped. Nothing specific enough to act on.', you: 'Be specific', tokens: 22, time: '0 min 58 s' },
  { r: 'r3', verdict: 'pass' as Verdict, del: [], add: ['Find bugs, annoyances, confusing details and things that take away the fun.'], result: 'Forty-one findings, all real, in no particular order.', you: 'Too long to use', tokens: 61, time: '3 min 40 s' },
  { r: 'r4', verdict: 'pass' as Verdict, del: [], add: ['Rank the ten most impactful improvements and explain why each helps.'], result: 'A ranked ten with reasons. The top three were fixable in an afternoon.', you: 'Keep going', tokens: 54, time: '2 min 48 s' },
  { r: 'r5', verdict: 'pass' as Verdict, del: [], add: ['Look for quick wins and worthwhile additions.', 'Give me a list to review. Make no changes.'], result: 'The same ranked ten, split into quick wins and additions, ending in a list to review.', you: 'Approve as a skill', tokens: 57, time: '3 min 02 s' },
];
const bandY: Record<Verdict, number> = { pass: 64, uncertain: 142, fail: 220, held: 220 };
const colX = (i: number) => 96 + i * 118;
const points = revisions.map((rev, i) => `${colX(i)},${bandY[rev.verdict]}`).join(' ');
const maxTokens = 70;

const chart = `
<svg class="v17-svg" viewBox="0 0 640 360" role="img" aria-labelledby="v17-chart-t v17-chart-d">
  <title id="v17-chart-t">Revision history of the Playtest prompt, illustrative</title>
  <desc id="v17-chart-d">Five revisions. Revision 1 uncertain, revision 2 fail, revisions 3, 4 and 5 pass. Revision 5 was approved as a skill. Bars below show illustrative total tokens per run.</desc>
  ${(['pass', 'uncertain', 'fail'] as Verdict[]).map(v => `<g class="v17-band v17-band-${v}"><line x1="40" x2="630" y1="${bandY[v]}" y2="${bandY[v]}"/><text x="630" y="${bandY[v] - 7}" text-anchor="end">${word[v]}</text></g>`).join('')}
  <line class="v17-axis" x1="40" x2="630" y1="252" y2="252"/>
  <polygon class="v17-area" points="${colX(0)},252 ${points} ${colX(4)},252"/>
  <polyline class="v17-line" pathLength="1" points="${points}"/>
  <line class="v17-cross" x1="0" x2="0" y1="30" y2="340"/>
  ${revisions.map((rev, i) => `
  <g class="v17-col" data-rev="${i}">
    <rect class="v17-hit" x="${colX(i) - 59}" y="24" width="118" height="320"/>
    <rect class="v17-vol v17-vol-${rev.verdict}" x="${colX(i) - 14}" y="${340 - rev.tokens / maxTokens * 72}" width="28" height="${rev.tokens / maxTokens * 72}"/>
    <circle class="v17-dot v17-dot-${rev.verdict}" cx="${colX(i)}" cy="${bandY[rev.verdict]}" r="7"/>
  </g>`).join('')}
  <g class="v17-approved"><line x1="${colX(4)}" x2="${colX(4)}" y1="${bandY.pass - 12}" y2="22"/><text x="${colX(4) + 6}" y="22" text-anchor="start">Approved</text><text x="${colX(4) + 6}" y="36" text-anchor="start">as a skill</text></g>
  <text class="v17-vol-label" x="40" y="276">Tokens per run, thousands</text>
</svg>`;

const liveRun = [
  ['00:00', 'run', 'Started r5 on ./my-game, read-only. Claude Code, medium effort.'],
  ['00:04', 'command', 'ls src && cat package.json'],
  ['00:19', 'reasoning', 'The jump buffer is shorter than the landing animation, so inputs get lost.'],
  ['00:41', 'command', 'rg -n "spawnRate|difficulty" src/'],
  ['01:12', 'search', 'Web search: first-level onboarding in platformers'],
  ['02:30', 'message', 'Ranking ten findings. Splitting them into quick wins and additions.'],
  ['03:02', 'verdict', 'Agent says pass. 51,302 input, 33,870 cached, 2,114 output tokens.'],
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Stop holding ideas you never trade';
  const tapeItems = tape.map(([symbol, name, verdict, status]) => `<li class="v17-tick v17-${verdict}"><b>${symbol}</b><span>${name}</span><i>${mark[verdict]} ${status}</i></li>`).join('');
  root.innerHTML = `
<div class="v17">
  <div class="v17-tape" role="region" aria-label="Sample watchlist of saved ideas">
    <p class="v17-tape-label">Your watchlist <small>sample</small></p>
    <div class="v17-tape-track" tabindex="0" aria-label="Scrolling list of saved ideas. Hover or focus to pause."><ul>${tapeItems}</ul><ul aria-hidden="true">${tapeItems}</ul></div>
  </div>
  <header class="v17-mast">
    <div class="v17-mast-row">
      <a class="v17-brand" href="?">Kiln</a>
      <nav aria-label="Main navigation"><a href="#v17-view">Our view</a><a href="#v17-lesson">Revisions</a><a href="#v17-watch">Watchlist</a><a href="#v17-risks">Risks</a><a href="#v17-download">Download</a></nav>
    </div>
    <p class="v17-edition">Prompts, tests and agent skills for Windows <span>Sample edition. All charts illustrative.</span></p>
  </header>

  <main id="main">
    <section class="v17-hero" aria-labelledby="v17-title">
      <div class="v17-hero-copy">
        <p class="v17-section-tag">Markets in saved ideas</p>
        <h1 id="v17-title">Stop holding ideas you never trade.</h1>
        <p class="v17-dek">You bookmark the prompt, screenshot the thread, save the video for later. Kiln runs the prompt on your own repository today, read-only, through the Codex or Claude Code you already use, and writes the verdict against that exact revision. Then you edit it, run it again, and watch what moves.</p>
        <div class="v17-cta">
          <a class="v17-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <a class="v17-link" href="#v17-view">Read our view</a>
        </div>
        <p class="v17-fine">${releaseNote}</p>
      </div>
      <figure class="v17-chartcard">
        <div class="v17-chart-head">
          <p class="v17-symbol">PLAY <span>Playtest for what kills the fun</span></p>
          <p class="v17-chart-sub">Revision history on <code>./my-game</code>. Each point is a test run. Illustrative.</p>
        </div>
        ${chart}
        <div class="v17-revs" role="group" aria-label="Revisions">${revisions.map((rev, i) => `<button type="button" data-rev="${i}" aria-pressed="false"><b>${rev.r}</b><span class="v17-${rev.verdict}">${mark[rev.verdict]} ${word[rev.verdict]}</span></button>`).join('')}</div>
        <figcaption class="v17-quote" aria-live="polite"></figcaption>
      </figure>
    </section>

    <section class="v17-strip" aria-label="Key facts">
      <dl>
        <div><dt>Runs at once</dt><dd>2</dd></div>
        <div><dt>Changes to your code</dt><dd>0 <small>read-only</small></dd></div>
        <div><dt>Verdicts</dt><dd><span class="v17-pass">▲</span> <span class="v17-fail">▼</span> <span class="v17-uncertain">◆</span></dd></div>
        <div><dt>API keys needed</dt><dd>0 <small>your subscription</small></dd></div>
        <div><dt>Test runs through</dt><dd class="v17-dd-text">Codex or Claude Code</dd></div>
      </dl>
    </section>

    <section class="v17-view" id="v17-view" aria-labelledby="v17-view-title">
      <aside class="v17-rating" aria-label="Rating">
        <p class="v17-rating-label">Rating</p>
        <p class="v17-rating-value">Test</p>
        <p class="v17-rating-was">Previously: Hold</p>
        <dl>
          <div><dt>Target</dt><dd>A skill your agent loads every session</dd></div>
          <div><dt>Time horizon</dt><dd>Today, on a repo you already have</dd></div>
          <div><dt>Cost basis</dt><dd>Your ChatGPT or Claude subscription. No API bill.</dd></div>
        </dl>
      </aside>
      <div class="v17-note">
        <p class="v17-section-tag">Analyst note</p>
        <h2 id="v17-view-title">Our view: test it on your own repo</h2>
        <p class="v17-standfirst">A saved prompt is an unrealised idea. Its value only shows up when it meets code you care about.</p>
        <div class="v17-columns">
          <p>Pick a local project or repository, or an isolated example if you’d rather not point it at real work. Kiln runs the exact prompt revision through Codex or Claude Code, signed in as you. Experiments are read-only: nothing in your code changes.</p>
          <p>You watch the run as it happens: messages, reasoning summaries, commands, web searches, the model, the reasoning effort, elapsed time and token counts. Run two at once. Cancel one that wanders off, or retry it.</p>
          <p>When it ends, the output and the agent’s own pass, fail or uncertain assessment are saved against that revision. A task that needs edits or tools it doesn’t have comes back uncertain rather than as a faked success.</p>
          <p>The agent’s assessment is kept apart from yours. It can say pass; you still decide what to keep. Before any agent interaction, a consent notice explains what’s sent. Editing, approving and installing never call a model.</p>
        </div>
      </div>
      <figure class="v17-live" aria-labelledby="v17-live-cap">
        <figcaption id="v17-live-cap"><b>Live run</b> <span>r5, sample feed</span></figcaption>
        <ol>${liveRun.map(([time, kind, text]) => `<li class="v17-ev v17-ev-${kind}"><time>${time}</time><span class="v17-kind">${kind}</span><span>${text}</span></li>`).join('')}</ol>
      </figure>
    </section>

    <section class="v17-lesson" id="v17-lesson" aria-labelledby="v17-lesson-title">
      <div class="v17-lesson-head">
        <p class="v17-section-tag">Price discovery</p>
        <h2 id="v17-lesson-title">What changed the result is right there in the diff</h2>
        <p>Every edit is a new revision, and every revision keeps its own runs. Compare two, read the diff, run the new one on the same repo. After a few rounds you stop guessing what makes a prompt work, because you saw it.</p>
      </div>
      <table class="v17-table">
        <caption>PLAY revisions, illustrative. Tokens are totals per run.</caption>
        <thead><tr><th scope="col">Rev</th><th scope="col">Change</th><th scope="col">Agent</th><th scope="col">You</th><th scope="col" class="v17-num">Tokens</th><th scope="col" class="v17-num">Time</th></tr></thead>
        <tbody>${revisions.map(rev => `<tr><th scope="row">${rev.r}</th><td>${rev.del.map(line => `<span class="v17-del">− ${line}</span>`).join('')}${rev.add.map(line => `<span class="v17-add">+ ${line}</span>`).join('')}</td><td class="v17-${rev.verdict}">${mark[rev.verdict]} ${word[rev.verdict]}</td><td>${rev.you}</td><td class="v17-num">${rev.tokens}k</td><td class="v17-num">${rev.time}</td></tr>`).join('')}</tbody>
      </table>
      <div class="v17-tools">
        <div><h3>Ask the agent</h3><p>Discuss an item with its attachments and the source video’s context before you touch the prompt.</p></div>
        <div><h3>Create skill</h3><p>Draft a SKILL.md from a prompt, image or note, using Kiln’s bundled writing-for-agents guidance, linked back to its source.</p></div>
        <div><h3>Approve an exact revision</h3><p>Approval pins r5. Editing again makes r6 a draft; r5 stays approved, and installs always use approved content.</p></div>
      </div>
    </section>

    <section class="v17-watch" id="v17-watch" aria-labelledby="v17-watch-title">
      <div class="v17-watch-head">
        <p class="v17-section-tag">Watchlist</p>
        <h2 id="v17-watch-title">Three positions worth opening</h2>
        <p>Real prompts from a Kiln library, shortened. Each is a small trade: one run, on a repo where it fits.</p>
      </div>
      <ol class="v17-cards">${examples.map((example, i) => `
        <li class="v17-card">
          <p class="v17-card-top"><b>${['7YO', 'WHY', 'PLAY'][i]}</b><span>${example.source}</span></p>
          <h3>${example.title}</h3>
          <p class="v17-card-idea">${example.idea}</p>
          <blockquote>${example.prompt}</blockquote>
          <p class="v17-card-out"><span>If it earns its place</span>${example.skill}</p>
        </li>`).join('')}
      </ol>
    </section>

    <section class="v17-close" aria-labelledby="v17-close-title">
      <div>
        <p class="v17-section-tag">Closing the position</p>
        <h2 id="v17-close-title">A prompt that proves itself becomes a skill</h2>
      </div>
      <ol class="v17-steps">
        <li><b>Approve</b> the revision you trust. Kiln commits that exact snapshot and publishes it to your own Kiln repository on GitHub.</li>
        <li><b>Install</b> it into Codex, Claude Code or Copilot locations, personal or per project. Each install records its revision and destination.</li>
        <li><b>Start a new agent session.</b> It picks the skill up. One tested prompt can change how you work every day after.</li>
        <li><b>On another machine,</b> open the repository and press Install everything marked for this machine, or run <code>kiln skills sync</code>.</li>
      </ol>
    </section>

    <section class="v17-risks" id="v17-risks" aria-labelledby="v17-risks-title">
      <p class="v17-section-tag">Disclosures</p>
      <h2 id="v17-risks-title">Risks</h2>
      <ol class="v17-risk-list">
        <li><h3>Windows only</h3><p>Kiln is a Windows desktop app with a CLI. There is no macOS or Linux build.</p></li>
        <li><h3>Your usage limits apply</h3><p>Runs use your signed-in Codex or Claude Code on your ChatGPT or Claude subscription. No API key or extra bill, but the subscription’s limits still count.</p></li>
        <li><h3>Tests don’t edit code</h3><p>That’s the point, and it’s also a limit. A prompt that needs to change files will come back uncertain.</p></li>
        <li><h3>The agent grades itself</h3><p>Pass, fail or uncertain is the agent’s assessment. It’s stored separately so it never stands in for your own judgement.</p></li>
        <li><h3>GitHub is part of it</h3><p>The library lives on your machine and is backed by a GitHub repository Kiln creates with the official <code>gh</code> CLI. Not offline, not account-free.</p></li>
        <li><h3>Numbers on this page</h3><p>The chart, tape and table are illustrative. Real runs report their own token usage; Kiln doesn’t estimate per-skill token cost.</p></li>
      </ol>
    </section>

    <section class="v17-fund" aria-labelledby="v17-fund-title">
      <p class="v17-section-tag">Fundamentals</p>
      <h2 id="v17-fund-title">What else is on the books</h2>
      <table class="v17-table v17-fund-table">
        <tbody>
          <tr><th scope="row">Capture</th><td>Paste or drop text, links, screenshots and files. Tray icon, quick search on Ctrl+Shift+Space, Ctrl+N. “Save only” keeps a source without calling a model; “Analyze and add” turns it into prompts, insights, techniques, tools and resources.</td></tr>
          <tr><th scope="row">YouTube</th><td>Paste a link and press Distill video. Captions become entries with timestamped source links; the transcript stays attached.</td></tr>
          <tr><th scope="row">Library</th><td>Prompts, skills, custom agents, source notes and more, in collections with search, tags, favorites and filters. Import installed skills as drafts; originals stay put.</td></tr>
          <tr><th scope="row">Installed copies</th><td>See every copy of a skill across personal locations and projects, including ones edited outside Kiln. Compare, reinstall or remove.</td></tr>
          <tr><th scope="row">Config files</th><td>CLAUDE.md, AGENTS.md, Codex, Claude and Copilot settings, MCP config and more, edited in place with syntax checks and 30 private backups. Kiln never runs hooks.</td></tr>
          <tr><th scope="row">CLI</th><td>Script collections, experiments, approvals and installs, with JSON results your agents can read.</td></tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer class="v17-download" id="v17-download" aria-labelledby="v17-dl-title">
    <div class="v17-dl-main">
      <h2 id="v17-dl-title">Open your first position today.</h2>
      <p>Install Kiln, pick a prompt you saved months ago, and run it on a repo before lunch.</p>
    </div>
    <div class="v17-dl-box">
      <a class="v17-button" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="v17-fine">${releaseNote} Builds are unsigned. MIT licensed.</p>
    </div>
    <p class="v17-disclaimer">Charts, tickers and figures on this page are illustrative. Kiln is a tool for prompts and agent skills, not a trading product, and nothing here is investment advice.</p>
  </footer>
</div>`;

  const quote = root.querySelector<HTMLElement>('.v17-quote')!;
  const cross = root.querySelector<SVGLineElement>('.v17-cross')!;
  const buttons = root.querySelectorAll<HTMLButtonElement>('.v17-revs button');
  const cols = root.querySelectorAll<SVGGElement>('.v17-col');
  const select = (i: number) => {
    const rev = revisions[i];
    buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.rev) === i)));
    cols.forEach(col => col.classList.toggle('is-on', Number(col.dataset.rev) === i));
    cross.setAttribute('x1', String(colX(i)));
    cross.setAttribute('x2', String(colX(i)));
    const previous = i ? revisions[i - 1] : null;
    quote.innerHTML = `
      <div class="v17-q-head"><b>${rev.r}</b><span class="v17-${rev.verdict}">${mark[rev.verdict]} Agent: ${word[rev.verdict]}</span><span>You: ${rev.you}</span></div>
      <div class="v17-q-diff" aria-label="Changes from ${previous ? previous.r : 'nothing'}">${rev.del.map(line => `<p class="v17-del">− ${line}</p>`).join('')}${rev.add.map(line => `<p class="v17-add">+ ${line}</p>`).join('')}</div>
      <p class="v17-q-result">${rev.result}</p>
      <p class="v17-q-meta">Claude Code, medium effort, ${rev.time}, about ${rev.tokens}k tokens. Illustrative.</p>`;
  };
  buttons.forEach(button => {
    const i = Number(button.dataset.rev);
    button.addEventListener('click', () => select(i));
    button.addEventListener('mouseenter', () => select(i));
    button.addEventListener('focus', () => select(i));
  });
  cols.forEach(col => col.addEventListener('mouseenter', () => select(Number(col.dataset.rev))));
  select(3);

  // Live feed lines arrive one by one when the note scrolls into view.
  const feed = root.querySelector<HTMLElement>('.v17-live')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) feed.classList.add('is-live');
  else new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    feed.classList.add('is-live');
    observer.disconnect();
  }, { threshold: .4 }).observe(feed);
}
