import { useState } from 'react'
import { KeyRound, Eye, EyeOff, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { changePasswordSchema, type ChangePasswordPayload } from '../../schemas/auth.schema'

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: ChangePasswordPayload) => Promise<void> | void
  isSubmitting?: boolean
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ChangePasswordModalProps) {
  const { t } = useTranslation()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordPayload & { confirmNewPassword: string }>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  if (!open) return null

  const handleClose = () => {
    reset()
    onClose()
  }

  const submit = handleSubmit(async (data) => {
    const result = changePasswordSchema.safeParse({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        // issue.message là KEY dịch, được dịch lúc hiển thị bên dưới
        setError(issue.path[0] as 'oldPassword' | 'newPassword', { message: issue.message })
      })
      return
    }
    if (data.newPassword !== data.confirmNewPassword) {
      setError('confirmNewPassword', { message: 'validation.passwordMismatch' })
      return
    }

    try {
      await onSubmit?.(result.data)
      toast.success(t('changePassword.success'))
      handleClose()
    } catch {
      // Axios interceptor tự bắt lỗi và hiển thị toast, không cần xử lý thêm ở đây
    }
  })

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-[2px]' onClick={handleClose} />

      <div className='relative w-full max-w-md bg-white dark:bg-[#1A191C] rounded-2xl border border-gray-200 dark:border-white/[0.08] shadow-lg p-6'>
        <button
          type='button'
          onClick={handleClose}
          className='absolute top-5 right-5 text-gray-400 dark:text-[#A29FA8] hover:text-gray-600 dark:hover:text-[#ECE9E4] transition-colors cursor-pointer'
          aria-label={t('common.close')}
        >
          <X className='w-4.5 h-4.5' />
        </button>

        <div className='flex items-center gap-2'>
          <KeyRound className='w-4.5 h-4.5 text-gray-900 dark:text-[#ECE9E4]' />
          <h2 className='text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('changePassword.title')}</h2>
        </div>
        <p className='mt-1.5 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('changePassword.desc')}</p>

        <form onSubmit={submit} className='mt-6 space-y-4'>
          {/* Form input Current Password */}
          <div>
            <label htmlFor='oldPassword' className='block text-sm font-medium text-gray-800 dark:text-[#ECE9E4] mb-1.5'>
              {t('changePassword.current')}
            </label>
            <div className='relative'>
              <input
                id='oldPassword'
                type={showCurrent ? 'text' : 'password'}
                className='w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] pl-4 pr-11 py-2.5 text-[15px] text-gray-900 dark:text-[#ECE9E4] outline-none focus:border-indigo-500 dark:focus:border-[#5F2CFF] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-[#5F2CFF]/20 transition'
                {...register('oldPassword')}
              />
              <button
                type='button'
                onClick={() => setShowCurrent((v) => !v)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#A29FA8] hover:text-gray-600 dark:hover:text-[#ECE9E4] transition-colors cursor-pointer'
              >
                {showCurrent ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {errors.oldPassword && <p className='text-sm text-red-500 mt-1'>{t(errors.oldPassword.message!)}</p>}
          </div>

          {/* Form input New Password */}
          <div>
            <label htmlFor='newPassword' className='block text-sm font-medium text-gray-800 dark:text-[#ECE9E4] mb-1.5'>
              {t('changePassword.new')}
            </label>
            <div className='relative'>
              <input
                id='newPassword'
                type={showNew ? 'text' : 'password'}
                className='w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] pl-4 pr-11 py-2.5 text-[15px] text-gray-900 dark:text-[#ECE9E4] outline-none focus:border-indigo-500 dark:focus:border-[#5F2CFF] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-[#5F2CFF]/20 transition'
                {...register('newPassword')}
              />
              <button
                type='button'
                onClick={() => setShowNew((v) => !v)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#A29FA8] hover:text-gray-600 dark:hover:text-[#ECE9E4] transition-colors cursor-pointer'
              >
                {showNew ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {errors.newPassword && <p className='text-sm text-red-500 mt-1'>{t(errors.newPassword.message!)}</p>}
          </div>

          {/* Form input Confirm Password */}
          <div>
            <label
              htmlFor='confirmNewPassword'
              className='block text-sm font-medium text-gray-800 dark:text-[#ECE9E4] mb-1.5'
            >
              {t('changePassword.confirmNew')}
            </label>
            <div className='relative'>
              <input
                id='confirmNewPassword'
                type={showConfirm ? 'text' : 'password'}
                className='w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] pl-4 pr-11 py-2.5 text-[15px] text-gray-900 dark:text-[#ECE9E4] outline-none focus:border-indigo-500 dark:focus:border-[#5F2CFF] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-[#5F2CFF]/20 transition'
                {...register('confirmNewPassword')}
              />
              <button
                type='button'
                onClick={() => setShowConfirm((v) => !v)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#A29FA8] hover:text-gray-600 dark:hover:text-[#ECE9E4] transition-colors cursor-pointer'
              >
                {showConfirm ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className='text-sm text-red-500 mt-1'>{t(errors.confirmNewPassword.message!)}</p>
            )}
          </div>

          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={handleClose}
              className='rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-[15px] font-medium px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#232227] transition cursor-pointer'
            >
              {t('common.cancel')}
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-[#5F2CFF] dark:hover:bg-[#4B1FD6] disabled:opacity-70 text-white text-[15px] font-medium px-5 py-2.5 transition cursor-pointer'
            >
              {isSubmitting ? t('changePassword.updating') : t('changePassword.update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
