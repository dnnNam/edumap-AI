import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { billingRepo } from '../repository/billing.repo'
import { getAccessTokenFromLS } from '../utils/auth'
import type { CreatePaymentBody } from '../types/api/billing.type'

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

// pollWhilePaying = true: gọi lại /billing/me mỗi 3s (dùng khi modal QR đang mở).
// refetchIntervalInBackground: user mở app ngân hàng / chuyển tab thì vẫn tiếp tục poll.
export const useMySubscriptionQuery = (pollWhilePaying = false) => {
  return useQuery({
    queryKey: BILLING_ME_KEY,
    queryFn: () => billingRepo.getMe(),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 30 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: pollWhilePaying ? 3000 : false,
    refetchIntervalInBackground: true,
  })
}

// Lỗi 400/404... đã được toast trong interceptor của http.ts nên không cần onError ở đây
export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: (body: CreatePaymentBody) => billingRepo.createPayment(body),
  })
}

export const useInvalidateMySubscription = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: BILLING_ME_KEY })
}
