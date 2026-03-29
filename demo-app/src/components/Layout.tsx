import { Box, Flex, Heading } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface LayoutProps {
  left: ReactNode
  right: ReactNode
}

export function Layout({ left, right }: LayoutProps) {
  return (
    <Flex direction="column" height="100vh">
      <Box
        data-testid="layout-header"
        as="header"
        bg="blue.600"
        color="white"
        px={6}
        py={3}
      >
        <Heading size="lg">Acme Support</Heading>
      </Box>
      <Flex flex={1} overflow="hidden">
        <Box width="60%" overflowY="auto" borderRightWidth="1px">
          {left}
        </Box>
        <Box width="40%" overflowY="auto">
          {right}
        </Box>
      </Flex>
    </Flex>
  )
}
