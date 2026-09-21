import { Sparkles } from 'lucide-react'
import type { SkillNode } from '../../../types/api/skillTree.types'
import ToggleSwitch from './ToogleSwitch'

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

export interface SkillDetailPanelProps {
  node: SkillNode | null
  onToggleComplete?: (node: SkillNode) => void
}

export default function SkillDetailPanel({ node, onToggleComplete }: SkillDetailPanelProps) {
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
      {/* Category + toggle hoàn thành */}
      <div className='flex items-center justify-between gap-3'>
        <span className='text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2.5 py-1'>
          {node.skill.category}
        </span>
        <ToggleSwitch
          checked={node.isCompleted}
          label={`${node.skill.name}: ${node.isCompleted ? 'completed' : 'open'}`}
        />
      </div>

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
        <InfoRow label='Status' value={node.isCompleted ? 'Completed' : 'Not completed'} />
        <InfoRow label='Node level' value={String(node.nodeLevel)} />
        <InfoRow label='Children' value={String(node.children.length)} />
      </dl>

      {/* CTA */}
      <button
        type='button'
        onClick={() => onToggleComplete?.(node)}
        className='mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 transition-colors'
      >
        {node.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      </button>
    </aside>
  )
}
