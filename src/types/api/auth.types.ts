export interface User {
  id: string
  email: string
  fullName: string
  role: string
}

export interface AuthResponseData {
  accessToken: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
}

export type AuthResponse = ApiResponse<AuthResponseData>
