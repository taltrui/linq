import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { JobStatus, type Job, type Client } from '@repo/api-client'

import { jobsQueryOptions } from '@/services/queries/use-list-jobs'
import { clientsQueryOptions } from '@/services/queries/use-list-clients'
import { ensureMultipleQueries } from '@/lib/queryUtils'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const jobsSearchSchema = z.object({
    status: z.enum(JobStatus.options).optional(),
    clientId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/jobs/')({
    validateSearch: jobsSearchSchema,
    loaderDeps: ({ search: { status, clientId } }) => ({ status, clientId }),
    loader: async ({ deps }) => {
        const [jobs, clients] = await ensureMultipleQueries([
            jobsQueryOptions({ status: deps.status, clientId: deps.clientId }),
            clientsQueryOptions(),
        ])
        return { jobs, clients }
    },
    component: JobsPage,
})

function JobRow({ job }: { job: Job }) {
    return (
        <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>#{job.displayId}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Status: {job.status}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

function JobsPage() {
    const { jobs, clients } = Route.useLoaderData()
    const { status, clientId } = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const handleStatusChange = (newStatus: JobStatus | 'all') => {
        navigate({
            search: (prev) => ({
                ...prev,
                status: newStatus === 'all' ? undefined : newStatus,
            }),
            replace: true,
        })
    }

    const handleClientChange = (newClientId: string | 'all') => {
        navigate({
            search: (prev) => ({
                ...prev,
                clientId: newClientId === 'all' ? undefined : newClientId,
            }),
            replace: true,
        })
    }

    const selectedClient = clients.find((c: Client) => c.id === clientId)
    const selectedStatus = status

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Jobs</h1>
                <Link to="/jobs/create">
                    <Button size="lg" className="rounded-full shadow-lg">
                        <Plus className="h-8 w-8" /> Nuevo trabajo
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <div>
                        <label
                            htmlFor="status-filter"
                            className="block text-sm font-medium text-muted-foreground mb-1"
                        >
                            Status
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" id="status-filter" className="w-[180px] justify-between">
                                    {selectedStatus ? selectedStatus : 'All Statuses'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => handleStatusChange('all')}>
                                    All Statuses
                                </DropdownMenuItem>
                                {JobStatus.options.map((s) => (
                                    <DropdownMenuItem key={s} onSelect={() => handleStatusChange(s)}>
                                        {s}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <label
                            htmlFor="client-filter"
                            className="block text-sm font-medium text-muted-foreground mb-1"
                        >
                            Client
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" id="client-filter" className="w-[180px] justify-between">
                                    {selectedClient ? selectedClient.name : 'All Clients'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => handleClientChange('all')}>
                                    All Clients
                                </DropdownMenuItem>
                                {clients.map((c: Client) => (
                                    <DropdownMenuItem key={c.id} onSelect={() => handleClientChange(c.id)}>
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
    )
} 