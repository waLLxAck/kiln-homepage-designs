// PROTOTYPE variant 50 — Field guide. A naturalist's guide to the creatures in your skills folder; a lens reveals field annotations.
import './style.css';
import { art, defs } from './art';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Note = { x: number; y: number; r: number; t: string };
type Plate = { id: string; num: string; name: string; latin: string; habitat: string; spot: string; diet: string; remedy: string; verbs: string[]; notes: Note[]; alt: string };

const plates: Plate[] = [
  { id: 'duplicate', num: 'I', name: 'The Duplicate Copy', latin: 'Duplicatus agentis', alt: 'Two identical green beetles, one faint like a ghost of the other.',
    habitat: 'Pairs up across <code>~/.claude/skills</code> and <code>~/.agents/skills</code>, the folder Codex, Copilot and others share. Often a third lives in a project’s <code>.github/skills</code>.',
    spot: 'Two specimens with the same markings in two places. Kiln lists every installed copy of a skill across your personal locations and enrolled projects and marks this one “identical copy found”.',
    diet: 'Each model-invoked copy puts its description into the agent’s context on every turn, so a pair costs twice, whether it fires or not.',
    remedy: 'Keep the library entry and remove the extra copies in bulk. Managed copies are deleted; anything Kiln didn’t install is moved to a private backup first.',
    verbs: ['See every copy', 'Remove local copies'],
    notes: [{ x: 8, y: 14, r: -5, t: 'same SKILL.md, loaded twice' }, { x: 58, y: 78, r: 3, t: 'the ghost one lives in ~/.agents' }, { x: 64, y: 12, r: 4, t: 'identical copy found ✓' }] },
  { id: 'drifted', num: 'II', name: 'The Drifted Copy, edited outside Kiln', latin: 'Mutatio silens', alt: 'An ochre moth whose right wings carry different markings from its left.',
    habitat: 'Wherever someone opened a SKILL.md in an editor and fixed “just one line”. Common in <code>~/.claude/skills</code>.',
    spot: 'Look closely at the wings: the right side no longer matches the left. Kiln marks the copy “edited outside Kiln” and shows exactly where it differs.',
    diet: 'The same context as its healthy cousin, with instructions nobody reviewed.',
    remedy: 'Compare the installed copy file by file with the approved revision. Then install the approved revision again, or bring the change into the library as a new draft and review it properly.',
    verbs: ['Compare file by file', 'Install approved revision'],
    notes: [{ x: 60, y: 10, r: 4, t: 'these spots are new!' }, { x: 6, y: 80, r: -4, t: 'left wing = approved rev 2' }, { x: 64, y: 84, r: 2, t: '“just one line”, apparently' }] },
  { id: 'bookmark', num: 'III', name: 'The Forgotten Bookmark', latin: 'Promptus postponendus', alt: 'A slow snail whose shell is a rolled bookmark ribbon.',
    habitat: 'Browser bookmarks, “read later” lists, chat histories, screenshot folders and notes titled “try this”. Rarely seen in a repository.',
    spot: 'Moves very slowly. Usually found months after it was saved, still untested. Trails a ribbon marked “later”.',
    diet: 'Good intentions.',
    remedy: 'Capture it with Ctrl+N, or distill the whole video into entries with timestamped source links. Then run the exact prompt on your own repo through Codex or Claude Code. Experiments are read-only, and the agent’s pass, fail or uncertain assessment is saved against that revision. You decide whether it stays.',
    verbs: ['Capture', 'Test on your repo'],
    notes: [{ x: 6, y: 12, r: -6, t: 'saved in March. it is not March.' }, { x: 60, y: 84, r: 3, t: 'ribbon reads: LATER' }, { x: 66, y: 16, r: 5, t: 'speed: very slow' }] },
  { id: 'stale', num: 'IV', name: 'The Stale Draft', latin: 'Draftus perpetuus', alt: 'Rust and ochre mushrooms growing on a curling sheet of paper.',
    habitat: 'Grows on skills that were edited after approval and never looked at again.',
    spot: 'A draft that is newer than the approved revision, with no experiment attached. Kiln shows the revision history and the diff between them.',
    diet: 'Nothing, yet. Installs always use approved content, so a draft stays in the library until you approve it.',
    remedy: 'Compare the draft with the approved revision, test it on the same repo, and approve the exact revision you trust. Approval commits and publishes that snapshot to your own Kiln GitHub repository. Editing again starts a new draft; it never replaces the approved one.',
    verbs: ['Compare revisions', 'Approve exact revision'],
    notes: [{ x: 6, y: 14, r: -4, t: 'rev 3, never tested' }, { x: 58, y: 10, r: 5, t: 'approved rev 2 still installed' }, { x: 12, y: 84, r: 2, t: 'harmless, but it spreads' }] },
  { id: 'broken', num: 'V', name: 'The Broken Link', latin: 'Nexus fractus', alt: 'A green lizard with its tail lying apart from its body.',
    habitat: 'Symlinked skills in <code>~/.agents/skills</code> whose target was moved or deleted, and the empty folders left behind.',
    spot: 'The tail is still there. The body it pointed to is not.',
    diet: 'Attention, every time you wonder why a skill isn’t loading.',
    remedy: '“Find skills and agents not in the library” scans your locations and offers safe cleanup of broken links and empty folders.',
    verbs: ['Scan locations', 'Clean up safely'],
    notes: [{ x: 56, y: 16, r: 4, t: 'points to a folder that moved' }, { x: 6, y: 78, r: -3, t: 'body: gone since the last reinstall' }] },
  { id: 'stray', num: 'VI', name: 'The Stray', latin: 'Vagans importandus', alt: 'A hedgehog curled in front of an open folder.',
    habitat: 'Any skills folder or skills repository. Often perfectly healthy, just never catalogued.',
    spot: 'Works fine, belongs to nobody, and you’re not sure where it came from.',
    diet: 'A line of context on every turn, like the rest.',
    remedy: 'Import installed skills or a whole skills repository as drafts. The originals stay exactly where they are while you review, test and approve.',
    verbs: ['Import as drafts', 'Review'],
    notes: [{ x: 8, y: 12, r: -5, t: 'friendly. unreviewed.' }, { x: 60, y: 82, r: 3, t: 'originals stay put on import' }] },
];

const bg = (p: Plate) => `<g filter="url(#v50-wc)" aria-hidden="true"><ellipse cx="-10" cy="10" rx="150" ry="92" class="v50-w v50-moss" opacity=".22"/><ellipse cx="40" cy="-20" rx="90" ry="60" class="v50-w v50-ochre" opacity=".12"/></g><text x="-160" y="-100" class="v50-art-corner">Pl. ${p.num}</text><g class="v50-scale"><path d="M110 104 h40 M110 100 v8 M130 102 v4 M150 100 v8" class="v50-l"/><text x="130" y="96" text-anchor="middle" class="v50-art-corner">1 cm</text></g>`;
const figure = (p: Plate) => `
  <figure class="v50-plate" data-plate="${p.id}">
    <div class="v50-frame">
      <svg class="v50-art" viewBox="-170 -118 340 236" role="img" aria-label="${p.alt}">${bg(p)}${art[p.id]}</svg>
      <div class="v50-reveal" aria-hidden="true">
        <svg class="v50-art v50-zoom" viewBox="-170 -118 340 236">${bg(p)}${art[p.id]}</svg>
        ${p.notes.map(n => `<span class="v50-note" style="left:${n.x}%;top:${n.y}%;--r:${n.r}deg">${n.t}</span>`).join('')}
      </div>
      <span class="v50-lens" aria-hidden="true"></span>
    </div>
    <figcaption><span>Plate ${p.num}.</span> ${p.name}. <i>${p.latin}</i></figcaption>
    <button type="button" class="v50-reveal-btn" aria-pressed="false">Show field notes</button>
    <ul class="visually-hidden">${p.notes.map(n => `<li>Field note: ${n.t}</li>`).join('')}</ul>
  </figure>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — A field guide to the creatures in your skills folder';
  root.innerHTML = `${defs}
<div class="v50">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v50-top">
    <a class="v50-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v50-plates">The plates</a><a href="#v50-kit">Equipment</a><a href="#v50-obtain">Obtain Kiln</a></nav>
  </header>
  <main id="main">
    <section class="v50-title" aria-labelledby="v50-h1">
      <div class="v50-title-text">
        <p class="v50-kicker">A field guide</p>
        <h1 id="v50-h1">The creatures living in your skills folder</h1>
        <p class="v50-sub">and how Kiln deals with each of them</p>
        <p class="v50-lede">Kiln is a Windows app for developers who use Codex, Claude Code and Copilot. It keeps your prompts and agent skills in one library, shows every copy installed on your machine, and helps you catch, compare, test and release what you find.</p>
        <p class="v50-cta-row"><a class="v50-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a><a class="v50-link" href="#v50-plates">Turn to plate I</a></p>
      </div>
      <figure class="v50-frontis">
        <div class="v50-frame"><svg class="v50-art" viewBox="-200 -130 400 260" role="img" aria-label="Frontispiece: an open folder in the undergrowth, with beetles and a moth living in it.">${art.habitat}</svg></div>
        <figcaption><span>Frontispiece.</span> A typical habitat, with residents. Sample folder.</figcaption>
      </figure>
    </section>

    <section class="v50-howto" aria-labelledby="v50-how-t">
      <h2 id="v50-how-t">How to use this guide</h2>
      <p>Each plate shows one creature, where it lives, how to spot it and what Kiln does about it. Hold the lens over a plate to read the field notes in the margin. On a touch screen, tap the plate. Skills live in more places than you’d think: <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and each project’s <code>.github/skills</code>, plus prompts buried in chats, notes and bookmarks.</p>
    </section>

    <div class="v50-plates" id="v50-plates">
      ${plates.map((p, i) => `
      <article class="v50-entry ${i % 2 ? 'is-flip' : ''}" aria-labelledby="v50-${p.id}-t">
        ${figure(p)}
        <div class="v50-text">
          <p class="v50-plate-no">Plate ${p.num}</p>
          <h2 id="v50-${p.id}-t">${p.name}</h2>
          <p class="v50-latin">${p.latin}</p>
          <dl class="v50-dl">
            <div><dt>Habitat</dt><dd>${p.habitat}</dd></div>
            <div><dt>How to spot it</dt><dd>${p.spot}</dd></div>
            <div><dt>Feeds on</dt><dd>${p.diet}</dd></div>
            <div class="v50-remedy"><dt>How Kiln deals with it</dt><dd>${p.remedy}<span class="v50-verbs">${p.verbs.map(v => `<b>${v}</b>`).join('')}</span></dd></div>
          </dl>
        </div>
      </article>`).join('')}
    </div>

    <section class="v50-specimen" aria-labelledby="v50-spec-t">
      <div class="v50-spec-text">
        <p class="v50-plate-no">Plate VII</p>
        <h2 id="v50-spec-t">A healthy specimen</h2>
        <p class="v50-latin">Promptus probatus, the tested prompt</p>
        <p>What you’re breeding for. Collected from a video, run on a real repository, kept with its evidence. When a prompt keeps earning its place, “Create skill” drafts a SKILL.md from it using Kiln’s bundled writing-for-agents guidance, and you approve and install it into Codex, Claude Code or Copilot locations.</p>
        <p>Every run shows its activity live (messages, reasoning summaries, commands, model, effort, elapsed time) and its token usage. The agent’s assessment is kept apart from your own judgement.</p>
      </div>
      <div class="v50-card" role="group" aria-label="Pinned specimen card">
        <span class="v50-pin" aria-hidden="true"></span><span class="v50-pin v50-pin-2" aria-hidden="true"></span>
        <p class="v50-card-title">${examples[0].title}</p>
        <blockquote>${examples[0].prompt}</blockquote>
        <dl class="v50-label">
          <div><dt>Collected</dt><dd>${examples[0].source}</dd></div>
          <div><dt>Tested on</dt><dd>kids-app, read-only, Claude Code</dd></div>
          <div><dt>Agent’s verdict</dt><dd>pass</dd></div>
          <div><dt>Keeper’s verdict</dt><dd>keep</dd></div>
        </dl>
        <p class="v50-card-fine">A real prompt from a Kiln library, shortened. Run details are a sample.</p>
        <span class="v50-hand v50-card-note" aria-hidden="true">not a pest!</span>
      </div>
    </section>

    <section class="v50-kit" id="v50-kit" aria-labelledby="v50-kit-t">
      <h2 id="v50-kit-t">Equipment for the field</h2>
      <ol class="v50-kit-list">
        <li><h3>The collecting jar</h3><p>One library for prompts, skills, custom agent definitions, source notes, insights, techniques, tools and resources. Collections, search, tags, favorites and filters by kind, status, provider, location, copy state, scope and tag. Archive, trash, restore, undo.</p></li>
        <li><h3>The specimen log</h3><p>Revision history and diffs for every entry. Approval pins an exact revision; installs always use approved content, with receipts that record revision and destination.</p></li>
        <li><h3>The home herbarium</h3><p>Approvals are committed to your own Kiln GitHub repository in a standard layout, validated without executing a skill. Git status, sync and conflict resolution are built in.</p></li>
        <li><h3>The second field station</h3><p>On another machine, open the repository and press “Install everything marked for this machine”, or run <code>kiln skills sync</code> from the CLI.</p></li>
        <li><h3>The notebook</h3><p>CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, permissions, VS Code settings and shell profiles, edited in place with syntax checks, 30 private backups and restore. Kiln never executes hooks.</p></li>
        <li><h3>The guide you already carry</h3><p>${subscription.text} ${subscription.fine}</p></li>
      </ol>
    </section>

    <section class="v50-obtain" id="v50-obtain" aria-labelledby="v50-ob-t">
      <h2 id="v50-ob-t">Take Kiln into the field</h2>
      <p>Start with a scan of your own folders. Most people find at least one of the creatures above.</p>
      <a class="v50-btn v50-btn-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
      <p class="v50-note-small">${releaseNote}</p>
      <p class="v50-note-small">Unsigned build, so Windows may ask you to confirm. MIT licensed. Setup creates your library’s GitHub repository with the official gh CLI.</p>
    </section>
  </main>
</div>`;

  const coarse = matchMedia('(hover: none)').matches;
  root.querySelectorAll<HTMLElement>('.v50-plate').forEach(plate => {
    const frame = plate.querySelector<HTMLElement>('.v50-frame')!;
    const btn = plate.querySelector<HTMLButtonElement>('.v50-reveal-btn')!;
    const setOpen = (open: boolean) => {
      plate.classList.toggle('is-open', open);
      btn.setAttribute('aria-pressed', String(open));
      btn.textContent = open ? 'Hide field notes' : 'Show field notes';
    };
    frame.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const r = frame.getBoundingClientRect();
      frame.style.setProperty('--mx', `${e.clientX - r.left}px`);
      frame.style.setProperty('--my', `${e.clientY - r.top}px`);
      plate.classList.add('is-lens');
    });
    frame.addEventListener('pointerleave', () => plate.classList.remove('is-lens'));
    frame.addEventListener('click', e => {
      if ((e as PointerEvent).pointerType === 'mouse' && !coarse) return;
      setOpen(!plate.classList.contains('is-open'));
    });
    btn.addEventListener('click', () => setOpen(!plate.classList.contains('is-open')));
  });
}
