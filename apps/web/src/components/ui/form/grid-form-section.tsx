import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridFormSectionProps {
  /** Number of columns */
  columns: 1 | 2 | 3 | 4;
  /** Child form fields */
  children: ReactNode;
  /** Gap between grid items */
  gap?: "sm" | "md" | "lg";
  /** Responsive breakpoint for grid columns */
  responsive?: "sm" | "md" | "lg" | "xl";
  /** Additional className */
  className?: string;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-6", 
  lg: "gap-8",
} as const;

const responsiveClasses = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
} as const;

export function GridFormSection({
  columns,
  children,
  gap = "md",
  responsive = "md",
  className,
  title,
  description,
}: GridFormSectionProps) {
  const gridClassName = cn(
    "grid grid-cols-1",
    `${responsiveClasses[responsive]}grid-cols-${columns}`,
    gapClasses[gap],
    className
  );

  return (
    <div className="space-y-4">
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      
      <div className={gridClassName}>
        {children}
      </div>
    </div>
  );
}

export default GridFormSection;