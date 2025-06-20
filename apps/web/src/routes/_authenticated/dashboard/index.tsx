import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { dashboardStatsQueryOptions } from '@/services/queries/useDashboardStats';
import { todaysAgendaQueryOptions } from '@/services/queries/useTodaysAgenda';
import { ensureMultipleQueries } from '@/lib/queryUtils';
import StatsGrid from './components/StatsGrid';
import TodaysAgenda from './components/TodaysAgenda';
import { useCompany } from '@/services/queries/use-company.js';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: DashboardPage,
  loader: async () => {
    const [stats, agenda] = await ensureMultipleQueries([
      dashboardStatsQueryOptions,
      todaysAgendaQueryOptions,
    ]);
    return { stats, agenda };
  },
});

function DashboardPage() {
  const { data: company } = useCompany()
  return (
    <div className="min-h-screen ">
      <div className="mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{company?.name}</h1>
            <p className="text-muted-foreground">
              A quick overview of daily operations.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 size-4" /> Create New Job
          </Button>
        </div>
        <StatsGrid />
        <TodaysAgenda />
      </div>
    </div>
  );
}
