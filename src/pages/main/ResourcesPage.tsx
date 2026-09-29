import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { MotionStaggerContainer, MotionStaggerItem } from '../../components/motion/MotionWrapper'
import ResourceCard from '../../components/resources/ResourceCard'
import { useTopSkillResourcesQuery } from '../../hooks/skillResourceQuery'
import { getPlatform } from '../../utils/skillResource'

const LIMIT = 50
const ALL = 'All'
type PriceFilter = 'All' | 'Free' | 'Paid'
const PRICE_OPTIONS: PriceFilter[] = ['All', 'Free', 'Paid']

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )
}

function TextChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

export default function ResourcesPage() {
  const { data, isLoading, isError } = useTopSkillResourcesQuery(LIMIT)
  const resources = useMemo(() => data?.data?.data ?? [], [data])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)
  const [platform, setPlatform] = useState(ALL)
  const [price, setPrice] = useState<PriceFilter>('All')

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(resources.map((r) => r.skill?.category).filter(Boolean) as string[]))],
    [resources],
  )
  const platforms = useMemo(() => [ALL, ...Array.from(new Set(resources.map((r) => getPlatform(r.url))))], [resources])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return resources.filter((r) => {
      if (keyword && !`${r.title} ${r.skill?.name ?? ''}`.toLowerCase().includes(keyword)) return false
      if (category !== ALL && r.skill?.category !== category) return false
      if (platform !== ALL && getPlatform(r.url) !== platform) return false
      if (price === 'Free' && r.cost !== 0) return false
      if (price === 'Paid' && r.cost === 0) return false
      return true
    })
  }, [resources, search, category, platform, price])

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        <h1 className='text-3xl font-semibold text-gray-900'>Learning Resources</h1>
        <p className='mt-2 text-gray-500'>
          {isLoading ? 'Đang tải...' : `${resources.length} tài nguyên được đánh giá cao nhất cho lộ trình của bạn.`}
        </p>

        <div className='mt-8 rounded-3xl border border-gray-200 bg-white p-6 space-y-4'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
              placeholder={`Search ${resources.length || ''} resources...`}
              className='w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
            />
          </div>

          <div className='flex flex-wrap gap-2'>
            {categories.map((c) => (
              <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>

          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex flex-wrap gap-1'>
              {platforms.map((p) => (
                <TextChip key={p} label={p} active={platform === p} onClick={() => setPlatform(p)} />
              ))}
            </div>
            <div className='flex gap-1'>
              {PRICE_OPTIONS.map((p) => (
                <TextChip key={p} label={p} active={price === p} onClick={() => setPrice(p)} />
              ))}
            </div>
          </div>
        </div>

        <div className='mt-6'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={320} borderRadius={16} />
              ))}
            </div>
          ) : isError ? (
            <p className='py-16 text-center text-sm text-gray-500'>Không tải được danh sách tài nguyên.</p>
          ) : filtered.length === 0 ? (
            <p className='py-16 text-center text-sm text-gray-500'>Không có tài nguyên nào phù hợp bộ lọc.</p>
          ) : (
            <MotionStaggerContainer
              key={`${search}|${category}|${platform}|${price}`}
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            >
              {filtered.map((r) => (
                <MotionStaggerItem key={r.id}>
                  <ResourceCard resource={r} />
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
          )}
        </div>
      </div>
    </div>
  )
}
