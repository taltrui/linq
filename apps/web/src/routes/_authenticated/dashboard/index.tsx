import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { jobsQueryOptions } from "@/services/queries/use-list-jobs";
import { ensureMultipleQueries } from "@/lib/query-utils";
import { useProfile } from "@/services/queries/use-profile";
import { StatisticsCards } from "@/components/dashboard/statistics-cards";
import { TodaysAppointments } from "@/components/dashboard/todays-appointments";
import { BusinessPerformance } from "@/components/dashboard/business-performance";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
  pendingComponent: () => (
    <div className="flex justify-center items-center h-full w-full">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
  loader: async () => {
    const [jobs] = await ensureMultipleQueries([jobsQueryOptions()]);
    return { jobs };
  },
});

function DashboardPage() {
  const { data } = useProfile();
  return (
    <div className="space-y-10 flex-col">
      <DashboardHeader userName={data.firstName} />
      <QuickActions />
      <StatisticsCards />
      <div className="flex gap-6">
        <div className="flex-1">
          <TodaysAppointments />
        </div>
        <div>
          <BusinessPerformance />
        </div>
      </div>
    </div>
  );
}
