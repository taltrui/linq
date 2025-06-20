import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';

export const clientsQueryOptions = {
  queryKey: ['clients'],
  queryFn: apiService.clients.getList,
};

export function useListClients() {
  return useSuspenseQuery(clientsQueryOptions);
} 