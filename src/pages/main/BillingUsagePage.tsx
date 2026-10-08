import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'
import { useBillingUsageQuery } from '../../hooks/billingQuery'

import { PLAN_COPY_EN } from '../../utils/billing'

import UsageCard from '../../components/layouts/billing-usage/UsageCard'
import StatCard from '../../components/layouts/billing-usage/StatCard'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'

export default function BillingUsagePage() {
  const { data, isLoading, isError } = useBillingUsageQuery()
  const payload = data?.data?.data
  const usage = payload?.usage ?? []

  if (isLoading) return <AppLoadingSkeleton />

  if (isError || !payload) {
    return (
      <div className='flex-1 flex items-center justify-center text-sm text-red-500'>
        Couldn't load usage data. Please try again.
      </div>
    )
  }

  const planLabel = PLAN_COPY_EN[payload.planCode]?.name ?? payload.planCode

  // Tổng hợp 3 số liệu ở đầu trang. Nếu có bất kỳ feature nào remaining = null (unlimited)
  // thì tổng "Remaining" cũng coi là unlimited, không cộng dồn con số sai lệch.
  const totalQuota = usage.reduce((sum, u) => sum + u.limit, 0)
  const totalUsed = usage.reduce((sum, u) => sum + u.usage, 0)
  const hasUnlimited = usage.some((u) => u.remaining === null)
  const totalRemaining = hasUnlimited ? null : usage.reduce((sum, u) => sum + (u.remaining ?? 0), 0)

  return (
    <div className='h-full min-h-0 overflow-y-auto bg-gray-50 dark:bg-[#121114] p-6'>
      <div className='flex items-center justify-between'>
        <Link
          to='/subscription'
          className='inline-flex items-center gap-1 text-sm text-gray-500 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] transition'
        >
          <ChevronLeft className='w-4 h-4' />
          Subscription
        </Link>
        <span className='inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 dark:text-[#A99DFF] bg-indigo-50 dark:bg-[#5F2CFF]/15 border border-indigo-100 dark:border-[#5F2CFF]/20 rounded-full px-3 py-1'>
          {planLabel.toUpperCase()}
        </span>
      </div>

      <h1 className='mt-4 text-2xl font-bold text-gray-900 dark:text-[#ECE9E4]'>Billing usage</h1>
      <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>
        Track how you use your <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{planLabel}</span> plan allowances.
      </p>

      {/* 3 stat cards */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-5'>
        <StatCard label='Total quota' value={String(totalQuota)} />
        <StatCard label='Used this cycle' value={String(totalUsed)} />
        <StatCard label='Remaining' value={totalRemaining ?? 'Unlimited'} />
      </div>

      {/* Feature usage cards */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
        {usage.map((item) => (
          <UsageCard key={item.featureCode} item={item} />
        ))}
      </div>

      {/* Upsell banner */}
      <div className='mt-6 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5 flex items-center justify-between flex-wrap gap-3'>
        <div>
          <p className='text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>Need more usage?</p>
          <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>Upgrade your plan for higher limits on every feature.</p>
        </div>
        <Link
          to='/subscription'
          className='rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-[#5F2CFF] dark:hover:bg-[#4B1FD6] text-white text-sm font-medium px-4 py-2 transition-colors shrink-0'
        >
          View plans
        </Link>
      </div>
    </div>
  )
}
