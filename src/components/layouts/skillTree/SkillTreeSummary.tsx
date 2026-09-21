import type { ReactNode } from 'react'
import type { SkillNode } from '../../../types/api/skillTree.types'
import { SkeletonStat } from './SkeletonLoader'

function SummaryCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6'>
      <p className='text-xs text-gray-500'>{label}</p>
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
          <SummaryCard label='Completion'>
            <div className='mt-2 flex items-end justify-between gap-3'>
              <p className='text-[32px] leading-none font-bold text-gray-900 tracking-tight'>{percentage}%</p>
              <p className='text-sm text-gray-500'>
                {completed} of {total}
              </p>
            </div>
            <div
              className='mt-4 h-1.5 rounded-full bg-gray-100 overflow-hidden'
              role='progressbar'
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className='h-full rounded-full bg-indigo-600 transition-[width] duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>
          </SummaryCard>

          <SummaryCard label='Total nodes'>
            <p className='mt-2 text-[32px] leading-none font-bold text-gray-900 tracking-tight'>{total}</p>
            <p className='mt-4 text-sm text-gray-500'>
              Across {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
            </p>
          </SummaryCard>

          <SummaryCard label='Next priority'>
            {nextPriority ? (
              <>
                <p className='mt-2 text-xl font-semibold text-gray-900 truncate'>{nextPriority.skill.name}</p>
                <p className='mt-4 text-sm text-gray-500'>
                  Priority rank {nextPriority.priorityRank} · Level {nextPriority.skill.difficultyLevel}
                </p>
              </>
            ) : (
              <>
                <p className='mt-2 text-xl font-semibold text-gray-900'>All done</p>
                <p className='mt-4 text-sm text-gray-500'>Every skill in this tree is completed.</p>
              </>
            )}
          </SummaryCard>
        </>
      )}
    </div>
  )
}
