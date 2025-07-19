import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { JobStatus, type Job, type Client } from "@repo/api-client";

import { jobsQueryOptions } from "@/services/queries/use-list-jobs";
import { clientsQueryOptions } from "@/services/queries/use-list-clients";
import { ensureMultipleQueries } from "@/lib/query-utils";
import {
  Card,
  CardContent,
  CardDescription,
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

function JobRow({ job }: { job: Job }) {
  return (
    <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>#{job.displayId}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge>{formatStatus(job.status)}</Badge>
        </CardContent>
      </Card>
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

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <BackToButton to="/dashboard" label="Volver al dashboard" />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tus trabajos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
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
              Client
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  id="client-filter"
                  className="w-[180px] justify-between"
                >
                  {selectedClient ? selectedClient.name : "All Clients"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleClientChange("all")}>
                  All Clients
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

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job: Job) => <JobRow key={job.id} job={job} />)
        ) : (
          <Card>
            <CardContent className="p-4">No jobs found.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
