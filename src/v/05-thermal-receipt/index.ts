// PROTOTYPE variant 02 — Thermal receipt. A sample skills folder, itemised on a receipt that prints as you scroll. Void lines to shrink the tab.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Item = { loc: string; name: string; ctx: number; state: string; note?: string; kind: 'ok' | 'dup' | 'lost' | 'drift' | 'broken'; how?: string };
const groups: { loc: string; who: string; items: Item[] }[] = [
  { loc: '~/.claude/skills', who: 'Claude Code', items: [
    { loc: '~/.claude/skills', name: 'code-review', ctx: 120, state: 'Edited outside Kiln', note: 'differs from approved rev 4d2e81', kind: 'drift' },
    { loc: '~/.claude/skills', name: 'research', ctx: 95, state: 'Installed', note: 'approved rev 91c0aa', kind: 'ok' },
    { loc: '~/.claude/skills', name: 'pdf-tools', ctx: 140, state: 'Identical copy found', note: 'same files as ~/.agents/skills/pdf-tools', kind: 'dup', how: 'managed copy deleted' },
    { loc: '~/.claude/skills', name: 'react-rules-v2', ctx: 180, state: 'Not in your library', note: 'installed from a thread in March. You meant to read it.', kind: 'lost', how: 'moved to a private backup' },
  ] },
  { loc: '~/.agents/skills', who: 'Codex, Copilot and others', items: [
    { loc: '~/.agents/skills', name: 'pdf-tools', ctx: 140, state: 'Installed', note: 'approved rev 22b9e0', kind: 'ok' },
    { loc: '~/.agents/skills', name: 'writing-for-agents', ctx: 110, state: 'Installed', note: 'approved rev 3e7f12', kind: 'ok' },
    { loc: '~/.agents/skills', name: 'seo-audit', ctx: 160, state: 'Not in your library', note: 'for a site you shipped in 2024', kind: 'lost', how: 'moved to a private backup' },
    { loc: '~/.agents/skills', name: 'code-review-OLD', ctx: 125, state: 'Differs', note: 'an earlier copy nobody renamed back', kind: 'dup', how: 'moved to a private backup' },
  ] },
  { loc: '~/my-game/.github/skills', who: 'this project', items: [
    { loc: '.github/skills', name: 'playtest', ctx: 85, state: 'Installed', note: 'approved rev b72e10', kind: 'ok' },
    { loc: '.github/skills', name: 'code-review', ctx: 120, state: 'Linked', note: 'points at the ~/.agents copy', kind: 'ok' },
  ] },
  { loc: '~/.codex/skills', who: 'Codex', items: [
    { loc: '~/.codex/skills', name: 'deploy-checklist', ctx: 0, state: 'Broken link', note: 'loads nothing, just clutter', kind: 'broken', how: 'link cleaned up' },
  ] },
];
const all = groups.flatMap(group => group.items);
const n = (value: number) => value.toLocaleString('en-US');

// A 5×7 dot-matrix wordmark, drawn procedurally.
const glyphs: Record<string, string[]> = {
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  N: ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
};
const dots = (word: string) => {
  const cells: string[] = [];
  [...word].forEach((letter, li) => glyphs[letter].forEach((row, y) => [...row].forEach((bit, x) => { if (bit === '1') cells.push(`<circle cx="${li * 7 + x + .5}" cy="${y + .5}" r=".42"/>`); })));
  return `<svg class="v02-dots" viewBox="0 0 ${word.length * 7 - 2} 7" role="img" aria-label="Kiln"><title>Kiln</title>${cells.join('')}</svg>`;
};

const row = (left: string, right = '', cls = '') => `<div class="v02-row ${cls}"><span>${left}</span><span>${right}</span></div>`;
const rule = (char = '-') => `<div class="v02-rule v02-rule-${char === '=' ? 'double' : 'single'}" aria-hidden="true"></div>`;
const tag = { ok: '', dup: 'DUP', lost: 'LOST', drift: 'DRIFT', broken: 'BROKEN' } as const;

const itemLine = (item: Item, index: number) => `
  <div class="v02-item v02-p" data-i="${index}" data-kind="${item.kind}">
    <div class="v02-row v02-name"><span>${tag[item.kind] ? `<b class="v02-flag">${tag[item.kind]}</b> ` : ''}${item.name}</span><span class="v02-ctx" data-ctx="${item.ctx}">${item.ctx ? n(item.ctx) : '0'}</span></div>
    <div class="v02-sub">${item.state}${item.note ? `, ${item.note}` : ''}</div>
    ${item.how ? `<div class="v02-act"><button type="button" class="v02-void" data-i="${index}" aria-pressed="false" aria-label="${item.kind === 'broken' ? 'Clean up the broken link' : 'Remove local copy of'} ${item.name} in ${item.loc}">${item.kind === 'broken' ? 'Clean up link' : 'Remove local copy'}</button></div>` : ''}
    ${item.kind === 'drift' ? `<div class="v02-act"><button type="button" class="v02-compare" aria-expanded="false" aria-controls="v02-diff">Compare with approved</button></div>
      <div class="v02-diff" id="v02-diff" hidden><div class="v02-sub">SKILL.md, line 14</div><div class="v02-minus">- Review the standards and the spec.</div><div class="v02-plus">+ Review the spec. Skip style nits.</div><div class="v02-sub">Someone edited this copy by hand. Reinstall the approved revision, or approve the edit as a new one.</div></div>` : ''}
    <div class="v02-stamp" aria-hidden="true">VOID</div>
  </div>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Your skills folder is running a tab';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  const receiptItems = groups.map(group => `
    <div class="v02-group">
      <div class="v02-p v02-loc">${group.loc}</div>
      <div class="v02-p v02-sub v02-who">read by ${group.who}</div>
      ${group.items.map(item => itemLine(item, index++)).join('')}
    </div>`).join('');

  root.innerHTML = `
<div class="v02">
  <header class="v02-top">
    <a class="v02-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#v02-receipt">The receipt</a><a href="#v02-how">How the tab works</a><a href="#v02-stub">Download</a></nav>
  </header>
  <main id="main" class="v02-counter">
    <section class="v02-side" aria-labelledby="v02-title">
      <h1 id="v02-title">Your skills folder is running a tab.</h1>
      <p class="v02-lede">Every skill you install puts its description in front of your agent on every turn, whether it fires or not. The duplicate, the drifted copy, the one you installed from a thread in March: all on the tab. Kiln itemises it.</p>
      <div class="v02-meter" aria-live="polite">
        <p class="v02-meter-label">Sample tab per turn, made-up figures</p>
        <p class="v02-meter-num"><span data-total>0</span> <small>tokens</small></p>
        <p class="v02-meter-note">A made-up folder. Void a line on the receipt and watch this drop.</p>
      </div>
      <a class="v02-cta" href="#v02-stub">${windowsMark}<span>Jump to the download stub</span></a>
    </section>

    <div class="v02-desk">
      <div class="v02-printer" aria-hidden="true"><span class="v02-led"></span><span class="v02-slot"></span></div>
      <article class="v02-receipt" id="v02-receipt" aria-labelledby="v02-receipt-title">
        <div class="v02-paper">
          <div class="v02-p v02-head">${dots('KILN')}</div>
          <h2 class="v02-p v02-center v02-title" id="v02-receipt-title">Skills folder, itemised</h2>
          <p class="v02-p v02-center v02-sample">SAMPLE RECEIPT. NOT YOUR MACHINE.</p>
          <div class="v02-p">${row('TERMINAL', 'ONE AGENT TURN')}${row('REPO', '~/my-game')}${row('DATE', '24/09/2026 09:41')}</div>
          <div class="v02-p">${rule('=')}${row('<b>ITEM</b>', '<b>TOKENS/TURN*</b>')}${rule('=')}</div>
          ${receiptItems}
          <div class="v02-p">${rule('-')}</div>
          <div class="v02-p v02-totals">
            ${row('ITEMS INSTALLED', `${all.length}`)}
            ${row('DUPLICATES', `<span data-count="dup">0</span>`)}
            ${row('NOT IN LIBRARY', `<span data-count="lost">0</span>`)}
            ${row('EDITED OUTSIDE KILN', `<span data-count="drift">0</span>`)}
            ${row('VOIDED', `<span data-voided>0</span>`)}
          </div>
          <div class="v02-p">${rule('=')}</div>
          <div class="v02-p v02-grand">${row('TAB PER TURN', '<span data-total>0</span>')}</div>
          <p class="v02-p v02-sub v02-center">* SAMPLE FIGURES, FOR ILLUSTRATION.<br>KILN DOES NOT METER TOKENS PER SKILL.</p>
          <div class="v02-p">${rule('=')}</div>
          <div class="v02-p v02-bulk">
            <p class="v02-sub">SUGGESTED VOIDS: duplicates, lost skills and broken links.</p>
            <button type="button" class="v02-void-all">Remove every suggested copy</button>
            <p class="v02-sub">Managed copies are deleted. Anything else moves to a private backup, so a void can be undone.</p>
          </div>
          <div class="v02-voids" aria-live="polite"></div>

          <div class="v02-p">${rule('-')}</div>
          <h3 class="v02-p v02-sect">KEPT, AND KEPT HONEST</h3>
          <div class="v02-p">${row('LIBRARY', '1 place')}<div class="v02-sub">Prompts, skills, custom agents for Codex, Claude Code and Copilot, notes and sources. Collections, tags, favorites, search.</div></div>
          <div class="v02-p">${row('IMPORT', 'as drafts')}<div class="v02-sub">Bring an installed skills folder or repo in. The originals stay where they are.</div></div>
          <div class="v02-p">${row('APPROVAL', 'exact rev')}<div class="v02-sub">Pins one revision and publishes it to your own Kiln repo on GitHub. Edits make a new draft; installs use approved content only.</div></div>
          <div class="v02-p">${row('CONFIG FILES', '30 backups')}<div class="v02-sub">CLAUDE.md, AGENTS.md, config.toml, settings, MCP and hooks, edited in place with diff and restore. Hooks never run.</div></div>

          <div class="v02-p">${rule('-')}</div>
          <h3 class="v02-p v02-sect">INSTALL RECEIPT</h3>
          <div class="v02-p v02-boxed">
            ${row('SKILL', 'playtest')}${row('REVISION', 'b72e10 (approved)')}${row('DEST', '~/.agents/skills')}${row('RECORDED', 'rev + destination')}
          </div>
          <p class="v02-p v02-sub">Kiln really prints these, minus the paper. On another machine: <b>kiln skills sync</b> installs everything marked for it.</p>

          <div class="v02-p">${rule('-')}</div>
          <h3 class="v02-p v02-sect">TESTED BEFORE IT WAS KEPT</h3>
          <div class="v02-p">${row('CAPTURED', 'post from X')}${row('PROMPT', 'rev b72e10')}</div>
          <blockquote class="v02-p v02-quote">“${examples[2].prompt}”</blockquote>
          <div class="v02-p">${row('RUN ON', '~/my-game, read-only')}${row('AGENT', 'Claude Code')}${row('ELAPSED', '1m 52s')}</div>
          <div class="v02-p">${row('TOKENS IN', '48,210')}${row('  CACHED', '31,819')}${row('TOKENS OUT', '2,377')}</div>
          <div class="v02-p">${row('AGENT SAYS', '<b>PASS</b>')}${row('YOU SAY', 'KEEP')}</div>
          <p class="v02-p v02-sub">Run figures are a sample too, but these ones Kiln does show you: every test run reports input, cached and output tokens, model and reasoning effort. Nothing in the repo changes.</p>

          <div class="v02-p">${rule('-')}</div>
          <div class="v02-p v02-pay">${row('PAID WITH', 'your subscription')}<div class="v02-sub">${subscription.text} ${subscription.fine}</div></div>
          <div class="v02-p">${rule('=')}</div>
          <p class="v02-p v02-center v02-thanks">THANK YOU.<br>KEEP WHAT EARNS ITS PLACE.</p>
        </div>
        <div class="v02-tear" aria-hidden="true"><span>✂</span></div>
        <div class="v02-stub" id="v02-stub">
          <h2 class="v02-stub-title">Kiln 0.17.0 for Windows</h2>
          <a class="v02-download" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
          <p class="v02-sub">${releaseNote} Unsigned build. MIT licensed.</p>
          <p class="v02-barcode" aria-hidden="true">KILN-0170-WIN</p>
        </div>
      </article>
    </div>

    <section class="v02-how" id="v02-how" aria-labelledby="v02-how-title">
      <h2 id="v02-how-title">How the tab works, without the paper</h2>
      <ol>
        <li><h3>Descriptions load every turn.</h3><p>For each model-invoked skill, the agent keeps its name and description in context so it knows when to reach for it. Forgotten, duplicate and stale skills spend tokens and attention whether or not they fire.</p></li>
        <li><h3>Kiln shows what’s installed where.</h3><p>Across ~/.claude/skills, ~/.agents/skills, .codex/skills, .copilot/skills and project .github/skills: installed, identical copy found, differs, linked, or edited outside Kiln. “Find skills and agents not in the library” turns up the rest.</p></li>
        <li><h3>It doesn’t meter them.</h3><p>There is no per-skill token count in Kiln. The receipt above is a sample. What you get is the list, the comparison and the remove button, so you can keep only what earns its place.</p></li>
      </ol>
    </section>
  </main>
</div>`;

  const totals = root.querySelectorAll<HTMLElement>('[data-total]');
  const voids = root.querySelector<HTMLElement>('.v02-voids')!;
  const voided = new Set<number>();
  const update = () => {
    const sum = all.reduce((total, item, i) => total + (voided.has(i) ? 0 : item.ctx), 0);
    totals.forEach(el => { el.textContent = n(sum); });
    (['dup', 'lost', 'drift'] as const).forEach(kind => { root.querySelector(`[data-count="${kind}"]`)!.textContent = String(all.filter((item, i) => item.kind === kind && !voided.has(i)).length); });
    root.querySelector('[data-voided]')!.textContent = String(voided.size);
    voids.innerHTML = [...voided].sort((a, b) => a - b).map(i => `<div class="v02-voidline">${row(`VOID ${all[i].name}`, all[i].ctx ? `-${n(all[i].ctx)}` : '0')}<div class="v02-sub">${all[i].loc}, ${all[i].how}</div></div>`).join('');
    const bulk = root.querySelector<HTMLButtonElement>('.v02-void-all')!;
    const left = all.filter((item, i) => item.how && !voided.has(i)).length;
    bulk.textContent = left ? `Remove ${left === 1 ? 'the last suggested copy' : `all ${left} suggested copies`}` : 'Put them all back';
  };
  const setVoid = (i: number, on: boolean) => {
    if (on) voided.add(i); else voided.delete(i);
    const line = root.querySelector<HTMLElement>(`.v02-item[data-i="${i}"]`)!;
    line.classList.toggle('is-void', on);
    const button = line.querySelector<HTMLButtonElement>('.v02-void')!;
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Put it back' : all[i].kind === 'broken' ? 'Clean up link' : 'Remove local copy';
  };
  root.querySelectorAll<HTMLButtonElement>('.v02-void').forEach(button => button.addEventListener('click', () => { const i = Number(button.dataset.i); setVoid(i, !voided.has(i)); update(); }));
  root.querySelector('.v02-void-all')!.addEventListener('click', () => {
    const candidates = all.map((item, i) => item.how ? i : -1).filter(i => i >= 0);
    const on = candidates.some(i => !voided.has(i));
    candidates.forEach(i => setVoid(i, on));
    update();
  });
  const compare = root.querySelector<HTMLButtonElement>('.v02-compare')!;
  compare.addEventListener('click', () => {
    const open = compare.getAttribute('aria-expanded') !== 'true';
    compare.setAttribute('aria-expanded', String(open));
    compare.textContent = open ? 'Hide the difference' : 'Compare with approved';
    root.querySelector<HTMLElement>('#v02-diff')!.hidden = !open;
  });

  // Printing: every block starts blank and prints, line by line, as it feeds into view.
  const printable = [...root.querySelectorAll<HTMLElement>('.v02-p, .v02-quote')];
  if (reduce || !('IntersectionObserver' in window)) { printable.forEach(el => el.classList.add('is-printed')); update(); return; }
  root.querySelector('.v02')!.classList.add('is-live');
  const queue: HTMLElement[] = [];
  let running = false;
  const pump = () => {
    const next = queue.shift();
    if (!next) { running = false; return; }
    running = true;
    next.classList.add('is-printed');
    setTimeout(pump, 70);
  };
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top).forEach(entry => {
      observer.unobserve(entry.target);
      queue.push(entry.target as HTMLElement);
    });
    if (!running) pump();
  }, { rootMargin: '0px 0px -8% 0px' });
  printable.forEach(el => observer.observe(el));
  update();
}
