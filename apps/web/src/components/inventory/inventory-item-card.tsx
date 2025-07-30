import { Link } from "@tanstack/react-router";
import { Package, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useState } from "react";

import { type InventoryItem } from "@repo/api-client/inventory";
import { useDeleteInventoryItem } from "@/services/mutations/use-delete-inventory-item";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import ResourceCard from "@/components/general/resource-card";
import DeleteDialog from "@/components/dialogs/delete-dialog";

interface InventoryItemCardProps {
  item: InventoryItem;
}

function StockStatusIndicator({ availableQuantity }: { availableQuantity: number }) {
  const getStockStatus = () => {
    if (availableQuantity <= 5) return { color: "destructive", icon: AlertTriangle };
    if (availableQuantity <= 10) return { color: "warning", icon: TrendingDown };
    return { color: "success", icon: TrendingUp };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  return (
    <Badge variant={stockStatus.color as any} className="h-5">
      <StatusIcon className="w-3 h-3" />
    </Badge>
  );
}

function ItemMetricsGrid({ item }: { item: InventoryItem }) {
  return (
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
          <StockStatusIndicator availableQuantity={item.availableQuantity || 0} />
        </div>
      </div>
    </div>
  );
}

export function InventoryItemCard({ item }: InventoryItemCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteItem = useDeleteInventoryItem();

  const handleDelete = () => {
    deleteItem.mutate(item.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    });
  };

  const actions = (
    <>
      <Link to="/inventory/items/$itemId/edit" params={{ itemId: item.id }}>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </Link>
      <DeleteDialog
        trigger={
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        }
        entityName="Item"
        entityLabel={item.name}
        onConfirm={handleDelete}
        isLoading={deleteItem.isPending}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );

  const footer = (
    <div className="space-y-2">
      {item.description && (
        <p className="text-sm text-muted-foreground">{item.description}</p>
      )}
      {item.supplier && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Proveedor:</span> {item.supplier.name}
        </p>
      )}
    </div>
  );

  return (
    <ResourceCard
      title={item.name}
      subtitle={`SKU: ${item.sku}`}
      icon={<Package className="w-5 h-5" />}
      actions={actions}
      footer={footer}
    >
      <ItemMetricsGrid item={item} />
    </ResourceCard>
  );
}

export default InventoryItemCard;