import { useEffect, useState } from 'react'
import { Copy, Download, X } from 'lucide-react'
import { toast } from 'sonner'
import { buildVietQrUrl, formatCountdown, type BillingPlan, type PaymentOrder } from '../../../types/api/billing.type'
import { useMySubscriptionQuery } from '../../../hooks/billingQuery'
import { formatPrice } from '../../../utils/billing'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  payment: PaymentOrder
  plan?: BillingPlan
  onClose: () => void
}

export default function PaymentModal({ payment, plan, onClose }: Props) {
  const qrUrl = buildVietQrUrl(payment)
  const expiredAtMs = new Date(payment.expiredAt).getTime()

  // Đồng hồ đếm ngược theo expiredAt của BE
  const [remaining, setRemaining] = useState(() => expiredAtMs - Date.now())
  useEffect(() => {
    const t = setInterval(() => setRemaining(expiredAtMs - Date.now()), 1000)
    return () => clearInterval(t)
  }, [expiredAtMs])

  const isExpired = remaining <= 0

  // Poll GET /billing/me khi QR còn hạn; hết hạn thì dừng poll
  const { data } = useMySubscriptionQuery(!isExpired)
  const mySub = data?.data.data
  const isPaid = !!mySub?.isActive && mySub.planCode === payment.planCode

  // Webhook SePay xong -> BE cập nhật subscription -> /billing/me trả gói mới -> đóng modal
  const queryClient = useQueryClient()
  useEffect(() => {
    if (isPaid) {
      toast.success('Payment successful! Your plan has been upgraded.')
      queryClient.invalidateQueries({ queryKey: ['profile'] }) // header + Settings + Profile cập nhật gói
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid])

  const period = plan ? formatPrice(plan).period : ''
  const amountLabel = `${payment.amountVnd.toLocaleString('en-US')}₫${period}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payment.transferContent)
      toast.success('Transfer content copied')
    } catch {
      toast.error('Could not copy. Please copy it manually.')
    }
  }

  const handleDownload = async () => {
    try {
      const blob = await (await fetch(qrUrl)).blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${payment.orderCode}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      window.open(qrUrl, '_blank') // fallback nếu bị CORS
    }
  }

  const rows: [string, string, boolean?][] = [
    ['Plan', payment.planName],
    ['Amount', amountLabel, true],
    ['Billing period', plan?.durationDays === 365 ? 'Yearly' : 'Monthly'],
    ['Payment ID', payment.orderCode],
    ['Account name', payment.accountName],
    ['Bank', payment.bankName],
    ['Description', payment.transferContent],
  ]

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={onClose}>
      <div
        className='relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-gray-50 p-5'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          aria-label='Close'
          className='absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100'
        >
          <X className='w-4 h-4' />
        </button>

        {/* QR */}
        <div className='mt-4 rounded-2xl border border-gray-200 bg-white p-5 text-center'>
          <div className='mx-auto w-56 rounded-2xl bg-white p-2 shadow-sm'>
            <img src={qrUrl} alt='Payment QR' className={`w-full ${isExpired ? 'opacity-30 grayscale' : ''}`} />
          </div>
          <p className='mt-4 text-xs text-gray-500'>{isExpired ? 'This QR has expired' : 'Expires in'}</p>
          {!isExpired && <p className='mt-1 font-mono text-xl font-bold text-gray-900'>{formatCountdown(remaining)}</p>}
        </div>

        {/* Thông tin đơn */}
        <div className='mt-4 rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100'>
          {rows.map(([label, value, bold]) => (
            <div key={label} className='flex items-center justify-between gap-4 px-4 py-3 text-sm'>
              <span className='text-gray-500'>{label}</span>
              <span className={`text-right break-all text-gray-900 ${bold ? 'font-bold' : 'font-medium'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className='mt-4 grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={handleCopy}
            className='flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm text-gray-700 hover:bg-gray-50'
          >
            <Copy className='w-4 h-4' /> Copy content
          </button>
          <button
            type='button'
            onClick={handleDownload}
            className='flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm text-gray-700 hover:bg-gray-50'
          >
            <Download className='w-4 h-4' /> Download QR
          </button>
        </div>

        <p className='mt-4 text-center text-xs text-gray-400'>
          {isExpired
            ? 'Close this window and click Upgrade again to create a new order.'
            : 'Waiting for payment… This window will close automatically once we receive your transfer.'}
        </p>
      </div>
    </div>
  )
}
