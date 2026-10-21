import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onStartExit?: () => void
  onFinish?: () => void
}

const BRAND_NAME = ['E', 'd', 'u', 'M', 'a', 'p']
const BRAND_AI = ['A', 'I']

export default function SplashScreen({ onStartExit, onFinish }: SplashScreenProps) {
  // Phase 1 (0.0s - 1.1s): Khối hình học xoay và biến đổi (Morphing) thành Logo chính xác
  // Phase 2 (1.1s - 2.2s): Icon trượt sang trái, từng con chữ EduMap AI hiện ra
  // Phase 3 (2.2s - 3.6s): Dừng lại ở tâm màn hình để người dùng kịp đọc rõ ràng (1.4s reading pause)
  // Phase 4 (3.6s - 4.4s): Bay mượt mà lên góc trên bên trái Header & mở ra giao diện
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    // Xóa pre-splash trong index.html nếu có
    const preSplash = document.getElementById('initial-splash')
    if (preSplash) preSplash.remove()

    const t1 = setTimeout(() => setPhase(2), 1100)
    const t2 = setTimeout(() => setPhase(3), 2200)
    const t3 = setTimeout(() => {
      setPhase(4)
      onStartExit?.() // Kích hoạt hiệu ứng trang web trồi lên ngay khi phase 4 bắt đầu
    }, 3600)
    const t4 = setTimeout(() => {
      setIsFinished(true)
      onFinish?.()
    }, 4400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onStartExit, onFinish])

  const handleSkip = () => {
    onStartExit?.()
    setIsFinished(true)
    onFinish?.()
  }

  if (isFinished) return null

  return (
    <AnimatePresence>
      <motion.div
        key='splash-container'
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 4 ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleSkip}
        className='fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-[#13121D] flex items-center justify-center cursor-pointer'
      >
        {/* Vầng sáng tím huyền ảo nhẹ phía sau */}
        <div className='absolute w-[500px] h-[500px] rounded-full bg-[#5F2CFF]/15 blur-[140px] pointer-events-none' />

        {/* Khung chứa Logo & Chữ chuyển động đồng bộ */}
        <motion.div
          animate={
            phase === 4
              ? {
                  x: 'calc(-50vw + 90px)',
                  y: 'calc(-50vh + 32px)',
                  scale: 0.65,
                  opacity: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
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
          {/* ========================================================
              1. ICON LOGO CHUYỂN ĐỘNG CHUẨN (MORPHING & SLIDE)
              - Không dùng ảnh lỗi cropped border
              - Sử dụng vector chuẩn SVG favicon với hình squircle bo tròn
              - Giai đoạn 1: Khối vuông phân mảnh xoay 180°
              - Giai đoạn 2: Nở thành Logo EduMap AI hoàn chỉnh và trượt sang trái
             ======================================================== */}
          <motion.div
            initial={{ scale: 0.4, rotate: 0 }}
            animate={
              phase === 1
                ? {
                    scale: [0.4, 0.9, 1],
                    rotate: [0, 90, 180],
                    x: 0,
                    transition: {
                      duration: 1.0,
                      ease: [0.34, 1.3, 0.64, 1],
                    },
                  }
                : {
                    scale: 1,
                    rotate: 180,
                    x: -14, // Trượt sang trái tạo khoảng cách cho chữ
                    transition: {
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
            }
            className='relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#131428] border border-white/15 shadow-[0_0_25px_rgba(95,44,255,0.4)] flex items-center justify-center p-2.5 overflow-hidden shrink-0 z-20'
          >
            {/* Phân mảnh khối hình học xoay ở phase 1 */}
            {phase === 1 ? (
              <motion.div
                initial={{ opacity: 1, scale: 0.8 }}
                animate={{ rotate: 180, scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className='grid grid-cols-2 gap-1 w-full h-full p-0.5'
              >
                <div className='bg-[#5F2CFF] rounded-sm' />
                <div className='bg-white rounded-sm' />
                <div className='bg-white rounded-sm' />
                <div className='bg-[#5F2CFF] rounded-sm' />
              </motion.div>
            ) : (
              /* Vector SVG sắc nét 100%, không bị vệt mờ hay mất chữ viền */
              <motion.img
                src='/favicon.svg'
                alt='EduMap AI'
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
              />
            )}
          </motion.div>

          {/* ========================================================
              2. TỪNG CON CHỮ HIỆN RA LẦN LƯỢT (LETTER-BY-LETTER STAGGER)
              - E - d - u - M - a - p  A - I  hiển thị rõ nét, không bị che khuất
             ======================================================== */}
          {phase >= 2 && (
            <div className='pl-3.5 flex flex-col justify-center select-none'>
              {/* Tiêu đề EduMap AI */}
              <div className='flex items-baseline font-black text-3xl sm:text-4xl tracking-tight text-white leading-none'>
                {/* Chữ "EduMap" */}
                <div className='flex items-center'>
                  {BRAND_NAME.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.06,
                        ease: [0.2, 0.65, 0.3, 0.9],
                      }}
                      className='inline-block'
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                {/* Khoảng cách giữa EduMap và AI */}
                <span className='inline-block w-2' />

                {/* Chữ "AI" màu tím Indigo gradient nổi bật */}
                <div className='flex items-center bg-gradient-to-r from-[#9B87F5] via-[#C4B5FD] to-[#D4F973] bg-clip-text text-transparent'>
                  {BRAND_AI.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.45,
                        delay: 0.38 + index * 0.08,
                        ease: [0.2, 0.65, 0.3, 0.9],
                      }}
                      className='inline-block font-black drop-shadow-[0_0_15px_rgba(155,135,245,0.5)]'
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Slogan "A Roadmap for Education" */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={
                  phase === 4
                    ? { opacity: 0, y: -4, transition: { duration: 0.2 } }
                    : { opacity: 0.65, y: 0, transition: { duration: 0.6, delay: 0.65, ease: 'easeOut' } }
                }
                className='text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-300 mt-1.5'
              >
                A Roadmap for Education
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Nút Skip nhỏ tinh tế góc dưới màn hình */}
        <div className='absolute bottom-6 right-6 text-xs text-white/30 hover:text-white/70 transition-colors font-medium'>
          Nhấn bất kỳ để bỏ qua ➔
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
