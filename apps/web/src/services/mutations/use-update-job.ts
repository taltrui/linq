import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { type UpdateJob } from '@repo/api-client';
import { toast } from 'sonner';

export function useUpdateJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateJob) => apiService.jobs.update(id, payload),
    onSuccess: () => {
      toast.success('Job updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update job: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
} 