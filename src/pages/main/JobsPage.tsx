import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useTrendingJobsQuery } from '../../hooks/jobQuery'
import TrendingRoles from '../../components/layouts/jobs/TrendingRoles'

export default function JobsPage() {
  const { data, isLoading, isError, isFetching, refetch } = useTrendingJobsQuery()

  // axios: data.data = body ngoài; .data = TrendingJobsBody; .data = mảng
  const body = data?.data?.data
  const roles = useMemo(() => body?.data ?? [], [body])

  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return roles
    return roles.filter((r) => r.targetRole.toLowerCase().includes(keyword))
  }, [roles, search])

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        {/* Tiêu đề */}
        <h1 className='text-3xl font-semibold text-gray-900'>Job Trending</h1>
        <p className='mt-2 text-gray-500'>
          {isLoading ? 'Đang tải...' : `${roles.length} vị trí${body?.message ? ` · ${body.message}` : ''}`}
        </p>

        {/* Ô tìm kiếm */}
        <div className='mt-8 rounded-3xl border border-gray-200 bg-white p-6'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
              placeholder='Search roles...'
              className='w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
            />
          </div>
        </div>

        {/* Danh sách */}
        <div className='mt-6'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={170} borderRadius={24} />
              ))}
            </div>
          ) : isError ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center'>
              <p className='text-[15px] font-medium text-gray-900'>Không tải được danh sách xu hướng.</p>
              <button
                type='button'
                onClick={() => refetch()}
                disabled={isFetching}
                className='mt-5 rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
              >
                {isFetching ? 'Đang tải...' : 'Thử lại'}
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className='py-16 text-center text-sm text-gray-500'>Không có vị trí nào phù hợp.</p>
          ) : (
            // key theo từ khóa để stagger chạy lại khi lọc
            <TrendingRoles key={search} roles={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}
