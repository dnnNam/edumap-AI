import { Bell, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useUnreadNotificationsCount } from '../../hooks/notificationQuery'
import { getRoleFromLS } from '../../utils/auth'
import Avatar from '../ui/Avatar'
import LanguageToggle from '../ui/LanguageToggle'
import ThemeToggle from '../ui/ThemeToggle'

interface AppHeaderProps {
  logoText?: string
  badgeText?: string
  userName?: string
  userPlan?: string
  onToggleMenu?: () => void
}

// Tách riêng để hook đếm thông báo chỉ chạy khi component này được render (admin thì không render)
function NotificationBell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { unreadCount } = useUnreadNotificationsCount()

  return (
    <button
      type='button'
      onClick={() => navigate('/notifications')}
      aria-label={unreadCount > 0 ? t('header.notificationsUnread', { count: unreadCount }) : t('header.notifications')}
      className='relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer'
    >
      <Bell className='w-5 h-5 text-gray-500 dark:text-[#A29FA8]' />
      {unreadCount > 0 && (
        <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-semibold leading-none ring-2 ring-white dark:ring-[#1A191C]'>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export default function AppHeader({
  logoText = 'EduMap AI',
  badgeText = 'Demo',
  userName = 'Alex Johnson',
  userPlan,
  onToggleMenu,
}: AppHeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAdmin = getRoleFromLS() === 'ADMIN'

  return (
    <header className='w-full h-16 shrink-0 bg-white dark:bg-[#1A191C] border-b border-gray-200 dark:border-white/10 flex items-stretch transition-colors'>
      {/* Left: Logo block */}
      <div className='w-auto lg:w-60 shrink-0 flex items-center gap-2.5 px-3 sm:px-5'>
        {/* Mobile menu toggle */}
        <button
          type='button'
          onClick={onToggleMenu}
          aria-label={t('header.toggleMenu')}
          className='lg:hidden p-1.5 rounded-lg text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer'
        >
          <Menu className='w-5 h-5' />
        </button>

        <div className='w-8 h-8 rounded-lg bg-[#131428] flex items-center justify-center shrink-0 p-1 shadow-xs'>
          <img src='/favicon.svg' alt='EduMap AI' className='w-full h-full object-contain' />
        </div>
        <span className='font-semibold text-gray-900 dark:text-[#ECE9E4] text-base hidden xs:inline'>{logoText}</span>
        <span className='hidden sm:inline text-xs text-gray-500 dark:text-[#A29FA8] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-2 py-0.5'>
          {badgeText}
        </span>
      </div>

      {/* Right: Language + Theme Toggle + Notifications (user only) + Profile */}
      <div className='flex-1 flex items-center justify-end px-3 sm:px-6 min-w-0'>
        <div className='flex items-center gap-2 sm:gap-3'>
          <LanguageToggle />
          <ThemeToggle />

          {!isAdmin && <NotificationBell />}

          <button
            type='button'
            onClick={() => navigate('/profile')}
            className='flex items-center gap-2.5 pl-1 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-lg transition cursor-pointer'
          >
            <Avatar className='w-8 h-8 sm:w-9 sm:h-9' />
            <div className='hidden sm:flex flex-col items-start leading-tight'>
              <span className='text-sm font-medium text-gray-900 dark:text-[#ECE9E4] max-w-[120px] truncate'>
                {userName}
              </span>
              <span className='text-xs text-gray-500 dark:text-[#A29FA8]'>{userPlan ?? t('header.freePlan')}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
