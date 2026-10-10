import { useTranslation } from 'react-i18next'
import { Building2, Banknote, Clock, ExternalLink, Lightbulb, MapPin, Sparkles } from 'lucide-react'
import type { RecommendationBody, SampleJob } from '../../../types/api/job.types'
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionWrapper'

function SampleJobCard({ job }: { job: SampleJob }) {
  return (
    <div className='h-full rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 transition hover:shadow-md hover:border-gray-300 dark:hover:border-white/20'>
      <div className='flex items-start justify-between gap-3'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-[#ECE9E4]'>{job.title}</h3>
        <span className='shrink-0 rounded-full bg-indigo-50 dark:bg-[#5F2CFF]/15 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-[#A99DFF] whitespace-nowrap'>
          {job.jobType}
        </span>
      </div>

      <dl className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-[#A29FA8]'>
        <div className='flex items-center gap-2 min-w-0'>
          <Building2 className='w-4 h-4 shrink-0 text-gray-400 dark:text-[#A29FA8]' />
          <dd className='truncate'>{job.company}</dd>
        </div>
        <div className='flex items-center gap-2 min-w-0'>
          <Banknote className='w-4 h-4 shrink-0 text-gray-400 dark:text-[#A29FA8]' />
          <dd className='truncate'>{job.salary}</dd>
        </div>
        <div className='flex items-center gap-2 min-w-0'>
          <MapPin className='w-4 h-4 shrink-0 text-gray-400 dark:text-[#A29FA8]' />
          <dd className='truncate'>{job.location}</dd>
        </div>
      </dl>

      <p className='mt-4 text-[15px] leading-relaxed text-gray-600 dark:text-[#B5B1BA]'>{job.description}</p>
    </div>
  )
}

export default function RecommendationResult({ result }: { result: RecommendationBody }) {
  const { t } = useTranslation()
  const { data: analysis } = result

  return (
    <div className='space-y-6'>
      {/* Tóm tắt thị trường */}
      <MotionFadeIn className='rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-[#5F2CFF]/15 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-[#A99DFF]'>
            <Sparkles className='w-3.5 h-3.5' />
            {result.targetRole}
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] px-3 py-1 text-sm text-gray-600 dark:text-[#ECE9E4]'>
            <MapPin className='w-3.5 h-3.5' />
            {result.location}
          </span>
          {!result.isSkillUpdated && (
            <span className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] px-3 py-1 text-sm text-gray-500 dark:text-[#A29FA8]'>
              <Clock className='w-3.5 h-3.5' />
              {t('jobs.result.basedOnProject')}
            </span>
          )}
        </div>

        <h2 className='mt-5 text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('jobs.result.market')}</h2>
        <p className='mt-2 text-[15px] leading-relaxed text-gray-600 dark:text-[#B5B1BA] max-w-3xl'>
          {analysis.marketSummary}
        </p>
        {result.message && <p className='mt-3 text-sm text-gray-400 dark:text-[#A29FA8]'>{result.message}</p>}
      </MotionFadeIn>

      {/* Link tìm việc */}
      {analysis.searchLinks.length > 0 && (
        <MotionFadeIn className='rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('jobs.result.platforms')}</h2>
          <div className='mt-4 flex flex-wrap gap-2'>
            {analysis.searchLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                title={t('jobs.result.keyword', { keyword: link.searchKeyword })}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#232227] px-3.5 py-2 text-sm text-gray-700 dark:text-[#ECE9E4] transition hover:border-indigo-300 dark:hover:border-[#5F2CFF] hover:bg-indigo-50 dark:hover:bg-[#5F2CFF]/20 hover:text-indigo-600 dark:hover:text-[#A99DFF]'
              >
                <span className='font-medium'>{link.platform}</span>
                <span className='text-gray-400 dark:text-[#A29FA8]'>{link.searchKeyword}</span>
                <ExternalLink className='w-3.5 h-3.5' />
              </a>
            ))}
          </div>
        </MotionFadeIn>
      )}

      {/* Việc làm mẫu */}
      {analysis.sampleJobs.length > 0 && (
        <section>
          <h2 className='mb-4 text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>
            {t('jobs.result.sampleJobs')}
          </h2>
          <MotionStaggerContainer className='grid grid-cols-1 gap-5'>
            {analysis.sampleJobs.map((job, i) => (
              <MotionStaggerItem key={`${job.company}-${job.title}-${i}`}>
                <SampleJobCard job={job} />
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </section>
      )}

      {/* Gợi ý phỏng vấn */}
      {analysis.interviewTip && (
        <MotionFadeIn className='rounded-3xl border border-indigo-100 dark:border-[#5F2CFF]/20 bg-indigo-50/60 dark:bg-[#5F2CFF]/10 p-6'>
          <div className='flex items-center gap-2 text-indigo-600 dark:text-[#A99DFF]'>
            <Lightbulb className='w-4.5 h-4.5' />
            <h2 className='text-lg font-semibold'>{t('jobs.result.interview')}</h2>
          </div>
          <p className='mt-3 text-[15px] leading-relaxed text-gray-700 dark:text-[#ECE9E4] max-w-3xl'>
            {analysis.interviewTip}
          </p>
        </MotionFadeIn>
      )}
    </div>
  )
}
