# Search Filter with Debounced Input

**Date:** 2026-03-29
**Status:** Approved
**Scope:** Add search/filter to demo-app ticket list

## Overview

Add a debounced text search input above the ticket table that filters tickets by title or description via the MSW-mocked API.

## Component: SearchFilter

- **Location:** `src/components/SearchFilter.tsx`
- Chakra UI `Input` with placeholder "Search tickets..."
- Props:
  - `onSearch: (query: string) => void` — called with debounced value
  - `debounceMs?: number` — default 300ms
- Manages raw input state internally, emits debounced value via `onSearch`
- `data-testid="search-filter-input"`

## Hook: useDebouncedValue

- **Location:** `src/hooks/useDebouncedValue.ts`
- Signature: `useDebouncedValue<T>(value: T, delayMs: number): T`
- Uses `useEffect` + `setTimeout`/`clearTimeout`
- No external dependencies

## Data Flow

1. User types in `SearchFilter` → raw state updates immediately
2. `useDebouncedValue` delays emission by `debounceMs`
3. Debounced value triggers `onSearch` callback
4. `App` stores `searchQuery` state, passes to `useTickets(searchQuery)`
5. `useTickets(search?)` appends `?search=<query>` to `/api/tickets` (omits param when empty)
6. MSW handler filters tickets: case-insensitive substring match on `title` OR `description`
7. Empty/missing `search` param returns all tickets

## API Changes

### `useTickets(search?: string)`

- `queryKey: ["tickets", { search }]` — cache varies by search term
- Fetch URL: `/api/tickets` or `/api/tickets?search=<encoded>`

### MSW Handler: `GET /api/tickets`

```typescript
http.get("/api/tickets", ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get("search")?.toLowerCase() ?? ""
  const filtered = search
    ? tickets.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      )
    : tickets
  return HttpResponse.json(filtered)
})
```

## App.tsx Changes

- New state: `const [searchQuery, setSearchQuery] = useState("")`
- Render `SearchFilter` above `TicketList` in the left panel
- Pass `searchQuery` to `useTickets` via TicketList or lift the hook — TBD during implementation, but simplest path: pass `searchQuery` as prop to `TicketList` which forwards to `useTickets`

**Decision:** Add `searchQuery?: string` prop to `TicketList` rather than lifting the hook to App. Keeps data fetching colocated with the list.

## File Changes

| File | Change |
|------|--------|
| `src/components/SearchFilter.tsx` | **New** — search input component |
| `src/hooks/useDebouncedValue.ts` | **New** — debounce hook |
| `src/components/TicketList.tsx` | Add `searchQuery` prop, pass to `useTickets` |
| `src/api/tickets.ts` | `useTickets` accepts optional `search` param |
| `src/mocks/handlers.ts` | Filter logic in GET handler |
| `src/App.tsx` | Add `searchQuery` state, render `SearchFilter` |

## Testing

### Unit: `useDebouncedValue`
- Returns initial value immediately
- Updates after delay
- Resets timer on rapid changes (only last value emitted)

### Playwright CT: `SearchFilter`
- Renders input with correct testid
- Calls `onSearch` with debounced value after typing
- Does not call `onSearch` during debounce window

### Playwright CT: `TicketList` (update existing)
- With `searchQuery` prop, only matching tickets render
- Empty search shows all tickets

### MSW Handler
- Covered by existing unit test setup; add case for `?search=` param

## Test IDs

| Element | data-testid |
|---------|-------------|
| Search input | `search-filter-input` |

## Out of Scope

- Status/priority filter dropdowns
- Sort controls
- Search highlighting in results
- Loading indicator during search (TanStack Query handles refetch silently)
