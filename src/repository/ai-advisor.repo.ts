import http from '../config/http'
import type { GenerateSkillTreePayload, GenerateSkillTreeResponse } from '../types/api/ai-advisor.types'

class AiAdvisorRepository {
  // Khai báo prefix chung cho toàn bộ API trong class này
  private readonly PREFIX = '/ai-advisor'

  // Phân tích AI và tạo Skill Tree
  generateSkillTree(payload: GenerateSkillTreePayload) {
    return http.post<GenerateSkillTreeResponse>(`${this.PREFIX}/generate-skill-tree`, payload, {
      // set up time out này khác tầm 2 phút thay vì 1 phút mặc định
      timeout: 120_000,
    })
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const aiAdvisorRepo = new AiAdvisorRepository()
