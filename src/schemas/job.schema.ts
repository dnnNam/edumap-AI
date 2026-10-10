import { z } from 'zod'

export const DEFAULT_LOCATION = 'HCM'

// Cho phép để trống -> sẽ fallback về DEFAULT_LOCATION khi submit
export const jobRecommendationSchema = z.object({
  location: z
    .string()
    .trim()
    .max(100, 'validation.locationMax')
    .refine((v) => v === '' || v.length >= 2, 'validation.locationMin')
    .refine((v) => v === '' || /^[\p{L}\p{N}\s,.\-/()]+$/u.test(v), 'validation.locationChars'),
})

export type JobRecommendationFormValues = z.infer<typeof jobRecommendationSchema>

// Payload gửi lên API (location luôn có giá trị)
export interface JobRecommendationPayload {
  location: string
}
