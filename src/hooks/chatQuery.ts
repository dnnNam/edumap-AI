import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatRepo } from '../repository/chat.repo'
import type { CreateChatSessionPayload } from '../types/api/chat.types'
import { getAccessTokenFromLS } from '../utils/auth'
import { toast } from 'sonner'

const CHAT_SESSIONS_KEY = ['chat-sessions']

export const useCreateChatSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateChatSessionPayload) => chatRepo.createSession(payload),
    onSuccess: () => {
      toast.success('Tạo phiên chat thành công! Tiến hành chat.')
      // Tạo xong -> làm mới danh sách session để sidebar cập nhật ngay
      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_KEY })
    },
  })
}

export const useChatSessionsQuery = () => {
  return useQuery({
    queryKey: CHAT_SESSIONS_KEY,
    queryFn: () => chatRepo.getSessions(),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useChatSessionQuery = (sessionId: string | null) => {
  return useQuery({
    queryKey: [...CHAT_SESSIONS_KEY, sessionId],
    queryFn: () => chatRepo.getSession(sessionId as string),
    enabled: !!getAccessTokenFromLS() && !!sessionId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      chatRepo.sendMessage(sessionId, { content }),

    // Return promise để mutation vẫn ở trạng thái pending cho tới khi refetch xong:
    // lúc callback onSuccess ở component chạy thì cache đã có tin nhắn thật từ server,
    // component xóa tin nhắn tạm ngay lúc đó -> không bị hiện trùng 2 lần.
    // Prefix ['chat-sessions'] làm mới cả session đang mở lẫn danh sách (sidebar sắp xếp theo lastMessageAt).
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_KEY }),
  })
}

export const useDeleteChatSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => chatRepo.deleteSession(sessionId),
    onSuccess: (response, sessionId) => {
      toast.success(response.data.data.message || 'Đã xóa cuộc trò chuyện.')

      // Hủy request đang bay (nếu có) rồi xóa hẳn cache chi tiết của session vừa xóa —
      // KHÔNG dùng invalidateQueries cho key này vì query GET /chat/sessions/:id vẫn có thể
      // đang "enabled" (component chưa kịp unmount) -> bị trigger refetch -> BE trả 404
      // vì session đã không còn tồn tại nữa.
      queryClient.cancelQueries({ queryKey: [...CHAT_SESSIONS_KEY, sessionId] })
      queryClient.removeQueries({ queryKey: [...CHAT_SESSIONS_KEY, sessionId] })

      // exact: true -> chỉ làm mới đúng danh sách sessions, không cascade sang các
      // session detail khác đang mở (nếu không set exact, prefix ['chat-sessions'] sẽ match luôn chúng)
      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_KEY, exact: true })
    },
  })
}
