import type { ApiResponse } from './auth.types'

export interface CreateChatSessionPayload {
  title: string
}

// Tin nhắn thô từ API — chưa rõ field content/text thật sự tên gì vì mẫu response messages: []
export interface ChatApiMessage {
  id: string
  role: 'user' | 'assistant'
  content?: string
  text?: string
  createdAt?: string
}

// Khớp với response thật của GET /chat/sessions và GET /chat/sessions/:id
export interface ChatSession {
  id: string
  userId: string
  skillTreeId: string | null
  analysisId: string | null
  title: string
  lastMessageAt: string | null
  createdAt: string
  updatedAt: string
  messages: ChatApiMessage[]
}

export type ChatSessionResponse = ApiResponse<ChatSession>
export type ChatSessionListResponse = ApiResponse<ChatSession[]>
export type ChatSessionDetailResponse = ApiResponse<ChatSession>

// Message dùng cho UI local (sau khi map từ ChatApiMessage)
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}
