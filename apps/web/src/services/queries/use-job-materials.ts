import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const jobMaterialsQueryOptions = (jobId: string) =>
  queryOptions({
    queryKey: ["jobs", jobId, "materials"],
    queryFn: () => apiService.jobMaterials.getJobMaterials(jobId),
  });

export function useJobMaterials(jobId: string) {
  return useQuery(jobMaterialsQueryOptions(jobId));
}