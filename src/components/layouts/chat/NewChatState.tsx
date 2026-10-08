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
            className='absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-[2px]'
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className='relative w-full max-w-md bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-8 transition-colors'
          >
            <button
              type='button'
              onClick={handleClose}
              className='absolute top-5 right-5 text-gray-400 dark:text-[#85808C] hover:text-gray-600 dark:hover:text-[#ECE9E4] transition-colors cursor-pointer'
              aria-label='Close'
            >
              <X className='w-4.5 h-4.5' />
            </button>

            <div className='w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center'>
              <MessageSquare className='w-5 h-5 text-gray-500 dark:text-[#A29FA8]' />
            </div>
            <h2 className='mt-4 text-[17px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>Bắt đầu cuộc trò chuyện mới</h2>
            <p className='mt-1.5 text-sm text-gray-500 dark:text-[#B5B1BA]'>
              Đặt tiêu đề cho phiên chat với AI Mentor dựa trên lộ trình{' '}
              {careerPath ? <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{careerPath}</span> : 'của bạn'}.
            </p>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              type='text'
              placeholder={suggestedTitle}
              autoFocus
              className='mt-5 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#232227] px-4 py-2.5 text-[15px] text-gray-900 dark:text-[#ECE9E4] placeholder-gray-400 dark:placeholder-[#5E5A64] outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition'
            />

            <div className='mt-5 flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={handleClose}
                disabled={isPending}
                className='rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
              >
                Hủy
              </button>
              <button
                type='button'
                onClick={handleStart}
                disabled={isPending}
                className='flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-sm font-medium px-4 py-2.5 transition cursor-pointer shadow-xs'
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
