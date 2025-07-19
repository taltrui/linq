import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const supplierQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["suppliers", id],
    queryFn: () => apiService.suppliers.getById(id),
  });

export function useSupplier(id: string) {
  return useQuery(supplierQueryOptions(id));
}