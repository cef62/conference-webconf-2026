---
name: review
description: Review the presentation for consistency, completeness, and quality. Use when you want a full pass on the slides.
---

Review `SDD-conference-2026.md` and check:

1. **Structure:** Every slide separated by `---`. No missing separators. Frontmatter on line 1.
2. **Speaker notes:** Every content slide (not image-only slides) should have at least one `^` speaker note. Flag slides missing notes.
3. **Image refs:** Every `![...](...)`  path points to a file that exists in `./images/`. Flag broken refs.
4. **Timing:** Count content slides. At ~1.2 min/slide for a 30-min talk, flag if significantly over/under 25 slides.
5. **Consistency:** Check emoji usage, heading levels, bullet style, table formatting are consistent throughout.
6. **Grammar & clarity:** Flag typos, awkward phrasing, or slides with too much text (>6 bullet points or >80 words).
7. **Narrative flow:** Verify the arc makes sense: problem → landscape → honest assessment → personal practice → takeaways.
8. **Links:** Check that all URLs in the Resources slide and elsewhere are well-formed.

Output a concise report grouped by category. For each issue, reference the slide number (count from 1) and quote the relevant text.
