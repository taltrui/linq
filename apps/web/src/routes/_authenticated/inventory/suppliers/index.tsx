import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { type Supplier } from "@repo/api-client/inventory";
import { Building, Plus, Edit, Trash2, Package } from "lucide-react";

import { suppliersQueryOptions } from "@/services/queries/use-list-suppliers";
import { useDeleteSupplier } from "@/services/mutations/use-delete-supplier";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryClient } from "@/main";
import { useState } from "react";

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

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteSupplier = useDeleteSupplier();

  const handleDelete = () => {
    deleteSupplier.mutate(supplier.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    });
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {supplier.name}
            </CardTitle>
            {supplier.contactInfo && (
              <CardDescription className="mt-1">
                {supplier.contactInfo}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            <Link to="/inventory/suppliers/$supplierId/edit" params={{ supplierId: supplier.id }}>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Eliminar Proveedor</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres eliminar "{supplier.name}"? Esta acción no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={deleteSupplier.isPending}
                  >
                    Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          {(supplier as any)._count?.items || 0} productos
        </div>
      </CardContent>
    </Card>
  );
}

function SuppliersPage() {
  const { suppliers } = Route.useLoaderData();
  const { search } = Route.useSearch();

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tus proveedores y distribuidores</p>
        </div>
        <Link to="/inventory/suppliers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar proveedores..."
            value={search ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              window.history.replaceState(
                {},
                "",
                value ? `?search=${encodeURIComponent(value)}` : window.location.pathname
              );
            }}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {suppliers.length > 0 ? (
          suppliers.map((supplier: Supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay proveedores</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "No se encontraron proveedores que coincidan con tu búsqueda." : "Comienza agregando tu primer proveedor."}
              </p>
              {!search && (
                <Link to="/inventory/suppliers/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Proveedor
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}