import { ExternalLink } from 'lucide-react'
import type { TrendingRole } from '../../../types/api/job.types'
import { MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionWrapper'

function TrendingCard({ role, maxCount }: { role: TrendingRole; maxCount: number }) {
  const percent = maxCount > 0 ? Math.max(4, Math.round((role.searchCount / maxCount) * 100)) : 0
  const links = role.jobPlatformLinks ?? []

  return (
    <div className='h-full flex flex-col rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 transition hover:shadow-md hover:border-gray-300 dark:hover:border-white/20'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-4 min-w-0'>
          <div className='w-14 h-14 shrink-0 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>
            #{role.rank}
          </div>
          <div className='min-w-0'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-[#ECE9E4] truncate'>{role.targetRole}</h3>
            <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>Vị trí đang được quan tâm</p>
          </div>
        </div>

        {role.badge && (
          <span className='shrink-0 rounded-full bg-indigo-50 dark:bg-[#5F2CFF]/15 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-[#A99DFF] whitespace-nowrap'>
            {role.badge}
          </span>
        )}
      </div>

      {/* Link sang các trang tuyển dụng */}
      {links.length > 0 && (
        <div className='mt-5'>
          <p className='text-xs font-medium text-gray-400 dark:text-[#A29FA8] mb-2'>Tìm việc trên</p>
          <div className='flex flex-wrap gap-2'>
            {links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                title={link.title}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] px-3 py-1.5 text-sm text-gray-700 dark:text-[#ECE9E4] transition hover:border-indigo-300 dark:hover:border-[#5F2CFF] hover:bg-indigo-50 dark:hover:bg-[#5F2CFF]/20 hover:text-indigo-600 dark:hover:text-[#A99DFF]'
              >
                {link.platform}
                <ExternalLink className='w-3.5 h-3.5' />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className='mt-auto pt-8'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-500 dark:text-[#A29FA8]'>Lượt tìm kiếm</span>
          <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{role.searchCount}</span>
        </div>
        <div className='mt-2 h-1.5 rounded-full bg-indigo-100 dark:bg-white/10 overflow-hidden'>
          <div className='h-full rounded-full bg-indigo-600 dark:bg-[#5F2CFF] transition-all' style={{ width: `${percent}%` }} />
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
