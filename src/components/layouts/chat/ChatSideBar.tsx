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
    <div className='w-72 shrink-0 border-r border-gray-200 flex flex-col h-full'>
      <div className='p-4'>
        <button
          type='button'
          onClick={onNewChat}
          className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium rounded-lg py-2.5'
        >
          <Plus className='w-4 h-4' />
          New chat
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-4 pb-4'>
        <p className='text-[11px] font-medium text-gray-400 mb-2 tracking-wide'>History</p>

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
                  className={`w-full flex items-start gap-2 px-2 py-2.5 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className='w-4 h-4 text-gray-400 mt-0.5 shrink-0' />
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
