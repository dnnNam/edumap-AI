import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  FolderOpen,
  LayoutGrid,
  LogOut,
  Map,
  MessageSquare,
  Settings,
  Share2,
  Shield,
  Upload,
  User,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import { clearLS } from '../../utils/auth'

interface NavItem {
  icon: LucideIcon
  label: string
  to: string
  badge?: number
}

// These `to` paths must match src/routes/configRoutes.tsx exactly
const NAV_ITEMS: NavItem[] = [
  { icon: LayoutGrid, label: 'Dashboard', to: '/dashboard' },
  { icon: MessageSquare, label: 'AI Mentor', to: '/chat' },
  { icon: Upload, label: 'Upload & Analyze', to: '/upload' },
  { icon: Share2, label: 'Skill Tree', to: '/skill-tree' },
  { icon: Map, label: 'Roadmap', to: '/roadmap' },
  { icon: BookOpen, label: 'Resources', to: '/resources' },
  { icon: FolderOpen, label: 'Portfolio', to: '/portfolio' },
  { icon: Briefcase, label: 'Jobs', to: '/jobs' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Bell, label: 'Notifications', to: '/notifications', badge: 7 },
]

const ACCOUNT_ITEMS: NavItem[] = [
  { icon: Award, label: 'Subscription', to: '/subscription' },
  { icon: Settings, label: 'Settings', to: '/settings' },
  { icon: Shield, label: 'Admin', to: '/admin' },
]

export interface AppAsideProps {
  onUpgradeClick?: () => void
}

function NavButton({ icon: Icon, label, to, badge }: NavItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors ${
          isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
        }`
      }
    >
      <span className='flex items-center gap-2.5'>
        <Icon className='w-4 h-4' />
        {label}
      </span>
      {badge !== undefined && (
        <span className='text-[11px] bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 leading-none'>{badge}</span>
      )}
    </NavLink>
  )
}

export default function AppAside({ onUpgradeClick }: AppAsideProps) {
  const navigate = useNavigate()
  const handleSignOut = () => {
    clearLS() // Xóa data
    navigate('/login') // Đổi '/login' thành route đăng nhập của bạn
  }
  return (
    <aside className='w-60 shrink-0 border-r border-gray-200 bg-white flex flex-col h-full'>
      {/* Nav */}
      <div className='flex-1 overflow-y-auto px-3 py-4'>
        <p className='px-2 text-[11px] font-medium text-gray-400 mb-2'>Workspace</p>
        <nav className='flex flex-col gap-0.5 mb-6'>
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.label} {...item} />
          ))}
        </nav>

        <p className='px-2 text-[11px] font-medium text-gray-400 mb-2'>Account</p>
        <nav className='flex flex-col gap-0.5'>
          {ACCOUNT_ITEMS.map((item) => (
            <NavButton key={item.label} {...item} />
          ))}
        </nav>
      </div>

      {/* Upgrade card */}
      <div className='mt-5 p-2.5 shrink-0'>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <p className='text-sm font-semibold text-gray-900 mb-1'>Upgrade to Pro</p>
          <p className='text-xs text-gray-500 mb-3'>Unlimited AI mentor and analytics.</p>
          <button
            type='button'
            onClick={() => onUpgradeClick?.()}
            className='w-full bg-indigo-600 text-white text-sm font-medium rounded-lg py-2 hover:bg-indigo-700 transition-colors'
          >
            Upgrade
          </button>
        </div>
      </div>
      <div className='mb-7 ml-2'>
        <button
          type='button'
          onClick={handleSignOut}
          className='flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors mt-1'
        >
          <LogOut className='w-2 h-2' />
          Sign out
        </button>
      </div>
    </aside>
  )
}
