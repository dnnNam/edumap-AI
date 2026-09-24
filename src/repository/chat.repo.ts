import http from '../config/http'
import type {
  ChatSessionResponse,
  ChatSessionListResponse,
  ChatSessionDetailResponse,
  CreateChatSessionPayload,
} from '../types/api/chat.types'

class ChatRepository {
  private readonly PREFIX = '/chat'

  createSession(payload: CreateChatSessionPayload) {
    return http.post<ChatSessionResponse>(`${this.PREFIX}/sessions`, payload)
  }

  // GET /api/v1/chat/sessions — Lấy danh sách phiên trò chuyện của tôi
  getSessions() {
    return http.get<ChatSessionListResponse>(`${this.PREFIX}/sessions`)
  }

  // GET /api/v1/chat/sessions/:sessionId — Lấy chi tiết một phiên trò chuyện
  getSession(sessionId: string) {
    return http.get<ChatSessionDetailResponse>(`${this.PREFIX}/sessions/${sessionId}`)
  }

  // TODO: bổ sung khi BE có endpoint gửi tin nhắn — POST /chat/sessions/:id/messages
}

export const chatRepo = new ChatRepository()
