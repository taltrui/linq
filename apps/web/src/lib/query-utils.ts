import { queryClient } from "@/main";
import type { QueryKey, QueryOptions } from "@tanstack/react-query";

type EnsurableQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<QueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> & {
  queryKey: TQueryKey;
};

export const ensureMultipleQueries = async <
  const T extends ReadonlyArray<
    EnsurableQueryOptions<unknown, unknown, unknown, QueryKey>
  >,
>(
  queries: T
) => {
  const results = await Promise.all(
    queries.map((query) => queryClient.ensureQueryData(query))
  );
  return results as {
    [K in keyof T]: T[K] extends EnsurableQueryOptions<
      infer TData,
      unknown,
      unknown,
      QueryKey
    >
      ? TData
      : never;
  };
};
