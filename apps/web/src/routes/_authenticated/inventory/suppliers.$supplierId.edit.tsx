import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { UpdateSupplierSchema, type UpdateSupplier } from "@repo/api-client/inventory";

import { supplierQueryOptions } from "@/services/queries/use-supplier";
import { useUpdateSupplier } from "@/services/mutations/use-update-supplier";
import FormPageLayout from "@/components/general/form-page-layout";
import { FormActionButtons } from "@/components/ui/form";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_authenticated/inventory/suppliers/$supplierId/edit")({
  loader: async ({ params }) => {
    const supplier = await queryClient.ensureQueryData(supplierQueryOptions(params.supplierId));
    return { supplier };
  },
  component: EditSupplierPage,
});

function EditSupplierPage() {
  const navigate = useNavigate();
  const { supplier } = Route.useLoaderData();
  const updateSupplier = useUpdateSupplier();

  const form = useAppForm({
    defaultValues: {
      name: supplier.name,
      contactInfo: supplier.contactInfo || "",
    } as UpdateSupplier,
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        contactInfo: value.contactInfo || undefined,
      };
      
      updateSupplier.mutate(
        { id: supplier.id, data: submitData },
        {
          onSuccess: () => {
            navigate({ to: "/inventory/suppliers" });
          },
        }
      );
    },
    validators: {
      onChange: UpdateSupplierSchema,
    },
  });

  return (
    <FormPageLayout
      backTo="/inventory/suppliers"
      backLabel="Volver a Proveedores"
      title="Editar Proveedor"
      description={`Modifica la información de "${supplier.name}"`}
      formTitle="Información del Proveedor"
      formDescription="Actualiza los detalles del proveedor"
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
              submitLabel="Actualizar Proveedor"
              onCancel={() => navigate({ to: "/inventory/suppliers" })}
            />
          </form>
    </FormPageLayout>
  );
}