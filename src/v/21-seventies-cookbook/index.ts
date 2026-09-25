// PROTOTYPE variant 18 — Seventies cookbook. Prompts as recipe cards that turn over to show the taste test.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

const c = { cream: '#f5e8c8', mustard: '#dca32a', orange: '#c4521c', avocado: '#76842f', brown: '#4a2a14' };

// Procedural halftone: a dot grid clipped to a shape, dot size following a light falling from the upper left.
function halftone(id: string, box: [number, number, number, number], light: [number, number], reach: number, step: number, max: number, color: string) {
  const [x0, y0, w, h] = box;
  let dots = '';
  for (let y = y0, row = 0; y <= y0 + h; y += step * .866, row++) {
    for (let x = x0 + (row % 2 ? step / 2 : 0); x <= x0 + w; x += step) {
      const d = Math.hypot(x - light[0], y - light[1]) / reach;
      const r = Math.max(0, Math.min(max, max * (d - .18)));
      if (r > .35) dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}"/>`;
    }
  }
  return `<g clip-path="url(#${id})" fill="${color}">${dots}</g>`;
}

const bundt = 'M112,372 C104,300 146,214 196,184 L324,184 C374,214 416,300 408,372 Z';
const heroPhoto = `
<svg class="v18-photo-svg" viewBox="0 0 520 520" role="img" aria-labelledby="v18-photo-t">
  <title id="v18-photo-t">A halftone cookbook photograph: an orange jelly mould on a plate, on an avocado gingham tablecloth, with a toothpick flag reading “Pass”.</title>
  <defs>
    <pattern id="v18-gingham" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="${c.cream}"/><rect width="22" height="44" fill="${c.avocado}" opacity=".42"/><rect width="44" height="22" fill="${c.avocado}" opacity=".42"/></pattern>
    <clipPath id="v18-clip-bundt"><path d="${bundt}"/></clipPath>
    <clipPath id="v18-clip-plate"><ellipse cx="260" cy="382" rx="226" ry="70"/></clipPath>
    <clipPath id="v18-clip-cloth"><rect width="520" height="520"/></clipPath>
  </defs>
  <rect width="520" height="520" fill="url(#v18-gingham)"/>
  ${halftone('v18-clip-cloth', [0, 0, 520, 520], [120, 60], 640, 11, 3.2, c.brown)}
  <ellipse cx="268" cy="394" rx="232" ry="74" fill="${c.brown}" opacity=".35"/>
  <ellipse cx="260" cy="382" rx="226" ry="70" fill="${c.cream}" stroke="${c.brown}" stroke-width="3"/>
  ${halftone('v18-clip-plate', [30, 310, 460, 150], [150, 330], 420, 8, 2.6, c.mustard)}
  <ellipse cx="260" cy="378" rx="170" ry="46" fill="none" stroke="${c.brown}" stroke-width="2" opacity=".5"/>
  <path d="${bundt}" fill="${c.orange}"/>
  ${halftone('v18-clip-bundt', [100, 170, 320, 210], [170, 200], 300, 7.5, 3.4, c.brown)}
  ${[150, 190, 232, 260, 288, 330, 370].map((x, i) => `<path d="M${260 + (x - 260) * .45},186 C${x},250 ${x},320 ${260 + (x - 260) * 1.1},372" fill="none" stroke="${c.brown}" stroke-width="2.5" opacity="${.35 + (i / 12)}"/>`).join('')}
  <path d="${bundt}" fill="none" stroke="${c.brown}" stroke-width="3"/>
  <ellipse cx="260" cy="186" rx="64" ry="14" fill="${c.mustard}" stroke="${c.brown}" stroke-width="3"/>
  <path d="M206,190 C214,214 226,206 232,226 C240,206 252,222 262,232 C270,214 284,226 292,212 C300,222 308,206 314,190" fill="${c.cream}" stroke="${c.brown}" stroke-width="2.5"/>
  <circle cx="262" cy="170" r="16" fill="#9e2a12" stroke="${c.brown}" stroke-width="3"/>
  <circle cx="256" cy="164" r="4" fill="${c.cream}" opacity=".8"/>
  <path d="M262,154 C266,130 280,118 296,112" fill="none" stroke="${c.avocado}" stroke-width="4" stroke-linecap="round"/>
  <line x1="318" y1="194" x2="352" y2="70" stroke="${c.brown}" stroke-width="4" stroke-linecap="round"/>
  <path d="M352,72 L440,86 L430,108 L444,130 L346,118 Z" fill="${c.cream}" stroke="${c.brown}" stroke-width="3"/>
  <text x="392" y="112" text-anchor="middle" class="v18-flag">Pass</text>
  ${[[64, 360, -30], [96, 410, 20], [430, 420, -10], [462, 362, 30]].map(([x, y, r]) => `<path d="M${x},${y} c14,-22 40,-18 40,0 c0,18 -26,22 -40,0 z" fill="${c.avocado}" stroke="${c.brown}" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`).join('')}
</svg>`;

type Card = {
  title: string; source: string; kitchen: string; agent: 'Pass' | 'Uncertain'; ingredients: [string, string][]; method: string[];
  taste: { run: string; tokens: string; said: string; mine: string }; note: { before: string; after: string; why: string };
};
const cards: Card[] = [
  {
    title: examples[0].title, source: examples[0].source, kitchen: './kids-quiz', agent: 'Pass',
    ingredients: [['{{app}}', 'the app, as a seven-year-old sees it'], ['./kids-quiz', 'one local repository, read-only'], ['Claude Code', 'signed in, on your subscription']],
    method: ['Use the app as a seven-year-old.', 'Skip the parent-only signup.', 'Try different activities until something is confusing, or you can’t tell what to do next.', 'Describe that first obstacle and suggest a fix.', 'Make no changes yet.'],
    taste: { run: 'Claude Code, medium effort, 2 min 10 s', tokens: '38,420 in, 21,960 cached, 1,288 out', said: 'The “Next” arrow on the second quiz reads as decoration. A child stops there.', mine: 'Keep. Fix the arrow tomorrow.' },
    note: { before: 'Look for usability problems in this app.', after: 'Use this app as a seven-year-old.', why: 'A vague brief got a vague list. A character found the real obstacle in one run.' },
  },
  {
    title: examples[1].title, source: examples[1].source, kitchen: './api-server', agent: 'Uncertain',
    ingredients: [['{{did}}', 'what the agent did'], ['{{expected}}', 'what you expected'], ['AGENTS.md, CLAUDE.md', 'the house rules'], ['./api-server', 'one local repository, read-only']],
    method: ['You did {{did}}, but I expected {{expected}}.', 'Trace the decision to instructions, messages, files or assumptions.', 'Check AGENTS.md and CLAUDE.md for outdated guidance.', 'Explain the cause and propose the smallest instruction change.', 'Don’t edit anything yet.'],
    taste: { run: 'Codex, high effort, 3 min 41 s', tokens: '52,110 in, 30,002 cached, 2,406 out', said: 'The messages it was asked to trace weren’t in the run, so it said so rather than guess.', mine: 'Fair. Add the transcript.' },
    note: { before: 'Trace the decision to instructions, messages, files or assumptions.', after: 'Trace the decision, using the attached transcript: {{transcript}}.', why: 'With the transcript attached, the next run named the stale line in AGENTS.md.' },
  },
  {
    title: 'Playtest for what kills the fun', source: examples[2].source, kitchen: './my-game', agent: 'Pass',
    ingredients: [['{{game}}', 'the build you want played'], ['./my-game', 'one local repository, read-only'], ['Ten', 'improvements, ranked']],
    method: ['Playtest this game.', 'Find bugs, annoyances, confusing details and things that take away the fun.', 'Look for quick wins and worthwhile additions.', 'Rank the ten most impactful improvements and explain why each helps.', 'Give me a list to review. Make no changes.'],
    taste: { run: 'Claude Code, medium effort, 2 min 48 s', tokens: '51,302 in, 33,870 cached, 2,114 out', said: 'Ten ranked findings. The jump buffer is shorter than the landing animation, so inputs get lost.', mine: 'Keep. Make it a skill.' },
    note: { before: 'Find bugs, annoyances and confusing details.', after: 'Rank the ten most impactful improvements and explain why each helps.', why: 'Forty-one loose notes became ten, in order, with reasons.' },
  },
];

const recipeCard = (card: Card, i: number) => `
<article class="v18-card" data-card="${i}" aria-labelledby="v18-card-${i}">
  <div class="v18-card-inner">
    <div class="v18-face v18-front">
      <p class="v18-card-no">Recipe no. ${i + 1} <span>${card.source}</span></p>
      <h3 id="v18-card-${i}">${card.title}</h3>
      <div class="v18-card-cols">
        <div>
          <h4>Ingredients</h4>
          <ul class="v18-ingredients">${card.ingredients.map(([what, note]) => `<li><b>${what}</b> ${note}</li>`).join('')}</ul>
        </div>
        <div>
          <h4>Method</h4>
          <ol class="v18-method">${card.method.map(step => `<li>${step.replace(/\{\{(\w+)\}\}/g, '<code>{{$1}}</code>')}</li>`).join('')}</ol>
        </div>
      </div>
      <dl class="v18-card-foot">
        <div><dt>Tested in my own kitchen</dt><dd>${card.kitchen} <small>(read-only)</small></dd></div>
        <div><dt>Serves</dt><dd>Every future session</dd></div>
      </dl>
      <button type="button" class="v18-turn" data-turn="${i}" aria-expanded="false">Turn over for the taste test</button>
    </div>
    <div class="v18-face v18-back" inert>
      <p class="v18-card-no">Taste test <span>sample run</span></p>
      <h3>${card.title}</h3>
      <dl class="v18-taste">
        <div><dt>Cooked with</dt><dd>${card.taste.run}</dd></div>
        <div><dt>Tokens</dt><dd>${card.taste.tokens}</dd></div>
        <div><dt>The agent says</dt><dd><span class="v18-verdict v18-verdict-${card.agent.toLowerCase()}">${card.agent}</span> ${card.taste.said}</dd></div>
        <div><dt>I say</dt><dd>${card.taste.mine}</dd></div>
      </dl>
      <div class="v18-margin">
        <p class="v18-margin-head">Notes in the margin</p>
        <p class="v18-del">${card.note.before}</p>
        <p class="v18-add">${card.note.after}</p>
        <p class="v18-why">${card.note.why}</p>
      </div>
      <button type="button" class="v18-turn" data-turn="${i}" aria-expanded="true">Back to the recipe</button>
    </div>
  </div>
</article>`;

const jars = [
  ['Prompts', c.orange, 'Ready to run'],
  ['Insights', c.mustard, 'Why it works'],
  ['Techniques', c.avocado, 'How to do it'],
  ['Tools', c.orange, 'What to use'],
  ['Resources', c.mustard, 'Read later, for real'],
  ['Source notes', c.avocado, 'Where it came from'],
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — You’ve clipped enough recipes. Cook one.';
  root.innerHTML = `
<div class="v18">
  <header class="v18-top">
    <a class="v18-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v18-recipes">Tonight’s recipes</a><a href="#v18-learn">Learn to cook</a><a href="#v18-pantry">Pantry</a><a href="#v18-special">House specials</a><a href="#v18-get">Download</a></nav>
  </header>
  <main id="main">
    <section class="v18-hero" aria-labelledby="v18-title">
      <div class="v18-stripes" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <div class="v18-hero-copy">
        <p class="v18-cover-line">The Kiln kitchen companion, for Windows</p>
        <h1 id="v18-title">You’ve clipped enough recipes. Tonight, cook one.</h1>
        <p class="v18-lede">A saved prompt is a recipe nobody has tasted. Kiln cooks it in your own kitchen: it runs the prompt on your repository through Codex or Claude Code, read-only, and serves the result with a verdict. Adjust the seasoning, cook it again, and keep the one that works.</p>
        <div class="v18-cta">
          <a class="v18-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
          <a class="v18-link" href="#v18-recipes">See tonight’s recipes</a>
        </div>
        <p class="v18-fine">${releaseNote}</p>
      </div>
      <figure class="v18-photo">
        ${heroPhoto}
        <figcaption>Plate 1. Playtest for what kills the fun, cooked on <code>./my-game</code> and served in 2 minutes 48. <em>From a sample run.</em></figcaption>
      </figure>
    </section>

    <section class="v18-recipes" id="v18-recipes" aria-labelledby="v18-recipes-title">
      <div class="v18-head">
        <h2 id="v18-recipes-title">Tonight’s recipes</h2>
        <p>Three real prompts from a Kiln library, written out as recipe cards. Turn one over to see how it tasted: the run, the agent’s verdict, and the note in the margin that made the next batch better.</p>
      </div>
      <div class="v18-cards">${cards.map(recipeCard).join('')}</div>
      <p class="v18-cards-note">Taste tests are samples. A real one shows the messages, reasoning summaries, commands and web searches live, with the model, reasoning effort, elapsed time and token counts. Cook two at once; cancel or retry either.</p>
    </section>

    <section class="v18-learn" id="v18-learn" aria-labelledby="v18-learn-title">
      <h2 id="v18-learn-title">You learn to cook by cooking.</h2>
      <div class="v18-learn-grid">
        <div class="v18-step"><p class="v18-step-no">1</p><h3>Cook it as written</h3><p>Pick a local project or repository, or an isolated example, and run the exact revision. The kitchen is read-only: nothing in your code changes.</p></div>
        <div class="v18-step"><p class="v18-step-no">2</p><h3>Taste it yourself</h3><p>The output and the agent’s pass, fail or uncertain verdict are saved against that revision. The agent’s opinion is kept apart from yours. You decide what goes back on the menu.</p></div>
        <div class="v18-step"><p class="v18-step-no">3</p><h3>Adjust the seasoning</h3><p>Edit the prompt and you get a new revision. Compare revisions and read the diff, then cook again on the same repo. You see exactly which change made the difference.</p></div>
        <div class="v18-step"><p class="v18-step-no">4</p><h3>Ask the cook</h3><p>“Ask the agent” talks an item through with its attachments and the source video’s context, before you change a word.</p></div>
      </div>
      <aside class="v18-honest">
        <h3>An honest kitchen</h3>
        <p>When a recipe needs edits or a tool the kitchen doesn’t have, the verdict comes back uncertain, not as a faked success. Tasting teaches you more than any saved thread about what makes a prompt work.</p>
      </aside>
    </section>

    <section class="v18-pantry" id="v18-pantry" aria-labelledby="v18-pantry-title">
      <div class="v18-pantry-copy">
        <h2 id="v18-pantry-title">Stock your pantry</h2>
        <p>Paste or drop text, links, screenshots, images and files. Press Ctrl+N from the app, or Ctrl+Shift+Space from anywhere for quick search; there’s a tray icon too. “Save only” puts it on the shelf without calling a model. “Analyze and add” turns a source into prompts, insights, techniques, tools and resources, in a collection linked to where it came from.</p>
        <p><b>That hour-long video?</b> Paste the YouTube link and press Distill video. The captions become a collection of entries with timestamped links back to the moment each idea was said, and the transcript stays attached.</p>
        <p>Collections, search, tags, favorites and filters keep the shelves in order. Archive, trash, restore and undo are all there when you clear out.</p>
      </div>
      <div class="v18-shelves" role="img" aria-label="Pantry shelves with jars labelled prompts, insights, techniques, tools, resources and source notes">
        ${[jars.slice(0, 3), jars.slice(3)].map(row => `<div class="v18-shelf">${row.map(([label, colour, sub]) => `<div class="v18-jar" style="--jar:${colour}"><span class="v18-lid"></span><span class="v18-jar-body"><span class="v18-jar-label"><b>${label}</b><small>${sub}</small></span></span></div>`).join('')}</div>`).join('')}
      </div>
    </section>

    <section class="v18-special" id="v18-special" aria-labelledby="v18-special-title">
      <div class="v18-special-copy">
        <h2 id="v18-special-title">From recipe to house special</h2>
        <p>When a recipe proves itself, “Create skill” drafts a SKILL.md from it, using Kiln’s bundled writing-for-agents guidance and linked back to the source. You approve the exact revision you tasted. Kiln commits it and publishes it to your own Kiln repository on GitHub, then installs it into Codex, Claude Code or Copilot locations. The next agent session picks it up.</p>
        <p>Tinker with the recipe later and you get a new draft. The approved house special stays on the menu until you approve the change, and installs always use approved content. On another machine, open the repository and press “Install everything marked for this machine”.</p>
      </div>
      <div class="v18-menu">
        <p class="v18-menu-top">House specials</p>
        <p class="v18-menu-sub">Served at every session</p>
        <ul>
          <li><b>Playtest for what kills the fun</b><span>Revision 3, approved</span><em>Claude Code, <code>~/.claude/skills</code></em></li>
          <li><b>Try it as a seven-year-old</b><span>Revision 2, approved</span><em>Codex and Copilot, <code>~/.agents/skills</code></em></li>
          <li><b>Find the instruction that went wrong</b><span>Revision 4, approved</span><em>A project, <code>.github/skills</code></em></li>
        </ul>
        <p class="v18-menu-foot">A sample menu. Your kitchen, your specials.</p>
      </div>
    </section>

    <section class="v18-rules" aria-labelledby="v18-rules-title">
      <h2 id="v18-rules-title">Kitchen rules</h2>
      <ul>
        <li><b>Bring your own cook.</b> Kiln uses the Codex or Claude Code you’re already signed in to, on your ChatGPT or Claude subscription. No API key, no extra API bill. Your subscription’s usage limits still apply.</li>
        <li><b>Nobody cooks without asking.</b> A consent notice explains what’s sent before any agent interaction. Editing, approving and installing never call a model.</li>
        <li><b>The recipe box lives at home.</b> Your library is local and backed by a GitHub repository Kiln creates for you with the official <code>gh</code> CLI. It isn’t an offline or account-free product.</li>
        <li><b>Keep the rest of the kitchen tidy.</b> Kiln also shows every installed copy of a skill, flags ones edited outside Kiln, and edits CLAUDE.md, AGENTS.md and other agent config files in place with 30 private backups. It never runs hooks.</li>
      </ul>
    </section>
  </main>

  <footer class="v18-get" id="v18-get" aria-labelledby="v18-get-title">
    <div class="v18-get-inner">
      <h2 id="v18-get-title">Something’s cooking.</h2>
      <p>Kiln 0.17.0 is a Windows desktop app with a CLI, MIT licensed. Install it, open that prompt you saved in the spring, and cook it before dinner.</p>
      <a class="v18-button v18-button-light" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p class="v18-fine">${releaseNote} Builds are unsigned, so Windows may ask before it runs.</p>
    </div>
  </footer>
</div>`;

  root.querySelectorAll<HTMLButtonElement>('.v18-turn').forEach(button => button.addEventListener('click', () => {
    const card = root.querySelector<HTMLElement>(`[data-card="${button.dataset.turn}"]`)!;
    const flipped = !card.classList.contains('is-flipped');
    card.classList.toggle('is-flipped', flipped);
    const [front, back] = card.querySelectorAll<HTMLElement>('.v18-face');
    front.inert = flipped;
    back.inert = !flipped;
    (flipped ? back : front).querySelector<HTMLButtonElement>('.v18-turn')!.focus({ preventScroll: true });
  }));
}
