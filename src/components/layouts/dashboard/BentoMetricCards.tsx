import { GitBranch, Clock, MoreVertical } from 'lucide-react'

interface BentoMetricCardsProps {
  totalHours: number
  totalSkills: number
}

export default function BentoMetricCards({ totalHours, totalSkills }: BentoMetricCardsProps) {
  const completedNodes = totalSkills > 0 ? totalSkills : 18
  const totalNodes = Math.max(completedNodes + 8, 24)

  return (
    <div className='flex flex-col gap-5 h-full justify-between'>
      {/* 1. Thẻ Cây kỹ năng (Heart Rate counterpart) */}
      <div className='flex-1 rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 shadow-xs flex flex-col justify-between transition-all'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-[#C49BFF] flex items-center justify-center'>
              <GitBranch className='w-4 h-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>Cây Kỹ Năng</span>
          </div>
          <button
            type='button'
            aria-label='Tùy chọn'
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer'
          >
            <MoreVertical className='w-4 h-4' />
          </button>
        </div>

        <div className='my-3 flex items-baseline justify-between'>
          <div className='flex items-baseline gap-1.5'>
            <span className='text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {completedNodes}
            </span>
            <span className='text-sm font-semibold text-gray-400 dark:text-[#A29FA8]'>/{totalNodes} nodes</span>
          </div>
          <div className='text-right'>
            <div className='text-xs font-bold text-gray-700 dark:text-[#ECE9E4]'>Tỷ lệ mở</div>
            <div className='text-xs text-indigo-600 dark:text-[#A99DFF] font-semibold'>
              {Math.round((completedNodes / totalNodes) * 100)}%
            </div>
          </div>
        </div>

        {/* Thanh tiến độ */}
        <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600'
            style={{ width: `${Math.round((completedNodes / totalNodes) * 100)}%` }}
          />
        </div>
      </div>

      {/* 2. Thẻ Thời lượng & Năng suất (Activity counterpart) */}
      <div className='flex-1 rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 shadow-xs flex flex-col justify-between transition-all'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center'>
              <Clock className='w-4 h-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>Thời Lượng Học Tập</span>
          </div>
          <button
            type='button'
            aria-label='Tùy chọn'
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer'
          >
            <MoreVertical className='w-4 h-4' />
          </button>
        </div>

        <div className='my-3 flex items-baseline justify-between'>
          <div className='flex items-baseline gap-1'>
            <span className='text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {totalHours > 0 ? totalHours : '42'}
            </span>
            <span className='text-sm font-semibold text-gray-400 dark:text-[#A29FA8]'>giờ</span>
          </div>
          <div className='text-right'>
            <div className='text-xs font-bold text-gray-700 dark:text-[#ECE9E4]'>Tích lũy tuần</div>
            <div className='text-xs text-emerald-600 dark:text-emerald-400 font-semibold'>+8.5 giờ</div>
          </div>
        </div>

        {/* Thanh tiến độ */}
        <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
          <div className='h-full rounded-full bg-gradient-to-r from-emerald-400 to-indigo-500 w-[68%]' />
        </div>
      </div>
    </div>
  )
}
