import useAppForm from "@/lib/form";

import { useCreateClient } from "@/services/mutations/use-create-client";
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
      email: "",
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
          <field.TextInput label="Nombre" placeholder="Juan Perez" />
        )}
      />

      <form.AppField
        name="email"
        children={(field) => (
          <field.TextInput label="Email" placeholder="juan.perez@ejemplo.com" />
        )}
      />

      <form.AppField
        name="phone"
        children={(field) => (
          <field.TextInput label="Teléfono" placeholder="12-1456-7890" />
        )}
      />

      <form.AppForm>
        <form.AddressField name="address" form={form} />
      </form.AppForm>

      <form.AppForm>
        <form.SubmitButton label="Crear cliente" />
      </form.AppForm>
    </form>
  );
}
