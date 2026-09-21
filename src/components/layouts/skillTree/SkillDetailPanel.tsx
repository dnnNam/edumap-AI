import { BadgeCheck, Circle, CircleCheck, Sparkles, type LucideIcon } from 'lucide-react'
import type { SkillNode } from '../../../types/api/skillTree.types'

export interface SkillDetailPanelProps {
  node: SkillNode | null
}

// Dòng thông tin đơn giản: label bên trái, value bên phải
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between text-sm'>
      <dt className='text-gray-500'>{label}</dt>
      <dd className='font-medium text-gray-900'>{value}</dd>
    </div>
  )
}

// Ô nhỏ hiển thị 1 chỉ số (Difficulty / Demand)
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3'>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='mt-0.5 text-[15px] font-semibold text-gray-900'>{value}</p>
    </div>
  )
}

// ---------- trạng thái ----------

interface StatusConfig {
  label: string
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
      label: 'Mastered',
      icon: BadgeCheck,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    }
  }
  if (!hasChildren) {
    return {
      label: 'To learn',
      icon: Circle,
      className: 'bg-gray-100 text-gray-600 border-gray-200',
    }
  }
  if (node.isCompleted) {
    return {
      label: 'Completed',
      icon: CircleCheck,
      className: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    }
  }
  return {
    label: 'Not completed',
    icon: Circle,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  }
}

function StatusRow({ node }: { node: SkillNode }) {
  const { label, icon: Icon, className } = getStatus(node)

  return (
    <div className='flex items-center justify-between text-sm'>
      <dt className='text-gray-500'>Status</dt>
      <dd>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
        >
          <Icon className='w-3.5 h-3.5' />
          {label}
        </span>
      </dd>
    </div>
  )
}

export default function SkillDetailPanel({ node }: SkillDetailPanelProps) {
  if (!node) {
    return (
      <aside className='bg-white border border-gray-200 rounded-2xl px-6 py-14 text-center'>
        <Sparkles className='w-5 h-5 mx-auto text-gray-400' />
        <p className='mt-3 text-[15px] font-semibold text-gray-900'>Select a skill</p>
        <p className='mt-1 text-sm text-gray-500'>View its details.</p>
      </aside>
    )
  }

  return (
    <aside className='bg-white border border-gray-200 rounded-2xl p-6'>
      {/* Category */}
      <span className='inline-block text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2.5 py-1'>
        {node.skill.category}
      </span>

      {/* Tên + priority */}
      <h3 className='mt-3 text-xl font-bold text-gray-900'>{node.skill.name}</h3>
      <p className='mt-0.5 text-sm text-gray-500'>Priority #{node.priorityRank}</p>

      {/* Difficulty / Demand */}
      <div className='mt-4 flex gap-3'>
        <StatBox label='Difficulty' value={`Level ${node.skill.difficultyLevel}`} />
        <StatBox label='Demand' value={`${node.skill.demandScore}/100`} />
      </div>

      {/* Thông tin còn lại */}
      <dl className='mt-5 space-y-3 pt-5 border-t border-gray-100'>
        <StatusRow node={node} />
        <InfoRow label='Node level' value={String(node.nodeLevel)} />
        <InfoRow label='Children' value={String(node.children.length)} />
      </dl>
    </aside>
  )
}
