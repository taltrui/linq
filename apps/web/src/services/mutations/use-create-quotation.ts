import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { CreateQuotationPayload } from "@repo/api-client";
import { toast } from "sonner";

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: typeof CreateQuotationPayload) =>
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
