import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageView } from '../utils/analytics'

/**
 * Hook tự động gửi page_view lên Google Analytics 4 mỗi khi người dùng chuyển route (SPA)
 */
export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Đợi 1 tick để document.title cập nhật (nếu có)
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title)
    }, 50)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search])
}
