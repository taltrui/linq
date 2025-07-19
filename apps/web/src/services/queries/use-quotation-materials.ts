import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const quotationMaterialsQueryOptions = (quotationId: string) =>
  queryOptions({
    queryKey: ["quotations", quotationId, "materials"],
    queryFn: () => apiService.quotationMaterials.getQuotationMaterials(quotationId),
  });

export function useQuotationMaterials(quotationId: string) {
  return useQuery(quotationMaterialsQueryOptions(quotationId));
}