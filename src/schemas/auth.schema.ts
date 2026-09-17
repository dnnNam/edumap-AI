import { z } from 'zod';

// Biểu thức chính quy (Regex) chuẩn để kiểm tra định dạng email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerSchema = z.object({
  email: z.string() // Chỉ để z.string() trống ở đây
    .min(1, { message: 'Email không được để trống' })
    .regex(emailRegex, { message: 'Email không đúng định dạng' }), 
  password: z.string()
    .min(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' }),
  fullName: z.string()
    .min(1, { message: 'Họ và tên không được để trống' }),
    confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Xác nhận mật khẩu không khớp',
  path: ['confirmPassword'],
});

// 1. Type dùng cho Form (Có confirmPassword)
export type RegisterFormPayload = z.infer<typeof registerSchema>;

// 2. Type dùng để gửi lên Backend (Đã loại bỏ confirmPassword)
export type RegisterApiPayload = Omit<RegisterFormPayload, 'confirmPassword'>;


export const loginSchema = z.object({
  email: z.string() // Xóa đoạn required_error
    .min(1, { message: 'Email không được để trống' })
    .regex(emailRegex, { message: 'Email không đúng định dạng' }),
  password: z.string()
    .min(1, { message: 'Mật khẩu không được để trống' })
});

export type  LoginPayload = z.infer<typeof loginSchema>;


export const forgotPasswordSchema = z.object({
  email: z.string() // Xóa đoạn required_error
    .min(1, { message: 'Email không được để trống' })
    .regex(emailRegex, { message: 'Email không đúng định dạng' })
});

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string()
    .min(1, { message: 'Mật khẩu cũ không được để trống' }),
  newPassword: z.string()
    .min(6, { message: 'Mật khẩu mới phải từ 6 ký tự trở lên' })
});

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;


export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, { message: 'Token không được để trống' }),
  newPassword: z.string()
    .min(6, { message: 'Mật khẩu mới phải từ 6 ký tự trở lên' }),
  confirmPassword: z.string()
    .min(1, { message: 'Xác nhận mật khẩu không được để trống' })
})

.refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Xác nhận mật khẩu không khớp',
  path: ['confirmPassword'], 
});

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;