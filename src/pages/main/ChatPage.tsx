import { useState } from 'react'
import { ArrowLeft, MessageSquare } from 'lucide-react'

import { useChatSessionsQuery } from '../../hooks/chatQuery'
import type { ChatSession } from '../../types/api/chat.types'
import ChatSidebar from '../../components/layouts/chat/ChatSideBar'
import ChatUploadRequiredState from '../../components/layouts/chat/ChatUploadRequiredState'
import ChatConverstation from '../../components/layouts/chat/ChatConverstation'
import ChatEmptyState from '../../components/layouts/chat/ChatEmptyState'
import NewChatState from '../../components/layouts/chat/NewChatState'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'

export default function ChatPage() {
  const { data: sessionsResponse, isLoading } = useChatSessionsQuery()
  const sessions = sessionsResponse?.data?.data ?? []

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [showNewChat, setShowNewChat] = useState(false)
  const [uploadRequired, setUploadRequired] = useState(false)
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true)

  const handleCreated = (session: ChatSession) => {
    setShowNewChat(false)
    setUploadRequired(false)
    setActiveSessionId(session.id)
    setMobileShowSidebar(false)
  }

  if (isLoading) {
    return <AppLoadingSkeleton />
  }

  return (
    <div className='h-full min-h-0 bg-gray-50 dark:bg-[#121114] p-3 sm:p-6 flex flex-col transition-colors'>
      {/* Mobile top switcher when session active */}
      <div className='md:hidden flex items-center justify-between pb-2 mb-2 border-b border-gray-200 dark:border-white/10'>
        {mobileShowSidebar ? (
          <div className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-[#ECE9E4]'>
            <MessageSquare className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
            <span>Chat Sessions ({sessions.length})</span>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => setMobileShowSidebar(true)}
            className='inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-[#A99DFF] bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/40'
          >
            <ArrowLeft className='w-3.5 h-3.5' />
            <span>All Sessions</span>
          </button>
        )}
      </div>

      <div className='flex flex-1 min-h-0 gap-3 sm:gap-6 relative'>
        {/* Card 1: Sidebar (sessions) */}
        <div
          className={`
            w-full md:w-72 shrink-0 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden transition-colors
            ${mobileShowSidebar ? 'flex flex-col h-full' : 'hidden md:flex md:flex-col md:h-full'}
          `}
        >
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={(id) => {
              setUploadRequired(false)
              setActiveSessionId(id)
              setMobileShowSidebar(false)
            }}
            onNewChat={() => setShowNewChat(true)}
          />
        </div>

        {/* Card 2: Chat message conversation container */}
        <div
          className={`
            flex-1 min-w-0 flex flex-col bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden transition-colors
            ${!mobileShowSidebar ? 'flex flex-col h-full' : 'hidden md:flex md:flex-col md:h-full'}
          `}
        >
          {uploadRequired ? (
            <ChatUploadRequiredState />
          ) : activeSessionId ? (
            <ChatConverstation
              key={activeSessionId}
              sessionId={activeSessionId}
              onDeleted={() => {
                setActiveSessionId(null)
                setMobileShowSidebar(true)
              }}
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
