import { test, expect } from "@playwright/experimental-ct-react"
import { TicketDetail } from "../../src/components/TicketDetail"
import { tickets } from "../../src/mocks/data"

const sampleTicket = tickets[0] // t-001: "Cannot reset password"

test.describe("TicketDetail", () => {
  test("shows empty state when no ticket selected", async ({ mount, page }) => {
    const component = await mount(<TicketDetail ticketId={null} />)

    await expect(page.getByTestId("ticket-detail-empty")).toBeVisible()
    await expect(page.getByTestId("ticket-detail-empty")).toHaveText(
      "Select a ticket to view details"
    )
  })

  test("displays ticket fields when selected", async ({ mount, page }) => {
    await page.route("**/api/tickets/t-001", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sampleTicket),
      })
    })

    const component = await mount(<TicketDetail ticketId="t-001" />)

    await expect(page.getByTestId("ticket-detail-title")).toHaveText(
      sampleTicket.title
    )
    await expect(page.getByTestId("ticket-detail-status-badge")).toHaveText(
      sampleTicket.status
    )
    await expect(page.getByTestId("ticket-detail-priority-badge")).toHaveText(
      sampleTicket.priority
    )
    await expect(page.getByTestId("ticket-detail-assignee")).toContainText(
      sampleTicket.assignee
    )
    await expect(page.getByTestId("ticket-detail-description")).toHaveText(
      sampleTicket.description
    )
    await expect(page.getByTestId("ticket-detail-created")).toBeVisible()
    await expect(page.getByTestId("ticket-detail-updated")).toBeVisible()
  })

  test("shows loading state", async ({ mount, page }) => {
    await page.route("**/api/tickets/t-001", () => {
      return new Promise(() => {})
    })

    const component = await mount(<TicketDetail ticketId="t-001" />)

    await expect(page.getByTestId("ticket-detail-loading")).toBeVisible()
  })

  test("shows error state for unknown ticket", async ({ mount, page }) => {
    await page.route("**/api/tickets/nonexistent", (route) => {
      return route.fulfill({ status: 404 })
    })

    const component = await mount(<TicketDetail ticketId="nonexistent" />)

    await expect(page.getByTestId("ticket-detail-error")).toBeVisible()
  })
})
