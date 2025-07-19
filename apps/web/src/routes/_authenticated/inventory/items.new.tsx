import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { CreateInventoryItemSchema, type CreateInventoryItem } from "@repo/api-client/inventory";

import { useCreateInventoryItem } from "@/services/mutations/useCreateInventoryItem";
import { useListSuppliers } from "@/services/queries/useListSuppliers";
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
import { Select } from "@/components/ui/form/Select";
import { SubmitButton } from "@/components/ui/form/SubmitButton";
import { BackToButton } from "@/components/general/BackToButton";

export const Route = createFileRoute("/_authenticated/inventory/items/new")({
  component: NewInventoryItemPage,
});

function NewInventoryItemPage() {
  const navigate = useNavigate();
  const createItem = useCreateInventoryItem();
  const { data: suppliers = [] } = useListSuppliers();

  const form = useForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      unitPrice: 0,
      supplierId: "",
      initialQuantity: 0,
    } as CreateInventoryItem,
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        supplierId: value.supplierId || undefined,
        description: value.description || undefined,
        initialQuantity: value.initialQuantity || undefined,
      };
      
      createItem.mutate(submitData, {
        onSuccess: () => {
          navigate({ to: "/inventory" });
        },
      });
    },
    validators: {
      onChange: CreateInventoryItemSchema,
    },
  });

  const supplierOptions = [
    { value: "", label: "Sin proveedor" },
    ...suppliers.map((supplier) => ({
      value: supplier.id,
      label: supplier.name,
    })),
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/inventory" />
        <div>
          <h1 className="text-3xl font-bold">Nuevo Item de Inventario</h1>
          <p className="text-muted-foreground">Agrega un nuevo producto a tu inventario</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Item</CardTitle>
          <CardDescription>
            Ingresa los detalles del producto que quieres agregar al inventario
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field
                name="sku"
                children={(field) => (
                  <TextInput
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    errorMessage={field.state.meta.errors?.[0]}
                    label="SKU"
                    placeholder="Ej: PROD-001"
                    required
                  />
                )}
              />

              <form.Field
                name="name"
                children={(field) => (
                  <TextInput
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    errorMessage={field.state.meta.errors?.[0]}
                    label="Nombre"
                    placeholder="Nombre del producto"
                    required
                  />
                )}
              />
            </div>

            <form.Field
              name="description"
              children={(field) => (
                <TextAreaInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errorMessage={field.state.meta.errors?.[0]}
                  label="Descripción"
                  placeholder="Descripción del producto (opcional)"
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form.Field
                name="unitPrice"
                children={(field) => (
                  <TextInput
                    name={field.name}
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.state.value.toString()}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                    errorMessage={field.state.meta.errors?.[0]}
                    label="Precio Unitario"
                    placeholder="0.00"
                    required
                  />
                )}
              />

              <form.Field
                name="supplierId"
                children={(field) => (
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    errorMessage={field.state.meta.errors?.[0]}
                    label="Proveedor"
                    placeholder="Seleccionar proveedor"
                    options={supplierOptions}
                  />
                )}
              />

              <form.Field
                name="initialQuantity"
                children={(field) => (
                  <TextInput
                    name={field.name}
                    type="number"
                    min="0"
                    value={field.state.value?.toString() || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                    errorMessage={field.state.meta.errors?.[0]}
                    label="Cantidad Inicial"
                    placeholder="0"
                  />
                )}
              />
            </div>

            <div className="flex gap-4">
              <SubmitButton
                isSubmitting={createItem.isPending}
                canSubmit={form.state.canSubmit}
              >
                Crear Item
              </SubmitButton>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/inventory" })}
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