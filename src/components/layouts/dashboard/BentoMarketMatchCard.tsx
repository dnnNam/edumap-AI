import { Target } from 'lucide-react'

interface BentoMarketMatchCardProps {
  careerPath?: string | null
  completionPercentage?: number
}

export default function BentoMarketMatchCard({ careerPath, completionPercentage = 0 }: BentoMarketMatchCardProps) {
  const percentage = Math.min(100, Math.max(0, completionPercentage))
  const displayCareer = careerPath || 'Định hướng nghề nghiệp'

  // Ma trận 9 cột x 4 hàng (36 chấm) phản ánh tỷ lệ hoàn thành lộ trình thực tế
  const totalDots = 36
  const activeDots = Math.round((percentage / 100) * totalDots)

  const getTierStatus = (pct: number) => {
    if (pct >= 80) return { label: 'Sẵn sàng ứng tuyển', color: 'text-emerald-600 dark:text-emerald-400' }
    if (pct >= 50) return { label: 'Đang tăng tốc', color: 'text-indigo-600 dark:text-[#A99DFF]' }
    if (pct > 0) return { label: 'Đang xây dựng', color: 'text-purple-600 dark:text-[#C49BFF]' }
    return { label: 'Chưa bắt đầu', color: 'text-gray-400 dark:text-[#A29FA8]' }
  }

  const status = getTierStatus(percentage)

  return (
    <div className='h-full rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all'>
      <div>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-[#C49BFF] flex items-center justify-center font-bold'>
              <Target className='w-4 h-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>Độ Khớp Lộ Trình</span>
          </div>
          <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-[#C49BFF] truncate max-w-[120px]'>
            {careerPath ? careerPath : 'Chưa chọn'}
          </span>
        </div>

        {/* Big Number & Status */}
        <div className='mt-4 flex items-baseline gap-3'>
          <div className='text-4xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {percentage}
            <span className='text-2xl text-purple-600 dark:text-[#C49BFF]'>%</span>
          </div>
          <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
        </div>
        <p className='text-xs text-gray-400 dark:text-[#A29FA8] mt-0.5 truncate' title={displayCareer}>
          {careerPath ? `Tiến độ cho vị trí: ${careerPath}` : 'Hãy tạo cây kỹ năng mục tiêu để theo dõi'}
        </p>
      </div>

      {/* Dotted Matrix Grid Chart - 9 cột x 4 hàng minh hoạ 36 điểm kỹ năng */}
      <div className='my-4 flex items-center justify-between gap-1.5 px-1 py-2'>
        {Array.from({ length: 9 }).map((_, colIdx) => (
          <div key={colIdx} className='flex flex-col gap-2 items-center'>
            {Array.from({ length: 4 }).map((_, rowIdx) => {
              const dotIndex = colIdx * 4 + rowIdx
              const isFilled = dotIndex < activeDots
              return (
                <div
                  key={rowIdx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-tr from-[#9B87F5] to-[#7C3AED] shadow-xs shadow-indigo-500/30'
                      : 'bg-gray-100 dark:bg-white/[0.08]'
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className='pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500 dark:text-[#A29FA8]'>
        <span>Trạng thái lộ trình:</span>
        <span className={`font-bold ${status.color}`}>{status.label}</span>
      </div>
    </div>
  )
}
