import { BookOpen, ExternalLink, FlaskConical, Newspaper, Play, PlayCircle, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { SkillResource } from '../../types/api/skillResource.types'
import { useRecordResourceHistoryMutation } from '../../hooks/skillResourceQuery'
import {
  cleanTitle,
  getFaviconUrl,
  getPlatform,
  getPriceLabel,
  getResourceTypeLabel,
  getYouTubeThumbnail,
} from '../../utils/skillResource'

const TYPE_STYLE: Record<string, { icon: typeof BookOpen; gradient: string }> = {
  DOCUMENTATION: { icon: BookOpen, gradient: 'from-sky-100 via-indigo-100 to-indigo-200 text-indigo-500' },
  INTERACTIVE_LAB: { icon: FlaskConical, gradient: 'from-emerald-100 via-teal-100 to-teal-200 text-teal-600' },
  VIDEO_COURSE: { icon: PlayCircle, gradient: 'from-rose-100 via-red-100 to-orange-200 text-red-500' },
  ARTICLE: { icon: Newspaper, gradient: 'from-amber-100 via-orange-100 to-orange-200 text-orange-500' },
}
const DEFAULT_STYLE = { icon: BookOpen, gradient: 'from-gray-100 via-gray-100 to-gray-200 text-gray-400' }

function ResourceThumbnail({ resource }: { resource: SkillResource }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [faviconFailed, setFaviconFailed] = useState(false)

  const platform = getPlatform(resource.url)
  const thumbnail = getYouTubeThumbnail(resource.url)
  const favicon = getFaviconUrl(resource.url)
  const { icon: Icon, gradient } = TYPE_STYLE[resource.resourceType] ?? DEFAULT_STYLE
  const hasImage = !!thumbnail && !imgFailed

  return (
    <div className='relative h-40 overflow-hidden bg-gray-100 dark:bg-[#232227]'>
      {hasImage ? (
        <>
          <img
            src={thumbnail}
            alt={cleanTitle(resource.title)}
            loading='lazy'
            onError={() => setImgFailed(true)}
            className='absolute inset-0 w-full h-full object-cover'
          />
          <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
            <span className='w-12 h-12 rounded-full bg-white/90 dark:bg-[#1A191C]/90 flex items-center justify-center shadow-sm'>
              <Play className='w-5 h-5 text-gray-900 dark:text-[#ECE9E4] fill-gray-900 dark:fill-[#ECE9E4] ml-0.5' />
            </span>
          </div>
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className='w-16 h-16 opacity-70' strokeWidth={1.25} />
        </div>
      )}

      <span className='absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-[#1A191C]/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-[#ECE9E4] shadow-sm'>
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

      <span className='absolute top-3 right-3 rounded-full bg-white/90 dark:bg-[#1A191C]/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-[#ECE9E4] shadow-sm'>
        {getPriceLabel(resource.cost)}
      </span>

      <span className='absolute bottom-3 right-3 rounded-md bg-gray-900/75 dark:bg-black/75 px-2 py-0.5 text-xs font-medium text-white'>
        {resource.durationHours}h
      </span>
    </div>
  )
}

export default function ResourceCard({ resource, skillName }: { resource: SkillResource; skillName?: string }) {
  const name = resource.skill?.name ?? skillName
  const navigate = useNavigate()
  const { mutate: recordHistory } = useRecordResourceHistoryMutation()

  const handleCardClick = () => {
    navigate(`/resources/detail/${resource.id}`)
  }

  // Mở thẳng tài nguyên từ card: ghi history + mở tab mới, không điều hướng sang trang detail
  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    recordHistory(resource.id)
    window.open(resource.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleCardClick}
      className='group h-full flex flex-col rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] overflow-hidden transition hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 cursor-pointer'
    >
      <ResourceThumbnail resource={resource} />

      <div className='flex-1 flex flex-col p-5'>
        <h3 className='font-medium text-gray-900 dark:text-[#ECE9E4] line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 dark:group-hover:text-[#A99DFF] transition-colors'>
          {cleanTitle(resource.title)}
        </h3>
        <p className='mt-2 text-sm text-gray-500 dark:text-[#A29FA8]'>
          {[name, `${resource.durationHours}h`, getResourceTypeLabel(resource.resourceType)]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <div className='mt-auto pt-4'>
          <div className='pt-4 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between'>
            <span className='flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-[#ECE9E4]'>
              <Star className='w-4 h-4 fill-amber-400 text-amber-400' />
              {resource.rating.toFixed(1)}
            </span>
            <button
              type='button'
              aria-label='Mở tài nguyên'
              onClick={handleOpenClick}
              className='p-2 -m-2 rounded-lg text-gray-400 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] transition-colors cursor-pointer'
            >
              <ExternalLink className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
