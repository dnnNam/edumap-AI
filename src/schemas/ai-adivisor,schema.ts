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
    targetRole: z.string().min(1, { message: 'validation.targetRoleRequired' }),
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
          message: 'validation.universityRequired',
        })
      }

      data.coreCourses.forEach((course, index) => {
        if (!course.courseName.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: ['coreCourses', index, 'courseName'],
            message: 'validation.courseRequired',
          })
        }
      })
    }

    if (needGithub && !data.githubUsername.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['githubUsername'],
        message: 'validation.githubRequired',
      })
    }
  })

export type AnalyzeFormValues = z.infer<typeof analyzeFormSchema>
