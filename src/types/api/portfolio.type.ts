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

// ───────── API public: GET /portfolios/public/:slug ─────────

export interface PortfolioRepository {
  id: string
  githubProfileId: string
  repoName: string
  repoUrl: string
  languages: Record<string, number> | null
  mainLanguage: string | null
  extractedSkills: string[] | null
  techStack: string[]
  createdAt: string
}

export interface PublicPortfolio extends Portfolio {
  repositories: PortfolioRepository[]
  hasGithubSync: boolean
}

export interface PublicPortfolioBody {
  success: boolean
  statusCode: number
  message?: string
  data: PublicPortfolio
}

export type PublicPortfolioResponse = ApiResponse<PublicPortfolioBody>

export interface UpdatePortfolioBody {
  title?: string
  bio?: string
  avatarUrl?: string
  email?: string
  facebook?: string
  linkedin?: string
  github?: string
  skills?: string[]
  socialLinks?: SocialLinks
  isPublic?: boolean
}
