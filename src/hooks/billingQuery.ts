import { useQuery, useQueryClient } from '@tanstack/react-query'
import { billingRepo } from '../repository/billing.repo'
import { getAccessTokenFromLS } from '../utils/auth'

const BILLING_PLANS_KEY = ['billing-plans']
const BILLING_ME_KEY = ['billing-me']
const BILLING_USAGE_KEY = ['billing-usage']

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

// [STUDENT] Gói subscription hiện tại của user -> cần token, enabled theo accessToken giống pattern chatQuery.
// staleTime ngắn hơn plans vì trạng thái này có thể đổi ngay sau khi user thanh toán xong.
export const useMySubscriptionQuery = () => {
  return useQuery({
    queryKey: BILLING_ME_KEY,
    queryFn: () => billingRepo.getMe(),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 30 * 1000, // 30 giây
    retry: false,
    refetchOnWindowFocus: false,
  })
}

// Gọi sau khi thanh toán thành công (vd sau khi poll GET /billing/payments/{id} trả PAID)
// để làm mới ngay gói hiện tại + limits, không cần chờ refetch tự động.
export const useInvalidateMySubscription = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: BILLING_ME_KEY })
}

// [STUDENT] Quota sử dụng hiện tại theo từng feature -> cần token.
// staleTime ngắn vì usage đổi liên tục mỗi lần user dùng tính năng (chat, sync github...).
export const useBillingUsageQuery = () => {
  return useQuery({
    queryKey: BILLING_USAGE_KEY,
    queryFn: () => billingRepo.getUsage(),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 15 * 1000, // 15 giây
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useInvalidateBillingUsage = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: BILLING_USAGE_KEY })
}
