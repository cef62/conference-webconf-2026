import { useQuery } from "@tanstack/react-query"
import type { Ticket } from "../types/ticket"

async function fetchTickets(): Promise<Ticket[]> {
  const response = await fetch("/api/tickets")
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

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  })
}

export function useTicket(id: string | null) {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => fetchTicket(id!),
    enabled: !!id,
  })
}
