import { Link } from 'react-router'
import { TrendingUp, Compass, ArrowUpRight, Cpu, Code2, Building2, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MotionFadeIn } from '../../motion/MotionWrapper'
import { AnimatedSparkles, AnimatedZap, AnimatedShieldCheck } from '../../ui/AnimatedIcons'

interface JobsHeroBannerProps {
  activeTab: 'trending' | 'analysis'
}

export default function JobsHeroBanner({ activeTab }: JobsHeroBannerProps) {
  const { t } = useTranslation()

  return (
    <MotionFadeIn className='relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#161426] p-6 sm:p-8 md:p-10 shadow-xs dark:shadow-xl mb-8 text-gray-900 dark:text-white transition-colors'>
      {/* Background Decorative Glow */}
      <div className='absolute -right-20 -top-20 w-80 h-80 bg-indigo-100/60 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none' />

      {/* Grid Pattern Overlay */}
      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]'
        aria-hidden='true'
      />

      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
        {/* Left Column: Heading & Navigation (7 cols) */}
        <div className='lg:col-span-7 space-y-4'>
          {/* Top Badge */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-white/10 border border-indigo-100 dark:border-white/10 text-xs font-semibold text-indigo-700 dark:text-white/90 backdrop-blur-md cursor-default group'>
            <AnimatedSparkles className='w-3.5 h-3.5 text-amber-500 dark:text-amber-400' />
            <span>{t('jobs.hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-snug'>
            {t('jobs.hero.title')}{' '}
            <span className='text-indigo-600 dark:text-[#A99DFF]'>{t('jobs.hero.titleAccent')}</span>
          </h1>

          {/* Subtitle */}
          <p className='text-sm sm:text-base leading-relaxed text-gray-600 dark:text-[#A29FA8] max-w-xl'>
            {t('jobs.hero.desc')}
          </p>

          {/* Action Tabs / Switcher */}
          <div className='pt-2 flex flex-wrap items-center gap-3'>
            <Link
              to='/jobs/trending'
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer group ${
                activeTab === 'trending'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-gray-100 dark:bg-white/10 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200/80 dark:hover:bg-white/15'
              }`}
            >
              <TrendingUp className='w-4 h-4 transition-transform group-hover:scale-110' />
              <span>{t('jobs.hero.tabTrending')}</span>
            </Link>

            <Link
              to='/jobs/analysis'
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer group ${
                activeTab === 'analysis'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-gray-100 dark:bg-white/10 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200/80 dark:hover:bg-white/15'
              }`}
            >
              <Compass className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF] transition-transform group-hover:rotate-45' />
              <span>{t('jobs.hero.tabAnalysis')}</span>
              <ArrowUpRight className='w-3.5 h-3.5 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </Link>
          </div>

          {/* Quick Highlights Row */}
          <div className='pt-3 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-600 dark:text-[#A29FA8]'>
            <div className='flex items-center gap-1.5 group cursor-default'>
              <AnimatedZap className='w-3.5 h-3.5 text-amber-500' />
              <span className='font-medium'>{t('jobs.hero.marketData')}</span>
            </div>

            <div className='flex items-center gap-1.5 group cursor-default'>
              <AnimatedShieldCheck className='w-3.5 h-3.5 text-emerald-500' />
              <span className='font-medium'>{t('jobs.hero.githubStack')}</span>
            </div>

            <div className='flex items-center gap-1.5 group cursor-default'>
              <AnimatedSparkles className='w-3.5 h-3.5 text-indigo-600 dark:text-[#A99DFF]' />
              <span className='font-medium'>{t('jobs.hero.directConnect')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Floating Career Match Cards with 3D Mascot (5 cols) */}
        <div className='lg:col-span-5 relative flex flex-col items-center justify-end min-h-[350px] pt-14 select-none'>
          {/* Subtle Ambient Glow Orb */}
          <div className='absolute w-72 h-72 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none' />

          {/* Layered Cards Canvas */}
          <div className='relative w-full max-w-[360px] h-[230px] flex items-center justify-center'>
            {/* CARD 2: Behind / Lower-right (Fullstack Developer - 92% Match) */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [3, 4.5, 3] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.03, rotate: 1.5, zIndex: 30 }}
              className='absolute bottom-0 right-0 w-[92%] rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white/95 dark:bg-[#1A191C]/95 backdrop-blur-xl p-4 shadow-xl dark:shadow-2xl transition-shadow cursor-pointer z-10 group'
            >
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2.5 min-w-0'>
                  {/* High-craft Code Icon */}
                  <div className='w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center shrink-0 shadow-xs'>
                    <Code2 className='w-4.5 h-4.5' />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <h4 className='text-xs font-bold text-gray-900 dark:text-white truncate'>Fullstack Developer</h4>
                      <span className='px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-[9px] font-semibold text-indigo-600 dark:text-[#A99DFF]'>
                        Hot
                      </span>
                    </div>
                    <div className='flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5'>
                      <MapPin className='w-2.5 h-2.5 text-gray-400' />
                      <span className='truncate'>Hybrid · Quận 1, TP.HCM</span>
                    </div>
                  </div>
                </div>

                {/* Match badge */}
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-[#A99DFF] text-[11px] font-black shrink-0'>
                  <AnimatedZap className='w-3 h-3 text-indigo-600 dark:text-[#A99DFF]' />
                  <span>92%</span>
                </span>
              </div>

              {/* Salary & Tech Stack */}
              <div className='mt-2.5 pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px]'>
                <span className='font-bold text-gray-900 dark:text-gray-100'>
                  $1,800 - $2,400<span className='text-[10px] font-normal text-gray-400'>/th</span>
                </span>
                <div className='flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400'>
                  <span className='inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 font-medium'>
                    <span className='w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1' />
                    React 19
                  </span>
                  <span className='inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 font-medium'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1' />
                    Node.js
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CARD 1: Front / Upper-left (Senior AI Engineer - 98% Match) */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-2, -0.5, -2] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
              className='absolute top-0 left-0 w-[95%] rounded-2xl border border-indigo-200/80 dark:border-white/15 bg-white/95 dark:bg-[#161426]/95 backdrop-blur-xl p-4 shadow-2xl dark:shadow-indigo-950/40 ring-1 ring-indigo-500/10 cursor-pointer z-20 group'
            >
              {/* 3D Mascot Character Hugging and Perched on Card 1 */}
              <div className='absolute bottom-[calc(100%-14px)] right-6 flex flex-col items-center pointer-events-none z-30'>
                {/* Mascot speech bubble */}
                <div className='mb-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/95 dark:bg-[#1A191C]/95 border border-indigo-200 dark:border-white/15 shadow-md text-[10px] font-extrabold text-indigo-700 dark:text-[#A99DFF] backdrop-blur-md animate-bounce'>
                  <AnimatedSparkles className='w-3 h-3 text-amber-500' />
                  <span>EduBot Match!</span>
                </div>

                {/* Transparent Mascot Body */}
                <div className='w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl'>
                  <img src='/edumap-mascot.png' alt='EduMap AI Mascot' className='w-full h-full object-contain' />
                </div>
              </div>

              {/* Live Scanner Banner */}
              <div className='flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-white/5 text-[10px]'>
                <span className='inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold'>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500' />
                  </span>
                  AI vừa quét & đối soát
                </span>
                <span className='text-gray-400 dark:text-gray-500'>2 phút trước</span>
              </div>

              <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-3 min-w-0'>
                  {/* High-craft Neural CPU Microchip Icon */}
                  <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center shrink-0 shadow-xs'>
                    <Cpu className='w-5 h-5' />
                  </div>
                  <div className='min-w-0'>
                    <h4 className='text-sm font-black text-gray-900 dark:text-white truncate'>Senior AI Engineer</h4>
                    <div className='flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate'>
                      <Building2 className='w-3 h-3 text-gray-400 shrink-0' />
                      <span className='truncate'>Fintech Global · Remote</span>
                    </div>
                  </div>
                </div>

                {/* Match pill 98% */}
                <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black shrink-0 shadow-xs'>
                  <AnimatedZap className='w-3 h-3 text-emerald-600 dark:text-emerald-400' />
                  <span>98% Match</span>
                </span>
              </div>

              {/* Salary & Tech Stack */}
              <div className='mt-3 flex items-center justify-between text-xs'>
                <span className='font-extrabold text-indigo-600 dark:text-[#A99DFF] text-sm'>
                  $2,500 - $3,500<span className='text-[11px] font-normal text-gray-400'>/th</span>
                </span>

                <div className='flex items-center gap-1'>
                  <span className='inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-[10px] font-medium text-gray-700 dark:text-gray-300'>
                    <span className='w-1.5 h-1.5 rounded-full bg-blue-500 mr-1' />
                    Python
                  </span>
                  <span className='inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-[10px] font-medium text-gray-700 dark:text-gray-300'>
                    <span className='w-1.5 h-1.5 rounded-full bg-amber-500 mr-1' />
                    PyTorch
                  </span>
                  <span className='inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-[10px] font-medium text-gray-700 dark:text-gray-300'>
                    <span className='w-1.5 h-1.5 rounded-full bg-purple-500 mr-1' />
                    LLM
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
