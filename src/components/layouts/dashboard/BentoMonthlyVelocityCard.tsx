import { BarChart3, ChevronDown, Flame } from 'lucide-react'

export default function BentoMonthlyVelocityCard() {
  const months = [
    { label: 'Jun', height: 40, active: false },
    { label: 'Jul', height: 55, active: false },
    { label: 'Aug', height: 48, active: false },
    { label: 'Sept', height: 110, active: true }, // Tháng nổi bật
    { label: 'Oct', height: 85, active: false },
    { label: 'Nov', height: 45, active: false },
    { label: 'Dec', height: 35, active: false },
  ]

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
            <span className='font-bold text-sm tracking-wide text-white/90'>Tiến Độ Học Tập & Commit</span>
          </div>

          {/* Timeframe dropdown pill */}
          <button
            type='button'
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white/80 transition cursor-pointer'
          >
            <span>Hàng tháng</span>
            <ChevronDown className='w-3.5 h-3.5 text-gray-400' />
          </button>
        </div>

        {/* Key Indicators Row */}
        <div className='mt-5 flex items-center gap-8'>
          <div className='flex items-center gap-3'>
            <div className='w-1.5 h-8 rounded-full bg-[#D4F973]' />
            <div>
              <div className='text-2xl font-black text-white tracking-tight'>85%</div>
              <div className='text-[11px] text-gray-400 font-medium'>Tỷ lệ duy trì mục tiêu</div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-1.5 h-8 rounded-full bg-[#9B87F5]' />
            <div>
              <div className='text-2xl font-black text-white tracking-tight'>14 Ngày</div>
              <div className='text-[11px] text-gray-400 font-medium flex items-center gap-1'>
                <Flame className='w-3 h-3 text-amber-400 inline' />
                Chuỗi học tập (Streak)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart With Pattern & Bright Highlight Bars - Giống ảnh mẫu */}
      <div className='mt-8 pt-4 border-t border-white/10'>
        <div className='h-32 flex items-end justify-between gap-3 px-2'>
          {months.map((m, idx) => (
            <div key={idx} className='flex-1 flex flex-col items-center gap-2'>
              <div className='w-full flex items-end justify-center gap-1.5 h-28'>
                {m.active ? (
                  <>
                    {/* Cột 1 nổi bật (Lime/Vàng chanh) */}
                    <div
                      className='w-4 sm:w-5 rounded-t-full bg-[#D4F973] shadow-lg shadow-lime-500/25 transition-all duration-300'
                      style={{ height: '95%' }}
                    />
                    {/* Cột 2 nổi bật (Lavender / Tím nhạt) */}
                    <div
                      className='w-4 sm:w-5 rounded-t-full bg-[#C4B5FD] shadow-lg shadow-purple-500/20 transition-all duration-300'
                      style={{ height: '70%' }}
                    />
                  </>
                ) : (
                  /* Các cột sọc chéo mờ (Striped Bars) */
                  <div
                    className='w-6 sm:w-8 rounded-t-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border-t border-x border-white/10'
                    style={{
                      height: `${m.height}%`,
                      backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 6px)',
                    }}
                  />
                )}
              </div>
              <span className={`text-[11px] font-semibold ${m.active ? 'text-[#D4F973] font-bold' : 'text-gray-400'}`}>
                {m.label} {m.active && '↗'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
