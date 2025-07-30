import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { toast } from 'sonner';
import type { UpdateQuotation } from '@repo/api-client';

export function useUpdateQuotation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuotation) => apiService.quotations.update(id, payload),
    onSuccess: () => {
      toast.success('Quotation updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update quotation: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
}