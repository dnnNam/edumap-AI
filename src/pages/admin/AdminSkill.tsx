import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { useAllSkillsQuery, useDeleteSkillMutation } from '../../hooks/skillsQuery'
import SkillFormModal from '../../components/layouts/admin/SkillFormModal'
import type { Skill } from '../../types/api/skills.type'

const PAGE_SIZE = 20
const ALL = '__ALL__'

type SortKey = 'name' | 'category' | 'difficultyLevel' | 'demandScore' | 'createdAt'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'name', label: 'Skill' },
  { key: 'category', label: 'Category' },
  { key: 'difficultyLevel', label: 'Difficulty' },
  { key: 'demandScore', label: 'Demand' },
  { key: 'createdAt', label: 'Created' },
]

const DIFFICULTY_STYLE: Record<number, string> = {
  1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  2: 'bg-sky-50 text-sky-700 border-sky-200',
  3: 'bg-amber-50 text-amber-700 border-amber-200',
  4: 'bg-orange-50 text-orange-700 border-orange-200',
  5: 'bg-red-50 text-red-700 border-red-200',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function compare(a: Skill, b: Skill, key: SortKey) {
  const va = a[key]
  const vb = b[key]
  if (typeof va === 'number' && typeof vb === 'number') return va - vb
  return String(va).localeCompare(String(vb), 'vi')
}

export default function AdminSkillsPage() {
  const { data: response, isLoading, isError, isFetching, refetch } = useAllSkillsQuery()
  const skills = useMemo(() => response?.data?.data ?? [], [response])

  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState(ALL)
  const [difficulty, setDifficulty] = useState(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const { mutate: deleteSkill, isPending: deleting } = useDeleteSkillMutation()

  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))].sort((a, b) => a.localeCompare(b, 'vi')),
    [skills],
  )

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return skills
      .filter((s) => (category === ALL ? true : s.category === category))
      .filter((s) => (difficulty === ALL ? true : s.difficultyLevel === Number(difficulty)))
      .filter((s) => (kw ? s.name.toLowerCase().includes(kw) || s.category.toLowerCase().includes(kw) : true))
      .sort((a, b) => (sortDir === 'asc' ? 1 : -1) * compare(a, b, sortKey))
  }, [skills, keyword, category, difficulty, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const selectClass =
    'h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-300'

  return (
    <div className='h-full overflow-y-auto [scrollbar-gutter:stable]'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-[28px] font-bold text-gray-900'>Skills</h1>
            <p className='mt-1 text-gray-500 text-[15px]'>All skills in the system, managed by admin.</p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
              className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type='button'
              onClick={() => {
                setEditingSkill(null)
                setFormOpen(true)
              }}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition'
            >
              <Plus className='w-4 h-4' />
              Add skill
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            { label: 'Total skills', value: skills.length },
            { label: 'Categories', value: categories.length },
            { label: 'Matching filters', value: filtered.length },
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
              placeholder='Search by name or category...'
              className='bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full'
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className={selectClass}
          >
            <option value={ALL}>All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value)
              setPage(1)
            }}
            className={selectClass}
          >
            <option value={ALL}>All levels</option>
            {[1, 2, 3, 4, 5].map((l) => (
              <option key={l} value={l}>
                Level {l}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className='mt-5 bg-white border border-gray-200 rounded-2xl overflow-hidden'>
          {isError && !skills.length ? (
            <div className='p-10 text-center'>
              <p className='text-[15px] font-medium text-gray-900'>Couldn't load skills.</p>
              <button
                type='button'
                onClick={() => refetch()}
                className='mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition'
              >
                Try again
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
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
                    <th className='px-4 py-3 w-12' />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className='border-b border-gray-100 last:border-0'>
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
                      <td colSpan={COLUMNS.length + 1} className='px-4 py-12 text-center text-gray-500'>
                        No skills match your filters.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((skill) => (
                      <tr
                        key={skill.id}
                        className='border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors'
                      >
                        <td className='px-4 py-3 font-medium text-gray-900'>{skill.name}</td>
                        <td className='px-4 py-3 text-gray-600'>{skill.category}</td>
                        <td className='px-4 py-3'>
                          <span
                            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
                              DIFFICULTY_STYLE[skill.difficultyLevel] ?? 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                          >
                            Level {skill.difficultyLevel}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                          <div className='flex items-center gap-2'>
                            <div className='w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden'>
                              <div
                                className='h-full bg-indigo-600 rounded-full'
                                style={{ width: `${Math.min(100, (skill.demandScore / 10) * 100)}%` }}
                              />
                            </div>
                            <span className='text-gray-600 tabular-nums'>{skill.demandScore}</span>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-gray-500 whitespace-nowrap'>{formatDate(skill.createdAt)}</td>
                        <td className='px-4 py-3 text-right'>
                          <div className='flex items-center gap-1'>
                            <button
                              type='button'
                              onClick={() => {
                                setEditingSkill(skill)
                                setFormOpen(true)
                              }}
                              aria-label={`Edit ${skill.name}`}
                              className='p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition'
                            >
                              <Pencil className='w-4 h-4' />
                            </button>
                            <button
                              type='button'
                              onClick={() => setDeleteConfirmId(skill.id)}
                              aria-label={`Delete ${skill.name}`}
                              className='p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition'
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
            <div className='flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 text-sm text-gray-500'>
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
                  aria-label='Next page'
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
              <h3 className='text-[17px] font-semibold text-gray-900'>Delete skill?</h3>
              <p className='mt-2 text-sm text-gray-500'>This action cannot be undone.</p>
            </div>
            <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100'>
              <button
                type='button'
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className='rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  deleteSkill(deleteConfirmId, {
                    onSuccess: () => setDeleteConfirmId(null),
                  })
                }}
                disabled={deleting}
                className='inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-60 transition'
              >
                {deleting && <Loader2 className='w-4 h-4 animate-spin' />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SkillFormModal open={formOpen} onClose={() => setFormOpen(false)} skill={editingSkill} />
    </div>
  )
}
