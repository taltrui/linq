import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useAppForm from '@/lib/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { clientsQueryOptions } from '@/services/queries/use-list-clients'
import { useCreateJob } from '@/services/mutations/use-create-job'
import { CreateJobSchema, type Client } from '@repo/api-client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/jobs/create')({
    loader: async ({ context }) => {
        return context.queryClient.ensureQueryData(clientsQueryOptions())
    },
    component: CreateJobPage,
})

function CreateJobPage() {
    const clients = Route.useLoaderData()
    const navigate = useNavigate()
    const createJobMutation = useCreateJob()
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    const form = useAppForm({
        defaultValues: {
            title: '',
            description: '',
            price: '0',
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            clientId: '',
        },
        validators: {
            onChange: CreateJobSchema,
        },
        onSubmit: async ({ value }) => {
            createJobMutation.mutate(value, {
                onSuccess: () => {
                    navigate({ to: '/jobs' })
                },
            })
        },
    })

    const handleClientSelect = (client: Client) => {
        setSelectedClient(client)
        form.setFieldValue('clientId', client.id)
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New Job</CardTitle>
                    <CardDescription>
                        Fill out the form below to create a new job.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-6"
                    >
                        <form.AppField
                            name="title"
                            children={(field) => (
                                <field.TextInput
                                    label="Title"
                                    placeholder="eg. Fix the kitchen sink"
                                />
                            )}
                        />

                        <form.AppField
                            name="description"
                            children={(field) => (
                                <field.TextareaInput
                                    label="Description"
                                    placeholder="Detailed description of the job"
                                />
                            )}
                        />

                        <form.AppField
                            name="price"
                            children={(field) => (
                                <field.TextInput
                                    label="Price"
                                    type="number"
                                    placeholder="250.00"
                                />
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.AppField
                                name="startDate"
                                children={(field) => (
                                    <field.TextInput
                                        label="Start Date"
                                        type="datetime-local"
                                    />
                                )}
                            />
                            <form.AppField
                                name="endDate"
                                children={(field) => (
                                    <field.TextInput label="End Date" type="datetime-local" />
                                )}
                            />
                        </div>

                        <form.AppField
                            name="clientId"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label>Client</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                            >
                                                {selectedClient
                                                    ? selectedClient.name
                                                    : 'Select a client'}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                            {clients?.map((client: Client) => (
                                                <DropdownMenuItem
                                                    key={client.id}
                                                    onSelect={() => handleClientSelect(client)}
                                                >
                                                    {client.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {field.state.meta.errors && (
                                        <p className="text-red-500 text-sm">
                                            {field.state.meta.errors.join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Job'}
                                </Button>
                            )}
                        />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 