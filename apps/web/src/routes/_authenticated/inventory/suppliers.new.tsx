import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import { CreateSupplierSchema, type CreateSupplier } from "@repo/api-client/inventory";

import { useCreateSupplier } from "@/services/mutations/use-create-supplier";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackToButton from "@/components/general/back-to-button";

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
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/inventory/suppliers" label="Volver a Proveedores" />
        <div>
          <h1 className="text-3xl font-bold">Nuevo Proveedor</h1>
          <p className="text-muted-foreground">Agrega un nuevo proveedor a tu sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Proveedor</CardTitle>
          <CardDescription>
            Ingresa los detalles del proveedor que quieres agregar
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
                <form.SubmitButton label="Crear Proveedor" />
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