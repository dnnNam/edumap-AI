import { Link } from 'react-router'
import { TrendingUp, Compass, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MotionFadeIn } from '../../motion/MotionWrapper'
import { AnimatedSparkles, AnimatedZap, AnimatedShieldCheck, AnimatedBriefcase } from '../../ui/AnimatedIcons'
import NumberTicker from '../../ui/NumberTicker'

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

        {/* Right Column: 3D Career Matching Illustration with Floating Glass Badges (5 cols) */}
        <div className='lg:col-span-5 flex items-center justify-center relative'>
          {/* Subtle Ambient Light Orb behind 3D art */}
          <div className='absolute w-64 h-64 bg-indigo-500/20 dark:bg-indigo-500/25 rounded-full blur-3xl pointer-events-none' />

          {/* 3D Illustration Frame with subtle float animation */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className='relative w-full max-w-[380px] rounded-3xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-lg dark:shadow-2xl bg-gradient-to-b from-indigo-50/40 to-white/60 dark:from-white/[0.04] dark:to-white/[0.01] backdrop-blur-sm group'
          >
            <img
              src='/career-hero.jpg'
              alt='EduMap AI Career Matching'
              className='w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out'
              loading='lazy'
            />

            {/* Floating Glass Pill 1: Top Right (Live Feed & Jobs count) */}
            <div className='absolute top-3.5 right-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#161426]/90 border border-gray-200/80 dark:border-white/15 shadow-md backdrop-blur-md text-[11px] font-bold text-gray-900 dark:text-white'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
                <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500' />
              </span>
              <span>
                <NumberTicker value={2450} />+ Vị trí mới
              </span>
            </div>

            {/* Floating Glass Pill 2: Bottom Left (Match Rate) */}
            <div className='absolute bottom-3.5 left-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#161426]/90 border border-emerald-200/80 dark:border-emerald-500/20 shadow-md backdrop-blur-md text-[11px] font-bold text-emerald-700 dark:text-emerald-400'>
              <AnimatedBriefcase className='w-3.5 h-3.5 text-indigo-600 dark:text-[#A99DFF]' />
              <span>
                Khớp <NumberTicker value={94} />% Tech Stack
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
