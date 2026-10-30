import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Sparkles, ArrowRight, GitBranch, Briefcase, Zap, ShieldCheck } from 'lucide-react'
import { MotionFadeIn } from '../../motion/MotionWrapper'

interface DashboardHeroBannerProps {
  fullName?: string
  totalSkills?: number
  totalHours?: number
}

export default function DashboardHeroBanner({ fullName, totalSkills = 0, totalHours = 0 }: DashboardHeroBannerProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <MotionFadeIn className='relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#13121A] p-6 sm:p-8 md:p-10 shadow-xl mb-8 text-white transition-colors'>
      {/* Background Decorative Glow */}
      <div className='absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none' />

      {/* Grid Pattern Overlay */}
      <div
        className='absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]'
        aria-hidden='true'
      />

      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
        {/* Left Column: Greeting & Actions (Col 7) */}
        <div className='lg:col-span-7 space-y-4'>
          {/* Top Pill Badge */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/90 backdrop-blur-md'>
            <Sparkles className='w-3.5 h-3.5 text-amber-400' />
            <span>{t('dashboard.banner.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight'>
            {t('dashboard.banner.heading')}{' '}
            <span className='text-indigo-400 dark:text-[#A99DFF]'>
              {fullName || t('dashboard.banner.defaultName')}! 👋
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-sm sm:text-[15px] leading-relaxed text-gray-400 dark:text-[#A29FA8] max-w-xl'>
            {t('dashboard.banner.description')}
          </p>

          {/* Action Buttons */}
          <div className='pt-2 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={() => navigate('/skill-tree')}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 active:scale-[0.98] transition cursor-pointer'
            >
              <GitBranch className='w-4 h-4' />
              <span>{t('dashboard.banner.viewTree')}</span>
              <ArrowRight className='w-4 h-4' />
            </button>

            <button
              type='button'
              onClick={() => navigate('/jobs/trending')}
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm font-medium active:scale-[0.98] transition cursor-pointer backdrop-blur-sm'
            >
              <Briefcase className='w-4 h-4 text-white/80' />
              <span>{t('dashboard.banner.exploreJobs')}</span>
            </button>

            <button
              type='button'
              onClick={() => navigate('/upload')}
              className='inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white transition cursor-pointer'
            >
              <Zap className='w-3.5 h-3.5' />
              <span>{t('dashboard.runAnalysis')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Mini Interactive Glassmorphic Radar Card (Col 5) */}
        <div className='lg:col-span-5'>
          <div className='rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 sm:p-6 shadow-xl relative overflow-hidden'>
            <div className='relative z-10 space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5'>
                  <div className='w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30'>
                    <Zap className='w-4 h-4' />
                  </div>
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-wider text-white'>
                      {t('dashboard.banner.overview')}
                    </h3>
                    <p className='text-[11px] text-gray-400'>{t('dashboard.banner.realtime')}</p>
                  </div>
                </div>

                <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold'>
                  <ShieldCheck className='w-3 h-3' />
                  {t('dashboard.banner.active')}
                </span>
              </div>

              {/* Progress Summary Cards */}
              <div className='grid grid-cols-2 gap-3 pt-1'>
                <div className='p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]'>
                  <div className='text-xs text-gray-400'>{t('dashboard.banner.skillsUnlocked')}</div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-white'>
                    {totalSkills}{' '}
                    <span className='text-xs font-normal text-gray-400'>{t('dashboard.banner.skillsUnit')}</span>
                  </div>
                </div>

                <div className='p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]'>
                  <div className='text-xs text-gray-400'>{t('dashboard.banner.learningTime')}</div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-white'>
                    {totalHours}{' '}
                    <span className='text-xs font-normal text-gray-400'>{t('dashboard.banner.hours')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Tip inside card */}
              <div className='pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400'>
                <span>{t('dashboard.banner.standard')}</span>
                <span className='font-semibold text-indigo-400 dark:text-[#A99DFF]'>
                  {t('dashboard.banner.advisor')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
