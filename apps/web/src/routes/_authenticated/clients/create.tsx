import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useAppForm from '@/lib/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCreateClient } from '@/services/mutations/use-create-client'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

const ClientFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email({ message: 'Invalid email' }).or(z.literal('')),
})

export const Route = createFileRoute('/_authenticated/clients/create')({
  component: CreateClientPage,
})

function CreateClientPage() {
  const navigate = useNavigate()
  const createClientMutation = useCreateClient()

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    validators: {
      onChange: ClientFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        email: value.email || undefined,
      }
      createClientMutation.mutate(payload, {
        onSuccess: () => {
          navigate({ to: '/clients' })
        },
      })
    },
  })

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Client</CardTitle>
          <CardDescription>
            Fill out the form below to create a new client.
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
              name="name"
              children={(field) => (
                <field.TextInput
                  label="Name"
                  placeholder="eg. John Doe"
                />
              )}
            />

            <form.AppField
              name="email"
              children={(field) => (
                <field.TextInput
                  label="Email"
                  placeholder="eg. john.doe@example.com"
                />
              )}
            />

            <form.AppField
              name="phone"
              children={(field) => (
                <field.TextInput
                  label="Phone"
                  placeholder="eg. 123-456-7890"
                />
              )}
            />

            <form.AppField
              name="address"
              children={(field) => (
                <field.TextareaInput
                  label="Address"
                  placeholder="eg. 123 Main St, Anytown, USA"
                />
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
                  {isSubmitting ? 'Creating...' : 'Create Client'}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 