import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/apiServices/index.js";
import { type z } from "zod";
import { type RegisterSchema } from "@repo/api-client";
import { toastError, toastSuccess } from "@/lib/toast";
import type { AxiosError } from "axios";

const errorCodeToMessage = {
  USER_ALREADY_EXISTS: "User already exists",
};

type RegisterPayload = z.infer<typeof RegisterSchema>;

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => apiService.auth.register(payload),

    onSuccess: () => {
      toastSuccess(
        "Registration successful! Check your email for the magic link."
      );
    },
    onError: (error: AxiosError<{ code: string }>) => {
      toastError(
        errorCodeToMessage[
          error.response?.data.code as keyof typeof errorCodeToMessage
        ] || "An error occurred"
      );
    },
  });
}
