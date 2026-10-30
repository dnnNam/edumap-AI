import { GitBranch, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SpotlightCard from '../../ui/SpotlightCard'

interface BentoMetricCardsProps {
  totalHours: number
  completedNodes: number
  totalNodes: number
  completionPercentage: number
}

export default function BentoMetricCards({
  totalHours,
  completedNodes,
  totalNodes,
  completionPercentage,
}: BentoMetricCardsProps) {
  const { t } = useTranslation()
  const hasTree = totalNodes > 0
  const rate = hasTree ? Math.min(100, Math.max(0, completionPercentage)) : 0

  return (
    <div className='flex flex-col gap-5 h-full justify-between'>
      {/* 1. Thẻ Cây kỹ năng (Tiến độ thực tế theo lộ trình) */}
      <SpotlightCard className='flex-1 p-6 shadow-xs flex flex-col justify-between transition-all'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center font-bold'>
              <GitBranch className='w-4 h-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>
              {t('dashboard.bento.targetSkillTree')}
            </span>
          </div>
          <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-[#A99DFF]'>
            {hasTree ? t('dashboard.bento.personalRoadmap') : t('dashboard.bento.notActivated')}
          </span>
        </div>

        <div className='my-3 flex items-baseline justify-between'>
          <div className='flex items-baseline gap-1.5'>
            <span className='text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {completedNodes}
            </span>
            <span className='text-sm font-semibold text-gray-400 dark:text-[#A29FA8]'>
              /{totalNodes} {t('dashboard.bento.nodesUnit')}
            </span>
          </div>
          <div className='text-right'>
            <div className='text-xs font-bold text-gray-700 dark:text-[#ECE9E4]'>{t('dashboard.bento.unlockRate')}</div>
            <div className='text-xs text-indigo-600 dark:text-[#A99DFF] font-semibold'>{rate}%</div>
          </div>
        </div>

        {/* Thanh tiến độ */}
        <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-[#A99DFF] transition-all duration-500'
            style={{ width: `${rate}%` }}
          />
        </div>
      </SpotlightCard>

      {/* 2. Thẻ Thời lượng & Năng suất học tập (Dữ liệu thực từ DB) */}
      <SpotlightCard className='flex-1 p-6 shadow-xs flex flex-col justify-between transition-all'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center font-bold'>
              <Clock className='w-4 h-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>
              {t('dashboard.bento.accumulatedHours')}
            </span>
          </div>
          <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-[#A99DFF]'>
            {t('dashboard.bento.totalTime')}
          </span>
        </div>

        <div className='my-3 flex items-baseline justify-between'>
          <div className='flex items-baseline gap-1'>
            <span className='text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {totalHours}
            </span>
            <span className='text-sm font-semibold text-gray-400 dark:text-[#A29FA8]'>
              {t('dashboard.banner.hours')}
            </span>
          </div>
          <div className='text-right'>
            <div className='text-xs font-bold text-gray-700 dark:text-[#ECE9E4]'>
              {t('dashboard.bento.actualInvestment')}
            </div>
            <div className='text-xs text-indigo-600 dark:text-[#A99DFF] font-semibold'>
              {t('dashboard.bento.recorded')}
            </div>
          </div>
        </div>

        {/* Thanh tiến độ trực quan dựa theo mốc 100 giờ học */}
        <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-emerald-400 to-indigo-500 transition-all duration-500'
            style={{ width: `${Math.min(100, Math.max(5, (totalHours / 100) * 100))}%` }}
          />
        </div>
      </SpotlightCard>
    </div>
  )
}
