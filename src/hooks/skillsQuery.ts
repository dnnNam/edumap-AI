// src/hooks/skillsQuery.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { skillRepo } from '../repository/skill.repo'
import type { CreateSkillPayload } from '../types/api/skills.type'
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
      toast.success('Skill created successfully.')
      queryClient.invalidateQueries({ queryKey: ['skills'] }) // refresh danh sách
    },
    // http.ts đã toast mọi lỗi trừ 422 -> chỉ xử lý 422 ở đây
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 422) {
        toast.error(error.response.data?.message || 'Invalid data, please check the form.')
      }
    },
  })
}
