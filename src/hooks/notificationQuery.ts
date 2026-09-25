import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationRepo } from '../repository/notification.repo'
import type { GetNotificationsParams } from '../types/api/notification.types'
import { getAccessTokenFromLS } from '../utils/auth'
import { toast } from 'sonner'

export const useNotificationsQuery = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationRepo.getAll(params),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

// Dùng riêng cho badge chuông ở AppHeader — gọi thẳng GET /notifications/unread-count,
// nhẹ hơn nhiều so với việc tải cả danh sách rồi đếm ở FE.
export const useUnreadNotificationsCount = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationRepo.getUnreadCount(),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
  })
  const unreadCount = data?.data?.data?.unreadCount ?? 0
  return { unreadCount, ...rest }
}

// PATCH /notifications/:id/read — đọc xong thì làm mới cả list và badge chuông.
export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationRepo.markAsRead(id),
    onSuccess: () => {
      // predicate theo phần tử đầu của queryKey để invalidate luôn cả
      // ['notifications', params] (danh sách) lẫn ['notifications', 'unread-count'] (badge)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationRepo.markAllRead(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success(res.data.data.message, { duration: 1500 })
    },
  })
}
