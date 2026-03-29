import { useState } from "react"
import { Box } from "@chakra-ui/react"
import { Layout } from "./components/Layout"
import { TicketList } from "./components/TicketList"
import { TicketDetail } from "./components/TicketDetail"
import { SearchFilter } from "./components/SearchFilter"

export function App() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Layout
      left={
        <>
          <Box p={4} borderBottomWidth="1px">
            <SearchFilter onSearch={setSearchQuery} />
          </Box>
          <TicketList
            selectedId={selectedTicketId}
            onSelect={setSelectedTicketId}
            searchQuery={searchQuery}
          />
        </>
      }
      right={<TicketDetail ticketId={selectedTicketId} />}
    />
  )
}
