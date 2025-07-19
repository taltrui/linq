import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import {
  CreateInventoryItemSchema,
  type CreateInventoryItem,
} from "@repo/api-client/inventory";

import { useCreateInventoryItem } from "@/services/mutations/use-create-inventory-item";
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

export const Route = createFileRoute("/_authenticated/inventory/items/new")({
  component: NewInventoryItemPage,
});

function NewInventoryItemPage() {
  const navigate = useNavigate();
  const createItem = useCreateInventoryItem();
  const { data: suppliers = [] } = useListSuppliers();

  const form = useAppForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      unitPrice: 0,
      supplierId: "none",
      initialQuantity: 0,
    } as CreateInventoryItem,
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        supplierId: value.supplierId === "none" ? undefined : value.supplierId,
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
          <h1 className="text-3xl font-bold">Nuevo Item de Inventario</h1>
          <p className="text-muted-foreground">
            Agrega un nuevo producto a tu inventario
          </p>
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
              <form.AppField
                name="sku"
                children={(field) => (
                  <field.TextInput
                    label="SKU"
                    placeholder="Ej: PROD-001"
                    required
                  />
                )}
              />

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <form.AppField
                name="initialQuantity"
                children={(field) => (
                  <field.TextInput
                    type="number"
                    min="0"
                    label="Cantidad Inicial"
                    placeholder="0"
                  />
                )}
              />
            </div>

            <div className="flex gap-4">
              <form.AppForm>
                <form.SubmitButton label="Crear Item" />
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
