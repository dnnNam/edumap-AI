import { useTranslation } from 'react-i18next'
import { Banknote, ExternalLink, TrendingUp } from 'lucide-react'
import type { TrendingRole } from '../../../types/api/job.types'
import { MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionWrapper'
import SpotlightCard from '../../ui/SpotlightCard'
import NumberTicker from '../../ui/NumberTicker'
import { AnimatedBriefcase } from '../../ui/AnimatedIcons'

function TrendingCard({ role, maxCount }: { role: TrendingRole; maxCount: number }) {
  const { t } = useTranslation()
  const percent = maxCount > 0 ? Math.max(6, Math.round((role.searchCount / maxCount) * 100)) : 0
  const links = role.jobPlatformLinks ?? []

  // Top 3 Rank styling
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/30'
    }
    if (rank === 2) {
      return 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/30'
    }
    if (rank === 3) {
      return 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/30'
    }
    return 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-[#ECE9E4]'
  }

  return (
    <SpotlightCard className='h-full flex flex-col p-6 sm:p-7 shadow-xs group transition-all duration-300'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3.5 min-w-0'>
          <div
            className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-base font-black transition-transform group-hover:scale-105 ${getRankBadge(
              role.rank,
            )}`}
          >
            #{role.rank}
          </div>
          <div className='min-w-0'>
            <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-[#ECE9E4] truncate group-hover:text-indigo-600 dark:group-hover:text-[#A99DFF] transition-colors'>
              {role.targetRole}
            </h3>
            <p className='text-xs text-gray-500 dark:text-[#A29FA8]'>{t('jobs.trending.interested')}</p>
          </div>
        </div>

        {role.badge && (
          <span className='shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-[#A99DFF] whitespace-nowrap'>
            {role.badge}
          </span>
        )}
      </div>

      {/* SỐ LIỆU THỊ TRƯỜNG: Mức lương & Tăng trưởng & Số việc làm */}
      {(role.salaryRange || role.growthRate || role.openPositions) && (
        <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-white/[0.06] text-xs'>
          {role.salaryRange && (
            <div className='flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400'>
              <Banknote className='w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400' />
              <span className='font-bold truncate'>{role.salaryRange}</span>
            </div>
          )}

          {role.growthRate && (
            <div className='flex items-center gap-1.5 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30 text-indigo-800 dark:text-[#A99DFF]'>
              <TrendingUp className='w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400' />
              <span className='font-bold truncate'>{role.growthRate} nhu cầu</span>
            </div>
          )}

          {role.openPositions && (
            <div className='col-span-2 sm:col-span-1 flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] text-gray-700 dark:text-[#ECE9E4]'>
              <AnimatedBriefcase className='w-3.5 h-3.5 shrink-0 text-gray-500 dark:text-gray-400' />
              <span className='truncate font-medium'>~{role.openPositions.toLocaleString()} việc làm</span>
            </div>
          )}
        </div>
      )}

      {/* TOP KỸ NĂNG CÔNG NGHỆ HOT */}
      {role.topSkills && role.topSkills.length > 0 && (
        <div className='mt-4'>
          <p className='text-xs font-semibold text-gray-400 dark:text-[#85808C] mb-2 uppercase tracking-wider'>
            Kỹ năng săn đón
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {role.topSkills.map((skill) => (
              <span
                key={skill}
                className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-xs font-medium text-gray-800 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors'
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
          <p className='text-xs font-semibold text-gray-400 dark:text-[#85808C] mb-2 uppercase tracking-wider'>
            {t('jobs.trending.findOn')}
          </p>
          <div className='flex flex-wrap gap-2'>
            {links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                title={link.title}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-[#ECE9E4] transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-[#A99DFF] group/link'
              >
                <span>{link.platform}</span>
                <ExternalLink className='w-3 h-3 opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform' />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Lượt quan tâm & Thanh tiến độ Shimmer */}
      <div className='mt-auto pt-6'>
        <div className='flex items-center justify-between text-xs sm:text-sm'>
          <span className='text-gray-500 dark:text-[#A29FA8] font-medium'>{t('jobs.trending.searches')}</span>
          <span className='font-bold text-gray-900 dark:text-[#ECE9E4] flex items-center gap-1'>
            <NumberTicker value={role.searchCount} />
            <span className='text-xs font-normal text-gray-400'>lượt</span>
          </span>
        </div>
        <div className='mt-2 h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-[#A99DFF] shimmer-progress transition-all duration-500'
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </SpotlightCard>
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
