import i18n from '../i18n'
// src/hooks/skillsQuery.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { skillRepo } from '../repository/skill.repo'
import type { CreateSkillPayload, UpdateSkillPayload } from '../types/api/skills.type'
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

// [ADMIN] Lấy toàn bộ skill
export const useAllSkillsQuery = () => {
  return useQuery({
    queryKey: ['skills', 'all'],
    queryFn: () => skillRepo.getAllSkills(),
    enabled: !!getAccessTokenFromLS(),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

// [ADMIN] Tạo skill mới
export const useCreateSkillMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSkillPayload) => skillRepo.createSkill(payload),
    onSuccess: () => {
      toast.success(i18n.t('toast.skillCreated'))
      queryClient.invalidateQueries({ queryKey: ['skills'] }) // refresh danh sách
    },
    // http.ts đã toast mọi lỗi trừ 422 -> chỉ xử lý 422 ở đây
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 422) {
        toast.error(error.response.data?.message || i18n.t('toast.invalidData'))
      }
    },
  })
}

export const useUpdateSkillMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSkillPayload }) => skillRepo.updateSkill(id, payload),
    onSuccess: () => {
      toast.success(i18n.t('toast.skillUpdated'))
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}

export const useDeleteSkillMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => skillRepo.deleteSkill(id),
    onSuccess: () => {
      toast.success(i18n.t('toast.skillDeleted'))
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}
