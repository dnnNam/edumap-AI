import { useState } from 'react'

import { useChatSessionsQuery } from '../../hooks/chatQuery'
import type { ChatSession } from '../../types/api/chat.types'
import ChatSidebar from '../../components/layouts/chat/ChatSideBar'
import ChatUploadRequiredState from '../../components/layouts/chat/ChatUploadRequiredState'
import ChatConverstation from '../../components/layouts/chat/ChatConverstation'
import ChatEmptyState from '../../components/layouts/chat/ChatEmptyState'
import NewChatState from '../../components/layouts/chat/NewChatState'

// Trang tổng của /chat: quản lý danh sách session + session đang mở,
// còn việc render nội dung 1 cuộc hội thoại cụ thể giao hết cho ChatConverstation (nhận prop sessionId).
export default function ChatPage() {
  const { data: sessionsResponse, isLoading } = useChatSessionsQuery()
  const sessions = sessionsResponse?.data?.data ?? []

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [showNewChat, setShowNewChat] = useState(false)
  const [uploadRequired, setUploadRequired] = useState(false)

  const handleCreated = (session: ChatSession) => {
    setShowNewChat(false)
    setUploadRequired(false)
    setActiveSessionId(session.id)
  }

  if (isLoading) {
    return <div className='flex-1 flex items-center justify-center text-sm text-gray-400'>Đang tải...</div>
  }

  return (
    // h-full (KHÔNG phải flex-1) vì cha trực tiếp là <motion.div className='h-full w-full'> trong
    // AnimatedOutlet.tsx — 1 div thường, không phải flex container, nên flex-1 ở đây sẽ vô tác dụng
    // và làm div này co lại theo nội dung (shrink-to-fit) thay vì lấp đầy chiều cao khả dụng.
    <div className='h-full min-h-0 bg-gray-50 p-6'>
      <div className='flex h-full min-h-0 gap-6'>
        {/* Card 1: lịch sử chat — border + rounded-2xl + shadow-sm riêng, tách hẳn khỏi card chat bên phải */}
        <div className='w-72 shrink-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={(id) => {
              setUploadRequired(false)
              setActiveSessionId(id)
            }}
            onNewChat={() => setShowNewChat(true)}
          />
        </div>

        {/* Card 2: khung hội thoại — dùng chung style border/rounded/shadow với card 1 để 2 khối đồng bộ */}
        <div className='flex-1 min-w-0 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
          {uploadRequired ? (
            <ChatUploadRequiredState />
          ) : activeSessionId ? (
            // key={activeSessionId}: remount ChatConverstation khi đổi session, tự reset state nội bộ (pending messages, input...)
            <ChatConverstation
              key={activeSessionId}
              sessionId={activeSessionId}
              // Xóa xong -> quay về ChatEmptyState (activeSessionId = null)
              onDeleted={() => setActiveSessionId(null)}
            />
          ) : (
            <ChatEmptyState onNewChat={() => setShowNewChat(true)} />
          )}
        </div>
      </div>

      <NewChatState
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        onCreated={handleCreated}
        onBlocked={() => {
          setShowNewChat(false)
          setUploadRequired(true)
        }}
      />
    </div>
  )
}
