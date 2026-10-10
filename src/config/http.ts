import type { AxiosError, AxiosInstance } from 'axios'
import axios, { HttpStatusCode } from 'axios'
import { clearLS, getAccessTokenFromLS } from '../utils/auth'
import { toast } from 'sonner'
import i18n from '../i18n'

interface ErrorResponse {
  message?: string
  // thêm các field khác nếu backend của bạn có
}

// Các endpoint "phụ", lỗi thì im lặng, không toast (vd: ghi lịch sử xem tài nguyên)
const SILENT_ERROR_URL_SUFFIXES = ['/history']

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.instance.interceptors.request.use(
      // config là cấu hình của request sắp được gửi đi toàn bộ thông tin chi tiết về request

      (config) => {
        const accessToken = getAccessTokenFromLS()
        // nếu có accessToken thì gắn vào header Authorization
        // this.accessToken  có token để gửi đi không
        // config.headers có tồn tại header  trong request không
        if (accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error: AxiosError<ErrorResponse>) => {
        // 1. Xử lý 401 Unauthorized (Hết hạn token hoặc token sai)
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          const message = error?.response?.data?.message
          clearLS()
          toast.error(message || i18n.t('errors.sessionExpired'), {
            duration: 1500,
          })
          // Tùy chọn: Ép reload để clear state trong bộ nhớ và đẩy về login
          // window.location.reload();
          return Promise.reject(error) // Return luôn ở đây để không chạy xuống dưới
        }

        // 2. Endpoint im lặng (history...) -> không toast
        const url = error.config?.url ?? ''
        const isSilent = SILENT_ERROR_URL_SUFFIXES.some((suffix) => url.endsWith(suffix))

        // 3. Xử lý Toast error cho các lỗi không phải 422 và 401
        if (!isSilent && error.response?.status !== HttpStatusCode.UnprocessableContent) {
          // TypeScript đã hiểu error.response.data là ErrorResponse, không cần dùng any
          const data = error.response?.data
          const message = data?.message || error.message

          toast.error(message, {
            duration: 1500,
          })
        }

        return Promise.reject(error)
      },
    )
  }
}

const http = new Http().instance

export default http
