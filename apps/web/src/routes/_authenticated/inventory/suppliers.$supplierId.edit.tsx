import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { UpdateSupplierSchema, type UpdateSupplier } from "@repo/api-client/inventory";

import { supplierQueryOptions } from "@/services/queries/use-supplier";
import { useUpdateSupplier } from "@/services/mutations/use-update-supplier";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackToButton from "@/components/general/back-to-button";
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
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/inventory/suppliers" label="Volver a Proveedores" />
        <div>
          <h1 className="text-3xl font-bold">Editar Proveedor</h1>
          <p className="text-muted-foreground">
            Modifica la información de "{supplier.name}"
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Proveedor</CardTitle>
          <CardDescription>
            Actualiza los detalles del proveedor
          </CardDescription>
        </CardHeader>
        <CardContent>
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


            <div className="flex gap-4">
              <form.AppForm>
                <form.SubmitButton label="Actualizar Proveedor" />
              </form.AppForm>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/inventory/suppliers" })}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}