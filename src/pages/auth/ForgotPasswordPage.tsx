import { useState, useEffect } from 'react'
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Turnstile } from '@marsidev/react-turnstile'

import Logo from '../../components/ui/Logo'
import StatCard from '../../components/ui/StatCard'
import FormInput from '../../components/ui/FormInput'
import PrimaryButton from '../../components/ui/PrimaryButton'
import ThemeToggle from '../../components/ui/ThemeToggle'
import LanguageToggle from '../../components/ui/LanguageToggle'
import { forgotPasswordSchema, type ForgotPasswordPayload } from '../../schemas/auth.schema'
import { useForgotPasswordMutation } from '../../hooks/useAuthQuery'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState<number>(0)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')
  const [cooldown, setCooldown] = useState<number>(0)

  // 1. Quản lý form với React Hook Form & Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  // 2. Mutation gọi API forgot-password
  const { mutate: sendForgotPassword, isPending } = useForgotPasswordMutation()

  // 3. Đếm ngược cooldown 60 giây khi bấm gửi lại
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // 4. Submit form
  const onSubmit = (data: ForgotPasswordPayload) => {
    if (!turnstileToken) {
      toast.error(t('auth.turnstileRequired'))
      return
    }

    sendForgotPassword(
      { email: data.email, turnstileToken },
      {
        onSuccess: (res) => {
          setSubmittedEmail(data.email)
          setIsSuccess(true)
          setCooldown(60)
          toast.success(res.data?.message || t('auth.forgotPasswordSuccessTitle'))
        },
        onError: () => {
          // Reset Turnstile token nếu gặp lỗi để người dùng xác thực lại
          setTurnstileToken(null)
          setTurnstileKey((prev) => prev + 1)
        },
      },
    )
  }

  // 5. Gửi lại email
  const handleResend = () => {
    if (cooldown > 0 || !submittedEmail) return
    if (!turnstileToken) {
      toast.error(t('auth.turnstileRequired'))
      return
    }

    sendForgotPassword(
      { email: submittedEmail, turnstileToken },
      {
        onSuccess: (res) => {
          setCooldown(60)
          toast.success(res.data?.message || t('auth.forgotPasswordSuccessTitle'))
        },
        onError: () => {
          setTurnstileToken(null)
          setTurnstileKey((prev) => prev + 1)
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
            <span>{t('auth.forgotHeroBadge')}</span>
          </div>

          <h1 className='text-[38px] leading-[1.18] font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            {t('auth.forgotHeroTitle1')}
            <br />
            {t('auth.forgotHeroTitle2')}
          </h1>
          <p className='mt-5 text-gray-500 dark:text-[#B5B1BA] text-[15px] leading-relaxed'>
            {t('auth.forgotHeroDesc')}
          </p>

          <div className='mt-8 grid grid-cols-2 gap-4'>
            <StatCard value={t('auth.forgotStatValue1')} label={t('auth.forgotStatLabel1')} />
            <StatCard value={t('auth.forgotStatValue2')} label={t('auth.forgotStatLabel2')} />
          </div>
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-400 dark:text-[#5E5A64]'>
          <Sparkles className='w-4 h-4 text-indigo-500' />
          <span>{t('auth.forgotFooterTag')}</span>
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

          {!isSuccess ? (
            /* TRẠNG THÁI 1: FORM NHẬP EMAIL */
            <>
              <h2 className='text-[26px] font-bold text-gray-900 dark:text-[#ECE9E4]'>
                {t('auth.forgotPasswordTitle')}
              </h2>
              <p className='mt-1.5 text-gray-500 dark:text-[#B5B1BA] text-[15px] leading-relaxed'>
                {t('auth.forgotPasswordSubtitle')}
              </p>

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
                  {errors.email && (
                    <p className='text-sm text-red-500 dark:text-[#FCA5A5] mt-1'>{t(errors.email.message!)}</p>
                  )}
                </div>

                {/* Cloudflare Turnstile */}
                <div className='flex justify-center'>
                  <Turnstile
                    key={turnstileKey}
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken(null)}
                    onExpire={() => setTurnstileToken(null)}
                    options={{ theme: 'auto' }}
                  />
                </div>

                <PrimaryButton
                  type='submit'
                  loading={isPending}
                  disabled={!turnstileToken || isPending}
                  loadingText={t('auth.sendingResetLink')}
                >
                  {t('auth.sendResetLink')}
                </PrimaryButton>
              </form>
            </>
          ) : (
            /* TRẠNG THÁI 2: ĐÃ GỬI EMAIL THÀNH CÔNG */
            <div className='text-center py-4 space-y-5'>
              <div className='w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm'>
                <CheckCircle2 className='w-7 h-7' />
              </div>

              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-[#ECE9E4]'>
                  {t('auth.forgotPasswordSuccessTitle')}
                </h3>
                <p className='mt-2.5 text-sm text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>
                  {t('auth.forgotPasswordSuccessDesc')}
                </p>
                {submittedEmail && (
                  <div className='mt-3 inline-block px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-mono font-medium text-gray-700 dark:text-[#ECE9E4]'>
                    {submittedEmail}
                  </div>
                )}
              </div>

              {/* Cloudflare Turnstile ẩn/hiện khi cần gửi lại */}
              <div className='flex justify-center pt-2'>
                <Turnstile
                  key={turnstileKey}
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                  options={{ theme: 'auto' }}
                />
              </div>

              <div className='pt-2 flex flex-col gap-3'>
                <button
                  type='button'
                  onClick={handleResend}
                  disabled={cooldown > 0 || isPending || !turnstileToken}
                  className='inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-[#232227] text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition'
                >
                  <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                  <span>{cooldown > 0 ? `${t('auth.resendEmail')} (${cooldown}s)` : t('auth.resendEmail')}</span>
                </button>

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
