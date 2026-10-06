import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { AlertCircle, CheckCircle2, MapPin, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router'
import RecommendationResult from '../../components/layouts/jobs/RecommendationResult'
import { useCheckJobProfileQuery, useJobRecommendationsMutation } from '../../hooks/jobQuery'
import { DEFAULT_LOCATION, jobRecommendationSchema, type JobRecommendationFormValues } from '../../schemas/job.schema'

const QUICK_LOCATIONS = ['HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Remote']

export default function JobAnalysisPage() {
  const { mutate, data, isPending, isError, error, reset: resetMutation } = useJobRecommendationsMutation()

  const profileQuery = useCheckJobProfileQuery()
  const profile = profileQuery.data?.data?.data
  const canAnalyze = profile?.success === true
  const profileError = isAxiosError(profileQuery.error) ? profileQuery.error.response?.data?.message : undefined

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobRecommendationFormValues>({
    resolver: zodResolver(jobRecommendationSchema),
    defaultValues: { location: '' },
  })

  const currentLocation = watch('location')

  const onSubmit = handleSubmit(({ location }) => {
    if (!canAnalyze) return
    // Không nhập -> mặc định HCM
    mutate({ location: location || DEFAULT_LOCATION })
  })

  const result = data?.data?.data // axios .data -> body ngoài -> .data -> RecommendationBody
  const errorMessage = isAxiosError(error) ? error.response?.data?.message : undefined

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        <h1 className='text-3xl font-semibold text-gray-900'>Job Analysis</h1>
        <p className='mt-2 text-gray-500'>Phân tích thị trường và gợi ý việc làm dựa trên kỹ năng và dự án của bạn.</p>

        {/* Trạng thái hồ sơ kỹ năng */}
        <div className='mt-6'>
          {profileQuery.isLoading ? (
            <Skeleton height={56} borderRadius={16} />
          ) : canAnalyze && profile ? (
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800'>
              <CheckCircle2 className='w-4 h-4 shrink-0' />
              <span>
                Hướng nghề nghiệp: <strong className='font-medium'>{profile.careerPath}</strong>
              </span>
              <span className='text-green-700'>{profile.totalSkills} kỹ năng trong hồ sơ</span>
            </div>
          ) : (
            <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
              <span className='flex items-center gap-2'>
                <AlertCircle className='w-4 h-4 shrink-0' />
                {profile?.message ?? profileError ?? 'Chưa kiểm tra được hồ sơ kỹ năng của bạn.'}
              </span>
              <span className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => profileQuery.refetch()}
                  disabled={profileQuery.isFetching}
                  className='rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-medium hover:bg-amber-100 disabled:opacity-60 transition'
                >
                  {profileQuery.isFetching ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
                </button>
                <Link
                  to='/profile'
                  className='rounded-lg bg-amber-600 px-3 py-1.5 font-medium text-white hover:bg-amber-700 transition'
                >
                  Cập nhật hồ sơ
                </Link>
              </span>
            </div>
          )}
        </div>

        {/* Form địa chỉ */}
        <form onSubmit={onSubmit} noValidate className='mt-8 rounded-3xl border border-gray-200 bg-white p-6'>
          <label htmlFor='location' className='block text-sm font-medium text-gray-800 mb-1.5'>
            Bạn đang ở đâu?
          </label>
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
              <input
                id='location'
                type='text'
                placeholder={`Mặc định: ${DEFAULT_LOCATION}`}
                aria-invalid={!!errors.location}
                className={`w-full rounded-xl border pl-12 pr-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 transition ${
                  errors.location
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                {...register('location')}
              />
            </div>
            <button
              type='submit'
              disabled={isPending || !canAnalyze}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium px-6 py-3 transition'
            >
              <Search className='w-4 h-4' />
              {isPending ? 'Đang phân tích...' : 'Phân tích'}
            </button>
          </div>

          {errors.location && <p className='text-sm text-red-500 mt-1.5'>{errors.location.message}</p>}

          <div className='mt-4 flex flex-wrap gap-2'>
            {QUICK_LOCATIONS.map((loc) => {
              const active = currentLocation === loc
              return (
                <button
                  key={loc}
                  type='button'
                  onClick={() => setValue('location', loc, { shouldValidate: true })}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    active
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {loc}
                </button>
              )
            })}
          </div>
        </form>

        {/* Kết quả */}
        <div className='mt-6'>
          {isPending ? (
            <div className='space-y-5' aria-busy='true'>
              <p className='text-sm text-gray-500'>AI đang phân tích thị trường, có thể mất 10–30 giây.</p>
              <Skeleton height={160} borderRadius={24} />
              <Skeleton height={90} borderRadius={24} />
              <Skeleton height={200} borderRadius={24} />
            </div>
          ) : isError ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center'>
              <p className='text-[15px] font-medium text-gray-900'>Không tạo được phân tích.</p>
              <p className='mt-1.5 text-sm text-gray-500'>
                {errorMessage ?? 'Vui lòng kiểm tra hồ sơ kỹ năng của bạn rồi thử lại.'}
              </p>
              <button
                type='button'
                onClick={() => resetMutation()}
                className='mt-5 rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition'
              >
                Đóng
              </button>
            </div>
          ) : result ? (
            <RecommendationResult result={result} />
          ) : (
            <p className='py-16 text-center text-sm text-gray-500'>
              Nhập địa chỉ rồi bấm “Phân tích” để xem gợi ý việc làm.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
