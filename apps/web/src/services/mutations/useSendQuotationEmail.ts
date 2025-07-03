import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { toast } from 'sonner';
import { z } from 'zod';
import { apiContract } from '@repo/api-client';

export function useSendQuotationEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: z.infer<typeof apiContract.quotations.sendEmail.body> }) => apiService.quotations.sendEmail(id, payload),
    onSuccess: () => {
      toast.success('Quotation email sent successfully.');
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to send quotation email: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
}