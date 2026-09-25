// PROTOTYPE variant 19 — Tarot. A three-card spread (past, present, future) that turns over; mystical voice, factual fine print.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

const art: Record<string, string> = {
  bookmark: `
    <path d="M108,56 A20,20 0 1 0 108,96 A15,15 0 1 1 108,56 Z"/>
    <path d="M30,206 C60,194 88,196 100,208 L100,126 C88,114 60,112 30,124 Z"/><path d="M170,206 C140,194 112,196 100,208 L100,126 C112,114 140,112 170,124 Z"/>
    <path d="M42,142 C60,136 80,136 92,144 M42,158 C60,152 80,152 92,160 M42,174 C60,168 80,168 92,176 M108,144 C120,136 140,136 158,142 M108,160 C120,152 140,152 158,158"/>
    <path d="M112,128 L112,246 L122,234 L132,246 L132,124"/>
    <circle cx="56" cy="74" r="1.8" class="v19-fill"/><circle cx="150" cy="88" r="1.8" class="v19-fill"/><circle cx="140" cy="54" r="1.2" class="v19-fill"/>`,
  test: `
    <path d="M100,40 L104,56 L120,60 L104,64 L100,80 L96,64 L80,60 L96,56 Z"/>
    <path d="M84,98 L84,144 L52,218 Q48,230 60,230 L140,230 Q152,230 148,218 L116,144 L116,98"/><path d="M76,98 L124,98"/>
    <path d="M64,194 Q82,184 100,194 T136,194"/>
    <circle cx="92" cy="214" r="4"/><circle cx="110" cy="206" r="3"/><circle cx="104" cy="178" r="2.5"/><circle cx="96" cy="160" r="2"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const r1 = 92, r2 = 102; return `<line x1="${(100 + Math.cos(a) * r1).toFixed(1)}" y1="${(166 + Math.sin(a) * r1).toFixed(1)}" x2="${(100 + Math.cos(a) * r2).toFixed(1)}" y2="${(166 + Math.sin(a) * r2).toFixed(1)}"/>`; }).join('')}`,
  skill: `
    ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const r1 = 32, r2 = i % 2 ? 42 : 52; return `<line x1="${(100 + Math.cos(a) * r1).toFixed(1)}" y1="${(98 + Math.sin(a) * r1).toFixed(1)}" x2="${(100 + Math.cos(a) * r2).toFixed(1)}" y2="${(98 + Math.sin(a) * r2).toFixed(1)}"/>`; }).join('')}
    <circle cx="100" cy="98" r="24"/><path d="M100,84 Q108,98 100,112 Q92,98 100,84 Z M86,98 Q100,90 114,98 Q100,106 86,98 Z"/>
    <path d="M100,122 L100,240"/><path d="M100,218 L118,218 L118,230 L100,230 M100,198 L112,198 L112,208 L100,208"/>
    <path d="M60,250 Q100,232 140,250"/>`,
  library: `
    <rect x="42" y="100" width="24" height="128"/><rect x="70" y="84" width="20" height="144"/><rect x="94" y="110" width="28" height="118"/>
    <path d="M128,228 L148,106 L170,110 L150,232 Z"/><path d="M30,228 L170,228 M30,238 L170,238"/>
    <path d="M48,118 L60,118 M48,210 L60,210 M76,102 L84,102 M76,212 L84,212 M100,128 L116,128 M100,210 L116,210"/>
    <path d="M100,52 L103,62 L113,65 L103,68 L100,78 L97,68 L87,65 L97,62 Z"/>`,
  mirror: `
    <ellipse cx="100" cy="124" rx="46" ry="58"/><ellipse cx="100" cy="124" rx="38" ry="50"/>
    <path d="M100,182 L100,240 M88,240 L112,240 M92,196 L108,196"/>
    <path d="M74,108 L94,108 M74,124 L90,124" class="v19-thin"/><path d="M106,108 L126,108 M106,124 L128,124 M106,140 L122,140" class="v19-thin"/>
    <path d="M70,142 L78,142" class="v19-thin"/><path d="M116,92 L116,100 M112,96 L120,96"/><path d="M80,92 L88,92"/>`,
  seal: `
    <path d="${Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; const r = i % 2 ? 50 : 45; return `${i ? 'L' : 'M'}${(100 + Math.cos(a) * r).toFixed(1)},${(130 + Math.sin(a) * r).toFixed(1)}`; }).join(' ')} Z"/>
    <circle cx="100" cy="130" r="34"/>
    <path d="M100,106 L106,124 L124,124 L110,135 L115,153 L100,142 L85,153 L90,135 L76,124 L94,124 Z"/>
    <path d="M78,172 L64,236 L78,226 L86,240 L94,178 M122,172 L136,236 L122,226 L114,240 L106,178"/>`,
};

const cardSvg = (key: string, numeral: string, name: string, id: string) => `
<svg class="v19-art" viewBox="0 0 200 340" role="img" aria-labelledby="${id}"><title id="${id}">${name}, drawn in gold line-work</title>
  <rect x="6" y="6" width="188" height="328" rx="10" class="v19-frame"/><rect x="14" y="14" width="172" height="312" rx="6" class="v19-thin"/>
  ${[[26, 26], [174, 26], [26, 314], [174, 314]].map(([x, y]) => `<path d="M${x},${y - 6} L${x + 2},${y - 2} L${x + 6},${y} L${x + 2},${y + 2} L${x},${y + 6} L${x - 2},${y + 2} L${x - 6},${y} L${x - 2},${y - 2} Z" class="v19-fill"/>`).join('')}
  <text x="100" y="42" class="v19-numeral">${numeral}</text>
  <g transform="translate(0 6)">${art[key]}</g>
  <path d="M34,282 L166,282" class="v19-thin"/>
  <text x="100" y="308" class="v19-name">${name}</text>
</svg>`;

const backSvg = `
<svg class="v19-art" viewBox="0 0 200 340" aria-hidden="true">
  <rect x="6" y="6" width="188" height="328" rx="10" class="v19-frame"/>
  <rect x="16" y="16" width="168" height="308" rx="5" fill="url(#v19-lattice)" stroke="none" opacity=".55"/>
  <rect x="16" y="16" width="168" height="308" rx="5" class="v19-thin"/>
  <circle cx="100" cy="170" r="56" class="v19-back-disc"/><circle cx="100" cy="170" r="48" class="v19-thin"/>
  ${Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; const r2 = i % 2 ? 66 : 78; return `<line x1="${(100 + Math.cos(a) * 58).toFixed(1)}" y1="${(170 + Math.sin(a) * 58).toFixed(1)}" x2="${(100 + Math.cos(a) * r2).toFixed(1)}" y2="${(170 + Math.sin(a) * r2).toFixed(1)}"/>`; }).join('')}
  <path d="M112,140 A32,32 0 1 0 112,200 A25,25 0 1 1 112,140 Z"/>
  <circle cx="100" cy="46" r="6" class="v19-thin"/><circle cx="100" cy="294" r="6" class="v19-thin"/>
</svg>`;

const spread = [
  { key: 'bookmark', numeral: 'I', name: 'The Bookmark', time: 'The past', title: 'What you saved', text: 'A screenshot, a thread, a talk you meant to watch properly. Kiln takes all of it: paste or drop text, links, images and files, press Ctrl+N, or reach it from anywhere with Ctrl+Shift+Space. Paste a YouTube link and press Distill video; the captions become entries with timestamped links back to the moment each idea was said.', fine: '“Save only” keeps a source without calling a model. “Analyze and add” turns it into prompts, insights, techniques, tools and resources.' },
  { key: 'test', numeral: 'II', name: 'The Test', time: 'The present', title: 'What happens when you try it', text: 'Choose a local project or repository, and Kiln runs the exact prompt revision through Codex or Claude Code while you watch: messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and tokens. The output and the agent’s verdict, pass, fail or uncertain, are kept with that revision.', fine: 'Experiments are read-only; nothing in your code changes. Tasks that need edits or unavailable tools come back uncertain, not as faked successes. Your judgement is kept apart from the agent’s.' },
  { key: 'skill', numeral: 'III', name: 'The Skill', time: 'The future', title: 'What comes true every session', text: 'Edit the prompt, compare the revisions, run it again on the same repo, and see what changed the result. When one proves itself, draft a skill from it, approve the revision that worked, and install it into Codex, Claude Code or Copilot. The next agent session picks it up.', fine: 'Approval pins an exact revision and publishes it to your own Kiln repository on GitHub. Editing makes a new draft; installs always use approved content.' },
];

const arcana = [
  { key: 'library', numeral: 'IV', name: 'The Library', text: 'Prompts, skills, custom agent definitions, source notes, insights, techniques, tools and resources, in collections with search, tags, favorites and filters. Import skills already installed, or a skills repository, as drafts.', fine: 'Originals stay where they are. Kiln finds skills and agents not yet in the library.' },
  { key: 'mirror', numeral: 'V', name: 'The Mirror', text: 'Every revision is kept. Put two side by side and read the diff, then see each one’s runs. It also shows every installed copy of a skill, and which ones were edited outside Kiln.', fine: 'Compare an installed copy file by file with the approved version, or remove local copies in bulk.' },
  { key: 'seal', numeral: 'VI', name: 'The Seal', text: 'Approve the exact revision you trust. Kiln commits the snapshot and publishes it to your own GitHub repository, in a standard layout. On another machine, press “Install everything marked for this machine”.', fine: 'Validation never executes skills. Git status, sync and conflict resolution are built in. Nothing is approved for you.' },
];

// Deterministic starfield.
let seed = 19;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const tile = Array.from({ length: 70 }, () => `<circle cx='${(rand() * 600).toFixed(0)}' cy='${(rand() * 600).toFixed(0)}' r='${(rand() * 1.1 + .3).toFixed(1)}' fill='%23f3dea0' opacity='${(rand() * .5 + .2).toFixed(2)}'/>`).join('');
const tileUrl = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>${tile}</svg>")`;
const stars = Array.from({ length: 60 }, () => `<circle cx="${(rand() * 1000).toFixed(0)}" cy="${(rand() * 1000).toFixed(0)}" r="${(rand() * 1.8 + .6).toFixed(1)}" style="--d:${(rand() * 6).toFixed(1)}s"${rand() > .8 ? ' class="v19-tw"' : ''}/>`).join('');
const sample = examples[1];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Stop reading the future. Test it.';
  root.innerHTML = `
<div class="v19">
  <svg class="v19-sky" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="v19-lattice" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10,0 L20,10 L10,20 L0,10 Z" fill="none" stroke="#d8b465" stroke-width=".8"/><circle cx="10" cy="10" r="1.3" fill="#d8b465"/></pattern></defs>${stars}</svg>
  <header class="v19-top">
    <a class="v19-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v19-spread">The spread</a><a href="#v19-arcana">The arcana</a><a href="#v19-record">A reading</a><a href="#v19-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v19-hero" aria-labelledby="v19-title">
      <p class="v19-ornament" aria-hidden="true">✦ ✧ ✦</p>
      <h1 id="v19-title">Stop reading the future. <span>Test it.</span></h1>
      <p class="v19-lede">Every saved prompt is a small prophecy: <em>this will make my agent better.</em> Kiln, for Windows, runs it on your own repository and shows you what actually happened.</p>
      <div class="v19-cta">
        <a class="v19-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <a class="v19-link" href="#v19-spread">Turn the cards</a>
      </div>
      <p class="v19-fine">${releaseNote}</p>
    </section>

    <section class="v19-spread" id="v19-spread" aria-labelledby="v19-spread-title">
      <h2 id="v19-spread-title">A three-card spread</h2>
      <p class="v19-spread-sub">Past, present and future. Turn each card to read it.</p>
      <div class="v19-table">${spread.map((card, i) => `
        <div class="v19-slot" style="--n:${i + 1}">
          <button type="button" class="v19-card" data-flip="${i}" aria-pressed="false" aria-controls="v19-read-${i}" aria-label="Turn card ${card.numeral}, ${card.time.toLowerCase()}">
            <span class="v19-card-inner">
              <span class="v19-face v19-down">${backSvg}</span>
              <span class="v19-face v19-up">${cardSvg(card.key, card.numeral, card.name, `v19-art-${i}`)}</span>
            </span>
          </button>
          <p class="v19-time">${card.numeral}. ${card.time}</p>
        </div>
        <div class="v19-reading" id="v19-read-${i}" style="--n:${i + 1}" aria-live="polite">
          <p class="v19-veil"><span class="v19-veil-n">${card.numeral}. ${card.time}: </span>face down, waiting to be turned.</p>
          <div class="v19-read-body" hidden>
            <p class="v19-read-card">${card.numeral}. ${card.name}</p>
            <h3>${card.title}</h3>
            <p>${card.text}</p>
            <p class="v19-small">${card.fine}</p>
          </div>
        </div>`).join('')}
      </div>
      <div class="v19-complete" hidden>
        <p>The reading is complete. Unlike most readings, this one left evidence: an output, a verdict and a revision you can run again.</p>
        <a class="v19-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      </div>
      <button type="button" class="v19-all">Turn all three</button>
    </section>

    <section class="v19-arcana" id="v19-arcana" aria-labelledby="v19-arcana-title">
      <h2 id="v19-arcana-title">The arcana</h2>
      <p class="v19-spread-sub">Three more cards, already face up.</p>
      <ul class="v19-arcana-grid">${arcana.map((card, i) => `
        <li class="v19-arcanum">
          <div class="v19-arcanum-art">${cardSvg(card.key, card.numeral, card.name, `v19-arc-${i}`)}</div>
          <div class="v19-arcanum-copy"><h3>${card.name}</h3><p>${card.text}</p><p class="v19-small">${card.fine}</p></div>
        </li>`).join('')}
      </ul>
    </section>

    <section class="v19-record" id="v19-record" aria-labelledby="v19-record-title">
      <div class="v19-record-head">
        <h2 id="v19-record-title">A reading, transcribed</h2>
        <p>What a test leaves behind, for a real prompt from a Kiln library. The run details are a sample.</p>
      </div>
      <div class="v19-scroll">
        <p class="v19-small">${sample.source}</p>
        <h3>${sample.title}</h3>
        <blockquote>${sample.prompt}</blockquote>
        <dl class="v19-facts">
          <div><dt>Asked of</dt><dd><code>./api-server</code>, read-only</dd></div>
          <div><dt>Medium</dt><dd>Codex, high reasoning effort</dd></div>
          <div><dt>Elapsed</dt><dd>3 min 41 s</dd></div>
          <div><dt>Tokens</dt><dd>52,110 input, 30,002 cached, 2,406 output</dd></div>
          <div><dt>The agent’s verdict</dt><dd><span class="v19-verdict">Uncertain</span> The messages it was asked to trace weren’t attached to the run, so it said so instead of guessing.</dd></div>
          <div><dt>Your judgement</dt><dd>Attach the transcript and run revision 2.</dd></div>
        </dl>
      </div>
    </section>

    <section class="v19-plain" aria-labelledby="v19-plain-title">
      <h2 id="v19-plain-title">What the cards don’t say</h2>
      <ul>
        <li>Kiln is a Windows desktop app with a CLI. There’s no macOS or Linux build.</li>
        <li>It uses your signed-in Codex or Claude Code, on your ChatGPT or Claude subscription. No API key, no extra API bill, but the subscription’s usage limits apply.</li>
        <li>A consent notice explains what’s sent before any agent interaction. Editing, approval and installation never call a model.</li>
        <li>The library lives on your machine, backed by a GitHub repository Kiln creates with the official <code>gh</code> CLI. It isn’t an offline or account-free product.</li>
        <li>Kiln also edits CLAUDE.md, AGENTS.md, settings, MCP config and other agent config files in place, with 30 private backups. It never runs hooks.</li>
        <li>No fortunes were told on this page. The verdicts come from the agent; the decisions come from you.</li>
      </ul>
    </section>
  </main>

  <footer class="v19-download" id="v19-download" aria-labelledby="v19-dl-title">
    <p class="v19-ornament" aria-hidden="true">✦</p>
    <h2 id="v19-dl-title">The future is a test you can run.</h2>
    <a class="v19-button" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
    <p class="v19-fine">${releaseNote} Builds are unsigned. MIT licensed.</p>
  </footer>
</div>`;

  root.querySelector<HTMLElement>('.v19')!.style.setProperty('--v19-tile', tileUrl);
  const complete = root.querySelector<HTMLElement>('.v19-complete')!;
  const allButton = root.querySelector<HTMLButtonElement>('.v19-all')!;
  const cards = [...root.querySelectorAll<HTMLButtonElement>('[data-flip]')];
  const turn = (button: HTMLButtonElement, open: boolean) => {
    const i = Number(button.dataset.flip);
    button.setAttribute('aria-pressed', String(open));
    button.classList.toggle('is-up', open);
    button.setAttribute('aria-label', open ? `${spread[i].name}, ${spread[i].time.toLowerCase()}. Turn face down` : `Turn card ${spread[i].numeral}, ${spread[i].time.toLowerCase()}`);
    const reading = root.querySelector<HTMLElement>(`#v19-read-${i}`)!;
    reading.querySelector<HTMLElement>('.v19-veil')!.hidden = open;
    reading.querySelector<HTMLElement>('.v19-read-body')!.hidden = !open;
    reading.classList.toggle('is-read', open);
    const all = cards.every(card => card.classList.contains('is-up'));
    complete.hidden = !all;
    allButton.hidden = all;
  };
  cards.forEach(button => button.addEventListener('click', () => turn(button, !button.classList.contains('is-up'))));
  allButton.addEventListener('click', () => cards.forEach((button, i) => setTimeout(() => turn(button, true), i * 260)));
}
