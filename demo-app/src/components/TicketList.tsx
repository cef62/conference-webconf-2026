import { Badge, Box, Table, Text } from "@chakra-ui/react"
import { useTickets } from "../api/tickets"
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

interface TicketListProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function TicketList({ selectedId, onSelect }: TicketListProps) {
  const { data: tickets, isLoading, isError } = useTickets()

  if (isLoading) {
    return (
      <Box data-testid="ticket-list-loading" p={4}>
        <Text>Loading tickets...</Text>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box data-testid="ticket-list-error" p={4}>
        <Text color="red.500">Failed to load tickets.</Text>
      </Box>
    )
  }

  return (
    <Table.Root data-testid="ticket-list-table" size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Title</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Priority</Table.ColumnHeader>
          <Table.ColumnHeader>Created</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tickets?.map((ticket) => (
          <Table.Row
            key={ticket.id}
            data-testid={`ticket-list-row-${ticket.id}`}
            onClick={() => onSelect(ticket.id)}
            cursor="pointer"
            bg={selectedId === ticket.id ? "blue.50" : undefined}
            _hover={{ bg: selectedId === ticket.id ? "blue.50" : "gray.50" }}
          >
            <Table.Cell>{ticket.title}</Table.Cell>
            <Table.Cell>
              <Badge
                data-testid={`ticket-list-status-badge-${ticket.id}`}
                colorPalette={STATUS_COLOR[ticket.status]}
              >
                {ticket.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <Badge
                data-testid={`ticket-list-priority-badge-${ticket.id}`}
                colorPalette={PRIORITY_COLOR[ticket.priority]}
              >
                {ticket.priority}
              </Badge>
            </Table.Cell>
            <Table.Cell>{formatDate(ticket.createdAt)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
