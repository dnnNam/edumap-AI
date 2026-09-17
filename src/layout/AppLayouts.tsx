import AppAside from '../components/layouts/AppAside'
import AppHeader from '../components/layouts/AppHeader'
import AnimatedOutlet from '../components/motion/AnimatedOutlet'

export default function AppLayouts() {
  return (
    <div className='flex flex-col h-screen w-full bg-gray-50'>
      <AppHeader />
      <div className='flex flex-1 min-h-0'>
        <AppAside />
        <main className='flex-1 min-h-0 flex flex-col overflow-hidden'>
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  )
}
