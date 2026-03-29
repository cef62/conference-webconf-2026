# Spec-Driven Development

Conference talk for [WebDay Conference 2026](https://www.webdayconf.it/2026) (30 min slot).

**Speaker:** Matteo Ronchi — Software Architect @ WorkWave

## What's this about

How to stay in control of AI coding tools by writing specifications _before_ code. The talk covers the current AI tooling landscape, an honest assessment of what works (and what doesn't), and a practical methodology built around specs, plans, and structured prompts.

Narrative arc: **problem -> landscape -> honest assessment -> personal practice -> takeaways**

## Repo structure

```
SDD-conference-2026.md   # slide deck (Deckset markdown)
images/                  # slide images and template
docs/superpowers/        # reference material for the "superpowers" workflow
demo-app/                # live demo: ticket management app (React + Vite)
CLAUDE.md                # AI assistant instructions for this project
```

## Slides

The deck is authored in [Deckset](https://www.deckset.com/) format — a macOS app that renders markdown as slides.

- Open `SDD-conference-2026.md` in Deckset to present
- Slides are separated by `---`
- Lines starting with `^` are speaker notes (not shown on screen)
- Two demo slots are marked `[VIDEO]` for pre-recorded screencasts

## Demo app

The `demo-app/` folder contains a React + TypeScript ticket management app used to demonstrate spec-driven development with AI tools.

```bash
cd demo-app
npm install
npm run dev        # dev server
npx vitest run     # unit tests (15 tests)
npx playwright test --config=playwright-ct.config.ts  # component tests (15 tests)
```

Stack: Vite, React, Chakra UI, TanStack Query, MSW (API mocking), Vitest, Playwright CT.
