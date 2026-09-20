import { useQuery } from '@tanstack/react-query'
import { skillRepo } from '../repository/skill.repo'
import { getAccessTokenFromLS } from '../utils/auth'

export const useMySkillsSummaryQuery = () => {
  return useQuery({
    queryKey: ['skills', 'my-skills-summary'],
    queryFn: () => skillRepo.getMySkillsSummary(),
    enabled: !!getAccessTokenFromLS(), // chỉ gọi khi có token trong LS
    retry: false,
    refetchOnWindowFocus: false,
  })
}
