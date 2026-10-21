import { useTranslation } from 'react-i18next'
import { Banknote, Briefcase, ExternalLink, TrendingUp } from 'lucide-react'
import type { TrendingRole } from '../../../types/api/job.types'
import { MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionWrapper'

function TrendingCard({ role, maxCount }: { role: TrendingRole; maxCount: number }) {
  const { t } = useTranslation()
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
            <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>{t('jobs.trending.interested')}</p>
          </div>
        </div>

        {role.badge && (
          <span className='shrink-0 rounded-full bg-indigo-50 dark:bg-[#5F2CFF]/15 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-[#A99DFF] whitespace-nowrap'>
            {role.badge}
          </span>
        )}
      </div>

      {/* SỐ LIỆU THỊ TRƯỜNG: Mức lương & Tăng trưởng & Số việc làm */}
      {(role.salaryRange || role.growthRate || role.openPositions) && (
        <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-gray-100 dark:border-white/[0.06] text-xs'>
          {role.salaryRange && (
            <div className='flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'>
              <Banknote className='w-3.5 h-3.5 shrink-0' />
              <span className='font-semibold truncate'>{role.salaryRange}</span>
            </div>
          )}

          {role.growthRate && (
            <div className='flex items-center gap-1.5 p-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'>
              <TrendingUp className='w-3.5 h-3.5 shrink-0' />
              <span className='font-semibold truncate'>{role.growthRate} nhu cầu</span>
            </div>
          )}

          {role.openPositions && (
            <div className='col-span-2 sm:col-span-1 flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-[#ECE9E4]'>
              <Briefcase className='w-3.5 h-3.5 shrink-0 text-gray-400' />
              <span className='truncate'>~{role.openPositions.toLocaleString()} việc làm</span>
            </div>
          )}
        </div>
      )}

      {/* TOP KỸ NĂNG CÔNG NGHỆ HOT */}
      {role.topSkills && role.topSkills.length > 0 && (
        <div className='mt-4'>
          <p className='text-xs font-medium text-gray-400 dark:text-[#A29FA8] mb-2'>Kỹ năng săn đón</p>
          <div className='flex flex-wrap gap-1.5'>
            {role.topSkills.map((skill) => (
              <span
                key={skill}
                className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-xs text-gray-700 dark:text-gray-300'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Link sang các trang tuyển dụng */}
      {links.length > 0 && (
        <div className='mt-4'>
          <p className='text-xs font-medium text-gray-400 dark:text-[#A29FA8] mb-2'>{t('jobs.trending.findOn')}</p>
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

      <div className='mt-auto pt-6'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-500 dark:text-[#A29FA8]'>{t('jobs.trending.searches')}</span>
          <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{role.searchCount}</span>
        </div>
        <div className='mt-2 h-1.5 rounded-full bg-indigo-100 dark:bg-white/10 overflow-hidden'>
          <div
            className='h-full rounded-full bg-indigo-600 dark:bg-[#5F2CFF] transition-all'
            style={{ width: `${percent}%` }}
          />
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
