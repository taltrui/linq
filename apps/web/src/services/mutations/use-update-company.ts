import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { type z } from 'zod';
import { type UpdateCompanySchema } from '@repo/api-client';
import { toast } from 'sonner';

type UpdateCompanyPayload = z.infer<typeof UpdateCompanySchema>;

export function useUpdateCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCompanyPayload) => apiService.companies.updateMe(payload),
        onSuccess: () => {
            toast.success('Company details updated successfully.');
            queryClient.invalidateQueries({ queryKey: ['company'] });
        },
        onError: (error: any) => {
            toast.error(`Failed to update company: ${error.response?.data?.message || error.message}`);
        }
    });
}