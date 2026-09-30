import { useSearchParams } from 'react-router'
import HomePage from './HomePage'
import GoogleCallbackPage from './GoogleCallbackPage'

// Trang "/": có ?token= (BE redirect sau khi đăng nhập Google) thì xử lý đăng nhập,
// không có thì hiện trang chủ bình thường
export default function HomeEntry() {
  const [params] = useSearchParams()
  return params.get('token') ? <GoogleCallbackPage /> : <HomePage />
}
