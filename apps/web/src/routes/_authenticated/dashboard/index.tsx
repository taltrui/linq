import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

import { jobsQueryOptions } from '@/services/queries/use-list-jobs'
import { ensureMultipleQueries } from '@/lib/queryUtils'
import JobsOverview from './-components/JobsOverview.js'
import InProgressJobs from './-components/InProgressJobs.js'
import NewJob from '@/components/general/new-job'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: DashboardPage,
  pendingComponent: () => <div className="flex justify-center items-center h-full w-full"><Loader2 className="h-8 w-8 animate-spin" /></div>,
  loader: async () => {
    const [jobs] = await ensureMultipleQueries([
      jobsQueryOptions(),
    ])
    return { jobs }
  }
})


function DashboardPage() {

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <JobsOverview />
        <InProgressJobs />

        <NewJob floating />
      </div>
    </>
  )
}
