import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { skillResourceRepo } from '../repository/skillResource.repo'
import { getAccessTokenFromLS } from '../utils/auth'
import { toast } from 'sonner'
import type { CreateSkillResourcePayload } from '../types/api/skillResource.types'

export const GROUPED_KEY = (skillId?: string) => ['skill-resources', 'grouped', skillId]
export const HISTORY_KEY = () => ['skill-resources', 'history']

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

export const useRecordResourceHistoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (skillResourceId: string) => skillResourceRepo.recordHistory(skillResourceId),
    onSuccess: () => {
      // Invalidate history cache sau khi thêm record mới
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY() })
    },
    onError: () => {
      // Lỗi history không quan trọng, không toast
      console.warn('Failed to record resource history')
    },
  })
}

export const useSkillResourceByIdQuery = (resourceId?: string) => {
  return useQuery({
    queryKey: ['skill-resources', 'by-id', resourceId],
    queryFn: () => skillResourceRepo.getById(resourceId as string),
    enabled: !!getAccessTokenFromLS() && !!resourceId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useResourceHistoryQuery = (limit = 20) => {
  return useQuery({
    queryKey: HISTORY_KEY(),
    queryFn: () => skillResourceRepo.getHistory(limit),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 min
  })
}

export const useCreateSkillResourceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSkillResourcePayload) => skillResourceRepo.create(payload),
    onSuccess: () => {
      toast.success('Đã tạo tài nguyên mới')
      // làm mới mọi cache resource (top, grouped...) để dữ liệu mới hiện ngay
      queryClient.invalidateQueries({ queryKey: ['skill-resources'] })
    },
  })
}
