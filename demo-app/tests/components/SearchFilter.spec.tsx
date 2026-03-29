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
