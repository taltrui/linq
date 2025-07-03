import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { toast } from 'sonner';

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.clients.delete(id),
    onSuccess: () => {
      toast.success('Client deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete client: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
} 