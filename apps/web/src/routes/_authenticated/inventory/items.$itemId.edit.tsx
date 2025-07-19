import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { UpdateInventoryItemSchema, type UpdateInventoryItem } from "@repo/api-client/inventory";

import { inventoryItemQueryOptions } from "@/services/queries/useInventoryItem";
import { useUpdateInventoryItem } from "@/services/mutations/useUpdateInventoryItem";
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
import { queryClient } from "@/main";

export const Route = createFileRoute("/_authenticated/inventory/items/$itemId/edit")({
  loader: async ({ params }) => {
    const item = await queryClient.ensureQueryData(inventoryItemQueryOptions(params.itemId));
    return { item };
  },
  component: EditInventoryItemPage,
});

function EditInventoryItemPage() {
  const navigate = useNavigate();
  const { item } = Route.useLoaderData();
  const updateItem = useUpdateInventoryItem();
  const { data: suppliers = [] } = useListSuppliers();

  const form = useForm({
    defaultValues: {
      name: item.name,
      description: item.description || "",
      unitPrice: parseFloat(item.unitPrice.toString()),
      supplierId: item.supplierId || "",
    } as UpdateInventoryItem,
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        supplierId: value.supplierId || undefined,
        description: value.description || undefined,
      };
      
      updateItem.mutate(
        { id: item.id, data: submitData },
        {
          onSuccess: () => {
            navigate({ to: "/inventory" });
          },
        }
      );
    },
    validators: {
      onChange: UpdateInventoryItemSchema,
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
          <h1 className="text-3xl font-bold">Editar Item de Inventario</h1>
          <p className="text-muted-foreground">
            Modifica la información de "{item.name}" (SKU: {item.sku})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Item</CardTitle>
          <CardDescription>
            Actualiza los detalles del producto
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
              <div>
                <label className="text-sm font-medium text-muted-foreground">SKU</label>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">{item.sku}</p>
                <p className="text-xs text-muted-foreground mt-1">El SKU no se puede modificar</p>
              </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Información de Stock</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Stock Físico:</span>
                  <p className="font-semibold">{item.physicalQuantity || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reservado:</span>
                  <p className="font-semibold">{item.reservedQuantity || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Disponible:</span>
                  <p className="font-semibold">{item.availableQuantity || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <SubmitButton
                isSubmitting={updateItem.isPending}
                canSubmit={form.state.canSubmit}
              >
                Actualizar Item
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