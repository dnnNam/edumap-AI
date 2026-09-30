import { Search, Bell, Sparkles, ChevronRight, Menu } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useUnreadNotificationsCount } from '../../hooks/notificationQuery'
import Avatar from '../ui/Avatar'

interface AppHeaderProps {
  logoText?: string
  badgeText?: string
  breadcrumbs?: string[]
  userName?: string
  userPlan?: string
  onToggleMenu?: () => void
}

export default function AppHeader({
  logoText = 'EduMap AI',
  badgeText = 'Demo',
  breadcrumbs = ['Home', 'Chat'],
  userName = 'Alex Johnson',
  userPlan = 'Free plan',
  onToggleMenu,
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { unreadCount } = useUnreadNotificationsCount()

  return (
    <header className='w-full h-16 shrink-0 bg-white border-b border-gray-200 flex items-stretch'>
      {/* Left: Logo block */}
      <div className='w-auto lg:w-60 shrink-0 flex items-center gap-2.5 px-3 sm:px-5'>
        {/* Mobile menu toggle */}
        <button
          type='button'
          onClick={onToggleMenu}
          aria-label='Toggle navigation menu'
          className='lg:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition'
        >
          <Menu className='w-5 h-5' />
        </button>

        <div className='w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0'>
          <Sparkles className='w-4 h-4 text-white' />
        </div>
        <span className='font-semibold text-gray-900 text-base hidden xs:inline'>{logoText}</span>
        <span className='hidden sm:inline text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5'>
          {badgeText}
        </span>
      </div>

      {/* Right: Breadcrumb + Search + Notifications + Profile */}
      <div className='flex-1 flex items-center justify-between px-3 sm:px-6 min-w-0'>
        <nav className='hidden sm:flex items-center gap-1.5 text-sm text-gray-500 truncate'>
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb} className='flex items-center gap-1.5'>
              {i > 0 && <ChevronRight className='w-3.5 h-3.5 text-gray-300' />}
              <span className={i === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>{crumb}</span>
            </div>
          ))}
        </nav>

        <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
          <div className='hidden md:flex items-center gap-2 w-52 lg:w-64 h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-gray-400 focus-within:border-gray-300'>
            <Search className='w-4 h-4 shrink-0' />
            <input
              type='text'
              placeholder='Search...'
              className='bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full'
            />
          </div>

          <button
            type='button'
            onClick={() => navigate('/notifications')}
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            className='relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors'
          >
            <Bell className='w-5 h-5 text-gray-500' />
            {unreadCount > 0 && (
              <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-semibold leading-none ring-2 ring-white'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button
            type='button'
            onClick={() => navigate('/profile')}
            className='flex items-center gap-2.5 pl-1 hover:bg-gray-50 p-1 rounded-lg transition'
          >
            <Avatar className='w-8 h-8 sm:w-9 sm:h-9' />
            <div className='hidden sm:flex flex-col items-start leading-tight'>
              <span className='text-sm font-medium text-gray-900 max-w-[120px] truncate'>{userName}</span>
              <span className='text-xs text-gray-500'>{userPlan}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
