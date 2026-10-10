import { z } from 'zod'

// LƯU Ý: các `message` bên dưới là KEY dịch (i18n), không phải câu chữ.
// Khi hiển thị lỗi phải dùng t(errors.xxx.message!) — xem LoginPage / RegisterPage.

// Biểu thức chính quy (Regex) chuẩn để kiểm tra định dạng email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'validation.emailRequired' })
      .regex(emailRegex, { message: 'validation.emailInvalid' }),
    password: z.string().min(6, { message: 'validation.passwordMin' }),
    fullName: z.string().min(1, { message: 'validation.fullNameRequired' }),
    confirmPassword: z.string().min(1, { message: 'validation.confirmRequired' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  })

// 1. Type dùng cho Form (Có confirmPassword)
export type RegisterFormPayload = z.infer<typeof registerSchema>

// 2. Type dùng để gửi lên Backend (Đã loại bỏ confirmPassword)
export type RegisterApiPayload = Omit<RegisterFormPayload, 'confirmPassword'>

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation.emailRequired' })
    .regex(emailRegex, { message: 'validation.emailInvalid' }),
  password: z.string().min(1, { message: 'validation.passwordRequired' }),
})

export type LoginPayload = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation.emailRequired' })
    .regex(emailRegex, { message: 'validation.emailInvalid' }),
})

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: 'validation.oldPasswordRequired' }),
  newPassword: z.string().min(6, { message: 'validation.newPasswordMin' }),
})

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: 'validation.tokenRequired' }),
    newPassword: z.string().min(6, { message: 'validation.newPasswordMin' }),
    confirmPassword: z.string().min(1, { message: 'validation.confirmRequired' }),
  })

  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  })

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>

export const userProfileSchema = z.object({
  fullName: z.string().min(1, { message: 'validation.fullNameRequired' }),

  universityName: z.string().min(1, { message: 'validation.universityRequired' }),

  currentYear: z
    .number()
    .int({ message: 'validation.yearInt' })
    .min(1, { message: 'validation.yearMin' })
    .max(7, { message: 'validation.yearMax' }),

  githubUsername: z.string().min(1, { message: 'validation.githubRequired' }),
})

export type UpdateProfilePayload = z.infer<typeof userProfileSchema>
