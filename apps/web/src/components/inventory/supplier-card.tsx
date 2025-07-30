import { Link } from "@tanstack/react-router";
import { Building, Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";

import { type Supplier } from "@repo/api-client/inventory";
import { useDeleteSupplier } from "@/services/mutations/use-delete-supplier";
import { Button } from "@/components/ui/button";
import ResourceCard from "@/components/general/resource-card";
import DeleteDialog from "@/components/dialogs/delete-dialog";

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteSupplier = useDeleteSupplier();

  const handleDelete = () => {
    deleteSupplier.mutate(supplier.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    });
  };

  const actions = (
    <>
      <Link to="/inventory/suppliers/$supplierId/edit" params={{ supplierId: supplier.id }}>
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
        entityName="Proveedor"
        entityLabel={supplier.name}
        onConfirm={handleDelete}
        isLoading={deleteSupplier.isPending}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );

  return (
    <ResourceCard
      title={supplier.name}
      subtitle={supplier.contactInfo || undefined}
      icon={<Building className="w-5 h-5" />}
      actions={actions}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="w-4 h-4" />
        {(supplier as any)._count?.items || 0} productos
      </div>
    </ResourceCard>
  );
}

export default SupplierCard;