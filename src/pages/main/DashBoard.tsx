import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useSplash } from '../../context/SplashContext'

import { useMySkillsSummaryQuery } from '../../hooks/skillsQuery'
import { useMySkillTreeQuery } from '../../hooks/skillTreeQuery'
import type { TopSkill } from '../../types/api/skills.type'
import { getFullNameFromLS } from '../../utils/auth'
import Panel from '../../components/layouts/dashboard/Panel'
import DashboardHeroBanner from '../../components/layouts/dashboard/DashboardHeroBanner'
import BentoSkillBreakdownCard from '../../components/layouts/dashboard/BentoSkillBreakdownCard'
import BentoMetricCards from '../../components/layouts/dashboard/BentoMetricCards'
import BentoMarketMatchCard from '../../components/layouts/dashboard/BentoMarketMatchCard'
import BentoMonthlyVelocityCard from '../../components/layouts/dashboard/BentoMonthlyVelocityCard'

// ---------- helpers ----------

const TOP_SKILLS_LIMIT = 5

function getSkillName(skill: TopSkill): string {
  if (typeof skill === 'string') return skill
  return skill.name ?? skill.skillName ?? ''
}

function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className='rounded-xl border border-dashed border-gray-200 dark:border-white/10 px-4 py-10 text-center text-sm text-gray-500 dark:text-[#A29FA8]'>
      {children}
    </div>
  )
}

export default function DashBoard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fullName = getFullNameFromLS()
  const { isPageRevealed } = useSplash()

  const { data: response, isLoading, isError, isFetching, refetch } = useMySkillsSummaryQuery()
  const summary = response?.data?.data

  const { data: treeResponse } = useMySkillTreeQuery()
  const tree = treeResponse?.data?.data

  const topSkills = (summary?.topSkills ?? []).map(getSkillName).filter(Boolean).slice(0, TOP_SKILLS_LIMIT)

  // Sắp xếp category nhiều skill nhất lên đầu; thanh tiến độ tính theo category lớn nhất
  const categories = Object.entries(summary?.categoryStats ?? {}).sort(([, a], [, b]) => b - a)
  const maxCount = categories[0]?.[1] ?? 0

  return (
    // h-full (không dùng flex-1): cha trực tiếp là <motion.div className='h-full'> của AnimatedOutlet
    <div className='h-full overflow-y-auto [scrollbar-gutter:stable]'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Modern SaaS Dashboard Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardHeroBanner
            fullName={fullName}
            totalSkills={summary?.totalSkills ?? 0}
            totalHours={summary?.totalHours ?? 0}
          />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className='flex items-end justify-between gap-4 flex-wrap mt-6'
        >
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {t('dashboard.title')}
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-[#B5B1BA]'>{t('dashboard.subtitle')}</p>
          </div>

          <button
            type='button'
            onClick={() => navigate('/upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 transition cursor-pointer shadow-sm'
          >
            <Sparkles className='w-4 h-4' />
            {t('dashboard.runAnalysis')}
          </button>
        </motion.div>

        {isError && !summary ? (
          <div className='mt-6 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center transition-colors'>
            <p className='text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>{t('dashboard.loadError')}</p>
            <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('dashboard.loadErrorHint')}</p>
            <button
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
              className='mt-5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
            >
              {isFetching ? t('common.loading') : t('common.retry')}
            </button>
          </div>
        ) : (
          <>
            {/* Dribbble Style Modern Bento-Grid Layout */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
              transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className='mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch'
            >
              {/* Left Column: Phân bổ Kỹ năng & Tech Stack (5 cols) */}
              <div className='lg:col-span-5 flex flex-col'>
                <BentoSkillBreakdownCard
                  totalSkills={summary?.totalSkills ?? 0}
                  categoryStats={summary?.categoryStats ?? {}}
                />
              </div>

              {/* Right Column: Split Top Metrics & Bottom Domain Distribution Card (7 cols) */}
              <div className='lg:col-span-7 flex flex-col gap-6 justify-between'>
                {/* Top Row: Cây kỹ năng & Thời lượng (left) + Độ khớp thị trường (right) */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch'>
                  <BentoMetricCards
                    totalHours={summary?.totalHours ?? 0}
                    completedNodes={tree?.completedCount ?? 0}
                    totalNodes={tree?.totalNodes ?? 0}
                    completionPercentage={tree?.completionPercentage ?? 0}
                  />
                  <BentoMarketMatchCard
                    careerPath={tree?.careerPath}
                    completionPercentage={tree?.completionPercentage ?? 0}
                  />
                </div>

                {/* Bottom Row: Phân bố năng lực theo lĩnh vực thực tế (Large Dark Card) */}
                <div className='flex-1'>
                  <BentoMonthlyVelocityCard
                    categoryStats={summary?.categoryStats ?? {}}
                    totalSkills={summary?.totalSkills ?? 0}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className='mt-5 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-5 items-start'
            >
              {/* Top skills */}
              <Panel
                title={t('dashboard.topSkills')}
                description={t('dashboard.topSkillsDesc')}
                aside={<BookOpen className='w-4 h-4 text-gray-400 dark:text-[#85808C] mt-1 shrink-0' />}
              >
                {isLoading ? (
                  <div className='space-y-3'>
                    {Array.from({ length: TOP_SKILLS_LIMIT }).map((_, i) => (
                      <div key={i} className='h-[50px] rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse' />
                    ))}
                  </div>
                ) : topSkills.length === 0 ? (
                  <EmptyHint>{t('dashboardExtra.emptySkills')}</EmptyHint>
                ) : (
                  <ol className='space-y-3'>
                    {topSkills.map((name, i) => (
                      <li
                        key={`${i}-${name}`}
                        className='flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 bg-white dark:bg-[#1A191C] transition-colors'
                      >
                        <span className='w-7 h-7 shrink-0 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-700 dark:text-[#ECE9E4] flex items-center justify-center'>
                          {i + 1}
                        </span>
                        <span className='flex-1 min-w-0 truncate text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>
                          {name}
                        </span>
                        {i === 0 && (
                          <span className='shrink-0 text-xs text-gray-700 dark:text-[#ECE9E4] bg-white dark:bg-[#232227] border border-gray-200 dark:border-white/10 rounded-full px-2.5 py-1'>
                            {t('dashboard.strongest')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}

                <button
                  type='button'
                  onClick={() => navigate('/skill-tree')}
                  className='mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 py-2.5 text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4] shadow-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer'
                >
                  {t('dashboard.viewSkillTree')}
                  <ArrowRight className='w-4 h-4' />
                </button>
              </Panel>

              {/* Category statistics */}
              <Panel
                title={t('dashboard.categoryStats')}
                description={t('dashboard.categoryStatsDesc')}
                aside={
                  !isLoading && categories.length > 0 ? (
                    <span className='shrink-0 text-xs text-gray-600 dark:text-[#A29FA8] border border-gray-200 dark:border-white/10 rounded-full px-3 py-1'>
                      {t('dashboard.category', { count: categories.length })}
                    </span>
                  ) : undefined
                }
              >
                {isLoading ? (
                  <div className='space-y-6'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className='space-y-2.5 animate-pulse'>
                        <div className='h-4 w-40 rounded bg-gray-100 dark:bg-white/5' />
                        <div className='h-2 w-full rounded-full bg-gray-100 dark:bg-white/5' />
                      </div>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <EmptyHint>{t('dashboardExtra.emptyCategory')}</EmptyHint>
                ) : (
                  <div className='space-y-5'>
                    {categories.map(([category, count]) => (
                      <div key={category}>
                        <div className='flex items-center justify-between gap-3 text-sm'>
                          <span className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{category}</span>
                          <span className='text-gray-500 dark:text-[#A29FA8]'>{t('dashboard.skill', { count })}</span>
                        </div>
                        <div className='mt-2 h-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 overflow-hidden'>
                          <div
                            className='h-full rounded-full bg-indigo-600'
                            style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
