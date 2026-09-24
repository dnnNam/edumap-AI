import { FileText, Paperclip, Send, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { useChatSessionQuery } from '../../../hooks/chatQuery'
import type { ChatMessage } from '../../../types/api/chat.types'
import { getFullNameFromLS } from '../../../utils/auth'

const SUGGESTIONS: string[] = [
  'Analyze my GitHub and suggest projects',
  'Build me a 12-week ML roadmap',
  'Review my CV for FAANG roles',
  'What skill should I learn next?',
]

export default function ChatConverstation({ sessionId }: { sessionId: string }) {
  const fullName = getFullNameFromLS()
  const [input, setInput] = useState('')

  const { data: sessionResponse, isLoading } = useChatSessionQuery(sessionId)
  const session = sessionResponse?.data?.data

  // Tin nhắn thật từ API — tính thẳng bằng useMemo, không cần setState/useEffect để "copy" vào state khác
  const apiMessages: ChatMessage[] = useMemo(() => {
    if (!session) return []
    return session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      text: m.content ?? m.text ?? '',
    }))
  }, [session])

  // Vì component được remount (key={sessionId} ở ChatPage) mỗi khi đổi session,
  // state này luôn bắt đầu rỗng đúng lúc, không cần effect để reset thủ công.
  // TODO: thay bằng gọi API gửi tin nhắn thật (POST /chat/sessions/:id/messages) khi BE có endpoint.
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([])

  const messages = useMemo(() => {
    if (apiMessages.length === 0 && pendingMessages.length === 0) {
      return session
        ? [
            {
              id: 'welcome',
              role: 'assistant' as const,
              text: `Hey ${fullName || 'bạn'} 👋 Tôi đã xem lộ trình ${session.title} của bạn. Bạn muốn bắt đầu từ đâu?`,
            },
          ]
        : []
    }
    return [...apiMessages, ...pendingMessages]
  }, [apiMessages, pendingMessages, session, fullName])

  const handleSend = () => {
    if (!input.trim()) return
    setPendingMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: input.trim() }])
    setInput('')
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
        <span className='text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-1'>
          Roadmap loaded
        </span>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className='flex flex-col gap-4 max-w-3xl'>
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
                className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='shrink-0 px-6 pb-5 pt-2 border-t border-gray-100'>
        <div className='flex flex-wrap gap-2 mb-3'>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => setInput(s)}
              className='text-sm text-gray-700 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-gray-300 hover:bg-gray-50 transition-colors'
            >
              {s}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-4 mb-2 px-1'>
          <button
            type='button'
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors'
          >
            <Paperclip className='w-3.5 h-3.5' />
            CV
          </button>
          <button
            type='button'
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors'
          >
            <FileText className='w-3.5 h-3.5' />
            Transcript
          </button>
          <button
            type='button'
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors'
          >
            <FaGithub className='w-3.5 h-3.5' />
            GitHub URL
          </button>
        </div>

        <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:border-gray-300'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
            type='text'
            placeholder='Ask anything about your career...'
            className='flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400'
          />
          <button
            type='button'
            onClick={handleSend}
            className='w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors'
          >
            <Send className='w-4 h-4 text-white' />
          </button>
        </div>
      </div>
    </>
  )
}
