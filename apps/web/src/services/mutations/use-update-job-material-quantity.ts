import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { UpdateJobMaterialQuantity } from "@repo/api-client/inventory";

export function useUpdateJobMaterialQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, itemId, data }: { jobId: string; itemId: string; data: UpdateJobMaterialQuantity }) =>
      apiService.jobMaterials.updateJobMaterialQuantity(jobId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.jobId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Cantidad actualizada exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar la cantidad");
    },
  });
}