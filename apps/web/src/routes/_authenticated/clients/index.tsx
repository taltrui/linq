import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { type Client } from "@repo/api-client";

import { clientsQueryOptions } from "@/services/queries/useListClients";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { queryClient } from "@/main";

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

function ClientRow({ client }: { client: Client }) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
        <CardDescription>{client.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Phone: {client.phone}</p>
        <p className="text-sm text-muted-foreground">
          Address: {client.address}
        </p>
      </CardContent>
    </Card>
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

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link to="/clients/create">
          <Button size="lg" className="rounded-full shadow-lg">
            <Plus className="h-8 w-8" /> New Client
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name, email, or phone..."
            value={search ?? ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {clients.length > 0 ? (
          clients.map((client: Client) => (
            <ClientRow key={client.id} client={client} />
          ))
        ) : (
          <Card>
            <CardContent className="p-4">No clients found.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
