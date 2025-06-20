import { createFileRoute, Link } from '@tanstack/react-router'
import useAppForm from '@/lib/form.js'
import { z } from 'zod'
import { useLogin } from '@/services/mutations/use-login.js'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_public/')({
  component: LoginPage,
})


function LoginPage() {
  const { mutate: login } = useLogin()

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
        login({
          email: value.email,
          password: value.password,
        })
      },
    }
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Button variant="link" size="link" asChild>
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/90"
              >
                create an account
              </Link>
            </Button>
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextInput label="Email Address" placeholder="you@example.com" />
            )}
          />
          <form.AppField
            name="password"
            children={(field) => (
              <field.TextInput label="Password" type="password" />
            )}
          />
          <form.AppForm>
            <form.SubmitButton
              label="Sign in"
              className="w-full"
            />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}