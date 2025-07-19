import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices/index";
import { type CreateClient } from "@repo/api-client";
import { toast } from "sonner";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClient) => apiService.clients.create(payload),
    onSuccess: () => {
      toast.success("Client created successfully.");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create client: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });
}
