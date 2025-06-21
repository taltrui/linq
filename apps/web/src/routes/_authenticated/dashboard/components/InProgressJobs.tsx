import { Card } from "@/components/ui/card";
import { useListJobs } from "@/services/queries/use-list-jobs";
import JobCard from "./JobCard";

function InProgressJobs() {
  const { data: jobs } = useListJobs({ status: 'IN_PROGRESS' })
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">In Progress Jobs</h2>
      <div className="space-y-4">
        {jobs.length > 0
          ? (
            jobs.map(job => <JobCard key={job.id} job={job} />)
          )
          : (
            <Card className="p-4">
              <p>No jobs in progress.</p>
            </Card>
          )}
      </div>
    </section>
  )
}

export default InProgressJobs