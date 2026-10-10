import { useQueryClient } from '@tanstack/react-query'
import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Bell,
  BookOpen,
  Clock,
  FolderOpen,
  Gauge,
  GitBranch,
  Layers,
  LayoutGrid,
  Library,
  LogOut,
  MessageSquare,
  Settings,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router'
import { clearLS, getRoleFromLS } from '../../utils/auth'

interface NavItem {
  icon: LucideIcon
  labelKey: string
  to: string
  badge?: number
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutGrid, labelKey: 'nav.dashboard', to: '/dashboard', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: MessageSquare, labelKey: 'nav.aiMentor', to: '/chat', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: Upload, labelKey: 'nav.upload', to: '/upload', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: Share2, labelKey: 'nav.skillTree', to: '/skill-tree', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: BookOpen, labelKey: 'nav.resources', to: '/resources', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: Clock, labelKey: 'nav.history', to: '/resources/history', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: FolderOpen, labelKey: 'nav.portfolio', to: '/portfolio', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: TrendingUp, labelKey: 'nav.jobTrending', to: '/jobs/trending', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: Sparkles, labelKey: 'nav.jobAnalysis', to: '/jobs/analysis', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: User, labelKey: 'nav.profile', to: '/profile', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },

  {
    icon: Bell,
    labelKey: 'nav.notifications',
    to: '/notifications',
    badge: 7,
    roles: ['STUDENT', 'MENTOR', 'MODERATOR'],
  },
]

const ACCOUNT_ITEMS: NavItem[] = [
  { icon: Award, labelKey: 'nav.subscription', to: '/subscription', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: Gauge, labelKey: 'nav.usage', to: '/usage', roles: ['STUDENT', 'MENTOR', 'MODERATOR'] },
  { icon: Settings, labelKey: 'nav.settings', to: '/settings' },
  { icon: Shield, labelKey: 'nav.admin', to: '/admin', roles: ['ADMIN'] },
  { icon: Layers, labelKey: 'nav.skills', to: '/admin/skills', roles: ['ADMIN'] },
  { icon: GitBranch, labelKey: 'nav.skillTrees', to: '/admin/skill-trees', roles: ['ADMIN'] },
  { icon: Library, labelKey: 'nav.resources', to: '/admin/resources', roles: ['ADMIN'] },
]

export interface AppAsideProps {
  onUpgradeClick?: () => void
  onClose?: () => void
}

function NavButton({ icon: Icon, labelKey, to, badge, onClick }: NavItem & { onClick?: () => void }) {
  const { t } = useTranslation()
  const isExactMatchOnly = to === '/resources' || to === '/admin'

  return (
    <NavLink
      to={to}
      end={isExactMatchOnly}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-[#ECE9E4] font-medium'
            : 'text-gray-600 hover:bg-gray-50 dark:text-[#A29FA8] dark:hover:bg-white/5 dark:hover:text-[#ECE9E4]'
        }`
      }
    >
      <span className='flex items-center gap-2.5'>
        <Icon className='w-4 h-4' />
        {t(labelKey)}
      </span>
      {badge !== undefined && (
        <span className='text-[11px] bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-[#ECE9E4] rounded-full px-1.5 py-0.5 leading-none'>
          {badge}
        </span>
      )}
    </NavLink>
  )
}

function filterByRole(items: NavItem[], userRole: string) {
  return items.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })
}

export default function AppAside({ onClose }: AppAsideProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userRole = getRoleFromLS()

  const visibleNavItems = filterByRole(NAV_ITEMS, userRole)
  const visibleAccountItems = filterByRole(ACCOUNT_ITEMS, userRole)

  const handleSignOut = () => {
    clearLS()
    queryClient.clear() // xóa cache của tài khoản cũ
    navigate('/login')
  }

  return (
    <aside className='w-60 shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A191C] flex flex-col h-full transition-colors'>
      {/* Mobile close bar */}
      <div className='lg:hidden flex items-center justify-between px-3.5 py-3 border-b border-gray-100 dark:border-white/10'>
        <span className='text-xs font-semibold text-gray-500 dark:text-[#A29FA8] uppercase tracking-wider'>
          {t('nav.menu')}
        </span>
        <button
          type='button'
          onClick={onClose}
          aria-label={t('common.close')}
          className='p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-[#A29FA8] dark:hover:text-[#ECE9E4] dark:hover:bg-white/5 transition'
        >
          <X className='w-4 h-4' />
        </button>
      </div>

      {/* Nav */}
      <div className='flex-1 overflow-y-auto px-3 py-4'>
        {visibleNavItems.length > 0 && (
          <>
            <p className='px-2 text-[11px] font-medium text-gray-400 dark:text-[#5E5A64] mb-2'>{t('nav.workspace')}</p>
            <nav className='flex flex-col gap-0.5 mb-6'>
              {visibleNavItems.map((item) => (
                <NavButton key={item.labelKey} {...item} onClick={onClose} />
              ))}
            </nav>
          </>
        )}

        {visibleAccountItems.length > 0 && (
          <>
            <p className='px-2 text-[11px] font-medium text-gray-400 dark:text-[#5E5A64] mb-2'>{t('nav.account')}</p>
            <nav className='flex flex-col gap-0.5'>
              {visibleAccountItems.map((item) => (
                <NavButton key={item.labelKey + item.to} {...item} onClick={onClose} />
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Upgrade card */}
      {userRole !== 'ADMIN' && (
        <div className='mt-5 p-2.5 shrink-0'>
          <div className='rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#232227] p-4 transition-colors'>
            <p className='text-sm font-semibold text-gray-900 dark:text-[#ECE9E4] mb-1'>{t('nav.upgradeTitle')}</p>
            <p className='text-xs text-gray-500 dark:text-[#A29FA8] mb-3'>{t('nav.upgradeDesc')}</p>
            <button
              type='button'
              onClick={() => {
                onClose?.()
                navigate('/subscription')
              }}
              className='w-full bg-indigo-600 text-white text-sm font-medium rounded-lg py-2 hover:bg-indigo-700 transition-colors cursor-pointer'
            >
              {t('common.upgrade')}
            </button>
          </div>
        </div>
      )}

      <div className='mb-7 ml-2'>
        <button
          type='button'
          onClick={handleSignOut}
          className='flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-sm text-gray-600 hover:bg-gray-50 dark:text-[#A29FA8] dark:hover:bg-white/5 dark:hover:text-[#ECE9E4] transition-colors mt-1 cursor-pointer'
        >
          <LogOut className='w-4 h-4' />
          {t('common.signOut')}
        </button>
      </div>
    </aside>
  )
}
