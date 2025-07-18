import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const inventoryItemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["inventory", "items", id],
    queryFn: () => apiService.inventory.getItem(id),
  });

export function useInventoryItem(id: string) {
  return useQuery(inventoryItemQueryOptions(id));
}