import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { type Client } from "@repo/api-client";
import { Users } from "lucide-react";

import { clientsQueryOptions } from "@/services/queries/use-list-clients";
import { queryClient } from "@/main";
import { NewClient } from "@/components/general/new-client";
import ResourceCard from "@/components/general/resource-card";
import ResourceListLayout from "@/components/general/resource-list-layout";
import EmptyState from "@/components/states/empty-state";
import { useResourceList } from "@/lib/hooks";

const clientsSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/clients/")({
  validateSearch: clientsSearchSchema,
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({ deps }) => {
    const clients = await queryClient.ensureQueryData(
      clientsQueryOptions(deps.search)
    );
    return { clients };
  },
  component: ClientsPage,
});

function ClientCard({ client }: { client: Client }) {
  const addressText = client.address 
    ? `${client.address.street}, ${client.address.city}, ${client.address.state} ${client.address.zipCode}`
    : "Sin dirección";

  return (
    <ResourceCard
      title={client.name}
      subtitle={client.email}
      icon={<Users className="w-5 h-5" />}
    >
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Teléfono:</span> {client.phone || "No especificado"}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Dirección:</span> {addressText}
        </p>
      </div>
    </ResourceCard>
  );
}

function ClientsPage() {
  const { clients } = Route.useLoaderData();
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

  const { data: filteredClients, isEmpty, isSearching } = useResourceList({
    data: clients,
    filterConfig: {
      search,
      searchFields: ['name', 'email', 'phone'],
    },
  });

  return (
    <ResourceListLayout
      title="Clientes"
      description="Gestiona tus clientes y contactos"
      createAction={<NewClient />}
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar por nombre, email, o teléfono..."
    >
      {!isEmpty ? (
        filteredClients.map((client: Client) => (
          <ClientCard key={client.id} client={client} />
        ))
      ) : (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="No hay clientes"
          description={
            isSearching
              ? "No se encontraron clientes que coincidan con tu búsqueda."
              : "Comienza agregando tu primer cliente."
          }
          isSearchResult={isSearching}
          action={!isSearching ? {
            label: "Crear Primer Cliente",
            onClick: () => {
              // The NewClient component handles the creation
              (document.querySelector('[data-new-client]') as HTMLElement)?.click();
            },
            icon: <Users className="w-4 h-4 mr-2" />,
          } : undefined}
        />
      )}
    </ResourceListLayout>
  );
}
