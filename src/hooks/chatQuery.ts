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
