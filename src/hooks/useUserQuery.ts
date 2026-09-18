import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userRepo } from '../repository/user.repo'
import { getAccessTokenFromLS } from '../utils/auth'
import type { UpdateProfilePayload } from '../schemas/auth.schema'
import { toast } from 'sonner'
import type { UserRole } from '../types/api/user.type'

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userRepo.getProfile(),
    enabled: !!getAccessTokenFromLS(), // chỉ gọi khi có token trong LS
    retry: false, // token sai thì không cần retry
    staleTime: Infinity, // Không refetch lại khi focus tab
    gcTime: 5 * 60 * 1000, // Cache 5 phút
  })
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userRepo.updateProfile(payload),
    onSuccess: (response) => {
      // Ghi thẳng data mới nhất vào cache 'profile' để UI cập nhật ngay,
      // không cần chờ refetch
      queryClient.setQueryData(['profile'], response)
    },
  })
}

export const useAllUsersQuery = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userRepo.getAllUsers(),
    staleTime: 60 * 1000, // 1 phút
  })
}

export const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) => userRepo.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('Cập nhật role thành công!')
      // refetch lại danh sách để đồng bộ số liệu trên StatCard
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
