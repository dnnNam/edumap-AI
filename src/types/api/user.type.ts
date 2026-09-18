export type UserRole = 'ADMIN' | 'MODERATOR' | 'MENTOR' | 'STUDENT'

export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM'

// Khớp với response thật của GET /users/admin/all
export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  subscriptionTier: SubscriptionTier
  createdAt: string
}

export const ROLE_OPTIONS: UserRole[] = ['ADMIN', 'MODERATOR', 'MENTOR', 'STUDENT']

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  MENTOR: 'Mentor',
  STUDENT: 'Student',
}

export const ROLE_DESCRIPTION: Record<UserRole, string> = {
  ADMIN: 'Full access to every area, including billing and roles.',
  MODERATOR: 'Reviews reports and moderates community.',
  MENTOR: 'Guides students, reviews roadmaps and portfolios.',
  STUDENT: 'Default account with personal learning access.',
}

// Màu badge theo role, dùng chung cho avatar/role pill nếu cần
export const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  MODERATOR: 'bg-amber-50 text-amber-700 border-amber-100',
  MENTOR: 'bg-sky-50 text-sky-700 border-sky-100',
  STUDENT: 'bg-gray-100 text-gray-600 border-gray-200',
}

export interface UserInfor {
  id: string
  email: string
  fullName: string
  universityName: string | null
  currentYear: string | null
  githubUsername: string | null
  role: string
  subscriptionTier: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
}

export type UserResponse = ApiResponse<UserInfor>
