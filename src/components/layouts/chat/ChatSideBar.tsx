import { MessageSquare, Plus } from 'lucide-react'
import type { ChatSession } from '../../../types/api/chat.types'

function formatTime(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNewChat,
}: {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelect: (sessionId: string) => void
  onNewChat: () => void
}) {
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.lastMessageAt ?? b.createdAt).getTime() - new Date(a.lastMessageAt ?? a.createdAt).getTime(),
  )

  return (
    // Không còn tự set w-72/border-r/h-full ở đây nữa — ChatPage.tsx bọc component này
    // trong 1 "card" riêng (border + rounded-2xl + shadow-sm) rồi, component chỉ cần lấp đầy card đó.
    <div className='w-full h-full flex flex-col'>
      <div className='p-4'>
        <button
          type='button'
          onClick={onNewChat}
          className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium rounded-xl py-2.5'
        >
          <Plus className='w-4 h-4' />
          New chat
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin'>
        <p className='px-2 text-[11px] font-semibold text-gray-400 mb-2 tracking-wide uppercase'>History</p>

        {sorted.length === 0 ? (
          <p className='text-sm text-gray-400 px-2 py-2.5'>Chưa có phiên chat nào.</p>
        ) : (
          <div className='space-y-1'>
            {sorted.map((session) => {
              const isActive = session.id === activeSessionId
              return (
                <button
                  key={session.id}
                  type='button'
                  onClick={() => onSelect(session.id)}
                  // border-transparent khi không active: giữ layout ổn định (không bị "nhảy" 1px)
                  // so với lúc active có border-indigo-200 thật, vì cả 2 trạng thái đều tốn đúng 1px border.
                  className={`w-full flex items-start gap-2 px-3 py-2.5 rounded-xl text-left transition-colors border ${
                    isActive ? 'bg-indigo-50/60 border-indigo-200' : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare
                    className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}
                  />
                  <span className='min-w-0'>
                    <span className='block text-sm text-gray-800 truncate'>{session.title}</span>
                    <span className='block text-xs text-gray-400'>
                      {isActive ? 'Đang mở' : formatTime(session.lastMessageAt ?? session.createdAt)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
