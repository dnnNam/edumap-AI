import { Navigate, useSearchParams } from 'react-router'

import AnimatedOutlet from '../components/motion/AnimatedOutlet'
import AppLoadingSkeleton from '../components/ui/AppLoadingSkeleton'
import { useMeQuery } from '../hooks/useAuthQuery'
import { getAccessTokenFromLS, getRoleFromLS } from '../utils/auth'

export default function PublicRoute() {
  const [params] = useSearchParams()
  const accessToken = getAccessTokenFromLS()
  const { data, isLoading, isError } = useMeQuery()

  // Đang xử lý Google callback: để GoogleCallbackPage tự lo, không redirect/skeleton chen ngang
  if (params.get('token')) {
    return <AnimatedOutlet />
  }

  // Không có token → render route con
  if (!accessToken) {
    return <AnimatedOutlet />
  }

  if (isLoading) {
    return <AppLoadingSkeleton />
  }

  // Token hết hạn/sai → vẫn cho vào public
  if (isError) {
    return <AnimatedOutlet />
  }

  // Token hợp lệ → admin về trang admin, còn lại về dashboard
  // Ưu tiên role mới nhất từ API, fallback về role đã lưu trong LS
  const role = data?.data.data.role ?? getRoleFromLS()
  return <Navigate to={role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
}
