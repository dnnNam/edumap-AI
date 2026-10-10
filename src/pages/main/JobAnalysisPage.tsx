import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { AlertCircle, CheckCircle2, MapPin, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router'
import RecommendationResult from '../../components/layouts/jobs/RecommendationResult'
import { useCheckJobProfileQuery, useJobRecommendationsMutation } from '../../hooks/jobQuery'
import { DEFAULT_LOCATION, jobRecommendationSchema, type JobRecommendationFormValues } from '../../schemas/job.schema'

const QUICK_LOCATIONS = ['HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ']

export default function JobAnalysisPage() {
  const { t } = useTranslation()
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
        <h1 className='text-3xl font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('jobs.analysis.title')}</h1>
        <p className='mt-2 text-gray-500 dark:text-[#A29FA8]'>{t('jobs.analysis.desc')}</p>

        {/* Trạng thái hồ sơ kỹ năng */}
        <div className='mt-6'>
          {profileQuery.isLoading ? (
            <Skeleton height={56} borderRadius={16} />
          ) : canAnalyze && profile ? (
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-green-200 dark:border-emerald-500/20 bg-green-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-green-800 dark:text-emerald-300'>
              <CheckCircle2 className='w-4 h-4 shrink-0' />
              <span>
                {t('jobs.analysis.careerPath')} <strong className='font-medium'>{profile.careerPath}</strong>
              </span>
              <span className='text-green-700 dark:text-emerald-400'>
                {t('jobs.analysis.totalSkills', { count: profile.totalSkills })}
              </span>
            </div>
          ) : (
            <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200'>
              <span className='flex items-center gap-2'>
                <AlertCircle className='w-4 h-4 shrink-0' />
                {profile?.message ?? profileError ?? t('jobs.analysis.unchecked')}
              </span>
              <span className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => profileQuery.refetch()}
                  disabled={profileQuery.isFetching}
                  className='rounded-lg border border-amber-300 dark:border-amber-500/30 bg-white dark:bg-[#232227] px-3 py-1.5 font-medium hover:bg-amber-100 dark:hover:bg-amber-500/20 disabled:opacity-60 transition cursor-pointer'
                >
                  {profileQuery.isFetching ? t('jobs.analysis.rechecking') : t('jobs.analysis.recheck')}
                </button>
                <Link
                  to='/profile'
                  className='rounded-lg bg-amber-600 px-3 py-1.5 font-medium text-white hover:bg-amber-700 transition'
                >
                  {t('jobs.analysis.updateProfile')}
                </Link>
              </span>
            </div>
          )}
        </div>

        {/* Form địa chỉ */}
        <form
          onSubmit={onSubmit}
          noValidate
          className='mt-8 rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6'
        >
          <label htmlFor='location' className='block text-sm font-medium text-gray-800 dark:text-[#ECE9E4] mb-1.5'>
            {t('jobs.analysis.where')}
          </label>
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#A29FA8] pointer-events-none' />
              <input
                id='location'
                type='text'
                placeholder={t('jobs.analysis.placeholder', { loc: DEFAULT_LOCATION })}
                aria-invalid={!!errors.location}
                className={`w-full rounded-xl border pl-12 pr-4 py-3 text-[15px] text-gray-900 dark:text-[#ECE9E4] bg-white dark:bg-[#232227] placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 transition ${
                  errors.location
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950'
                    : 'border-gray-200 dark:border-white/[0.08] focus:border-indigo-500 dark:focus:border-[#5F2CFF] focus:ring-indigo-100 dark:focus:ring-[#5F2CFF]/20'
                }`}
                {...register('location')}
              />
            </div>
            <button
              type='submit'
              disabled={isPending || !canAnalyze}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-[#5F2CFF] dark:hover:bg-[#4B1FD6] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium px-6 py-3 transition cursor-pointer'
            >
              <Search className='w-4 h-4' />
              {isPending ? t('jobs.analysis.analyzing') : t('jobs.analysis.analyze')}
            </button>
          </div>

          {errors.location && <p className='text-sm text-red-500 mt-1.5'>{t(errors.location.message ?? '')}</p>}

          <div className='mt-4 flex flex-wrap gap-2'>
            {QUICK_LOCATIONS.map((loc) => {
              const active = currentLocation === loc
              return (
                <button
                  key={loc}
                  type='button'
                  onClick={() => setValue('location', loc, { shouldValidate: true })}
                  className={`rounded-full border px-3 py-1.5 text-sm transition cursor-pointer ${
                    active
                      ? 'border-indigo-300 dark:border-[#5F2CFF] bg-indigo-50 dark:bg-[#5F2CFF]/20 text-indigo-600 dark:text-[#A99DFF]'
                      : 'border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] text-gray-600 dark:text-[#A29FA8] hover:border-indigo-300 dark:hover:border-[#5F2CFF] hover:text-indigo-600 dark:hover:text-[#A99DFF]'
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
              <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>{t('jobs.analysis.thinking')}</p>
              <Skeleton height={160} borderRadius={24} />
              <Skeleton height={90} borderRadius={24} />
              <Skeleton height={200} borderRadius={24} />
            </div>
          ) : isError ? (
            <div className='rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-10 text-center'>
              <p className='text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>{t('jobs.analysis.failed')}</p>
              <p className='mt-1.5 text-sm text-gray-500 dark:text-[#A29FA8]'>
                {errorMessage ?? t('jobs.analysis.failedHint')}
              </p>
              <button
                type='button'
                onClick={() => resetMutation()}
                className='mt-5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#232227] transition cursor-pointer'
              >
                {t('jobs.analysis.close')}
              </button>
            </div>
          ) : result ? (
            <RecommendationResult result={result} />
          ) : (
            <p className='py-16 text-center text-sm text-gray-500 dark:text-[#A29FA8]'>{t('jobs.analysis.hint')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
