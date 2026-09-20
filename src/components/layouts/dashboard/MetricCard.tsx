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
    <div className='bg-white border border-gray-200 rounded-2xl p-6 flex items-start justify-between gap-4'>
      <div>
        <p className='text-sm text-gray-500'>{label}</p>
        {loading ? (
          <div className='mt-3 h-10 w-24 rounded-lg bg-gray-100 animate-pulse' />
        ) : (
          <p className='mt-2 text-[40px] leading-none font-bold text-gray-900 tracking-tight'>{value}</p>
        )}
        <p className='mt-3 text-xs text-gray-500'>{hint}</p>
      </div>
      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${iconClassName}`}>
        <Icon className='w-[18px] h-[18px]' />
      </div>
    </div>
  )
}
