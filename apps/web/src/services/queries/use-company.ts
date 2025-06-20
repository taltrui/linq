import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';

export const companyQueryOptions = {
    queryKey: ['company'],
    queryFn: apiService.companies.getMe,
};

export function useCompany() {
    return useSuspenseQuery(companyQueryOptions);
}