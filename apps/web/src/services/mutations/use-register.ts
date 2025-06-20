import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { useNavigate } from '@tanstack/react-router';
import { type z } from 'zod';
import { type RegisterSchema } from '@repo/api-client';
import { toast } from 'sonner';

type RegisterPayload = z.infer<typeof RegisterSchema>;

export function useRegister() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: RegisterPayload) => apiService.auth.register(payload),

        onSuccess: (data) => {
            localStorage.setItem('auth_token', data.access_token);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Registration successful! Welcome.');
            navigate({ to: '/dashboard' });
        },
        onError: (error: any) => {
            toast.error(`Registration failed: ${error.response?.data?.message || error.message}`);
        }
    });
}