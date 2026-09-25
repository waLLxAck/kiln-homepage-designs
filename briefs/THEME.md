# PROTOTYPE theme brief — round 4: ten horizontal explorations of the R1–R3 theme

Read `BRIEF.md` first for product facts, claim rules, the technical contract, fonts and verification. This file adds the theme the user chose, and supersedes BRIEF.md's design rules where they conflict.

## The theme (what the user liked, in their words and from their picks)

Reference implementation: `?variant=R1` (also R2, R3), built from `v/r3-kit/` (`kit.ts`, `kit.css`, `rough.ts`). Study it before you start.

- **Human, sloppy, hand-drawn** for the *problem*: your messy skill folders, your pile of saved bookmarks. It should look drawn by a person, not generated.
- **Crisp product UI** for *Kiln*: the fix. The contrast between the hand-drawn mess and the crisp product carries the before/after. Do it once, not as a repeated device.
- **Understood from the first screen.** The hero shows the whole idea: mess → Kiln.
- **Touchable mechanisms, each used once:** the skills **panel** (one switch per skill per location: installed / off / edited outside Kiln (amber) / found outside the library) and the **swipe or quick test** of a saved idea (read-only run on your repo, live steps, pass / uncertain verdict, edit one line and re-run, approve as skill). Ideally the tested skill then lands on the panel, which closes the loop between the two selling points.
- **Short.** About five sections. Few drawings: three or four in total. No long reads.
- The user's dislikes: one device repeated all down the page (a before/after slider on every section), too many illustrations, pages nobody will read to the end.
- The recommended story leads with selling point 1 (skills folders → one panel). Testing is act two. Some explorations may deliberately test a different order or framing; say which in `meta.angle`.

## What "horizontal variety" means here

Every variant must keep the theme above but differ from R1–R3 and from each other on **several** of these axes at once:

- **Drawing medium:** marker on whiteboard (R1 already), ballpoint, pencil, chalk, crayon, felt-tip on sticky notes, ink wash, red-pen markup, napkin doodle…
- **Kiln UI treatment:** light neutral (R1 already), dark, Windows 11-style, monochrome, high-density developer tool, big friendly controls…
- **Layout and pacing:** vertical scroll (R1), horizontal scroll, comic panels, one sticky stage that transforms, split screen, annotated single artefact…
- **Signature interaction:** switches (R1), swipe (R1), drag a folder or note onto Kiln, erase the mess, sticky notes flying into panel rows, scroll-driven tidy-up, clicking scribbles to reveal the fix…
- **Voice and headline:** plain, funny, confessional, teacherly, terse. Write fresh copy; don't reuse R1–R3 headlines.
- **Story order and framing.**

You may import helpers from `../r3-kit/rough.ts` (read-only) or copy and adapt code from `../r3-kit/kit.ts` into your own folder. Don't edit `r3-kit`. Your page must not look like a reskin of R1: change the composition, not just the colours.

Keys: folders are `v/HNN-slug/` (e.g. `v/H03-sticky-wall/`) so the key is `HNN`. View at `http://localhost:5174/?variant=HNN`; verify with `node apps/marketing/src/prototype/shoot.mjs HNN`. Scroll- or click-driven states don't show in full-page screenshots, so also drive them with a small throwaway Playwright script (use `executablePath: '/usr/bin/chromium'`; keep scripts inside the repo so `@playwright/test` resolves, and delete them afterwards). If you hide animations for `navigator.webdriver`, make sure real visitors still get them.
