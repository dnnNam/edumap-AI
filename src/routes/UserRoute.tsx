import { Navigate, Outlet } from 'react-router'
import AppLoadingSkeleton from '../components/ui/AppLoadingSkeleton'
import { useMeQuery } from '../hooks/useAuthQuery'
import { getRoleFromLS } from '../utils/auth'

// Chỉ dùng bên trong ProtectedRoute: admin không được vào các trang của học viên
export default function UserRoute() {
  const { data, isLoading } = useMeQuery()

  if (isLoading) {
    return <AppLoadingSkeleton />
  }

  const role = data?.data.data.role ?? getRoleFromLS()

  if (role === 'ADMIN') {
    return <Navigate to='/admin' replace />
  }

  return <Outlet />
}
