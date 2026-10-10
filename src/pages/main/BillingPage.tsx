import { useState } from 'react'
import { Check, CreditCard, FileText, Minus } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

import { useBillingPlansQuery, useCreatePaymentMutation, useMySubscriptionQuery } from '../../hooks/billingQuery'
import { type PaymentOrder, type PlanCode } from '../../types/api/billing.type'
import {
  FEATURE_ROWS,
  formatDate,
  formatPrice,
  getCardHighlights,
  getPlanDescription,
  getPlanName,
  getYearlySavingBadge,
  PLAN_RANK,
} from '../../utils/billing'
import PaymentModal from '../../components/layouts/billing/PaymentModal'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useBillingPlansQuery()
  const { data: meData, isLoading: isMeLoading } = useMySubscriptionQuery()

  // Tạo đơn thanh toán + đơn đang hiển thị trong modal QR (phải đặt trước các return sớm bên dưới)
  const createPayment = useCreatePaymentMutation()
  const [payment, setPayment] = useState<PaymentOrder | null>(null)

  const plans = data?.data?.data ?? []
  const mySub = meData?.data?.data
  const currentPlanCode: PlanCode = mySub?.planCode ?? 'FREE'
  const currentPlan = plans.find((p) => p.code === currentPlanCode)

  const handleUpgrade = (planCode: PlanCode) => {
    if (planCode === 'FREE') return // BE không cho tạo payment gói FREE
    createPayment.mutate({ planCode }, { onSuccess: (res) => setPayment(res.data.data) })
  }

  if (isLoading || isMeLoading) {
    return <AppLoadingSkeleton />
  }

  if (isError || plans.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center text-sm text-red-500'>
        {t('billing.subscription.loadError')}
      </div>
    )
  }

  return (
    <div className='h-full min-h-0 overflow-y-auto bg-gray-50 dark:bg-[#121114] p-6'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('billing.subscription.title')}</h1>
      <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>
        <Trans
          i18nKey='billing.subscription.youreOn'
          values={{ plan: currentPlan ? getPlanName(currentPlan.code, currentPlan.name) : '—' }}
          components={{ b: <span className='font-semibold text-gray-900 dark:text-[#ECE9E4]' /> }}
        />
        {mySub?.expiresAt && mySub.isActive && (
          <span className='text-gray-400 dark:text-[#A29FA8]'>
            {t('billing.subscription.renews', { date: formatDate(mySub.expiresAt) })}
          </span>
        )}
      </p>

      {/* 3 plan cards */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-5'>
        {plans.map((plan) => {
          const { amount, period } = formatPrice(plan)
          const isCurrent = plan.code === currentPlanCode
          const isDowngrade = !isCurrent && PLAN_RANK[plan.code] < PLAN_RANK[currentPlanCode]
          const isPopular = plan.code === 'PRO_STUDENT'
          const savingBadge = getYearlySavingBadge(plan, plans)
          const isCreatingThis = createPayment.isPending && createPayment.variables?.planCode === plan.code

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white dark:bg-[#1A191C] p-6 pt-8 ${
                isCurrent
                  ? 'border-gray-900 dark:border-[#5F2CFF]'
                  : isPopular
                    ? 'border-indigo-200 dark:border-[#5F2CFF]/40'
                    : 'border-gray-200 dark:border-white/[0.08]'
              }`}
            >
              {isCurrent && (
                <span className='absolute -top-3 left-6 bg-gray-900 dark:bg-[#5F2CFF] text-white text-[11px] font-medium px-3 py-1 rounded-full'>
                  {t('billing.subscription.currentPlan')}
                </span>
              )}
              {!isCurrent && isPopular && (
                <span className='absolute -top-3 left-6 bg-indigo-600 dark:bg-[#5F2CFF] text-white text-[11px] font-medium px-3 py-1 rounded-full'>
                  {t('billing.subscription.mostPopular')}
                </span>
              )}
              {!isCurrent && savingBadge && (
                <span className='absolute -top-3 right-6 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-medium px-3 py-1 rounded-full'>
                  {savingBadge}
                </span>
              )}

              <h3 className='text-[17px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                {getPlanName(plan.code, plan.name)}
              </h3>
              {/* min-h giữ chỗ cho 2 dòng để khối giá/nút bên dưới luôn thẳng hàng giữa 3 card */}
              <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8] leading-5 min-h-[40px]'>
                {getPlanDescription(plan.code, plan.description)}
              </p>

              <div className='mt-4 flex items-baseline gap-1'>
                <span className='text-3xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{amount}</span>
                <span className='text-sm text-gray-400 dark:text-[#A29FA8]'>{period}</span>
              </div>

              <button
                type='button'
                disabled={isCurrent || createPayment.isPending}
                onClick={() => {
                  // Chỉ Upgrade mới tạo đơn; Downgrade giữ nguyên như cũ (chưa có API hạ gói)
                  if (!isCurrent && !isDowngrade) handleUpgrade(plan.code)
                }}
                className={`mt-5 w-full rounded-xl py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-[#A29FA8] cursor-not-allowed'
                    : isDowngrade
                      ? 'border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-50 dark:hover:bg-[#232227] disabled:opacity-60 disabled:cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-[#5F2CFF] dark:hover:bg-[#4B1FD6] text-white disabled:opacity-60 disabled:cursor-not-allowed'
                }`}
              >
                {isCurrent
                  ? t('billing.subscription.currentPlan')
                  : isDowngrade
                    ? t('billing.subscription.downgrade')
                    : isCreatingThis
                      ? t('billing.subscription.creating')
                      : t('billing.subscription.upgrade')}
              </button>

              <ul className='mt-5 space-y-2.5'>
                {getCardHighlights(plan).map((label) => (
                  <li key={label} className='flex items-center gap-2 text-sm text-gray-600 dark:text-[#ECE9E4]'>
                    <Check className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF] shrink-0' />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Feature comparison table */}
      <div className='mt-6 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 overflow-x-auto'>
        <h2 className='text-base font-semibold text-gray-900 dark:text-[#ECE9E4] mb-4'>
          {t('billing.subscription.featureComparison')}
        </h2>
        <table className='w-full text-sm border-collapse min-w-[560px]'>
          <thead>
            <tr className='border-b border-gray-100 dark:border-white/[0.06]'>
              <th className='text-left font-medium text-gray-400 dark:text-[#A29FA8] pb-3 pr-4'>
                {t('billing.subscription.feature')}
              </th>
              {plans.map((plan) => {
                const { amount, period } = formatPrice(plan)
                return (
                  <th key={plan.id} className='text-left font-medium pb-3 pr-4'>
                    <span className='block text-gray-900 dark:text-[#ECE9E4]'>{getPlanName(plan.code, plan.name)}</span>
                    <span className='block text-xs font-normal text-gray-400 dark:text-[#A29FA8]'>
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
              <tr key={row.labelKey} className='border-b border-gray-50 dark:border-white/[0.04] last:border-0'>
                <td className='py-3 pr-4 font-medium text-gray-900 dark:text-[#ECE9E4] whitespace-nowrap'>
                  {t(row.labelKey)}
                </td>
                {plans.map((plan) => {
                  const value = row.render(plan)
                  return (
                    <td key={plan.id} className='py-3 pr-4 text-gray-600 dark:text-[#B5B1BA] whitespace-nowrap'>
                      {value === '—' ? <Minus className='w-3.5 h-3.5 text-gray-300 dark:text-gray-600' /> : value}
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
        <div className='rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5'>
          <div className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
            <CreditCard className='w-4 h-4 text-gray-400 dark:text-[#A29FA8]' />
            {t('billing.subscription.paymentMethod')}
          </div>
          <p className='mt-2 text-sm text-gray-500 dark:text-[#A29FA8]'>
            {currentPlanCode === 'FREE' ? t('billing.subscription.noPayment') : t('billing.subscription.paidVia')}
          </p>
        </div>
        <div className='rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5'>
          <div className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
            <FileText className='w-4 h-4 text-gray-400 dark:text-[#A29FA8]' />
            {t('billing.subscription.billingHistory')}
          </div>
          {mySub?.latestPayment ? (
            <div className='mt-2 text-sm text-gray-600 dark:text-[#ECE9E4] space-y-1'>
              <p>
                {t('billing.subscription.order')}{' '}
                <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{mySub.latestPayment.orderCode}</span> ·{' '}
                {mySub.latestPayment.amountVnd.toLocaleString('en-US')}₫
              </p>
              <p className='text-xs text-gray-400 dark:text-[#A29FA8]'>
                {mySub.latestPayment.status}
                {mySub.latestPayment.paidAt && ` · ${formatDate(mySub.latestPayment.paidAt)}`}
              </p>
            </div>
          ) : (
            <p className='mt-2 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('billing.subscription.noInvoices')}</p>
          )}
        </div>
      </div>

      {/* Modal QR thanh toán: tự đóng khi /billing/me trả về gói mới */}
      {payment && (
        <PaymentModal
          payment={payment}
          plan={plans.find((p) => p.code === payment.planCode)}
          onClose={() => setPayment(null)}
        />
      )}
    </div>
  )
}
