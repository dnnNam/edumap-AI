import type { TrendingRole } from '../../../types/api/job.types'
import { MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionWrapper'

function TrendingCard({ role, maxCount }: { role: TrendingRole; maxCount: number }) {
  const percent = maxCount > 0 ? Math.max(4, Math.round((role.searchCount / maxCount) * 100)) : 0

  return (
    <div className='h-full flex flex-col rounded-3xl border border-gray-200 bg-white p-6 transition hover:shadow-md hover:border-gray-300'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-4 min-w-0'>
          <div className='w-14 h-14 shrink-0 rounded-2xl bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-900'>
            #{role.rank}
          </div>
          <div className='min-w-0'>
            <h3 className='text-lg font-medium text-gray-900 truncate'>{role.targetRole}</h3>
            <p className='text-sm text-gray-500'>Vị trí đang được quan tâm</p>
          </div>
        </div>

        {role.badge && (
          <span className='shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 whitespace-nowrap'>
            {role.badge}
          </span>
        )}
      </div>

      <div className='mt-auto pt-8'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-500'>Lượt tìm kiếm</span>
          <span className='font-medium text-gray-900'>{role.searchCount}</span>
        </div>
        <div className='mt-2 h-1.5 rounded-full bg-indigo-100 overflow-hidden'>
          <div className='h-full rounded-full bg-indigo-600 transition-all' style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function TrendingRoles({ roles }: { roles: TrendingRole[] }) {
  const maxCount = Math.max(0, ...roles.map((r) => r.searchCount))

  return (
    <MotionStaggerContainer className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      {roles.map((r) => (
        <MotionStaggerItem key={r.rank}>
          <TrendingCard role={r} maxCount={maxCount} />
        </MotionStaggerItem>
      ))}
    </MotionStaggerContainer>
  )
}
