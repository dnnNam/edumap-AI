import { useQuery } from '@tanstack/react-query'
import { getAccessTokenFromLS } from '../utils/auth'
import { userRepo } from '../repository/user.repo'

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
