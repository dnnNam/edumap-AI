import { useMutation } from '@tanstack/react-query';
import type { LoginPayload, RegisterApiPayload } from '../schemas/auth.schema';
import { authRepo } from '../repository/auth.repo';


export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterApiPayload) => authRepo.register(data),
    // Bạn có thể để trống onSuccess/onError ở đây nếu muốn UI tự xử lý
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authRepo.login(data),
  });
};