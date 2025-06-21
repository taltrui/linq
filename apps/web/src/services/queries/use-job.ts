import { useSuspenseQuery } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'

export const jobQueryOptions = (jobId: string) => ({
  queryKey: ['jobs', jobId],
  queryFn: () => apiService.jobs.getById(jobId),
})

export function useJob(jobId: string) {
  return useSuspenseQuery(jobQueryOptions(jobId))
} 