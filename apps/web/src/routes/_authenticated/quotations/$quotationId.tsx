import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Plus, Edit, Trash2 } from "lucide-react";

import { quotationQueryOptions } from "@/services/queries/use-quotation";
import { useQuotationMaterials } from "@/services/queries/use-quotation-materials";
import { useListInventoryItems } from "@/services/queries/use-list-inventory-items";
import { useAddMaterialToQuotation } from "@/services/mutations/use-add-material-to-quotation";
import { useUpdateMaterialQuantity } from "@/services/mutations/use-update-material-quantity";
import { useRemoveMaterialFromQuotation } from "@/services/mutations/use-remove-material-from-quotation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoSection, InfoGrid, InfoItem } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitive-select";
import BackToButton from "@/components/general/back-to-button";
import { queryClient } from "@/main";
import type { QuoteMaterial } from "@repo/api-client/inventory";

export const Route = createFileRoute("/_authenticated/quotations/$quotationId")({
  loader: async ({ params }) => {
    const quotation = await queryClient.ensureQueryData(
      quotationQueryOptions(params.quotationId)
    );
    return { quotation };
  },
  component: QuotationDetailPage,
});

function AddMaterialDialog({ quotationId }: { quotationId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const { data: inventoryItems = [] } = useListInventoryItems();
  const addMaterial = useAddMaterialToQuotation();

  const handleSubmit = () => {
    if (!selectedItemId) return;
    
    addMaterial.mutate(
      {
        quotationId,
        data: {
          itemId: selectedItemId,
          quantity,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItemId("");
          setQuantity(1);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Material</DialogTitle>
          <DialogDescription>
            Selecciona un item del inventario para agregar a la cotización
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
                    {item.name} ({item.sku}) - ${item.unitPrice}
                  </SelectItem>
                ))}
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedItemId || addMaterial.isPending}
          >
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MaterialCard({ material, quotationId }: { material: QuoteMaterial; quotationId: string }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editQuantity, setEditQuantity] = useState(material.quantity);
  
  const updateQuantity = useUpdateMaterialQuantity();
  const removeMaterial = useRemoveMaterialFromQuotation();

  const handleUpdateQuantity = () => {
    updateQuantity.mutate(
      {
        quotationId,
        itemId: material.itemId,
        data: { quantity: editQuantity },
      },
      {
        onSuccess: () => setIsEditDialogOpen(false),
      }
    );
  };

  const handleRemove = () => {
    removeMaterial.mutate(
      { quotationId, itemId: material.itemId },
      {
        onSuccess: () => setIsDeleteDialogOpen(false),
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {material.item?.name}
            </CardTitle>
            <CardDescription>
              SKU: {material.item?.sku}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Cantidad</DialogTitle>
                  <DialogDescription>
                    Actualiza la cantidad de "{material.item?.name}"
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <Label htmlFor="edit-quantity">Cantidad</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="1"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateQuantity} 
                    disabled={updateQuantity.isPending}
                  >
                    Actualizar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Eliminar Material</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres eliminar "{material.item?.name}" de la cotización?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleRemove}
                    disabled={removeMaterial.isPending}
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Cantidad</p>
            <p className="font-semibold">{material.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Precio Unitario</p>
            <p className="font-semibold">${material.unitPriceAtTimeOfQuote}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="font-semibold">
              ${(material.quantity * parseFloat(material.unitPriceAtTimeOfQuote.toString())).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuotationDetailPage() {
  const { quotation } = Route.useLoaderData();
  const { data: materials = [] } = useQuotationMaterials(quotation.id);

  const materialsTotal = materials.reduce(
    (sum, material) => sum + (material.quantity * parseFloat(material.unitPriceAtTimeOfQuote.toString())),
    0
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to="/quotations" label="Volver a Cotizaciones" />
        <div>
          <h1 className="text-3xl font-bold">{quotation.title}</h1>
          <p className="text-muted-foreground">
            Cotización #{quotation.quotationNumber} - {quotation.client.name}
          </p>
        </div>
      </div>

      <InfoSection
        title="Resumen de Cotización"
        description="Información general y totales"
        variant="bordered"
      >
        <InfoGrid columns={3}>
          <InfoItem
            label="Estado"
            value={quotation.status}
            renderValue={(value) => (
              <Badge variant={quotation.status === "PENDING" ? "default" : "secondary"}>
                {value}
              </Badge>
            )}
          />
          <InfoItem
            label="Total General"
            value={`$${quotation.totalAmount}`}
          />
          <InfoItem
            label="Total Materiales"
            value={`$${materialsTotal.toFixed(2)}`}
          />
        </InfoGrid>
      </InfoSection>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Materiales</CardTitle>
              <CardDescription>
                Items de inventario incluidos en esta cotización
              </CardDescription>
            </div>
            <AddMaterialDialog quotationId={quotation.id} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.length > 0 ? (
              materials.map((material) => (
                <MaterialCard 
                  key={material.id} 
                  material={material} 
                  quotationId={quotation.id}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay materiales</h3>
                <p className="text-muted-foreground mb-4">
                  Agrega materiales del inventario a esta cotización
                </p>
                <AddMaterialDialog quotationId={quotation.id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}