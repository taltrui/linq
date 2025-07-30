import { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Badge from "@/components/ui/badge";

import type {
  DataTableProps,
  DataTableColumn,
  DataTableSort,
  DataTableAction,
} from "./types";

function TableHeaderCell<T>({
  column,
  sort,
  onSort,
}: {
  column: DataTableColumn<T>;
  sort?: DataTableSort;
  onSort?: (sort: DataTableSort | undefined) => void;
}) {
  const isSorted = sort?.columnId === column.id;
  const sortDirection = isSorted ? sort.direction : undefined;

  const handleSort = useCallback(() => {
    if (!column.sortable || !onSort) return;

    if (!isSorted) {
      onSort({ columnId: column.id, direction: "asc" });
    } else if (sortDirection === "asc") {
      onSort({ columnId: column.id, direction: "desc" });
    } else {
      onSort(undefined);
    }
  }, [column.id, column.sortable, onSort, isSorted, sortDirection]);

  return (
    <TableHead
      className={cn(
        column.align === "center" && "text-center",
        column.align === "right" && "text-right",
        column.sortable && "cursor-pointer select-none hover:bg-gray-50",
        column.sticky === "left" && "sticky left-0 bg-white z-10",
        column.sticky === "right" && "sticky right-0 bg-white z-10"
      )}
      style={{
        width: column.width,
        minWidth: column.minWidth,
      }}
      onClick={handleSort}
    >
      <div className="flex items-center gap-2">
        <span>{column.header}</span>
        {column.sortable && (
          <div className="flex flex-col">
            <ChevronUp
              className={cn(
                "h-3 w-3",
                isSorted && sortDirection === "asc"
                  ? "text-gray-900"
                  : "text-gray-400"
              )}
            />
            <ChevronDown
              className={cn(
                "h-3 w-3 -mt-1",
                isSorted && sortDirection === "desc"
                  ? "text-gray-900"
                  : "text-gray-400"
              )}
            />
          </div>
        )}
      </div>
    </TableHead>
  );
}

function TableRowActions<T>({
  actions,
  row,
  index,
}: {
  actions: DataTableAction<T>[];
  row: T;
  index: number;
}) {
  const inlineActions = actions.filter((action) => action.placement !== "dropdown");
  const dropdownActions = actions.filter((action) => action.placement === "dropdown");

  return (
    <div className="flex items-center gap-2">
      {inlineActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant || "ghost"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            action.onClick(row, index);
          }}
          disabled={action.disabled?.(row)}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
      
      {dropdownActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dropdownActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => action.onClick(row, index)}
                disabled={action.disabled?.(row)}
                className={action.variant === "destructive" ? "text-red-600" : undefined}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function BulkActionBar<T>({
  bulkActions,
  selectedRows,
  selectedData,
  onClearSelection,
}: {
  bulkActions: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedRows: T[], selectedIndices: number[]) => void;
    destructive?: boolean;
  }>;
  selectedRows: number[];
  selectedData: T[];
  onClearSelection: () => void;
}) {
  if (selectedRows.length === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-center gap-3">
        <Badge variant="secondary">
          {selectedRows.length} selected
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear selection
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {bulkActions.map((action) => (
          <Button
            key={action.id}
            variant={action.destructive ? "destructive" : "default"}
            size="sm"
            onClick={() => action.onClick(selectedData, selectedRows)}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  error,
  actions = [],
  bulkActions = [],
  selectable = false,
  selectionMode = "multiple",
  onSortChange,
  onSelectionChange,
  onRowClick,
  emptyState,
  caption,
  className,
  showColumnToggle = true,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<DataTableSort | undefined>();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    () => columns.reduce((acc, col) => ({ ...acc, [col.id]: col.visible !== false }), {})
  );

  // Visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => columnVisibility[col.id] !== false),
    [columns, columnVisibility]
  );

  // Selected data
  const selectedData = useMemo(
    () => selectedRows.map((index) => data[index]),
    [selectedRows, data]
  );

  // Handle sort
  const handleSort = useCallback((newSort: DataTableSort | undefined) => {
    setSort(newSort);
    onSortChange?.(newSort);
  }, [onSortChange]);

  // Handle selection
  const handleRowSelect = useCallback((index: number, checked: boolean) => {
    if (selectionMode === "single") {
      const newSelection = checked ? [index] : [];
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection, newSelection.map(i => data[i]));
    } else {
      const newSelection = checked
        ? [...selectedRows, index]
        : selectedRows.filter(i => i !== index);
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection, newSelection.map(i => data[i]));
    }
  }, [selectedRows, selectionMode, onSelectionChange, data]);

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelection = checked ? data.map((_, index) => index) : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection, newSelection.map(i => data[i]));
  }, [data, onSelectionChange]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedRows([]);
    onSelectionChange?.([], []);
  }, [onSelectionChange]);

  // Render cell content
  const renderCell = useCallback((column: DataTableColumn<T>, row: T, index: number) => {
    let value: any;
    
    if (typeof column.accessor === "function") {
      value = column.accessor(row);
    } else {
      value = row[column.accessor];
    }

    if (column.cell) {
      return column.cell(value, row, index);
    }

    return value?.toString() || "—";
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return emptyState;
  }

  const hasActions = actions.length > 0;
  const hasBulkActions = bulkActions.length > 0 && selectable;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Bulk actions bar */}
      {hasBulkActions && (
        <BulkActionBar
          bulkActions={bulkActions}
          selectedRows={selectedRows}
          selectedData={selectedData}
          onClearSelection={clearSelection}
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          {caption && <caption className="text-sm text-muted-foreground p-4">{caption}</caption>}
          
          <TableHeader>
            <TableRow>
              {/* Selection column */}
              {selectable && (
                <TableHead className="w-12">
                  {selectionMode === "multiple" && (
                    <Checkbox
                      checked={selectedRows.length === data.length && data.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  )}
                </TableHead>
              )}
              
              {/* Data columns */}
              {visibleColumns.map((column) => (
                <TableHeaderCell
                  key={column.id}
                  column={column}
                  sort={sort}
                  onSort={handleSort}
                />
              ))}
              
              {/* Actions column */}
              {hasActions && (
                <TableHead className="w-24 text-right">
                  {showColumnToggle && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {columns.filter(col => col.hideable !== false).map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={columnVisibility[column.id] !== false}
                            onCheckedChange={(checked) =>
                              setColumnVisibility(prev => ({ ...prev, [column.id]: checked }))
                            }
                          >
                            {column.header}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                className={cn(
                  onRowClick && "cursor-pointer",
                  selectedRows.includes(index) && "bg-blue-50"
                )}
                onClick={() => onRowClick?.(row, index)}
              >
                {/* Selection cell */}
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(index)}
                      onCheckedChange={(checked: boolean) => handleRowSelect(index, checked)}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </TableCell>
                )}
                
                {/* Data cells */}
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sticky === "left" && "sticky left-0 bg-white",
                      column.sticky === "right" && "sticky right-0 bg-white"
                    )}
                  >
                    {renderCell(column, row, index)}
                  </TableCell>
                ))}
                
                {/* Actions cell */}
                {hasActions && (
                  <TableCell className="text-right">
                    <TableRowActions
                      actions={actions}
                      row={row}
                      index={index}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;