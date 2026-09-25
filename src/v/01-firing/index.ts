// PROTOTYPE variant A — Firing schedule. An engineering pad: the capture → skill process drawn as a kiln firing curve.
import './firing.css';
import { examples, features, installer, installs, provenance, releaseNote, steps, subscription, windowsMark, worries } from '../../content';

const zones = [
  { from: 60, label: 'Ambient. Everything you saved.', y: 312 },
  { from: 340, label: 'Bisque. A prompt you can run.', y: 128 },
  { from: 620, label: 'Soak. Run, adjust, run again.', y: 48 },
  { from: 900, label: 'Peak. The revision you approve.', y: 28 },
];
const curve = '60,372 110,366 150,370 200,362 250,366 300,356 340,344 420,290 500,205 560,150 620,146 650,118 680,158 720,100 752,138 790,84 822,112 860,68 900,72 960,50 1180,50';
const y = (temperature: number) => 380 - temperature / 1300 * 340;

const chart = `
<svg class="fs-svg" viewBox="0 0 1200 420" role="img" aria-labelledby="fs-chart-title">
  <title id="fs-chart-title">A kiln firing curve: the temperature stays low while you capture ideas, rises as an idea becomes a prompt, wavers while you test and adjust it, and peaks when you approve a skill.</title>
  <defs><pattern id="fs-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#2e4f9e" stroke-width="1.4" opacity=".35"/></pattern></defs>
  ${zones.map((zone, i) => `<rect class="fs-zone" data-zone="${i}" x="${zone.from}" y="30" width="280" height="350" fill="url(#fs-hatch)"/>`).join('')}
  ${[0, 400, 800, 1200].map(t => `<g class="fs-tick"><line x1="52" x2="1180" y1="${y(t)}" y2="${y(t)}"/><text x="44" y="${y(t) + 5}" text-anchor="end">${t}°</text></g>`).join('')}
  <line class="fs-axis" x1="60" y1="24" x2="60" y2="380"/><line class="fs-axis" x1="60" y1="380" x2="1186" y2="380"/>
  ${[340, 620, 900].map(x => `<line class="fs-divider" x1="${x}" x2="${x}" y1="30" y2="380"/>`).join('')}
  <polyline class="fs-curve" pathLength="1" points="${curve}"/>
  ${zones.map(zone => `<text class="fs-note" x="${zone.from + 14}" y="${zone.y}">${zone.label}</text>`).join('')}
  <circle class="fs-cone" cx="960" cy="50" r="7"/>
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Fire the ideas you saved';
  root.innerHTML = `
<div class="fs">
  <header class="fs-top">
    <a class="fs-brand" href="?">Kiln</a>
    <nav aria-label="Main navigation"><a href="#fs-process">Process</a><a href="#fs-record">Record</a><a href="#fs-tiles">Use cases</a><a href="#fs-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="fs-hero" id="fs-process" aria-labelledby="fs-title">
      <div class="fs-intro">
        <h1 id="fs-title">Fire the ideas<br>you saved.</h1>
        <div class="fs-lede"><p>Kiln is a Windows desktop app that takes an idea from a screenshot, a post from X or a YouTube video to a prompt you test on your own repos, and then to a skill your agents can use.</p>
        <a class="fs-button fs-hero-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a></div>
      </div>
      <figure class="fs-chart">
        ${chart}
        <div class="fs-stages" role="group" aria-label="Choose a stage">${steps.map((step, i) => `<button type="button" data-stage="${i}" aria-pressed="${i === 2}"><span>${i + 1}</span>${step.short}</button>`).join('')}</div>
        <figcaption class="fs-readout" aria-live="polite"></figcaption>
      </figure>
    </section>

    <section class="fs-spec" aria-labelledby="fs-spec-title">
      <div class="fs-spec-head">
        <h2 id="fs-spec-title">What Kiln keeps<br>at each stage</h2>
        <aside class="fs-margin-note"><h3>${subscription.title}</h3><p>${subscription.text}</p><small>${subscription.fine}</small></aside>
      </div>
      <table class="fs-table">
        <thead><tr><th scope="col">Stage</th><th scope="col">What you do</th><th scope="col">What Kiln keeps</th></tr></thead>
        <tbody>${features.map(feature => `<tr><th scope="row">${feature.title}</th><td>${feature.does}</td><td>${feature.keeps}</td></tr>`).join('')}</tbody>
      </table>
    </section>

    <section class="fs-record" id="fs-record" aria-labelledby="fs-record-title">
      <h2 id="fs-record-title">Every firing<br>leaves a record.</h2>
      <div class="fs-record-grid">
        <div class="fs-log">
          <h3>${worries[1].question}</h3>
          <p>${worries[1].answer}</p>
          <table class="fs-table fs-table-compact"><caption>Code review, skill history</caption>
            <thead><tr><th scope="col">Event</th><th scope="col">Detail</th><th scope="col">State</th></tr></thead>
            <tbody>${provenance.map(row => `<tr><th scope="row">${row.event}</th><td>${row.detail}</td><td><span class="fs-state ${row.state === 'Approved' ? 'is-ok' : row.state === 'Needs review' ? 'is-warn' : ''}">${row.state}</span></td></tr>`).join('')}</tbody>
          </table>
        </div>
        <div class="fs-log">
          <h3>${worries[3].question}</h3>
          <p>${worries[3].answer}</p>
          <table class="fs-table fs-table-compact"><caption>Code review, installed copies</caption>
            <thead><tr><th scope="col">Location</th><th scope="col">Path</th><th scope="col">State</th></tr></thead>
            <tbody>${installs.map(row => `<tr><th scope="row">${row.agent}</th><td><code>${row.path}</code></td><td><span class="fs-state ${row.ok ? 'is-ok' : 'is-warn'}">${row.state}</span>${row.ok ? '' : '<button type="button" class="fs-compare" aria-expanded="false" aria-controls="fs-diff">Compare</button>'}</td></tr>`).join('')}</tbody>
          </table>
          <div class="fs-diff" id="fs-diff" hidden><p class="is-removed">− Review standards and the specification.</p><p class="is-added">+ Review the specification only.</p></div>
        </div>
      </div>
      <ul class="fs-notes">${[worries[0], worries[2], worries[4]].map(worry => `<li><h3>${worry.question}</h3><p>${worry.answer}</p></li>`).join('')}</ul>
    </section>

    <section class="fs-tiles" id="fs-tiles" aria-labelledby="fs-tiles-title">
      <div class="fs-tiles-head"><h2 id="fs-tiles-title">Three test tiles</h2><p>Real prompts from a Kiln library, shortened for a first try. Pick a repo where the idea fits and see whether it earns a place in your toolkit.</p></div>
      <div class="fs-tile-row">${examples.map(example => `
        <article class="fs-tile">
          <p class="fs-tile-source">${example.source}</p>
          <h3>${example.title}</h3>
          <p class="fs-tile-idea">${example.idea}</p>
          <blockquote>${example.prompt}</blockquote>
          <div class="fs-glaze"><h4>If it earns its place</h4><p>${example.skill}</p></div>
        </article>`).join('')}
      </div>
    </section>
  </main>
  <footer class="fs-titleblock" id="fs-download" aria-label="Download">
    <div class="fs-cell fs-cell-wide"><small>Product</small><strong>Kiln, a home for prompts, experiments and approved agent skills</strong></div>
    <div class="fs-cell"><small>Release</small><strong>0.17.0</strong></div>
    <div class="fs-cell"><small>Runs on</small><strong>Windows desktop</strong></div>
    <div class="fs-cell"><small>Agent</small><strong>Your Codex or Claude Code sign-in</strong></div>
    <div class="fs-cell fs-cell-action"><a class="fs-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a><small>${releaseNote}</small></div>
  </footer>
</div>`;

  const readout = root.querySelector<HTMLElement>('.fs-readout')!;
  const select = (index: number) => {
    root.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stage) === index)));
    root.querySelectorAll<SVGRectElement>('.fs-zone').forEach(zone => zone.classList.toggle('is-active', Number(zone.dataset.zone) === index));
    readout.innerHTML = `<strong>${index + 1}. ${steps[index].title}</strong><span>${steps[index].text}</span>`;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(button => button.addEventListener('click', () => select(Number(button.dataset.stage))));
  select(2);
  root.querySelector('.fs-compare')?.addEventListener('click', event => {
    const button = event.currentTarget as HTMLButtonElement;
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Hide' : 'Compare';
    root.querySelector<HTMLElement>('#fs-diff')!.hidden = !open;
  });
}
