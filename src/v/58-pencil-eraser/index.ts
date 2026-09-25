// PROTOTYPE H02: graphite on graph paper for the mess, a dark Kiln panel for the fix.
// Signature: one sticky stage where scrolling drives an eraser across the pencil drawing and uncovers the panel underneath.
// Then drag a sketched saved idea onto a dark Test zone; a pass lands on the panel.
import './style.css';
import { examples, installer } from '../../content';
import { graphiteDefs, messDrawing, scrapBorder } from './art';

const windows = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download for Windows') => `<a class="h02-button" href="${installer}">${windows}<span>${text}</span></a>`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- data ----------

type Cell = 'on' | 'off' | 'edited';
type Column = 'claude' | 'agents' | 'project';
type Row = { name: string; note: string; cells: Record<Column, Cell>; fresh?: boolean };
const columns: { key: Column; name: string; short: string; path: string }[] = [
  { key: 'claude', name: 'Claude Code', short: 'Claude', path: '~/.claude/skills' },
  { key: 'agents', name: 'Codex, Copilot', short: 'Codex', path: '~/.agents/skills' },
  { key: 'project', name: 'my-game', short: 'my-game', path: '.github/skills' },
];

type Idea = { id: string; source: string; title: string; prompt: string; skill: string; first: 'pass' | 'uncertain'; lines: string[]; retry?: { note: string; edit: string; lines: string[] } };
const ideas: Idea[] = [
  { id: 'trace', source: 'From an agent workflow video', title: examples[1].title, prompt: examples[1].prompt, skill: 'instruction-trace', first: 'pass',
    lines: ['read AGENTS.md, CLAUDE.md', 'grep "run every test" -> 2 hits', 'traced the decision to CLAUDE.md:14', 'proposed a one-line change'] },
  { id: 'playtest', source: 'From a saved prompt', title: examples[2].title, prompt: examples[2].prompt, skill: 'playtest-ten', first: 'uncertain',
    lines: ['read src/game/loop.ts', 'tried to start the game: not allowed, read-only', 'ranked ideas from the code alone'],
    retry: { note: 'It couldn\'t start the game in a read-only run, so it only read the code. Marked uncertain instead of a pass.', edit: '+ Play it by reading the game loop and level data; don\'t start the game.', lines: ['read src/game/loop.ts', 'read levels/01.json .. 05.json', 'traced the first five minutes of play', 'ranked ten improvements with reasons'] } },
];

// ---------- markup ----------

function panel() {
  return `<div class="h02-panel" id="h02-panel" role="region" aria-label="Kiln skills panel (sample)">
    <div class="h02-win" aria-hidden="true"><span class="h02-win-mark"></span><b>Kiln</b><span class="h02-win-crumb">Skills</span><span class="h02-win-ctl"><i></i><i></i><i></i></span></div>
    <div class="h02-panel-body">
      <ul class="h02-side" aria-hidden="true"><li>Library</li><li class="is-on">Skills</li><li>Tests</li><li>Config files</li></ul>
      <div class="h02-main">
        <div class="h02-main-head"><b>Skills</b><span>3 locations, sample library</span></div>
        <div class="h02-table-wrap"><table>
          <caption class="visually-hidden">Each switch installs or removes that skill in that location.</caption>
          <thead><tr><th scope="col">Skill</th>${columns.map(column => `<th scope="col"><span class="h02-long">${column.name}</span><span class="h02-short">${column.short}</span><code>${column.path}</code></th>`).join('')}</tr></thead>
          <tbody data-rows></tbody>
        </table></div>
        <div class="h02-compare" data-compare hidden>
          <p><code>~/.claude/skills/code-review</code> was edited outside Kiln.</p>
          <div class="h02-diff"><p class="h02-del">- Review standards and the specification separately.</p><p class="h02-add">+ Review the specification only.</p></div>
          <div class="h02-row-actions"><button type="button" class="h02-ui h02-ui-primary" data-replace>Replace with rev 3</button><button type="button" class="h02-ui" data-keep>Keep as draft rev 4</button></div>
        </div>
        <div class="h02-found"><p class="h02-found-h">Found outside your library</p><ul data-found></ul></div>
        <p class="h02-status" data-status aria-live="polite"><span data-context></span></p>
      </div>
    </div>
  </div>`;
}

function scrap(idea: Idea, index: number) {
  return `<div class="h02-scrap-slot" data-slot="${idea.id}">
    <div class="h02-scrap h02-scrap-${index}" data-scrap="${idea.id}" tabindex="0" role="button" aria-label="Saved idea: ${idea.title}. Press Enter to send it to Test, or drag it onto Test." aria-describedby="h02-drag-help">
      ${scrapBorder(71 + index * 6)}
      <small>${idea.source}</small>
      <b>${idea.title}</b>
      <p>${idea.prompt}</p>
    </div>
    <button type="button" class="h02-send" data-send="${idea.id}">Send to Test</button>
  </div>`;
}

export function render(root: HTMLElement) {
  document.title = 'Kiln: five folders, one panel.';
  root.innerHTML = `<div class="h02">
    ${graphiteDefs()}
    <header class="h02-top">
      <a class="h02-brand" href="#main"><span class="h02-brand-mark" aria-hidden="true"></span>Kiln</a>
      <nav aria-label="Main navigation"><a href="#h02-panel">Panel</a><a href="#h02-test">Test</a><a href="#h02-get">Download</a></nav>
    </header>
    <main id="main">
      <section class="h02-hero" aria-labelledby="h02-title">
        <div class="h02-copy">
          <h1 id="h02-title" class="h02-pencil">Five folders.<br>One panel.</h1>
          <p class="h02-lede">Claude Code reads <code>~/.claude/skills</code>. Codex and Copilot read <code>~/.agents/skills</code>. Every repo has <code>.github/skills</code>. Kiln finds every copy and gives each skill one switch per place.</p>
          <div class="h02-cta">${download()}<span class="h02-cta-note">Windows. Private GitHub release.</span></div>
          <ol class="h02-steps" data-steps>
            <li data-step="0"><b>The mess.</b> Four copies of code-review. One edited by hand. A dead link.</li>
            <li data-step="1"><b>The scan.</b> Kiln reads every folder your agents load. Imports come in as drafts; originals stay put.</li>
            <li data-step="2"><b>The panel.</b> <span class="h02-key h02-key-on"></span>installed from the approved revision. <span class="h02-key h02-key-edited"></span>edited outside Kiln. Dashed: not in your library.</li>
          </ol>
        </div>
        <div class="h02-track" data-track>
          <div class="h02-sticky" data-sticky>
            <p class="h02-scroll-hint h02-pencil" data-hint aria-hidden="true">scroll to erase</p>
            <div class="h02-board" data-board>
              ${panel()}
              <svg class="h02-overlay" data-overlay aria-hidden="true"></svg>
              <div class="h02-crumbs" data-crumbs aria-hidden="true"></div>
              <div class="h02-eraser" data-eraser aria-hidden="true"><span class="h02-eraser-rubber"></span><span class="h02-eraser-sleeve">Kiln</span></div>
            </div>
            <p class="h02-caption" data-caption aria-hidden="true"></p>
            <figure class="h02-static-mess" data-static hidden><svg viewBox="0 0 820 580" role="img" aria-label="Pencil sketch of five skill folders holding four copies of code-review, one edited by hand."></svg><figcaption>Before: five folders. After: the panel below.</figcaption></figure>
          </div>
        </div>
      </section>

      <section class="h02-sec h02-test" id="h02-test" aria-labelledby="h02-test-title">
        <div class="h02-sec-head">
          <h2 id="h02-test-title" class="h02-pencil">Saved it? Test it.</h2>
          <p>Drop an idea on Test. Kiln runs that exact prompt on your repo through the Codex or Claude Code you're signed into. Read-only: your code doesn't change. You watch every command, then get the agent's verdict. Keeping it is your call.</p>
        </div>
        <div class="h02-test-grid">
          <div class="h02-scraps">
            ${ideas.map(scrap).join('')}
            <p class="h02-help" id="h02-drag-help">Drag a note onto Test, or focus it and press Enter. Sample ideas; two are real prompts from a Kiln library.</p>
          </div>
          <div class="h02-zone" data-zone aria-live="polite">
            <div class="h02-zone-idle" data-zone-idle>
              <span class="h02-zone-word">Test</span>
              <p>Drop a note here</p>
              <p class="h02-zone-meta"><code>~/code/my-game</code> read-only. Claude Code, your subscription.</p>
            </div>
            <div class="h02-run" data-run hidden></div>
          </div>
        </div>
      </section>

      <section class="h02-sec h02-facts" aria-labelledby="h02-facts-title">
        <h2 id="h02-facts-title" class="h02-pencil">Short answers.</h2>
        <dl>
          <div><dt>API key?</dt><dd>None. Kiln uses your signed-in Codex or Claude Code, on your ChatGPT or Claude plan. No extra API bill. Your plan's limits apply. Editing, approving and installing never call a model.</dd></div>
          <div><dt>Edit an approved skill?</dt><dd>You get a new draft. The approved revision stays pinned and installed. Approvals are committed to your own Kiln repository on GitHub.</dd></div>
          <div><dt>Second machine?</dt><dd>Open the repo. "Install everything marked for this machine." Or <code>kiln skills sync</code>.</dd></div>
          <div><dt>Where do ideas come from?</dt><dd>Ctrl+Shift+Space from anywhere. Paste a post, drop a screenshot, or give it a YouTube link: it becomes prompts with timestamped sources.</dd></div>
          <div><dt>Token cost?</dt><dd>Every installed skill's description loads into context on every turn. Kiln shows what's installed where, so you can switch off what you don't use. Each test run reports its own token usage.</dd></div>
          <div><dt>Config files?</dt><dd>CLAUDE.md, AGENTS.md, config.toml, hooks, MCP and settings. Edited in place, syntax-checked, 30 private backups. Hooks never run.</dd></div>
        </dl>
      </section>

      <section class="h02-sec h02-get" id="h02-get" aria-labelledby="h02-get-title">
        <div class="h02-get-card">
          <h2 id="h02-get-title">Clean up the folders tonight.</h2>
          ${download('Download Kiln 0.17.0 for Windows')}
          <p>Works with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository: sign in with an account that has access. Unsigned build. MIT licensed. CLI included.</p>
        </div>
      </section>
    </main>
  </div>`;
  const panelApi = bindPanel(root);
  bindStage(root);
  bindTest(root, panelApi);
}

// ---------- panel ----------

function bindPanel(root: HTMLElement) {
  const rows: Row[] = [
    { name: 'code-review', note: 'rev 3 approved', cells: { claude: 'edited', agents: 'on', project: 'on' } },
    { name: 'research', note: 'rev 2 approved', cells: { claude: 'on', agents: 'on', project: 'off' } },
    { name: 'writing-for-agents', note: 'rev 1 approved', cells: { claude: 'on', agents: 'off', project: 'off' } },
    { name: 'playtest-brief', note: 'rev 4 approved', cells: { claude: 'off', agents: 'off', project: 'on' } },
  ];
  const found = [
    { name: 'code-review (1)', where: '~/.claude/skills', kind: 'duplicate' as const },
    { name: 'pr-summary', where: '~/.agents/skills', kind: 'stray' as const },
  ];
  const body = root.querySelector<HTMLElement>('[data-rows]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const compare = root.querySelector<HTMLElement>('[data-compare]')!;
  const foundList = root.querySelector<HTMLElement>('[data-found]')!;
  const long: Record<Cell, string> = { on: 'installed', off: 'off', edited: 'edited outside Kiln' };
  let message = '';
  const count = (key: Column) => rows.filter(row => row.cells[key] !== 'off').length;
  const say = (text: string) => { message = text; paint(); status.classList.remove('is-new'); void status.offsetWidth; status.classList.add('is-new'); };
  const paint = () => { status.innerHTML = `<span>${message || 'Flip a switch.'}</span><span class="h02-status-count">Loaded per session: ${count('claude')} in Claude Code, ${count('agents')} in Codex</span>`; };
  const draw = () => {
    body.innerHTML = rows.map((row, r) => `<tr class="${row.fresh ? 'is-fresh' : ''}"><th scope="row"><b>${row.name}</b><small>${row.note}</small></th>${columns.map(column => {
      const state = row.cells[column.key];
      return `<td><button type="button" class="h02-switch h02-switch-${state}" data-row="${r}" data-col="${column.key}" aria-label="${row.name} in ${column.name}: ${long[state]}" aria-pressed="${state !== 'off'}"><i></i></button></td>`;
    }).join('')}</tr>`).join('');
    foundList.innerHTML = found.map((item, f) => `<li><span><b>${item.name}</b><code>${item.where}</code></span><button type="button" class="h02-ui" data-found="${f}">${item.kind === 'duplicate' ? 'Remove duplicate' : 'Import as draft'}</button></li>`).join('') || '<li class="h02-empty">Nothing outside your library.</li>';
    paint();
  };
  body.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.h02-switch');
    if (!button) return;
    const r = Number(button.dataset.row), row = rows[r], column = columns.find(item => item.key === button.dataset.col)!, state = row.cells[column.key];
    if (state === 'edited') { compare.hidden = false; say('Edited outside Kiln. Compare first.'); compare.querySelector<HTMLButtonElement>('button')?.focus(); return; }
    row.cells[column.key] = state === 'on' ? 'off' : 'on';
    say(state === 'on' ? `Removed from ${column.path}. Still in your library.` : `Installed ${row.note.split(' ').slice(0, 2).join(' ')} into ${column.path}. Receipt saved.`);
    draw();
    body.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-col="${column.key}"]`)?.focus();
  });
  compare.querySelector('[data-replace]')!.addEventListener('click', () => {
    rows[0].cells.claude = 'on'; compare.hidden = true; draw(); say('Edited copy backed up privately. Rev 3 installed.');
    body.querySelector<HTMLButtonElement>('[data-row="0"][data-col="claude"]')?.focus();
  });
  compare.querySelector('[data-keep]')!.addEventListener('click', () => {
    rows[0].note = 'rev 3 approved, rev 4 draft'; compare.hidden = true; draw(); say('Saved as draft rev 4. Rev 3 stays approved.');
    body.querySelector<HTMLButtonElement>('[data-row="0"][data-col="claude"]')?.focus();
  });
  foundList.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-found]');
    if (!button) return;
    const [item] = found.splice(Number(button.dataset.found), 1);
    if (item.kind === 'duplicate') say(`${item.name} moved to a private backup.`);
    else { rows.forEach(row => { row.fresh = false; }); rows.push({ name: item.name, note: 'draft, imported', cells: { claude: 'off', agents: 'off', project: 'off' }, fresh: true }); say(`${item.name} imported as a draft. Original untouched.`); }
    draw();
    foundList.querySelector<HTMLButtonElement>('button')?.focus();
  });
  draw();
  return {
    add(name: string, rev: number) {
      rows.forEach(row => { row.fresh = false; });
      const existing = rows.find(row => row.name === name);
      if (existing) existing.fresh = true;
      else rows.push({ name, note: `rev ${rev} approved, just now`, cells: { claude: 'on', agents: 'on', project: 'off' }, fresh: true });
      draw();
      say(`${name} approved and installed for Claude Code and Codex.`);
    },
  };
}

// ---------- the stage ----------

function bindStage(root: HTMLElement) {
  const hero = root.querySelector<HTMLElement>('.h02-hero')!;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const sticky = root.querySelector<HTMLElement>('[data-sticky]')!;
  const board = root.querySelector<HTMLElement>('[data-board]')!;
  const overlay = root.querySelector<SVGSVGElement>('[data-overlay]')!;
  const eraser = root.querySelector<HTMLElement>('[data-eraser]')!;
  const crumbs = root.querySelector<HTMLElement>('[data-crumbs]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const caption = root.querySelector<HTMLElement>('[data-caption]')!;
  const PAD = 56;

  if (reduced) {
    hero.classList.add('is-static');
    const figure = root.querySelector<HTMLElement>('[data-static]')!;
    figure.hidden = false;
    const [, , art] = messDrawing(false);
    figure.querySelector('svg')!.innerHTML = `<g class="h02-art">${art}</g>`;
    steps.forEach(step => step.classList.add('is-on'));
    overlay.remove(); eraser.remove(); hint.remove(); caption.remove();
    return;
  }

  let path: SVGPathElement, gridPattern: SVGPatternElement, length = 1, forced = false, last = -1, lastPoint = { x: 0, y: 0 }, raf = 0, distance = 1;

  const build = () => {
    const w = board.offsetWidth + PAD * 2, h = board.offsetHeight + PAD * 2;
    const tall = w / h < .9;
    const [aw, ah, art] = messDrawing(tall);
    const scale = Math.min((w - 40) / aw, (h - 40) / ah), ox = (w - aw * scale) / 2, oy = (h - ah * scale) / 2;
    const brush = tall ? 96 : 138, rowGap = brush * .7, rows = Math.ceil((h + 20) / rowGap);
    let d = `M-30,${brush * .3}`;
    for (let r = 0; r < rows; r++) {
      const y = brush * .3 + r * rowGap, right = r % 2 === 0;
      // Rub back and forth a little inside every pass, like a real eraser.
      const segments = Math.max(4, Math.round(w / 120));
      for (let s = 1; s <= segments; s++) {
        const x = right ? -30 + (w + 60) * s / segments : w + 30 - (w + 60) * s / segments;
        d += ` L${x.toFixed(1)},${(y + (s % 2 ? rowGap * .22 : -rowGap * .1)).toFixed(1)}`;
      }
      if (r < rows - 1) d += ` L${right ? w + 30 : -30},${(y + rowGap).toFixed(1)}`;
    }
    overlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
    overlay.setAttribute('width', String(w)); overlay.setAttribute('height', String(h));
    overlay.style.inset = `-${PAD}px`;
    overlay.innerHTML = `<defs>
        <pattern id="h02-grid" patternUnits="userSpaceOnUse" width="80" height="80">
          <path d="M0 .5H80M0 16.5H80M0 32.5H80M0 48.5H80M0 64.5H80M.5 0V80M16.5 0V80M32.5 0V80M48.5 0V80M64.5 0V80" stroke="#b8c8d6" stroke-opacity=".42" stroke-width="1" fill="none"/>
          <path d="M0 .5H80M.5 0V80" stroke="#9db2c5" stroke-opacity=".62" stroke-width="1" fill="none"/>
        </pattern>
        <filter id="h02-soft" filterUnits="userSpaceOnUse" x="-60" y="-60" width="${w + 120}" height="${h + 120}"><feGaussianBlur stdDeviation="${tall ? 5 : 7}"/></filter>
        <mask id="h02-erase" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
          <rect width="${w}" height="${h}" fill="#fff"/>
          <path data-rub d="${d}" fill="none" stroke="#000" stroke-width="${brush}" stroke-linecap="round" stroke-linejoin="round" filter="url(#h02-soft)"/>
        </mask>
      </defs>
      <g mask="url(#h02-erase)">
        <rect width="${w}" height="${h}" fill="#f2f5f7"/><rect width="${w}" height="${h}" fill="url(#h02-grid)" data-grid-rect/>
        <g class="h02-art" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${scale.toFixed(4)})">${art}</g>
      </g>`;
    path = overlay.querySelector<SVGPathElement>('[data-rub]')!;
    gridPattern = overlay.querySelector<SVGPatternElement>('#h02-grid')!;
    length = path.getTotalLength();
    path.style.strokeDasharray = `${length} ${length + 10}`;
    distance = Math.max(innerHeight * (innerWidth < 760 ? 1.5 : 1.35), 700);
    track.style.height = `${sticky.offsetHeight + distance}px`;
    last = -1;
    update();
  };

  const align = () => {
    // Keep the overlay's grid in register with the page's graph paper while the board is stuck.
    const rect = overlay.getBoundingClientRect(), x = rect.left + scrollX, y = rect.top + scrollY;
    gridPattern.setAttribute('x', String(-(((x % 80) + 80) % 80)));
    gridPattern.setAttribute('y', String(-(((y % 80) + 80) % 80)));
  };

  const spawn = (x: number, y: number, dir: number) => {
    if (crumbs.childElementCount > 70) return;
    const bit = document.createElement('i');
    const grey = Math.random() < .45;
    bit.style.cssText = `left:${x - PAD}px;top:${y - PAD}px;--dx:${(-dir * (10 + Math.random() * 40)).toFixed(0)}px;--dy:${(8 + Math.random() * 46).toFixed(0)}px;--r:${(Math.random() * 360).toFixed(0)}deg;--w:${(4 + Math.random() * 8).toFixed(1)}px;background:${grey ? '#8d9199' : '#e9ded6'}`;
    crumbs.appendChild(bit);
    setTimeout(() => bit.remove(), 1500);
  };

  const update = () => {
    raf = 0;
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const raw = forced ? 1 : Math.min(1, Math.max(0, (top - track.getBoundingClientRect().top) / distance));
    const p = Math.max(.05, raw);
    align();
    if (p === last) return;
    const done = p >= .995;
    path.style.strokeDashoffset = String(length * (1 - p));
    const pt = path.getPointAtLength(length * Math.min(p, .999));
    const dir = pt.x >= lastPoint.x ? 1 : -1;
    const moved = Math.hypot(pt.x - lastPoint.x, pt.y - lastPoint.y);
    if (!done) {
      const tilt = -22 + dir * 7 + Math.sin(p * 90) * 3;
      eraser.style.transform = `translate(${(pt.x - PAD).toFixed(1)}px, ${(pt.y - PAD).toFixed(1)}px) rotate(${tilt.toFixed(1)}deg)`;
      if (last >= 0 && moved > 3) for (let n = 0; n < Math.min(5, moved / 14); n++) spawn(pt.x + (Math.random() - .5) * 40, pt.y + (Math.random() - .3) * 30, dir);
    }
    board.classList.toggle('is-clean', done);
    hint.classList.toggle('is-gone', p > .08);
    steps.forEach((step, index) => step.classList.toggle('is-on', p >= [0, .3, .85][index]));
    const active = steps.filter(step => step.classList.contains('is-on')).pop();
    if (active && caption.dataset.step !== active.dataset.step) { caption.dataset.step = active.dataset.step; caption.innerHTML = active.innerHTML; }
    lastPoint = { x: pt.x, y: pt.y };
    last = p;
  };

  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  let resizeTimer = 0;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(build, 120); });
  // Keyboard users tabbing into the panel get it fully revealed at once.
  board.addEventListener('focusin', () => { if (!forced) { forced = true; update(); } });
  document.fonts?.ready.then(build);
  build();
}

// ---------- drag to test ----------

function bindTest(root: HTMLElement, panel: { add(name: string, rev: number): void }) {
  const zone = root.querySelector<HTMLElement>('[data-zone]')!;
  const idle = root.querySelector<HTMLElement>('[data-zone-idle]')!;
  const run = root.querySelector<HTMLElement>('[data-run]')!;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
  let busy = false;

  const over = (x: number, y: number) => { const r = zone.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; };

  root.querySelectorAll<HTMLElement>('[data-scrap]').forEach(note => {
    let startX = 0, startY = 0, dragging = false, moved = false;
    note.addEventListener('pointerdown', event => {
      if (busy || note.classList.contains('is-used') || (event.pointerType === 'mouse' && event.button !== 0)) return;
      dragging = true; moved = false; startX = event.clientX; startY = event.clientY;
      note.setPointerCapture(event.pointerId);
      note.classList.add('is-lifted');
    });
    note.addEventListener('pointermove', event => {
      if (!dragging) return;
      const dx = event.clientX - startX, dy = event.clientY - startY;
      if (Math.hypot(dx, dy) > 4) moved = true;
      note.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 40}deg) scale(1.04)`;
      zone.classList.toggle('is-over', over(event.clientX, event.clientY));
    });
    const end = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      note.classList.remove('is-lifted');
      const hit = over(event.clientX, event.clientY);
      zone.classList.remove('is-over');
      if (hit) { drop(note.dataset.scrap!, note); return; }
      note.style.transition = 'transform .45s cubic-bezier(.2, 1.5, .4, 1)'; note.style.transform = '';
      setTimeout(() => { note.style.transition = ''; }, 460);
      if (!moved) note.focus();
    };
    note.addEventListener('pointerup', end);
    note.addEventListener('pointercancel', end);
    note.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); drop(note.dataset.scrap!, note); }
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-send]').forEach(button => button.addEventListener('click', () => {
    drop(button.dataset.send!, root.querySelector<HTMLElement>(`[data-scrap="${button.dataset.send}"]`)!);
  }));

  function drop(id: string, note: HTMLElement) {
    if (busy || note.classList.contains('is-used')) return;
    const idea = ideas.find(item => item.id === id)!;
    root.querySelectorAll('.h02-scrap.is-used:not(.is-kept)').forEach(other => {
      other.classList.remove('is-used'); (other as HTMLElement).style.transform = ''; other.removeAttribute('aria-disabled');
    });
    // Fly the note into the zone, then let it vanish into the run.
    const n = note.getBoundingClientRect(), z = zone.getBoundingClientRect();
    const current = note.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    const baseX = current ? Number(current[1]) : 0, baseY = current ? Number(current[2]) : 0;
    const tx = baseX + (z.left + z.width / 2) - (n.left + n.width / 2), ty = baseY + (z.top + 90) - (n.top + n.height / 2);
    note.style.transition = reduced ? 'none' : 'transform .45s cubic-bezier(.4, 0, .2, 1), opacity .45s';
    note.style.transform = `translate(${tx}px, ${ty}px) scale(.35) rotate(-6deg)`;
    note.classList.add('is-used');
    note.setAttribute('aria-disabled', 'true');
    zone.classList.add('is-busy');
    setTimeout(() => play(idea, note, 1), reduced ? 0 : 420);
  }

  async function play(idea: Idea, note: HTMLElement, attempt: number) {
    busy = true;
    const lines = attempt > 1 && idea.retry ? idea.retry.lines : idea.lines;
    idle.hidden = true; run.hidden = false;
    run.innerHTML = `<div class="h02-run-head"><b>${idea.title}</b><span>rev ${attempt}</span></div>
      <p class="h02-run-meta"><span class="h02-pulse"></span>Claude Code in <code>~/code/my-game</code>, read-only</p>
      <ol class="h02-run-log" data-log></ol>
      <p class="h02-run-meta" data-tokens>0 tokens</p>
      <div class="h02-run-out" data-out></div>`;
    const log = run.querySelector('[data-log]')!, tokens = run.querySelector('[data-tokens]')!;
    for (const [index, text] of lines.entries()) {
      await wait(560);
      log.insertAdjacentHTML('beforeend', `<li>${text}</li>`);
      tokens.textContent = `sample: ${(7.1 * (index + 1)).toFixed(1)}k in / ${(4.4 * (index + 1)).toFixed(1)}k cached / ${(.5 * (index + 1)).toFixed(1)}k out, ${(index + 1) * 36} s`;
    }
    await wait(380);
    run.querySelector('.h02-pulse')?.classList.add('is-done');
    const out = run.querySelector<HTMLElement>('[data-out]')!;
    busy = false;
    if (attempt === 1 && idea.first === 'uncertain' && idea.retry) {
      out.innerHTML = `<p><span class="h02-verdict h02-verdict-uncertain">Uncertain</span> ${idea.retry.note}</p>
        <div class="h02-diff"><p class="h02-add">${idea.retry.edit}</p></div>
        <div class="h02-row-actions"><button type="button" class="h02-ui h02-ui-primary" data-again>Add the line, run rev 2</button><button type="button" class="h02-ui" data-reset>Put it back</button></div>`;
      out.querySelector<HTMLButtonElement>('[data-again]')!.addEventListener('click', () => play(idea, note, 2));
      out.querySelector<HTMLButtonElement>('[data-reset]')!.addEventListener('click', () => reset(note));
      out.querySelector<HTMLButtonElement>('[data-again]')!.focus();
      return;
    }
    out.innerHTML = `<p><span class="h02-verdict h02-verdict-pass">Pass</span> The agent's call. Yours next.</p>
      <div class="h02-row-actions"><button type="button" class="h02-ui h02-ui-primary" data-approve>Approve as ${idea.skill}</button><button type="button" class="h02-ui" data-reset>Not now</button></div>`;
    out.querySelector<HTMLButtonElement>('[data-approve]')!.addEventListener('click', () => {
      panel.add(idea.skill, attempt);
      note.classList.add('is-kept');
      out.innerHTML = `<p><span class="h02-verdict h02-verdict-pass">Approved</span> rev ${attempt} pinned and installed for Claude Code and Codex.</p>
        <div class="h02-landed"><span class="h02-landed-name">${idea.skill}</span><span class="h02-switch h02-switch-on" aria-hidden="true"><i></i></span><span class="h02-switch h02-switch-on" aria-hidden="true"><i></i></span><span class="h02-switch h02-switch-off" aria-hidden="true"><i></i></span></div>
        <div class="h02-row-actions"><a class="h02-ui h02-ui-primary" href="#h02-panel">See it on the panel</a><button type="button" class="h02-ui" data-reset>Test another</button></div>`;
      out.querySelector<HTMLButtonElement>('[data-reset]')!.addEventListener('click', () => reset());
      out.querySelector<HTMLElement>('a')!.focus();
    });
    out.querySelector<HTMLButtonElement>('[data-reset]')!.addEventListener('click', () => reset(note));
    out.querySelector<HTMLButtonElement>('[data-approve]')!.focus();
  }

  function reset(note?: HTMLElement) {
    run.hidden = true; idle.hidden = false; zone.classList.remove('is-busy');
    if (note && !note.classList.contains('is-kept')) {
      note.classList.remove('is-used'); note.removeAttribute('aria-disabled');
      note.style.transition = reduced ? 'none' : 'transform .5s cubic-bezier(.2, 1.3, .4, 1), opacity .4s'; note.style.transform = '';
      note.focus();
    } else root.querySelector<HTMLElement>('.h02-scrap:not(.is-used)')?.focus();
  }
}
