import http from '../config/http'
import type {
  ChatSessionResponse,
  ChatSessionListResponse,
  ChatSessionDetailResponse,
  CreateChatSessionPayload,
  SendChatMessagePayload,
  SendChatMessageResponse,
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

  // POST /api/v1/chat/sessions/:sessionId/messages — Gửi câu hỏi và nhận lời khuyên AI dựa trên lộ trình hiện tại
  sendMessage(sessionId: string, payload: SendChatMessagePayload) {
    return http.post<SendChatMessageResponse>(`${this.PREFIX}/sessions/${sessionId}/messages`, payload, {
      // AI trả lời có thể lâu hơn 10s mặc định của http.ts, nâng lên 2 phút như generateSkillTree
      timeout: 120_000,
    })
  }
}

export const chatRepo = new ChatRepository()
