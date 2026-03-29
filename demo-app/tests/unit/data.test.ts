import { describe, expect, it } from "vitest"
import { tickets } from "../../src/mocks/data"
import type { Ticket } from "../../src/types/ticket"

describe("seed data", () => {
  it("contains 15-20 tickets", () => {
    expect(tickets.length).toBeGreaterThanOrEqual(15)
    expect(tickets.length).toBeLessThanOrEqual(20)
  })

  it("every ticket has the correct shape", () => {
    const validStatuses: Ticket["status"][] = ["open", "in-progress", "resolved"]
    const validPriorities: Ticket["priority"][] = ["low", "medium", "high"]

    for (const ticket of tickets) {
      expect(ticket.id).toBeTruthy()
      expect(ticket.title).toBeTruthy()
      expect(ticket.description).toBeTruthy()
      expect(validStatuses).toContain(ticket.status)
      expect(validPriorities).toContain(ticket.priority)
      expect(ticket.assignee).toBeTruthy()
      expect(() => new Date(ticket.createdAt)).not.toThrow()
      expect(() => new Date(ticket.updatedAt)).not.toThrow()
    }
  })

  it("has a mix of statuses", () => {
    const statuses = new Set(tickets.map((t) => t.status))
    expect(statuses.size).toBe(3)
  })

  it("has a mix of priorities", () => {
    const priorities = new Set(tickets.map((t) => t.priority))
    expect(priorities.size).toBe(3)
  })

  it("has multiple assignees", () => {
    const assignees = new Set(tickets.map((t) => t.assignee))
    expect(assignees.size).toBeGreaterThanOrEqual(3)
  })

  it("has unique ids", () => {
    const ids = new Set(tickets.map((t) => t.id))
    expect(ids.size).toBe(tickets.length)
  })
})
