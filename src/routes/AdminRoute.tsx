import { Navigate } from 'react-router'
import AnimatedOutlet from '../components/motion/AnimatedOutlet'
import AppLoadingSkeleton from '../components/ui/AppLoadingSkeleton'
import { useMeQuery } from '../hooks/useAuthQuery'
import { getAccessTokenFromLS, getRoleFromLS } from '../utils/auth'

// Chỉ dùng bên trong ProtectedRoute (đã đảm bảo có token hợp lệ ở tầng trên),
// component này chỉ lo thêm 1 việc: chặn nếu role không phải ADMIN
export default function AdminRoute() {
  const accessToken = getAccessTokenFromLS()
  const { data, isLoading, isError } = useMeQuery()

  if (!accessToken) {
    return <Navigate to='/login' replace />
  }
  if (isLoading) {
    return <AppLoadingSkeleton />
  }
  if (isError) {
    return <Navigate to='/login' replace />
  }

  // Ưu tiên role mới nhất từ API, fallback về role đã lưu trong LS
  const role = data?.data.data.role ?? getRoleFromLS()

  if (role !== 'ADMIN') {
    return <Navigate to='/dashboard' replace />
  }

  return <AnimatedOutlet />
}
