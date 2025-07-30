import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  /** Unique identifier for the column */
  id: string;
  /** Display header text */
  header: string;
  /** Optional description for the column */
  description?: string;
  /** Accessor function or field name */
  accessor: keyof T | ((row: T) => any);
  /** Custom cell renderer */
  cell?: (value: any, row: T, index: number) => ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column can be hidden */
  hideable?: boolean;
  /** Default visibility */
  visible?: boolean;
  /** Column width */
  width?: string | number;
  /** Minimum width */
  minWidth?: string | number;
  /** Column alignment */
  align?: "left" | "center" | "right";
  /** Whether this column should be sticky */
  sticky?: "left" | "right";
  /** Column priority for responsive behavior */
  priority?: number;
}

export interface DataTableSort {
  /** Column ID to sort by */
  columnId: string;
  /** Sort direction */
  direction: "asc" | "desc";
}

export interface DataTableFilter {
  /** Column ID to filter */
  columnId: string;
  /** Filter value */
  value: any;
  /** Filter operator */
  operator?: "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte";
}

export interface DataTableAction<T> {
  /** Action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: ReactNode;
  /** Action handler */
  onClick: (row: T, index: number) => void;
  /** Whether action is disabled */
  disabled?: (row: T) => boolean;
  /** Action variant */
  variant?: "default" | "destructive" | "secondary";
  /** Whether to show in dropdown vs inline */
  placement?: "inline" | "dropdown";
}

export interface DataTableBulkAction<T> {
  /** Action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: ReactNode;
  /** Bulk action handler */
  onClick: (selectedRows: T[], selectedIndices: number[]) => void;
  /** Whether action is destructive */
  destructive?: boolean;
}

export interface DataTablePagination {
  /** Current page (0-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange: (pageSize: number) => void;
  /** Available page sizes */
  pageSizeOptions?: number[];
}

export interface DataTableState {
  /** Current sort configuration */
  sort?: DataTableSort;
  /** Current filters */
  filters: DataTableFilter[];
  /** Selected row indices */
  selectedRows: number[];
  /** Pagination state */
  pagination?: DataTablePagination;
  /** Column visibility */
  columnVisibility: Record<string, boolean>;
  /** Global search value */
  globalFilter?: string;
}

export interface DataTableProps<T> {
  /** Table data */
  data: T[];
  /** Column configuration */
  columns: DataTableColumn<T>[];
  /** Whether the table is loading */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Row actions */
  actions?: DataTableAction<T>[];
  /** Bulk actions */
  bulkActions?: DataTableBulkAction<T>[];
  /** Pagination configuration */
  pagination?: DataTablePagination;
  /** Whether to enable row selection */
  selectable?: boolean;
  /** Selection mode */
  selectionMode?: "single" | "multiple";
  /** Sort change handler */
  onSortChange?: (sort: DataTableSort | undefined) => void;
  /** Filter change handler */
  onFilterChange?: (filters: DataTableFilter[]) => void;
  /** Global filter change handler */
  onGlobalFilterChange?: (value: string) => void;
  /** Row selection change handler */
  onSelectionChange?: (selectedRows: number[], selectedData: T[]) => void;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Empty state component */
  emptyState?: ReactNode;
  /** Table caption */
  caption?: string;
  /** Table className */
  className?: string;
  /** Whether to show column toggles */
  showColumnToggle?: boolean;
  /** Whether to show pagination info */
  showPaginationInfo?: boolean;
  /** Whether to enable virtual scrolling */
  virtualScrolling?: boolean;
}