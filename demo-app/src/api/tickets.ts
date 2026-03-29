import { useQuery } from "@tanstack/react-query"
import type { Ticket } from "../types/ticket"

async function fetchTickets(search?: string): Promise<Ticket[]> {
  const url = search ? `/api/tickets?search=${encodeURIComponent(search)}` : "/api/tickets"
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.status}`)
  }
  return response.json()
}

async function fetchTicket(id: string): Promise<Ticket> {
  const response = await fetch(`/api/tickets/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket: ${response.status}`)
  }
  return response.json()
}

export function useTickets(search?: string) {
  return useQuery({
    queryKey: ["tickets", { search }],
    queryFn: () => fetchTickets(search),
  })
}

export function useTicket(id: string | null) {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => fetchTicket(id!),
    enabled: !!id,
  })
}
