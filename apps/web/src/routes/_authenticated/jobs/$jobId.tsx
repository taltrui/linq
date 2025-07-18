import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Plus, Edit, Trash2, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card.js";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
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
import { jobQueryOptions } from "@/services/queries/useJob";
import { useJobMaterials } from "@/services/queries/useJobMaterials";
import { useListInventoryItems } from "@/services/queries/useListInventoryItems";
import { useListQuotations } from "@/services/queries/useListQuotations";
import { useAddMaterialToJob } from "@/services/mutations/useAddMaterialToJob";
import { useUpdateJobMaterialQuantity } from "@/services/mutations/useUpdateJobMaterialQuantity";
import { useRemoveMaterialFromJob } from "@/services/mutations/useRemoveMaterialFromJob";
import { useCopyMaterialsFromQuotation } from "@/services/mutations/useCopyMaterialsFromQuotation";
import { useSuspenseQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/Badge.js";
import { formatStatus } from "@/lib/utils";
import type { JobMaterial } from "@repo/api-client/inventory";

export const Route = createFileRoute("/_authenticated/jobs/$jobId")({
  loader: ({ params: { jobId }, context }) => {
    return context.queryClient.ensureQueryData(jobQueryOptions(jobId));
  },
  component: JobDetailsPage,
});

function AddMaterialDialog({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantityRequired, setQuantityRequired] = useState(1);
  
  const { data: inventoryItems = [] } = useListInventoryItems();
  const addMaterial = useAddMaterialToJob();

  const handleSubmit = () => {
    if (!selectedItemId) return;
    
    addMaterial.mutate(
      {
        jobId,
        data: {
          itemId: selectedItemId,
          quantityRequired,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItemId("");
          setQuantityRequired(1);
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
            Selecciona un item del inventario para agregar al trabajo
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
            <Label htmlFor="quantity">Cantidad Requerida</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantityRequired}
              onChange={(e) => setQuantityRequired(parseInt(e.target.value) || 1)}
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

function CopyMaterialsDialog({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  
  const { data: quotations = [] } = useListQuotations();
  const copyMaterials = useCopyMaterialsFromQuotation();

  const handleSubmit = () => {
    if (!selectedQuotationId) return;
    
    copyMaterials.mutate(
      {
        jobId,
        quotationId: selectedQuotationId,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedQuotationId("");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copiar de Cotización
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copiar Materiales</DialogTitle>
          <DialogDescription>
            Selecciona una cotización para copiar sus materiales a este trabajo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="quotation">Cotización</Label>
            <Select value={selectedQuotationId} onValueChange={setSelectedQuotationId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cotización" />
              </SelectTrigger>
              <SelectContent>
                {quotations.map((quotation) => (
                  <SelectItem key={quotation.id} value={quotation.id}>
                    {quotation.title} - {quotation.client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedQuotationId || copyMaterials.isPending}
          >
            Copiar Materiales
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JobMaterialCard({ material, jobId }: { material: JobMaterial; jobId: string }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quantityRequired, setQuantityRequired] = useState(material.quantityRequired);
  const [quantityUsed, setQuantityUsed] = useState(material.quantityUsed || 0);
  
  const updateQuantity = useUpdateJobMaterialQuantity();
  const removeMaterial = useRemoveMaterialFromJob();

  const handleUpdate = () => {
    updateQuantity.mutate(
      {
        jobId,
        itemId: material.itemId,
        data: { 
          quantityRequired,
          quantityUsed: quantityUsed > 0 ? quantityUsed : undefined,
        },
      },
      {
        onSuccess: () => setIsEditDialogOpen(false),
      }
    );
  };

  const handleRemove = () => {
    removeMaterial.mutate(
      { jobId, itemId: material.itemId },
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
                  <DialogTitle>Editar Material</DialogTitle>
                  <DialogDescription>
                    Actualiza las cantidades de "{material.item?.name}"
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity-required">Cantidad Requerida</Label>
                    <Input
                      id="quantity-required"
                      type="number"
                      min="1"
                      value={quantityRequired}
                      onChange={(e) => setQuantityRequired(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity-used">Cantidad Usada</Label>
                    <Input
                      id="quantity-used"
                      type="number"
                      min="0"
                      value={quantityUsed}
                      onChange={(e) => setQuantityUsed(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdate} 
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
                    ¿Estás seguro de que quieres eliminar "{material.item?.name}" del trabajo?
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Cantidad Requerida</p>
            <p className="font-semibold">{material.quantityRequired}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cantidad Usada</p>
            <p className="font-semibold">{material.quantityUsed || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JobDetailsPage() {
  const jobId = Route.useParams().jobId;
  const { data: job } = useSuspenseQuery(jobQueryOptions(jobId));
  const { data: materials = [] } = useJobMaterials(jobId);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title || `Trabajo #${job.displayId}`}</CardTitle>
              <CardDescription>#{job.displayId}</CardDescription>
            </div>
            <div className="text-right">
              <Badge>{formatStatus(job.status)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Descripción</h3>
            <p className="text-muted-foreground">{job.description || "Sin descripción"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Cliente</h3>
            <p className="text-muted-foreground">Cliente ID: {job.clientId}</p>
          </div>
          {job.startDate && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Fecha de inicio</h3>
                <p className="text-muted-foreground">
                  {new Date(job.startDate).toLocaleDateString()}
                </p>
              </div>
              {job.endDate && (
                <div>
                  <h3 className="font-semibold">Fecha de fin</h3>
                  <p className="text-muted-foreground">
                    {new Date(job.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Materiales</CardTitle>
              <CardDescription>
                Items de inventario asignados a este trabajo
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <AddMaterialDialog jobId={jobId} />
              <CopyMaterialsDialog jobId={jobId} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.length > 0 ? (
              materials.map((material) => (
                <JobMaterialCard 
                  key={material.id} 
                  material={material} 
                  jobId={jobId}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay materiales</h3>
                <p className="text-muted-foreground mb-4">
                  Agrega materiales del inventario a este trabajo
                </p>
                <div className="flex justify-center gap-2">
                  <AddMaterialDialog jobId={jobId} />
                  <CopyMaterialsDialog jobId={jobId} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
