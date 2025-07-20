import type { ReactNode } from "react";
import SearchInput from "./search-input";

interface ResourceListLayoutProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Action button for creating new resources */
  createAction?: ReactNode;
  /** Current search value */
  searchValue?: string | undefined;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Main content area */
  children: ReactNode;
  /** Additional content between header and search */
  headerExtra?: ReactNode;
  /** Additional content between search and main content */
  filterExtra?: ReactNode;
  /** Whether to show the search input */
  showSearch?: boolean;
}

export function ResourceListLayout({
  title,
  description,
  createAction,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  children,
  headerExtra,
  filterExtra,
  showSearch = true,
}: ResourceListLayoutProps) {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {createAction}
      </div>

      {headerExtra}

      {(showSearch || filterExtra) && (
        <div className="space-y-4">
          {showSearch && searchValue !== undefined && onSearchChange && (
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}
          {filterExtra}
        </div>
      )}

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export default ResourceListLayout;