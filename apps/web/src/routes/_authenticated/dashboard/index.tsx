import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { jobsQueryOptions } from "@/services/queries/useListJobs";
import { ensureMultipleQueries } from "@/lib/queryUtils";
import { useProfile } from "@/services/queries/useProfile";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { TodaysAppointments } from "@/components/dashboard/TodaysAppointments";
import { BusinessPerformance } from "@/components/dashboard/BusinessPerformance";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";

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
