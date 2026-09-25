// PROTOTYPE variant 35 — Metro map. Kiln as a transit network; a train rides the route as you scroll and each station opens up.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Line = 'capture' | 'test' | 'skill' | 'library';
const lines: Record<Line, { name: string; color: string; blurb: string }> = {
  capture: { name: 'Capture line', color: '#ee7c0e', blurb: 'From anything you see to something saved.' },
  test: { name: 'Test line', color: '#dc241f', blurb: 'From a saved prompt to a verdict on your repo.' },
  skill: { name: 'Skill line', color: '#00853e', blurb: 'From a verdict to a skill your agents use.' },
  library: { name: 'Library circle', color: '#1c5fb8', blurb: 'Around everything you keep, and back again.' },
};

type Station = { name: string; arrive: Line | 'walk' | null; lane: number; lines: Line[]; text: string; extra?: string; end?: boolean };
const stations: Station[] = [
  { name: 'Paste or drop', arrive: null, lane: 0, lines: ['capture'], text: 'Paste or drop text, links, screenshots, images and files into Kiln. “Save only” keeps it without calling a model.' },
  { name: 'Ctrl+N and the tray', arrive: 'capture', lane: 0, lines: ['capture'], text: 'Capture from the tray icon or with Ctrl+N. Ctrl+Shift+Space opens quick search from anywhere in Windows.' },
  { name: 'Distill video', arrive: 'capture', lane: 0, lines: ['capture'], text: 'Paste a YouTube link and press Distill video. Captions become a collection of reusable entries, each with a timestamped link; the transcript stays attached.' },
  { name: 'Prompt', arrive: 'capture', lane: 1, lines: ['capture', 'test'], text: '“Analyze and add” turns a source into prompts, insights, techniques, tools and resources. Change here for the Test line.', extra: `<blockquote class="v35-quote"><p>${examples[2].prompt}</p><footer>${examples[2].source}: ${examples[2].title.toLowerCase()}</footer></blockquote>` },
  { name: 'Your repo (read-only)', arrive: 'test', lane: 1, lines: ['test'], text: 'Choose a local project or repository, or an isolated example, and run the exact prompt revision through your signed-in Codex or Claude Code. Experiments are read-only, so nothing in your code changes.' },
  { name: 'Live activity', arrive: 'test', lane: 1, lines: ['test'], text: 'Watch it happen: messages, reasoning summaries, commands, web searches, model, reasoning effort, elapsed time and token counts. Up to two runs at once; cancel or retry.' },
  { name: 'Verdict', arrive: 'test', lane: 0, lines: ['test', 'skill'], text: 'The output and the agent’s pass, fail or uncertain assessment are saved with that revision. Your own judgement is kept separately. Tasks that need edits or missing tools come back uncertain, not faked. Edit, compare the diff and ride the Test line again, or change here for the Skill line.', extra: '<p class="v35-verdicts" aria-label="Possible assessments"><span class="is-pass">Pass</span><span class="is-uncertain">Uncertain</span><span class="is-fail">Fail</span></p>' },
  { name: 'Approve', arrive: 'skill', lane: 0, lines: ['skill'], text: '“Create skill” drafts a SKILL.md from the prompt with bundled writing-for-agents guidance. Approval pins the exact revision and publishes it to your own Kiln GitHub repository. Later edits make a new draft.' },
  { name: 'Install', arrive: 'skill', lane: 0, lines: ['skill'], text: 'Install always uses approved content, and an install receipt records the revision and destination. Normal editing, approval and installation never call a model.' },
  { name: 'Claude Code', arrive: 'skill', lane: 0, lines: ['skill'], text: 'Personal ~/.claude/skills, or a project you have enrolled. A new agent session picks it up.' },
  { name: 'Codex', arrive: 'skill', lane: 0, lines: ['skill'], text: 'Codex locations, including the shared ~/.agents/skills folder.' },
  { name: 'Copilot', arrive: 'skill', lane: 0, lines: ['skill'], end: true, text: 'Copilot locations and a project’s .github/skills. End of the Skill line. Walk through to the Library circle.' },
  { name: 'Collections', arrive: 'walk', lane: 1, lines: ['library'], text: 'Prompts, skills, custom agent definitions, source notes, insights, techniques, tools and resources, grouped in collections. Import installed skills or a skills repository as drafts; the originals stay where they are.' },
  { name: 'Search', arrive: 'library', lane: 1, lines: ['library'], text: 'Search, tags and favourites, with filters for kind, status, provider, location, copy state, scope and tag. Select in bulk, archive, trash and restore, undo.' },
  { name: 'Copies', arrive: 'library', lane: 1, lines: ['library'], text: 'For each skill, every installed copy across personal locations and enrolled projects: installed, identical copy found, differs or linked. Remove local copies in bulk; the library keeps the skill.' },
  { name: 'Drift', arrive: 'library', lane: 1, lines: ['library'], text: 'A copy edited outside Kiln is flagged. Compare it file by file with the approved version. Every skill description an agent can invoke sits in its context each turn, so stale and duplicate copies are worth clearing out.' },
  { name: 'Sync', arrive: 'library', lane: 1, lines: ['library'], text: 'Git status, sync and conflict resolution are built in. On another machine, open the repository and press “Install everything marked for this machine”, or run kiln skills sync. The circle continues to Collections.' },
];

// Network map, drawn once for the hero.
type MapStop = { x: number; y: number; name: string; line: Line; label: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se'; ix?: boolean; to: number };
const mapStops: MapStop[] = [
  { x: 80, y: 140, name: 'Paste or drop', line: 'capture', label: 'n', to: 0 },
  { x: 220, y: 140, name: 'Ctrl+N and tray', line: 'capture', label: 'n', to: 1 },
  { x: 360, y: 140, name: 'Distill video', line: 'capture', label: 'n', to: 2 },
  { x: 480, y: 260, name: 'Prompt', line: 'test', label: 'ne', ix: true, to: 3 },
  { x: 640, y: 260, name: 'Your repo (read-only)', line: 'test', label: 's', to: 4 },
  { x: 800, y: 260, name: 'Live activity', line: 'test', label: 'n', to: 5 },
  { x: 960, y: 260, name: 'Verdict', line: 'skill', label: 'ne', ix: true, to: 6 },
  { x: 960, y: 360, name: 'Approve', line: 'skill', label: 'e', to: 7 },
  { x: 960, y: 450, name: 'Install', line: 'skill', label: 'e', ix: true, to: 8 },
  { x: 840, y: 620, name: 'Claude Code', line: 'skill', label: 's', to: 9 },
  { x: 960, y: 620, name: 'Codex', line: 'skill', label: 's', to: 10 },
  { x: 1080, y: 620, name: 'Copilot', line: 'skill', label: 's', to: 11 },
  { x: 400, y: 340, name: 'Collections', line: 'library', label: 'se', ix: true, to: 12 },
  { x: 680, y: 340, name: 'Search', line: 'library', label: 's', to: 13 },
  { x: 880, y: 450, name: 'Copies', line: 'library', label: 'w', ix: true, to: 14 },
  { x: 620, y: 580, name: 'Drift', line: 'library', label: 'n', to: 15 },
  { x: 300, y: 460, name: 'Sync', line: 'library', label: 'e', to: 16 },
];
const labelPos = (stop: MapStop) => {
  const d = stop.ix ? 22 : 18;
  switch (stop.label) {
    case 'n': return { x: stop.x, y: stop.y - d - 4, anchor: 'middle' };
    case 's': return { x: stop.x, y: stop.y + d + 16, anchor: 'middle' };
    case 'e': return { x: stop.x + d + 4, y: stop.y + 6, anchor: 'start' };
    case 'w': return { x: stop.x - d - 4, y: stop.y + 6, anchor: 'end' };
    case 'ne': return { x: stop.x + d, y: stop.y - d, anchor: 'start' };
    case 'nw': return { x: stop.x - d, y: stop.y - d, anchor: 'end' };
    case 'se': return { x: stop.x + 12, y: stop.y + d + 16, anchor: 'start' };
  }
};
const tick = (stop: MapStop) => {
  const color = lines[stop.line].color;
  const vertical = stop.line === 'capture' || stop.line === 'test' || (stop.line === 'library' && (stop.y === 340 || stop.y === 580));
  if (stop.name === 'Claude Code' || stop.name === 'Codex' || stop.name === 'Copilot') return `<rect x="${stop.x - 14}" y="${stop.y - 4}" width="28" height="8" fill="${color}"/>`;
  return vertical ? `<rect x="${stop.x - 4}" y="${stop.y - (stop.label === 's' ? -4 : 18)}" width="8" height="14" fill="${color}"/>` : `<rect x="${stop.x + (stop.label === 'w' ? -18 : 4)}" y="${stop.y - 4}" width="14" height="8" fill="${color}"/>`;
};
const networkMap = `
<svg class="v35-map" viewBox="20 60 1160 620" role="img" aria-labelledby="v35-map-title">
  <title id="v35-map-title">Kiln network map. The Capture line runs from Paste or drop through Distill video to Prompt. The Test line runs from Prompt through Your repo (read-only) and Live activity to Verdict. The Skill line runs from Verdict through Approve and Install, then branches to Claude Code, Codex and Copilot. The Library circle links Collections, Search, Copies, Drift and Sync, with interchanges at Prompt and Install.</title>
  <path class="v35-track" d="M380 340H800L880 420V500L800 580H380L300 500V420Z" stroke="${lines.library.color}"/>
  <path class="v35-track" d="M80 140H360L480 260" stroke="${lines.capture.color}"/>
  <path class="v35-track" d="M480 260H960" stroke="${lines.test.color}"/>
  <path class="v35-track" d="M960 260V500L840 620M960 500V620M960 500L1080 620" stroke="${lines.skill.color}"/>
  <path class="v35-link" d="M480 260L400 340M960 450H880"/><path class="v35-link-in" d="M480 260L400 340M960 450H880"/>
  <circle class="v35-train-ambient" r="9"><animateMotion dur="16s" repeatCount="indefinite" path="M80 140H360L480 260H960V500L960 620"/></circle>
  ${mapStops.map(stop => {
    const label = labelPos(stop)!;
    return `<a class="v35-stop" href="#v35-st-${stop.to}" aria-label="${stop.name}">
      ${stop.ix ? `<circle cx="${stop.x}" cy="${stop.y}" r="12" class="v35-ring"/>` : tick(stop)}
      <text x="${label.x}" y="${label.y}" text-anchor="${label.anchor}">${stop.name}</text></a>`;
  }).join('')}
</svg>`;

const laneX = (lane: number) => 34 + lane * 36;

export function render(root: HTMLElement) {
  document.title = 'Kiln — Every saved prompt now has a route';
  root.innerHTML = `
<div class="v35">
  <a class="skip" href="#main">Skip to content</a>
  <header class="v35-top">
    <a class="v35-brand" href="?"><span class="v35-brand-ring" aria-hidden="true"></span><span>Kiln</span></a>
    <nav aria-label="Main navigation">
      <a href="#v35-ride"><i style="--c:${lines.capture.color}"></i>Capture</a><a href="#v35-st-3"><i style="--c:${lines.test.color}"></i>Test</a><a href="#v35-st-6"><i style="--c:${lines.skill.color}"></i>Skill</a><a href="#v35-st-12"><i style="--c:${lines.library.color}"></i>Library</a><a class="v35-nav-ticket" href="#v35-ticket">Download</a>
    </nav>
  </header>
  <main id="main">
    <section class="v35-hero" aria-labelledby="v35-title">
      <div class="v35-hero-copy">
        <h1 id="v35-title">Every saved prompt now has a route.</h1>
        <p>Board at Capture with whatever you saw. Ride the Test line to a verdict on your own repo. Change at Verdict for a skill your agents can use. The Library circle keeps everything you carry in order.</p>
        <p class="v35-hero-meta">Kiln is a Windows desktop app and CLI for developers who work with Codex and Claude Code, with installs for Copilot too.</p>
        <a class="v35-button" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      </div>
      <figure class="v35-map-wrap">
        <p class="v35-swipe" aria-hidden="true">Swipe sideways to see the whole map</p>
        <div class="v35-map-scroll" tabindex="0" aria-label="Network map, scrolls sideways on small screens">${networkMap}</div>
        <figcaption class="v35-legend">
          <ul>${(Object.keys(lines) as Line[]).map(key => `<li><span class="v35-legend-bar${key === 'library' ? ' is-loop' : ''}" style="--c:${lines[key].color}"></span><strong>${lines[key].name}</strong><span>${lines[key].blurb}</span></li>`).join('')}
          <li><span class="v35-legend-ring" aria-hidden="true"></span><strong>Interchange</strong><span>Change lines here.</span></li></ul>
        </figcaption>
      </figure>
    </section>

    <section class="v35-ride" id="v35-ride" aria-labelledby="v35-ride-title">
      <div class="v35-ride-head">
        <h2 id="v35-ride-title">Ride the whole route.</h2>
        <p>Scroll to move the train. Every station opens as you arrive.</p>
      </div>
      <div class="v35-ride-grid">
        <div class="v35-route" data-route>
          <svg class="v35-strip" data-strip aria-hidden="true"></svg>
          <span class="v35-train" data-train aria-hidden="true"></span>
          <ol class="v35-stations">
            ${stations.map((station, i) => `
            <li class="v35-station${i === 0 ? ' is-open' : ''}" id="v35-st-${i}" data-station="${i}" style="--c:${lines[station.lines[station.lines.length - 1]].color}">
              <h3 class="v35-sign">${station.name}</h3>
              <p class="v35-served">${station.lines.map(line => `<span style="--c:${lines[line].color}">${lines[line].name}</span>`).join('')}${station.end ? '<span class="v35-terminus">Terminus</span>' : ''}</p>
              <div class="v35-about"><p>${station.text}</p>${station.extra ?? ''}</div>
            </li>`).join('')}
          </ol>
        </div>
        <aside class="v35-now" aria-label="Current station">
          <div class="v35-now-board">
            <p class="v35-now-line" data-now-line></p>
            <p class="v35-now-label">This station</p>
            <p class="v35-now-name" data-now-name></p>
            <p class="v35-now-label">Next</p>
            <p class="v35-now-next" data-now-next></p>
          </div>
        </aside>
      </div>
    </section>

    <section class="v35-status" aria-labelledby="v35-status-title">
      <h2 id="v35-status-title">Service information</h2>
      <ul class="v35-status-list">
        <li style="--c:${lines.capture.color}"><strong>Capture line</strong><span class="v35-good">Good service</span><p>Save only never calls a model. Analyze and Distill video use your agent, after a consent notice explains what is sent.</p></li>
        <li style="--c:${lines.test.color}"><strong>Test line</strong><span class="v35-good">Read-only</span><p>${subscription.text} ${subscription.fine}</p></li>
        <li style="--c:${lines.skill.color}"><strong>Skill line</strong><span class="v35-good">No automatic approvals</span><p>You approve every revision yourself. Install always uses approved content and never calls a model.</p></li>
        <li style="--c:${lines.library.color}"><strong>Library circle</strong><span class="v35-good">Runs locally</span><p>The library lives on your machine, backed by a GitHub repository Kiln creates for you with the official gh CLI. The CLI lets scripts and your agents read it, with JSON results.</p></li>
      </ul>
    </section>

    <section class="v35-ticket" id="v35-ticket" aria-labelledby="v35-ticket-title">
      <div class="v35-platform">
        <div class="v35-platform-stripes" aria-hidden="true">${(Object.keys(lines) as Line[]).map(key => `<span style="--c:${lines[key].color}"></span>`).join('')}</div>
        <p class="v35-platform-no">Platform 0.17.0</p>
        <h2 id="v35-ticket-title">All lines start here.</h2>
        <p class="v35-platform-dest">Kiln for Windows. Change for Codex, Claude Code and Copilot.</p>
        <a class="v35-button v35-button-light" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a>
        <p class="v35-platform-note">${releaseNote} Builds are unsigned. MIT licensed.</p>
      </div>
    </section>
  </main>
  <footer class="v35-foot"><p>Kiln network map. Not to scale. Lines, stations and interchanges describe what the app does; they are not real transport.</p></footer>
</div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) root.querySelector('.v35-train-ambient')?.remove();

  const route = root.querySelector<HTMLElement>('[data-route]')!;
  const strip = root.querySelector<SVGSVGElement>('[data-strip]')!;
  const train = root.querySelector<HTMLElement>('[data-train]')!;
  const items = [...root.querySelectorAll<HTMLElement>('[data-station]')];
  const nowLine = root.querySelector<HTMLElement>('[data-now-line]')!;
  const nowName = root.querySelector<HTMLElement>('[data-now-name]')!;
  const nowNext = root.querySelector<HTMLElement>('[data-now-next]')!;
  let points: { x: number; y: number }[] = [];
  let stationY: number[] = [];

  const draw = () => {
    const height = route.offsetHeight;
    strip.setAttribute('viewBox', `0 0 ${strip.clientWidth || 140} ${height}`);
    strip.setAttribute('height', String(height));
    stationY = items.map(item => item.offsetTop + (item.querySelector<HTMLElement>('.v35-sign')!.offsetTop) + 22);
    points = [];
    let paths = '';
    stations.forEach((station, i) => {
      const x = laneX(station.lane);
      const y = stationY[i];
      if (i > 0) {
        const px = laneX(stations[i - 1].lane);
        const py = stationY[i - 1];
        const jog = Math.abs(x - px);
        const color = station.arrive === 'walk' ? '#1d1d1b' : lines[station.arrive as Line].color;
        const d = jog ? `M${px} ${py}V${y - jog}L${x} ${y}` : `M${px} ${py}V${y}`;
        paths += `<path d="${d}" class="v35-strip-track${station.arrive === 'walk' ? ' is-walk' : ''}" stroke="${color}"/>`;
        if (jog) points.push({ x: px, y: y - jog });
      }
      points.push({ x, y });
    });
    // Close the Library circle: loop back up from Sync to Collections on an outer lane.
    const first = stations.findIndex(station => station.lines.includes('library'));
    const last = stations.length - 1;
    const outer = laneX(2) + 4;
    const lx = laneX(1);
    const top = stationY[first];
    const bottom = stationY[last];
    paths += `<path class="v35-strip-track" stroke="${lines.library.color}" d="M${lx} ${bottom}V${bottom + 20}Q${lx} ${bottom + 44} ${lx + 24} ${bottom + 44}H${outer - 16}Q${outer} ${bottom + 44} ${outer} ${bottom + 28}V${top - 28}Q${outer} ${top - 44} ${outer - 16} ${top - 44}H${lx + 24}Q${lx} ${top - 44} ${lx} ${top - 20}V${top}"/>`;
    const marks = stations.map((station, i) => {
      const x = laneX(station.lane);
      const y = stationY[i];
      if (station.lines.length > 1) return `<circle cx="${x}" cy="${y}" r="13" class="v35-strip-ring"/>`;
      if (station.end) return `<rect x="${x - 16}" y="${y - 5}" width="32" height="10" fill="${lines[station.lines[0]].color}"/>`;
      return `<rect x="${x + 4}" y="${y - 5}" width="16" height="10" fill="${lines[station.lines[0]].color}"/>`;
    }).join('');
    // The walking change between the Skill line and the Library circle.
    const walkFrom = stations.findIndex(station => station.arrive === 'walk');
    const walk = `<text x="${laneX(1) + 12}" y="${(stationY[walkFrom - 1] + stationY[walkFrom]) / 2 + 5}" class="v35-walk-label">walk</text>`;
    strip.innerHTML = paths + marks + walk;
    move();
  };

  let current = -1;
  const setCurrent = (index: number) => {
    if (index === current) return;
    current = index;
    items.forEach((item, i) => { item.classList.toggle('is-here', i === index); if (i <= index) item.classList.add('is-open'); });
    const station = stations[index];
    const line = station.lines[station.lines.length - 1];
    nowLine.textContent = lines[line].name;
    nowLine.style.setProperty('--c', lines[line].color);
    nowName.textContent = station.name;
    nowNext.textContent = index < stations.length - 1 ? stations[index + 1].name : 'Collections, round the circle';
  };

  const move = () => {
    if (!points.length) return;
    const box = route.getBoundingClientRect();
    const target = innerHeight * .45 - box.top;
    const y = Math.max(points[0].y, Math.min(points[points.length - 1].y, target));
    let x = points[0].x;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (y <= b.y) { x = b.y === a.y ? b.x : a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y); break; }
    }
    train.style.transform = `translate(${x}px, ${y}px)`;
    let index = 0;
    stationY.forEach((sy, i) => { if (y >= sy - 12) index = i; });
    setCurrent(index);
  };

  if (reduced) items.forEach(item => item.classList.add('is-open'));
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; move(); }); } }, { passive: true });
  new ResizeObserver(draw).observe(route);
  document.fonts?.ready.then(draw);
  draw();
}
