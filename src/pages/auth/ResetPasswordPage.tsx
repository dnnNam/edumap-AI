/* eslint-disable react-hooks/incompatible-library */
import { useState, useEffect } from 'react'
import { Lock, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Check, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import Logo from '../../components/ui/Logo'
import StatCard from '../../components/ui/StatCard'
import FormInput from '../../components/ui/FormInput'
import PrimaryButton from '../../components/ui/PrimaryButton'
import ThemeToggle from '../../components/ui/ThemeToggle'
import LanguageToggle from '../../components/ui/LanguageToggle'
import { resetPasswordFormSchema, type ResetPasswordFormPayload } from '../../schemas/auth.schema'
import { useResetPasswordMutation } from '../../hooks/useAuthQuery'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [redirectCountdown, setRedirectCountdown] = useState<number>(4)

  // 1. Quản lý form với React Hook Form & Zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormPayload>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPasswordValue = watch('newPassword') || ''
  const confirmPasswordValue = watch('confirmPassword') || ''

  // 2. Mutation gọi API reset-password
  const { mutate: performResetPassword, isPending } = useResetPasswordMutation()

  // 3. Tự động chuyển hướng về trang đăng nhập sau khi đổi thành công
  useEffect(() => {
    if (!isSuccess) return
    if (redirectCountdown <= 0) {
      navigate('/login')
      return
    }
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isSuccess, redirectCountdown, navigate])

  // 4. Xử lý submit
  const onSubmit = (data: ResetPasswordFormPayload) => {
    if (!token) {
      toast.error(t('auth.invalidTokenTitle'))
      return
    }

    performResetPassword(
      {
        token,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (res) => {
          setIsSuccess(true)
          toast.success(res.data?.message || t('auth.resetPasswordSuccessTitle'))
        },
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

      {/* Left panel (Desktop) */}
      <div className='hidden md:flex md:w-1/2 flex-col justify-between bg-[#FAFAF9] dark:bg-[#121114] px-16 py-12 border-r border-gray-200 dark:border-white/10 transition-colors'>
        <Logo />

        <div className='max-w-md'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-white/10 text-xs font-semibold text-indigo-600 dark:text-[#A99DFF] mb-6'>
            <ShieldCheck className='w-4 h-4' />
            <span>{t('auth.resetHeroBadge')}</span>
          </div>

          <h1 className='text-[38px] leading-[1.18] font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {t('auth.resetHeroTitle1')}
            <br />
            {t('auth.resetHeroTitle2')}
          </h1>
          <p className='mt-5 text-gray-500 dark:text-[#B5B1BA] text-[15px] leading-relaxed'>
            {t('auth.resetHeroDesc')}
          </p>

          <div className='mt-8 grid grid-cols-2 gap-4'>
            <StatCard value={t('auth.resetStatValue1')} label={t('auth.resetStatLabel1')} />
            <StatCard value={t('auth.resetStatValue2')} label={t('auth.resetStatLabel2')} />
          </div>
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-400 dark:text-[#5E5A64]'>
          <Sparkles className='w-4 h-4 text-indigo-500' />
          <span>{t('auth.resetFooterTag')}</span>
        </div>
      </div>

      {/* Right panel (Form / Content) */}
      <div className='flex flex-1 items-center justify-center px-6 py-12 bg-white dark:bg-[#1A191C] transition-colors'>
        <div className='w-full max-w-sm'>
          {/* Nút quay lại đăng nhập */}
          <Link
            to='/login'
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-[#A29FA8] hover:text-indigo-600 dark:hover:text-[#A99DFF] transition mb-8 group'
          >
            <ArrowLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
            <span>{t('auth.backToLogin')}</span>
          </Link>

          {!token ? (
            /* TRƯỜNG HỢP 1: TOKEN BỊ THIẾU HOẶC KHÔNG CÓ TRÊN URL */
            <div className='text-center py-4 space-y-5'>
              <div className='w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm'>
                <AlertTriangle className='w-7 h-7' />
              </div>

              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('auth.invalidTokenTitle')}</h3>
                <p className='mt-2.5 text-sm text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>
                  {t('auth.invalidTokenDesc')}
                </p>
              </div>

              <div className='pt-3 flex flex-col gap-3'>
                <Link
                  to='/forgot-password'
                  className='inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition'
                >
                  {t('auth.requestNewLink')}
                </Link>

                <Link
                  to='/login'
                  className='inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-[#232227] text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-50 dark:hover:bg-white/10 transition'
                >
                  {t('auth.backToLogin')}
                </Link>
              </div>
            </div>
          ) : !isSuccess ? (
            /* TRƯỜNG HỢP 2: FORM NHẬP MẬT KHẨU MỚI */
            <>
              <h2 className='text-[26px] font-bold text-gray-900 dark:text-[#ECE9E4]'>
                {t('auth.resetPasswordTitle')}
              </h2>
              <p className='mt-1.5 text-gray-500 dark:text-[#B5B1BA] text-[15px] leading-relaxed'>
                {t('auth.resetPasswordSubtitle')}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
                <div>
                  <FormInput
                    id='newPassword'
                    label={t('auth.newPassword')}
                    type='password'
                    icon={<Lock className='w-4 h-4' />}
                    placeholder={t('auth.newPasswordPlaceholder')}
                    {...register('newPassword')}
                  />
                  {errors.newPassword && (
                    <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.newPassword.message!)}</p>
                  )}
                </div>

                <div>
                  <FormInput
                    id='confirmPassword'
                    label={t('auth.confirmNewPassword')}
                    type='password'
                    icon={<Lock className='w-4 h-4' />}
                    placeholder={t('auth.confirmNewPasswordPlaceholder')}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>
                      {t(errors.confirmPassword.message!)}
                    </p>
                  )}
                </div>

                {/* Tiêu chí mật khẩu trực quan */}
                <div className='p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1.5 text-xs text-gray-500 dark:text-[#B5B1BA]'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        newPasswordValue.length >= 6
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 dark:bg-white/10 text-gray-400'
                      }`}
                    >
                      <Check className='w-2.5 h-2.5' />
                    </div>
                    <span>{t('validation.passwordMin')}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        confirmPasswordValue.length > 0 && newPasswordValue === confirmPasswordValue
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 dark:bg-white/10 text-gray-400'
                      }`}
                    >
                      <Check className='w-2.5 h-2.5' />
                    </div>
                    <span>{t('auth.passwordsMatch')}</span>
                  </div>
                </div>

                <PrimaryButton
                  type='submit'
                  loading={isPending}
                  disabled={isPending}
                  loadingText={t('auth.resettingPassword')}
                >
                  {t('auth.resetPasswordBtn')}
                </PrimaryButton>
              </form>
            </>
          ) : (
            /* TRƯỜNG HỢP 3: ĐẶT LẠI MẬT KHẨU THÀNH CÔNG */
            <div className='text-center py-4 space-y-5'>
              <div className='w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm'>
                <CheckCircle2 className='w-7 h-7' />
              </div>

              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-[#ECE9E4]'>
                  {t('auth.resetPasswordSuccessTitle')}
                </h3>
                <p className='mt-2.5 text-sm text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>
                  {t('auth.resetPasswordSuccessDesc')}
                </p>
                <p className='mt-2 text-xs text-indigo-600 dark:text-[#A99DFF] font-semibold'>
                  {t('auth.autoRedirect', { seconds: redirectCountdown })}
                </p>
              </div>

              <div className='pt-2'>
                <Link
                  to='/login'
                  className='inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition'
                >
                  {t('auth.goToLogin')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
