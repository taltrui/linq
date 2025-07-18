import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { CreateInventoryItem } from "@repo/api-client/inventory";

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryItem) => apiService.inventory.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "items"] });
      toast.success("Item de inventario creado exitosamente");
    },
    onError: () => {
      toast.error("Error al crear el item de inventario");
    },
  });
}