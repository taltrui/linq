import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { type UpdateQuotationPayload } from '@repo/api-client';
import { toast } from 'sonner';

export function useUpdateQuotation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuotationPayload) => apiService.quotations.update(id, payload),
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