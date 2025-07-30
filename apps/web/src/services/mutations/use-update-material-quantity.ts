import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { UpdateMaterialQuantity } from "@repo/api-client/inventory";

export function useUpdateMaterialQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotationId, itemId, data }: { quotationId: string; itemId: string; data: UpdateMaterialQuantity }) =>
      apiService.quotationMaterials.updateMaterialQuantity(quotationId, itemId, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations", variables.quotationId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      
      if (result.stockWarning) {
        toast.warning(result.stockWarning.message);
      } else {
        toast.success("Cantidad actualizada exitosamente");
      }
    },
    onError: () => {
      toast.error("Error al actualizar la cantidad");
    },
  });
}