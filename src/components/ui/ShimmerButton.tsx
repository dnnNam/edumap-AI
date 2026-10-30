import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

/**
 * ShimmerButton inspired by Aceternity UI.
 * Features an ultra-visible revolving laser border glow.
 */
export default function ShimmerButton({ children, className = '', disabled, ...props }: ShimmerButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-[2px] font-bold transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {/* High-Contrast Revolving Conic Laser Light */}
      <span
        className='absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_60%,#c4b5fd_85%,#ffffff_95%,transparent_100%)]'
        aria-hidden='true'
      />
      {/* Inner Button Surface */}
      <span className='relative inline-flex h-full w-full items-center justify-center gap-2 rounded-[14px] bg-indigo-600 px-7 py-3 text-sm sm:text-base text-white transition-colors group-hover:bg-indigo-700'>
        {children}
      </span>
    </button>
  )
}
