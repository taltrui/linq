import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { UpdateSupplierSchema, type UpdateSupplier } from "@repo/api-client/inventory";

import { supplierQueryOptions } from "@/services/queries/useSupplier";
import { useUpdateSupplier } from "@/services/mutations/useUpdateSupplier";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/form/TextInput";
import { TextAreaInput } from "@/components/ui/form/TextAreaInput";
import { SubmitButton } from "@/components/ui/form/SubmitButton";
import { BackToButton } from "@/components/general/BackToButton";
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

  const form = useForm({
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
    validatorAdapter: zodValidator(),
    validators: {
      onChange: UpdateSupplierSchema,
    },
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/inventory/suppliers" />
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
            <form.Field
              name="name"
              children={(field) => (
                <TextInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errorMessage={field.state.meta.errors?.[0]}
                  label="Nombre del Proveedor"
                  placeholder="Ej: Proveedor ABC S.A."
                  required
                />
              )}
            />

            <form.Field
              name="contactInfo"
              children={(field) => (
                <TextAreaInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errorMessage={field.state.meta.errors?.[0]}
                  label="Información de Contacto"
                  placeholder="Email, teléfono, dirección, etc."
                  rows={3}
                />
              )}
            />

            {supplier.items && supplier.items.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Productos Asociados</h4>
                <div className="space-y-2">
                  {supplier.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.name} ({item.sku})</span>
                      <span className="text-muted-foreground">${item.unitPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <SubmitButton
                isSubmitting={updateSupplier.isPending}
                canSubmit={form.state.canSubmit}
              >
                Actualizar Proveedor
              </SubmitButton>
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