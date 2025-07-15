import { queryOptions, useQuery } from "@tanstack/react-query";

interface BusinessMetrics {
  receivables: {
    clientsOweYou: number;
    totalAmount: number;
  };
  upcomingJobs: {
    thisWeekCount: number;
    jobs: Array<{
      id: string;
      title: string;
      clientName: string;
      date: string;
    }>;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

const mockBusinessMetrics: BusinessMetrics = {
  receivables: {
    clientsOweYou: 0,
    totalAmount: 0,
  },
  upcomingJobs: {
    thisWeekCount: 0,
    jobs: [],
  },
  revenue: {
    thisMonth: 0,
    lastMonth: 0,
    growth: 0,
  },
};

async function fetchBusinessMetrics(): Promise<BusinessMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockBusinessMetrics;
}

export const businessMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ["business-metrics"],
    queryFn: fetchBusinessMetrics,
  });

export function useBusinessMetrics() {
  return useQuery(businessMetricsQueryOptions());
}