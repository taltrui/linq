import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { type z } from 'zod';
import { type RegisterSchema } from '@repo/api-client';
import { useAuth } from '@/lib/auth';
import { toastError, toastSuccess } from '@/lib/toast';
import type { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';

const errorCodeToMessage = {
    'USER_ALREADY_EXISTS': 'El usuario ya existe',
}

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
        onError: (error: AxiosError<{ code: string }>) => {
            toastError(errorCodeToMessage[error.response?.data.code as keyof typeof errorCodeToMessage] || 'An error occurred');
        }
    });
}