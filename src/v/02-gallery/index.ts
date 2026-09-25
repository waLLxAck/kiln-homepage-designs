// PROTOTYPE variant B — Gallery. Proven prompts shown as collected ceramic objects: placards, provenance, rooms.
import './gallery.css';
import { collections, examples, installer, installs, provenance, releaseNote, steps, subscription, windowsMark, worries } from '../../content';

const glazes = [
  { id: 'celadon', stops: ['#d9ebdd', '#9cbca8', '#5f826f'], shape: '<path d="M82 14H118V24H82Z" class="gl-lip"/><path d="M88 22H112V78C112 96 170 110 170 175C170 222 140 250 100 250C60 250 30 222 30 175C30 110 88 96 88 78Z"/>' },
  { id: 'tenmoku', stops: ['#8a5236', '#4a2618', '#1e0f0a'], shape: '<path d="M76 236H124V250H76Z" class="gl-lip"/><path d="M10 146H190C190 204 152 240 100 240C48 240 10 204 10 146Z"/><path d="M10 146H190C190 154 186 160 182 164H18C14 160 10 154 10 146Z" class="gl-rim"/>' },
  { id: 'shino', stops: ['#fbf1e4', '#e8cfb5', '#c27a4e'], shape: '<path d="M90 30H110V48H90Z" class="gl-lip"/><ellipse cx="100" cy="54" rx="46" ry="9" class="gl-lip"/><path d="M60 60H140C140 70 178 84 178 150C178 214 146 250 100 250C54 250 22 214 22 150C22 84 60 70 60 60Z"/>' },
];
const vessel = (index: number) => {
  const glaze = glazes[index];
  return `<svg viewBox="0 0 200 260" aria-hidden="true"><defs><radialGradient id="gl-${glaze.id}" cx=".36" cy=".38" r=".75"><stop offset="0" stop-color="${glaze.stops[0]}"/><stop offset=".5" stop-color="${glaze.stops[1]}"/><stop offset="1" stop-color="${glaze.stops[2]}"/></radialGradient></defs><g fill="url(#gl-${glaze.id})">${glaze.shape}</g><ellipse cx="72" cy="${index === 1 ? 172 : 150}" rx="9" ry="${index === 1 ? 10 : 26}" fill="#fff" opacity=".28"/></svg>`;
};
const numerals = ['I', 'II', 'III', 'IV'];

export function render(root: HTMLElement) {
  document.title = 'Kiln — Keep the prompts that earned their place';
  root.innerHTML = `
<div class="gl">
  <header class="gl-top">
    <a class="gl-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#gl-process">How it works</a><a href="#gl-provenance">Provenance</a><a href="#gl-archive">Library</a><a href="#gl-visit">Download</a></nav>
  </header>
  <main id="main">
    <section class="gl-hero gl-room" aria-labelledby="gl-title">
      <h1 id="gl-title">Keep the prompts that<br>earned their place.</h1>
      <p class="gl-lede">Kiln is a Windows desktop app for turning a screenshot, a post from X or a YouTube video into a prompt, testing it on your own repos, and keeping the good ones as skills your agents can use.</p>
      <div class="gl-shelf" role="group" aria-label="Choose a piece from the collection">${examples.map((example, i) => `
        <button type="button" class="gl-piece gl-piece-${glazes[i].id}" data-piece="${i}" aria-pressed="${i === 0}"><span class="gl-light" aria-hidden="true"></span>${vessel(i)}<span class="gl-piece-name">${example.title}</span></button>`).join('')}
      </div>
      <div class="gl-label" aria-live="polite"></div>
    </section>

    <section class="gl-process gl-room gl-room-plaster" id="gl-process" aria-labelledby="gl-process-title">
      <h2 id="gl-process-title">How a piece enters the collection</h2>
      <ol class="gl-stages">${steps.map((step, i) => `<li><span class="gl-numeral" aria-hidden="true">${numerals[i]}</span><h3>${step.title}</h3><p>${step.text}</p></li>`).join('')}</ol>
    </section>

    <section class="gl-provenance gl-room" id="gl-provenance" aria-labelledby="gl-provenance-title">
      <div class="gl-provenance-copy">
        <h2 id="gl-provenance-title">Every skill keeps<br>its provenance.</h2>
        <p>${worries[1].answer}</p>
        <p>${worries[3].answer}</p>
      </div>
      <article class="gl-record" aria-label="Example provenance record">
        <header><h3>Code review</h3><p>Skill in your Kiln library, stored in the my-kiln GitHub repository</p></header>
        <h4>Provenance</h4>
        <ol class="gl-events">${provenance.map(row => `<li><b>${row.event}</b><span>${row.detail}</span><em class="${row.state === 'Approved' ? 'is-ok' : row.state === 'Needs review' ? 'is-warn' : ''}">${row.state}</em></li>`).join('')}</ol>
        <h4>Installed at</h4>
        <ul class="gl-installs">${installs.map(row => `<li><b>${row.agent}</b><code>${row.path}</code><em class="${row.ok ? 'is-ok' : 'is-warn'}">${row.state}</em></li>`).join('')}</ul>
        <p class="gl-record-note">Illustrative record. Real Kiln concepts, sample contents.</p>
      </article>
    </section>

    <section class="gl-archive gl-room gl-room-plaster" id="gl-archive" aria-labelledby="gl-archive-title">
      <div class="gl-archive-copy">
        <h2 id="gl-archive-title">The rest of the library</h2>
        <p>${worries[0].answer}</p>
        <div class="gl-rooms" role="group" aria-label="Choose a collection">${collections.map((collection, i) => `<button type="button" data-room="${i}" aria-pressed="${i === 0}">${collection.name}</button>`).join('')}</div>
      </div>
      <ul class="gl-cases" aria-live="polite"></ul>
      <div class="gl-archive-notes">${[worries[2], worries[4]].map(worry => `<div><h3>${worry.question}</h3><p>${worry.answer}</p></div>`).join('')}</div>
    </section>

    <section class="gl-visit gl-room" id="gl-visit" aria-labelledby="gl-visit-title">
      <h2 id="gl-visit-title">Start your own collection.</h2>
      <p>${subscription.title} ${subscription.text}</p>
      <a class="gl-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      <small>${releaseNote} ${subscription.fine}</small>
    </section>
  </main>
</div>`;

  const label = root.querySelector<HTMLElement>('.gl-label')!;
  const showPiece = (index: number) => {
    const example = examples[index];
    root.querySelectorAll<HTMLButtonElement>('[data-piece]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.piece) === index)));
    label.innerHTML = `<div class="gl-label-card"><h2>${example.title}</h2><p>${example.source}. ${example.idea}</p><p class="gl-label-outcome">If it earns its place: ${example.skill}</p></div><figure><figcaption>The prompt, condensed for a first try</figcaption><blockquote>${example.prompt}</blockquote></figure>`;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-piece]').forEach(button => button.addEventListener('click', () => showPiece(Number(button.dataset.piece))));
  showPiece(0);

  const cases = root.querySelector<HTMLElement>('.gl-cases')!;
  const showRoom = (index: number) => {
    root.querySelectorAll<HTMLButtonElement>('[data-room]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.room) === index)));
    cases.innerHTML = collections[index].items.map(([kind, title]) => `<li><h3>${title}</h3><p>${kind} in ${collections[index].name}</p></li>`).join('');
  };
  root.querySelectorAll<HTMLButtonElement>('[data-room]').forEach(button => button.addEventListener('click', () => showRoom(Number(button.dataset.room))));
  showRoom(0);
}
