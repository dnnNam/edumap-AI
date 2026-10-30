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
    <MotionFadeIn className='relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-8 md:p-10 shadow-xs mb-8 transition-colors'>
      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
        {/* Left Column: Greeting & Actions (Col 7) */}
        <div className='lg:col-span-7 space-y-4'>
          {/* Top Pill Badge */}
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-semibold text-indigo-700 dark:text-[#A99DFF]'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>{t('dashboard.banner.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#ECE9E4] leading-tight'>
            {t('dashboard.banner.heading')}
            <span className='text-indigo-600 dark:text-[#A99DFF]'>{fullName || t('common.guest')}!</span>
          </h1>

          {/* Subtitle */}
          <p className='text-sm sm:text-[15px] leading-relaxed text-gray-600 dark:text-[#B5B1BA] max-w-xl'>
            {t('dashboard.banner.description')}
          </p>

          {/* Action Buttons */}
          <div className='pt-2 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={() => navigate('/skill-tree')}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition cursor-pointer'
            >
              <GitBranch className='w-4 h-4' />
              <span>{t('dashboard.banner.viewTree')}</span>
              <ArrowRight className='w-4 h-4' />
            </button>

            <button
              type='button'
              onClick={() => navigate('/jobs/trending')}
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] text-xs sm:text-sm font-medium transition cursor-pointer'
            >
              <Briefcase className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
              <span>{t('dashboard.banner.exploreJobs')}</span>
            </button>

            <button
              type='button'
              onClick={() => navigate('/upload')}
              className='inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs text-indigo-600 dark:text-[#A99DFF] hover:underline transition cursor-pointer font-medium'
            >
              <Zap className='w-3.5 h-3.5' />
              <span>{t('dashboard.runAnalysis')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Mini Metric Summary Box (Col 5) */}
        <div className='lg:col-span-5'>
          <div className='rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/70 dark:bg-[#232227] p-5 sm:p-6 shadow-xs relative'>
            <div className='relative z-10 space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5'>
                  <div className='w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs'>
                    <Zap className='w-4 h-4' />
                  </div>
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-[#ECE9E4]'>
                      {t('dashboard.banner.overview')}
                    </h3>
                    <p className='text-[11px] text-gray-500 dark:text-[#A29FA8]'>{t('dashboard.banner.realtime')}</p>
                  </div>
                </div>

                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold'>
                  <ShieldCheck className='w-3 h-3' />
                  {t('dashboard.banner.active')}
                </span>
              </div>

              {/* Progress Summary Cards */}
              <div className='grid grid-cols-2 gap-3 pt-1'>
                <div className='p-3.5 rounded-xl bg-white dark:bg-[#1A191C] border border-gray-200/60 dark:border-white/5'>
                  <div className='text-xs text-gray-500 dark:text-[#A29FA8]'>
                    {t('dashboard.banner.skillsUnlocked')}
                  </div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-gray-900 dark:text-[#ECE9E4]'>
                    {totalSkills}{' '}
                    <span className='text-xs font-normal text-indigo-600 dark:text-[#A99DFF]'>
                      {t('dashboard.banner.skillsUnit')}
                    </span>
                  </div>
                </div>

                <div className='p-3.5 rounded-xl bg-white dark:bg-[#1A191C] border border-gray-200/60 dark:border-white/5'>
                  <div className='text-xs text-gray-500 dark:text-[#A29FA8]'>{t('dashboard.banner.learningTime')}</div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-gray-900 dark:text-[#ECE9E4]'>
                    {totalHours}{' '}
                    <span className='text-xs font-normal text-indigo-600 dark:text-[#A99DFF]'>
                      {t('dashboard.banner.hours')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Tip inside card */}
              <div className='pt-2 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500 dark:text-[#A29FA8]'>
                <span>{t('dashboard.banner.standard')}</span>
                <span className='font-semibold text-indigo-600 dark:text-[#A99DFF]'>
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
