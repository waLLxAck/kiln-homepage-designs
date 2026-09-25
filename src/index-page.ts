// The index: the design that shipped, then every round in order, each with the ask that started it.
import './index-page.css';
import { designs, rounds, type Design } from './designs';

const base = import.meta.env.BASE_URL;
const repo = 'https://github.com/waLLxAck/kiln-homepage-designs';
const kiln = { site: 'https://wallxack.github.io/kiln/', source: 'https://github.com/waLLxAck/kiln', support: 'https://wallxack.github.io/kiln/support/' };
const thumb = (design: Design) => `${base}thumbs/${design.number}.jpg`;
const range = (from: number, to: number) => (from === to ? String(from).padStart(2, '0') : `${String(from).padStart(2, '0')}–${to}`);

const card = (design: Design) => `
  <li class="ix-card">
    <a href="${base}${design.number}/">
      <span class="ix-shot"><img src="${thumb(design)}" alt="" loading="lazy" decoding="async" width="1440" height="900" /></span>
      <span class="ix-card-text">
        <span class="ix-num">${design.number}</span>
        <strong>${design.name}</strong>
        <span class="ix-angle">${design.angle}</span>
      </span>
    </a>
  </li>`;

export function render(root: HTMLElement) {
  document.title = '74 homepages for one app · Kiln designs';
  const shipped = designs[designs.length - 1];
  const earlier = rounds.slice(0, -1);

  root.innerHTML = `<div class="ix">
    <header class="ix-top">
      <a class="ix-brand" href="${base}"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M1 1h6v6H1zm8 0h6v6H9zM1 9h6v6H1zm8 0h6v6H9z"/></svg>Kiln designs</a>
      <nav aria-label="Main"><a href="#rounds">All rounds</a><a href="#how">How they were made</a><a href="${kiln.site}">Get Kiln</a><a href="${repo}">Source on GitHub</a></nav>
    </header>

    <main id="main">
      <section class="ix-hero" aria-labelledby="ix-title">
        <h1 id="ix-title">${designs.length} homepages for one app.</h1>
        <div class="ix-lede">
          <p>Each design is a complete, working page: real text, real buttons, and things to drag, flip and test. Claude Opus 5.5 wrote every one of them in Claude Code, in plain TypeScript and CSS, over five rounds of feedback from the person who makes Kiln. The last one became Kiln’s homepage.</p>
          <dl class="ix-stats">
            <div><dt>Designs</dt><dd>${designs.length}</dd></div>
            <div><dt>Rounds of feedback</dt><dd>${rounds.length - 1}</dd></div>
            <div><dt>Image files inside the designs</dt><dd>0</dd></div>
          </dl>
        </div>
      </section>

      <section class="ix-shipped" aria-labelledby="ix-shipped-title">
        <a class="ix-shipped-shot" href="${base}${shipped.number}/" tabindex="-1" aria-hidden="true"><img src="${thumb(shipped)}" alt="" width="1440" height="900" /></a>
        <div class="ix-shipped-text">
          <p class="ix-scrawl" aria-hidden="true">the one that shipped</p>
          <h2 id="ix-shipped-title"><span class="ix-num">${shipped.number}</span> ${shipped.name}</h2>
          <p>${rounds[rounds.length - 1].brief}</p>
          <p class="ix-quiet">A founder’s marked-up printout in two acts. First, skill files fly out of five agents’ folders into one panel, a switch per folder. Then a phone playing a video, a post and a repo get dragged into Kiln, and the prompt they become is tested and approved onto that same panel.</p>
          <p class="ix-actions"><a class="ix-button" href="${base}${shipped.number}/">Open design ${shipped.number}</a><a class="ix-link" href="${base}01/">Or start at 01 and walk forward</a></p>
        </div>
      </section>

      <div id="rounds">
        ${earlier.map((round, index) => {
          const members = designs.filter(design => +design.number >= round.from && +design.number <= round.to);
          return `<section class="ix-round" aria-labelledby="ix-round-${index + 1}">
            <header class="ix-round-head">
              <p class="ix-round-count">Round ${index + 1} · ${members.length === 1 ? 'one design' : `${members.length} designs`} · ${range(round.from, round.to)}</p>
              <h2 id="ix-round-${index + 1}">${round.title}</h2>
              <p class="ix-brief">${round.brief}</p>
            </header>
            <ol class="ix-grid${members.length <= 3 ? ' ix-grid-few' : ''}">${members.map(card).join('')}</ol>
          </section>`;
        }).join('')}
      </div>

      <section class="ix-how" id="how" aria-labelledby="ix-how-title">
        <h2 id="ix-how-title">How they were made</h2>
        <div class="ix-how-cols">
          <div>
            <h3>What Kiln is</h3>
            <p>Kiln is a desktop app for Windows, macOS and Linux for people who work with coding agents. It puts every skill Claude Code, Codex and Copilot can load on one panel, with a switch per folder, and it tests a new prompt on your own repo before you keep it as a skill. It’s free and open source: <a href="${kiln.site}">download it</a>, read <a href="${kiln.source}">the code</a>, or <a href="${kiln.support}">support its development</a>.</p>
          </div>
          <div>
            <h3>One brief, many agents</h3>
            <p>From round two on, each round started with a written brief: the product facts, rules about honest claims, and the direction taken from the last round’s feedback. Claude then ran one agent per design, in parallel. You can read the <a href="${repo}/tree/main/briefs">briefs</a>.</p>
          </div>
          <div>
            <h3>Checked in a browser</h3>
            <p>Every page was loaded in Chromium at desktop and phone width and its screenshots reviewed before anyone saw it; later rounds also scripted every drag, switch and test. The art is SVG and CSS. The fonts are self-hosted, and nothing loads from anywhere else.</p>
          </div>
          <div>
            <h3>What’s real in them</h3>
            <p>Product details follow Kiln 0.17.0. Numbers inside the designs are labelled samples. People, handles and channels are made up, apart from the <code>mattpocock/skills</code> repository used as an example source.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="ix-foot">
      <p>Code MIT licensed. Fonts under their own open licenses. <a href="${repo}">Source on GitHub</a>. <a href="${kiln.site}">Kiln</a> is open source too.</p>
      <p>On a design page, use ← and → to step through, or press H to hide the bar.</p>
    </footer>
  </div>`;
}
