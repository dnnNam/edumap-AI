/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Sparkles, Film, RotateCcw, Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

interface VideoDemoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
}

/**
 * Phân tích và chuyển đổi URL video thành URL nhúng (Embed) hoặc File trực tiếp
 */
function parseVideoSource(rawUrl: string): {
  type: 'youtube' | 'vimeo' | 'loom' | 'direct'
  embedUrl?: string
  directUrl?: string
} {
  const trimmed = rawUrl.trim()

  // 1. YouTube Detection
  // Hỗ trợ: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID, youtube.com/live/ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/,
  )
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    }
  }

  // 2. Vimeo Detection
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`,
    }
  }

  // 3. Loom Detection
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`,
    }
  }

  // 4. Direct video file (mp4, webm hoặc đường dẫn trên VPS Nginx)
  return {
    type: 'direct',
    directUrl: trimmed,
  }
}

export default function VideoDemoModal({ isOpen, onClose, videoUrl }: VideoDemoModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loadError, setLoadError] = useState(false)
  const [videoMounted, setVideoMounted] = useState(false)

  // URL nguồn video: ưu tiên prop -> biến môi trường VITE_DEMO_VIDEO_URL -> fallback file mặc định
  const sourceUrl = videoUrl || (import.meta.env.VITE_DEMO_VIDEO_URL as string | undefined) || '/videos/edumap-demo.mp4'

  const videoSource = parseVideoSource(sourceUrl)

  // 1. Tạm dừng các canvas 3D nền + khóa cuộn trang + lắng nghe ESC
  useEffect(() => {
    if (!isOpen) {
      setVideoMounted(false)
      document.documentElement.classList.remove('video-modal-open')
      return
    }

    setLoadError(false)
    document.documentElement.classList.add('video-modal-open')
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Trì hoãn nạp iframe (80ms) để animation mở modal chạy ở 60fps mượt tuyệt đối,
    // sau đó mới nạp iframe YouTube, không gây khựng (jank) khung hình
    const timer = setTimeout(() => {
      setVideoMounted(true)
    }, 80)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.documentElement.classList.remove('video-modal-open')
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 2. Tự động dừng phát HTML5 video khi đóng modal
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isOpen])

  const handleStartNow = () => {
    onClose()
    navigate('/register')
  }

  const handleExploreMore = () => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById('preview-card')
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 120)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 select-none'>
          {/* Lớp nền tối rạp chiếu phim siêu nhẹ (High-performance GPU backdrop, không gây lag) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={onClose}
            className='fixed inset-0 bg-black/90 backdrop-blur-xs transform-gpu will-change-opacity'
            aria-hidden='true'
          />

          {/* Khung Hộp Thoại macOS Studio Bezel với đường cong Cubic-Bezier siêu mượt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className='relative w-full max-w-4xl lg:max-w-5xl rounded-2xl sm:rounded-3xl border border-white/15 bg-[#121114] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col transform-gpu will-change-transform'
          >
            {/* macOS Top Bar: 3 nút traffic lights + Tiêu đề + Nút đóng */}
            <div className='flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#161519]'>
              <div className='flex items-center gap-2 sm:gap-2.5'>
                <button
                  type='button'
                  onClick={onClose}
                  className='w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-110 transition-transform active:scale-90 cursor-pointer'
                  title={t('home.demoModal.escHint')}
                />
                <span className='w-3 h-3 rounded-full bg-[#FFBD2E] inline-block' />
                <span className='w-3 h-3 rounded-full bg-[#27C93F] inline-block' />

                {/* Huy hiệu trung tâm */}
                <div className='hidden sm:inline-flex items-center gap-1.5 ml-3 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300'>
                  <Sparkles className='w-3 h-3 text-[#A99DFF]' />
                  <span>{t('home.demoModal.title')}</span>
                  <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1' />
                  <span className='text-[10px] text-gray-400 font-mono'>{t('home.demoModal.badge')}</span>
                </div>
              </div>

              {/* Phím tắt ESC & Nút Đóng */}
              <div className='flex items-center gap-2 sm:gap-3'>
                <span className='hidden sm:inline text-[11px] font-medium text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/10'>
                  ESC
                </span>
                <button
                  type='button'
                  onClick={onClose}
                  className='p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition active:scale-95 cursor-pointer'
                  aria-label='Close modal'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Khung Trình Chiếu Video 16:9 Tối Ưu GPU */}
            <div className='relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden'>
              {!videoMounted ? (
                /* Skeleton loader tức thì khi mở modal - giúp animation mượt 60fps */
                <div className='flex flex-col items-center justify-center gap-2.5 text-gray-400'>
                  <div className='w-7 h-7 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin' />
                  <span className='text-xs font-mono text-gray-500'>Loading player...</span>
                </div>
              ) : videoSource.type !== 'direct' && videoSource.embedUrl ? (
                /* Trường hợp 1: Nhúng Iframe (YouTube / Vimeo / Loom) */
                <iframe
                  src={videoSource.embedUrl}
                  title={t('home.demoModal.title')}
                  className='w-full h-full border-0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />
              ) : (
                /* Trường hợp 2: HTML5 Video File trực tiếp từ VPS / Nginx / public */
                <>
                  {!loadError ? (
                    <video
                      ref={videoRef}
                      src={videoSource.directUrl}
                      controls
                      autoPlay
                      playsInline
                      preload='metadata'
                      onError={() => setLoadError(true)}
                      className='w-full h-full object-contain'
                    >
                      <track kind='captions' />
                    </video>
                  ) : (
                    /* Trạng thái dự phòng thẩm mỹ khi file video chưa được đặt vào thư mục trên VPS */
                    <div className='p-6 sm:p-10 text-center max-w-md mx-auto space-y-4'>
                      <div className='w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner'>
                        <Film className='w-7 h-7' />
                      </div>
                      <div>
                        <h4 className='text-lg font-bold text-[#ECE9E4]'>{t('home.demoModal.videoError')}</h4>
                        <p className='mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed'>
                          {t('home.demoModal.videoErrorDesc')}
                        </p>
                        <div className='mt-3 inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300'>
                          src: {videoSource.directUrl}
                        </div>
                      </div>

                      <div className='pt-2 flex items-center justify-center gap-3'>
                        <button
                          type='button'
                          onClick={() => {
                            setLoadError(false)
                            if (videoRef.current) {
                              videoRef.current.load()
                              videoRef.current.play().catch(() => {})
                            }
                          }}
                          className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition cursor-pointer'
                        >
                          <RotateCcw className='w-3.5 h-3.5' />
                          <span>{t('home.demoModal.retry')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Điều Hướng Nhanh Sau Khi Xem Video */}
            <div className='p-3 sm:p-3.5 border-t border-white/10 bg-[#161519] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs'>
              <div className='flex items-center gap-2 text-gray-400 text-center sm:text-left'>
                <span className='w-2 h-2 rounded-full bg-indigo-500' />
                <span>EduMap AI · Autonomous Career Engine</span>
              </div>

              <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end'>
                <button
                  type='button'
                  onClick={handleExploreMore}
                  className='inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer'
                >
                  <Compass className='w-3.5 h-3.5 text-indigo-400' />
                  <span>{t('home.demoModal.exploreMore')}</span>
                </button>

                <button
                  type='button'
                  onClick={handleStartNow}
                  className='inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition cursor-pointer'
                >
                  <span>{t('home.demoModal.getStarted')}</span>
                  <ArrowRight className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
