import { z } from 'zod'

export const RESOURCE_TYPES = ['VIDEO_COURSE', 'DOCUMENTATION', 'INTERACTIVE_LAB', 'ARTICLE'] as const

export const skillResourceSchema = z.object({
  skillId: z.string().min(1, 'Vui lòng chọn kỹ năng'),
  affiliateId: z.string().trim().optional(), // để trống thì không gửi lên BE
  resourceType: z.enum(RESOURCE_TYPES, { message: 'Vui lòng chọn loại tài nguyên' }),
  title: z.string().trim().min(3, 'Tiêu đề tối thiểu 3 ký tự').max(200, 'Tiêu đề tối đa 200 ký tự'),
  url: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập URL')
    .refine((v) => {
      try {
        const u = new URL(v)
        return u.protocol === 'http:' || u.protocol === 'https:'
      } catch {
        return false
      }
    }, 'URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)'),
  // input dùng valueAsNumber: để trống => NaN => rơi vào message bên dưới
  cost: z.number({ message: 'Vui lòng nhập chi phí' }).min(0, 'Chi phí không được âm'),
  rating: z.number({ message: 'Vui lòng nhập điểm đánh giá' }).min(0, 'Tối thiểu 0').max(5, 'Tối đa 5'),
  durationHours: z.number({ message: 'Vui lòng nhập thời lượng' }).min(0, 'Thời lượng không được âm'),
})

export type SkillResourceFormValues = z.infer<typeof skillResourceSchema>
