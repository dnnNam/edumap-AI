import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useTrendingJobsQuery } from '../../hooks/jobQuery'
import TrendingRoles from '../../components/layouts/jobs/TrendingRoles'
import JobsHeroBanner from '../../components/layouts/jobs/JobsHeroBanner'

const QUICK_FILTERS = ['Tất cả', 'Backend', 'Frontend', 'Fullstack', 'AI', 'Cloud', 'Data', 'DevOps']

export default function JobsPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError, isFetching, refetch } = useTrendingJobsQuery()

  const body = data?.data?.data
  const roles = useMemo(() => body?.data ?? [], [body])

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Tất cả')

  const filtered = useMemo(() => {
    let result = roles
    if (activeFilter !== 'Tất cả') {
      const filterKey = activeFilter.toLowerCase()
      result = result.filter(
        (r) =>
          r.targetRole.toLowerCase().includes(filterKey) ||
          r.badge?.toLowerCase().includes(filterKey) ||
          r.topSkills?.some((s) => s.toLowerCase().includes(filterKey)),
      )
    }

    const keyword = search.trim().toLowerCase()
    if (keyword) {
      result = result.filter(
        (r) =>
          r.targetRole.toLowerCase().includes(keyword) ||
          r.badge?.toLowerCase().includes(keyword) ||
          r.topSkills?.some((s) => s.toLowerCase().includes(keyword)),
      )
    }

    return result
  }, [roles, search, activeFilter])

  const handleSelectFilter = (filter: string) => {
    setActiveFilter(filter)
  }

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        {/* Modern SaaS Hero Banner */}
        <JobsHeroBanner activeTab='trending' />

        {/* Tiêu đề & Mô tả */}
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('jobs.trending.title')}</h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>
              {isLoading
                ? t('common.loading')
                : `${t('jobs.trending.subtitle', { count: roles.length })}${body?.message ? ` · ${body.message}` : ''}`}
            </p>
          </div>
        </div>

        {/* Ô tìm kiếm & Bộ lọc nhanh */}
        <div className='mt-8 rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#161426] p-5 sm:p-6 shadow-xs dark:shadow-lg transition-colors space-y-4'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#A29FA8] pointer-events-none' />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
              placeholder={t('jobs.trending.search')}
              className='w-full rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-gray-50/60 dark:bg-white/[0.04] pl-12 pr-10 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition'
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className='flex flex-wrap items-center gap-2 pt-1'>
            <span className='text-xs font-semibold text-gray-400 dark:text-[#85808C] mr-1 uppercase tracking-wider'>
              Lọc nhanh:
            </span>
            {QUICK_FILTERS.map((cat) => {
              const isActive = activeFilter === cat
              return (
                <button
                  key={cat}
                  type='button'
                  onClick={() => handleSelectFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-white/5'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Danh sách */}
        <div className='mt-8'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={200} borderRadius={24} />
              ))}
            </div>
          ) : isError ? (
            <div className='rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#161426] p-10 text-center shadow-xs'>
              <p className='text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>
                {t('jobs.trending.loadError')}
              </p>
              <button
                type='button'
                onClick={() => refetch()}
                disabled={isFetching}
                className='mt-5 rounded-xl border border-gray-200/80 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
              >
                {isFetching ? t('common.loading') : t('common.retry')}
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className='py-16 text-center text-sm text-gray-500 rounded-3xl border border-dashed border-gray-200 dark:border-white/10'>
              <p className='text-base font-semibold text-gray-700 dark:text-gray-300'>{t('jobs.trending.empty')}</p>
              <p className='text-xs text-gray-400 mt-1'>Thử thay đổi từ khoá tìm kiếm hoặc chọn bộ lọc khác</p>
            </div>
          ) : (
            <TrendingRoles key={`${search}-${activeFilter}`} roles={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}
