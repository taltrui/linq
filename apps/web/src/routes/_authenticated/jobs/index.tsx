import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { JobStatus, type Job, type Client } from "@repo/api-client";
import { Briefcase } from "lucide-react";

import { jobsQueryOptions } from "@/services/queries/use-list-jobs";
import { clientsQueryOptions } from "@/services/queries/use-list-clients";
import { ensureMultipleQueries } from "@/lib/query-utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/select";
import { formatStatus } from "@/lib/utils";
import Badge from "@/components/ui/badge";
import BackToButton from "@/components/general/back-to-button";
import ResourceCard from "@/components/general/resource-card";
import ResourceListLayout from "@/components/general/resource-list-layout";
import EmptyState from "@/components/states/empty-state";
import { useResourceList } from "@/lib/hooks";

const jobsSearchSchema = z.object({
  status: z.enum(JobStatus.options).optional(),
  clientId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/jobs/")({
  validateSearch: jobsSearchSchema,
  loaderDeps: ({ search: { status, clientId } }) => ({ status, clientId }),
  loader: async ({ deps }) => {
    const [jobs, clients] = await ensureMultipleQueries([
      jobsQueryOptions({ status: deps.status, clientId: deps.clientId }),
      clientsQueryOptions(),
    ]);
    return { jobs, clients };
  },
  component: JobsPage,
});

function JobCard({ job }: { job: Job }) {
  return (
    <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
      <ResourceCard
        title={job.title}
        subtitle={`#${job.displayId}`}
        icon={<Briefcase className="w-5 h-5" />}
      >
        <Badge>{formatStatus(job.status)}</Badge>
      </ResourceCard>
    </Link>
  );
}

function JobsPage() {
  const { jobs, clients } = Route.useLoaderData();
  const { status, clientId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleStatusChange = (newStatus: JobStatus | "ALL") => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: newStatus === "ALL" ? undefined : newStatus,
      }),
      replace: true,
    });
  };

  const handleClientChange = (newClientId: string | "ALL") => {
    navigate({
      search: (prev) => ({
        ...prev,
        clientId: newClientId === "ALL" ? undefined : newClientId,
      }),
      replace: true,
    });
  };

  const selectedClient = clients.find((c: Client) => c.id === clientId);
  const selectedStatus = status ?? "ALL";

  const { data: filteredJobs, isEmpty } = useResourceList({
    data: jobs,
    filterConfig: {
      filters: { status, clientId },
      customFilter: (job, filters) => {
        if (filters.status && job.status !== filters.status) return false;
        if (filters.clientId && job.clientId !== filters.clientId) return false;
        return true;
      },
    },
  });

  const hasActiveFilters = Boolean(status || clientId);

  const filtersExtra = (
    <Card>
      <CardHeader>
        <CardTitle>Filtros Avanzados</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Select
          label="Estado"
          value={selectedStatus}
          onValueChange={handleStatusChange}
          options={["ALL", ...JobStatus.options].map((s) => ({
            label: formatStatus(s),
            value: s,
          }))}
          placeholder="Todos"
        />
        <div>
          <label
            htmlFor="client-filter"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Cliente
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                id="client-filter"
                className="w-[180px] justify-between"
              >
                {selectedClient ? selectedClient.name : "Todos los Clientes"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleClientChange("ALL")}>
                Todos los Clientes
              </DropdownMenuItem>
              {clients.map((c: Client) => (
                <DropdownMenuItem
                  key={c.id}
                  onSelect={() => handleClientChange(c.id)}
                >
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <BackToButton to="/dashboard" label="Volver al dashboard" />
      
      <ResourceListLayout
        title="Tus trabajos"
        description="Gestiona y monitorea el progreso de tus trabajos"
        showSearch={false}
        filterExtra={filtersExtra}
      >
        {!isEmpty ? (
          filteredJobs.map((job: Job) => <JobCard key={job.id} job={job} />)
        ) : (
          <EmptyState
            icon={<Briefcase className="w-12 h-12" />}
            title="No hay trabajos"
            description={
              hasActiveFilters
                ? "No se encontraron trabajos que coincidan con los filtros aplicados."
                : "No tienes trabajos asignados en este momento."
            }
            isSearchResult={hasActiveFilters}
          />
        )}
      </ResourceListLayout>
    </div>
  );
}
