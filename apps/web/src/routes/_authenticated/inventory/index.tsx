import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { type InventoryItem } from "@repo/api-client/inventory";
import { Package, Plus, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

import { inventoryItemsQueryOptions } from "@/services/queries/useListInventoryItems";
import { useDeleteInventoryItem } from "@/services/mutations/useDeleteInventoryItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { queryClient } from "@/main";
import { useState } from "react";

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

function InventoryItemCard({ item }: { item: InventoryItem }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteItem = useDeleteInventoryItem();

  const handleDelete = () => {
    deleteItem.mutate(item.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    });
  };

  const getStockStatus = () => {
    const available = item.availableQuantity || 0;
    const physical = item.physicalQuantity || 0;
    
    if (available <= 5) return { color: "destructive", icon: AlertTriangle };
    if (available <= 10) return { color: "warning", icon: TrendingDown };
    return { color: "success", icon: TrendingUp };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {item.name}
            </CardTitle>
            <CardDescription className="mt-1">
              <span className="font-medium">SKU:</span> {item.sku}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Link to="/inventory/items/$itemId/edit" params={{ itemId: item.id }}>
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
                  <DialogTitle>Eliminar Item</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres eliminar "{item.name}"? Esta acción no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={deleteItem.isPending}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Precio Unitario</p>
            <p className="font-semibold">${item.unitPrice}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stock Físico</p>
            <p className="font-semibold">{item.physicalQuantity || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reservado</p>
            <p className="font-semibold">{item.reservedQuantity || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Disponible</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{item.availableQuantity || 0}</p>
              <Badge variant={stockStatus.color as any} className="h-5">
                <StatusIcon className="w-3 h-3" />
              </Badge>
            </div>
          </div>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
        )}
        {item.supplier && (
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">Proveedor:</span> {item.supplier.name}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function InventoryPage() {
  const { items } = Route.useLoaderData();
  const { search } = Route.useSearch();

  const filteredItems = items.filter((item: InventoryItem) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos y stock</p>
        </div>
        <Link to="/inventory/items/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Item
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nombre, SKU, o descripción..."
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item: InventoryItem) => (
            <InventoryItemCard key={item.id} item={item} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay items de inventario</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "No se encontraron items que coincidan con tu búsqueda." : "Comienza agregando tu primer item de inventario."}
              </p>
              {!search && (
                <Link to="/inventory/items/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Item
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