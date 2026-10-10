import { z } from 'zod'

export const RESOURCE_TYPES = ['VIDEO_COURSE', 'DOCUMENTATION', 'INTERACTIVE_LAB', 'ARTICLE'] as const

export const skillResourceSchema = z.object({
  skillId: z.string().min(1, 'validation.skillRequired'),
  affiliateId: z.string().trim().optional(), // để trống thì không gửi lên BE
  resourceType: z.enum(RESOURCE_TYPES, { message: 'validation.resourceTypeRequired' }),
  title: z.string().trim().min(3, 'validation.titleMin').max(200, 'validation.titleMax'),
  url: z
    .string()
    .trim()
    .min(1, 'validation.urlRequired')
    .refine((v) => {
      try {
        const u = new URL(v)
        return u.protocol === 'http:' || u.protocol === 'https:'
      } catch {
        return false
      }
    }, 'validation.urlInvalid'),
  // input dùng valueAsNumber: để trống => NaN => rơi vào message bên dưới
  cost: z.number({ message: 'validation.costRequired' }).min(0, 'validation.costMin'),
  rating: z
    .number({ message: 'validation.ratingRequired' })
    .min(0, 'validation.ratingMin')
    .max(5, 'validation.ratingMax'),
  durationHours: z.number({ message: 'validation.durationRequired' }).min(0, 'validation.durationMin'),
})

export type SkillResourceFormValues = z.infer<typeof skillResourceSchema>
