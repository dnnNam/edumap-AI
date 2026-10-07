import { type ReactNode } from 'react'

interface GradientBorderCardProps {
  children: ReactNode
  className?: string
  rounded?: string
}

/**
 * GradientBorderCard: Bọc khối/card với viền conic-gradient mảnh xoay chậm
 * - Dùng 100% màu sẵn có: indigo-600 (#4F46E5), indigo-400 (#818CF8), indigo-100 (#E0E7FF)
 * - Nền card bên trong giữ nguyên hoàn toàn
 * - Rất nhẹ, 60fps mượt mà
 */
export default function GradientBorderCard({
  children,
  className = '',
  rounded = 'rounded-3xl',
}: GradientBorderCardProps) {
  return (
    <div className={`relative p-[1.5px] overflow-hidden ${rounded} ${className}`}>
      {/* Lớp viền gradient xoay chậm (conic-gradient) */}
      <div
        aria-hidden='true'
        className='absolute inset-[-150%] animate-[spin_10s_linear_infinite] opacity-70 pointer-events-none'
        style={{
          background:
            'conic-gradient(from 0deg, #4F46E5 0deg, #818CF8 90deg, #E0E7FF 180deg, #4F46E5 360deg)',
        }}
      />

      {/* Lớp nội dung bên trong giữ nguyên 100% style của card */}
      <div className={`relative ${rounded} overflow-hidden h-full w-full`}>
        {children}
      </div>
    </div>
  )
}

