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
      className={`inline-flex items-center justify-center gap-1.5 h-9 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1A191C] hover:bg-gray-100/80 dark:hover:bg-[#232227] text-gray-700 dark:text-[#ECE9E4] text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0 ${className}`}
    >
      <Languages className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-[#A99DFF]' strokeWidth={1.75} />
      <span>{isVi ? 'VI' : 'EN'}</span>
    </button>
  )
}
