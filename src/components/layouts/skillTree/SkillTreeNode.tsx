import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { LIST_ITEM } from '../../../config/motionConfig'

import type { SkillNode } from '../../../types/api/skillTree.types'
import ToggleSwitch from './ToogleSwitch'
import { ALL_CATEGORIES } from '../../../utils/skillTree'

// Props dùng chung, được truyền xuống mọi cấp của cây
interface SharedProps {
  selectedId: string | null
  activeCategory: string
  togglingIds: string[] // các node đang chờ server trả lời
  onSelect: (node: SkillNode) => void
  onToggle: (node: SkillNode) => void
}

interface SkillNodeTreeProps extends SharedProps {
  nodes: SkillNode[]
}

// ---------- 1 dòng ----------

function SkillNodeRow({ node, ...shared }: { node: SkillNode } & SharedProps) {
  const { selectedId, activeCategory, togglingIds, onSelect, onToggle } = shared
  const [open, setOpen] = useState(true)

  const hasChildren = node.children.length > 0
  const isSelected = selectedId === node.id
  // Đang lọc category: node cha không khớp chỉ giữ để cây liền mạch nên làm mờ đi
  const isDimmed = activeCategory !== ALL_CATEGORIES && node.skill.category !== activeCategory
  // Chỉ node có children mới hiện trạng thái hoàn thành (tick) và toggle
  const showCompleted = hasChildren && node.isCompleted
  // Mastered: node cấp gốc và không có children (không xét isCompleted).
  // Node con nằm trong 1 node cha thì chỉ là môn con, không gắn Mastered.
  const isMastered = node.parentNodeId === null && !hasChildren

  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition ${
          isSelected ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300'
        } ${isDimmed ? 'opacity-50' : ''}`}
      >
        {/* Ô chevron: có con -> nút thu/mở, không có con -> chấm tròn giữ thẳng hàng */}
        {hasChildren ? (
          <button
            type='button'
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${node.skill.name}` : `Expand ${node.skill.name}`}
            className='w-6 h-6 shrink-0 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors'
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
          </button>
        ) : (
          <span className='w-6 h-6 shrink-0 flex items-center justify-center' aria-hidden>
            <span className='w-2.5 h-2.5 rounded-full bg-gray-300' />
          </span>
        )}

        {/* Vùng bấm để chọn node */}
        <button
          type='button'
          onClick={() => onSelect(node)}
          aria-pressed={isSelected}
          className='flex flex-1 min-w-0 items-center gap-3 text-left'
        >
          {showCompleted ? (
            <span className='w-8 h-8 shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center'>
              <Check className='w-4 h-4' />
            </span>
          ) : (
            <span className='w-8 h-8 shrink-0 rounded-full bg-gray-100 text-xs font-medium text-gray-700 flex items-center justify-center'>
              {node.priorityRank}
            </span>
          )}

          <span className='min-w-0'>
            <span className='block truncate text-[15px] font-medium text-gray-900'>{node.skill.name}</span>
            <span className='block truncate text-xs text-gray-500'>
              {node.skill.category} · Level {node.skill.difficultyLevel}
            </span>
          </span>
        </button>

        {/* Node gốc không có children -> label "Mastered" */}
        {isMastered && (
          <span className='shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'>
            <Check className='w-3 h-3' />
            Mastered
          </span>
        )}

        {/* Chỉ node có children mới có toggle */}
        {hasChildren && (
          <ToggleSwitch
            checked={node.isCompleted}
            label={`${node.skill.name}: ${node.isCompleted ? 'completed' : 'open'}`}
            onChange={() => onToggle(node)}
            disabled={togglingIds.includes(node.id)}
          />
        )}
      </div>

      {/* Danh sách con: trượt mở/đóng bằng LIST_ITEM (config chung), padding đặt ở phần tử con */}
      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div key='children' {...LIST_ITEM} className='overflow-hidden'>
            <div className='ml-5 mt-2 pl-4 border-l border-gray-200'>
              <SkillNodeTree nodes={node.children} {...shared} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- danh sách (đệ quy) ----------

export default function SkillNodeTree({ nodes, ...shared }: SkillNodeTreeProps) {
  return (
    <div className='space-y-2'>
      {nodes.map((node) => (
        <SkillNodeRow key={node.id} node={node} {...shared} />
      ))}
    </div>
  )
}
