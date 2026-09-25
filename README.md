# 74 homepages for one app

Seventy-four working homepage designs for [Kiln](https://github.com/waLLxAck/kiln), written by **Claude Opus 5.5** in Claude Code over five rounds of feedback. The last one became Kiln’s homepage.

Every design is a complete page with real text and working interactions: drag a video into the app, flip a skill’s switch per folder, run a test, approve the result. They’re plain TypeScript and CSS, with no framework and no image files. The art is SVG and CSS, and the fonts are self-hosted.

## Browse

```sh
npm install
npm run dev        # http://localhost:5173
```

The index groups the designs by round. On a design page, the bar at the bottom goes back to the index, steps to the previous or next design (or use ← and →), and jumps anywhere. Press H to hide it, or add `?bare` to the URL to leave it out.

## The rounds

| Numbers | Round | The ask |
| --- | --- | --- |
| 01–03 | Three directions | Overhaul the homepage: three unique designs to cycle through. |
| 04–53 | Fifty, all different | Fifty more, nothing like the others, each testing a different way to sell Kiln’s two ideas. |
| 54–56 | Which story goes first? | Hand-drawn mess against crisp UI, in three story orders. |
| 57–66 | Ten takes on one theme | The same theme in ten mediums, from napkin to ink wash. |
| 67–73 | Two problems, told apart | A fixed two-act storyline. Four favourites reworked, three new. |
| 74 | The one that shipped | 70’s story and red pen, 71’s colours and editors, 67’s draggable phone, 69’s motion. |

From round two on, each round began with a written brief, and Claude ran one agent per design in parallel. The briefs are in [`briefs/`](briefs/).

## Layout

```
src/
  main.ts          routes / to the index and /NN/ to design NN
  designs.ts       the catalogue and the rounds
  index-page.ts    the index
  nav.ts           the bar on every design page
  content.ts       product facts shared by the designs
  fonts/           self-hosted fonts, family names start with "P "
  v/NN-slug/       one design: meta.ts (name, angle), index.ts (render), styles
  v/r3-kit/        the shared kit behind 54–56
public/thumbs/     index thumbnails
scripts/
  pages.mjs        after the build, gives every design its own /NN/index.html
  thumbs.mjs       regenerates thumbnails from a running server
  check.mjs        loads every page at 1440 and 390 and reports errors, off-site requests and overflow
```

To add a design, create `src/v/75-something/` with a `meta.ts` and an `index.ts` that exports `render(root)`, then add it to a round in `src/designs.ts`.

Code comments inside the designs use the working names from the exploration: A–C are 01–03, 01–50 are 04–53, R1–R3 are 54–56, and H01–H10 are 57–66. In round five, H01, H02, H03, H05 and H11–H14 are 67, 68, 69, 70 and 71–74.

## Build and deploy

```sh
npm run build      # typecheck, build to dist/, write the /NN/ routes
npm run preview    # serve dist/
```

- **GitHub Pages:** `.github/workflows/pages.yml` builds with `BASE_PATH=/<repo>/` and deploys on every push to `main`.
- **Vercel or any static host:** import the repo. `vercel.json` sets the build command and output folder. The site works from a domain root with the default `BASE_PATH=/`.

`scripts/thumbs.mjs` and `scripts/check.mjs` drive a local Chromium through `playwright-core`. Set `CHROMIUM_PATH` if yours isn’t at `/usr/bin/chromium`, and `SITE_URL` to point at your server.

## What Kiln is

Kiln is a desktop app for Windows, macOS and Linux for people who use coding agents. It puts every skill Claude Code, Codex and Copilot can load on one panel, with a switch per folder. It also turns things you find (a video, a post, a repo) into prompts, and tests a prompt on your own repo before you keep it as a skill.

Kiln is free and open source: [download it](https://wallxack.github.io/kiln/), [read the code](https://github.com/waLLxAck/kiln), or [support its development](https://wallxack.github.io/kiln/support/).

Product details in the designs follow Kiln 0.17.0. The designs were made while Kiln’s repository was still private, so some mention a private download; that’s no longer true. Numbers inside them are labelled samples. People, handles and channels are made up, apart from the `mattpocock/skills` repository used as an example source.

## License

The code is MIT licensed. The fonts keep their own licenses (SIL OFL 1.1 or Apache 2.0); see [FONTS.md](FONTS.md).
