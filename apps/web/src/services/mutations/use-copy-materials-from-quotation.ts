import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";

export function useCopyMaterialsFromQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, quotationId }: { jobId: string; quotationId: string }) =>
      apiService.jobMaterials.copyMaterialsFromQuotation(jobId, quotationId),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.jobId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(`${result.count} materiales copiados exitosamente`);
    },
    onError: () => {
      toast.error("Error al copiar materiales");
    },
  });
}