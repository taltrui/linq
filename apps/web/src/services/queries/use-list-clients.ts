import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';

export const clientsQueryOptions = (search?: string) => ({
  queryKey: ['clients', search],
  queryFn: () => apiService.clients.getList({ search }),
});

export function useListClients({ search }: { search?: string }) {
  return useSuspenseQuery({
    ...clientsQueryOptions(search),
  });
}