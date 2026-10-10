import { z } from 'zod'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// LƯU Ý: các `message` là KEY dịch (i18n), hiển thị bằng t(message)

// Cho phép để trống (xóa link). Nếu có giá trị thì phải là URL http/https
// và (tuỳ chọn) đúng domain của mạng xã hội tương ứng
const optionalUrl = (invalidKey: string, hosts?: string[]) =>
  z
    .string()
    .trim()
    .max(500, { message: 'validation.urlMax' })
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
      { message: invalidKey },
    )

export const MAX_SKILLS = 20
export const MAX_SKILL_LENGTH = 30

export const portfolioSchema = z.object({
  title: z.string().trim().max(100, { message: 'validation.headlineMax' }),
  bio: z.string().trim().max(500, { message: 'validation.bioMax' }),
  avatarUrl: optionalUrl('validation.avatarInvalid'),
  email: z
    .string()
    .trim()
    .refine((v) => v === '' || emailRegex.test(v), { message: 'validation.emailInvalid' }),
  facebook: optionalUrl('validation.facebookInvalid', ['facebook.com', 'fb.com']),
  linkedin: optionalUrl('validation.linkedinInvalid', ['linkedin.com']),
  github: optionalUrl('validation.githubInvalid', ['github.com']),
  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: 'validation.skillEmpty' })
        .max(MAX_SKILL_LENGTH, { message: 'validation.skillTooLong' }),
    )
    .max(MAX_SKILLS, { message: 'validation.skillsMax' })
    .refine((arr) => new Set(arr.map((s) => s.toLowerCase())).size === arr.length, {
      message: 'validation.skillsDuplicate',
    }),
  isPublic: z.boolean(),
})

export type PortfolioFormValues = z.infer<typeof portfolioSchema>
