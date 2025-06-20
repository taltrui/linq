import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { useNavigate } from '@tanstack/react-router';
import { type z } from 'zod';
import { type LoginSchema } from '@repo/api-client';
import { useAuth } from '@/lib/auth';
import { toastError } from '@/lib/toast';
import type { AxiosError } from 'axios';

type LoginPayload = z.infer<typeof LoginSchema>;

export function useLogin() {
    const navigate = useNavigate();
    const auth = useAuth();

    return useMutation({
        mutationFn: (payload: LoginPayload) => apiService.auth.login(payload),

        onSuccess: (data) => {
            auth.setAccessToken(data.access_token);
            navigate({ to: '/dashboard' });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toastError(error.response?.data.message || 'An error occurred');
        }
    });
}