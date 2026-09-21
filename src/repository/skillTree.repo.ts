import http from '../config/http'

class SkillTreeRepository {
  // Khai báo prefix chung cho toàn bộ API trong class này
  private readonly PREFIX = '/skill-trees'

  // lấy dữ liệu cây Skill tree
  getSkillTree() {
    return http.get(`${this.PREFIX}/my-tree`)
  }
}

// Khởi tạo và xuất ra MỘT đối tượng (instance) duy nhất để dùng chung cho toàn bộ app
export const skillTreeRepo = new SkillTreeRepository()
