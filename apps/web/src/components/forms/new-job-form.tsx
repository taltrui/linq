
import useAppForm from '@/lib/form'

import { useListClients } from '@/services/queries/use-list-clients'
import { useCreateJob } from '@/services/mutations/use-create-job'
import { CreateJobSchema } from '@repo/api-client'

import { Button } from '@/components/ui/button'

export function NewJobForm({ handleSuccess }: { handleSuccess: () => void }) {
    const { data: clients } = useListClients({})

    const createJobMutation = useCreateJob()

    const form = useAppForm({
        defaultValues: {
            title: '',
            description: '',
            price: '',
            startDate: new Date(),
            endDate: new Date(),
            clientId: '',
        },
        validators: {
            onChange: CreateJobSchema,
        },
        onSubmit: async ({ value }) => {
            createJobMutation.mutate(value, {
                onSuccess: () => {
                    handleSuccess()
                },
            })
        },
    })


    return (
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
                        label="Título"
                        placeholder="ej. Reparación de la cocina"
                    />
                )}
            />

            <form.AppField
                name="description"
                children={(field) => (
                    <field.TextareaInput
                        label="Descripción"
                        placeholder="Descripción detallada del trabajo"
                    />
                )}
            />

            <form.AppField
                name="price"
                children={(field) => (
                    <field.TextInput
                        label="Precio"
                        type="number"
                        placeholder="250.00"
                    />
                )}
            />

            <form.AppField
                name="startDate"
                children={(field) => (
                    <field.DatePicker label="Fecha de inicio" />
                )}
            />

            <form.AppField
                name="clientId"
                children={(field) => (
                    <field.Select label="Cliente" options={clients.map((client) => ({ label: client.name, value: client.id }))} />
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
                        {isSubmitting ? 'Creando...' : 'Crear trabajo'}
                    </Button>
                )}
            />
        </form>
    )
} 