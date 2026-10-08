import { ArrowLeft, ExternalLink, Star } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useRecordResourceHistoryMutation, useSkillResourceByIdQuery } from '../../hooks/skillResourceQuery'
import { cleanTitle, getPlatform, getResourceTypeLabel } from '../../utils/skillResource'

export default function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useSkillResourceByIdQuery(resourceId)
  const { mutate: recordHistory } = useRecordResourceHistoryMutation()

  // axios: data.data = body { success, statusCode, data }; body.data = SkillResource
  const resource = data?.data?.data

  if (isLoading) return <div className='p-8 text-center'>Đang tải...</div>

  if (isError || !resource) {
    return (
      <div className='p-8 text-center'>
        <p className='text-red-500 mb-4'>Không tìm thấy tài nguyên</p>
        <button onClick={() => navigate(-1)} className='text-indigo-600 hover:text-indigo-700'>
          Quay lại
        </button>
      </div>
    )
  }

  // Ghi lịch sử khi người dùng thực sự mở tài nguyên (link vẫn mở bình thường bằng thẻ <a>)
  const handleOpenResource = () => {
    recordHistory(resource.id)
  }

  return (
    <div className='h-full overflow-y-auto'>
      <div className='max-w-4xl mx-auto px-6 py-8 pb-16'>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className='mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-[#A99DFF] dark:hover:text-[#BFAFFF] cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
          Quay lại
        </button>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-[#ECE9E4] mb-4'>{cleanTitle(resource.title)}</h1>

          <div className='flex flex-wrap items-center gap-6 text-gray-600 dark:text-[#A29FA8]'>
            <div className='flex items-center gap-2'>
              <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
              <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{resource.rating.toFixed(1)}</span>
            </div>
            <span className='px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#ECE9E4] rounded-full text-sm font-medium'>
              {getResourceTypeLabel(resource.resourceType)}
            </span>
            <span className='px-3 py-1 bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium'>
              {getPlatform(resource.url)}
            </span>
            <span className='text-sm'>⏱️ {resource.durationHours}h</span>
          </div>
        </div>

        {/* Main content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left: Details */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-white dark:bg-[#1A191C] rounded-2xl border border-gray-200 dark:border-white/[0.08] p-6'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-[#ECE9E4] mb-4'>Thông tin</h2>
              <dl className='space-y-4'>
                <div>
                  <dt className='text-sm text-gray-500 dark:text-[#A29FA8] mb-1'>Loại</dt>
                  <dd className='text-gray-900 dark:text-[#ECE9E4]'>{getResourceTypeLabel(resource.resourceType)}</dd>
                </div>
                <div>
                  <dt className='text-sm text-gray-500 dark:text-[#A29FA8] mb-1'>Nền tảng</dt>
                  <dd className='text-gray-900 dark:text-[#ECE9E4]'>{getPlatform(resource.url)}</dd>
                </div>
                <div>
                  <dt className='text-sm text-gray-500 dark:text-[#A29FA8] mb-1'>Thời lượng</dt>
                  <dd className='text-gray-900 dark:text-[#ECE9E4]'>{resource.durationHours} giờ</dd>
                </div>
                <div>
                  <dt className='text-sm text-gray-500 dark:text-[#A29FA8] mb-1'>Giá</dt>
                  <dd className='text-gray-900 dark:text-[#ECE9E4] font-medium'>
                    {resource.cost === 0 ? '🎉 Miễn phí' : `$${resource.cost}`}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm text-gray-500 dark:text-[#A29FA8] mb-1'>Đánh giá</dt>
                  <dd className='text-gray-900 dark:text-[#ECE9E4]'>
                    <div className='flex items-center gap-2'>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(resource.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{resource.rating.toFixed(1)}/5</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: CTA */}
          <div className='lg:col-span-1'>
            <div className='sticky top-6 bg-white dark:bg-[#1A191C] rounded-2xl border border-gray-200 dark:border-white/[0.08] p-6'>
              <a
                href={resource.url}
                target='_blank'
                rel='noopener noreferrer'
                onClick={handleOpenResource}
                className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#5F2CFF] dark:hover:bg-[#4B1FD6] text-white font-medium py-3 px-4 rounded-xl transition cursor-pointer'
              >
                <ExternalLink className='w-5 h-5' />
                Truy cập tài nguyên
              </a>

              <div className='mt-6 pt-6 border-t border-gray-200 dark:border-white/[0.08] space-y-3 text-sm'>
                <div>
                  <p className='text-gray-500 dark:text-[#A29FA8] mb-1'>URL</p>
                  <a
                    href={resource.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={handleOpenResource}
                    className='text-indigo-600 dark:text-[#A99DFF] hover:underline break-all'
                  >
                    {resource.url}
                  </a>
                </div>

                {resource.skill && (
                  <div>
                    <p className='text-gray-500 dark:text-[#A29FA8] mb-1'>Kỹ năng</p>
                    <p className='text-gray-900 dark:text-[#ECE9E4] font-medium'>{resource.skill.name}</p>
                    <p className='text-gray-500 dark:text-[#A29FA8] text-xs'>{resource.skill.category}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
