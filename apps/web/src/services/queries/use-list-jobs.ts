import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';
import { JobStatus } from '@repo/api-client';

export const jobsQueryOptions = (params?: { status?: JobStatus, clientId?: string }) => ({
  queryKey: ['jobs', params?.status, params?.clientId],
  queryFn: () => apiService.jobs.getList(params ?? {}),
});

export function useListJobs({ status, clientId }: { status?: JobStatus, clientId?: string }) {
  return useSuspenseQuery({
    ...jobsQueryOptions({ status, clientId }),
  });
}