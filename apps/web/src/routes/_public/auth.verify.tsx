import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const searchParamsSchema = z.object({
  token: z.string(),
});

export const Route = createFileRoute("/_public/auth/verify")({
  validateSearch: searchParamsSchema,
  component: VerifyMagicLink,
});

function VerifyMagicLink() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await apiClient.post("/auth/verify-magic-link", { token });
        const data = res.data as { access_token: string };

        await setAccessToken(data.access_token);
        setStatus("success");
        toast.success("Successfully signed in!");

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 1000);
      } catch {
        setStatus("error");
        toast.error("Invalid or expired magic link");
      }
    };

    verifyToken();
  }, [token, setAccessToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg text-center">
        {status === "verifying" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900">
              Verifying your magic link...
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            <p className="text-gray-600">
              You have been successfully signed in. Redirecting...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              Invalid Magic Link
            </h2>
            <p className="text-gray-600">
              This magic link is invalid or has expired. Please request a new
              one.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
