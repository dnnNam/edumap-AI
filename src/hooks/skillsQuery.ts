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

// Admin: lấy toàn bộ skill trong hệ thống
export const useAllSkillsQuery = () => {
  return useQuery({
    queryKey: ['skills', 'all'],
    queryFn: () => skillRepo.getAllSkills(),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
  })
}
