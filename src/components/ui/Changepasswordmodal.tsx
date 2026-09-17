import { useState } from 'react'
import { KeyRound, Eye, EyeOff, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
        setError(issue.path[0] as 'oldPassword' | 'newPassword', { message: issue.message })
      })
      return
    }
    if (data.newPassword !== data.confirmNewPassword) {
      setError('confirmNewPassword', { message: 'Xác nhận mật khẩu không khớp' })
      return
    }

    try {
      await onSubmit?.(result.data)
      toast.success('Cập nhật mật khẩu thành công!')
      handleClose()
    } catch {
      // Axios interceptor tự bắt lỗi và hiển thị toast, không cần xử lý thêm ở đây
    }
  })

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div className='absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]' onClick={handleClose} />

      <div className='relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-lg p-6'>
        <button
          type='button'
          onClick={handleClose}
          className='absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors'
          aria-label='Close'
        >
          <X className='w-4.5 h-4.5' />
        </button>

        <div className='flex items-center gap-2'>
          <KeyRound className='w-4.5 h-4.5 text-gray-900' />
          <h2 className='text-lg font-semibold text-gray-900'>Change password</h2>
        </div>
        <p className='mt-1.5 text-sm text-gray-500'>Choose a strong password you haven't used before.</p>

        <form onSubmit={submit} className='mt-6 space-y-4'>
          {/* Form input Current Password */}
          <div>
            <label htmlFor='oldPassword' className='block text-sm font-medium text-gray-800 mb-1.5'>
              Current password
            </label>
            <div className='relative'>
              <input
                id='oldPassword'
                type={showCurrent ? 'text' : 'password'}
                className='w-full rounded-xl border border-gray-200 pl-4 pr-11 py-2.5 text-[15px] text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
                {...register('oldPassword')}
              />
              <button
                type='button'
                onClick={() => setShowCurrent((v) => !v)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                {showCurrent ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {errors.oldPassword && <p className='text-sm text-red-500 mt-1'>{errors.oldPassword.message}</p>}
          </div>

          {/* Form input New Password */}
          <div>
            <label htmlFor='newPassword' className='block text-sm font-medium text-gray-800 mb-1.5'>
              New password
            </label>
            <div className='relative'>
              <input
                id='newPassword'
                type={showNew ? 'text' : 'password'}
                className='w-full rounded-xl border border-gray-200 pl-4 pr-11 py-2.5 text-[15px] text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
                {...register('newPassword')}
              />
              <button
                type='button'
                onClick={() => setShowNew((v) => !v)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                {showNew ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {errors.newPassword && <p className='text-sm text-red-500 mt-1'>{errors.newPassword.message}</p>}
          </div>

          {/* Form input Confirm Password */}
          <div>
            <label htmlFor='confirmNewPassword' className='block text-sm font-medium text-gray-800 mb-1.5'>
              Confirm new password
            </label>
            <div className='relative'>
              <input
                id='confirmNewPassword'
                type={showConfirm ? 'text' : 'password'}
                className='w-full rounded-xl border border-gray-200 pl-4 pr-11 py-2.5 text-[15px] text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
                {...register('confirmNewPassword')}
              />
              <button
                type='button'
                onClick={() => setShowConfirm((v) => !v)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                {showConfirm ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className='text-sm text-red-500 mt-1'>{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={handleClose}
              className='rounded-xl border border-gray-200 text-gray-900 text-[15px] font-medium px-4 py-2.5 hover:bg-gray-50 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-[15px] font-medium px-5 py-2.5 transition'
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
