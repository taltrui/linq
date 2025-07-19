import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';

export const quotationQueryOptions = (quotationId: string) => ({
  queryKey: ['quotations', quotationId],
  queryFn: () => apiService.quotations.getById(quotationId),
});

export function useQuotation(quotationId: string) {
  return useSuspenseQuery(quotationQueryOptions(quotationId));
}