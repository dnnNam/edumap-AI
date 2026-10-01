import type { ApiResponse } from './auth.types'

export interface SocialLinks {
  github?: string
  linkedin?: string
}

export interface Portfolio {
  id?: string
  userId?: string
  portfolioUrl?: string
  portfolioSlug?: string
  title: string
  bio: string
  avatarUrl: string
  email: string
  facebook: string
  linkedin: string
  github: string
  skills: string[]
  socialLinks: SocialLinks | null
  isPublic: boolean
}

export interface PortfolioBody {
  success: boolean
  statusCode: number
  message: string
  data: Portfolio
}

// Lớp ngoài: { success, statusCode, data: PortfolioBody }
export type PortfolioResponse = ApiResponse<PortfolioBody>
