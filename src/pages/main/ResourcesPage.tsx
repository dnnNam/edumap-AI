import { BookOpen, ExternalLink, FlaskConical, Newspaper, Play, PlayCircle, Search, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { MotionStaggerContainer, MotionStaggerItem } from '../../components/motion/MotionWrapper'
import { useTopSkillResourcesQuery } from '../../hooks/skillResourceQuery'
import type { SkillResource } from '../../types/api/skillResource.types'
import {
  cleanTitle,
  getFaviconUrl,
  getPlatform,
  getPriceLabel,
  getResourceTypeLabel,
  getYouTubeThumbnail,
} from '../../utils/skillResource'

const LIMIT = 50
const ALL = 'All'
type PriceFilter = 'All' | 'Free' | 'Paid'
const PRICE_OPTIONS: PriceFilter[] = ['All', 'Free', 'Paid']

// Icon + gradient theo loại tài nguyên (viết đầy đủ class để Tailwind nhận diện)
const TYPE_STYLE: Record<string, { icon: typeof BookOpen; gradient: string }> = {
  DOCUMENTATION: { icon: BookOpen, gradient: 'from-sky-100 via-indigo-100 to-indigo-200 text-indigo-500' },
  INTERACTIVE_LAB: { icon: FlaskConical, gradient: 'from-emerald-100 via-teal-100 to-teal-200 text-teal-600' },
  VIDEO_COURSE: { icon: PlayCircle, gradient: 'from-rose-100 via-red-100 to-orange-200 text-red-500' },
  ARTICLE: { icon: Newspaper, gradient: 'from-amber-100 via-orange-100 to-orange-200 text-orange-500' },
}
const DEFAULT_STYLE = { icon: BookOpen, gradient: 'from-gray-100 via-gray-100 to-gray-200 text-gray-400' }

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

function ResourceThumbnail({ resource }: { resource: SkillResource }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [faviconFailed, setFaviconFailed] = useState(false)

  const platform = getPlatform(resource.url)
  const thumbnail = getYouTubeThumbnail(resource.url)
  const favicon = getFaviconUrl(resource.url)
  const { icon: Icon, gradient } = TYPE_STYLE[resource.resourceType] ?? DEFAULT_STYLE
  const hasImage = !!thumbnail && !imgFailed

  return (
    <div className='relative h-40 overflow-hidden bg-gray-100'>
      {hasImage ? (
        <>
          <img
            src={thumbnail}
            alt={cleanTitle(resource.title)}
            loading='lazy'
            onError={() => setImgFailed(true)}
            className='absolute inset-0 w-full h-full object-cover'
          />
          {/* Nút play ở giữa ảnh video */}
          <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
            <span className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-sm'>
              <Play className='w-5 h-5 text-gray-900 fill-gray-900 ml-0.5' />
            </span>
          </div>
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className='w-16 h-16 opacity-70' strokeWidth={1.25} />
        </div>
      )}

      {/* Nhãn nền tảng (góc trái) */}
      <span className='absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm'>
        {favicon && !faviconFailed && (
          <img
            src={favicon}
            alt=''
            width={14}
            height={14}
            onError={() => setFaviconFailed(true)}
            className='w-3.5 h-3.5 rounded-sm'
          />
        )}
        {platform}
      </span>

      {/* Giá (góc phải) */}
      <span className='absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm'>
        {getPriceLabel(resource.cost)}
      </span>

      {/* Thời lượng (góc phải dưới) */}
      <span className='absolute bottom-3 right-3 rounded-md bg-gray-900/75 px-2 py-0.5 text-xs font-medium text-white'>
        {resource.durationHours}h
      </span>
    </div>
  )
}

function ResourceCard({ resource }: { resource: SkillResource }) {
  return (
    <a
      href={resource.url}
      target='_blank'
      rel='noreferrer'
      className='group h-full flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-md hover:border-gray-300'
    >
      <ResourceThumbnail resource={resource} />

      <div className='flex-1 flex flex-col p-5'>
        <h3 className='font-medium text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors'>
          {cleanTitle(resource.title)}
        </h3>
        <p className='mt-2 text-sm text-gray-500'>
          {resource.skill.name} · {resource.durationHours}h · {getResourceTypeLabel(resource.resourceType)}
        </p>

        <div className='mt-auto pt-4'>
          <div className='pt-4 border-t border-gray-100 flex items-center justify-between'>
            <span className='flex items-center gap-1.5 text-sm font-medium text-gray-900'>
              <Star className='w-4 h-4 fill-gray-900 text-gray-900' />
              {resource.rating.toFixed(1)}
            </span>
            <ExternalLink className='w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors' />
          </div>
        </div>
      </div>
    </a>
  )
}

export default function ResourcesPage() {
  const { data, isLoading, isError } = useTopSkillResourcesQuery(LIMIT)
  const resources = useMemo(() => data?.data?.data ?? [], [data])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)
  const [platform, setPlatform] = useState(ALL)
  const [price, setPrice] = useState<PriceFilter>('All')

  // Chip lấy từ dữ liệu thật thay vì hard-code
  const categories = useMemo(() => [ALL, ...Array.from(new Set(resources.map((r) => r.skill.category)))], [resources])
  const platforms = useMemo(() => [ALL, ...Array.from(new Set(resources.map((r) => getPlatform(r.url))))], [resources])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return resources.filter((r) => {
      if (keyword && !`${r.title} ${r.skill.name}`.toLowerCase().includes(keyword)) return false
      if (category !== ALL && r.skill.category !== category) return false
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

        {/* Bộ lọc */}
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

        {/* Danh sách */}
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
