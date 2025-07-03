import useAppForm from "@/lib/form";

import { useCreateClient } from "@/services/mutations/useCreateClient";
import { CreateClientSchema } from "@repo/api-client";

export function NewClientForm({
  handleSuccess,
}: {
  handleSuccess?: () => void;
}) {
  const createClientMutation = useCreateClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: null as string | null,
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
    validators: {
      onChange: CreateClientSchema,
    },
    onSubmit: async ({ value }) => {
      createClientMutation.mutate(value, {
        onSuccess: () => {
          handleSuccess?.();
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppField
        name="name"
        children={(field) => (
          <field.TextInput label="Name" placeholder="eg. John Doe" />
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
          <field.TextInput label="Phone" placeholder="eg. 123-456-7890" />
        )}
      />

      <form.AppForm>
        <form.AddressField name="address" form={form} />
      </form.AppForm>

      <form.AppForm>
        <form.SubmitButton label="Create Client" />
      </form.AppForm>
    </form>
  );
}
