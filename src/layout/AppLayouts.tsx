import AppAside from '../components/layouts/AppAside'
import AppHeader from '../components/layouts/AppHeader'
import AnimatedOutlet from '../components/motion/AnimatedOutlet'
import { getFullNameFromLS, getRoleFromLS } from '../utils/auth'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  MENTOR: 'Mentor',
  STUDENT: 'Free plan',
}

export default function AppLayouts() {
  const fullName = getFullNameFromLS()
  const role = getRoleFromLS()

  return (
    <div className='flex flex-col h-screen w-full bg-gray-50'>
      <AppHeader userName={fullName || 'Guest'} userPlan={ROLE_LABEL[role] ?? 'Free plan'} />
      <div className='flex flex-1 min-h-0'>
        <AppAside />
        <main className='flex-1 min-h-0 flex flex-col overflow-hidden'>
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  )
}
