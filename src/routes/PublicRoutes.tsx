import { Navigate } from 'react-router'

import AnimatedOutlet from '../components/motion/AnimatedOutlet'
import AppLoadingSkeleton from '../components/ui/AppLoadingSkeleton'
import { useMeQuery } from '../hooks/useAuthQuery'
import { getAccessTokenFromLS } from '../utils/auth'

export default function PublicRoute() {
  const accessToken = getAccessTokenFromLS()
  const { isLoading, isError } = useMeQuery()
  // Không có token → render route con
  if (!accessToken) {
    return <AnimatedOutlet />
  }

  if (isLoading) {
    return <AppLoadingSkeleton />
  }

  // Token hết hạn/sai → vẫn cho vào public, không redirect nữa
  if (isError) {
    return <AnimatedOutlet />
  }

  // Token hợp lệ thật → đẩy vào dashboard
  return <Navigate to='/dashboard' replace />
}
