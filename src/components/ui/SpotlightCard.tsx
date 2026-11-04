import { useState, useRef, type ReactNode, type MouseEvent } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

/**
 * SpotlightCard inspired by Aceternity UI & shadcn/ui.
 * Creates an elegant interactive radial flashlight effect that follows the user's cursor.
 * Respects system light/dark theme seamlessly.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(79, 70, 229, 0.12)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] transition-colors ${className}`}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className='pointer-events-none absolute -inset-px transition-opacity duration-300'
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
        aria-hidden='true'
      />
      <div className='relative z-10'>{children}</div>
    </div>
  )
}
