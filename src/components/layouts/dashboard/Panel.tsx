import { type ReactNode } from 'react'

export default function Panel({
  title,
  description,
  aside,
  children,
}: {
  title: string
  description: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-[17px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>{title}</h2>
          <p className='mt-1 text-[13px] text-gray-500 dark:text-[#A29FA8]'>{description}</p>
        </div>
        {aside}
      </div>
      <div className='mt-5'>{children}</div>
    </section>
  )
}
