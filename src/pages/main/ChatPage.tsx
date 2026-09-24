import { useMemo, useState } from 'react'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'
import { useChatSessionsQuery } from '../../hooks/chatQuery'
import NewChatState from '../../components/layouts/chat/NewChatState'
import ChatConverstation from '../../components/layouts/chat/ChatConverstation'
import ChatEmptyState from '../../components/layouts/chat/ChatEmptyState'
import ChatSidebar from '../../components/layouts/chat/ChatSideBar'
import ChatUploadRequiredState from '../../components/layouts/chat/ChatUploadRequiredState'

export default function ChatPage() {
  const { data: sessionsResponse, isLoading: sessionsLoading } = useChatSessionsQuery()
  const sessions = sessionsResponse?.data?.data ?? []

  const [manualSessionId, setManualSessionId] = useState<string | null>(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  // true khi BE từ chối tạo session vì user chưa có dữ liệu phân tích (400) —
  // hiển thị ChatUploadRequiredState cho đến khi user thử New chat lại
  const [blocked, setBlocked] = useState(false)

  const latestSessionId = useMemo(() => {
    if (sessions.length === 0) return null
    return [...sessions].sort(
      (a, b) => new Date(b.lastMessageAt ?? b.createdAt).getTime() - new Date(a.lastMessageAt ?? a.createdAt).getTime(),
    )[0].id
  }, [sessions])

  const resolvedSessionId = manualSessionId ?? latestSessionId

  const openNewChat = () => {
    setBlocked(false)
    setIsNewChatOpen(true)
  }

  if (sessionsLoading) return <AppLoadingSkeleton />

  return (
    // h-full (không dùng flex-1): cha trực tiếp là <motion.div className='h-full'> của AnimatedOutlet,
    // không phải flex container nên flex-1 không có tác dụng -> khung chat bị co lại theo nội dung
    <div className='h-full p-4'>
      {/* Bỏ min-h-[600px] để khung luôn vừa khít chiều cao còn lại của trang */}
      <div className='h-full flex min-h-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <ChatSidebar
          sessions={sessions}
          activeSessionId={resolvedSessionId}
          onSelect={(id) => {
            setBlocked(false)
            setManualSessionId(id)
          }}
          onNewChat={openNewChat}
        />

        {/* min-h-0: để vùng tin nhắn (overflow-y-auto) cuộn bên trong, ô nhập luôn dính đáy */}
        <div className='flex-1 flex flex-col min-w-0 min-h-0'>
          {resolvedSessionId ? (
            <ChatConverstation key={resolvedSessionId} sessionId={resolvedSessionId} />
          ) : blocked ? (
            <ChatUploadRequiredState />
          ) : (
            <ChatEmptyState onNewChat={openNewChat} />
          )}
        </div>
      </div>

      {/* Popup nhập tiêu đề — đè lên trên, không thay thế khung chat */}
      <NewChatState
        open={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreated={(session) => {
          setIsNewChatOpen(false)
          setBlocked(false)
          setManualSessionId(session.id)
        }}
        onBlocked={() => {
          setIsNewChatOpen(false)
          setBlocked(true)
        }}
      />
    </div>
  )
}
