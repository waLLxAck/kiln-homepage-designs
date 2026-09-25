// PROTOTYPE variant 48 — Mixtape. Side A: prompts that passed on your repo. Side B: skills you approved and installed.
import './style.css';
import { examples, installer, provenance, releaseNote, subscription, windowsMark } from '../../content';

type Track = { n: string; title: string; time: string; short: string; body: string; extra?: string };
type Side = { key: 'A' | 'B'; name: string; note: string; tracks: Track[] };

const sides: Side[] = [
  { key: 'A', name: 'Passed on my repo', note: 'Only prompts that survived a run on real code made the tape.', tracks: [
    { n: 'A1', title: 'Taped off the radio', time: '3:12', short: 'Capture anything in a second: text, links, screenshots, files, videos.',
      body: 'Paste or drop text, links, screenshots, images and files. Kiln lives in the tray: Ctrl+N captures, Ctrl+Shift+Space searches from anywhere. “Save only” keeps it without calling a model. “Analyze and add” turns a source into prompts, insights, techniques, tools and resources in a collection linked back to it. Paste a YouTube link and press “Distill video”: captions become entries with timestamped source links, and the transcript stays attached.' },
    { n: 'A2', title: examples[0].title, time: '2:48', short: 'Pick a repo and run the exact prompt revision through Codex or Claude Code.',
      body: 'Choose a local project or repository, or an isolated example, and run the exact revision through Codex or Claude Code. Experiments are read-only, so nothing in your code changes.', extra: examples[0].prompt },
    { n: 'A3', title: 'Live at your repo', time: '4:05', short: 'Watch it happen: messages, reasoning, commands, tokens.',
      body: 'You watch the run live: messages, reasoning summaries, commands, web searches, the model, reasoning effort, elapsed time and token counts (input, cached, output). Up to two runs at once. Cancel or retry whenever you like.' },
    { n: 'A4', title: 'Pass, fail, uncertain', time: '3:30', short: 'The agent gives a verdict. You still decide what gets taped.',
      body: 'The output and the agent’s pass, fail or uncertain assessment are saved against that revision. Tasks that need edits or tools it doesn’t have come back uncertain instead of as faked successes. The agent’s assessment is kept apart from your judgement: you decide what stays.' },
    { n: 'A5', title: 'Take two', time: '3:57', short: 'Edit, compare, run it again. That’s how prompting gets learned.',
      body: 'Edit the prompt, compare revisions and diffs, and run it again on the same repo, so you can see what changed the result. “Ask the agent” talks an item through with its attachments and the source video’s context.' },
  ] },
  { key: 'B', name: 'Approved and installed', note: 'The skills your agents actually load. Nothing else.', tracks: [
    { n: 'B1', title: 'From prompt to skill', time: '3:20', short: 'A prompt that keeps passing becomes a SKILL.md.',
      body: '“Create skill” drafts a SKILL.md from a prompt, an image or a note, using Kiln’s bundled writing-for-agents guidance, and links it back to its source. Approve it and install it into Codex, Claude Code or Copilot locations. A new agent session picks it up.' },
    { n: 'B2', title: 'The master tape', time: '4:12', short: 'Approval pins an exact revision. Edits never tape over it.',
      body: 'Every prompt and skill keeps its revision history and diffs. Approval pins an exact revision; editing starts a new draft and never replaces the approved one; installing always uses approved content. Approval commits and publishes that snapshot to your own Kiln GitHub repository, validated without executing anything.' },
    { n: 'B3', title: 'Cut the filler', time: '2:59', short: 'Every installed skill rides along in your agent’s context.',
      body: 'Every model-invoked skill’s description sits in the agent’s context on every turn, so forgotten, duplicate and stale skills spend tokens and attention whether or not they fire. Kiln shows exactly what’s installed where, so you can keep only what earns its place. Remove local copies in bulk: managed copies are deleted, anything else is moved to a private backup.' },
    { n: 'B4', title: 'Every deck in the house', time: '3:44', short: 'See every copy of a skill, including ones edited by hand.',
      body: 'Skills hide in ~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills and project .github/skills. For each skill Kiln lists every copy across personal locations and enrolled projects: installed, identical copy found, differs, linked, or edited outside Kiln. Compare a drifted copy file by file with the approved one. Import what you already have as drafts; the originals stay put.' },
    { n: 'B5', title: 'Dub a copy', time: '2:31', short: 'On another machine, one button installs your whole tape.',
      body: 'Open your Kiln repository on another machine and press “Install everything marked for this machine”, or run kiln skills sync. Git status, sync and conflict resolution are built in. The CLI returns JSON, so your agents can read the library too.' },
    { n: 'B6', title: 'Liner notes', time: '3:05', short: 'CLAUDE.md, AGENTS.md and friends, edited with backups.',
      body: 'CLAUDE.md, AGENTS.md, Codex config.toml and hooks.json, Claude and Copilot settings, MCP config, permissions, VS Code settings and shell profiles, in one place. Edits happen in the real file with syntax checks, 30 private backups, diff and restore, and a warning when the file changed on disk. Kiln never executes hooks.' },
  ] },
];

const TRACK_MS = 4200;

const cassette = `
<svg class="v48-tape-svg" viewBox="0 0 600 380" role="img" aria-labelledby="v48-tape-t">
  <title id="v48-tape-t">A clear smoky cassette labelled Kiln greatest hits, with two reels of tape.</title>
  <defs>
    <mask id="v48-lblmask"><rect x="36" y="26" width="528" height="200" rx="12" fill="#fff"/><rect x="146" y="104" width="308" height="96" rx="48" fill="#000"/></mask>
    <clipPath id="v48-shell"><rect x="8" y="8" width="584" height="364" rx="22"/></clipPath>
    <linearGradient id="v48-smoke" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b3346" stop-opacity=".9"/><stop offset=".55" stop-color="#231d2b" stop-opacity=".93"/><stop offset="1" stop-color="#3b3346" stop-opacity=".9"/></linearGradient>
  </defs>
  <rect class="v48-shell" x="8" y="8" width="584" height="364" rx="22" fill="url(#v48-smoke)"/>
  <g clip-path="url(#v48-shell)">
    <circle class="v48-pack v48-pack-l" cx="205" cy="152" r="96"/>
    <circle class="v48-pack v48-pack-r" cx="395" cy="152" r="40"/>
    <path d="M205 248 L150 344 L450 344 L395 248" class="v48-tapepath"/>
  </g>
  <g class="v48-hub v48-hub-l"><circle cx="205" cy="152" r="26" class="v48-hub-ring"/><circle cx="205" cy="152" r="13" class="v48-hub-hole"/>${[0, 60, 120, 180, 240, 300].map(a => `<rect x="202" y="136" width="6" height="7" rx="1" class="v48-tooth" transform="rotate(${a} 205 152)"/>`).join('')}</g>
  <g class="v48-hub v48-hub-r"><circle cx="395" cy="152" r="26" class="v48-hub-ring"/><circle cx="395" cy="152" r="13" class="v48-hub-hole"/>${[0, 60, 120, 180, 240, 300].map(a => `<rect x="392" y="136" width="6" height="7" rx="1" class="v48-tooth" transform="rotate(${a} 395 152)"/>`).join('')}</g>
  <g mask="url(#v48-lblmask)">
    <rect x="36" y="26" width="528" height="200" rx="12" class="v48-label"/>
    <rect x="36" y="26" width="528" height="30" class="v48-lbl-m"/>
    <rect x="36" y="56" width="528" height="12" class="v48-lbl-y"/>
    <rect x="36" y="68" width="528" height="6" class="v48-lbl-t"/>
    ${[178, 196, 214].map(y => `<line x1="60" x2="540" y1="${y + 8}" y2="${y + 8}" class="v48-lbl-rule"/>`).join('')}
  </g>
  <rect x="146" y="104" width="308" height="96" rx="48" class="v48-window"/>
  <text x="58" y="48" class="v48-lbl-print">KILN · C60 · HIGH BIAS</text>
  <text x="520" y="48" text-anchor="end" class="v48-lbl-print">90 MIN OF IDEAS</text>
  <g class="v48-sidebox"><rect x="52" y="96" width="62" height="70" rx="6"/><text x="83" y="150" text-anchor="middle" class="v48-side-letter">A</text></g>
  <text x="300" y="98" text-anchor="middle" class="v48-lbl-hand">greatest hits</text>
  <text x="510" y="176" text-anchor="middle" class="v48-lbl-hand v48-lbl-small" transform="rotate(-10 510 176)">tested!</text>
  <text x="300" y="218" text-anchor="middle" class="v48-lbl-hand v48-lbl-side">side A: passed on my repo</text>
  <path d="M150 300 L450 300 L472 368 L128 368 Z" class="v48-bottom"/>
  <circle cx="190" cy="336" r="9" class="v48-hole"/><circle cx="410" cy="336" r="9" class="v48-hole"/><rect x="266" y="326" width="68" height="20" rx="4" class="v48-hole"/>
  <line x1="136" y1="360" x2="464" y2="360" class="v48-tapeline"/>
  ${[[30, 30], [570, 30], [30, 350], [570, 350], [300, 312]].map(([x, y]) => `<g class="v48-screw"><circle cx="${x}" cy="${y}" r="7"/><path d="M${x - 4} ${y}h8M${x} ${y - 4}v8"/></g>`).join('')}
  <rect x="8" y="8" width="584" height="364" rx="22" class="v48-shine"/>
</svg>`;

const jface = (s: Side) => `
  <div class="v48-face v48-face-${s.key}" ${s.key === 'B' ? 'aria-hidden="true"' : ''}>
    <div class="v48-spine" aria-hidden="true"><span>KILN MIX · VOL. 1 · SIDE ${s.key}</span></div>
    <div class="v48-jmain">
      <div class="v48-jhead"><span class="v48-jlogo">Kiln</span><span class="v48-jhand">greatest hits</span></div>
      <p class="v48-jside"><b>Side ${s.key}</b> ${s.name.toLowerCase()}</p>
      <ol class="v48-jtracks">${s.tracks.map((t, i) => `<li><button type="button" data-play="${s.key}${i}" ${s.key === 'B' ? 'tabindex="-1"' : ''}><span class="v48-jn">${t.n}</span><span class="v48-jt">${t.title}</span><span class="v48-jd">${t.time}</span></button></li>`).join('')}</ol>
      <p class="v48-jcut"><span>left off this tape:</span> ${(s.key === 'A' ? ['the “read later” tab', 'that thread from March', 'a video at 2×, unfinished'] : ['the duplicate copy', 'the draft from last spring', 'a skill nobody calls']).map(x => `<s>${x}</s>`).join(' ')}</p>
      <p class="v48-jfoot">${s.note}</p>
    </div>
  </div>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Your greatest hits, not your whole hard drive.';
  root.innerHTML = `
<div class="v48">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v48-top">
    <a class="v48-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v48-side-a">Side A</a><a href="#v48-side-b">Side B</a><a href="#v48-master">The master tape</a><a href="#v48-get" class="v48-top-cta">Get the tape</a></nav>
  </header>
  <main id="main">
    <section class="v48-hero" aria-labelledby="v48-title">
      <div class="v48-hero-copy">
        <h1 id="v48-title">Your greatest hits, not your whole hard drive.</h1>
        <p>Kiln is a Windows app for people who work with Codex and Claude Code. It keeps a mixtape instead of a pile: the prompts that passed on your own repo, and the skills you approved and installed. Everything else can stay on the floor.</p>
        <a class="v48-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      </div>

      <div class="v48-deck">
        <div class="v48-tape">${cassette}</div>
        <div class="v48-case" data-side="A">
          <div class="v48-case-inner">${sides.map(jface).join('')}</div>
          <span class="v48-case-gloss" aria-hidden="true"></span>
        </div>
        <div class="v48-transport" role="group" aria-label="Tape deck">
          <div class="v48-counter" aria-hidden="true"><span class="v48-count">000</span><span class="v48-count-side">A</span></div>
          <button type="button" class="v48-key" data-k="rew" aria-label="Rewind to the start of this side"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 6 3 12l8 6zM21 6l-8 6 8 6z"/></svg></button>
          <button type="button" class="v48-key v48-key-play" data-k="play" aria-label="Play"><svg viewBox="0 0 24 24" aria-hidden="true" class="v48-i-play"><path d="M7 4v16l13-8z"/></svg><svg viewBox="0 0 24 24" aria-hidden="true" class="v48-i-pause"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>
          <button type="button" class="v48-key" data-k="ff" aria-label="Next track"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6l8 6-8 6zM13 6l8 6-8 6z"/></svg></button>
          <button type="button" class="v48-key v48-key-flip" data-k="flip"><span>Flip to side B</span></button>
          <span class="v48-press" aria-hidden="true">press play!</span>
        </div>
        <div class="v48-now" aria-live="polite">
          <p class="v48-now-label">Now playing</p>
          <p class="v48-now-title"></p>
          <p class="v48-now-text"></p>
          <div class="v48-now-bar" aria-hidden="true"><i></i></div>
        </div>
      </div>
    </section>

    ${sides.map(s => `
    <section class="v48-side v48-side-${s.key}" id="v48-side-${s.key.toLowerCase()}" aria-labelledby="v48-side-${s.key}-t">
      <header class="v48-side-head">
        <p class="v48-side-badge" aria-hidden="true">${s.key}</p>
        <div><h2 id="v48-side-${s.key}-t">Side ${s.key}: ${s.name.toLowerCase()}</h2><p>${s.note}</p></div>
      </header>
      <ol class="v48-rows">${s.tracks.map((t, i) => `
        <li class="v48-row" data-row="${s.key}${i}">
          <button type="button" class="v48-row-play" data-play="${s.key}${i}" aria-label="Play ${t.n}, ${t.title}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg></button>
          <div class="v48-row-head"><span class="v48-row-n">${t.n}</span><h3>${t.title}</h3><span class="v48-row-time">${t.time}</span></div>
          <p class="v48-row-body">${t.body}</p>
          ${t.extra ? `<blockquote class="v48-lyric"><p>${t.extra}</p><footer>${examples[0].source}. A real prompt from a Kiln library, shortened.</footer></blockquote>` : ''}
          ${t.n === 'B2' ? `<ol class="v48-master" id="v48-master" aria-label="Sample history of one skill">${provenance.map(p => `<li class="${p.state === 'Approved' ? 'is-master' : ''}"><b>${p.event}</b><span>${p.detail}</span><em>${p.state}</em></li>`).join('')}</ol>` : ''}
          ${t.n === 'B5' ? `<pre class="v48-dub"><code>&gt; kiln skills sync\n<span># installs the approved revision of every skill\n# marked for this machine</span></code></pre>` : ''}
        </li>`).join('')}
      </ol>
    </section>`).join('')}

    <section class="v48-bonus" aria-labelledby="v48-bonus-t">
      <p class="v48-bonus-tag" aria-hidden="true">bonus track</p>
      <h2 id="v48-bonus-t">You already own the deck.</h2>
      <p>${subscription.text} ${subscription.fine} Normal editing, approval and installing never call a model, and a consent notice explains what’s sent before any agent interaction.</p>
    </section>

    <section class="v48-get" id="v48-get" aria-labelledby="v48-get-t">
      <div class="v48-get-card">
        <h2 id="v48-get-t">Press record.</h2>
        <p>Start a tape of your own: the prompts that work on your code, the skills you trust, and nothing you’ll skip.</p>
        <a class="v48-btn v48-btn-big" href="${installer}">${windowsMark}<span>Download Kiln 0.17.0 for Windows</span></a>
        <p class="v48-note">${releaseNote}</p>
        <p class="v48-fine">Unsigned build, so Windows may ask you to confirm. MIT licensed, CLI included. Kiln sets up your library’s GitHub repository with the official gh CLI.</p>
      </div>
    </section>
  </main>
</div>`;

  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const deck = q('.v48-deck');
  const caseEl = q('.v48-case');
  const tape = q('.v48-tape');
  const packL = q<SVGCircleElement>('.v48-pack-l');
  const packR = q<SVGCircleElement>('.v48-pack-r');
  const count = q('.v48-count');
  const countSide = q('.v48-count-side');
  const playBtn = q<HTMLButtonElement>('[data-k="play"]');
  const flipBtn = q<HTMLButtonElement>('[data-k="flip"]');
  const nowTitle = q('.v48-now-title');
  const nowText = q('.v48-now-text');
  const nowBar = q('.v48-now-bar i');
  const sideLetter = q<SVGTextElement>('.v48-side-letter');
  const sideHand = q<SVGTextElement>('.v48-lbl-side');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let side = 0; // 0 = A, 1 = B
  let track = 0;
  let elapsed = 0; // ms into current track
  let playing = false;
  let last = 0;
  let raf = 0;
  let flipping = false;

  const sideLen = () => sides[side].tracks.length * TRACK_MS;
  const paint = () => {
    const s = sides[side];
    const t = s.tracks[track];
    const p = Math.min(1, (track * TRACK_MS + elapsed) / sideLen());
    const R = 96, r = 40;
    packL.setAttribute('r', String(r + (R - r) * (1 - p)));
    packR.setAttribute('r', String(r + (R - r) * p));
    count.textContent = String(Math.floor(p * 460) + side * 460).padStart(3, '0');
    countSide.textContent = s.key;
    nowTitle.innerHTML = `<span>${t.n}</span> ${t.title}`;
    nowText.textContent = t.short;
    nowBar.style.transform = `scaleX(${elapsed / TRACK_MS})`;
    root.querySelectorAll<HTMLElement>('[data-play]').forEach(b => b.closest('li')?.classList.toggle('is-on', b.dataset.play === `${s.key}${track}`));
    root.querySelectorAll<HTMLElement>('[data-row]').forEach(row => row.classList.toggle('is-on', row.dataset.row === `${s.key}${track}`));
  };

  const setPlaying = (on: boolean) => {
    playing = on;
    deck.classList.toggle('is-playing', on);
    playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
    playBtn.setAttribute('aria-pressed', String(on));
    if (on) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); deck.classList.add('has-played'); }
  };

  const setSide = (next: number, thenPlay: boolean) => {
    if (flipping) return;
    const go = () => {
      side = next; track = 0; elapsed = 0;
      caseEl.dataset.side = sides[side].key;
      sideLetter.textContent = sides[side].key;
      sideHand.textContent = side === 0 ? 'side A: passed on my repo' : 'side B: approved + installed';
      flipBtn.querySelector('span')!.textContent = side === 0 ? 'Flip to side B' : 'Flip to side A';
      root.querySelectorAll<HTMLElement>('.v48-face').forEach(f => {
        const on = f.classList.contains(`v48-face-${sides[side].key}`);
        f.setAttribute('aria-hidden', String(!on));
        f.querySelectorAll('button').forEach(b => b.tabIndex = on ? 0 : -1);
      });
      paint();
    };
    if (reduced) { go(); if (thenPlay) setPlaying(true); return; }
    flipping = true;
    caseEl.dataset.side = sides[next].key;
    const wasPlaying = playing || thenPlay;
    setPlaying(false);
    tape.classList.add('is-flipping');
    caseEl.classList.add('is-turning');
    window.setTimeout(go, 380);
    window.setTimeout(() => { tape.classList.remove('is-flipping'); caseEl.classList.remove('is-turning'); flipping = false; if (wasPlaying) setPlaying(true); }, 820);
  };

  const loop = (now: number) => {
    if (!playing) return;
    elapsed += now - last; last = now;
    if (elapsed >= TRACK_MS) {
      elapsed = 0;
      if (track < sides[side].tracks.length - 1) track++;
      else if (side === 0) { paint(); setSide(1, true); return; }
      else { track = sides[side].tracks.length - 1; elapsed = TRACK_MS; paint(); setPlaying(false); nowText.textContent = 'End of side B. Rewind, or flip back to side A.'; return; }
    }
    paint();
    raf = requestAnimationFrame(loop);
  };

  root.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    const key = t.closest<HTMLElement>('[data-k]')?.dataset.k;
    if (key === 'play') setPlaying(!playing);
    if (key === 'rew') { track = 0; elapsed = 0; paint(); }
    if (key === 'ff') {
      if (track < sides[side].tracks.length - 1) { track++; elapsed = 0; paint(); }
      else setSide(side ? 0 : 1, playing);
    }
    if (key === 'flip') setSide(side ? 0 : 1, playing);
    const play = t.closest<HTMLElement>('[data-play]')?.dataset.play;
    if (play) {
      const s = play[0] === 'A' ? 0 : 1;
      const i = Number(play.slice(1));
      const start = () => { track = i; elapsed = 0; paint(); setPlaying(true); };
      if (s !== side) { setSide(s, false); window.setTimeout(start, reduced ? 0 : 840); }
      else start();
      if (t.closest('.v48-row')) deck.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
  });

  paint();
}
