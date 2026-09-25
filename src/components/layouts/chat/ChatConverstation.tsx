import { Send, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { useChatSessionQuery, useSendChatMessageMutation } from '../../../hooks/chatQuery'
import type { ChatMessage } from '../../../types/api/chat.types'
import { getFullNameFromLS } from '../../../utils/auth'

const SUGGESTIONS: string[] = [
  'Analyze my GitHub and suggest projects',
  'Build me a 12-week ML roadmap',
  'Review my CV for FAANG roles',
  'What skill should I learn next?',
]

// Custom render cho markdown trong tin nhắn AI — tự canh spacing/hanging-indent,
// không phụ thuộc plugin @tailwindcss/typography (project chưa cài).
const markdownComponents: Components = {
  p: ({ children }) => <p className='mb-3 last:mb-0'>{children}</p>,
  strong: ({ children }) => <strong className='font-semibold text-gray-900'>{children}</strong>,
  ul: ({ children }) => <ul className='mb-3 last:mb-0 space-y-1.5 pl-5 list-disc marker:text-gray-400'>{children}</ul>,
  ol: ({ children }) => (
    <ol className='mb-3 last:mb-0 space-y-2 pl-5 list-decimal marker:text-gray-400 marker:font-medium'>{children}</ol>
  ),
  li: ({ children }) => <li className='pl-1 leading-relaxed [&>p]:inline [&>p]:m-0'>{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-indigo-600 underline underline-offset-2 hover:text-indigo-700'
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className='bg-gray-200/70 text-gray-800 rounded px-1.5 py-0.5 text-[13px] font-mono'>{children}</code>
  ),
}

export default function ChatConverstation({ sessionId }: { sessionId: string }) {
  const fullName = getFullNameFromLS()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: sessionResponse, isLoading } = useChatSessionQuery(sessionId)
  const session = sessionResponse?.data?.data

  const { mutate: sendMessage, isPending: isSending } = useSendChatMessageMutation()

  // Tin nhắn thật từ API
  const apiMessages: ChatMessage[] = useMemo(() => {
    if (!session) return []
    return session.messages.map((m) => ({
      id: m.id,
      role: m.role === 'USER' ? 'user' : 'assistant', // chuẩn hóa "USER"/"ASSISTANT" -> "user"/"assistant"
      text: m.content ?? m.text ?? '',
    }))
  }, [session])

  // Tin nhắn của user hiển thị tạm trong lúc chờ server (optimistic).
  // Component được remount (key={sessionId} ở ChatPage) mỗi khi đổi session nên state này luôn bắt đầu rỗng.
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

  // Tự cuộn xuống cuối khi có tin nhắn mới hoặc đang chờ AI trả lời
  // (phải đặt TRƯỚC early return bên dưới vì hook không được gọi sau return)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isSending])

  const handleSend = () => {
    const content = input.trim()
    if (!content || isSending) return

    // Hiện ngay tin nhắn của user, xóa ô nhập
    setPendingMessages([{ id: crypto.randomUUID(), role: 'user', text: content }])
    setInput('')

    sendMessage(
      { sessionId, content },
      {
        // Cache đã refetch xong (xem useSendChatMessageMutation) -> bỏ tin nhắn tạm
        onSuccess: () => setPendingMessages([]),
        // Lỗi (toast đã do http.ts lo) -> bỏ tin nhắn tạm và trả lại nội dung để user gửi lại
        onError: () => {
          setPendingMessages([])
          setInput(content)
        },
      },
    )
  }

  if (isLoading || !session) {
    return (
      <div className='flex-1 flex items-center justify-center text-sm text-gray-400'>Đang tải cuộc trò chuyện...</div>
    )
  }

  return (
    <>
      <div className='h-14 shrink-0 flex items-center justify-between px-6 border-b border-gray-100'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center'>
            <Sparkles className='w-4 h-4 text-white' />
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-medium text-gray-900'>{session.title}</p>
            <p className='text-xs text-gray-500 flex items-center gap-1'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
              Online
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => window.confirm('Xóa cuộc trò chuyện này?')}
          aria-label='Xóa cuộc trò chuyện'
          title='Xóa cuộc trò chuyện'
          className='w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors'
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
                  m.role === 'user' ? 'bg-indigo-600' : 'bg-gray-900'
                }`}
              >
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div
                className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed break-words ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
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
              <div className='w-8 h-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div className='rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-[15px] text-gray-500 animate-pulse'>
                AI đang soạn câu trả lời...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className='shrink-0 px-6 pb-5 pt-2 border-t border-gray-100'>
        {/* max-w-3xl mx-auto khớp đúng với khối tin nhắn phía trên, để 2 khối thẳng hàng, không lệch trái/phải */}
        <div className='max-w-3xl mx-auto'>
          <div className='flex flex-wrap gap-2 mb-3'>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => setInput(s)}
                disabled={isSending}
                className='text-sm text-gray-700 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
              >
                {s}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:border-gray-300'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // isComposing: đang gõ dấu tiếng Việt (Telex/VNI), Enter lúc này chỉ để chốt chữ, không phải gửi
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
              }}
              disabled={isSending}
              type='text'
              placeholder='Ask anything about your career...'
              className='flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400 disabled:bg-transparent'
            />
            <button
              type='button'
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              aria-label='Send message'
              className='w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
            >
              <Send className='w-4 h-4 text-white' />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
