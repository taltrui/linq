import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { type Job } from "@repo/api-client";
import { formatStatus } from "@/lib/utils";

function JobCard({ job }: { job: Job }) {
  return (
    <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
      <Card className="p-4 hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{job.title}</p>
          <p className="text-sm text-muted-foreground">{job.displayId}</p>
        </div>
        <p className="text-sm text-muted-foreground">{formatStatus(job.status)}</p>
      </Card>
    </Link>
  )
}

export default JobCard