import type { ApiResponse } from './auth.types'

export interface Portfolio {
  id: string
  userId: string
  title: string
  bio: string | null
  avatarUrl: string | null
  email: string | null
  facebook: string | null
  linkedin: string | null
  github: string | null
  skills: string[]
  socialLinks: Record<string, string> | null
  portfolioUrl: string
  portfolioSlug: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Backend bọc 2 lớp: { success, statusCode, data: { success, statusCode, message, data: Portfolio } }
export interface PortfolioActionData {
  success: boolean
  statusCode: number
  message: string
  data: Portfolio
}

export type PortfolioResponse = ApiResponse<PortfolioActionData>
