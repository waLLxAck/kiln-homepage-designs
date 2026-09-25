// PROTOTYPE variant 40 — Flat-pack instructions. A wordless assembly manual: parts list, eight steps from a bookmark to an installed skill, and a back page on keeping the library tidy.
import './style.css';
import { installer, releaseNote, windowsMark } from '../../content';
import { allen, arrow, bookmarkCard, branch, callout, check, cross, eye, folder, hammer, head, key, lock, magnifier, monitor, part, pencil, person, sheet, stamp } from './art';

const svg = (label: string, body: string, view = '0 0 480 300') => `<svg class="v40-draw" viewBox="${view}" role="img" aria-label="${label}">${body}</svg>`;
const floor = (x1 = 20, x2 = 460, y = 280) => `<path class="v40-floor" d="M${x1} ${y}H${x2}" fill="none"/>`;

const screenLines = (n: number, w: number) => Array.from({ length: n }, (_, i) => part(`<path d="M24 ${28 + i * 16}h${w - (i % 3) * 30}" fill="none"/>`, -12, 0, i + 1)).join('');

const cover = svg('An assembled bookcase full of skills and prompts, with the little assembler pointing at it proudly.', `
  ${floor(30, 490, 350)}
  <g transform="translate(220 50)">
    <rect width="210" height="300" rx="4"/>
    <path d="M10 10h190v280H10z" fill="none"/>
    <path d="M10 82h190M10 154h190M10 226h190" fill="none"/>
    ${part(`<rect x="22" y="30" width="18" height="52"/><rect x="44" y="22" width="22" height="60"/><rect x="70" y="36" width="16" height="46"/><path d="M96 82l14-56 16 4-14 56" /><path d="M152 60l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z"/>`, 0, -40, 1)}
    ${part(`<rect x="22" y="110" width="44" height="44" rx="3"/><path d="M30 124h28M30 134h20" fill="none"/><rect x="74" y="98" width="20" height="56"/><rect x="98" y="104" width="18" height="50"/><rect x="120" y="96" width="24" height="58"/>`, 0, -40, 2)}
    ${part(`<path d="M24 226v-44h40l8 8v36z"/><path d="M24 192h48" fill="none"/><rect x="92" y="172" width="18" height="54"/><rect x="114" y="178" width="22" height="48"/><rect x="140" y="170" width="16" height="56"/>`, 0, -40, 3)}
    <path d="M20 290v12M190 290v12" fill="none"/>
  </g>
  ${person(130, 350, 1.35, 'point')}
`, '0 0 520 380');

const parts = [
  { n: '1×', name: 'bookmark', art: svg('A saved post with a bookmark ribbon', bookmarkCard(21, 2), '0 0 120 100'), no: '100 017' },
  { n: '1×', name: 'your repo', art: svg('A folder with a branch icon: your repository', folder(12, 18, 96, 70) + branch(52, 44), '0 0 120 100'), no: '100 044' },
  { n: '1×', name: 'verdict', art: svg('A sheet with pass, uncertain and fail boxes', sheet(26, 6, 68, 88, 0) + check(46, 34, 9) + `<g transform="translate(46 58)"><circle r="9"/><text class="v40-t v40-t-sm" y="4" text-anchor="middle">?</text></g>` + cross(46, 80, 9) + `<path d="M62 34h18M62 58h14M62 80h18" fill="none"/>`, '0 0 120 100'), no: '100 052' },
  { n: '1×', name: 'approval', art: svg('A rubber stamp', stamp(60, 80) + `<path d="M28 90h64" fill="none"/>`, '0 0 120 100'), no: '100 066' },
];

const steps = [
  {
    caption: 'Paste, drop or press Ctrl+N. Save only calls no model.',
    art: svg('Step 1: a saved post drops into the Kiln box.', `
      ${floor()}
      ${person(96, 280, 1.1, 'hold')}
      <g transform="translate(250 150)"><path d="M0 0h180v130H0z"/><path d="M0 0l-20-30h180l20 30" fill="none"/><path d="M60 58h60" fill="none"/><text class="v40-t v40-t-big" x="90" y="100" text-anchor="middle">Kiln</text></g>
      ${part(`<g transform="rotate(-12 330 60)">${bookmarkCard(290, 16)}</g>`, -150, -30, 1)}
      ${arrow('M330 124v34', 2)}${head(330, 160, 90, 2)}
      <g transform="translate(40 30)"><rect width="58" height="34" rx="6"/><text class="v40-t v40-t-sm" x="29" y="22" text-anchor="middle">Ctrl</text><rect x="68" width="34" height="34" rx="6"/><text class="v40-t v40-t-sm" x="85" y="22" text-anchor="middle">N</text></g>`),
  },
  {
    caption: 'Pick your repo. Read-only: nothing in your code changes.',
    art: svg('Step 2: your repository slides onto the table, with an eye and a lock: it will be read, not changed.', `
      ${floor()}
      ${part(`${folder(180, 120, 200, 150)}${branch(270, 170)}`, 180, 0, 1)}
      ${part(eye(280, 60), 0, -30, 2)}
      ${part(lock(372, 118), 0, -20, 3)}
      ${person(96, 280, 1.1, 'point')}`),
  },
  {
    caption: 'Run it through Codex or Claude Code. Watch it live. Up to 2 at once.',
    art: svg('Step 3: a monitor fills with lines as the run happens live. A callout shows two runs can go at once.', `
      ${floor()}
      ${person(80, 280, 1.1, 'stand')}
      <g opacity=".35">${monitor(204, 40, 210, 150)}</g>
      ${monitor(180, 56, 210, 150, screenLines(6, 150))}
      ${callout(432, 52, '2×')}
      <path d="M390 180c40 0 40 60 60 60" fill="none" stroke-dasharray="6 6"/>
      <g transform="translate(410 236)"><rect width="56" height="36" rx="5"/><path d="M12 12h32M12 22h22" fill="none"/></g>`),
  },
  {
    caption: 'The agent says pass, fail or uncertain. You decide what to keep.',
    art: svg('Step 4: a verdict sheet slides in while the assembler thinks it over.', `
      ${floor()}
      ${part(`${sheet(250, 60, 150, 200, 0)}${check(284, 104, 14)}<path d="M308 104h70" fill="none"/><g transform="translate(284 154)"><circle r="14"/><text class="v40-t" y="6" text-anchor="middle">?</text></g><path d="M308 154h58" fill="none"/>${cross(284, 204, 14)}<path d="M308 204h66" fill="none"/>`, 120, 0, 1)}
      ${person(110, 280, 1.1, 'think')}
      <g class="v40-part" style="--dx:0px;--dy:10px;--i:3"><circle cx="138" cy="146" r="5"/><circle cx="152" cy="128" r="8"/><path d="M150 84a28 22 0 1 1 56 0a28 22 0 1 1-56 0z"/>${check(178, 84, 12)}</g>`),
  },
  {
    caption: 'Edit the prompt: that makes revision 2. Same repo, run again.',
    art: svg('Step 5: revision 1 is edited with a pencil into revision 2, then a loop arrow runs it again on the same repository.', `
      ${sheet(40, 30, 120, 150, 5, 'rev 1')}
      ${arrow('M178 104h60', 1)}${head(240, 104, 0, 1)}
      ${part(`<g transform="translate(260 30)"><path d="M0 0h104l16 16v134H0z"/><path d="M104 0v16h16" fill="none"/><path d="M12 28h96M12 42h78M12 56h96" fill="none"/><path d="M12 72h96" class="v40-thick" fill="none"/><path d="M12 88h70M12 102h96" fill="none"/><text class="v40-t" x="12" y="138">rev 2</text></g>`, 40, 0, 2)}
      ${part(pencil(360, 118, -150), 40, -30, 3)}
      ${arrow('M320 196c0 40-18 52-44 52', 4)}${head(274, 248, 180, 4)}
      ${folder(200, 222, 70, 50)}`),
  },
  {
    caption: 'Create skill drafts a SKILL.md, with writing-for-agents guidance.',
    art: svg('Step 6: the tested prompt becomes a SKILL.md document, with a small guide book beside it.', `
      ${sheet(40, 60, 110, 140, 5, 'rev 2')}
      ${arrow('M166 130h56', 1)}${head(224, 130, 0, 1)}
      ${part(`<g transform="translate(244 30)"><path d="M0 0h150l22 22v200H0z"/><path d="M150 0v22h22" fill="none"/><rect x="14" y="16" width="118" height="26" rx="3"/><text class="v40-t" x="22" y="35">SKILL.md</text><path d="M14 62h140M14 78h120M14 94h140M14 110h96M14 126h140M14 142h110" fill="none"/></g>`, 0, 40, 2)}
      ${part(`<g transform="translate(60 222)"><path d="M0 8c20-10 40-10 50 0 10-10 30-10 50 0v44c-20-10-40-10-50 0-10-10-30-10-50 0z"/><path d="M50 8v44" fill="none"/></g>`, -30, 0, 3)}`),
  },
  {
    caption: 'Approve this exact revision. It’s published to your own GitHub repo.',
    art: svg('Step 7: a stamp comes down on the SKILL.md for revision 2, and an arrow carries it to your own repository.', `
      ${floor()}
      ${sheet(60, 80, 150, 190, 7)}
      ${part(stamp(135, 132), 0, -70, 1)}
      <g class="v40-part" style="--dx:0px;--dy:0px;--i:2"><circle cx="160" cy="214" r="30" class="v40-thick"/><text class="v40-t v40-t-sm" x="160" y="210" text-anchor="middle">rev 2</text>${check(160, 226, 7)}</g>
      ${arrow('M226 176h110', 3)}${head(338, 176, 0, 3)}
      <g transform="translate(350 110)"><rect width="100" height="170" rx="6"/><path d="M0 50h100M0 100h100" fill="none"/><circle cx="18" cy="25" r="4" class="v40-ink"/><circle cx="18" cy="75" r="4" class="v40-ink"/>${branch(66, 118)}</g>`),
  },
  {
    caption: 'Install into Claude Code, Codex or Copilot. A new session picks it up.',
    art: svg('Step 8: three skill cards slide into three slots, one for each agent, while the assembler cheers.', `
      ${floor()}
      ${person(80, 280, 1.1, 'happy')}
      ${['Claude Code', 'Codex', 'Copilot'].map((name, i) => `
        <g transform="translate(240 ${30 + i * 82})"><rect width="220" height="66" rx="6"/><rect x="18" y="26" width="92" height="14" rx="2" class="v40-slot"/><text class="v40-t v40-t-sm" x="124" y="38">${name}</text></g>
        ${part(`<g transform="translate(262 ${4 + i * 82})"><rect width="48" height="54" rx="4"/><path d="M10 14h28M10 24h20M10 34h28" fill="none"/></g>`, -130, 0, i + 1)}`).join('')}`),
  },
];

const dontDo = (bad: string, good: string, badLabel: string, goodLabel: string, caption: string) => `
  <figure class="v40-dd">
    <div class="v40-dd-half is-bad">${bad}${svg(badLabel, cross(24, 24, 18), '0 0 48 48').replace('v40-draw', 'v40-dd-mark')}</div>
    <div class="v40-dd-half is-good">${good}${svg(goodLabel, check(24, 24, 18), '0 0 48 48').replace('v40-draw', 'v40-dd-mark')}</div>
    <figcaption>${caption}</figcaption>
  </figure>`;

const ddTests = dontDo(
  svg('Don’t: a hammer bangs on your repository.', `${floor(20, 300, 190)}${folder(90, 90, 140, 100)}${branch(152, 124)}${part(hammer(250, 30), 30, -20, 1)}<path d="M236 70l14-10M240 90h18M232 52l6-14" fill="none"/>`, '0 0 320 210'),
  svg('Do: a magnifying glass looks at your repository.', `${floor(20, 300, 190)}${folder(90, 90, 140, 100)}${branch(152, 124)}${part(magnifier(220, 70, 36), 40, -20, 1)}`, '0 0 320 210'),
  'Wrong', 'Right',
  'Tests read your code, they never write to it. A task that needs edits comes back uncertain.',
);

const ddEdits = dontDo(
  svg('Don’t: a pencil scribbles on the approved, stamped sheet.', `${sheet(90, 20, 120, 170, 6)}<circle cx="170" cy="150" r="22" class="v40-thick"/>${check(170, 150, 7)}${part(pencil(190, 120, -150), 30, -20, 1)}<path d="M110 80c10-8 20 8 30 0s20 8 30 0" fill="none"/>`, '0 0 320 210'),
  svg('Do: the approved sheet stays untouched, and the pencil edits a new draft beside it.', `${sheet(40, 30, 110, 160, 6)}<circle cx="116" cy="154" r="20" class="v40-thick"/>${check(116, 154, 6)}${part(`${sheet(180, 30, 110, 160, 4, 'draft')}`, 30, 0, 1)}${part(pencil(290, 120, -150), 30, -20, 2)}`, '0 0 320 210'),
  'Wrong', 'Right',
  'An edit makes a new draft. The approved revision stays as it is, and installs always use it.',
);

const ddCopies = dontDo(
  svg('Don’t: the same skill copied into four folders.', `${[0, 1, 2, 3].map(i => `${folder(20 + i * 74, 110, 62, 50)}${part(`<g transform="translate(${34 + i * 74} 64)"><rect width="34" height="42" rx="3"/><path d="M8 12h18M8 22h12" fill="none"/></g>`, 0, -30, i + 1)}`).join('')}${callout(160, 34, '4×', 20)}`, '0 0 320 210'),
  svg('Do: one copy, in the one folder where you use it.', `${folder(120, 110, 80, 60)}${part(`<g transform="translate(142 58)"><rect width="36" height="44" rx="3"/><path d="M8 12h20M8 22h14" fill="none"/></g>`, 0, -30, 1)}${callout(160, 34, '1×', 20)}`, '0 0 320 210'),
  'Wrong', 'Right',
  'Every installed skill is described to your agent on every turn. Keep what earns its place.',
);

const tidyBody = `
  ${floor(20, 940, 300)}
  ${['~/.claude/skills', '~/.agents/skills', '.codex/skills', '.copilot/skills', '.github/skills'].map((label, i) => {
    const x = [40, 170, 60, 200, 110][i];
    const y = [200, 220, 110, 120, 30][i];
    const r = [-6, 4, 8, -5, 3][i];
    return `<g transform="rotate(${r} ${x + 50} ${y + 30})">${folder(x, y, 100, 60, label)}</g>`;
  }).join('')}
  ${person(360, 300, 1.1, 'scratch')}
  <text class="v40-t v40-t-big" x="392" y="160">?</text>
  ${arrow('M440 200h110', 1)}${head(552, 200, 0, 1)}
  <g transform="translate(600 40)">
    <rect width="300" height="260" rx="4"/><path d="M10 10h280v240H10z" fill="none"/><path d="M10 90h280M10 170h280" fill="none"/>
    ${part(`<rect x="24" y="34" width="20" height="56"/><rect x="48" y="26" width="24" height="64"/><rect x="76" y="38" width="18" height="52"/><rect x="98" y="30" width="22" height="60"/>`, -80, 0, 2)}
    ${part(`<rect x="24" y="118" width="20" height="52"/><rect x="48" y="110" width="22" height="60"/><path d="M84 170v-44h40l8 8v36z"/><path d="M84 136h48" fill="none"/>`, -80, 0, 3)}
    ${part(`<rect x="24" y="196" width="24" height="54"/><rect x="52" y="202" width="18" height="48"/><path d="M196 222l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z"/>`, -80, 0, 4)}
  </g>`;
const tidy = `<div class="v40-tidy-pair">${svg('Skill folders scattered on the floor, each labelled with its path, and the assembler scratching their head.', tidyBody, '0 0 440 330')}${svg('An arrow leads to one tidy bookcase where every item has a place.', tidyBody, '430 0 520 330')}</div>`;

const drift = svg('Two copies of the same skill side by side under a magnifying glass; one line differs.', `
  ${sheet(40, 30, 130, 170, 0)}<path d="M52 58h96M52 74h80M52 90h96M52 106h70M52 122h96" fill="none"/>
  ${sheet(220, 30, 130, 170, 0)}<path d="M232 58h96M232 74h80" fill="none"/><path d="M232 90h96" class="v40-thick v40-diff" fill="none"/><path d="M232 106h70M232 122h96" fill="none"/>
  <text class="v40-t v40-t-big" x="195" y="126" text-anchor="middle">≠</text>
  ${part(magnifier(290, 96, 34), 40, -20, 1)}
  <text class="v40-t v40-t-sm" x="105" y="226" text-anchor="middle">approved</text><text class="v40-t v40-t-sm" x="285" y="226" text-anchor="middle">edited outside Kiln</text>`, '0 0 390 240');

const machine = svg('A second laptop with one big button being pressed.', `
  <g transform="translate(60 40)"><rect width="220" height="140" rx="8"/><rect x="12" y="12" width="196" height="116" rx="3"/><path d="M-30 150h280l-20 20H-10z"/></g>
  ${part(`<g transform="translate(170 110)"><rect x="-92" y="-24" width="184" height="48" rx="24" class="v40-thick"/><text class="v40-t v40-t-sm" y="5" text-anchor="middle">Install everything marked</text></g>`, 0, 0, 1)}
  ${part(`<path d="M246 170c-6-18-2-30 8-34l8-26c2-8 14-6 13 2l-4 20 22 4c10 2 12 10 10 20l-6 24" />`, 30, 30, 2)}`, '0 0 390 240');

export function render(root: HTMLElement) {
  document.title = 'Kiln — Assembly takes minutes. No extra API bill.';
  root.innerHTML = `
<div class="v40">
  <header class="v40-top">
    <a class="v40-brand" href="?">KILN</a>
    <nav aria-label="Main navigation"><a href="#v40-parts">Parts</a><a href="#v40-steps">Steps</a><a href="#v40-tidy">Tidy library</a><a href="#v40-get">Download</a></nav>
  </header>
  <main id="main">
    <section class="v40-page v40-cover" aria-labelledby="v40-title">
      <div class="v40-cover-text">
        <p class="v40-model">KILN <span>0.17.0</span></p>
        <h1 id="v40-title">Assembly takes minutes. No extra API bill.</h1>
        <p class="v40-cover-sub">A Windows desktop app that turns the prompt you saved into a skill your agents use, tested on your own repo first, with the Codex or Claude Code you already pay for.</p>
        <div class="v40-icons" role="list">
          <div role="listitem" aria-label="One person">${svg('', person(30, 92, .8, 'stand'), '0 0 60 100').replace('role="img" aria-label=""', 'aria-hidden="true"')}<b>1×</b></div>
          <div role="listitem" aria-label="Windows">${windowsMark.replace('width="18" height="18"', 'width="46" height="46"')}<b>Windows</b></div>
          <div role="listitem" aria-label="No API key needed">${svg('', key(14, 40) + cross(64, 22, 16), '0 0 90 70').replace('role="img" aria-label=""', 'aria-hidden="true"')}<b>API key</b></div>
        </div>
        <a class="v40-btn" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
        <p class="v40-note">${releaseNote}</p>
      </div>
      <div class="v40-cover-art" data-assemble>${cover}</div>
      <p class="v40-folio" aria-hidden="true">1</p>
    </section>

    <section class="v40-page v40-parts" id="v40-parts" aria-labelledby="v40-parts-title">
      <h2 id="v40-parts-title">In the box</h2>
      <ul class="v40-partlist" data-assemble>
        ${parts.map(p => `<li>${p.art}<p><b>${p.n}</b> ${p.name}</p><small>${p.no}</small></li>`).join('')}
      </ul>
      <div class="v40-tools">
        <div class="v40-tool" data-assemble>${svg('An L-shaped hex key standing for Codex or Claude Code', allen(26, 16) + `<path d="M26 16h60v12H38v48H26z" fill="none"/>`, '0 0 110 90')}<p><b>Tool included</b>Your signed-in Codex or Claude Code. Already on your desk, on your ChatGPT or Claude plan. Usage limits still apply.</p></div>
        <div class="v40-tool is-not" data-assemble>${svg('A key, crossed out: no API key', key(22, 44) + cross(84, 26, 18), '0 0 110 90')}<p><b>Not needed</b>An API key, or a second bill for one. Editing, approving and installing never call a model.</p></div>
      </div>
      <p class="v40-folio" aria-hidden="true">2</p>
    </section>

    <section class="v40-steps" id="v40-steps" aria-label="Assembly steps">
      ${steps.map((step, i) => `
        <article class="v40-step" data-assemble aria-labelledby="v40-s${i + 1}">
          <h2 class="v40-num" id="v40-s${i + 1}"><span class="visually-hidden">Step </span>${i + 1}</h2>
          ${step.art}
          <p class="v40-cap">${step.caption}</p>
        </article>
        ${i === 3 ? `<div class="v40-dd-wrap" data-assemble>${ddTests}</div>` : ''}
        ${i === 7 ? `<div class="v40-dd-wrap" data-assemble>${ddEdits}</div>` : ''}`).join('')}
      <p class="v40-folio is-steps" aria-hidden="true">3–6</p>
    </section>

    <section class="v40-page v40-back" id="v40-tidy" aria-labelledby="v40-tidy-title">
      <h2 id="v40-tidy-title">Keep your library tidy.</h2>
      <p class="v40-back-sub">Skills end up in ~/.claude/skills, ~/.agents/skills, .codex, .copilot and project .github folders. Kiln keeps one library of prompts, skills and custom agents, with collections, tags, search and filters, and shows every installed copy.</p>
      <div class="v40-wide" data-assemble>${tidy}<p class="v40-cap">Import what you have as drafts. The original folders stay where they are.</p></div>
      <div class="v40-dd-wrap" data-assemble>${ddCopies}</div>
      <div class="v40-pair">
        <div data-assemble>${drift}<p class="v40-cap">Edited outside Kiln? Compare with the approved version, file by file. Remove copies in bulk.</p></div>
        <div data-assemble>${machine}<p class="v40-cap">New machine: open your repo, press Install everything marked for this machine.</p></div>
      </div>
      <p class="v40-folio" aria-hidden="true">7</p>
    </section>

    <section class="v40-page v40-get" id="v40-get" aria-labelledby="v40-get-title">
      <div class="v40-get-art" data-assemble>${svg('The assembler carries a flat box labelled Kiln 0.17.0.', `${floor(10, 290, 250)}${part(`<g transform="translate(120 110) rotate(-4)"><rect width="150" height="100" rx="4"/><path d="M0 22h150" fill="none"/><text class="v40-t" x="75" y="68" text-anchor="middle">KILN 0.17.0</text></g>`, 60, 0, 1)}${person(90, 250, 1.1, 'hold')}`, '0 0 300 270')}</div>
      <div class="v40-get-text">
        <h2 id="v40-get-title">Missing a part? Download it.</h2>
        <a class="v40-btn" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p class="v40-note">${releaseNote}</p>
        <ul class="v40-fine">
          <li>Your library lives on your machine, backed by a GitHub repository Kiln sets up with the official gh CLI.</li>
          <li>A consent notice explains what is sent before any agent interaction.</li>
          <li>Includes an MIT-licensed CLI for scripting and for your agents. Builds are unsigned.</li>
        </ul>
      </div>
      <p class="v40-folio" aria-hidden="true">8</p>
    </section>
  </main>
</div>`;

  const blocks = root.querySelectorAll<HTMLElement>('[data-assemble]');
  if (navigator.webdriver || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    blocks.forEach(block => block.classList.add('is-in'));
    return;
  }
  root.querySelector('.v40')!.classList.add('v40-animate');
  const watch = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    watch.unobserve(entry.target);
  }), { threshold: .35 });
  blocks.forEach(block => watch.observe(block));
}
