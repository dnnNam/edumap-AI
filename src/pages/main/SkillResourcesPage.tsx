import { ArrowLeft, BookOpen, ExternalLink, FlaskConical, PlayCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useNavigate, useParams } from 'react-router'
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from '../../components/motion/MotionWrapper'
import ResourceCard from '../../components/resources/ResourceCard'
import { useGroupedSkillResourcesQuery } from '../../hooks/skillResourceQuery'
import type { SkillResource } from '../../types/api/skillResource.types'
import { getFaviconUrl } from '../../utils/skillResource'

const EXTERNAL_LABEL: Record<string, string> = {
  youtube: 'YouTube',
  github: 'GitHub',
  devTo: 'Dev.to',
  coursera: 'Coursera',
  udemy: 'Udemy',
}

function Section({
  icon,
  title,
  items,
  skillName,
}: {
  icon: ReactNode
  title: string
  items: SkillResource[]
  skillName: string
}) {
  // Nhóm trống thì không hiển thị
  if (items.length === 0) return null

  return (
    <section className='mt-10'>
      <MotionFadeIn className='flex items-center gap-2.5'>
        <span className='w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-indigo-600'>
          {icon}
        </span>
        <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
        <span className='text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5'>
          {items.length}
        </span>
      </MotionFadeIn>

      <MotionStaggerContainer className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {items.map((r) => (
          <MotionStaggerItem key={r.id}>
            <ResourceCard resource={r} skillName={skillName} />
          </MotionStaggerItem>
        ))}
      </MotionStaggerContainer>
    </section>
  )
}

export default function SkillResourcesPage() {
  const { skillId } = useParams<{ skillId: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError, isFetching, refetch } = useGroupedSkillResourcesQuery(skillId)
  // axios: data.data = body { success, statusCode, data }; body.data = GroupedSkillResources
  const grouped = data?.data?.data

  const groups = grouped?.data
  const skillName = grouped?.skillName ?? ''
  const total = grouped?.summary.total ?? 0
  const externalLinks = Object.entries(grouped?.externalSearchLinks ?? {})

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Quay lại
        </button>

        <h1 className='text-3xl font-semibold text-gray-900'>
          {skillName ? `Tài nguyên học ${skillName}` : 'Tài nguyên học'}
        </h1>
        <p className='mt-2 text-gray-500'>
          {isLoading
            ? 'Đang tìm tài nguyên cho kỹ năng này, có thể mất vài giây...'
            : isError
              ? ''
              : `${total} tài nguyên, được chia theo video, tài liệu và thực hành.`}
        </p>

        {isLoading ? (
          <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={320} borderRadius={16} />
            ))}
          </div>
        ) : isError || !grouped || !groups ? (
          <div className='mt-8 bg-white border border-gray-200 rounded-2xl p-10 text-center'>
            <p className='text-[15px] font-medium text-gray-900'>Không tải được tài nguyên của kỹ năng này.</p>
            <button
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
              className='mt-5 rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
            >
              {isFetching ? 'Đang tải...' : 'Thử lại'}
            </button>
          </div>
        ) : (
          <>
            {total === 0 && (
              <p className='mt-10 py-10 text-center text-sm text-gray-500'>
                Chưa có tài nguyên nào cho kỹ năng này. Bạn thử các link tìm kiếm bên dưới.
              </p>
            )}

            <Section
              icon={<PlayCircle className='w-4 h-4' />}
              title='Video'
              items={groups.videos}
              skillName={skillName}
            />
            <Section
              icon={<BookOpen className='w-4 h-4' />}
              title='Tài liệu & bài viết'
              items={groups.documentations}
              skillName={skillName}
            />
            <Section
              icon={<FlaskConical className='w-4 h-4' />}
              title='Thực hành'
              items={groups.practices}
              skillName={skillName}
            />

            {externalLinks.length > 0 && (
              <MotionFadeIn className='mt-12 rounded-2xl border border-gray-200 bg-white p-6'>
                <h2 className='text-[15px] font-semibold text-gray-900'>Tìm thêm ở nơi khác</h2>
                <p className='mt-1 text-sm text-gray-500'>Mở kết quả tìm kiếm {skillName} trên các nền tảng.</p>
                <div className='mt-4 flex flex-wrap gap-2.5'>
                  {externalLinks.map(([key, url]) => {
                    const favicon = getFaviconUrl(url)
                    return (
                      <a
                        key={key}
                        href={url}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100 px-3.5 py-2 text-sm font-medium text-gray-800 transition-colors'
                      >
                        {favicon && <img src={favicon} alt='' width={16} height={16} className='w-4 h-4 rounded-sm' />}
                        {EXTERNAL_LABEL[key] ?? key}
                        <ExternalLink className='w-3.5 h-3.5 text-gray-400' />
                      </a>
                    )
                  })}
                </div>
              </MotionFadeIn>
            )}
          </>
        )}
      </div>
    </div>
  )
}
