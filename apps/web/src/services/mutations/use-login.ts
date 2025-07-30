import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { useNavigate } from '@tanstack/react-router';
import { type z } from 'zod';
import { type LoginSchema } from '@repo/api-client';
import { useAuth } from '@/lib/auth';
import { toastError } from '@/lib/toast';
import type { AxiosError } from 'axios';

const errorCodeToMessage = {
    'USER_NOT_FOUND': 'Usuario no encontrado',
    'INVALID_CREDENTIALS': 'Credenciales invalidas',
    'USER_NOT_IN_COMPANY': 'El usuario no pertenece a ninguna empresa',
}

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
        onError: (error: AxiosError<{ code: string }>) => {
            toastError(errorCodeToMessage[error.response?.data.code as keyof typeof errorCodeToMessage] || 'An error occurred');
        }
    });
}