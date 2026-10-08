import { type ReactNode } from 'react'

interface GradientBorderCardProps {
  children: ReactNode
  className?: string
  rounded?: string
}

/**
 * GradientBorderCard: Bọc khối/card với viền conic-gradient mảnh xoay chậm
 * - Light mode: opacity-70, màu indigo-600 / indigo-400 / indigo-100
 * - Dark mode: opacity-35, ánh tím mảnh tinh tế dịu nhẹ, không rực
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
        className='absolute inset-[-150%] animate-[spin_10s_linear_infinite] opacity-70 dark:opacity-35 pointer-events-none'
        style={{
          background:
            'var(--conic-gradient, conic-gradient(from 0deg, #4F46E5 0deg, #818CF8 90deg, #E0E7FF 180deg, #4F46E5 360deg))',
        }}
      />

      {/* Lớp nội dung bên trong giữ nguyên 100% style của card */}
      <div className={`relative ${rounded} overflow-hidden h-full w-full`}>
        {children}
      </div>
    </div>
  )
}
