import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices/index";
import { toast } from "sonner";
import type { CreateQuotation } from "@repo/api-client";

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuotation) =>
      apiService.quotations.create(payload),
    onSuccess: () => {
      toast.success("Quotation created successfully.");
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create quotation: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });
}
