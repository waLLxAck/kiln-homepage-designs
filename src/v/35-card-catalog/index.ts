// PROTOTYPE variant 32 — Card catalogue. The library as an oak card cabinet: drawers are collections, index cards are items.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Stamp = { text: string; ink: 'red' | 'violet' | 'green' | 'black'; tilt: number };
type Card = { kind: string; title: string; body: string; rev: string; stamps: Stamp[]; seeAlso: string; tags: string[]; status: 'Draft' | 'Approved' | 'Archived' };
type Drawer = { name: string; range: string; cards: Card[] };

const approved = (rev: number, date: string): Stamp => ({ text: `Approved rev ${rev} · ${date}`, ink: 'green', tilt: -4 });
const installed = (where: string): Stamp => ({ text: `Installed ${where}`, ink: 'violet', tilt: 3 });
const draft = (rev: number): Stamp => ({ text: `Draft rev ${rev}`, ink: 'black', tilt: -2 });
const tested = (verdict: string, date: string): Stamp => ({ text: `Tested: ${verdict} · ${date}`, ink: 'red', tilt: 5 });

// Sample drawers. Dates and revisions are illustrative.
const drawers: Drawer[] = [
  { name: 'Agent workflows', range: 'Aa–Ag', cards: [
    { kind: 'Prompt', title: examples[1].title, body: examples[1].prompt, rev: 'Rev 3', status: 'Approved', tags: ['debugging', 'agents'], stamps: [tested('pass', '02 SEP'), approved(3, '03 SEP')], seeAlso: 'Agent workflow video, 18:42' },
    { kind: 'Technique', title: 'Keep project memory specific', body: 'Name the file, the command and the exception. General advice in CLAUDE.md gets followed generally.', rev: 'Rev 1', status: 'Draft', tags: ['memory'], stamps: [draft(1)], seeAlso: 'Agent workflow video, 07:15' },
    { kind: 'Prompt', title: 'Get a repository and recent-PR briefing', body: 'Read the README, the last ten merged pull requests and open issues. Brief me as if I start on this repo tomorrow.', rev: 'Rev 2', status: 'Draft', tags: ['onboarding'], stamps: [tested('uncertain', '28 AUG'), draft(2)], seeAlso: 'Screenshot of a post, saved 27 AUG' },
  ] },
  { name: 'Game design', range: 'Ga–Gz', cards: [
    { kind: 'Prompt', title: examples[2].title, body: examples[2].prompt, rev: 'Rev 2', status: 'Approved', tags: ['games', 'review'], stamps: [tested('pass', '14 AUG'), approved(2, '15 AUG'), installed('game/.github/skills')], seeAlso: 'Saved prompt, from a notes file' },
    { kind: 'Prompt', title: 'Build a risk-first prototype plan', body: 'List the three assumptions most likely to kill this game idea. For each, propose the smallest prototype that would test it.', rev: 'Rev 1', status: 'Draft', tags: ['games', 'planning'], stamps: [draft(1)], seeAlso: 'Game design talk, 31:05' },
    { kind: 'Insight', title: 'Judge variety by player decisions', body: 'Ten enemy types that all ask for the same response are one enemy type. Count the decisions, not the sprites.', rev: 'Rev 1', status: 'Draft', tags: ['games'], stamps: [draft(1)], seeAlso: 'Game design talk, 12:48' },
  ] },
  { name: 'Skills to refine', range: 'Sa–Sk', cards: [
    { kind: 'Skill', title: 'Code review', body: 'Review the diff against the repository standards, then against the spec. Report the two separately, most serious first.', rev: 'Rev 3', status: 'Approved', tags: ['review'], stamps: [approved(2, '09 JUL'), installed('~/.claude/skills'), { text: 'Rev 3 needs review', ink: 'red', tilt: 6 }], seeAlso: 'Imported from ~/.claude/skills' },
    { kind: 'Skill', title: 'Research', body: 'Answer from primary sources. Quote the passage, link it, and say when the sources disagree.', rev: 'Rev 2', status: 'Approved', tags: ['research'], stamps: [approved(2, '21 JUL'), installed('~/.agents/skills')], seeAlso: 'Imported from a skills repository' },
    { kind: 'Skill', title: 'Writing for agents', body: 'Keep descriptions short and specific so they trigger when they should. Prune what the model already knows.', rev: 'Rev 1', status: 'Draft', tags: ['writing'], stamps: [draft(1)], seeAlso: 'Created from a note, 04 AUG' },
  ] },
  { name: 'From a YouTube talk', range: 'Ya–Yz', cards: [
    { kind: 'Prompt', title: examples[0].title, body: examples[0].prompt, rev: 'Rev 2', status: 'Approved', tags: ['usability'], stamps: [tested('pass', '19 AUG'), approved(2, '19 AUG')], seeAlso: 'YouTube talk, 23:10 · transcript attached' },
    { kind: 'Technique', title: 'Ask for the first obstacle', body: 'One concrete problem with a fix beats a list of twenty. Ask for the first thing that stops you.', rev: 'Rev 1', status: 'Draft', tags: ['prompting'], stamps: [draft(1)], seeAlso: 'YouTube talk, 24:02' },
    { kind: 'Tool', title: 'Screen reader as a test harness', body: 'The talk used a screen reader to find unlabeled controls before a child did.', rev: 'Rev 1', status: 'Draft', tags: ['usability', 'tools'], stamps: [draft(1)], seeAlso: 'YouTube talk, 35:47' },
  ] },
  { name: 'Custom agents', range: 'Ca–Cz', cards: [
    { kind: 'Agent', title: 'Reviewer (Claude Code)', body: 'A native Claude Code agent definition: read-only tools, the code-review skill, and a short brief on tone.', rev: 'Rev 2', status: 'Approved', tags: ['review'], stamps: [approved(2, '11 AUG'), installed('~/.claude/agents')], seeAlso: 'Code review skill' },
    { kind: 'Agent', title: 'Release notes (Codex)', body: 'A Codex agent that turns merged pull requests into release notes grouped by what a user would notice.', rev: 'Rev 1', status: 'Draft', tags: ['releases'], stamps: [draft(1)], seeAlso: 'Saved prompt, from a chat' },
    { kind: 'Agent', title: 'Issue triage (Copilot)', body: 'A Copilot agent definition that labels new issues and asks for the missing reproduction steps.', rev: 'Rev 1', status: 'Draft', tags: ['issues'], stamps: [draft(1)], seeAlso: 'Screenshot of a post' },
  ] },
  { name: 'Source notes', range: 'No–Nz', cards: [
    { kind: 'Source note', title: 'Post about context budgets', body: 'Screenshot of a post: forgotten skills still cost context, because every description is read on every turn.', rev: 'Rev 1', status: 'Draft', tags: ['context'], stamps: [{ text: 'Saved only · no model', ink: 'black', tilt: -3 }], seeAlso: '2 entries analyzed from this source' },
    { kind: 'Source note', title: 'Agent workflow video', body: 'Captions distilled into prompts, techniques and insights. Each entry links back to its timestamp.', rev: 'Rev 1', status: 'Draft', tags: ['agents'], stamps: [{ text: 'Distilled · 6 entries', ink: 'violet', tilt: 4 }], seeAlso: 'Agent workflows drawer' },
    { kind: 'Resource', title: 'Skills folder layout notes', body: 'Where each agent looks: ~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills, a project’s .github/skills.', rev: 'Rev 1', status: 'Draft', tags: ['setup'], stamps: [draft(1)], seeAlso: 'Imported from a skills repository' },
  ] },
  { name: 'Prompts to try', range: 'Pa–Pz', cards: [
    { kind: 'Prompt', title: 'Explain this module to a new teammate', body: 'Explain what this module does, what depends on it and what would surprise a new teammate. Make no changes.', rev: 'Rev 1', status: 'Draft', tags: ['onboarding'], stamps: [draft(1)], seeAlso: 'Saved prompt, from a bookmark' },
    { kind: 'Prompt', title: 'Find the slowest test', body: 'Find the three slowest tests, explain why each is slow and suggest the cheapest improvement. Change nothing.', rev: 'Rev 1', status: 'Draft', tags: ['testing'], stamps: [tested('uncertain', '30 AUG'), draft(1)], seeAlso: 'Screenshot of a post' },
    { kind: 'Prompt', title: 'Audit the error messages', body: 'List every user-facing error message. Mark the ones that do not say what happened or what to do next.', rev: 'Rev 1', status: 'Draft', tags: ['ux'], stamps: [draft(1)], seeAlso: 'Saved prompt, from a notes file' },
  ] },
  { name: 'Archive', range: 'Ar–Az', cards: [
    { kind: 'Skill', title: 'Lint rules (old)', body: 'Superseded by the repository’s own lint config. Archived, not deleted: restore it any time.', rev: 'Rev 4', status: 'Archived', tags: ['lint'], stamps: [{ text: 'Archived · copies removed', ink: 'red', tilt: -5 }], seeAlso: 'Code review skill' },
    { kind: 'Prompt', title: 'Summarise the meeting', body: 'A prompt that was never used. Archiving it cleared the shelf without losing it.', rev: 'Rev 1', status: 'Archived', tags: ['meetings'], stamps: [{ text: 'Archived', ink: 'red', tilt: 3 }], seeAlso: 'Saved prompt, from a chat' },
  ] },
  { name: 'Trash', range: 'Restore', cards: [
    { kind: 'Prompt', title: 'Duplicate of Code review', body: 'A second copy that came in with an import. In the trash, restorable until you empty it. Undo works too.', rev: 'Rev 1', status: 'Archived', tags: ['review'], stamps: [{ text: 'Trash · restorable', ink: 'black', tilt: -4 }], seeAlso: 'Code review skill' },
  ] },
];

const allCards = drawers.flatMap(drawer => drawer.cards.map(card => ({ ...card, drawer: drawer.name })));
const kinds = ['All', 'Prompt', 'Skill', 'Agent', 'Technique', 'Insight', 'Source note'];

const loans = [
  { where: '~/.claude/skills/code-review', state: 'Installed', note: 'Approved rev 2' },
  { where: '~/.agents/skills/code-review', state: 'Identical copy found', note: 'Same files, second place' },
  { where: 'game/.github/skills/code-review', state: 'Differs', note: 'An older revision' },
  { where: 'api/.github/skills/code-review', state: 'Linked', note: 'Points at another copy' },
  { where: '~/.codex/skills/code-review', state: 'Edited outside Kiln', note: 'Changed by hand' },
];

const returns = [
  { title: 'Code review', rev: 'rev 2', to: '~/.claude/skills' },
  { title: 'Research', rev: 'rev 2', to: '~/.agents/skills' },
  { title: 'Reviewer agent', rev: 'rev 2', to: '~/.claude/agents' },
  { title: 'Playtest for what kills the fun', rev: 'rev 2', to: 'game/.github/skills' },
];

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const stamp = (s: Stamp) => `<span class="v32-stamp is-${s.ink}" style="--tilt:${s.tilt}deg">${esc(s.text)}</span>`;
const indexCard = (card: Card, drawer: string, i: number, count: number) => `
  <article class="v32-card" aria-label="Card ${i + 1} of ${count}: ${esc(card.title)}">
    <header class="v32-card-head"><span>${card.kind}</span><span>${drawer} · ${card.rev}</span></header>
    <h3>${esc(card.title)}</h3>
    <p class="v32-card-body">${esc(card.body)}</p>
    <p class="v32-card-tags">Tags: ${card.tags.join(', ')}</p>
    <div class="v32-stamps">${card.stamps.map(stamp).join('')}</div>
    <p class="v32-see">See also: <a href="#v32-drawers">${esc(card.seeAlso)}</a></p>
  </article>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Everything filed. Nothing lost. Nothing duplicated.';
  root.innerHTML = `
<div class="v32">
  <svg class="v32-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <filter id="v32-ink" x="-5%" y="-20%" width="110%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="grain"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55" result="holes"/>
      <feComposite in="SourceGraphic" in2="holes" operator="in" result="speckled"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="warp"/>
      <feDisplacementMap in="speckled" in2="warp" scale="1.6"/>
    </filter>
  </svg>
  <a class="skip" href="#main">Skip to content</a>
  <header class="v32-top">
    <a class="v32-plate" href="?"><span class="v32-rivet" aria-hidden="true"></span>Kiln library<span class="v32-rivet" aria-hidden="true"></span></a>
    <nav aria-label="Main navigation"><a href="#v32-drawers">Drawers</a><a href="#v32-accessions">Accessions</a><a href="#v32-finding">Finding aids</a><a href="#v32-loans">Copies</a><a href="#v32-returns">Returns desk</a><a href="#v32-card">Library card</a></nav>
  </header>

  <main id="main">
    <section class="v32-hero" aria-labelledby="v32-title">
      <div class="v32-hero-copy">
        <h1 id="v32-title">Everything filed. Nothing lost. Nothing duplicated.</h1>
        <p>Your prompts are in chats, notes and bookmarks. Your skills are folders in five different places, some of them twice. Kiln is a Windows app that files all of it in one library: prompts, skills, custom agents, source notes, insights, techniques, tools and resources.</p>
        <a class="v32-brass-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        <small class="v32-hero-note">${releaseNote}</small>
      </div>
    </section>

    <section class="v32-catalogue" id="v32-drawers" aria-labelledby="v32-drawers-title">
      <h2 class="visually-hidden" id="v32-drawers-title">The catalogue: open a drawer</h2>
      <div class="v32-cabinet-wrap">
        <div class="v32-cabinet" role="group" aria-label="Collections. Open a drawer to see its cards.">
          ${drawers.map((drawer, i) => `
          <button type="button" class="v32-drawer" data-drawer="${i}" aria-pressed="${i === 0}" aria-controls="v32-tray">
            <span class="v32-holder"><span class="v32-label"><strong>${drawer.name}</strong><em>${drawer.range}</em></span></span>
            <span class="v32-pull" aria-hidden="true"></span>
            <span class="v32-count">${drawer.cards.length} card${drawer.cards.length === 1 ? '' : 's'}</span>
          </button>`).join('')}
        </div>
        <p class="v32-plinth">Sample catalogue · dates and revisions are illustrative</p>
      </div>
      <div class="v32-tray" id="v32-tray" tabindex="0" aria-label="Open drawer. Use the arrow keys to flip through the cards." aria-live="polite">
        <div class="v32-tray-head"><h3 data-tray-title></h3><p data-tray-pos></p></div>
        <div class="v32-stack" data-stack></div>
        <div class="v32-tray-controls">
          <button type="button" class="v32-flip" data-flip="-1">Previous card</button>
          <button type="button" class="v32-flip" data-flip="1">Next card</button>
        </div>
      </div>
    </section>

    <section class="v32-section v32-accessions" id="v32-accessions" aria-labelledby="v32-acc-title">
      <div class="v32-section-head">
        <h2 id="v32-acc-title">Accessions: bring in what’s already on the shelves.</h2>
        <p>Import the skills you’ve installed, or a whole skills repository, as drafts to review. The originals stay exactly where they are. Then let Kiln look for anything that isn’t catalogued yet.</p>
      </div>
      <div class="v32-ledger">
        <table>
          <caption>Accession ledger · sample machine</caption>
          <thead><tr><th scope="col">No.</th><th scope="col">Received from</th><th scope="col">Items</th><th scope="col">Entered as</th></tr></thead>
          <tbody>
            <tr><td>001</td><td><code>~/.claude/skills</code></td><td>9 skills</td><td>Drafts, originals untouched</td></tr>
            <tr><td>002</td><td><code>~/.agents/skills</code></td><td>6 skills</td><td>Drafts, 2 already filed</td></tr>
            <tr><td>003</td><td>A skills repository on GitHub</td><td>14 skills</td><td>Drafts in a new collection</td></tr>
            <tr><td>004</td><td>Find skills and agents not in the library</td><td>3 found</td><td>Offered for import</td></tr>
            <tr><td>005</td><td>Safe cleanup</td><td>1 broken link, 2 empty folders</td><td>Removed with your say-so</td></tr>
          </tbody>
        </table>
      </div>
      <ul class="v32-notes">
        <li><h3>Capture goes straight in</h3><p>Paste or drop text, links, screenshots and files. “Save only” files it without calling a model; “Analyze and add” turns a source into prompts, insights, techniques, tools and resources linked back to it.</p></li>
        <li><h3>Videos, indexed by the minute</h3><p>Paste a YouTube link and press Distill video. Captions become a collection of entries, each with a timestamped link and the transcript attached.</p></li>
      </ul>
    </section>

    <section class="v32-section v32-finding" id="v32-finding" aria-labelledby="v32-find-title">
      <div class="v32-section-head">
        <h2 id="v32-find-title">Finding aids that actually find.</h2>
        <p>Search every card in every drawer. Narrow by kind, status, provider, location, copy state, scope or tag. Star favourites, select in bulk, archive what’s done.</p>
      </div>
      <div class="v32-desk">
        <div class="v32-search">
          <label for="v32-q">Search the catalogue</label>
          <input id="v32-q" type="search" placeholder="Try “review” or “games”" autocomplete="off">
          <div class="v32-kinds" role="group" aria-label="Filter by kind">${kinds.map((kind, i) => `<button type="button" class="v32-kind" data-kind="${kind}" aria-pressed="${i === 0}">${kind}</button>`).join('')}</div>
          <p class="v32-result-count" aria-live="polite" data-count></p>
        </div>
        <ol class="v32-results" data-results></ol>
        <dl class="v32-keys">
          <div><dt>Ctrl-click, Shift-click</dt><dd>Select a few, or a run of cards</dd></div>
          <div><dt>Ctrl+A</dt><dd>Select everything in view</dd></div>
          <div><dt>Swipe or Archive</dt><dd>Clear it off the desk, keep it in the archive</dd></div>
          <div><dt>Trash, Restore, Undo</dt><dd>Nothing is gone until you empty the trash</dd></div>
          <div><dt>Ctrl+Shift+Space</dt><dd>Quick search from anywhere in Windows</dd></div>
        </dl>
      </div>
    </section>

    <section class="v32-section v32-loans" id="v32-loans" aria-labelledby="v32-loans-title">
      <div class="v32-section-head">
        <h2 id="v32-loans-title">Nothing duplicated: every copy on the register.</h2>
        <p>For each skill, Kiln lists every installed copy across your personal locations and enrolled projects, and whether it still matches. That matters beyond tidiness: an agent reads every model-invoked skill’s description on every turn, so a forgotten duplicate spends tokens and attention whether it fires or not.</p>
      </div>
      <div class="v32-register">
        <div class="v32-register-card">
          <header class="v32-card-head"><span>Copy register</span><span>Code review · approved rev 2</span></header>
          <ul class="v32-loan-rows" data-loans>
            ${loans.map((loan, i) => `<li data-loan="${i}"><code>${loan.where}</code><span class="v32-loan-note">${loan.note}</span><span class="v32-stamp v32-loan-stamp is-${loan.state === 'Installed' ? 'green' : loan.state === 'Linked' ? 'black' : loan.state === 'Identical copy found' ? 'violet' : 'red'}" style="--tilt:${[-3, 2, -2, 3, -4][i]}deg">${loan.state}</span></li>`).join('')}
          </ul>
          <div class="v32-register-actions">
            <button type="button" class="v32-flip" data-compare aria-expanded="false" aria-controls="v32-diff">Compare the hand-edited copy</button>
            <button type="button" class="v32-flip v32-flip-strong" data-withdraw>Remove the extra copies</button>
          </div>
          <div class="v32-diff" id="v32-diff" hidden>
            <p><code>SKILL.md</code>, installed copy against approved rev 2</p>
            <p class="is-del">− Review the diff against the repository standards, then against the spec.</p>
            <p class="is-add">+ Review the diff for style only.</p>
          </div>
          <p class="v32-register-note" aria-live="polite" data-loan-note>Removing a copy never touches the library card. Copies Kiln installed are deleted; anything else is moved to a private backup.</p>
        </div>
        <aside class="v32-slip">
          <h3>Install receipt</h3>
          <p>Every install records the revision and the destination, so “which version is in that project?” has an answer on paper.</p>
          <p class="v32-slip-line"><span>Skill</span><span>Code review</span></p>
          <p class="v32-slip-line"><span>Revision</span><span>2 (approved)</span></p>
          <p class="v32-slip-line"><span>To</span><span>~/.claude/skills</span></p>
          <p class="v32-slip-sample">Sample receipt</p>
        </aside>
      </div>
    </section>

    <section class="v32-section v32-returns" id="v32-returns" aria-labelledby="v32-returns-title">
      <div class="v32-section-head">
        <h2 id="v32-returns-title">The returns desk, on your other machine.</h2>
        <p>Approval pins the exact revision you reviewed and publishes it to your own Kiln repository on GitHub. Editing later makes a new draft; the approved card keeps its stamp. On a second PC, open the same repository and everything marked for that machine comes back to its shelf.</p>
      </div>
      <div class="v32-returns-desk">
        <div class="v32-returns-slip">
          <header class="v32-card-head"><span>Returns</span><span>Laptop · sample</span></header>
          <ol data-returns>${returns.map((item, i) => `<li data-return="${i}"><span>${item.title}</span><span>${item.rev}</span><code>${item.to}</code><span class="v32-stamp is-green v32-return-stamp" style="--tilt:${[-4, 3, -2, 5][i]}deg">Installed</span></li>`).join('')}</ol>
          <button type="button" class="v32-brass-button v32-return-button" data-return-all>Install everything marked for this machine</button>
          <p class="v32-cli">Or from a terminal: <code>kiln skills sync</code></p>
        </div>
        <ul class="v32-notes v32-notes-stack">
          <li><h3>Approved means pinned</h3><p>Install always uses approved content. A new draft never replaces the approved revision until you approve it.</p></li>
          <li><h3>Git without the ceremony</h3><p>Status, sync and conflict resolution are built in. Validation checks the standard layout and never executes a skill.</p></li>
          <li><h3>Tested before it’s stamped</h3><p>Run any prompt on a local repo through Codex or Claude Code, read-only. The pass, fail or uncertain verdict is filed with that revision; your own judgement is filed separately.</p></li>
        </ul>
      </div>
    </section>

    <section class="v32-section v32-cta" id="v32-card" aria-labelledby="v32-cta-title">
      <div class="v32-library-card">
        <header class="v32-card-head"><span>Library card</span><span>Kiln 0.17.0</span></header>
        <h2 id="v32-cta-title">Open your own catalogue.</h2>
        <dl class="v32-terms">
          <div><dt>Runs on</dt><dd>Windows desktop, plus an MIT-licensed CLI your agents can read the library through</dd></div>
          <div><dt>Borrowing terms</dt><dd>${subscription.text} ${subscription.fine}</dd></div>
          <div><dt>Shelved at</dt><dd>Locally, backed by a GitHub repository Kiln creates for you with the official gh CLI</dd></div>
          <div><dt>Model calls</dt><dd>Never for editing, approval or installing. A consent notice explains what is sent before any agent interaction.</dd></div>
        </dl>
        <div class="v32-cta-row">
          <a class="v32-brass-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
          <p>${releaseNote} Builds are unsigned.</p>
        </div>
        <span class="v32-stamp is-red v32-cta-stamp" style="--tilt:-8deg">Issued</span>
      </div>
    </section>
  </main>
  <footer class="v32-foot"><p>Kiln · a library for prompts, skills and agents · Windows</p></footer>
</div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Drawers and the flip-through tray.
  let open = 0;
  let pos = 0;
  const stack = root.querySelector<HTMLElement>('[data-stack]')!;
  const trayTitle = root.querySelector<HTMLElement>('[data-tray-title]')!;
  const trayPos = root.querySelector<HTMLElement>('[data-tray-pos]')!;
  const drawStack = (direction = 0) => {
    const drawer = drawers[open];
    const count = drawer.cards.length;
    const leaving = stack.querySelector<HTMLElement>('.v32-slot[data-depth="0"]');
    trayTitle.textContent = drawer.name;
    trayPos.textContent = `Card ${pos + 1} of ${count}`;
    const order = Array.from({ length: Math.min(count, 3) }, (_, k) => (pos + k) % count);
    stack.innerHTML = order.map((index, depth) => `<div class="v32-slot" data-depth="${depth}" style="--depth:${depth}" ${depth ? 'aria-hidden="true"' : ''}>${indexCard(drawer.cards[index], drawer.name, index, count)}</div>`).reverse().join('');
    if (!direction || reduced) return;
    const front = stack.querySelector<HTMLElement>('.v32-slot[data-depth="0"]')!;
    front.classList.add(direction > 0 ? 'is-rising' : 'is-dropping');
    if (direction > 0 && leaving) {
      leaving.classList.add('v32-ghost');
      leaving.removeAttribute('data-depth');
      stack.append(leaving);
      leaving.addEventListener('animationend', () => leaving.remove(), { once: true });
    }
  };
  const flip = (by: number) => { const count = drawers[open].cards.length; if (count < 2) return; pos = (pos + by + count) % count; drawStack(by); };
  const openDrawer = (i: number) => {
    open = i; pos = 0;
    root.querySelectorAll<HTMLButtonElement>('[data-drawer]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.drawer) === i)));
    root.querySelector('.v32-tray')!.classList.remove('is-arriving');
    void (root.querySelector('.v32-tray') as HTMLElement).offsetWidth;
    root.querySelector('.v32-tray')!.classList.add('is-arriving');
    drawStack();
  };
  root.querySelectorAll<HTMLButtonElement>('[data-drawer]').forEach(button => button.addEventListener('click', () => {
    openDrawer(Number(button.dataset.drawer));
    if (innerWidth < 900) root.querySelector('.v32-tray')!.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-flip]').forEach(button => button.addEventListener('click', () => flip(Number(button.dataset.flip))));
  root.querySelector('.v32-tray')!.addEventListener('keydown', event => {
    const key = (event as KeyboardEvent).key;
    if (key === 'ArrowRight' || key === 'ArrowDown') { flip(1); event.preventDefault(); }
    if (key === 'ArrowLeft' || key === 'ArrowUp') { flip(-1); event.preventDefault(); }
  });
  drawStack();

  // Finding aids.
  const input = root.querySelector<HTMLInputElement>('#v32-q')!;
  const results = root.querySelector<HTMLElement>('[data-results]')!;
  const countOut = root.querySelector<HTMLElement>('[data-count]')!;
  let kind = 'All';
  const search = () => {
    const q = input.value.trim().toLowerCase();
    const found = allCards.filter(card => (kind === 'All' || card.kind === kind) && (!q || `${card.title} ${card.body} ${card.tags.join(' ')} ${card.drawer}`.toLowerCase().includes(q)));
    countOut.textContent = `${found.length} card${found.length === 1 ? '' : 's'} in ${new Set(found.map(card => card.drawer)).size} drawer${new Set(found.map(card => card.drawer)).size === 1 ? '' : 's'}`;
    results.innerHTML = found.length ? found.slice(0, 8).map(card => `<li class="v32-result"><span class="v32-result-kind">${card.kind}</span><strong>${esc(card.title)}</strong><span class="v32-result-where">${card.drawer} · ${card.status}</span></li>`).join('') + (found.length > 8 ? `<li class="v32-result v32-result-more">and ${found.length - 8} more</li>` : '') : '<li class="v32-result v32-result-more">No cards. Try a shorter word.</li>';
  };
  input.addEventListener('input', search);
  root.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach(button => button.addEventListener('click', () => {
    kind = button.dataset.kind!;
    root.querySelectorAll('[data-kind]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    search();
  }));
  search();

  // Copy register.
  const compare = root.querySelector<HTMLButtonElement>('[data-compare]')!;
  compare.addEventListener('click', () => {
    const show = compare.getAttribute('aria-expanded') !== 'true';
    compare.setAttribute('aria-expanded', String(show));
    compare.textContent = show ? 'Hide the comparison' : 'Compare the hand-edited copy';
    root.querySelector<HTMLElement>('#v32-diff')!.hidden = !show;
  });
  const withdraw = root.querySelector<HTMLButtonElement>('[data-withdraw]')!;
  withdraw.addEventListener('click', () => {
    const done = withdraw.dataset.done === 'true';
    root.querySelectorAll<HTMLElement>('[data-loan]').forEach(row => {
      if (row.dataset.loan === '0') return;
      row.classList.toggle('is-withdrawn', !done);
      const s = row.querySelector<HTMLElement>('.v32-loan-stamp')!;
      s.textContent = done ? loans[Number(row.dataset.loan)].state : 'Removed';
    });
    withdraw.dataset.done = String(!done);
    withdraw.textContent = done ? 'Remove the extra copies' : 'Put them back';
    root.querySelector<HTMLElement>('[data-loan-note]')!.textContent = done
      ? 'Removing a copy never touches the library card. Copies Kiln installed are deleted; anything else is moved to a private backup.'
      : 'Four copies removed in one go. The approved copy stays installed, the hand-edited one went to a private backup, and the card is still in the drawer.';
  });

  // Returns desk.
  const returnAll = root.querySelector<HTMLButtonElement>('[data-return-all]')!;
  returnAll.addEventListener('click', () => {
    const rows = [...root.querySelectorAll<HTMLElement>('[data-return]')];
    rows.forEach(row => row.classList.remove('is-returned'));
    rows.forEach((row, i) => setTimeout(() => row.classList.add('is-returned'), reduced ? 0 : 280 * (i + 1)));
    returnAll.textContent = 'Installed. Run it again';
  });
}
