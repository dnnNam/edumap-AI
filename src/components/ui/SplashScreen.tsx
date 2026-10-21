import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onFinish?: () => void
}

/**
 * SoundScape-style Hero Brand Morph & Unfold Splash Screen:
 * Phase 1 (0ms - 600ms): Geometric square at center morphs and rotates into EduMap AI icon.
 * Phase 2 (600ms - 1400ms): Icon slides left, brand name "EduMap AI" unfolds from behind it.
 * Phase 3 (1400ms - 2100ms): The whole logo flies smoothly up to the top-left header position,
 * while the dark curtain dissolves and the app content reveals from bottom up.
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // animationPhase:
  // 1 = initial morph
  // 2 = text unfold
  // 3 = fly to header & dissolve
  const [phase, setPhase] = useState<1 | 2 | 3>(1)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    // Xóa pre-splash nếu có từ index.html
    const preSplash = document.getElementById('initial-splash')
    if (preSplash) preSplash.remove()

    // Phase 1 -> 2: Mở chữ sau 650ms
    const t1 = setTimeout(() => {
      setPhase(2)
    }, 650)

    // Phase 2 -> 3: Bay lên header sau 1500ms
    const t2 = setTimeout(() => {
      setPhase(3)
    }, 1500)

    // Kết thúc hoàn toàn sau 2200ms
    const t3 = setTimeout(() => {
      setIsFinished(true)
      onFinish?.()
    }, 2200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onFinish])

  const handleSkip = () => {
    setIsFinished(true)
    onFinish?.()
  }

  if (isFinished) return null

  return (
    <AnimatePresence>
      <motion.div
        key='splash-container'
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 3 ? 0 : 1 }}
        transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleSkip}
        className='fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-[#13121D] flex items-center justify-center cursor-pointer'
      >
        {/* Ambient subtle background glow */}
        <div className='absolute w-[500px] h-[500px] rounded-full bg-[#5F2CFF]/12 blur-[140px] pointer-events-none' />

        {/* Dynamic Logo Lockup Container */}
        <motion.div
          animate={
            phase === 3
              ? {
                  // Vị trí bay lên góc trên bên trái (khớp với Header)
                  x: 'calc(-50vw + 90px)',
                  y: 'calc(-50vh + 32px)',
                  scale: 0.68,
                  opacity: 0,
                  transition: {
                    duration: 0.75,
                    ease: [0.25, 1, 0.5, 1], // cinematic bezier
                  },
                }
              : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }
          }
          className='relative flex items-center justify-center'
        >
          {/* 1. The Icon (Center Morph -> Slides Left in Phase 2) */}
          <motion.div
            initial={{ scale: 0.2, rotate: -45, borderRadius: '6px' }}
            animate={
              phase === 1
                ? {
                    scale: 1,
                    rotate: 0,
                    x: 0,
                    borderRadius: '18px',
                    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
                  }
                : {
                    scale: 1,
                    rotate: 0,
                    x: -8, // trượt nhẹ sang trái tạo khoảng cách cho tên thương hiệu
                    borderRadius: '18px',
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  }
            }
            className='relative w-14 h-14 sm:w-16 sm:h-16 bg-[#1D1B2C] border border-white/20 shadow-2xl flex items-center justify-center p-2.5 overflow-hidden shrink-0 z-20'
          >
            {/* Phân mảnh hình học trắng biến thành icon như trong clip */}
            <motion.img
              src='/edumap-icon.png'
              alt='EduMap'
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className='w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(155,135,245,0.7)]'
            />
          </motion.div>

          {/* 2. The Brand Name (Horizontal Unfold from Behind Icon) */}
          <motion.div
            initial={{ width: 0, opacity: 0, x: -25 }}
            animate={
              phase >= 2
                ? {
                    width: 'auto',
                    opacity: 1,
                    x: 10,
                    transition: {
                      width: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.4, delay: 0.1 },
                      x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                  }
                : {
                    width: 0,
                    opacity: 0,
                    x: -25,
                  }
            }
            className='overflow-hidden whitespace-nowrap flex flex-col justify-center'
          >
            <div className='flex items-baseline gap-1 font-black text-3xl sm:text-4xl tracking-tight text-white'>
              <span>EduMap</span>
              <span className='bg-gradient-to-r from-[#9B87F5] to-[#D4F973] bg-clip-text text-transparent'>AI</span>
            </div>
            <motion.span
              initial={{ opacity: 0, y: 3 }}
              animate={phase >= 2 ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 3 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className='text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-gray-300'
            >
              A Roadmap for Education
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Nút Skip nhỏ tinh tế góc dưới màn hình */}
        <div className='absolute bottom-6 right-6 text-xs text-white/30 hover:text-white/70 transition-colors font-medium'>
          Nhấp để bỏ qua ➔
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
