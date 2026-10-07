import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Floating3DProps {
  children: ReactNode
  className?: string
  duration?: number
  distance?: number
  delay?: number
}

/**
 * Floating3D: Hiệu ứng bay bổng đa chiều nhẹ nhàng (levitation) tạo chiều sâu 3D sống động.
 */
export default function Floating3D({
  children,
  className = '',
  duration = 4,
  distance = 10,
  delay = 0,
}: Floating3DProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
        rotateZ: [-1, 1, -1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

