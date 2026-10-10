import { useTranslation } from 'react-i18next'
import { getLocale } from '../../utils/locale'
import { Fragment, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
} from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { useAllSkillTreesQuery, useDeleteSkillTreeMutation } from '../../hooks/skillTreeQuery'
import type { SkillNode } from '../../types/api/skillTree.types'
import type { AdminSkillTreeItem } from '../../types/api/skills.type'

const PAGE_SIZE = 20
const ALL = '__ALL__'

type SortKey = 'userId' | 'careerPath' | 'completionPercentage' | 'nodeCount' | 'lastAnalyzedAt' | 'createdAt'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; labelKey: string }[] = [
  { key: 'userId', labelKey: 'admin.trees.cols.userId' },
  { key: 'careerPath', labelKey: 'admin.trees.cols.careerPath' },
  { key: 'completionPercentage', labelKey: 'admin.trees.cols.progress' },
  { key: 'nodeCount', labelKey: 'admin.trees.cols.rootNodes' },
  { key: 'lastAnalyzedAt', labelKey: 'admin.trees.cols.lastAnalyzed' },
  { key: 'createdAt', labelKey: 'admin.trees.cols.created' },
]

// Cột chevron (đầu) + cột nút xóa (cuối)
const TOTAL_COLS = COLUMNS.length + 2

// Chỉ lấy node gốc, bỏ qua children
interface Row {
  id: string
  userId: string
  careerPath: string
  completionPercentage: number
  lastAnalyzedAt: string
  createdAt: string
  rootNodes: SkillNode[]
  nodeCount: number
}

function toRow(t: AdminSkillTreeItem): Row {
  const rootNodes = [...(t.nodes ?? [])]
    .filter((n) => n.parentNodeId === null)
    .sort((a, b) => a.priorityRank - b.priorityRank)

  return {
    id: t.id,
    userId: t.userId,
    careerPath: t.careerPath,
    completionPercentage: t.completionPercentage ?? 0,
    lastAnalyzedAt: t.lastAnalyzedAt ?? '',
    createdAt: t.createdAt,
    rootNodes,
    nodeCount: rootNodes.length,
  }
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(getLocale(), { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function compare(a: Row, b: Row, key: SortKey) {
  const va = a[key]
  const vb = b[key]
  if (typeof va === 'number' && typeof vb === 'number') return va - vb
  return String(va).localeCompare(String(vb), 'vi')
}

const shortId = (id: string) => `${id.slice(0, 8)}…`

function RootNodeList({ nodes }: { nodes: SkillNode[] }) {
  const { t } = useTranslation()
  if (nodes.length === 0) {
    return <p className='text-sm text-gray-500'>{t('admin.trees.noNodes')}</p>
  }
  return (
    <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
      {nodes.map((node) => (
        <li key={node.id} className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3'>
          {node.isCompleted ? (
            <span className='w-8 h-8 shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center'>
              <Check className='w-4 h-4' />
            </span>
          ) : (
            <span className='w-8 h-8 shrink-0 rounded-full bg-gray-100 text-xs font-medium text-gray-700 flex items-center justify-center'>
              {node.priorityRank}
            </span>
          )}
          <div className='min-w-0 flex-1'>
            <p className='truncate text-[15px] font-medium text-gray-900'>{node.skill.name}</p>
            <p className='truncate text-xs text-gray-500'>
              {node.skill.category} · {t('admin.skills.level', { n: node.skill.difficultyLevel })}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
              node.isCompleted
                ? 'border-indigo-100 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-gray-100 text-gray-600'
            }`}
          >
            {node.isCompleted ? t('admin.trees.completed') : t('admin.trees.notCompleted')}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function AdminSkillTreesPage() {
  const { t } = useTranslation()
  const { data: response, isLoading, isError, refetch } = useAllSkillTreesQuery()
  const rows = useMemo(() => (response?.data?.data ?? []).map(toRow), [response])

  const [keyword, setKeyword] = useState('')
  const [careerPath, setCareerPath] = useState(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const { mutate: deleteTree, isPending: deleting } = useDeleteSkillTreeMutation()

  const careerPaths = useMemo(
    () => [...new Set(rows.map((r) => r.careerPath))].sort((a, b) => a.localeCompare(b, 'vi')),
    [rows],
  )

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return rows
      .filter((r) => (careerPath === ALL ? true : r.careerPath === careerPath))
      .filter((r) => (kw ? r.userId.toLowerCase().includes(kw) || r.careerPath.toLowerCase().includes(kw) : true))
      .sort((a, b) => (sortDir === 'asc' ? 1 : -1) * compare(a, b, sortKey))
  }, [rows, keyword, careerPath, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const avgProgress = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.completionPercentage, 0) / rows.length)
    : 0

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return
    deleteTree(deleteConfirmId, {
      onSuccess: () => {
        if (expandedId === deleteConfirmId) setExpandedId(null)
        setDeleteConfirmId(null)
      },
    })
  }

  const selectClass =
    'h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-300'

  return (
    <div className='h-full overflow-y-auto [scrollbar-gutter:stable]'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-[28px] font-bold text-gray-900'>{t('admin.trees.title')}</h1>
            <p className='mt-1 text-gray-500 text-[15px]'>{t('admin.trees.desc')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            { label: t('admin.trees.total'), value: rows.length },
            { label: t('admin.trees.careerPaths'), value: careerPaths.length },
            { label: t('admin.trees.avg'), value: `${avgProgress}%` },
          ].map((s) => (
            <div key={s.label} className='rounded-xl border border-gray-200 bg-white p-4'>
              <p className='text-xs text-gray-500'>{s.label}</p>
              <p className='mt-1 text-2xl font-semibold text-gray-900'>
                {isLoading ? <Skeleton width={48} /> : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className='mt-5 flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 h-9 w-full sm:w-72 rounded-lg bg-white border border-gray-200 px-3 text-gray-400 focus-within:border-gray-300'>
            <Search className='w-4 h-4 shrink-0' />
            <input
              type='text'
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setPage(1)
              }}
              placeholder={t('admin.trees.search')}
              className='bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full'
            />
          </div>

          <select
            value={careerPath}
            onChange={(e) => {
              setCareerPath(e.target.value)
              setPage(1)
            }}
            className={selectClass}
          >
            <option value={ALL}>{t('admin.trees.allPaths')}</option>
            {careerPaths.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className='mt-5 bg-white border border-gray-200 rounded-2xl overflow-hidden'>
          {isError && !rows.length ? (
            <div className='p-10 text-center'>
              <p className='text-[15px] font-medium text-gray-900'>{t('admin.trees.loadError')}</p>
              <button
                type='button'
                onClick={() => refetch()}
                className='mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition'
              >
                {t('common.retry')}
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='w-10 px-4 py-3' />
                    {COLUMNS.map((col) => {
                      const active = sortKey === col.key
                      return (
                        <th key={col.key} className='text-left font-medium text-gray-500 px-4 py-3 whitespace-nowrap'>
                          <button
                            type='button'
                            onClick={() => handleSort(col.key)}
                            className={`inline-flex items-center gap-1 hover:text-gray-900 transition ${
                              active ? 'text-gray-900' : ''
                            }`}
                          >
                            {t(col.labelKey)}
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
                    <th className='px-4 py-3 w-12' />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className='border-b border-gray-100 last:border-0'>
                        <td className='px-4 py-3' />
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
                      <td colSpan={TOTAL_COLS} className='px-4 py-12 text-center text-gray-500'>
                        {t('admin.trees.empty')}
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((row) => {
                      const open = expandedId === row.id
                      return (
                        <Fragment key={row.id}>
                          <tr
                            onClick={() => setExpandedId(open ? null : row.id)}
                            className='border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer'
                          >
                            <td className='px-4 py-3'>
                              <button
                                type='button'
                                aria-expanded={open}
                                aria-label={open ? t('admin.trees.hideNodes') : t('admin.trees.showNodes')}
                                className='w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors'
                              >
                                <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
                              </button>
                            </td>
                            <td className='px-4 py-3 font-mono text-xs text-gray-600' title={row.userId}>
                              {shortId(row.userId)}
                            </td>
                            <td className='px-4 py-3 font-medium text-gray-900'>{row.careerPath}</td>
                            <td className='px-4 py-3'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className='w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden'
                                  role='progressbar'
                                  aria-valuenow={row.completionPercentage}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                >
                                  <div
                                    className='h-full rounded-full bg-indigo-600'
                                    style={{ width: `${row.completionPercentage}%` }}
                                  />
                                </div>
                                <span className='text-gray-600 tabular-nums'>{row.completionPercentage}%</span>
                              </div>
                            </td>
                            <td className='px-4 py-3 text-gray-600 tabular-nums'>{row.nodeCount}</td>
                            <td className='px-4 py-3 text-gray-500 whitespace-nowrap'>
                              {formatDate(row.lastAnalyzedAt)}
                            </td>
                            <td className='px-4 py-3 text-gray-500 whitespace-nowrap'>{formatDate(row.createdAt)}</td>
                            <td className='px-4 py-3 text-right'>
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteConfirmId(row.id)
                                }}
                                aria-label={t('admin.trees.deleteAria', { id: row.userId })}
                                className='p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </td>
                          </tr>
                          {open && (
                            <tr className='border-b border-gray-100 last:border-0 bg-gray-50'>
                              <td colSpan={TOTAL_COLS} className='px-6 py-4'>
                                <RootNodeList nodes={row.rootNodes} />
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filtered.length > 0 && (
            <div className='flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 text-sm text-gray-500'>
              <span>
                {t('common.range', {
                  from: (currentPage - 1) * PAGE_SIZE + 1,
                  to: Math.min(currentPage * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                })}
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label={t('common.previousPage')}
                  className='p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                <span className='tabular-nums'>
                  {currentPage} / {totalPages}
                </span>
                <button
                  type='button'
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label={t('common.nextPage')}
                  className='p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-gray-900/30 backdrop-blur-xs'
            onClick={() => !deleting && setDeleteConfirmId(null)}
            aria-hidden='true'
          />
          <div role='dialog' aria-modal='true' className='relative w-full max-w-sm rounded-2xl bg-white shadow-xl'>
            <div className='px-6 py-4'>
              <h3 className='text-[17px] font-semibold text-gray-900'>{t('admin.trees.deleteTitle')}</h3>
              <p className='mt-2 text-sm text-gray-500'>{t('admin.trees.deleteDesc')}</p>
            </div>
            <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100'>
              <button
                type='button'
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className='rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
              >
                {t('common.cancel')}
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                disabled={deleting}
                className='inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-60 transition'
              >
                {deleting && <Loader2 className='w-4 h-4 animate-spin' />}
                {deleting ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
