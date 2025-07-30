import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface UseResourceActionsOptions {
  /** Query key to invalidate after mutations */
  queryKey: string[];
  /** Entity name for error messages */
  entityName?: string;
  /** Success callback */
  onSuccess?: () => void;
  /** Error callback */
  onError?: (error: Error) => void;
}

interface ResourceMutation<T = any> {
  mutate: (data: T, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => void;
  isPending: boolean;
  error: Error | null;
}

export function useResourceActions({
  queryKey,
  entityName = "recurso",
  onSuccess,
  onError,
}: UseResourceActionsOptions) {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const handleMutationSuccess = useCallback(() => {
    invalidateQueries();
    onSuccess?.();
  }, [invalidateQueries, onSuccess]);

  const handleMutationError = useCallback((error: Error) => {
    console.error(`Error with ${entityName}:`, error);
    onError?.(error);
  }, [entityName, onError]);

  const executeAction = useCallback(
    <T>(
      mutation: ResourceMutation<T>,
      data: T,
      options?: {
        successMessage?: string;
        errorMessage?: string;
        onActionSuccess?: () => void;
        onActionError?: (error: Error) => void;
      }
    ) => {
      return mutation.mutate(data, {
        onSuccess: () => {
          handleMutationSuccess();
          options?.onActionSuccess?.();
        },
        onError: (error: Error) => {
          handleMutationError(error);
          options?.onActionError?.(error);
        },
      });
    },
    [handleMutationSuccess, handleMutationError]
  );

  return {
    /** Execute a mutation with standard success/error handling */
    executeAction,
    /** Manually invalidate queries */
    invalidateQueries,
    /** Handle mutation success */
    handleMutationSuccess,
    /** Handle mutation error */
    handleMutationError,
  };
}

export default useResourceActions;