import { Target, MoreVertical, ArrowUpRight } from 'lucide-react'

export default function BentoMarketMatchCard() {
  // Ma trận 9 cột x 4 hàng chấm mô phỏng biểu đồ mật độ độ khớp kỹ năng
  const matrixData = [
    [0.3, 0.5, 0.8, 1.0],
    [0.4, 0.7, 0.9, 0.6],
    [0.2, 0.6, 0.7, 0.4],
    [0.6, 0.9, 1.0, 0.8],
    [0.5, 0.8, 0.9, 0.7],
    [0.3, 0.6, 0.8, 1.0],
    [0.4, 0.7, 0.9, 0.5],
    [0.5, 0.9, 1.0, 0.9],
    [0.3, 0.7, 0.8, 0.6],
  ]

  return (
    <div className='h-full rounded-[32px] border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all'>
      <div>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-[#C49BFF] flex items-center justify-center font-bold'>
              <Target className='w-4 h-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>Độ Khớp Thị Trường</span>
          </div>
          <button
            type='button'
            aria-label='Tùy chọn'
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer'
          >
            <MoreVertical className='w-4 h-4' />
          </button>
        </div>

        {/* Big Number & Badge */}
        <div className='mt-4 flex items-baseline gap-3'>
          <div className='text-4xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            88<span className='text-2xl text-purple-600 dark:text-[#C49BFF]'>%</span>
          </div>
          <span className='inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold'>
            <ArrowUpRight className='w-3 h-3' />
            +10%
          </span>
        </div>
        <p className='text-xs text-gray-400 dark:text-[#A29FA8] mt-0.5'>Chỉ số sẵn sàng ứng tuyển IT 2026</p>
      </div>

      {/* Dotted Matrix Grid Chart - Đúng chuẩn ảnh mẫu */}
      <div className='my-4 flex items-center justify-between gap-1.5 px-1 py-2'>
        {matrixData.map((col, colIdx) => (
          <div key={colIdx} className='flex flex-col gap-2 items-center'>
            {col.map((val, rowIdx) => (
              <div
                key={rowIdx}
                className='w-3.5 h-3.5 rounded-full transition-all duration-300'
                style={{
                  backgroundColor: `rgba(147, 112, 219, ${val})`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className='pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500 dark:text-[#A29FA8]'>
        <span>Mức độ cạnh tranh:</span>
        <span className='font-bold text-emerald-600 dark:text-emerald-400'>Rất Cao (Tier 1)</span>
      </div>
    </div>
  )
}
