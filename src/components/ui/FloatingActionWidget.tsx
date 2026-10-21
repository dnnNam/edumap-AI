import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { ChevronUp, Headphones, X, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function FloatingActionWidget() {
  const navigate = useNavigate()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showMascot, setShowMascot] = useState(true)

  // Theo dõi vị trí cuộn trang để hiện/ẩn nút Lên đầu
  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra cả window lẫn main scroll container
      const mainEl = document.querySelector('main')
      const scrollTop = mainEl ? mainEl.scrollTop : window.scrollY
      if (scrollTop > 200) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    const mainEl = document.querySelector('main')
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (mainEl) mainEl.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Cuộn mượt mà lên đỉnh
  const scrollToTop = useCallback(() => {
    const mainEl = document.querySelector('main')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleContactClick = () => {
    navigate('/ai-advisor')
  }

  return (
    <aside
      aria-label='Hành động nhanh'
      className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-none select-none print:hidden'
    >
      {/* 1. Sticker Mascot nổi bật (có thể bấm X để tắt) */}
      <AnimatePresence>
        {showMascot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className='pointer-events-auto relative group'
          >
            {/* Nút đóng X nhỏ gọn */}
            <button
              type='button'
              onClick={() => setShowMascot(false)}
              aria-label='Đóng gợi ý trợ lý ảo'
              className='absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-gray-900/80 hover:bg-red-500 text-white flex items-center justify-center text-xs shadow-md transition cursor-pointer'
            >
              <X className='w-3 h-3' />
            </button>

            {/* Khối Mascot sinh động */}
            <div
              onClick={handleContactClick}
              className='cursor-pointer flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-200 border border-white/20'
            >
              <div className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 animate-bounce'>
                <Sparkles className='w-4 h-4 text-amber-300' />
              </div>
              <div className='flex flex-col text-left pr-1'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-amber-200'>AI Advisor</span>
                <span className='text-xs font-extrabold leading-tight'>Khám phá Job ngay!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Nút "Lên đầu" (Back to Top) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            type='button'
            onClick={scrollToTop}
            aria-label='Cuộn lên đầu trang'
            className='pointer-events-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold shadow-lg shadow-black/20 hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer border border-white/10 dark:border-black/10'
          >
            <span>Lên đầu</span>
            <ChevronUp className='w-4 h-4 stroke-[2.5]' />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 3. Nút "Hỏi AI / Liên hệ" */}
      <button
        type='button'
        onClick={handleContactClick}
        aria-label='Tư vấn cùng AI Advisor'
        className='pointer-events-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer border border-white/20'
      >
        <span>Hỏi AI Advisor</span>
        <Headphones className='w-4 h-4' />
      </button>
    </aside>
  )
}
