import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import StatCard from '../ui/StatCard'

interface LayeredStatDeckProps {
  className?: string
}

/**
 * LayeredStatDeck: Hiển thị 3 StatCard theo dạng xếp tầng lệch nhau như bộ bài (Layered Depth Panel)
 * - Desktop: Hover thì các tầng tách nhẹ theo trục Z (translateZ) và xòe ra mượt mà
 * - Mobile: Thu gọn thành bố cục bình thường, không hiệu ứng tách tầng
 */
export default function LayeredStatDeck({ className = '' }: LayeredStatDeckProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const stats = [
    { value: '47/120', label: 'Skill Map' },
    { value: '87', label: 'Career Score' },
    { value: '94%', label: 'Job Match' },
  ]

  if (isMobile) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {stats.map((s) => (
          <StatCard key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={`grid grid-cols-3 gap-4 transition-all duration-300 ${className}`}
    >
      {stats.map((s, idx) => {
        return (
          <motion.div
            key={s.label}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotateZ: isHovered ? 0 : (idx - 1) * 2.5,
                    z: isHovered ? 26 : (idx === 1 ? 16 : 0),
                    scale: isHovered ? 1.02 : 1,
                  }
            }
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 25,
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
            className='will-change-transform'
          >
            <StatCard value={s.value} label={s.label} />
          </motion.div>
        )
      })}
    </div>
  )
}

