import type { ApiResponse } from './auth.types'

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

// Khớp với 1 item trong data.data của GET /notifications
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  link: string | null
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Khớp với field "data" bên trong response: { data: [...], meta: {...} }
export interface NotificationListData {
  data: Notification[]
  meta: NotificationMeta
}

export type NotificationListResponse = ApiResponse<NotificationListData>

// Khớp với PATCH /notifications/:id/read -> trả về notification đã cập nhật
export type NotificationResponse = ApiResponse<Notification>

// Khớp với GET /notifications/unread-count -> { success, statusCode, data: { unreadCount } }
export type UnreadCountResponse = ApiResponse<{ unreadCount: number }>

export interface GetNotificationsParams {
  page?: number
  limit?: number
  type?: NotificationType
  isRead?: boolean
}
