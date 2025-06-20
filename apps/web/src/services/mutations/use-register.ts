import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { type z } from 'zod';
import { type RegisterSchema } from '@repo/api-client';
import { useAuth } from '@/lib/auth';
import { toastError, toastSuccess } from '@/lib/toast';
import type { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';

type RegisterPayload = z.infer<typeof RegisterSchema>;

export function useRegister() {
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (payload: RegisterPayload) => apiService.auth.register(payload),

        onSuccess: (data) => {
            setAccessToken(data.access_token);
            navigate({ to: '/dashboard' });
            toastSuccess('Registration successful! Welcome.');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toastError(error.response?.data.message || 'An error occurred');
        }
    });
}