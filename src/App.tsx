import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import './App.css'
import router from './routes/configRoutes'
import { ThemeProvider, useTheme } from './context/ThemeContext'

function AppContent() {
  const { isDark } = useTheme()

  return (
    <SkeletonTheme
      baseColor={isDark ? '#1A191C' : '#f3f4f6'}
      highlightColor={isDark ? '#232227' : '#e5e7eb'}
    >
      <Toaster position='top-right' richColors theme={isDark ? 'dark' : 'light'} />
      <RouterProvider router={router} />
    </SkeletonTheme>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
