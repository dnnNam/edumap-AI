import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageReporters: ['text'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Ghi đè cấu hình TypeScript nội bộ chỉ dành riêng cho lúc chạy test
        tsconfig: {
          target: 'es2022',
          module: 'commonjs', // Ép dịch code về dạng CommonJS để Node.js chạy được
          verbatimModuleSyntax: false, // Tắt sự kiểm duyệt khắt khe của Vite
          esModuleInterop: true, // Fix luôn cảnh báo WARN màu vàng trên Terminal
          jsx: 'react-jsx',
          types: ['jest', 'node'],
        },
      },
    ],
  },
}

export default config
