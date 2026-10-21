import { MoreVertical, Layers, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BentoSkillBreakdownCardProps {
  totalSkills: number
  categoryStats: Record<string, number>
}

export default function BentoSkillBreakdownCard({ totalSkills, categoryStats }: BentoSkillBreakdownCardProps) {
  const categories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)
  const topCategories = categories.slice(0, 3)

  // Tính phần trăm cho 3 mảng chính
  const cat1 = topCategories[0] || ['Backend', Math.max(1, Math.round(totalSkills * 0.45))]
  const cat2 = topCategories[1] || ['Frontend', Math.max(1, Math.round(totalSkills * 0.3))]
  const cat3 = topCategories[2] || ['DevOps & AI', Math.max(1, Math.round(totalSkills * 0.25))]

  const totalCalculated = cat1[1] + cat2[1] + cat3[1] || 1
  const pct1 = Math.round((cat1[1] / totalCalculated) * 100)
  const pct2 = Math.round((cat2[1] / totalCalculated) * 100)
  const pct3 = 100 - pct1 - pct2

  return (
    <div className='h-full rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all'>
      <div>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center font-bold'>
              <Layers className='w-4.5 h-4.5' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-base'>Phân Bổ Kỹ Năng</span>
          </div>
          <button
            type='button'
            aria-label='Tùy chọn'
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer'
          >
            <MoreVertical className='w-4 h-4' />
          </button>
        </div>

        {/* Big Number & Growth Badge */}
        <div className='mt-5 flex items-baseline gap-3'>
          <div className='text-4xl sm:text-5xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {totalSkills > 0 ? `${totalSkills}` : '18'}
            <span className='text-xl sm:text-2xl font-bold text-indigo-600 dark:text-[#A99DFF] ml-1'>skills</span>
          </div>
          <span className='inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold'>
            <ArrowUpRight className='w-3 h-3' />
            +15%
          </span>
        </div>
        <p className='text-xs text-gray-400 dark:text-[#A29FA8] mt-1'>Cập nhật từ kho lưu trữ GitHub của bạn</p>

        {/* 3 Bong bóng tròn lồng nhau (Overlapping Circles Chart) - Giống ảnh mẫu */}
        <div className='my-8 relative h-48 w-full flex items-center justify-center'>
          {/* Vòng tròn 1: Lớn nhất (Tím nhạt / Lavender) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='absolute -left-1 sm:left-4 top-2 w-32 h-32 rounded-full bg-gradient-to-tr from-[#9B87F5] to-[#C4B5FD] text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20 z-10'
          >
            <span className='text-xl sm:text-2xl font-black tracking-tight'>{cat1[1]}</span>
            <span className='text-[10px] font-semibold opacity-90 truncate max-w-[90px] text-center px-1'>
              {cat1[0]}
            </span>
          </motion.div>

          {/* Vòng tròn 2: Vừa (Tím than đậm) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='absolute right-2 sm:right-6 top-0 w-28 h-28 rounded-full bg-[#1E1B4B] dark:bg-[#2A2356] text-white flex flex-col items-center justify-center shadow-md border border-white/20 z-20'
          >
            <span className='text-lg sm:text-xl font-black'>{cat2[1]}</span>
            <span className='text-[10px] font-medium opacity-80 truncate max-w-[80px] text-center px-1'>{cat2[0]}</span>
          </motion.div>

          {/* Vòng tròn 3: Nhỏ (Màu vôi sáng / Lime Accent) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='absolute left-24 sm:left-28 bottom-0 w-24 h-24 rounded-full bg-[#D4F973] text-gray-900 flex flex-col items-center justify-center shadow-lg shadow-lime-500/20 z-30 font-bold'
          >
            <span className='text-base sm:text-lg font-black'>{cat3[1]}</span>
            <span className='text-[9px] font-bold text-gray-800 truncate max-w-[70px] text-center px-1'>{cat3[0]}</span>
          </motion.div>
        </div>
      </div>

      {/* Danh sách thanh phần trăm ngang bên dưới */}
      <div className='space-y-3.5 pt-4 border-t border-gray-100 dark:border-white/5'>
        {/* Cat 1 */}
        <div>
          <div className='flex items-center justify-between text-xs font-semibold mb-1'>
            <span className='text-gray-900 dark:text-[#ECE9E4] font-bold'>{pct1}%</span>
            <span className='text-gray-500 dark:text-[#A29FA8] font-medium'>{cat1[0]}</span>
          </div>
          <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
            <div className='h-full rounded-full bg-[#9B87F5]' style={{ width: `${pct1}%` }} />
          </div>
        </div>

        {/* Cat 2 */}
        <div>
          <div className='flex items-center justify-between text-xs font-semibold mb-1'>
            <span className='text-gray-900 dark:text-[#ECE9E4] font-bold'>{pct2}%</span>
            <span className='text-gray-500 dark:text-[#A29FA8] font-medium'>{cat2[0]}</span>
          </div>
          <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
            <div className='h-full rounded-full bg-[#1E1B4B] dark:bg-[#9D84FF]' style={{ width: `${pct2}%` }} />
          </div>
        </div>

        {/* Cat 3 */}
        <div>
          <div className='flex items-center justify-between text-xs font-semibold mb-1'>
            <span className='text-gray-900 dark:text-[#ECE9E4] font-bold'>{pct3}%</span>
            <span className='text-gray-500 dark:text-[#A29FA8] font-medium'>{cat3[0]}</span>
          </div>
          <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
            <div className='h-full rounded-full bg-[#D4F973]' style={{ width: `${pct3}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
