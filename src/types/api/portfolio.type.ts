import type { ApiResponse } from './auth.types'

// Portfolio structure
export interface Portfolio {
  id: string
  userId: string
  slug: string
  displayName: string
  headline: string
  email: string
  twitter?: string
  github?: string
  linkedIn?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Featured Project
export interface FeaturedProject {
  id: string
  portfolioId: string
  title: string
  description: string
  url?: string
  imageUrl?: string
  stars: number
  technologies: string[]
  order: number
  createdAt: string
}

// Skill
export interface PortfolioSkill {
  id: string
  portfolioId: string
  name: string
  order: number
}

// Experience
export interface Experience {
  id: string
  portfolioId: string
  title: string
  company: string
  description?: string
  startDate: string // ISO date
  endDate?: string // ISO date
  isCurrent: boolean
  order: number
}

// Education
export interface Education {
  id: string
  portfolioId: string
  school: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
  gpa?: number
  order: number
}

// Certificate
export interface Certificate {
  id: string
  portfolioId: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
  order: number
}

// Full Portfolio Detail (Public View)
export interface PortfolioDetail extends Portfolio {
  projects: FeaturedProject[]
  skills: PortfolioSkill[]
  experiences: Experience[]
  educations: Education[]
  certificates: Certificate[]
}

// API Response Types
export type PortfolioDetailResponse = ApiResponse<PortfolioDetail>

export interface GetPublicPortfolioParams {
  slug: string
}
