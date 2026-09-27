import { Check, CreditCard, FileText, Minus } from 'lucide-react'
import { useBillingPlansQuery } from '../../hooks/billingQuery'
import type { PlanCode } from '../../types/api/Billing.type'
import { FEATURE_ROWS, formatPrice, getCardHighlights, getYearlySavingBadge, PLAN_COPY_EN } from '../../utils/billing'

// TODO: replace with the user's real plan (fetch from /users/me or /billing/subscription once the BE has that endpoint).
// Hardcoded to FREE for now to match the mock ("You're on Free.")
const CURRENT_PLAN_CODE: PlanCode = 'FREE'

export default function SubscriptionPage() {
  const { data, isLoading, isError } = useBillingPlansQuery()
  const plans = data?.data?.data ?? []
  const currentPlan = plans.find((p) => p.code === CURRENT_PLAN_CODE)

  if (isLoading) {
    return <div className='flex-1 flex items-center justify-center text-sm text-gray-400'>Loading plans...</div>
  }

  if (isError || plans.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center text-sm text-red-500'>
        Couldn't load the plan list. Please try again.
      </div>
    )
  }

  return (
    <div className='h-full min-h-0 overflow-y-auto bg-gray-50 p-6'>
      <h1 className='text-2xl font-bold text-gray-900'>Subscription</h1>
      <p className='mt-1 text-sm text-gray-500'>
        You're on{' '}
        <span className='font-semibold text-gray-900'>
          {(currentPlan && PLAN_COPY_EN[currentPlan.code]?.name) ?? currentPlan?.name ?? '—'}
        </span>
        .
      </p>

      {/* 3 plan cards */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-5'>
        {plans.map((plan) => {
          const { amount, period } = formatPrice(plan)
          const isCurrent = plan.code === CURRENT_PLAN_CODE
          const isPopular = plan.code === 'PRO_STUDENT'
          const savingBadge = getYearlySavingBadge(plan, plans)
          const copy = PLAN_COPY_EN[plan.code]

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-6 pt-8 ${
                isCurrent ? 'border-gray-900' : isPopular ? 'border-indigo-200' : 'border-gray-200'
              }`}
            >
              {isCurrent && (
                <span className='absolute -top-3 left-6 bg-gray-900 text-white text-[11px] font-medium px-3 py-1 rounded-full'>
                  Current plan
                </span>
              )}
              {!isCurrent && isPopular && (
                <span className='absolute -top-3 left-6 bg-indigo-600 text-white text-[11px] font-medium px-3 py-1 rounded-full'>
                  Most popular
                </span>
              )}
              {!isCurrent && savingBadge && (
                <span className='absolute -top-3 right-6 bg-amber-100 text-amber-700 text-[11px] font-medium px-3 py-1 rounded-full'>
                  {savingBadge}
                </span>
              )}

              <h3 className='text-[17px] font-semibold text-gray-900'>{copy?.name ?? plan.name}</h3>
              {/* min-h reserves room for 2 lines so the price/button block below always starts
                  at the same height across all 3 cards, regardless of description length */}
              <p className='mt-1 text-sm text-gray-500 leading-5 min-h-[40px]'>
                {copy?.description ?? plan.description}
              </p>

              <div className='mt-4 flex items-baseline gap-1'>
                <span className='text-3xl font-bold text-gray-900'>{amount}</span>
                <span className='text-sm text-gray-400'>{period}</span>
              </div>

              <button
                type='button'
                disabled={isCurrent}
                className={`mt-5 w-full rounded-xl py-2.5 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isCurrent ? 'Current plan' : 'Upgrade'}
              </button>

              <ul className='mt-5 space-y-2.5'>
                {getCardHighlights(plan).map((label) => (
                  <li key={label} className='flex items-center gap-2 text-sm text-gray-600'>
                    <Check className='w-4 h-4 text-indigo-600 shrink-0' />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Feature comparison table */}
      <div className='mt-6 rounded-2xl border border-gray-200 bg-white p-6 overflow-x-auto'>
        <h2 className='text-base font-semibold text-gray-900 mb-4'>Feature comparison</h2>
        <table className='w-full text-sm border-collapse min-w-[560px]'>
          <thead>
            <tr className='border-b border-gray-100'>
              <th className='text-left font-medium text-gray-400 pb-3 pr-4'>Feature</th>
              {plans.map((plan) => {
                const { amount, period } = formatPrice(plan)
                const copy = PLAN_COPY_EN[plan.code]
                return (
                  <th key={plan.id} className='text-left font-medium pb-3 pr-4'>
                    <span className='block text-gray-900'>{copy?.name ?? plan.name}</span>
                    <span className='block text-xs font-normal text-gray-400'>
                      {amount}
                      {period}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((row) => (
              <tr key={row.label} className='border-b border-gray-50 last:border-0'>
                <td className='py-3 pr-4 font-medium text-gray-900 whitespace-nowrap'>{row.label}</td>
                {plans.map((plan) => {
                  const value = row.render(plan)
                  return (
                    <td key={plan.id} className='py-3 pr-4 text-gray-600 whitespace-nowrap'>
                      {value === '—' ? <Minus className='w-3.5 h-3.5 text-gray-300' /> : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment method + Billing history */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5'>
          <div className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
            <CreditCard className='w-4 h-4 text-gray-400' />
            Payment method
          </div>
          <p className='mt-2 text-sm text-gray-500'>
            {currentPlan?.code === 'FREE'
              ? 'No payment method on file. Upgrade to unlock paid features.'
              : 'Updating payment info...'}
          </p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-5'>
          <div className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
            <FileText className='w-4 h-4 text-gray-400' />
            Billing history
          </div>
          <p className='mt-2 text-sm text-gray-500'>No invoices yet.</p>
        </div>
      </div>
    </div>
  )
}
