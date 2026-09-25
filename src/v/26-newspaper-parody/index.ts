// PROTOTYPE variant 23 — The Daily Kiln. A front-page newspaper parody that spins in on load.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

const playtest = examples[2];

const headlines = [
  { h: 'Local developer finally tries bookmarked prompt', deck: 'Idea saved “for the weekend” runs on a real repository in one evening; nothing in the code was changed, it is confirmed' },
  { h: 'Prompt run on real repo; code left untouched', deck: 'Read-only experiment inspects the game, reports back, and edits nothing, to the visible relief of everyone involved' },
  { h: '“Uncertain” verdict proves honest; one edit later, a pass', deck: 'Agent declines to fake a success it could not check; revised prompt passes on the same repository' },
  { h: 'Bookmarks folder shrinks for first time in living memory', deck: 'Residents report one saved prompt tested, one kept as a skill, and the rest facing the same treatment “this weekend”' },
];

const classifieds = [
  { h: 'Wanted', t: 'One repo to test a prompt on. Read-only. Nothing in your code changes. Apply within.' },
  { h: 'For hire', t: 'Codex or Claude Code, already signed in on your machine. No API key. No extra API bill. Subscription usage limits apply.' },
  { h: 'Lost', t: 'The version that worked. Last seen before an edit. <em>Found:</em> Kiln keeps every revision, and approval pins the exact one.' },
  { h: 'Situation wanted', t: 'Experienced prompt seeks permanent position as skill. Tested on a real repo. SKILL.md drafted from bundled writing-for-agents guidance. Linked back to its source.' },
  { h: 'Moving house?', t: 'Open your Kiln repository on the new machine and press “Install everything marked for this machine.” Or type <code>kiln skills sync</code>.' },
  { h: 'Found', t: 'Three copies of one skill across <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and a project’s <code>.github/skills</code>. Owner may compare file by file, or remove local copies in bulk.' },
  { h: 'Public notice', t: 'Kiln never executes your hooks. Config files are edited in place, with syntax checks, 30 private backups and a diff before restore.' },
  { h: 'Two for one', t: 'Run up to two experiments at once. Cancel or retry either. Watch messages, commands and tokens live.' },
  { h: 'Tutoring', t: 'Learn prompting by doing. Edit, compare the diff, run again on the same repo, and see what changed the result.' },
  { h: 'Personal', t: 'Scripting type with a CLI seeks agents to read the library. Collections, experiments, approvals, installs. Replies in JSON.' },
];

const halftone = `
<svg class="v23-photo-art" viewBox="0 0 480 300" role="img" aria-label="Illustration: a laptop on a desk showing a Kiln run with a live activity log, token counts and the verdict Pass.">
  <defs>
    <pattern id="v23-dots-lo" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#1a1814"/></pattern>
    <pattern id="v23-dots-mid" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.8" fill="#1a1814"/></pattern>
    <pattern id="v23-dots-hi" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.6" fill="#1a1814"/></pattern>
    <pattern id="v23-lines" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="5" stroke="#1a1814" stroke-width="1.6"/></pattern>
  </defs>
  <rect width="480" height="300" fill="url(#v23-dots-lo)"/>
  <rect y="214" width="480" height="86" fill="url(#v23-dots-mid)"/>
  <rect x="340" y="36" width="96" height="140" fill="url(#v23-lines)" opacity=".7"/>
  <path d="M96 36h288a10 10 0 0 1 10 10v156H86V46a10 10 0 0 1 10-10z" fill="#1a1814"/>
  <rect x="100" y="50" width="280" height="140" fill="#f1ead8"/>
  <rect x="100" y="50" width="280" height="18" fill="url(#v23-dots-mid)"/>
  <g font-family="'P DM Mono', monospace" font-size="9" fill="#1a1814">
    <text x="108" y="84">› Reading src/game/loop.ts</text>
    <text x="108" y="98">› Reading levels/01.json</text>
    <text x="108" y="112">› Tracing jump input</text>
    <text x="108" y="126">› Ranking ten improvements</text>
    <text x="108" y="150">in 46.2k  cached 39.0k  out 4.2k</text>
  </g>
  <rect x="290" y="80" width="78" height="48" fill="#1a1814"/>
  <text x="329" y="100" text-anchor="middle" font-family="'P Playfair Display', serif" font-size="10" fill="#f1ead8">VERDICT</text>
  <text x="329" y="119" text-anchor="middle" font-family="'P Playfair Display', serif" font-weight="900" font-size="18" fill="#f1ead8">PASS</text>
  <rect x="108" y="164" width="120" height="16" fill="url(#v23-dots-hi)"/>
  <path d="M60 202h360l24 22H36z" fill="#1a1814"/>
  <path d="M60 202h360l24 22H36z" fill="url(#v23-dots-mid)" opacity=".4"/>
  <rect x="30" y="140" width="40" height="64" rx="4" fill="url(#v23-dots-hi)"/>
  <path d="M30 150c-14 0-14 30 0 30" fill="none" stroke="#1a1814" stroke-width="4"/>
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'The Daily Kiln — Local developer finally tries bookmarked prompt';
  root.innerHTML = `
<div class="v23">
  <a class="skip" href="#v23-lead">Skip to the lead story</a>
  <article class="v23-paper" aria-labelledby="v23-head">
    <header class="v23-mast">
      <div class="v23-ear v23-ear-l"><strong>Weather</strong><p>Heavy bookmarks overnight. Scattered screenshots by morning. Clearing into tested prompts by evening.</p></div>
      <div class="v23-title"><p class="v23-motto">“All the prompts that are fit to run”</p><p class="v23-name">The Daily Kiln</p></div>
      <div class="v23-ear v23-ear-r"><strong>Late final</strong><p>Windows edition. Free and MIT licensed.</p><button type="button" class="v23-stop">Stop the presses</button></div>
    </header>
    <div class="v23-strip"><span>Vol. 0, No. 17</span><span>Release 0.17.0</span><span>Printed on your machine</span></div>

    <div class="v23-front">
      <section class="v23-lead" id="v23-lead" aria-labelledby="v23-head">
        <h1 id="v23-head" class="v23-headline">${headlines[0].h}</h1>
        <div class="v23-lead-top">
          <div class="v23-lead-intro">
            <p class="v23-deck">${headlines[0].deck}</p>
            <p class="v23-byline">By our productivity correspondent</p>
            <p class="v23-what">Kiln is a Windows app that runs the prompts you saved on your own repository, read-only, keeps the result, and turns the ones that work into skills for Claude Code, Codex and Copilot.</p>
            <a class="v23-btn v23-btn-s" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
            <p class="v23-fine">Private GitHub release: sign in with an account that has access.</p>
          </div>
          <figure class="v23-photo">${halftone}<figcaption>The second run, as it happened. Agent assessment: uncertain on the first try, pass after one edit. Illustration; numbers are a sample.</figcaption></figure>
        </div>
        <div class="v23-cols v23-lead-body">
          <p class="v23-drop"><span class="v23-dateline">YOUR DESK —</span> A developer who saved a prompt about playtesting a game “to try this weekend” finally ran it last night, ending what neighbours described as a long and quiet period of meaning to.</p>
          <p>The prompt had been sitting in a bookmarks folder beside a seventy-minute video nobody watched past minute four. It reads, in full:</p>
          <blockquote class="v23-pull">${playtest.prompt}</blockquote>
          <p>It was pasted into Kiln, a Windows desktop app, with Ctrl+N. The developer then chose the game’s own repository and ran that exact revision of the prompt through Claude Code, the copy already signed in on the machine. No API key was issued and no extra bill arrived, though subscription usage limits, it was noted, still apply.</p>
          <p>The run could be watched as it happened: messages, reasoning summaries, each command, web searches, the model, its reasoning effort, the elapsed time, and token counts for input, cached and output. The experiment was read-only. Nothing in the code changed.</p>
          <p>The first run came back <em>uncertain</em>. The agent could not play the game and said so, rather than claiming a success it hadn’t earned. The developer edited one line to point it at the level data, compared the two revisions as a diff, and ran it again on the same repository. The second run passed, with a ranked list of ten improvements and a note of what it could not check.</p>
          <p>Revision 2 was then approved, published to the developer’s own Kiln repository on GitHub, and installed as a skill for Claude Code. A new agent session picked it up the same evening.</p>
          <p>Asked about the rest of the bookmarks, the developer said they would get to them this weekend. This newspaper will be following up.</p>
        </div>
      </section>

      <aside class="v23-side" aria-label="Other front-page stories">
        <article class="v23-story">
          <h2 class="v23-h2">Skills folder found to contain three copies of the same skill</h2>
          <p class="v23-deck v23-deck-s">One had been edited by hand; owner unaware</p>
          <p>An inspection of <code>~/.claude/skills</code>, <code>~/.agents/skills</code> and a project’s <code>.github/skills</code> turned up the same code review skill three times, one of them changed outside Kiln.</p>
          <p>Kiln shows every installed copy across personal locations and enrolled projects, marked installed, identical copy found, differs, linked, or edited outside Kiln. A copy can be compared with the approved version file by file. Local copies can be removed in bulk: managed ones deleted, the rest moved to a private backup.</p>
          <p>Worth knowing: each model-invoked skill’s description sits in the agent’s context on every turn, whether it fires or not, so forgotten duplicates spend tokens and attention for nothing.</p>
        </article>
        <article class="v23-story v23-story-boxed">
          <h2 class="v23-h2">Agent assessment and human verdict disagree; human wins</h2>
          <p>The agent marked the run a pass. The developer, having read the output, was less sure. Under house rules, the agent’s pass, fail or uncertain is saved with the output against that exact revision, and kept separate from the human’s judgement. The human decides what gets kept.</p>
          <p>Tasks that need edits or tools the agent doesn’t have come back uncertain, not dressed up as successes.</p>
        </article>
        <article class="v23-story v23-opinion">
          <h2 class="v23-h3">Opinion: a bookmark is not a plan</h2>
          <p>Saving a prompt feels like progress. It isn’t, until it has run on your code and you have read what came back. The fastest way to get better at prompting is to try the thing, change one line, and try it again on the same repo. Kiln keeps each revision and each result side by side, so the lesson sticks.</p>
        </article>
        <div class="v23-index">
          <strong>Inside today</strong>
          <ol><li><a href="#v23-below">Video reduced to entries</a><span>2</span></li><li><a href="#v23-below">Approval pins revision</a><span>3</span></li><li><a href="#v23-below">Prompt promoted to skill</a><span>4</span></li><li><a href="#v23-classifieds">Classifieds</a><span>6</span></li><li><a href="#v23-coupon">Subscription coupon</a><span>8</span></li></ol>
        </div>
      </aside>
    </div>

    <div class="v23-fold" aria-hidden="true"></div>

    <section class="v23-below" id="v23-below" aria-label="More news">
      <article><h2 class="v23-h3">Hour-long video reduced to timestamped entries</h2><p>Readers who paste a YouTube link and press “Distill video” get its captions turned into a collection of prompts, techniques, tools and insights, each with a timestamped link back to the moment it came from. The transcript stays attached. Screenshots, posts, links and files go in the same way; “Save only” keeps them without calling a model.</p></article>
      <article><h2 class="v23-h3">Approval pins exact revision; edits filed as new drafts</h2><p>Approving a skill commits and publishes that snapshot to your own Kiln GitHub repository, with validation that never executes skills. Editing afterwards creates a new draft and never replaces the approved one. Installs always use approved content, and each leaves a receipt with revision and destination.</p></article>
      <article><h2 class="v23-h3">Prompt promoted to skill after passing trial</h2><p>“Create skill” drafts a SKILL.md from a prompt, image or note, using Kiln’s bundled writing-for-agents guidance, and links it back to the source. Once approved, it installs into Codex, Claude Code or Copilot locations. “Ask the agent” remains available for questions about any item and its source video.</p></article>
      <article><h2 class="v23-h3">Library opens its doors</h2><p>Prompts, skills, custom agents in native Codex, Claude Code and Copilot formats, source notes, insights and tools now share one library, with collections, tags, favorites, filters and search. Existing skills can be imported as drafts; the originals stay where they are. Archive, trash and undo remain open late.</p></article>
    </section>

    <section class="v23-classifieds" id="v23-classifieds" aria-labelledby="v23-cl-title">
      <h2 id="v23-cl-title" class="v23-cl-head">Classified advertisements</h2>
      <div class="v23-cl-grid">${classifieds.map(c => `<div class="v23-ad"><h3>${c.h}</h3><p>${c.t}</p></div>`).join('')}</div>
    </section>

    <section class="v23-coupon" id="v23-coupon" aria-labelledby="v23-coupon-title">
      <div class="v23-coupon-inner">
        <svg class="v23-scissors" viewBox="0 0 40 24" aria-hidden="true"><circle cx="7" cy="6" r="4.5"/><circle cx="7" cy="18" r="4.5"/><path d="M10.5 8.5 38 20M10.5 15.5 38 4"/></svg>
        <h2 id="v23-coupon-title">Clip and keep: Kiln 0.17.0 for Windows</h2>
        <p>One desktop app and a CLI. Uses the Codex or Claude Code you’re signed into. Your library is backed by a GitHub repository Kiln creates for you with the official <code>gh</code> CLI.</p>
        <a class="v23-btn" href="${installer}">${windowsMark}<span>Download the Windows installer</span></a>
        <p class="v23-fine">${releaseNote} Builds are unsigned.</p>
      </div>
    </section>
    <footer class="v23-foot"><span>The Daily Kiln is not a real newspaper.</span><span>Kiln is a real app.</span></footer>
  </article>
</div>`;

  const paper = root.querySelector<HTMLElement>('.v23-paper')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spin = () => { if (reduce) return; paper.classList.remove('is-spinning'); void paper.offsetWidth; paper.classList.add('is-spinning'); };
  spin();
  let n = 0;
  root.querySelector('.v23-stop')!.addEventListener('click', () => {
    n = (n + 1) % headlines.length;
    const apply = () => {
      root.querySelector('#v23-head')!.textContent = headlines[n].h;
      root.querySelector('.v23-lead .v23-deck')!.textContent = headlines[n].deck;
    };
    if (reduce) return apply();
    paper.classList.remove('is-spinning');
    paper.classList.add('is-out');
    setTimeout(() => { apply(); paper.classList.remove('is-out'); spin(); }, 420);
  });
}
