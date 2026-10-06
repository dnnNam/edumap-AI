import type { ApiResponse } from './auth.types'

export interface JobPlatformLink {
  platform: string
  url: string
  title: string
}

export interface TrendingRole {
  rank: number
  targetRole: string
  searchCount: number
  badge: string
  // để optional phòng khi backend role nào đó chưa có link
  jobPlatformLinks?: JobPlatformLink[]
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

/* ───────────── Job recommendations (phân tích của user) ───────────── */

export interface RecommendationSearchLink {
  platform: string
  url: string
  searchKeyword: string
}

export interface SampleJob {
  title: string
  company: string
  salary: string
  location: string
  jobType: string
  description: string
}

export interface RecommendationAnalysis {
  marketSummary: string
  searchLinks: RecommendationSearchLink[]
  sampleJobs: SampleJob[]
  interviewTip: string
}

export interface RecommendationBody {
  success: boolean
  statusCode: number
  isSkillUpdated: boolean
  targetRole: string
  location: string
  message: string
  data: RecommendationAnalysis
}

// axios: res.data = { success, statusCode, data: RecommendationBody }
export type RecommendationResponse = ApiResponse<RecommendationBody>

/* ───────────── Check profile ───────────── */

export interface CheckProfileBody {
  success: boolean
  statusCode: number
  careerPath: string
  source: string // vd: 'SKILL_TREE'
  totalSkills: number
  message: string
}

export type CheckProfileResponse = ApiResponse<CheckProfileBody>
