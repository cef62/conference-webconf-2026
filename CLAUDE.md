# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Conference presentation: **Spec-Driven Development — I tried every framework so you don't have to**
Speaker: Matteo Ronchi (Software Architect @ WorkWave)
Event: WebConf 2026 · 30 min slot · mid-level dev audience familiar with AI tools but not SDD specifically

## Slide Format (Deckset)

- **Tool:** Deckset (macOS markdown presentation app)
- **Slide separator:** `---` on its own line
- **Speaker notes:** Lines starting with `^` (not rendered on slides, shown in presenter view)
- **Images:** `![fit](./images/filename.png)` — `fit` scales to fill the slide
- **Frontmatter:** First line can be Deckset directives (e.g. `slidenumbers: false`)
- **Emoji in headings:** Allowed for visual cues (e.g. 🎬 for demo slides)
- All images live in `./images/`

## Content Guidelines

- Tone: conversational, opinionated, first-person. Not academic.
- The talk has a clear narrative arc: problem → landscape → honest assessment → personal practice → takeaways
- Two demo slots marked `[VIDEO]` — these are placeholders for pre-recorded screencasts, not live demos
- Speaker notes (`^`) provide context the audience doesn't see — keep them concise, ~2-3 sentences max
- Prefer concrete examples over abstract explanations
- Keep slide text minimal — bullets, not paragraphs
- Tables are used for comparisons (Plan Mode vs SDD, Memory Bank vs Spec)
- When editing: preserve the existing slide count (~25 content slides) to fit the 30-min slot (~1.2 min/slide avg)
