import { createFileRoute } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useProfile } from "@/services/queries/useProfile";

const updateProfile = async (values: {
  firstName: string;
  lastName: string;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    user: { firstName: values.firstName, lastName: values.lastName },
  };
};

const changePassword = async (values: unknown) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
};

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile } = useProfile();

  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: updateProfile,
      onSuccess: (data) => {
        toast.success("Profile updated successfully!");
      },
      onError: (error) => {
        toast.error(`Failed to update profile: ${error.message}`);
      },
    });

  const { mutate: changePasswordMutation, isPending: isChangingPassword } =
    useMutation({
      mutationFn: changePassword,
      onSuccess: () => {
        toast.success("Password changed successfully!");
        passwordForm.reset();
      },
      onError: (error) => {
        toast.error(`Failed to change password: ${error.message}`);
      },
    });

  const profileForm = useAppForm({
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      email: profile?.email,
    },
    validators: {
      onChange: z.object({
        firstName: z
          .string()
          .min(3, "First name must be at least 3 characters"),
        lastName: z.string().min(3, "Last name must be at least 3 characters"),
        email: z.string().email(),
      }),
    },
    onSubmit: async ({ value }) => {
      updateProfileMutation({
        firstName: value.firstName,
        lastName: value.lastName,
      });
    },
  });

  const passwordForm = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z
        .object({
          currentPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
          newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters"),
          confirmPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "New passwords don't match",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      changePasswordMutation(value);
    },
  });

  return (
    <div className="container max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Profile Settings
      </h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                profileForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <profileForm.AppField
                name="firstName"
                children={(field) => (
                  <field.TextInput label="First Name" placeholder="John" />
                )}
              />
              <profileForm.AppField
                name="lastName"
                children={(field) => (
                  <field.TextInput label="Last Name" placeholder="Doe" />
                )}
              />
              <profileForm.AppField
                name="email"
                children={(field) => (
                  <field.TextInput label="Email Address" disabled />
                )}
              />

              <profileForm.AppForm>
                <profileForm.SubmitButton
                  label="Save Changes"
                  className="w-full"
                />
              </profileForm.AppForm>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              For your security, we recommend using a strong password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                passwordForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <passwordForm.AppField
                name="currentPassword"
                children={(field) => (
                  <field.TextInput label="Current Password" type="password" />
                )}
              />
              <passwordForm.AppField
                name="newPassword"
                children={(field) => (
                  <field.TextInput label="New Password" type="password" />
                )}
              />
              <passwordForm.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.TextInput
                    label="Confirm New Password"
                    type="password"
                  />
                )}
              />

              <passwordForm.AppForm>
                <passwordForm.SubmitButton
                  label="Update Password"
                  className="w-full"
                />
              </passwordForm.AppForm>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
