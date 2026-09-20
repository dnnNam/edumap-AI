import type { ApiResponse } from './auth.types'

export interface CourseGrade {
  courseName: string
  grade: string
}

export interface AcademicForm {
  universityName: string
  currentYear: number
  coreCourses: CourseGrade[]
}

// - targetRole: BẮT BUỘC ở cả 3 trường hợp
// - Academic Only: targetRole + academicForm
// - GitHub Only:   targetRole + githubUsername
// - Hybrid:        targetRole + academicForm + githubUsername
export interface GenerateSkillTreePayload {
  targetRole: string
  githubUsername?: string
  academicForm?: AcademicForm
}

// TODO: thay bằng shape thật của response từ backend (nodes, edges, ...)
export type SkillTreeData = Record<string, unknown>

export type GenerateSkillTreeResponse = ApiResponse<SkillTreeData>
