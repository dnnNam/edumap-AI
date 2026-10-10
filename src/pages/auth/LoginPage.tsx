import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { useTranslation } from 'react-i18next'
import Logo from '../../components/ui/Logo'
import StatCard from '../../components/ui/StatCard'
import FormInput from '../../components/ui/FormInput'
import PrimaryButton from '../../components/ui/PrimaryButton'
import ThemeToggle from '../../components/ui/ThemeToggle'
import LanguageToggle from '../../components/ui/LanguageToggle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { loginSchema, type LoginPayload } from '../../schemas/auth.schema'
import { useLoginMutation } from '../../hooks/useAuthQuery'
import { toast } from 'sonner'
import { saveAuthToLS } from '../../utils/auth'

export default function LoginPage() {
  const { t } = useTranslation()
  const [rememberMe, setRememberMe] = useState(true)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // 1. Khởi tạo form với Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate: loginUser, isPending } = useLoginMutation()
  const handleGoogleLogin = () => {
    // Chuyển hướng cả trang sang backend, backend sẽ redirect tiếp sang Google
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  // 3. Xử lý Submit
  const onSubmit = (data: LoginPayload) => {
    loginUser(data, {
      onSuccess: (response) => {
        const { accessToken, user } = response.data.data

        if (accessToken) {
          queryClient.clear() // bỏ cache của tài khoản đăng nhập trước đó
          saveAuthToLS({
            accessToken,
            fullName: user?.fullName,
            role: user?.role,
            remember: rememberMe,
          })
          toast.success(t('auth.loginSuccess'))
          navigate('/dashboard')
        }
      },
    })
  }

  return (
    <div className='min-h-screen w-full flex bg-white dark:bg-[#1A191C] transition-colors relative'>
      {/* Nút chuyển ngôn ngữ + theme góc trên bên phải */}
      <div className='absolute top-5 right-5 sm:top-6 sm:right-6 z-20 flex items-center gap-2'>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Left panel */}
      <div className='hidden md:flex md:w-1/2 flex-col justify-between bg-[#FAFAF9] dark:bg-[#121114] px-16 py-12 border-r border-gray-200 dark:border-white/10 transition-colors'>
        <Logo />

        <div className='max-w-md'>
          <h1 className='text-[40px] leading-[1.15] font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {t('auth.welcomeBack')}
            <br />
            {t('auth.roadmapAwaits')}
          </h1>
          <p className='mt-5 text-gray-500 dark:text-[#B5B1BA] text-[15px] leading-relaxed'>{t('login.teaser')}</p>

          <div className='mt-8 grid grid-cols-2 gap-4'>
            <StatCard value='+247 XP' label={t('login.xpLabel')} />
            <StatCard value='94%' label={t('login.matchLabel')} />
          </div>
        </div>

        <div className='text-sm text-gray-400 dark:text-[#5E5A64]'>{t('login.students')}</div>
      </div>

      {/* Right panel */}
      <div className='flex flex-1 items-center justify-center px-6 py-12 bg-white dark:bg-[#1A191C] transition-colors'>
        <div className='w-full max-w-sm'>
          <h2 className='text-[26px] font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('auth.loginTitle')}</h2>
          <p className='mt-1.5 text-gray-500 dark:text-[#B5B1BA] text-[15px]'>{t('auth.loginSubtitle')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
            <div>
              <FormInput
                id='email'
                label={t('auth.email')}
                type='email'
                icon={<Mail className='w-4 h-4' />}
                placeholder='alex@university.edu'
                {...register('email')}
              />
              {/* Hiển thị lỗi Zod (message là key dịch) */}
              {errors.email && (
                <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.email.message!)}</p>
              )}
            </div>
            <div>
              <FormInput
                id='password'
                label={t('auth.password')}
                type='password'
                icon={<Lock className='w-4 h-4' />}
                placeholder={t('auth.passwordPlaceholder')}
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.password.message!)}</p>
              )}
            </div>

            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center gap-2 cursor-pointer select-none text-gray-700 dark:text-[#ECE9E4]'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-4 h-4 rounded border-gray-300 dark:border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-[#232227]'
                />
                {t('auth.rememberMe')}
              </label>
              <a
                href='#'
                className='text-gray-500 dark:text-[#A29FA8] hover:text-gray-800 dark:hover:text-[#ECE9E4] transition'
              >
                {t('auth.forgotPassword')}
              </a>
            </div>

            <PrimaryButton type='submit' loading={isPending} loadingText={t('auth.signingIn')}>
              {t('common.signIn')}
            </PrimaryButton>

            <p className='text-center text-xs text-gray-400 dark:text-[#85808C]'>{t('login.demoHint')}</p>
          </form>

          <div className='mt-6 flex items-center gap-3'>
            <div className='flex-1 h-px bg-gray-200 dark:bg-white/10' />
            <span className='text-xs tracking-wide text-gray-400 dark:text-[#85808C]'>{t('auth.orContinueWith')}</span>
            <div className='flex-1 h-px bg-gray-200 dark:bg-white/10' />
          </div>

          <div className='mt-4'>
            <button
              type='button'
              onClick={handleGoogleLogin}
              className='w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 py-2.5 text-[15px] text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer'
            >
              <FcGoogle size={18} />
              {t('auth.continueGoogle')}
            </button>
          </div>

          <p className='mt-6 text-center text-sm text-gray-500 dark:text-[#B5B1BA]'>
            {t('auth.noAccount')}{' '}
            <Link to='/register' className='font-medium text-gray-900 dark:text-[#A99DFF] hover:underline'>
              {t('auth.createOne')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
