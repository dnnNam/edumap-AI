import http from '../config/http'
import type { UpdateProfilePayload } from '../schemas/auth.schema'
import type { ApiResponse } from '../types/api/auth.types'
import type { AdminUser, UserResponse, UserRole } from '../types/api/user.type'

class UserRepository {
  // Khai báo prefix chung cho toàn bộ API trong class này
  private readonly PREFIX = '/users'

  // Hàm gọi API Đăng nhập
  getProfile() {
    return http.get<UserResponse>(`${this.PREFIX}/profile`)
  }

  updateProfile(payload: UpdateProfilePayload) {
    return http.patch<UserResponse>(`${this.PREFIX}/profile`, payload)
  }

  getAllUsers() {
    return http.get<ApiResponse<AdminUser[]>>(`${this.PREFIX}/admin/all`)
  }

  updateUserRole(userId: string, role: UserRole) {
    return http.patch<ApiResponse<AdminUser>>(`${this.PREFIX}/admin/${userId}/role`, { role })
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const userRepo = new UserRepository()
