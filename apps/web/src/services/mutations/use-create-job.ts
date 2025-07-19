import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { type CreateJob } from '@repo/api-client';
import { toast } from 'sonner';

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJob) => apiService.jobs.create(payload),
    onSuccess: () => {
      toast.success('Job created successfully.');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create job: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });
} 