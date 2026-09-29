import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { skillResourceRepo } from '../repository/skillResource.repo'
import { getAccessTokenFromLS } from '../utils/auth'

export const GROUPED_KEY = (skillId?: string) => ['skill-resources', 'grouped', skillId]

export const useTopSkillResourcesQuery = (limit = 50) => {
  return useQuery({
    queryKey: ['skill-resources', 'top', limit],
    queryFn: () => skillResourceRepo.getTop({ limit }), // ← Gửi limit=50
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })
}
export const useGroupedSkillResourcesQuery = (skillId?: string, limit = 50) => {
  return useQuery({
    queryKey: GROUPED_KEY(skillId),
    queryFn: () => skillResourceRepo.getGroupedBySkill(skillId as string, limit),
    enabled: !!getAccessTokenFromLS() && !!skillId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFetchMoreSkillResourcesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ skillId, page }: { skillId: string; page: number }) =>
      skillResourceRepo.fetchMore(skillId, page, 20), // ← gửi limit = 20
    onSuccess: (response, { skillId }) => {
      queryClient.setQueryData(GROUPED_KEY(skillId), response)
    },
  })
}
