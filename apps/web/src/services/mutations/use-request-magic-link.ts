import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { RequestMagicLinkSchema } from "@repo/api-client";
import { z } from "zod";
import { toast } from "sonner";

type RequestMagicLinkInput = z.infer<typeof RequestMagicLinkSchema>;

export function useRequestMagicLink() {
  return useMutation({
    mutationFn: (data: RequestMagicLinkInput) =>
      apiClient.post("/auth/request-magic-link", data),
    onSuccess: () => {
      toast.success("Magic link sent! Check your email.");
    },
    onError: () => {
      toast.error("Failed to send magic link. Please try again.");
    },
  });
}
