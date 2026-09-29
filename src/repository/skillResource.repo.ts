import http from '../config/http'
import type {
  GetTopSkillResourcesParams,
  GroupedSkillResourcesResponse,
  SkillResourcesResponse,
  TopSkillResourcesResponse,
} from '../types/api/skillResource.types'

class SkillResourceRepository {
  private readonly PREFIX = '/skill-resources'

  // GET /api/v1/skill-resources/top
  getTop(params?: GetTopSkillResourcesParams) {
    return http.get<TopSkillResourcesResponse>(`${this.PREFIX}/top`, { params })
  }

  // GET /api/v1/skill-resources/skills/:skillId/resources (dạng phẳng)
  getBySkill(skillId: string) {
    return http.get<SkillResourcesResponse>(`${this.PREFIX}/skills/${skillId}/resources`, {
      timeout: 60_000,
    })
  }

  // GET /api/v1/skill-resources/skills/:skillId/resources/grouped (đã chia nhóm cho UI)
  getGroupedBySkill(skillId: string) {
    return http.get<GroupedSkillResourcesResponse>(`${this.PREFIX}/skills/${skillId}/resources/grouped`, {
      timeout: 60_000, // lần đầu BE phải cào dữ liệu nên có thể lâu hơn 10s
    })
  }
}

export const skillResourceRepo = new SkillResourceRepository()
