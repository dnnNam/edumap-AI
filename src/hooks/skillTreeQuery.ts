import { useQuery } from '@tanstack/react-query'
import { skillTreeRepo } from '../repository/skillTree.repo'
import { getAccessTokenFromLS } from '../utils/auth'

export const useMySkillTreeQuery = () => {
  return useQuery({
    queryKey: ['Skill-tree'],
    queryFn: () => skillTreeRepo.getSkillTree(),
    enabled: !!getAccessTokenFromLS(), // chỉ gọi khi có token trong LS
    retry: false, // chưa có cây (404) hoặc token sai thì không cần retry
    refetchOnWindowFocus: false,
  })
}
