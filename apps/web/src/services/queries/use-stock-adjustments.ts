import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices";

export const stockAdjustmentsQueryOptions = () => ({
  queryKey: ["stockAdjustments"],
  queryFn: apiService.inventory.getStockAdjustments,
});

export function useStockAdjustments() {
  return useQuery(stockAdjustmentsQueryOptions());
}