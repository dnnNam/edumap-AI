import { BarChart3, Sparkles } from 'lucide-react'

interface BentoMonthlyVelocityCardProps {
  categoryStats: Record<string, number>
  totalSkills: number
}

export default function BentoMonthlyVelocityCard({ categoryStats, totalSkills }: BentoMonthlyVelocityCardProps) {
  const categories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)
  const maxCount = categories[0]?.[1] ?? 1
  const topCategory = categories[0]
  const displayCategories = categories.slice(0, 7)

  const dominantPct = topCategory && totalSkills > 0 ? Math.round((topCategory[1] / totalSkills) * 100) : 0

  return (
    <div className='h-full rounded-[32px] border border-white/10 bg-[#161320] text-white p-6 sm:p-7 shadow-xl flex flex-col justify-between relative overflow-hidden'>
      {/* Background glow orb */}
      <div className='absolute -right-10 -bottom-10 w-44 h-44 bg-[#5F2CFF]/15 rounded-full blur-3xl pointer-events-none' />

      <div>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-white/10 text-[#C49BFF] flex items-center justify-center font-bold'>
              <BarChart3 className='w-4 h-4' />
            </div>
            <span className='font-bold text-sm tracking-wide text-white/90'>Phân Bố Năng Lực Theo Lĩnh Vực</span>
          </div>

          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/80'>
            <span>Dữ liệu thực tế</span>
          </div>
        </div>

        {/* Key Indicators Row */}
        <div className='mt-5 flex items-center gap-8 flex-wrap'>
          <div className='flex items-center gap-3'>
            <div className='w-1.5 h-8 rounded-full bg-[#D4F973]' />
            <div>
              <div className='text-2xl font-black text-white tracking-tight'>{dominantPct}%</div>
              <div className='text-[11px] text-gray-400 font-medium'>
                {topCategory ? `Tập trung vào ${topCategory[0]}` : 'Chưa có phân bố'}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-1.5 h-8 rounded-full bg-[#9B87F5]' />
            <div>
              <div className='text-2xl font-black text-white tracking-tight'>{categories.length}</div>
              <div className='text-[11px] text-gray-400 font-medium'>Lĩnh vực chuyên môn</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart With Pattern & Bright Highlight Bars */}
      <div className='mt-8 pt-4 border-t border-white/10'>
        {displayCategories.length === 0 ? (
          <div className='h-32 flex flex-col items-center justify-center text-center text-xs text-gray-400'>
            <Sparkles className='w-5 h-5 text-purple-400 mb-1.5' />
            <span>Chưa có dữ liệu phân bố kỹ năng</span>
          </div>
        ) : (
          <div className='h-32 flex items-end justify-between gap-3 px-2'>
            {displayCategories.map(([name, count], idx) => {
              const isTop = idx === 0
              const heightPct = Math.max(20, Math.round((count / maxCount) * 100))

              return (
                <div key={name} className='flex-1 flex flex-col items-center gap-2'>
                  <div className='w-full flex items-end justify-center gap-1 h-28'>
                    {isTop ? (
                      <>
                        {/* Cột chính nổi bật (Lime) */}
                        <div
                          className='w-4 sm:w-5 rounded-t-full bg-[#D4F973] shadow-lg shadow-lime-500/25 transition-all duration-300'
                          style={{ height: `${heightPct}%` }}
                          title={`${name}: ${count} kỹ năng`}
                        />
                        {/* Cột phụ bổ trợ (Lavender) */}
                        <div
                          className='w-3 sm:w-4 rounded-t-full bg-[#C4B5FD] shadow-lg shadow-purple-500/20 transition-all duration-300'
                          style={{ height: `${Math.round(heightPct * 0.75)}%` }}
                        />
                      </>
                    ) : (
                      /* Các cột sọc chéo mờ (Striped Bars) */
                      <div
                        className='w-5 sm:w-7 rounded-t-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border-t border-x border-white/10'
                        style={{
                          height: `${heightPct}%`,
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 6px)',
                        }}
                        title={`${name}: ${count} kỹ năng`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold truncate max-w-[55px] text-center ${
                      isTop ? 'text-[#D4F973] font-bold' : 'text-gray-400'
                    }`}
                    title={name}
                  >
                    {name}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
