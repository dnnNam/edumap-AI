import { ArrowRight, BookOpen, Clock, Sparkles, Tags } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

import MetricCard from '../../components/layouts/dashboard/MetricCard'
import { useMySkillsSummaryQuery } from '../../hooks/skillsQuery'
import type { TopSkill } from '../../types/api/skills.type'
import { getFullNameFromLS } from '../../utils/auth'
import Panel from '../../components/layouts/dashboard/Panel'

// ---------- helpers ----------

const TOP_SKILLS_LIMIT = 5
const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

function getSkillName(skill: TopSkill): string {
  if (typeof skill === 'string') return skill
  return skill.name ?? skill.skillName ?? ''
}

function pluralize(count: number, singular: string, plural: string) {
  return `${numberFormat.format(count)} ${count === 1 ? singular : plural}`
}

function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className='rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500'>
      {children}
    </div>
  )
}

export default function DashBoard() {
  const navigate = useNavigate()
  const fullName = getFullNameFromLS()

  const { data: response, isLoading, isError, isFetching, refetch } = useMySkillsSummaryQuery()
  const summary = response?.data?.data

  const topSkills = (summary?.topSkills ?? []).map(getSkillName).filter(Boolean).slice(0, TOP_SKILLS_LIMIT)

  // Sắp xếp category nhiều skill nhất lên đầu; thanh tiến độ tính theo category lớn nhất
  const categories = Object.entries(summary?.categoryStats ?? {}).sort(([, a], [, b]) => b - a)
  const maxCount = categories[0]?.[1] ?? 0

  return (
    // h-full (không dùng flex-1): cha trực tiếp là <motion.div className='h-full'> của AnimatedOutlet
    <div className='h-full overflow-y-auto [scrollbar-gutter:stable]'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            {fullName && <p className='text-sm text-gray-500'>Welcome back, {fullName}</p>}
            <h1 className='mt-1 text-[32px] font-bold text-gray-900 tracking-tight'>Your learning overview</h1>
            <p className='mt-1.5 text-[15px] text-gray-500'>
              A clear summary of the skills and learning time found in your latest analysis.
            </p>
          </div>

          <button
            type='button'
            onClick={() => navigate('/upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[15px] font-medium px-5 py-2.5 transition'
          >
            <Sparkles className='w-4 h-4' />
            Run new analysis
          </button>
        </div>

        {isError && !summary ? (
          <div className='mt-6 bg-white border border-gray-200 rounded-2xl p-10 text-center'>
            <p className='text-[15px] font-medium text-gray-900'>Couldn't load your learning summary.</p>
            <p className='mt-1 text-sm text-gray-500'>Check your connection and try again.</p>
            <button
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
              className='mt-5 rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
            >
              {isFetching ? 'Loading...' : 'Try again'}
            </button>
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
              <MetricCard
                label='Total skills'
                value={numberFormat.format(summary?.totalSkills ?? 0)}
                hint='Skills identified across your profile'
                icon={Tags}
                iconClassName='bg-indigo-50 text-indigo-600'
                loading={isLoading}
              />
              <MetricCard
                label='Total learning hours'
                value={numberFormat.format(summary?.totalHours ?? 0)}
                hint='Estimated hours from completed learning'
                icon={Clock}
                iconClassName='bg-gray-100 text-gray-500'
                loading={isLoading}
              />
            </div>

            <div className='mt-5 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-5 items-start'>
              {/* Top skills */}
              <Panel
                title='Top skills'
                description='Your strongest detected capabilities'
                aside={<BookOpen className='w-4 h-4 text-gray-400 mt-1 shrink-0' />}
              >
                {isLoading ? (
                  <div className='space-y-3'>
                    {Array.from({ length: TOP_SKILLS_LIMIT }).map((_, i) => (
                      <div key={i} className='h-[50px] rounded-xl bg-gray-100 animate-pulse' />
                    ))}
                  </div>
                ) : topSkills.length === 0 ? (
                  <EmptyHint>
                    No skills detected yet.
                    <br />
                    Run your first analysis to see them here.
                  </EmptyHint>
                ) : (
                  <ol className='space-y-3'>
                    {topSkills.map((name, i) => (
                      <li
                        key={`${i}-${name}`}
                        className='flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3'
                      >
                        <span className='w-7 h-7 shrink-0 rounded-full bg-gray-100 text-xs font-medium text-gray-700 flex items-center justify-center'>
                          {i + 1}
                        </span>
                        <span className='flex-1 min-w-0 truncate text-[15px] font-medium text-gray-900'>{name}</span>
                        {i === 0 && (
                          <span className='shrink-0 text-xs text-gray-700 bg-white border border-gray-200 rounded-full px-2.5 py-1'>
                            Strongest
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}

                <button
                  type='button'
                  onClick={() => navigate('/skill-tree')}
                  className='mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-[15px] font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors'
                >
                  View skill tree
                  <ArrowRight className='w-4 h-4' />
                </button>
              </Panel>

              {/* Category statistics */}
              <Panel
                title='Category statistics'
                description='Skill distribution by category'
                aside={
                  !isLoading && categories.length > 0 ? (
                    <span className='shrink-0 text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1'>
                      {pluralize(categories.length, 'category', 'categories')}
                    </span>
                  ) : undefined
                }
              >
                {isLoading ? (
                  <div className='space-y-6'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className='space-y-2.5 animate-pulse'>
                        <div className='h-4 w-40 rounded bg-gray-100' />
                        <div className='h-2 w-full rounded-full bg-gray-100' />
                      </div>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <EmptyHint>No category data yet.</EmptyHint>
                ) : (
                  <div className='space-y-5'>
                    {categories.map(([category, count]) => (
                      <div key={category}>
                        <div className='flex items-center justify-between gap-3 text-sm'>
                          <span className='font-medium text-gray-900'>{category}</span>
                          <span className='text-gray-500'>{pluralize(count, 'skill', 'skills')}</span>
                        </div>
                        <div className='mt-2 h-2 rounded-full bg-indigo-100 overflow-hidden'>
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}
