import { Navigate, Outlet } from 'react-router'
import AppLoadingSkeleton from '../components/ui/AppLoadingSkeleton'
import { useMeQuery } from '../hooks/useAuthQuery'
import { getAccessTokenFromLS } from '../utils/auth'

export default function ProtectedRoute() {
  const accessToken = getAccessTokenFromLS()
  const { isLoading, isError } = useMeQuery()
  // Không có token → redirect về login
  if (!accessToken) {
    return <Navigate to='/login' replace />
  }
  if (isLoading) {
    return <AppLoadingSkeleton />
  }
  // Token sai / hết hạn (401) → về login
  if (isError) {
    return <Navigate to='/login' replace />
  }

  // Có token → hiển thị component
  return <Outlet />
}
