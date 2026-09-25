// PROTOTYPE variant 37 — Annual report. "The State of Your Skills Folder, 2026": sample accounts for a sample developer, with charts that reveal once each.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

// All figures below are SAMPLE data about a sample developer. Kiln does not collect or report them.
const locations = [
  { path: '~/.claude/skills', copies: 15 },
  { path: '~/.agents/skills', copies: 12 },
  { path: 'game/.github/skills', copies: 8 },
  { path: 'api/.github/skills', copies: 5 },
  { path: '~/.codex/skills', copies: 4 },
  { path: '~/.copilot/skills', copies: 3 },
];
const totalCopies = locations.reduce((sum, row) => sum + row.copies, 0);

type State = 'same' | 'differs' | 'edited';
const drift: { path: string; runs: [State, number][] }[] = [
  { path: '~/.agents/skills', runs: [['same', 12]] },
  { path: '~/.claude/skills', runs: [['same', 4], ['edited', 8]] },
  { path: 'game/.github/skills', runs: [['same', 7], ['differs', 5]] },
  { path: 'api/.github/skills', runs: [['same', 1], ['differs', 3], ['edited', 8]] },
];
const stateLabel: Record<State, string> = { same: 'Identical to the version you trust', differs: 'Differs', edited: 'Edited by hand, nobody remembers why' };
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const distinct = 31;
const used = 12;

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const saved = [38, 91, 150, 213];
const approved = [0, 1, 1, 3];

const highlights = [
  { measure: 'Skill copies installed, all locations', now: '47', then: '29', note: 'Up 18. Nobody decided this.' },
  { measure: 'Distinct skills among them', now: '31', then: '22', note: '16 copies are duplicates of something else.' },
  { measure: 'Folders holding skills', now: '6', then: '4', note: 'Two new projects, two new folders.' },
  { measure: 'Copies changed outside any tool', now: '7', then: '2', note: 'See figure 2.' },
  { measure: 'Skills used this year, shareholder’s estimate', now: '12', then: '11', note: 'Up 1.' },
  { measure: 'Prompts saved', now: '213', then: '140', note: 'Bookmarks, screenshots, chats, notes.' },
  { measure: 'Prompts ever run on real code', now: '9', then: '8', note: 'See Research and development.' },
  { measure: 'Revisions reviewed and approved', now: '3', then: '1', note: 'See figure 4.' },
];

const risks = [
  { risk: 'Stale and duplicate skills keep costing context.', detail: 'Every model-invoked skill’s description sits in the agent’s context on every turn, whether or not it fires.', mitigation: 'See exactly what is installed where, then remove local copies you don’t use in bulk. Managed copies are deleted; others move to private backups.' },
  { risk: 'The version that worked gets overwritten.', detail: 'Edits land on top of the good one.', mitigation: 'Approval pins an exact revision. Editing creates a new draft and never replaces the approved one. Install always uses approved content.' },
  { risk: 'A config change breaks the agent.', detail: 'CLAUDE.md, AGENTS.md, config.toml, hooks, MCP and settings files, edited in five places.', mitigation: 'One config editor that edits the real file in place, with syntax checks, 30 private backups, a diff before restore and stale-edit detection. Kiln never executes hooks.' },
  { risk: 'Good prompts are never approved.', detail: 'See figure 4.', mitigation: 'Run the exact revision on your own repository, read-only, and keep the output and verdict with it.' },
];

const outlook = [
  { title: 'Organise', text: 'One library for prompts, skills, custom agent definitions in native Codex, Claude Code and Copilot formats, source notes and techniques. Collections, tags, favorites, filters by kind, status, provider, location, copy state and scope. Import installed skills or a skills repository as drafts; the originals stay where they are.' },
  { title: 'See every copy', text: 'For each skill, every installed copy across personal locations and enrolled projects: installed, identical copy found, differs, linked, or edited outside Kiln. Compare an installed copy with the approved version, file by file.' },
  { title: 'Approve exact revisions', text: 'Revision history and diffs. Approval commits and publishes that snapshot to your own Kiln GitHub repository, with validation that never executes skills. Install receipts record the revision and destination.' },
  { title: 'Prune', text: 'Find skills and agents that are not in the library, clean up broken links and empty folders safely, and remove local copies in bulk. Keep only what earns its place in the context.' },
  { title: 'Sync', text: 'On another machine, open the repository and press Install everything marked for this machine, or run kiln skills sync. Git status, sync and conflict resolution are built in.' },
];

const register = [
  { item: examples[0].title, rev: 'Revision 2', agent: 'Claude Code', verdict: 'Pass' },
  { item: examples[1].title, rev: 'Revision 1', agent: 'Codex', verdict: 'Uncertain' },
  { item: examples[2].title, rev: 'Revision 3', agent: 'Claude Code', verdict: 'Pass' },
];

const tableView = (caption: string, head: string[], rows: (string | number)[][]) => `
<details class="v37-table-view"><summary>View as table</summary>
  <table><caption class="visually-hidden">${caption}</caption><thead><tr>${head.map(cell => `<th scope="col">${cell}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>
</details>`;

function barsChart(width: number) {
  const compact = width < 420;
  const max = 16;
  const rowH = compact ? 56 : 44;
  const left = compact ? 0 : 190;
  const plot = width - left - (compact ? 36 : 60);
  const top = compact ? 18 : 8;
  const h = locations.length * rowH + 30;
  return `<svg class="v37-chart v37-bars" viewBox="0 0 ${width} ${h}" role="img" aria-labelledby="v37-f1-t"><title id="v37-f1-t">Horizontal bars: skill copies by location. ${locations.map(row => `${row.path}, ${row.copies}`).join('; ')}.</title>
    ${[0, 5, 10, 15].map(t => `<g class="v37-grid"><line x1="${left + t / max * plot}" x2="${left + t / max * plot}" y1="0" y2="${h - 24}"/><text x="${left + t / max * plot}" y="${h - 6}" text-anchor="middle">${t}</text></g>`).join('')}
    ${locations.map((row, i) => {
      const y = i * rowH + top;
      const w = row.copies / max * plot;
      return `<g class="v37-bar" style="--i:${i}"><title>${row.path}: ${row.copies} copies (sample)</title>
        ${compact ? `<text class="v37-bar-label" x="0" y="${y - 6}">${row.path}</text>` : `<text class="v37-bar-label" x="${left - 14}" y="${y + 19}" text-anchor="end">${row.path}</text>`}
        <rect x="${left}" y="${y}" width="${w}" height="26" rx="3" class="${i < 2 ? 'is-personal' : 'is-project'}"/>
        <text class="v37-bar-value" x="${left + w + 10}" y="${y + 19}">${row.copies}</text></g>`;
    }).join('')}
  </svg>`;
}

function driftChart(width: number) {
  const compact = width < 420;
  const left = compact ? 0 : 190;
  const cell = (width - left - 10) / 12;
  const rowH = compact ? 58 : 46;
  const h = drift.length * rowH + 34;
  return `<svg class="v37-chart v37-drift" viewBox="0 0 ${width} ${h}" role="img" aria-labelledby="v37-f2-t"><title id="v37-f2-t">Timeline of four copies of the code-review skill across 2026. One copy stays identical all year; the others begin to differ or are edited by hand between February and August.</title>
    ${months.map((m, i) => `<text class="v37-month" x="${left + i * cell + cell / 2}" y="14" text-anchor="middle">${m}</text>`).join('')}
    ${drift.map((row, r) => {
      const y = (compact ? 42 : 26) + r * rowH;
      let start = 0;
      return (compact ? `<text class="v37-bar-label" x="0" y="${y - 7}">${row.path}</text>` : `<text class="v37-bar-label" x="${left - 14}" y="${y + 19}" text-anchor="end">${row.path}</text>`) + row.runs.map(([state, length]) => {
        const x = left + start * cell;
        const segment = `<rect class="v37-seg is-${state}" style="--x:${start / 12};--w:${length / 12}" x="${x + 1}" y="${y}" width="${length * cell - 2}" height="28" rx="3"><title>${row.path}: ${stateLabel[state].toLowerCase()} for ${length} month${length > 1 ? 's' : ''} (sample)</title></rect>`;
        start += length;
        return segment;
      }).join('');
    }).join('')}
  </svg>`;
}

function waffleChart() {
  const cols = 8;
  const size = 44;
  const gap = 8;
  const rows = Math.ceil(distinct / cols);
  const width = cols * (size + gap);
  const h = rows * (size + gap);
  return `<svg class="v37-chart v37-waffle" viewBox="0 0 ${width} ${h}" role="img" aria-labelledby="v37-f3-t"><title id="v37-f3-t">31 squares, one per distinct skill. 12 are filled: the skills the shareholder estimates they used this year. 19 are outlined: installed, loaded, unused.</title>
    ${Array.from({ length: distinct }, (_, i) => {
      const x = (i % cols) * (size + gap);
      const y = Math.floor(i / cols) * (size + gap);
      const isUsed = i < used;
      return `<rect class="v37-sq ${isUsed ? 'is-used' : 'is-idle'}" style="--i:${i}" x="${x + 1}" y="${y + 1}" width="${size - 2}" height="${size - 2}" rx="4"><title>${isUsed ? 'Used this year' : 'Installed, not used'} (sample)</title></rect>`;
    }).join('')}
  </svg>`;
}

function linesChart(width: number) {
  const h = width < 420 ? 280 : 300;
  const left = 44;
  const right = width < 420 ? 96 : 110;
  const top = 16;
  const bottom = 34;
  const max = 240;
  const x = (i: number) => left + i * (width - left - right) / 3;
  const y = (v: number) => top + (1 - v / max) * (h - top - bottom);
  const line = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return `<svg class="v37-chart v37-lines" viewBox="0 0 ${width} ${h}" role="img" aria-labelledby="v37-f4-t"><title id="v37-f4-t">Line chart by quarter of 2026. Drafts saved rise from 38 to 213. Approved revisions rise from 0 to 3.</title>
    ${[0, 80, 160, 240].map(t => `<g class="v37-grid"><line x1="${left}" x2="${width - right + 10}" y1="${y(t)}" y2="${y(t)}"/><text x="${left - 10}" y="${y(t) + 4}" text-anchor="end">${t}</text></g>`).join('')}
    ${quarters.map((q, i) => `<text class="v37-month" x="${x(i)}" y="${h - 10}" text-anchor="middle">${q}</text>`).join('')}
    <path class="v37-line is-saved" pathLength="1" d="${line(saved)}"/>
    <path class="v37-line is-approved" pathLength="1" d="${line(approved)}"/>
    ${saved.map((v, i) => `<circle class="v37-dot is-saved" style="--i:${i}" cx="${x(i)}" cy="${y(v)}" r="5"><title>${quarters[i]}: ${v} drafts saved (sample)</title></circle>`).join('')}
    ${approved.map((v, i) => `<circle class="v37-dot is-approved" style="--i:${i}" cx="${x(i)}" cy="${y(v)}" r="5"><title>${quarters[i]}: ${v} approved revisions (sample)</title></circle>`).join('')}
    <g class="v37-end"><text x="${x(3) + 14}" y="${y(213) + 5}"><tspan class="v37-end-v">213</tspan> drafts</text><text x="${x(3) + 14}" y="${y(3) + 5}"><tspan class="v37-end-v">3</tspan> approved</text></g>
  </svg>`;
}

const coverArt = `
<svg class="v37-cover-art" viewBox="0 0 520 440" aria-hidden="true">
  ${Array.from({ length: 7 }, (_, i) => {
    const x = 40 + i * 28;
    const y = 20 + i * 30;
    return `<path class="v37-folder${i === 6 ? ' is-kept' : ''}" style="--i:${i}" d="M${x} ${y + 196}V${y + 10}Q${x} ${y} ${x + 10} ${y}H${x + 96}L${x + 112} ${y + 20}H${x + 280}V${y + 196}Z"/>`;
  }).join('')}
  <path class="v37-check" d="M300 330l22 22 46-50"/>
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — The State of Your Skills Folder, 2026';
  root.innerHTML = `
<div class="v37">
  <header class="v37-top">
    <a class="v37-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v37-contents">Contents</a><a href="#v37-ops">Review of operations</a><a href="#v37-outlook">Outlook</a><a href="#v37-invest">Download</a></nav>
  </header>
  <main id="main">
    <section class="v37-cover" aria-labelledby="v37-title">
      <div class="v37-cover-text">
        <p class="v37-cover-kicker">Annual report and accounts</p>
        <h1 id="v37-title">The State of Your Skills Folder, 2026</h1>
        <p class="v37-cover-sub">A review of the year for its sole shareholder, with an outlook: Kiln, a Windows desktop app that keeps your prompts, skills and agent definitions in one library and shows you every copy you have installed.</p>
        <div class="v37-cover-actions"><a class="v37-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a><a class="v37-textlink" href="#v37-letter">Read the chair’s letter</a></div>
      </div>
      ${coverArt}
      <p class="v37-sample-note"><strong>Sample report.</strong> Every figure here describes a sample developer. Kiln does not collect or report them.</p>
    </section>

    <nav class="v37-contents" id="v37-contents" aria-labelledby="v37-contents-title">
      <h2 id="v37-contents-title">Contents</h2>
      <ol>
        <li><a href="#v37-highlights"><span>Highlights of the year</span><b>01</b></a></li>
        <li><a href="#v37-letter"><span>Letter from the chair</span><b>02</b></a></li>
        <li><a href="#v37-ops"><span>Review of operations</span><b>03</b></a></li>
        <li><a href="#v37-rnd"><span>Research and development</span><b>04</b></a></li>
        <li><a href="#v37-outlook"><span>Outlook</span><b>05</b></a></li>
        <li><a href="#v37-risks"><span>Principal risks</span><b>06</b></a></li>
        <li><a href="#v37-invest"><span>Shareholder information</span><b>07</b></a></li>
      </ol>
    </nav>

    <section class="v37-section" id="v37-highlights" aria-labelledby="v37-hl-title">
      <p class="v37-secno" aria-hidden="true">01</p>
      <div class="v37-body">
        <h2 id="v37-hl-title">Highlights of the year</h2>
        <p class="v37-lede">The folder grew. Its usefulness did not.</p>
        <div class="v37-ledger-wrap">
          <table class="v37-ledger">
            <caption>Year ended 31 December. Sample figures for a sample developer.</caption>
            <thead><tr><th scope="col">Measure</th><th scope="col" class="v37-num">2026</th><th scope="col" class="v37-num">2025</th><th scope="col">Note</th></tr></thead>
            <tbody>${highlights.map(row => `<tr><th scope="row">${row.measure}</th><td class="v37-num v37-now">${row.now}</td><td class="v37-num v37-then">${row.then}</td><td class="v37-note">${row.note}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="v37-section v37-letter" id="v37-letter" aria-labelledby="v37-letter-title">
      <p class="v37-secno" aria-hidden="true">02</p>
      <div class="v37-body">
        <h2 id="v37-letter-title">Letter from the chair</h2>
        <div class="v37-letter-text">
          <p class="v37-salute">Dear shareholder,<br>you are the only shareholder.</p>
          <p>It has been a year of growth. You saved 213 prompts and ran 9 of them. You installed skills into six folders, in two formats, for three agents, and it is fair to say the board has lost track of which copy is the real one.</p>
          <p>This matters more than it looks. Every skill an agent can invoke puts its description into the context on every turn, whether it fires or not. A forgotten skill is not free. Neither is the duplicate of it in the next folder over.</p>
          <p>Meanwhile, the best idea of the year, a prompt that makes an agent use your app as a seven-year-old would, remains in a bookmarks folder, unapproved.</p>
          <p>The board has therefore adopted a plan for the year ahead, set out under Outlook: organise the holdings into one library, see every copy, approve the exact revisions we trust, prune what doesn’t earn its place, and sync what does. It will also, for once, test things before keeping them.</p>
          <p>The board does not forecast a percentage improvement. It expects to know what is installed.</p>
          <p class="v37-sign">Yours faithfully,<br><span>The Chair</span><small>also the shareholder, the auditor and the only employee</small></p>
        </div>
      </div>
    </section>

    <section class="v37-section" id="v37-ops" aria-labelledby="v37-ops-title">
      <p class="v37-secno" aria-hidden="true">03</p>
      <div class="v37-body">
        <h2 id="v37-ops-title">Review of operations</h2>
        <p class="v37-lede">Four figures that explain the year. All sample data.</p>
        <div class="v37-figs">
          <figure class="v37-fig" data-reveal>
            <figcaption><span class="v37-fig-no">Figure 1</span><h3>Copies by location</h3><p>${totalCopies} copies across six folders. The two personal folders hold more than half, and ~/.agents/skills is shared by Codex, Copilot and others.</p></figcaption>
            <div data-chart="bars"></div>
            <p class="v37-legend"><span class="v37-li"><span class="v37-key is-personal"></span>Personal folders</span><span class="v37-li"><span class="v37-key is-project"></span>Project and agent-specific folders</span></p>
            ${tableView('Copies by location', ['Location', 'Copies'], locations.map(row => [row.path, row.copies]))}
          </figure>
          <figure class="v37-fig" data-reveal>
            <figcaption><span class="v37-fig-no">Figure 2</span><h3>Drift</h3><p>Four copies of one code-review skill. They matched in January. By December only one still did.</p></figcaption>
            <div data-chart="drift"></div>
            <p class="v37-legend"><span class="v37-li"><span class="v37-key is-same"></span>Identical</span><span class="v37-li"><span class="v37-key is-differs"></span>Differs</span><span class="v37-li"><span class="v37-key is-edited"></span>Edited by hand</span></p>
            ${tableView('Drift by copy', ['Copy', 'State by month, January to December'], drift.map(row => [row.path, row.runs.map(([state, n]) => `${stateLabel[state].split(',')[0]} for ${n}`).join(', then ')]))}
          </figure>
          <figure class="v37-fig" data-reveal>
            <figcaption><span class="v37-fig-no">Figure 3</span><h3>Unused skills</h3><p>Of ${distinct} distinct skills, the shareholder remembers using ${used}. The other ${distinct - used} sit in the agent’s context anyway. Kiln shows what is installed where; it doesn’t track how often a skill fires, so this one is an estimate.</p></figcaption>
            ${waffleChart()}
            <p class="v37-legend"><span class="v37-li"><span class="v37-key is-used"></span>Used this year (${used})</span><span class="v37-li"><span class="v37-key is-idle"></span>Installed, loaded, unused (${distinct - used})</span></p>
          </figure>
          <figure class="v37-fig" data-reveal>
            <figcaption><span class="v37-fig-no">Figure 4</span><h3>Drafts versus approved</h3><p>Drafts piled up every quarter. Approved revisions, the ones actually reviewed and pinned, barely moved.</p></figcaption>
            <div data-chart="lines"></div>
            <p class="v37-legend"><span class="v37-li"><span class="v37-key is-saved"></span>Drafts saved, cumulative</span><span class="v37-li"><span class="v37-key is-approved"></span>Approved revisions, cumulative</span></p>
            ${tableView('Drafts versus approved by quarter', ['Quarter', 'Drafts', 'Approved'], quarters.map((q, i) => [q, saved[i], approved[i]]))}
          </figure>
        </div>
      </div>
    </section>

    <section class="v37-section v37-rnd" id="v37-rnd" aria-labelledby="v37-rnd-title">
      <p class="v37-secno" aria-hidden="true">04</p>
      <div class="v37-body">
        <h2 id="v37-rnd-title">Research and development</h2>
        <div class="v37-rnd-grid">
          <div class="v37-rnd-text">
            <p class="v37-lede">A new policy: nothing is kept until it has been tried on our own code.</p>
            <p>Kiln runs the exact revision of a prompt on a local repository through Codex or Claude Code, and you watch it live: messages, reasoning summaries, commands, model, reasoning effort, elapsed time and token usage. Experiments are read-only, so nothing in the code changes. Up to two can run at once.</p>
            <p>Each run saves the output and the agent’s own verdict, pass, fail or uncertain, against that revision. Tasks that need edits or unavailable tools come back as uncertain rather than as a faked success. The agent’s assessment is kept separate from yours. Edit, compare the diff, run again, and when one proves itself, Create skill drafts a SKILL.md from it.</p>
          </div>
          <div class="v37-register">
            <table>
              <caption>Experiment register. Illustrative entries.</caption>
              <thead><tr><th scope="col">Prompt</th><th scope="col">Revision</th><th scope="col">Agent</th><th scope="col">Agent’s verdict</th></tr></thead>
              <tbody>${register.map(row => `<tr><th scope="row">${row.item}</th><td>${row.rev}</td><td>${row.agent}</td><td><span class="v37-verdict is-${row.verdict.toLowerCase()}">${row.verdict}</span></td></tr>`).join('')}</tbody>
            </table>
            <p class="v37-register-note">Runs use your signed-in Codex or Claude Code on the subscription you already pay for. No API key and no extra API bill; your plan’s usage limits still apply.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="v37-section v37-outlook" id="v37-outlook" aria-labelledby="v37-outlook-title">
      <p class="v37-secno" aria-hidden="true">05</p>
      <div class="v37-body">
        <h2 id="v37-outlook-title">Outlook: Kiln</h2>
        <p class="v37-lede">Five priorities for the year ahead, none of which call a model. Editing, approval and installation never do.</p>
        <ol class="v37-priorities">${outlook.map((item, i) => `<li><span class="v37-pri-no">${i + 1}</span><h3>${item.title}</h3><p>${item.text}</p></li>`).join('')}</ol>
      </div>
    </section>

    <section class="v37-section" id="v37-risks" aria-labelledby="v37-risks-title">
      <p class="v37-secno" aria-hidden="true">06</p>
      <div class="v37-body">
        <h2 id="v37-risks-title">Principal risks and how they are managed</h2>
        <div class="v37-risks">${risks.map(row => `<div class="v37-risk"><h3>${row.risk}</h3><p class="v37-risk-detail">${row.detail}</p><p class="v37-risk-fix"><span>Mitigation</span>${row.mitigation}</p></div>`).join('')}</div>
      </div>
    </section>

    <section class="v37-invest" id="v37-invest" aria-labelledby="v37-invest-title">
      <div class="v37-invest-inner">
        <p class="v37-secno" aria-hidden="true">07</p>
        <div>
          <h2 id="v37-invest-title">Shareholder information</h2>
          <p class="v37-invest-lede">Kiln 0.17.0 is available now for Windows, with an MIT-licensed CLI your agents can use to read the library.</p>
          <div class="v37-invest-row">
            <div><a class="v37-button is-light" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a><p class="v37-fine">${releaseNote}</p></div>
            <dl class="v37-facts">
              <div><dt>Agent</dt><dd>Your signed-in Codex or Claude Code. Copilot locations for installs.</dd></div>
              <div><dt>Library</dt><dd>Stored locally, backed by a GitHub repository Kiln creates for you with the official gh CLI.</dd></div>
              <div><dt>Cost of running tests</dt><dd>No extra API bill. Subscription usage limits still apply.</dd></div>
              <div><dt>Before you run</dt><dd>A consent notice explains what is sent before any agent interaction. Builds are unsigned.</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>`;

  const charts: Record<string, (width: number) => string> = { bars: barsChart, drift: driftChart, lines: linesChart };
  const narrow = matchMedia('(max-width: 560px)');
  const drawCharts = () => root.querySelectorAll<HTMLElement>('[data-chart]').forEach(slot => { slot.innerHTML = charts[slot.dataset.chart!](narrow.matches ? 360 : 480); });
  drawCharts();
  narrow.addEventListener('change', drawCharts);

  const figs = root.querySelectorAll<HTMLElement>('[data-reveal]');
  // Automated full-page screenshots never scroll, so they get the finished charts.
  if (!('IntersectionObserver' in window) || navigator.webdriver || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    figs.forEach(fig => fig.classList.add('is-in'));
    return;
  }
  root.querySelector('.v37')!.classList.add('v37-animate');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    observer.unobserve(entry.target);
  }), { threshold: .45 });
  figs.forEach(fig => observer.observe(fig));
}
