import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function AppLoadingSkeleton() {
  return (
    <div className='flex h-screen w-full flex-col bg-gray-50 overflow-hidden'>
      {/* 1. HEADER SKELETON */}
      <header className='flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6'>
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
        <aside className='hidden w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 md:flex'>
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <div className='mt-auto'>
            <Skeleton height={40} borderRadius={8} />
          </div>
        </aside>

        {/* 3. MAIN CONTENT SKELETON */}
        <main className='flex-1 p-6 md:p-8'>
          {/* Tiêu đề trang */}
          <Skeleton width={250} height={36} className='mb-6' />

          {/* 3 Thẻ thống kê (Stat Cards) */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-100 bg-white p-5 shadow-sm'>
              <Skeleton width={100} height={20} className='mb-4' />
              <Skeleton width={150} height={40} />
            </div>
            <div className='rounded-xl border border-gray-100 bg-white p-5 shadow-sm'>
              <Skeleton width={100} height={20} className='mb-4' />
              <Skeleton width={150} height={40} />
            </div>
            <div className='rounded-xl border border-gray-100 bg-white p-5 shadow-sm'>
              <Skeleton width={100} height={20} className='mb-4' />
              <Skeleton width={150} height={40} />
            </div>
          </div>

          {/* Khung nội dung lớn bên dưới */}
          <div className='mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
            <Skeleton width={200} height={24} className='mb-6' />
            <Skeleton count={6} className='mb-3' borderRadius={6} />
          </div>
        </main>
      </div>
    </div>
  )
}
