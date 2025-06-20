import { createFileRoute, Link } from '@tanstack/react-router';
import useAppForm from '@/lib/form';
import { useRegister } from '@/services/mutations/use-register';
import { RegisterSchema } from '@repo/api-client';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

const RegisterValidationSchema = RegisterSchema.extend({
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


export const Route = createFileRoute('/_public/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const registerMutation = useRegister();

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      companyName: '',
    },
    validators: {
      onChange: RegisterValidationSchema
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...registerData } = value;
      registerMutation.mutate(registerData);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Button variant="link" size="link" asChild>
              <Link
                to="/"
                className="font-medium text-primary hover:text-primary/90"
              >
                sign in to your account
              </Link>
            </Button>
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="flex gap-4">
            <form.AppField name="firstName" children={(field) => <field.TextInput label="First Name" placeholder="John" />} />
            <form.AppField name="lastName" children={(field) => <field.TextInput label="Last Name" placeholder="Doe" />} />
          </div>
          <form.AppField name="email" children={(field) => <field.TextInput label="Email Address" placeholder="john.doe@example.com" />} />
          <form.AppField name="companyName" children={(field) => <field.TextInput label="Company Name" placeholder="Acme Inc." />} />
          <form.AppField name="password" children={(field) => <field.TextInput label="Password" type="password" placeholder="********" description="At least 8 characters" />} />
          <form.AppField name="confirmPassword" children={(field) => <field.TextInput label="Confirm Password" type="password" placeholder="********" />} />
          <form.AppForm>
            <form.SubmitButton
              label="Create account"
              className="w-full"
            />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}