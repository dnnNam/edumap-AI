import type { UsageItem } from '../../../types/api/billing.type'
import { formatCycleDate, USAGE_FEATURE_META, USAGE_WINDOW_LABEL } from '../../../utils/billing'

export default function UsageCard({ item }: { item: UsageItem }) {
  const meta = USAGE_FEATURE_META[item.featureCode]
  const Icon = meta.icon
  const isUnlimited = item.remaining === null
  const percentUsed = isUnlimited || item.limit === 0 ? 0 : Math.min(100, (item.usage / item.limit) * 100)

  return (
    <div className='rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#232227] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center'>
            <Icon className='w-5 h-5 text-gray-500 dark:text-[#A29FA8]' />
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>{meta.title}</p>
            <p className='text-xs text-gray-500 dark:text-[#A29FA8]'>{meta.subtitle}</p>
          </div>
        </div>
        <span className='text-[11px] font-medium text-gray-500 dark:text-[#A29FA8] bg-gray-100 dark:bg-white/10 rounded-full px-2 py-1'>
          {USAGE_WINDOW_LABEL[item.usageWindow] ?? item.usageWindow}
        </span>
      </div>

      <div className='mt-4 flex items-end justify-between text-sm'>
        <span className='text-gray-900 dark:text-[#ECE9E4] font-medium'>
          {item.usage} of {isUnlimited ? '∞' : item.limit} used
        </span>
        <span className='text-gray-500 dark:text-[#A29FA8]'>{isUnlimited ? 'Unlimited' : `${item.remaining} remaining`}</span>
      </div>

      <div className='mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden'>
        <div className='h-full rounded-full bg-indigo-600 dark:bg-[#5F2CFF] transition-all' style={{ width: `${percentUsed}%` }} />
      </div>

      <div className='mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#A29FA8]'>
        Cycle started {formatCycleDate(item.usageDate)}
      </div>
    </div>
  )
}
