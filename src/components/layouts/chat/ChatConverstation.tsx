import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2, Send, Sparkles, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { useChatSessionQuery, useDeleteChatSessionMutation, useSendChatMessageMutation } from '../../../hooks/chatQuery'
import type { ChatMessage } from '../../../types/api/chat.types'
import { getFullNameFromLS } from '../../../utils/auth'
import AppLoadingSkeleton from '../../ui/AppLoadingSkeleton'

const EASE = [0.22, 1, 0.36, 1] as const

const SUGGESTIONS: string[] = [
  'Analyze my GitHub and suggest projects',
  'Build me a 12-week ML roadmap',
  'Review my CV for FAANG roles',
  'What skill should I learn next?',
]

// Custom render cho markdown trong tin nhắn AI
const markdownComponents: Components = {
  p: ({ children }) => <p className='mb-3 last:mb-0'>{children}</p>,
  strong: ({ children }) => <strong className='font-semibold text-gray-900 dark:text-white'>{children}</strong>,
  ul: ({ children }) => <ul className='mb-3 last:mb-0 space-y-1.5 pl-5 list-disc marker:text-gray-400 dark:marker:text-[#85808C]'>{children}</ul>,
  ol: ({ children }) => (
    <ol className='mb-3 last:mb-0 space-y-2 pl-5 list-decimal marker:text-gray-400 dark:marker:text-[#85808C] marker:font-medium'>{children}</ol>
  ),
  li: ({ children }) => <li className='pl-1 leading-relaxed [&>p]:inline [&>p]:m-0'>{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-indigo-600 dark:text-[#A99DFF] underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300'
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className='bg-gray-200/70 dark:bg-white/10 text-gray-800 dark:text-[#ECE9E4] rounded px-1.5 py-0.5 text-[13px] font-mono'>{children}</code>
  ),
}

// Modal xác nhận xóa
function DeleteConfirmModal({
  open,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  open: boolean
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-[2px]'
            onClick={() => !isDeleting && onCancel()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className='relative w-full max-w-sm bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-8 transition-colors'
          >
            <button
              type='button'
              onClick={onCancel}
              disabled={isDeleting}
              className='absolute top-5 right-5 text-gray-400 dark:text-[#85808C] hover:text-gray-600 dark:hover:text-[#ECE9E4] disabled:opacity-50 transition-colors cursor-pointer'
              aria-label='Đóng'
            >
              <X className='w-4.5 h-4.5' />
            </button>

            <div className='w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 flex items-center justify-center'>
              <AlertTriangle className='w-5 h-5 text-red-600 dark:text-[#FCA5A5]' />
            </div>

            <h2 className='mt-4 text-[17px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>Xóa cuộc trò chuyện?</h2>
            <p className='mt-1.5 text-sm text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>
              Hành động này không thể hoàn tác. Toàn bộ tin nhắn trong phiên này sẽ bị xóa vĩnh viễn.
            </p>

            <div className='mt-6 flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isDeleting}
                className='rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
              >
                Hủy
              </button>
              <button
                type='button'
                onClick={onConfirm}
                disabled={isDeleting}
                className='flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white text-sm font-medium px-4 py-2 transition cursor-pointer shadow-xs'
              >
                {isDeleting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash2 className='w-4 h-4' />}
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function ChatConverstation({
  sessionId,
  onDeleted,
}: {
  sessionId: string
  onDeleted?: () => void
}) {
  const fullName = getFullNameFromLS()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: sessionResponse, isLoading } = useChatSessionQuery(sessionId)
  const session = sessionResponse?.data?.data

  const { mutate: sendMessage, isPending: isSending } = useSendChatMessageMutation()
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteChatSessionMutation()

  const [confirmOpen, setConfirmOpen] = useState(false)

  const apiMessages: ChatMessage[] = useMemo(() => {
    if (!session) return []
    return session.messages.map((m) => ({
      id: m.id,
      role: m.role === 'USER' ? 'user' : 'assistant',
      text: m.content ?? m.text ?? '',
    }))
  }, [session])

  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([])

  const messages = useMemo(() => {
    if (!session) return []
    const welcome: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      text: `Hey ${fullName || 'bạn'} 👋 Tôi đã xem lộ trình ${session.title} của bạn. Bạn muốn bắt đầu từ đâu?`,
    }
    return [welcome, ...apiMessages, ...pendingMessages]
  }, [apiMessages, pendingMessages, session, fullName])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isSending])

  const handleSend = () => {
    const content = input.trim()
    if (!content || isSending) return

    setPendingMessages([{ id: crypto.randomUUID(), role: 'user', text: content }])
    setInput('')

    sendMessage(
      { sessionId, content },
      {
        onSuccess: () => setPendingMessages([]),
        onError: () => {
          setPendingMessages([])
          setInput(content)
        },
      },
    )
  }

  const handleConfirmDelete = () => {
    if (isDeleting) return
    deleteSession(sessionId, {
      onSuccess: () => {
        setConfirmOpen(false)
        onDeleted?.()
      },
      onError: () => setConfirmOpen(false),
    })
  }

  if (isLoading || !session) return <AppLoadingSkeleton />

  return (
    <>
      <div className='h-14 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/10 transition-colors'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-full bg-gray-900 dark:bg-[#131428] dark:border dark:border-white/10 flex items-center justify-center'>
            <Sparkles className='w-4 h-4 text-white' />
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-medium text-gray-900 dark:text-[#ECE9E4]'>{session.title}</p>
            <p className='text-xs text-gray-500 dark:text-[#A29FA8] flex items-center gap-1'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
              Online
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setConfirmOpen(true)}
          aria-label='Xóa cuộc trò chuyện'
          title='Xóa cuộc trò chuyện'
          className='w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#85808C] hover:text-red-600 dark:hover:text-[#FCA5A5] hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>

      <div className='flex-1 min-h-0 overflow-y-auto px-6 py-6'>
        <div className='flex flex-col gap-4 max-w-3xl mx-auto'>
          {messages.map((m) => (
            <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-900 dark:bg-[#131428] dark:border dark:border-white/10 text-white'
                }`}
              >
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div
                className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed break-words ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-xs'
                    : 'bg-gray-100 dark:bg-[#232227] text-gray-800 dark:text-[#ECE9E4] rounded-tl-sm border border-transparent dark:border-white/5'
                }`}
              >
                {m.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  <span className='whitespace-pre-wrap'>{m.text}</span>
                )}
              </div>
            </div>
          ))}

          {/* Đang chờ AI trả lời */}
          {isSending && (
            <div className='flex items-start gap-3' role='status' aria-live='polite'>
              <div className='w-8 h-8 shrink-0 rounded-full bg-gray-900 dark:bg-[#131428] flex items-center justify-center'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div className='rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-[#232227] px-4 py-3 text-[15px] text-gray-500 dark:text-[#A29FA8] animate-pulse border border-transparent dark:border-white/5'>
                AI đang soạn câu trả lời...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className='shrink-0 px-6 pb-5 pt-2 border-t border-gray-100 dark:border-white/10 transition-colors'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex flex-wrap gap-2 mb-3'>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => setInput(s)}
                disabled={isSending}
                className='text-sm text-gray-700 dark:text-[#ECE9E4] bg-white dark:bg-[#232227] border border-gray-200 dark:border-white/10 rounded-full px-3.5 py-1.5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs'
              >
                {s}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-3 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 bg-white dark:bg-[#232227] focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
              }}
              disabled={isSending}
              type='text'
              placeholder='Ask anything about your career...'
              className='flex-1 outline-none text-sm text-gray-800 dark:text-[#ECE9E4] placeholder:text-gray-400 dark:placeholder:text-[#5E5A64] disabled:bg-transparent'
            />
            <button
              type='button'
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              aria-label='Send message'
              className='w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer'
            >
              <Send className='w-4 h-4 text-white' />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={confirmOpen}
        isDeleting={isDeleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
