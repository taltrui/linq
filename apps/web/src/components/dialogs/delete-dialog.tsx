import type { ReactNode } from "react";
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

interface DeleteDialogProps {
  /** Element that triggers the dialog */
  trigger: ReactNode;
  /** Name of the entity type being deleted */
  entityName: string;
  /** Specific label/name of the entity being deleted */
  entityLabel: string;
  /** Function called when delete is confirmed */
  onConfirm: () => void;
  /** Whether the delete operation is loading */
  isLoading?: boolean;
  /** Whether the dialog is open (controlled) */
  open?: boolean;
  /** Function to control dialog open state */
  onOpenChange?: (open: boolean) => void;
  /** Custom description text */
  customDescription?: string;
}

export function DeleteDialog({
  trigger,
  entityName,
  entityLabel,
  onConfirm,
  isLoading = false,
  open,
  onOpenChange,
  customDescription,
}: DeleteDialogProps) {
  const description = customDescription || 
    `¿Estás seguro de que quieres eliminar "${entityLabel}"? Esta acción no se puede deshacer.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar {entityName}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;