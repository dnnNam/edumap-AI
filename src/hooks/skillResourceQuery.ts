import { useQuery } from '@tanstack/react-query'
import { skillResourceRepo } from '../repository/skillResource.repo'
import { getAccessTokenFromLS } from '../utils/auth'

export const useTopSkillResourcesQuery = (limit = 10) => {
  return useQuery({
    // limit nằm trong key để mỗi giá trị limit có cache riêng
    queryKey: ['skill-resources', 'top', limit],
    queryFn: () => skillResourceRepo.getTop({ limit }),
    enabled: !!getAccessTokenFromLS(), // chỉ gọi khi có token trong LS
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // danh sách top ít đổi -> cache 5 phút
  })
}
