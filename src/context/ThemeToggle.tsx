import { Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from './ThemeContext'

interface ThemeToggleProps {
  className?: string
}

/**
 * Nút chuyển đổi Theme Sáng / Tối
 * - Vùng chạm chuẩn Mobile tối thiểu 44x44px
 * - Icon nét mảnh, hiệu ứng chuyển đổi xoay và biến đổi kích thước mượt mà (350ms)
 * - Tương thích Accessibility (aria-label, aria-pressed, điều hướng phím)
 */
export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  const label = isDark ? t('common.switchToLight') : t('common.switchToDark')

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={`relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 sm:w-9 sm:h-9 rounded-xl border transition-all duration-200 select-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#121114] active:scale-95 hover:scale-[1.03] ${
        isDark
          ? 'bg-[#1A191C] hover:bg-[#232227] border-white/10 text-[#ECE9E4] shadow-xs'
          : 'bg-white hover:bg-gray-100/80 border-gray-200 text-gray-700 shadow-xs'
      } ${className}`}
    >
      {/* Icon Mặt Trời (hiển thị khi Light mode, xoay lùi và thu nhỏ khi sang Dark mode) */}
      <span
        aria-hidden='true'
        className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? 'opacity-0 rotate-90 scale-50 pointer-events-none' : 'opacity-100 rotate-0 scale-100 text-amber-500'
        }`}
      >
        <Sun className='w-4 h-4 sm:w-[18px] sm:h-[18px]' strokeWidth={1.75} />
      </span>

      {/* Icon Mặt Trăng (hiển thị khi Dark mode, xoay và phóng to lên khi kích hoạt) */}
      <span
        aria-hidden='true'
        className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? 'opacity-100 rotate-0 scale-100 text-[#A99DFF]' : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
        }`}
      >
        <Moon className='w-4 h-4 sm:w-[18px] sm:h-[18px]' strokeWidth={1.75} />
      </span>
    </button>
  )
}
