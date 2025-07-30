import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import {
  UpdateInventoryItemSchema,
  type UpdateInventoryItem,
} from "@repo/api-client/inventory";

import { inventoryItemQueryOptions } from "@/services/queries/use-inventory-item";
import { useUpdateInventoryItem } from "@/services/mutations/use-update-inventory-item";
import { useListSuppliers } from "@/services/queries/use-list-suppliers";
import FormPageLayout from "@/components/general/form-page-layout";
import { FormActionButtons, GridFormSection, ReadOnlyField, InfoSection, InfoGrid, InfoItem } from "@/components/ui/form";
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
    <FormPageLayout
      backTo="/inventory"
      backLabel="Volver a Inventario"
      title="Editar Item de Inventario"
      description={`Modifica la información de "${item.name}" (SKU: ${item.sku})`}
      formTitle="Información del Item"
      formDescription="Actualiza los detalles del producto"
    >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <GridFormSection columns={2} title="Información Básica">
              <ReadOnlyField
                label="SKU"
                value={item.sku}
                description="El SKU no se puede modificar"
                bordered
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
            </GridFormSection>

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextareaInput
                  label="Descripción"
                  placeholder="Descripción del producto (opcional)"
                />
              )}
            />

            <GridFormSection columns={2} title="Precio y Proveedor">
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
            </GridFormSection>

            <InfoSection
              title="Información de Stock"
              description="Stock actual del producto"
              variant="muted"
            >
              <InfoGrid columns={3}>
                <InfoItem
                  label="Stock Físico"
                  value={item.physicalQuantity || 0}
                />
                <InfoItem
                  label="Reservado"
                  value={item.reservedQuantity || 0}
                />
                <InfoItem
                  label="Disponible"
                  value={item.availableQuantity || 0}
                />
              </InfoGrid>
            </InfoSection>

            <FormActionButtons
              submitLabel="Actualizar Item"
              onCancel={() => navigate({ to: "/inventory" })}
            />
          </form>
    </FormPageLayout>
  );
}
