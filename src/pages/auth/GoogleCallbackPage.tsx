import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'
import { authRepo } from '../../repository/auth.repo'
import { clearLS, saveAuthToLS } from '../../utils/auth'

export default function GoogleCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const handled = useRef(false) // tránh chạy 2 lần do StrictMode

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const accessToken = params.get('token')

    if (!accessToken) {
      toast.error('Đăng nhập Google thất bại, vui lòng thử lại.')
      navigate('/login', { replace: true })
      return
    }

    // 1. Lưu token trước để interceptor gắn Authorization cho request /auth/me
    saveAuthToLS({ accessToken, remember: true })

    // 2. Gọi /auth/me lấy thông tin user
    authRepo
      .getMe()
      .then((res) => {
        const user = res.data.data

        // 3. Lưu đầy đủ token + fullName + role vào localStorage
        saveAuthToLS({
          accessToken,
          fullName: user.fullName,
          role: user.role,
          remember: true,
        })

        // 4. Xóa cache cũ để ProtectedRoute gọi lại /auth/me với token mới
        queryClient.removeQueries({ queryKey: ['auth-me'] })

        toast.success('Đăng nhập thành công!')

        // 5. Vào dashboard, replace để URL chứa token không nằm lại trong lịch sử
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        clearLS()
        toast.error('Đăng nhập Google thất bại, vui lòng thử lại.')
        navigate('/login', { replace: true })
      })
  }, [params, navigate, queryClient])

  return <AppLoadingSkeleton />
}
