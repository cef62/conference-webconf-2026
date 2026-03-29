import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { http, HttpResponse } from "msw"
import { useTicket, useTickets } from "../../src/api/tickets"
import { server } from "../../src/mocks/server"
import { tickets } from "../../src/mocks/data"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe("useTickets", () => {
  it("returns the ticket list", async () => {
    const { result } = renderHook(() => useTickets(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(tickets.length)
    expect(result.current.data![0].id).toBe("t-001")
  })

  it("handles server error", async () => {
    server.use(
      http.get("/api/tickets", () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const { result } = renderHook(() => useTickets(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe("useTicket", () => {
  it("returns a single ticket by id", async () => {
    const { result } = renderHook(() => useTicket("t-001"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data!.title).toBe("Cannot reset password")
  })

  it("does not fetch when id is null", () => {
    const { result } = renderHook(() => useTicket(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
  })

  it("handles 404 for unknown id", async () => {
    const { result } = renderHook(() => useTicket("nonexistent"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
