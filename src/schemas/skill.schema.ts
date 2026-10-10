import { z } from 'zod'

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, 'validation.skillNameRequired').max(100, 'validation.skillNameMax'),
  category: z.string().trim().min(1, 'validation.categoryRequired').max(100, 'validation.categoryMax'),
  difficultyLevel: z
    .number({ message: 'validation.difficultySelect' })
    .int()
    .min(1, 'validation.difficultyRange')
    .max(5, 'validation.difficultyRange'),
  demandScore: z.number({ message: 'validation.demandNumber' }).min(0, 'validation.demandMin'),
})

export type CreateSkillFormValues = z.infer<typeof createSkillSchema>
