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
