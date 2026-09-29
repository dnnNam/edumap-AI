import http from '../config/http'
import type { GetTopSkillResourcesParams, TopSkillResourcesResponse } from '../types/api/skillResource.types'

class SkillResourceRepository {
  private readonly PREFIX = '/skill-resources'

  // GET /api/v1/skill-resources/top — Lấy danh sách tài nguyên hàng đầu (Top Rated)
  getTop(params?: GetTopSkillResourcesParams) {
    return http.get<TopSkillResourcesResponse>(`${this.PREFIX}/skill-resources/top`, { params })
  }
}

export const skillResourceRepo = new SkillResourceRepository()
