import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";

export function useRemoveMaterialFromJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, itemId }: { jobId: string; itemId: string }) =>
      apiService.jobMaterials.removeMaterialFromJob(jobId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.jobId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Material eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar el material");
    },
  });
}