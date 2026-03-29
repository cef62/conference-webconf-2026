import { useState } from "react"
import { Layout } from "./components/Layout"
import { TicketList } from "./components/TicketList"
import { TicketDetail } from "./components/TicketDetail"

export function App() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  return (
    <Layout
      left={
        <TicketList
          selectedId={selectedTicketId}
          onSelect={setSelectedTicketId}
        />
      }
      right={<TicketDetail ticketId={selectedTicketId} />}
    />
  )
}
