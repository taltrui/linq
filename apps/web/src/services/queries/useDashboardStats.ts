import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const getDashboardStats = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    return {
        jobsToday: 8,
        activeWorkers: 5,
        unassignedJobs: 2,
        pendingInvoices: 3,
    };
};

export interface DashboardStats {
    jobsToday: number;
    activeWorkers: number;
    unassignedJobs: number;
    pendingInvoices: number;
}

export const dashboardStatsQueryOptions = queryOptions<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
});

export function useDashboardStats() {
    return useSuspenseQuery(dashboardStatsQueryOptions);
}