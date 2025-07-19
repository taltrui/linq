import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { AddMaterialToQuotation } from "@repo/api-client/inventory";

export function useAddMaterialToQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotationId, data }: { quotationId: string; data: AddMaterialToQuotation }) =>
      apiService.quotationMaterials.addMaterialToQuotation(quotationId, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations", variables.quotationId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      
      if (result.stockWarning) {
        toast.warning(result.stockWarning.message);
      } else {
        toast.success("Material agregado exitosamente");
      }
    },
    onError: () => {
      toast.error("Error al agregar material");
    },
  });
}