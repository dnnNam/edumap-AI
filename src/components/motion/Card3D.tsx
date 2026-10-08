import { useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Card3DProps {
  children: ReactNode
  className?: string
  maxTilt?: number // degrees
  scale?: number
  glare?: boolean
  onClick?: () => void
}

/**
 * Card3D: Hiệu ứng nghiêng 3D (tilt) theo tọa độ chuột và ánh sáng quét (glare).
 * Tự động tắt khi người dùng bật prefers-reduced-motion.
 */
export default function Card3D({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  onClick,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const shouldReduceMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Tính toán góc nghiêng rotateX (theo chiều dọc) và rotateY (theo chiều ngang)
    const rotX = -((y - centerY) / centerY) * maxTilt
    const rotY = ((x - centerX) / centerX) * maxTilt

    setRotateX(rotX)
    setRotateY(rotY)

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.15,
      })
    }
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={
        shouldReduceMotion
          ? {}
          : {
              rotateX,
              rotateY,
              scale: rotateX !== 0 || rotateY !== 0 ? scale : 1,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* Nội dung bên trong card */}
      <div style={{ transform: 'translateZ(20px)' }} className='w-full h-full'>
        {children}
      </div>

      {/* Ánh sáng 3D Glare lướt theo chuột (tinh tế hơn trên Dark Mode) */}
      {glare && !shouldReduceMotion && (
        <div
          className='pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 dark:opacity-40'
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 250px at ${glarePos.x}% ${glarePos.y}%, var(--card-glare, rgba(255,255,255,0.8)), transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  )
}
