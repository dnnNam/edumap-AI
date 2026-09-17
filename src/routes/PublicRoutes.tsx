import { Navigate, Outlet } from 'react-router'

import AppLoadingSkeleton from '../components/ui/AppLoadingSkeleton'
import { useMeQuery } from '../hooks/useAuthQuery'
import { getAccessTokenFromLS } from '../utils/auth'

export default function PublicRoute() {
  const accessToken = getAccessTokenFromLS()
  const { isLoading, isError } = useMeQuery()
  // Không có token → render route con
  if (!accessToken) {
    return <Outlet />
  }

  if (isLoading) {
    return <AppLoadingSkeleton />
  }

  // Token hết hạn/sai → vẫn cho vào public, không redirect nữa
  if (isError) {
    return <Outlet />
  }

  // Token hợp lệ thật → đẩy vào dashboard
  return <Navigate to='/dashboard' replace />
}
