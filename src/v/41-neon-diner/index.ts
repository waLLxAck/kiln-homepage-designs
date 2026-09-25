// PROTOTYPE variant 38 — Neon diner. Open late: order a saved prompt off tonight's specials and a kitchen ticket comes back from your own repo with a verdict.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type Verdict = 'pass' | 'uncertain';
type Special = {
  name: string; blurb: string; prompt: string; repo: string; cook: 'Claude Code' | 'Codex';
  log: string[]; first: { verdict: Verdict; note: string }; edit: string; second: { verdict: Verdict; note: string };
  tokens: [string, string, string]; time: string;
};

const specials: Special[] = [
  {
    name: examples[0].title, blurb: examples[0].idea, prompt: examples[0].prompt, repo: '~/code/kid-quiz', cook: 'Claude Code',
    log: ['reading src/routes and the signup flow', 'reasoning: the first screen asks for a parent', 'command: rg "onboarding" src/', 'tracing what a child would tap first'],
    first: { verdict: 'uncertain', note: 'Found the parent-only signup, but could not tell which activity a child would open first.' },
    edit: 'Start from the home screen and name the exact button you would press.',
    second: { verdict: 'pass', note: 'First obstacle: an unlabeled grey icon next to a brighter button that looks more fun. Suggests a label and a bigger target.' },
    tokens: ['48,210', '31,900', '2,114'], time: '2:14',
  },
  {
    name: examples[1].title, blurb: examples[1].idea, prompt: examples[1].prompt, repo: '~/code/billing-api', cook: 'Codex',
    log: ['reading AGENTS.md and CLAUDE.md', 'reasoning: the rename came from an old naming rule', 'command: git log -S "snake_case" -- AGENTS.md', 'comparing the rule with current files'],
    first: { verdict: 'pass', note: 'Traced the unwanted rename to an outdated line in AGENTS.md and proposed a one-line change. Nothing edited.' },
    edit: 'Also list any other guidance in these files that contradicts the code.',
    second: { verdict: 'pass', note: 'Same cause, plus two stale rules about test folders. Three proposed changes, each one line.' },
    tokens: ['36,480', '22,050', '1,720'], time: '1:38',
  },
  {
    name: examples[2].title, blurb: examples[2].idea, prompt: examples[2].prompt, repo: '~/code/tiny-racer', cook: 'Claude Code',
    log: ['reading level data and input handling', 'reasoning: can read the build, cannot play it', 'command: rg "jump|boost" src/game', 'ranking issues by how often a player hits them'],
    first: { verdict: 'uncertain', note: 'Ranked ten improvements from the code, but a real playtest needs a running build it does not have.' },
    edit: 'Judge from level data and input code, and mark which items need a human playtest.',
    second: { verdict: 'pass', note: 'Ten ranked improvements, three flagged for a human playtest. A list to review, no changes made.' },
    tokens: ['61,300', '40,720', '2,880'], time: '3:05',
  },
];

const houseSpecials = [
  { name: 'try-it-as-a-child', rev: 'Revision 2, approved', where: ['Claude Code', '~/.agents/skills'], state: 'Installed' },
  { name: 'code-review', rev: 'Revision 4, approved', where: ['Codex', 'game/.github/skills'], state: 'Edited outside Kiln' },
  { name: 'playtest-brief', rev: 'Revision 3, approved', where: ['Copilot', 'tiny-racer/.github/skills'], state: 'Installed' },
];

const neon = (text: string, cls: string) => `<span class="v38-neon ${cls}" aria-hidden="true">${[...text].map((ch, i) => `<span class="v38-tube" style="--d:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</span>`;

const stool = `<svg class="v38-stool" viewBox="0 0 80 120" aria-hidden="true"><ellipse cx="40" cy="14" rx="34" ry="11" fill="#b3262f"/><path d="M6 14v8c0 6 15 11 34 11s34-5 34-11v-8" fill="#86151e"/><ellipse cx="40" cy="12" rx="28" ry="7" fill="#d6404a" opacity=".55"/><rect x="35" y="32" width="10" height="72" fill="url(#v38-chrome-v)"/><ellipse cx="40" cy="108" rx="24" ry="6" fill="url(#v38-chrome-v)"/></svg>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Open late. Try it tonight.';
  root.innerHTML = `
<div class="v38">
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="v38-chrome-v" x1="0" x2="1"><stop offset="0" stop-color="#6e777e"/><stop offset=".35" stop-color="#f3f6f8"/><stop offset=".6" stop-color="#a9b1b7"/><stop offset="1" stop-color="#555d63"/></linearGradient></defs></svg>
  <header class="v38-top">
    <a class="v38-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v38-menu">Tonight’s specials</a><a href="#v38-house">House specials</a><a href="#v38-check">The check</a><a href="#v38-door">Download</a></nav>
  </header>
  <main id="main">
    <section class="v38-hero" aria-labelledby="v38-title">
      <div class="v38-wall-glow" aria-hidden="true"></div>
      <div class="v38-signs">
        <div class="v38-sign-main" role="img" aria-label="Neon sign: Kiln">${neon('Kiln', 'is-pink')}</div>
        <div class="v38-sign-open" role="img" aria-label="Neon sign: Open late">${neon('OPEN', 'is-teal')}<span class="v38-sign-rule" aria-hidden="true"></span>${neon('LATE', 'is-teal is-late')}</div>
      </div>
      <div class="v38-hero-copy">
        <h1 id="v38-title">Open late.<br>Try it tonight.</h1>
        <p>That prompt you saved at midnight doesn’t have to wait for the weekend. Kiln runs it on your own repo tonight, read-only, through the Codex or Claude Code you’re already signed into, and brings back the result with a verdict.</p>
        <div class="v38-hero-actions"><a class="v38-btn is-pink" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a><a class="v38-btn is-ghost" href="#v38-menu">See tonight’s specials</a></div>
        <p class="v38-small">Windows desktop app. ${releaseNote.replace('Kiln 0.17.0 for Windows. ', '')}</p>
      </div>
      <div class="v38-counter" aria-hidden="true"><div class="v38-counter-top"></div><div class="v38-counter-front"></div><div class="v38-stools">${stool.repeat(7)}</div></div>
    </section>

    <section class="v38-how" aria-labelledby="v38-how-title">
      <h2 id="v38-how-title">How the kitchen works</h2>
      <ol class="v38-how-list">
        <li><b>You order.</b> Paste a post, drop a screenshot, or press Ctrl+N. A YouTube link gets distilled into prompts with timestamped sources. Save only keeps it without calling a model.</li>
        <li><b>The kitchen reads your repo.</b> Pick a local project, or an isolated example. Experiments are read-only: nothing in your code changes. A consent notice says what’s sent first.</li>
        <li><b>The ticket comes back.</b> Watch it live: messages, reasoning, commands, model, effort, time and tokens. Up to two orders at once.</li>
        <li><b>You taste it.</b> The agent says pass, fail or uncertain. You decide what to keep. Send it back with an edit and run it again on the same repo.</li>
      </ol>
    </section>

    <section class="v38-menu" id="v38-menu" aria-labelledby="v38-menu-title">
      <div class="v38-board">
        <h2 id="v38-menu-title"><span class="v38-board-neon">${neon('specials', 'is-teal is-small')}</span><span class="visually-hidden">Tonight’s specials</span></h2>
        <p class="v38-board-sub">Tonight’s specials. Real prompts from a Kiln library, served on your repo.</p>
        <ul class="v38-items">${specials.map((item, i) => `
          <li class="v38-item">
            <div class="v38-item-head"><h3>${item.name}</h3><span class="v38-leader" aria-hidden="true"></span><span class="v38-price">on your plan</span></div>
            <p class="v38-item-blurb">${item.blurb}</p>
            <details class="v38-recipe"><summary>Read the recipe</summary><p>${item.prompt}</p></details>
            <button type="button" class="v38-order" data-order="${i}">Order it</button>
          </li>`).join('')}
        </ul>
      </div>
      <div class="v38-pass" aria-labelledby="v38-pass-title">
        <h3 id="v38-pass-title" class="visually-hidden">Kitchen tickets</h3>
        <div class="v38-rail" aria-hidden="true"></div>
        <div class="v38-tickets" aria-live="polite">
        </div>
      </div>
    </section>

    <section class="v38-house" id="v38-house" aria-labelledby="v38-house-title">
      <div class="v38-house-copy">
        <h2 id="v38-house-title">House specials</h2>
        <p class="v38-lede">The ones you order every week become skills you keep.</p>
        <p>Press Create skill and Kiln drafts a SKILL.md from the prompt, with bundled writing-for-agents guidance. You approve the exact revision you trust, and that snapshot is published to your own Kiln repository on GitHub. Edit it later and you get a new draft; the approved one stays in the case. Install always uses approved content, into Codex, Claude Code or Copilot locations. A new agent session picks it up.</p>
        <p>Keep the case tidy. Every skill in it is described to your agent on every turn, so Kiln shows each copy across your folders and projects, flags the ones edited outside Kiln, and lets you remove the ones you don’t use.</p>
      </div>
      <div class="v38-case" role="group" aria-label="Display case of approved skills, sample">
        <div class="v38-case-glass">
          ${houseSpecials.map(skill => `
            <div class="v38-shelf">
              <div class="v38-plate" aria-hidden="true"><span></span></div>
              <div class="v38-tag">
                <p class="v38-tag-name">${skill.name}</p>
                <p>${skill.rev}</p>
                <p>${skill.where.join(', ')}</p>
                <p class="v38-tag-state ${skill.state === 'Installed' ? '' : 'is-warn'}">${skill.state}</p>
              </div>
            </div>`).join('')}
        </div>
        <p class="v38-case-note">Sample case. On another machine, open your repo and press Install everything marked for this machine.</p>
      </div>
    </section>

    <section class="v38-check" id="v38-check" aria-labelledby="v38-check-title">
      <div class="v38-guest">
        <h2 id="v38-check-title">The check</h2>
        <dl>
          <div><dt>Cook</dt><dd>Your signed-in Codex or Claude Code</dd></div>
          <div><dt>API key</dt><dd>None</dd></div>
          <div><dt>Extra API bill</dt><dd>None</dd></div>
          <div><dt>Editing, approving, installing</dt><dd>No model call</dd></div>
          <div><dt>Usage limits</dt><dd>Your subscription’s, still apply</dd></div>
        </dl>
        <p class="v38-total"><span>Total</span><span>Already on your plan</span></p>
        <p class="v38-thanks">Thank you, come again</p>
      </div>
      <div class="v38-check-copy">
        <p class="v38-lede">You already pay for the agent.</p>
        <p>Kiln uses your ChatGPT or Claude subscription through the Codex or Claude Code app on your machine. Your library lives locally and is backed by a GitHub repository Kiln sets up for you with the official gh CLI. Your agents can read it too, through the CLI.</p>
      </div>
    </section>

    <section class="v38-door" id="v38-door" aria-labelledby="v38-door-title">
      <div class="v38-door-sign" role="img" aria-label="Neon sign: Open">${neon('OPEN', 'is-pink is-door')}</div>
      <h2 id="v38-door-title">Pull up a stool.</h2>
      <a class="v38-btn is-pink" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
      <p class="v38-small">${releaseNote} Builds are unsigned, so Windows may ask before it runs.</p>
    </section>
  </main>
</div>`;

  const tickets = root.querySelector<HTMLElement>('.v38-tickets')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let orderNo = 417;

  const stamp = (verdict: Verdict) => `<p class="v38-stamp is-${verdict}">${verdict}</p>`;

  const printTicket = (index: number, revision: number, instant = false) => {
    const item = specials[index];
    const result = revision === 1 ? item.first : item.second;
    const now = new Date();
    const time = `${((now.getHours() + 11) % 12) + 1}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() < 12 ? 'AM' : 'PM'}`;
    const lines = [
      `<p class="v38-t-head"><span>KILN KITCHEN</span><span>${instant ? '11:52 PM' : time}</span></p>`,
      `<p><span>Order</span><b>#${orderNo++}</b></p>`,
      `<p class="v38-t-block"><span>Item</span><b>${item.name}</b></p>`,
      `<p><span>Revision</span><b>${revision}</b></p>`,
      revision > 1 ? `<p class="v38-t-edit">+ ${item.edit}</p>` : '',
      `<p class="v38-t-block"><span>Table, read-only</span><b>${item.repo}</b></p>`,
      `<p><span>Cook</span><b>${item.cook}</b></p>`,
      '<hr>',
      ...item.log.map(line => `<p class="v38-t-log">&gt; ${line}</p>`),
      '<hr>',
      `<p><span>Model</span><b>your default</b></p>`,
      `<p><span>Effort</span><b>medium</b></p>`,
      `<p><span>Time</span><b>${item.time}</b></p>`,
      `<p><span>Tokens in</span><b>${item.tokens[0]}</b></p>`,
      `<p><span>Tokens cached</span><b>${item.tokens[1]}</b></p>`,
      `<p><span>Tokens out</span><b>${item.tokens[2]}</b></p>`,
      '<p class="v38-t-sample">Sample ticket. Real runs show your own numbers.</p>',
      '<hr>',
      `<div class="v38-t-verdict"><span>Agent’s verdict</span>${stamp(result.verdict)}</div>`,
      `<p class="v38-t-note">${result.note}</p>`,
      `<div class="v38-t-actions"><span>Your call</span>${revision === 1 ? `<button type="button" data-again="${index}">Send it back with an edit</button>` : ''}<a href="#v38-house">Make it a house special</a></div>`,
    ].filter(Boolean);
    const ticket = document.createElement('article');
    ticket.className = 'v38-ticket';
    ticket.setAttribute('aria-label', `Kitchen ticket for ${item.name}, revision ${revision}`);
    tickets.prepend(ticket);
    [...tickets.querySelectorAll('.v38-ticket')].slice(2).forEach(old => old.remove());
    tickets.querySelectorAll('.v38-ticket').forEach((t, i) => t.classList.toggle('is-old', i > 0));
    if (!instant && innerWidth < 900) ticket.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    if (reduced || instant) { ticket.innerHTML = lines.join(''); ticket.classList.add('is-done'); return; }
    let i = 0;
    const next = () => {
      ticket.insertAdjacentHTML('beforeend', lines[i]);
      i++;
      if (i < lines.length) setTimeout(next, lines[i - 1].includes('v38-t-log') ? 260 : lines[i]?.includes('v38-t-verdict') ? 520 : 110);
      else ticket.classList.add('is-done');
    };
    next();
  };

  root.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const order = target.closest<HTMLButtonElement>('[data-order]');
    if (order) { printTicket(Number(order.dataset.order), 1); return; }
    const again = target.closest<HTMLButtonElement>('[data-again]');
    if (again) { again.disabled = true; printTicket(Number(again.dataset.again), 2); }
  });

  // The last order of the night is still hanging on the rail when you walk in.
  printTicket(1, 1, true);

  // The door sign flickers on once, when you reach it.
  const door = root.querySelector<HTMLElement>('.v38-door-sign')!;
  if (navigator.webdriver || !('IntersectionObserver' in window)) door.classList.add('is-lit', 'is-static');
  else {
    const watch = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { door.classList.add('is-lit'); watch.disconnect(); } }, { threshold: .6 });
    watch.observe(door);
  }
}
