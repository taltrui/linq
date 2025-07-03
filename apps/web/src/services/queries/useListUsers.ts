import { useSuspenseQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiServices/index.js';

export const usersQueryOptions = {
    queryKey: ['users'],
    queryFn: apiService.users.listCompanyUsers,
};

export function useListUsers() {
    return useSuspenseQuery(usersQueryOptions);
}   