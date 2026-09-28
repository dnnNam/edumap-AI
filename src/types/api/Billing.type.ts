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

export interface CreatePaymentBody {
  planCode: Exclude<PlanCode, 'FREE'> // BE chỉ nhận PRO_STUDENT | PREMIUM
}

// data của POST /billing/payments (201)
export interface PaymentOrder {
  paymentId: string
  orderCode: string
  planCode: PlanCode
  planName: string
  amountVnd: number
  status: PaymentStatus
  provider: string
  bankName: string
  accountNumber: string
  accountName: string
  transferContent: string
  expiredAt: string
}

export type CreatePaymentResponse = ApiResponse<PaymentOrder>
// GET /billing/payments/{id} dùng để poll, giả định trả cùng shape
export type PaymentDetailResponse = ApiResponse<PaymentOrder>

// Ghép URL ảnh QR VietQR từ dữ liệu BE trả về
export function buildVietQrUrl(p: PaymentOrder) {
  const params = new URLSearchParams({
    amount: String(p.amountVnd),
    addInfo: p.transferContent,
    accountName: p.accountName,
  })
  return `https://img.vietqr.io/image/${p.bankName}-${p.accountNumber}-compact2.png?${params.toString()}`
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}
