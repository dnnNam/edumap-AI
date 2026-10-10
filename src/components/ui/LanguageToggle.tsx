import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LanguageToggleProps {
  className?: string
}

/** Nút đổi ngôn ngữ VI <-> EN, cùng kiểu dáng với ThemeToggle. Lưu lựa chọn vào localStorage. */
export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { i18n, t } = useTranslation()
  const isVi = i18n.language.startsWith('vi')
  const next = isVi ? 'en' : 'vi'

  return (
    <button
      type='button'
      onClick={() => i18n.changeLanguage(next)}
      aria-label={t('common.language')}
      title={t('common.language')}
      className={`inline-flex items-center justify-center gap-1.5 h-10 sm:h-9 px-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A191C] hover:bg-gray-100/80 dark:hover:bg-[#232227] text-gray-700 dark:text-[#ECE9E4] text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer select-none active:scale-95 ${className}`}
    >
      <Languages className='w-4 h-4' strokeWidth={1.75} />
      {isVi ? 'VI' : 'EN'}
    </button>
  )
}
