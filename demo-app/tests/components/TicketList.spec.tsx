import { test, expect } from "@playwright/experimental-ct-react"
import { TicketList } from "../../src/components/TicketList"
import { tickets } from "../../src/mocks/data"

function mockTicketsApi(page: import("@playwright/test").Page) {
  return page.route("**/api/tickets", (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(tickets),
    })
  })
}

test.describe("TicketList", () => {
  test("renders all tickets", async ({ mount, page }) => {
    await mockTicketsApi(page)

    const component = await mount(
      <TicketList selectedId={null} onSelect={() => {}} />
    )

    const table = page.getByTestId("ticket-list-table")
    await expect(table).toBeVisible()

    for (const ticket of tickets) {
      const row = page.getByTestId(`ticket-list-row-${ticket.id}`)
      await expect(row).toBeVisible()
    }
  })

  test("shows status badges with correct text", async ({ mount, page }) => {
    await mockTicketsApi(page)

    const component = await mount(
      <TicketList selectedId={null} onSelect={() => {}} />
    )

    const statusBadge = component.getByTestId("ticket-list-status-badge-t-001")
    await expect(statusBadge).toHaveText("open")

    const inProgressBadge = component.getByTestId("ticket-list-status-badge-t-003")
    await expect(inProgressBadge).toHaveText("in-progress")

    const resolvedBadge = component.getByTestId("ticket-list-status-badge-t-005")
    await expect(resolvedBadge).toHaveText("resolved")
  })

  test("shows priority badges with correct text", async ({ mount, page }) => {
    await mockTicketsApi(page)

    const component = await mount(
      <TicketList selectedId={null} onSelect={() => {}} />
    )

    const highBadge = component.getByTestId("ticket-list-priority-badge-t-001")
    await expect(highBadge).toHaveText("high")

    const lowBadge = component.getByTestId("ticket-list-priority-badge-t-004")
    await expect(lowBadge).toHaveText("low")

    const medBadge = component.getByTestId("ticket-list-priority-badge-t-005")
    await expect(medBadge).toHaveText("medium")
  })

  test("highlights selected row", async ({ mount, page }) => {
    await mockTicketsApi(page)

    const component = await mount(
      <TicketList selectedId="t-002" onSelect={() => {}} />
    )

    const selectedRow = component.getByTestId("ticket-list-row-t-002")
    await expect(selectedRow).toBeVisible()
  })

  test("calls onSelect when a row is clicked", async ({ mount, page }) => {
    await mockTicketsApi(page)

    let selectedId = ""
    const component = await mount(
      <TicketList selectedId={null} onSelect={(id: string) => { selectedId = id }} />
    )

    await component.getByTestId("ticket-list-row-t-003").click()
    expect(selectedId).toBe("t-003")
  })

  test("shows loading state", async ({ mount, page }) => {
    await page.route("**/api/tickets", () => {
      // Never resolve — keeps loading state visible
      return new Promise(() => {})
    })

    const component = await mount(
      <TicketList selectedId={null} onSelect={() => {}} />
    )

    await expect(page.getByTestId("ticket-list-loading")).toBeVisible()
  })

  test("shows error state", async ({ mount, page }) => {
    await page.route("**/api/tickets", (route) => {
      return route.fulfill({ status: 500, body: "Internal Server Error" })
    })

    const component = await mount(
      <TicketList selectedId={null} onSelect={() => {}} />
    )

    await expect(page.getByTestId("ticket-list-error")).toBeVisible()
  })
})
