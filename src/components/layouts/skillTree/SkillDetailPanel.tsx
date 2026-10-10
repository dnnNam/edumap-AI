import { BadgeCheck, Circle, CircleCheck, Sparkles, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SkillNode } from '../../../types/api/skillTree.types'

export interface SkillDetailPanelProps {
  node: SkillNode | null
}

// Dòng thông tin đơn giản: label bên trái, value bên phải
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between text-sm'>
      <dt className='text-gray-500 dark:text-[#A29FA8]'>{label}</dt>
      <dd className='font-medium text-gray-900 dark:text-[#ECE9E4]'>{value}</dd>
    </div>
  )
}

// Ô nhỏ hiển thị 1 chỉ số (Difficulty / Demand)
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#232227] px-3.5 py-3'>
      <p className='text-xs text-gray-500 dark:text-[#A29FA8]'>{label}</p>
      <p className='mt-0.5 text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>{value}</p>
    </div>
  )
}

// ---------- trạng thái ----------

interface StatusConfig {
  labelKey: string
  icon: LucideIcon
  className: string
}

// Mastered: node gốc, không có children (không xét isCompleted)
// To learn: node con nằm trong node cha, không có children (chỉ là môn con)
// Completed / Not completed: node có children, theo isCompleted
function getStatus(node: SkillNode): StatusConfig {
  const hasChildren = node.children.length > 0

  if (!hasChildren && node.parentNodeId === null) {
    return {
      labelKey: 'skillTree.detail.mastered',
      icon: BadgeCheck,
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    }
  }
  if (!hasChildren) {
    return {
      labelKey: 'skillTree.detail.toLearn',
      icon: Circle,
      className:
        'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-[#A29FA8] dark:border-white/[0.08]',
    }
  }
  if (node.isCompleted) {
    return {
      labelKey: 'skillTree.detail.completed',
      icon: CircleCheck,
      className:
        'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-[#5F2CFF]/15 dark:text-[#A99DFF] dark:border-[#5F2CFF]/20',
    }
  }
  return {
    labelKey: 'skillTree.detail.notCompleted',
    icon: Circle,
    className:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-[#A29FA8] dark:border-white/[0.08]',
  }
}

function StatusRow({ node }: { node: SkillNode }) {
  const { t } = useTranslation()
  const { labelKey, icon: Icon, className } = getStatus(node)

  return (
    <div className='flex items-center justify-between text-sm'>
      <dt className='text-gray-500 dark:text-[#A29FA8]'>{t('skillTree.detail.status')}</dt>
      <dd>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
        >
          <Icon className='w-3.5 h-3.5' />
          {t(labelKey)}
        </span>
      </dd>
    </div>
  )
}

export default function SkillDetailPanel({ node }: SkillDetailPanelProps) {
  const { t } = useTranslation()

  if (!node) {
    return (
      <aside className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl px-6 py-14 text-center'>
        <Sparkles className='w-5 h-5 mx-auto text-gray-400 dark:text-[#A29FA8]' />
        <p className='mt-3 text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>
          {t('skillTree.detail.selectSkill')}
        </p>
        <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('skillTree.detail.viewDetails')}</p>
      </aside>
    )
  }

  return (
    <aside className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-6'>
      {/* Category */}
      <span className='inline-block text-xs font-medium text-gray-700 dark:text-[#ECE9E4] bg-gray-100 dark:bg-white/10 rounded-full px-2.5 py-1'>
        {node.skill.category}
      </span>

      {/* Tên + priority */}
      <h3 className='mt-3 text-xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{node.skill.name}</h3>
      <p className='mt-0.5 text-sm text-gray-500 dark:text-[#A29FA8]'>
        {t('skillTree.detail.priority', { rank: node.priorityRank })}
      </p>

      {/* Difficulty / Demand */}
      <div className='mt-4 flex gap-3'>
        <StatBox
          label={t('skillTree.detail.difficulty')}
          value={t('skillTree.node.level', { level: node.skill.difficultyLevel })}
        />
        <StatBox label={t('skillTree.detail.demand')} value={`${node.skill.demandScore}/100`} />
      </div>

      {/* Thông tin còn lại */}
      <dl className='mt-5 space-y-3 pt-5 border-t border-gray-100 dark:border-white/[0.06]'>
        <StatusRow node={node} />
        <InfoRow label={t('skillTree.detail.nodeLevel')} value={String(node.nodeLevel)} />
        <InfoRow label={t('skillTree.detail.children')} value={String(node.children.length)} />
      </dl>
    </aside>
  )
}
