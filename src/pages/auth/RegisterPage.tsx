import { Mail, Lock, User } from 'lucide-react'
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
import { registerSchema, type RegisterFormPayload } from '../../schemas/auth.schema'
import { useRegisterMutation } from '../../hooks/useAuthQuery'
import { toast } from 'sonner'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // 1. Khởi tạo React Hook Form kết hợp Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 2. Khởi tạo mutation đăng ký từ React Query
  const { mutate: registerUser, isPending } = useRegisterMutation()

  // 3. Xử lý logic submit form
  const onSubmit = (data: RegisterFormPayload) => {
    // confirmPassword chỉ dùng để validate ở client, ta chỉ gửi data mà backend cần
    const { email, password, fullName } = data

    registerUser(
      { email, password, fullName },
      {
        onSuccess: () => {
          toast.success(t('auth.registerSuccess'))
          navigate('/login')
        },
        // onError không cần xử lý riêng vì http.ts interceptor đã toast lỗi chung rồi
      },
    )
  }

  return (
    <div className='min-h-screen w-full flex bg-white dark:bg-[#1A191C] transition-colors relative'>
      {/* Nút chuyển ngôn ngữ + theme góc trên bên phải */}
      <div className='absolute top-5 right-5 sm:top-6 sm:right-6 z-20 flex items-center gap-2'>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Left panel: the form */}
      <div className='flex flex-1 md:w-1/2 flex-col px-6 md:px-16 py-12 bg-white dark:bg-[#1A191C] transition-colors'>
        <Logo />

        <div className='w-full max-w-md mt-10'>
          <h2 className='text-[26px] font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('auth.registerTitle')}</h2>
          <p className='mt-1.5 text-gray-500 dark:text-[#B5B1BA] text-[15px]'>{t('auth.registerSubtitle')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
            <div>
              <FormInput
                id='fullName'
                label={t('auth.fullName')}
                icon={<User className='w-4 h-4' />}
                placeholder='Alex Johnson'
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.fullName.message!)}</p>
              )}
            </div>

            <div>
              <FormInput
                id='email'
                label={t('auth.email')}
                type='email'
                icon={<Mail className='w-4 h-4' />}
                placeholder='you@university.edu'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.email.message!)}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <FormInput
                  id='password'
                  label={t('auth.password')}
                  type='password'
                  icon={<Lock className='w-4 h-4' />}
                  placeholder='••••••••'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.password.message!)}</p>
                )}
              </div>
              <div>
                <FormInput
                  id='confirmPassword'
                  label={t('auth.confirm')}
                  type='password'
                  icon={<Lock className='w-4 h-4' />}
                  placeholder='••••••••'
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.confirmPassword.message!)}</p>
                )}
              </div>
            </div>

            <PrimaryButton type='submit' loading={isPending} loadingText={t('auth.creatingAccount')}>
              {t('auth.createAccount')}
            </PrimaryButton>

            <p className='text-center text-xs text-gray-400 dark:text-[#85808C]'>
              {t('register.agreePrefix')}{' '}
              <a href='#' className='underline hover:text-gray-600 dark:hover:text-[#ECE9E4]'>
                {t('register.terms')}
              </a>{' '}
              &{' '}
              <a href='#' className='underline hover:text-gray-600 dark:hover:text-[#ECE9E4]'>
                {t('register.privacy')}
              </a>
              .
            </p>
          </form>

          <p className='mt-4 text-center text-sm text-gray-500 dark:text-[#B5B1BA]'>
            {t('auth.haveAccount')}{' '}
            <Link to='/login' className='font-medium text-gray-900 dark:text-[#A99DFF] hover:underline'>
              {t('common.signIn')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel: marketing content */}
      <div className='hidden md:flex md:w-1/2 flex-col justify-between bg-[#FAFAF9] dark:bg-[#121114] px-16 py-12 border-l border-gray-200 dark:border-white/10 transition-colors'>
        <div />
        <div className='max-w-lg self-end text-right'>
          <h1 className='text-[40px] leading-[1.15] font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {t('register.headline1')}
            <br />
            {t('register.headline2')}
          </h1>
          <p className='mt-5 text-gray-500 dark:text-[#B5B1BA] text-[15px] leading-relaxed'>{t('register.desc')}</p>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <StatCard value='120K+' label={t('register.statStudents')} className='text-center' />
          <StatCard value='412' label={t('register.statSchools')} className='text-center' />
          <StatCard value='4.9★' label={t('register.statRating')} className='text-center' />
        </div>
      </div>
    </div>
  )
}
