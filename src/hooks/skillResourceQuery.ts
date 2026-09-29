import { useQuery } from '@tanstack/react-query'
import { skillResourceRepo } from '../repository/skillResource.repo'
import { getAccessTokenFromLS } from '../utils/auth'

export const useTopSkillResourcesQuery = (limit = 10) => {
  return useQuery({
    queryKey: ['skill-resources', 'top', limit],
    queryFn: () => skillResourceRepo.getTop({ limit }),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useGroupedSkillResourcesQuery = (skillId?: string) => {
  return useQuery({
    queryKey: ['skill-resources', 'grouped', skillId],
    queryFn: () => skillResourceRepo.getGroupedBySkill(skillId as string),
    enabled: !!getAccessTokenFromLS() && !!skillId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })
}
