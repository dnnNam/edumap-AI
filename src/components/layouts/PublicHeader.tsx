import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Logo from '../ui/Logo'
import LanguageToggle from '../ui/LanguageToggle'
import ThemeToggle from '../ui/ThemeToggle'

const NAV_LINKS = [
  { labelKey: 'public.features', href: '#features' },
  { labelKey: 'public.pricing', href: '#pricing' },
  { labelKey: 'public.faq', href: '#faq' },
]

interface HeaderProps {
  onSignIn?: () => void
  onGetStarted?: () => void
}

export default function PublicHeader({ onSignIn, onGetStarted }: HeaderProps) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='sticky top-0 z-40 bg-[#FAFAF9]/80 dark:bg-[#121114]/80 backdrop-blur-xl border-b border-black/[0.05] dark:border-white/[0.06] transition-all duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4'>
        {/* Left: Logo & Desktop Navigation */}
        <div className='flex items-center gap-6 sm:gap-10 shrink-0 min-w-0'>
          <Logo />
          <nav className='hidden md:flex items-center gap-8'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className='text-[15px] font-medium text-slate-500 hover:text-slate-900 dark:text-[#A29FA8] dark:hover:text-[#ECE9E4] transition-colors duration-200'
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Actions: Clean, well-spaced responsive layout */}
        <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
          <LanguageToggle />
          <ThemeToggle />

          <button
            type='button'
            onClick={onSignIn}
            className='hidden md:inline-block text-[15px] font-medium text-slate-700 hover:text-slate-900 dark:text-[#ECE9E4] dark:hover:text-white px-2.5 py-1.5 transition-colors duration-200 cursor-pointer'
          >
            {t('common.signIn')}
          </button>

          {/* Nút Get Started: Ẩn trên màn hình mobile nhỏ để nhường chỗ thở cho Logo, hiển thị trên tablet & desktop */}
          <button
            type='button'
            onClick={onGetStarted}
            className='hidden sm:inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm sm:text-[15px] font-semibold px-4 sm:px-5 py-2.5 transition-all duration-200 shadow-[0_2px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_16px_rgba(79,70,229,0.35)] cursor-pointer'
          >
            {t('common.getStarted')}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={t('header.toggleMenu')}
            className='md:hidden p-2 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-slate-700 dark:text-[#ECE9E4] hover:bg-black/[0.04] dark:hover:bg-white/5 transition w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer active:scale-95 shrink-0'
          >
            {mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-[#FAFAF9]/95 dark:bg-[#121114]/95 backdrop-blur-xl border-b border-black/[0.05] dark:border-white/[0.06] px-5 pt-3 pb-6 space-y-4 shadow-xl'>
          <nav className='flex flex-col gap-1'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className='text-[15px] font-medium text-slate-600 hover:text-slate-900 dark:text-[#A29FA8] dark:hover:text-[#ECE9E4] hover:bg-black/[0.03] dark:hover:bg-white/5 px-3.5 py-2.5 rounded-xl transition'
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
          <div className='pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-2'>
            <button
              type='button'
              onClick={() => {
                setMobileMenuOpen(false)
                onSignIn?.()
              }}
              className='w-full text-left text-[15px] font-medium text-slate-900 dark:text-[#ECE9E4] px-3.5 py-2.5 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/5 transition'
            >
              {t('common.signIn')}
            </button>
            <button
              type='button'
              onClick={() => {
                setMobileMenuOpen(false)
                onGetStarted?.()
              }}
              className='w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-3 transition shadow-sm'
            >
              {t('common.getStarted')}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
