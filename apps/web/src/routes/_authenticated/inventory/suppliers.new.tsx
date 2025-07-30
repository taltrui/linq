import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { CreateSupplierSchema, type CreateSupplier } from "@repo/api-client/inventory";

import { useCreateSupplier } from "@/services/mutations/use-create-supplier";
import FormPageLayout from "@/components/general/form-page-layout";
import { FormActionButtons } from "@/components/ui/form";

export const Route = createFileRoute("/_authenticated/inventory/suppliers/new")({
  component: NewSupplierPage,
});

function NewSupplierPage() {
  const navigate = useNavigate();
  const createSupplier = useCreateSupplier();

  const form = useAppForm({
    defaultValues: {
      name: "",
      contactInfo: "",
    } as CreateSupplier,
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        contactInfo: value.contactInfo || undefined,
      };
      
      createSupplier.mutate(submitData, {
        onSuccess: () => {
          navigate({ to: "/inventory/suppliers" });
        },
      });
    },
    validators: {
      onChange: CreateSupplierSchema,
    },
  });

  return (
    <FormPageLayout
      backTo="/inventory/suppliers"
      backLabel="Volver a Proveedores"
      title="Nuevo Proveedor"
      description="Agrega un nuevo proveedor a tu sistema"
      formTitle="Información del Proveedor"
      formDescription="Ingresa los detalles del proveedor que quieres agregar"
    >
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
            <field.TextInput
              label="Nombre del Proveedor"
              placeholder="Ej: Proveedor ABC S.A."
              required
            />
          )}
        />

        <form.AppField
          name="contactInfo"
          children={(field) => (
            <field.TextareaInput
              label="Información de Contacto"
              placeholder="Email, teléfono, dirección, etc."
              rows={3}
            />
          )}
        />

        <FormActionButtons
          submitLabel="Crear Proveedor"
          onCancel={() => navigate({ to: "/inventory/suppliers" })}
        />
      </form>
    </FormPageLayout>
  );
}