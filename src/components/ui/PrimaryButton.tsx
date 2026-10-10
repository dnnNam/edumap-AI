import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}

export default function PrimaryButton({
  loading = false,
  loadingText,
  children,
  className = '',
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const { t } = useTranslation()
  return (
    <button
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-medium py-2.5 text-[15px] transition ${className}`}
      {...rest}
    >
      {loading ? (loadingText ?? t('common.pleaseWait')) : children}
      {!loading && <ArrowRight className='w-4 h-4' />}
    </button>
  )
}
