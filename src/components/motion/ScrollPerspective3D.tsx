import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ScrollPerspective3DProps {
  children: ReactNode
  className?: string
  rotateXAmount?: number
  delay?: number
}

/**
 * ScrollPerspective3D: Hiệu ứng cuộn tới có góc nhìn 3D (perspective) trượt vào tự nhiên.
 */
export default function ScrollPerspective3D({
  children,
  className = '',
  rotateXAmount = 6,
  delay = 0,
}: ScrollPerspective3DProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div style={{ perspective: 1000 }} className='w-full'>
      <motion.div
        className={className}
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: 35,
                rotateX: rotateXAmount,
                scale: 0.97,
              }
        }
        whileInView={
          shouldReduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
              }
        }
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

