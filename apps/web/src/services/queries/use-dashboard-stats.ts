import { queryOptions, useQuery } from "@tanstack/react-query";

interface DashboardStats {
  requests: {
    new: number;
    assessmentsComplete: number;
    overdue: number;
  };
  quotes: {
    approved: number;
    draft: number;
    changesRequested: number;
  };
  jobs: {
    requiresInvoicing: number;
    active: number;
    actionRequired: number;
  };
}

const mockDashboardStats: DashboardStats = {
  requests: {
    new: 0,
    assessmentsComplete: 0,
    overdue: 0,
  },
  quotes: {
    approved: 0,
    draft: 1,
    changesRequested: 0,
  },
  jobs: {
    requiresInvoicing: 0,
    active: 0,
    actionRequired: 0,
  },
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockDashboardStats;
}

export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

export function useDashboardStats() {
  return useQuery(dashboardStatsQueryOptions());
}