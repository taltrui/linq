import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';

export const jobsQueryOptions = {
  queryKey: ['jobs'],
  queryFn: apiService.jobs.getList,
};

export function useListJobs() {
  return useSuspenseQuery(jobsQueryOptions);
} 