import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiService } from "@/lib/apiServices";
import type { AddMaterialToJob } from "@repo/api-client/inventory";

export function useAddMaterialToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: AddMaterialToJob }) =>
      apiService.jobMaterials.addMaterialToJob(jobId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.jobId, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Material agregado exitosamente");
    },
    onError: () => {
      toast.error("Error al agregar material");
    },
  });
}