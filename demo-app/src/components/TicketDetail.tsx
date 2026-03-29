import { Badge, Box, Card, Heading, Stack, Text } from "@chakra-ui/react"
import { useTicket } from "../api/tickets"
import type { Ticket } from "../types/ticket"

const STATUS_COLOR: Record<Ticket["status"], string> = {
  open: "blue",
  "in-progress": "yellow",
  resolved: "green",
}

const PRIORITY_COLOR: Record<Ticket["priority"], string> = {
  low: "gray",
  medium: "orange",
  high: "red",
}

interface TicketDetailProps {
  ticketId: string | null
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function TicketDetail({ ticketId }: TicketDetailProps) {
  const { data: ticket, isLoading, isError } = useTicket(ticketId)

  if (!ticketId) {
    return (
      <Box
        data-testid="ticket-detail-panel"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        p={6}
      >
        <Text data-testid="ticket-detail-empty" color="gray.500" fontSize="lg">
          Select a ticket to view details
        </Text>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box data-testid="ticket-detail-panel" p={6}>
        <Text data-testid="ticket-detail-loading">Loading ticket...</Text>
      </Box>
    )
  }

  if (isError || !ticket) {
    return (
      <Box data-testid="ticket-detail-panel" p={6}>
        <Text data-testid="ticket-detail-error" color="red.500">
          Failed to load ticket.
        </Text>
      </Box>
    )
  }

  return (
    <Box data-testid="ticket-detail-panel" p={6}>
      <Card.Root>
        <Card.Body>
          <Stack gap={4}>
            <Heading data-testid="ticket-detail-title" size="md">
              {ticket.title}
            </Heading>
            <Stack direction="row" gap={2}>
              <Badge
                data-testid="ticket-detail-status-badge"
                colorPalette={STATUS_COLOR[ticket.status]}
              >
                {ticket.status}
              </Badge>
              <Badge
                data-testid="ticket-detail-priority-badge"
                colorPalette={PRIORITY_COLOR[ticket.priority]}
              >
                {ticket.priority}
              </Badge>
            </Stack>
            <Text data-testid="ticket-detail-assignee">
              <Text as="span" fontWeight="bold">Assignee:</Text> {ticket.assignee}
            </Text>
            <Text data-testid="ticket-detail-description">
              {ticket.description}
            </Text>
            <Stack direction="row" gap={4} fontSize="sm" color="gray.500">
              <Text data-testid="ticket-detail-created">
                Created: {formatDateTime(ticket.createdAt)}
              </Text>
              <Text data-testid="ticket-detail-updated">
                Updated: {formatDateTime(ticket.updatedAt)}
              </Text>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}
