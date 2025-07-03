import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card.js";
import { jobQueryOptions } from "@/services/queries/useJob";
import { useSuspenseQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/Badge.js";
import { formatStatus } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/jobs/$jobId")({
  loader: ({ params: { jobId }, context }) => {
    return context.queryClient.ensureQueryData(jobQueryOptions(jobId));
  },
  component: JobDetailsPage,
});

function JobDetailsPage() {
  const jobId = Route.useParams().jobId;
  const { data: job } = useSuspenseQuery(jobQueryOptions(jobId));

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription>#{job.displayId}</CardDescription>
            </div>
            <div className="text-right">
              <Badge>{formatStatus(job.status)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Descripción</h3>
            <p className="text-muted-foreground">{job.description}</p>
          </div>
          <div>
            <h3 className="font-semibold">Precio</h3>
            <p className="text-muted-foreground">
              ${parseFloat(job.price).toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Fecha de inicio</h3>
              <p className="text-muted-foreground">
                {new Date(job.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Fecha de fin</h3>
              <p className="text-muted-foreground">
                {new Date(job.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
