import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";

export function useCreateStockAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      itemId: string;
      quantity: number;
      reason: string;
      notes?: string;
    }) => apiService.inventory.createStockAdjustment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockAdjustments"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Ajuste de stock registrado exitosamente");
    },
    onError: () => {
      toast.error("Error al registrar el ajuste de stock");
    },
  });
}