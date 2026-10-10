import { useTranslation } from 'react-i18next'
import Logo from '../ui/Logo'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'

const SOCIALS = [
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

const COLUMNS: { titleKey: string; links: string[] }[] = [
  { titleKey: 'footer.product', links: ['features', 'pricing', 'roadmap', 'changelog'] },
  { titleKey: 'footer.company', links: ['about', 'careers', 'blog', 'press'] },
  { titleKey: 'footer.legal', links: ['privacy', 'terms', 'security', 'cookies'] },
]

export default function PublicFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className='bg-[#FAFAF9] dark:bg-[#121114] border-t border-gray-200 dark:border-white/10 transition-colors'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 sm:gap-12'>
          <div>
            <Logo />
            <p className='mt-4 text-[15px] text-gray-500 dark:text-[#A29FA8] leading-relaxed max-w-xs'>
              {t('public.footerTagline')}
            </p>
            <div className='mt-5 flex items-center gap-3'>
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target='_blank'
                  rel='noreferrer'
                  className='w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] hover:border-gray-300 dark:hover:border-white/20 transition'
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.titleKey}>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t(col.titleKey)}</h3>
              <ul className='mt-4 space-y-3'>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href='#'
                      className='text-[15px] text-gray-500 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] transition'
                    >
                      {t(`footer.links.${link}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-12 sm:mt-14 pt-6 border-t border-gray-200 dark:border-white/10 text-center text-sm text-gray-400 dark:text-[#5E5A64]'>
          {t('footer.copyright', { year })}
        </div>
      </div>
    </footer>
  )
}
