import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { initTheme } from './store/themeStore'
import GlobalLoader from './components/ui/GlobalLoader'
import router from './router'
import './index.css'

// Apply stored/OS theme before first paint — prevents flash of wrong theme
initTheme()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalLoader />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
