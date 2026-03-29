import { beforeMount } from "@playwright/experimental-ct-react/hooks"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

beforeMount(async ({ App }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  )
})
