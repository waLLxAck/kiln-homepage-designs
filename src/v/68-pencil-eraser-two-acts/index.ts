// PROTOTYPE H02: graphite on graph paper for the mess, a dark crisp Kiln for the fix. Two acts, told separately:
// 1. provider folders pencilled on the paper; an eraser rubs them out and every skill pops into its row on the Kiln panel.
// 2. "so how do I add new skills?": drag a taped-on source into Kiln, drag the prompt into a test, approve it onto the same panel.
import './style.css';
import { installer } from '../../content';
import { graphiteDefs, numeral } from './art';
import { bindPanel, panelMarkup } from './panel';
import { bindPipeline, pipelineMarkup } from './pipeline';
import { bindStage } from './stage';

const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download for Windows') => `<a class="h02-button" href="${installer}">${windows}<span>${text}</span></a>`;

export function render(root: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Screenshots (webdriver) and reduced motion get a still layout: the drawing above the finished panel. Real visitors get the eraser.
  const still = reduced || navigator.webdriver;
  document.title = 'Kiln: my agents were loading skills I forgot I had';
  root.innerHTML = `<div class="h02">
    ${graphiteDefs()}
    <header class="h02-top">
      <a class="h02-brand" href="#main"><span class="h02-brand-mark" aria-hidden="true"></span>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h02-p1">The folders</a><a href="#h02-p2">New skills</a><a href="#h02-get">Download</a></nav>
    </header>
    <main id="main">
      <section class="h02-hero" aria-labelledby="h02-title">
        <h1 id="h02-title" class="h02-pencil">My agents were loading skills I forgot I had.</h1>
        <div class="h02-hero-side">
          <p>Five folders. The same code-review in four of them, one copy I’d edited by hand, and a link to nothing. Kiln is a Windows app that finds every skill Codex, Claude Code and Copilot can see, and gives each one a switch per folder.</p>
          <div class="h02-cta">${download()}<a class="h02-scrawl h02-pencil" href="#h02-p1">or rub out the mess below</a></div>
          <p class="h02-fine">Kiln 0.17.0. The release is in a private GitHub repository, so sign in with an account that has access.</p>
        </div>
      </section>

      <section class="h02-act h02-p1" id="h02-p1" aria-labelledby="h02-p1-title">
        <div class="h02-act-copy">
          ${numeral(1, 31)}
          <h2 id="h02-p1-title" class="h02-pencil">Five folders, all of them loading.</h2>
          <p>Every skill’s description sits in your agent’s context on every turn, used or not. Kiln puts every copy on one panel: one row per skill, one switch per place.</p>
          <button type="button" class="h02-button h02-erase-btn" data-erase aria-controls="h02-panel">Rub out the mess</button>
          <p class="h02-act-note">Then flip a switch. Amber means a copy differs from what you approved. Switching off what you don’t use keeps context lean; Kiln doesn’t measure tokens per skill.</p>
        </div>
        <div class="h02-board" data-board data-state="mess">
          <div class="h02-mess" data-mess role="img" aria-label="Pencil sketch of five skill folders: ~/.claude/skills, ~/.agents/skills, ~/.codex/skills, ~/.copilot/skills and my-game/.github/skills. code-review appears four times, one copy edited by hand; research has an older copy; pr-summary nobody remembers; old-link links to nothing; the codex folder is empty.">
            <svg class="h02-overlay" data-overlay aria-hidden="true"></svg>
            <div class="h02-chips" data-chips aria-hidden="true"></div>
          </div>
          ${panelMarkup()}
          <div class="h02-crumbs" data-crumbs aria-hidden="true"></div>
          <div class="h02-eraser" data-eraser aria-hidden="true"><span class="h02-eraser-rubber"></span><span class="h02-eraser-sleeve">Kiln</span></div>
          <p class="visually-hidden" data-stage-live aria-live="polite"></p>
        </div>
      </section>

      <div class="h02-break" aria-hidden="true"><span></span></div>

      <section class="h02-act h02-p2" id="h02-p2" aria-labelledby="h02-p2-title">
        <div class="h02-p2-head">
          ${numeral(2, 37)}
          <h2 id="h02-p2-title" class="h02-pencil">So how do I add new skills?</h2>
          <p>The good prompts are in a video I watched, a post I bookmarked and a repo I starred. I saved them and never tried them. Now I drag one into Kiln, test the prompt on my repo, and keep it if it works.</p>
        </div>
        ${pipelineMarkup()}
      </section>

      <section class="h02-close" id="h02-get" aria-labelledby="h02-get-title">
        <ul class="h02-facts">
          <li><b>No API key.</b> It uses the Codex or Claude Code you’re signed into, on your ChatGPT or Claude plan. Your plan’s limits apply.</li>
          <li><b>Tests are read-only.</b> The agent inspects your repo. Nothing in your code changes.</li>
          <li><b>Your repo, your approvals.</b> Approving pins the exact revision and publishes it to your own Kiln repository on GitHub.</li>
          <li><b>Windows app plus CLI.</b> MIT licensed. Your agents can read your library through the CLI.</li>
        </ul>
        <div class="h02-get">
          <h2 id="h02-get-title" class="h02-pencil">Rub out your own mess.</h2>
          <div class="h02-get-side">
            ${download('Download Kiln 0.17.0 for Windows')}
            <p>The release is hosted in a private GitHub repository: sign in with an account that has access. Unsigned build.</p>
          </div>
        </div>
      </section>
    </main>
  </div>`;
  const panel = bindPanel(root);
  const stage = bindStage(root, panel, still, reduced);
  bindPipeline(root, panel, reduced, stage.cleanNow);
}
