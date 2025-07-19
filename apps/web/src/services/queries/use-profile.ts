import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';

export const profileQueryOptions = queryOptions({
    queryKey: ['profile'],
    queryFn: apiService.auth.getProfile,
    retry: 1,
});

export function useProfile() {
    return useSuspenseQuery(profileQueryOptions);
}