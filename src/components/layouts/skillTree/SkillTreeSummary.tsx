import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { SkillNode } from '../../../types/api/skillTree.types'
import { SkeletonStat } from './SkeletonLoader'

function SummaryCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-6'>
      <p className='text-xs text-gray-500 dark:text-[#A29FA8]'>{label}</p>
      {children}
    </div>
  )
}

export default function SkillTreeSummary({
  loading,
  percentage,
  completed,
  total,
  categoryCount,
  nextPriority,
}: {
  loading: boolean
  percentage: number
  completed: number
  total: number
  categoryCount: number
  nextPriority: SkillNode | null
}) {
  const { t } = useTranslation()

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
      {loading ? (
        <>
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </>
      ) : (
        <>
          <SummaryCard label={t('skillTree.summary.completion')}>
            <div className='mt-2 flex items-end justify-between gap-3'>
              <p className='text-[32px] leading-none font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                {percentage}%
              </p>
              <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>
                {t('skillTree.summary.ofTotal', { completed, total })}
              </p>
            </div>
            <div
              className='mt-4 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden'
              role='progressbar'
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className='h-full rounded-full bg-indigo-600 dark:bg-[#5F2CFF] transition-[width] duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>
          </SummaryCard>

          <SummaryCard label={t('skillTree.summary.totalNodes')}>
            <p className='mt-2 text-[32px] leading-none font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {total}
            </p>
            <p className='mt-4 text-sm text-gray-500 dark:text-[#A29FA8]'>
              {t('skillTree.summary.categories', { count: categoryCount })}
            </p>
          </SummaryCard>

          <SummaryCard label={t('skillTree.summary.nextPriority')}>
            {nextPriority ? (
              <>
                <p className='mt-2 text-xl font-semibold text-gray-900 dark:text-[#ECE9E4] truncate'>
                  {nextPriority.skill.name}
                </p>
                <p className='mt-4 text-sm text-gray-500 dark:text-[#A29FA8]'>
                  {t('skillTree.summary.priorityLevel', {
                    rank: nextPriority.priorityRank,
                    level: nextPriority.skill.difficultyLevel,
                  })}
                </p>
              </>
            ) : (
              <>
                <p className='mt-2 text-xl font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                  {t('skillTree.summary.allDone')}
                </p>
                <p className='mt-4 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('skillTree.summary.allDoneDesc')}</p>
              </>
            )}
          </SummaryCard>
        </>
      )}
    </div>
  )
}
