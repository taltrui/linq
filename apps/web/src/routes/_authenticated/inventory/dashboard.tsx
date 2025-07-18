import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, AlertTriangle, Package, Building } from "lucide-react";

import { inventoryItemsQueryOptions } from "@/services/queries/useListInventoryItems";
import { suppliersQueryOptions } from "@/services/queries/useListSuppliers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_authenticated/inventory/dashboard")({
  loader: async () => {
    const items = await queryClient.ensureQueryData(inventoryItemsQueryOptions());
    const suppliers = await queryClient.ensureQueryData(suppliersQueryOptions());
    return { items, suppliers };
  },
  component: InventoryDashboard,
});

function InventoryDashboard() {
  const { items, suppliers } = Route.useLoaderData();

  const totalItems = items.length;
  
  const totalValue = items.reduce((sum, item) => {
    const quantity = item.physicalQuantity || 0;
    const price = parseFloat(item.unitPrice.toString());
    return sum + (quantity * price);
  }, 0);

  const lowStockItems = items.filter(item => (item.availableQuantity || 0) <= 10);
  const outOfStockItems = items.filter(item => (item.availableQuantity || 0) === 0);
  const reservedItems = items.filter(item => (item.reservedQuantity || 0) > 0);

  const topValueItems = items
    .map(item => ({
      ...item,
      totalValue: (item.physicalQuantity || 0) * parseFloat(item.unitPrice.toString()),
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  const topSuppliers = suppliers
    .sort((a, b) => ((b as any)._count?.items || 0) - ((a as any)._count?.items || 0))
    .slice(0, 5);

  const stockStatusCounts = {
    good: items.filter(item => (item.availableQuantity || 0) > 10).length,
    low: items.filter(item => (item.availableQuantity || 0) <= 10 && (item.availableQuantity || 0) > 0).length,
    out: outOfStockItems.length,
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Inventario</h1>
        <p className="text-muted-foreground">Resumen general de tu inventario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Items en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Valor del inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items con poco stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items agotados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado del Stock</CardTitle>
            <CardDescription>
              Distribución de items por estado de stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Stock Bueno</span>
                </div>
                <Badge variant="secondary">{stockStatusCounts.good}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Stock Bajo</span>
                </div>
                <Badge variant="secondary">{stockStatusCounts.low}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Sin Stock</span>
                </div>
                <Badge variant="destructive">{stockStatusCounts.out}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas Activas</CardTitle>
            <CardDescription>
              Items con stock reservado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservedItems.length > 0 ? (
                reservedItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <Badge variant="outline">{item.reservedQuantity} reservado</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay reservas activas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Items por Valor</CardTitle>
            <CardDescription>
              Items con mayor valor en inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topValueItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.physicalQuantity} x ${item.unitPrice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${item.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Proveedores</CardTitle>
            <CardDescription>
              Proveedores con más productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSuppliers.map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {supplier.contactInfo?.split('|')[0] || 'Sin contacto'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Building className="w-3 h-3 mr-1" />
                    {(supplier as any)._count?.items || 0} productos
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alerta de Stock Bajo
            </CardTitle>
            <CardDescription>
              Items que necesitan reposición
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <Badge variant={item.availableQuantity === 0 ? "destructive" : "secondary"}>
                    {item.availableQuantity} disponible
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}