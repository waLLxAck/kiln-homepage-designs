// PROTOTYPE variant 08 — Magazine cover. A glossy issue: the cover turns away as you scroll, revealing the contents and one feature spread per selling point.
import './style.css';
import { examples, installer, installs, provenance, releaseNote, subscription, windowsMark } from '../../content';

const contents = [
  { page: 12, id: 'v08-f-fifty', kicker: 'Habits', title: 'The 50 prompts you saved and never tried', dek: 'Why “later” never comes, and how to test one on your own repo before lunch.' },
  { page: 24, id: 'v08-f-folder', kicker: 'Investigation', title: 'Inside your skills folder: who’s really in there?', dek: 'Duplicates, drifters and a broken link. Every copy, named.' },
  { page: 38, id: 'v08-f-repo', kicker: 'Case study', title: 'We tested it on our own repo', dek: 'One prompt, one read-only run, one verdict, one revision.' },
  { page: 46, id: 'v08-f-approval', kicker: 'Trust', title: 'The approval issue', dek: 'Why the version you trust never changes under you.' },
  { page: 52, id: 'v08-f-edit', kicker: 'The edit', title: 'Four things worth keeping', dek: 'A shortcut, a video trick, a config drawer and no API key.' },
];

const saved = [
  'Try it as a seven-year-old', 'Find the instruction that went wrong', 'Playtest for what kills the fun', 'Repo and recent-PR briefing', 'Risk-first prototype plan',
  'Keep project memory specific', 'Review standards and spec separately', 'Judge variety by player decisions', 'Ask for the smallest instruction change', 'Write the failing test first',
  'Explain this codebase to a new hire', 'Rank ten quick wins', 'Find dead config', 'Summarise the last five PRs', 'Check the empty states',
];

const spotted = [
  { mono: 'CR', name: 'code-review', seen: 'Seen in three places. One copy edited outside Kiln.', tone: 'coral' },
  { mono: 'RS', name: 'research', seen: 'Approved, installed once. Behaving.', tone: 'green' },
  { mono: 'PH', name: 'pdf-helper', seen: 'Not in the library. Nobody remembers inviting it.', tone: 'ink' },
  { mono: 'RN', name: 'release-notes', seen: 'A draft from spring, still loaded every turn.', tone: 'sand' },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — The 50 prompts you saved and never tried';
  root.innerHTML = `
<div class="v08">
  <main id="main">
    <div class="v08-stage">
      <div class="v08-cover-wrap">
        <aside class="v08-side v08-side-l">
          <p class="v08-side-brand">Kiln</p>
          <p>A Windows app that tests the prompts you saved on your own repo, and keeps the skills that work organised, approved and installed where your agents look.</p>
          <a class="v08-buy" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <p class="v08-side-fine">Release 0.17.0 is in a private GitHub repository. Sign in with an account that has access.</p>
        </aside>
        <article class="v08-cover" aria-labelledby="v08-title">
          <div class="v08-cover-art" aria-hidden="true">
            <div class="v08-keys">
              <span class="v08-key is-space"><i>Space</i></span>
              <span class="v08-key is-shift"><i>Shift</i></span>
              <span class="v08-key is-ctrl"><i>Ctrl</i></span>
            </div>
          </div>
          <p class="v08-issue v08-in" style="--d:0">The skills issue <span>No. 0.17</span> <span>September 2026</span></p>
          <p class="v08-mast v08-in" style="--d:1" aria-hidden="true">KILN</p>
          <ul class="v08-lines">
            <li class="v08-in" style="--d:3"><strong>Inside your skills folder:</strong> who’s really in there?</li>
            <li class="v08-in" style="--d:4"><strong>We tested it</strong> on our own repo</li>
            <li class="v08-in" style="--d:5"><strong>Ctrl+Shift+Space</strong> the shortcut of the season</li>
            <li class="v08-in" style="--d:6"><strong>No API key</strong> your subscription, already paid for</li>
          </ul>
          <p class="v08-badge v08-in" style="--d:7"><span>Read-only</span> nothing in your code changes</p>
          <h1 id="v08-title" class="v08-main v08-in" style="--d:2"><span class="visually-hidden">Kiln: </span>The <em>50</em> prompts you saved and never tried</h1>
          <p class="v08-barcode v08-in" style="--d:8" aria-hidden="true"><span class="v08-bars">KILN0170</span><span>Windows edition</span></p>
          <p class="v08-cover-credit" aria-hidden="true">On the cover: Ctrl, Shift and Space, drawn in CSS</p>
        </article>
        <aside class="v08-side v08-side-r">
          <a class="v08-open" href="#v08-contents"><span>Open the issue</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a>
          <p>Scroll and the cover turns.</p>
        </aside>
      </div>

      <section class="v08-contents v08-page" id="v08-contents" aria-labelledby="v08-contents-title">
        <header class="v08-contents-head">
          <h2 id="v08-contents-title">Contents</h2>
          <p>September 2026. The skills issue.</p>
        </header>
        <ol class="v08-toc">
          ${contents.map(item => `<li><a href="#${item.id}"><span class="v08-toc-page">${item.page}</span><span class="v08-toc-kicker">${item.kicker}</span><span class="v08-toc-title">${item.title}</span><span class="v08-toc-dek">${item.dek}</span></a></li>`).join('')}
          <li><a href="#v08-back"><span class="v08-toc-page">60</span><span class="v08-toc-kicker">Back cover</span><span class="v08-toc-title">Kiln for Windows</span><span class="v08-toc-dek">Where to get this issue’s app, and what it needs.</span></a></li>
        </ol>
        <aside class="v08-oncover">
          <div class="v08-mini" aria-hidden="true"><span></span><span></span><span></span></div>
          <p><strong>On the cover.</strong> Ctrl, Shift and Space: Kiln’s global quick search, from anywhere in Windows. Ctrl+N captures. We’re told both are very much in.</p>
        </aside>
      </section>
    </div>

    <section class="v08-spread" id="v08-f-fifty" aria-labelledby="v08-fifty-title">
      <div class="v08-page v08-left v08-fifty-art">
        <p class="v08-folio">12</p>
        <p class="v08-fifty-num" aria-hidden="true">50</p>
        <ol class="v08-saved" aria-label="Sample of saved prompts">${saved.map(s => `<li>${s}</li>`).join('')}<li class="is-more">…and 35 more, some of them twice</li></ol>
        <p class="v08-caption">Sample: a reconstructed year of saving. Your numbers may be worse.</p>
      </div>
      <div class="v08-page v08-right">
        <p class="v08-kicker">Habits</p>
        <h2 id="v08-fifty-title">The 50 prompts you saved and never tried</h2>
        <p class="v08-dek">They’re in bookmarks, in chats, in a screenshot from X. Kiln is where one finally gets run.</p>
        <div class="v08-cols">
          <p class="v08-drop">Saving is easy; that’s the problem. You drop in text, a link, a screenshot or a file, press Ctrl+N or use the tray icon, and it lands in Kiln. “Save only” keeps it without calling a model. “Analyze and add” turns the source into prompts, insights, techniques, tools and resources, in a collection linked back to where it came from.</p>
          <p>Then the part the bookmark never offered: choose a local project or repository, or an isolated example, and run that exact prompt revision through Codex or Claude Code. You watch it live, with messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and token counts. Up to two runs at once; cancel or retry either.</p>
          <blockquote class="v08-pull">Experiments are read-only. Nothing in your code changes.</blockquote>
          <p>The output and the agent’s pass, fail or uncertain assessment are saved against the revision you ran. A task that needed edits or tools it didn’t have comes back uncertain, not dressed up as a success. The agent’s view and yours are kept apart: you decide what stays.</p>
        </div>
      </div>
    </section>

    <section class="v08-spread" id="v08-f-folder" aria-labelledby="v08-folder-title">
      <div class="v08-page v08-left">
        <p class="v08-folio">24</p>
        <p class="v08-kicker">Investigation</p>
        <h2 id="v08-folder-title">Inside your skills folder: who’s really in there?</h2>
        <p class="v08-dek">We went through <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and a project’s <code>.github/skills</code>. Some guests were expected.</p>
        <div class="v08-cols">
          <p class="v08-drop">Skills are folders, and folders multiply. The same skill turns up in a personal location, a shared one and a project, and one of the copies was edited by hand months ago. Kiln keeps one library of prompts, skills, custom agents and source notes, with collections, search, tags, favorites and filters.</p>
          <p>Import installed skills or a skills repository as drafts; the originals stay where they are. “Find skills and agents not in the library” scans your locations and offers safe cleanup of broken links and empty folders. For every skill you see each copy: installed, identical copy found, differs, linked, or edited outside Kiln. Compare it file by file with the approved version, or remove local copies in bulk. Managed copies are deleted; anything else moves to a private backup.</p>
          <p>Why bother? Every model-invoked skill’s description sits in your agent’s context on every turn, whether it fires or not. Forgotten and duplicate skills cost attention. Kiln doesn’t meter tokens per skill; it shows you what’s installed where, so you can keep only what earns its place.</p>
        </div>
      </div>
      <div class="v08-page v08-right v08-spotted">
        <h3>Spotted</h3>
        <ul class="v08-guests">${spotted.map(g => `<li><span class="v08-portrait is-${g.tone}" aria-hidden="true">${g.mono}</span><p><strong>${g.name}</strong>${g.seen}</p></li>`).join('')}</ul>
        <table class="v08-guestlist">
          <caption>The guest list: code-review, every copy</caption>
          <tbody>${installs.map(row => `<tr><th scope="row">${row.agent}</th><td><code>${row.path}</code></td><td class="${row.ok ? '' : 'is-drift'}">${row.state}</td></tr>`).join('')}</tbody>
        </table>
        <p class="v08-caption">Sample folder, sample guests.</p>
      </div>
    </section>

    <section class="v08-spread is-dark" id="v08-f-repo" aria-labelledby="v08-repo-title">
      <div class="v08-page v08-left">
        <p class="v08-folio">38</p>
        <p class="v08-kicker">Case study</p>
        <h2 id="v08-repo-title">We tested it on our own repo</h2>
        <p class="v08-dek">A sample run, shown the way Kiln records one. The prompt came from an agent workflow video.</p>
        <blockquote class="v08-prompt"><span>${examples[1].title}</span>${examples[1].prompt}</blockquote>
      </div>
      <div class="v08-page v08-right">
        <ol class="v08-timeline">
          <li><span>0:00</span><div><h3>Choose the repo</h3><p>A local repository, run through Claude Code. Read-only, so the agent can look but not touch.</p></div></li>
          <li><span>0:40</span><div><h3>Watch it think</h3><p>Reasoning summaries and commands scroll past live: it opens AGENTS.md, then CLAUDE.md, then the file it misread.</p></div></li>
          <li><span>2:10</span><div><h3>The verdict</h3><p>Output and assessment saved to revision 1. The agent says pass. We weren’t so sure, and our judgement is recorded separately.</p></div></li>
          <li><span>Rev 2</span><div><h3>Revise and run again</h3><p>One line changed, compared as a diff, run on the same repo. Now you can see which words changed the result. “Ask the agent” can discuss it with the source video’s context.</p></div></li>
          <li><span>Skill</span><div><h3>Keep it</h3><p>“Create skill” drafts a SKILL.md from the prompt with Kiln’s bundled writing-for-agents guidance, linked back to its source.</p></div></li>
        </ol>
        <dl class="v08-stats"><div><dt>Tokens in</dt><dd>38,204</dd></div><div><dt>Cached</dt><dd>21,550</dd></div><div><dt>Out</dt><dd>1,902</dd></div><div><dt>Effort</dt><dd>Medium</dd></div></dl>
        <p class="v08-caption">Sample figures. Every real run shows its own token usage, model and reasoning effort.</p>
      </div>
    </section>

    <section class="v08-spread" id="v08-f-approval" aria-labelledby="v08-approval-title">
      <div class="v08-page v08-left v08-approval-art">
        <p class="v08-folio">46</p>
        <ol class="v08-revs" aria-label="Sample revision history">
          ${provenance.map(p => `<li class="${p.state === 'Approved' ? 'is-approved' : ''}"><span class="v08-rev-state">${p.state}</span><strong>${p.event}</strong><span>${p.detail}</span></li>`).join('')}
        </ol>
      </div>
      <div class="v08-page v08-right">
        <p class="v08-kicker">Trust</p>
        <h2 id="v08-approval-title">The approval issue</h2>
        <p class="v08-dek">The version you reviewed is the version that gets installed. Every time.</p>
        <div class="v08-cols">
          <p class="v08-drop">Approval pins an exact revision. Edit the skill afterwards and you get a new draft; the approved one keeps its identity until you review again. Install always uses approved content, into compatible Codex, Claude Code or Copilot locations, and every install leaves a receipt with the revision and the destination.</p>
          <p>Approval also commits and publishes that snapshot to your own Kiln GitHub repository, in a standard layout, with validation that never executes skills. Git status, sync and conflict resolution live inside the app. On another machine, open the repo and press “Install everything marked for this machine”, or run <code>kiln skills sync</code>.</p>
          <blockquote class="v08-pull">Nothing is approved for you. Normal editing, approval and installation never call a model.</blockquote>
        </div>
      </div>
    </section>

    <section class="v08-edit" id="v08-f-edit" aria-labelledby="v08-edit-title">
      <div class="v08-page">
        <p class="v08-folio">52</p>
        <header><p class="v08-kicker">The edit</p><h2 id="v08-edit-title">Four things worth keeping</h2></header>
        <ul class="v08-edit-grid">
          <li><span class="v08-tag">Ctrl+Shift+Space</span><h3>The shortcut</h3><p>Global quick search from anywhere, plus Ctrl+N to capture and a tray icon for everything else.</p></li>
          <li><span class="v08-tag">Distill video</span><h3>The video trick</h3><p>Paste a YouTube link. Captions become reusable entries with timestamped source links, and the transcript stays attached.</p></li>
          <li><span class="v08-tag">30 backups</span><h3>The config drawer</h3><p>CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config. Edited in place with syntax checks and a diff before restore. Hooks are never run.</p></li>
          <li><span class="v08-tag">No API key</span><h3>The subscription</h3><p>${subscription.text} ${subscription.fine}</p></li>
        </ul>
        <p class="v08-edit-foot">Also in the bag: an MIT-licensed CLI for collections, experiments, approvals and installs, with JSON results your agents can read.</p>
      </div>
    </section>

    <section class="v08-back" id="v08-back" aria-labelledby="v08-back-title">
      <p class="v08-folio">60</p>
      <div class="v08-thumb" aria-hidden="true"><span class="v08-thumb-mast">KILN</span><span class="v08-thumb-line">The <b>50</b> prompts you saved and never tried</span><div class="v08-mini"><span></span><span></span><span></span></div></div>
      <p class="v08-back-kicker">Advertisement, of sorts</p>
      <h2 id="v08-back-title">Kiln <em>for Windows</em></h2>
      <p class="v08-back-line">Test the prompt. Keep the skill.</p>
      <a class="v08-buy is-big" href="${installer}">${windowsMark}<span>Download the installer</span></a>
      <p class="v08-back-fine">${releaseNote} Builds are unsigned. Needs a signed-in Codex or Claude Code, and the library is backed by a GitHub repository Kiln creates with the official gh CLI.</p>
    </section>
  </main>
</div>`;

  const wrap = root.querySelector<HTMLElement>('.v08-cover-wrap')!;
  const cover = root.querySelector<HTMLElement>('.v08-cover')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => cover.classList.add('is-in'));
  if (reduced) { wrap.classList.add('is-static'); return; }
  let ticking = false;
  const update = () => {
    ticking = false;
    const p = Math.min(1, Math.max(0, scrollY / (innerHeight * .75)));
    cover.style.setProperty('--turn', String(p));
    wrap.style.setProperty('--turn', String(p));
    wrap.classList.toggle('is-turned', p >= 1);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}
