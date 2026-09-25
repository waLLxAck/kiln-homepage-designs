// PROTOTYPE 45 — One sentence. Thirteen full-screen sentences in oxblood and mint. Fraunces' weight and optical size
// follow your scroll position within each screen (scroll-driven animation where supported, a JS fallback elsewhere).
//
// Order, deliberately: the unrun prompt is the hook everyone recognises, so testing leads (screens 1–7). A prompt that
// proves itself becomes a skill (8), which is exactly when "where do my skills live" starts to matter, so the library,
// copies, context cost and config follow (9–12). The download closes it (13).
import './style.css';
import { installer, windowsMark } from '../../content';

const P = 'v45';

type Screen = { text: string; fine: string; w: number; extra?: string };
const screens: Screen[] = [
  { text: 'You have saved more prompts than you have ever run.', fine: 'Kiln is a Windows desktop app for people who work with Codex, Claude Code and Copilot. It starts with the prompt you saved and never tried.', w: 360 },
  { text: 'Kiln runs the one you saved this morning on your own repo, right now.', fine: 'Pick a local project or an isolated example, then run that exact prompt revision through Codex or Claude Code.', w: 780 },
  { text: 'It uses the Codex or Claude Code you’re already signed into, so there’s no API key and no extra bill.', fine: 'Your ChatGPT or Claude subscription does the work, and its usage limits still apply. A notice shows what gets sent before anything runs.', w: 520 },
  { text: 'Nothing in your code changes, because every experiment is read-only.', fine: 'A task that would need edits or a missing tool comes back as uncertain, not as a success it faked.', w: 860 },
  { text: 'You watch every message, command and token while it happens.', fine: 'Reasoning summaries, web searches, the model, reasoning effort and elapsed time too. Two runs at once; cancel or retry whenever.', w: 300 },
  { text: 'The agent says pass, fail or uncertain, and you still decide.', fine: 'Its assessment is saved against that revision, kept apart from your own judgement.', w: 700 },
  { text: 'Change one line, run it again, and you learn what actually moved the result.', fine: 'Edit, compare revisions and diffs, rerun on the same repo. “Ask the agent” talks it through with the source attached.', w: 440,
    extra: `<div class="${P}-diff" aria-label="Revision 1 compared with revision 2"><p class="${P}-del"><span aria-hidden="true">−</span><span class="visually-hidden">Removed:</span> Use this app as a kid and tell me what’s confusing.</p><p class="${P}-add"><span aria-hidden="true">+</span><span class="visually-hidden">Added:</span> Use this app as a seven-year-old. Skip the parent-only signup. Try different activities until you hit something confusing or cannot tell what to do next. Describe that first obstacle and suggest a fix. Make no changes yet.</p></div>` },
  { text: 'The prompt that proves itself becomes a skill, approved down to the exact revision.', fine: '“Create skill” drafts a SKILL.md. Approval commits that snapshot to your own Kiln repository on GitHub, and installs into Codex, Claude Code or Copilot folders always use it. Editing starts a new draft.', w: 820 },
  { text: 'Then every skill lives in one library instead of seven places.', fine: '~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills, each project’s .github/skills, old chats, bookmarks. Import what’s installed as drafts; the originals stay where they are.', w: 380 },
  { text: 'You can see every copy in every project, including the one someone edited by hand.', fine: 'Installed, identical copy, differs, linked, or edited outside Kiln. Compare file by file with the approved version, or remove local copies in bulk.', w: 640 },
  { text: 'Every skill’s description rides along on every turn, so keep only the ones that earn it.', fine: 'Model-invoked skills sit in your agent’s context whether they fire or not. Kiln shows exactly what’s installed where. It doesn’t price each skill in tokens; test runs report their own usage.', w: 480 },
  { text: 'Your CLAUDE.md, AGENTS.md and config.toml finally sit in one place, with thirty backups each.', fine: 'Hooks, MCP, permissions, Claude, Copilot and VS Code settings and shell profiles too. Edited in place, with syntax checks, diffs, restore and stale-edit detection. Kiln never runs hooks.', w: 720 },
  { text: 'Download Kiln for Windows.', fine: '', w: 900 },
];

export function render(root: HTMLElement) {
  document.title = 'Kiln — You have saved more prompts than you have ever run';
  const last = screens.length - 1;
  root.innerHTML = `
<a class="skip" href="#${P}-s13">Skip to download</a>
<header class="${P}-top" data-tone="a">
  <a class="${P}-mark" href="#${P}-s1">Kiln</a>
  <a class="${P}-top-dl" href="${installer}">Download for Windows</a>
</header>
<main class="${P}" id="main">
  ${screens.map((s, i) => `
  <section class="${P}-screen ${i % 2 ? `${P}-b` : `${P}-a`}${i === last ? ` ${P}-end` : ''}" id="${P}-s${i + 1}" data-tone="${i % 2 ? 'b' : 'a'}" aria-labelledby="${P}-t${i + 1}" style="--w:${s.w};--kh:${(11.4 / s.text.length).toFixed(4)};--kp:${(0.92 / Math.sqrt(s.text.length)).toFixed(4)}">
    <div class="${P}-inner">
      ${i === 0 ? `<h1 id="${P}-t1" class="${P}-sentence">${s.text}</h1>` : `<h2 id="${P}-t${i + 1}" class="${P}-sentence">${s.text}</h2>`}
      ${s.extra ?? ''}
      ${i === last ? `
        <div class="${P}-cta">
          <a class="${P}-btn" href="${installer}">${windowsMark}<span>Download the installer</span></a>
          <p class="${P}-fine">Kiln 0.17.0 for Windows, with the CLI. The release is hosted in a private GitHub repository, so sign in with an account that has access. The build is unsigned and MIT licensed. Kiln creates your library repository with the official GitHub CLI.</p>
        </div>` : `<p class="${P}-fine">${s.fine}</p>`}
    </div>
    <p class="${P}-count" aria-hidden="true">${String(i + 1).padStart(2, '0')}<span>/${screens.length}</span></p>
  </section>`).join('')}
</main>`;

  const sections = [...root.querySelectorAll<HTMLElement>(`.${P}-screen`)];
  const header = root.querySelector<HTMLElement>(`.${P}-top`)!;

  // The fixed header takes the colours of whichever screen sits under it.
  const tone = () => {
    const probe = 40;
    const current = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    if (current) header.dataset.tone = current.dataset.tone === 'a' ? 'a' : 'b';
  };

  // Fallback for browsers without scroll-driven animations: same keyframes, driven from JS.
  const native = CSS.supports('animation-timeline: view()');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heads = sections.map(s => s.querySelector<HTMLElement>(`.${P}-sentence`)!);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const drive = () => {
    if (native || reduced) return;
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      const w = screens[i].w;
      const [wght, opsz] = p < .5 ? [lerp(100, w, p * 2), lerp(9, 144, p * 2)] : [lerp(w, 900, (p - .5) * 2), lerp(144, 24, (p - .5) * 2)];
      heads[i].style.fontVariationSettings = `'wght' ${wght.toFixed(0)}, 'opsz' ${opsz.toFixed(0)}`;
    });
  };
  let raf = 0;
  const frame = () => { raf = 0; tone(); drive(); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });
  addEventListener('resize', frame);
  frame();
}
