import http from '../config/http'
import type { TrendingJobsResponse } from '../types/api/job.types'

class JobRepository {
  private readonly PREFIX = '/jobs'

  // GET /api/v1/jobs/trending (PUBLIC)
  getTrending() {
    return http.get<TrendingJobsResponse>(`${this.PREFIX}/trending`)
  }
}

export const jobRepo = new JobRepository()
