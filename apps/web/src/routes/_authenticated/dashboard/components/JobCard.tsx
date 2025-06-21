import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { type Job } from "@repo/api-client";

function JobCard({ job }: { job: Job }) {
  return (
    <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
      <Card className="p-4 hover:bg-muted/50 transition-colors">
        <p className="font-semibold">{job.title}</p>
        <p className="text-sm text-muted-foreground">{job.displayId}</p>
      </Card>
    </Link>
  )
}

export default JobCard