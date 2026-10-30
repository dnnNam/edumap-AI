import { BarChart3, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface BentoMonthlyVelocityCardProps {
  categoryStats: Record<string, number>
  totalSkills: number
}

export default function BentoMonthlyVelocityCard({ categoryStats, totalSkills }: BentoMonthlyVelocityCardProps) {
  const { t } = useTranslation()
  const categories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)
  const maxCount = categories[0]?.[1] ?? 1
  const topCategory = categories[0]
  const displayCategories = categories.slice(0, 7)

  const dominantPct = topCategory && totalSkills > 0 ? Math.round((topCategory[1] / totalSkills) * 100) : 0

  return (
    <div className='h-full rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] text-gray-900 dark:text-[#ECE9E4] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all'>
      <div>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center font-bold'>
              <BarChart3 className='w-4 h-4' />
            </div>
            <span className='font-bold text-sm tracking-wide text-gray-900 dark:text-[#ECE9E4]'>
              {t('dashboard.bento.domainDistribution')}
            </span>
          </div>

          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-[#A29FA8]'>
            <span>{t('dashboard.bento.realData')}</span>
          </div>
        </div>

        {/* Key Indicators Row */}
        <div className='mt-5 flex items-center gap-8 flex-wrap'>
          <div className='flex items-center gap-3'>
            <div className='w-1.5 h-8 rounded-full bg-indigo-600' />
            <div>
              <div className='text-2xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>{dominantPct}%</div>
              <div className='text-[11px] text-gray-400 dark:text-[#A29FA8] font-medium'>
                {topCategory
                  ? t('dashboard.bento.focusOn', { name: topCategory[0] })
                  : t('dashboard.bento.noDistribution')}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-1.5 h-8 rounded-full bg-indigo-400 dark:bg-[#A99DFF]' />
            <div>
              <div className='text-2xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                {categories.length}
              </div>
              <div className='text-[11px] text-gray-400 dark:text-[#A29FA8] font-medium'>
                {t('dashboard.bento.specializedDomains')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart With Pattern & Highlight Bars */}
      <div className='mt-8 pt-4 border-t border-gray-100 dark:border-white/5'>
        {displayCategories.length === 0 ? (
          <div className='h-32 flex flex-col items-center justify-center text-center text-xs text-gray-400 dark:text-[#A29FA8]'>
            <Sparkles className='w-5 h-5 text-indigo-500 mb-1.5' />
            <span>{t('dashboard.bento.noDistributionData')}</span>
          </div>
        ) : (
          <div className='h-32 flex items-end justify-between gap-3 px-2'>
            {displayCategories.map(([name, count], idx) => {
              const isTop = idx === 0
              const heightPct = Math.max(20, Math.round((count / maxCount) * 100))

              return (
                <div key={name} className='flex-1 flex flex-col items-center gap-2'>
                  <div className='w-full flex items-end justify-center gap-1 h-28'>
                    {isTop ? (
                      <>
                        {/* Cột chính nổi bật */}
                        <div
                          className='w-4 sm:w-5 rounded-t-full bg-indigo-600 shadow-sm transition-all duration-300'
                          style={{ height: `${heightPct}%` }}
                          title={`${name}: ${count} ${t('dashboard.bento.skills')}`}
                        />
                        {/* Cột phụ bổ trợ */}
                        <div
                          className='w-3 sm:w-4 rounded-t-full bg-indigo-300 dark:bg-indigo-400/60 transition-all duration-300'
                          style={{ height: `${Math.round(heightPct * 0.75)}%` }}
                        />
                      </>
                    ) : (
                      /* Các cột phụ */
                      <div
                        className='w-5 sm:w-7 rounded-t-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200'
                        style={{ height: `${heightPct}%` }}
                        title={`${name}: ${count} ${t('dashboard.bento.skills')}`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold truncate max-w-[55px] text-center ${
                      isTop ? 'text-indigo-600 dark:text-[#A99DFF] font-bold' : 'text-gray-400 dark:text-[#A29FA8]'
                    }`}
                    title={name}
                  >
                    {name}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
