import http from '../config/http'
import type { JobRecommendationPayload } from '../schemas/job.schema'
import type { CheckProfileResponse, RecommendationResponse, TrendingJobsResponse } from '../types/api/job.types'

class JobRepository {
  private readonly PREFIX = '/jobs'

  // GET /api/v1/jobs/trending (PUBLIC)
  getTrending() {
    return http.get<TrendingJobsResponse>(`${this.PREFIX}/trending`)
  }

  // GET /api/v1/jobs/check-profile [STUDENT]
  checkProfile() {
    return http.get<CheckProfileResponse>(`${this.PREFIX}/check-profile`)
  }

  // POST /api/v1/jobs/recommendations [STUDENT]
  // AI phân tích nên chậm -> nâng timeout riêng (http mặc định chỉ 10s)
  getRecommendations(payload: JobRecommendationPayload) {
    return http.post<RecommendationResponse>(`${this.PREFIX}/recommendations`, payload, {
      timeout: 60_000,
    })
  }
}

export const jobRepo = new JobRepository()
