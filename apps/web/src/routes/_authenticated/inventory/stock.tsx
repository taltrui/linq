import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Plus, Minus, History, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/PrimitiveSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { useListInventoryItems } from "@/services/queries/useListInventoryItems";
import { useStockAdjustments } from "@/services/queries/useStockAdjustments";
import { useCreateStockAdjustment } from "@/services/mutations/useCreateStockAdjustment";

export const Route = createFileRoute("/_authenticated/inventory/stock")({
  component: StockManagementPage,
});

type AdjustmentType = "increase" | "decrease" | "correction";

function StockAdjustmentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("increase");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const { data: inventoryItems = [] } = useListInventoryItems();
  const createAdjustment = useCreateStockAdjustment();

  const selectedItem = inventoryItems.find(item => item.id === selectedItemId);

  const handleSubmit = () => {
    if (!selectedItemId || !reason) return;

    const adjustmentQuantity = adjustmentType === "decrease" ? -quantity : quantity;

    createAdjustment.mutate(
      {
        itemId: selectedItemId,
        quantity: adjustmentQuantity,
        reason,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItemId("");
          setAdjustmentType("increase");
          setQuantity(1);
          setReason("");
          setNotes("");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ajuste
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajuste de Stock</DialogTitle>
          <DialogDescription>
            Registra un ajuste de inventario para un item específico
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="item">Item</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar item" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedItem && (
              <p className="text-xs text-muted-foreground mt-1">
                Stock actual: {selectedItem.physicalQuantity || 0}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Tipo de Ajuste</Label>
            <Select value={adjustmentType} onValueChange={(value: AdjustmentType) => setAdjustmentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-500" />
                    Aumentar Stock
                  </div>
                </SelectItem>
                <SelectItem value="decrease">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-500" />
                    Disminuir Stock
                  </div>
                </SelectItem>
                <SelectItem value="correction">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    Corrección
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div>
            <Label htmlFor="reason">Razón</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar razón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="damaged">Producto dañado</SelectItem>
                <SelectItem value="lost">Producto perdido</SelectItem>
                <SelectItem value="found">Producto encontrado</SelectItem>
                <SelectItem value="purchase">Compra</SelectItem>
                <SelectItem value="return">Devolución</SelectItem>
                <SelectItem value="correction">Corrección de inventario</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional sobre el ajuste..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedItemId || !reason || createAdjustment.isPending}
          >
            {createAdjustment.isPending ? "Guardando..." : "Registrar Ajuste"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StockManagementPage() {
  const { data: inventoryItems = [] } = useListInventoryItems();
  const { data: adjustments = [] } = useStockAdjustments();

  const criticalStockItems = inventoryItems.filter(item => (item.availableQuantity || 0) <= 5);
  const lowStockItems = inventoryItems.filter(item => (item.availableQuantity || 0) <= 10 && (item.availableQuantity || 0) > 5);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Stock</h1>
          <p className="text-muted-foreground">Administra los niveles de inventario y transacciones</p>
        </div>
        <StockAdjustmentDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Stock Crítico
            </CardTitle>
            <CardDescription>
              Items con stock muy bajo (≤5 unidades)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalStockItems.length > 0 ? (
                criticalStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <Badge variant="destructive">
                      {item.availableQuantity || 0} disponible
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay items con stock crítico</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              Stock Bajo
            </CardTitle>
            <CardDescription>
              Items con stock bajo (6-10 unidades)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <Badge variant="secondary">
                      {item.availableQuantity || 0} disponible
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay items con stock bajo</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Ajustes
          </CardTitle>
          <CardDescription>
            Registro de todas las transacciones de stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Razón</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.length > 0 ? (
                  adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell>
                        {new Date(adjustment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{adjustment.item?.name}</p>
                          <p className="text-xs text-muted-foreground">{adjustment.item?.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={adjustment.quantity > 0 ? "default" : "destructive"}>
                          {adjustment.quantity > 0 ? "Aumento" : "Disminución"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={adjustment.quantity > 0 ? "text-green-600" : "text-red-600"}>
                          {adjustment.quantity > 0 ? "+" : ""}{adjustment.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {adjustment.notes && adjustment.notes.includes("damaged") && "Producto dañado"}
                          {adjustment.notes && adjustment.notes.includes("lost") && "Producto perdido"}
                          {adjustment.notes && adjustment.notes.includes("found") && "Producto encontrado"}
                          {adjustment.notes && adjustment.notes.includes("purchase") && "Compra"}
                          {adjustment.notes && adjustment.notes.includes("return") && "Devolución"}
                          {adjustment.notes && adjustment.notes.includes("correction") && "Corrección"}
                          {(!adjustment.notes || adjustment.notes.includes("other")) && "Otro"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground">
                          {adjustment.notes || "-"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No hay ajustes registrados</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}