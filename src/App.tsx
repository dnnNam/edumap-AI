import { useState } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import './App.css'
import router from './routes/configRoutes'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import SplashScreen from './components/ui/SplashScreen'

function AppContent() {
  const { isDark } = useTheme()
  const [showSplash, setShowSplash] = useState(true)

  return (
    <SkeletonTheme baseColor={isDark ? '#1A191C' : '#f3f4f6'} highlightColor={isDark ? '#232227' : '#e5e7eb'}>
      <Toaster position='top-right' richColors theme={isDark ? 'dark' : 'light'} />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div
        className={
          showSplash
            ? 'opacity-0 pointer-events-none'
            : 'transition-all duration-700 ease-out opacity-100 transform-none'
        }
      >
        <RouterProvider router={router} />
      </div>
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
