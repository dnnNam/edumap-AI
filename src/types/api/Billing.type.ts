import type { ApiResponse } from './auth.types'

// Mã định danh gói — khớp field "code" trong response BE
export type PlanCode = 'FREE' | 'PRO_STUDENT' | 'PREMIUM'

export interface PlanFeatures {
  pdfReport: boolean
  skillTree: 'BASIC' | 'FULL'
  jobMatching: boolean
  resumeReview: boolean
  publicCourses: boolean
  prioritySupport: boolean
  publicPortfolio: boolean
  communitySupport: boolean
  hideEduMapBranding: boolean
  priorityAiAnalysis: boolean
}

export interface PlanLimits {
  aiChatPerDay: number
  githubSyncPerDay: number
  githubSyncPerWeek: number | null
  pdfReportPerMonth: number
  skillTreeMaxNodes: number
  jobMatchingPerMonth: number
  resumeReviewPerMonth: number
  githubMaxRepositoriesPerSync: number
  skillTreeGenerationsPerMonth: number
}

// 1 gói dịch vụ — khớp đúng 1 phần tử trong mảng "data" của GET /billing/plans
export interface BillingPlan {
  id: string
  code: PlanCode
  name: string
  description: string
  priceVnd: number
  durationDays: number | null // null = Free (không hết hạn)
  features: PlanFeatures
  limits: PlanLimits
}

export type BillingPlanListResponse = ApiResponse<BillingPlan[]>
