import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import {
  UpdateInventoryItemSchema,
  type UpdateInventoryItem,
} from "@repo/api-client/inventory";

import { inventoryItemQueryOptions } from "@/services/queries/use-inventory-item";
import { useUpdateInventoryItem } from "@/services/mutations/use-update-inventory-item";
import { useListSuppliers } from "@/services/queries/use-list-suppliers";
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

export const Route = createFileRoute(
  "/_authenticated/inventory/items/$itemId/edit"
)({
  loader: async ({ params }) => {
    const item = await queryClient.ensureQueryData(
      inventoryItemQueryOptions(params.itemId)
    );
    return { item };
  },
  component: EditInventoryItemPage,
});

function EditInventoryItemPage() {
  const navigate = useNavigate();
  const { item } = Route.useLoaderData();
  const updateItem = useUpdateInventoryItem();
  const { data: suppliers = [] } = useListSuppliers();

  const form = useAppForm({
    defaultValues: {
      name: item.name,
      description: item.description || "",
      unitPrice: parseFloat(item.unitPrice.toString()),
      supplierId: item.supplierId || "none",
    } as UpdateInventoryItem,
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        supplierId: value.supplierId === "none" ? undefined : value.supplierId,
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
    { value: "none", label: "Sin proveedor" },
    ...suppliers.map((supplier) => ({
      value: supplier.id,
      label: supplier.name,
    })),
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/inventory" label="Volver a Inventario" />
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
          <CardDescription>Actualiza los detalles del producto</CardDescription>
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
                <label className="text-sm font-medium text-muted-foreground">
                  SKU
                </label>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {item.sku}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  El SKU no se puede modificar
                </p>
              </div>

              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextInput
                    label="Nombre"
                    placeholder="Nombre del producto"
                    required
                  />
                )}
              />
            </div>

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextareaInput
                  label="Descripción"
                  placeholder="Descripción del producto (opcional)"
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.AppField
                name="unitPrice"
                children={(field) => (
                  <field.TextInput
                    type="number"
                    step="0.01"
                    min="0"
                    label="Precio Unitario"
                    placeholder="0.00"
                    required
                  />
                )}
              />

              <form.AppField
                name="supplierId"
                children={(field) => (
                  <field.Select
                    label="Proveedor"
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
              <form.AppForm>
                <form.SubmitButton label="Actualizar Item" />
              </form.AppForm>
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
