// PROTOTYPE H10 — The desk. A top-down desk in ink and watercolour; the laptop's screen is the real Kiln panel.
// Signature: a scroll-driven camera. It starts wide on the mess, sweeps each loose paper into the screen (where it becomes a row),
// then zooms until the crisp window fills the viewport and becomes the page's panel section.
import './style.css';
import { examples, installer } from '../../content';
import { S, W, H, bake, deskWashSvg, idea, inkLayer, paperWashSvg, papers, region, regionTight, type Paper } from './scene';
import { bindWindow, windowHtml, type Panel } from './ui';

const windows = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
const download = (text = 'Download Kiln for Windows') => `<a class="h10-download" href="${installer}">${windows}<span>${text}</span></a>`;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const captions: [number, number, string][] = [
  [.08, .26, 'Kiln looks in every folder your agents read: <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>.codex/skills</code>, <code>.copilot/skills</code> and each project’s <code>.github/skills</code>.'],
  [.26, .44, 'Each copy is filed under the place it came from. The duplicate, the one edited by hand and the broken link are named for what they are.'],
  [.44, .62, 'Nothing is thrown away on the way. The originals stay where they are until you decide. One note stays on the desk; we’ll come back to it.'],
];

const paperEl = (paper: Paper, cls = '') => `<div class="h10-paper h10-paper-${paper.shape} ${cls}" data-paper="${paper.key}" role="img" aria-label="${paper.label}"
  style="left:${paper.x - paper.w / 2}px;top:${paper.y - paper.h / 2}px;width:${paper.w}px;height:${paper.h}px;--r:${paper.r}deg"><div class="h10-paper-text">${paper.html}</div></div>`;

function stage() {
  return `<section class="h10-scroll" data-scroll aria-label="The desk, and the Kiln panel on the laptop">
    <div class="h10-stage" data-stage>
      <div class="h10-world" data-world style="width:${W}px;height:${H}px" role="img" aria-label="A top-down desk drawn in ink and watercolour: a laptop showing Kiln in the middle, surrounded by loose sticky notes, printouts, an index card and a folder, each naming a skill folder, plus a plant, a pencil and a coffee mug.">
        <div class="h10-deskwash" data-deskwash></div>${inkLayer()}
      </div>
      <div class="h10-screen" data-screen>${windowHtml()}</div>
      <div class="h10-papers" data-papers style="width:${W}px;height:${H}px">${papers.map(paper => paperEl(paper)).join('')}${paperEl(idea, 'h10-paper-idea')}</div>
      <header class="h10-top" data-fade><a class="h10-brand" href="#main">Kiln</a><nav aria-label="Main navigation"><a href="#h10-panel-title" data-to-panel>The panel</a><a href="#h10-test">Test an idea</a><a href="#h10-get">Download</a></nav></header>
      <div class="h10-hero" data-fade>
        <h1>Everything on this desk fits on one screen.</h1>
        <p>Skills pile up the way paper does: a copy in <code>~/.claude/skills</code>, another in <code>~/.agents/skills</code>, one inside a project, one somebody edited by hand, one nobody can place. Kiln files each of them into a single panel, with a switch for every place your agents look.</p>
        <div class="h10-hero-actions">${download()}<span class="h10-scrollhint" aria-hidden="true">Scroll slowly. The desk clears itself.</span></div>
      </div>
      <div class="h10-captions" aria-hidden="true">${captions.map(([, , text], index) => `<p class="h10-caption" data-caption="${index}">${text}</p>`).join('')}</div>
    </div>
  </section>`;
}

function testSection() {
  const example = examples[1];
  return `<section class="h10-section h10-test" id="h10-test" aria-labelledby="h10-test-title">
    <div class="h10-test-copy">
      <h2 id="h10-test-title">One note is still on the desk.</h2>
      <p>It’s a prompt you saved from a video and meant to try. Kiln runs it now, on a repository you choose, through the Codex or Claude Code you’re already signed into. The run is read-only, so nothing in your code changes, and you watch each step as it happens.</p>
    </div>
    <div class="h10-test-grid">
      <figure class="h10-note" data-note>
        <div class="h10-note-body"><p class="h10-hand h10-note-title">${example.title}</p><p class="h10-hand">${example.prompt}</p><p class="h10-hand h10-note-src">${example.source.toLowerCase()}</p></div>
        <figcaption>A real prompt from a Kiln library, shortened.</figcaption>
      </figure>
      <div class="h10-win h10-runwin">
        <div class="h10-titlebar"><span class="h10-appicon" aria-hidden="true">K</span><span>Experiment</span><span class="h10-winctl" aria-hidden="true"><i>—</i><i>▢</i><i>✕</i></span></div>
        <div class="h10-run" data-run aria-live="polite">
          <div class="h10-run-setup">
            <label class="h10-field"><span>Repository</span><select data-repo><option value="my-game">~/code/my-game (sample)</option><option value="example">Isolated example</option></select></label>
            <label class="h10-field"><span>Agent</span><select data-agent><option>Codex</option><option>Claude Code</option></select></label>
            <button type="button" class="h10-btn h10-btn-accent h10-btn-big" data-go>Run read-only</button>
          </div>
          <div class="h10-run-out" data-out><p class="h10-run-empty">The run appears here: reasoning summaries, commands, what the agent found, and its verdict. This page replays a sample; nothing calls a model.</p></div>
        </div>
      </div>
    </div>
  </section>`;
}

function getSection() {
  const facts = [
    ['Uses what you already pay for', 'Your signed-in Codex or Claude Code, on your ChatGPT or Claude subscription. No API key, no extra API bill; your plan’s usage limits still apply.'],
    ['Versions that stay put', 'Approval pins an exact revision and publishes it to your own Kiln GitHub repository. Edits become new drafts. On another machine, <code>kiln skills sync</code>.'],
    ['Config files, carefully', 'CLAUDE.md, AGENTS.md, settings, MCP config and hooks, edited in place with a diff and 30 private backups. Kiln never runs hooks.'],
    ['Capture without stopping', 'Ctrl+Shift+Space from anywhere. A YouTube link becomes prompts and techniques with timestamped source links.'],
  ];
  return `<section class="h10-section h10-get" id="h10-get" aria-labelledby="h10-get-title">
    <div class="h10-get-main">
      <h2 id="h10-get-title">Start with the folders you already have.</h2>
      <p>Kiln imports your installed skills as drafts and leaves the originals where they are. The desk clears at whatever pace you like.</p>
      <div class="h10-get-actions">${download()}</div>
      <p class="h10-fine">Kiln 0.17.0 for Windows, with Codex, Claude Code and Copilot. The release is hosted in a private GitHub repository, so sign in with an account that has access. Unsigned build, MIT licensed.</p>
    </div>
    <dl class="h10-facts">${facts.map(([term, text]) => `<div><dt>${term}</dt><dd>${text}</dd></div>`).join('')}</dl>
  </section>`;
}

export function render(root: HTMLElement) {
  document.title = 'Kiln — Everything on this desk fits on one screen.';
  root.innerHTML = `<div class="h10"><main id="main">${stage()}${testSection()}${getSection()}</main></div>`;
  const panel = bindWindow(root);
  bakeArt(root);
  const cam = bindCamera(root, panel);
  bindTest(root, panel, cam);
}

async function bakeArt(root: HTMLElement) {
  const desk = await bake(deskWashSvg(), W, H, 1);
  root.querySelector('[data-deskwash]')!.append(desk);
  for (const paper of [...papers, idea]) {
    const canvas = await bake(paperWashSvg(paper.w, paper.h, paper.color, paper.shape), paper.w, paper.h, 1.5);
    canvas.className = 'h10-paper-wash';
    root.querySelector(`[data-paper="${paper.key}"]`)!.prepend(canvas);
    if (paper === idea) root.querySelector<HTMLElement>('[data-note]')!.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }
}

type Camera = { toPanel(): void };

function bindCamera(root: HTMLElement, panel: Panel): Camera {
  const scroll = root.querySelector<HTMLElement>('[data-scroll]')!;
  const stageEl = root.querySelector<HTMLElement>('[data-stage]')!;
  const world = root.querySelector<HTMLElement>('[data-world]')!;
  const layer = root.querySelector<HTMLElement>('[data-papers]')!;
  const screen = root.querySelector<HTMLElement>('[data-screen]')!;
  const fades = root.querySelectorAll<HTMLElement>('[data-fade]');
  const captionEls = root.querySelectorAll<HTMLElement>('[data-caption]');
  const paperEls = papers.map(paper => ({ paper, el: root.querySelector<HTMLElement>(`[data-paper="${paper.key}"]`)! }));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = reduced || (navigator.webdriver && !location.search.includes('camera'));
  let vw = 0, vh = 0, s0 = 1, s1 = 1, f0 = { vx: 0, vy: 0, sx: 0, sy: 0 }, f1 = { vx: 0, vy: 0, sx: 0, sy: 0 }, queued = false;

  const measure = () => {
    vw = stageEl.clientWidth; vh = stageEl.clientHeight;
    const mobile = vw < 760;
    const box = mobile ? { x: 8, y: vh * .5, w: vw - 16, h: vh * .48 } : { x: vw * .42, y: 70, w: vw * .56, h: vh - 100 };
    const R = mobile ? regionTight : region;
    s0 = Math.min(box.w / R.w, box.h / R.h);
    f0 = { vx: box.x + box.w / 2, vy: box.y + box.h / 2, sx: R.x + R.w / 2, sy: R.y + R.h / 2 };
    s1 = Math.min(vw / S.w, vh / S.h);
    f1 = { vx: vw / 2, vy: vh / 2, sx: S.x + S.w / 2, sy: S.y + S.h / 2 };
    if (!still) { screen.style.width = `${vw}px`; screen.style.height = `${vh}px`; }
  };

  const frame = () => {
    queued = false;
    const travel = scroll.offsetHeight - vh;
    const p = still ? 0 : clamp((window.scrollY - scroll.offsetTop) / Math.max(1, travel));
    const z = (1 - Math.cos(Math.PI * clamp((p - .1) / .62))) / 2;
    const s = s0 * Math.pow(s1 / s0, z);
    const fz = (1 - Math.cos(Math.PI * clamp((p - .08) / .6))) / 2;
    const tx = lerp(f0.vx, f1.vx, fz) - s * lerp(f0.sx, f1.sx, fz), ty = lerp(f0.vy, f1.vy, fz) - s * lerp(f0.sy, f1.sy, fz);
    const cameraCss = `translate(${tx}px, ${ty}px) scale(${s})`;
    world.style.transform = cameraCss; layer.style.transform = cameraCss;

    fades.forEach(el => { const o = 1 - clamp((p - .015) / .07); el.style.opacity = String(o); el.style.transform = `translateY(${-40 * (1 - o)}px)`; el.style.visibility = o < .02 ? 'hidden' : 'visible'; });
    captionEls.forEach((el, index) => { const [a, b] = captions[index]; const o = still ? 0 : clamp(Math.min((p - a) / .04, (b - p) / .04)); el.style.opacity = String(o); el.style.visibility = o < .02 ? 'hidden' : 'visible'; });

    if (!still) {
      const u = ease(clamp((p - .74) / .12));
      const V = { x: tx + s * S.x, y: ty + s * S.y, w: s * S.w, h: s * S.h };
      const U = { x: lerp(V.x, 0, u), y: lerp(V.y, 0, u), w: lerp(V.w, vw, u), h: lerp(V.h, vh, u) };
      const k = Math.max(U.w / vw, U.h / vh);
      screen.style.transform = `translate(${U.x}px, ${U.y}px) scale(${k})`;
      screen.style.clipPath = `inset(0 ${Math.max(0, vw - U.w / k)}px ${Math.max(0, vh - U.h / k)}px 0 round ${lerp(6, 0, u) / k}px)`;
      screen.classList.toggle('is-live', u > .98); screen.inert = u <= .98;
      world.style.opacity = String(1 - clamp((p - .84) / .06));
      layer.style.opacity = String(1 - u);

      paperEls.forEach(({ paper, el }, index) => {
        const a = .08 + index * .056, q = clamp((p - a) / .13);
        if (q <= 0) { el.style.transform = `rotate(${paper.r}deg)`; el.style.opacity = '1'; el.style.setProperty('--lift', '0'); panel.file(paper.key, false); return; }
        const rect = panel.rowRect(paper.key);
        let gx = S.x + S.w / 2, gy = S.y + S.h * .7;
        if (rect) { gx = clamp((rect.left + rect.width * .3 - tx) / s, S.x + 40, S.x + S.w - 40); gy = clamp((rect.top + rect.height / 2 - ty) / s, S.y + 40, S.y + S.h - 30); }
        const e = ease(q), side = index % 2 ? 1 : -1;
        const mx = (paper.x + gx) / 2 + side * 220, my = (paper.y + gy) / 2 - 160;
        const bx = (1 - e) ** 2 * paper.x + 2 * (1 - e) * e * mx + e * e * gx, by = (1 - e) ** 2 * paper.y + 2 * (1 - e) * e * my + e * e * gy;
        const scale = lerp(1, .14, Math.pow(e, 1.6)) * (1 + .14 * Math.sin(Math.PI * Math.min(1, q * 1.3)));
        el.style.transform = `translate(${bx - paper.x}px, ${by - paper.y}px) rotate(${lerp(paper.r, 0, e) + side * 9 * Math.sin(Math.PI * e)}deg) scale(${scale})`;
        el.style.opacity = String(q < .78 ? 1 : 1 - (q - .78) / .22);
        el.style.setProperty('--lift', String(Math.sin(Math.PI * Math.min(1, q * 1.2))));
        panel.file(paper.key, q > .9);
      });
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };

  if (still) {
    scroll.classList.add('is-still');
    const section = document.createElement('section');
    section.className = 'h10-panel-still';
    section.setAttribute('aria-labelledby', 'h10-panel-title');
    section.append(screen);
    scroll.after(section);
    papers.forEach(paper => panel.file(paper.key, true));
    screen.classList.add('is-live');
    measure(); frame();
    window.addEventListener('resize', () => { measure(); frame(); });
  } else {
    measure(); frame();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', () => { measure(); queue(); });
  }
  const toPanel = () => {
    const target = still ? root.querySelector<HTMLElement>('.h10-panel-still')!.offsetTop : scroll.offsetTop + scroll.offsetHeight - vh;
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  };
  root.querySelector('[data-to-panel]')!.addEventListener('click', event => { event.preventDefault(); toPanel(); });
  return { toPanel };
}

type Step = { kind: 'think' | 'cmd' | 'msg'; text: string };
const steps: Step[] = [
  { kind: 'think', text: 'Start from what you expected, then look for the instruction that pointed the other way.' },
  { kind: 'cmd', text: 'cat AGENTS.md CLAUDE.md' },
  { kind: 'cmd', text: 'git log -3 --format=%s -- AGENTS.md' },
  { kind: 'msg', text: 'AGENTS.md line 14 still says to run the whole test suite after every change.' },
  { kind: 'think', text: 'The repo moved to per-package tests later; that line is older than the move.' },
];

function bindTest(root: HTMLElement, panel: Panel, cam: Camera) {
  const out = root.querySelector<HTMLElement>('[data-out]')!;
  const go = root.querySelector<HTMLButtonElement>('[data-go]')!;
  const note = root.querySelector<HTMLElement>('[data-note]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, reduced ? 0 : ms));
  let busy = false, approved = false;
  go.addEventListener('click', async () => {
    if (busy) return;
    busy = true; go.disabled = true;
    const repo = root.querySelector<HTMLSelectElement>('[data-repo]')!.value === 'example' ? 'isolated example' : '~/code/my-game';
    const agent = root.querySelector<HTMLSelectElement>('[data-agent]')!.value;
    out.innerHTML = `<dl class="h10-run-meta"><div><dt>Running on</dt><dd>${repo}, read-only</dd></div><div><dt>Agent</dt><dd>${agent}, medium effort</dd></div><div><dt>Elapsed</dt><dd data-clock>0:00</dd></div><div><dt>Tokens (sample)</dt><dd data-tokens>0</dd></div></dl>
      <ol class="h10-steps" data-steps></ol><div class="h10-verdict" data-verdict></div>`;
    const list = out.querySelector('[data-steps]')!, clock = out.querySelector('[data-clock]')!, tokens = out.querySelector('[data-tokens]')!;
    for (const [index, step] of steps.entries()) {
      await wait(620);
      const share = (index + 1) / steps.length, secs = Math.round(78 * share);
      list.insertAdjacentHTML('beforeend', `<li class="h10-step h10-step-${step.kind}"><span>${{ think: 'Reasoning', cmd: 'Command', msg: 'Found' }[step.kind]}</span>${step.kind === 'cmd' ? `<code>${step.text}</code>` : `<p>${step.text}</p>`}</li>`);
      clock.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      tokens.textContent = `${(28.4 * share).toFixed(1)}k in, ${(17.9 * share).toFixed(1)}k cached, ${(1.3 * share).toFixed(1)}k out`;
    }
    await wait(500);
    busy = false; go.disabled = false; go.textContent = 'Run it again';
    const verdict = out.querySelector<HTMLElement>('[data-verdict]')!;
    verdict.innerHTML = `<p><span class="h10-badge">Pass</span> <b>The agent’s assessment.</b> An outdated line in AGENTS.md told it to run every test, so it waited on the full suite instead of the package you changed. Smallest fix: replace line 14 with “Run the tests for the package you changed.” No files were changed.</p>
      <p class="h10-fine">Tasks that would need edits or tools it doesn’t have come back as uncertain, not as a faked pass. The verdict is the agent’s; whether you keep the prompt is yours.</p>
      <div class="h10-actions-row" data-keep-row>${approved ? '<p class="h10-landed">Already on your panel.</p>' : '<button type="button" class="h10-btn h10-btn-accent" data-approve>Approve as a skill and install</button><button type="button" class="h10-btn" data-later>Keep it as a prompt</button>'}</div>`;
    verdict.querySelector('[data-approve]')?.addEventListener('click', () => {
      approved = true;
      panel.add('instruction-trace');
      note.classList.add('is-filed');
      verdict.querySelector('[data-keep-row]')!.innerHTML = '<p class="h10-landed">Filed. <b>instruction-trace</b> is on your panel under Claude Code, and the desk is clear. <button type="button" class="h10-linkbtn" data-see>See it on the panel</button></p>';
      verdict.querySelector('[data-see]')!.addEventListener('click', cam.toPanel);
    });
    verdict.querySelector('[data-later]')?.addEventListener('click', event => { (event.target as HTMLElement).closest('[data-keep-row]')!.innerHTML = '<p class="h10-fine">Kept as a prompt, with this run attached to its revision.</p>'; });
  });
}
