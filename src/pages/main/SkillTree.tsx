import { GitBranch, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useMySkillTreeQuery, useToggleSkillNodeMutation, useTogglingNodeIds } from '../../hooks/skillTreeQuery'
import CategoryFilter from '../../components/layouts/skillTree/CategoryFilter'
import SkillDetailPanel from '../../components/layouts/skillTree/SkillDetailPanel'
import SkillTreeSummary from '../../components/layouts/skillTree/SkillTreeSummary'
import { ALL_CATEGORIES, filterTreeByCategory, flattenNodes } from '../../utils/skillTree'
import {
  SkeletonDetailPanel,
  SkeletonFilterChips,
  SkeletonTreeRow,
} from '../../components/layouts/skillTree/SkeletonLoader'
import SkillNodeTree from '../../components/layouts/skillTree/SkillTreeNode'
import type { SkillNode } from '../../types/api/skillTree.types'

const SKELETON_ROWS = 5

export default function SkillTreePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: response, isLoading, isError, isFetching, refetch } = useMySkillTreeQuery()
  const tree = response?.data?.data

  const { mutate: toggleNode } = useToggleSkillNodeMutation()
  const togglingIds = useTogglingNodeIds()

  const handleToggle = (node: SkillNode) => {
    if (!tree) return
    if (node.children.length === 0) return
    if (togglingIds.includes(node.id)) return
    toggleNode({ treeId: tree.treeId, nodeId: node.id })
  }

  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rootNodes = useMemo(() => tree?.nodes ?? [], [tree])
  const allNodes = useMemo(() => flattenNodes(rootNodes), [rootNodes])

  const categories = useMemo(() => [...new Set(allNodes.map((n) => n.skill.category))], [allNodes])
  const nextPriority = useMemo(
    () => allNodes.filter((n) => !n.isCompleted).sort((a, b) => a.priorityRank - b.priorityRank)[0] ?? null,
    [allNodes],
  )

  const activeCategory = categories.includes(category) ? category : ALL_CATEGORIES
  const visibleNodes = useMemo(() => filterTreeByCategory(rootNodes, activeCategory), [rootNodes, activeCategory])

  const selectedNode = allNodes.find((n) => n.id === selectedId) ?? null

  const isEmpty = !isLoading && !isError && allNodes.length === 0

  return (
    <div className='h-full overflow-y-auto [scrollbar-gutter:stable] bg-gray-50 dark:bg-[#121114] transition-colors'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-[28px] font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('skillTree.title')}</h1>
            <p className='mt-1 text-gray-500 dark:text-[#B5B1BA] text-[15px]'>
              {tree?.careerPath
                ? t('skillTree.subtitleWithPath', { path: tree.careerPath })
                : t('skillTree.subtitleDefault')}
            </p>
          </div>
        </div>

        {isError && !tree ? (
          <div className='mt-6 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center transition-colors'>
            <p className='text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>{t('skillTree.loadError')}</p>
            <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('skillTree.loadErrorHint')}</p>
            <div className='mt-5 flex items-center justify-center gap-3'>
              <button
                type='button'
                onClick={() => refetch()}
                disabled={isFetching}
                className='rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 transition cursor-pointer'
              >
                {isFetching ? t('skillTree.loading') : t('skillTree.tryAgain')}
              </button>
              <button
                type='button'
                onClick={() => navigate('/upload')}
                className='rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition cursor-pointer shadow-xs'
              >
                {t('skillTree.runAnalysis')}
              </button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className='mt-6 bg-white dark:bg-[#1A191C] border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center transition-colors'>
            <p className='text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>{t('skillTree.emptyTitle')}</p>
            <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8]'>{t('skillTree.emptyDesc')}</p>
            <button
              type='button'
              onClick={() => navigate('/upload')}
              className='mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition cursor-pointer shadow-xs'
            >
              <Sparkles className='w-4 h-4' />
              {t('skillTree.runAnalysis')}
            </button>
          </div>
        ) : (
          <>
            <div className='mt-6'>
              <SkillTreeSummary
                loading={isLoading}
                percentage={tree?.completionPercentage ?? 0}
                completed={tree?.completedCount ?? 0}
                total={tree?.totalNodes ?? 0}
                categoryCount={categories.length}
                nextPriority={nextPriority}
              />
            </div>

            <div className='mt-5'>
              {isLoading ? (
                <SkeletonFilterChips />
              ) : (
                <CategoryFilter categories={categories} active={activeCategory} onChange={setCategory} />
              )}
            </div>

            <div className='mt-5 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start'>
              <section className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors'>
                <div className='flex items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10'>
                  <div className='flex items-center gap-2'>
                    <GitBranch className='w-4 h-4 text-gray-500 dark:text-[#A29FA8]' />
                    <h2 className='text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                      {t('skillTree.dependencies')}
                    </h2>
                  </div>
                  <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-[#A29FA8]'>
                    <span className='flex items-center gap-1.5'>
                      <span className='w-2 h-2 rounded-full bg-indigo-600' />
                      {t('skillTree.completed')}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <span className='w-2 h-2 rounded-full bg-gray-300 dark:bg-white/20' />
                      {t('skillTree.open')}
                    </span>
                  </div>
                </div>

                <div className='mt-5'>
                  {isLoading ? (
                    <div className='space-y-2.5'>
                      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                        <SkeletonTreeRow key={i} />
                      ))}
                    </div>
                  ) : visibleNodes.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-gray-200 dark:border-white/10 p-8 text-center text-sm text-gray-500 dark:text-[#A29FA8]'>
                      {t('skillTree.noCategory')}
                    </div>
                  ) : (
                    <div className='space-y-2.5'>
                      <SkillNodeTree
                        nodes={visibleNodes}
                        selectedId={selectedId}
                        activeCategory={activeCategory}
                        togglingIds={togglingIds}
                        onSelect={(node) => setSelectedId((prev) => (prev === node.id ? null : node.id))}
                        onToggle={handleToggle}
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Panel chi tiết */}
              <div className='sticky top-6'>
                {isLoading ? <SkeletonDetailPanel /> : <SkillDetailPanel node={selectedNode} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
