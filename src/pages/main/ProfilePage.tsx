import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { getLocale } from '../../utils/locale'
import { CalendarDays, GraduationCap, KeyRound, Mail, Pencil, Target, GitBranch, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import StatCard from '../../components/ui/StatCard'

import ChangePasswordModal from '../../components/ui/Changepasswordmodal'

import type { ChangePasswordPayload } from '../../schemas/auth.schema'
import { useProfileQuery } from '../../hooks/useUserQuery'
import { useChangePasswordMutation } from '../../hooks/useAuthQuery'
import { useMySkillTreeQuery } from '../../hooks/skillTreeQuery'
import { useMySkillsSummaryQuery } from '../../hooks/skillsQuery'
import { flattenNodes } from '../../utils/skillTree'
import { useNavigate } from 'react-router'

// ---------- data not covered by the /auth/me endpoint yet (swap for real queries later) ----------

const ACHIEVEMENTS = [
  { emoji: '🚀', labelKey: 'profile.ach.firstSteps' },
  { emoji: '🔥', labelKey: 'profile.ach.weekStreak' },
  { emoji: '💻', labelKey: 'profile.ach.codeNinja' },
  { emoji: '☁️', labelKey: 'profile.ach.cloudNative' },
  { emoji: '🤖', labelKey: 'profile.ach.aiExplorer' },
  { emoji: '🎓', labelKey: 'profile.ach.mentor' },
  { emoji: '⭐', labelKey: 'profile.ach.openSource' },
  { emoji: '🏆', labelKey: 'profile.ach.interviewReady' },
]

const CERTIFICATES = [
  { letter: 'A', name: 'AWS Solutions Architect', year: '2025' },
  { letter: 'T', name: 'TensorFlow Developer', year: '2024' },
  { letter: 'M', name: 'Meta Frontend Pro', year: '2023' },
  { letter: 'G', name: 'GitHub Foundations', year: '2025' },
]

const SKILLS = [
  { name: 'React', level: 92 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 78 },
  { name: 'System Design', level: 64 },
  { name: 'Python', level: 71 },
  { name: 'Docker', level: 58 },
]

// ---------- helpers ----------

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
]

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function avatarColorFor(id: string) {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function formatCurrentYear(year: string | number | null) {
  if (year === null || year === undefined || year === '') return null
  const n = Number(year)
  if (Number.isInteger(n)) return i18n.t('profile.yearN', { n })
  return String(year)
    .toLowerCase()
    .split('_')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')
}

function formatMemberSince(iso: string) {
  return new Intl.DateTimeFormat(getLocale(), { month: 'long', year: 'numeric' }).format(new Date(iso))
}

function formatRole(role: string) {
  return i18n.t(`roles.${role}`, { defaultValue: role[0] + role.slice(1).toLowerCase() })
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const { data: profileResponse, isLoading, isError } = useProfileQuery()
  const changePasswordMutation = useChangePasswordMutation()
  const user = profileResponse?.data?.data
  const navigate = useNavigate()

  const { data: treeResponse, isLoading: isTreeLoading } = useMySkillTreeQuery()
  const tree = treeResponse?.data?.data
  const flatNodes = tree?.nodes ? flattenNodes(tree.nodes) : []
  const hasTree = !!tree && tree.totalNodes > 0

  const { data: summaryResponse } = useMySkillsSummaryQuery()
  const summary = summaryResponse?.data?.data
  const totalSkillsCount = summary?.totalSkills ?? 0

  const statsList = [
    { value: '87', labelKey: 'profile.stats.careerScore' },
    { value: '24d', labelKey: 'profile.stats.streak' },
    { value: String(totalSkillsCount || 15), labelKey: 'profile.stats.skillsMastered' },
    { value: '12,480', labelKey: 'profile.stats.totalXp' },
  ]

  const handleChangePassword = async (data: ChangePasswordPayload) => {
    await changePasswordMutation.mutateAsync(data)
  }
  return (
    <div className='flex-1 min-h-0 overflow-y-auto p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Header card */}
        <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-6'>
          {isLoading && (
            <div className='flex items-center gap-4 animate-pulse'>
              <div className='w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10' />
              <div className='space-y-2'>
                <div className='h-5 w-40 rounded bg-gray-100 dark:bg-white/10' />
                <div className='h-4 w-56 rounded bg-gray-100 dark:bg-white/10' />
              </div>
            </div>
          )}

          {isError && !isLoading && (
            <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>{t('profile.loadError')}</p>
          )}

          {user && !isLoading && (
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5'>
              <div className='flex items-center gap-4'>
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold shrink-0 ${avatarColorFor(
                    user.id,
                  )}`}
                >
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{user.fullName}</h1>
                    <span className='text-xs text-gray-500 dark:text-[#A29FA8] bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/[0.08] rounded-full px-2 py-0.5'>
                      {formatRole(user.role)}
                    </span>
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 border ${
                        user.subscriptionTier === 'FREE'
                          ? 'text-gray-500 dark:text-[#A29FA8] bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/[0.08]'
                          : 'text-indigo-700 dark:text-[#A99DFF] bg-indigo-50 dark:bg-[#5F2CFF]/15 border-indigo-100 dark:border-[#5F2CFF]/20'
                      }`}
                    >
                      {user.subscriptionTier === 'FREE'
                        ? t('header.freePlan')
                        : t('plan.label', {
                            name: `${user.subscriptionTier[0]}${user.subscriptionTier.slice(1).toLowerCase()}`,
                          })}
                    </span>
                  </div>

                  <p className='mt-1 text-[15px] text-gray-500 dark:text-[#A29FA8] flex items-center gap-1.5'>
                    <GraduationCap className='w-4 h-4 text-gray-400 dark:text-[#A29FA8]' />
                    {user.universityName ?? (
                      <span className='text-gray-400 dark:text-[#A29FA8] italic'>{t('profile.universityNotSet')}</span>
                    )}
                    {formatCurrentYear(user.currentYear) && <> · {formatCurrentYear(user.currentYear)}</>}
                  </p>

                  <p className='mt-1 text-sm text-gray-400 dark:text-[#A29FA8] flex items-center gap-1.5'>
                    <CalendarDays className='w-3.5 h-3.5' />
                    {t('profile.memberSince', { date: formatMemberSince(user.createdAt) })}
                  </p>

                  <div className='mt-3 flex items-center gap-2'>
                    <a
                      href={`mailto:${user.email}`}
                      aria-label='Email'
                      className='w-8 h-8 rounded-full border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] hover:border-gray-300 dark:hover:border-white/20 transition'
                    >
                      <Mail className='w-3.5 h-3.5' />
                    </a>
                    {user.githubUsername ? (
                      <a
                        href={`https://github.com/${user.githubUsername}`}
                        target='_blank'
                        rel='noreferrer'
                        aria-label='GitHub'
                        className='w-8 h-8 rounded-full border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4] hover:border-gray-300 dark:hover:border-white/20 transition'
                      >
                        <FaGithub className='w-3.5 h-3.5' />
                      </a>
                    ) : (
                      <button
                        type='button'
                        className='flex items-center gap-1.5 h-8 rounded-full border border-dashed border-gray-200 dark:border-white/[0.15] px-3 text-xs text-gray-400 dark:text-[#A29FA8] hover:text-gray-600 dark:hover:text-[#ECE9E4] hover:border-gray-300 dark:hover:border-white/30 transition cursor-pointer'
                      >
                        <FaGithub className='w-3.5 h-3.5' />
                        {t('profile.connectGithub')}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2.5 shrink-0'>
                <button
                  type='button'
                  className='rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:text-indigo-600 dark:hover:text-[#A99DFF] hover:border-indigo-600 dark:hover:border-[#5F2CFF] hover:bg-indigo-50 dark:hover:bg-[#5F2CFF]/15 transition cursor-pointer'
                >
                  {t('profile.viewPortfolio')}
                </button>

                <button
                  type='button'
                  onClick={() => setIsChangePasswordOpen(true)}
                  className='flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:text-indigo-600 dark:hover:text-[#A99DFF] hover:border-indigo-600 dark:hover:border-[#5F2CFF] hover:bg-indigo-50 dark:hover:bg-[#5F2CFF]/15 transition cursor-pointer'
                >
                  <KeyRound className='w-3.5 h-3.5' />
                  {t('profile.changePassword')}
                </button>

                <button
                  type='button'
                  className='flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:text-indigo-600 dark:hover:text-[#A99DFF] hover:border-indigo-600 dark:hover:border-[#5F2CFF] hover:bg-indigo-50 dark:hover:bg-[#5F2CFF]/15 transition cursor-pointer'
                  onClick={() => navigate('/settings')}
                >
                  <Pencil className='w-3.5 h-3.5' />
                  {t('profile.editProfile')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {statsList.map((stat) => (
            <StatCard key={stat.labelKey} value={stat.value} label={t(stat.labelKey)} />
          ))}
        </div>

        {/* Achievements / Learning Progress / Certificates */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5'>
            <h2 className='flex items-center gap-2 text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>
              🏆 {t('profile.achievements')}
            </h2>
            <div className='mt-4 grid grid-cols-4 gap-3'>
              {ACHIEVEMENTS.map((a) => (
                <div
                  key={a.labelKey}
                  className='flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-[#232227] py-3 px-1'
                >
                  <span className='text-xl leading-none'>{a.emoji}</span>
                  <span className='text-[11px] text-gray-600 dark:text-[#ECE9E4] text-center leading-tight truncate w-full'>
                    {t(a.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress (Replaced mock GOALS with real skill tree & roadmap progress) */}
          <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between'>
            <div>
              <div className='flex items-center justify-between'>
                <h2 className='text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4] flex items-center gap-2'>
                  <Target className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
                  <span>{t('profile.learningProgress')}</span>
                </h2>
                {hasTree && (
                  <span className='text-xs font-bold text-indigo-600 dark:text-[#A99DFF] bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full'>
                    {tree.completionPercentage}%
                  </span>
                )}
              </div>

              {isTreeLoading ? (
                <div className='mt-4 space-y-3 animate-pulse'>
                  <div className='h-3 bg-gray-100 dark:bg-white/10 rounded-full w-3/4' />
                  <div className='h-2 bg-gray-100 dark:bg-white/10 rounded-full' />
                  <div className='h-3 bg-gray-100 dark:bg-white/10 rounded-full w-1/2' />
                  <div className='h-2 bg-gray-100 dark:bg-white/10 rounded-full' />
                </div>
              ) : hasTree ? (
                <div className='mt-4 space-y-3.5'>
                  {/* Overall Roadmap Progress */}
                  <div>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='font-semibold text-gray-900 dark:text-[#ECE9E4] truncate max-w-[160px]'>
                        {tree.careerPath || t('profile.careerRoadmap')}
                      </span>
                      <span className='text-gray-500 dark:text-[#A29FA8] font-mono'>
                        {tree.completedCount}/{tree.totalNodes} nodes
                      </span>
                    </div>
                    <div className='mt-1.5 h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-[#A99DFF] transition-all duration-500'
                        style={{ width: `${Math.min(100, Math.max(5, tree.completionPercentage))}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Learning Nodes in Tree */}
                  <div className='space-y-2.5 pt-2 border-t border-gray-100 dark:border-white/5'>
                    {flatNodes.slice(0, 4).map((node) => (
                      <div key={node.id}>
                        <div className='flex items-center justify-between text-xs'>
                          <span className='text-gray-700 dark:text-[#ECE9E4] truncate max-w-[160px]'>
                            {node.skill.name}
                          </span>
                          <span
                            className={`font-semibold ${
                              node.isCompleted
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-400 dark:text-[#A29FA8]'
                            }`}
                          >
                            {node.isCompleted ? '100%' : '0%'}
                          </span>
                        </div>
                        <div className='mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden'>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              node.isCompleted ? 'bg-emerald-500 w-full' : 'bg-gray-200 dark:bg-white/20 w-0'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='mt-4 py-4 text-center'>
                  <GitBranch className='w-8 h-8 text-gray-400 dark:text-[#A29FA8] mx-auto mb-2 opacity-60' />
                  <p className='text-xs font-medium text-gray-700 dark:text-[#ECE9E4]'>{t('profile.noRoadmap')}</p>
                  <p className='text-[11px] text-gray-400 dark:text-[#A29FA8] mt-1'>{t('profile.noRoadmapDesc')}</p>
                </div>
              )}
            </div>

            <button
              type='button'
              onClick={() => navigate('/skill-tree')}
              className='mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-[#A99DFF] cursor-pointer pt-2'
            >
              <span>{t('profile.viewDetailTree')}</span>
              <ArrowRight className='w-3.5 h-3.5' />
            </button>
          </div>

          <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5'>
            <h2 className='text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('profile.certificates')}</h2>
            <div className='mt-4 space-y-3'>
              {CERTIFICATES.map((cert) => (
                <div key={cert.name} className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#ECE9E4] text-sm font-semibold flex items-center justify-center shrink-0'>
                    {cert.letter}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm text-gray-900 dark:text-[#ECE9E4] truncate'>{cert.name}</p>
                    <p className='text-xs text-gray-500 dark:text-[#A29FA8]'>
                      {t('profile.issued', { year: cert.year })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills mastered */}
        <div className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5'>
          <h2 className='text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('profile.skillsMastered')}</h2>
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700 dark:text-[#ECE9E4]'>{skill.name}</span>
                  <span className='text-gray-500 dark:text-[#A29FA8]'>{skill.level}%</span>
                </div>
                <div className='mt-1.5 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-gray-900 dark:bg-[#5F2CFF]'
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
        isSubmitting={changePasswordMutation.isPending}
      />
    </div>
  )
}
