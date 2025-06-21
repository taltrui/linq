import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { jobQueryOptions } from '@/services/queries/use-job'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/jobs/$jobId')({
    loader: ({ params: { jobId } }) => {
        return {
            jobQueryOptions: jobQueryOptions(jobId),
        }
    },
    component: JobDetailsPage,
})

function JobDetailsPage() {
    const { jobQueryOptions } = Route.useLoaderData()
    const { data: job } = useSuspenseQuery(jobQueryOptions)

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
                            <p className="text-lg font-semibold">Status</p>
                            <p>{job.status}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Description</h3>
                        <p className="text-muted-foreground">{job.description}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Price</h3>
                        <p className="text-muted-foreground">${job.price.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Start Date</h3>
                            <p className="text-muted-foreground">{new Date(job.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">End Date</h3>
                            <p className="text-muted-foreground">{new Date(job.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 