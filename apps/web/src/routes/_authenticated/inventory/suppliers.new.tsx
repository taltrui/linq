import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { CreateSupplierSchema, type CreateSupplier } from "@repo/api-client/inventory";

import { useCreateSupplier } from "@/services/mutations/useCreateSupplier";
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

export const Route = createFileRoute("/_authenticated/inventory/suppliers/new")({
  component: NewSupplierPage,
});

function NewSupplierPage() {
  const navigate = useNavigate();
  const createSupplier = useCreateSupplier();

  const form = useForm({
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
    validatorAdapter: zodValidator(),
    validators: {
      onChange: CreateSupplierSchema,
    },
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/inventory/suppliers" />
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

            <div className="flex gap-4">
              <SubmitButton
                isSubmitting={createSupplier.isPending}
                canSubmit={form.state.canSubmit}
              >
                Crear Proveedor
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