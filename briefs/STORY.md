# PROTOTYPE story brief — round 5: one storyline, seven designs

Read `BRIEF.md` (facts, claim rules, technical contract, fonts) and `THEME.md` (the hand-drawn mess vs crisp Kiln UI theme) first. This file sets the **storyline** every round-5 page must follow, and supersedes both where they conflict.

The user kept four round-4 designs (H01 napkin, H02 pencil and eraser, H03 sticky wall, H05 red-pen review) for their visual identity, and asked for the story to be reworked in all of them, plus three new designs (H11, H12, H13) that carry this story from scratch.

## The storyline (the user's direction)

The page is **two problems, told separately, in this order**, so the visitor never confuses the two features. Then a short close.

### Hero — the confession

- Headline: **"My agents were loading skills I forgot I had."** This is H05's line and the user thinks it's the strongest hook: first person, specific, instantly recognised by anyone with the problem. The kept four use it verbatim (H05 may keep "So I built this." after it). The new three may use it verbatim or a close sibling in the same first-person confessional voice.
- One or two sentences of sub-copy, a download button, and the hero art. The hero art is the start of problem 1 (the folders), not a summary of the whole product.
- No "what it replaced" or "before" section anywhere on the page. The visual already makes the problem obvious; don't explain it twice.

### Problem 1 — skills folders are everywhere → they pop into Kiln

- Show **the actual folders from the different providers**, hand-drawn in your medium, **with skill files visibly inside them**. Use real locations: `~/.claude/skills` (Claude Code), `~/.agents/skills` (shared by Codex, Copilot and others), `.codex/skills`, `.copilot/skills`, a project's `.github/skills`. Put a few recognisable, realistic skills inside, with the mess people actually have: the same skill in two folders, a stale copy that differs, one edited by hand, a broken link or empty folder, a skill you forgot about.
- **The signature moment: the skills pop out of their folders into the crisp Kiln panel**, very much like H03's "Tidy this up" (FLIP / fly animation, duplicates merging into one row, the broken link crumpling or flagged for safe cleanup). Trigger it on scroll into view or with a button; real visitors must see it animate, and it should replay or be re-triggerable.
- The panel then shows **one row per skill, one switch per location** (installed / off / edited outside Kiln in amber / found outside the library). Let the visitor flip switches. Keep the token angle honest: every skill description sits in the agent's context on every turn, so switching off what you don't use keeps context lean. Kiln does not measure per-skill tokens.
- Copy stays short: a heading, one or two lines, the interaction.

### Problem 2 — "How do I add new skills to this?"

A clearly separate section with its own heading (a question or a confession in the same voice, e.g. about finding a great prompt in a video, saving it and never trying it). It shows the second capability as a **pipeline the visitor drives by dragging**:

1. **Sources.** Small, recognisable **renders** of where good ideas come from (build them in HTML/CSS/SVG, no images from the network, no real logos needed; a red play button or a bird-less "X"-style post card is enough to read as the platform):
   - a **YouTube video** (thumbnail, fictional title and channel, duration, a progress bar),
   - a **post on X** (fictional handle and name, a short tip as the post text),
   - a **GitHub repo**: the user asked for **`mattpocock/skills`**. Show only the repo name, a generic file list (`skills/`, `README.md`, `LICENSE`) and a "Code" button. Don't invent the repo's skill names, stars or quotes from him.
   - optionally **a screenshot / copied image** or a pasted note.
   Style them to your medium (printed and taped, pinned, clipped, drawn around in pen…) while staying recognisable.
2. **Drag a source into Kiln.** The drop target is Kiln's capture area ("Analyze and add"; mention Ctrl+Shift+Space for capture from anywhere). Dragging must use **pointer events** (so it works with touch) and every draggable needs a **keyboard/tap fallback** (a button such as "Add to Kiln"). Give it a satisfying drop.
3. **It becomes a prompt — the star — plus the other things Kiln pulls out.** Kiln analyses the source into a collection linked to it: **one prominent prompt card**, and smaller **technique**, **insight** and **tool** cards around it. For a YouTube source, show timestamped source links (e.g. "from 04:12"). Use one of the real example prompts from `content.ts` (`examples`) for the prompt.
4. **Drag the prompt into the test area.** Choose a repo (a sample repo name), watch a short live run (a few steps: reading files, a command, elapsed time and token counts labelled as a sample), **read-only, nothing in your code changes**, and get the agent's verdict (pass, or uncertain → you edit one line → rerun → pass; keep it to one loop at most). Your judgement is separate from the agent's.
5. **Approve → it becomes a skill that lands in Kiln.** Approving pins that exact revision. The new skill **appears as a new row on the same panel from problem 1** (scroll the visitor back to it or show the panel again right there), and the visitor can **toggle where it's installed** (Claude Code, Codex, Copilot, this project). This is the moment that ties the two problems together; keep it clearly the payoff of problem 2, not a third story.

The prompt is the main character of problem 2. Techniques, insights and tools are supporting cast: visible, but smaller.

### Close

- At most one compact trust/facts strip (uses your signed-in Codex or Claude Code subscription, no API key; tests are read-only; approval publishes to your own GitHub repo; Windows app plus CLI, MIT) and the **download** with the private-repository note. A short FAQ is fine if it's tight. Nothing else. About four sections in total: hero, problem 1, problem 2, close.

## Hard rules

- Claim rules from `BRIEF.md` apply. Fictional authors for the video and the post; no quotes attributed to real people; the GitHub repo shows `mattpocock/skills` as a source to import, nothing more. Sample numbers labelled as samples.
- Two drawings of the mess at most (the folders, and the sources if you draw them). Crisp UI for everything Kiln.
- The two problems must read as two distinct acts: separate sections, separate headings, and ideally a visual break between them.
- Both drag interactions must work with mouse, touch (390px phone layout) and keyboard.
- If you hide animations for `navigator.webdriver` so screenshots show end states, real visitors must still get them. Honour `prefers-reduced-motion`.
- Verify with `node apps/marketing/src/prototype/shoot.mjs HNN` and a throwaway Playwright script that actually drives both drags, the pop-in, the test and the approve (use `executablePath: '/usr/bin/chromium'`; keep the script inside `apps/marketing/src/prototype/`, delete it afterwards). Run `npx tsc --noEmit` from the repo root and fix errors in your folder. Look at your screenshots with the Read tool and fix anything ugly, overlapping or cramped, at 1440 and 390.
