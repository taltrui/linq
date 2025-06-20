import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"

import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from './lib/auth.js'

export const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const auth = useAuth()
  return (
    <RouterProvider router={router} context={{ auth, queryClient }} />

  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}