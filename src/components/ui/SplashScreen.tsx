import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SplashScreenProps {
  onFinish?: () => void
  duration?: number // ms
}

export default function SplashScreen({ onFinish, duration = 1400 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Xóa thẻ pre-splash trong index.html nếu có
    const initialSplash = document.getElementById('initial-splash')
    if (initialSplash) {
      initialSplash.remove()
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(currentProgress)

      if (elapsed >= duration) {
        clearInterval(interval)
        setTimeout(() => {
          onFinish?.()
        }, 150)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [duration, onFinish])

  return (
    <motion.div
      key='edumap-splash'
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: 'blur(10px)',
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      className='fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0C0A14] text-white overflow-hidden select-none'
    >
      {/* 1. Ambient High-Tech Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#5F2CFF]/40 to-[#9B87F5]/30 blur-[120px] pointer-events-none'
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full bg-[#D4F973]/15 blur-[100px] pointer-events-none'
      />

      {/* Grid Pattern chìm tinh tế */}
      <div
        className='absolute inset-0 pointer-events-none opacity-20'
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 2. Logo Container with Neon Pulse Ring */}
      <div className='relative flex flex-col items-center z-10'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className='relative mb-6'
        >
          {/* Neon Glow Outer Ring */}
          <div className='absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#5F2CFF] to-[#D4F973] opacity-30 blur-xl animate-pulse' />

          {/* Logo Frame */}
          <div className='relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-0.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-2xl backdrop-blur-md'>
            <div className='w-full h-full rounded-[22px] bg-[#161322] flex items-center justify-center p-3.5 border border-white/10 shadow-inner overflow-hidden'>
              <img
                src='/edumap-icon.png'
                alt='EduMap AI Logo'
                className='w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(95,44,255,0.6)]'
              />
            </div>
          </div>
        </motion.div>

        {/* 3. Brand Name & Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-center'
        >
          <div className='flex items-center justify-center gap-2 mb-1.5'>
            <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-1.5'>
              <span>EduMap</span>
              <span className='bg-gradient-to-r from-[#9B87F5] via-[#C4B5FD] to-[#D4F973] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(155,135,245,0.4)]'>
                AI
              </span>
            </h1>
          </div>

          <p className='text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/50 drop-shadow-sm'>
            A Roadmap for Education
          </p>
        </motion.div>

        {/* 4. High-Tech Laser Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className='mt-8 flex flex-col items-center w-56 sm:w-64'
        >
          {/* Laser Track */}
          <div className='w-full h-1.5 rounded-full bg-white/[0.08] p-0.5 border border-white/10 overflow-hidden relative shadow-inner'>
            <motion.div
              className='h-full rounded-full bg-gradient-to-r from-[#5F2CFF] via-[#9B87F5] to-[#D4F973] shadow-[0_0_12px_#5F2CFF]'
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Micro Status Label */}
          <div className='mt-3 flex items-center justify-between w-full text-[11px] font-mono tracking-wider text-white/40'>
            <span className='flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-[#D4F973] animate-ping' />
              <span>KHỞI TẠO HỆ THỐNG</span>
            </span>
            <span className='font-bold text-white/70'>{progress}%</span>
          </div>
        </motion.div>
      </div>

      {/* 5. Footer Copyright & Engine Label */}
      <div className='absolute bottom-6 text-[10px] tracking-widest uppercase text-white/30 font-medium font-mono'>
        EduMap AI Engine • Personalized Learning
      </div>
    </motion.div>
  )
}
