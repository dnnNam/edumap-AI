import { useTranslation } from 'react-i18next'
import {
  Building2,
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lightbulb,
  MapPin,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react'
import type { RecommendationBody, SampleJob } from '../../../types/api/job.types'
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionWrapper'

function SampleJobCard({ job }: { job: SampleJob }) {
  return (
    <div className='h-full rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 transition hover:shadow-md hover:border-gray-300 dark:hover:border-white/20'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>{job.title}</h3>
          <div className='mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-[#A29FA8]'>
            <Building2 className='w-4 h-4 shrink-0 text-gray-400' />
            <span className='font-medium text-gray-800 dark:text-gray-200'>{job.company}</span>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-wrap'>
          {job.experienceLevel && (
            <span className='rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'>
              {job.experienceLevel}
            </span>
          )}
          <span className='rounded-full bg-indigo-50 dark:bg-[#5F2CFF]/15 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-[#A99DFF] whitespace-nowrap'>
            {job.jobType}
          </span>
        </div>
      </div>

      <dl className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-[#A29FA8]'>
        <div className='flex items-center gap-2 min-w-0'>
          <Banknote className='w-4 h-4 shrink-0 text-emerald-500' />
          <dd className='font-medium text-emerald-600 dark:text-emerald-400 truncate'>{job.salary}</dd>
        </div>
        <div className='flex items-center gap-2 min-w-0'>
          <MapPin className='w-4 h-4 shrink-0 text-gray-400 dark:text-[#A29FA8]' />
          <dd className='truncate'>{job.location}</dd>
        </div>
      </dl>

      {/* Requirements tags */}
      {job.requirements && job.requirements.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-1.5'>
          {job.requirements.map((req, idx) => (
            <span
              key={idx}
              className='px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-xs text-gray-600 dark:text-[#ECE9E4]'
            >
              {req}
            </span>
          ))}
        </div>
      )}

      <p className='mt-4 text-[15px] leading-relaxed text-gray-600 dark:text-[#B5B1BA]'>{job.description}</p>

      {/* Action / Apply Links */}
      <div className='mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3'>
        <a
          href={
            job.applyUrl ||
            `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} tuyển dụng`)}&ibp=htl;jobs`
          }
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition'
        >
          <span>Xem tin tuyển dụng & Ứng tuyển</span>
          <ExternalLink className='w-3.5 h-3.5' />
        </a>

        {/* Quick platform links */}
        <div className='flex items-center gap-1.5 flex-wrap'>
          <span className='text-xs text-gray-400 dark:text-[#A29FA8]'>Tìm trên:</span>
          {(
            job.links || [
              {
                platform: 'ITviec',
                url: `https://itviec.com/it-jobs?query=${encodeURIComponent(job.title)}`,
              },
              {
                platform: 'TopCV',
                url: `https://www.topcv.vn/tim-viec-lam?keyword=${encodeURIComponent(`${job.title} ${job.company}`)}`,
              },
              {
                platform: 'LinkedIn',
                url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}`,
              },
            ]
          ).map((pLink, idx) => (
            <a
              key={idx}
              href={pLink.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-medium text-gray-700 dark:text-[#ECE9E4] transition'
            >
              <span>{pLink.platform}</span>
              <ExternalLink className='w-3 h-3 text-gray-400' />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RecommendationResult({ result }: { result: RecommendationBody }) {
  const { t } = useTranslation()
  const { data: analysis } = result
  const metrics = analysis.marketMetrics

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

        {/* KHỐI SỐ LIỆU THỊ TRƯỜNG & DẢI LƯƠNG THEO CẤP BẬC */}
        {metrics && (
          <div className='mt-6 pt-6 border-t border-gray-100 dark:border-white/[0.08] space-y-5'>
            {/* Dải lương theo level */}
            {metrics.salaryByLevel && (
              <div>
                <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#A29FA8] mb-3'>
                  Mức lương thị trường theo cấp bậc
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  <div className='p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5'>
                    <span className='text-xs text-gray-500 dark:text-[#A29FA8]'>Junior / Fresher</span>
                    <div className='mt-1 text-sm font-bold text-gray-900 dark:text-[#ECE9E4]'>
                      {metrics.salaryByLevel.junior}
                    </div>
                  </div>
                  <div className='p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#5F2CFF]/10 border border-indigo-100 dark:border-[#5F2CFF]/20'>
                    <span className='text-xs text-indigo-600 dark:text-[#A99DFF] font-medium'>Middle</span>
                    <div className='mt-1 text-sm font-bold text-indigo-700 dark:text-[#ECE9E4]'>
                      {metrics.salaryByLevel.middle}
                    </div>
                  </div>
                  <div className='p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30'>
                    <span className='text-xs text-emerald-700 dark:text-emerald-400 font-medium'>Senior / Lead</span>
                    <div className='mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400'>
                      {metrics.salaryByLevel.senior}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chỉ số thị trường & Kỹ năng yêu cầu */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
              {/* Cạnh tranh & Tăng trưởng */}
              <div className='p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-500 dark:text-[#A29FA8] flex items-center gap-1.5'>
                    <TrendingUp className='w-4 h-4 text-indigo-500' />
                    Tốc độ tăng trưởng:
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                    {metrics.demandGrowth || 'Đang tăng trưởng'}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-500 dark:text-[#A29FA8] flex items-center gap-1.5'>
                    <Award className='w-4 h-4 text-amber-500' />
                    Mức độ cạnh tranh:
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                    {metrics.competitionLevel || 'Trung bình'}
                  </span>
                </div>
              </div>

              {/* Kỹ năng cốt lõi */}
              <div className='p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2.5'>
                {metrics.topRequiredSkills && metrics.topRequiredSkills.length > 0 && (
                  <div>
                    <span className='text-xs font-medium text-gray-500 dark:text-[#A29FA8] flex items-center gap-1 mb-1.5'>
                      <CheckCircle2 className='w-3.5 h-3.5 text-indigo-500' />
                      Kỹ năng bắt buộc (Must-have):
                    </span>
                    <div className='flex flex-wrap gap-1'>
                      {metrics.topRequiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-[#5F2CFF]/20 text-indigo-600 dark:text-[#A99DFF] text-xs font-medium'
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {metrics.bonusSkills && metrics.bonusSkills.length > 0 && (
                  <div className='pt-1'>
                    <span className='text-xs font-medium text-gray-500 dark:text-[#A29FA8] flex items-center gap-1 mb-1.5'>
                      <Sparkles className='w-3.5 h-3.5 text-emerald-500' />
                      Kỹ năng lợi thế (Điểm cộng):
                    </span>
                    <div className='flex flex-wrap gap-1'>
                      {metrics.bonusSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium'
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-[#ECE9E4]'>
              {t('jobs.result.sampleJobs')} ({analysis.sampleJobs.length})
            </h2>
            <span className='text-xs text-gray-500 dark:text-[#A29FA8]'>
              Được AI tổng hợp theo hồ sơ kỹ năng của bạn
            </span>
          </div>
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
