import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onFinish?: () => void
}

const BRAND_LETTERS = ['E', 'd', 'u', 'M', 'a', 'p']
const AI_LETTERS = ['A', 'I']

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // 1: Khối vuông xoay và biến đổi (Morphing)
  // 2: Icon trượt sang trái & từng con chữ hiện ra lần lượt (Letter-by-letter reveal)
  // 3: Dừng lại ở tâm màn hình để người dùng kịp đọc rõ ràng (Reading pause)
  // 4: Bay mượt mà lên góc trên bên trái Header & mở ra giao diện web
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    // Xóa pre-splash trong index.html nếu có
    const preSplash = document.getElementById('initial-splash')
    if (preSplash) preSplash.remove()

    // 0.0s - 1.1s: Xoay & Morphing khối hình học thành logo
    const t1 = setTimeout(() => {
      setPhase(2) // Bắt đầu trượt trái và chữ xuất hiện từng ký tự
    }, 1100)

    // 1.1s - 2.2s: Chữ hiện xong, chuyển sang phase đọc (giữ nguyên cho người dùng đọc)
    const t2 = setTimeout(() => {
      setPhase(3)
    }, 2200)

    // 3.5s: Bay lên Header
    const t3 = setTimeout(() => {
      setPhase(4)
    }, 3500)

    // 4.3s: Kết thúc hoàn tất và mở trang web
    const t4 = setTimeout(() => {
      setIsFinished(true)
      onFinish?.()
    }, 4300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
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
        animate={{ opacity: phase === 4 ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleSkip}
        className='fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-[#13121D] flex items-center justify-center cursor-pointer'
      >
        {/* Vầng sáng tím huyền ảo nhẹ phía sau */}
        <div className='absolute w-[500px] h-[500px] rounded-full bg-[#5F2CFF]/12 blur-[140px] pointer-events-none' />

        {/* Khung chứa Logo & Chữ chuyển động đồng bộ */}
        <motion.div
          animate={
            phase === 4
              ? {
                  x: 'calc(-50vw + 95px)',
                  y: 'calc(-50vh + 32px)',
                  scale: 0.68,
                  opacity: 0,
                  transition: {
                    duration: 0.85,
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
              1. LOGO ICON CHUYỂN ĐỘNG THEO VIDEO (MORPHING & SLIDE)
              - Ban đầu là khối vuông trắng ở tâm xoay 90 độ
              - Tách hình học (checkerboard / aperture)
              - Nở thành logo EduMap AI hoàn chỉnh
              - Sau đó trượt êm sang trái để nhường chỗ cho chữ
             ======================================================== */}
          <motion.div
            initial={{ scale: 0.4, rotate: 0, borderRadius: '4px' }}
            animate={
              phase === 1
                ? {
                    scale: [0.4, 0.9, 1],
                    rotate: [0, 90, 180],
                    x: 0,
                    borderRadius: ['4px', '8px', '18px'],
                    transition: {
                      duration: 1.0,
                      ease: [0.34, 1.3, 0.64, 1],
                    },
                  }
                : {
                    scale: 1,
                    rotate: 180,
                    x: -12, // Trượt sang trái
                    borderRadius: '18px',
                    transition: {
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
            }
            className='relative w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-[#1E1B2E] border border-white/20 shadow-2xl flex items-center justify-center p-2.5 overflow-hidden shrink-0 z-20'
          >
            {/* Hiệu ứng phân mảnh ô vuông chuyển động bên trong ở 0.5s đầu */}
            {phase === 1 ? (
              <motion.div
                initial={{ opacity: 1, scale: 0.8 }}
                animate={{ rotate: 180, scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className='grid grid-cols-2 gap-1 w-full h-full p-0.5'
              >
                <div className='bg-[#5F2CFF] rounded-sm' />
                <div className='bg-white/90 rounded-sm' />
                <div className='bg-white/90 rounded-sm' />
                <div className='bg-[#5F2CFF] rounded-sm' />
              </motion.div>
            ) : (
              <motion.img
                src='/edumap-icon.png'
                alt='EduMap Icon'
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(95,44,255,0.7)]'
              />
            )}
          </motion.div>

          {/* ========================================================
              2. TỪNG CON CHỮ HIỆN RA LẦN LƯỢT (LETTER-BY-LETTER STAGGER)
              - Từng ký tự E-d-u-M-a-p A-I trượt lên mượt mà theo nhịp
              - Slogan "A Roadmap for Education" mở dần bên dưới
             ======================================================== */}
          {phase >= 2 && (
            <div className='overflow-hidden pl-3.5 flex flex-col justify-center select-none'>
              {/* Tiêu đề EduMap AI xuất hiện từng chữ cái */}
              <div className='flex items-baseline font-black text-3xl sm:text-4xl tracking-tight text-white'>
                {/* Chữ "EduMap" */}
                <div className='flex items-center overflow-hidden'>
                  {BRAND_LETTERS.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 35, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06, // Chạy lần lượt từng chữ cái với độ trễ 60ms
                        ease: [0.2, 0.65, 0.3, 0.9],
                      }}
                      className='inline-block'
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                {/* Khoảng cách */}
                <span className='inline-block w-1.5' />

                {/* Chữ "AI" màu gradient neon nổi bật */}
                <div className='flex items-center overflow-hidden bg-gradient-to-r from-[#9B87F5] via-[#C4B5FD] to-[#D4F973] bg-clip-text text-transparent'>
                  {AI_LETTERS.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 35, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.5,
                        delay: 0.36 + index * 0.08,
                        ease: [0.2, 0.65, 0.3, 0.9],
                      }}
                      className='inline-block font-black drop-shadow-[0_0_15px_rgba(155,135,245,0.4)]'
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Slogan "A Roadmap for Education" xuất hiện êm sau khi tên đã hiện xong */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.65, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.65, // Xuất hiện sau khi chữ AI xong
                  ease: 'easeOut',
                }}
                className='text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-300 mt-0.5'
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
