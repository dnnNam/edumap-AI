import http from '../config/http'
import type { BillingPlanListResponse, BillingUsageResponse, MySubscriptionResponse } from '../types/api/billing.type'

class BillingRepository {
  private readonly PREFIX = '/billing'

  // GET /api/v1/billing/plans — API công khai, không cần token, lấy toàn bộ gói đang hoạt động (Free, Pro Student, Premium)
  getPlans() {
    return http.get<BillingPlanListResponse>(`${this.PREFIX}/plans`)
  }

  // GET /api/v1/billing/me — [STUDENT] Lấy gói subscription hiện tại của user đang đăng nhập, cần Authorization
  getMe() {
    return http.get<MySubscriptionResponse>(`${this.PREFIX}/me`)
  }

  getUsage() {
    return http.get<BillingUsageResponse>(`${this.PREFIX}/usage`)
  }
}

export const billingRepo = new BillingRepository()
