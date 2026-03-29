# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Project

Demo app for WebConf 2026 SDD talk. Support ticket system — React 19 + Vite + TypeScript. No real backend; MSW mocks all API calls.

See `@docs/superpowers/specs/2026-03-29-demo-app-design.md` for full spec.

## Commands

```bash
npm run dev           # Start dev server (Vite)
npm run build         # Production build
npm run test          # Vitest watch mode
npm run test:ci       # Vitest single run
npm run test:ct       # Playwright component tests
```

## Testing Rules

### Two test layers — choose by what you're testing

- **Vitest** → hooks, utilities, data logic, anything non-visual
- **Playwright CT** → component rendering, user interactions, visual assertions (badge colors, layout, selection states)

### Vitest conventions

- Tests go in `tests/unit/`
- Use `msw/node` (`setupServer`) for API mocking — import handlers from `src/mocks/handlers.ts`
- Every test file creates a fresh `QueryClient` — never share query cache across tests
- Use `renderHook` from `@testing-library/react` for hook tests, wrapping with `QueryClientProvider`
- Assert loading → success transitions; assert error states when MSW returns errors

### Playwright CT conventions

- Tests go in `tests/components/` as `*.spec.tsx`
- Mount wrapper at `playwright/index.tsx` provides `ChakraProvider` + `QueryClientProvider`
- Mock API via `page.route()` — don't wire MSW into the CT browser
- Test real user behavior: click rows, check visible text, verify badge colors via CSS/attribute assertions
- Use `toBeVisible()` over `toBeInTheDocument()` — Playwright tests run in a real browser

### General

- Every component, hook, and data module must have tests
- Test file names mirror source: `TicketList.tsx` → `TicketList.spec.tsx`, `tickets.ts` → `tickets.test.ts`
- No snapshot tests — they're brittle and unhelpful for a demo app
- No mocking of Chakra UI internals — test through the rendered output

## Styling Rules

- Use Chakra UI v3 components exclusively — no raw HTML elements for layout or UI
- No custom CSS files — use Chakra's `style props` and built-in tokens
- Default Chakra theme — no custom theme config
- Badge color mapping:
  - Status: `open`=blue, `in-progress`=yellow, `resolved`=green
  - Priority: `low`=gray, `medium`=orange, `high`=red

## Code Rules

- TypeScript strict mode — no `any`, no `ts-ignore`
- All API types in `src/types/`
- TanStack Query hooks in `src/api/` — one file per resource
- MSW handlers in `src/mocks/handlers.ts` — `server.ts` for Vitest, `browser.ts` for dev
- Components are functional, no class components
- No barrel files (`index.ts` re-exports) — import directly from the source file
