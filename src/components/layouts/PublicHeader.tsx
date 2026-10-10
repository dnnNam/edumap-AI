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
    <header className='sticky top-0 z-40 bg-[#FAFAF9]/90 dark:bg-[#121114]/90 backdrop-blur border-b border-gray-200 dark:border-white/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-6 sm:gap-10'>
          <Logo />
          <nav className='hidden md:flex items-center gap-8'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className='text-[15px] text-gray-500 hover:text-gray-900 dark:text-[#A29FA8] dark:hover:text-[#ECE9E4] transition'
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-2.5 sm:gap-4'>
          <LanguageToggle />
          <ThemeToggle />

          <button
            type='button'
            onClick={onSignIn}
            className='hidden sm:inline-block text-[15px] text-gray-900 hover:text-gray-600 dark:text-[#ECE9E4] dark:hover:text-white transition'
          >
            {t('common.signIn')}
          </button>
          <button
            type='button'
            onClick={onGetStarted}
            className='rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-[15px] font-medium px-3.5 sm:px-4 py-2 transition'
          >
            {t('common.getStarted')}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={t('header.toggleMenu')}
            className='md:hidden p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/5 transition min-w-[40px] min-h-[40px] flex items-center justify-center'
          >
            {mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-[#FAFAF9] dark:bg-[#121114] border-b border-gray-200 dark:border-white/10 px-4 pt-2 pb-5 space-y-3'>
          <nav className='flex flex-col gap-1'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className='text-[15px] text-gray-600 hover:text-gray-900 dark:text-[#A29FA8] dark:hover:text-[#ECE9E4] hover:bg-gray-100/70 dark:hover:bg-white/5 px-3 py-2 rounded-lg transition'
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
          <div className='pt-2 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2'>
            <button
              type='button'
              onClick={() => {
                setMobileMenuOpen(false)
                onSignIn?.()
              }}
              className='w-full text-left text-[15px] text-gray-900 dark:text-[#ECE9E4] px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition'
            >
              {t('common.signIn')}
            </button>
            <button
              type='button'
              onClick={() => {
                setMobileMenuOpen(false)
                onGetStarted?.()
              }}
              className='w-full rounded-lg bg-indigo-600 text-white text-[15px] font-medium py-2.5 transition'
            >
              {t('common.getStarted')}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
