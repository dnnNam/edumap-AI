import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// ---------- SkeletonCard: thẻ trắng border, loading state ----------

export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6'>
      <Skeleton width='60%' height={14} />
      <div className='mt-3 space-y-2'>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} height={20} />
        ))}
      </div>
    </div>
  )
}

// ---------- SkeletonStat: thẻ stat to (như SkillTreeSummary) ----------

export function SkeletonStat() {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6'>
      <Skeleton width='40%' height={12} />
      <div className='mt-3'>
        <Skeleton height={32} width='50%' />
      </div>
      <div className='mt-4'>
        <Skeleton height={6} className='rounded-full' />
      </div>
    </div>
  )
}

// ---------- SkeletonTreeRow: dòng cây (node row) ----------

export function SkeletonTreeRow() {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3'>
      <Skeleton width={24} height={24} />
      <div className='flex flex-1 min-w-0 items-center gap-3'>
        <Skeleton circle width={32} height={32} />
        <div className='flex-1 min-w-0 space-y-1'>
          <Skeleton width='70%' height={14} />
          <Skeleton width='50%' height={11} />
        </div>
      </div>
      <Skeleton width={44} height={24} />
    </div>
  )
}

// ---------- SkeletonDetailPanel: panel chi tiết bên phải ----------

export function SkeletonDetailPanel() {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6'>
      <Skeleton height={16} width='60%' />
      <Skeleton height={12} width='40%' className='mt-2' />
      <div className='mt-5 space-y-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton width='30%' height={10} />
            <Skeleton width='80%' height={11} className='mt-1.5' />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- SkeletonFilterChips: thanh chip lọc ----------

export function SkeletonFilterChips() {
  return (
    <div className='flex gap-2 flex-wrap'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} width={80} height={28} className='rounded-lg' />
      ))}
    </div>
  )
}
