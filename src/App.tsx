import { useState } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { motion } from 'framer-motion'
import './App.css'
import router from './routes/configRoutes'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { SplashProvider, useSplash } from './context/SplashContext'
import SplashScreen from './components/ui/SplashScreen'

function AppContent() {
  const { isDark } = useTheme()
  const { isPageRevealed, setIsPageRevealed } = useSplash()

  // Kiểm tra session: Chỉ hiển thị splash một lần trong phiên truy cập (Session)
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('edumap_splash_seen') !== 'true'
  })

  const handleStartExit = () => {
    setIsPageRevealed(true)
    sessionStorage.setItem('edumap_splash_seen', 'true')
  }

  const handleFinish = () => {
    setShowSplash(false)
    sessionStorage.setItem('edumap_splash_seen', 'true')
  }

  return (
    <SkeletonTheme baseColor={isDark ? '#1A191C' : '#f3f4f6'} highlightColor={isDark ? '#232227' : '#e5e7eb'}>
      <Toaster position='top-right' richColors theme={isDark ? 'dark' : 'light'} />
      {showSplash && <SplashScreen onStartExit={handleStartExit} onFinish={handleFinish} />}
      <motion.div
        animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className='h-full w-full'
      >
        <RouterProvider router={router} />
      </motion.div>
    </SkeletonTheme>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SplashProvider>
        <AppContent />
      </SplashProvider>
    </ThemeProvider>
  )
}

export default App
