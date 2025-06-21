import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import { JobStatus } from '@repo/api-client';

export const jobsQueryOptions = {
  queryKey: ['jobs'],
  queryFn: apiService.jobs.getList,
};

export function useListJobs({ status, clientId }: { status?: JobStatus, clientId?: string }) {
  return useSuspenseQuery({
    ...jobsQueryOptions,
    queryKey: ['jobs', status, clientId],
    queryFn: () => apiService.jobs.getList({ status, clientId }),
  });
}