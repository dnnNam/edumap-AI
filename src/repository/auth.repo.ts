import http from '../config/http'
import type { LoginPayload, RegisterApiPayload } from '../schemas/auth.schema'
import type { ApiResponse, AuthResponse, User } from '../types/api/auth.types'

class AuthRepository {
  // Khai báo prefix chung cho toàn bộ API trong class này
  private readonly PREFIX = '/auth'

  // Hàm gọi API Đăng nhập
  login(payload: LoginPayload) {
    return http.post<AuthResponse>(`${this.PREFIX}/login`, payload)
  }

  // Hàm gọi API Đăng ký
  register(payload: RegisterApiPayload) {
    return http.post(`${this.PREFIX}/register`, payload)
  }

  getMe() {
    return http.get<ApiResponse<User>>(`${this.PREFIX}/me`)
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const authRepo = new AuthRepository()
