import { Layers, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

interface BentoSkillBreakdownCardProps {
  totalSkills: number
  categoryStats: Record<string, number>
}

export default function BentoSkillBreakdownCard({ totalSkills, categoryStats }: BentoSkillBreakdownCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const categories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)
  const topCategories = categories.slice(0, 3)

  const hasSkills = totalSkills > 0 && categories.length > 0

  const cat1 = topCategories[0]
  const cat2 = topCategories[1]
  const cat3 = topCategories[2]

  const pct1 = cat1 ? Math.round((cat1[1] / totalSkills) * 100) : 0
  const pct2 = cat2 ? Math.round((cat2[1] / totalSkills) * 100) : 0
  const pct3 = cat3 ? Math.round((cat3[1] / totalSkills) * 100) : 0

  return (
    <div className='h-full rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all'>
      <div>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center font-bold'>
              <Layers className='w-4.5 h-4.5' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-base'>
              {t('dashboard.bento.skillBreakdown')}
            </span>
          </div>
          <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-[#A29FA8]'>
            {t('dashboard.bento.domains', { count: categories.length })}
          </span>
        </div>

        {/* Big Number & Context */}
        <div className='mt-5 flex items-baseline gap-3'>
          <div className='text-4xl sm:text-5xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {totalSkills}
            <span className='text-xl sm:text-2xl font-bold text-indigo-600 dark:text-[#A99DFF] ml-1.5'>
              {t('dashboard.bento.skills')}
            </span>
          </div>
        </div>
        <p className='text-xs text-gray-400 dark:text-[#A29FA8] mt-1'>{t('dashboard.bento.verifiedFromProfile')}</p>

        {/* Bong bóng tròn hoặc Empty State */}
        {!hasSkills ? (
          <div className='my-8 py-10 flex flex-col items-center justify-center text-center rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10'>
            <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center mb-3'>
              <Sparkles className='w-6 h-6' />
            </div>
            <p className='text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
              {t('dashboard.bento.noSkillsTitle')}
            </p>
            <p className='text-xs text-gray-400 dark:text-[#A29FA8] max-w-[220px] mt-1'>
              {t('dashboard.bento.noSkillsDesc')}
            </p>
            <button
              type='button'
              onClick={() => navigate('/upload')}
              className='mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition cursor-pointer'
            >
              {t('dashboard.bento.analyzeNow')}
              <ArrowRight className='w-3 h-3' />
            </button>
          </div>
        ) : (
          <div className='my-8 relative h-48 w-full flex items-center justify-center'>
            {/* Vòng tròn 1: Lớn nhất (Indigo Chủ đạo) */}
            {cat1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className='absolute -left-1 sm:left-4 top-2 w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-600/25 z-10'
              >
                <span className='text-xl sm:text-2xl font-black tracking-tight'>{cat1[1]}</span>
                <span className='text-[10px] font-semibold opacity-90 truncate max-w-[90px] text-center px-1'>
                  {cat1[0]}
                </span>
                <span className='text-[9px] opacity-75 font-medium'>{pct1}%</span>
              </motion.div>
            )}

            {/* Vòng tròn 2: Vừa (Indigo Đậm) */}
            {cat2 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='absolute right-2 sm:right-6 top-0 w-28 h-28 rounded-full bg-indigo-900/90 dark:bg-indigo-950/90 text-white flex flex-col items-center justify-center shadow-md border border-indigo-500/30 z-20'
              >
                <span className='text-lg sm:text-xl font-black'>{cat2[1]}</span>
                <span className='text-[10px] font-medium opacity-80 truncate max-w-[80px] text-center px-1'>
                  {cat2[0]}
                </span>
                <span className='text-[9px] opacity-75 font-medium'>{pct2}%</span>
              </motion.div>
            ) : null}

            {/* Vòng tròn 3: Nhỏ (Indigo Subtle / Lavender) */}
            {cat3 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='absolute left-24 sm:left-28 bottom-0 w-24 h-24 rounded-full bg-indigo-100 text-indigo-950 dark:bg-[#A99DFF] dark:text-[#121114] flex flex-col items-center justify-center shadow-md shadow-indigo-500/10 z-30 font-bold'
              >
                <span className='text-base sm:text-lg font-black'>{cat3[1]}</span>
                <span className='text-[9px] font-bold truncate max-w-[70px] text-center px-1'>{cat3[0]}</span>
                <span className='text-[9px] opacity-80 font-medium'>{pct3}%</span>
              </motion.div>
            ) : null}
          </div>
        )}
      </div>

      {/* Danh sách thanh phần trăm ngang bên dưới (chỉ hiện các category thực tế) */}
      {hasSkills && topCategories.length > 0 ? (
        <div className='space-y-3 pt-4 border-t border-gray-100 dark:border-white/5'>
          {topCategories.map(([name, count], idx) => {
            const pct = Math.round((count / totalSkills) * 100)
            const colors = ['bg-indigo-600', 'bg-indigo-500 dark:bg-[#A99DFF]', 'bg-indigo-400 dark:bg-indigo-300']
            return (
              <div key={name}>
                <div className='flex items-center justify-between text-xs font-semibold mb-1'>
                  <span className='text-gray-900 dark:text-[#ECE9E4] font-bold'>{pct}%</span>
                  <span className='text-gray-500 dark:text-[#A29FA8] font-medium'>
                    {name} ({count} {t('dashboard.bento.skills')})
                  </span>
                </div>
                <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
                  <div className={`h-full rounded-full ${colors[idx % colors.length]}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='pt-3 border-t border-gray-100 dark:border-white/5 text-[11px] text-gray-400 text-center'>
          {t('dashboard.bento.noDistributionData')}
        </div>
      )}
    </div>
  )
}
