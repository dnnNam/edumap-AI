import { AnimatePresence, motion } from 'framer-motion'
import type { AxiosError } from 'axios'
import { Loader2, MessageSquare, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useCreateChatSessionMutation } from '../../../hooks/chatQuery'
import type { ChatSession } from '../../../types/api/chat.types'

const EASE = [0.22, 1, 0.36, 1] as const

export default function NewChatState({
  open,
  careerPath,
  onClose,
  onCreated,
  onBlocked,
}: {
  open: boolean
  careerPath?: string
  onClose: () => void
  onCreated: (session: ChatSession) => void
  // Gọi khi BE từ chối tạo session vì user chưa có dữ liệu phân tích (400).
  // ChatPage tự quyết định hiển thị gì (ChatUploadRequiredState), component này không tự điều hướng.
  onBlocked: () => void
}) {
  const suggestedTitle = careerPath ? `Tư vấn lộ trình ${careerPath}` : 'Tư vấn lộ trình của bạn'

  const [title, setTitle] = useState('')
  const { mutate: createSession, isPending } = useCreateChatSessionMutation()

  const handleClose = () => {
    if (isPending) return
    setTitle('')
    onClose()
  }

  const handleStart = () => {
    if (isPending) return
    const finalTitle = title.trim() || suggestedTitle
    createSession(
      { title: finalTitle },
      {
        onSuccess: (response) => {
          setTitle('')
          onCreated(response.data.data)
        },
        // BE trả 400 khi user chưa có dữ liệu phân tích -> đóng popup, báo lên ChatPage
        // để hiển thị ChatUploadRequiredState ngay trong khung chat thay vì giật trang.
        onError: (error) => {
          if ((error as AxiosError)?.response?.status === 400) {
            setTitle('')
            onClose()
            onBlocked()
          }
        },
      },
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]'
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className='relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8'
          >
            <button
              type='button'
              onClick={handleClose}
              className='absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors'
              aria-label='Close'
            >
              <X className='w-4.5 h-4.5' />
            </button>

            <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center'>
              <MessageSquare className='w-5 h-5 text-gray-500' />
            </div>
            <h2 className='mt-4 text-[17px] font-semibold text-gray-900'>Bắt đầu cuộc trò chuyện mới</h2>
            <p className='mt-1.5 text-sm text-gray-500'>
              Đặt tiêu đề cho phiên chat với AI Mentor dựa trên lộ trình{' '}
              {careerPath ? <span className='font-medium text-gray-900'>{careerPath}</span> : 'của bạn'}.
            </p>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              type='text'
              placeholder={suggestedTitle}
              autoFocus
              className='mt-5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
            />

            <div className='mt-5 flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={handleClose}
                disabled={isPending}
                className='rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2.5 hover:bg-gray-50 disabled:opacity-60 transition'
              >
                Hủy
              </button>
              <button
                type='button'
                onClick={handleStart}
                disabled={isPending}
                className='flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-sm font-medium px-4 py-2.5 transition'
              >
                {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Sparkles className='w-4 h-4' />}
                Bắt đầu trò chuyện
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
