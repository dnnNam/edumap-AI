import { z } from 'zod'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Cho phép để trống (xóa link). Nếu có giá trị thì phải là URL http/https
// và (tuỳ chọn) đúng domain của mạng xã hội tương ứng
const optionalUrl = (label: string, hosts?: string[]) =>
  z
    .string()
    .trim()
    .max(500, { message: `${label} tối đa 500 ký tự` })
    .refine(
      (value) => {
        if (value === '') return true
        try {
          const url = new URL(value)
          if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
          if (!hosts) return true
          const host = url.hostname.replace(/^www\./, '')
          return hosts.some((h) => host === h || host.endsWith(`.${h}`))
        } catch {
          return false
        }
      },
      { message: hosts ? `${label} không hợp lệ (ví dụ: https://${hosts[0]}/username)` : `${label} không hợp lệ` },
    )

export const MAX_SKILLS = 20
export const MAX_SKILL_LENGTH = 30

export const portfolioSchema = z.object({
  title: z.string().trim().max(100, { message: 'Headline tối đa 100 ký tự' }),
  bio: z.string().trim().max(500, { message: 'Bio tối đa 500 ký tự' }),
  avatarUrl: optionalUrl('Avatar URL'),
  email: z
    .string()
    .trim()
    .refine((v) => v === '' || emailRegex.test(v), { message: 'Email không đúng định dạng' }),
  facebook: optionalUrl('Link Facebook', ['facebook.com', 'fb.com']),
  linkedin: optionalUrl('Link LinkedIn', ['linkedin.com']),
  github: optionalUrl('Link GitHub', ['github.com']),
  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: 'Kỹ năng không được để trống' })
        .max(MAX_SKILL_LENGTH, { message: `Mỗi kỹ năng tối đa ${MAX_SKILL_LENGTH} ký tự` }),
    )
    .max(MAX_SKILLS, { message: `Tối đa ${MAX_SKILLS} kỹ năng` })
    .refine((arr) => new Set(arr.map((s) => s.toLowerCase())).size === arr.length, {
      message: 'Kỹ năng bị trùng',
    }),
  isPublic: z.boolean(),
})

export type PortfolioFormValues = z.infer<typeof portfolioSchema>
