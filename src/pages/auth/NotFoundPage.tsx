import { ArrowLeft, Compass, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { getAccessTokenFromLS, getRoleFromLS } from '../../utils/auth'
import { MotionFadeIn } from '../../components/motion/MotionWrapper'

export default function NotFoundPage() {
  const navigate = useNavigate()

  // Chưa đăng nhập -> về trang chủ, admin -> /admin, còn lại -> /dashboard
  const homePath = !getAccessTokenFromLS() ? '/' : getRoleFromLS() === 'ADMIN' ? '/admin' : '/dashboard'
  const homeLabel = !getAccessTokenFromLS() ? 'Back to home' : 'Go to dashboard'

  return (
    <div className='min-h-screen w-full bg-[#FAFAF9] flex items-center justify-center px-4'>
      <MotionFadeIn className='max-w-md w-full text-center'>
        <div className='mx-auto w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center'>
          <Compass className='w-7 h-7 text-indigo-600' />
        </div>

        <p className='mt-6 text-sm font-medium text-indigo-600'>Error 404</p>
        <h1 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight'>Page not found</h1>
        <p className='mt-3 text-[15px] text-gray-500 leading-relaxed'>
          The page you're looking for doesn't exist or has been moved. Check the URL or head back to a safe place.
        </p>

        <div className='mt-8 flex flex-col-reverse sm:flex-row items-center justify-center gap-3'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium px-4 py-2.5 hover:bg-gray-50 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Go back
          </button>
          <Link
            to={homePath}
            replace
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 transition-colors'
          >
            <Home className='w-4 h-4' />
            {homeLabel}
          </Link>
        </div>
      </MotionFadeIn>
    </div>
  )
}
