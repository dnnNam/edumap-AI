import type { ApiResponse } from './auth.types'

export type SkillResourceType = 'DOCUMENTATION' | 'INTERACTIVE_LAB' | 'VIDEO_COURSE' | 'ARTICLE' | (string & {})

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

export type TopSkillResourcesResponse = ApiResponse<SkillResource[]>
export type SkillResourcesResponse = ApiResponse<SkillResource[]>

// ---- API /skills/:skillId/resources/grouped ----
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
