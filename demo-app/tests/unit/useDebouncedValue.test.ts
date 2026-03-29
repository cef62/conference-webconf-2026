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
