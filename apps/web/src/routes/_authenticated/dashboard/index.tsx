import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { jobsQueryOptions } from "@/services/queries/use-list-jobs";
import { ensureMultipleQueries } from "@/lib/queryUtils";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tablero</h1>
        <p className="text-muted-foreground mt-2">
          ¡Bienvenido de vuelta! Esto es lo que está pasando con tu negocio.
        </p>
      </div>

      <QuickActions />

      <CalendarWidget />
    </div>
  );
}
