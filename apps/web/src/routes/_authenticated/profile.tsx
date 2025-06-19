import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';
import useAppForm from '@/lib/form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const updateProfile = async (values: { name: string }) => {
  console.log('Updating profile with:', values);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, user: { name: values.name } };
};

const changePassword = async (values: unknown) => {
  console.log('Changing password with:', values);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true };
}

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const auth = useAuth();

  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      auth.updateUser(data.user);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  const { mutate: changePasswordMutation, isPending: isChangingPassword } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error(`Failed to change password: ${error.message}`);
    }
  });


  const profileForm = useAppForm({
    defaultValues: {
      name: auth.user.name,
      email: auth.user.email,
    },
    validators: {
      onChange: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        email: z.string().email(),
      }),
    },
    onSubmit: async ({ value }) => {
      updateProfileMutation({ name: value.name });
    },
  });

  const passwordForm = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onChange: z.object({
        currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters'),
        confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
      }).refine(data => data.newPassword === data.confirmPassword, {
        message: "New passwords don't match",
        path: ['confirmPassword'],
      }),
    },
    onSubmit: async ({ value }) => {
      changePasswordMutation(value);
    }
  });

  return (
    <div className="container max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Profile Settings</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => {
              e.preventDefault();
              profileForm.handleSubmit();
            }}
              className="space-y-4"
            >
              <profileForm.AppField name="name" children={(field) => <field.TextInput label="Full Name" />} />
              <profileForm.AppField name="email" children={(field) => <field.TextInput label="Email Address" disabled />} />

              <profileForm.AppForm>
                <profileForm.SubmitButton label="Save Changes" className='w-full' />
              </profileForm.AppForm>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>For your security, we recommend using a strong password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => {
              e.preventDefault();
              passwordForm.handleSubmit();
            }}
              className="space-y-4"
            >
              <passwordForm.AppField name="currentPassword" children={(field) => <field.TextInput label="Current Password" type="password" />} />
              <passwordForm.AppField name="newPassword" children={(field) => <field.TextInput label="New Password" type="password" />} />
              <passwordForm.AppField name="confirmPassword" children={(field) => <field.TextInput label="Confirm New Password" type="password" />} />

              <passwordForm.AppForm>
                <passwordForm.SubmitButton label="Update Password" className='w-full' />
              </passwordForm.AppForm>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}