import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';

export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: apiService.auth.getProfile,
        retry: 1,
    });
}