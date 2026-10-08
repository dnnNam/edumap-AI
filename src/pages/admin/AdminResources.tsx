import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import ResourceFormModal from '../../components/layouts/admin/ResourceFormModal'
import { useDeleteSkillResourceMutation, useTopSkillResourcesQuery } from '../../hooks/skillResourceQuery'
import type { SkillResource } from '../../types/api/skillResource.types'
import { cleanTitle, getPlatform, getPriceLabel, getResourceTypeLabel } from '../../utils/skillResource'

const PAGE_SIZE = 10
const TOP_LIMIT = 50 // BE: tối đa 50
const ALL = '__ALL__'

type SortKey = 'title' | 'skill' | 'resourceType' | 'cost' | 'rating' | 'durationHours' | 'createdAt'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Tài nguyên' },
  { key: 'skill', label: 'Kỹ năng' },
  { key: 'resourceType', label: 'Loại' },
  { key: 'cost', label: 'Chi phí' },
  { key: 'rating', label: 'Đánh giá' },
  { key: 'durationHours', label: 'Thời lượng' },
  { key: 'createdAt', label: 'Ngày tạo' },
]

const TYPE_STYLE: Record<string, string> = {
  VIDEO_COURSE: 'bg-rose-50 text-rose-700 border-rose-200',
  DOCUMENTATION: 'bg-sky-50 text-sky-700 border-sky-200',
  INTERACTIVE_LAB: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ARTICLE: 'bg-amber-50 text-amber-700 border-amber-200',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

const sortValue = (r: SkillResource, key: SortKey): string | number =>
  key === 'skill' ? (r.skill?.name ?? '') : (r[key] as string | number)

function compare(a: SkillResource, b: SkillResource, key: SortKey) {
  const va = sortValue(a, key)
  const vb = sortValue(b, key)
  if (typeof va === 'number' && typeof vb === 'number') return va - vb
  return String(va).localeCompare(String(vb), 'vi')
}

export default function AdminResourcesPage() {
  const { data: response, isLoading, isError, isFetching, refetch } = useTopSkillResourcesQuery(TOP_LIMIT)
  const resources = useMemo(() => response?.data?.data ?? [], [response])

  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('rating')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SkillResource | null>(null)

  const { mutate: deleteResource, isPending: deleting } = useDeleteSkillResourceMutation()

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return resources
      .filter((r) => (type === ALL ? true : r.resourceType === type))
      .filter((r) =>
        kw ? r.title.toLowerCase().includes(kw) || (r.skill?.name ?? '').toLowerCase().includes(kw) : true,
      )
      .sort((a, b) => (sortDir === 'asc' ? 1 : -1) * compare(a, b, sortKey))
  }, [resources, keyword, type, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const freeCount = resources.filter((r) => r.cost === 0).length
  const avgRating = resources.length
    ? (resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1)
    : '0.0'

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteResource(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const selectClass =
    'h-9 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] px-3 text-sm text-gray-700 dark:text-[#ECE9E4] outline-none focus:border-gray-300 dark:focus:border-white/20 cursor-pointer transition-colors'

  return (
    <div className='h-full overflow-y-auto [scrollbar-gutter:stable] bg-transparent text-gray-900 dark:text-[#ECE9E4]'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-[28px] font-bold text-gray-900 dark:text-[#ECE9E4]'>Resources</h1>
            <p className='mt-1 text-gray-500 dark:text-[#A29FA8] text-[15px]'>
              Top {TOP_LIMIT} tài nguyên được đánh giá cao nhất trên hệ thống.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
              className='inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type='button'
              onClick={() => setFormOpen(true)}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition cursor-pointer shadow-xs'
            >
              <Plus className='w-4 h-4' />
              Thêm tài nguyên
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            { label: 'Tổng tài nguyên', value: resources.length },
            { label: 'Miễn phí', value: freeCount },
            { label: 'Đánh giá trung bình', value: avgRating },
          ].map((s) => (
            <div key={s.label} className='rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-4 transition-colors'>
              <p className='text-xs text-gray-500 dark:text-[#A29FA8]'>{s.label}</p>
              <p className='mt-1 text-2xl font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                {isLoading ? <Skeleton width={48} /> : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className='mt-5 flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 h-9 w-full sm:w-72 rounded-lg bg-white dark:bg-[#232227] border border-gray-200 dark:border-white/[0.08] px-3 text-gray-400 dark:text-[#A29FA8] focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors'>
            <Search className='w-4 h-4 shrink-0' />
            <input
              type='text'
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setPage(1)
              }}
              placeholder='Tìm theo tiêu đề hoặc kỹ năng...'
              className='bg-transparent outline-none text-sm text-gray-700 dark:text-[#ECE9E4] placeholder:text-gray-400 dark:placeholder:text-[#A29FA8]/60 w-full'
            />
          </div>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value)
              setPage(1)
            }}
            className={selectClass}
          >
            <option value={ALL}>Tất cả loại</option>
            {Object.keys(TYPE_STYLE).map((t) => (
              <option key={t} value={t}>
                {getResourceTypeLabel(t)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className='mt-5 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden transition-colors'>
          {isError && !resources.length ? (
            <div className='p-10 text-center'>
              <p className='text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>Không tải được danh sách tài nguyên.</p>
              <button
                type='button'
                onClick={() => refetch()}
                className='mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition cursor-pointer shadow-xs'
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.08] transition-colors'>
                  <tr>
                    {COLUMNS.map((col) => {
                      const active = sortKey === col.key
                      return (
                        <th key={col.key} className='text-left font-medium text-gray-500 dark:text-[#A29FA8] px-4 py-3 whitespace-nowrap'>
                          <button
                            type='button'
                            onClick={() => handleSort(col.key)}
                            className={`inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-[#ECE9E4] transition cursor-pointer ${active ? 'text-gray-900 dark:text-[#ECE9E4]' : ''}`}
                          >
                            {col.label}
                            {active &&
                              (sortDir === 'asc' ? (
                                <ArrowUp className='w-3.5 h-3.5' />
                              ) : (
                                <ArrowDown className='w-3.5 h-3.5' />
                              ))}
                          </button>
                        </th>
                      )
                    })}
                    <th className='px-4 py-3 w-24' />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className='border-b border-gray-100 dark:border-white/[0.04] last:border-0'>
                        {COLUMNS.map((c) => (
                          <td key={c.key} className='px-4 py-3'>
                            <Skeleton height={20} />
                          </td>
                        ))}
                        <td className='px-4 py-3'>
                          <Skeleton width={24} height={20} />
                        </td>
                      </tr>
                    ))
                  ) : pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={COLUMNS.length + 1} className='px-4 py-12 text-center text-gray-500 dark:text-[#A29FA8]'>
                        Không có tài nguyên nào khớp bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((r) => (
                      <tr
                        key={r.id}
                        className='border-b border-gray-100 dark:border-white/[0.04] last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors'
                      >
                        <td className='px-4 py-3 max-w-xs'>
                          <p className='font-medium text-gray-900 dark:text-[#ECE9E4] truncate' title={r.title}>
                            {cleanTitle(r.title)}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-[#A29FA8] truncate'>{getPlatform(r.url)}</p>
                        </td>
                        <td className='px-4 py-3 text-gray-600 dark:text-[#ECE9E4]/80'>{r.skill?.name ?? '—'}</td>
                        <td className='px-4 py-3'>
                          <span
                            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TYPE_STYLE[r.resourceType] ?? 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-[#ECE9E4] border-gray-200 dark:border-white/[0.08]'}`}
                          >
                            {getResourceTypeLabel(r.resourceType)}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-gray-600 dark:text-[#ECE9E4]/80'>{getPriceLabel(r.cost)}</td>
                        <td className='px-4 py-3'>
                          <span className='inline-flex items-center gap-1 text-gray-900 dark:text-[#ECE9E4] tabular-nums'>
                            <Star className='w-3.5 h-3.5 fill-gray-900 dark:fill-[#ECE9E4] text-gray-900 dark:text-[#ECE9E4]' />
                            {r.rating.toFixed(1)}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-gray-600 dark:text-[#ECE9E4]/80 tabular-nums'>{r.durationHours}h</td>
                        <td className='px-4 py-3 text-gray-500 dark:text-[#A29FA8] whitespace-nowrap'>{formatDate(r.createdAt)}</td>
                        <td className='px-4 py-3 text-right'>
                          <div className='flex items-center justify-end gap-1'>
                            <a
                              href={r.url}
                              target='_blank'
                              rel='noreferrer'
                              aria-label={`Mở ${r.title}`}
                              className='inline-flex p-1.5 rounded-lg text-gray-500 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/10 transition'
                            >
                              <ExternalLink className='w-4 h-4' />
                            </a>
                            <button
                              type='button'
                              onClick={() => setDeleteTarget(r)}
                              aria-label={`Xóa ${r.title}`}
                              className='p-1.5 rounded-lg text-gray-500 dark:text-[#A29FA8] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filtered.length > 0 && (
            <div className='flex items-center justify-between gap-4 border-t border-gray-200 dark:border-white/[0.08] px-4 py-3 text-sm text-gray-500 dark:text-[#A29FA8] transition-colors'>
              <span>
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label='Previous page'
                  className='p-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                <span className='tabular-nums text-gray-900 dark:text-[#ECE9E4]'>
                  {currentPage} / {totalPages}
                </span>
                <button
                  type='button'
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label='Next page'
                  className='p-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-xs'
            onClick={() => !deleting && setDeleteTarget(null)}
            aria-hidden='true'
          />
          <div role='dialog' aria-modal='true' className='relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A191C] border border-transparent dark:border-white/[0.08] shadow-xl transition-colors'>
            <div className='px-6 py-4'>
              <h3 className='text-[17px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>Xóa tài nguyên?</h3>
              <p className='mt-2 text-sm text-gray-500 dark:text-[#A29FA8]'>
                "<span className='font-medium text-gray-700 dark:text-[#ECE9E4]'>{cleanTitle(deleteTarget.title)}</span>" sẽ bị xóa vĩnh
                viễn. Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-white/[0.08] transition-colors'>
              <button
                type='button'
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className='rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
              >
                Hủy
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                disabled={deleting}
                className='inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-60 transition cursor-pointer shadow-xs'
              >
                {deleting && <Loader2 className='w-4 h-4 animate-spin' />}
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ResourceFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
