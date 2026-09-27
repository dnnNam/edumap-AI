import type { BillingPlan, PlanCode } from '../types/api/billing.type'

import { Briefcase, ClipboardCheck, FileText, MessageSquare, Share2, type LucideIcon } from 'lucide-react'
import { GitBranch } from 'lucide-react'
import type { UsageFeatureCode } from '../types/api/billing.type'

export const USAGE_FEATURE_META: Record<UsageFeatureCode, { title: string; subtitle: string; icon: LucideIcon }> = {
  AI_CHAT: {
    title: 'AI Mentor chat',
    subtitle: 'Messages with your AI mentor',
    icon: MessageSquare,
  },
  SKILL_TREE_GENERATION: {
    title: 'Skill tree generation',
    subtitle: 'New skill tree analyses',
    icon: Share2,
  },
  GITHUB_SYNC: {
    title: 'GitHub sync',
    subtitle: 'Profile syncs from GitHub',
    icon: GitBranch,
  },
  PDF_REPORT: {
    title: 'PDF report',
    subtitle: 'Exported analysis reports',
    icon: FileText,
  },
  RESUME_REVIEW: {
    title: 'Resume review',
    subtitle: 'AI resume reviews',
    icon: ClipboardCheck,
  },
  JOB_MATCHING: {
    title: 'Job matching',
    subtitle: 'Personalized job matches',
    icon: Briefcase,
  },
}

export const USAGE_WINDOW_LABEL: Record<string, string> = {
  DAILY: 'Daily',
  MONTHLY: 'Monthly',
}

export function formatPrice(plan: BillingPlan) {
  if (plan.priceVnd === 0) return { amount: '0₫', period: '/month' }
  if (plan.durationDays === 365) return { amount: `${plan.priceVnd.toLocaleString('en-US')}₫`, period: '/year' }
  if (plan.durationDays === 30) return { amount: `${plan.priceVnd.toLocaleString('en-US')}₫`, period: '/month' }
  return { amount: `${plan.priceVnd.toLocaleString('en-US')}₫`, period: `/${plan.durationDays} days` }
}

export const FEATURE_ROWS: { label: string; render: (p: BillingPlan) => string }[] = [
  {
    label: 'AI mentor chats',
    render: (p) =>
      p.limits.aiChatPerDay >= 100
        ? 'Unlimited' + (p.features.priorityAiAnalysis ? ' + priority' : '')
        : `${p.limits.aiChatPerDay}/day`,
  },
  {
    label: 'Skill tree',
    render: (p) => `${p.features.skillTree === 'FULL' ? 'Full' : 'Basic'} · up to ${p.limits.skillTreeMaxNodes} nodes`,
  },
  {
    label: 'Skill tree generation',
    render: (p) => `${p.limits.skillTreeGenerationsPerMonth}/month`,
  },
  {
    label: 'Job matching',
    render: (p) => (p.features.jobMatching ? `${p.limits.jobMatchingPerMonth}/month` : '—'),
  },
  {
    label: 'Resume review',
    render: (p) => (p.features.resumeReview ? `${p.limits.resumeReviewPerMonth}/month` : '—'),
  },
  {
    label: 'PDF export',
    render: (p) => (p.features.pdfReport ? `${p.limits.pdfReportPerMonth}/month` : '—'),
  },
  {
    label: 'GitHub sync',
    render: (p) => {
      if (p.limits.githubSyncPerDay > 0)
        return `${p.limits.githubSyncPerDay}/day · up to ${p.limits.githubMaxRepositoriesPerSync} repos`
      if (p.limits.githubSyncPerWeek)
        return `${p.limits.githubSyncPerWeek}/week · up to ${p.limits.githubMaxRepositoriesPerSync} repos`
      return '—'
    },
  },
  {
    label: 'Priority AI Analysis',
    render: (p) => (p.features.priorityAiAnalysis ? 'Yes · faster processing' : '—'),
  },
  {
    label: 'Hide EduMap branding',
    render: (p) => (p.features.hideEduMapBranding ? 'Yes' : '—'),
  },
  {
    label: 'Support',
    render: (p) => (p.features.prioritySupport ? 'Priority' : 'Community'),
  },
]

// A few short highlights shown directly on each card (not the full comparison table below)
export function getCardHighlights(plan: BillingPlan): string[] {
  const items: string[] = []
  items.push(plan.features.skillTree === 'FULL' ? 'Full skill tree' : 'Basic skill tree')
  items.push(plan.limits.aiChatPerDay >= 100 ? 'Unlimited AI mentor' : `${plan.limits.aiChatPerDay} AI chats/day`)
  items.push(plan.features.publicCourses ? 'Public courses' : '')
  if (plan.features.jobMatching) items.push('Job matching')
  if (plan.features.resumeReview) items.push('Resume review')
  if (plan.features.priorityAiAnalysis) items.push('Priority AI Analysis')
  items.push(plan.features.prioritySupport ? 'Priority support' : 'Community support')
  return items.filter(Boolean)
}

// Compares a yearly plan against the "nearest" monthly plan x12, to show a
// "Save X%" badge similar to the "Save $4 · 17% OFF" badge in the mock.
export function getYearlySavingBadge(plan: BillingPlan, allPlans: BillingPlan[]): string | null {
  if (plan.durationDays !== 365) return null
  const monthlyRef = allPlans.find((p) => p.durationDays === 30 && p.priceVnd > 0)
  if (!monthlyRef) return null
  const yearIfMonthly = monthlyRef.priceVnd * 12
  if (yearIfMonthly <= plan.priceVnd) return null
  const percent = Math.round(((yearIfMonthly - plan.priceVnd) / yearIfMonthly) * 100)
  return `Save ${percent}% vs monthly billing`
}

export const PLAN_COPY_EN: Record<PlanCode, { name: string; description: string }> = {
  FREE: { name: 'Free', description: 'Free plan for students just getting started.' },
  PRO_STUDENT: {
    name: 'Pro Student',
    description: 'For students building an in-depth roadmap and portfolio.',
  },
  PREMIUM: {
    name: 'Premium',
    description: 'Top-tier plan with higher limits and priority AI processing.',
  },
}

export const PLAN_RANK: Record<PlanCode, number> = { FREE: 0, PRO_STUDENT: 1, PREMIUM: 2 }

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function formatCycleDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}
