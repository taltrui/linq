import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { toast } from 'sonner';

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.jobs.delete(id),
    onSuccess: () => {
      toast.success('Job deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete job: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
} 