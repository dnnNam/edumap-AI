import type { ApiResponse } from './auth.types'

export type TopSkill = string | { id?: string; name?: string; skillName?: string }

// Khớp với response của GET /skills/my-skills/summary
export interface MySkillsSummary {
  totalSkills: number
  totalHours: number
  topSkills: TopSkill[]
  // Giả định: { [tên category]: số skill }, ví dụ { Frontend: 14, Backend: 12 }
  categoryStats: Record<string, number>
}

export type MySkillsSummaryResponse = ApiResponse<MySkillsSummary>

export interface Skill {
  id: string
  name: string
  category: string
  difficultyLevel: number
  demandScore: number
  createdAt: string
}

export interface AllSkillsResponse {
  success: boolean
  statusCode: number
  data: Skill[]
}

export interface CreateSkillPayload {
  name: string
  category: string
  difficultyLevel: number
  demandScore: number
}

export interface Skill {
  id: string
  name: string
  category: string
  difficultyLevel: number
  demandScore: number
  createdAt: string
}

export interface AllSkillsResponse {
  success: boolean
  statusCode: number
  data: Skill[]
}

export interface CreateSkillPayload {
  name: string
  category: string
  difficultyLevel: number
  demandScore: number
}
