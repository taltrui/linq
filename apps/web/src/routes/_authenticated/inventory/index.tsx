import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { type InventoryItem } from "@repo/api-client/inventory";
import { Package, Plus } from "lucide-react";

import { inventoryItemsQueryOptions } from "@/services/queries/use-list-inventory-items";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import EmptyState from "@/components/states/empty-state";
import InventoryItemCard from "@/components/inventory/inventory-item-card";
import ResourceListLayout from "@/components/general/resource-list-layout";
import { useResourceList } from "@/lib/hooks";

const inventorySearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/inventory/")({
  validateSearch: inventorySearchSchema,
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async () => {
    const items = await queryClient.ensureQueryData(inventoryItemsQueryOptions());
    return { items };
  },
  component: InventoryPage,
});


function InventoryPage() {
  const { items } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleSearchChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: value ? value : undefined,
      }),
      replace: true,
    });
  };

  const { data: filteredItems, isEmpty, isSearching } = useResourceList({
    data: items,
    filterConfig: {
      search,
      searchFields: ['name', 'sku', 'description'],
    },
  });

  return (
    <ResourceListLayout
      title="Inventario"
      description="Gestiona tus productos y stock"
      createAction={
        <Link to="/inventory/items/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Item
          </Button>
        </Link>
      }
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar por nombre, SKU, o descripción..."
    >
      {!isEmpty ? (
        filteredItems.map((item: InventoryItem) => (
          <InventoryItemCard key={item.id} item={item} />
        ))
      ) : (
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="No hay items de inventario"
          description={
            isSearching 
              ? "No se encontraron items que coincidan con tu búsqueda."
              : "Comienza agregando tu primer item de inventario."
          }
          isSearchResult={isSearching}
          action={!isSearching ? {
            label: "Crear Primer Item",
            onClick: () => navigate({ to: "/inventory/items/new" }),
            icon: <Plus className="w-4 h-4 mr-2" />,
          } : undefined}
        />
      )}
    </ResourceListLayout>
  );
}