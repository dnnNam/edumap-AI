/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'

interface SplashContextType {
  isPageRevealed: boolean
  setIsPageRevealed: (revealed: boolean) => void
}

const SplashContext = createContext<SplashContextType>({
  isPageRevealed: false,
  setIsPageRevealed: () => {},
})

export const useSplash = () => useContext(SplashContext)

export function SplashProvider({ children }: { children: ReactNode }) {
  // Nếu người dùng đã xem splash trong phiên làm việc hiện tại, hiển thị web luôn không delay
  const hasSeenSplash = typeof window !== 'undefined' && sessionStorage.getItem('edumap_splash_seen') === 'true'
  const [isPageRevealed, setIsPageRevealed] = useState(hasSeenSplash)

  return <SplashContext.Provider value={{ isPageRevealed, setIsPageRevealed }}>{children}</SplashContext.Provider>
}
