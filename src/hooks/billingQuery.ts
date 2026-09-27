import { useQuery } from '@tanstack/react-query'
import { billingRepo } from '../repository/billing.repo'

const BILLING_PLANS_KEY = ['billing-plans']

// API public (xem swagger: không có ô khóa/param auth) -> không cần điều kiện enabled theo accessToken như chat query.
// staleTime dài vì giá & tính năng gói gần như không đổi trong 1 phiên làm việc, tránh gọi lại API thừa mỗi lần
// người dùng quay lại trang Subscription.
export const useBillingPlansQuery = () => {
  return useQuery({
    queryKey: BILLING_PLANS_KEY,
    queryFn: () => billingRepo.getPlans(),
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: false,
    refetchOnWindowFocus: false,
  })
}
