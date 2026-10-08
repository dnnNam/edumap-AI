import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function AppLoadingSkeleton() {
  return (
    <div className='flex h-screen w-full flex-col bg-gray-50 dark:bg-[#121114] overflow-hidden transition-colors'>
      {/* 1. HEADER SKELETON */}
      <header className='flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] px-6 transition-colors'>
        {/* Logo giả */}
        <Skeleton width={140} height={32} borderRadius={8} />

        {/* Khung User / Avatar giả bên phải */}
        <div className='flex items-center gap-4'>
          <Skeleton width={100} height={20} />
          <Skeleton circle width={40} height={40} />
        </div>
      </header>

      <div className='flex flex-1 overflow-hidden'>
        {/* 2. SIDEBAR SKELETON (Ẩn trên mobile, hiện trên md) */}
        <aside className='hidden w-64 flex-col gap-4 border-r border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-4 md:flex transition-colors'>
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <div className='mt-auto'>
            <Skeleton height={40} borderRadius={8} />
          </div>
        </aside>

        {/* 3. MAIN CONTENT SKELETON */}
        <main className='flex-1 p-6 md:p-8 overflow-y-auto'>
          {/* Tiêu đề trang */}
          <Skeleton width={250} height={36} className='mb-6' />

          {/* 3 Thẻ thống kê (Stat Cards) */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5 shadow-sm transition-colors'>
              <Skeleton width={100} height={20} className='mb-4' />
              <Skeleton width={150} height={40} />
            </div>
            <div className='rounded-xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5 shadow-sm transition-colors'>
              <Skeleton width={100} height={20} className='mb-4' />
              <Skeleton width={150} height={40} />
            </div>
            <div className='rounded-xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5 shadow-sm transition-colors'>
              <Skeleton width={100} height={20} className='mb-4' />
              <Skeleton width={150} height={40} />
            </div>
          </div>

          {/* Khung nội dung lớn bên dưới */}
          <div className='mt-6 rounded-xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 shadow-sm transition-colors'>
            <Skeleton width={200} height={24} className='mb-6' />
            <Skeleton count={6} className='mb-3' borderRadius={6} />
          </div>
        </main>
      </div>
    </div>
  )
}
