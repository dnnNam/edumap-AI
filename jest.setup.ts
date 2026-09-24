beforeAll(() => {
  // Giả lập biến môi trường của Vite để Jest không báo lỗi khi đọc các file có chứa import.meta.env
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).import = {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:3000/api', // Thêm các biến ENV dự án bạn đang dùng vào đây
      },
    },
  }

  // Mock fetch toàn cục
  globalThis.fetch = jest.fn()

  // Ghi đè console để Terminal sạch sẽ khi chạy test
  console.error = jest.fn()
  console.warn = jest.fn()
  console.log = jest.fn()
})

afterEach(() => {
  // Reset lại toàn bộ mock sau mỗi test case
  ;(globalThis.fetch as jest.Mock).mockReset()
  jest.clearAllMocks()
  jest.resetModules()
  jest.restoreAllMocks()
})
