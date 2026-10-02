import { z } from 'zod'

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100, 'Name is too long (max 100 characters)'),
  category: z.string().trim().min(1, 'Category is required').max(100, 'Category is too long (max 100 characters)'),
  difficultyLevel: z
    .number({ message: 'Please select a difficulty level' })
    .int()
    .min(1, 'Difficulty must be between 1 and 5')
    .max(5, 'Difficulty must be between 1 and 5'),
  demandScore: z.number({ message: 'Demand score must be a number' }).min(0, 'Demand score cannot be negative'),
})

export type CreateSkillFormValues = z.infer<typeof createSkillSchema>
