// PROTOTYPE variant 09 — Inventory. Installed skills as items in an RPG inventory; the agent is over-encumbered until you unequip (remove local copies).
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Rarity = 'approved' | 'draft' | 'drift' | 'unknown';
type Item = { id: string; name: string; rarity: Rarity; weight: number; icon: keyof typeof icons; used: string; copies: [string, string][] };

const rarityLabel: Record<Rarity, string> = { approved: 'Approved', draft: 'Draft', drift: 'Edited outside Kiln', unknown: 'Not in library' };
const capacity = 100, scale = 150;

const icons = {
  scroll: '<path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2h4M10 9h6M10 12h6M10 15h4"/>',
  sword: '<path d="M14.5 3H21v6.5L10 20.5 3.5 14zM5 17l-2 4 4-2M8 13l3 3"/>',
  potion: '<path d="M9 3h6M10 3v5l-4.5 7.5A3 3 0 0 0 8 20h8a3 3 0 0 0 2.5-4.5L14 8V3M7.5 14h9"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21a2 2 0 0 1 2-2h13v2M9 7h6M9 10h4"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4"/>',
  gem: '<path d="M6 4h12l3 5-9 11L3 9zM3 9h18M9 4l3 16 3-16"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12 20 3M16 7l2 2M14 9l2 2"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
  lantern: '<path d="M9 3h6M12 3v2M8 7h8l1 10H7zM7 17h10v3H7zM12 10v4"/>',
  rune: '<path d="M6 3h12v18H6zM12 7v10M9 9l3-2 3 2M9 15l3 2 3-2"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
};
const svg = (icon: keyof typeof icons) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[icon]}</svg>`;

const items: Item[] = [
  { id: 'code-review', name: 'code-review', rarity: 'drift', weight: 14, icon: 'sword', used: 'Used most days.', copies: [['~/.agents/skills/code-review', 'Installed'], ['~/.claude/skills/code-review', 'Edited outside Kiln'], ['.github/skills/code-review', 'Installed']] },
  { id: 'research', name: 'research', rarity: 'approved', weight: 11, icon: 'compass', used: 'Used weekly.', copies: [['~/.agents/skills/research', 'Installed']] },
  { id: 'writing-for-agents', name: 'writing-for-agents', rarity: 'approved', weight: 16, icon: 'book', used: 'Used when drafting skills.', copies: [['~/.agents/skills/writing-for-agents', 'Installed'], ['~/.codex/skills/writing-for-agents', 'Identical copy found']] },
  { id: 'pdf-helper', name: 'pdf-helper', rarity: 'unknown', weight: 12, icon: 'scroll', used: 'Last used: nobody knows.', copies: [['~/.claude/skills/pdf-helper', 'Not in library']] },
  { id: 'playtest', name: 'playtest', rarity: 'approved', weight: 9, icon: 'potion', used: 'Used on game builds.', copies: [['games/.github/skills/playtest', 'Installed']] },
  { id: 'changelog-2023', name: 'changelog-2023', rarity: 'draft', weight: 15, icon: 'hourglass', used: 'A draft from another era.', copies: [['~/.agents/skills/changelog-2023', 'Differs']] },
  { id: 'commit-style', name: 'commit-style', rarity: 'approved', weight: 7, icon: 'rune', used: 'Used on every commit.', copies: [['~/.agents/skills/commit-style', 'Linked']] },
  { id: 'figma-export', name: 'figma-export', rarity: 'unknown', weight: 12, icon: 'map', used: 'Installed for one afternoon.', copies: [['~/.claude/skills/figma-export', 'Not in library']] },
  { id: 'sql-helper', name: 'sql-helper', rarity: 'draft', weight: 13, icon: 'key', used: 'Never approved, rarely used.', copies: [['~/.agents/skills/sql-helper', 'Installed'], ['~/.copilot/skills/sql-helper', 'Identical copy found']] },
  { id: 'old-research', name: 'research (old)', rarity: 'unknown', weight: 11, icon: 'lantern', used: 'Duplicate of research.', copies: [['~/.agents/skills/research-old', 'Not in library']] },
  { id: 'release-notes', name: 'release-notes', rarity: 'draft', weight: 10, icon: 'gem', used: 'Stale since spring.', copies: [['my-repo/.github/skills/release-notes', 'Installed']] },
  { id: 'deploy-notes', name: 'deploy-notes', rarity: 'unknown', weight: 8, icon: 'shield', used: 'The link points nowhere.', copies: [['~/.claude/skills/deploy-notes', 'Broken link']] },
];
const reward: Item = { id: 'seven-year-old', name: 'seven-year-old-test', rarity: 'approved', weight: 9, icon: 'potion', used: 'Earned on ./my-repo.', copies: [['~/.agents/skills/seven-year-old-test', 'Installed']] };
const slots = 18;

const itemButton = (item: Item) => `
  <button type="button" class="v09-item is-${item.rarity}" data-id="${item.id}" aria-label="${item.name}, ${rarityLabel[item.rarity]}, sample weight ${item.weight}. Unequip">
    ${svg(item.icon)}<span class="v09-w">${item.weight}</span>${item.copies.length > 1 ? `<span class="v09-n">×${item.copies.length}</span>` : ''}
  </button>`;

const quest = [
  { title: 'Capture the prompt', text: 'Ctrl+N, paste it, done. It was in a YouTube talk.' },
  { title: 'Choose the dungeon', text: 'Pick ./my-repo. Experiments are read-only, so nothing in your code changes.' },
  { title: 'Run it', text: 'Through your signed-in Codex or Claude Code. Watch messages, commands, model, effort and tokens live.' },
  { title: 'Read the verdict', text: 'The agent says pass, fail or uncertain. Your judgement is recorded separately.' },
  { title: 'Revise and run again', text: 'Compare revisions and diffs on the same repo until you see what changed the result.' },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Your agent is over-encumbered';
  root.innerHTML = `
<div class="v09">
  <header class="v09-top">
    <a class="v09-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v09-inventory">Inventory</a><a href="#v09-quest">Quest</a><a href="#v09-stash">Stash</a><a href="#v09-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v09-hero" aria-labelledby="v09-title">
      <div class="v09-hero-copy">
        <h1 id="v09-title">Your agent is over-encumbered.</h1>
        <div>
          <p>Every skill you ever installed rides along: its description sits in your agent’s context on every turn, used or not. Kiln is a Windows app that shows every copy in every location, so you can drop what you don’t use and keep what earns a slot.</p>
          <div class="v09-cta"><a class="v09-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a><small>Release 0.17.0, private GitHub repository: sign in with an account that has access.</small></div>
        </div>
      </div>

      <div class="v09-hud" id="v09-inventory" role="region" aria-labelledby="v09-inv-title">
        <div class="v09-hud-head">
          <h2 id="v09-inv-title">Inventory</h2>
          <p>Installed skills, all agents on this machine</p>
          <span class="v09-effect" aria-live="polite"><span class="v09-effect-icon" aria-hidden="true"></span><span class="v09-effect-text">Over-encumbered</span></span>
        </div>
        <div class="v09-carry">
          <div class="v09-carry-label"><span>Context weight <em>sample</em></span><strong><span class="v09-carry-num">0</span> / ${capacity}</strong></div>
          <div class="v09-bar" role="meter" aria-label="Sample context weight" aria-valuemin="0" aria-valuemax="${scale}" aria-valuenow="0"><span class="v09-bar-fill"></span><span class="v09-bar-cap" style="left:${capacity / scale * 100}%"><span>Capacity</span></span></div>
        </div>
        <div class="v09-hud-body">
          <div>
            <p class="v09-hint">Click an item to unequip it. Kiln removes the local copies and the skill stays in your library.</p>
            <ul class="v09-grid">${Array.from({ length: slots }, (_, i) => `<li class="v09-slot">${items[i] ? itemButton(items[i]) : ''}</li>`).join('')}</ul>
          </div>
          <aside class="v09-card" aria-live="polite"></aside>
        </div>
        <div class="v09-stash-strip">
          <h3>Stash <span>your Kiln library</span></h3>
          <ul class="v09-stash-list"><li class="v09-stash-empty">Nothing unequipped yet.</li></ul>
        </div>
        <p class="v09-honest">Weights are illustrative. Kiln shows what’s installed and every copy; it doesn’t meter tokens per skill. Test runs do show real token usage.</p>
      </div>
    </section>

    <section class="v09-lore" aria-labelledby="v09-lore-title">
      <div class="v09-panel v09-lore-main">
        <h2 id="v09-lore-title">Why the pack is so heavy</h2>
        <p>Skills are loose folders: <code>~/.claude/skills</code>, <code>~/.agents/skills</code> shared by Codex and Copilot, <code>.codex/skills</code>, <code>.copilot/skills</code>, and each project’s <code>.github/skills</code>. A model-invoked skill’s description loads every turn whether it fires or not. Forgotten, duplicate and stale skills spend tokens and attention, and nobody sees them.</p>
        <p>Kiln’s bundled writing-for-agents guidance, used when it drafts skills for you, is built around the same idea: context load, pruning, and descriptions that trigger when they should.</p>
      </div>
      <div class="v09-panel v09-rarity">
        <h3>Item rarity</h3>
        <dl>
        <div class="is-approved"><dt>Approved</dt><dd>An exact revision you reviewed. What gets installed.</dd></div>
        <div class="is-draft"><dt>Draft</dt><dd>Imported or edited, waiting for your review. Never replaces the approved one.</dd></div>
        <div class="is-drift"><dt>Edited outside Kiln</dt><dd>An installed copy that changed by hand. Compare it file by file.</dd></div>
        <div class="is-unknown"><dt>Not in library</dt><dd>Found in a skills folder, unknown to Kiln. Import it as a draft or remove it.</dd></div>
        </dl>
      </div>
    </section>

    <section class="v09-quest" id="v09-quest" aria-labelledby="v09-quest-title">
      <div class="v09-quest-head">
        <p class="v09-quest-tag">New quest</p>
        <h2 id="v09-quest-title">Earn a skill on your own repo</h2>
        <p>The best items aren’t found, they’re tested. Take a prompt you saved and never tried, run it where it matters, and keep it only if it works.</p>
      </div>
      <div class="v09-quest-body">
        <div class="v09-panel v09-log">
          <h3>Quest log</h3>
          <ol class="v09-objectives">${quest.map((q, i) => `<li data-step="${i}"><span class="v09-check" aria-hidden="true"></span><div><strong>${q.title}</strong><p>${q.text}</p></div></li>`).join('')}</ol>
          <button type="button" class="v09-button is-ghost v09-quest-go">Start the quest</button>
        </div>
        <div class="v09-panel v09-scroll">
          <h3>The prompt</h3>
          <p class="v09-scroll-src">${examples[0].source}: ${examples[0].title}</p>
          <blockquote>${examples[0].prompt}</blockquote>
          <div class="v09-reward is-locked">
            <p class="v09-reward-title">Reward <span class="v09-lock">locked until the quest is done</span></p>
            <div class="v09-reward-item"><span class="v09-item is-approved is-preview" aria-hidden="true">${svg(reward.icon)}<span class="v09-w">${reward.weight}</span></span><div><strong>seven-year-old-test</strong><span>${examples[0].skill} “Create skill” drafted the SKILL.md with writing-for-agents guidance.</span></div></div>
            <button type="button" class="v09-button v09-equip" disabled>Approve and equip</button>
          </div>
        </div>
      </div>
    </section>

    <section class="v09-stash" id="v09-stash" aria-labelledby="v09-stash-title">
      <h2 id="v09-stash-title">The stash keeps everything</h2>
      <div class="v09-stash-grid">
        <article class="v09-panel"><h3>One library</h3><p>Prompts, skills, custom agents in native Codex, Claude Code and Copilot formats, source notes, insights, techniques, tools and resources. Collections, search, tags, favorites and filters by kind, status, provider, location, copy state and scope.</p></article>
        <article class="v09-panel"><h3>Loot what you have</h3><p>Import installed skills or a skills repository as drafts; the originals stay put. “Find skills and agents not in the library” scans your locations and offers safe cleanup of broken links and empty folders.</p></article>
        <article class="v09-panel"><h3>Unequip in bulk</h3><p>Select with Ctrl or Shift-click, or Ctrl+A. Remove local copies: managed copies are deleted, anything else goes to private backups. Archive, trash, restore and undo.</p></article>
        <article class="v09-panel"><h3>Upgrades that stay put</h3><p>Approval pins an exact revision and publishes it to your own Kiln GitHub repository. Editing makes a new draft. Install receipts record revision and destination.</p></article>
        <article class="v09-panel"><h3>Fast travel</h3><p>On another machine, open the repo and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>. Git status, sync and conflicts are handled in the app.</p></article>
        <article class="v09-panel"><h3>Character sheet</h3><p>CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config and more, edited in place with syntax checks and 30 private backups. Hooks never run.</p></article>
      </div>
    </section>

    <section class="v09-download" id="v09-download" aria-labelledby="v09-dl-title">
      <div class="v09-panel v09-dl">
        <div>
          <h2 id="v09-dl-title">Travel light.</h2>
          <p>${subscription.text} ${subscription.fine}</p>
        </div>
        <div class="v09-dl-action">
          <a class="v09-button" href="${installer}">${windowsMark}<span>Download the Windows installer</span></a>
          <small>${releaseNote} Builds are unsigned. Also ships an MIT-licensed CLI with JSON results.</small>
        </div>
      </div>
    </section>
  </main>
</div>`;

  const byId = new Map([...items, reward].map(item => [item.id, item]));
  const equipped = new Set(items.map(item => item.id));
  const known = new Set(equipped);
  const card = root.querySelector<HTMLElement>('.v09-card')!;
  const fill = root.querySelector<HTMLElement>('.v09-bar-fill')!;
  const meter = root.querySelector<HTMLElement>('.v09-bar')!;
  const num = root.querySelector<HTMLElement>('.v09-carry-num')!;
  const hud = root.querySelector<HTMLElement>('.v09-hud')!;
  const effect = root.querySelector<HTMLElement>('.v09-effect-text')!;
  const stash = root.querySelector<HTMLElement>('.v09-stash-list')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shown = 0;

  const weight = () => [...equipped].reduce((sum, id) => sum + byId.get(id)!.weight, 0);
  const animateNumber = (to: number) => {
    const from = shown, start = performance.now(), duration = reduced ? 0 : 700;
    const step = (now: number) => {
      const p = duration ? Math.min(1, (now - start) / duration) : 1;
      shown = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      num.textContent = String(shown);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const refresh = () => {
    const w = weight();
    fill.style.width = `${Math.min(100, w / scale * 100)}%`;
    meter.setAttribute('aria-valuenow', String(w));
    const over = w > capacity;
    hud.classList.toggle('is-over', over);
    effect.textContent = over ? 'Over-encumbered' : 'Travelling light';
    animateNumber(w);
  };
  const showCard = (item: Item, note = '') => {
    const on = equipped.has(item.id);
    card.className = `v09-card is-${item.rarity}`;
    card.innerHTML = `
      <p class="v09-card-rarity">${rarityLabel[item.rarity]}</p>
      <h3>${item.name}</h3>
      <p class="v09-card-meta"><span>Weight ${item.weight} <em>sample</em></span><span>${item.copies.length} ${item.copies.length === 1 ? 'copy' : 'copies'}</span></p>
      <p class="v09-card-used">${item.used}</p>
      <ul class="v09-card-copies">${item.copies.map(([path, state]) => { const shown = on ? state : item.rarity === 'unknown' || state === 'Edited outside Kiln' ? 'Moved to a private backup' : 'Removed'; return `<li><code>${path}</code><span class="${['Installed', 'Linked', 'Identical copy found'].includes(shown) ? '' : 'is-warn'}">${shown}</span></li>`; }).join('')}</ul>
      ${note ? `<p class="v09-card-note">${note}</p>` : ''}
      <p class="v09-card-action">${on ? 'Click to unequip: remove local copies.' : 'In your stash. Click it there to install again.'}</p>`;
  };
  const renderStash = () => {
    const off = [...byId.values()].filter(item => known.has(item.id) && !equipped.has(item.id));
    stash.innerHTML = off.length ? off.map(item => `<li>${itemButton(item).replace('Unequip', 'Install again')}</li>`).join('') : '<li class="v09-stash-empty">Nothing unequipped yet.</li>';
  };
  const unequip = (id: string) => {
    const item = byId.get(id)!;
    const button = root.querySelector<HTMLButtonElement>(`.v09-grid [data-id="${id}"]`);
    equipped.delete(id);
    const finish = () => { button?.parentElement && (button.parentElement.innerHTML = ''); renderStash(); refresh(); };
    if (button && !reduced) { button.classList.add('is-leaving'); setTimeout(finish, 320); } else finish();
    showCard(item, 'Local copies removed. Managed copies deleted; anything else moved to a private backup. The skill is still in your library.');
  };
  const equip = (id: string) => {
    const item = byId.get(id)!;
    const slot = Array.from(root.querySelectorAll<HTMLElement>('.v09-grid .v09-slot')).find(s => !s.children.length);
    if (!slot) return;
    equipped.add(id);
    known.add(id);
    slot.innerHTML = itemButton(item);
    slot.firstElementChild!.classList.add('is-arriving');
    renderStash();
    refresh();
    showCard(item, id === reward.id ? 'Approved revision 1 installed. A new agent session picks it up.' : 'The approved revision was installed again.');
  };

  const grid = root.querySelector<HTMLElement>('.v09-grid')!;
  grid.addEventListener('click', event => { const b = (event.target as HTMLElement).closest<HTMLButtonElement>('.v09-item'); if (b) unequip(b.dataset.id!); });
  const preview = (event: Event) => { const b = (event.target as HTMLElement).closest<HTMLButtonElement>('.v09-item'); if (b) showCard(byId.get(b.dataset.id!)!); };
  grid.addEventListener('mouseover', preview);
  grid.addEventListener('focusin', preview);
  stash.addEventListener('click', event => { const b = (event.target as HTMLElement).closest<HTMLButtonElement>('.v09-item'); if (b) equip(b.dataset.id!); });
  stash.addEventListener('mouseover', preview);
  showCard(items[0]);
  setTimeout(refresh, reduced ? 0 : 350);

  const go = root.querySelector<HTMLButtonElement>('.v09-quest-go')!;
  const objectives = Array.from(root.querySelectorAll<HTMLElement>('.v09-objectives li'));
  const rewardBox = root.querySelector<HTMLElement>('.v09-reward')!;
  go.addEventListener('click', () => {
    go.disabled = true;
    go.textContent = 'Quest in progress…';
    objectives.forEach(li => li.classList.remove('is-done', 'is-active'));
    objectives.forEach((li, i) => setTimeout(() => {
      objectives[i - 1]?.classList.replace('is-active', 'is-done');
      li.classList.add('is-active');
      if (i === objectives.length - 1) setTimeout(() => { li.classList.replace('is-active', 'is-done'); rewardBox.classList.remove('is-locked'); rewardBox.querySelector('.v09-lock')!.textContent = 'unlocked'; root.querySelector<HTMLButtonElement>('.v09-equip')!.disabled = false; go.textContent = 'Quest complete'; }, reduced ? 0 : 700);
    }, reduced ? 0 : i * 700));
  });
  root.querySelector<HTMLButtonElement>('.v09-equip')!.addEventListener('click', event => {
    const button = event.currentTarget as HTMLButtonElement;
    if (equipped.has(reward.id)) return;
    equip(reward.id);
    button.textContent = 'Equipped. Check your inventory';
    button.disabled = true;
  });
}
