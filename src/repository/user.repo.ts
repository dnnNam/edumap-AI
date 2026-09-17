import http from '../config/http'
import type { UserResponse } from '../types/api/user.type'

class UserRepository {
  // Khai báo prefix chung cho toàn bộ API trong class này
  private readonly PREFIX = '/users'

  // Hàm gọi API Đăng nhập
  getProfile() {
    return http.get<UserResponse>(`${this.PREFIX}/profile`)
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const userRepo = new UserRepository()
