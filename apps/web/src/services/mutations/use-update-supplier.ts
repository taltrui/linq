import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { UpdateSupplier } from "@repo/api-client/inventory";

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplier }) => 
      apiService.suppliers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Proveedor actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el proveedor");
    },
  });
}