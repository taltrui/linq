import { useState, useMemo, useCallback } from "react";
import type { DataTableSort, DataTableFilter, DataTableColumn } from "./types";

interface UseDataTableOptions<T> {
  /** Initial data */
  data: T[];
  /** Table columns */
  columns: DataTableColumn<T>[];
  /** Initial sort */
  initialSort?: DataTableSort;
  /** Initial filters */
  initialFilters?: DataTableFilter[];
  /** Initial page size */
  initialPageSize?: number;
  /** Whether to enable client-side sorting */
  clientSideSorting?: boolean;
  /** Whether to enable client-side filtering */
  clientSideFiltering?: boolean;
  /** Whether to enable client-side pagination */
  clientSidePagination?: boolean;
}

export function useDataTable<T>({
  data,
  columns,
  initialSort,
  initialFilters = [],
  initialPageSize = 10,
  clientSideSorting = true,
  clientSideFiltering = true,
  clientSidePagination = true,
}: UseDataTableOptions<T>) {
  // State
  const [sort, setSort] = useState<DataTableSort | undefined>(initialSort);
  const [filters, setFilters] = useState<DataTableFilter[]>(initialFilters);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    () => columns.reduce((acc, col) => ({ ...acc, [col.id]: col.visible !== false }), {})
  );

  // Get column accessor value
  const getColumnValue = useCallback((row: T, column: DataTableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor];
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    if (!clientSideFiltering) return data;

    let filtered = [...data];

    // Apply global filter
    if (globalFilter) {
      const searchableColumns = columns.filter(col => 
        typeof col.accessor === "string" || col.sortable !== false
      );
      
      filtered = filtered.filter(row =>
        searchableColumns.some(column => {
          const value = getColumnValue(row, column);
          return value?.toString().toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply column filters
    filters.forEach(filter => {
      const column = columns.find(col => col.id === filter.columnId);
      if (!column) return;

      filtered = filtered.filter(row => {
        const value = getColumnValue(row, column);
        
        switch (filter.operator || "contains") {
          case "equals":
            return value === filter.value;
          case "contains":
            return value?.toString().toLowerCase().includes(filter.value.toLowerCase());
          case "startsWith":
            return value?.toString().toLowerCase().startsWith(filter.value.toLowerCase());
          case "endsWith":
            return value?.toString().toLowerCase().endsWith(filter.value.toLowerCase());
          case "gt":
            return Number(value) > Number(filter.value);
          case "gte":
            return Number(value) >= Number(filter.value);
          case "lt":
            return Number(value) < Number(filter.value);
          case "lte":
            return Number(value) <= Number(filter.value);
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [data, filters, globalFilter, columns, getColumnValue, clientSideFiltering]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!clientSideSorting || !sort) return filteredData;

    const column = columns.find(col => col.id === sort.columnId);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = getColumnValue(a, column);
      const bVal = getColumnValue(b, column);

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sort.direction === "asc" ? -1 : 1;
      if (bVal == null) return sort.direction === "asc" ? 1 : -1;

      // Compare values
      let comparison = 0;
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else {
        // Fallback to string comparison
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === "desc" ? -comparison : comparison;
    });
  }, [filteredData, sort, columns, getColumnValue, clientSideSorting]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!clientSidePagination) return sortedData;

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, clientSidePagination]);

  // Pagination info
  const pagination = useMemo(() => {
    if (!clientSidePagination) return undefined;

    return {
      page: currentPage,
      pageSize,
      total: sortedData.length,
      totalPages: Math.ceil(sortedData.length / pageSize),
      hasNextPage: (currentPage + 1) * pageSize < sortedData.length,
      hasPreviousPage: currentPage > 0,
      onPageChange: setCurrentPage,
      onPageSizeChange: (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(0);
      },
      pageSizeOptions: [10, 25, 50, 100],
    };
  }, [currentPage, pageSize, sortedData.length, clientSidePagination]);

  // Selected data
  const selectedData = useMemo(() => {
    return selectedRows.map(index => sortedData[index]);
  }, [selectedRows, sortedData]);

  // Handlers
  const handleSortChange = useCallback((newSort: DataTableSort | undefined) => {
    setSort(newSort);
  }, []);

  const handleFilterChange = useCallback((newFilters: DataTableFilter[]) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  }, []);

  const handleGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
    setCurrentPage(0); // Reset to first page when search changes
  }, []);

  const handleSelectionChange = useCallback((newSelectedRows: number[], _newSelectedData: T[]) => {
    setSelectedRows(newSelectedRows);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setGlobalFilter("");
    setCurrentPage(0);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  return {
    // Data
    data: paginatedData,
    originalData: data,
    filteredData,
    sortedData,
    
    // State
    sort,
    filters,
    globalFilter,
    selectedRows,
    selectedData,
    columnVisibility,
    pagination,
    
    // State setters
    setSort: handleSortChange,
    setFilters: handleFilterChange,
    setGlobalFilter: handleGlobalFilterChange,
    setSelectedRows: handleSelectionChange,
    setColumnVisibility,
    
    // Handlers
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onSelectionChange: handleSelectionChange,
    
    // Utilities
    clearFilters,
    clearSelection,
    
    // Stats
    totalCount: data.length,
    filteredCount: filteredData.length,
    selectedCount: selectedRows.length,
  };
}