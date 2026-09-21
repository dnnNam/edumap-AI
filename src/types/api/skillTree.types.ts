import type { ApiResponse } from './auth.types'

// Khớp với response của GET /skill-trees/my-tree
export interface Skill {
  id: string
  name: string
  category: string
  difficultyLevel: number
  demandScore: number
  createdAt: string
}

// Node đệ quy: children cũng là SkillNode[]
export interface SkillNode {
  id: string
  skillTreeId: string
  skillId: string
  parentNodeId: string | null
  nodeLevel: number
  isVisible: boolean
  isCompleted: boolean
  priorityRank: number
  completedAt: string | null
  createdAt: string
  skill: Skill
  children: SkillNode[]
}

export interface SkillTree {
  treeId: string
  careerPath: string
  completionPercentage: number
  completedCount: number
  totalNodes: number
  nodes: SkillNode[]
}

export type SkillTreeResponse = ApiResponse<SkillTree>
