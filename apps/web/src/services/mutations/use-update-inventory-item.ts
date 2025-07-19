import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { UpdateInventoryItem } from "@repo/api-client/inventory";

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryItem }) => 
      apiService.inventory.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Item de inventario actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el item de inventario");
    },
  });
}