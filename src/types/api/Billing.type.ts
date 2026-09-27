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

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'EXPIRED'

export interface LatestPayment {
  paymentId: string
  orderCode: string
  amountVnd: number
  status: PaymentStatus
  paidAt: string | null
}

// Response của GET /billing/me — gói subscription hiện tại của user đang đăng nhập
export interface MySubscription {
  planCode: PlanCode
  planName: string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED'
  startedAt: string
  expiresAt: string | null
  isActive: boolean
  features: PlanFeatures
  limits: PlanLimits
  latestPayment: LatestPayment | null
}

export type MySubscriptionResponse = ApiResponse<MySubscription>

export type UsageFeatureCode =
  | 'AI_CHAT'
  | 'SKILL_TREE_GENERATION'
  | 'GITHUB_SYNC'
  | 'PDF_REPORT'
  | 'RESUME_REVIEW'
  | 'JOB_MATCHING'

export type UsageWindow = 'DAILY' | 'MONTHLY'

export interface UsageItem {
  featureCode: UsageFeatureCode
  limit: number
  usage: number
  remaining: number | null // null = không giới hạn
  usageWindow: UsageWindow
  usageDate: string
}

export interface BillingUsage {
  planCode: PlanCode
  usage: UsageItem[]
}

export type BillingUsageResponse = ApiResponse<BillingUsage>
