// PROTOTYPE 28 — Spreadsheet. The homepage is a workbook: Library, Tests, Installs and Config sheets; the formula bar tests row 4 live.
import './style.css';
import { sheets, type Cell, type Sheet } from './sheets';

const letters = 'ABCDEFGH';

function cellHtml(cell: Cell, sheet: Sheet, row: number) {
  const start = letters.indexOf(cell.c) + 2;
  const span = cell.s ?? 1;
  let mobile: [number, number] | false;
  if (cell.m !== undefined) mobile = cell.m;
  else if (cell.full) mobile = [1, sheet.mletters.length];
  else { const index = sheet.mletters.indexOf(cell.c); mobile = index < 0 ? false : [index + 1, 1]; }
  const style = `--c:${start};--s:${span};${mobile ? `--mc:${mobile[0] + 1};--ms:${mobile[1]};` : ''}`;
  const classes = ['v28-cell', cell.cls ?? '', mobile ? '' : 'is-hidden-m', cell.note ? 'has-note' : ''].join(' ');
  const note = cell.note ? `<span class="v28-note" role="note"><b>Comment</b>${cell.note}</span>` : '';
  return `<div class="${classes}" style="${style}" data-ref="${cell.c}${row}"${cell.id ? ` id="${cell.id}"` : ''}${cell.note ? ' tabindex="0"' : ''}>${cell.html}${note}</div>`;
}

function sheetHtml(sheet: Sheet) {
  const header = `<div class="v28-row v28-letters" aria-hidden="true"><div class="v28-corner"></div>${[...letters].map(letter => `<div class="v28-letter ${sheet.mletters.includes(letter) ? '' : 'is-hidden-m'}" data-letter="${letter}" style="--c:${letters.indexOf(letter) + 2};--mc:${sheet.mletters.indexOf(letter) + 2}">${letter}</div>`).join('')}</div>`;
  const rows = sheet.rows.map((row, i) => {
    const n = i + 1;
    const covered = new Set<string>();
    row.cells.forEach(cell => { for (let k = 0; k < (cell.s ?? 1); k++) covered.add(letters[letters.indexOf(cell.c) + k]); });
    const coversMobile = row.cells.some(cell => cell.full);
    const fillers = [...letters].filter(letter => !covered.has(letter)).map(letter => {
      const index = sheet.mletters.indexOf(letter);
      const hidden = index < 0 || coversMobile;
      return `<div class="v28-cell is-empty ${hidden ? 'is-hidden-m' : ''}" style="--c:${letters.indexOf(letter) + 2};--s:1;--mc:${index + 2};--ms:1" aria-hidden="true"></div>`;
    }).join('');
    return `<div class="v28-row ${row.cls ?? ''}" data-row="${n}"><div class="v28-rh" aria-hidden="true">${n}</div>${row.cells.map(cell => cellHtml(cell, sheet, n)).join('')}${fillers}</div>`;
  }).join('');
  return `<div class="v28-sheet" role="tabpanel" id="v28-panel-${sheet.key}" aria-labelledby="v28-tab-${sheet.key}" data-sheet="${sheet.key}" style="--cols:${sheet.cols};--mcols:${sheet.mcols}" ${sheet.key === 'library' ? '' : 'hidden'}>${header}${rows}</div>`;
}

const tabs = (prefix: string) => `<div class="v28-tabs" role="tablist" aria-label="Sheets">${sheets.map((sheet, i) => `<button type="button" role="tab" class="v28-tab" id="${prefix}-${sheet.key}" aria-controls="v28-panel-${sheet.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-key="${sheet.key}" data-prefix="${prefix}">${sheet.label}</button>`).join('')}<span class="v28-tab-add" aria-hidden="true">+</span></div>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — You’d never keep your finances in random folders';
  root.innerHTML = `
<div class="v28">
  <header class="v28-chrome">
    <div class="v28-titlebar">
      <a class="v28-app" href="?" aria-label="Kiln home"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="4" fill="#1f7a4d"/><path d="M6 7h12M6 12h12M6 17h12M10 5v14" stroke="#fff" stroke-width="1.6"/></svg><span>Kiln</span></a>
      <p class="v28-filename">my-library <span>Saved to your Kiln GitHub repository</span></p>
      <a class="v28-share" href="#v28-cta-top">Download</a>
    </div>
    <div class="v28-menus" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Data</span><span>Tools</span><span>Help</span></div>
    <div class="v28-formula">
      <span class="v28-namebox" aria-label="Selected cell">A1</span>
      <span class="v28-fx" aria-hidden="true">fx</span>
      <p class="v28-formula-text" aria-live="off"><span class="v28-typed"></span><span class="v28-caret" aria-hidden="true"></span></p>
      <button type="button" class="v28-replay" hidden>Run the formulas again</button>
    </div>
    <div class="v28-tabs-top">${tabs('v28-tab')}</div>
  </header>
  <main id="main" class="v28-grid">
    <p class="visually-hidden" aria-live="polite" id="v28-live"></p>
    ${sheets.map(sheetHtml).join('')}
  </main>
  <footer class="v28-statusbar">
    <div class="v28-tabs-bottom">${tabs('v28-tabb')}</div>
    <p class="v28-status"></p>
  </footer>
</div>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const namebox = root.querySelector<HTMLElement>('.v28-namebox')!;
  const typed = root.querySelector<HTMLElement>('.v28-typed')!;
  const replay = root.querySelector<HTMLButtonElement>('.v28-replay')!;
  const status = root.querySelector<HTMLElement>('.v28-status')!;
  const live = root.querySelector<HTMLElement>('#v28-live')!;
  const chrome = root.querySelector<HTMLElement>('.v28-chrome')!;
  const setChrome = () => root.querySelector<HTMLElement>('.v28')!.style.setProperty('--chrome', `${chrome.offsetHeight}px`);
  setChrome();
  addEventListener('resize', setChrome);
  document.fonts?.ready.then(setChrome);

  const select = (ref: string, formula?: string) => {
    root.querySelectorAll('.is-selected, .is-col-active, .is-row-active').forEach(el => el.classList.remove('is-selected', 'is-col-active', 'is-row-active'));
    const panel = root.querySelector<HTMLElement>('.v28-sheet:not([hidden])')!;
    const cell = panel.querySelector<HTMLElement>(`[data-ref="${ref}"]`);
    namebox.textContent = ref;
    if (!cell) return;
    cell.classList.add('is-selected');
    panel.querySelector(`[data-letter="${ref[0]}"]`)?.classList.add('is-col-active');
    cell.closest('.v28-row')?.querySelector('.v28-rh')?.classList.add('is-row-active');
    if (formula !== undefined) typed.textContent = formula;
  };

  const formulas: Record<string, string> = { 'v28-D4': '=TEST(B4, "./my-game")', 'v28-E4': '=ASSESSMENT(D4)', 'v28-F4': '=APPROVE(B4, 2)', 'v28-G4': '=TOKENS(D4)', 'v28-H4': '=INSTALL(B4, "~/.claude/skills", "~/.agents/skills")' };
  Object.entries(formulas).forEach(([id, formula]) => { const cell = root.querySelector<HTMLElement>(`#${id}`); if (cell) cell.dataset.formula = formula; });

  // Clicking a cell shows its value in the formula bar, as a spreadsheet would.
  root.querySelectorAll<HTMLElement>('.v28-row-data .v28-cell:not(.is-empty)').forEach(cell => cell.addEventListener('click', () => {
    if (running) return;
    select(cell.dataset.ref!, cell.dataset.formula ?? cell.textContent?.replace(/Comment.*/, '').trim() ?? '');
  }));

  const set = (id: string, html: string, cls = '') => {
    const cell = root.querySelector<HTMLElement>(`#${id}`);
    if (!cell) return;
    const note = cell.querySelector('.v28-note');
    cell.innerHTML = html;
    if (note) cell.append(note);
    cell.classList.remove('is-computed');
    void cell.offsetWidth;
    if (cls) cell.classList.add(cls);
    root.querySelectorAll<HTMLElement>(`[data-mirror="${id}"]`).forEach(mirror => { mirror.innerHTML = html; });
  };
  const tag = (text: string, tone: string) => `<span class="v28-cf is-${tone}">${text}</span>`;

  let run = 0;
  let running = false;
  const sleep = (ms: number, token: number) => new Promise<boolean>(resolve => setTimeout(() => resolve(token === run), reduce ? 0 : ms));
  const type = async (text: string, token: number) => {
    typed.textContent = '';
    for (const char of text) {
      if (token !== run) return false;
      typed.textContent += char;
      if (!reduce) await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 34));
    }
    return token === run;
  };
  const countUp = async (id: string, to: number, token: number) => {
    const steps = reduce ? 1 : 24;
    for (let i = 1; i <= steps; i++) {
      if (token !== run) return;
      const value = Math.round(to * i / steps);
      set(id, `<span class="v28-bar" style="--w:${Math.round(92 * i / steps)}%"></span>${value.toLocaleString('en-US')}`);
      await sleep(40, token);
    }
  };
  const reset = () => ['v28-D4', 'v28-E4', 'v28-F4', 'v28-G4', 'v28-H4'].forEach(id => set(id, '<span class="v28-dim">—</span>'));

  const play = async () => {
    const token = ++run;
    running = true;
    replay.hidden = true;
    reset();
    root.querySelector('.v28')!.classList.add('is-playing');
    if (!await sleep(700, token)) return;
    select('D4');
    if (!await type('=TEST(B4, "./my-game")', token)) return;
    await sleep(280, token);
    set('v28-D4', `<span class="v28-running"><span class="v28-spin" aria-hidden="true"></span>Running, read-only</span>`, 'is-computed');
    live.textContent = 'Test running on ./my-game, read-only.';
    if (!await sleep(900, token)) return;
    set('v28-D4', `<span class="v28-running"><span class="v28-spin" aria-hidden="true"></span>cat src/levels/level-02.ts</span>`);
    if (!await sleep(1100, token)) return;
    set('v28-D4', 'Done, 3 min 51 s', 'is-computed');
    await sleep(160, token);
    set('v28-E4', tag('pass', 'good'), 'is-computed');
    await countUp('v28-G4', 48210, token);
    live.textContent = 'Test finished. The agent says pass.';
    if (!await sleep(900, token)) return;
    select('F4');
    if (!await type('=APPROVE(B4, 2)', token)) return;
    await sleep(260, token);
    set('v28-F4', tag('Approved rev 2', 'good'), 'is-computed');
    live.textContent = 'You approved revision 2.';
    if (!await sleep(900, token)) return;
    select('H4');
    if (!await type('=INSTALL(B4, "~/.claude/skills", "~/.agents/skills")', token)) return;
    await sleep(260, token);
    set('v28-H4', tag('2 locations', 'good'), 'is-computed');
    live.textContent = 'Installed in two locations.';
    running = false;
    replay.hidden = false;
    root.querySelector('.v28')!.classList.remove('is-playing');
  };

  const settle = () => {
    run++;
    running = false;
    set('v28-D4', 'Done, 3 min 51 s'); set('v28-E4', tag('pass', 'good')); set('v28-F4', tag('Approved rev 2', 'good'));
    set('v28-G4', '<span class="v28-bar" style="--w:92%"></span>48,210'); set('v28-H4', tag('2 locations', 'good'));
    root.querySelector('.v28')!.classList.remove('is-playing');
  };

  // Sheet tabs: two tab strips (top on phones, bottom on desktop) share one state.
  const show = (key: string, focus = '') => {
    const sheet = sheets.find(item => item.key === key)!;
    if (key !== 'library' && running) settle();
    root.querySelectorAll<HTMLElement>('.v28-sheet').forEach(panel => { panel.hidden = panel.dataset.sheet !== key; });
    root.querySelectorAll<HTMLButtonElement>('.v28-tab').forEach(tab => {
      const on = tab.dataset.key === key;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    status.textContent = sheet.status;
    replay.hidden = key !== 'library' || running;
    if (key === 'library') { settle(); select('H4', '=INSTALL(B4, "~/.claude/skills", "~/.agents/skills")'); replay.hidden = false; }
    else select(sheet.name, sheet.formula);
    if (focus) root.querySelector<HTMLButtonElement>(`#${focus}-${key}`)?.focus();
    const top = root.querySelector<HTMLElement>('.v28-grid')!.getBoundingClientRect().top + scrollY - (innerWidth < 760 ? chrome.offsetHeight : 0);
    if (scrollY > top) scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };
  root.querySelectorAll<HTMLButtonElement>('.v28-tab').forEach(tab => {
    tab.addEventListener('click', () => show(tab.dataset.key!));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const index = sheets.findIndex(sheet => sheet.key === tab.dataset.key);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? sheets.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + sheets.length) % sheets.length;
      show(sheets[next].key, tab.dataset.prefix);
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-go]').forEach(button => button.addEventListener('click', () => show(button.dataset.go!, innerWidth < 760 ? 'v28-tab' : 'v28-tabb')));
  root.querySelector('.v28-cta-cell')?.setAttribute('id', 'v28-cta-top');
  replay.addEventListener('click', () => play());

  status.textContent = sheets[0].status;
  if (reduce) { settle(); select('H4', '=INSTALL(B4, "~/.claude/skills", "~/.agents/skills")'); replay.hidden = false; }
  else play();
}
