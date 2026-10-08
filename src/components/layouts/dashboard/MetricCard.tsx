import { type ElementType } from 'react'

export default function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClassName,
  loading,
}: {
  label: string
  value: string
  hint: string
  icon: ElementType
  iconClassName: string
  loading: boolean
}) {
  return (
    <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex items-start justify-between gap-4 transition-colors'>
      <div>
        <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>{label}</p>
        {loading ? (
          <div className='mt-3 h-10 w-24 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse' />
        ) : (
          <p className='mt-2 text-[40px] leading-none font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>{value}</p>
        )}
        <p className='mt-3 text-xs text-gray-500 dark:text-[#85808C]'>{hint}</p>
      </div>
      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${iconClassName}`}>
        <Icon className='w-[18px] h-[18px]' />
      </div>
    </div>
  )
}
