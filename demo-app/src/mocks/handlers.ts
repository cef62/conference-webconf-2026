import { http, HttpResponse } from "msw"
import { tickets } from "./data"

export const handlers = [
  http.get("/api/tickets", () => {
    return HttpResponse.json(tickets)
  }),

  http.get("/api/tickets/:id", ({ params }) => {
    const ticket = tickets.find((t) => t.id === params.id)
    if (!ticket) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(ticket)
  }),
]
