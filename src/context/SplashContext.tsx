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
  const [isPageRevealed, setIsPageRevealed] = useState(false)

  return <SplashContext.Provider value={{ isPageRevealed, setIsPageRevealed }}>{children}</SplashContext.Provider>
}
