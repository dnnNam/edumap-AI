import { useTranslation } from 'react-i18next'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Coverflow3DProps {
  items: ReactNode[]
  className?: string
  initialIndex?: number
}

/**
 * Coverflow3D: Trình xem thẻ 3D vuốt chuyển động Coverflow.
 * Hỗ trợ vuốt chạm (touch swipe), kéo chuột (drag) và nút bấm điều hướng.
 */
export default function Coverflow3D({ items, className = '', initialIndex = 0 }: Coverflow3DProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const shouldReduceMotion = useReducedMotion()

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    // Ngưỡng vuốt ngang 40px
    if (info.offset.x < -40) {
      handleNext()
    } else if (info.offset.x > 40) {
      handlePrev()
    }
  }

  return (
    <div className={`relative w-full overflow-hidden py-8 select-none ${className}`}>
      {/* Khung 3D Viewport */}
      <div
        className='relative w-full max-w-4xl mx-auto h-[380px] sm:h-[400px] flex items-center justify-center'
        style={{ perspective: 1200 }}
      >
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((item, index) => {
            // Tính toán khoảng cách vị trí tương đối so với thẻ hiện tại
            let offset = index - currentIndex
            if (offset < -Math.floor(items.length / 2)) offset += items.length
            if (offset > Math.floor(items.length / 2)) offset -= items.length

            // Chỉ render tối đa 3 thẻ: hiện tại, liền trước, liền sau để tối ưu 60fps
            if (Math.abs(offset) > 1) return null

            const isCenter = offset === 0
            const zIndex = isCenter ? 20 : 10 - Math.abs(offset)

            return (
              <motion.div
                key={index}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index)
                }}
                className='absolute w-[86%] sm:w-[420px] cursor-grab active:cursor-grabbing will-change-transform'
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        x: offset * 260,
                        rotateY: offset * -28,
                        scale: isCenter ? 1 : 0.85,
                        z: isCenter ? 0 : -120,
                        opacity: 0,
                      }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        x: offset * 260,
                        rotateY: offset * -28,
                        scale: isCenter ? 1 : 0.86,
                        z: isCenter ? 0 : -120,
                        opacity: isCenter ? 1 : 0.55,
                      }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.7,
                      }
                }
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 28,
                }}
              >
                <div
                  className={`rounded-2xl transition-shadow duration-300 ${
                    isCenter ? 'shadow-2xl ring-1 ring-gray-200' : 'shadow-md filter blur-[0.3px]'
                  }`}
                >
                  {item}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Điều khiển: Nút lướt và thanh chấm tròn indicator */}
      <div className='mt-4 flex items-center justify-center gap-4'>
        <button
          type='button'
          onClick={handlePrev}
          aria-label={t('common.previousSlide')}
          className='w-10 h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:scale-105 active:scale-95 transition cursor-pointer'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>

        <div className='flex items-center gap-2'>
          {items.map((_, idx) => (
            <button
              key={idx}
              type='button'
              onClick={() => setCurrentIndex(idx)}
              aria-label={t('common.goToSlide', { n: idx + 1 })}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-indigo-600' : 'w-2.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={handleNext}
          aria-label={t('common.nextSlide')}
          className='w-10 h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:scale-105 active:scale-95 transition cursor-pointer'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>
    </div>
  )
}
