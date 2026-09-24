import {
  ACCESS_TOKEN_KEY,
  FULL_NAME_KEY,
  ROLE_KEY,
  getAccessTokenFromLS,
  getFullNameFromLS,
  getRoleFromLS,
  saveAuthToLS,
  clearLS,
  checkRole,
  isAdmin,
  LocalStorageEventTarget,
} from './auth' // Sửa lại đường dẫn nếu file của bạn tên khác

// 1. Giả lập localStorage và sessionStorage cho môi trường Node
const createMockStorage = () => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
}

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.localStorage = createMockStorage() as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.sessionStorage = createMockStorage() as any
})

afterEach(() => {
  // Làm sạch dữ liệu giả lập sau mỗi test case
  ;(globalThis.localStorage.clear as jest.Mock)()
  ;(globalThis.sessionStorage.clear as jest.Mock)()
  jest.clearAllMocks()
})

describe('Auth Utils', () => {
  describe('saveAuthToLS', () => {
    it('Lưu vào localStorage khi remember = true', () => {
      saveAuthToLS({ accessToken: 'token123', fullName: 'Đại Nam', role: 'ADMIN', remember: true })

      expect(localStorage.setItem).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, 'token123')
      expect(localStorage.setItem).toHaveBeenCalledWith(FULL_NAME_KEY, 'Đại Nam')
      expect(localStorage.setItem).toHaveBeenCalledWith(ROLE_KEY, 'ADMIN')

      // Đảm bảo không lưu nhầm sang sessionStorage
      expect(sessionStorage.setItem).not.toHaveBeenCalled()
    })

    it('Lưu vào sessionStorage khi remember = false', () => {
      saveAuthToLS({ accessToken: 'token456', remember: false })

      expect(sessionStorage.setItem).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, 'token456')
      expect(sessionStorage.setItem).toHaveBeenCalledWith(FULL_NAME_KEY, '')
      expect(sessionStorage.setItem).toHaveBeenCalledWith(ROLE_KEY, '')

      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('Getters (Lấy dữ liệu)', () => {
    it('Lấy accessToken ưu tiên từ localStorage, rồi tới sessionStorage', () => {
      // Test 1: Không có ở cả 2
      expect(getAccessTokenFromLS()).toBe('')

      // Test 2: Có ở sessionStorage
      ;(globalThis.sessionStorage.getItem as jest.Mock).mockReturnValueOnce('token-session')
      expect(getAccessTokenFromLS()).toBe('token-session')

      // Test 3: Có ở cả 2 (Ưu tiên localStorage)
      ;(globalThis.localStorage.getItem as jest.Mock).mockReturnValueOnce('token-local')
      ;(globalThis.sessionStorage.getItem as jest.Mock).mockReturnValueOnce('token-session')
      expect(getAccessTokenFromLS()).toBe('token-local')
    })

    it('Lấy fullName và role chuẩn xác', () => {
      ;(globalThis.localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === FULL_NAME_KEY) return 'Đại Nam'
        if (key === ROLE_KEY) return 'USER'
        return null
      })

      expect(getFullNameFromLS()).toBe('Đại Nam')
      expect(getRoleFromLS()).toBe('USER')
    })
  })

  describe('clearLS', () => {
    it('Xóa toàn bộ key ở cả 2 storage và phát sự kiện clearLS', () => {
      // Theo dõi sự kiện dispatch
      const dispatchSpy = jest.spyOn(LocalStorageEventTarget, 'dispatchEvent')

      clearLS()

      // Kiểm tra xem hàm removeItem có được gọi đủ số lượng cho các key không
      const expectedKeys = [ACCESS_TOKEN_KEY, FULL_NAME_KEY, ROLE_KEY, 'emailAccount', 'userId', 'groupId']

      expectedKeys.forEach((key) => {
        expect(localStorage.removeItem).toHaveBeenCalledWith(key)
        expect(sessionStorage.removeItem).toHaveBeenCalledWith(key)
      })

      // Kiểm tra event
      expect(dispatchSpy).toHaveBeenCalledTimes(1)
      expect(dispatchSpy.mock.calls[0][0].type).toBe('clearLS')
    })
  })

  describe('Kiểm tra quyền hạn (checkRole & isAdmin)', () => {
    it('checkRole trả về true nếu role hiện tại nằm trong danh sách cho phép', () => {
      ;(globalThis.localStorage.getItem as jest.Mock).mockReturnValue('MANAGER')

      expect(checkRole(['ADMIN', 'MANAGER'])).toBe(true)
      expect(checkRole(['USER', 'GUEST'])).toBe(false)
    })

    it('isAdmin trả về true chỉ khi role là ADMIN', () => {
      ;(globalThis.localStorage.getItem as jest.Mock).mockReturnValue('ADMIN')
      expect(isAdmin()).toBe(true)
      ;(globalThis.localStorage.getItem as jest.Mock).mockReturnValue('USER')
      expect(isAdmin()).toBe(false)
    })
  })
})
