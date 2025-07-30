import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ReadOnlyFieldProps {
  /** Field label */
  label: string;
  /** Field value to display */
  value: string | number | null | undefined;
  /** Optional description or help text */
  description?: string;
  /** Custom value renderer */
  renderValue?: (value: string | number | null | undefined) => ReactNode;
  /** Whether to show a border around the field */
  bordered?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Value className */
  valueClassName?: string;
}

export function ReadOnlyField({
  label,
  value,
  description,
  renderValue,
  bordered = false,
  className,
  valueClassName,
}: ReadOnlyFieldProps) {
  const displayValue = renderValue ? renderValue(value) : (value ?? "—");
  
  return (
    <div className={cn(
      "space-y-1",
      bordered && "p-3 border border-gray-200 rounded-md bg-gray-50",
      className
    )}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className={cn(
        "text-sm text-gray-900",
        bordered ? "text-gray-600" : "font-medium",
        valueClassName
      )}>
        {displayValue}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

export default ReadOnlyField;