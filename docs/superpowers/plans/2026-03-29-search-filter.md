# Search Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a debounced search input that filters tickets by title/description via the MSW-mocked API.

**Architecture:** SearchFilter component owns raw input state and uses a custom useDebouncedValue hook. Debounced value flows up to App, down to TicketList as a searchQuery prop, into useTickets which appends `?search=` to the API call. MSW handler does case-insensitive substring filtering on title + description.

**Tech Stack:** React 19, Chakra UI v3, TanStack Query v5, MSW v2, Vitest, Playwright CT

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/hooks/useDebouncedValue.ts` | Create | Generic debounce hook |
| `src/components/SearchFilter.tsx` | Create | Search input + debounce wiring |
| `src/mocks/handlers.ts` | Modify | Add `?search=` filtering to GET /api/tickets |
| `src/api/tickets.ts` | Modify | useTickets accepts optional search param |
| `src/components/TicketList.tsx` | Modify | Accept searchQuery prop, pass to useTickets |
| `src/App.tsx` | Modify | Add searchQuery state, render SearchFilter |
| `tests/unit/useDebouncedValue.test.ts` | Create | Hook unit tests |
| `tests/unit/tickets.test.tsx` | Modify | Add search param test |
| `tests/components/SearchFilter.spec.tsx` | Create | CT tests for search component |
| `tests/components/TicketList.spec.tsx` | Modify | Add search filtering test |

---

### Task 1: useDebouncedValue Hook

**Files:**
- Create: `demo-app/src/hooks/useDebouncedValue.ts`
- Create: `demo-app/tests/unit/useDebouncedValue.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/unit/useDebouncedValue.test.ts
import { renderHook, act } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useDebouncedValue } from "../../src/hooks/useDebouncedValue"

describe("useDebouncedValue", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 300))
    expect(result.current).toBe("hello")
  })

  it("updates value after delay", async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    )

    rerender({ value: "ab", delay: 300 })
    expect(result.current).toBe("a")

    await act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe("ab")

    vi.useRealTimers()
  })

  it("resets timer on rapid changes", async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    )

    rerender({ value: "ab", delay: 300 })
    await act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe("a")

    rerender({ value: "abc", delay: 300 })
    await act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe("a")

    await act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe("abc")

    vi.useRealTimers()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd demo-app && npx vitest run tests/unit/useDebouncedValue.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```typescript
// src/hooks/useDebouncedValue.ts
import { useEffect, useState } from "react"

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd demo-app && npx vitest run tests/unit/useDebouncedValue.test.ts`
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add demo-app/src/hooks/useDebouncedValue.ts demo-app/tests/unit/useDebouncedValue.test.ts
git commit -m "feat: add useDebouncedValue hook with tests"
```

---

### Task 2: MSW Handler — search filtering

**Files:**
- Modify: `demo-app/src/mocks/handlers.ts`
- Modify: `demo-app/tests/unit/tickets.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to the `useTickets` describe block in `tests/unit/tickets.test.tsx`:

```typescript
it("filters tickets by search param", async () => {
  const { result } = renderHook(() => useTickets("password"), {
    wrapper: createWrapper(),
  })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data!.length).toBeGreaterThan(0)
  expect(
    result.current.data!.every(
      (t) =>
        t.title.toLowerCase().includes("password") ||
        t.description.toLowerCase().includes("password")
    )
  ).toBe(true)
})
```

This will fail because `useTickets` doesn't accept a search param yet.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-app && npx vitest run tests/unit/tickets.test.tsx`
Expected: FAIL — useTickets takes 0 arguments

- [ ] **Step 3: Update the MSW handler**

Replace the GET /api/tickets handler in `src/mocks/handlers.ts`:

```typescript
http.get("/api/tickets", ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get("search")?.toLowerCase() ?? ""
  const filtered = search
    ? tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      )
    : tickets
  return HttpResponse.json(filtered)
}),
```

- [ ] **Step 4: Update useTickets to accept search param**

Replace `fetchTickets` and `useTickets` in `src/api/tickets.ts`:

```typescript
async function fetchTickets(search?: string): Promise<Ticket[]> {
  const url = search ? `/api/tickets?search=${encodeURIComponent(search)}` : "/api/tickets"
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.status}`)
  }
  return response.json()
}

export function useTickets(search?: string) {
  return useQuery({
    queryKey: ["tickets", { search }],
    queryFn: () => fetchTickets(search),
  })
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd demo-app && npx vitest run tests/unit/tickets.test.tsx`
Expected: All tests PASS (existing + new)

- [ ] **Step 6: Commit**

```bash
git add demo-app/src/mocks/handlers.ts demo-app/src/api/tickets.ts demo-app/tests/unit/tickets.test.tsx
git commit -m "feat: add search query param to tickets API and MSW handler"
```

---

### Task 3: SearchFilter Component

**Files:**
- Create: `demo-app/src/components/SearchFilter.tsx`
- Create: `demo-app/tests/components/SearchFilter.spec.tsx`

- [ ] **Step 1: Write the Playwright CT test**

```typescript
// tests/components/SearchFilter.spec.tsx
import { test, expect } from "@playwright/experimental-ct-react"
import { SearchFilter } from "../../src/components/SearchFilter"

test.describe("SearchFilter", () => {
  test("renders input with correct testid", async ({ mount, page }) => {
    await mount(<SearchFilter onSearch={() => {}} />)

    await expect(page.getByTestId("search-filter-input")).toBeVisible()
  })

  test("calls onSearch with debounced value after typing", async ({ mount, page }) => {
    const searchValues: string[] = []
    await mount(
      <SearchFilter
        onSearch={(q: string) => searchValues.push(q)}
        debounceMs={100}
      />
    )

    await page.getByTestId("search-filter-input").fill("password")
    await page.waitForTimeout(150)

    expect(searchValues).toContain("password")
  })

  test("does not call onSearch during debounce window", async ({ mount, page }) => {
    const searchValues: string[] = []
    await mount(
      <SearchFilter
        onSearch={(q: string) => searchValues.push(q)}
        debounceMs={500}
      />
    )

    await page.getByTestId("search-filter-input").fill("pass")
    await page.waitForTimeout(100)

    expect(searchValues.filter((v) => v === "pass")).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd demo-app && npx playwright test tests/components/SearchFilter.spec.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the component**

```typescript
// src/components/SearchFilter.tsx
import { useEffect } from "react"
import { Input } from "@chakra-ui/react"
import { useState } from "react"
import { useDebouncedValue } from "../hooks/useDebouncedValue"

interface SearchFilterProps {
  onSearch: (query: string) => void
  debounceMs?: number
}

export function SearchFilter({ onSearch, debounceMs = 300 }: SearchFilterProps) {
  const [rawValue, setRawValue] = useState("")
  const debouncedValue = useDebouncedValue(rawValue, debounceMs)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <Input
      data-testid="search-filter-input"
      placeholder="Search tickets..."
      value={rawValue}
      onChange={(e) => setRawValue(e.target.value)}
    />
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd demo-app && npx playwright test tests/components/SearchFilter.spec.tsx`
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add demo-app/src/components/SearchFilter.tsx demo-app/tests/components/SearchFilter.spec.tsx
git commit -m "feat: add SearchFilter component with Playwright CT tests"
```

---

### Task 4: Wire TicketList and App

**Files:**
- Modify: `demo-app/src/components/TicketList.tsx`
- Modify: `demo-app/src/App.tsx`
- Modify: `demo-app/tests/components/TicketList.spec.tsx`

- [ ] **Step 1: Write the failing Playwright CT test**

Add to the `TicketList` describe block in `tests/components/TicketList.spec.tsx`:

```typescript
test("filters tickets when searchQuery is provided", async ({ mount, page }) => {
  // Mock the search endpoint — "password" matches t-001 "Cannot reset password"
  await page.route("**/api/tickets?search=password", (route) => {
    const filtered = tickets.filter(
      (t) =>
        t.title.toLowerCase().includes("password") ||
        t.description.toLowerCase().includes("password")
    )
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(filtered),
    })
  })

  const component = await mount(
    <TicketList selectedId={null} onSelect={() => {}} searchQuery="password" />
  )

  // Should show only the matching ticket(s)
  await expect(page.getByTestId("ticket-list-row-t-001")).toBeVisible()

  // A non-matching ticket should not be visible
  await expect(page.getByTestId("ticket-list-row-t-002")).not.toBeVisible()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-app && npx playwright test tests/components/TicketList.spec.tsx`
Expected: FAIL — searchQuery is not a valid prop

- [ ] **Step 3: Update TicketList to accept searchQuery prop**

In `src/components/TicketList.tsx`, update the interface and hook call:

Change the interface:
```typescript
interface TicketListProps {
  selectedId: string | null
  onSelect: (id: string) => void
  searchQuery?: string
}
```

Change the component signature and hook call:
```typescript
export function TicketList({ selectedId, onSelect, searchQuery }: TicketListProps) {
  const { data: tickets, isLoading, isError } = useTickets(searchQuery)
```

No other changes needed — the rest of the component stays the same.

- [ ] **Step 4: Update App.tsx to add search state and render SearchFilter**

Replace the content of `src/App.tsx`:

```typescript
import { useState } from "react"
import { Box } from "@chakra-ui/react"
import { Layout } from "./components/Layout"
import { TicketList } from "./components/TicketList"
import { TicketDetail } from "./components/TicketDetail"
import { SearchFilter } from "./components/SearchFilter"

export function App() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Layout
      left={
        <>
          <Box p={4} borderBottomWidth="1px">
            <SearchFilter onSearch={setSearchQuery} />
          </Box>
          <TicketList
            selectedId={selectedTicketId}
            onSelect={setSelectedTicketId}
            searchQuery={searchQuery}
          />
        </>
      }
      right={<TicketDetail ticketId={selectedTicketId} />}
    />
  )
}
```

- [ ] **Step 5: Run all tests**

Run: `cd demo-app && npx vitest run && npx playwright test`
Expected: All unit and CT tests PASS

- [ ] **Step 6: Commit**

```bash
git add demo-app/src/components/TicketList.tsx demo-app/src/App.tsx demo-app/tests/components/TicketList.spec.tsx
git commit -m "feat: wire SearchFilter into App and TicketList"
```

---

### Task 5: Final Verification

**Files:** None — verification only

- [ ] **Step 1: Run full unit test suite**

Run: `cd demo-app && npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run full Playwright CT suite**

Run: `cd demo-app && npx playwright test`
Expected: All tests PASS

- [ ] **Step 3: Run production build**

Run: `cd demo-app && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Manual smoke test**

Run: `cd demo-app && npm run dev`
Verify:
1. Search input visible above ticket table
2. Typing "password" filters to tickets matching that term
3. Clearing input shows all 18 tickets
4. Selected ticket preserved when still in filtered results
5. Debounce is perceptible — table doesn't update on every keystroke

---

## Unresolved Questions

None — spec is fully defined.
