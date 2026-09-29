import http from '../config/http'
import type {
  FetchMoreSkillResourcesResponse,
  GetTopSkillResourcesParams,
  GroupedSkillResourcesResponse,
  SkillResourceDetailResponse,
  SkillResourcesResponse,
  TopSkillResourcesResponse,
  ResourceHistoryResponse,
} from '../types/api/skillResource.types'

class SkillResourceRepository {
  private readonly PREFIX = '/skill-resources'

  // GET /api/v1/skill-resources/top
  getTop(params?: GetTopSkillResourcesParams) {
    return http.get<TopSkillResourcesResponse>(`${this.PREFIX}/skill-resources/top`, { params })
  }

  // GET /api/v1/skill-resources/skills/:skillId/resources (dạng phẳng)
  getBySkill(skillId: string) {
    return http.get<SkillResourcesResponse>(`${this.PREFIX}/skills/${skillId}/resources`, {
      timeout: 60_000,
    })
  }

  getGroupedBySkill(skillId: string, limit = 50) {
    // ← max 50
    return http.get<GroupedSkillResourcesResponse>(`${this.PREFIX}/skills/${skillId}/resources/grouped`, {
      params: { limit },
      timeout: 60_000,
    })
  }

  fetchMore(skillId: string, page: number, limit = 20) {
    // ← max 20
    return http.post<FetchMoreSkillResourcesResponse>(
      `${this.PREFIX}/skills/${skillId}/resources/fetch-more`,
      {},
      { params: { page, limit }, timeout: 60_000 },
    )
  }

  recordHistory(skillResourceId: string) {
    return http.post(`${this.PREFIX}/skill-resources/history`, {
      skillResourceId,
    })
  }

  getById(id: string) {
    return http.get<SkillResourceDetailResponse>(`${this.PREFIX}/skill-resources/${id}`)
  }

  // GET /api/v1/skill-resources/skill-resources/history
  getHistory(limit = 20) {
    return http.get<ResourceHistoryResponse>(`${this.PREFIX}/skill-resources/history`, {
      params: { limit },
    })
  }
}

export const skillResourceRepo = new SkillResourceRepository()
