import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { createBrowserRouter, RouterProvider } from "react-router"
import { App } from "./App"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
])

async function start() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser")
    await worker.start({ onUnhandledRequest: "bypass" })
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ChakraProvider>
    </StrictMode>
  )
}

start()
