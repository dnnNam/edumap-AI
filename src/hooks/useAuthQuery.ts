import { useMutation, useQuery } from '@tanstack/react-query'
import type { ChangePasswordPayload, LoginPayload, RegisterApiPayload } from '../schemas/auth.schema'
import { authRepo } from '../repository/auth.repo'
import { getAccessTokenFromLS } from '../utils/auth'

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterApiPayload) => authRepo.register(data),
    // Bạn có thể để trống onSuccess/onError ở đây nếu muốn UI tự xử lý
  })
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authRepo.login(data),
  })
}

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn: () => authRepo.getMe(),
    enabled: !!getAccessTokenFromLS(), // chỉ gọi khi có token trong LS
    retry: false, // token sai thì không cần retry
    staleTime: Infinity, // Không refetch lại khi focus tab
    gcTime: 5 * 60 * 1000, // Cache 5 phút
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (body: ChangePasswordPayload) => authRepo.changePassword(body),
  })
}
