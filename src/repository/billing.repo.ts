import http from '../config/http'
import type { BillingPlanListResponse } from '../types/api/Billing.type'

class BillingRepository {
  private readonly PREFIX = '/billing'

  // GET /api/v1/billing/plans — API công khai, không cần token, lấy toàn bộ gói đang hoạt động (Free, Pro Student, Premium)
  getPlans() {
    return http.get<BillingPlanListResponse>(`${this.PREFIX}/plans`)
  }
}

export const billingRepo = new BillingRepository()
