import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";

export function useRemoveMaterialFromQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotationId, itemId }: { quotationId: string; itemId: string }) =>
      apiService.quotationMaterials.removeMaterialFromQuotation(quotationId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations", variables.quotationId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success("Material eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar el material");
    },
  });
}