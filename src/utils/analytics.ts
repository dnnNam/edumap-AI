declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = 'G-7L3ZY4VJBJ'

/**
 * Ghi nhận lượt xem trang (Page View) khi người dùng chuyển route
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    })
  }
}

/**
 * Gắn User ID khi người dùng đăng nhập thành công
 */
export function setAnalyticsUser(userId: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
    })
  }
}

/**
 * Theo dõi sự kiện tùy chỉnh nghiệp vụ EduMapAI
 */
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params || {})
  }
}
