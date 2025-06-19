import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { useNavigate } from '@tanstack/react-router';
import { type z } from 'zod';
import { type LoginSchema } from '@repo/api-client';

type LoginPayload = z.infer<typeof LoginSchema>;

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: LoginPayload) => apiService.auth.login(payload),

        onSuccess: (data) => {
            localStorage.setItem('auth_token', data.access_token);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            navigate({ to: '/dashboard' });
        },
        onError: (error) => {
            console.error('Error de login:', error);
        }
    });
}