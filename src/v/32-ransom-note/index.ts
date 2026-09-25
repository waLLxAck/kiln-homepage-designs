// PROTOTYPE 29 — Ransom note. Punk xerox: cut-out letters, tape, staples, one fluorescent orange sticker colour.
import './style.css';
import { examples, installer, windowsMark } from '../../content';
import { ransom } from './ransom';

const hostage = examples[0];

const tape = (cls = '') => `<span class="v29-tape ${cls}" aria-hidden="true"></span>`;
const staple = (cls = '') => `<span class="v29-staple ${cls}" aria-hidden="true"></span>`;
const sheet = (id: string, title: string, seed: number, body: string, cls = '') => `
<section class="v29-sheet ${cls}" aria-labelledby="${id}">
  <div class="v29-copy">
    <h2 class="v29-head" id="${id}">${ransom(title, seed)}</h2>
    ${body}
  </div>
</section>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — We have your bookmarks';
  root.innerHTML = `
<div class="v29">
  <header class="v29-top">
    <a class="v29-brand" href="?">${ransom('Kiln', 4)}</a>
    <a class="v29-toplink" href="#v29-pay">Download</a>
  </header>
  <main id="main">
    <section class="v29-sheet v29-hero" aria-labelledby="v29-title">
      <div class="v29-copy">
        ${tape('is-tl')}${tape('is-tr')}
        <h1 class="v29-title" id="v29-title">${ransom('WE HAVE YOUR BOOKMARKS.', 29)}</h1>
        <div class="v29-hero-grid">
          <p class="v29-typed">Every prompt you starred, screenshotted and swore you’d try “later”. Kiln is holding them until you test one. On your own repo. Today.</p>
          <div class="v29-hero-cta">
            <a class="v29-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
            <p class="v29-small">Windows app and CLI. It uses the Codex or Claude Code you’re already signed in to. The release lives in a private GitHub repository, so sign in with an account that has access.</p>
          </div>
        </div>
        <p class="v29-sticker is-hero">Nobody gets hurt.<br><b>Tests are read-only.</b></p>
      </div>
    </section>

    ${sheet('v29-demands', 'OUR DEMANDS', 3, `
      ${staple('is-a')}${staple('is-b')}
      <ol class="v29-demands">
        <li><b>Pick one prompt.</b> One. Not the whole folder.</li>
        <li><b>Run it on your own repo.</b> Today. (There’s an isolated example if you’re scared.)</li>
        <li><b>Watch what it does.</b> Every message, command and web search, live.</li>
        <li><b>Decide.</b> You. Not the agent.</li>
      </ol>
      <p class="v29-scrawl is-demand">no cops. no “later”.</p>`, 'is-tilt-r')}

    ${sheet('v29-taken', 'THE ONE WE TOOK', 11, `
      <figure class="v29-clipping">
        ${tape('is-top')}
        <figcaption><b>${hostage.title}</b><span>${hostage.source}, found in a real Kiln library</span></figcaption>
        <blockquote>${hostage.prompt}</blockquote>
      </figure>
      <p class="v29-typed">${hostage.idea} It has been sitting in your notes for months. Let it out.</p>`, 'is-tilt-l')}

    ${sheet('v29-proof', 'PROOF OF LIFE', 17, `
      <div class="v29-proof">
        <div class="v29-printout" role="group" aria-label="A live test run, sample output">
          <p class="v29-print-head">KILN EXPERIMENT <span>sample run</span></p>
          <dl class="v29-log"><div><dt>repo</dt><dd>./my-kids-app <b>READ-ONLY</b></dd></div><div><dt>agent</dt><dd>Codex, reasoning effort medium</dd></div><div><dt>revision</dt><dd>2</dd></div><div class="is-gap"></div><div><dt>reasoning</dt><dd>finding the signup flow</dd></div><div><dt>command</dt><dd>rg -n "parent" src/routes</dd></div><div><dt>command</dt><dd>cat src/routes/start.tsx</dd></div><div><dt>search</dt><dd>reading level for ages 6 to 8</dd></div><div><dt>message</dt><dd>First obstacle: the “Go” button looks like a picture.</dd></div><div class="is-gap"></div><div><dt>elapsed</dt><dd>2 min 37 s</dd></div><div><dt>tokens</dt><dd>in 36,120, cached 21,400, out 1,988</dd></div></dl>
          <p class="v29-redact">sample figures, not a benchmark</p>
        </div>
        <div class="v29-proof-notes">
          <p class="v29-big">Nothing in your code changes.</p>
          <p class="v29-typed">Kiln runs that exact revision through Codex or Claude Code against a local repository, and you watch it happen. Two runs at once, if you’re greedy. Cancel or retry any time.</p>
          <p class="v29-sticker is-proof">Your code<br>stays put.</p>
        </div>
      </div>`)}

    ${sheet('v29-verdict', 'THE VERDICT', 23, `
      <div class="v29-verdict-grid">
        <p class="v29-typed">The agent grades its own run. If it needed edits or a tool it didn’t have, it says <b>uncertain</b> instead of faking a win. Honest hostage.</p>
        <p class="v29-typed">Its opinion is filed. Yours is filed separately. <span class="v29-underline">Yours is the one that counts.</span></p>
      </div>
      <ul class="v29-checks" aria-label="Possible assessments">
        <li>pass</li><li>fail</li><li class="is-circled">uncertain</li>
      </ul>`, 'is-tilt-r')}

    ${sheet('v29-again', 'DO IT AGAIN', 41, `
      <div class="v29-again">
        <div class="v29-diff" role="group" aria-label="Two revisions of the prompt">
          <p class="is-old"><s>Describe that first obstacle.</s></p>
          <p class="is-new">Describe that first obstacle in the words a seven-year-old would use.</p>
        </div>
        <p class="v29-typed">Edit it. Compare the revisions. Run it on the same repo. See what the change did. Congratulations: you are learning to prompt, on real code, instead of reading threads about it.</p>
      </div>`, 'is-tilt-l')}

    ${sheet('v29-terms', 'RELEASE TERMS', 53, `
      ${staple('is-a')}
      <ol class="v29-terms">
        <li>It proved itself? <b>Approve that exact revision.</b> Kiln commits it to your own GitHub repository. Nothing gets approved behind your back.</li>
        <li><b>Install it as a skill</b> for Codex, Claude Code or Copilot. Your next agent session picks it up.</li>
        <li>Edit it later and you get a new draft. The approved one stays exactly as it was.</li>
      </ol>
      <p class="v29-scrawl is-right">one tested prompt &gt; fifty saved ones</p>`)}

    ${sheet('v29-money', 'NO RANSOM MONEY', 67, `
      <p class="v29-big">No API key. No extra API bill.</p>
      <p class="v29-typed">Kiln uses the Codex or Claude Code you already pay for through ChatGPT or Claude. Your plan’s usage limits still apply; we’re kidnappers, not wizards. A notice tells you what gets sent before any agent sees a thing.</p>`, 'is-tilt-r is-narrow')}

    ${sheet('v29-also', 'WE ALSO TOOK', 79, `
      <ul class="v29-loot">
        <li><b>Your screenshots.</b> Drop them in, paste links, or hit <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> from anywhere.</li>
        <li><b>That hour-long video.</b> Paste the YouTube link, press “Distill video”, get the prompts back with timestamped links.</li>
        <li><b>Your skill folders.</b> All of them, into one library with collections, search and tags. See every installed copy, and which one somebody edited by hand.</li>
      </ul>`, 'is-tilt-l')}

    <section class="v29-sheet v29-pay" id="v29-pay" aria-labelledby="v29-pay-title">
      <div class="v29-copy">
        ${tape('is-tl')}${tape('is-br')}
        <h2 class="v29-head v29-pay-head" id="v29-pay-title">${ransom('TEST ONE TODAY.', 97)}</h2>
        <a class="v29-button is-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
        <p class="v29-sticker is-pay">Private GitHub repo.<br><b>Sign in with an account that has access.</b></p>
        <p class="v29-small">The build is unsigned, so Windows will make a face. Proceed anyway.</p>
      </div>
    </section>
  </main>
</div>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = root.querySelector<HTMLElement>('.v29')!;
  const sheets = [...root.querySelectorAll<HTMLElement>('.v29-sheet')];
  if (reduce || !('IntersectionObserver' in window)) { sheets.forEach(el => el.classList.add('is-copied')); page.classList.add('is-settled'); return; }
  page.classList.add('is-live');
  const copy = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-copied');
    copy.unobserve(entry.target);
  }), { threshold: .18 });
  sheets.forEach(el => copy.observe(el));
}
