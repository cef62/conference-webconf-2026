import { http, HttpResponse } from "msw"
import { tickets } from "./data"

export const handlers = [
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

  http.get("/api/tickets/:id", ({ params }) => {
    const ticket = tickets.find((t) => t.id === params.id)
    if (!ticket) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(ticket)
  }),
]
