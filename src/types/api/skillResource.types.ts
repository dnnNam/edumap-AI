import type { ApiResponse } from './auth.types'

export type SkillResourceType =
  | 'DOCUMENTATION'
  | 'INTERACTIVE_LAB'
  | 'VIDEO_COURSE'
  | 'ARTICLE'
  // Cho phép string khác để không vỡ type khi BE thêm loại mới
  | (string & {})

export interface SkillResourceSkill {
  id: string
  name: string
  category: string
}

export interface SkillResource {
  id: string
  skillId: string
  affiliateId: string | null
  resourceType: SkillResourceType
  title: string
  url: string
  cost: number // 0 = miễn phí
  rating: number
  durationHours: number
  createdAt: string
  // Chỉ API /top có kèm skill
  skill?: SkillResourceSkill
}

export interface GetTopSkillResourcesParams {
  limit?: number
}

// GET /skill-resources/top
export type TopSkillResourcesResponse = ApiResponse<SkillResource[]>

// GET /skill-resources/skills/:skillId/resources (dạng phẳng)
export type SkillResourcesResponse = ApiResponse<SkillResource[]>

// GET /skill-resources/skills/:skillId/resources/grouped
export interface SkillResourceGroups {
  videos: SkillResource[]
  documentations: SkillResource[] // gồm DOCUMENTATION + ARTICLE
  practices: SkillResource[]
}

export interface GroupedSkillResources {
  skillId: string
  skillName: string
  summary: {
    total: number
    hasVideo: boolean
    hasDocs: boolean
    hasPractice: boolean
  }
  data: SkillResourceGroups
  // youtube | github | devTo | coursera | udemy
  externalSearchLinks: Record<string, string>
}

export type GroupedSkillResourcesResponse = ApiResponse<GroupedSkillResources>

// POST /skill-resources/skills/:skillId/resources/fetch-more
// Trả cùng cấu trúc với /grouped, chứa toàn bộ danh sách đã gộp (cũ + mới)
export type FetchMoreSkillResourcesResponse = GroupedSkillResourcesResponse

export type SkillResourceDetailResponse = ApiResponse<SkillResource>

// GET /skill-resources/history
// API structure match thực tế từ backend
export interface ResourceHistory {
  id: string
  userId: string
  skillResourceId: string // ← Tên field từ API
  viewedAt: string // ISO timestamp
  skillResource: SkillResource // ← Tên field từ API (không phải `resource`)
}

export type ResourceHistoryResponse = ApiResponse<ResourceHistory[]>
