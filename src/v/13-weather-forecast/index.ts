// PROTOTYPE variant 10 — Weather forecast. A local-TV weather report for your library: a front of “later” all week, until the forecast clears.
import './style.css';
import { examples, installer, releaseNote, subscription, windowsMark } from '../../content';

type Sky = 'sun' | 'cloud' | 'rain' | 'storm' | 'fog' | 'partly';
const icon = (sky: Sky) => {
  const cloud = (x = 0, y = 0, cls = '') => `<g class="v10-cloud ${cls}" transform="translate(${x} ${y})"><circle cx="22" cy="34" r="12"/><circle cx="36" cy="26" r="15"/><circle cx="50" cy="34" r="11"/><rect x="10" y="34" width="52" height="12" rx="6"/></g>`;
  const sun = (x = 0, y = 0) => `<g class="v10-sun" transform="translate(${x} ${y})"><g class="v10-rays">${Array.from({ length: 8 }, (_, i) => `<rect x="30" y="2" width="4" height="10" rx="2" transform="rotate(${i * 45} 32 32)"/>`).join('')}</g><circle cx="32" cy="32" r="13"/></g>`;
  const drops = `<g class="v10-drops">${[20, 32, 44].map((x, i) => `<line x1="${x}" y1="50" x2="${x - 4}" y2="60" style="--i:${i}"/>`).join('')}</g>`;
  const inner = {
    sun: sun(0, 0),
    cloud: cloud(-4, 0),
    partly: sun(-8, -8) + cloud(2, 6),
    rain: cloud(-4, -4) + drops,
    storm: cloud(-4, -6) + '<path class="v10-bolt" d="M34 44 26 56h7l-4 9 11-14h-7l4-7z"/>',
    fog: cloud(-4, -8, 'is-grey') + '<g class="v10-fog"><rect x="10" y="46" width="44" height="4" rx="2"/><rect x="16" y="54" width="40" height="4" rx="2"/></g>',
  }[sky];
  return `<svg class="v10-icon is-${sky}" viewBox="0 0 64 64" aria-hidden="true">${inner}</svg>`;
};

const week = [
  { day: 'Mon', sky: 'cloud' as Sky, text: 'Saved three posts', later: 90, clear: { sky: 'sun' as Sky, text: 'Tested on ./my-repo', later: 0 } },
  { day: 'Tue', sky: 'rain' as Sky, text: 'Bookmark showers', later: 90, clear: { sky: 'partly' as Sky, text: 'Revise and run again', later: 10 } },
  { day: 'Wed', sky: 'fog' as Sky, text: 'Where did I save that?', later: 85, clear: { sky: 'sun' as Sky, text: 'Approved as a skill', later: 0 } },
  { day: 'Thu', sky: 'storm' as Sky, text: 'Tab storms', later: 95, clear: { sky: 'sun' as Sky, text: 'Agent uses it', later: 0 } },
  { day: 'Fri', sky: 'cloud' as Sky, text: '“I’ll look at it later”', later: 99, clear: { sky: 'partly' as Sky, text: 'Try the next one', later: 20 } },
  { day: 'Sat', sky: 'rain' as Sky, text: 'An hour-long video', later: 90, clear: { sky: 'cloud' as Sky, text: 'Distilled, timestamps kept', later: 30 } },
  { day: 'Sun', sky: 'fog' as Sky, text: 'Someday', later: 90, clear: { sky: 'sun' as Sky, text: 'Day off. It’s tested.', later: 0 } },
];

const ticker = [
  'Capture anything with Ctrl+N', 'Quick search from anywhere: Ctrl+Shift+Space', 'Distill a YouTube video into prompts with timestamped links',
  'Run a prompt on your own repo through Codex or Claude Code', 'Experiments are read-only', 'Watch the run live: commands, reasoning, tokens',
  'Pass, fail or uncertain, saved with the revision', 'Compare revisions and run again', 'Create skill drafts a SKILL.md', 'Approve an exact revision',
  'Install into Codex, Claude Code or Copilot', 'See every installed copy', 'No API key: uses your signed-in Codex or Claude Code',
];

const map = `
<svg class="v10-map" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="v10-map-title">
  <title id="v10-map-title">A weather map of your library. A low-pressure system called Later sits over Prompt Plains, with bookmark showers, tab storms and fog. After the update, it clears and a high-pressure system called Tested moves in.</title>
  <defs>
    <linearGradient id="v10-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1569d0"/><stop offset="1" stop-color="#0a3c8e"/></linearGradient>
    <linearGradient id="v10-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc15c"/><stop offset="1" stop-color="#3a8b45"/></linearGradient>
    <radialGradient id="v10-low" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff3b3b" stop-opacity=".35"/><stop offset="1" stop-color="#ff3b3b" stop-opacity="0"/></radialGradient>
    <radialGradient id="v10-high" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe14d" stop-opacity=".45"/><stop offset="1" stop-color="#ffe14d" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#v10-sea)"/>
  <g class="v10-grid">${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="600"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="1200" y2="${i * 120}"/>`).join('')}</g>
  <g class="v10-landmass">
    <path d="M-20 40 C60 20 150 60 230 50 C300 40 330 90 300 140 C270 190 190 170 170 230 C150 290 240 320 230 380 C220 440 120 460 60 430 C10 410 -20 440 -20 440Z"/>
    <path d="M360 110 C430 70 520 100 600 80 C690 60 780 90 820 150 C860 210 800 250 830 310 C860 380 800 450 720 470 C640 490 580 440 500 460 C420 480 350 430 360 360 C370 300 320 260 340 200 C350 160 330 130 360 110Z"/>
    <path d="M900 120 C950 90 1040 100 1080 140 C1110 180 1060 230 1000 240 C940 250 880 220 880 180 C880 150 880 130 900 120Z"/>
    <path d="M880 330 C940 300 1040 310 1110 340 C1180 370 1220 420 1220 480 L1220 620 L900 620 C860 560 920 520 890 470 C860 420 840 360 880 330Z"/>
    <path d="M260 520 C300 490 380 500 410 530 C440 560 400 600 400 620 L240 620 C230 580 230 545 260 520Z"/>
  </g>
  <g class="v10-labels">
    <text x="600" y="152">PROMPT PLAINS</text>
    <text x="120" y="110">BOOKMARK BAY</text>
    <text x="985" y="176">SCREENSHOT ISLES</text>
    <text x="1040" y="420">SKILLS COAST</text>
    <text x="330" y="560">CHAT MARSHES</text>
    <text x="700" y="440">VIDEO VALLEY</text>
  </g>
  <g class="v10-temps">
    <g transform="translate(470 330)"><circle r="30" class="is-hot"/><text y="9">50</text><text class="v10-temp-label" y="50">saved</text></g>
    <g transform="translate(760 360)"><circle r="30" class="is-cold"/><text y="9" class="v10-tried">0</text><text class="v10-temp-label" y="50">tried</text></g>
    <g transform="translate(1000 480)"><circle r="30" class="is-mild"/><text y="9">12</text><text class="v10-temp-label" y="50">skills</text></g>
  </g>
  <g class="v10-isobars"><g class="v10-iso-spin">${[70, 120, 175, 235].map(r => `<ellipse cx="0" cy="0" rx="${r * 1.25}" ry="${r}"/>`).join('')}</g></g>
  <g class="v10-front-wrap is-cold-front"><path class="v10-front" d="M250 30 C330 150 300 260 390 350 C460 420 470 500 540 600"/><g class="v10-marks"></g></g>
  <g class="v10-front-wrap is-warm-front"><path class="v10-front" d="M640 40 C720 120 820 160 880 260 C920 330 1000 370 1060 360"/><g class="v10-marks"></g></g>
  <g class="v10-low-system" transform="translate(600 270)"><circle r="120" fill="url(#v10-low)"/><text class="v10-pressure is-low" y="30">L</text><text class="v10-pressure-name" y="72">LATER</text></g>
  <g class="v10-high-system" transform="translate(640 280)"><circle r="150" fill="url(#v10-high)"/><text class="v10-pressure is-high" y="30">H</text><text class="v10-pressure-name" y="72">TESTED</text></g>
  <g class="v10-wx">
    <g class="v10-wx-item" style="--x:140px;--y:230px"><g class="v10-drift">${icon('rain').replace('<svg', '<svg width="130" height="130" x="-65" y="-65"')}</g></g>
    <g class="v10-wx-item" style="--x:480px;--y:210px"><g class="v10-drift">${icon('cloud').replace('<svg', '<svg width="120" height="120" x="-60" y="-60"')}</g></g>
    <g class="v10-wx-item" style="--x:700px;--y:190px"><g class="v10-drift">${icon('rain').replace('<svg', '<svg width="140" height="140" x="-70" y="-70"')}</g></g>
    <g class="v10-wx-item" style="--x:560px;--y:410px"><g class="v10-drift">${icon('storm').replace('<svg', '<svg width="140" height="140" x="-70" y="-70"')}</g></g>
    <g class="v10-wx-item" style="--x:980px;--y:260px"><g class="v10-drift">${icon('fog').replace('<svg', '<svg width="120" height="120" x="-60" y="-60"')}</g></g>
  </g>
  <g class="v10-wx-clear">
    <g class="v10-clear-sun" transform="translate(520 230)">${icon('sun').replace('<svg', '<svg width="200" height="200" x="-100" y="-100"')}</g>
    <g class="v10-clear-small" transform="translate(1110 90)">${icon('partly').replace('<svg', '<svg width="110" height="110" x="-55" y="-55"')}</g>
  </g>
</svg>`;

export function render(root: HTMLElement) {
  document.title = 'Kiln — 90% chance of “later”';
  root.innerHTML = `
<div class="v10">
  <header class="v10-top">
    <a class="v10-brand" href="?"><span class="v10-bug" aria-hidden="true"></span>Kiln Weather</a>
    <nav aria-label="Main navigation"><a href="#v10-week">7-day</a><a href="#v10-clearing">Clearing</a><a href="#v10-outlook">Outlook</a><a href="#v10-download">Download</a></nav>
  </header>
  <main id="main">
    <section class="v10-broadcast" aria-labelledby="v10-title">
      <div class="v10-screen">
        ${map}
        <div class="v10-bugbox" aria-hidden="true"><span class="v10-live">Live</span><span>Your library</span><span class="v10-clock">--:--</span></div>
        <div class="v10-third">
          <div class="v10-third-tag"><span class="v10-third-tag-text">7-day outlook</span></div>
          <div class="v10-third-main">
            <h1 id="v10-title"><span class="v10-h-later">90% chance of “later”, all week.</span><span class="v10-h-clear">Clearing: test it on your repo today.</span></h1>
            <p class="v10-third-sub"><span class="v10-s-later">Heavy saving continues over Prompt Plains. Trying things remains unlikely.</span><span class="v10-s-clear">Kiln runs the prompt you saved on your own repo, read-only, and shows you what happened.</span></p>
          </div>
          <button type="button" class="v10-update" aria-pressed="false"><span class="v10-u-later">Update the forecast</span><span class="v10-u-clear">Back to “later”</span></button>
        </div>
      </div>
      <div class="v10-ticker" role="region" aria-label="Kiln features">
        <span class="v10-ticker-label" aria-hidden="true">Kiln</span>
        <div class="v10-ticker-track"><ul class="v10-ticker-list">${ticker.map(t => `<li>${t}</li>`).join('')}</ul><ul class="v10-ticker-list" aria-hidden="true">${ticker.map(t => `<li>${t}</li>`).join('')}</ul></div>
      </div>
      <div class="v10-intro">
        <p>Kiln is a Windows app for the prompts, posts and videos you save and never try. It runs them on your own repo through the Codex or Claude Code you already use, shows you the result, and turns the ones that work into skills your agents pick up.</p>
        <div class="v10-intro-cta"><a class="v10-button" href="${installer}">${windowsMark}<span>Download Kiln for Windows</span></a><small>Release 0.17.0 is in a private GitHub repository. Sign in with an account that has access.</small></div>
      </div>
    </section>

    <section class="v10-week" id="v10-week" aria-labelledby="v10-week-title">
      <div class="v10-week-head"><h2 id="v10-week-title">Your 7-day forecast</h2><p class="v10-week-note">For illustration only. Based entirely on your habits.</p></div>
      <ol class="v10-days">
        ${week.map((d, i) => `
        <li class="v10-day" data-day="${i}">
          <h3>${d.day}</h3>
          <div class="v10-day-icon">${icon(d.sky)}</div>
          <p class="v10-day-text">${d.text}</p>
          <p class="v10-day-later"><strong>${d.later}%</strong> chance of later</p>
        </li>`).join('')}
      </ol>
    </section>

    <section class="v10-clearing" id="v10-clearing" aria-labelledby="v10-clearing-title">
      <div class="v10-section-head">
        <p class="v10-strap">Forecast update</p>
        <h2 id="v10-clearing-title">How the skies clear</h2>
        <p>Pick a prompt you saved. Pick a local project or repository, or an isolated example. Kiln runs that exact revision through your signed-in Codex or Claude Code, and nothing in your code changes.</p>
      </div>
      <div class="v10-segments">
        <article class="v10-seg v10-radar-seg">
          <header><h3>Radar: the live run</h3><span class="v10-seg-tag">Sample</span></header>
          <div class="v10-radar-wrap">
            <div class="v10-radar" aria-hidden="true"><span class="v10-sweep"></span>${[[30, 40], [62, 28], [48, 66], [72, 58], [38, 22]].map(([x, y], i) => `<span class="v10-blip" style="left:${x}%;top:${y}%;--i:${i}"></span>`).join('')}</div>
            <ol class="v10-feed">
              <li><b>message</b> Using the app as a seven-year-old would.</li>
              <li><b>command</b> <code>rg -n "signup" src/</code></li>
              <li><b>reasoning</b> Two buttons do the same thing. First obstacle found.</li>
              <li><b>web search</b> onboarding patterns for children’s apps</li>
            </ol>
          </div>
          <dl class="v10-readings"><div><dt>Model</dt><dd>Codex</dd></div><div><dt>Effort</dt><dd>Medium</dd></div><div><dt>Elapsed</dt><dd>2:14</dd></div><div><dt>Tokens in / cached / out</dt><dd>41k / 29k / 2k</dd></div></dl>
          <p>Messages, reasoning summaries, commands, web searches and token counts, live. Up to two runs at once; cancel or retry either.</p>
        </article>
        <article class="v10-seg">
          <header><h3>Today’s verdict</h3></header>
          <ul class="v10-verdicts">
            <li>${icon('sun')}<div><strong>Pass</strong><span>The agent did what the prompt asked.</span></div></li>
            <li>${icon('rain')}<div><strong>Fail</strong><span>It didn’t, and the output says why.</span></div></li>
            <li>${icon('cloud')}<div><strong>Uncertain</strong><span>The task needed edits or tools it didn’t have. Reported as uncertain, never dressed up as sunshine.</span></div></li>
          </ul>
          <p>Output and assessment are saved against the revision you ran. The agent’s forecast and your own judgement are kept apart. You decide what to keep.</p>
        </article>
        <article class="v10-seg">
          <header><h3>Pressure change: learn by revising</h3></header>
          <div class="v10-diff" role="group" aria-label="Sample diff between revisions"><p class="is-del">− Describe that first obstacle and suggest a fix.</p><p class="is-add">+ Describe the first obstacle, what you expected, and one fix.</p></div>
          <p>Edit the prompt, compare revisions and diffs, and run it again on the same repo. You see exactly what changed the result, which is how prompting gets learned. “Ask the agent” discusses an item with its attachments and the source video’s context.</p>
        </article>
      </div>
    </section>

    <section class="v10-outlook" id="v10-outlook" aria-labelledby="v10-outlook-title">
      <div class="v10-section-head">
        <p class="v10-strap">Long-range outlook</p>
        <h2 id="v10-outlook-title">Settled weather: a skill</h2>
      </div>
      <div class="v10-outlook-grid">
        <ol class="v10-steps">
          <li><strong>Create skill</strong><span>Drafts a SKILL.md from the prompt that proved itself, with Kiln’s bundled writing-for-agents guidance, linked back to its source.</span></li>
          <li><strong>Approve the exact revision</strong><span>Approval pins it and publishes it to your own Kiln GitHub repository. Editing later makes a new draft; the approved one stays put.</span></li>
          <li><strong>Install</strong><span>Into compatible Codex, Claude Code or Copilot locations. A new agent session picks it up, and the install leaves a receipt.</span></li>
          <li><strong>Keep the map clean</strong><span>See every installed copy across your locations and projects, spot copies edited outside Kiln, compare, and remove what you don’t use. Every skill description sits in context on every turn.</span></li>
        </ol>
        <aside class="v10-card">
          <p class="v10-card-src">${examples[0].source}</p>
          <h3>${examples[0].title}</h3>
          <blockquote>${examples[0].prompt}</blockquote>
          <p class="v10-card-skill"><strong>If it clears:</strong> ${examples[0].skill}</p>
        </aside>
      </div>
      <div class="v10-advisories">
        <article><h3>Travel advisory: capture</h3><p>Paste or drop text, links, screenshots and files, or press Ctrl+N. “Save only” keeps it without calling a model; “Analyze and add” turns it into prompts, insights, techniques, tools and resources. Paste a YouTube link and press “Distill video”: the transcript and timestamped source links stay attached.</p></article>
        <article><h3>No extra charges</h3><p>${subscription.text} ${subscription.fine} Editing, approval and installation never call a model, and a consent notice explains what’s sent first.</p></article>
      </div>
    </section>

    <section class="v10-download" id="v10-download" aria-labelledby="v10-dl-title">
      <div class="v10-dl">
        <div class="v10-dl-icon">${icon('sun')}</div>
        <div>
          <h2 id="v10-dl-title">Tomorrow: sunny, one tested prompt.</h2>
          <p>${releaseNote} Builds are unsigned. The library is backed by a GitHub repository Kiln creates with the official gh CLI.</p>
        </div>
        <a class="v10-button is-big" href="${installer}">${windowsMark}<span>Download for Windows</span></a>
      </div>
    </section>
  </main>
</div>`;

  // front symbols along each path: triangles for the cold front, semicircles for the warm front
  root.querySelectorAll<SVGGElement>('.v10-front-wrap').forEach(wrap => {
    const path = wrap.querySelector<SVGPathElement>('.v10-front')!;
    const marks = wrap.querySelector<SVGGElement>('.v10-marks')!;
    const cold = wrap.classList.contains('is-cold-front');
    const length = path.getTotalLength();
    let out = '';
    for (let d = 30; d < length - 20; d += 58) {
      const p = path.getPointAtLength(d), q = path.getPointAtLength(d + 1);
      const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      out += cold
        ? `<path d="M-13 0 L0 -20 L13 0Z" transform="translate(${p.x} ${p.y}) rotate(${angle + 180})"/>`
        : `<path d="M-12 0 A12 12 0 0 1 12 0Z" transform="translate(${p.x} ${p.y}) rotate(${angle + 180})"/>`;
    }
    marks.innerHTML = out;
  });

  const clock = root.querySelector<HTMLElement>('.v10-clock')!;
  const tick = () => { const n = new Date(); clock.textContent = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; };
  tick();
  setInterval(tick, 10_000);

  const shell = root.querySelector<HTMLElement>('.v10')!;
  const update = root.querySelector<HTMLButtonElement>('.v10-update')!;
  const days = Array.from(root.querySelectorAll<HTMLElement>('.v10-day'));
  const setDays = (clear: boolean) => days.forEach((el, i) => {
    const d = clear ? week[i].clear : week[i];
    el.classList.toggle('is-clear', clear);
    el.style.setProperty('--delay', `${i * 90}ms`);
    setTimeout(() => {
      el.querySelector('.v10-day-icon')!.innerHTML = icon(d.sky);
      el.querySelector('.v10-day-text')!.textContent = d.text;
      el.querySelector('.v10-day-later strong')!.textContent = `${d.later}%`;
    }, 200 + i * 90);
  });
  update.addEventListener('click', () => {
    const clear = !shell.classList.contains('is-clear');
    shell.classList.toggle('is-clear', clear);
    update.setAttribute('aria-pressed', String(clear));
    document.title = clear ? 'Kiln — Clearing: test it on your repo today' : 'Kiln — 90% chance of “later”';
    setDays(clear);
    root.querySelector('.v10-tried')!.textContent = clear ? '1' : '0';
  });
}
