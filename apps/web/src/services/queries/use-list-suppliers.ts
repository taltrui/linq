import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const suppliersQueryOptions = (search?: string) =>
  queryOptions({
    queryKey: ["suppliers", { search }],
    queryFn: () => apiService.suppliers.getList({ search }),
  });

export function useListSuppliers(search?: string) {
  return useQuery(suppliersQueryOptions(search));
}