import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAppForm from "@/lib/form";
import {
  CreateInventoryItemSchema,
  type CreateInventoryItem,
} from "@repo/api-client/inventory";

import { useCreateInventoryItem } from "@/services/mutations/use-create-inventory-item";
import { useListSuppliers } from "@/services/queries/use-list-suppliers";
import FormPageLayout from "@/components/general/form-page-layout";
import { FormActionButtons, GridFormSection } from "@/components/ui/form";

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
    <FormPageLayout
      backTo="/inventory"
      backLabel="Volver a Inventario"
      title="Nuevo Item de Inventario"
      description="Agrega un nuevo producto a tu inventario"
      formTitle="Información del Item"
      formDescription="Ingresa los detalles del producto que quieres agregar al inventario"
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

            <GridFormSection columns={3} title="Precio y Stock">
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
            </GridFormSection>

            <FormActionButtons
              submitLabel="Crear Item"
              onCancel={() => navigate({ to: "/inventory" })}
            />
          </form>
    </FormPageLayout>
  );
}
