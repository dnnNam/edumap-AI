export const ACCESS_TOKEN_KEY = 'access_token'
export const FULL_NAME_KEY = 'fullName'
export const ROLE_KEY = 'role'

// Đọc ở cả 2 nơi vì lúc login có thể lưu localStorage (remember) hoặc sessionStorage (không remember)
export const getAccessTokenFromLS = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY) || ''

export const getFullNameFromLS = () =>
  localStorage.getItem(FULL_NAME_KEY) || sessionStorage.getItem(FULL_NAME_KEY) || ''

export const getRoleFromLS = () => localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY) || ''

interface SaveAuthParams {
  accessToken: string
  fullName?: string
  role?: string
  remember?: boolean // true -> localStorage (giữ qua các lần mở lại trình duyệt), false -> sessionStorage (mất khi đóng tab)
}

// Lưu tập trung 1 chỗ (token + fullName + role) để tránh lưu rải rác nhiều nơi như trước
export const saveAuthToLS = ({ accessToken, fullName = '', role = '', remember = true }: SaveAuthParams) => {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(ACCESS_TOKEN_KEY, accessToken)
  storage.setItem(FULL_NAME_KEY, fullName)
  storage.setItem(ROLE_KEY, role)
}

export const LocalStorageEventTarget = new EventTarget()

export const clearLS = () => {
  ;[localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(ACCESS_TOKEN_KEY)
    storage.removeItem(FULL_NAME_KEY)
    storage.removeItem(ROLE_KEY)
    storage.removeItem('emailAccount')
    storage.removeItem('userId')
    storage.removeItem('groupId')
  })
  LocalStorageEventTarget.dispatchEvent(new Event('clearLS'))
}

// checkRole: kiểm tra role hiện tại (lấy từ LS) có thuộc danh sách được phép không
// Dùng cho cả route guard (AdminRoute) và ẩn/hiện UI theo role (button, menu item...)
export const checkRole = (allowedRoles: string[]) => allowedRoles.includes(getRoleFromLS())

export const isAdmin = () => checkRole(['ADMIN'])
