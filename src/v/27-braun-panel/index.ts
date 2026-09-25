// PROTOTYPE variant 24 — Panel. 1960s hardware: each skill is a row of switches for its install locations, with lamps.
import './style.css';
import { examples, installer, releaseNote, windowsMark } from '../../content';

type State = 'on' | 'drift' | 'off';
const locations = [
  { label: 'Agents', path: '~/.agents/skills' },
  { label: 'Claude', path: '~/.claude/skills' },
  { label: 'Project', path: 'game/.github/skills' },
];
const skills: { name: string; rev: number; states: State[] }[] = [
  { name: 'code-review', rev: 3, states: ['on', 'drift', 'on'] },
  { name: 'research', rev: 2, states: ['on', 'off', 'off'] },
  { name: 'writing-for-agents', rev: 5, states: ['off', 'on', 'off'] },
  { name: 'playtest', rev: 2, states: ['off', 'off', 'off'] },
  { name: 'release-notes', rev: 1, states: ['on', 'on', 'off'] },
];
const example = examples[1];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Every copy of every skill, on one panel';
  root.innerHTML = `
<div class="v24">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v24-top"><a class="v24-brand" href="?"><i></i>Kiln</a><a class="v24-top-link" href="#v24-get">Download</a></header>
  <main id="main">
    <section class="v24-hero" aria-labelledby="v24-title">
      <div class="v24-copy">
        <h1 id="v24-title">Every copy of every skill, on one panel.</h1>
        <p>Kiln shows where each skill is installed, and whether a copy changed behind your back.</p>
        <a class="v24-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        <p class="v24-fine">${releaseNote}</p>
      </div>

      <div class="v24-device" role="group" aria-label="Sample skill panel">
        <div class="v24-device-top">
          <div class="v24-grille" aria-hidden="true"></div>
          <div class="v24-meter" aria-hidden="true">
            <svg viewBox="0 0 160 96"><path class="v24-arc" d="M18 84a62 62 0 0 1 124 0"/>${Array.from({ length: 11 }, (_, i) => { const a = (-150 + i * 12) * Math.PI / 180; return `<line x1="${80 + Math.cos(a) * 56}" y1="${84 + Math.sin(a) * 56}" x2="${80 + Math.cos(a) * (i % 5 === 0 ? 46 : 50)}" y2="${84 + Math.sin(a) * (i % 5 === 0 ? 46 : 50)}"/>`; }).join('')}<line class="v24-needle" x1="80" y1="84" x2="80" y2="30"/><circle cx="80" cy="84" r="5"/></svg>
            <span>Installed copies</span>
          </div>
          <div class="v24-display" aria-live="polite"><p class="v24-d1"></p><p class="v24-d2"></p></div>
        </div>
        <div class="v24-rows">
          <div class="v24-head" aria-hidden="true"><span></span>${locations.map(l => `<span>${l.label}<small>${l.path.replace('game/', '')}</small></span>`).join('')}</div>
          ${skills.map((s, r) => `
          <div class="v24-row">
            <span class="v24-skill">${s.name}<small>rev ${s.rev}</small></span>
            ${s.states.map((st, c) => `
            <span class="v24-cell">
              <span class="v24-lamp" data-lamp="${r}-${c}" data-state="${st}" aria-hidden="true"></span>
              <button type="button" class="v24-switch" role="switch" aria-checked="${st !== 'off'}" data-r="${r}" data-c="${c}" aria-label="${s.name} in ${locations[c].path}"><i></i></button>
              ${st === 'drift' ? `<button type="button" class="v24-diffbtn" data-diff="${r}-${c}" aria-label="Compare the ${s.name} copy in ${locations[c].path} with approved revision ${s.rev}"></button>` : ''}
            </span>`).join('')}
          </div>`).join('')}
        </div>
        <div class="v24-legend" aria-hidden="true"><span><b class="v24-g"></b>Installed</span><span><b class="v24-a"></b>Edited outside Kiln</span><span><b></b>Not here</span><span class="v24-sample">Sample library</span></div>
      </div>
    </section>

    <section class="v24-plates" aria-label="How it works">
      <article class="v24-plate">
        <h2>Three lamps.</h2>
        <p>Green: installed from the approved revision. Amber: edited outside Kiln. Off: not here. Kiln also spots identical copies, copies that differ, and links.</p>
      </article>
      <article class="v24-plate">
        <h2>One switch off.</h2>
        <p>Remove local copies in bulk. Managed copies are deleted; anything else goes to a private backup. Your library keeps the skill.</p>
      </article>
      <article class="v24-plate">
        <h2>Fewer, better.</h2>
        <p>Every model-invoked skill’s description sits in your agent’s context on every turn, used or not. Keep the ones that earn it.</p>
      </article>
    </section>

    <section class="v24-module v24-library" aria-labelledby="v24-lib">
      <div class="v24-module-label"><h2 id="v24-lib">One library</h2></div>
      <div class="v24-module-body">
        <p class="v24-big">Prompts, skills and custom agents in one place, not scattered across <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and every project’s <code>.github/skills</code>.</p>
        <dl class="v24-spec">
          <div><dt>Import</dt><dd>Installed skills or a skills repository, as drafts. Originals stay put.</dd></div>
          <div><dt>Find</dt><dd>Skills and agents not in the library. Broken links and empty folders, cleaned up safely.</dd></div>
          <div><dt>Sort</dt><dd>Collections, tags, favorites. Filter by kind, status, provider, location, copy state, scope.</dd></div>
          <div><dt>Compare</dt><dd>An installed copy against the approved version, file by file.</dd></div>
        </dl>
      </div>
    </section>

    <section class="v24-module" aria-labelledby="v24-rev">
      <div class="v24-module-label"><h2 id="v24-rev">Fixed revisions</h2></div>
      <div class="v24-module-body">
        <div class="v24-counter-wrap" aria-hidden="true"><div class="v24-counter"><span>0</span><span>3</span></div><p>Approved revision of code-review. Revision 4 is a draft.</p></div>
        <dl class="v24-spec">
          <div><dt>Approve</dt><dd>Pins an exact revision. Committed and published to your own Kiln GitHub repository.</dd></div>
          <div><dt>Edit</dt><dd>Makes a new draft. The approved revision stays as it was.</dd></div>
          <div><dt>Install</dt><dd>Always approved content, with a receipt of revision and destination.</dd></div>
          <div><dt>Move</dt><dd>On another machine: “Install everything marked for this machine”, or <code>kiln skills sync</code>.</dd></div>
        </dl>
      </div>
    </section>

    <section class="v24-module" aria-labelledby="v24-test">
      <div class="v24-module-label"><h2 id="v24-test">Tested first</h2></div>
      <div class="v24-module-body">
        <figure class="v24-card">
          <p class="v24-card-src">${example.source} · ${example.title}</p>
          <blockquote>${example.prompt}</blockquote>
          <figcaption><span class="v24-pill">Read-only</span> Run it on your repo through Codex or Claude Code. See every command, the tokens, and a verdict: pass, fail or uncertain. You decide what becomes a skill.</figcaption>
        </figure>
        <p class="v24-note">Uses the Codex or Claude Code you’re already signed into. No API key, no extra API bill; usage limits still apply.</p>
      </div>
    </section>

    <section class="v24-module" aria-labelledby="v24-cfg">
      <div class="v24-module-label"><h2 id="v24-cfg">Config, too</h2></div>
      <div class="v24-module-body">
        <p class="v24-big">CLAUDE.md, AGENTS.md, config.toml, hooks, MCP, settings. Edited in place. Thirty backups each. Hooks are never run.</p>
      </div>
    </section>

    <section class="v24-get" id="v24-get" aria-labelledby="v24-get-title">
      <div class="v24-get-grille" aria-hidden="true"></div>
      <div>
        <h2 id="v24-get-title">Kiln 0.17.0</h2>
        <p>Windows. CLI included. MIT licensed.</p>
        <a class="v24-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        <p class="v24-fine">${releaseNote} Unsigned build.</p>
      </div>
    </section>
  </main>
</div>`;

  const d1 = root.querySelector<HTMLElement>('.v24-d1')!;
  const d2 = root.querySelector<HTMLElement>('.v24-d2')!;
  const needle = root.querySelector<SVGLineElement>('.v24-needle')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = 0;
  // The display steps through a short sequence of two-line frames, then rests on the last one.
  const show = (...frames: [string, string][]) => {
    clearTimeout(timer);
    const [[a, b], ...rest] = frames;
    d1.textContent = a; d2.textContent = b;
    d1.parentElement!.classList.remove('is-flash'); void d1.offsetWidth; d1.parentElement!.classList.add('is-flash');
    if (rest.length) timer = window.setTimeout(() => show(...rest), reduce ? 400 : 1300);
  };
  const summary = () => {
    const all = skills.flatMap(s => s.states);
    const copies = all.filter(s => s !== 'off').length, drift = all.filter(s => s === 'drift').length;
    needle.style.transform = `rotate(${-60 + copies / 15 * 120}deg)`;
    return [`${skills.length} skills · ${copies} copies`, drift ? `${drift} edited outside Kiln` : 'All copies match their approval'] as [string, string];
  };
  show(summary());

  root.querySelectorAll<HTMLButtonElement>('.v24-switch').forEach(btn => btn.addEventListener('click', () => {
    const r = Number(btn.dataset.r), c = Number(btn.dataset.c);
    const s = skills[r], was = s.states[c], loc = locations[c].path;
    const lamp = root.querySelector<HTMLElement>(`[data-lamp="${r}-${c}"]`)!;
    const diff = root.querySelector<HTMLElement>(`[data-diff="${r}-${c}"]`);
    if (was === 'off') {
      s.states[c] = 'on';
      btn.setAttribute('aria-checked', 'true');
      lamp.dataset.state = 'warming';
      setTimeout(() => (lamp.dataset.state = 'on'), reduce ? 0 : 420);
      show([`Install ${s.name} rev ${s.rev}`, `→ ${loc}`], ['Installed · receipt saved', 'A new agent session picks it up'], summary());
    } else {
      s.states[c] = 'off';
      btn.setAttribute('aria-checked', 'false');
      lamp.dataset.state = 'off';
      diff?.remove();
      show([`Remove ${s.name}`, `from ${loc}`], was === 'drift' ? ['Edited copy moved', 'to a private backup'] : ['Managed copy deleted', 'Still in your library'], summary());
    }
  }));
  root.querySelectorAll<HTMLButtonElement>('.v24-diffbtn').forEach(btn => btn.addEventListener('click', () => {
    btn.classList.add('is-down');
    setTimeout(() => btn.classList.remove('is-down'), 180);
    show(['− Review standards and the spec.', '+ Review the spec only.'], ['Differs from approved rev 3', 'Switch off to back it up']);
  }));
}
