import { createFileRoute, Link } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { useRegister } from "@/services/mutations/use-register";
import { RegisterSchema } from "@repo/api-client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { NameFieldGroup } from "@/components/ui/form";
import { useState } from "react";

const RegisterValidationSchema = RegisterSchema;

export const Route = createFileRoute("/_public/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const registerMutation = useRegister();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      companyName: "",
    },
    validators: {
      onChange: RegisterValidationSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(value, {
        onSuccess: () => {
          setRegistrationSuccess(true);
        },
      });
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
        {registrationSuccess ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 font-medium">
              Registration successful!
            </div>
            <p className="text-gray-600">
              Check your email for a magic link to sign in to your new account.
            </p>
            <p className="text-sm text-gray-500">
              The link will expire in 15 minutes.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="mt-4"
            >
              Go to Sign In
            </Button>
          </div>
        ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <NameFieldGroup
            firstNameField={
              <form.AppField
                name="firstName"
                children={(field) => (
                  <field.TextInput label="First Name" placeholder="John" />
                )}
              />
            }
            lastNameField={
              <form.AppField
                name="lastName"
                children={(field) => (
                  <field.TextInput label="Last Name" placeholder="Doe" />
                )}
              />
            }
            layout="horizontal"
            responsive="sm"
          />
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextInput
                label="Email Address"
                placeholder="john.doe@example.com"
              />
            )}
          />
          <form.AppField
            name="companyName"
            children={(field) => (
              <field.TextInput label="Company Name" placeholder="Acme Inc." />
            )}
          />
          <form.AppForm>
            <form.SubmitButton label="Create account" className="w-full" />
          </form.AppForm>
        </form>
        )}
      </div>
    </div>
  );
}
