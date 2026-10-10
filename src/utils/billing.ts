import { Briefcase, ClipboardCheck, FileText, GitBranch, MessageSquare, Share2, type LucideIcon } from 'lucide-react'
import i18n from '../i18n'
import type { BillingPlan, PlanCode, UsageFeatureCode } from '../types/api/billing.type'
import { getLocale } from './locale'

export const USAGE_FEATURE_META: Record<UsageFeatureCode, { titleKey: string; subtitleKey: string; icon: LucideIcon }> =
  {
    AI_CHAT: {
      titleKey: 'billing.usageFeature.AI_CHAT.title',
      subtitleKey: 'billing.usageFeature.AI_CHAT.subtitle',
      icon: MessageSquare,
    },
    SKILL_TREE_GENERATION: {
      titleKey: 'billing.usageFeature.SKILL_TREE_GENERATION.title',
      subtitleKey: 'billing.usageFeature.SKILL_TREE_GENERATION.subtitle',
      icon: Share2,
    },
    GITHUB_SYNC: {
      titleKey: 'billing.usageFeature.GITHUB_SYNC.title',
      subtitleKey: 'billing.usageFeature.GITHUB_SYNC.subtitle',
      icon: GitBranch,
    },
    PDF_REPORT: {
      titleKey: 'billing.usageFeature.PDF_REPORT.title',
      subtitleKey: 'billing.usageFeature.PDF_REPORT.subtitle',
      icon: FileText,
    },
    RESUME_REVIEW: {
      titleKey: 'billing.usageFeature.RESUME_REVIEW.title',
      subtitleKey: 'billing.usageFeature.RESUME_REVIEW.subtitle',
      icon: ClipboardCheck,
    },
    JOB_MATCHING: {
      titleKey: 'billing.usageFeature.JOB_MATCHING.title',
      subtitleKey: 'billing.usageFeature.JOB_MATCHING.subtitle',
      icon: Briefcase,
    },
  }

export const USAGE_WINDOW_KEY: Record<string, string> = {
  DAILY: 'billing.window.DAILY',
  MONTHLY: 'billing.window.MONTHLY',
}

// Các hàm dưới đây được gọi trong lúc render của component có dùng useTranslation,
// nên đổi ngôn ngữ thì component re-render và giá trị tự cập nhật theo.
export const getPlanName = (code: PlanCode, fallback?: string) =>
  i18n.t(`billing.plans.${code}.name`, { defaultValue: fallback ?? code })

export const getPlanDescription = (code: PlanCode, fallback?: string) =>
  i18n.t(`billing.plans.${code}.description`, { defaultValue: fallback ?? '' })

export function formatPrice(plan: BillingPlan) {
  const money = `${plan.priceVnd.toLocaleString('en-US')}₫`
  if (plan.priceVnd === 0) return { amount: '0₫', period: i18n.t('billing.perMonth') }
  if (plan.durationDays === 365) return { amount: money, period: i18n.t('billing.perYear') }
  if (plan.durationDays === 30) return { amount: money, period: i18n.t('billing.perMonth') }
  return { amount: money, period: i18n.t('billing.perDays', { count: plan.durationDays ?? 0 }) }
}

export const FEATURE_ROWS: { labelKey: string; render: (p: BillingPlan) => string }[] = [
  {
    labelKey: 'billing.row.aiChats',
    render: (p) =>
      p.limits.aiChatPerDay >= 100
        ? i18n.t('billing.row.unlimited') + (p.features.priorityAiAnalysis ? i18n.t('billing.row.plusPriority') : '')
        : i18n.t('billing.row.perDay', { count: p.limits.aiChatPerDay }),
  },
  {
    labelKey: 'billing.row.skillTree',
    render: (p) =>
      i18n.t('billing.row.treeValue', {
        type: p.features.skillTree === 'FULL' ? i18n.t('billing.row.full') : i18n.t('billing.row.basic'),
        nodes: p.limits.skillTreeMaxNodes,
      }),
  },
  {
    labelKey: 'billing.row.skillTreeGeneration',
    render: (p) => i18n.t('billing.row.perMonth', { count: p.limits.skillTreeGenerationsPerMonth }),
  },
  {
    labelKey: 'billing.row.jobMatching',
    render: (p) =>
      p.features.jobMatching ? i18n.t('billing.row.perMonth', { count: p.limits.jobMatchingPerMonth }) : '—',
  },
  {
    labelKey: 'billing.row.resumeReview',
    render: (p) =>
      p.features.resumeReview ? i18n.t('billing.row.perMonth', { count: p.limits.resumeReviewPerMonth }) : '—',
  },
  {
    labelKey: 'billing.row.pdfExport',
    render: (p) => (p.features.pdfReport ? i18n.t('billing.row.perMonth', { count: p.limits.pdfReportPerMonth }) : '—'),
  },
  {
    labelKey: 'billing.row.githubSync',
    render: (p) => {
      if (p.limits.githubSyncPerDay > 0)
        return i18n.t('billing.row.githubDay', {
          count: p.limits.githubSyncPerDay,
          repos: p.limits.githubMaxRepositoriesPerSync,
        })
      if (p.limits.githubSyncPerWeek)
        return i18n.t('billing.row.githubWeek', {
          count: p.limits.githubSyncPerWeek,
          repos: p.limits.githubMaxRepositoriesPerSync,
        })
      return '—'
    },
  },
  {
    labelKey: 'billing.row.priorityAi',
    render: (p) => (p.features.priorityAiAnalysis ? i18n.t('billing.row.yesFaster') : '—'),
  },
  {
    labelKey: 'billing.row.hideBranding',
    render: (p) => (p.features.hideEduMapBranding ? i18n.t('billing.row.yes') : '—'),
  },
  {
    labelKey: 'billing.row.support',
    render: (p) =>
      p.features.prioritySupport ? i18n.t('billing.row.supportPriority') : i18n.t('billing.row.supportCommunity'),
  },
]

// Vài điểm nổi bật hiển thị trực tiếp trên mỗi card
export function getCardHighlights(plan: BillingPlan): string[] {
  const items: string[] = []
  items.push(
    plan.features.skillTree === 'FULL' ? i18n.t('billing.highlight.fullTree') : i18n.t('billing.highlight.basicTree'),
  )
  items.push(
    plan.limits.aiChatPerDay >= 100
      ? i18n.t('billing.highlight.unlimitedAi')
      : i18n.t('billing.highlight.aiPerDay', { count: plan.limits.aiChatPerDay }),
  )
  if (plan.features.publicCourses) items.push(i18n.t('billing.highlight.publicCourses'))
  if (plan.features.jobMatching) items.push(i18n.t('billing.highlight.jobMatching'))
  if (plan.features.resumeReview) items.push(i18n.t('billing.highlight.resumeReview'))
  if (plan.features.priorityAiAnalysis) items.push(i18n.t('billing.highlight.priorityAi'))
  items.push(
    plan.features.prioritySupport
      ? i18n.t('billing.highlight.prioritySupport')
      : i18n.t('billing.highlight.communitySupport'),
  )
  return items
}

// So gói năm với gói tháng gần nhất x12 để hiện badge "Tiết kiệm X%"
export function getYearlySavingBadge(plan: BillingPlan, allPlans: BillingPlan[]): string | null {
  if (plan.durationDays !== 365) return null
  const monthlyRef = allPlans.find((p) => p.durationDays === 30 && p.priceVnd > 0)
  if (!monthlyRef) return null
  const yearIfMonthly = monthlyRef.priceVnd * 12
  if (yearIfMonthly <= plan.priceVnd) return null
  const percent = Math.round(((yearIfMonthly - plan.priceVnd) / yearIfMonthly) * 100)
  return i18n.t('billing.save', { percent })
}

export const PLAN_RANK: Record<PlanCode, number> = { FREE: 0, PRO_STUDENT: 1, PREMIUM: 2 }

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat(getLocale(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function formatCycleDate(iso: string) {
  return new Intl.DateTimeFormat(getLocale(), { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}
