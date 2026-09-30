import { useState, useCallback } from 'react'
import AppAside from '../components/layouts/AppAside'
import AppHeader from '../components/layouts/AppHeader'
import AnimatedOutlet from '../components/motion/AnimatedOutlet'
import { useMySubscriptionQuery } from '../hooks/billingQuery'
import { useProfileQuery } from '../hooks/useUserQuery'
import { getFullNameFromLS, getRoleFromLS } from '../utils/auth'
import { PLAN_COPY_EN } from '../utils/billing'

// Chỉ role đặc biệt mới hiện role, STUDENT hiện tên gói
const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  MENTOR: 'Mentor',
}

export default function AppLayouts() {
  const role = getRoleFromLS()
  const { data: profileRes } = useProfileQuery()
  const { data: subRes } = useMySubscriptionQuery()

  const fullName = profileRes?.data?.data?.fullName || getFullNameFromLS() || 'Guest'

  const planCode = subRes?.data?.data?.planCode ?? 'FREE'
  const planLabel = `${PLAN_COPY_EN[planCode]?.name ?? 'Free'} plan`

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className='flex flex-col h-screen w-full bg-gray-50'>
      <AppHeader
        userName={fullName}
        userPlan={ROLE_LABEL[role] ?? planLabel}
        onToggleMenu={toggleSidebar}
      />
      <div className='flex flex-1 min-h-0 relative overflow-hidden'>
        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-xs lg:hidden transition-opacity'
            onClick={closeSidebar}
            aria-hidden='true'
          />
        )}

        {/* Sidebar Drawer on mobile / Fixed column on desktop (lg) */}
        <div
          className={`
            fixed top-0 bottom-0 left-0 z-50 w-60 shadow-xl lg:shadow-none
            transition-transform duration-300 ease-in-out
            lg:static lg:top-auto lg:bottom-auto lg:z-auto lg:translate-x-0 lg:flex lg:flex-col lg:shrink-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <AppAside onClose={closeSidebar} />
        </div>

        <main className='flex-1 min-h-0 flex flex-col overflow-y-auto min-w-0 bg-gray-50'>
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  )
}
