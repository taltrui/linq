import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { type UpdateClient } from '@repo/api-client';
import { toast } from 'sonner';

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClient) => apiService.clients.update(id, payload),
    onSuccess: () => {
      toast.success('Client updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update client: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
} 