import { Link } from 'react-router'
import { Sparkles, TrendingUp, Compass, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MotionFadeIn } from '../../motion/MotionWrapper'

interface JobsHeroBannerProps {
  activeTab: 'trending' | 'analysis'
}

export default function JobsHeroBanner({ activeTab }: JobsHeroBannerProps) {
  const { t } = useTranslation()

  return (
    <MotionFadeIn className='relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-8 md:p-10 shadow-xs mb-8 transition-colors'>
      <div className='relative z-10 max-w-3xl'>
        {/* Top Badge */}
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-semibold text-indigo-700 dark:text-[#A99DFF] mb-4'>
          <Sparkles className='w-3.5 h-3.5 animate-pulse' />
          <span>{t('jobs.hero.badge')}</span>
        </div>

        {/* Heading */}
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#ECE9E4] leading-snug'>
          {t('jobs.hero.title')}{' '}
          <span className='text-indigo-600 dark:text-[#A99DFF]'>{t('jobs.hero.titleAccent')}</span>
        </h1>

        {/* Subtitle */}
        <p className='mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-[#B5B1BA] max-w-2xl'>
          {t('jobs.hero.desc')}
        </p>

        {/* Action Tabs / Switcher */}
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <Link
            to='/jobs/trending'
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'trending'
                ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <TrendingUp className='w-4 h-4' />
            <span>{t('jobs.hero.tabTrending')}</span>
          </Link>

          <Link
            to='/jobs/analysis'
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'analysis'
                ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <Compass className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
            <span>{t('jobs.hero.tabAnalysis')}</span>
            <ArrowUpRight className='w-3.5 h-3.5 opacity-80' />
          </Link>
        </div>

        {/* Quick Highlights Row */}
        <div className='mt-6 pt-5 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-600 dark:text-[#A29FA8]'>
          <div className='flex items-center gap-1.5'>
            <Zap className='w-3.5 h-3.5 text-amber-500' />
            <span>{t('jobs.hero.marketData')}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <ShieldCheck className='w-3.5 h-3.5 text-emerald-500' />
            <span>{t('jobs.hero.githubStack')}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Sparkles className='w-3.5 h-3.5 text-indigo-600 dark:text-[#A99DFF]' />
            <span>{t('jobs.hero.directConnect')}</span>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
