import http from '../config/http'
import type {
  GetNotificationsParams,
  NotificationListResponse,
  NotificationResponse,
  UnreadCountResponse,
} from '../types/api/notification.types'

class NotificationRepository {
  private readonly PREFIX = '/notifications'

  // GET /api/v1/notifications — Lấy danh sách thông báo của tôi
  getAll(params?: GetNotificationsParams) {
    return http.get<NotificationListResponse>(this.PREFIX, { params })
  }

  // GET /api/v1/notifications/unread-count — Lấy số lượng thông báo chưa đọc
  getUnreadCount() {
    return http.get<UnreadCountResponse>(`${this.PREFIX}/unread-count`)
  }

  // PATCH /api/v1/notifications/:id/read — Đánh dấu 1 thông báo đã đọc
  markAsRead(id: string) {
    return http.patch<NotificationResponse>(`${this.PREFIX}/${id}/read`)
  }
}

export const notificationRepo = new NotificationRepository()
