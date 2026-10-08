import type { ElementType } from 'react'

export default function SectionHeader({ icon: Icon, title, tag }: { icon: ElementType; title: string; tag: string }) {
  return (
    <div className='flex items-center gap-2'>
      <Icon className='w-4 h-4 text-gray-500 dark:text-[#A29FA8]' />
      <h2 className='text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>{title}</h2>
      <span className='text-[11px] text-gray-500 dark:text-[#A29FA8] border border-gray-200 dark:border-white/[0.08] rounded-full px-2 py-0.5'>{tag}</span>
    </div>
  )
}
