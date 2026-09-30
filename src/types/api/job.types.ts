import type { ApiResponse } from './auth.types'

export interface TrendingRole {
  rank: number
  targetRole: string
  searchCount: number
  badge: string
}

// Phần `data` bên trong response ngoài cùng
export interface TrendingJobsBody {
  success: boolean
  statusCode: number
  source: string
  message: string
  data: TrendingRole[]
}

// { success, statusCode, data: { ..., data: TrendingRole[] } }
export type TrendingJobsResponse = ApiResponse<TrendingJobsBody>
