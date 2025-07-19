import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { AdjustStock } from "@repo/api-client/inventory";

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdjustStock }) => 
      apiService.inventory.adjustStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Stock ajustado exitosamente");
    },
    onError: () => {
      toast.error("Error al ajustar el stock");
    },
  });
}