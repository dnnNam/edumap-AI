import type { ApiResponse } from './auth.types'

export interface CreateChatSessionPayload {
  title: string
}

// Body của POST /chat/sessions/:sessionId/messages
export interface SendChatMessagePayload {
  content: string
}

// Tin nhắn thô từ API — chưa rõ field content/text thật sự tên gì vì mẫu response messages: []
export interface ChatApiMessage {
  id: string
  role: 'USER' | 'ASSISTANT'
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

// Response 201 của gửi tin nhắn. Chưa biết chính xác cấu trúc data nên để unknown —
// FE không phụ thuộc vào nó, sau khi gửi xong sẽ refetch lại session để lấy tin nhắn mới nhất.
export type SendChatMessageResponse = ApiResponse<unknown>

// Message dùng cho UI local (sau khi map từ ChatApiMessage)
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export interface DeleteChatSessionData {
  message: string
  sessionId: string
}

export type DeleteChatSessionResponse = ApiResponse<DeleteChatSessionData>
