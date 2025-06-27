import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';

export const quotationsQueryOptions = () => ({
  queryKey: ['quotations'],
  queryFn: () => apiService.quotations.getList(),
});

export function useListQuotations() {
  return useSuspenseQuery({
    ...quotationsQueryOptions(),
  });
}