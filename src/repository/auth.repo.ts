import http from '../config/http'
import type {
  ChangePasswordPayload,
  ForgotPasswordApiPayload,
  LoginPayload,
  RegisterApiPayload,
  ResetPasswordApiPayload,
} from '../schemas/auth.schema'
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

  changePassword(body: ChangePasswordPayload) {
    return http.patch(`${this.PREFIX}/change-password`, body)
  }

  // Hàm gọi API Yêu cầu gửi email khôi phục mật khẩu
  forgotPassword(payload: ForgotPasswordApiPayload) {
    return http.post<{ message: string }>(`${this.PREFIX}/forgot-password`, payload)
  }

  // Hàm gọi API Đặt lại mật khẩu mới
  resetPassword(payload: ResetPasswordApiPayload) {
    return http.post<{ message: string }>(`${this.PREFIX}/reset-password`, payload)
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const authRepo = new AuthRepository()
