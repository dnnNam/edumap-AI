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

  return (
    <div className='flex flex-col h-screen w-full bg-gray-50'>
      <AppHeader userName={fullName} userPlan={ROLE_LABEL[role] ?? planLabel} />
      <div className='flex flex-1 min-h-0'>
        <AppAside />
        <main className='flex-1 min-h-0 flex flex-col overflow-hidden'>
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  )
}
