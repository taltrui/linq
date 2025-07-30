import { createFileRoute, Link } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { z } from "zod";
import { useRequestMagicLink } from "@/services/mutations/use-request-magic-link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/_public/")({
  component: LoginPage,
});

function LoginPage() {
  const { mutate: requestMagicLink } = useRequestMagicLink();
  const [emailSent, setEmailSent] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email(),
      }),
    },
    onSubmit: async ({ value }) => {
      requestMagicLink(
        { email: value.email },
        {
          onSuccess: () => {
            setEmailSent(true);
          },
        }
      );
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
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
        {emailSent ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 font-medium">
              Check your email!
            </div>
            <p className="text-gray-600">
              We've sent a magic link to your email address. Click the link to sign in.
            </p>
            <p className="text-sm text-gray-500">
              The link will expire in 15 minutes.
            </p>
            <Button
              variant="outline"
              onClick={() => setEmailSent(false)}
              className="mt-4"
            >
              Send another link
            </Button>
          </div>
        ) : (
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
                <field.TextInput
                  label="Email Address"
                  placeholder="you@example.com"
                  description="We'll send you a magic link to sign in"
                />
              )}
            />
            <form.AppForm>
              <form.SubmitButton label="Send magic link" className="w-full" />
            </form.AppForm>
          </form>
        )}
      </div>
    </div>
  );
}
