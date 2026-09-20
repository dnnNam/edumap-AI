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
    <section className='bg-white border border-gray-200 rounded-2xl p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-[17px] font-semibold text-gray-900'>{title}</h2>
          <p className='mt-1 text-[13px] text-gray-500'>{description}</p>
        </div>
        {aside}
      </div>
      <div className='mt-5'>{children}</div>
    </section>
  )
}
