import { Link } from 'react-router'
import { TrendingUp, Compass, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MotionFadeIn } from '../../motion/MotionWrapper'
import { AnimatedSparkles, AnimatedZap, AnimatedShieldCheck, AnimatedBriefcase } from '../../ui/AnimatedIcons'
import NumberTicker from '../../ui/NumberTicker'

interface JobsHeroBannerProps {
  activeTab: 'trending' | 'analysis'
}

const HOT_STACK = ['React 19', 'Next.js', 'Go', 'Python AI', 'Docker']

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

        {/* Right Column: Glassmorphic Live Market Radar Card (5 cols) */}
        <div className='lg:col-span-5'>
          <div className='rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.05] backdrop-blur-md p-5 sm:p-6 shadow-xs dark:shadow-xl relative overflow-hidden'>
            <div className='relative z-10 space-y-4'>
              {/* Header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5 group cursor-pointer'>
                  <div className='w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25'>
                    <AnimatedBriefcase className='w-4 h-4' />
                  </div>
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white'>
                      {t('jobs.hero.radarTitle')}
                    </h3>
                    <p className='text-[11px] text-gray-500 dark:text-gray-400'>{t('jobs.hero.radarSubtitle')}</p>
                  </div>
                </div>

                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold'>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500' />
                  </span>
                  {t('jobs.hero.radarLive')}
                </span>
              </div>

              {/* 2 Stats Cards */}
              <div className='grid grid-cols-2 gap-3 pt-1'>
                <div className='p-3.5 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] shadow-xs dark:shadow-none'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                    {t('jobs.hero.radarNewPositions')}
                  </div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-baseline gap-0.5'>
                    <NumberTicker value={2450} />
                    <span className='text-sm text-indigo-600 dark:text-[#A99DFF] font-bold'>+</span>
                  </div>
                </div>

                <div className='p-3.5 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] shadow-xs dark:shadow-none'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                    {t('jobs.hero.radarMatchRate')}
                  </div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-0.5'>
                    <NumberTicker value={94} />
                    <span className='text-xs font-bold'>%</span>
                  </div>
                </div>
              </div>

              {/* Hot Stack Pills */}
              <div className='pt-1'>
                <div className='text-[11px] font-semibold text-gray-400 dark:text-[#85808C] uppercase tracking-wider mb-2 flex items-center justify-between'>
                  <span>{t('jobs.hero.radarHotStack')}</span>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {HOT_STACK.map((tech) => (
                    <span
                      key={tech}
                      className='px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.06] border border-gray-200/60 dark:border-white/[0.06] text-xs font-medium text-gray-700 dark:text-gray-300'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className='pt-2 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400'>
                <span>{t('jobs.hero.radarDirectApi')}</span>
                <span className='font-semibold text-indigo-600 dark:text-[#A99DFF]'>ITviec · TopCV · LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
