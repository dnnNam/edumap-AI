import type { ApiResponse } from './auth.types'

export type SkillResourceType =
  | 'DOCUMENTATION'
  | 'INTERACTIVE_LAB'
  | 'VIDEO_COURSE'
  // Mới thấy 3 giá trị này trong mẫu. Hỏi BE enum đầy đủ (vd: ARTICLE, BOOK, ...)
  // rồi bổ sung. Tạm thời cho phép string khác để không vỡ type khi BE thêm loại mới.
  | (string & {})

export interface SkillResourceSkill {
  id: string
  name: string // 'Node.js' | 'Redis' ...
  category: string // 'Frameworks' | 'Databases' ...
}

export interface SkillResource {
  id: string
  skillId: string
  affiliateId: string | null
  resourceType: SkillResourceType
  title: string
  url: string
  cost: number // 0 = miễn phí
  rating: number // 4.8, 5, 4.9 ...
  durationHours: number
  createdAt: string // ISO
  skill: SkillResourceSkill
}

export interface GetTopSkillResourcesParams {
  limit?: number
}

export type TopSkillResourcesResponse = ApiResponse<SkillResource[]>
