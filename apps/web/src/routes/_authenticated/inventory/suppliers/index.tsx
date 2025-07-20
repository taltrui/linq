import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { type Supplier } from "@repo/api-client/inventory";
import { Building, Plus } from "lucide-react";

import { suppliersQueryOptions } from "@/services/queries/use-list-suppliers";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import EmptyState from "@/components/states/empty-state";
import SupplierCard from "@/components/inventory/supplier-card";
import ResourceListLayout from "@/components/general/resource-list-layout";
import { useResourceList } from "@/lib/hooks";

const suppliersSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/inventory/suppliers/")({
  validateSearch: suppliersSearchSchema,
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({ deps }) => {
    const suppliers = await queryClient.ensureQueryData(
      suppliersQueryOptions(deps.search)
    );
    return { suppliers };
  },
  component: SuppliersPage,
});


function SuppliersPage() {
  const { suppliers } = Route.useLoaderData();
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

  const { data: filteredSuppliers, isEmpty, isSearching } = useResourceList({
    data: suppliers,
    filterConfig: {
      search,
      searchFields: ['name', 'contactInfo'],
    },
  });

  return (
    <ResourceListLayout
      title="Proveedores"
      description="Gestiona tus proveedores y distribuidores"
      createAction={
        <Link to="/inventory/suppliers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </Link>
      }
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar proveedores..."
    >
      {!isEmpty ? (
        filteredSuppliers.map((supplier: Supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))
      ) : (
        <EmptyState
          icon={<Building className="w-12 h-12" />}
          title="No hay proveedores"
          description={
            isSearching
              ? "No se encontraron proveedores que coincidan con tu búsqueda."
              : "Comienza agregando tu primer proveedor."
          }
          isSearchResult={isSearching}
          action={!isSearching ? {
            label: "Crear Primer Proveedor",
            onClick: () => navigate({ to: "/inventory/suppliers/new" }),
            icon: <Plus className="w-4 h-4 mr-2" />,
          } : undefined}
        />
      )}
    </ResourceListLayout>
  );
}