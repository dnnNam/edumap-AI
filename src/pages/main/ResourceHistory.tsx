import { useTranslation } from 'react-i18next'
import { getLocale } from '../../utils/locale'
import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from '../../components/motion/MotionWrapper'
import ResourceCard from '../../components/resources/ResourceCard'
import { useResourceHistoryQuery } from '../../hooks/skillResourceQuery'
import { cleanTitle, getPlatform, getResourceTypeLabel } from '../../utils/skillResource'

const LIMIT = 50

export default function ResourceHistoryPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useResourceHistoryQuery(LIMIT)
  const history = useMemo(() => data?.data?.data ?? [], [data])

  const [viewType, setViewType] = useState<'list' | 'card'>('list')

  if (isLoading) {
    return (
      <div className='h-full overflow-y-auto scrollbar-thin'>
        <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
          <div className='mb-6'>
            <h1 className='text-3xl font-semibold text-gray-900'>{t('resources.history.title')}</h1>
            <p className='mt-2 text-gray-500'>{t('common.loading')}</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={320} borderRadius={16} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='h-full overflow-y-auto scrollbar-thin'>
        <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
          <div className='mb-6'>
            <h1 className='text-3xl font-semibold text-gray-900'>{t('resources.history.title')}</h1>
          </div>
          <div className='bg-white border border-gray-200 rounded-2xl p-10 text-center'>
            <p className='text-[15px] font-medium text-gray-900 mb-4'>{t('resources.history.loadError')}</p>
            <button
              type='button'
              onClick={() => refetch()}
              className='rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition'
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        {/* Header */}
        <MotionFadeIn className='mb-8'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                {t('resources.history.title')}
              </h1>
              <p className='mt-2 text-gray-500 dark:text-[#A29FA8]'>
                {history.length === 0
                  ? t('resources.history.none')
                  : t('resources.history.count', { count: history.length })}
              </p>
            </div>

            {/* View type toggle */}
            <div className='flex gap-2 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-1'>
              <button
                type='button'
                onClick={() => setViewType('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  viewType === 'list'
                    ? 'bg-indigo-100 dark:bg-[#5F2CFF]/20 text-indigo-600 dark:text-[#A99DFF]'
                    : 'text-gray-600 dark:text-[#A29FA8] hover:bg-gray-50 dark:hover:bg-[#232227]'
                }`}
              >
                {t('resources.history.viewList')}
              </button>
              <button
                type='button'
                onClick={() => setViewType('card')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  viewType === 'card'
                    ? 'bg-indigo-100 dark:bg-[#5F2CFF]/20 text-indigo-600 dark:text-[#A99DFF]'
                    : 'text-gray-600 dark:text-[#A29FA8] hover:bg-gray-50 dark:hover:bg-[#232227]'
                }`}
              >
                {t('resources.history.viewCard')}
              </button>
            </div>
          </div>
        </MotionFadeIn>

        {history.length === 0 ? (
          <MotionFadeIn className='text-center py-16'>
            <p className='text-gray-500 dark:text-[#A29FA8]'>{t('resources.history.emptyBody')}</p>
          </MotionFadeIn>
        ) : viewType === 'card' ? (
          // View card
          <MotionStaggerContainer className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {history.map((item) => (
              <MotionStaggerItem key={item.id}>
                <ResourceCard resource={item.skillResource} />
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        ) : (
          // View list - table
          <MotionFadeIn>
            <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#232227]'>
                      <th className='text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {t('resources.history.cols.resource')}
                      </th>
                      <th className='text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {t('resources.history.cols.skill')}
                      </th>
                      <th className='text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {t('resources.history.cols.type')}
                      </th>
                      <th className='text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {t('resources.history.cols.platform')}
                      </th>
                      <th className='text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {t('resources.history.cols.viewedAt')}
                      </th>
                      <th className='text-center px-6 py-4 text-sm font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {t('resources.history.cols.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-100 dark:border-white/[0.04] hover:bg-gray-50 dark:hover:bg-[#232227] transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-[#1A191C]' : 'bg-gray-50/50 dark:bg-[#1A191C]/60'
                        }`}
                      >
                        <td className='px-6 py-4 text-sm text-gray-900 dark:text-[#ECE9E4] font-medium max-w-xs truncate'>
                          <a
                            href={item.skillResource.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-600 dark:text-[#A99DFF] hover:underline line-clamp-2'
                          >
                            {cleanTitle(item.skillResource.title)}
                          </a>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-[#A29FA8]'>
                          {item.skillResource.skill?.name ?? '—'}
                        </td>
                        <td className='px-6 py-4 text-sm'>
                          <span className='inline-block rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2.5 py-1 text-xs font-medium'>
                            {getResourceTypeLabel(item.skillResource.resourceType)}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-[#A29FA8]'>
                          {getPlatform(item.skillResource.url)}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-[#A29FA8]'>
                          {new Date(item.viewedAt).toLocaleString(getLocale())}
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <a
                            href={item.skillResource.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={t('resources.open')}
                            className='inline-block p-2 -m-2 rounded-lg text-gray-400 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] transition-colors'
                          >
                            <ExternalLink className='w-4 h-4' />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </MotionFadeIn>
        )}
      </div>
    </div>
  )
}
