import { useMutation } from '@tanstack/react-query'
import type { GenerateSkillTreePayload } from '../types/api/ai-advisor.types'
import { aiAdvisorRepo } from '../repository/ai-advisor.repo'

export const useGenerateSkillTreeMutation = () => {
  return useMutation({
    mutationFn: (payload: GenerateSkillTreePayload) => aiAdvisorRepo.generateSkillTree(payload),
  })
}
