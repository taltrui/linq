import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const inventoryItemsQueryOptions = () =>
  queryOptions({
    queryKey: ["inventory", "items"],
    queryFn: () => apiService.inventory.getItems(),
  });

export function useListInventoryItems() {
  return useQuery(inventoryItemsQueryOptions());
}