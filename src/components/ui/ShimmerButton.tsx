import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  shimmerColor?: string
}

/**
 * ShimmerButton inspired by Aceternity UI & Magic UI.
 * Features a high-tech animated border gradient rotation that draws attention naturally.
 */
export default function ShimmerButton({ children, className = '', disabled, ...props }: ShimmerButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-[1.5px] font-bold transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {/* Spinning Rainbow/Indigo Border Light */}
      <span
        className='absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4F46E5_0%,#A99DFF_50%,#4F46E5_100%)] opacity-80 group-hover:opacity-100 transition-opacity'
        aria-hidden='true'
      />
      {/* Inner Button Surface */}
      <span className='relative inline-flex h-full w-full items-center justify-center gap-2 rounded-[14.5px] bg-indigo-600 px-7 py-3 text-sm sm:text-base text-white transition-colors group-hover:bg-indigo-700'>
        {children}
      </span>
    </button>
  )
}
