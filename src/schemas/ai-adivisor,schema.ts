import { z } from 'zod'

export const ANALYSIS_MODES = ['ACADEMIC', 'GITHUB', 'HYBRID'] as const
export type AnalysisMode = (typeof ANALYSIS_MODES)[number]

// Schema của FORM (không phải body gửi lên API).
// Form luôn giữ đủ mọi field; field nào bắt buộc phụ thuộc vào `mode`:
//Academic: cần universityName + coreCourses
//Github:   cần githubUsername
//HYBRID:   cần cả hai
export const analyzeFormSchema = z
  .object({
    mode: z.enum(ANALYSIS_MODES),
    targetRole: z.string().min(1, { message: 'Vui lòng chọn vị trí mục tiêu' }),
    universityName: z.string(),
    currentYear: z.number(),
    coreCourses: z.array(
      z.object({
        courseName: z.string(),
        grade: z.string().min(1),
      }),
    ),
    githubUsername: z.string(),
  })
  .superRefine((data, ctx) => {
    const needAcademic = data.mode !== 'GITHUB'
    const needGithub = data.mode !== 'ACADEMIC'

    if (needAcademic) {
      if (!data.universityName.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['universityName'],
          message: 'Tên trường đại học không được để trống',
        })
      }

      data.coreCourses.forEach((course, index) => {
        if (!course.courseName.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: ['coreCourses', index, 'courseName'],
            message: 'Tên môn học không được để trống',
          })
        }
      })
    }

    if (needGithub && !data.githubUsername.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['githubUsername'],
        message: 'GitHub username không được để trống',
      })
    }
  })

export type AnalyzeFormValues = z.infer<typeof analyzeFormSchema>
