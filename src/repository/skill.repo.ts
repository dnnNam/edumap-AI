// src/repository/skill.repo.ts
import http from '../config/http'
import type {
  AllSkillsResponse,
  CreateSkillPayload,
  MySkillsSummaryResponse,
  UpdateSkillPayload,
} from '../types/api/skills.type'

class SkillRepository {
  // Khai báo prefix chung cho toàn bộ API trong class này
  private readonly PREFIX = '/skills'

  // Tổng quan kỹ năng của user hiện tại (dùng cho Dashboard)
  getMySkillsSummary() {
    return http.get<MySkillsSummaryResponse>(`${this.PREFIX}/my-skills/summary`)
  }

  // [ADMIN] Toàn bộ skill
  getAllSkills() {
    return http.get<AllSkillsResponse>(this.PREFIX)
  }

  // [ADMIN] Tạo kỹ năng mới
  createSkill(payload: CreateSkillPayload) {
    return http.post(this.PREFIX, payload)
  }
  updateSkill(id: string, payload: UpdateSkillPayload) {
    return http.patch(`${this.PREFIX}/${id}`, payload)
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const skillRepo = new SkillRepository()
