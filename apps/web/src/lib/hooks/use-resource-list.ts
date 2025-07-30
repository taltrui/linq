import { useMemo } from "react";

interface FilterConfig<T> {
  /** Search text to filter by */
  search?: string;
  /** Fields to search in */
  searchFields?: (keyof T)[];
  /** Additional custom filters */
  filters?: Record<string, any>;
  /** Custom filter function */
  customFilter?: (item: T, filters: Record<string, any>) => boolean;
}

export interface UseResourceListOptions<T> {
  /** The data to filter */
  data: T[];
  /** Filter configuration */
  filterConfig?: FilterConfig<T>;
  /** Sort configuration */
  sortConfig?: {
    key: keyof T;
    direction: "asc" | "desc";
  };
}

export function useResourceList<T extends Record<string, any>>({
  data,
  filterConfig = {},
  sortConfig,
}: UseResourceListOptions<T>) {
  const {
    search = "",
    searchFields = [],
    filters = {},
    customFilter,
  } = filterConfig;

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (search && searchFields.length > 0) {
      const searchLower = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply custom filter
    if (customFilter) {
      result = result.filter((item) => customFilter(item, filters));
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        result = result.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === "desc" ? -comparison : comparison;
      });
    }

    return result;
  }, [data, search, searchFields, filters, customFilter, sortConfig]);

  const isEmpty = filteredAndSortedData.length === 0;
  const isSearching = Boolean(search);
  const hasFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ""
  );

  return {
    /** Filtered and sorted data */
    data: filteredAndSortedData,
    /** Whether the result is empty */
    isEmpty,
    /** Whether a search is currently active */
    isSearching,
    /** Whether any filters are applied */
    hasFilters,
    /** Total count of filtered items */
    count: filteredAndSortedData.length,
    /** Original data count */
    totalCount: data.length,
  };
}

export default useResourceList;