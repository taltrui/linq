import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth.js'
import useAppForm from '@/lib/form.js'
import { z } from 'zod'

export const Route = createFileRoute('/_public/')({
  component: LoginPage,
})


function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useAppForm(
    {
      defaultValues: {
        email: '',
        password: '',
      },
      validators: {
        onChange: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
      onSubmit: async ({ value }) => {
        const success = await login(value.email, value.password)
        if (success) {
          navigate({ to: '/dashboard' })
        }
      },
    }
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use admin@test.com / password
          </p>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }} className='space-y-4'>
          <form.AppField name="email" children={(field) => <field.TextInput label="Email" />} />
          <form.AppField name="password" children={(field) => <field.TextInput label="Password" type="password" />} />
          <form.AppForm>
            <form.SubmitButton label="Login" className='w-full' />
          </form.AppForm>

        </form>

      </div>
    </div>
  )
}