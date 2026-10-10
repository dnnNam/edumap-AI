import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

interface LogoProps {
  className?: string
  showSubtitle?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showSubtitle = false, size = 'md' }: LogoProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  return (
    <div
      onClick={() => navigate('/')}
      className={`flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
    >
      <div
        className={`${iconSizes[size]} bg-[#131428] dark:border dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-200`}
      >
        <img src='/favicon.svg' alt='EduMap AI' className='w-full h-full object-contain' />
      </div>

      <div className='flex flex-col leading-tight'>
        <div
          className={`font-black tracking-tight text-gray-900 dark:text-[#ECE9E4] ${textSizes[size]} group-hover:text-indigo-600 dark:group-hover:text-[#A99DFF] transition-colors`}
        >
          EDUMAP<span className='text-indigo-600 dark:text-[#A99DFF]'>AI</span>
        </div>
        {showSubtitle && (
          <span className='text-[8px] sm:text-[9px] tracking-wider text-gray-400 dark:text-[#85808C] font-bold uppercase'>
            {t('brand.tagline')}
          </span>
        )}
      </div>
    </div>
  )
}
