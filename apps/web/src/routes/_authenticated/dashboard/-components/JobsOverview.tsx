import { JobStatus } from "@repo/api-client"
import { useListJobs } from "@/services/queries/use-list-jobs"
import StatusCard from "./JobStatusCard.js"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

const jobStatuses = JobStatus.options.filter(status => status !== 'IN_PROGRESS')

function JobsOverview() {
  const { data: jobs } = useListJobs({})


  const statusCounts = jobStatuses.reduce(
    (acc, status) => {
      acc[status] = jobs.filter(job => job.status === status).length
      return acc
    },
    {} as Record<JobStatus, number>,
  )

  return (
    <section>
      <div className="flex items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold">Trabajos</h2>
        <Link to="/jobs">
          <Button variant="outline">
            Ver todos
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-4">
        {jobStatuses.map(status => (
          <StatusCard key={status} status={status} count={statusCounts[status]} />
        ))}
      </div>
    </section>
  )
}

export default JobsOverview